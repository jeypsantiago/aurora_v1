import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Role {
    id: string;
    name: string;
    permissions: string[];
    badgeColor: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    gender: string;
    position: string;
    password?: string;
    lastAccess: string;
    avatar?: string;
    signature?: string; // Base64 image string
}

interface UserContextType {
    users: User[];
    roles: Role[];
    currentUser: User | null;
    addUser: (user: Omit<User, 'id' | 'lastAccess'>) => void;
    updateUser: (id: string, user: Partial<User>) => void;
    deleteUser: (id: string) => void;
    addRole: (role: Omit<Role, 'id'>) => void;
    updateRole: (id: string, role: Partial<Role>) => void;
    deleteRole: (id: string) => void;
    login: (email: string, password?: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('aurora_users');
        return saved ? JSON.parse(saved) : [
            { id: '1', name: 'Admin One', email: 'admin.aurora@psa.gov.ph', role: 'Super Admin', gender: 'Female', position: 'Provincial Admin', lastAccess: 'Just now', signature: '' },
            { id: '2', name: 'Reg Clerk', email: 'clerk.aurora@psa.gov.ph', role: 'Registry Editor', gender: 'Male', position: 'Registration Clerk', lastAccess: '2h ago', signature: '' },
            { id: '3', name: 'Supply Mgr', email: 'supply.aurora@psa.gov.ph', role: 'Inventory Lead', gender: 'Female', position: 'Supply Officer', lastAccess: 'Yesterday', signature: '' },
        ];
    });

    const [roles, setRoles] = useState<Role[]>(() => {
        const saved = localStorage.getItem('aurora_roles');
        return saved ? JSON.parse(saved) : [
            { id: 'sa', name: 'Super Admin', permissions: ['all'], badgeColor: 'blue' },
            { id: 're', name: 'Registry Editor', permissions: ['records.view', 'records.edit'], badgeColor: 'emerald' },
            { id: 'il', name: 'Inventory Lead', permissions: ['supply.view', 'supply.edit', 'supply.approve'], badgeColor: 'amber' },
        ];
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('aurora_session');
        return saved ? JSON.parse(saved) : users[0]; // Default to first user for demo
    });

    useEffect(() => {
        localStorage.setItem('aurora_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('aurora_roles', JSON.stringify(roles));
    }, [roles]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('aurora_session', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('aurora_session');
        }
    }, [currentUser]);

    const addUser = (userData: Omit<User, 'id' | 'lastAccess'>) => {
        const newUser: User = {
            ...userData,
            id: Date.now().toString(),
            lastAccess: 'Never'
        };
        setUsers([...users, newUser]);
    };

    const updateUser = (id: string, userData: Partial<User>) => {
        setUsers(users.map(u => u.id === id ? { ...u, ...userData } : u));
        if (currentUser?.id === id) {
            setCurrentUser({ ...currentUser, ...userData });
        }
    };

    const deleteUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
        if (currentUser?.id === id) setCurrentUser(null);
    };

    const addRole = (roleData: Omit<Role, 'id'>) => {
        const newRole: Role = {
            ...roleData,
            id: Date.now().toString()
        };
        setRoles([...roles, newRole]);
    };

    const updateRole = (id: string, roleData: Partial<Role>) => {
        setRoles(roles.map(r => r.id === id ? { ...r, ...roleData } : r));
    };

    const deleteRole = (id: string) => {
        setRoles(roles.filter(r => r.id !== id));
    };

    const login = (email: string, password?: string) => {
        const user = users.find(u => u.email === email);
        if (user) setCurrentUser(user);
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <UserContext.Provider value={{
            users, roles, currentUser,
            addUser, updateUser, deleteUser,
            addRole, updateRole, deleteRole,
            login, logout
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUsers must be used within a UserProvider');
    return context;
};
