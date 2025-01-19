import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { initializeCredits } from '@/store/slices/creditsSlice';
import { CreditsProvider } from '@/contexts/CreditsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Dashboard } from '@/pages/Dashboard';
import { Settings } from '@/pages/Settings';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeCredits({ type: 'ip' }));
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <CreditsProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
            <Toaster position="top-center" />
          </CreditsProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;