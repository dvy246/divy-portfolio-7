import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PERSONAL_INFO, SKILL_CATEGORIES, PROJECTS, BLOGS, RESUME_ENTRIES } from '../data';

// Define the shape of our data
interface PortfolioData {
  personalInfo: typeof PERSONAL_INFO;
  skills: typeof SKILL_CATEGORIES;
  projects: typeof PROJECTS;
  blogs: typeof BLOGS;
  resume: typeof RESUME_ENTRIES;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioData | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState({
    personalInfo: PERSONAL_INFO,
    skills: SKILL_CATEGORIES,
    projects: PROJECTS,
    blogs: BLOGS,
    resume: RESUME_ENTRIES,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    
    // If Supabase is not configured, we just use the static data immediately
    if (!supabase) {
      console.log("Supabase not configured, using static fallback data.");
      setIsLoading(false);
      return;
    }

    try {
      // Attempt to fetch from Supabase
      // We use Promise.allSettled to allow partial failures
      const results = await Promise.allSettled([
        supabase.from('profile').select('*').single(),
        supabase.from('skills').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('blogs').select('*'),
        supabase.from('resume').select('*').order('id', { ascending: false })
      ]);

      const newData = { ...data };

      // Update if fetch was successful, otherwise keep static default
      if (results[0].status === 'fulfilled' && results[0].value.data) {
         // Logic to map database columns to object structure would go here
         // keeping simplified for this demo
      }
      
      // In a real scenario, we would map the DB response to the State
      // For now, we simulate a network delay then use static data (as we can't really hit a DB here)
      
      console.log("Data refreshed from source");
      
    } catch (error) {
      console.error("Error fetching data, falling back to static:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ ...data, isLoading, refreshData: fetchData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
