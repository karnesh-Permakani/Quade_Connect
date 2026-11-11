import React, { useState } from 'react';
import { WorkOrder, WOStatus, ShopDrawing } from '../../types';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface WorkOrdersTabProps {
  workOrders: WorkOrder[];
  shopDrawings: ShopDrawing[];
  onUpdateStatus: (woId: string, status: WOStatus) => void;
  onAddWorkOrder: (wo: WorkOrder) => void;
  onSelectShopDrawing: (drawingId: string) => void;
}

const ALL_STATUSES: WOStatus[] = [
  'Draft', 'Engineering', 'Approved', 'Released to Fab', 'In Production', 'Shipped', 'Installed', 'Closed'
];

export const WorkOrdersTab: React.FC<WorkOrdersTabProps> = ({
  workOrders,
  shopDrawings,
  onUpdateStatus,
  onAddWorkOrder,
  onSelectShopDrawing
}) => {
  const { canSeeCost, canManage } = useAuthRBAC();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newBudgetHours, setNewBudgetHours] = useState<number>(180);
  const [newShipDate, setNewShipDate] = useState<string>('2026-11-20');
  const [newValue, setNewValue] = useState<number>(45000);

  const formatCurrency = (val?: number) => {
    if (val === undefined) return '—';
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newWo: WorkOrder = {
      id: `wo-${Date.now()}`,
      no: `P-26-1132-${String(11 + workOrders.length * 7).padStart(3, '0')}p`,
      name: newName,
      status: 'Draft',
      budgetHours: newBudgetHours,
      actualHours: 0,
      shipDate: newShipDate,
      value: canSeeCost() ? newValue : 0
    };
    onAddWorkOrder(newWo);
    setShowAddModal(false);
    setNewName('');
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Project Work Orders</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Production packages released for CNC cutting, assembly, and finishing.
          </p>
        </div>
        {canManage() && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 py-1.5 rounded transition"
          >
            + New Work Order
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="px-4 py-2.5">Work Order No.</th>
              <th className="px-4 py-2.5">Scope Description</th>
              <th className="px-4 py-2.5">Production Status</th>
              <th className="px-4 py-2.5">Attached Shop Drawings</th>
              <th className="px-4 py-2.5 text-right">Budget Hours</th>
              <th className="px-4 py-2.5 text-right">Actual Hours</th>
              <th className="px-4 py-2.5">Target Ship Date</th>
              {canSeeCost() && <th className="px-4 py-2.5 text-right">WO Value ($)</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {workOrders.map(w => {
              const linkedDrawings = shopDrawings.filter(s => s.woId === w.id);

              return (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold font-mono text-blue-700">{w.no}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-900">{w.name}</td>
                  <td className="px-4 py-2.5">
                    {canManage() ? (
                      <select
                        value={w.status}
                        onChange={e => onUpdateStatus(w.id, e.target.value as WOStatus)}
                        className="border border-slate-300 rounded px-2 py-1 text-xs font-semibold bg-white text-slate-800"
                      >
                        {ALL_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {w.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {linkedDrawings.map(d => (
                        <button
                          key={d.id}
                          onClick={() => onSelectShopDrawing(d.id)}
                          className="bg-slate-100 hover:bg-blue-100 text-blue-700 font-mono font-bold px-1.5 py-0.5 rounded text-[10px]"
                        >
                          {d.number}
                        </button>
                      ))}
                      {linkedDrawings.length === 0 && <span className="text-slate-400">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">{w.budgetHours} hrs</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-800">{w.actualHours} hrs</td>
                  <td className="px-4 py-2.5 font-mono text-slate-600">{w.shipDate}</td>
                  {canSeeCost() && (
                    <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-900">
                      {formatCurrency(w.value)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Create New Work Order</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scope Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. 102.5 Bar Counter Display"
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget Hours</label>
                  <input
                    type="number"
                    value={newBudgetHours}
                    onChange={e => setNewBudgetHours(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ship Date</label>
                  <input
                    type="date"
                    value={newShipDate}
                    onChange={e => setNewShipDate(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  />
                </div>
              </div>

              {canSeeCost() && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WO Dollar Value ($)</label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={e => setNewValue(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4 text-xs font-semibold">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-700 text-white"
              >
                Create Work Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

