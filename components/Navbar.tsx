import React from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { NAVIGATION_LINKS } from '../data';

export const Navbar: React.FC = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-light-bg/80 dark:bg-dark-bg/80 border-b border-black/5 dark:border-white/5"
    >
      <a href="#" className="text-2xl font-sketch font-bold text-light-accent dark:text-dark-accent">
        TheBlueprint
      </a>

      <div className="hidden md:flex items-center gap-8 font-sketch text-lg">
        {NAVIGATION_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="relative group text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent transition-colors"
          >
            {link.name}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-light-accent dark:bg-dark-accent transition-all group-hover:w-full"></span>
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-5 py-2 border-2 border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent font-sketch rounded-[255px_15px_225px_15px/15px_225px_15px_255px] hover:bg-light-accent hover:text-white dark:hover:bg-dark-accent dark:hover:text-black transition-colors"
        >
            Contact Me
        </motion.a>
      </div>
    </motion.nav>
  );
};