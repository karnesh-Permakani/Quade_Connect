import React from 'react';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface HeaderProps {
  onSearch: (query: string) => void;
  activeView: 'grid' | 'kanban' | 'gantt';
  setActiveView: (view: 'grid' | 'kanban' | 'gantt') => void;
  currentProjectNo: string | null;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  activeView,
  setActiveView,
  currentProjectNo,
  onNavigateHome
}) => {
  const { currentUser, allUsers, setCurrentUserById, canSeeCost } = useAuthRBAC();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Brand & Module Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateHome}>
        <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-black text-lg flex items-center justify-center shadow-sm">
          Q
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-lg font-bold text-slate-900 tracking-tight">Quade<span className="font-extrabold text-blue-600">Connect</span></span>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
            Project Management
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search projects by Proj No, Name, Customer..."
            onChange={e => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Right Controls: Role Switcher & Status */}
      <div className="flex items-center space-x-4">
        {/* Role Selector Simulator (Crucial for testing RBAC live) */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-md text-xs">
          <span className="text-slate-500 font-medium">Viewing as:</span>
          <select
            value={currentUser.id}
            onChange={e => setCurrentUserById(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            {allUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          {canSeeCost() ? (
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Admin ($ Visible)</span>
          ) : (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">🔒 Cost Masked</span>
          )}
        </div>
      </div>
    </header>
  );
};

