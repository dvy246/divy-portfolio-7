import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, LogOut, CheckCircle, Layout, Edit3, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { supabase } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const { personalInfo, refreshData } = usePortfolio();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'resume'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Local state for editing (simplified for Profile)
  const [bio, setBio] = useState(personalInfo.subHeadline);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app: await supabase.from('profile').update({ subHeadline: bio })...
    
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Admin Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="font-mono text-dark-accent font-bold">ADMIN_CONTROLS</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition-colors">
            <LogOut size={16} /> LOGOUT
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#080808] p-4 hidden md:block">
            <div className="space-y-2">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded font-mono text-sm flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/30' : 'text-gray-500 hover:text-white'}`}
                >
                    <Edit3 size={16} /> Profile
                </button>
                <button 
                    onClick={() => setActiveTab('projects')}
                    className={`w-full text-left px-4 py-3 rounded font-mono text-sm flex items-center gap-3 transition-colors ${activeTab === 'projects' ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/30' : 'text-gray-500 hover:text-white'}`}
                >
                    <Layout size={16} /> Projects
                </button>
                <button 
                    onClick={() => setActiveTab('resume')}
                    className={`w-full text-left px-4 py-3 rounded font-mono text-sm flex items-center gap-3 transition-colors ${activeTab === 'resume' ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/30' : 'text-gray-500 hover:text-white'}`}
                >
                    <Layout size={16} /> Resume
                </button>
            </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto relative">
            <div className="max-w-3xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-sketch font-bold">
                        {activeTab === 'profile' && 'Edit Profile Info'}
                        {activeTab === 'projects' && 'Manage Projects'}
                        {activeTab === 'resume' && 'Resume Timeline'}
                    </h1>
                    
                    <motion.button
                        onClick={handleSave}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-dark-accent text-black font-bold font-sketch flex items-center gap-2 rounded shadow-[0_0_15px_rgba(41,216,255,0.3)]"
                    >
                        {isSaving ? (
                            <span className="animate-pulse">SAVING...</span>
                        ) : (
                            <>
                                <Save size={18} /> SAVE CHANGES
                            </>
                        )}
                    </motion.button>
                </header>

                {/* Editor Content */}
                <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-lg min-h-[400px]">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-500 uppercase block">Display Name</label>
                                <input 
                                    type="text" 
                                    defaultValue={personalInfo.name}
                                    className="w-full bg-black border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-sans"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-500 uppercase block">Bio / Sub-headline</label>
                                <textarea 
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    className="w-full bg-black border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-sans"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="text-center py-20 text-gray-600 font-mono">
                            <Layout size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Project List Component would load here...</p>
                            <button className="mt-4 px-4 py-2 border border-white/10 hover:bg-white/5 rounded text-sm flex items-center gap-2 mx-auto">
                                <Plus size={16} /> Add New Project
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Animation Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-green-500/50 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                            <motion.div
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <CheckCircle size={64} className="text-green-500" strokeWidth={1.5} />
                            </motion.div>
                            <h2 className="text-xl font-sketch font-bold text-green-400">System Updated</h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
