import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineViewGrid, HiOutlineBriefcase, HiOutlineSearchCircle,
  HiOutlineChartBar, HiOutlineDocumentText, HiOutlineCog,
  HiOutlineSparkles, HiOutlineLightningBolt
} from 'react-icons/hi';

const navItems = [
  { path: '/', icon: HiOutlineViewGrid, label: 'Dashboard' },
  { path: '/jobs', icon: HiOutlineBriefcase, label: 'Jobs Pipeline' },
  { path: '/scraper', icon: HiOutlineSearchCircle, label: 'Job Scout' },
  { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
  { path: '/resume', icon: HiOutlineDocumentText, label: 'Resume Lab' },
  { path: '/settings', icon: HiOutlineCog, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={`fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col
          bg-dark-800/80 backdrop-blur-2xl border-r border-white/[0.06]
          transition-transform duration-300 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* ── Logo ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.06]">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-display font-bold text-lg">
              J
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-green animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight">JOBIFY</h1>
            <p className="text-[10px] text-white/40 font-medium tracking-widest uppercase">AI Automation</p>
          </div>
        </div>

        {/* ── Navigation ────────────────────────────────────── */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative
                ${isActive
                  ? 'text-white bg-white/[0.08]'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-primary-400 to-accent-500"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-400' : ''}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom Card ───────────────────────────────────── */}
        <div className="p-4">
          <div className="glass-card p-4 neon-border">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineLightningBolt className="w-4 h-4 text-neon-orange" />
              <span className="text-xs font-semibold text-white/80">Pro Feature</span>
            </div>
            <p className="text-[11px] text-white/40 mb-3">Connect OpenAI for smart resume tailoring</p>
            <button className="w-full py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 transition-all">
              <HiOutlineSparkles className="inline w-3.5 h-3.5 mr-1" />
              Enable AI
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
