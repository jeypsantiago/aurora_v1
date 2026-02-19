import React, { useState, useMemo } from 'react';
import {
  History,
  FileText,
  Plus,
  Search,
  Calendar,
  User,
  FileCheck,
  CheckCircle2,
  MoreVertical,
  Download,
  Printer,
  Trash2,
  Fingerprint,
  Info,
  Check,
  ShieldCheck,
  MapPin,
  ClipboardList,
  Edit2,
  Clock,
  Filter,
  ArrowDownToLine,
  FileBarChart,
  Loader2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Card, Badge, Button, Tabs, Modal, Input } from '../components/ui';
import { useDialog } from '../DialogContext';
import { useRbac } from '../RbacContext';
import { PermissionGate } from '../components/PermissionGate';

interface AuditLog {
  action: string;
  timestamp: string;
  user: string;
  comment?: string;
}

interface RegistryRecord {
  date: string;
  type: string;
  name: string;
  reg: string;
  status: string;
  details: Record<string, string>;
  logs: AuditLog[];
}

export const RecordPage: React.FC = () => {
  const { alert, confirm } = useDialog();
  const { can } = useRbac();
  const [activeTab, setActiveTab] = useState('history');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Report Filters
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'All Documents'
  });

  const refConfigs = {
    'Birth Certificate': { prefix: 'BC', separator: '-', padding: 6, start: 1000 },
    'Marriage Certificate': { prefix: 'MC', separator: '-', padding: 6, start: 500 },
    'Death Certificate': { prefix: 'DC', separator: '-', padding: 6, start: 100 },
    'CENOMAR': { prefix: 'CN', separator: '-', padding: 6, start: 50 },
  };

  const [records, setRecords] = useState<RegistryRecord[]>([
    {
      date: '2024-12-24',
      type: 'Birth Certificate',
      name: 'Althea Grace Cruz',
      reg: 'BC-001293',
      status: 'Archived',
      details: { 'Place of Birth': 'Baler, Aurora', "Mother's Name": 'Maria Cruz', "Father's Name": 'Jose Cruz' },
      logs: [{ action: 'Record Created', timestamp: 'Dec 24, 2024 10:20 AM', user: 'Admin' }]
    },
    {
      date: '2024-12-23',
      type: 'Marriage Certificate',
      name: 'Santos - Garcia',
      reg: 'MC-000522',
      status: 'Pending',
      details: { 'Date of Marriage': '2024-12-20', 'Location/Venue': 'San Luis Church' },
      logs: [{ action: 'Record Created', timestamp: 'Dec 23, 2024 02:45 PM', user: 'Clerk' }]
    },
    {
      date: '2024-11-15',
      type: 'Death Certificate',
      name: 'Benjamin Salonga',
      reg: 'DC-000141',
      status: 'Archived',
      details: { 'Cause': 'Natural Causes', 'Age': '88' },
      logs: [{ action: 'Record Created', timestamp: 'Nov 15, 2024 09:00 AM', user: 'Admin' }]
    },
  ]);

  const [formData, setFormData] = useState({
    type: 'Birth Certificate',
    name: '',
    date: new Date().toISOString().split('T')[0],
    placeOfBirth: '',
    motherName: '',
    fatherName: '',
    location: '',
    editComment: '',
  });

  const [lastCreated, setLastCreated] = useState<RegistryRecord | null>(null);
  const [editingReg, setEditingReg] = useState<string | null>(null);

  // Derived Data for Filters
  const filteredRecords = records.filter(r =>
    (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.reg.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const reportRecords = useMemo(() => {
    return records.filter(r => {
      const matchType = reportFilters.type === 'All Documents' || r.type === reportFilters.type;
      const matchStart = !reportFilters.startDate || new Date(r.date) >= new Date(reportFilters.startDate);
      const matchEnd = !reportFilters.endDate || new Date(r.date) <= new Date(reportFilters.endDate);
      return matchType && matchStart && matchEnd;
    });
  }, [records, reportFilters]);

  const generateRegistryNumber = (type: string) => {
    const config = refConfigs[type as keyof typeof refConfigs] || { prefix: 'REG', separator: '-', padding: 6, start: 1 };
    const count = records.filter(r => r.type === type).length;
    const nextNumber = config.start + count + 1;
    return `${config.prefix}${config.separator}${String(nextNumber).padStart(config.padding, '0')}`;
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingReg(null);
    setFormData({
      type: 'Birth Certificate',
      name: '',
      date: new Date().toISOString().split('T')[0],
      placeOfBirth: '',
      motherName: '',
      fatherName: '',
      location: '',
      editComment: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record: RegistryRecord) => {
    setIsEditMode(true);
    setEditingReg(record.reg);
    setFormData({
      type: record.type,
      name: record.name,
      date: record.date,
      placeOfBirth: record.details['Place of Birth'] || '',
      motherName: record.details['Mother\'s Name'] || record.details['Mother'] || '',
      fatherName: record.details['Father\'s Name'] || record.details['Father'] || '',
      location: record.details['Location/Venue'] || record.details['Location'] || '',
      editComment: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
      const details: Record<string, string> = {};
      if (formData.type === 'Birth Certificate') {
        details['Place of Birth'] = formData.placeOfBirth || 'Not Specified';
        details['Mother\'s Name'] = formData.motherName || 'Not Specified';
        details['Father\'s Name'] = formData.fatherName || 'Not Specified';
      } else {
        details['Location/Venue'] = formData.location || 'Not Specified';
      }

      if (isEditMode && editingReg) {
        setRecords(records.map(r => {
          if (r.reg === editingReg) {
            return {
              ...r,
              date: formData.date,
              name: formData.name,
              details,
              logs: [...r.logs, {
                action: 'Record Modified',
                timestamp: now,
                user: 'Admin',
                comment: formData.editComment || 'General update'
              }]
            };
          }
          return r;
        }));
        setIsModalOpen(false);
      } else {
        const regNo = generateRegistryNumber(formData.type);
        const newRecord: RegistryRecord = {
          date: formData.date,
          type: formData.type,
          name: formData.name,
          reg: regNo,
          status: 'Pending',
          details,
          logs: [{ action: 'Record Created', timestamp: now, user: 'Admin' }]
        };
        setRecords([newRecord, ...records]);
        setLastCreated(newRecord);
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
      }
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setTimeout(async () => {
      setIsExporting(false);
      await alert("Provincial Report generated successfully. Downloading PDF...");
    }, 2000);
  };

  const deleteRecord = async (reg: string) => {
    if (await confirm(`Delete registry record ${reg}?`)) {
      setRecords(records.filter(r => r.reg !== reg));
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Record Management</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[13px] font-medium mt-1 uppercase tracking-wider">Provincial Office Data Hub</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <Tabs
            tabs={[
              { id: 'history', label: 'History', icon: History, permission: 'records.view' as const },
              { id: 'report', label: 'Report', icon: FileBarChart, permission: 'settings.data' as const }
            ].filter(tab => !tab.permission || can(tab.permission))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="border-b-0"
          />
          <div className="hidden sm:block h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-2 shrink-0" />
          <PermissionGate requires="records.edit">
            <Button variant="blue" className="w-full sm:w-auto shadow-lg shadow-blue-500/20" onClick={openAddModal}>
              <Plus size={16} className="mr-2" /> New Entry
            </Button>
          </PermissionGate>
        </div>
      </div>

      {activeTab === 'history' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card
            title="Registry Records"
            description="Complete provincial history of processed documents"
            action={
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  type="text" placeholder="Search by name or ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none w-full sm:w-64 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            }
          >
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="pb-4 px-3 sm:px-0 text-[13px] font-black text-zinc-400 uppercase tracking-widest">Registry No.</th>
                    <th className="pb-4 px-3 sm:px-0 text-[13px] font-black text-zinc-400 uppercase tracking-widest">Date</th>
                    <th className="pb-4 px-3 sm:px-0 text-[13px] font-black text-zinc-400 uppercase tracking-widest">Type</th>
                    <th className="pb-4 px-3 sm:px-0 text-[13px] font-black text-zinc-400 uppercase tracking-widest">Subject Name</th>
                    <th className="pb-4 px-3 sm:px-0 text-[13px] font-black text-zinc-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {filteredRecords.map((row) => (
                    <tr key={row.reg} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                      <td className="py-4 px-3 sm:px-0 cursor-pointer group/reg" onClick={() => openEditModal(row)}>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-black text-zinc-900 dark:text-white tracking-tight group-hover/reg:text-blue-600 transition-colors">{row.reg}</span>
                          <div className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover/reg:bg-blue-50 group-hover/reg:text-blue-600 transition-all">
                            <ArrowRight size={10} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 sm:px-0 text-[13px] text-zinc-500 font-medium">{row.date}</td>
                      <td className="py-4 px-3 sm:px-0 text-[13px] font-black text-zinc-900 dark:text-white uppercase tracking-tight">{row.type}</td>
                      <td className="py-4 px-3 sm:px-0 text-[13px] font-bold tracking-tight">{row.name}</td>
                      <td className="py-4 px-3 sm:px-0 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <PermissionGate requires="records.edit">
                            <button onClick={() => openEditModal(row)} className="p-2 text-zinc-400 hover:text-blue-500" title="Edit Record"><Edit2 size={14} /></button>
                          </PermissionGate>
                          <PermissionGate requires="records.delete">
                            <button onClick={() => deleteRecord(row.reg)} className="p-2 text-zinc-400 hover:text-red-500" title="Delete Record"><Trash2 size={14} /></button>
                          </PermissionGate>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div className="flex-1 space-y-1.5">
              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Start Date</label>
              <input type="date" value={reportFilters.startDate} onChange={e => setReportFilters({ ...reportFilters, startDate: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">End Date</label>
              <input type="date" value={reportFilters.endDate} onChange={e => setReportFilters({ ...reportFilters, endDate: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Document Type</label>
              <select value={reportFilters.type} onChange={e => setReportFilters({ ...reportFilters, type: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs outline-none font-bold">
                <option>All Documents</option>
                <option>Birth Certificate</option>
                <option>Marriage Certificate</option>
                <option>Death Certificate</option>
                <option>CENOMAR</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] uppercase font-black tracking-widest w-full md:w-auto" onClick={handleExportPDF} disabled={isExporting}>
                {isExporting ? <Loader2 size={14} className="animate-spin mr-2" /> : <ArrowDownToLine size={14} className="mr-2" />}
                Export Official PDF
              </Button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Total Volume" description="Filtered record count">
              <p className="text-3xl font-black mt-2 text-zinc-900 dark:text-white tracking-tighter">{reportRecords.length}</p>
            </Card>
            <Card title="Birth Reg" description="Provincial natal volume">
              <p className="text-3xl font-black mt-2 text-blue-600 tracking-tighter">{reportRecords.filter(r => r.type === 'Birth Certificate').length}</p>
            </Card>
            <Card title="Marriage Reg" description="Validated union records">
              <p className="text-3xl font-black mt-2 text-indigo-500 tracking-tighter">{reportRecords.filter(r => r.type === 'Marriage Certificate').length}</p>
            </Card>
            <Card title="Pending Review" description="Awaiting provincial sign-off">
              <p className="text-3xl font-black mt-2 text-amber-500 tracking-tighter">{reportRecords.filter(r => r.status === 'Pending').length}</p>
            </Card>
          </div>

          <Card title="Provincial Activity Summary" description="Analysis of current filtered dataset">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[13px] font-black text-zinc-400 uppercase tracking-widest">
                    <th className="pb-3">Municipality (Est.)</th>
                    <th className="pb-3">Registry Activity</th>
                    <th className="pb-3 text-right">Validation Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {['Baler', 'San Luis', 'Maria Aurora', 'Dingalan'].map(m => (
                    <tr key={m}>
                      <td className="py-4 text-[11px] font-bold text-zinc-900 dark:text-white">{m}</td>
                      <td className="py-4 text-[11px] text-zinc-500">{Math.floor(Math.random() * 400) + 100} Records</td>
                      <td className="py-4 text-right font-mono text-[11px] text-blue-600 font-bold">99.2%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Main Entry/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? `Edit Registry Entry: ${editingReg}` : "Create New Registry Entry"}
        maxWidth={isEditMode ? "max-w-5xl" : "max-w-lg"}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" className="rounded-xl px-6" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="blue" className="rounded-xl px-8 shadow-lg shadow-blue-500/20" onClick={handleSubmit}>
              {isEditMode ? "Update Record" : "Confirm Entry"}
            </Button>
          </div>
        }
      >
        <div className={`grid ${isEditMode ? 'grid-cols-1 lg:grid-cols-5' : 'grid-cols-1'} gap-8 overflow-hidden`}>
          <form className={`${isEditMode ? 'lg:col-span-2' : ''} space-y-5`} onSubmit={handleSubmit}>
            {!isEditMode && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Document Category</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                >
                  <option>Birth Certificate</option>
                  <option>Marriage Certificate</option>
                  <option>Death Certificate</option>
                  <option>CENOMAR</option>
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Subject Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Maria Clara P. Ibarra"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Event Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Registry ID</label>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-[11px] font-mono font-black text-blue-600">
                  <Fingerprint size={12} className="inline mr-1" /> {isEditMode ? editingReg : "Auto-Generated"}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Metadata Requirements</h4>

              {formData.type === 'Birth Certificate' ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Place of Birth</label>
                    <input
                      type="text"
                      placeholder="e.g. Baler, Aurora"
                      value={formData.placeOfBirth}
                      onChange={e => setFormData({ ...formData, placeOfBirth: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Mother's Full Name</label>
                      <input
                        type="text"
                        placeholder="Full Legal Name"
                        value={formData.motherName}
                        onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Father's Full Name</label>
                      <input
                        type="text"
                        placeholder="Full Legal Name"
                        value={formData.fatherName}
                        onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300 space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Event Location / Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. St. Louis Parish Church"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none font-bold"
                  />
                </div>
              )}
            </div>

            {!isEditMode && (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 flex gap-3">
                <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                  All entries are subject to provincial audit and regional hub synchronization under PSA security protocols.
                </p>
              </div>
            )}
          </form>

          {isEditMode && (
            <div className="lg:col-span-3 h-full flex flex-col pt-4 lg:pt-0 lg:border-l border-zinc-100 dark:border-zinc-800 lg:pl-8">
              <div className="space-y-4 flex-1">
                <label className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} /> Modification Audit Trail & Reasoning
                </label>
                <textarea
                  value={formData.editComment}
                  onChange={e => setFormData({ ...formData, editComment: e.target.value })}
                  className="w-full h-24 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none resize-none font-bold placeholder:font-normal focus:ring-1 focus:ring-amber-500 transition-all"
                  placeholder="State the reason for this record update for provincial audit purposes..."
                />

                <div className="mt-6 space-y-4">
                  <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Previous Audit History</h5>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {records.find(r => r.reg === editingReg)?.logs.map((log, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 group hover:border-blue-500/30 transition-all">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'} ring-4 ring-white dark:ring-zinc-950`} />
                          {i !== records.find(r => r.reg === editingReg)!.logs.length - 1 && (
                            <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-800 my-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-zinc-900 dark:text-white uppercase text-[10px] tracking-tight bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-100 dark:border-zinc-700 shadow-sm">{log.action}</span>
                            <span className="text-zinc-400 text-[10px] font-bold">{log.timestamp}</span>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-zinc-500 dark:text-zinc-400 text-[11px] font-bold italic leading-relaxed">
                              {log.comment ? `"${log.comment}"` : "No comment provides"}
                            </p>
                            <p className="text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest">Auth: {log.user}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* REFINED SUCCESS MODAL: HIGH-FIDELITY OFFICIAL REGISTRY RECEIPT */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Official Registry Certificate Issued"
        footer={<Button variant="blue" className="w-full rounded-2xl h-14 text-[11px] font-black uppercase tracking-[0.3em] shadow-lg shadow-blue-500/20" onClick={() => setIsSuccessModalOpen(false)}>Acknowledge & Complete</Button>}
      >
        <div className="flex flex-col items-center py-1">
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-emerald-500 blur-[25px] opacity-10 animate-pulse"></div>
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 relative z-10 border border-emerald-100/50 dark:border-emerald-500/20 shadow-lg">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
          </div>

          <h4 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-0.5">Entry Authenticated</h4>
          <p className="text-[7px] text-zinc-400 font-black uppercase tracking-[0.4em] mb-4">Aurora Provincial Statistical Hub</p>

          {/* Professional Certificate Design */}
          <div className="w-full bg-white dark:bg-[#0c0c0e] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[28px] p-4 sm:p-5 shadow-inner relative overflow-hidden group">
            {/* Holographic Security Seal Simulation */}
            <div className="absolute top-8 right-8 w-24 h-24 pointer-events-none opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity">
              <div className="w-full h-full rounded-full border-8 border-dashed border-blue-600 animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap size={32} className="text-blue-600" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-dashed border-zinc-200 dark:border-zinc-800 pb-4 mb-4 gap-3">
              <div className="space-y-0.5">
                <span className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em] block">Official Registry Number</span>
                <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter leading-none">{lastCreated?.reg}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="success" className="px-2.5 py-0.5 ring-4 ring-emerald-500/5 text-[8px]">VALIDATED</Badge>
                <span className="text-[7px] font-bold text-emerald-600/60 dark:text-emerald-400/40 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4">
              <div className="space-y-0.5">
                <span className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em]">Document Class</span>
                <p className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <FileText size={10} className="text-zinc-400" /> {lastCreated?.type}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em]">Registry Date</span>
                <p className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Calendar size={10} className="text-zinc-400" /> {lastCreated?.date}
                </p>
              </div>
            </div>

            <div className="space-y-0.5 border-t border-zinc-100 dark:border-zinc-800 pt-4 mb-4">
              <span className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em]">Primary Registered Subject</span>
              <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight leading-tight uppercase">{lastCreated?.name}</p>
            </div>

            {/* Submission Metadata Section */}
            <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800">
              <h5 className="text-[9px] font-black text-blue-600/60 dark:text-blue-400/40 uppercase tracking-[0.25em] mb-3">Registry Details Summary</h5>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                {lastCreated && Object.entries(lastCreated.details).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <span className="text-[9.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight block leading-none">{key}</span>
                    <p className="text-[13px] font-black text-zinc-900 dark:text-zinc-100 truncate leading-none">{String(val)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 relative">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 bg-white dark:bg-[#0c0c0e]">
                <CheckCircle2 size={12} className="text-emerald-500" />
              </div>
              <p className="text-[7px] italic text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed text-center px-4">
                Verified and locked in the PSA Aurora Provincial database.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2 w-full">
            <Button variant="outline" className="flex-1 h-9 text-[8px] font-black uppercase tracking-widest rounded-xl" onClick={() => window.print()}>
              <Printer size={12} className="mr-1.5" /> Print
            </Button>
            <Button variant="outline" className="flex-1 h-9 text-[8px] font-black uppercase tracking-widest rounded-xl">
              <Download size={12} className="mr-1.5" /> Download
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reporting Tab (Already functional from previous turn) */}
      {activeTab === 'report' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div className="flex-1 space-y-1.5">
              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Start Date</label>
              <input type="date" value={reportFilters.startDate} onChange={e => setReportFilters({ ...reportFilters, startDate: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">End Date</label>
              <input type="date" value={reportFilters.endDate} onChange={e => setReportFilters({ ...reportFilters, endDate: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Document Type</label>
              <select value={reportFilters.type} onChange={e => setReportFilters({ ...reportFilters, type: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs outline-none font-bold">
                <option>All Documents</option>
                <option>Birth Certificate</option>
                <option>Marriage Certificate</option>
                <option>Death Certificate</option>
                <option>CENOMAR</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] uppercase font-black tracking-widest w-full md:w-auto" onClick={handleExportPDF} disabled={isExporting}>
                {isExporting ? <Loader2 size={14} className="animate-spin mr-2" /> : <ArrowDownToLine size={14} className="mr-2" />}
                Export Official PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Total Volume" description="Filtered record count">
              <p className="text-3xl font-black mt-2 text-zinc-900 dark:text-white tracking-tighter">{reportRecords.length}</p>
            </Card>
            <Card title="Birth Reg" description="Provincial natal volume">
              <p className="text-3xl font-black mt-2 text-blue-600 tracking-tighter">{reportRecords.filter(r => r.type === 'Birth Certificate').length}</p>
            </Card>
            <Card title="Marriage Reg" description="Validated union records">
              <p className="text-3xl font-black mt-2 text-indigo-500 tracking-tighter">{reportRecords.filter(r => r.type === 'Marriage Certificate').length}</p>
            </Card>
            <Card title="Pending Review" description="Awaiting provincial sign-off">
              <p className="text-3xl font-black mt-2 text-amber-500 tracking-tighter">{reportRecords.filter(r => r.status === 'Pending').length}</p>
            </Card>
          </div>

          <Card title="Provincial Activity Summary" description="Analysis of current filtered dataset">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                    <th className="pb-3">Municipality (Est.)</th>
                    <th className="pb-3">Registry Activity</th>
                    <th className="pb-3 text-right">Validation Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {['Baler', 'San Luis', 'Maria Aurora', 'Dingalan'].map(m => (
                    <tr key={m}>
                      <td className="py-4 text-[11px] font-bold text-zinc-900 dark:text-white">{m}</td>
                      <td className="py-4 text-[11px] text-zinc-500">{Math.floor(Math.random() * 400) + 100} Records</td>
                      <td className="py-4 text-right font-mono text-[11px] text-blue-600 font-bold">99.2%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};