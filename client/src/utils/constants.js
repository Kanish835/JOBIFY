export const PLATFORMS = ['Glassdoor', 'LinkedIn', 'Naukri', 'Unstop'];
export const STATUSES = ['All', 'New', 'Pending Approval', 'Approved', 'Applying', 'Applied', 'Rejected', 'Bookmarked'];
export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid'];

export const PLATFORM_COLORS = {
  Glassdoor: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', hex: '#30d158' },
  LinkedIn: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', hex: '#0a84ff' },
  Naukri: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', hex: '#bf5af2' },
  Unstop: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', hex: '#ff9f0a' },
};

export const STATUS_CONFIG = {
  'New': { color: 'badge-new', icon: '✦', label: 'New' },
  'Analyzing': { color: 'badge-pending', icon: '⚡', label: 'Analyzing' },
  'Pending Approval': { color: 'badge-pending', icon: '⏳', label: 'Pending' },
  'Approved': { color: 'badge-approved', icon: '✓', label: 'Approved' },
  'Applying': { color: 'badge-applied', icon: '🔄', label: 'Applying' },
  'Applied': { color: 'badge-applied', icon: '✈', label: 'Applied' },
  'Rejected': { color: 'badge-rejected', icon: '✕', label: 'Rejected' },
  'Failed': { color: 'badge-rejected', icon: '!', label: 'Failed' },
  'Bookmarked': { color: 'badge-bookmarked', icon: '★', label: 'Saved' },
};

export const SCORE_COLORS = (score) => {
  if (score >= 80) return { ring: '#30d158', bg: 'bg-neon-green/10', text: 'text-neon-green' };
  if (score >= 60) return { ring: '#0a84ff', bg: 'bg-neon-blue/10', text: 'text-neon-blue' };
  if (score >= 40) return { ring: '#ff9f0a', bg: 'bg-neon-orange/10', text: 'text-neon-orange' };
  return { ring: '#ff2d55', bg: 'bg-neon-pink/10', text: 'text-neon-pink' };
};
