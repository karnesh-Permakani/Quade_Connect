import React, { useState } from 'react';
import { SubmittalItem, ShopDrawing } from '../../types';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface SubmittalsTabProps {
  submittals: SubmittalItem[];
  shopDrawings: ShopDrawing[];
  onAddSubmittal: (sub: SubmittalItem) => void;
  onClientDecision: (subId: string, decision: 'Approved' | 'Revise & Resubmit') => void;
}

export const SubmittalsTab: React.FC<SubmittalsTabProps> = ({
  submittals,
  shopDrawings,
  onAddSubmittal,
  onClientDecision
}) => {
  const { canManage, isClient } = useAuthRBAC();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('Reception Desk Shop Drawings & Veneer Samples');
  const [newSpec, setNewSpec] = useState<string>('06 41 00 Architectural Wood Casework');
  const [selectedDrawingIds, setSelectedDrawingIds] = useState<string[]>([]);

  const approvedDrawings = shopDrawings.filter(s => s.qcStatus === 'QC Approved');

  const handleCreate = () => {
    if (!newTitle.trim()) return;

    const newSub: SubmittalItem = {
      id: `sub-${Date.now()}`,
      no: `SUB-00${submittals.length + 1}`,
      title: newTitle,
      specSection: newSpec,
      revisionNo: 0,
      status: 'Submitted',
      ballInCourt: 'Client / Architect',
      attachedDrawingIds: selectedDrawingIds,
      sentDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      auditTrail: [
        {
          timestamp: new Date().toLocaleDateString(),
          user: 'Project Manager',
          action: 'Generated transmittal and submitted to Client'
        }
      ]
    };

    onAddSubmittal(newSub);
    setShowCreateModal(false);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Submittals &amp; Transmittal Packages</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Formal architectural packages sent to Architect / General Contractor for sign-off.
          </p>
        </div>
        {canManage() && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded transition"
          >
            + Create Submittal Package
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="px-4 py-2.5">Submittal No.</th>
              <th className="px-4 py-2.5">Package Title</th>
              <th className="px-4 py-2.5">Spec Section</th>
              <th className="px-4 py-2.5">Revision</th>
              <th className="px-4 py-2.5">Approval Status</th>
              <th className="px-4 py-2.5">Ball-in-Court</th>
              <th className="px-4 py-2.5">Date Issued</th>
              <th className="px-4 py-2.5">Response Due</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submittals.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold font-mono text-blue-700">{s.no}</td>
                <td className="px-4 py-2.5 font-medium text-slate-900">{s.title}</td>
                <td className="px-4 py-2.5 text-slate-600">{s.specSection}</td>
                <td className="px-4 py-2.5 font-mono">Rev {s.revisionNo}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    s.status === 'Revise & Resubmit' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-semibold text-slate-800">{s.ballInCourt}</td>
                <td className="px-4 py-2.5 font-mono text-slate-600">{s.sentDate || '—'}</td>
                <td className="px-4 py-2.5 font-mono text-slate-600">{s.dueDate || '—'}</td>
                <td className="px-4 py-2.5 text-right space-x-2">
                  {isClient() && s.status === 'Submitted' ? (
                    <>
                      <button
                        onClick={() => onClientDecision(s.id, 'Approved')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-xs transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onClientDecision(s.id, 'Revise & Resubmit')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded text-xs transition"
                      >
                        Revise
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => alert(`Opening Transmittal Cover Sheet & Attached Drawings for ${s.no}...`)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Transmittal PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Submittal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Create Submittal Package</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CSI Spec Section</label>
                <input
                  type="text"
                  value={newSpec}
                  onChange={e => setNewSpec(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Attach QC-Approved Shop Drawings
                </label>
                <div className="border border-slate-200 rounded p-2 max-h-36 overflow-y-auto space-y-1.5 bg-slate-50">
                  {approvedDrawings.map(d => (
                    <label key={d.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedDrawingIds.includes(d.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedDrawingIds([...selectedDrawingIds, d.id]);
                          } else {
                            setSelectedDrawingIds(selectedDrawingIds.filter(id => id !== d.id));
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="font-mono font-bold text-slate-800">{d.number}</span>
                      <span className="text-slate-600">{d.name}</span>
                    </label>
                  ))}
                  {approvedDrawings.length === 0 && (
                    <p className="text-slate-400 text-xs italic">
                      No QC-approved drawings available. Review drawings in QC tab first.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4 text-xs font-semibold">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Issue to Architect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

