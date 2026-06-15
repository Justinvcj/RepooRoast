import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ResultPage } from './pages/ResultPage';
import { SplashScreen } from './components/SplashScreen';

import { LayoutProvider, useLayout } from './contexts/LayoutContext';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { isNavbarVisible, isFooterVisible } = useLayout();

  useEffect(() => {
    // Hide splash screen after 2.2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#161b22', // surface color from Tailwind spec
            color: '#e6edf3',      // textPrimary
            border: '1px solid #30363d', // border
            borderRadius: '2.5rem',
            padding: '16px 24px'
          },
          success: {
            iconTheme: {
              primary: '#3fb950', // success
              secondary: '#e6edf3', // textPrimary
            },
          },
          error: {
            iconTheme: {
              primary: '#f85149', // danger
              secondary: '#e6edf3', // textPrimary
            },
          },
        }}
      />
      
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen">
        {isNavbarVisible && <Navbar />}
        {/* pt-24 ensures the content sits beneath the new floating pill Navbar */}
        <div className={`flex-grow ${isNavbarVisible ? 'pt-24' : ''}`}>
          <AnimatedRoutes />
        </div>
        {isFooterVisible && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutProvider>
        <AppContent />
      </LayoutProvider>
    </BrowserRouter>
  );
}

export default App;
