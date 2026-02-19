import React, { useState, useEffect, useRef } from 'react';
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
    Info,
    Upload,
    Trash2
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

    // -- Signature Drawing Logic --
    const [signatureMode, setSignatureMode] = useState<'upload' | 'draw'>('upload');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Initialize/Reset canvas when switching to draw mode
    useEffect(() => {
        if (signatureMode === 'draw' && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Set canvas size to match display size for sharpness
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;

                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = '#000000';
            }
        }
    }, [signatureMode]);

    // Track points for smooth curves
    const points = useRef<{ x: number; y: number }[]>([]);

    const getPoint = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const point = getPoint(e, canvas);
        points.current = [point];

        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        // Draw a single dot
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentPoint = getPoint(e, canvas);
        points.current.push(currentPoint);

        // We need at least 3 points to draw a curve from mid to mid
        if (points.current.length < 3) {
            const b = points.current[points.current.length - 1];
            const a = points.current[points.current.length - 2];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            return;
        }

        const p1 = points.current[points.current.length - 3];
        const p2 = points.current[points.current.length - 2];
        const p3 = points.current[points.current.length - 1];

        // Midpoints
        const mid1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const mid2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };

        ctx.beginPath();
        ctx.moveTo(mid1.x, mid1.y);
        ctx.quadraticCurveTo(p2.x, p2.y, mid2.x, mid2.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        points.current = []; // Clear points for next stroke
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && currentUser) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                updateUser(currentUser.id, { avatar: base64 });
                alert("Profile picture updated successfully!");
            };
            reader.readAsDataURL(file);
        }
    };

    const saveDrawnSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas || !currentUser) return;

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        updateUser(currentUser.id, { signature: dataUrl });
        alert("Signature saved successfully!");
        // Optional: Switch back to upload mode to show result? 
        // Or keep in draw mode. User choice.
    };

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
                        <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={handleAvatarUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="w-32 h-32 rounded-[38px] bg-blue-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-blue-500/30 border-4 border-white dark:border-zinc-900 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                            {currentUser?.avatar ? (
                                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                            ) : (
                                currentUser?.name.split(' ').map(n => n[0]).join('')
                            )}
                        </div>
                        <button
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute bottom-1 right-1 p-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors"
                        >
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
                        {/* Toggle Mode */}
                        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl mb-4">
                            <button
                                onClick={() => setSignatureMode('upload')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${signatureMode === 'upload'
                                    ? 'bg-white dark:bg-zinc-700 text-blue-600 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                                    }`}
                            >
                                <Upload size={14} /> Upload
                            </button>
                            <button
                                onClick={() => setSignatureMode('draw')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${signatureMode === 'draw'
                                    ? 'bg-white dark:bg-zinc-700 text-blue-600 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                                    }`}
                            >
                                <PenTool size={14} /> Draw
                            </button>
                        </div>

                        {signatureMode === 'upload' ? (
                            <div className="relative aspect-video rounded-2xl bg-white border border-dashed border-zinc-300 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-blue-500 transition-colors overflow-hidden ring-4 ring-zinc-50 dark:ring-white/5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                const base64 = reader.result as string;
                                                if (currentUser) {
                                                    updateUser(currentUser.id, { signature: base64 });
                                                    alert("Signature uploaded successfully!");
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                {currentUser?.signature ? (
                                    <img src={currentUser.signature} alt="Digital Signature" className="h-full w-full object-contain p-2" />
                                ) : (
                                    <>
                                        <div className="p-4 bg-zinc-50 rounded-3xl shadow-sm mb-4 border border-zinc-200 text-zinc-400 group-hover:text-blue-500 transition-colors">
                                            <Upload size={32} />
                                        </div>
                                        <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
                                            Click to Upload Signature
                                        </p>
                                        <p className="text-[9px] text-zinc-400 mt-2 italic">Will be used for RIS generation</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="relative aspect-video rounded-2xl bg-white border-2 border-zinc-300 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all group ring-4 ring-zinc-50 dark:ring-white/5">
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                    />
                                    {/* Placeholder Text if empty (visually hidden when drawing starts usually, but keeps simple here) */}
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20 text-zinc-400">
                                        <span className="text-4xl font-handwriting select-none">Sign Here</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={clearSignature}
                                        className="flex-1 text-xs uppercase tracking-wider"
                                    >
                                        <Trash2 size={14} className="mr-2" /> Clear
                                    </Button>
                                    <Button
                                        variant="blue"
                                        onClick={saveDrawnSignature}
                                        className="flex-1 text-xs uppercase tracking-wider"
                                    >
                                        <Save size={14} className="mr-2" /> Save
                                    </Button>
                                </div>
                            </div>
                        )}
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

