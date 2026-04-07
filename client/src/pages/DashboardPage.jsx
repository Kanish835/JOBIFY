import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import {
  HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineClock,
  HiOutlineSparkles, HiOutlineTrendingUp, HiOutlineExternalLink,
  HiOutlineChartBar, HiOutlineLightningBolt
} from 'react-icons/hi';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatusBadge from '../components/UI/StatusBadge';
import ScoreRing from '../components/UI/ScoreRing';
import PlatformBadge from '../components/UI/PlatformBadge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { fetchJobStats } from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// Demo data for when server is not connected
const DEMO_STATS = {
  totalJobs: 147,
  avgMatchScore: 72,
  statusCounts: { 'New': 23, 'Pending Approval': 18, 'Approved': 12, 'Applied': 45, 'Rejected': 8, 'Bookmarked': 6, 'Applying': 3 },
  platformCounts: { Glassdoor: 42, LinkedIn: 58, Naukri: 31, Unstop: 16 },
  recentJobs: [
    { _id: '1', title: 'Senior React Developer', company: 'Google', platform: 'Glassdoor', status: 'Pending Approval', matchScore: 92, createdAt: new Date().toISOString() },
    { _id: '2', title: 'Full Stack Engineer', company: 'Microsoft', platform: 'LinkedIn', status: 'New', matchScore: 74, createdAt: new Date().toISOString() },
    { _id: '3', title: 'Frontend Developer', company: 'Zoho', platform: 'Naukri', status: 'Applied', matchScore: 88, createdAt: new Date().toISOString() },
    { _id: '4', title: 'SDE II - Frontend', company: 'Amazon', platform: 'Glassdoor', status: 'Approved', matchScore: 81, createdAt: new Date().toISOString() },
    { _id: '5', title: 'MERN Stack Developer', company: 'Wipro', platform: 'Naukri', status: 'Applying', matchScore: 90, createdAt: new Date().toISOString() },
  ],
  dailyStats: Array.from({ length: 14 }, (_, i) => ({
    _id: `2026-03-${String(i + 1).padStart(2, '0')}`,
    count: Math.floor(Math.random() * 15) + 5,
    applied: Math.floor(Math.random() * 8) + 1,
    avgScore: Math.floor(Math.random() * 30) + 55
  })),
  skillsInDemand: [
    { _id: 'React', count: 42 }, { _id: 'TypeScript', count: 38 }, { _id: 'Node.js', count: 35 },
    { _id: 'Python', count: 28 }, { _id: 'AWS', count: 22 }, { _id: 'Docker', count: 18 },
    { _id: 'GraphQL', count: 15 }, { _id: 'MongoDB', count: 14 }, { _id: 'Kubernetes', count: 12 }, { _id: 'Redux', count: 11 }
  ]
};

const CHART_COLORS = ['#5c7cfa', '#e64980', '#30d158', '#ff9f0a', '#bf5af2', '#00f5ff'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetchJobStats();
      setStats(res.data.data);
    } catch {
      setStats(DEMO_STATS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading dashboard..." />;

  const data = stats || DEMO_STATS;
  const statCards = [
    { label: 'Total Jobs Scraped', value: data.totalJobs, icon: HiOutlineBriefcase, color: 'from-primary-500 to-blue-600', glow: 'shadow-neon-blue' },
    { label: 'Applications Sent', value: data.statusCounts?.Applied || 0, icon: HiOutlineCheckCircle, color: 'from-neon-green to-emerald-600', glow: 'shadow-neon-green' },
    { label: 'Pending Review', value: (data.statusCounts?.['Pending Approval'] || 0) + (data.statusCounts?.New || 0), icon: HiOutlineClock, color: 'from-neon-orange to-amber-600', glow: '' },
    { label: 'Avg Match Score', value: data.avgMatchScore, icon: HiOutlineSparkles, color: 'from-accent-500 to-pink-600', glow: 'shadow-neon-pink', suffix: '%' },
  ];

  const platformData = Object.entries(data.platformCounts || {}).map(([name, value]) => ({ name, value }));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">
            Welcome back <span className="gradient-text">!</span>
          </h1>
          <p className="text-white/40 mt-1">Here's your job hunting command center</p>
        </div>
        <div className="flex gap-3">
          <Link to="/scraper" className="btn-primary flex items-center gap-2">
            <HiOutlineLightningBolt className="w-4 h-4" /> Start Scraping
          </Link>
          <Link to="/analytics" className="btn-ghost flex items-center gap-2">
            <HiOutlineChartBar className="w-4 h-4" /> Analytics
          </Link>
        </div>
      </motion.div>

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} variants={itemVariants} className="glass-card-hover p-5 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-display font-bold mt-2 text-white">
                  <CountUp end={stat.value} duration={2} delay={i * 0.2} />
                  {stat.suffix || ''}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-neon-green">
              <HiOutlineTrendingUp className="w-3.5 h-3.5" />
              <span>+12% this week</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily Activity Chart */}
        <motion.div variants={itemVariants} className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-white">Daily Activity</h3>
              <p className="text-xs text-white/40 mt-0.5">Jobs scraped vs applied over time</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary-500" /> Scraped</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-green" /> Applied</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.dailyStats}>
              <defs>
                <linearGradient id="colorScraped" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#30d158" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#30d158" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="_id" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(val) => val?.split('-').pop() || ''} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', backdropFilter: 'blur(20px)' }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="count" stroke="#5c7cfa" strokeWidth={2} fill="url(#colorScraped)" name="Scraped" />
              <Area type="monotone" dataKey="applied" stroke="#30d158" strokeWidth={2} fill="url(#colorApplied)" name="Applied" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Platform Distribution */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h3 className="font-display font-semibold text-white mb-1">Platform Mix</h3>
          <p className="text-xs text-white/40 mb-4">Jobs by source</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={platformData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3} stroke="none">
                {platformData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {platformData.map((p, i) => (
              <span key={p.name} className="flex items-center gap-1.5 text-[11px] text-white/60">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                {p.name} ({p.value})
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Skills in Demand + Recent Jobs ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Skills Chart */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h3 className="font-display font-semibold text-white mb-1">Top Skills in Demand</h3>
          <p className="text-xs text-white/40 mb-4">Most requested across all scraped jobs</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.skillsInDemand} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="_id" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                {data.skillsInDemand?.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Jobs */}
        <motion.div variants={itemVariants} className="glass-card p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-white">Recent Jobs</h3>
              <p className="text-xs text-white/40 mt-0.5">Latest scraped opportunities</p>
            </div>
            <Link to="/jobs" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              View All <HiOutlineExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {data.recentJobs?.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ScoreRing score={job.matchScore} size={40} strokeWidth={3} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{job.title}</p>
                    <p className="text-xs text-white/40 truncate">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <PlatformBadge platform={job.platform} />
                  <StatusBadge status={job.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
