import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Linkedin, Github, Twitter } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

// Simple SVG Component for Medium since it's not standard in all icon sets
const MediumIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537V7.794l-5.389 13.688h-.728l-6.275-13.688v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404H1v-.404l2.521-3.058c.27-.279.39-.67.325-1.052v-10.608z" />
    </svg>
);

export const Contact: React.FC = () => {
    const { personalInfo } = usePortfolio();
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Construct Mailto Link
        const recipient = "yadavdipu296@gmail.com";
        const subject = `Portfolio Inquiry from ${formState.name}`;
        const body = `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`;
        
        // Encode and redirect
        window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Optional: Clear form or show success feedback
        setFormState({ name: '', email: '', message: '' });
    };

    const inputClasses = "w-full bg-transparent border-b-2 border-light-text/20 dark:border-dark-text/20 py-3 focus:outline-none focus:border-light-accent dark:focus:border-dark-accent transition-colors font-sans text-lg placeholder:text-light-text/30 dark:placeholder:text-dark-text/30";

  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
             <h2 className="text-5xl font-sketch font-bold mb-4">Let's Connect</h2>
             <p className="text-light-text/60 dark:text-dark-text/60">Have an idea? Let's sketch it out together.</p>
        </motion.div>

        <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-8 mb-20"
        >
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <input 
                        type="text" 
                        placeholder="Your Name" 
                        className={inputClasses}
                        value={formState.name}
                        onChange={e => setFormState({...formState, name: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <input 
                        type="email" 
                        placeholder="Your Email" 
                        className={inputClasses}
                        value={formState.email}
                        onChange={e => setFormState({...formState, email: e.target.value})}
                        required
                    />
                </div>
            </div>
            <div>
                <textarea 
                    rows={4} 
                    placeholder="Tell me about your project..." 
                    className={inputClasses}
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                    required
                />
            </div>
            
            <div className="flex justify-center">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-12 py-4 bg-light-text dark:bg-dark-text text-white dark:text-black font-sketch font-bold text-xl flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
                    style={{
                        borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px"
                    }}
                >
                    <span className="relative z-10">Send Message</span>
                    <Send size={20} className="relative z-10" />
                    <div className="absolute inset-0 bg-light-accent dark:bg-dark-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </motion.button>
            </div>
        </motion.form>

        <footer className="border-t border-light-text/10 dark:border-dark-text/10 pt-10 flex flex-col items-center gap-6">
            <div className="flex gap-8 items-center">
                <a href={personalInfo.socials.github} target="_blank" rel="noreferrer" className="text-light-text/50 dark:text-dark-text/50 hover:text-light-accent dark:hover:text-dark-accent transition-colors"><Github /></a>
                <a href={personalInfo.socials.twitter} target="_blank" rel="noreferrer" className="text-light-text/50 dark:text-dark-text/50 hover:text-light-accent dark:hover:text-dark-accent transition-colors"><Twitter /></a>
                <a href={personalInfo.socials.linkedin} target="_blank" rel="noreferrer" className="text-light-text/50 dark:text-dark-text/50 hover:text-light-accent dark:hover:text-dark-accent transition-colors"><Linkedin /></a>
                <a href={personalInfo.socials.medium} target="_blank" rel="noreferrer" className="text-light-text/50 dark:text-dark-text/50 hover:text-light-accent dark:hover:text-dark-accent transition-colors"><MediumIcon className="w-6 h-6" /></a>
            </div>
            <p className="text-sm font-mono text-light-text/40 dark:text-dark-text/40">
                &copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
            </p>
        </footer>
      </div>
    </section>
  );
};