
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
  Users,
  Database,
  ChevronRight,
  MapPin,
  Lock,
  Fingerprint,
  ArrowUpRight,
  Scale,
  Activity,
  Globe,
  ExternalLink,
  Zap,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { useTheme } from '../theme-context';
import { Theme } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === Theme.DARK;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Updates', href: '#updates' },
    { name: 'Charter', href: '#charter' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#020202] text-zinc-900 dark:text-zinc-100 selection:bg-blue-600/30 transition-colors duration-1000 overflow-x-hidden font-sans">
      
      {/* Dynamic Aurora Mesh Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500 mesh-glow rounded-full animate-float"></div>
        <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-indigo-500 mesh-glow rounded-full animate-float-reverse"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-400 mesh-glow rounded-full animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-grid opacity-[0.2] dark:opacity-[0.1]"></div>
      </div>

      {/* Professional Smooth Navigation */}
      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-700 px-4 sm:px-12 ${
        scrolled ? 'pt-4' : 'pt-8'
      }`}>
        <div className={`max-w-7xl mx-auto h-16 sm:h-20 flex items-center justify-between px-8 rounded-[24px] transition-all duration-700 ${
          scrolled 
          ? 'glass border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-black/5 scale-[0.98]' 
          : 'bg-transparent border-transparent scale-100'
        }`}>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-blue-600 rounded-[14px] flex items-center justify-center text-white shadow-xl shadow-blue-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <BarChart3 size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-[900] uppercase tracking-tighter">PSA Aurora</span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-1.5 opacity-60">Provincial Hub</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            {navLinks.map((link, idx) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="hover:text-blue-600 dark:hover:text-white transition-all relative group py-1 animate-reveal-right opacity-0"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-blue-600 rounded-full group-hover:w-full transition-all duration-500"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-2xl transition-all active:scale-90"
            >
              {isDark ? <Sun size={20} className="animate-spin-slow" /> : <Moon size={20} />}
            </button>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2 hidden sm:block" />
            <Button 
              variant="blue" 
              className="h-12 rounded-[18px] px-8 text-[11px] font-bold uppercase tracking-widest hidden sm:flex active:scale-95 shadow-2xl shadow-blue-500/20 group overflow-hidden" 
              onClick={() => navigate('/dashboard')}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Lock size={14} className="group-hover:translate-x-0.5 transition-transform" /> Access Portal
              </span>
            </Button>
            <button className="lg:hidden p-3 text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Cinematic Balanced Hero Section */}
      <section className="relative pt-44 pb-20 sm:pt-60 sm:pb-32 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border border-zinc-200 dark:border-zinc-800 shadow-sm animate-reveal-left opacity-0 stagger-1">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.4em]">Official Provincial Repository • Region III</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-[1000] tracking-tight leading-[1.05] text-zinc-900 dark:text-white animate-reveal opacity-0 stagger-2">
            Pioneering Provincial <br />
            <span className="text-blue-600 bg-clip-text">Data Integrity.</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed animate-reveal opacity-0 stagger-3">
            Trusted civil registration and accurate regional statistics for every citizen of the resilient province of Aurora, Philippines.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 animate-reveal opacity-0 stagger-4">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="h-16 px-12 rounded-[24px] text-[12px] font-bold uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/30 active:scale-95 group"
            >
              Staff Dashboard <ArrowRight size={18} className="ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button variant="outline" className="h-16 px-12 rounded-[24px] text-[12px] font-bold uppercase tracking-[0.2em] group hover:bg-zinc-50 dark:hover:bg-zinc-900">
              Public Portal <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Dynamic Stats Grid - Staggered Appearance */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 w-full animate-reveal opacity-0 stagger-5">
          {[
            { icon: Users, label: 'Registered', val: '214K+', color: 'text-blue-600' },
            { icon: Activity, label: 'Sync Status', val: '100%', color: 'text-emerald-500' },
            { icon: MapPin, label: 'Districts', val: '8 Units', color: 'text-indigo-500' },
            { icon: Database, label: 'Reliability', val: '99.9%', color: 'text-blue-500' },
          ].map((stat, i) => (
            <div key={i} className="glass p-8 rounded-[40px] border border-zinc-200/50 dark:border-zinc-800/50 hover-lift group cursor-default transition-all shadow-xl shadow-black/5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 mx-auto flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <stat.icon size={22} className={`${stat.color} transition-colors duration-500`} />
              </div>
              <span className="text-3xl font-black block tracking-tighter mb-2">{stat.val}</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Refined Bento Grid with Motion */}
      <section id="services" className="py-28 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10 animate-reveal opacity-0 stagger-1">
           <div className="space-y-4">
             <h2 className="text-[12px] font-bold uppercase tracking-[0.5em] text-blue-600">Core Architecture</h2>
             <h3 className="text-4xl sm:text-6xl font-[1000] tracking-tight">The Provincial Hub.</h3>
           </div>
           <p className="max-w-md text-zinc-500 dark:text-zinc-400 text-lg font-medium leading-relaxed">
             Centralized management for the 8 municipalities of Aurora, optimized for speed and maximum data security.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main Module - Registry */}
          <div className="lg:col-span-2 p-12 rounded-[56px] bg-blue-600 text-white relative group overflow-hidden shadow-2xl shadow-blue-600/20 animate-reveal opacity-0 stagger-2">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000" />
            <ShieldCheck size={48} className="mb-12 opacity-80 group-hover:scale-110 transition-transform" />
            <h4 className="text-4xl font-[1000] mb-4 tracking-tight">Registry Archive</h4>
            <p className="text-blue-100 text-lg font-medium leading-relaxed mb-12 max-w-sm">Official archival of Birth, Marriage, and Death certificates with province-wide encrypted lookup.</p>
            <Button className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 text-[11px] font-bold uppercase tracking-[0.25em] rounded-2xl shadow-xl transition-all active:scale-95">
              Launch Search Engine
            </Button>
          </div>

          {/* PhilSys Integration */}
          <div className="p-10 rounded-[56px] glass border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 transition-all flex flex-col justify-between shadow-sm animate-reveal opacity-0 stagger-3">
            <Fingerprint size={36} className="text-blue-600 mb-10 group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="text-2xl font-[900] tracking-tight mb-3">PhilSys Sync</h4>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-8">Direct provincial access for National ID registration and automated municipal verification.</p>
              <Badge variant="info" className="px-4 py-1">Online</Badge>
            </div>
          </div>

          {/* Logistics Module */}
          <div className="p-10 rounded-[56px] bg-zinc-950 text-white relative group overflow-hidden shadow-2xl animate-reveal opacity-0 stagger-4">
            <Database size={36} className="text-blue-500 mb-10 group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="text-2xl font-[900] tracking-tight mb-3">Property Logistics</h4>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-8">Supply inventory control and provincial asset management for district offices.</p>
              <button className="text-[11px] font-bold text-blue-500 flex items-center gap-3 uppercase tracking-widest group-hover:gap-5 transition-all">
                Control Center <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Statistics Unit */}
          <div className="lg:col-span-2 p-12 rounded-[56px] glass border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-12 group shadow-sm animate-reveal opacity-0 stagger-5">
             <div className="w-24 h-24 rounded-[32px] bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-500/20 group-hover:rotate-6 transition-transform">
                <BarChart3 size={40} />
             </div>
             <div className="flex-1 space-y-4">
                <h4 className="text-3xl font-[1000] tracking-tight uppercase">Statistical Analytics</h4>
                <p className="text-lg text-zinc-500 font-medium leading-relaxed">Provincial economic mapping, census processing, and demographics analysis hub.</p>
                <div className="flex items-center gap-4 pt-2">
                   <Badge variant="success" className="px-4">Live Q4 Data</Badge>
                   <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Global Sync Status: Healthy</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Professional Smooth Updates Feed */}
      <section id="updates" className="py-28 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5 space-y-10 animate-reveal opacity-0 stagger-1">
             <div className="space-y-4">
               <h2 className="text-[12px] font-bold uppercase tracking-[0.5em] text-blue-600">Provincial Newsroom</h2>
               <h3 className="text-4xl lg:text-6xl font-[1000] tracking-tight leading-[1.1]">The Latest <br /> Advisories.</h3>
             </div>
             <p className="text-xl text-zinc-500 font-medium leading-relaxed">Stay updated with official schedules, mobile mission routes, and public notices from PSA Aurora.</p>
             <div className="flex items-center gap-4 pt-2">
               <Button variant="blue" className="h-14 px-10 rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] shadow-2xl shadow-blue-500/20 active:scale-95">All Bulletins</Button>
               <Button variant="ghost" className="h-14 px-8 rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-zinc-100">Archives</Button>
             </div>
          </div>
          
          <div className="lg:col-span-7 space-y-4">
             {[
               { title: 'Digital Census 2025: Aurora Pilot Program Launch', tag: 'Strategic', date: '31 Dec 2024', icon: Zap },
               { title: 'New PhilSys Kiosks deployed in Dilasag & Dingalan', tag: 'Deployment', date: '28 Dec 2024', icon: MapPin },
               { title: 'Registry Modernization Summit 2025: Key Results', tag: 'Research', date: '20 Dec 2024', icon: FileText },
               { title: 'Baler Provincial Office Schedule: Year-End Notice', tag: 'Advisory', date: '15 Dec 2024', icon: Calendar },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-8 rounded-[40px] glass border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:shadow-2xl hover:shadow-black/5 transition-all group cursor-pointer animate-reveal opacity-0" style={{ animationDelay: `${700 + i * 150}ms` }}>
                  <div className="flex items-center gap-6 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 transition-all shrink-0">
                      <item.icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant={i === 0 ? 'info' : 'default'} className="!text-[9px] h-5 px-3 uppercase">{item.tag}</Badge>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.date}</span>
                      </div>
                      <span className="text-lg sm:text-xl font-[900] text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors leading-snug truncate block">{item.title}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all group-hover:translate-x-2 shrink-0 ml-6">
                    <ChevronRight size={20} />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Professional Cinematic Footer */}
      <footer id="contact" className="relative mt-20 pt-32 pb-16 px-6 sm:px-12 bg-zinc-950 text-white rounded-t-[64px] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-20 pb-20 border-b border-white/5">
             <div className="lg:col-span-5 space-y-12 animate-reveal opacity-0 stagger-1">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <BarChart3 size={24} />
                  </div>
                  <span className="text-2xl font-[1000] uppercase tracking-tighter">PSA Aurora Office</span>
                </div>
                <p className="text-3xl sm:text-5xl font-[1000] tracking-tighter leading-none text-zinc-500">
                  Integrity in data. <br /> 
                  <span className="text-white">Service in Aurora.</span>
                </p>
                <div className="flex items-center gap-4 pt-4">
                   {['FB', 'X', 'LI'].map(s => <button key={s} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-[900] hover:bg-white hover:text-black transition-all active:scale-95 shadow-xl">{s}</button>)}
                </div>
             </div>

             <div className="lg:col-span-4 grid grid-cols-2 gap-12 animate-reveal opacity-0 stagger-2">
                <div className="space-y-8">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-blue-500">Connectivity</h4>
                  <ul className="text-lg font-bold text-zinc-400 space-y-5">
                    <li className="hover:text-white cursor-pointer transition-colors">(042) 724-4389</li>
                    <li className="hover:text-white cursor-pointer transition-colors">aurora@psa.gov.ph</li>
                  </ul>
                </div>
                <div className="space-y-8">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-blue-500">Headquarters</h4>
                  <ul className="text-lg font-bold text-zinc-400 space-y-5 leading-snug">
                    <li>N. Roxas St., Suklayin</li>
                    <li>Baler, Aurora 3200</li>
                  </ul>
                </div>
             </div>

             <div className="lg:col-span-3 animate-reveal opacity-0 stagger-3">
                <div className="p-10 rounded-[48px] glass border border-white/10 space-y-8 group hover:border-blue-500/40 transition-all cursor-pointer">
                   <div className="flex items-center gap-4">
                     <Globe size={20} className="text-blue-500 animate-pulse" />
                     <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Official Portal</p>
                   </div>
                   <p className="text-lg font-bold leading-relaxed">Explore the Philippine Statistics Authority National Website.</p>
                   <a href="https://psa.gov.ph" target="_blank" className="flex items-center justify-between text-[11px] font-[900] uppercase tracking-widest text-blue-400 hover:text-white transition-all pt-4 border-t border-white/10">
                     Explore Main <ExternalLink size={16} />
                   </a>
                </div>
             </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-10 animate-reveal opacity-0 stagger-4">
            <div className="flex items-center gap-10 text-[10px] font-[900] uppercase tracking-[0.5em] text-zinc-700">
               <span className="hover:text-zinc-300 cursor-pointer transition-colors">Transparency Seal</span>
               <span className="hover:text-zinc-300 cursor-pointer transition-colors">Data Privacy</span>
               <span className="hover:text-zinc-300 cursor-pointer transition-colors">Accessibility</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 text-center lg:text-right">
              © 2024 REPUBLIC OF THE PHILIPPINES • PSA AURORA PROVINCIAL OFFICE • REGION III
            </p>
          </div>
        </div>
      </footer>

      {/* Professional Kinetic Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[2000] glass dark:bg-[#020202] p-10 flex flex-col animate-in slide-in-from-right duration-700 ease-out">
           <div className="flex justify-between items-center mb-20">
             <div className="w-12 h-12 bg-blue-600 rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                <BarChart3 size={24} strokeWidth={2.5} />
             </div>
             <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800"><X size={32} /></button>
           </div>
           <div className="flex flex-col gap-10 text-6xl font-[1000] tracking-tighter">
             {navLinks.map((l, idx) => (
               <a 
                key={l.name} 
                href={l.href} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="hover:text-blue-600 transition-all translate-x-0 hover:translate-x-4 animate-reveal-left opacity-0"
                style={{ animationDelay: `${idx * 100}ms` }}
               >
                 {l.name}
               </a>
             ))}
           </div>
           <div className="mt-auto space-y-6">
             <Button 
                variant="blue" 
                className="w-full h-20 rounded-[32px] text-[13px] font-[900] uppercase tracking-[0.3em] animate-reveal opacity-0 stagger-4" 
                onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
              >
               Staff Hub Access
             </Button>
             <button onClick={toggleTheme} className="w-full h-16 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-[28px] animate-reveal opacity-0 stagger-5">
               Visual: {isDark ? 'Light' : 'Dark'} Mode
             </button>
           </div>
        </div>
      )}
    </div>
  );
};
