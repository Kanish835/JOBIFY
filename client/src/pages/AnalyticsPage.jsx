import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineBriefcase, HiOutlineSparkles } from 'react-icons/hi';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { fetchAnalytics } from '../services/api';

const CHART_COLORS = ['#5c7cfa', '#e64980', '#30d158', '#ff9f0a', '#bf5af2', '#00f5ff', '#ff2d55'];

const DEMO_ANALYTICS = {
  summary: { totalJobs: 147, applied: 45, pending: 41, rejected: 8, avgMatchScore: 72, successRate: 31 },
  platformBreakdown: [
    { _id: 'Glassdoor', count: 42, applied: 18 },
    { _id: 'LinkedIn', count: 58, applied: 15 },
    { _id: 'Naukri', count: 31, applied: 8 },
    { _id: 'Unstop', count: 16, applied: 4 },
  ],
  dailyApplications: Array.from({ length: 14 }, (_, i) => ({
    _id: `Mar ${i + 1}`,
    count: Math.floor(Math.random() * 8) + 1,
  })),
  topSkills: [
    { _id: 'React', count: 42 }, { _id: 'TypeScript', count: 38 }, { _id: 'Node.js', count: 35 },
    { _id: 'Python', count: 28 }, { _id: 'AWS', count: 22 }, { _id: 'Docker', count: 18 },
    { _id: 'MongoDB', count: 16 }, { _id: 'GraphQL', count: 15 }, { _id: 'Kubernetes', count: 12 },
    { _id: 'Redux', count: 11 }, { _id: 'SQL', count: 10 }, { _id: 'Git', count: 9 },
  ],
  topCompanies: [
    { _id: 'Google', count: 8, avgScore: 88 }, { _id: 'Microsoft', count: 6, avgScore: 72 },
    { _id: 'Amazon', count: 5, avgScore: 81 }, { _id: 'Zoho', count: 5, avgScore: 90 },
    { _id: 'Flipkart', count: 4, avgScore: 68 }, { _id: 'TCS', count: 4, avgScore: 45 },
  ],
  matchScoreDistribution: [
    { _id: 0, count: 5 }, { _id: 20, count: 12 }, { _id: 40, count: 28 },
    { _id: 60, count: 45 }, { _id: 80, count: 38 }, { _id: 100, count: 19 },
  ],
  weeklyTrend: Array.from({ length: 8 }, (_, i) => ({
    _id: `W${i + 1}`,
    scraped: Math.floor(Math.random() * 30) + 15,
    applied: Math.floor(Math.random() * 12) + 3,
  })),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await fetchAnalytics();
      setData(res.data.data);
    } catch {
      setData(DEMO_ANALYTICS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading analytics..." />;

  const d = data || DEMO_ANALYTICS;
  const s = d.summary;

  const summaryCards = [
    { label: 'Total Scraped', value: s.totalJobs, color: 'from-primary-500 to-blue-600', icon: HiOutlineBriefcase },
    { label: 'Applied', value: s.applied, color: 'from-neon-green to-emerald-600', icon: HiOutlineTrendingUp },
    { label: 'Success Rate', value: s.successRate, suffix: '%', color: 'from-neon-cyan to-blue-400', icon: HiOutlineChartBar },
    { label: 'Avg Match', value: s.avgMatchScore, suffix: '%', color: 'from-accent-500 to-pink-600', icon: HiOutlineSparkles },
  ];

  const scoreLabels = ['0-19', '20-39', '40-59', '60-79', '80-99', '100'];
  const scoreData = d.matchScoreDistribution?.map((item, i) => ({ range: scoreLabels[i] || `${item._id}+`, count: item.count })) || [];

  const radarData = d.topSkills?.slice(0, 8).map(s => ({ skill: s._id, demand: s.count, max: 50 })) || [];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-display font-bold">Analytics <span className="gradient-text">Hub</span></h1>
        <p className="text-white/40 mt-1">Track your job search performance and market insights</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c, i) => (
          <motion.div key={c.label} variants={item} className="glass-card p-5 group hover:border-white/[0.12] transition-all">
            <div className="flex items-start justify-between">
              <p className="text-[11px] text-white/40 uppercase tracking-wider">{c.label}</p>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${c.color} opacity-70`}>
                <c.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold mt-2">
              <CountUp end={c.value} duration={2} delay={i * 0.15} />{c.suffix || ''}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Weekly Trend + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="glass-card p-6 lg:col-span-2">
          <h3 className="font-display font-semibold mb-1">Weekly Trend</h3>
          <p className="text-xs text-white/40 mb-4">Scraped vs Applied per week</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={d.weeklyTrend}>
              <defs>
                <linearGradient id="aScraped" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aApplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#30d158" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#30d158" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="_id" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }} />
              <Area type="monotone" dataKey="scraped" stroke="#5c7cfa" strokeWidth={2} fill="url(#aScraped)" name="Scraped" />
              <Area type="monotone" dataKey="applied" stroke="#30d158" strokeWidth={2} fill="url(#aApplied)" name="Applied" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-1">Skill Radar</h3>
          <p className="text-xs text-white/40 mb-2">Most demanded skills</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <Radar name="Demand" dataKey="demand" stroke="#5c7cfa" fill="#5c7cfa" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 2: Score Distribution + Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-1">Match Score Distribution</h3>
          <p className="text-xs text-white/40 mb-4">How well your profile matches scraped jobs</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scoreData}>
              <XAxis dataKey="range" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={30}>
                {scoreData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-1">Platform Performance</h3>
          <p className="text-xs text-white/40 mb-4">Jobs scraped & applied by platform</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d.platformBreakdown} layout="vertical">
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="_id" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }} />
              <Bar dataKey="count" fill="#5c7cfa" radius={[0, 4, 4, 0]} barSize={14} name="Scraped" />
              <Bar dataKey="applied" fill="#30d158" radius={[0, 4, 4, 0]} barSize={14} name="Applied" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 3: Top Skills + Top Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Top Skills in Demand</h3>
          <div className="space-y-2.5">
            {d.topSkills?.slice(0, 10).map((skill, i) => {
              const maxCount = d.topSkills[0]?.count || 1;
              const percentage = (skill.count / maxCount) * 100;
              return (
                <div key={skill._id} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white/70">{skill._id}</span>
                    <span className="text-xs text-white/40">{skill.count} jobs</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: i * 0.08 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[(i + 1) % CHART_COLORS.length]})` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Top Companies</h3>
          <div className="space-y-3">
            {d.topCompanies?.map((company, i) => (
              <div key={company._id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center text-sm font-bold text-white/50 border border-white/[0.06]">
                    {company._id?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{company._id}</p>
                    <p className="text-[11px] text-white/30">{company.count} openings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${company.avgScore >= 70 ? 'text-neon-green' : company.avgScore >= 50 ? 'text-neon-orange' : 'text-neon-pink'}`}>
                    {Math.round(company.avgScore)}%
                  </p>
                  <p className="text-[10px] text-white/30">avg match</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
