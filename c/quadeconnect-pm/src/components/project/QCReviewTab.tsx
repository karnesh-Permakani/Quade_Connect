import React, { useState } from 'react';
import { ShopDrawing, QCStatus } from '../../types';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface QCReviewTabProps {
  shopDrawings: ShopDrawing[];
  onUpdateQCStatus: (drawingId: string, status: QCStatus, notes: string) => void;
  onOpenDrawing: (drawingId: string) => void;
}

const QC_CHECKLIST = [
  'Dimensions match architectural sheets & field verification',
  'Material / substrate callouts correct',
  'Veneer species, cut & grain direction indicated',
  'Edge banding specified on all exposed edges',
  'Hardware matches hardware schedule',
  'Joinery & assembly details complete',
  'Wall blocking / mounting method shown',
  'ADA clearances & heights verified',
  'Fire rating requirements met',
  'Title block, revision & Work Order reference complete'
];

export const QCReviewTab: React.FC<QCReviewTabProps> = ({
  shopDrawings,
  onUpdateQCStatus,
  onOpenDrawing
}) => {
  const { canQC } = useAuthRBAC();
  const [activeDrawingId, setActiveDrawingId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [qcNotes, setQcNotes] = useState<string>('');

  const pending = shopDrawings.filter(s => s.qcStatus === 'Pending QC');
  const approved = shopDrawings.filter(s => s.qcStatus === 'QC Approved');
  const rejected = shopDrawings.filter(s => s.qcStatus === 'Rejected');

  const inspectingDrawing = shopDrawings.find(s => s.id === activeDrawingId);

  const handleStartInspection = (id: string) => {
    setActiveDrawingId(id);
    setCheckedItems({});
    setQcNotes('');
  };

  const handleCompleteInspection = (status: QCStatus) => {
    if (!activeDrawingId) return;
    onUpdateQCStatus(activeDrawingId, status, qcNotes);
    setActiveDrawingId(null);
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500 border border-slate-200 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Pending QC Inspection</div>
          <div className="text-2xl font-black text-purple-700 mt-1">{pending.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting technical check</div>
        </div>

        <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500 border border-slate-200 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">QC Approved</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{approved.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Ready for client submittal</div>
        </div>

        <div className="bg-white rounded-lg p-4 border-l-4 border-red-500 border border-slate-200 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Rejected / Revisions Needed</div>
          <div className="text-2xl font-black text-red-700 mt-1">{rejected.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Returned to engineering drafter</div>
        </div>
      </div>

      {/* QC Queue Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <h3 className="font-bold text-sm text-slate-900">Quality Control Inspection Queue</h3>
          <span className="text-[11px] text-slate-500">
            AWI Architectural Woodwork Institute Standards
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-4 py-2.5">Drawing No.</th>
                <th className="px-4 py-2.5">Drawing Name</th>
                <th className="px-4 py-2.5">Version Set</th>
                <th className="px-4 py-2.5">Slide Count</th>
                <th className="px-4 py-2.5">QC Status</th>
                <th className="px-4 py-2.5">Uploaded By</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shopDrawings.map(d => {
                const curVer = d.versions[d.currentVersionIndex] || d.versions[0];

                return (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-mono font-bold text-blue-700">{d.number}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-900">{d.name}</td>
                    <td className="px-4 py-2.5">
                      <span className="bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                        {curVer.name}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono font-bold text-slate-700">
                      Σ{curVer.slideCount}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.qcStatus === 'QC Approved' ? 'bg-emerald-100 text-emerald-800' :
                        d.qcStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {d.qcStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{curVer.uploadedBy}</td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      <button
                        onClick={() => onOpenDrawing(d.id)}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        View Slides
                      </button>
                      {canQC() && (
                        <button
                          onClick={() => handleStartInspection(d.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-2.5 py-1 rounded text-xs transition"
                        >
                          Run QC Review
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QC Review Inspection Modal */}
      {inspectingDrawing && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              QC Review: {inspectingDrawing.number} — {inspectingDrawing.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Verifying against AWI Custom Casework Technical Specifications.
            </p>

            <div className="space-y-2 mb-4 border border-slate-200 rounded p-3 bg-slate-50 text-xs">
              {QC_CHECKLIST.map((item, idx) => (
                <label key={idx} className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!checkedItems[idx]}
                    onChange={e => setCheckedItems({ ...checkedItems, [idx]: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className={checkedItems[idx] ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                    {item}
                  </span>
                </label>
              ))}
            </div>

            <div className="mb-4 text-xs">
              <label className="block font-semibold text-slate-700 mb-1">
                QC Redline Notes / Technical Corrections
              </label>
              <textarea
                rows={3}
                value={qcNotes}
                onChange={e => setQcNotes(e.target.value)}
                placeholder="e.g. Dimensions verified; check edge-banding grain matching on exposed end panels."
                className="w-full border border-slate-300 rounded p-2 text-slate-800"
              />
            </div>

            <div className="flex justify-end space-x-2 text-xs font-semibold">
              <button
                onClick={() => setActiveDrawingId(null)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCompleteInspection('Rejected')}
                className="px-3.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Reject &amp; Return to Drafter
              </button>
              <button
                onClick={() => handleCompleteInspection('QC Approved')}
                className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                ✓ Approve Drawing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

