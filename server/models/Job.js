import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: { type: String, unique: true, required: true },
  title: { type: String, required: true, index: true },
  company: { type: String, required: true, index: true },
  location: { type: String, default: 'Not specified' },
  salary: { type: String, default: '' },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid', ''], default: '' },
  platform: { type: String, enum: ['LinkedIn', 'Glassdoor', 'Naukri', 'Unstop'], required: true, index: true },
  jdText: { type: String, default: '' },
  jdHtml: { type: String, default: '' },
  applyUrl: { type: String, default: '' },
  companyLogo: { type: String, default: '' },
  postedDate: { type: String, default: '' },
  experienceRequired: { type: String, default: '' },

  // AI Analysis
  matchScore: { type: Number, default: 0, min: 0, max: 100 },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  aiSummary: { type: String, default: '' },

  // Pipeline Status
  status: {
    type: String,
    enum: ['New', 'Analyzing', 'Pending Approval', 'Approved', 'Applying', 'Applied', 'Rejected', 'Failed', 'Bookmarked'],
    default: 'New',
    index: true
  },

  // Resume
  tailoredResumeUrl: { type: String, default: '' },
  tailoredResumeData: { type: mongoose.Schema.Types.Mixed, default: null },

  // Application tracking
  appliedAt: { type: Date },
  applicationMethod: { type: String, enum: ['Auto-Apply', 'One-Click', 'Manual', ''], default: '' },

  // User reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for performance
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ platform: 1, status: 1 });
jobSchema.index({ matchScore: -1 });
jobSchema.index({ company: 'text', title: 'text', jdText: 'text' });

export default mongoose.model('Job', jobSchema);
