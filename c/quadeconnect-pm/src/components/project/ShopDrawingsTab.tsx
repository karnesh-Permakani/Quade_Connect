import React, { useState } from 'react';
import { ShopDrawing, WorkOrder } from '../../types';
import { DocViewer } from './DocViewer';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface ShopDrawingsTabProps {
  shopDrawings: ShopDrawing[];
  workOrders: WorkOrder[];
  onUpdateShopDrawing: (updated: ShopDrawing) => void;
  onAddShopDrawing: (newDwg: ShopDrawing) => void;
  onSelectWorkOrder: (woId: string) => void;
}

export const ShopDrawingsTab: React.FC<ShopDrawingsTabProps> = ({
  shopDrawings,
  workOrders,
  onUpdateShopDrawing,
  onAddShopDrawing,
  onSelectWorkOrder
}) => {
  const { canEditDocs, isClient } = useAuthRBAC();
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const [newNumber, setNewNumber] = useState<string>('101.03');
  const [newName, setNewName] = useState<string>('RESTROOM MOCKUP HARDWARE');
  const [newVersion, setNewVersion] = useState<string>('MOCKUP PACKAGE # 1');
  const [newSlideCount, setNewSlideCount] = useState<number>(3);
  const [newWoId, setNewWoId] = useState<string>(workOrders[0]?.id || '');

  const visibleDrawings = isClient() ? shopDrawings.filter(s => s.isPublished) : shopDrawings;
  const pendingPublish = shopDrawings.filter(s => !s.isPublished).length;

  const activeDrawing = shopDrawings.find(s => s.id === selectedDrawingId);

  if (activeDrawing) {
    return (
      <DocViewer
        documentItem={activeDrawing}
        isShopDrawing={true}
        onBack={() => setSelectedDrawingId(null)}
        onSaveMetadata={updated => {
          onUpdateShopDrawing({
            ...activeDrawing,
            number: updated.number,
            name: updated.name,
            tags: updated.tags
          });
        }}
        onAddMarkupPin={(comment, category) => {
          onUpdateShopDrawing({
            ...activeDrawing,
            hasMarkups: true
          });
          alert(`Pinned markup [${category}]: ${comment}`);
        }}
      />
    );
  }

  const handleCreateDrawing = () => {
    const newDrawingItem: ShopDrawing = {
      id: `sd-${Date.now()}`,
      number: newNumber,
      name: newName,
      woId: newWoId,
      versions: [
        {
          id: `ver-${Date.now()}`,
          name: newVersion,
          issueDate: new Date().toISOString().slice(0, 10),
          slideCount: newSlideCount,
          uploadedBy: 'Christopher Holland',
          uploadedAt: 'Today',
          s3Key: `projects/shop/${newNumber}.pdf`
        }
      ],
      currentVersionIndex: 0,
      tags: ['Mockup'],
      qcStatus: 'Pending QC',
      isPublished: false,
      hasMarkups: false
    };

    onAddShopDrawing(newDrawingItem);
    setShowUploadModal(false);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Action Toolbar (Ref Image 3) */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          {canEditDocs() && (
            <>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded transition flex items-center space-x-1"
              >
                <span>☁</span>
                <span>UPLOAD AND PROCESS NEW SHOP DRAWINGS</span>
              </button>
              <button
                onClick={() => alert('Opening Mockup Package Version Sets...')}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded transition"
              >
                MANAGE VERSIONS
              </button>
              <button
                onClick={() => alert(`Releasing ${pendingPublish} approved shop drawings to client portal...`)}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded transition"
              >
                PUBLISH LOG ({pendingPublish}/{shopDrawings.length})
              </button>
            </>
          )}
        </div>
        <div className="text-slate-500 font-medium">
          Showing <b className="text-slate-800">{visibleDrawings.length}</b> Published Shop Drawings
        </div>
      </div>

      {/* Published Shop Drawings Grid (Image 3 Reference) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="px-4 py-2.5">Shop Drawing Number</th>
              <th className="px-4 py-2.5">Shop Drawing Name</th>
              <th className="px-4 py-2.5">Version</th>
              <th className="px-4 py-2.5">Issue Date</th>
              <th className="px-4 py-2.5">Linked Work Orders</th>
              <th className="px-4 py-2.5">Drawing Info (Slides)</th>
              <th className="px-4 py-2.5">Upload Date</th>
              <th className="px-4 py-2.5">Uploaded By</th>
              <th className="px-4 py-2.5">QC Status</th>
              <th className="px-4 py-2.5">Publish Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleDrawings.map(d => {
              const curVer = d.versions[d.currentVersionIndex] || d.versions[0];
              const linkedWo = workOrders.find(w => w.id === d.woId);

              return (
                <tr
                  key={d.id}
                  className="hover:bg-blue-50/50 cursor-pointer transition"
                >
                  <td
                    onClick={() => setSelectedDrawingId(d.id)}
                    className="px-4 py-2.5 font-bold font-mono text-blue-600 hover:underline"
                  >
                    {d.number}
                  </td>
                  <td
                    onClick={() => setSelectedDrawingId(d.id)}
                    className="px-4 py-2.5 font-semibold text-slate-900"
                  >
                    {d.name}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[11px] font-bold">
                      {curVer.name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-600">{curVer.issueDate}</td>
                  
                  {/* Linked Work Order column with direct click */}
                  <td className="px-4 py-2.5">
                    {linkedWo ? (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectWorkOrder(linkedWo.id);
                        }}
                        className="text-blue-600 font-mono hover:underline font-bold"
                      >
                        {linkedWo.no}
                      </button>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Slide Count Badge e.g. Σ9, Σ2 */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold" title={`${curVer.slideCount} slides in PDF`}>
                        Σ{curVer.slideCount}
                      </span>
                      {d.hasMarkups && <span title="Pinned Markups Active">📌</span>}
                      {d.versions.length > 1 && (
                        <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 rounded font-bold">
                          {d.versions.length} Revs
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2.5 text-slate-600 font-mono text-[11px]">{curVer.uploadedAt}</td>
                  <td className="px-4 py-2.5 text-slate-700">{curVer.uploadedBy}</td>
                  
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.qcStatus === 'QC Approved' ? 'bg-emerald-100 text-emerald-800' :
                      d.qcStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {d.qcStatus}
                    </span>
                  </td>

                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {d.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Upload Shop Drawing Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Upload &amp; Process New Shop Drawings</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded text-[11px]">
                <b>Millwork CAD Processor:</b> Uploaded PDFs are parsed to detect individual sections, slide count, and link automatically to the selected Work Order.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Drawing Number</label>
                <input
                  type="text"
                  value={newNumber}
                  onChange={e => setNewNumber(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Drawing Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Link to Work Order</label>
                <select
                  value={newWoId}
                  onChange={e => setNewWoId(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                >
                  {workOrders.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.no} — {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Version Set</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={e => setNewVersion(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slide Count (ΣN)</label>
                  <input
                    type="number"
                    min="1"
                    value={newSlideCount}
                    onChange={e => setNewSlideCount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4 text-xs font-semibold">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDrawing}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Upload &amp; Index
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

