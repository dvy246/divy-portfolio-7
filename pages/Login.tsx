import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Fingerprint, ArrowLeft, Database, Zap, CheckCircle, ServerCrash, Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Connection Setup State
  const [needsSetup, setNeedsSetup] = useState(false);
  const [dbUrl, setDbUrl] = useState('');
  const [dbKey, setDbKey] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [verificationMsg, setVerificationMsg] = useState('');

  useEffect(() => {
      // If supabase client is null, we force the setup screen
      if (!supabase) {
          setNeedsSetup(true);
      }
  }, []);

  // --- LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!supabase) {
        setNeedsSetup(true);
        setLoading(false);
        return;
    }

    const { error } = await (supabase.auth as any).signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/admin');
    }
    setLoading(false);
  };

  // --- SETUP LOGIC (From AdminDashboard) ---
  const handleVerifyConnection = async () => {
      setVerificationStatus('verifying');
      setVerificationMsg("Testing connection...");

      try {
          if (!dbUrl) throw new Error("Project URL is required.");
          if (!dbKey) throw new Error("API Key is required.");
          
          let cleanUrl = dbUrl.trim();
          if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
          cleanUrl = cleanUrl.replace(/\/+$/, '');

          const tempClient = createClient(cleanUrl, dbKey.trim());
          
          // Test query
          const { error } = await tempClient.from('profile').select('id', { count: 'exact', head: true });

          if (error && error.code !== '42P01') { // Ignore missing table error, connection is still good
             throw error;
          }

          setVerificationStatus('success');
          setVerificationMsg("✅ Connected successfully!");

      } catch (e: any) {
          setVerificationStatus('error');
          setVerificationMsg(e.message || "Connection failed");
      }
  };

  const handleSaveConnection = () => {
      localStorage.setItem('REACT_APP_SUPABASE_URL', dbUrl.trim());
      localStorage.setItem('REACT_APP_SUPABASE_ANON_KEY', dbKey.trim());
      window.location.reload();
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-dark bg-[length:40px_40px] opacity-20 pointer-events-none" />
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md relative z-10 bg-[#0a0a0a] border border-dark-accent/30 p-8 shadow-[0_0_50px_rgba(41,216,255,0.1)]"
            style={{ borderRadius: "2px 20px 2px 20px" }}
        >
            <div className="flex items-center gap-2 mb-8 text-dark-accent/50">
                <button onClick={() => navigate('/')} className="hover:text-dark-accent transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <span className="font-mono text-xs">
                    {needsSetup ? 'SYSTEM_CONFIGURATION' : 'SECURE_ACCESS_TERMINAL'}
                </span>
            </div>

            {needsSetup ? (
                // --- SETUP FORM ---
                <div className="space-y-6">
                    <div className="text-center mb-6">
                        <div className="inline-block p-4 rounded-full bg-blue-900/20 text-blue-400 mb-4 border border-blue-500/30">
                            <Database size={32} />
                        </div>
                        <h1 className="text-2xl font-sketch font-bold text-white">Connect Database</h1>
                        <p className="text-sm text-gray-500 mt-2">Enter your Supabase credentials to activate the Admin Panel.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-mono text-gray-500 uppercase block mb-1">Project URL</label>
                            <input 
                                type="text" 
                                value={dbUrl}
                                onChange={(e) => setDbUrl(e.target.value)}
                                placeholder="https://your-project.supabase.co"
                                className="w-full bg-black/50 border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-gray-500 uppercase block mb-1">API Key (Anon)</label>
                            <input 
                                type="password" 
                                value={dbKey}
                                onChange={(e) => setDbKey(e.target.value)}
                                placeholder="eyJh..."
                                className="w-full bg-black/50 border border-white/10 focus:border-dark-accent p-3 text-white outline-none rounded font-mono text-sm"
                            />
                        </div>
                    </div>

                    {/* Status Message */}
                    <AnimatePresence>
                        {verificationStatus !== 'idle' && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }}
                                className={`text-xs p-3 rounded border ${verificationStatus === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-green-900/20 border-green-500/30 text-green-300'}`}
                            >
                                {verificationMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={handleVerifyConnection}
                            disabled={verificationStatus === 'verifying'}
                            className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-white font-mono text-xs font-bold rounded flex items-center justify-center gap-2"
                        >
                            {verificationStatus === 'verifying' ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                            TEST
                        </button>
                        <button 
                            onClick={handleSaveConnection}
                            disabled={verificationStatus !== 'success'}
                            className="flex-1 py-3 bg-dark-accent text-black font-mono text-xs font-bold rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={14} />
                            SAVE & CONNECT
                        </button>
                    </div>
                </div>
            ) : (
                // --- LOGIN FORM ---
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="text-center mb-10">
                        <div className="inline-block p-4 rounded-full bg-dark-accent/10 text-dark-accent mb-4 border border-dark-accent/30">
                            <Lock size={32} />
                        </div>
                        <h1 className="text-3xl font-sketch font-bold text-white">Identity Verification</h1>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-dark-accent uppercase">User ID (Email)</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border-b border-dark-text/20 focus:border-dark-accent py-3 px-4 outline-none transition-colors font-mono text-white placeholder:text-gray-700"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-dark-accent uppercase">Passkey</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border-b border-dark-text/20 focus:border-dark-accent py-3 px-4 outline-none transition-colors font-mono text-white placeholder:text-gray-700"
                            placeholder="••••••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-sm font-mono flex items-start gap-2">
                            <ServerCrash size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full py-4 bg-dark-accent text-black font-bold font-sketch text-lg flex items-center justify-center gap-2 mt-4 hover:bg-white transition-colors"
                    >
                        {loading ? (
                            <span className="animate-pulse">AUTHENTICATING...</span>
                        ) : (
                            <>
                                <Fingerprint size={20} />
                                ACCESS DASHBOARD
                            </>
                        )}
                    </motion.button>
                    
                    <button 
                        type="button"
                        onClick={() => setNeedsSetup(true)}
                        className="w-full text-center text-xs text-gray-600 hover:text-dark-accent mt-4 font-mono transition-colors"
                    >
                        [ RESET CONNECTION SETTINGS ]
                    </button>
                </form>
            )}
        </motion.div>
    </div>
  );
};