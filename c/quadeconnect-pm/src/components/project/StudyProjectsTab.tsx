import React, { useState } from 'react';
import { StudyProject } from '../../types';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface StudyProjectsTabProps {
  studyProjects: StudyProject[];
  onAddStudy: (study: StudyProject) => void;
  onConvertToWorkOrder: (studyId: string) => void;
}

export const StudyProjectsTab: React.FC<StudyProjectsTabProps> = ({
  studyProjects,
  onAddStudy,
  onConvertToWorkOrder
}) => {
  const { canEditDocs, canManage } = useAuthRBAC();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newEngineer, setNewEngineer] = useState<string>('Christopher Holland');
  const [newHours, setNewHours] = useState<number>(16);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const newStudy: StudyProject = {
      id: `st-${Date.now()}`,
      no: `ST-0${studyProjects.length + 1}`,
      title: newTitle,
      engineer: newEngineer,
      status: 'In Progress',
      budgetHours: newHours,
      loggedHours: 0
    };
    onAddStudy(newStudy);
    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Study Projects (Pre-Engineering R&amp;D)</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Technical feasibility, CNC toolpath trials, joinery tests, and veneer yield mockups before releasing Shop Drawings.
          </p>
        </div>
        {canEditDocs() && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-3 py-1.5 rounded transition"
          >
            + New Study Project
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="px-4 py-2.5">Study No.</th>
              <th className="px-4 py-2.5">Title &amp; Objective</th>
              <th className="px-4 py-2.5">Assigned Engineer</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Budget Hours</th>
              <th className="px-4 py-2.5 text-right">Logged Hours</th>
              <th className="px-4 py-2.5">Converted Work Order</th>
              <th className="px-4 py-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {studyProjects.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold font-mono text-teal-700">{s.no}</td>
                <td className="px-4 py-2.5 font-medium text-slate-900">{s.title}</td>
                <td className="px-4 py-2.5 text-slate-700">{s.engineer}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' :
                    s.status === 'Complete' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right font-mono">{s.budgetHours} hrs</td>
                <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-800">{s.loggedHours} hrs</td>
                <td className="px-4 py-2.5 font-mono text-blue-600">
                  {s.convertedWoNo ? <b>{s.convertedWoNo}</b> : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-4 py-2.5 text-right">
                  {!s.convertedWoNo && canManage() && (
                    <button
                      onClick={() => onConvertToWorkOrder(s.id)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded text-xs border border-blue-200 transition"
                    >
                      Convert to Work Order
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Create Study Project</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Study Objective / Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Curved veneer vacuum pressing test"
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Drafter</label>
                  <input
                    type="text"
                    value={newEngineer}
                    onChange={e => setNewEngineer(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget Hours</label>
                  <input
                    type="number"
                    value={newHours}
                    onChange={e => setNewHours(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  />
                </div>
              </div>
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
                className="px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white"
              >
                Create Study
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

