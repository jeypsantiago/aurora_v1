import React, { useState } from 'react';
import { History, FileText, Plus, Search, Calendar, User, FileCheck, CheckCircle2, MoreVertical, Download, Printer } from 'lucide-react';
import { Card, Badge, Button, Tabs, Modal } from '../components/ui';

export const RecordPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { id: 'new', label: 'New Entry', icon: Plus },
    { id: 'history', label: 'History', icon: History },
    { id: 'report', label: 'Report', icon: FileText },
  ];

  const handleTabChange = (id: string) => {
    if (id === 'new') {
      setIsModalOpen(true);
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header with scrollable tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Record Management</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[13px] font-medium mt-1 uppercase tracking-wider">
            Civil Registration Database
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
            <Tabs 
              tabs={tabs} 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
              className="border-b-0" 
            />
          </div>
          <div className="hidden sm:block h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-2 shrink-0" />
          <Button variant="outline" className="w-full sm:w-auto justify-center">
            <Printer size={16} className="mr-2" /> Print List
          </Button>
        </div>
      </div>

      {activeTab === 'history' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card 
            title="Civil Registry History" 
            description="Complete list of processed and archived records"
            action={
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input type="text" placeholder="Filter records..." className="pl-9 pr-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none w-48" />
              </div>
            }
          >
            <div className="overflow-x-auto -mx-5 sm:mx-0">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="pb-4 px-5 sm:px-0 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date Processed</th>
                    <th className="pb-4 px-5 sm:px-0 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Document Type</th>
                    <th className="pb-4 px-5 sm:px-0 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Subject Name</th>
                    <th className="pb-4 px-5 sm:px-0 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Registry No.</th>
                    <th className="pb-4 px-5 sm:px-0 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {[
                    { date: 'Dec 24, 2024', type: 'Birth Cert', name: 'Althea Grace Cruz', reg: '2024-001293', status: 'Archived' },
                    { date: 'Dec 23, 2024', type: 'Marriage Cert', name: 'Santos - Garcia', reg: '2024-001292', status: 'Pending' },
                    { date: 'Dec 22, 2024', type: 'Death Cert', name: 'Benjamin Salonga', reg: '2024-001291', status: 'Archived' },
                    { date: 'Dec 21, 2024', type: 'CENOMAR', name: 'Clarisse Villena', reg: '2024-001290', status: 'Archived' },
                  ].map((row, idx) => (
                    <tr key={idx} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-4 px-5 sm:px-0 text-sm font-medium text-zinc-500">{row.date}</td>
                      <td className="py-4 px-5 sm:px-0">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">{row.type}</span>
                      </td>
                      <td className="py-4 px-5 sm:px-0 text-sm text-zinc-700 dark:text-zinc-300">{row.name}</td>
                      <td className="py-4 px-5 sm:px-0 font-mono text-[11px] text-zinc-400">{row.reg}</td>
                      <td className="py-4 px-5 sm:px-0">
                        <Badge variant={row.status === 'Archived' ? 'success' : 'warning'}>{row.status}</Badge>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Monthly Volume" description="Current period registration totals">
              <div className="flex items-end justify-between mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">1,204</span>
                <Badge variant="success" className="mb-1">+8.4%</Badge>
              </div>
            </Card>
            <Card title="Approval Rate" description="Efficiency of certification process">
              <div className="flex items-end justify-between mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">96.2%</span>
                <Badge variant="info" className="mb-1">Target Met</Badge>
              </div>
            </Card>
            <Card title="Pending Review" description="Records awaiting final signature">
              <div className="flex items-end justify-between mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">42</span>
                <Badge variant="warning" className="mb-1">Action Needed</Badge>
              </div>
            </Card>
          </div>
          
          <Card title="Annual Summary 2024" description="Comparative report by municipality">
             <div className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20">
                <div className="text-center">
                   <FileText size={32} className="mx-auto text-zinc-300 mb-2" />
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Visualization Data Loading...</p>
                </div>
             </div>
          </Card>
        </div>
      )}

      {/* New Entry Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Record Entry"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="blue">Confirm Entry</Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Document Type</label>
            <select className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              <option>Birth Certificate</option>
              <option>Marriage Certificate</option>
              <option>Death Certificate</option>
              <option>CENOMAR</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Subject Full Name</label>
            <input type="text" placeholder="e.g. Juan P. Dela Cruz" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Registry Date</label>
              <input type="date" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Book No.</label>
              <input type="text" placeholder="BK-2024" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
          </div>
          <div className="space-y-1.5 pt-2">
             <div className="flex items-center gap-2 text-blue-600">
               <CheckCircle2 size={16} />
               <span className="text-[11px] font-bold uppercase tracking-widest">Verify before submission</span>
             </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};