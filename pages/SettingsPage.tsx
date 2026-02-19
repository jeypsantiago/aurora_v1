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
  CheckCircle2,
  Trash2,
  Plus,
  GripVertical,
  Type as TypeIcon,
  Calendar as CalendarIcon,
  Hash,
  ToggleLeft,
  Info,
  Edit2,
  CheckSquare,
  Mail,
  Phone as PhoneIcon,
  List as ListIcon,
  Link as LinkIcon,
  Database as DatabaseIcon,
  Fingerprint,
  Zap,
  AlertTriangle,
  FileCheck,
  Scale,
  AlignLeft,
  ListPlus,
  Clock,
  CalendarRange,
  SeparatorHorizontal,
  Star,
  Palette
} from 'lucide-react';
import { Card, Badge, Button, Tabs, Modal, Input } from '../components/ui';
import { useDialog } from '../DialogContext';
import { useUsers, User, Role } from '../UserContext';
import { PERMISSION_GROUPS, Permission, PERMISSION_DESCRIPTIONS } from '../types';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'email' | 'tel' | 'textarea' | 'multiselect' | 'url' | 'datetime' | 'time' | 'section' | 'rating' | 'color';
  required: boolean;
  options?: string[]; // For manual select type
  collectionSource?: string; // Connected data collection key
}

interface DocType {
  id: string;
  name: string;
  enabled: boolean;
  refPrefix: string;
  refSeparator: string;
  refPadding: number;
  refIncrement: number;
  refStart: number;
}

interface RISConfig {
  prefix: string;
  separator: string;
  padding: number;
  increment: number;
  startNumber: number;
}

