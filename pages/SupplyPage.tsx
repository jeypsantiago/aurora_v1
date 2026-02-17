import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  CheckCircle, 
  Package, 
  AlertTriangle, 
  Search, 
  Plus, 
  Minus,
  Trash2, 
  ClipboardList, 
  Clock, 
  ArrowRight, 
  FileCheck, 
  History as HistoryIcon, 
  XCircle, 
  CheckCircle2, 
  Truck,
  Database,
  Info,
  UserCheck,
  PackageCheck,
  SearchIcon,
  Eye,
  Settings2,
  Edit2,
  FileSpreadsheet,
  Upload,
  RefreshCcw
} from 'lucide-react';
import { Card, Badge, Button, Tabs, ProgressBar, Modal } from '../components/ui';

interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  physicalQty: number;
  pendingQty: number; 
  reorderPoint: number;
}

type RequestStatus = 'For Verification' | 'Awaiting Approval' | 'For Issuance' | 'To Receive' | 'Rejected' | 'History';

interface SupplyRequest {
  id: string;
  items: { id: string; name: string; qty: number; unit: string }[];
  purpose: string;
  status: RequestStatus;
  date: string;
  requester: string;
}

export const SupplyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('items');
  const [activeApprovalTab, setActiveApprovalTab] = useState<RequestStatus>('For Verification');
  const [activeInventoryTab, setActiveInventoryTab] = useState('all');
  
  // -- Search States --
  const [itemSearch, setItemSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  // -- Modals --
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const [selectedRequest, setSelectedRequest] = useState<SupplyRequest | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // -- Mock Unit Master (In real app, this would come from global state/context synced with Settings) --
  const unitMaster = ['Reams', 'Forms', 'Units', 'Rolls', 'Boxes', 'Packs', 'Bottles'];

  // -- State for Inventory --
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'A4 Printing Paper', unit: 'Reams', physicalQty: 100, pendingQty: 15, reorderPoint: 20 },
    { id: '2', name: 'SECPA Forms', unit: 'Forms', physicalQty: 5000, pendingQty: 200, reorderPoint: 1000 },
    { id: '3', name: 'Ink Cartridges (Black)', unit: 'Units', physicalQty: 12, pendingQty: 2, reorderPoint: 15 },
    { id: '4', name: 'Office Stapler', unit: 'Units', physicalQty: 45, pendingQty: 0, reorderPoint: 10 },
    { id: '5', name: 'Thermal Ribbons', unit: 'Rolls', physicalQty: 8, pendingQty: 5, reorderPoint: 10 },
  ]);

  // -- State for Quantity Modifier in Items Table --
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  // -- State for Requests --
  const [requests, setRequests] = useState<SupplyRequest[]>([
    { 
      id: 'REQ-001', 
      items: [{ id: '2', name: 'SECPA Forms', qty: 100, unit: 'Forms' }], 
      purpose: 'Monthly Civil Registry allocation for Baler Municipality', 
      status: 'For Verification', 
      date: '2h ago', 
      requester: 'Registry Div' 
    },
    { 
      id: 'REQ-002', 
      items: [{ id: '1', name: 'A4 Printing Paper', qty: 10, unit: 'Reams' }], 
      purpose: 'Standard office replenishment', 
      status: 'Awaiting Approval', 
      date: '5h ago', 
      requester: 'Admin Dept' 
    },
  ]);

  // -- Request Cart State --
  const [requestCart, setRequestCart] = useState<{ itemId: string; qty: number }[]>([]);
  const [requestPurpose, setRequestPurpose] = useState('');

  // -- New/Edit Item State --
  const [itemFormData, setItemFormData] = useState({ name: '', unit: 'Reams', physicalQty: 0, reorderPoint: 0 });

  const handleAddItemToCart = (itemId: string) => {
    const qtyToAdd = itemQuantities[itemId] || 1;
    const existing = requestCart.find(c => c.itemId === itemId);
    if (existing) {
      setRequestCart(requestCart.map(c => c.itemId === itemId ? { ...c, qty: c.qty + qtyToAdd } : c));
    } else {
      setRequestCart([...requestCart, { itemId, qty: qtyToAdd }]);
    }
    setItemQuantities({ ...itemQuantities, [itemId]: 1 });
  };

  const updateItemModifier = (itemId: string, delta: number) => {
    const current = itemQuantities[itemId] || 1;
    setItemQuantities({ ...itemQuantities, [itemId]: Math.max(1, current + delta) });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setRequestCart(requestCart.filter(c => c.itemId !== itemId));
  };

  const handleSubmitRequest = () => {
    if (requestCart.length === 0 || !requestPurpose.trim()) {
      alert("Please select items and provide a purpose.");
      return;
    }

    const newReqItems = requestCart.map(cartItem => {
      const invItem = inventory.find(i => i.id === cartItem.itemId)!;
      return { id: invItem.id, name: invItem.name, qty: cartItem.qty, unit: invItem.unit };
    });

    const newReq: SupplyRequest = {
      id: `REQ-${Math.floor(Math.random() * 900) + 100}`,
      items: newReqItems,
      purpose: requestPurpose,
      status: 'For Verification',
      date: 'Just now',
      requester: 'Admin Admin (You)'
    };

    setInventory(inventory.map(invItem => {
      const cartItem = requestCart.find(c => c.itemId === invItem.id);
      if (cartItem) {
        return { ...invItem, pendingQty: invItem.pendingQty + cartItem.qty };
      }
      return invItem;
    }));

    setRequests([newReq, ...requests]);
    setRequestCart([]);
    setRequestPurpose('');
    setIsRequestModalOpen(false);
  };

  // --- Workflow Handlers ---

  const handleVerify = (reqId: string) => {
    const request = requests.find(r => r.id === reqId);
    if (!request) return;

    setInventory(prev => prev.map(invItem => {
      const reqItem = request.items.find(ri => ri.id === invItem.id);
      if (reqItem) {
        return { 
          ...invItem, 
          physicalQty: invItem.physicalQty - reqItem.qty, 
          pendingQty: invItem.pendingQty - reqItem.qty  
        };
      }
      return invItem;
    }));

    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Awaiting Approval' } : r));
  };

  const handleApprove = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'For Issuance' } : r));
  };

  const handleIssue = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'To Receive' } : r));
  };

  const handleReceive = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'History' } : r));
  };

  const handleReject = (reqId: string) => {
    const request = requests.find(r => r.id === reqId);
    if (!request) return;

    if (request.status === 'For Verification') {
      setInventory(prev => prev.map(invItem => {
        const reqItem = request.items.find(ri => ri.id === invItem.id);
        if (reqItem) {
          return { ...invItem, pendingQty: invItem.pendingQty - reqItem.qty };
        }
        return invItem;
      }));
    } else {
      setInventory(prev => prev.map(invItem => {
        const reqItem = request.items.find(ri => ri.id === invItem.id);
        if (reqItem) {
          return { ...invItem, physicalQty: invItem.physicalQty + reqItem.qty };
        }
        return invItem;
      }));
    }
    
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Rejected' } : r));
  };

  const openDetailModal = (req: SupplyRequest) => {
    setSelectedRequest(JSON.parse(JSON.stringify(req)));
    setIsDetailModalOpen(true);
  };

  const saveRequestModification = () => {
    if (!selectedRequest) return;
    const originalRequest = requests.find(r => r.id === selectedRequest.id);
    if (!originalRequest) return;

    if (originalRequest.status === 'For Verification') {
      const newInventory = [...inventory];
      selectedRequest.items.forEach(newItem => {
        const oldItem = originalRequest.items.find(oi => oi.id === newItem.id);
        const invIdx = newInventory.findIndex(i => i.id === newItem.id);
        if (invIdx !== -1) {
          const diff = newItem.qty - (oldItem?.qty || 0);
          newInventory[invIdx].pendingQty += diff;
        }
      });
      setInventory(newInventory);
    } else if (originalRequest.status !== 'Rejected' && originalRequest.status !== 'History') {
       const newInventory = [...inventory];
       selectedRequest.items.forEach(newItem => {
         const oldItem = originalRequest.items.find(oi => oi.id === newItem.id);
         const invIdx = newInventory.findIndex(i => i.id === newItem.id);
         if (invIdx !== -1) {
           const diff = newItem.qty - (oldItem?.qty || 0);
           newInventory[invIdx].physicalQty -= diff;
         }
       });
       setInventory(newInventory);
    }

    setRequests(requests.map(r => r.id === selectedRequest.id ? selectedRequest : r));
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  const updateSelectedRequestQty = (itemId: string, delta: number) => {
    if (!selectedRequest) return;
    setSelectedRequest({
      ...selectedRequest,
      items: selectedRequest.items.map(it => it.id === itemId ? { ...it, qty: Math.max(1, it.qty + delta) } : it)
    });
  };

  const handleSaveItem = () => {
    if (!itemFormData.name || !itemFormData.unit) return;
    
    if (editingItem) {
      setInventory(inventory.map(i => i.id === editingItem.id ? { ...i, ...itemFormData } : i));
    } else {
      const item: InventoryItem = {
        id: Date.now().toString(),
        ...itemFormData,
        pendingQty: 0
      };
      setInventory([...inventory, item]);
    }
    
    setItemFormData({ name: '', unit: 'Reams', physicalQty: 0, reorderPoint: 0 });
    setEditingItem(null);
    setIsNewItemModalOpen(false);
  };

  const openEditItemModal = (item: InventoryItem) => {
    setEditingItem(item);
    setItemFormData({ 
      name: item.name, 
      unit: item.unit, 
      physicalQty: item.physicalQty, 
      reorderPoint: item.reorderPoint 
    });
    setIsNewItemModalOpen(true);
  };

  const handleSimulatedImport = () => {
    alert("Simulating import: Found 3 new items in spreadsheet.");
    const imports: InventoryItem[] = [
      { id: 'imp-1', name: 'Binder Clips (Small)', unit: 'Boxes', physicalQty: 50, pendingQty: 0, reorderPoint: 5 },
      { id: 'imp-2', name: 'File Folders (Short)', unit: 'Packs', physicalQty: 20, pendingQty: 0, reorderPoint: 10 },
      { id: 'imp-3', name: 'Correcton Tape', unit: 'Units', physicalQty: 100, pendingQty: 0, reorderPoint: 20 },
    ];
    setInventory([...inventory, ...imports]);
    setIsImportModalOpen(false);
  };

  // --- Filtering ---
  const filteredItems = inventory.filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase()));
  const filteredInventory = inventory.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchTab = activeInventoryTab === 'all' || i.physicalQty <= i.reorderPoint;
    return matchSearch && matchTab;
  });

  const tabs = [
    { id: 'items', label: 'Items', icon: Database },
    { id: 'my-requests', label: 'My Request', icon: UserCheck },
    { id: 'approval', label: 'Approval', icon: CheckCircle },
    { id: 'inventory', label: 'Inventory', icon: Package },
  ];

  const approvalTabs: { id: RequestStatus; icon: any }[] = [
    { id: 'For Verification', icon: FileCheck },
    { id: 'Awaiting Approval', icon: Clock },
    { id: 'For Issuance', icon: Truck },
    { id: 'To Receive', icon: PackageCheck },
    { id: 'Rejected', icon: XCircle },
    { id: 'History', icon: HistoryIcon },
  ];

  const lowStockItems = inventory.filter(item => item.physicalQty <= item.reorderPoint);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight uppercase">Supply & Logistics</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[13px] font-medium mt-1 uppercase tracking-widest">
            Provincial Resource Control
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
          {activeTab === 'inventory' && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setIsImportModalOpen(true)} className="h-10 text-[10px] font-black uppercase">
                <FileSpreadsheet size={16} className="mr-2" /> Import
              </Button>
              <Button variant="blue" onClick={() => { setEditingItem(null); setItemFormData({ name: '', unit: 'Reams', physicalQty: 0, reorderPoint: 0 }); setIsNewItemModalOpen(true); }} className="h-10 px-6">
                <Plus size={16} className="mr-2" /> New Item
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ITEMS TAB */}
      {activeTab === 'items' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative group w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search available stock..." 
                value={itemSearch}
                onChange={e => setItemSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm shadow-sm"
              />
            </div>
            <Button variant="blue" className="w-full sm:w-auto px-8 h-[52px] rounded-2xl shadow-lg shadow-blue-500/20" onClick={() => setIsRequestModalOpen(true)}>
              <ShoppingCart size={18} className="mr-2" /> Create Request ({requestCart.length})
            </Button>
          </div>

          <Card title="Current Stock Status" description="Real-time availability of provincial supplies">
            <div className="overflow-x-auto -mx-5 sm:mx-0">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800/50">
                    <th className="pb-4 px-5 sm:px-0">Item Name</th>
                    <th className="pb-4">Unit</th>
                    <th className="pb-4">Physical Qty</th>
                    <th className="pb-4">Pending</th>
                    <th className="pb-4">Available</th>
                    <th className="pb-4 text-center">Req. Qty</th>
                    <th className="pb-4 text-right px-5 sm:px-0">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/30">
                  {filteredItems.map((item) => {
                    const available = item.physicalQty - item.pendingQty;
                    const isLow = item.physicalQty <= item.reorderPoint;
                    const modifierValue = itemQuantities[item.id] || 1;

                    return (
                      <tr key={item.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                        <td className="py-4 px-5 sm:px-0">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">{item.name}</span>
                            {isLow && <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1 mt-0.5"><AlertTriangle size={10} /> Low Stock</span>}
                          </div>
                        </td>
                        <td className="py-4 text-sm text-zinc-500 font-medium">{item.unit}</td>
                        <td className="py-4 text-sm font-bold text-zinc-900 dark:text-white">{item.physicalQty.toLocaleString()}</td>
                        <td className="py-4 text-sm font-bold text-amber-500">{item.pendingQty.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`text-sm font-black ${available <= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                            {available.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4">
                           <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => updateItemModifier(item.id, -1)}
                                className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-black w-8 text-center">{modifierValue}</span>
                              <button 
                                onClick={() => updateItemModifier(item.id, 1)}
                                className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                           </div>
                        </td>
                        <td className="py-4 text-right px-5 sm:px-0">
                          <Button 
                            variant="blue" 
                            className="!px-3 !py-1.5 !text-[10px] uppercase font-black tracking-widest rounded-xl"
                            onClick={() => handleAddItemToCart(item.id)}
                            disabled={available <= 0}
                          >
                            Add to Cart
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* MY REQUESTS TAB */}
      {activeTab === 'my-requests' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <Card title="My Requisitions" description="Track the status of your submitted supply requests">
             <div className="space-y-4">
                {requests.filter(r => r.requester.includes('You')).length > 0 ? (
                  requests.filter(r => r.requester.includes('You')).map(req => (
                    <div key={req.id} className="p-4 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-blue-600 border border-zinc-200 dark:border-zinc-700">
                               <Package size={16} />
                            </div>
                            <div>
                               <p className="text-xs font-black text-zinc-900 dark:text-white leading-none">{req.id}</p>
                               <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">{req.date}</p>
                            </div>
                            <Badge variant={req.status === 'History' ? 'success' : req.status === 'Rejected' ? 'warning' : 'info'} className="!text-[8px] h-4">{req.status}</Badge>
                          </div>
                          <p className="text-[10px] text-zinc-500 italic truncate max-w-sm">"{req.purpose}"</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <Button variant="ghost" className="h-9 px-4 text-[9px] uppercase font-black tracking-widest" onClick={() => openDetailModal(req)}>
                            <Eye size={12} className="mr-2" /> View Items
                          </Button>
                          {req.status === 'To Receive' && (
                            <Button variant="blue" className="rounded-xl px-6 h-9 text-[9px] font-black uppercase tracking-widest" onClick={() => handleReceive(req.id)}>
                              Received
                            </Button>
                          )}
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center opacity-40">
                    <HistoryIcon size={48} className="mb-4 text-zinc-300" />
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No requests found</p>
                  </div>
                )}
             </div>
          </Card>
        </div>
      )}

      {/* APPROVAL TAB */}
      {activeTab === 'approval' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-x-auto scrollbar-hide">
            {approvalTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveApprovalTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${activeApprovalTab === tab.id 
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg shadow-zinc-950/20' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'}
                `}
              >
                <tab.icon size={14} />
                {tab.id}
                <span className="ml-1 opacity-50">({requests.filter(r => r.status === tab.id).length})</span>
              </button>
            ))}
          </div>

          <Card title={`${activeApprovalTab} Queue`} description="Manage workflow for supply disbursements">
            <div className="space-y-3">
              {requests.filter(r => r.status === activeApprovalTab).length > 0 ? (
                requests.filter(r => r.status === activeApprovalTab).map((req) => (
                  <div key={req.id} className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-blue-600 shadow-sm">
                          <ClipboardList size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{req.id}</p>
                          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{req.requester} • {req.date}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-medium italic truncate max-w-md">"{req.purpose}"</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="h-9 px-4 text-[9px] uppercase font-black tracking-widest" onClick={() => openDetailModal(req)}>
                        <Eye size={12} className="mr-2" /> Items Detail
                      </Button>
                      <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
                      {activeApprovalTab === 'For Verification' && (
                        <Button variant="blue" className="!text-[9px] !py-2 !px-4 h-9 uppercase font-black" onClick={() => handleVerify(req.id)}>Verify</Button>
                      )}
                      {activeApprovalTab === 'Awaiting Approval' && (
                        <Button variant="primary" className="!text-[9px] !py-2 !px-4 h-9 uppercase font-black" onClick={() => handleApprove(req.id)}>Approve</Button>
                      )}
                      {activeApprovalTab === 'For Issuance' && (
                        <Button variant="blue" className="!text-[9px] !py-2 !px-4 h-9 uppercase font-black" onClick={() => handleIssue(req.id)}>Issue</Button>
                      )}
                      {(activeApprovalTab !== 'History' && activeApprovalTab !== 'Rejected' && activeApprovalTab !== 'To Receive') && (
                        <Button variant="ghost" className="!text-[9px] !py-2 !px-4 h-9 uppercase font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => handleReject(req.id)}>Reject</Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center text-center opacity-40">
                  <CheckCircle2 size={48} className="mb-4 text-zinc-300" />
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Queue is currently clear</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-fit">
               <button
                 onClick={() => setActiveInventoryTab('all')}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeInventoryTab === 'all' ? 'bg-zinc-900 text-white dark:bg-white dark:text-black' : 'text-zinc-500'}`}
               >
                 All Items ({inventory.length})
               </button>
               <button
                 onClick={() => setActiveInventoryTab('low')}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeInventoryTab === 'low' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}
               >
                 <AlertTriangle size={14} /> Low Stock ({lowStockItems.length})
               </button>
             </div>
             <div className="relative group min-w-[300px]">
               <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={16} />
               <input 
                 type="text" 
                 placeholder="Search inventory..." 
                 value={inventorySearch}
                 onChange={e => setInventorySearch(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs"
               />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <Card key={item.id} className="relative group !p-4 !pb-4">
                <div className="absolute top-4 right-4 flex gap-1">
                  <Badge variant={item.physicalQty <= item.reorderPoint ? 'warning' : 'info'} className="!text-[8px] px-2 py-0.5">
                    {item.physicalQty <= item.reorderPoint ? 'RESTOCK' : 'HEALTHY'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                    <Package size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight truncate">{item.name}</h4>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{item.unit}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <ProgressBar 
                    value={item.physicalQty} 
                    max={Math.max(item.physicalQty, item.reorderPoint * 3)} 
                    color={item.physicalQty <= item.reorderPoint ? 'bg-red-500' : 'bg-blue-600'}
                  />
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest border-t border-zinc-100 dark:border-zinc-800 pt-3 pb-1">
                    <div className="space-y-0.5">
                      <span className="text-zinc-400">Re-order</span>
                      <p className="text-zinc-900 dark:text-white">{item.reorderPoint} {item.unit}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <span className="text-zinc-400">Current</span>
                      <p className="text-zinc-900 dark:text-white font-black">{item.physicalQty}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" className="!p-2 text-zinc-400 hover:text-blue-500" onClick={() => openEditItemModal(item)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="ghost" className="!p-2 text-zinc-400 hover:text-red-500" onClick={() => setInventory(inventory.filter(i => i.id !== item.id))}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* REQUEST ITEMS DETAIL MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setSelectedRequest(null); }}
        title={`Requisition Details: ${selectedRequest?.id}`}
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="ghost" className="flex-1" onClick={() => { setIsDetailModalOpen(false); setSelectedRequest(null); }}>Discard Changes</Button>
            <Button variant="blue" className="flex-1 uppercase font-black text-[10px] tracking-widest" onClick={saveRequestModification}>Update Quantities</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Request Origin</h4>
            <div className="flex justify-between items-center">
               <p className="text-sm font-bold">{selectedRequest?.requester}</p>
               <Badge variant="info">{selectedRequest?.status}</Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-2 italic leading-relaxed">"{selectedRequest?.purpose}"</p>
          </div>

          <div className="space-y-3">
             <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Requested Items List</h4>
             <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-800/50">
                      <th className="pb-3 pr-4">Item (Unit)</th>
                      <th className="pb-3 text-center">Qty</th>
                      <th className="pb-3 text-right">Phys.</th>
                      <th className="pb-3 text-right">Avail.</th>
                      <th className="pb-3 text-right">Pend.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/30">
                    {selectedRequest?.items.map(reqItem => {
                      const inv = inventory.find(i => i.id === reqItem.id);
                      if (!inv) return null;
                      return (
                        <tr key={reqItem.id} className="group">
                          <td className="py-3 pr-4">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-zinc-900 dark:text-white truncate max-w-[120px]">{reqItem.name}</span>
                              <span className="text-[8px] text-zinc-400 font-bold uppercase">{reqItem.unit}</span>
                            </div>
                          </td>
                          <td className="py-3">
                             <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => updateSelectedRequestQty(reqItem.id, -1)} className="w-5 h-5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400"><Minus size={10}/></button>
                                <span className="text-[11px] font-black w-4 text-center">{reqItem.qty}</span>
                                <button onClick={() => updateSelectedRequestQty(reqItem.id, 1)} className="w-5 h-5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400"><Plus size={10}/></button>
                             </div>
                          </td>
                          <td className="py-3 text-[11px] font-bold text-zinc-600 text-right">{inv.physicalQty}</td>
                          <td className="py-3 text-[11px] font-black text-blue-600 text-right">{inv.physicalQty - inv.pendingQty}</td>
                          <td className="py-3 text-[11px] font-bold text-amber-500 text-right">{inv.pendingQty}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
             </div>
          </div>
          
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 flex gap-2">
            <Settings2 size={14} className="text-blue-600 shrink-0" />
            <p className="text-[9px] text-blue-700 dark:text-blue-400 font-medium">
              Modified quantities will update the pending earmarks or physical stocks upon saving. Review available stock before approval.
            </p>
          </div>
        </div>
      </Modal>

      {/* NEW/EDIT ITEM MODAL */}
      <Modal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        title={editingItem ? "Edit Inventory Item" : "Register New Inventory Item"}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsNewItemModalOpen(false)}>Cancel</Button>
            <Button variant="blue" onClick={handleSaveItem}>{editingItem ? "Update Item" : "Register Item"}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Item Name</label>
            <input 
              type="text" 
              value={itemFormData.name}
              onChange={e => setItemFormData({...itemFormData, name: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none font-bold"
              placeholder="e.g. SECPA Security Paper"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Unit of Measurement</label>
            <select 
              value={itemFormData.unit}
              onChange={e => setItemFormData({...itemFormData, unit: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none font-bold"
            >
              {unitMaster.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Initial Physical Qty</label>
              <input 
                type="number" 
                value={itemFormData.physicalQty}
                onChange={e => setItemFormData({...itemFormData, physicalQty: parseInt(e.target.value) || 0})}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Re-order Point</label>
              <input 
                type="number" 
                value={itemFormData.reorderPoint}
                onChange={e => setItemFormData({...itemFormData, reorderPoint: parseInt(e.target.value) || 0})}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* IMPORT MODAL */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Stock from Excel"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsImportModalOpen(false)}>Cancel</Button>
            <Button variant="blue" onClick={handleSimulatedImport}>Start Import</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] flex flex-col items-center justify-center text-center group hover:border-blue-500/40 transition-colors cursor-pointer">
             <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-blue-500 transition-colors mb-4">
                <Upload size={32} />
             </div>
             <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Click to upload spreadsheet</p>
             <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Supports .XLSX, .CSV format</p>
          </div>
          
          <div className="space-y-4">
             <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Required Column Mapping</h4>
             <div className="grid grid-cols-3 gap-2">
                {['Item Name', 'Unit', 'Quantity'].map(col => (
                  <div key={col} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-tight">{col}</span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1"><RefreshCcw size={8}/> Auto-detected</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 flex gap-3">
             <AlertTriangle size={18} className="text-amber-600 shrink-0" />
             <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
               Importing will add new items to the inventory. If the item name already exists, the physical quantity will be summed.
             </p>
          </div>
        </div>
      </Modal>

      {/* CREATE REQUEST MODAL (THE CART) */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Supply Requisition Cart"
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="ghost" className="flex-1" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
            <Button variant="blue" className="flex-[2] h-14 uppercase font-black tracking-widest" onClick={handleSubmitRequest}>Submit Requisition</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Selected Items ({requestCart.length})</h4>
            <div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-hide">
              {requestCart.length > 0 ? requestCart.map((cartItem) => {
                const item = inventory.find(i => i.id === cartItem.itemId)!;
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                    <div>
                      <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.unit}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setRequestCart(requestCart.map(c => c.itemId === item.id ? { ...c, qty: Math.max(1, c.qty - 1) } : c))}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400"
                        >-</button>
                        <span className="text-sm font-black w-8 text-center">{cartItem.qty}</span>
                        <button 
                          onClick={() => setRequestCart(requestCart.map(c => c.itemId === item.id ? { ...c, qty: c.qty + 1 } : c))}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400"
                        >+</button>
                      </div>
                      <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-10 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl opacity-40">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No items selected from stock</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Info size={12} className="text-blue-600" /> Purpose of Requisition
            </label>
            <textarea 
              value={requestPurpose}
              onChange={e => setRequestPurpose(e.target.value)}
              className="w-full h-32 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g. Allocation for upcoming mobile registration mission in Dingalan..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
