import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, LogOut, CheckCircle, Layout, Edit3, Plus, Trash2, Database, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { supabase } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const { personalInfo, refreshData } = usePortfolio();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'resume' | 'settings'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Local state for editing
  const [bio, setBio] = useState(personalInfo.subHeadline);

  // Local state for Settings
  const [dbUrl, setDbUrl] = useState('');
  const [dbKey, setDbKey] = useState('');

  useEffect(() => {
    // Load existing keys from localStorage if they exist
    setDbUrl(localStorage.getItem('REACT_APP_SUPABASE_URL') || '');
    setDbKey(localStorage.getItem('REACT_APP_SUPABASE_ANON_KEY') || '');
  }, []);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    if (activeTab === 'settings') {
        // Save to localStorage and reload to re-init supabase client
        localStorage.setItem('REACT_APP_SUPABASE_URL', dbUrl);
        localStorage.setItem('REACT_APP_SUPABASE_ANON_KEY', dbKey);
        
        await new Promise(resolve => setTimeout(resolve, 500)); // UX delay
        window.location.reload();
        return;
    }

    // Simulate API call delay for other tabs
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app: await supabase.from('profile').update({ subHeadline: bio })...
    
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    refreshData();
  };

  const clearSettings = () => {
      if(confirm("Are you sure? This will disconnect the database and return to Demo Mode.")) {
        localStorage.removeItem('REACT_APP_SUPABASE_URL');
        localStorage.removeItem('REACT_APP_SUPABASE_ANON_KEY');
        window.location.reload();
      }
  }

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
                
                <div className="my-4 border-t border-white/10" />
                
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-3 rounded font-mono text-sm flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/30' : 'text-gray-500 hover:text-white'}`}
                >
                    <Settings size={16} /> Connection
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
                        {activeTab === 'settings' && 'Database Connection'}
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
                                <Save size={18} /> {activeTab === 'settings' ? 'CONNECT' : 'SAVE CHANGES'}
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

                    {activeTab === 'settings' && (
                        <div className="space-y-8">
                             <div className="flex items-center gap-4 p-4 bg-blue-900/10 border border-blue-500/20 rounded">
                                <Database className="text-blue-400" size={24} />
                                <div className="text-sm text-blue-200">
                                    <p className="font-bold">Supabase Configuration</p>
                                    <p className="opacity-70">Enter your project credentials to connect a live database. These are stored locally in your browser.</p>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase block">Project URL</label>
                                    <input 
                                        type="text" 
                                        value={dbUrl}
                                        onChange={(e) => setDbUrl(e.target.value)}
                                        placeholder="https://xyz.supabase.co"
                                        className="w-full bg-black border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase block">Anon / Public Key</label>
                                    <input 
                                        type="password" 
                                        value={dbKey}
                                        onChange={(e) => setDbKey(e.target.value)}
                                        placeholder="eyJh..."
                                        className="w-full bg-black border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-mono"
                                    />
                                </div>
                             </div>

                             {supabase && (
                                 <div className="pt-8 border-t border-white/10">
                                     <button 
                                        onClick={clearSettings}
                                        className="text-red-400 text-sm font-mono flex items-center gap-2 hover:text-red-300 transition-colors"
                                     >
                                         <Trash2 size={16} /> Disconnect & Reset to Demo
                                     </button>
                                 </div>
                             )}
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
                            <h2 className="text-xl font-sketch font-bold text-green-400">
                                {activeTab === 'settings' ? 'Connected!' : 'System Updated'}
                            </h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
      </div>
    </div>
  );
};