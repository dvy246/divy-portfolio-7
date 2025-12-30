import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Linkedin, Github, Twitter } from 'lucide-react';
import { PERSONAL_INFO } from '../data';

export const Contact: React.FC = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending
        console.log(formState);
        alert("Thanks for the message! (This is a demo)");
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
            <div className="flex gap-8">
                <a href={PERSONAL_INFO.socials.github} className="text-light-text/50 dark:text-dark-text/50 hover:text-light-accent dark:hover:text-dark-accent transition-colors"><Github /></a>
                <a href={PERSONAL_INFO.socials.twitter} className="text-light-text/50 dark:text-dark-text/50 hover:text-light-accent dark:hover:text-dark-accent transition-colors"><Twitter /></a>
                <a href={PERSONAL_INFO.socials.linkedin} className="text-light-text/50 dark:text-dark-text/50 hover:text-light-accent dark:hover:text-dark-accent transition-colors"><Linkedin /></a>
            </div>
            <p className="text-sm font-mono text-light-text/40 dark:text-dark-text/40">
                &copy; {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
            </p>
        </footer>
      </div>
    </section>
  );
};