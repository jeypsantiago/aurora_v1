import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme-context';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { RecordPage } from './pages/RecordPage';
import { SupplyPage } from './pages/SupplyPage';
import { SettingsPage } from './pages/SettingsPage';

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

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Routes (Wrapped in Layout) */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/civil-reg" element={<Layout><RecordPage /></Layout>} />
          <Route path="/philsys" element={<Layout><SupplyPage /></Layout>} />
          <Route path="/statistics" element={<Layout><PlaceholderPage title="Property & Assets" /></Layout>} />
          <Route path="/office" element={<Layout><PlaceholderPage title="Office Information" /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;