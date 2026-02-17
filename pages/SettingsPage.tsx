import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Package, 
  Building2, 
  Users, 
  ShieldCheck, 
  FileText, 
  Save, 
  UserPlus, 
  Key,
  ChevronRight,
  UserCog,
  ShieldAlert
} from 'lucide-react';
import { Card, Badge, Button, Tabs, Modal } from '../components/ui';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('record');
  const [recordSubTab, setRecordSubTab] = useState('docs');
  const [usersSubTab, setUsersSubTab] = useState('accounts');

  const tabs = [
    { id: 'record', label: 'Record Settings', icon: Database },
    { id: 'supply', label: 'Supply Settings', icon: Package },
    { id: 'property', label: 'Property Settings', icon: Building2 },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  const recordSubTabs = [
    { id: 'docs', label: 'Document & Elements', icon: FileText },
  ];

  const userSubTabs = [
    { id: 'accounts', label: 'User Accounts', icon: Users },
    { id: 'roles', label: 'Roles & Permission', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header with Main Tabs - Refined for Mobile Visibility */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">System Configuration</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[13px] font-medium mt-1 uppercase tracking-wider">
            Provincial Office Global Settings
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            className="border-b-0 mb-0" 
          />
          <div className="hidden sm:block h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-2 shrink-0" />
          <Button variant="blue" className="w-full sm:w-auto justify-center">
            <Save size={16} className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      {activeTab === 'record' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <Card 
            title="Registry Configuration" 
            description="Manage document types and metadata structures"
            action={
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl min-w-max">
                {recordSubTabs.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setRecordSubTab(st.id)}
                    className={`
                      px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
                      ${recordSubTab === st.id 
                        ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}
                    `}
                  >
                    <st.icon size={12} />
                    {st.label}
                  </button>
                ))}
              </div>
            }
          >
            {recordSubTab === 'docs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Enabled Document Types</h4>
                  {[
                    { name: 'Birth Certificate', fields: 12, enabled: true },
                    { name: 'Marriage Certificate', fields: 15, enabled: true },
                    { name: 'Death Certificate', fields: 10, enabled: true },
                    { name: 'CENOMAR', fields: 8, enabled: false },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-zinc-400" />
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">{doc.name}</p>
                          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">{doc.fields} Active Fields</p>
                        </div>
                      </div>
                      <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors cursor-pointer ${doc.enabled ? 'bg-blue-600 justify-end' : 'bg-zinc-300 dark:bg-zinc-700 justify-start'}`}>
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Form Elements Configuration</h4>
                  <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                    <p className="text-xs text-zinc-500 italic mb-4">Click a document type to edit its data entry elements and validation rules.</p>
                    <Button variant="outline" className="w-full text-[11px] uppercase tracking-widest">Open Visual Builder</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'supply' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <Card title="Supply Logistics Settings" description="Configure inventory thresholds and automated request rules">
             <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 gap-4">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Auto-Restock Threshold</p>
                    <p className="text-xs text-zinc-500">Items automatically flag for request when stock drops below 20%</p>
                  </div>
                  <input type="number" defaultValue={20} className="w-full sm:w-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm font-bold text-center outline-none" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Regional Hub Integration</p>
                    <p className="text-xs text-zinc-500">Sync local inventory with Region III central database</p>
                  </div>
                  <Badge variant="success">Active Sync</Badge>
                </div>
             </div>
          </Card>
        </div>
      )}

      {activeTab === 'property' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <Card title="Property & Asset Rules" description="Define asset categories and provincial depreciation methods">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-3">Asset Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Electronics', 'Furniture', 'Vehicles', 'Office Equipment'].map(cat => (
                      <Badge key={cat} variant="default" className="!py-1.5 !px-3">{cat}</Badge>
                    ))}
                    <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">+ Add Category</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-3">Audit Schedule</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">Set the frequency for physical asset inventory counts.</p>
                  <select className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none">
                    <option>Semi-Annual (Every 6 months)</option>
                    <option>Annual (Every 12 months)</option>
                    <option>Quarterly (Every 3 months)</option>
                  </select>
                </div>
             </div>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <Card 
            title="Security & Access" 
            description="Manage user roles, accounts, and system-wide permissions"
            action={
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl min-w-max">
                {userSubTabs.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setUsersSubTab(st.id)}
                    className={`
                      px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
                      ${usersSubTab === st.id 
                        ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}
                    `}
                  >
                    <st.icon size={12} />
                    {st.label}
                  </button>
                ))}
              </div>
            }
          >
            {usersSubTab === 'accounts' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                   <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                     <Users size={14} className="text-blue-600" /> User Accounts
                   </h4>
                   <Button variant="outline" className="!py-1.5 !px-3 h-auto text-[10px] uppercase tracking-widest w-full sm:w-auto justify-center"><UserPlus size={12} className="mr-2" /> New User</Button>
                </div>
                <div className="overflow-x-auto -mx-5 sm:mx-0">
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                        <th className="pb-3 px-5 sm:px-0">User Account</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Last Access</th>
                        <th className="pb-3 text-right px-5 sm:px-0">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                      {[
                        { name: 'Admin One', email: 'admin.aurora@psa.gov.ph', role: 'Super Admin', access: 'Just now' },
                        { name: 'Reg Clerk', email: 'clerk.aurora@psa.gov.ph', role: 'Registry Editor', access: '2h ago' },
                        { name: 'Supply Mgr', email: 'supply.aurora@psa.gov.ph', role: 'Inventory Lead', access: 'Yesterday' },
                      ].map((user, idx) => (
                        <tr key={idx} className="group">
                          <td className="py-4 px-5 sm:px-0">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</span>
                              <span className="text-[10px] text-zinc-500">{user.email}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant={user.role === 'Super Admin' ? 'info' : 'default'}>{user.role}</Badge>
                          </td>
                          <td className="py-4 text-xs text-zinc-500 font-medium">{user.access}</td>
                          <td className="py-4 text-right px-5 sm:px-0">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" className="!p-2"><Key size={14}/></Button>
                              <Button variant="ghost" className="!p-2"><ChevronRight size={14}/></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {usersSubTab === 'roles' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                   <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={14} className="text-emerald-600" /> Roles & Permission Matrix
                   </h4>
                   <Button variant="outline" className="!py-1.5 !px-3 h-auto text-[10px] uppercase tracking-widest w-full sm:w-auto justify-center"><UserCog size={12} className="mr-2" /> Add Role</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { role: 'Super Admin', desc: 'Full access to all modules and global settings.', users: 1, color: 'emerald' },
                    { role: 'Registry Editor', desc: 'Can create and modify civil registry records.', users: 4, color: 'blue' },
                    { role: 'Inventory Lead', desc: 'Manage supply requests and inventory levels.', users: 2, color: 'amber' },
                    { role: 'Viewer Only', desc: 'Read-only access to statistics and reports.', users: 3, color: 'zinc' },
                  ].map((role, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant={role.color === 'emerald' ? 'success' : role.color === 'blue' ? 'info' : role.color === 'amber' ? 'warning' : 'default'}>
                          {role.role}
                        </Badge>
                        <span className="text-[10px] font-bold text-zinc-400">{role.users} Active</span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed mb-4">{role.desc}</p>
                      <button className="text-[10px] font-bold text-zinc-400 hover:text-blue-600 uppercase tracking-widest flex items-center gap-1 transition-colors">
                        Edit Permissions <ChevronRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
