import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ResultPage } from './pages/ResultPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DesignReviewPage } from './pages/DesignReviewPage';
import { SplashScreen } from './components/SplashScreen';

import { LayoutProvider, useLayout } from './contexts/LayoutContext';

import { ErrorBoundary } from './components/ErrorBoundary';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/design" element={<DesignReviewPage />} />
          <Route path="/design/logo" element={<Navigate to="/design" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
};

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { isNavbarVisible, isFooterVisible } = useLayout();

  useEffect(() => {
    // Synchronize splash screen with 1.4s logo assembly animation + 200ms settled view
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'var(--surface-elevated, #1F242E)',
            color: 'var(--text-primary, #F0F3F6)',
            border: '1px solid var(--border-hairline, #222733)',
            borderRadius: '8px',
            padding: '16px 24px',
            fontFamily: 'inherit',
          },
          success: {
            iconTheme: {
              primary: 'var(--data-success, #10B981)',
              secondary: 'var(--surface-elevated, #1F242E)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--data-critical, #EF4444)',
              secondary: 'var(--surface-elevated, #1F242E)',
            },
          },
        }}
      />
      
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen supports-[height:100dvh]:min-h-[100dvh]">
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
