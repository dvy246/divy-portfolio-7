import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Fingerprint, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Fallback mode logic for demo since Supabase might not be connected
    if (!supabase) {
        if(email === 'admin@demo.com' && password === 'demo') {
            navigate('/admin');
        } else {
            setError('Demo Mode: Use admin@demo.com / demo');
        }
        setLoading(false);
        return;
    }

    const { error } = await supabase.auth.signInWithPassword({
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
                <span className="font-mono text-xs">SECURE_ACCESS_TERMINAL_V1</span>
            </div>

            <div className="text-center mb-10">
                <div className="inline-block p-4 rounded-full bg-dark-accent/10 text-dark-accent mb-4 border border-dark-accent/30">
                    <Lock size={32} />
                </div>
                <h1 className="text-3xl font-sketch font-bold text-white">Identity Verification</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-dark-accent uppercase">User ID (Email)</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border-b border-dark-text/20 focus:border-dark-accent py-3 px-4 outline-none transition-colors font-mono text-white placeholder:text-gray-700"
                        placeholder="enter_email_address..."
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
                    <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-sm font-mono">
                        ERR: {error}
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
            </form>
        </motion.div>
    </div>
  );
};
