import React from 'react';
import { Project } from '../../types';
import { useAuthRBAC } from '../../context/AuthRBACContext';

export type ProjectTabKey =
  | 'details'
  | 'workorders'
  | 'studies'
  | 'sheets'
  | 'shop'
  | 'files'
  | 'qc'
  | 'submittals'
  | 'activity';

interface ProjectHeaderProps {
  project: Project;
  activeTab: ProjectTabKey;
  onSelectTab: (tab: ProjectTabKey) => void;
  counts: {
    workOrders: number;
    studies: number;
    sheets: number;
    shop: number;
    files: number;
    qc: number;
    submittals: number;
  };
  onBackToProjects: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  activeTab,
  onSelectTab,
  counts,
  onBackToProjects
}) => {
  const { canSeeCost, isClient } = useAuthRBAC();

  const formatCurrency = (val?: number) => {
    if (val === undefined) return '—';
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const isBudgetOk = project.estGrandTotalCost
    ? project.estGrandTotalCost <= (project.currentContractVal || 0)
    : true;

  const tabs: { key: ProjectTabKey; label: string; count?: number }[] = [
    { key: 'details', label: 'Details & Pay Plan' },
    { key: 'workorders', label: 'Work Orders', count: counts.workOrders },
    { key: 'studies', label: 'Study Projects', count: counts.studies },
    { key: 'sheets', label: 'Sheets', count: counts.sheets },
    { key: 'shop', label: 'Shop Drawings', count: counts.shop },
    { key: 'files', label: 'Files', count: counts.files },
    { key: 'qc', label: 'QC Review', count: counts.qc },
    { key: 'submittals', label: 'Submittals', count: counts.submittals },
    { key: 'activity', label: 'Activity' }
  ];

  // Restrict client tabs
  const visibleTabs = isClient()
    ? tabs.filter(t => ['details', 'sheets', 'shop', 'files', 'submittals'].includes(t.key))
    : tabs;

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs mb-4">
      {/* Top Breadcrumb & Status */}
      <div className="px-6 pt-3 pb-2 flex justify-between items-center text-xs text-slate-500">
        <div className="flex items-center space-x-1.5">
          <button onClick={onBackToProjects} className="hover:text-blue-600 font-medium">Projects</button>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{project.no}</span>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600 font-medium capitalize">{activeTab}</span>
        </div>

        {canSeeCost() ? (
          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
            isBudgetOk ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
          }`}>
            {isBudgetOk ? '✓ Budget is up to date' : '⚠ Over Budget'}
          </span>
        ) : (
          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[11px] font-medium">
            Stage: {project.stage}
          </span>
        )}
      </div>

      {/* Main Title & Financial Pills */}
      <div className="px-6 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {project.no} — {project.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer: <b className="text-slate-800">{project.customer}</b> | Architect: <b className="text-slate-800">{project.architect}</b> | PM: <b className="text-slate-800">{project.pm}</b>
          </p>
        </div>

        {/* Financial Badges (Admin Only) */}
        {canSeeCost() && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="bg-sky-50 border border-sky-200 text-sky-900 px-3 py-1.5 rounded-md font-mono">
              <span className="text-[10px] text-sky-600 block uppercase font-sans font-bold">Orig Contract</span>
              <span className="font-bold">{formatCurrency(project.origContractVal)}</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-md font-mono">
              <span className="text-[10px] text-blue-600 block uppercase font-sans font-bold">Current Contract</span>
              <span className="font-bold">{formatCurrency(project.currentContractVal)}</span>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-3 py-1.5 rounded-md font-mono">
              <span className="text-[10px] text-indigo-600 block uppercase font-sans font-bold">Work Orders Value</span>
              <span className="font-bold">{formatCurrency(project.woTotalVal)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 11 Category Tabs Navigation Strip */}
      <div className="px-6 flex space-x-1 overflow-x-auto border-t border-slate-100 mt-2">
        {visibleTabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`py-2.5 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center space-x-1.5 transition ${
                isActive
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

