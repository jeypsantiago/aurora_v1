import React, { useState, useEffect } from 'react';
import {
    User as UserIcon,
    Mail,
    MapPin,
    Smartphone,
    ShieldCheck,
    Camera,
    PenTool,
    Save,
    Lock,
    ChevronRight,
    Info
} from 'lucide-react';
import { useUsers } from '../UserContext';
import { useDialog } from '../DialogContext';
import { Button, Input, Badge, Card } from '../components/ui';

export const ProfilePage: React.FC = () => {
    const { currentUser, updateUser, roles } = useUsers();
    const { alert } = useDialog();
    const [profileFormData, setProfileFormData] = useState({
        name: '',
        email: '',
        gender: '',
        position: '',
        password: ''
    });

    useEffect(() => {
        if (currentUser) {
            setProfileFormData({
                name: currentUser.name,
                email: currentUser.email,
                gender: currentUser.gender,
                position: currentUser.position,
                password: ''
            });
        }
    }, [currentUser]);

    const handleUpdateProfile = () => {
        if (currentUser) {
            updateUser(currentUser.id, profileFormData);
            alert("Profile updated successfully!");
        }
    };

    const userRole = roles.find(r => r.name === currentUser?.role);
    const badgeColor = userRole?.badgeColor || 'zinc';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 max-w-5xl mx-auto">
            {/* Header Profile Section */}
            <div className="relative p-8 rounded-[40px] bg-white dark:bg-[#09090b] border border-zinc-200/80 dark:border-zinc-800/50 shadow-sm overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar Section */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-[38px] bg-blue-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-blue-500/30 border-4 border-white dark:border-zinc-900 group-hover:scale-105 transition-transform duration-500">
                            {currentUser?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">
                            <Camera size={18} />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{currentUser?.name}</h1>
                            <div className={`
                px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] w-fit mx-auto md:mx-0
                bg-${badgeColor}-50 text-${badgeColor}-700 border border-${badgeColor}-100
                dark:bg-${badgeColor}-500/10 dark:text-${badgeColor}-400 dark:border-${badgeColor}-500/20
              `}>
                                {currentUser?.role}
                            </div>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[11px] mb-4">{currentUser?.position || 'Provincial Staff'}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <Mail size={14} className="text-blue-500" /> {currentUser?.email}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <ShieldCheck size={14} className="text-emerald-500" /> PSA Internal Network
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Info Column */}
                <div className="md:col-span-2 space-y-8">
                    <Card title="Personal Information" description="Update your official contact details and profile preferences">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                value={profileFormData.name}
                                onChange={e => setProfileFormData({ ...profileFormData, name: e.target.value })}
                                placeholder="Juan Dela Cruz"
                            />
                            <Input
                                label="Email Address"
                                value={profileFormData.email}
                                onChange={e => setProfileFormData({ ...profileFormData, email: e.target.value })}
                                placeholder="juan@psa.gov.ph"
                            />
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Gender</label>
                                <select
                                    value={profileFormData.gender}
                                    onChange={e => setProfileFormData({ ...profileFormData, gender: e.target.value })}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <Input
                                label="Position / Designation"
                                value={profileFormData.position}
                                onChange={e => setProfileFormData({ ...profileFormData, position: e.target.value })}
                                placeholder="Provincial Statistician"
                            />
                        </div>
                        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                            <Button variant="blue" className="px-8 shadow-lg shadow-blue-500/20" onClick={handleUpdateProfile}>
                                <Save size={16} className="mr-2" /> Save Profile Changes
                            </Button>
                        </div>
                    </Card>

                    <Card title="Security & Authentication" description="Manage your account password and security settings">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input
                                label="New Password"
                                type="password"
                                value={profileFormData.password}
                                onChange={e => setProfileFormData({ ...profileFormData, password: e.target.value })}
                                placeholder="Enter new password (optional)"
                            />
                            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20">
                                <div className="flex items-center gap-2 text-amber-600 mb-1">
                                    <Info size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Password Tip</span>
                                </div>
                                <p className="text-[10px] text-amber-600/70 font-medium">Use at least 8 characters with numbers and symbols for better security.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    <Card title="Digital Signature" description="Used for authenticating RIS documents">
                        <div className="aspect-video rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-blue-500 transition-colors">
                            <div className="p-4 bg-white dark:bg-zinc-800 rounded-3xl shadow-sm mb-4 border border-zinc-100 dark:border-zinc-700 text-zinc-400 group-hover:text-blue-500 transition-colors">
                                <PenTool size={32} />
                            </div>
                            <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
                                Click to Upload or<br />Draw Signature
                            </p>
                            <p className="text-[9px] text-zinc-400 mt-2 italic">Coming soon: For RIS PDF Insertion</p>
                        </div>
                    </Card>

                    <div className="p-6 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <ShieldCheck size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <Lock size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Access Control</span>
                            </div>
                            <h4 className="text-xl font-bold mb-2 tracking-tight">Level: {currentUser?.role}</h4>
                            <p className="text-xs text-blue-100/80 leading-relaxed font-medium">
                                You have administrative privileges to manage provincial records and inventory. All activity is audited by PSA central office.
                            </p>
                            <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:gap-3 transition-all">
                                View Access Permissions <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

