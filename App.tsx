import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

const MainPortfolio: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-0">
        <Hero />
        <Skills />
        <Projects />
        <Resume />
        <Blogs />
        <Contact />
      </div>
    </>
  );
};

// Wrapper to hide cursor/scroll progress on Admin routes
const AppContent: React.FC = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

    return (
        <main className="relative min-h-screen w-full overflow-x-hidden selection:bg-light-accent selection:text-white dark:selection:bg-dark-accent dark:selection:text-black">
          {!isAdminRoute && <CustomCursor />}
          {!isAdminRoute && <ScrollProgress />}
          
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<MainPortfolio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* ⚠️ CATCH-ALL ROUTE: This fixes the Black Screen if path is weird */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
    )
}

const App: React.FC = () => {
  return (
    // Switched to HashRouter for robust client-side routing
    <Router>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </Router>
  );
};

export default App;
