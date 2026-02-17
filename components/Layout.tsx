import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  LogOut,
  Bell,
  BarChart3,
  HelpCircle,
  Building2,
  Share2,
  Home,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useTheme } from '../theme-context';
import { Theme } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to ensure overflow is reset if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Civil Registry', href: '/civil-reg', icon: FileText },
    { label: 'PhilSys ID', href: '/philsys', icon: Users },
    { label: 'Statistics', href: '/statistics', icon: BarChart3 },
    { label: 'Help Desk', href: '/docs', icon: HelpCircle },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black flex overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-[1000] w-[260px] bg-white dark:bg-[#09090b] border-r border-zinc-200/80 dark:border-zinc-800/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-[72px] flex items-center px-6 border-b border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-3 font-bold text-zinc-900 dark:text-white">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <BarChart3 size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm tracking-tight font-extrabold uppercase leading-none">PSA Aurora</span>
                <span className="text-[10px] text-zinc-900 dark:text-white font-bold uppercase mt-1 tracking-widest">Provincial Office</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto scrollbar-hide">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50 mb-6 transition-all"
            >
              <Home size={18} className="shrink-0" />
              Landing Page
            </NavLink>

            <div className="mb-4 px-3 text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-[0.2em]">
              Management
            </div>
            
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group
                  ${isActive 
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg shadow-zinc-950/10' 
                    : 'text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'}
                `}
              >
                <item.icon size={18} className={`shrink-0 transition-transform duration-300 group-hover:scale-110`} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 mb-4">
               <div className="flex items-center gap-3 mb-2">
                 <ShieldCheck size={16} className="text-blue-600" />
                 <span className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">System Status</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[11px] text-zinc-900 dark:text-white font-medium">All systems operational</span>
               </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <LogOut size={18} />
              Logout Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa] dark:bg-black">
        {/* Header */}
        <header className="h-[72px] flex items-center justify-between px-4 sm:px-8 border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0 z-[100] bg-[#fafafa]/80 dark:bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-900 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Aurora Provincial Server Active
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all w-48 lg:w-64"
              />
            </div>
            <button className="p-2.5 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#fafafa] dark:border-black"></span>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 rounded-xl transition-all"
            >
              {theme === Theme.DARK ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="h-[40px] w-[40px] rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center border border-blue-400/20 shadow-md cursor-pointer hover:scale-105 transition-transform">
              <span className="text-xs font-bold text-white uppercase">AO</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 scroll-smooth pb-safe">
          <div className="w-full max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};