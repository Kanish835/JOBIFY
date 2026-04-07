import Job from '../models/Job.js';

// GET /api/analytics/overview
export const getAnalyticsOverview = async (req, res) => {
  try {
    const [
      totalJobs,
      appliedCount,
      pendingCount,
      rejectedCount,
      avgScore,
      platformBreakdown,
      dailyApplications,
      topSkills,
      topCompanies,
      matchScoreDistribution,
      weeklyTrend,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'Applied' }),
      Job.countDocuments({ status: 'Pending Approval' }),
      Job.countDocuments({ status: 'Rejected' }),
      Job.aggregate([{ $group: { _id: null, avg: { $avg: '$matchScore' } } }]),
      Job.aggregate([
        { $group: { _id: '$platform', count: { $sum: 1 }, applied: { $sum: { $cond: [{ $eq: ['$status', 'Applied'] }, 1, 0] } } } }
      ]),
      Job.aggregate([
        { $match: { status: 'Applied' } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$appliedAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
        { $limit: 30 }
      ]),
      Job.aggregate([
        { $unwind: '$matchedSkills' },
        { $group: { _id: '$matchedSkills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 }
      ]),
      Job.aggregate([
        { $group: { _id: '$company', count: { $sum: 1 }, avgScore: { $avg: '$matchScore' } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Job.aggregate([
        { $bucket: { groupBy: '$matchScore', boundaries: [0, 20, 40, 60, 80, 100, 101], default: 'N/A', output: { count: { $sum: 1 } } } },
      ]),
      Job.aggregate([
        { $group: { _id: { $dateToString: { format: '%Y-%W', date: '$createdAt' } }, scraped: { $sum: 1 }, applied: { $sum: { $cond: [{ $eq: ['$status', 'Applied'] }, 1, 0] } } } },
        { $sort: { _id: -1 } },
        { $limit: 12 }
      ]),
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalJobs,
          applied: appliedCount,
          pending: pendingCount,
          rejected: rejectedCount,
          avgMatchScore: Math.round(avgScore[0]?.avg || 0),
          successRate: totalJobs > 0 ? Math.round((appliedCount / totalJobs) * 100) : 0,
        },
        platformBreakdown,
        dailyApplications: dailyApplications.reverse(),
        topSkills,
        topCompanies,
        matchScoreDistribution,
        weeklyTrend: weeklyTrend.reverse(),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
