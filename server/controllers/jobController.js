import Job from '../models/Job.js';

// GET /api/jobs - List all jobs with filters
export const getJobs = async (req, res) => {
  try {
    const { status, platform, search, sort, page = 1, limit = 50, minScore } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (platform && platform !== 'All') query.platform = platform;
    if (minScore) query.matchScore = { $gte: parseInt(minScore) };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { jdText: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'match-high': { matchScore: -1 },
      'match-low': { matchScore: 1 },
      company: { company: 1 },
    };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/jobs/:id - Single job detail
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PATCH /api/jobs/:id/status - Update job status (Approve/Reject)
export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Analyzing', 'Pending Approval', 'Approved', 'Applying', 'Applied', 'Rejected', 'Failed', 'Bookmarked'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'Applied' && { appliedAt: new Date() }),
      },
      { new: true }
    );

    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PATCH /api/jobs/:id - Update job data
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/jobs/bulk-action
export const bulkAction = async (req, res) => {
  try {
    const { ids, action } = req.body;
    if (!ids?.length) return res.status(400).json({ success: false, error: 'No IDs provided' });

    if (action === 'delete') {
      await Job.deleteMany({ _id: { $in: ids } });
    } else {
      await Job.updateMany({ _id: { $in: ids } }, { status: action });
    }

    res.json({ success: true, message: `${action} applied to ${ids.length} jobs` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/jobs/stats/overview
export const getJobStats = async (req, res) => {
  try {
    const [statusCounts, platformCounts, recentJobs, dailyStats] = await Promise.all([
      Job.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Job.aggregate([{ $group: { _id: '$platform', count: { $sum: 1 } } }]),
      Job.find().sort({ createdAt: -1 }).limit(5).select('title company platform status matchScore createdAt'),
      Job.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            applied: { $sum: { $cond: [{ $eq: ['$status', 'Applied'] }, 1, 0] } },
            avgScore: { $avg: '$matchScore' }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 30 }
      ]),
    ]);

    const totalJobs = await Job.countDocuments();
    const avgMatchScore = await Job.aggregate([{ $group: { _id: null, avg: { $avg: '$matchScore' } } }]);

    // Top skills in demand
    const skillsInDemand = await Job.aggregate([
      { $unwind: '$matchedSkills' },
      { $group: { _id: '$matchedSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalJobs,
        avgMatchScore: Math.round(avgMatchScore[0]?.avg || 0),
        statusCounts: Object.fromEntries(statusCounts.map(s => [s._id, s.count])),
        platformCounts: Object.fromEntries(platformCounts.map(p => [p._id, p.count])),
        recentJobs,
        dailyStats: dailyStats.reverse(),
        skillsInDemand,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
