import React, { createContext, useContext, useState } from 'react';
import { User, UserRole, Project, TradePayRates } from '../types';

interface AuthRBACContextType {
  currentUser: User;
  allUsers: User[];
  setCurrentUserById: (userId: string) => void;
  payRates: TradePayRates;
  updatePayRate: (trade: keyof TradePayRates, rate: number) => void;
  // Permissions & Guards
  canSeeCost: () => boolean;
  canEditDocs: () => boolean;
  canManage: () => boolean;
  canQC: () => boolean;
  canLogHours: () => boolean;
  isClient: () => boolean;
  canAccessProject: (projectNo: string) => boolean;
  sanitizeProject: (project: Project) => Project;
}

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin-01',
    name: 'Sarah Mitchell',
    email: 'sarah.m@quadeconnect.com',
    role: 'ADMIN',
    assignedProjectNos: [] // Admin accesses all
  },
  {
    id: 'u-ops-02',
    name: 'Marcus Reed',
    email: 'marcus.r@quadeconnect.com',
    role: 'OPS_HEAD',
    assignedProjectNos: ['P-26-1132', 'P-26-1137', 'P-26-1135']
  },
  {
    id: 'u-eng-03',
    name: 'Christopher Holland',
    email: 'christopher.h@quadeconnect.com',
    role: 'ENGINEER',
    assignedProjectNos: ['P-26-1132', 'P-26-1137']
  },
  {
    id: 'u-qc-04',
    name: 'Ariana Samarripa',
    email: 'ariana.s@quadeconnect.com',
    role: 'QC_REVIEWER',
    assignedProjectNos: ['P-26-1132', 'P-26-1136']
  },
  {
    id: 'u-client-05',
    name: 'Hensel Phelps (Client Rep)',
    email: 'pm@henselphelps.com',
    role: 'CLIENT',
    assignedProjectNos: ['P-26-1132']
  }
];

export const INITIAL_PAY_RATES: TradePayRates = {
  Engineering: 65.0,
  Fabrication: 45.0,
  Finishing: 48.0,
  Installation: 55.0
};

const AuthRBACContext = createContext<AuthRBACContextType | null>(null);

export const AuthRBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default to Admin
  const [payRates, setPayRates] = useState<TradePayRates>(INITIAL_PAY_RATES);

  const setCurrentUserById = (userId: string) => {
    const found = allUsers.find(u => u.id === userId);
    if (found) setCurrentUser(found);
  };

  const updatePayRate = (trade: keyof TradePayRates, rate: number) => {
    setPayRates(prev => ({ ...prev, [trade]: rate }));
  };

  const canSeeCost = () => currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN';
  const canEditDocs = () => ['ADMIN', 'OPS_HEAD', 'PROJECT_MANAGER', 'ENGINEER'].includes(currentUser.role);
  const canManage = () => ['ADMIN', 'OPS_HEAD', 'PROJECT_MANAGER'].includes(currentUser.role);
  const canQC = () => ['ADMIN', 'OPS_HEAD', 'QC_REVIEWER'].includes(currentUser.role);
  const canLogHours = () => currentUser.role !== 'CLIENT';
  const isClient = () => currentUser.role === 'CLIENT';

  const canAccessProject = (projectNo: string) => {
    if (canSeeCost()) return true; // Admins access all projects
    return currentUser.assignedProjectNos.includes(projectNo);
  };

  // Cost Masking: completely strips out dollar amounts for non-admins
  const sanitizeProject = (project: Project): Project => {
    if (canSeeCost()) return project;
    const sanitized = { ...project };
    delete sanitized.origContractVal;
    delete sanitized.currentContractVal;
    delete sanitized.woTotalVal;
    delete sanitized.billedVal;
    delete sanitized.billedPct;
    delete sanitized.estGrandTotalCost;
    return sanitized;
  };

  return (
    <AuthRBACContext.Provider
      value={{
        currentUser,
        allUsers,
        setCurrentUserById,
        payRates,
        updatePayRate,
        canSeeCost,
        canEditDocs,
        canManage,
        canQC,
        canLogHours,
        isClient,
        canAccessProject,
        sanitizeProject
      }}
    >
      {children}
    </AuthRBACContext.Provider>
  );
};

export const useAuthRBAC = () => {
  const context = useContext(AuthRBACContext);
  if (!context) throw new Error('useAuthRBAC must be used within an AuthRBACProvider');
  return context;
};

