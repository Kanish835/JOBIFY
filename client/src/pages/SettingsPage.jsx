import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineCog, HiOutlineUser, HiOutlineKey, HiOutlineBell,
  HiOutlineSearch, HiOutlineClock, HiOutlineShieldCheck, HiOutlineSave,
  HiOutlineTrash, HiOutlinePlus
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const defaultSettings = {
  profile: { name: '', email: '' },
  apiKeys: { openai: '', gemini: '' },
  scraping: {
    jobTitles: ['Full Stack Developer', 'Frontend Developer', 'Backend Developer'],
    locations: ['Remote', 'Bangalore', 'Hyderabad'],
    platforms: { linkedin: true, glassdoor: true, naukri: true, unstop: true },
    maxJobsPerRun: 50,
    delayMin: 2000,
    delayMax: 5000,
  },
  automation: { autoApproveAbove: 85, dailyLimit: 20, cronSchedule: '0 7 * * *', enabled: false },
  notifications: { email: false, browser: true, onNewJobs: true, onApplied: true },
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const TABS = [
  { id: 'profile', label: 'Profile', icon: HiOutlineUser },
  { id: 'apikeys', label: 'API Keys', icon: HiOutlineKey },
  { id: 'scraping', label: 'Scraping', icon: HiOutlineSearch },
  { id: 'automation', label: 'Automation', icon: HiOutlineClock },
  { id: 'notifications', label: 'Notifications', icon: HiOutlineBell },
];

const platformColors = {
  linkedin: { bg: 'bg-[#0A66C2]/10', border: 'border-[#0A66C2]/30', text: 'text-[#0A66C2]' },
  glassdoor: { bg: 'bg-[#0CAA41]/10', border: 'border-[#0CAA41]/30', text: 'text-[#0CAA41]' },
  naukri: { bg: 'bg-[#4A90D9]/10', border: 'border-[#4A90D9]/30', text: 'text-[#4A90D9]' },
  unstop: { bg: 'bg-[#E34234]/10', border: 'border-[#E34234]/30', text: 'text-[#E34234]' },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jobify_settings')) || defaultSettings; }
    catch { return defaultSettings; }
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState({});

  const update = (section, field, value) => {
    setSettings(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };
  const save = () => {
    localStorage.setItem('jobify_settings', JSON.stringify(settings));
    toast.success('Settings saved!');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-white/40 mt-1">Configure your JOBIFY platform</p>
        </div>
        <button onClick={save} className="btn-primary flex items-center gap-2">
          <HiOutlineSave className="w-4 h-4" /> Save All
        </button>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Tabs */}
        <motion.div variants={item} className="col-span-12 lg:col-span-3">
          <div className="glass-card p-2 space-y-1">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-primary-600/20 text-primary-400' : 'text-white/40 hover:bg-white/[0.03] hover:text-white/60'}`}>
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={item} className="col-span-12 lg:col-span-9">
          <div className="glass-card p-6 space-y-6">
            {/* ── Profile ─────────────────────────────── */}
            {activeTab === 'profile' && (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center">
                    <HiOutlineUser className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Profile</h2>
                    <p className="text-xs text-white/40">Your account information</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Full Name</label>
                    <input value={settings.profile.name} onChange={e => update('profile', 'name', e.target.value)}
                      placeholder="John Doe" className="input-glass mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Email</label>
                    <input value={settings.profile.email} onChange={e => update('profile', 'email', e.target.value)}
                      placeholder="john@example.com" className="input-glass mt-1" />
                  </div>
                </div>
              </>
            )}

            {/* ── API Keys ────────────────────────────── */}
            {activeTab === 'apikeys' && (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                    <HiOutlineKey className="w-5 h-5 text-neon-purple" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">API Keys</h2>
                    <p className="text-xs text-white/40">Keys are stored locally and never sent to our servers</p>
                  </div>
                </div>
                {[
                  { key: 'openai', label: 'OpenAI API Key', placeholder: 'sk-...' },
                  { key: 'gemini', label: 'Google Gemini Key', placeholder: 'AI...' },
                ].map(api => (
                  <div key={api.key}>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{api.label}</label>
                    <div className="relative mt-1">
                      <input type={showApiKey[api.key] ? 'text' : 'password'}
                        value={settings.apiKeys[api.key]}
                        onChange={e => update('apiKeys', api.key, e.target.value)}
                        placeholder={api.placeholder} className="input-glass pr-16" />
                      <button onClick={() => setShowApiKey(prev => ({ ...prev, [api.key]: !prev[api.key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white/60">
                        {showApiKey[api.key] ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── Scraping ────────────────────────────── */}
            {activeTab === 'scraping' && (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                    <HiOutlineSearch className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Scraping Preferences</h2>
                    <p className="text-xs text-white/40">Configure default search parameters</p>
                  </div>
                </div>

                {/* Job Titles */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Job Titles</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.scraping.jobTitles.map((t, i) => (
                      <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600/10 border border-primary-500/20 text-xs text-primary-400">
                        {t}
                        <button onClick={() => {
                          const u = settings.scraping.jobTitles.filter((_, idx) => idx !== i);
                          update('scraping', 'jobTitles', u);
                        }} className="ml-1 text-white/30 hover:text-neon-pink">×</button>
                      </span>
                    ))}
                    <button onClick={() => {
                      const v = prompt('Add job title:');
                      if (v) update('scraping', 'jobTitles', [...settings.scraping.jobTitles, v]);
                    }} className="px-3 py-1.5 rounded-lg border border-dashed border-white/[0.1] text-xs text-white/30 hover:text-primary-400">
                      <HiOutlinePlus className="w-3 h-3 inline mr-1" /> Add
                    </button>
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Locations</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.scraping.locations.map((l, i) => (
                      <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-600/10 border border-accent-500/20 text-xs text-accent-400">
                        {l}
                        <button onClick={() => {
                          const u = settings.scraping.locations.filter((_, idx) => idx !== i);
                          update('scraping', 'locations', u);
                        }} className="ml-1 text-white/30 hover:text-neon-pink">×</button>
                      </span>
                    ))}
                    <button onClick={() => {
                      const v = prompt('Add location:');
                      if (v) update('scraping', 'locations', [...settings.scraping.locations, v]);
                    }} className="px-3 py-1.5 rounded-lg border border-dashed border-white/[0.1] text-xs text-white/30 hover:text-accent-400">
                      <HiOutlinePlus className="w-3 h-3 inline mr-1" /> Add
                    </button>
                  </div>
                </div>

                {/* Platform Toggles */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 block">Platforms</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(settings.scraping.platforms).map(p => (
                      <button key={p} onClick={() => {
                        const updated = { ...settings.scraping.platforms, [p]: !settings.scraping.platforms[p] };
                        update('scraping', 'platforms', updated);
                      }} className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                        settings.scraping.platforms[p]
                          ? `${platformColors[p].bg} ${platformColors[p].border} ${platformColors[p].text}`
                          : 'bg-white/[0.02] border-white/[0.06] text-white/30'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max jobs & delays */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Max Jobs / Run</label>
                    <input type="number" value={settings.scraping.maxJobsPerRun}
                      onChange={e => update('scraping', 'maxJobsPerRun', +e.target.value)}
                      className="input-glass mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Min Delay (ms)</label>
                    <input type="number" value={settings.scraping.delayMin}
                      onChange={e => update('scraping', 'delayMin', +e.target.value)}
                      className="input-glass mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Max Delay (ms)</label>
                    <input type="number" value={settings.scraping.delayMax}
                      onChange={e => update('scraping', 'delayMax', +e.target.value)}
                      className="input-glass mt-1" />
                  </div>
                </div>
              </>
            )}

            {/* ── Automation ──────────────────────────── */}
            {activeTab === 'automation' && (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center">
                    <HiOutlineClock className="w-5 h-5 text-neon-green" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Automation</h2>
                    <p className="text-xs text-white/40">Configure auto-apply and scheduling</p>
                  </div>
                </div>

                {/* Master toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <p className="text-sm font-semibold text-white">Enable Auto-Apply Bot</p>
                    <p className="text-xs text-white/40">Automatically apply to approved jobs on schedule</p>
                  </div>
                  <button onClick={() => update('automation', 'enabled', !settings.automation.enabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.automation.enabled ? 'bg-neon-green' : 'bg-white/10'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.automation.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Auto-Approve Above Score</label>
                    <div className="flex items-center gap-3 mt-1">
                      <input type="range" min="50" max="100" value={settings.automation.autoApproveAbove}
                        onChange={e => update('automation', 'autoApproveAbove', +e.target.value)}
                        className="flex-1 accent-primary-500" />
                      <span className="text-sm font-mono text-primary-400 w-10">{settings.automation.autoApproveAbove}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Daily Application Limit</label>
                    <input type="number" value={settings.automation.dailyLimit}
                      onChange={e => update('automation', 'dailyLimit', +e.target.value)}
                      className="input-glass mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Cron Schedule</label>
                    <input type="text" value={settings.automation.cronSchedule}
                      onChange={e => update('automation', 'cronSchedule', e.target.value)}
                      placeholder="0 7 * * *" className="input-glass mt-1 font-mono text-xs" />
                    <p className="text-[10px] text-white/30 mt-1">Default: Daily at 7:00 AM</p>
                  </div>
                </div>
              </>
            )}

            {/* ── Notifications ───────────────────────── */}
            {activeTab === 'notifications' && (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="w-10 h-10 rounded-xl bg-neon-orange/20 flex items-center justify-center">
                    <HiOutlineBell className="w-5 h-5 text-neon-orange" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Notifications</h2>
                    <p className="text-xs text-white/40">Choose what you want to be notified about</p>
                  </div>
                </div>

                {[
                  { key: 'browser', label: 'Browser Notifications', desc: 'Show desktop notifications' },
                  { key: 'email', label: 'Email Notifications', desc: 'Send updates to your email' },
                  { key: 'onNewJobs', label: 'New Jobs Scraped', desc: 'Notify when new jobs are found' },
                  { key: 'onApplied', label: 'Application Sent', desc: 'Notify when auto-apply submits' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <p className="text-sm font-semibold text-white">{n.label}</p>
                      <p className="text-xs text-white/40">{n.desc}</p>
                    </div>
                    <button onClick={() => update('notifications', n.key, !settings.notifications[n.key])}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifications[n.key] ? 'bg-primary-500' : 'bg-white/10'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.notifications[n.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
