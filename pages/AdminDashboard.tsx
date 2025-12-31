import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, LogOut, CheckCircle, Layout, Edit3, Plus, Trash2, Database, Settings, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { supabase } from '../lib/supabase';

// Helper to upload images to Supabase Storage
// Ensures unique filenames using Date.now()
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

export const AdminDashboard: React.FC = () => {
  const { personalInfo, projects, refreshData } = usePortfolio();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'resume' | 'settings'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Profile State ---
  const [profileForm, setProfileForm] = useState({
      name: '',
      headline: '',
      subHeadline: '',
      email: '',
      avatarUrl: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // --- Projects State ---
  // null = list mode, {} = create mode, { ... } = edit mode
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

  // --- Settings State ---
  const [dbUrl, setDbUrl] = useState('');
  const [dbKey, setDbKey] = useState('');

  // Load initial data from Context
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
    setDbUrl(localStorage.getItem('REACT_APP_SUPABASE_URL') || '');
    setDbKey(localStorage.getItem('REACT_APP_SUPABASE_ANON_KEY') || '');
  }, []);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate('/login');
  };

  const showToast = () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
  }

  // --- Handlers: Profile ---

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
        if (!supabase) {
             // Demo mode simulation
            await new Promise(r => setTimeout(r, 1000));
        } else {
            let finalAvatarUrl = profileForm.avatarUrl;
            
            // Upload new avatar if selected
            if (avatarFile) {
                finalAvatarUrl = await uploadImage(avatarFile);
            }

            // Update or Insert profile (Assuming ID 1 is the main user)
            const { error } = await supabase.from('profile').upsert({
                id: 1,
                name: profileForm.name,
                headline: profileForm.headline,
                sub_headline: profileForm.subHeadline,
                email: profileForm.email,
                avatar_url: finalAvatarUrl
            });
            
            if (error) throw error;
        }
        
        // Refresh context to show changes immediately
        await refreshData();
        showToast();
    } catch (e: any) {
        alert("Error saving profile: " + e.message);
    } finally {
        setIsSaving(false);
    }
  };

  // --- Handlers: Projects ---

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
          // New Project
          setEditingProject({}); 
          setProjectForm({ title: '', description: '', tags: '', liveLink: '', githubLink: '', image: '' });
      }
      setProjectImageFile(null);
  };

  const handleDeleteProject = async (id: number) => {
      if (!confirm("Are you sure you want to delete this project?")) return;
      
      if (supabase) {
          const { error } = await supabase.from('projects').delete().eq('id', id);
          if (error) { alert(error.message); return; }
          await refreshData();
      } else {
          alert("Cannot delete in Demo Mode");
      }
  };

  const handleProjectSave = async () => {
      setIsSaving(true);
      try {
          if (!supabase) {
              await new Promise(r => setTimeout(r, 1000));
          } else {
              let finalImageUrl = projectForm.image;
              
              // Upload new project image if selected
              if (projectImageFile) {
                  finalImageUrl = await uploadImage(projectImageFile);
              }

              const payload = {
                  title: projectForm.title,
                  description: projectForm.description,
                  // Split tags string into array for Postgres
                  tags: projectForm.tags.split(',').map(t => t.trim()).filter(t => t),
                  image_url: finalImageUrl,
                  live_link: projectForm.liveLink,
                  github_link: projectForm.githubLink
              };

              if (editingProject.id) {
                  // UPDATE existing
                  const { error } = await supabase.from('projects').update(payload).eq('id', editingProject.id);
                  if (error) throw error;
              } else {
                  // INSERT new
                  const { error } = await supabase.from('projects').insert([payload]);
                  if (error) throw error;
              }
          }
          await refreshData();
          setEditingProject(null); // Close editor and return to list
          showToast();
      } catch (e: any) {
          alert("Error saving project: " + e.message);
      } finally {
          setIsSaving(false);
      }
  };

  // --- Handlers: Settings ---
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

  const InputField = ({ label, value, onChange, type="text", placeholder="" }: any) => (
      <div className="space-y-2">
        <label className="text-xs font-mono text-gray-500 uppercase block">{label}</label>
        {type === 'textarea' ? (
            <textarea 
                value={value} onChange={e => onChange(e.target.value)} rows={4}
                className="w-full bg-black border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-sans focus:ring-1 focus:ring-dark-accent transition-all"
                placeholder={placeholder}
            />
        ) : (
            <input 
                type={type} value={value} onChange={e => onChange(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-sans focus:ring-1 focus:ring-dark-accent transition-all"
                placeholder={placeholder}
            />
        )}
      </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Admin Navbar */}
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
                    <Layout size={16} /> Resume
                </button>
                <div className="my-4 border-t border-white/10" />
                <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-3 rounded font-mono text-sm flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/30' : 'text-gray-500 hover:text-white'}`}>
                    <Settings size={16} /> Connection
                </button>
            </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto relative">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-sketch font-bold">
                        {activeTab === 'profile' && 'Edit Profile Info'}
                        {activeTab === 'projects' && (editingProject ? (editingProject.id ? 'Edit Project' : 'New Project') : 'Manage Projects')}
                        {activeTab === 'resume' && 'Resume Timeline'}
                        {activeTab === 'settings' && 'Database Connection'}
                    </h1>
                    
                    {/* Dynamic Action Buttons */}
                    {activeTab === 'profile' && (
                        <motion.button onClick={handleProfileSave} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-dark-accent text-black font-bold font-sketch rounded flex items-center gap-2">
                             {isSaving ? 'SAVING...' : <><Save size={18} /> SAVE CHANGES</>}
                        </motion.button>
                    )}
                    {activeTab === 'settings' && (
                         <motion.button onClick={handleConnectionSave} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-dark-accent text-black font-bold font-sketch rounded flex items-center gap-2">
                             <Save size={18} /> CONNECT
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
                                    <p className="text-[10px] text-gray-500 font-mono">Click to replace</p>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <InputField label="Full Name" value={profileForm.name} onChange={(v: string) => setProfileForm(p => ({...p, name: v}))} />
                                    <InputField label="Headline (Greeting)" value={profileForm.headline} onChange={(v: string) => setProfileForm(p => ({...p, headline: v}))} />
                                </div>
                             </div>
                             <InputField label="Bio / Sub-headline" value={profileForm.subHeadline} onChange={(v: string) => setProfileForm(p => ({...p, subHeadline: v}))} type="textarea" />
                             <InputField label="Email Address" value={profileForm.email} onChange={(v: string) => setProfileForm(p => ({...p, email: v}))} />
                        </div>
                    )}

                    {/* --- PROJECTS TAB --- */}
                    {activeTab === 'projects' && !editingProject && (
                        <div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                <button onClick={() => openProjectEditor()} className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/10 rounded-lg hover:border-dark-accent/50 hover:bg-dark-accent/5 transition-colors gap-2 group">
                                    <Plus size={32} className="text-gray-600 group-hover:text-dark-accent" />
                                    <span className="text-sm font-mono text-gray-500">Create New Project</span>
                                </button>
                                {projects.map(p => (
                                    <div key={p.id} className="relative group border border-white/10 rounded-lg overflow-hidden bg-black">
                                        <div className="h-32 bg-gray-900 relative">
                                            <img src={p.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
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
                                        <span className="text-xs font-mono uppercase">Upload New Image</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && setProjectImageFile(e.target.files[0])} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 font-mono">16:9 Aspect Ratio recommended.</p>
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

                             {supabase && (
                                 <div className="pt-8 border-t border-white/10">
                                     <button onClick={clearSettings} className="text-red-400 text-sm font-mono flex items-center gap-2 hover:text-red-300 transition-colors">
                                         <Trash2 size={16} /> Disconnect & Reset to Demo
                                     </button>
                                 </div>
                             )}
                        </div>
                    )}
                </div>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 right-10 bg-green-500/10 border border-green-500 text-green-400 px-6 py-4 rounded-lg flex items-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
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