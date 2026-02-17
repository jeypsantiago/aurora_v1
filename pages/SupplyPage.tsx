import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, Package, Settings, AlertTriangle, ArrowUpRight, Search, Filter, Layers, ListFilter } from 'lucide-react';
import { Card, Badge, Button, Tabs, ProgressBar } from '../components/ui';

export const SupplyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('request');
  const [activeInventoryTab, setActiveInventoryTab] = useState('all');

  const tabs = [
    { id: 'request', label: 'Request', icon: ShoppingCart },
    { id: 'approval', label: 'Approval', icon: CheckCircle },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const inventorySubTabs = [
    { id: 'all', label: 'All Items' },
    { id: 'low', label: 'Low Stock', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Repositioned Primary Tabs to Upper Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Supply & Logistics</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[13px] font-medium mt-1 uppercase tracking-wider">
            Provincial Inventory Management
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            className="border-b-0 mb-0" 
          />
          <div className="hidden sm:block h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
          <Button variant="blue">
            <ShoppingCart size={16} className="mr-2" /> New Request
          </Button>
        </div>
      </div>

      {activeTab === 'request' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card title="Supply Requests" description="Manage and track outgoing material requests">
            <div className="space-y-4">
              {[
                { item: 'A4 Printing Paper (100 Reams)', user: 'Civil Registry Div', date: '2h ago', status: 'Pending' },
                { item: 'Thermal Printer Ribbons (50 Units)', user: 'PhilSys Hub', date: '5h ago', status: 'In Review' },
                { item: 'Office Stationery Set', user: 'Admin Service', date: 'Yesterday', status: 'Dispatched' },
              ].map((req, i) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                      <ShoppingCart size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{req.item}</p>
                      <p className="text-[11px] text-zinc-500 font-medium">{req.user} • {req.date}</p>
                    </div>
                  </div>
                  <Badge variant={req.status === 'Dispatched' ? 'success' : req.status === 'Pending' ? 'warning' : 'info'}>
                    {req.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'approval' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card title="Pending Approvals" description="Supply requests requiring provincial manager signature">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 -mx-5 px-5">
              {[
                { id: 'SUP-9201', dept: 'Regional Hub', val: '₱45,200', date: 'Dec 24', urgency: 'High' },
                { id: 'SUP-9205', dept: 'Aurora Hub', val: '₱12,800', date: 'Dec 23', urgency: 'Normal' },
              ].map((ap, i) => (
                <div key={i} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{ap.id}</span>
                      <Badge variant={ap.urgency === 'High' ? 'warning' : 'default'} className="!text-[9px]">{ap.urgency}</Badge>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium">{ap.dept} • Requested on {ap.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white mr-4">{ap.val}</span>
                    <Button variant="ghost" className="!p-2 text-zinc-400"><Filter size={14}/></Button>
                    <Button variant="blue" className="!py-1.5 !px-3 text-[11px]">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <Card 
            title={activeInventoryTab === 'low' ? "Low Stock Alerts" : "General Inventory"} 
            description="Monitoring supply levels across provincial offices"
            action={
              <div className="flex items-center gap-2">
                {inventorySubTabs.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setActiveInventoryTab(st.id)}
                    className={`
                      px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.15em] transition-all flex items-center gap-2
                      ${activeInventoryTab === st.id 
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg shadow-zinc-950/10' 
                        : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'}
                    `}
                  >
                    {st.icon && <st.icon size={12} />}
                    {st.label}
                  </button>
                ))}
              </div>
            }
          >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(activeInventoryTab === 'all' ? [
                  { name: 'SECPA Forms', qty: 4500, max: 10000, color: 'bg-blue-600' },
                  { name: 'Envelopes (Large)', qty: 820, max: 2000, color: 'bg-indigo-600' },
                  { name: 'Logbooks', qty: 15, max: 100, color: 'bg-amber-500' },
                  { name: 'Ink Cartridges', qty: 4, max: 50, color: 'bg-red-500' },
                ] : [
                  { name: 'Logbooks', qty: 15, max: 100, color: 'bg-amber-500' },
                  { name: 'Ink Cartridges', qty: 4, max: 50, color: 'bg-red-500' },
                ]).map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <ProgressBar value={item.qty} max={item.max} label={item.name} color={item.color} />
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                       <span className="text-[11px] font-bold text-zinc-400 uppercase">Available: {item.qty.toLocaleString()}</span>
                       <Button variant="ghost" className="!py-1 !px-2 h-auto text-[10px] uppercase font-bold text-blue-600">Restock</Button>
                    </div>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
           <Card title="Logistics Configuration" description="Manage supply chain rules and alerts">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Auto-Restock Notifications</p>
                    <p className="text-xs text-zinc-500">Notify hub when items fall below 15%</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Central Sync Interval</p>
                    <p className="text-xs text-zinc-500">Current: Every 6 hours</p>
                  </div>
                  <Button variant="outline" className="!py-1.5 !px-3 text-xs">Edit</Button>
                </div>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};