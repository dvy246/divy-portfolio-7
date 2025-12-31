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
  // Initial state uses the static data.ts as the default fallback
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
      console.info("Supabase not connected. Using static fallback data.");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch Profile and Projects in parallel
      const [profileResult, projectsResult] = await Promise.allSettled([
        supabase.from('profile').select('*').single(),
        supabase.from('projects').select('*').order('id', { ascending: false }),
      ]);

      // 1. Handle Profile Data
      // If we get a valid row, we override the static PERSONAL_INFO
      if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        const dbProfile = profileResult.value.data;
        setData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo, // Keep existing defaults for fields not in DB
            name: dbProfile.name || prev.personalInfo.name,
            title: dbProfile.title || prev.personalInfo.title,
            headline: dbProfile.headline || prev.personalInfo.headline,
            subHeadline: dbProfile.sub_headline || prev.personalInfo.subHeadline,
            avatarUrl: dbProfile.avatar_url || prev.personalInfo.avatarUrl,
            email: dbProfile.email || prev.personalInfo.email,
            // Assuming dbProfile.socials is stored as JSONB
            socials: dbProfile.socials || prev.personalInfo.socials
          }
        }));
      }

      // 2. Handle Projects Data
      // If we get rows, we override the static PROJECTS array
      if (projectsResult.status === 'fulfilled' && projectsResult.value.data && projectsResult.value.data.length > 0) {
        const dbProjects = projectsResult.value.data.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            // Postgres Arrays come back as arrays, but handle null just in case
            tags: p.tags || [], 
            image: p.image_url || "https://picsum.photos/600/400?grayscale",
            liveLink: p.live_link || "#",
            githubLink: p.github_link || "#"
        }));
        
        setData(prev => ({
            ...prev,
            projects: dbProjects
        }));
      }

    } catch (error) {
      console.error("Unexpected error fetching data (using fallback):", error);
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