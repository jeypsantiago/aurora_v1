import React, { Fragment, useEffect } from 'react';
import { LucideIcon, X } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description, action }) => {
  return (
    <div className={`bg-white dark:bg-[#09090b] border border-zinc-200/80 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      {(title || description || action) && (
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="min-w-0 flex-1">
            {title && <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight truncate">{title}</h3>}
            {description && <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{description}</p>}
          </div>
          {action && (
            <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide py-1 -my-1">
              <div className="flex items-center gap-1.5 min-w-max pb-1 sm:pb-0">
                {action}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
  isPositive?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, subtext, icon: Icon }) => {
  return (
    <div className="bg-white dark:bg-[#09090b] border border-zinc-200/80 dark:border-zinc-800/50 rounded-2xl p-5 relative group transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800">
          <Icon size={18} />
        </div>
        <Badge variant="default" className="!text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Live</Badge>
      </div>
      <div>
        <h4 className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">{label}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{value}</span>
        </div>
        {subtext && (
          <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'blue';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all focus:outline-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-sm",
    blue: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10",
    outline: "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-zinc-900",
    ghost: "bg-transparent hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20",
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const ProgressBar: React.FC<{ value: number; max?: number; color?: string; label?: string }> = ({ value, max = 100, color = 'bg-zinc-900 dark:bg-white', label }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

interface TabsProps {
  tabs: { id: string; label: string; icon?: LucideIcon }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex items-center border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-hide w-full ${className}`}>
      <div className="flex flex-nowrap min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 flex-shrink-0
              ${activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}
            `}
          >
            {tab.icon && <tab.icon size={16} />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
