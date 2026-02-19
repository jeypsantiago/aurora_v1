import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme-context';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { RecordPage } from './pages/RecordPage';
import { SupplyPage } from './pages/SupplyPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Placeholder components for other routes
interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => (
  <div className="py-12 flex flex-col items-center justify-center text-center">
    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{title}</h2>
    <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
      This module is currently under development. Please check back later for updates.
    </p>
  </div>
);

import { DialogProvider } from './DialogContext';
import { UserProvider } from './UserContext';
import { RbacProvider } from './RbacContext';
import { GoogleAuthProvider } from './components/GoogleAuthProvider';
import { GmailHub } from './pages/GmailHub';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GoogleAuthProvider>
        <UserProvider>
          <RbacProvider>
            <DialogProvider>
              <Router>
                <Routes>
                  {/* Public Route */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Protected Routes (Wrapped in Layout + ProtectedRoute) */}
                  <Route path="/dashboard" element={<Layout><ProtectedRoute requires="dashboard.view"><Dashboard /></ProtectedRoute></Layout>} />
                  <Route path="/records" element={<Layout><ProtectedRoute requires="records.view"><RecordPage /></ProtectedRoute></Layout>} />
                  <Route path="/supplies" element={<Layout><ProtectedRoute requires="supply.view"><SupplyPage /></ProtectedRoute></Layout>} />
                  <Route path="/gmail" element={<Layout><ProtectedRoute requires="gmail.view"><GmailHub /></ProtectedRoute></Layout>} />
                  <Route path="/properties" element={<Layout><ProtectedRoute requires="property.view"><PlaceholderPage title="Property & Assets" /></ProtectedRoute></Layout>} />
                  <Route path="/office" element={<Layout><ProtectedRoute requires="dashboard.view"><PlaceholderPage title="Office Information" /></ProtectedRoute></Layout>} />
                  <Route path="/profile" element={<Layout><ProtectedRoute><ProfilePage /></ProtectedRoute></Layout>} />
                  <Route path="/settings" element={<Layout><ProtectedRoute requires="settings.view"><SettingsPage /></ProtectedRoute></Layout>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </DialogProvider>
          </RbacProvider>
        </UserProvider>
      </GoogleAuthProvider>
    </ThemeProvider>
  );
};


export default App;