import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Blogs: React.FC = () => {
  const { blogs } = usePortfolio();

  return (
    <section id="blogs" className="py-20 px-4 bg-light-bg dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-sketch font-bold mb-12 text-light-accent dark:text-dark-accent"
        >
            Thoughts
        </motion.h2>

        <div className="space-y-2">
          {blogs.map((blog, index) => (
            <motion.a
              key={blog.id}
              href={blog.link}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group block relative py-6 px-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 relative z-10">
                <h3 className="text-xl md:text-2xl font-sans font-medium group-hover:text-light-accent dark:group-hover:text-dark-accent transition-colors">
                    {blog.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-light-text/50 dark:text-dark-text/50 font-mono">
                    <span>{blog.date}</span>
                    <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
              
              {/* The Blue Strikethrough/Underline effect */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-light-text/10 dark:bg-dark-text/10" />
              <motion.div 
                className="absolute bottom-0 left-0 h-[1px] bg-light-accent dark:bg-dark-accent w-0 group-hover:w-full transition-all duration-500 ease-out"
              />
              {/* Middle strike on hover for artistic effect */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-light-accent dark:bg-dark-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-20" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
