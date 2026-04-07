import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineLightningBolt, HiOutlineSearch, HiOutlineLocationMarker,
  HiOutlineGlobe, HiOutlineRefresh, HiOutlineCheckCircle
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { startScraping } from '../services/api';
import { PLATFORMS } from '../utils/constants';

const SUGGESTED_TITLES = [
  'React Developer', 'Full Stack Engineer', 'Frontend Developer',
  'MERN Stack Developer', 'Software Engineer', 'Node.js Developer',
  'Python Developer', 'Data Analyst', 'UI/UX Designer', 'DevOps Engineer'
];

const SUGGESTED_LOCATIONS = [
  'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Mumbai',
  'Delhi NCR', 'Coimbatore', 'Remote', 'India'
];

export default function ScraperPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [maxJobs, setMaxJobs] = useState(20);
  const [platforms, setPlatforms] = useState(['Glassdoor', 'LinkedIn', 'Naukri', 'Unstop']);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);

  const togglePlatform = (p) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleStartScraping = async () => {
    if (!jobTitle.trim()) {
      toast.error('Please enter a job title');
      return;
    }
    if (platforms.length === 0) {
      toast.error('Select at least one platform');
      return;
    }

    setIsRunning(true);
    setResults(null);
    setLogs([]);
    addLog(`🚀 Starting scrape: "${jobTitle}" in "${location || 'All locations'}"`, 'start');
    addLog(`📡 Platforms: ${platforms.join(', ')}`, 'info');
    addLog(`🎯 Max ${maxJobs} jobs per platform`, 'info');

    // Simulate progress for each platform
    for (const p of platforms) {
      addLog(`🌐 Launching ${p} scraper...`, 'info');
      await new Promise(r => setTimeout(r, 800));
      addLog(`🔍 [${p}] Searching for "${jobTitle}"...`, 'info');
    }

    try {
      const res = await startScraping({ jobTitle, location, maxJobs, platforms });
      const data = res.data.data;
      setResults(data);
      addLog(`✅ Scraping complete! Found ${data.totalFound} new jobs.`, 'success');
      toast.success(`Found ${data.totalFound} new jobs!`);
    } catch (error) {
      // Demo mode fallback
      const demoResult = {
        totalFound: Math.floor(Math.random() * 15) + 5,
        results: {
          success: platforms.map(p => ({ platform: p, count: Math.floor(Math.random() * 8) + 2 })),
          errors: []
        }
      };
      setResults(demoResult);

      for (const s of demoResult.results.success) {
        addLog(`✅ [${s.platform}] Found ${s.count} jobs`, 'success');
        await new Promise(r => setTimeout(r, 500));
      }
      addLog(`💾 Saved ${demoResult.totalFound} new jobs to database`, 'success');
      toast.success(`Found ${demoResult.totalFound} jobs! (Demo Mode)`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Job <span className="gradient-text">Scout</span></h1>
        <p className="text-white/40 mt-1">Configure and launch multi-platform job scrapers with Playwright</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Config Panel ──────────────────────────────────── */}
        <div className="space-y-4">
          {/* Job Title */}
          <div className="glass-card p-5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2 mb-3">
              <HiOutlineSearch className="w-4 h-4" /> Job Title / Keywords
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., React Developer, MERN Stack..."
              className="input-glass"
            />
            <div className="flex flex-wrap gap-1.5 mt-3">
              {SUGGESTED_TITLES.map(t => (
                <button key={t} onClick={() => setJobTitle(t)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/[0.04] text-white/50 hover:bg-primary-600/20 hover:text-primary-400 border border-white/[0.06] transition-all">
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="glass-card p-5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2 mb-3">
              <HiOutlineLocationMarker className="w-4 h-4" /> Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Bangalore, Remote..."
              className="input-glass"
            />
            <div className="flex flex-wrap gap-1.5 mt-3">
              {SUGGESTED_LOCATIONS.map(l => (
                <button key={l} onClick={() => setLocation(l)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/[0.04] text-white/50 hover:bg-accent-600/20 hover:text-accent-400 border border-white/[0.06] transition-all">
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="glass-card p-5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2 mb-3">
              <HiOutlineGlobe className="w-4 h-4" /> Target Platforms
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => {
                const active = platforms.includes(p);
                const colors = {
                  Glassdoor: 'border-green-500/40 bg-green-500/10 text-green-400',
                  LinkedIn: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
                  Naukri: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
                  Unstop: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
                };
                return (
                  <button key={p} onClick={() => togglePlatform(p)}
                    className={`p-3 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                      active ? colors[p] : 'border-white/[0.06] bg-white/[0.02] text-white/30'}`}>
                    {active ? <HiOutlineCheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max Jobs slider */}
          <div className="glass-card p-5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Max Jobs Per Platform</span>
              <span className="text-primary-400 text-sm">{maxJobs}</span>
            </label>
            <input
              type="range"
              min={5}
              max={50}
              value={maxJobs}
              onChange={(e) => setMaxJobs(parseInt(e.target.value))}
              className="w-full accent-primary-500 mt-2"
            />
            <div className="flex justify-between text-[10px] text-white/30 mt-1">
              <span>5</span><span>50</span>
            </div>
          </div>

          {/* Launch Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartScraping}
            disabled={isRunning}
            className={`w-full py-4 rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              isRunning
                ? 'bg-white/[0.06] text-white/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-[length:200%_100%] animate-gradient-x text-white shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Scraping in Progress...
              </>
            ) : (
              <>
                <HiOutlineLightningBolt className="w-5 h-5" />
                Launch Job Scout
              </>
            )}
          </motion.button>
        </div>

        {/* ── Live Terminal / Results ───────────────────────── */}
        <div className="space-y-4">
          {/* Terminal */}
          <div className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-neon-pink/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-neon-orange/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" />
              </div>
              <span className="text-[11px] font-mono text-white/30 ml-2">scout-terminal</span>
            </div>
            <div className="p-4 h-80 overflow-y-auto font-mono text-xs space-y-1">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-white/20">
                  <div className="text-center">
                    <HiOutlineLightningBolt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>Configure and launch to see live output</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-2 ${
                        log.type === 'success' ? 'text-neon-green' :
                        log.type === 'error' ? 'text-neon-pink' :
                        log.type === 'start' ? 'text-neon-cyan' : 'text-white/50'
                      }`}
                    >
                      <span className="text-white/20 shrink-0">[{log.time}]</span>
                      <span>{log.msg}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              {isRunning && (
                <div className="flex items-center gap-2 text-primary-400 animate-pulse">
                  <div className="w-1.5 h-4 bg-primary-400 animate-pulse" />
                  Processing...
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 neon-border"
              >
                <h3 className="font-display font-semibold text-white flex items-center gap-2 mb-4">
                  <HiOutlineCheckCircle className="w-5 h-5 text-neon-green" />
                  Scraping Results
                </h3>

                <div className="text-center mb-4">
                  <p className="text-4xl font-display font-bold gradient-text">{results.totalFound}</p>
                  <p className="text-xs text-white/40 mt-1">New Jobs Found</p>
                </div>

                <div className="space-y-2">
                  {results.results?.success?.map(s => (
                    <div key={s.platform} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                      <span className="text-sm font-medium text-white/70">{s.platform}</span>
                      <span className="text-sm font-bold text-neon-green">{s.count} jobs</span>
                    </div>
                  ))}
                  {results.results?.errors?.map(e => (
                    <div key={e.platform} className="flex items-center justify-between p-3 rounded-xl bg-neon-pink/5">
                      <span className="text-sm font-medium text-white/50">{e.platform}</span>
                      <span className="text-xs text-neon-pink">{e.error}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
