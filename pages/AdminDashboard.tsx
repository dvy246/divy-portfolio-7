import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, LogOut, CheckCircle, Layout, Edit3, Plus, Trash2, Database, Settings, Upload, X, Image as ImageIcon, Briefcase, GraduationCap, FileText, RefreshCw, Rss } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { supabase } from '../lib/supabase';

// --- Helpers defined OUTSIDE component to prevent re-render focus loss ---

const uploadImage = async (file: File, bucket = 'portfolio-images') => {
  if (!supabase) throw new Error("Supabase not configured");
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return data.publicUrl;
};

// Reusable Input Component
const InputField = ({ label, value, onChange, type="text", placeholder="", options = [] as string[], className="" }: any) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-xs font-mono text-gray-500 uppercase block">{label}</label>
    {type === 'textarea' ? (
        <textarea 
            value={value} onChange={e => onChange(e.target.value)} rows={4}
            className="w-full bg-black border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-sans focus:ring-1 focus:ring-dark-accent transition-all"
            placeholder={placeholder}
        />
    ) : type === 'select' ? (
        <div className="relative">
            <select 
                value={value} 
                onChange={e => onChange(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-sans focus:ring-1 focus:ring-dark-accent transition-all appearance-none"
            >
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                ▼
            </div>
        </div>
    ) : (
        <input 
            type={type} value={value} onChange={e => onChange(e.target.value)}
            className="w-full bg-black border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-sans focus:ring-1 focus:ring-dark-accent transition-all"
            placeholder={placeholder}
        />
    )}
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { personalInfo, projects, resume, blogs, refreshData } = usePortfolio();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'resume' | 'blogs' | 'settings'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Profile State ---
  const [profileId, setProfileId] = useState<number | null>(null);
  const [profileForm, setProfileForm] = useState({
      name: '',
      headline: '',
      subHeadline: '',
      email: '',
      avatarUrl: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // --- Projects State ---
  const [editingProject, setEditingProject] = useState<any | null>(null); 
  const [projectForm, setProjectForm] = useState({
      title: '',
      description: '',
      tags: '',
      liveLink: '',
      githubLink: '',
      image: ''
  });
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);

  // --- Resume State ---
  const [editingResume, setEditingResume] = useState<any | null>(null);
  const [resumeForm, setResumeForm] = useState({
      type: 'work',
      title: '',
      company: '',
      period: '',
      description: '',
      tags: ''
  });

  // --- Blogs / Medium State ---
  const [mediumUsername, setMediumUsername] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // --- Settings State ---
  const [dbUrl, setDbUrl] = useState('');
  const [dbKey, setDbKey] = useState('');

  // 1. Load Data on Mount & Updates
  useEffect(() => {
    if (personalInfo) {
        setProfileForm({
            name: personalInfo.name,
            headline: personalInfo.headline,
            subHeadline: personalInfo.subHeadline,
            email: personalInfo.email,
            avatarUrl: personalInfo.avatarUrl
        });
    }
  }, [personalInfo]);

  useEffect(() => {
      const fetchProfileId = async () => {
          if (!supabase) return;
          try {
            const { data } = await supabase.from('profile').select('id').limit(1).single();
            if (data) setProfileId(data.id);
          } catch (e) { console.error(e); }
      };
      fetchProfileId();
  }, []);

  useEffect(() => {
    setDbUrl(localStorage.getItem('REACT_APP_SUPABASE_URL') || '');
    setDbKey(localStorage.getItem('REACT_APP_SUPABASE_ANON_KEY') || '');
  }, []);

  // --- Actions ---
  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate('/login');
  };

  const showToast = () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
  }

  // --- PROFILE HANDLERS ---
  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
        if (!supabase) { await new Promise(r => setTimeout(r, 1000)); } 
        else {
            let finalAvatarUrl = profileForm.avatarUrl;
            if (avatarFile) {
                finalAvatarUrl = await uploadImage(avatarFile);
            }
            const payload = {
                name: profileForm.name,
                headline: profileForm.headline,
                sub_headline: profileForm.subHeadline,
                email: profileForm.email,
                avatar_url: finalAvatarUrl
            };

            if (profileId) {
                const { error } = await supabase.from('profile').update(payload).eq('id', profileId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('profile').insert([payload]);
                if (error) throw error;
                const { data } = await supabase.from('profile').select('id').limit(1).single();
                if (data) setProfileId(data.id);
            }
        }
        await refreshData();
        showToast();
    } catch (e: any) { alert("Error: " + e.message); } finally { setIsSaving(false); }
  };

  // --- PROJECT HANDLERS ---
  const openProjectEditor = (project?: any) => {
      if (project) {
          setEditingProject(project);
          setProjectForm({
              title: project.title,
              description: project.description,
              tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
              liveLink: project.liveLink,
              githubLink: project.githubLink,
              image: project.image
          });
      } else {
          setEditingProject({}); 
          setProjectForm({ title: '', description: '', tags: '', liveLink: '', githubLink: '', image: '' });
      }
      setProjectImageFile(null);
  };

  const handleProjectSave = async () => {
      setIsSaving(true);
      try {
          if (!supabase) { await new Promise(r => setTimeout(r, 1000)); }
          else {
              let finalImageUrl = projectForm.image;
              if (projectImageFile) {
                  finalImageUrl = await uploadImage(projectImageFile);
              }
              const payload = {
                  title: projectForm.title,
                  description: projectForm.description,
                  tags: projectForm.tags.split(',').map(t => t.trim()).filter(t => t),
                  image_url: finalImageUrl,
                  live_link: projectForm.liveLink,
                  github_link: projectForm.githubLink
              };

              if (editingProject.id) {
                  const { error } = await supabase.from('projects').update(payload).eq('id', editingProject.id);
                  if (error) throw error;
              } else {
                  const { error } = await supabase.from('projects').insert([payload]);
                  if (error) throw error;
              }
          }
          await refreshData();
          setEditingProject(null);
          showToast();
      } catch (e: any) { alert("Error: " + e.message); } finally { setIsSaving(false); }
  };

  const handleDeleteProject = async (id: number) => {
      if (!confirm("Delete this project?")) return;
      if (supabase) {
          const { error } = await supabase.from('projects').delete().eq('id', id);
          if (error) alert(error.message);
          else await refreshData();
      }
  };

  // --- RESUME HANDLERS ---
  const openResumeEditor = (item?: any) => {
      if (item) {
          setEditingResume(item);
          setResumeForm({
              type: item.type,
              title: item.title,
              company: item.company,
              period: item.period,
              description: item.description,
              tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags
          });
      } else {
          setEditingResume({});
          setResumeForm({ type: 'work', title: '', company: '', period: '', description: '', tags: '' });
      }
  };

  const handleResumeSave = async () => {
    setIsSaving(true);
    try {
        if (!supabase) { await new Promise(r => setTimeout(r, 1000)); }
        else {
            const payload = {
                type: resumeForm.type,
                title: resumeForm.title,
                company: resumeForm.company,
                period: resumeForm.period,
                description: resumeForm.description,
                tags: resumeForm.tags.split(',').map(t => t.trim()).filter(t => t)
            };

            if (editingResume.id) {
                const { error } = await supabase.from('resume').update(payload).eq('id', editingResume.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('resume').insert([payload]);
                if (error) throw error;
            }
        }
        await refreshData();
        setEditingResume(null);
        showToast();
    } catch (e: any) { alert("Error: " + e.message); } finally { setIsSaving(false); }
  };

  const handleDeleteResume = async (id: number) => {
      if (!confirm("Delete this entry?")) return;
      if (supabase) {
          const { error } = await supabase.from('resume').delete().eq('id', id);
          if (error) alert(error.message);
          else await refreshData();
      }
  };

  // --- BLOG / MEDIUM SYNC HANDLERS ---
  const handleMediumSync = async () => {
      if (!mediumUsername) return alert("Please enter a Medium Username");
      setIsSyncing(true);
      try {
          const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUsername}`);
          const data = await response.json();
          
          if (data.status !== 'ok') throw new Error("Could not fetch Medium Feed");

          if (!supabase) {
              alert("Sync simulated (Demo Mode)");
          } else {
              // Map Medium items to our DB schema
              const posts = data.items.map((item: any) => ({
                  title: item.title,
                  link: item.link,
                  // Convert "2023-11-15 10:00:00" to "Nov 15, 2023"
                  date: new Date(item.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
              }));

              // Insert loop (basic implementation)
              for (const post of posts) {
                  // Upsert based on link to avoid duplicates? 
                  // Supabase simple insert for now, assuming user handles cleanup or we clear table first
                  // A better way: Check if link exists
                  const { data: existing } = await supabase.from('blogs').select('id').eq('link', post.link).single();
                  if (!existing) {
                      await supabase.from('blogs').insert([post]);
                  }
              }
              await refreshData();
              showToast();
          }
      } catch (e: any) {
          alert("Sync Failed: " + e.message);
      } finally {
          setIsSyncing(false);
      }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm("Delete this blog link?")) return;
    if (supabase) {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) alert(error.message);
        else await refreshData();
    }
  };

  // --- SETTINGS HANDLERS ---
  const handleConnectionSave = async () => {
    localStorage.setItem('REACT_APP_SUPABASE_URL', dbUrl);
    localStorage.setItem('REACT_APP_SUPABASE_ANON_KEY', dbKey);
    window.location.reload();
  };

  const clearSettings = () => {
    if(confirm("Disconnect Supabase?")) {
        localStorage.removeItem('REACT_APP_SUPABASE_URL');
        localStorage.removeItem('REACT_APP_SUPABASE_ANON_KEY');
        window.location.reload();
    }
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${supabase ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="font-mono text-dark-accent font-bold">
                {supabase ? 'LIVE_MODE' : 'DEMO_MODE'}
            </span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition-colors">
            <LogOut size={16} /> LOGOUT
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#080808] p-4 hidden md:block">
            <div className="space-y-2">
                <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-3 rounded font-mono text-sm flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/30' : 'text-gray-500 hover:text-white'}`}>
                    <Edit3 size={16} /> Profile
                </button>
                <button onClick={() => setActiveTab('projects')} className={`w-full text-left px-4 py-3 rounded font-mono text-sm flex items-center gap-3 transition-colors ${activeTab === 'projects' ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/30' : 'text-gray-500 hover:text-white'}`}>
                    <Layout size={16} /> Projects
                </button>
                <button onClick={() => setActiveTab('resume')} className={`w-full text-left px-4 py-3 rounded font-mono text-sm flex items-center gap-3 transition-colors ${activeTab === 'resume' ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/30' : 'text-gray-500 hover:text-white'}`}>
                    <Briefcase size={16} /> Resume
                </button>
                <button onClick={() => setActiveTab('blogs')} className={`w-full text-left px-4 py-3 rounded font-mono text-sm flex items-center gap-3 transition-colors ${activeTab === 'blogs' ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/30' : 'text-gray-500 hover:text-white'}`}>
                    <FileText size={16} /> Blogs
                </button>
                <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-3 rounded font-mono text-sm flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/30' : 'text-gray-500 hover:text-white'}`}>
                    <Settings size={16} /> Connection
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto relative">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-sketch font-bold">
                        {activeTab === 'profile' && 'Edit Profile'}
                        {activeTab === 'projects' && (editingProject ? (editingProject.id ? 'Edit Project' : 'New Project') : 'Projects')}
                        {activeTab === 'resume' && (editingResume ? (editingResume.id ? 'Edit Entry' : 'New Entry') : 'Resume / History')}
                        {activeTab === 'blogs' && 'Blog Posts'}
                        {activeTab === 'settings' && 'Connection'}
                    </h1>
                    
                    {/* Header Buttons */}
                    {activeTab === 'profile' && (
                        <motion.button onClick={handleProfileSave} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-dark-accent text-black font-bold font-sketch rounded flex items-center gap-2">
                             {isSaving ? 'SAVING...' : <><Save size={18} /> SAVE CHANGES</>}
                        </motion.button>
                    )}
                    
                    {activeTab === 'projects' && editingProject && (
                        <div className="flex gap-2">
                             <button onClick={() => setEditingProject(null)} className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded">Cancel</button>
                             <motion.button onClick={handleProjectSave} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-dark-accent text-black font-bold font-sketch rounded flex items-center gap-2">
                                 {isSaving ? 'SAVING...' : <><Save size={18} /> SAVE PROJECT</>}
                            </motion.button>
                        </div>
                    )}

                    {activeTab === 'resume' && editingResume && (
                        <div className="flex gap-2">
                             <button onClick={() => setEditingResume(null)} className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded">Cancel</button>
                             <motion.button onClick={handleResumeSave} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-dark-accent text-black font-bold font-sketch rounded flex items-center gap-2">
                                 {isSaving ? 'SAVING...' : <><Save size={18} /> SAVE ENTRY</>}
                            </motion.button>
                        </div>
                    )}
                </header>

                <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-lg min-h-[400px]">
                    
                    {/* --- PROFILE TAB --- */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                             <div className="flex items-start gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-mono text-gray-500 uppercase block">Avatar</label>
                                    <div className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 bg-black">
                                        <img src={avatarFile ? URL.createObjectURL(avatarFile) : profileForm.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Upload size={24} className="text-white" />
                                            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && setAvatarFile(e.target.files[0])} />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <InputField label="Full Name" value={profileForm.name} onChange={(v: string) => setProfileForm(p => ({...p, name: v}))} />
                                    <InputField label="Headline" value={profileForm.headline} onChange={(v: string) => setProfileForm(p => ({...p, headline: v}))} />
                                </div>
                             </div>
                             <InputField label="Bio / Sub-headline" value={profileForm.subHeadline} onChange={(v: string) => setProfileForm(p => ({...p, subHeadline: v}))} type="textarea" />
                             <InputField label="Email Address" value={profileForm.email} onChange={(v: string) => setProfileForm(p => ({...p, email: v}))} />
                        </div>
                    )}

                    {/* --- PROJECTS TAB --- */}
                    {activeTab === 'projects' && !editingProject && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             <button onClick={() => openProjectEditor()} className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/10 rounded-lg hover:border-dark-accent/50 hover:bg-dark-accent/5 transition-colors gap-2 group">
                                <Plus size={32} className="text-gray-600 group-hover:text-dark-accent" />
                                <span className="text-sm font-mono text-gray-500">Create New Project</span>
                            </button>
                            {projects.map(p => (
                                <div key={p.id} className="relative group border border-white/10 rounded-lg overflow-hidden bg-black">
                                    <div className="h-32 bg-gray-900 relative">
                                        <img src={p.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openProjectEditor(p)} className="p-2 bg-black/80 hover:bg-blue-600 rounded text-white"><Edit3 size={14} /></button>
                                            <button onClick={() => handleDeleteProject(p.id)} className="p-2 bg-black/80 hover:bg-red-600 rounded text-white"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold font-sketch truncate">{p.title}</h3>
                                        <p className="text-xs text-gray-500 font-mono truncate">{Array.isArray(p.tags) ? p.tags.join(', ') : p.tags}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'projects' && editingProject && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <InputField label="Project Title" value={projectForm.title} onChange={(v: string) => setProjectForm(p => ({...p, title: v}))} />
                                <InputField label="Description" value={projectForm.description} onChange={(v: string) => setProjectForm(p => ({...p, description: v}))} type="textarea" />
                                <InputField label="Tags (Comma Separated)" value={projectForm.tags} onChange={(v: string) => setProjectForm(p => ({...p, tags: v}))} placeholder="React, AI, Python" />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Live Link" value={projectForm.liveLink} onChange={(v: string) => setProjectForm(p => ({...p, liveLink: v}))} />
                                    <InputField label="Github Link" value={projectForm.githubLink} onChange={(v: string) => setProjectForm(p => ({...p, githubLink: v}))} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-mono text-gray-500 uppercase block">Project Image</label>
                                <div className="border-2 border-dashed border-white/10 rounded-lg h-64 flex items-center justify-center relative bg-black overflow-hidden group">
                                    {(projectImageFile || projectForm.image) ? (
                                        <img src={projectImageFile ? URL.createObjectURL(projectImageFile) : projectForm.image} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-center text-gray-600">
                                            <ImageIcon size={32} className="mx-auto mb-2" />
                                            <p className="text-xs">No Image Selected</p>
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload size={32} className="text-white mb-2" />
                                        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && setProjectImageFile(e.target.files[0])} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- RESUME TAB --- */}
                    {activeTab === 'resume' && !editingResume && (
                        <div className="space-y-4">
                             <button onClick={() => openResumeEditor()} className="w-full py-4 border-2 border-dashed border-white/10 rounded-lg hover:border-dark-accent/50 hover:bg-dark-accent/5 transition-colors flex items-center justify-center gap-2 group mb-6">
                                <Plus size={20} className="text-gray-600 group-hover:text-dark-accent" />
                                <span className="text-sm font-mono text-gray-500">Add History Entry</span>
                            </button>
                            
                            {resume.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-black border border-white/10 rounded-lg group hover:border-dark-accent/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded ${item.type === 'work' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                                            {item.type === 'work' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold font-sketch">{item.title}</h4>
                                            <p className="text-xs text-gray-500 font-mono">{item.company} | {item.period}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openResumeEditor(item)} className="p-2 hover:bg-white/10 rounded text-blue-400"><Edit3 size={16} /></button>
                                        <button onClick={() => handleDeleteResume(item.id)} className="p-2 hover:bg-white/10 rounded text-red-400"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'resume' && editingResume && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Type" value={resumeForm.type} onChange={(v: string) => setResumeForm(p => ({...p, type: v}))} type="select" options={['work', 'education']} />
                                <InputField label="Period (Year)" value={resumeForm.period} onChange={(v: string) => setResumeForm(p => ({...p, period: v}))} placeholder="e.g. 2020 - 2022" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Title / Degree" value={resumeForm.title} onChange={(v: string) => setResumeForm(p => ({...p, title: v}))} />
                                <InputField label="Company / University" value={resumeForm.company} onChange={(v: string) => setResumeForm(p => ({...p, company: v}))} />
                            </div>
                            <InputField label="Description" value={resumeForm.description} onChange={(v: string) => setResumeForm(p => ({...p, description: v}))} type="textarea" />
                            <InputField label="Tags (Comma Separated)" value={resumeForm.tags} onChange={(v: string) => setResumeForm(p => ({...p, tags: v}))} placeholder="Python, Leadership, Research" />
                        </div>
                    )}

                    {/* --- BLOGS TAB --- */}
                    {activeTab === 'blogs' && (
                        <div className="space-y-8">
                            {/* Medium Sync Section */}
                            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <Rss className="text-orange-400" size={24} />
                                    <h3 className="font-bold text-lg">Sync from Medium</h3>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <InputField value={mediumUsername} onChange={setMediumUsername} placeholder="Medium Username (without @)" />
                                    </div>
                                    <button onClick={handleMediumSync} disabled={isSyncing} className="px-6 bg-white text-black font-bold rounded flex items-center gap-2 hover:bg-gray-200 disabled:opacity-50">
                                        {isSyncing ? <RefreshCw className="animate-spin" /> : <RefreshCw />}
                                        SYNC
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 font-mono">This will fetch your latest public stories and add them to the portfolio.</p>
                            </div>

                            {/* Blog List */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-mono uppercase text-gray-500">Current Posts</h4>
                                {blogs.map(blog => (
                                    <div key={blog.id} className="flex items-center justify-between p-4 bg-black border border-white/10 rounded hover:border-dark-accent/30 transition-colors group">
                                        <div>
                                            <h4 className="font-medium">{blog.title}</h4>
                                            <p className="text-xs text-gray-600 font-mono">{blog.date}</p>
                                        </div>
                                        <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- SETTINGS TAB --- */}
                    {activeTab === 'settings' && (
                        <div className="space-y-8">
                             <div className="flex items-center gap-4 p-4 bg-blue-900/10 border border-blue-500/20 rounded">
                                <Database className="text-blue-400" size={24} />
                                <div className="text-sm text-blue-200">
                                    <p className="font-bold">Supabase Configuration</p>
                                    <p className="opacity-70">Enter your project credentials to connect a live database.</p>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <InputField label="Project URL" value={dbUrl} onChange={setDbUrl} placeholder="https://xyz.supabase.co" />
                                <InputField label="Anon / Public Key" value={dbKey} onChange={setDbKey} type="password" placeholder="eyJh..." />
                             </div>

                             <div className="pt-4 flex justify-end gap-4">
                                 {supabase && (
                                     <button onClick={clearSettings} className="text-red-400 text-sm font-mono flex items-center gap-2 hover:text-red-300 transition-colors">
                                         <Trash2 size={16} /> DISCONNECT
                                     </button>
                                 )}
                                 <motion.button onClick={handleConnectionSave} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-dark-accent text-black font-bold font-sketch rounded flex items-center gap-2">
                                     <Save size={18} /> CONNECT
                                </motion.button>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 right-10 bg-green-500/10 border border-green-500 text-green-400 px-6 py-4 rounded-lg flex items-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)] z-50">
                        <CheckCircle size={20} />
                        <span className="font-sketch font-bold">Updated Successfully</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
      </div>
    </div>
  );
};