import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import ScraperPage from './pages/ScraperPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ResumePage from './pages/ResumePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(26,26,37,0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#30d158', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ff2d55', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="scraper" element={<ScraperPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
