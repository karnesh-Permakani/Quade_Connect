import React, { useState } from 'react';
import { Project } from '../../types';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface ProjectsGridProps {
  projects: Project[];
  onSelectProject: (projectNo: string) => void;
  searchQuery: string;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  onSelectProject,
  searchQuery
}) => {
  const { canSeeCost, sanitizeProject } = useAuthRBAC();
  const [groupBy, setGroupBy] = useState<string>('none');
  const [sortKey, setSortKey] = useState<keyof Project>('no');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Filter projects by search query
  const filteredProjects = projects
    .filter(p => {
      const q = searchQuery.toLowerCase();
      return (
        p.no.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.customer.toLowerCase().includes(q)
      );
    })
    .map(sanitizeProject);

  // Sorting
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const valA = a[sortKey] ?? '';
    const valB = b[sortKey] ?? '';
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Project) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const formatCurrency = (val?: number) => {
    if (val === undefined) return '—';
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Grouping logic
  const groupedData: Record<string, Project[]> = {};
  if (groupBy !== 'none') {
    sortedProjects.forEach(p => {
      const groupKey = String(p[groupBy as keyof Project] || 'Unassigned');
      if (!groupedData[groupKey]) groupedData[groupKey] = [];
      groupedData[groupKey].push(p);
    });
  }

  // Calculate Footer Portfolio Totals (Admin only)
  const totalOrigContract = filteredProjects.reduce((acc, p) => acc + (p.origContractVal || 0), 0);
  const totalCurrentContract = filteredProjects.reduce((acc, p) => acc + (p.currentContractVal || 0), 0);
  const totalWorkOrders = filteredProjects.reduce((acc, p) => acc + (p.woTotalVal || 0), 0);
  const totalBilled = filteredProjects.reduce((acc, p) => acc + (p.billedVal || 0), 0);
  const totalEstCost = filteredProjects.reduce((acc, p) => acc + (p.estGrandTotalCost || 0), 0);

  const renderProjectRow = (p: Project) => {
    const totalBudgetHours = Object.values(p.hoursBudget).reduce((a, b) => a + b, 0);
    const totalLoggedHours = Object.values(p.hoursLogged).reduce((a, b) => a + b, 0);
    const hoursPct = totalBudgetHours ? Math.round((totalLoggedHours / totalBudgetHours) * 100) : 0;

    return (
      <tr
        key={p.no}
        className="hover:bg-blue-50/50 cursor-pointer border-b border-slate-100 transition text-xs"
        onClick={() => onSelectProject(p.no)}
      >
        <td className="px-3 py-2.5 font-semibold text-blue-600 hover:underline">{p.no}</td>
        <td className="px-3 py-2.5 font-medium text-slate-900">{p.name}</td>
        <td className="px-3 py-2.5 text-slate-700">{p.customer}</td>

        {/* Financial Columns — Visible Only to Admin */}
        {canSeeCost() && (
          <>
            <td className="px-3 py-2.5 text-right font-mono text-slate-800">{formatCurrency(p.origContractVal)}</td>
            <td className="px-3 py-2.5 text-right font-mono font-medium text-slate-900">{formatCurrency(p.currentContractVal)}</td>
            <td className="px-3 py-2.5 text-right font-mono text-slate-800">{formatCurrency(p.woTotalVal)}</td>
            <td className="px-3 py-2.5 text-right font-mono text-slate-800">{formatCurrency(p.billedVal)}</td>
            <td className="px-3 py-2.5 text-right font-medium">
              <span className={`px-1.5 py-0.5 rounded text-[11px] ${p.billedPct && p.billedPct >= 100 ? 'bg-emerald-100 text-emerald-800' : 'text-slate-700'}`}>
                {p.billedPct ? `${p.billedPct}%` : '0%'}
              </span>
            </td>
            <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-800">{formatCurrency(p.estGrandTotalCost)}</td>
          </>
        )}

        {/* Operational Columns */}
        <td className="px-3 py-2.5">
          <span className="bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded text-[11px]">
            {p.stage}
          </span>
        </td>
        <td className="px-3 py-2.5 text-slate-700">{p.pm}</td>
        <td className="px-3 py-2.5">
          <span className={`font-semibold text-[11px] ${
            p.priority === 'Critical' ? 'text-red-600' :
            p.priority === 'High' ? 'text-amber-600' :
            p.priority === 'Normal' ? 'text-blue-600' : 'text-slate-500'
          }`}>
            ⚑ {p.priority}
          </span>
        </td>
        <td className="px-3 py-2.5 text-slate-600 font-mono text-[11px]">{p.dueDate}</td>
        <td className="px-3 py-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-600 font-mono">{totalLoggedHours}/{totalBudgetHours}h</span>
            <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${hoursPct > 100 ? 'bg-red-500' : 'bg-blue-600'}`}
                style={{ width: `${Math.min(100, hoursPct)}%` }}
              />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-slate-500 font-medium">Group by:</span>
          <select
            value={groupBy}
            onChange={e => setGroupBy(e.target.value)}
            className="border border-slate-200 rounded bg-white px-2 py-1 text-slate-700 text-xs focus:outline-none"
          >
            <option value="none">None (Flat Grid)</option>
            <option value="customer">Customer</option>
            <option value="stage">Millwork Stage</option>
            <option value="pm">Project Manager</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredProjects.length}</span> project(s)
        </div>
      </div>

      {/* High-Density Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider select-none">
              <th className="px-3 py-2.5 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('no')}>Proj No.</th>
              <th className="px-3 py-2.5 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('name')}>Name</th>
              <th className="px-3 py-2.5 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('customer')}>Customer</th>

              {canSeeCost() && (
                <>
                  <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-slate-200" onClick={() => handleSort('origContractVal')}>Orig Contract</th>
                  <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-slate-200" onClick={() => handleSort('currentContractVal')}>Current Contract</th>
                  <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-slate-200" onClick={() => handleSort('woTotalVal')}>Work Orders Val</th>
                  <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-slate-200" onClick={() => handleSort('billedVal')}>Billed</th>
                  <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-slate-200" onClick={() => handleSort('billedPct')}>Billed %</th>
                  <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-slate-200" onClick={() => handleSort('estGrandTotalCost')}>Est Grand Total Cost</th>
                </>
              )}

              <th className="px-3 py-2.5 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('stage')}>Stage</th>
              <th className="px-3 py-2.5 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('pm')}>PM</th>
              <th className="px-3 py-2.5 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('priority')}>Priority</th>
              <th className="px-3 py-2.5 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('dueDate')}>Target Date</th>
              <th className="px-3 py-2.5">Hours Progress</th>
            </tr>
          </thead>
          <tbody>
            {groupBy === 'none' ? (
              sortedProjects.map(renderProjectRow)
            ) : (
              Object.keys(groupedData).map(groupName => (
                <React.Fragment key={groupName}>
                  <tr className="bg-slate-100 font-bold text-xs text-slate-800 border-b border-slate-200">
                    <td colSpan={canSeeCost() ? 14 : 8} className="px-3 py-2 bg-slate-200/60">
                      📂 {groupName} ({groupedData[groupName].length})
                    </td>
                  </tr>
                  {groupedData[groupName].map(renderProjectRow)}
                </React.Fragment>
              ))
            )}
          </tbody>

          {/* Aggregate Portfolio Footer (Admin only) */}
          {canSeeCost() && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-xs text-slate-900 border-t-2 border-slate-300">
                <td colSpan={3} className="px-3 py-3 text-right uppercase">Portfolio Totals:</td>
                <td className="px-3 py-3 text-right font-mono">{formatCurrency(totalOrigContract)}</td>
                <td className="px-3 py-3 text-right font-mono text-blue-700">{formatCurrency(totalCurrentContract)}</td>
                <td className="px-3 py-3 text-right font-mono">{formatCurrency(totalWorkOrders)}</td>
                <td className="px-3 py-3 text-right font-mono">{formatCurrency(totalBilled)}</td>
                <td className="px-3 py-3 text-right font-mono">
                  {totalCurrentContract ? Math.round((totalBilled / totalCurrentContract) * 100) : 0}%
                </td>
                <td className="px-3 py-3 text-right font-mono text-emerald-700">{formatCurrency(totalEstCost)}</td>
                <td colSpan={5}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

