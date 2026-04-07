import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ParticleBackground from '../UI/ParticleBackground';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="blob w-[500px] h-[500px] bg-primary-600/20 top-[-100px] left-[-100px]" style={{ animationDelay: '0s' }} />
        <div className="blob w-[400px] h-[400px] bg-accent-600/15 bottom-[-50px] right-[-50px]" style={{ animationDelay: '2s' }} />
        <div className="blob w-[300px] h-[300px] bg-neon-purple/10 top-[40%] left-[60%]" style={{ animationDelay: '4s' }} />
      </div>

      <ParticleBackground />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-[260px] relative z-10">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
