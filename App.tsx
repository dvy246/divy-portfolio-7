import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Blogs } from './components/Blogs';
import { Contact } from './components/Contact';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { Resume } from './components/Resume';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { PortfolioProvider } from './context/PortfolioContext';
import { ShatteredGlassIntro } from './components/ShatteredGlassIntro';
import { ThorIntro } from './components/ThorIntro';

const MainPortfolio: React.FC<{ startHeroAnim: boolean }> = ({ startHeroAnim }) => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-0">
        {/* Pass the animation signal to Hero */}
        <Hero startAnimation={startHeroAnim} />
        <Skills />
        <Projects />
        <Resume />
        <Blogs />
        <Contact />
      </div>
    </>
  );
};

const AppContent: React.FC = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';
    
    // Intro State Management
    // Stages: 'thor' -> 'shatter' -> 'hero'
    const [showThor, setShowThor] = useState(false);
    const [showShatter, setShowShatter] = useState(false);
    const [triggerShatter, setTriggerShatter] = useState(false);
    const [introComplete, setIntroComplete] = useState(false);

    // Initial Intro Logic
    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem('full_intro_seen');
        if (!hasSeenIntro && !isAdminRoute) {
            // Start with Thor
            setShowThor(true);
            // Mount Shatter component immediately (behind Thor) so it's ready as a white background
            setShowShatter(true); 
            
            sessionStorage.setItem('full_intro_seen', 'true');
        } else {
            // Skip intro
            setIntroComplete(true);
        }
    }, [isAdminRoute]);

    const handleThorComplete = () => {
        // Thor has faded out, revealing the ShatteredGlassIntro (White screen) behind it.
        setShowThor(false);
        
        // Brief pause on the white screen, then shatter
        setTimeout(() => {
            setTriggerShatter(true);
        }, 100);
    };

    const handleShatterComplete = () => {
        setShowShatter(false);
        setIntroComplete(true); // Triggers Hero animations
    };

    // Force system cursor on Admin/Login pages
    useEffect(() => {
        if (isAdminRoute) {
            document.body.style.cursor = 'auto';
        } else {
            document.body.style.cursor = 'none';
        }
        return () => { document.body.style.cursor = 'none'; };
    }, [isAdminRoute]);

    return (
        <main className="relative min-h-screen w-full overflow-x-hidden selection:bg-light-accent selection:text-white dark:selection:bg-dark-accent dark:selection:text-black">
          {!isAdminRoute && <CustomCursor />}
          {!isAdminRoute && <ScrollProgress />}

          {/* 1. THOR INTRO (Top Layer) */}
          {showThor && (
              <ThorIntro onComplete={handleThorComplete} />
          )}

          {/* 2. SHATTERED GLASS INTRO (Middle Layer) */}
          {/* We keep this mounted while Thor plays so the white background is ready when Thor fades out */}
          {showShatter && (
              <ShatteredGlassIntro 
                  triggerShatter={triggerShatter} 
                  onComplete={handleShatterComplete} 
              />
          )}
          
          <Routes>
            <Route path="/" element={<MainPortfolio startHeroAnim={introComplete} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<MainPortfolio startHeroAnim={introComplete} />} />
          </Routes>
        </main>
    )
}

const App: React.FC = () => {
  return (
    <Router>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </Router>
  );
};

export default App;
