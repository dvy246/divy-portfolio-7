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
      console.info("Info: Supabase keys not found. App running in Static Demo Mode. Configure keys in Admin Dashboard to connect to live DB.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Connecting to Supabase...");
      // Attempt to fetch from Supabase
      // We use Promise.allSettled to allow partial failures
      const results = await Promise.allSettled([
        supabase.from('profile').select('*').single(),
        supabase.from('skills').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('blogs').select('*'),
        supabase.from('resume').select('*').order('id', { ascending: false })
      ]);

      // In a real implementation, we would map the 'results' to the state here.
      // Since this is likely a demo without a real populated DB matching the schema exactly,
      // we might want to keep using static data if the DB returns empty.
      
      // For this portfolio template, we will log success but keep static data 
      // unless you implement the specific mapping logic based on your DB schema.
      const successfulFetches = results.filter(r => r.status === 'fulfilled');
      if (successfulFetches.length > 0) {
          console.log(`Successfully connected to Supabase! Fetched ${successfulFetches.length} tables.`);
      }

      // To actually use DB data, you would do:
      // if (results[0].status === 'fulfilled' && results[0].value.data) setData(prev => ({...prev, personalInfo: results[0].value.data}));
      
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