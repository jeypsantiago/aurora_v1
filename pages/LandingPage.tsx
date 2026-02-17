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
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Info,
  Globe,
  Newspaper,
  CalendarDays,
  Sparkles,
  Zap,
  Lock
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
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Updates', href: '#news' },
    { name: 'Core Values', href: '#mission' },
    { name: 'Locate Us', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-zinc-900 dark:text-white selection:bg-blue-600/30 transition-colors duration-700 overflow-x-hidden bg-grid">
      
      {/* Top Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-600 z-[2000] transition-all duration-300 ease-out" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation */}
      <nav className={`h-[72px] sm:h-[80px] border-b transition-all duration-700 sticky top-0 z-[1000] px-4 sm:px-8 ${
        scrolled 
        ? 'glass border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-black/5' 
        : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40 relative z-10 group-active:scale-95 transition-transform">
                <BarChart3 size={20} className="sm:size-[22px]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base tracking-tight font-black uppercase leading-none">PSA Aurora</span>
              <span className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase mt-1 tracking-[0.15em] hidden xs:block">Provincial Office</span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-blue-600 dark:hover:text-white transition-all hover:-translate-y-0.5 relative group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 sm:p-3 text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 rounded-xl sm:rounded-2xl transition-all active:scale-90"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} className="sm:size-[20px] animate-spin-slow" /> : <Moon size={18} className="sm:size-[20px]" />}
            </button>
            
            <div className="hidden sm:flex items-center gap-4">
              <Button 
                variant="primary" 
                className="px-6 sm:px-8 h-10 sm:h-12 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] shadow-lg shadow-black/5 flex items-center gap-2 group overflow-hidden"
                onClick={() => navigate('/dashboard')}
              >
                <Lock size={13} className="group-hover:rotate-12 transition-transform" />
                Portal Login
              </Button>
            </div>
            
            <button
              className="lg:hidden p-2 sm:p-3 text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 rounded-xl sm:rounded-2xl transition-all active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[72px] sm:top-[80px] bg-white dark:bg-black z-[900] animate-in fade-in slide-in-from-top-4 duration-500 overflow-y-auto px-6 py-10 flex flex-col">
             <div className="flex flex-col space-y-2 text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
               {navLinks.map((link, i) => (
                 <a 
                   key={link.name} 
                   href={link.href} 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={`block py-6 border-b border-zinc-100 dark:border-zinc-900 reveal-on-scroll stagger-${i+1} active:text-blue-600 transition-colors`}
                 >
                   {link.name}
                 </a>
               ))}
             </div>
             <div className="mt-auto pt-10 reveal-on-scroll stagger-5">
               <Button 
                variant="primary" 
                className="w-full justify-center h-16 rounded-3xl text-xs font-black uppercase tracking-[0.3em] bg-blue-600 shadow-2xl shadow-blue-500/40 active:scale-[0.98]" 
                onClick={() => navigate('/dashboard')}
               >
                Launch Admin Portal
              </Button>
             </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 sm:pt-40 sm:pb-56 px-4 sm:px-6 overflow-hidden">
        {/* Dynamic Animated Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[80%] h-[80%] bg-blue-500/10 dark:bg-blue-600/5 blur-[100px] rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[70%] bg-indigo-500/10 dark:bg-indigo-600/5 blur-[100px] rounded-full animate-pulse-slow stagger-3"></div>
        </div>

        <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="animate-reveal opacity-0 stagger-1 mb-8 sm:mb-12">
            <Badge variant="info" className="!px-4 sm:!px-6 !py-1.5 sm:!py-2.5 !text-[9px] sm:!text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-2xl border-blue-500/20 flex items-center">
              <Sparkles size={12} className="mr-2 text-blue-500 animate-pulse" /> Provincial Data Hub
            </Badge>
          </div>
          
          <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-[1000] tracking-tight mb-8 sm:mb-12 leading-[0.9] text-zinc-900 dark:text-white max-w-[15ch] animate-reveal opacity-0 stagger-2 px-2">
            The Gold Standard <br className="hidden lg:block" /> 
            in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-bg-shift">Provincial Data.</span>
          </h1>
          
          <p className="text-base sm:text-xl lg:text-2xl text-zinc-500 dark:text-zinc-400 mb-12 sm:mb-20 max-w-2xl leading-relaxed font-medium animate-reveal opacity-0 stagger-3 px-4">
            Providing high-fidelity, secure, and inclusive civil registration for the people of Aurora.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto px-6 animate-reveal opacity-0 stagger-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="h-14 sm:h-16 px-10 sm:px-12 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] bg-blue-600 hover:bg-blue-700 text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] rounded-[20px] sm:rounded-3xl w-full sm:w-auto justify-center group active:scale-[0.97]"
            >
              Get Started <ArrowRight className="ml-4 sm:ml-5 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              className="h-14 sm:h-16 px-10 sm:px-12 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] w-full sm:w-auto border-2 border-zinc-200 dark:border-zinc-800 rounded-[20px] sm:rounded-3xl justify-center bg-white/40 dark:bg-transparent backdrop-blur-md hover:bg-zinc-100 dark:hover:bg-zinc-900 active:scale-[0.97]"
            >
              Public Statistics
            </Button>
          </div>

          {/* Ticker - Reduced size for mobile for better fit */}
          <div className="mt-24 sm:mt-48 w-screen overflow-hidden whitespace-nowrap opacity-40 dark:opacity-30 pointer-events-none select-none animate-reveal opacity-0 stagger-5 border-y border-zinc-200/50 dark:border-zinc-800/50 py-6 sm:py-10">
             <div className="flex animate-marquee">
               <div className="flex-shrink-0 flex items-center gap-10 sm:gap-20 text-[24px] xs:text-[32px] sm:text-[40px] lg:text-[60px] font-black uppercase tracking-[0.05em] sm:tracking-[0.1em] text-zinc-500 px-6 sm:px-10">
                 <span>Accuracy</span> <span>•</span> <span>Integrity</span> <span>•</span> <span>Service</span> <span>•</span> <span>Security</span> <span>•</span> <span>Aurora</span> <span>•</span> <span>PhilSys</span> <span>•</span> <span>Census</span> <span>•</span> <span>Statistics</span> <span>•</span>
               </div>
               <div className="flex-shrink-0 flex items-center gap-10 sm:gap-20 text-[24px] xs:text-[32px] sm:text-[40px] lg:text-[60px] font-black uppercase tracking-[0.05em] sm:tracking-[0.1em] text-zinc-500 px-6 sm:px-10">
                 <span>Accuracy</span> <span>•</span> <span>Integrity</span> <span>•</span> <span>Service</span> <span>•</span> <span>Security</span> <span>•</span> <span>Aurora</span> <span>•</span> <span>PhilSys</span> <span>•</span> <span>Census</span> <span>•</span> <span>Statistics</span> <span>•</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 sm:py-40 px-4 sm:px-6 relative overflow-hidden bg-white dark:bg-[#030303]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 sm:gap-16 mb-20 sm:mb-32 reveal-on-scroll">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 sm:w-12 h-[3px] bg-blue-600 rounded-full"></div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-blue-600">The Core Framework</span>
              </div>
              <h2 className="text-3xl sm:text-6xl font-[1000] tracking-tighter text-zinc-900 dark:text-white leading-[0.95] mb-6 sm:mb-8">
                Empowering Aurora <br /> through Digital Integrity.
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-xl leading-relaxed max-w-xl">
                We combine governmental authority with cutting-edge data management to serve every citizen with precision.
              </p>
            </div>
            <div className="lg:pb-2">
               <button className="group flex items-center gap-3 text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-zinc-900 dark:text-white active:scale-95 transition-transform">
                 Full Service Charter <div className="p-2.5 sm:p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all"><ArrowRight size={14} className="sm:size-[16px]"/></div>
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
            {[
              { 
                icon: FileText, 
                title: 'Civil Registry', 
                desc: 'Official processing of vital records with ultra-secure provincial-to-national sync.',
                metric: 'Real-time Validated',
                color: 'blue'
              },
              { 
                icon: Zap, 
                title: 'PhilSys Hub', 
                desc: 'Centralized enrollment and distribution systems for the Aurora National Identity program.',
                metric: '94% Coverage',
                color: 'indigo'
              },
              { 
                icon: Database, 
                title: 'Provincial Data', 
                desc: 'Advanced census mapping and economic indices specialized for Aurora municipalities.',
                metric: 'High Fidelity',
                color: 'emerald'
              }
            ].map((service, i) => (
              <div key={i} className={`group reveal-on-scroll stagger-${i+1} p-8 sm:p-16 rounded-[32px] sm:rounded-[48px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-blue-500/40 hover:shadow-2xl transition-all duration-700 flex flex-col h-full sm:hover:-translate-y-6 relative overflow-hidden active:scale-[0.98] sm:active:scale-100`}>
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl from-blue-600/5 to-transparent rounded-bl-[80px] sm:rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-[20px] sm:rounded-[32px] bg-${service.color}-500 flex items-center justify-center text-white shadow-3xl shadow-${service.color}-500/30 mb-8 sm:mb-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700`}>
                  <service.icon size={28} className="sm:size-[40px]" />
                </div>
                <div className="mb-4 sm:mb-6">
                  <Badge variant="default" className="!px-3 sm:!px-4 !py-1 sm:!py-1.5 !text-[9px] sm:!text-[10px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">{service.metric}</Badge>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-4 sm:mb-8 leading-tight">{service.title}</h3>
                <p className="text-sm sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 sm:mb-12 flex-1">
                  {service.desc}
                </p>
                <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-blue-600 group-hover:gap-5 transition-all">
                  Detailed Info <ArrowRight size={14} className="sm:size-[16px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Layout */}
      <section id="news" className="py-24 sm:py-40 px-4 sm:px-6 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_50%)]"></div>
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 sm:mb-24 gap-10 reveal-on-scroll">
            <div>
              <h2 className="text-4xl sm:text-6xl font-[1000] tracking-tighter mb-4 leading-none">Latest Bulletins.</h2>
              <p className="text-zinc-500 text-lg max-w-lg">Live feed from the Aurora newsroom.</p>
            </div>
            <button className="h-14 sm:h-16 px-8 sm:px-10 rounded-2xl sm:rounded-3xl border border-white/10 hover:bg-white hover:text-black transition-all text-[10px] sm:text-[11px] font-black uppercase tracking-widest flex items-center gap-3 group active:scale-95">
              Global Newsroom <ArrowRight size={14} className="sm:size-[16px] group-hover:rotate-[-45deg] transition-transform"/>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
            <div className="lg:col-span-8 group reveal-on-scroll">
               <div className="relative overflow-hidden rounded-[40px] sm:rounded-[64px] h-[400px] sm:h-[650px] border border-white/5 shadow-3xl bg-zinc-900 active:scale-[0.99] transition-transform">
                 <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80" 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-2000 opacity-40 grayscale group-hover:grayscale-0"
                    alt="Featured Update"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 w-full p-8 sm:p-20">
                    <div className="flex items-center gap-4 mb-4 sm:mb-8">
                       <Badge variant="info" className="!px-4 !py-1 bg-blue-600 !text-white border-0 text-[8px] sm:text-[10px] font-black">HEADLINE</Badge>
                       <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500">Dec 29, 2024</span>
                    </div>
                    <h3 className="text-2xl sm:text-6xl font-[1000] tracking-tighter mb-4 sm:mb-8 leading-tight group-hover:text-blue-400 transition-colors">Digital Census 2025: <br /> Aurora Pilot Program.</h3>
                    <p className="text-zinc-400 text-base sm:text-xl mb-6 sm:mb-12 max-w-xl leading-relaxed font-medium">Launching the first fully paperless census initiative across the Casiguran and Baler municipalities.</p>
                    <div className="flex items-center gap-6 sm:gap-8 text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-zinc-600">
                      <span className="flex items-center gap-2"><Users size={14}/> Public Affairs</span>
                      <span className="flex items-center gap-2 group-hover:text-white transition-colors"><ChevronRight size={14}/> Read Feature</span>
                    </div>
                 </div>
               </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
              {[
                { title: 'New PhilSys Kiosks in Dilasag', tag: 'Registry', time: '2h ago' },
                { title: 'Registry Modernization Summit 2025', tag: 'Event', time: '1d ago' },
                { title: 'Aurora Statistical Yearbook PDF', tag: 'Data', time: '3d ago' },
              ].map((item, i) => (
                <div key={i} className={`p-8 sm:p-10 rounded-[28px] sm:rounded-[40px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group cursor-pointer reveal-on-scroll stagger-${i+1} flex flex-col justify-between active:scale-[0.98]`}>
                   <div>
                     <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-3 sm:mb-4 block">{item.tag}</span>
                     <h4 className="text-lg sm:text-xl font-black mb-4 sm:mb-6 leading-tight group-hover:text-blue-400 transition-colors">{item.title}</h4>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[9px] sm:text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{item.time}</span>
                     <ArrowRight size={18} className="text-zinc-700 group-hover:text-white transition-all group-hover:translate-x-2" />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="mission" className="py-24 sm:py-40 px-4 sm:px-6 relative overflow-hidden bg-[#fafafa] dark:bg-black">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-center mb-20 sm:mb-40">
             <div className="reveal-on-scroll">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 sm:w-12 h-[3px] bg-blue-600 rounded-full"></div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-blue-600">Guiding Values</span>
                </div>
                <h2 className="text-4xl sm:text-7xl font-[1000] tracking-tighter mb-8 sm:mb-10 leading-[0.9] text-zinc-900 dark:text-white">The Foundation <br /> of our Services.</h2>
                <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium mb-12 sm:mb-16 max-w-lg">
                  Every data point we collect represents a life and a story. We handle each with absolute integrity.
                </p>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    { title: 'Fidelity', desc: 'Unyielding precision in data collection and reporting.' },
                    { title: 'Privacy', desc: 'Bank-grade encryption for all provincial records.' },
                    { title: 'Empowerment', desc: 'Data-driven decision making for Aurora\'s growth.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer active:scale-95 transition-transform">
                       <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-blue-600 group-hover:bg-blue-600 transition-all"></div>
                       <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-white group-hover:translate-x-2 transition-transform">{item.title}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="relative group reveal-on-scroll active:scale-[0.98] sm:active:scale-100 transition-transform">
                <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[40px] sm:rounded-[80px] blur-[40px] sm:blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative p-10 sm:p-24 rounded-[40px] sm:rounded-[80px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-3xl overflow-hidden">
                   <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full translate-x-1/2 translate-y-1/2"></div>
                   <h3 className="text-2xl sm:text-3xl font-black text-blue-600 uppercase tracking-[0.2em] mb-8 sm:mb-12">Strategic Vision</h3>
                   <p className="text-2xl sm:text-5xl font-black text-zinc-900 dark:text-white leading-[1.1] tracking-tighter italic mb-10 sm:mb-16">
                     "To be the premier provincial authority delivering world-class statistics fostering a data-driven future for Aurora."
                   </p>
                   <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
                        <BarChart3 size={24} className="sm:size-[32px]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 leading-none mb-1">Official Directive</span>
                        <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">2025-2030 Roadmap</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-40 px-4 sm:px-6 bg-zinc-100 dark:bg-zinc-900/40 relative">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 sm:gap-20">
            <div className="lg:col-span-6 reveal-on-scroll">
              <h2 className="text-5xl sm:text-8xl font-[1000] tracking-tighter mb-8 sm:mb-12 text-zinc-900 dark:text-white leading-[0.85]">
                Provincial <br /> Headquarters.
              </h2>
              <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 mb-12 sm:mb-20 max-w-lg leading-relaxed font-medium">
                Visit our office in Baler for high-level registration concerns and statistical coordination.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12">
                 <div className="group reveal-on-scroll stagger-1">
                   <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 mb-3 sm:mb-4">Location</h4>
                   <p className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                     N. Roxas St., Barangay Suklayin, Baler, Aurora 3200
                   </p>
                 </div>
                 <div className="group reveal-on-scroll stagger-2">
                   <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 mb-3 sm:mb-4">Inquiries</h4>
                   <p className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                     aurora@psa.gov.ph <br />
                     (042) 724-4389
                   </p>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-6 reveal-on-scroll">
              <div className="relative h-full min-h-[400px] sm:min-h-[550px] group active:scale-[0.98] sm:active:scale-100 transition-transform">
                 <div className="absolute -inset-4 bg-blue-600/20 rounded-[40px] sm:rounded-[80px] blur-[30px] sm:blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative h-full w-full rounded-[40px] sm:rounded-[80px] overflow-hidden border-[8px] sm:border-[12px] border-white dark:border-zinc-900 shadow-4xl bg-zinc-200 dark:bg-zinc-800">
                    <img 
                       src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
                       className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000"
                       alt="Baler PSA Office"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
                       <div className="p-8 sm:p-16 rounded-[32px] sm:rounded-[64px] glass border border-white/20 text-center w-full max-w-sm shadow-4xl backdrop-blur-3xl">
                          <MapPin size={40} className="text-blue-600 mx-auto mb-6 sm:mb-8 animate-bounce" />
                          <h4 className="text-2xl sm:text-3xl font-[1000] mb-3 sm:mb-4 tracking-tighter">Baler Office</h4>
                          <p className="text-zinc-500 text-sm leading-relaxed mb-8 sm:mb-10 font-bold uppercase tracking-widest leading-none">Mon-Fri | 8am-5pm</p>
                          <Button variant="primary" className="w-full h-14 sm:h-16 rounded-[20px] sm:rounded-3xl text-[11px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-2xl shadow-blue-500/30 active:scale-95">
                            Get Directions
                          </Button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-24 sm:pt-40 pb-16 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 sm:gap-20 mb-24 sm:mb-40">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-4 sm:gap-5 mb-10 sm:mb-12">
                <div className="w-12 h-12 sm:w-16 h-16 bg-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white shadow-3xl shadow-blue-600/30">
                  <BarChart3 size={28} className="sm:size-[32px]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl tracking-tighter font-black uppercase leading-none">PSA Aurora</span>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500 font-bold uppercase mt-1 sm:mt-2 tracking-[0.3em] sm:tracking-[0.5em]">Provincial Hub</span>
                </div>
              </div>
              <p className="text-xl sm:text-2xl text-zinc-400 leading-tight mb-10 sm:mb-16 max-w-md font-black tracking-tighter">
                Accurate data. <br /> Empowered Aurora. <br /> Modern Nation.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Facebook', 'X', 'LinkedIn'].map(social => (
                  <a key={social} href="#" className="h-12 sm:h-14 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all text-[9px] sm:text-[10px] font-black uppercase tracking-widest group active:scale-95">
                    {social}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] mb-8 sm:mb-12 text-blue-500">Service Portal</h4>
              <ul className="space-y-6 sm:space-y-8 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">Civil Registry</a></li>
                <li><a href="#" className="hover:text-white transition-colors">PhilSys Sync</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Census Results</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] mb-8 sm:mb-12 text-blue-500">Legal</h4>
              <ul className="space-y-6 sm:space-y-8 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Seal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Transparency</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FOI Charter</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
               <div className="p-8 sm:p-10 rounded-[32px] sm:rounded-[48px] bg-white/5 border border-white/5 relative group overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform"></div>
                 <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 text-white relative z-10">PSA Official</h4>
                 <p className="text-[9px] sm:text-[11px] text-zinc-600 leading-relaxed mb-8 sm:mb-10 font-bold uppercase tracking-widest relative z-10">Government of the <br /> Republic of the Philippines.</p>
                 <a href="https://www.psa.gov.ph" target="_blank" className="flex items-center justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-colors relative z-10">
                   Main Portal <ArrowRight size={12}/>
                 </a>
               </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
            <div className="flex items-center gap-6 sm:gap-10 flex-wrap justify-center text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
               <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
               <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
               <span className="hover:text-white cursor-pointer transition-colors">Accessibility</span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-zinc-700 text-center lg:text-right">
              © 2024 Philippine Statistics Authority • Aurora
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};