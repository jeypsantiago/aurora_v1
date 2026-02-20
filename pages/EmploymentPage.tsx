import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    Search,
    Plus,
    Edit2,
    Trash2,
    Download,
    Fingerprint,
    Calendar,
    FileText,
    CheckCircle2,
    ShieldCheck,
    Zap,
    ArrowRight
} from 'lucide-react';
import { Card, Badge, Button, Modal } from '../components/ui';
import { useDialog } from '../DialogContext';
import { useRbac } from '../RbacContext';
import { PermissionGate } from '../components/PermissionGate';
import { useToast } from '../ToastContext';
import { EmploymentRecord, EmploymentConfig } from '../types';
import { generateCOE } from '../services/coeGenerator';

export const EmploymentPage: React.FC = () => {
    const { confirm } = useDialog();
    const { toast } = useToast();
    const { can } = useRbac();

    const [records, setRecords] = useState<EmploymentRecord[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [lastCreated, setLastCreated] = useState<EmploymentRecord | null>(null);

    const [formData, setFormData] = useState({
        month: '',
        name: '',
        surveyProject: '',
        dateExecution: '',
        duration: '',
        focalPerson: ''
    });

    const [configs, setConfigs] = useState<EmploymentConfig>(() => {
        const saved = localStorage.getItem('employment_config');
        return saved ? JSON.parse(saved) : {
            prefix: 'EMP', separator: '-', padding: 4, increment: 1, startNumber: 1
        };
    });
    const [surveyProjects, setSurveyProjects] = useState<string[]>(() => {
        const saved = localStorage.getItem('employment_surveyProjects');
        return saved ? JSON.parse(saved) : ['CBMS 2024', 'PhilSys Registration', 'Labor Force Survey'];
    });
    const [focalPersons, setFocalPersons] = useState<string[]>(() => {
        const saved = localStorage.getItem('employment_focalPersons');
        return saved ? JSON.parse(saved) : ['Juan Dela Cruz', 'Maria Santos'];
    });

    useEffect(() => {
        const savedRecords = localStorage.getItem('aurora_employment_records');
        if (savedRecords) setRecords(JSON.parse(savedRecords));
    }, []);

    useEffect(() => {
        localStorage.setItem('aurora_employment_records', JSON.stringify(records));
    }, [records]);

    const generateSerialNumber = () => {
        let maxNum = configs.startNumber - 1;
        records.forEach(r => {
            const parts = r.serialNumber.split(configs.separator);
            const numPart = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(numPart) && numPart > maxNum) {
                maxNum = numPart;
            }
        });

        const nextNumber = maxNum + configs.increment;
        return `${configs.prefix}${configs.separator}${String(nextNumber).padStart(configs.padding, '0')}`;
    };

    const filteredRecords = records.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.surveyProject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAddModal = () => {
        setIsEditMode(false);
        setEditingId(null);
        setFormData({
            month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
            name: '',
            surveyProject: surveyProjects.length > 0 ? surveyProjects[0] : '',
            dateExecution: new Date().toISOString().split('T')[0],
            duration: '1 Month',
            focalPerson: focalPersons.length > 0 ? focalPersons[0] : ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (record: EmploymentRecord) => {
        setIsEditMode(true);
        setEditingId(record.id);
        setFormData({
            month: record.month,
            name: record.name,
            surveyProject: record.surveyProject,
            dateExecution: record.dateExecution,
            duration: record.duration,
            focalPerson: record.focalPerson
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.surveyProject && formData.focalPerson) {
            if (isEditMode && editingId) {
                setRecords(records.map(r => {
                    if (r.id === editingId) {
                        return { ...r, ...formData };
                    }
                    return r;
                }));
                setIsModalOpen(false);
                toast('success', `Record updated successfully`);
            } else {
                const newRecord: EmploymentRecord = {
                    id: crypto.randomUUID(),
                    serialNumber: generateSerialNumber(),
                    createdAt: new Date().toISOString(),
                    ...formData
                };
                setRecords([newRecord, ...records]);
                setLastCreated(newRecord);
                setIsModalOpen(false);
                setIsSuccessModalOpen(true);
                toast('success', `Record ${newRecord.serialNumber} created successfully`);
            }
        } else {
            toast('error', 'Please fill in required fields (Name, Project, Focal Person)');
        }
    };

    const deleteRecord = async (id: string, serial: string) => {
        if (await confirm(`Are you sure you want to delete employment record ${serial}?`)) {
            setRecords(records.filter(r => r.id !== id));
            toast('success', `Record ${serial} deleted`);
        }
    };

    const handleGeneratePDF = (record: EmploymentRecord) => {
        toast('success', `Generating COE for ${record.name}...`);
        generateCOE(record);
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Employment Records</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[13px] font-medium mt-1 uppercase tracking-wider">Provincial Personnel Management</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <PermissionGate requires="employment.edit">
                        <Button variant="blue" className="w-full sm:w-auto shadow-lg shadow-blue-500/20" onClick={openAddModal}>
                            <Plus size={16} className="mr-2" /> Issue Contract
                        </Button>
                    </PermissionGate>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card
                    title="Contract History"
                    description="Complete records of registered personnel contracts"
                    action={
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                            <input
                                type="text" placeholder="Search by name, ID or project..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none w-full sm:w-64 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    }
                >
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="pb-4 px-3 sm:px-0 text-[13px] font-black text-zinc-400 uppercase tracking-widest">Serial No.</th>
                                    <th className="pb-4 px-3 sm:px-0 text-[13px] font-black text-zinc-400 uppercase tracking-widest">Personnel Name</th>
                                    <th className="pb-4 px-3 sm:px-0 text-[13px] font-black text-zinc-400 uppercase tracking-widest">Survey / Project</th>
                                    <th className="pb-4 px-3 sm:px-0 text-[13px] font-black text-zinc-400 uppercase tracking-widest">Focal Person</th>
                                    <th className="pb-4 px-3 sm:px-0 text-[13px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {filteredRecords.length > 0 ? filteredRecords.map((row) => (
                                    <tr key={row.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                                        <td className="py-4 px-3 sm:px-0 cursor-pointer group/reg" onClick={() => openEditModal(row)}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[13px] font-black text-zinc-900 dark:text-white tracking-tight group-hover/reg:text-blue-600 transition-colors">{row.serialNumber}</span>
                                                <div className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover/reg:bg-blue-50 group-hover/reg:text-blue-600 transition-all">
                                                    <ArrowRight size={10} />
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-zinc-500 font-medium">{row.dateExecution}</div>
                                        </td>
                                        <td className="py-4 px-3 sm:px-0 text-[13px] font-bold tracking-tight">{row.name}</td>
                                        <td className="py-4 px-3 sm:px-0">
                                            <Badge variant="info" className="!py-1">{row.surveyProject}</Badge>
                                        </td>
                                        <td className="py-4 px-3 sm:px-0 text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{row.focalPerson}</td>
                                        <td className="py-4 px-3 sm:px-0 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PermissionGate requires="employment.export">
                                                    <button onClick={() => handleGeneratePDF(row)} className="p-2 text-zinc-400 hover:text-indigo-500" title="Generate COE PDF"><Download size={14} /></button>
                                                </PermissionGate>
                                                <PermissionGate requires="employment.edit">
                                                    <button onClick={() => openEditModal(row)} className="p-2 text-zinc-400 hover:text-blue-500" title="Edit Record"><Edit2 size={14} /></button>
                                                </PermissionGate>
                                                <PermissionGate requires="employment.delete">
                                                    <button onClick={() => deleteRecord(row.id, row.serialNumber)} className="p-2 text-zinc-400 hover:text-red-500" title="Delete Record"><Trash2 size={14} /></button>
                                                </PermissionGate>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-zinc-500 text-xs">No records found. Create one.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? `Edit Contract: ${formData.serialNumber || 'Record'}` : "Issue New Contract"}
                maxWidth="max-w-xl"
                footer={
                    <div className="flex gap-2">
                        <Button variant="ghost" className="rounded-xl px-6" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="blue" className="rounded-xl px-8 shadow-lg shadow-blue-500/20" onClick={handleSubmit}>
                            {isEditMode ? "Update Contract" : "Save Contract"}
                        </Button>
                    </div>
                }
            >
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Personnel Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="e.g. John Doe"
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Survey / Project</label>
                            <select
                                value={formData.surveyProject}
                                onChange={e => setFormData({ ...formData, surveyProject: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                            >
                                <option value="">Select Project</option>
                                {surveyProjects.map(proj => <option key={proj} value={proj}>{proj}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Focal Person</label>
                            <select
                                value={formData.focalPerson}
                                onChange={e => setFormData({ ...formData, focalPerson: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                            >
                                <option value="">Select Person</option>
                                {focalPersons.map(person => <option key={person} value={person}>{person}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Duration of Contract</label>
                        <input
                            type="text"
                            value={formData.duration}
                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            required
                            placeholder="e.g. 1 Month, 30 Days"
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none font-bold"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Date of Execution</label>
                            <input
                                type="date"
                                value={formData.dateExecution}
                                onChange={e => setFormData({ ...formData, dateExecution: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none font-bold"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Month of Engagement</label>
                            <input
                                type="text"
                                value={formData.month}
                                onChange={e => setFormData({ ...formData, month: e.target.value })}
                                placeholder="e.g. January 2024"
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none font-bold"
                            />
                        </div>
                    </div>

                    {!isEditMode && (
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 flex gap-3 mt-4">
                            <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                            <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                                Issuing this contract will auto-generate a unique Serial Number based on the Employment Config in Settings.
                            </p>
                        </div>
                    )}
                </form>
            </Modal>

            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Official Contract Issued"
                footer={<Button variant="blue" className="w-full rounded-2xl h-14 text-[11px] font-black uppercase tracking-[0.3em] shadow-lg shadow-blue-500/20" onClick={() => setIsSuccessModalOpen(false)}>Acknowledge & Complete</Button>}
            >
                <div className="flex flex-col items-center py-1">
                    <div className="relative mb-3">
                        <div className="absolute inset-0 bg-emerald-500 blur-[25px] opacity-10 animate-pulse"></div>
                        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 relative z-10 border border-emerald-100/50 dark:border-emerald-500/20 shadow-lg">
                            <Briefcase size={24} strokeWidth={2.5} />
                        </div>
                    </div>

                    <h4 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-0.5">Contract Generated</h4>
                    <p className="text-[7px] text-zinc-400 font-black uppercase tracking-[0.4em] mb-4">Aurora Provincial Hub</p>

                    <div className="w-full bg-white dark:bg-[#0c0c0e] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[28px] p-4 sm:p-5 shadow-inner relative overflow-hidden group">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-dashed border-zinc-200 dark:border-zinc-800 pb-4 mb-4 gap-3">
                            <div className="space-y-0.5">
                                <span className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em] block">Employment Serial No.</span>
                                <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter leading-none">{lastCreated?.serialNumber}</span>
                            </div>
                        </div>

                        <div className="space-y-0.5 pt-4 mb-4">
                            <span className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em]">Personnel</span>
                            <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight leading-tight uppercase">{lastCreated?.name}</p>
                        </div>

                        <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                                <div className="space-y-1">
                                    <span className="text-[9.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight block leading-none">Survey/Project</span>
                                    <p className="text-[13px] font-black text-zinc-900 dark:text-zinc-100 truncate leading-none">{lastCreated?.surveyProject}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight block leading-none">Focal Person</span>
                                    <p className="text-[13px] font-black text-zinc-900 dark:text-zinc-100 truncate leading-none">{lastCreated?.focalPerson}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 relative">
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 bg-white dark:bg-[#0c0c0e]">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                            </div>
                            <p className="text-[7px] italic text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed text-center px-4">
                                Saved in Aurora Provincial Employment database.
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
