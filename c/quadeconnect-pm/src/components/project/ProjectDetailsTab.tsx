import React, { useState } from 'react';
import { Project, MillworkTrade } from '../../types';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface ProjectDetailsTabProps {
  project: Project;
  onUpdateHours: (trade: MillworkTrade, budget: number, logged: number) => void;
  onLogHours: (trade: MillworkTrade, hours: number) => void;
}

const TRADES: MillworkTrade[] = ['Engineering', 'Fabrication', 'Finishing', 'Installation'];

export const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({
  project,
  onUpdateHours,
  onLogHours
}) => {
  const { canSeeCost, canManage, canLogHours, payRates, updatePayRate, isClient } = useAuthRBAC();
  const [logTrade, setLogTrade] = useState<MillworkTrade>('Engineering');
  const [logAmount, setLogAmount] = useState<number>(4);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  const formatCurrency = (val?: number) => {
    if (val === undefined) return '—';
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const totalBudgetHours = Object.values(project.hoursBudget).reduce((a, b) => a + b, 0);
  const totalLoggedHours = Object.values(project.hoursLogged).reduce((a, b) => a + b, 0);

  const totalLaborBudget = TRADES.reduce((acc, trade) => {
    return acc + (project.hoursBudget[trade] || 0) * (payRates[trade] || 0);
  }, 0);

  const totalLaborActual = TRADES.reduce((acc, trade) => {
    return acc + (project.hoursLogged[trade] || 0) * (payRates[trade] || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Overview Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-3">
            Project Overview &amp; Specifications
          </h3>
          <div className="grid grid-cols-2 gap-y-2.5 text-xs">
            <span className="text-slate-500">Project Number:</span>
            <span className="font-mono font-bold text-slate-900">{project.no}</span>

            <span className="text-slate-500">Internal Job Code:</span>
            <span className="font-mono text-slate-800">{project.code || '26011R'}</span>

            <span className="text-slate-500">Customer:</span>
            <span className="font-semibold text-slate-800">{project.customer}</span>

            <span className="text-slate-500">Architectural Firm:</span>
            <span className="text-slate-800">{project.architect}</span>

            <span className="text-slate-500">Jobsite Location:</span>
            <span className="text-slate-800">{project.location}</span>

            <span className="text-slate-500">Contract Start:</span>
            <span className="font-mono text-slate-800">{project.startDate}</span>

            <span className="text-slate-500">Target Completion:</span>
            <span className="font-mono text-slate-800">{project.dueDate}</span>

            <span className="text-slate-500">AWI Quality Grade:</span>
            <span className="font-semibold text-blue-700">{project.awiGrade} Grade</span>

            <span className="text-slate-500">Primary Wood Veneer:</span>
            <span className="text-slate-800 font-medium">{project.primaryVeneer}</span>

            <span className="text-slate-500">Finish System:</span>
            <span className="text-slate-800">{project.finishSystem}</span>
          </div>
        </div>

        {/* Financial Charter (Admin Only) */}
        {canSeeCost() ? (
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
              <h3 className="font-bold text-sm text-slate-900">Financial Summary</h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Admin Financial Control
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-2.5 text-xs">
              <span className="text-slate-500">Original Total Contract:</span>
              <span className="font-mono text-slate-800">{formatCurrency(project.origContractVal)}</span>

              <span className="text-slate-500">Approved Change Orders:</span>
              <span className="font-mono text-slate-800">
                {formatCurrency((project.currentContractVal || 0) - (project.origContractVal || 0))}
              </span>

              <span className="text-slate-500 font-semibold">Current Contract Value:</span>
              <span className="font-mono font-bold text-blue-700 text-sm">
                {formatCurrency(project.currentContractVal)}
              </span>

              <span className="text-slate-500">Work Orders Value:</span>
              <span className="font-mono text-slate-800">{formatCurrency(project.woTotalVal)}</span>

              <span className="text-slate-500">Invoiced to Date (Billed):</span>
              <span className="font-mono text-slate-800 font-medium">
                {formatCurrency(project.billedVal)} ({project.billedPct || 0}%)
              </span>

              <span className="text-slate-500 font-semibold">Estimated Grand Total Cost:</span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(project.estGrandTotalCost)}
              </span>

              <span className="text-slate-500">Projected Gross Margin:</span>
              <span className="font-mono font-bold text-emerald-600">
                {project.currentContractVal && project.estGrandTotalCost
                  ? Math.round(((project.currentContractVal - project.estGrandTotalCost) / project.currentContractVal) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-center text-center">
            <span className="text-2xl mb-2">🔒</span>
            <h4 className="font-bold text-xs text-slate-700">Financial Data Restricted</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
              Contract values, billing percentages, and hourly dollar costs are masked for your role. You have full access to hours, schedules, and drawings.
            </p>
          </div>
        )}
      </div>

      {/* Hours Pay Plan Table (Non-client) */}
      {!isClient() && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Hours Pay &amp; Labor Budget Plan</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tracks budgeted hours against actual logged hours per trade.
              </p>
            </div>
            {canLogHours() && (
              <button
                onClick={() => setShowLogModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded text-xs transition"
              >
                + Log Labor Hours
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                  <th className="px-4 py-2.5">Trade / Department</th>
                  <th className="px-4 py-2.5 text-right">Budget Hours</th>
                  <th className="px-4 py-2.5 text-right">Actual Hours</th>
                  <th className="px-4 py-2.5">Progress</th>
                  {canSeeCost() && (
                    <>
                      <th className="px-4 py-2.5 text-right">Pay Rate ($/hr)</th>
                      <th className="px-4 py-2.5 text-right">Labor Budget ($)</th>
                      <th className="px-4 py-2.5 text-right">Labor Actual ($)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TRADES.map(trade => {
                  const bHours = project.hoursBudget[trade] || 0;
                  const lHours = project.hoursLogged[trade] || 0;
                  const rate = payRates[trade] || 0;
                  const pct = bHours ? Math.round((lHours / bHours) * 100) : 0;

                  return (
                    <tr key={trade} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-bold text-slate-800">{trade}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{bHours} hrs</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-900">{lHours} hrs</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full ${pct > 100 ? 'bg-red-500' : 'bg-blue-600'}`}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-slate-600">{pct}%</span>
                        </div>
                      </td>

                      {/* Admin-Only Labor Cost Rates */}
                      {canSeeCost() && (
                        <>
                          <td className="px-4 py-2.5 text-right font-mono">
                            ${rate.toFixed(2)}/hr
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-700">
                            {formatCurrency(bHours * rate)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                            {formatCurrency(lHours * rate)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                  <td className="px-4 py-2.5 uppercase">Total Labor:</td>
                  <td className="px-4 py-2.5 text-right font-mono">{totalBudgetHours} hrs</td>
                  <td className="px-4 py-2.5 text-right font-mono">{totalLoggedHours} hrs</td>
                  <td className="px-4 py-2.5 font-mono">
                    {totalBudgetHours ? Math.round((totalLoggedHours / totalBudgetHours) * 100) : 0}%
                  </td>
                  {canSeeCost() && (
                    <>
                      <td className="px-4 py-2.5"></td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(totalLaborBudget)}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-emerald-800">
                        {formatCurrency(totalLaborActual)}
                      </td>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Log Hours Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Log Labor Hours</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trade Department</label>
                <select
                  value={logTrade}
                  onChange={e => setLogTrade(e.target.value as MillworkTrade)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                >
                  {TRADES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hours Spent</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={logAmount}
                  onChange={e => setLogAmount(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4 text-xs font-semibold">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onLogHours(logTrade, logAmount);
                  setShowLogModal(false);
                }}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Log Hours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

