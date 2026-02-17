import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  FileText, 
  BarChart3,
  Moon,
  Sun,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  Users,
  Database,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui';
import { useTheme } from '../theme-context';
import { Theme } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === Theme.DARK;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Manage body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-zinc-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-200 overflow-y-auto">
      {/* Navigation */}
      <nav className="h-[72px] border-b border-zinc-200/50 dark:border-zinc-800/50 bg-[#fafafa]/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-[200]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BarChart3 size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm tracking-tight font-extrabold uppercase leading-none">PSA Aurora</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-widest hidden xs:block">Provincial Office</span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-wider text-zinc-500">
            <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Statistics</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Services</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Updates</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 rounded-xl transition-all"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Button variant="primary" className="hidden sm:inline-flex px-6 rounded-xl text-xs uppercase tracking-widest" onClick={() => navigate('/dashboard')}>
              Admin Portal
            </Button>
            
            <button
              className="md:hidden p-2.5 text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 rounded-xl transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-[72px] left-0 w-full bottom-0 bg-white dark:bg-zinc-950 px-6 py-8 space-y-6 shadow-2xl z-40 animate-in slide-in-from-top duration-300 overflow-y-auto">
             <div className="flex flex-col space-y-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
               <a href="#" className="block px-2 py-3 hover:text-blue-600 dark:hover:text-white border-b border-zinc-50 dark:border-zinc-900">Statistics</a>
               <a href="#" className="block px-2 py-3 hover:text-blue-600 dark:hover:text-white border-b border-zinc-50 dark:border-zinc-900">Services</a>
               <a href="#" className="block px-2 py-3 hover:text-blue-600 dark:hover:text-white border-b border-zinc-50 dark:border-zinc-900">About Aurora</a>
             </div>
             <div className="pt-4">
               <Button variant="primary" className="w-full justify-center h-14 rounded-2xl text-xs uppercase tracking-[0.2em]" onClick={() => navigate('/dashboard')}>
                Access Dashboard
              </Button>
             </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-20 sm:pt-32 sm:pb-40 overflow-hidden px-4">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-full opacity-20 dark:opacity-10 pointer-events-none">
           <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-blue-500 blur-[120px] rounded-full"></div>
           <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md text-[11px] font-extrabold text-zinc-600 dark:text-zinc-400 mb-8 uppercase tracking-[0.2em] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Aurora Provincial Portal
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-[900] tracking-tighter mb-8 leading-[1.05] text-zinc-900 dark:text-white max-w-4xl">
            Streamlining <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Provincial Statistics</span> for Aurora.
          </h1>
          
          <p className="text-base sm:text-xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-2xl leading-relaxed font-medium">
            The central hub for civil registration, PhilSys management, and statistical analysis for the Province of Aurora.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-6">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="h-14 px-10 text-xs uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-2xl shadow-blue-500/30 rounded-2xl font-bold w-full sm:w-auto justify-center"
            >
              Enter Dashboard <ArrowRight className="ml-3 w-4 h-4" />
            </Button>
            <Button 
              className="h-14 px-8 text-xs uppercase tracking-[0.2em] variant-outline w-full sm:w-auto border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl justify-center font-bold"
            >
              Public Services
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { icon: FileText, title: 'Civil Registration', desc: 'Secure management of births, marriages, and deaths records.' },
              { icon: Users, title: 'PhilSys Hub', desc: 'Streamlined provincial enrollment and ID distribution tracking.' },
              { icon: Database, title: 'Data Analytics', desc: 'Comprehensive statistical insights for provincial planning.' }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 text-left hover:border-blue-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-6">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Trust Bar */}
          <div className="mt-32 w-full pt-12 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
             <div className="flex items-center gap-8 flex-wrap justify-center">
                <div className="flex items-center gap-2 font-bold text-sm tracking-widest uppercase">
                   <Building2 size={16} /> Regional Hub III
                </div>
                <div className="flex items-center gap-2 font-bold text-sm tracking-widest uppercase">
                   <ShieldCheck size={16} /> Data Privacy Act
                </div>
                <div className="flex items-center gap-2 font-bold text-sm tracking-widest uppercase">
                   <CheckCircle2 size={16} /> ISO 9001:2015
                </div>
             </div>
             <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">© 2024 PSA Aurora Provincial Office</p>
          </div>
        </div>
      </div>
    </div>
  );
};