import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String, default: '' },

  // Master Resume (structured JSON)
  masterResume: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    summary: { type: String, default: '' },
    skills: [{
      category: { type: String },
      items: [{ type: String }]
    }],
    experience: [{
      title: { type: String },
      company: { type: String },
      location: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      current: { type: Boolean, default: false },
      description: { type: String },
      highlights: [{ type: String }]
    }],
    education: [{
      degree: { type: String },
      institution: { type: String },
      year: { type: String },
      gpa: { type: String }
    }],
    projects: [{
      name: { type: String },
      description: { type: String },
      techStack: [{ type: String }],
      url: { type: String }
    }],
    certifications: [{ type: String }],
    languages: [{ type: String }]
  },

  // Scraping preferences
  searchPreferences: {
    jobTitles: [{ type: String }],
    locations: [{ type: String }],
    experienceLevel: { type: String, default: '' },
    minSalary: { type: Number, default: 0 },
    platforms: {
      type: [String],
      default: ['Glassdoor', 'LinkedIn', 'Naukri', 'Unstop']
    }
  },

  // Encrypted session cookies (for auto-apply)
  platformSessions: {
    linkedin: { type: String, default: '' },
    naukri: { type: String, default: '' },
    glassdoor: { type: String, default: '' },
    unstop: { type: String, default: '' }
  },

  // Settings
  settings: {
    autoApproveAboveScore: { type: Number, default: 0 },
    dailyApplicationLimit: { type: Number, default: 20 },
    enableCronScraping: { type: Boolean, default: true },
    cronSchedule: { type: String, default: '0 7 * * *' }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