export const SettingsPage: React.FC = () => {
  const { alert, confirm, prompt } = useDialog();
  const [activeTab, setActiveTab] = useState('record');
  const [recordSubTab, setRecordSubTab] = useState('docs');
  const [supplySubTab, setSupplySubTab] = useState('ris');
  const [usersSubTab, setUsersSubTab] = useState('accounts');

  // -- State for Registry Settings --
  const [docTypes, setDocTypes] = useState<DocType[]>([
    { id: 'birth', name: 'Birth Certificate', enabled: true, refPrefix: 'BC', refSeparator: '-', refPadding: 6, refIncrement: 1, refStart: 1000 },
    { id: 'marriage', name: 'Marriage Certificate', enabled: true, refPrefix: 'MC', refSeparator: '-', refPadding: 6, refIncrement: 1, refStart: 500 },
    { id: 'death', name: 'Death Certificate', enabled: true, refPrefix: 'DC', refSeparator: '-', refPadding: 6, refIncrement: 1, refStart: 100 },
    { id: 'cenomar', name: 'CENOMAR', enabled: false, refPrefix: 'CN', refSeparator: '-', refPadding: 6, refIncrement: 1, refStart: 1 },
  ]);

  const [docFields, setDocFields] = useState<Record<string, FormField[]>>({
    birth: [
      { id: '1', label: 'First Name', type: 'text', required: true },
      { id: '2', label: 'Last Name', type: 'text', required: true },
      { id: '3', label: 'Date of Birth', type: 'date', required: true },
      { id: '4', label: 'Place of Birth', type: 'text', required: true },
    ],
    marriage: [
      { id: '5', label: 'Groom Name', type: 'text', required: true },
      { id: '6', label: 'Bride Name', type: 'text', required: true },
      { id: '7', label: 'Date of Marriage', type: 'date', required: true },
    ],
    death: [
      { id: '8', label: 'Name of Deceased', type: 'text', required: true },
      { id: '9', label: 'Date of Death', type: 'date', required: true },
    ],
    cenomar: [
      { id: '10', label: 'Subject Name', type: 'text', required: true },
    ]
  });

  // -- Data Collections State --
  const [dataCollections, setDataCollections] = useState<Record<string, string[]>>({
    'Positions': ['Admin Clerk', 'Statistician', 'Field Officer', 'Provincial Lead'],
    'Municipalities': ['Baler', 'Casiguran', 'Dilasag', 'Dinalungan', 'Dingalan', 'Dipaculao', 'Maria Aurora', 'San Luis'],
    'Genders': ['Male', 'Female', 'Prefer not to say']
  });
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState('birth');

  // New Field State
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FormField['type']>('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [newFieldCollection, setNewFieldCollection] = useState('');

  // Rename State
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [docToRename, setDocToRename] = useState<DocType | null>(null);
  const [renamedValue, setRenamedValue] = useState('');

  // Ref Generator State
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);
  const [docForRef, setDocForRef] = useState<DocType | null>(null);

  // -- State for Supply Settings --
  const [risConfig, setRisConfig] = useState<RISConfig>({
    prefix: 'RIS',
    separator: '-',
    padding: 6,
    increment: 1,
    startNumber: 1
  });
  const [unitMaster, setUnitMaster] = useState(['Reams', 'Forms', 'Units', 'Rolls', 'Boxes', 'Packs', 'Bottles']);
  const [restockThreshold, setRestockThreshold] = useState(20);
  const [hubIntegration, setHubIntegration] = useState(true);

  // -- State for Property Settings --
  const [assetCategories, setAssetCategories] = useState(['Electronics', 'Furniture', 'Vehicles', 'Office Equipment']);
  const [auditSchedule, setAuditSchedule] = useState('Semi-Annual (Every 6 months)');

  // -- State for User Management (Now handled by UserContext) --
  const { users, roles, addUser, updateUser, deleteUser, addRole, updateRole, deleteRole } = useUsers();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    roles: [] as string[],
    gender: 'Male',
    position: '',
    password: ''
  });

  // Role Management State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleFormData, setRoleFormData] = useState<Omit<Role, 'id'>>({
    name: '',
    description: '',
    permissions: [],
    badgeColor: 'blue'
  });

  // -- Feedback State --
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePurgeInventory = async () => {
    if (await confirm("DANGER: This will wipe ALL inventory items and requisition history. This action cannot be undone. Type 'PURGE' to confirm.")) {
      const confirmText = await prompt("Type PURGE to proceed:");
      if (confirmText === 'PURGE') {
        await alert("Provincial Inventory has been wiped clean.");
      }
    }
  };

  const toggleDocType = (index: number) => {
    const updated = [...docTypes];
    updated[index].enabled = !updated[index].enabled;
    setDocTypes(updated);
  };

  const openRenameModal = (doc: DocType) => {
    setDocToRename(doc);
    setRenamedValue(doc.name);
    setIsRenameModalOpen(true);
  };

  const handleRename = () => {
    if (docToRename && renamedValue.trim()) {
      setDocTypes(docTypes.map(d => d.id === docToRename.id ? { ...d, name: renamedValue.trim() } : d));
      setIsRenameModalOpen(false);
    }
  };

  const openRefModal = (doc: DocType) => {
    setDocForRef({ ...doc });
    setIsRefModalOpen(true);
  };

  const handleUpdateRefConfig = () => {
    if (docForRef) {
      setDocTypes(docTypes.map(d => d.id === docForRef.id ? docForRef : d));
      setIsRefModalOpen(false);
    }
  };

  const deleteDocType = async (id: string) => {
    if (await confirm(`Are you sure you want to delete the "${docTypes.find(d => d.id === id)?.name}" document type?`)) {
      setDocTypes(docTypes.filter(d => d.id !== id));
      const newFields = { ...docFields };
      delete newFields[id];
      setDocFields(newFields);
    }
  };

  const addNewDocType = async () => {
    const name = await prompt("Enter the name of the new document type:");
    if (name && name.trim()) {
      const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-4);
      const newDoc: DocType = {
        id,
        name: name.trim(),
        enabled: true,
        refPrefix: 'REG',
        refSeparator: '-',
        refPadding: 6,
        refIncrement: 1,
        refStart: 1
      };
      setDocTypes([...docTypes, newDoc]);
      setDocFields({ ...docFields, [id]: [] });
    }
  };

  // -- Data Collection Methods --
  const addCollection = async () => {
    const name = await prompt("Enter new Data Collection name (e.g. Employee Ranks):");
    if (name && name.trim()) {
      if (dataCollections[name.trim()]) {
        await alert("Collection already exists.");
        return;
      }
      setDataCollections({ ...dataCollections, [name.trim()]: [] });
    }
  };

  const deleteCollection = async (key: string) => {
    if (await confirm(`Delete the "${key}" collection and all its data?`)) {
      const updated = { ...dataCollections };
      delete updated[key];
      setDataCollections(updated);
      if (selectedCollection === key) setSelectedCollection(null);
    }
  };

  const addCollectionItem = async (key: string) => {
    const item = await prompt(`Add new item to "${key}":`);
    if (item && item.trim()) {
      setDataCollections({
        ...dataCollections,
        [key]: [...dataCollections[key], item.trim()]
      });
    }
  };

  const removeCollectionItem = (key: string, index: number) => {
    const updated = [...dataCollections[key]];
    updated.splice(index, 1);
    setDataCollections({ ...dataCollections, [key]: updated });
  };

  const addUnitMaster = async () => {
    const unit = await prompt("Enter new Unit name (e.g. Dozen, Kilos):");
    if (unit && !unitMaster.includes(unit)) {
      setUnitMaster([...unitMaster, unit]);
    }
  };

  const removeUnitMaster = (unit: string) => {
    setUnitMaster(unitMaster.filter(u => u !== unit));
  };

  const openBuilder = (docId: string) => {
    setSelectedDocId(docId);
    setIsBuilderOpen(true);
  };

  const addField = () => {
    if (!newFieldName) return;
    const options = newFieldType === 'select' && !newFieldCollection ? newFieldOptions.split(',').map(o => o.trim()).filter(Boolean) : undefined;
    const collectionSource = newFieldType === 'select' && newFieldCollection ? newFieldCollection : undefined;

    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      label: newFieldName,
      type: newFieldType,
      required: false,
      options,
      collectionSource
    };
    setDocFields({
      ...docFields,
      [selectedDocId]: [...docFields[selectedDocId], newField]
    });
    setNewFieldName('');
    setNewFieldOptions('');
    setNewFieldCollection('');
  };

  const removeField = (fieldId: string) => {
    setDocFields({
      ...docFields,
      [selectedDocId]: docFields[selectedDocId].filter(f => f.id !== fieldId)
    });
  };

  const toggleFieldRequired = (fieldId: string) => {
    setDocFields({
      ...docFields,
      [selectedDocId]: docFields[selectedDocId].map(f =>
        f.id === fieldId ? { ...f, required: !f.required } : f
      )
    });
  };

  const addCategory = async () => {
    const name = await prompt("Enter new asset category name:");
    if (name && !assetCategories.includes(name)) {
      setAssetCategories([...assetCategories, name]);
    }
  };

  const removeCategory = (cat: string) => {
    setAssetCategories(assetCategories.filter(c => c !== cat));
  };

  const openAddUserModal = () => {
    setEditingUserId(null);
    setUserFormData({
      name: '',
      email: '',
      roles: [],
      gender: 'Male',
      position: '',
      password: ''
    });
    setIsAddUserModalOpen(true);
  };

  const openEditUserModal = (user: User) => {
    setEditingUserId(user.id);
    setUserFormData({
      name: user.name,
      email: user.email,
      roles: user.roles || [],
      gender: user.gender,
      position: user.position,
      password: user.password || ''
    });
    setIsAddUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (userFormData.name && userFormData.email) {
      if (editingUserId) {
        updateUser(editingUserId, userFormData);
      } else {
        addUser(userFormData);
      }
      setIsAddUserModalOpen(false);
    }
  };

  const removeUser = async (user: User) => {
    if (await confirm(`Are you sure you want to remove ${user.name}?`)) {
      deleteUser(user.id);
    }
  };

  const openAddRoleModal = () => {
    setEditingRoleId(null);
    setRoleFormData({
      name: '',
      description: '',
      permissions: [],
      badgeColor: 'blue'
    });
    setIsRoleModalOpen(true);
  };

  const openEditRoleModal = (role: Role) => {
    setEditingRoleId(role.id);
    setRoleFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions,
      badgeColor: role.badgeColor
    });
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = () => {
    if (roleFormData.name) {
      if (editingRoleId) {
        updateRole(editingRoleId, roleFormData);
      } else {
        addRole(roleFormData);
      }
      setIsRoleModalOpen(false);
    }
  };

  const tabs = [
    { id: 'record', label: 'Record Settings', icon: Database },
    { id: 'supply', label: 'Supply Settings', icon: Package },
    { id: 'property', label: 'Property Settings', icon: Building2 },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'number': return <Hash size={14} />;
      case 'date': return <CalendarIcon size={14} />;
      case 'select': return <ListIcon size={14} />;
      case 'checkbox': return <CheckSquare size={14} />;
      case 'email': return <Mail size={14} />;
      case 'tel': return <PhoneIcon size={14} />;
      case 'textarea': return <AlignLeft size={14} />;
      case 'multiselect': return <ListPlus size={14} />;
      case 'url': return <LinkIcon size={14} />;
      case 'datetime': return <CalendarRange size={14} />;
      case 'time': return <Clock size={14} />;
      case 'section': return <SeparatorHorizontal size={14} />;
      case 'rating': return <Star size={14} />;
      case 'color': return <Palette size={14} />;
      default: return <TypeIcon size={14} />;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Save Success Toast */}
      {isSaved && (
        <div className="fixed top-24 right-8 z-[2000] animate-in slide-in-from-right duration-300">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span className="text-sm font-bold">Settings updated successfully!</span>
          </div>
        </div>
      )}

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
          <Button variant="blue" className="w-full sm:w-auto justify-center" onClick={handleSave}>
            <Save size={16} className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      {activeTab === 'record' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <Card
            title="Registry & Records"
            description="Manage document schemas, reference formats and data collections"
            action={
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl min-w-max overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setRecordSubTab('docs')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${recordSubTab === 'docs' ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm' : 'text-zinc-500'}`}
                >
                  <FileText size={12} /> Document Types
                </button>
                <button
                  onClick={() => setRecordSubTab('collections')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${recordSubTab === 'collections' ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm' : 'text-zinc-500'}`}
                >
                  <DatabaseIcon size={12} /> Data Collections
                </button>
              </div>
            }
          >
            {recordSubTab === 'docs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest">Available Schemas</h4>
                    <button onClick={addNewDocType} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                      <Plus size={12} /> New Type
                    </button>
                  </div>
                  <div className="space-y-3">
                    {docTypes.map((doc, i) => (
                      <div key={doc.id} className="flex flex-col p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText size={16} className={doc.enabled ? "text-blue-500" : "text-zinc-400"} />
                            <div className="min-w-0">
                              <p className={`text-sm font-bold truncate ${doc.enabled ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>{doc.name}</p>
                              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">{docFields[doc.id]?.length || 0} Fields</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => toggleDocType(i)} className={`w-8 h-4 rounded-full flex items-center px-1 transition-colors ${doc.enabled ? 'bg-blue-600 justify-end' : 'bg-zinc-300 dark:bg-zinc-700 justify-start'}`}>
                              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                          <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <div className="flex items-center gap-1"><Fingerprint size={12} className="text-zinc-300" /> {doc.refPrefix}{doc.refSeparator}</div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {doc.enabled && (
                              <button onClick={() => openBuilder(doc.id)} title="Schema Builder" className="p-1.5 text-zinc-400 hover:text-blue-600 transition-colors"><Settings size={14} /></button>
                            )}
                            <button onClick={() => openRefModal(doc)} title="ID Generator Settings" className="p-1.5 text-zinc-400 hover:text-amber-500 transition-colors"><Fingerprint size={14} /></button>
                            <button onClick={() => openRenameModal(doc)} title="Rename" className="p-1.5 text-zinc-400 hover:text-emerald-600 transition-colors"><Edit2 size={14} /></button>
                            <button onClick={() => deleteDocType(doc.id)} title="Delete" className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Reference Code Format</h4>
                  <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/10 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 font-medium mb-4 leading-relaxed">Reference IDs are automatically generated for every new record based on the provincial format. You can customize the prefix, separator and starting sequence for each document category.</p>
                    <div className="space-y-3">
                      {docTypes.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-zinc-400 uppercase tracking-tight">{doc.name}</span>
                          <code className="px-2 py-0.5 bg-white dark:bg-black rounded border border-zinc-100 dark:border-zinc-800 text-blue-600">
                            {doc.refPrefix}{doc.refSeparator}{String(doc.refStart).padStart(doc.refPadding, '0')}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {recordSubTab === 'collections' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-300">
                <div className="md:col-span-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest">Global Collections</h4>
                    <button onClick={addCollection} className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"><Plus size={16} /></button>
                  </div>
                  <div className="space-y-1">
                    {Object.keys(dataCollections).map(key => (
                      <div
                        key={key}
                        onClick={() => setSelectedCollection(key)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${selectedCollection === key ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400' : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                      >
                        <div className="flex items-center gap-3">
                          <DatabaseIcon size={14} />
                          <span className="text-sm font-bold">{key}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold opacity-60">{dataCollections[key].length}</span>
                          {selectedCollection === key && (
                            <button onClick={(e) => { e.stopPropagation(); deleteCollection(key); }} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1 rounded-lg"><Trash2 size={12} /></button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-8">
                  {selectedCollection ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest">Manage Items: {selectedCollection}</h4>
                        <Button variant="ghost" className="!py-1.5 !px-3 h-auto text-[10px]" onClick={() => addCollectionItem(selectedCollection)}>
                          <Plus size={12} className="mr-2" /> Add Item
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {dataCollections[selectedCollection].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 group">
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{item}</span>
                            <button onClick={() => removeCollectionItem(selectedCollection, idx)} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-all"><Trash2 size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50/30 dark:bg-zinc-900/10">
                      <LinkIcon size={32} className="text-zinc-200 dark:text-zinc-800 mb-4" />
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.1em]">Select a collection to manage its data</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'supply' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-fit">
            <button
              onClick={() => setSupplySubTab('ris')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${supplySubTab === 'ris' ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm' : 'text-zinc-500'}`}
            >
              <FileCheck size={14} /> RIS Config
            </button>
            <button
              onClick={() => setSupplySubTab('units')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${supplySubTab === 'units' ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm' : 'text-zinc-500'}`}
            >
              <Scale size={14} /> Unit Master
            </button>
            <button
              onClick={() => setSupplySubTab('danger')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${supplySubTab === 'danger' ? 'bg-red-500 text-white' : 'text-zinc-500 hover:text-red-500'}`}
            >
              <AlertTriangle size={14} /> Danger Zone
            </button>
          </div>

          {supplySubTab === 'ris' && (
            <Card title="Requisition & Issue Slip (RIS) Settings" description="Configure automatic numbering for provincial stock releases">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">RIS Prefix</label>
                      <input type="text" value={risConfig.prefix} onChange={e => setRisConfig({ ...risConfig, prefix: e.target.value.toUpperCase() })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none font-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Separator</label>
                      <input type="text" value={risConfig.separator} onChange={e => setRisConfig({ ...risConfig, separator: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none text-center font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Padding</label>
                      <input type="number" value={risConfig.padding} onChange={e => setRisConfig({ ...risConfig, padding: parseInt(e.target.value) || 0 })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Increment</label>
                      <input type="number" value={risConfig.increment} onChange={e => setRisConfig({ ...risConfig, increment: parseInt(e.target.value) || 1 })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Start #</label>
                      <input type="number" value={risConfig.startNumber} onChange={e => setRisConfig({ ...risConfig, startNumber: parseInt(e.target.value) || 1 })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none" />
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 flex flex-col justify-center">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Example Output</span>
                  <p className="text-4xl font-mono font-black text-blue-700 dark:text-blue-300 tracking-tighter">
                    {risConfig.prefix}{risConfig.separator}{String(risConfig.startNumber).padStart(risConfig.padding, '0')}
                  </p>
                  <p className="text-[10px] text-blue-600/60 font-medium mt-4 leading-relaxed">Generated RIS numbers are unique across the provincial database and recorded in the audit logs.</p>
                </div>
              </div>
            </Card>
          )}

          {supplySubTab === 'units' && (
            <Card title="Unit Master Directory" description="Manage valid units of measurement for inventory items">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {unitMaster.map(unit => (
                    <Badge key={unit} variant="info" className="!py-2 !px-4 flex items-center gap-2 group">
                      {unit}
                      <button onClick={() => removeUnitMaster(unit)} className="text-blue-400 hover:text-red-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </Badge>
                  ))}
                  <button onClick={addUnitMaster} className="px-4 py-2 rounded-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2">
                    <Plus size={14} /> Add New Unit
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex gap-3">
                  <Info size={18} className="text-zinc-400 shrink-0" />
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Units defined here will appear as options when registering or editing items in the Supply Inventory tab.</p>
                </div>
              </div>
            </Card>
          )}

          {supplySubTab === 'danger' && (
            <Card title="Danger Zone" description="Irreversible system-wide actions for provincial data management" className="!border-red-200 dark:!border-red-900/30">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 gap-6">
                  <div>
                    <h4 className="text-sm font-black text-red-700 dark:text-red-400 uppercase tracking-tight">Purge All Inventory Data</h4>
                    <p className="text-xs text-red-600/70 mt-1 leading-relaxed">Removes all stock items, quantity records, and pending requisition requests. Use only after testing phase or for full system reset.</p>
                  </div>
                  <Button variant="ghost" onClick={handlePurgeInventory} className="bg-red-600 text-white hover:bg-red-700 !px-8 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                    Wipe Inventory
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'property' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <Card title="Property & Asset Rules" description="Define asset categories and provincial depreciation methods">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-3">Asset Categories</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {assetCategories.map(cat => (
                    <Badge key={cat} variant="default" className="!py-1.5 !px-3 flex items-center gap-2 group">
                      {cat}
                      <button onClick={() => removeCategory(cat)} className="hover:text-red-500 transition-colors">
                        <Trash2 size={10} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <button
                  onClick={addCategory}
                  className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  <Plus size={12} /> Add Category
                </button>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-3">Audit Schedule</h4>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">Set the frequency for physical asset inventory counts.</p>
                <select
                  value={auditSchedule}
                  onChange={(e) => setAuditSchedule(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option>Quarterly (Every 3 months)</option>
                  <option>Semi-Annual (Every 6 months)</option>
                  <option>Annual (Every 12 months)</option>
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
                <button
                  onClick={() => setUsersSubTab('accounts')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${usersSubTab === 'accounts' ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm' : 'text-zinc-500'}`}
                >
                  <Users size={12} /> Accounts
                </button>
                <button
                  onClick={() => setUsersSubTab('roles')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${usersSubTab === 'roles' ? 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm' : 'text-zinc-500'}`}
                >
                  <ShieldCheck size={12} /> Roles
                </button>
              </div>
            }
          >
            {usersSubTab === 'accounts' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Users size={14} className="text-blue-600" /> User Accounts
                  </h4>
                  <Button
                    variant="outline"
                    className="!py-1.5 !px-3 h-auto text-[10px] uppercase tracking-widest w-full sm:w-auto justify-center"
                    onClick={openAddUserModal}
                  >
                    <UserPlus size={12} className="mr-2" /> New User
                  </Button>
                </div>
                <div className="overflow-x-auto -mx-5 sm:mx-0">
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                        <th className="pb-3 px-5 sm:px-0">User Account</th>
                        <th className="pb-3">Assigned Roles</th>
                        <th className="pb-3">Last Access</th>
                        <th className="pb-3 text-right px-5 sm:px-0">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                      {users.map((user) => (
                        <tr key={user.email} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                          <td className="py-4 px-5 sm:px-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</span>
                                <span className="text-[10px] text-zinc-500">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map(role => (
                                <Badge key={role} variant={role === 'Super Admin' ? 'info' : 'default'} className="!text-[9px]">{role}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 text-xs text-zinc-500 font-medium">{user.lastAccess}</td>
                          <td className="py-4 text-right px-5 sm:px-0">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" className="!p-2" onClick={() => openEditUserModal(user)}><Edit2 size={14} /></Button>
                              <Button variant="ghost" className="!p-2" onClick={() => removeUser(user)}><Trash2 size={14} className="text-zinc-400 hover:text-red-500" /></Button>
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
                  <Button
                    variant="outline"
                    className="!py-1.5 !px-3 h-auto text-[10px] uppercase tracking-widest w-full sm:w-auto justify-center"
                    onClick={openAddRoleModal}
                  >
                    <Plus size={12} className="mr-2" /> New Role
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map((role, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group" onClick={() => openEditRoleModal(role)}>
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={`bg-${role.badgeColor}-50 text-${role.badgeColor}-700 dark:bg-${role.badgeColor}-500/10 dark:text-${role.badgeColor}-400 border border-${role.badgeColor}-100 dark:border-${role.badgeColor}-500/20 mb-2`}>
                          {role.name}
                        </Badge>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); deleteRole(role.id); }} className="p-1 text-zinc-400 hover:text-red-500"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      {role.description && (
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3 h-8">
                          {role.description}
                        </p>
                      )}
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-4">
                        {role.permissions.length === 1 && role.permissions[0] === 'all' ? 'Administrative Access' : `${role.permissions.length} Custom Permissions`}
                      </p>
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

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title={editingUserId ? "Edit User Account" : "Register New Account"}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsAddUserModalOpen(false)}>Cancel</Button>
            <Button variant="blue" onClick={handleSaveUser}>{editingUserId ? "Update User" : "Create User"}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={userFormData.name}
            onChange={e => setUserFormData({ ...userFormData, name: e.target.value })}
            placeholder="e.g. Maria Clara"
          />
          <Input
            label="Email Address"
            type="email"
            value={userFormData.email}
            onChange={e => setUserFormData({ ...userFormData, email: e.target.value })}
            placeholder="user@psa.gov.ph"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Gender</label>
              <select
                value={userFormData.gender}
                onChange={e => setUserFormData({ ...userFormData, gender: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <Input
              label="Position"
              value={userFormData.position}
              onChange={e => setUserFormData({ ...userFormData, position: e.target.value })}
              placeholder="e.g. Statistician"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Assigned Roles</label>
            <div className="grid grid-cols-2 gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 max-h-40 overflow-y-auto">
              {roles.map(r => (
                <label key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userFormData.roles.includes(r.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setUserFormData({ ...userFormData, roles: [...userFormData.roles, r.name] });
                      } else {
                        setUserFormData({ ...userFormData, roles: userFormData.roles.filter(role => role !== r.name) });
                      }
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-tight">{r.name}</span>
                </label>
              ))}
            </div>
          </div>
          <Input
            label="Password"
            type="password"
            value={userFormData.password}
            onChange={e => setUserFormData({ ...userFormData, password: e.target.value })}
            placeholder={editingUserId ? "Leave empty to keep" : "System Password"}
          />
        </div>
      </Modal>

      {/* Role Editor Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={editingRoleId ? "Edit Role Permissions" : "Create New System Role"}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsRoleModalOpen(false)}>Cancel</Button>
            <Button variant="blue" onClick={handleSaveRole}>{editingRoleId ? "Update Role" : "Create Role"}</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Role Name"
              value={roleFormData.name}
              onChange={e => setRoleFormData({ ...roleFormData, name: e.target.value })}
              placeholder="e.g. Region Lead"
            />
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Badge Color</label>
              <select
                value={roleFormData.badgeColor}
                onChange={e => setRoleFormData({ ...roleFormData, badgeColor: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 px-4 py-2.5"
              >
                <option value="slate">Slate</option>
                <option value="gray">Gray</option>
                <option value="zinc">Zinc</option>
                <option value="neutral">Neutral</option>
                <option value="stone">Stone</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
                <option value="amber">Amber</option>
                <option value="yellow">Yellow</option>
                <option value="lime">Lime</option>
                <option value="green">Green</option>
                <option value="emerald">Emerald</option>
                <option value="teal">Teal</option>
                <option value="cyan">Cyan</option>
                <option value="sky">Sky</option>
                <option value="blue">Blue</option>
                <option value="indigo">Indigo</option>
                <option value="violet">Violet</option>
                <option value="purple">Purple</option>
                <option value="fuchsia">Fuchsia</option>
                <option value="pink">Pink</option>
                <option value="rose">Rose</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Role Description</label>
            <textarea
              value={roleFormData.description}
              onChange={e => setRoleFormData({ ...roleFormData, description: e.target.value })}
              rows={2}
              className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              placeholder="Briefly describe the responsibilities of this role..."
            />
          </div>

          <div className="p-6 rounded-3xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-4">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Badge Preview</p>
            <div className={`
              px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transition-all duration-300
              bg-${roleFormData.badgeColor}-50 text-${roleFormData.badgeColor}-700 border border-${roleFormData.badgeColor}-100
              dark:bg-${roleFormData.badgeColor}-500/10 dark:text-${roleFormData.badgeColor}-400 dark:border-${roleFormData.badgeColor}-500/20
              scale-110
            `}>
              {roleFormData.name || 'New Role Badge'}
            </div>
            <p className="text-[9px] text-zinc-500 font-medium italic mt-2 text-center">
              This is how the role will appear across the system (Header, Lists, Profile).
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Access Permissions</h4>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={roleFormData.permissions.includes('all')}
                  onChange={(e) => {
                    setRoleFormData({ ...roleFormData, permissions: e.target.checked ? ['all'] : [] });
                  }}
                  className="w-3 h-3 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:underline">Super Admin Bypass</span>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => (
                <div key={group} className="space-y-2">
                  <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-1">
                    <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{group}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {perms.map(perm => (
                      <label key={perm} className={`
                        flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer
                        ${roleFormData.permissions.includes('all') || roleFormData.permissions.includes(perm as Permission)
                          ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30'
                          : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}
                      `}>
                        <input
                          type="checkbox"
                          disabled={roleFormData.permissions.includes('all')}
                          checked={roleFormData.permissions.includes('all') || roleFormData.permissions.includes(perm as Permission)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              setRoleFormData({ ...roleFormData, permissions: [...roleFormData.permissions, perm as Permission] });
                            } else {
                              setRoleFormData({ ...roleFormData, permissions: roleFormData.permissions.filter(p => p !== perm && p !== 'all') });
                            }
                          }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex flex-col gap-0.5 pointer-events-none">
                          <span className="text-[10px] font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-tight">
                            {perm.split('.').pop()?.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-tight">
                            {PERMISSION_DESCRIPTIONS[perm as Permission]}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* ID Generator Settings Modal */}
      <Modal
        isOpen={isRefModalOpen}
        onClose={() => setIsRefModalOpen(false)}
        title={`Reference ID Generator: ${docForRef?.name}`}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsRefModalOpen(false)}>Cancel</Button>
            <Button variant="blue" onClick={handleUpdateRefConfig}>Save Configuration</Button>
          </div>
        }
      >
        {docForRef && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Prefix Code</label>
                <input
                  type="text"
                  value={docForRef.refPrefix}
                  onChange={e => setDocForRef({ ...docForRef, refPrefix: e.target.value.toUpperCase() })}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none"
                  placeholder="e.g. BC"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Separator</label>
                <input
                  type="text"
                  value={docForRef.refSeparator}
                  onChange={e => setDocForRef({ ...docForRef, refSeparator: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none text-center"
                  placeholder="e.g. -"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Padding</label>
                <input
                  type="number"
                  value={docForRef.refPadding}
                  onChange={e => setDocForRef({ ...docForRef, refPadding: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Increment Value</label>
                <input
                  type="number"
                  value={docForRef.refIncrement}
                  onChange={e => setDocForRef({ ...docForRef, refIncrement: parseInt(e.target.value) || 1 })}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Starting Number</label>
                <input
                  type="number"
                  value={docForRef.refStart}
                  onChange={e => setDocForRef({ ...docForRef, refStart: parseInt(e.target.value) || 1 })}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Rename Document Type Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Rename Document Type"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsRenameModalOpen(false)}>Cancel</Button>
            <Button variant="blue" onClick={handleRename}>Update Name</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Display Name</label>
            <input
              type="text"
              value={renamedValue}
              onChange={e => setRenamedValue(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g. Birth Certificate"
              autoFocus
            />
          </div>
        </div>
      </Modal >

      {/* Dynamic Form Builder Modal */}
      < Modal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        title={`Schema Designer: ${docTypes.find(d => d.id === selectedDocId)?.name}`}
        footer={
          < div className="flex gap-2" >
            <Button variant="primary" className="px-6 rounded-xl" onClick={() => setIsBuilderOpen(false)}>Done</Button>
          </div >
        }
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Schema Elements</h4>
            <div className="space-y-2">
              {selectedDocId && docFields[selectedDocId] && docFields[selectedDocId].map((field) => (
                <div key={field.id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                  <div className="text-zinc-300 dark:text-zinc-600"><GripVertical size={16} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{field.label}</p>
                      {field.collectionSource && <Badge variant="info" className="!text-[8px] h-4">Connected</Badge>}
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                      {field.type} {field.collectionSource ? `(Source: ${field.collectionSource})` : (field.options && `• ${field.options.length} options`)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Req.</span>
                      <button
                        onClick={() => toggleFieldRequired(field.id)}
                        className={`w-7 h-4 rounded-full flex items-center px-0.5 transition-colors ${field.required ? 'bg-blue-600 justify-end' : 'bg-zinc-200 dark:bg-zinc-800 justify-start'}`}
                      >
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      </button>
                    </div>
                    <button onClick={() => removeField(field.id)} className="p-1.5 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Add Form Element</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Field Label"
                value={newFieldName}
                onChange={e => setNewFieldName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none text-sm focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newFieldType}
                onChange={e => setNewFieldType(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none text-sm min-w-[140px]"
              >
                <option value="text">Short Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="select">Dropdown List</option>
                <option value="checkbox">Checkbox</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="textarea">Long Text (Textarea)</option>
                <option value="multiselect">Multi-select</option>
                <option value="url">URL Link</option>
                <option value="datetime">Date & Time</option>
                <option value="time">Time Picker</option>
                <option value="section">Section Header</option>
                <option value="rating">Rating/Stars</option>
                <option value="color">Color Picker</option>
              </select>
            </div>

            {newFieldType === 'select' && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200 space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex-1">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Option Source</label>
                    <select
                      value={newFieldCollection}
                      onChange={e => setNewFieldCollection(e.target.value)}
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs outline-none"
                    >
                      <option value="">Manual Entry (Comma Separated)</option>
                      {Object.keys(dataCollections).map(key => (
                        <option key={key} value={key}>Data Collection: {key}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {!newFieldCollection && (
                  <input
                    type="text"
                    placeholder="Item 1, Item 2, Item 3..."
                    value={newFieldOptions}
                    onChange={e => setNewFieldOptions(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none text-sm"
                  />
                )}
              </div>
            )}

            <Button variant="blue" className="w-full rounded-xl h-12 text-[10px] font-black uppercase tracking-[0.2em]" onClick={addField}>
              <Plus size={16} className="mr-2" /> Add Field
            </Button>
          </div>
        </div>
      </Modal >
    </div >
  );
};
