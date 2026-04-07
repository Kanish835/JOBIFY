import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineDocumentText, HiOutlinePlus, HiOutlineTrash, HiOutlineSave,
  HiOutlineSparkles, HiOutlineDownload, HiOutlineEye
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const initialResume = {
  fullName: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', summary: '',
  skills: [{ category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS'] }, { category: 'Backend', items: ['Node.js', 'Express', 'MongoDB'] }],
  experience: [{ title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', highlights: [''] }],
  education: [{ degree: '', institution: '', year: '', gpa: '' }],
  projects: [{ name: '', description: '', techStack: [''], url: '' }],
  certifications: [''],
  languages: ['English', 'Hindi'],
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function ResumePage() {
  const [resume, setResume] = useState(initialResume);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    localStorage.setItem('jobify_master_resume', JSON.stringify(resume));
    toast.success('Master resume saved!');
  };

  const updateField = (field, value) => setResume(prev => ({ ...prev, [field]: value }));

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Resume <span className="gradient-text">Lab</span></h1>
          <p className="text-white/40 mt-1">Build your Master Resume — the AI uses this to tailor applications</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowPreview(!showPreview)} className="btn-ghost flex items-center gap-2">
            <HiOutlineEye className="w-4 h-4" /> {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <HiOutlineSave className="w-4 h-4" /> Save Resume
          </button>
        </div>
      </motion.div>

      {showPreview ? (
        /* ── PREVIEW MODE ──────────────────────────────────── */
        <motion.div variants={item} className="glass-card p-8 max-w-3xl mx-auto">
          <div className="text-center mb-6 pb-6 border-b border-white/[0.06]">
            <h2 className="text-2xl font-display font-bold text-white">{resume.fullName || 'Your Name'}</h2>
            <div className="flex flex-wrap gap-3 justify-center mt-2 text-sm text-white/50">
              {resume.email && <span>{resume.email}</span>}
              {resume.phone && <span>• {resume.phone}</span>}
              {resume.linkedin && <span>• LinkedIn</span>}
              {resume.github && <span>• GitHub</span>}
            </div>
          </div>

          {resume.summary && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">Professional Summary</h3>
              <p className="text-sm text-white/60 leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {resume.skills?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">Technical Skills</h3>
              {resume.skills.map((group, i) => (
                <div key={i} className="mb-1">
                  <span className="text-sm font-semibold text-white/70">{group.category}: </span>
                  <span className="text-sm text-white/50">{group.items.join(', ')}</span>
                </div>
              ))}
            </div>
          )}

          {resume.experience?.filter(e => e.title).length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">Experience</h3>
              {resume.experience.filter(e => e.title).map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-white">{exp.title}</p>
                    <p className="text-xs text-white/40">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  </div>
                  <p className="text-xs text-white/50">{exp.company} • {exp.location}</p>
                  {exp.description && <p className="text-sm text-white/40 mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {resume.education?.filter(e => e.degree).length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">Education</h3>
              {resume.education.filter(e => e.degree).map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm font-semibold text-white">{edu.degree}</p>
                  <p className="text-xs text-white/50">{edu.institution} • {edu.year} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
                </div>
              ))}
            </div>
          )}

          {resume.projects?.filter(p => p.name).length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">Projects</h3>
              {resume.projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="mb-3">
                  <p className="text-sm font-semibold text-white">{proj.name}</p>
                  <p className="text-sm text-white/40">{proj.description}</p>
                  {proj.techStack?.filter(Boolean).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.techStack.filter(Boolean).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-primary-600/10 text-primary-400">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        /* ── EDIT MODE ─────────────────────────────────────── */
        <>
          {/* Tabs */}
          <motion.div variants={item} className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id ? 'bg-primary-600/20 text-primary-400' : 'text-white/40 hover:text-white/60'}`}>
                {tab.label}
              </button>
            ))}
          </motion.div>

          <motion.div variants={item} className="glass-card p-6">
            {activeTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
                  { key: 'email', label: 'Email', placeholder: 'john@example.com' },
                  { key: 'phone', label: 'Phone', placeholder: '+91 9876543210' },
                  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/johndoe' },
                  { key: 'github', label: 'GitHub URL', placeholder: 'github.com/johndoe' },
                  { key: 'portfolio', label: 'Portfolio', placeholder: 'johndoe.dev' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{field.label}</label>
                    <input type="text" value={resume[field.key]} onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder} className="input-glass mt-1" />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Professional Summary</label>
                  <textarea value={resume.summary} onChange={(e) => updateField('summary', e.target.value)}
                    placeholder="Experienced software developer with 3+ years..."
                    rows={4} className="input-glass mt-1 resize-none" />
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                {resume.skills.map((group, gi) => (
                  <div key={gi} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-3 mb-3">
                      <input type="text" value={group.category}
                        onChange={(e) => {
                          const updated = [...resume.skills];
                          updated[gi].category = e.target.value;
                          updateField('skills', updated);
                        }}
                        placeholder="Category name" className="input-glass flex-1" />
                      <button onClick={() => updateField('skills', resume.skills.filter((_, i) => i !== gi))}
                        className="p-2 rounded-lg text-neon-pink/60 hover:bg-neon-pink/10 transition-colors">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill, si) => (
                        <div key={si} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600/10 border border-primary-500/20">
                          <span className="text-xs text-primary-400">{skill}</span>
                          <button onClick={() => {
                            const updated = [...resume.skills];
                            updated[gi].items = updated[gi].items.filter((_, i) => i !== si);
                            updateField('skills', updated);
                          }} className="text-white/30 hover:text-neon-pink ml-1">×</button>
                        </div>
                      ))}
                      <button onClick={() => {
                        const skill = prompt('Add skill:');
                        if (skill) {
                          const updated = [...resume.skills];
                          updated[gi].items.push(skill);
                          updateField('skills', updated);
                        }
                      }} className="px-3 py-1.5 rounded-lg border border-dashed border-white/[0.1] text-xs text-white/30 hover:border-primary-500/40 hover:text-primary-400 transition-colors">
                        <HiOutlinePlus className="w-3 h-3 inline mr-1" />Add
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => updateField('skills', [...resume.skills, { category: '', items: [] }])}
                  className="w-full py-3 rounded-xl border border-dashed border-white/[0.1] text-sm text-white/30 hover:border-primary-500/40 hover:text-primary-400 transition-colors">
                  <HiOutlinePlus className="w-4 h-4 inline mr-1" /> Add Skill Category
                </button>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs font-semibold text-white/50">Experience #{i + 1}</span>
                      <button onClick={() => updateField('experience', resume.experience.filter((_, idx) => idx !== i))}
                        className="text-neon-pink/60 hover:text-neon-pink"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={exp.title} onChange={(e) => { const u = [...resume.experience]; u[i].title = e.target.value; updateField('experience', u); }}
                        placeholder="Job Title" className="input-glass" />
                      <input type="text" value={exp.company} onChange={(e) => { const u = [...resume.experience]; u[i].company = e.target.value; updateField('experience', u); }}
                        placeholder="Company" className="input-glass" />
                      <input type="text" value={exp.startDate} onChange={(e) => { const u = [...resume.experience]; u[i].startDate = e.target.value; updateField('experience', u); }}
                        placeholder="Start Date" className="input-glass" />
                      <input type="text" value={exp.endDate} onChange={(e) => { const u = [...resume.experience]; u[i].endDate = e.target.value; updateField('experience', u); }}
                        placeholder="End Date" className="input-glass" />
                    </div>
                    <textarea value={exp.description} onChange={(e) => { const u = [...resume.experience]; u[i].description = e.target.value; updateField('experience', u); }}
                      placeholder="Description..." rows={3} className="input-glass resize-none" />
                  </div>
                ))}
                <button onClick={() => updateField('experience', [...resume.experience, { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', highlights: [''] }])}
                  className="w-full py-3 rounded-xl border border-dashed border-white/[0.1] text-sm text-white/30 hover:border-primary-500/40 hover:text-primary-400 transition-colors">
                  <HiOutlinePlus className="w-4 h-4 inline mr-1" /> Add Experience
                </button>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-4">
                {resume.education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={edu.degree} onChange={(e) => { const u = [...resume.education]; u[i].degree = e.target.value; updateField('education', u); }}
                        placeholder="Degree" className="input-glass" />
                      <input type="text" value={edu.institution} onChange={(e) => { const u = [...resume.education]; u[i].institution = e.target.value; updateField('education', u); }}
                        placeholder="Institution" className="input-glass" />
                      <input type="text" value={edu.year} onChange={(e) => { const u = [...resume.education]; u[i].year = e.target.value; updateField('education', u); }}
                        placeholder="Year" className="input-glass" />
                      <input type="text" value={edu.gpa} onChange={(e) => { const u = [...resume.education]; u[i].gpa = e.target.value; updateField('education', u); }}
                        placeholder="GPA (optional)" className="input-glass" />
                    </div>
                  </div>
                ))}
                <button onClick={() => updateField('education', [...resume.education, { degree: '', institution: '', year: '', gpa: '' }])}
                  className="w-full py-3 rounded-xl border border-dashed border-white/[0.1] text-sm text-white/30 hover:border-primary-500/40 hover:text-primary-400 transition-colors">
                  <HiOutlinePlus className="w-4 h-4 inline mr-1" /> Add Education
                </button>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                {resume.projects.map((proj, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3">
                    <input type="text" value={proj.name} onChange={(e) => { const u = [...resume.projects]; u[i].name = e.target.value; updateField('projects', u); }}
                      placeholder="Project Name" className="input-glass" />
                    <textarea value={proj.description} onChange={(e) => { const u = [...resume.projects]; u[i].description = e.target.value; updateField('projects', u); }}
                      placeholder="Description..." rows={2} className="input-glass resize-none" />
                    <input type="text" value={proj.url} onChange={(e) => { const u = [...resume.projects]; u[i].url = e.target.value; updateField('projects', u); }}
                      placeholder="URL (optional)" className="input-glass" />
                  </div>
                ))}
                <button onClick={() => updateField('projects', [...resume.projects, { name: '', description: '', techStack: [''], url: '' }])}
                  className="w-full py-3 rounded-xl border border-dashed border-white/[0.1] text-sm text-white/30 hover:border-primary-500/40 hover:text-primary-400 transition-colors">
                  <HiOutlinePlus className="w-4 h-4 inline mr-1" /> Add Project
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
