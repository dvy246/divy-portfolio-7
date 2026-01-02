import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PERSONAL_INFO, SKILL_CATEGORIES, PROJECTS, BLOGS, RESUME_ENTRIES, CERTIFICATES } from '../data';

// Define the shape of our data
interface PortfolioData {
  personalInfo: typeof PERSONAL_INFO;
  skills: typeof SKILL_CATEGORIES;
  projects: typeof PROJECTS;
  certificates: typeof CERTIFICATES;
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
    certificates: CERTIFICATES,
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
      // Fetch data in parallel
      const [profileResult, projectsResult, resumeResult, blogsResult, certsResult] = await Promise.allSettled([
        supabase.from('profile').select('*').limit(1).maybeSingle(),
        supabase.from('projects').select('*').order('id', { ascending: false }),
        supabase.from('resume').select('*').order('period', { ascending: false }),
        supabase.from('blogs').select('*').order('date', { ascending: false }),
        supabase.from('certificates').select('*').order('id', { ascending: false }),
      ]);

      // 1. Handle Profile Data
      if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        const dbProfile = profileResult.value.data;
        setData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            name: dbProfile.name || prev.personalInfo.name,
            title: dbProfile.title || prev.personalInfo.title,
            headline: dbProfile.headline || prev.personalInfo.headline,
            subHeadline: dbProfile.sub_headline || prev.personalInfo.subHeadline,
            avatarUrl: dbProfile.avatar_url || prev.personalInfo.avatarUrl,
            email: dbProfile.email || prev.personalInfo.email,
            socials: dbProfile.socials || prev.personalInfo.socials
          }
        }));
      }

      // 2. Handle Projects Data
      if (projectsResult.status === 'fulfilled' && projectsResult.value.data) {
        const dbProjects = projectsResult.value.data.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            tags: p.tags || [], 
            image: p.image_url || "https://picsum.photos/600/400?grayscale",
            liveLink: p.live_link || "#",
            githubLink: p.github_link || "#"
        }));
        
        // Only override if we actually got projects back, otherwise keep default/sample
        if (dbProjects.length > 0) {
            setData(prev => ({ ...prev, projects: dbProjects }));
        }
      }

      // 3. Handle Resume Data
      if (resumeResult.status === 'fulfilled' && resumeResult.value.data) {
          const dbResume = resumeResult.value.data.map((r: any) => ({
              id: r.id,
              type: r.type,
              title: r.title,
              company: r.company,
              period: r.period,
              description: r.description,
              tags: r.tags || []
          }));
          if (dbResume.length > 0) {
            setData(prev => ({ ...prev, resume: dbResume }));
          }
      }

      // 4. Handle Blogs Data
      if (blogsResult.status === 'fulfilled' && blogsResult.value.data) {
          const dbBlogs = blogsResult.value.data.map((b: any) => ({
              id: b.id,
              title: b.title,
              date: b.date,
              link: b.link
          }));
          if (dbBlogs.length > 0) {
            setData(prev => ({ ...prev, blogs: dbBlogs }));
          }
      }

      // 5. Handle Certificates Data
      if (certsResult.status === 'fulfilled' && certsResult.value.data) {
          const dbCerts = certsResult.value.data.map((c: any) => ({
              id: c.id,
              title: c.title,
              issuer: c.issuer,
              date: c.date,
              image: c.image_url || "https://picsum.photos/600/400?grayscale",
              link: c.link || "#"
          }));
          if (dbCerts.length > 0) {
            setData(prev => ({ ...prev, certificates: dbCerts }));
          }
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