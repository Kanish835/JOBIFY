import { useState } from 'react';
import { HiOutlineMenuAlt2, HiOutlineBell, HiOutlineSearch, HiOutlineUser } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onToggleSidebar }) {
  const [showSearch, setShowSearch] = useState(false);
  const [notifications] = useState(3);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 border-b border-white/[0.06] bg-dark-900/60 backdrop-blur-xl">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <HiOutlineMenuAlt2 className="w-5 h-5 text-white/70" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search jobs, companies..."
              className="w-80 pl-10 pr-4 py-2 rounded-xl text-sm bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-white/30 outline-none focus:bg-white/[0.06] focus:border-primary-500/40 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20 bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Mobile search */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="md:hidden p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <HiOutlineSearch className="w-5 h-5 text-white/70" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/[0.06] transition-colors">
          <HiOutlineBell className="w-5 h-5 text-white/70" />
          {notifications > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-accent-500 text-[9px] font-bold"
            >
              {notifications}
            </motion.span>
          )}
        </button>

        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-[11px] font-medium text-neon-green">System Online</span>
        </div>

        {/* Avatar */}
        <button className="flex items-center gap-2 p-1 pl-3 rounded-xl hover:bg-white/[0.06] transition-colors">
          <span className="hidden sm:block text-sm font-medium text-white/70">User</span>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <HiOutlineUser className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>

      {/* Mobile search dropdown */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 p-4 bg-dark-800/95 backdrop-blur-xl border-b border-white/[0.06] md:hidden"
          >
            <input
              type="text"
              placeholder="Search jobs, companies..."
              autoFocus
              className="input-glass"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
