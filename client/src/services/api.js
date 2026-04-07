import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 120000,
});

// Request interceptor - add auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobify_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Jobs ────────────────────────────────────────────────────
export const fetchJobs = (params) => API.get('/jobs', { params });
export const fetchJob = (id) => API.get(`/jobs/${id}`);
export const updateJobStatus = (id, status) => API.patch(`/jobs/${id}/status`, { status });
export const updateJob = (id, data) => API.patch(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const bulkAction = (ids, action) => API.post('/jobs/bulk-action', { ids, action });
export const fetchJobStats = () => API.get('/jobs/stats/overview');

// ── Scraper ─────────────────────────────────────────────────
export const startScraping = (data) => API.post('/scraper/start', data);
export const getScraperStatus = () => API.get('/scraper/status');

// ── User ────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);
export const updateMasterResume = (data) => API.put('/users/master-resume', data);

// ── Analytics ───────────────────────────────────────────────
export const fetchAnalytics = () => API.get('/analytics/overview');

export default API;
