import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSearch, HiOutlineFilter, HiOutlineViewGrid, HiOutlineViewList,
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineBookmark,
  HiOutlineExternalLink, HiOutlineDotsVertical, HiOutlineSparkles
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import ScoreRing from '../components/UI/ScoreRing';
import StatusBadge from '../components/UI/StatusBadge';
import PlatformBadge from '../components/UI/PlatformBadge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { fetchJobs, updateJobStatus } from '../services/api';
import { STATUSES, PLATFORMS } from '../utils/constants';

// Demo jobs fallback
const DEMO_JOBS = [
  { _id: '1', title: 'Senior React Developer', company: 'Google', location: 'Bangalore, India', salary: '₹25-45 LPA', platform: 'Glassdoor', status: 'Pending Approval', matchScore: 92, matchedSkills: ['React', 'TypeScript', 'Redux', 'Node.js', 'GraphQL'], missingSkills: ['GCP'], aiSummary: 'Excellent match! Your React and TypeScript expertise align perfectly.', jdText: 'Senior React Developer with 5+ years experience in React.js, TypeScript, Redux. Experience with GraphQL and CI/CD preferred.', postedDate: '2 days ago', createdAt: new Date().toISOString() },
  { _id: '2', title: 'Full Stack Engineer', company: 'Microsoft', location: 'Hyderabad, India', salary: '₹30-50 LPA', platform: 'LinkedIn', status: 'New', matchScore: 74, matchedSkills: ['React', 'Docker', 'Kubernetes', 'SQL'], missingSkills: ['C#', '.NET', 'Azure'], aiSummary: 'Good match. Strong frontend but needs .NET/Azure.', jdText: 'Full Stack Engineer for Azure team. React, C#, .NET, Azure required.', postedDate: '1 day ago', createdAt: new Date().toISOString() },
  { _id: '3', title: 'Frontend Developer', company: 'Zoho', location: 'Chennai, India', salary: '₹8-15 LPA', platform: 'Naukri', status: 'Applied', matchScore: 88, matchedSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Tailwind', 'REST'], missingSkills: [], aiSummary: 'Excellent match! All required skills present.', jdText: 'Frontend Developer proficient in JavaScript, React.js, Tailwind CSS.', postedDate: '3 days ago', appliedAt: '2026-03-07', createdAt: new Date().toISOString() },
  { _id: '4', title: 'SDE II - Frontend', company: 'Amazon', location: 'Bangalore, India', salary: '₹35-55 LPA', platform: 'Glassdoor', status: 'Pending Approval', matchScore: 81, matchedSkills: ['React', 'TypeScript', 'AWS', 'System Design'], missingSkills: ['A/B Testing'], aiSummary: 'Strong match! Emphasize system design experience.', jdText: 'SDE II Frontend with React, TypeScript, AWS, and System Design expertise.', postedDate: '1 day ago', createdAt: new Date().toISOString() },
  { _id: '5', title: 'React Native Developer', company: 'Flipkart', location: 'Bangalore, India', salary: '₹20-35 LPA', platform: 'LinkedIn', status: 'Approved', matchScore: 68, matchedSkills: ['JavaScript', 'Redux', 'REST', 'Firebase'], missingSkills: ['Native Android', 'Native iOS'], aiSummary: 'Good match for mobile development.', jdText: 'React Native developer for next-gen mobile experience.', postedDate: '4 days ago', createdAt: new Date().toISOString() },
  { _id: '6', title: 'Python Developer', company: 'Infosys', location: 'Pune, India', salary: '₹10-18 LPA', platform: 'Naukri', status: 'Rejected', matchScore: 55, matchedSkills: ['Python', 'Docker'], missingSkills: ['Django', 'Flask', 'TensorFlow'], aiSummary: 'Moderate match. Needs backend framework exp.', jdText: 'Python Developer with Django, Flask, Docker experience.', postedDate: '2 days ago', createdAt: new Date().toISOString() },
  { _id: '7', title: 'SDE I', company: 'TCS', location: 'Coimbatore, India', salary: '₹6-10 LPA', platform: 'Unstop', status: 'New', matchScore: 45, matchedSkills: ['REST', 'MySQL'], missingSkills: ['Java', 'Spring Boot'], aiSummary: 'Partial match. Java-focused role.', jdText: 'Java developer with Spring Boot and Microservices.', postedDate: '5 days ago', createdAt: new Date().toISOString() },
  { _id: '8', title: 'Frontend Engineer', company: 'Stripe', location: 'Remote', salary: '$120-180K', platform: 'Glassdoor', status: 'Bookmarked', matchScore: 85, matchedSkills: ['React', 'TypeScript', 'GraphQL', 'CSS'], missingSkills: ['Storybook'], aiSummary: 'Excellent opportunity! Great fit.', jdText: 'Build beautiful payment UIs with React, TypeScript, GraphQL.', postedDate: '6 hours ago', createdAt: new Date().toISOString() },
  { _id: '9', title: 'MERN Stack Developer', company: 'Wipro', location: 'Coimbatore', salary: '₹7-14 LPA', platform: 'Naukri', status: 'Applying', matchScore: 90, matchedSkills: ['MongoDB', 'Express', 'React', 'Node.js', 'Git'], missingSkills: [], aiSummary: 'Perfect MERN match!', jdText: 'MERN Stack Developer with MongoDB, Express, React, Node.js.', postedDate: '4 days ago', createdAt: new Date().toISOString() },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { loadJobs(); }, [statusFilter, platformFilter, search]);

  const loadJobs = async () => {
    try {
      const res = await fetchJobs({ status: statusFilter, platform: platformFilter, search, sort: 'newest' });
      setJobs(res.data.data);
    } catch {
      setJobs(DEMO_JOBS.filter(j => {
        if (statusFilter !== 'All' && j.status !== statusFilter) return false;
        if (platformFilter !== 'All' && j.platform !== platformFilter) return false;
        if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJobStatus(jobId, newStatus);
      toast.success(`Job ${newStatus.toLowerCase()}`);
      loadJobs();
      if (selectedJob?._id === jobId) setSelectedJob(prev => ({ ...prev, status: newStatus }));
    } catch {
      // Demo mode: update local state
      setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
      toast.success(`Job ${newStatus.toLowerCase()}`);
    }
  };

  const filteredJobs = jobs;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Jobs <span className="gradient-text">Pipeline</span></h1>
          <p className="text-white/40 mt-1">{filteredJobs.length} jobs in your pipeline</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/60'}`}>
            <HiOutlineViewGrid className="w-5 h-5" />
          </button>
          <button onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/60'}`}>
            <HiOutlineViewList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Filters Bar ───────────────────────────────────── */}
      <div className="glass-card p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search jobs, companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glass pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === s ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.06]'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['All', ...PLATFORMS].map(p => (
              <button key={p} onClick={() => setPlatformFilter(p)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  platformFilter === p ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30' : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.06]'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading jobs..." />
      ) : filteredJobs.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] flex items-center justify-center">
            <HiOutlineSearch className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-white/60">No jobs found</h3>
          <p className="text-sm text-white/30 mt-1">Try adjusting your filters or start a new scrape</p>
        </div>
      ) : (
        <>
          {/* ── Grid View ──────────────────────────────────── */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredJobs.map((job, i) => (
                  <motion.div
                    key={job._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.05 } }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setSelectedJob(job)}
                    className="glass-card-hover p-5 group cursor-pointer"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center text-lg font-bold text-white/60 border border-white/[0.06]">
                          {job.company?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1">{job.title}</h3>
                          <p className="text-xs text-white/40">{job.company}</p>
                        </div>
                      </div>
                      <ScoreRing score={job.matchScore} size={44} strokeWidth={3} />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <PlatformBadge platform={job.platform} />
                      <StatusBadge status={job.status} />
                      {job.salary && <span className="text-[11px] text-white/40 bg-white/[0.04] px-2 py-1 rounded-lg">{job.salary}</span>}
                    </div>

                    {/* Location & Date */}
                    <div className="flex items-center justify-between text-xs text-white/30 mb-3">
                      <span>📍 {job.location}</span>
                      <span>{job.postedDate || 'Recently'}</span>
                    </div>

                    {/* Skills */}
                    {job.matchedSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.matchedSkills.slice(0, 4).map(s => (
                          <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neon-green/10 text-neon-green border border-neon-green/20">{s}</span>
                        ))}
                        {job.matchedSkills.length > 4 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] text-white/40 bg-white/[0.04]">+{job.matchedSkills.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* AI Summary */}
                    {job.aiSummary && (
                      <p className="text-xs text-white/30 line-clamp-2 mb-3 italic">
                        <HiOutlineSparkles className="inline w-3 h-3 text-primary-400 mr-1" />
                        {job.aiSummary}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
                      {['New', 'Pending Approval', 'Bookmarked'].includes(job.status) && (
                        <button onClick={(e) => { e.stopPropagation(); handleStatusChange(job._id, 'Approved'); }}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-colors flex items-center justify-center gap-1">
                          <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                      {['New', 'Pending Approval'].includes(job.status) && (
                        <button onClick={(e) => { e.stopPropagation(); handleStatusChange(job._id, 'Rejected'); }}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-neon-pink/10 text-neon-pink hover:bg-neon-pink/20 transition-colors flex items-center justify-center gap-1">
                          <HiOutlineXCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleStatusChange(job._id, 'Bookmarked'); }}
                        className="py-1.5 px-3 rounded-lg text-xs bg-white/[0.04] text-white/40 hover:bg-white/[0.08] transition-colors">
                        <HiOutlineBookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* ── List View ──────────────────────────────────── */
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Job', 'Company', 'Platform', 'Score', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job, i) => (
                      <motion.tr key={job._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: i * 0.03 } }}
                        onClick={() => setSelectedJob(job)}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-white">{job.title}</p>
                          <p className="text-xs text-white/30">📍 {job.location}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/60">{job.company}</td>
                        <td className="px-4 py-3"><PlatformBadge platform={job.platform} /></td>
                        <td className="px-4 py-3"><ScoreRing score={job.matchScore} size={36} strokeWidth={2.5} /></td>
                        <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); handleStatusChange(job._id, 'Approved'); }}
                              className="p-1.5 rounded-lg text-neon-green/60 hover:bg-neon-green/10 transition-colors">
                              <HiOutlineCheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleStatusChange(job._id, 'Rejected'); }}
                              className="p-1.5 rounded-lg text-neon-pink/60 hover:bg-neon-pink/10 transition-colors">
                              <HiOutlineXCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Job Detail Slide-over ──────────────────────────── */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setSelectedJob(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg z-50 bg-dark-800/95 backdrop-blur-2xl border-l border-white/[0.06] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">{selectedJob.title}</h2>
                    <p className="text-white/50 mt-1">{selectedJob.company} • {selectedJob.location}</p>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="p-2 rounded-xl hover:bg-white/[0.06]">✕</button>
                </div>

                {/* Score & Status */}
                <div className="flex items-center gap-4">
                  <ScoreRing score={selectedJob.matchScore} size={64} strokeWidth={4} />
                  <div>
                    <p className="text-lg font-bold text-white">{selectedJob.matchScore}% Match</p>
                    <StatusBadge status={selectedJob.status} />
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Platform', value: selectedJob.platform },
                    { label: 'Salary', value: selectedJob.salary || 'Not disclosed' },
                    { label: 'Posted', value: selectedJob.postedDate || 'Recently' },
                    { label: 'Type', value: selectedJob.jobType || 'Full-time' },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium text-white mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* AI Summary */}
                {selectedJob.aiSummary && (
                  <div className="p-4 rounded-xl bg-primary-600/10 border border-primary-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <HiOutlineSparkles className="w-4 h-4 text-primary-400" />
                      <span className="text-xs font-semibold text-primary-400">AI Analysis</span>
                    </div>
                    <p className="text-sm text-white/70">{selectedJob.aiSummary}</p>
                  </div>
                )}

                {/* Matched Skills */}
                {selectedJob.matchedSkills?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Matched Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.matchedSkills.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neon-green/10 text-neon-green border border-neon-green/20">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {selectedJob.missingSkills?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Skills to Develop</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.missingSkills.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neon-pink/10 text-neon-pink border border-neon-pink/20">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                <div>
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Job Description</h4>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-sm text-white/60 leading-relaxed max-h-60 overflow-y-auto">
                    {selectedJob.jdText || 'No description available'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
                  <button onClick={() => handleStatusChange(selectedJob._id, 'Approved')}
                    className="btn-success flex-1 flex items-center justify-center gap-2">
                    <HiOutlineCheckCircle className="w-4 h-4" /> Approve & Apply
                  </button>
                  <button onClick={() => handleStatusChange(selectedJob._id, 'Rejected')}
                    className="btn-danger flex items-center justify-center gap-2 px-4">
                    <HiOutlineXCircle className="w-4 h-4" />
                  </button>
                  {selectedJob.applyUrl && (
                    <a href={selectedJob.applyUrl} target="_blank" rel="noopener noreferrer"
                      className="btn-ghost flex items-center justify-center gap-2 px-4">
                      <HiOutlineExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
