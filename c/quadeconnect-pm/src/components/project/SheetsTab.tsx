import React, { useState } from 'react';
import { Sheet } from '../../types';
import { DocViewer } from './DocViewer';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface SheetsTabProps {
  sheets: Sheet[];
  onUpdateSheet: (updatedSheet: Sheet) => void;
  onAddSheet: (newSheet: Sheet) => void;
}

export const SheetsTab: React.FC<SheetsTabProps> = ({
  sheets,
  onUpdateSheet,
  onAddSheet
}) => {
  const { canEditDocs, isClient } = useAuthRBAC();
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newNumber, setNewNumber] = useState<string>('G0.25');
  const [newName, setNewName] = useState<string>('ENLARGED PLAN - LOBBY');
  const [newVersion, setNewVersion] = useState<string>('90 IFP');
  const [newSlideCount, setNewSlideCount] = useState<number>(3);

  const visibleSheets = isClient() ? sheets.filter(s => s.isPublished) : sheets;
  const pendingPublish = sheets.filter(s => !s.isPublished).length;

  const activeSheet = sheets.find(s => s.id === selectedSheetId);

  if (activeSheet) {
    return (
      <DocViewer
        documentItem={activeSheet}
        isShopDrawing={false}
        onBack={() => setSelectedSheetId(null)}
        onSaveMetadata={updated => {
          onUpdateSheet({
            ...activeSheet,
            number: updated.number,
            name: updated.name,
            tags: updated.tags
          });
        }}
        onAddMarkupPin={(comment, category) => {
          onUpdateSheet({
            ...activeSheet,
            hasMarkups: true
          });
          alert(`Pinned markup [${category}]: ${comment}`);
        }}
      />
    );
  }

  const handleCreateSheet = () => {
    const newSheetItem: Sheet = {
      id: `sh-${Date.now()}`,
      number: newNumber,
      name: newName,
      versions: [
        {
          id: `ver-${Date.now()}`,
          name: newVersion,
          issueDate: new Date().toISOString().slice(0, 10),
          slideCount: newSlideCount,
          uploadedBy: 'Rob Redmond',
          uploadedAt: 'Today',
          s3Key: `projects/sheets/${newNumber}.pdf`
        }
      ],
      currentVersionIndex: 0,
      tags: ['Architectural'],
      isPublished: false,
      hasMarkups: false
    };

    onAddSheet(newSheetItem);
    setShowUploadModal(false);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Action Toolbar (Ref Image 5) */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          {canEditDocs() && (
            <>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded transition flex items-center space-x-1"
              >
                <span>☁</span>
                <span>UPLOAD AND PROCESS NEW SHEETS</span>
              </button>
              <button
                onClick={() => alert('Opening Version Sets Manager...')}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded transition"
              >
                MANAGE VERSIONS
              </button>
              <button
                onClick={() => alert(`Releasing ${pendingPublish} pending sheets to client...`)}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded transition"
              >
                PUBLISH LOG ({pendingPublish}/{sheets.length})
              </button>
            </>
          )}
        </div>
        <div className="text-slate-500 font-medium">
          Showing <b className="text-slate-800">{visibleSheets.length}</b> Published Sheets
        </div>
      </div>

      {/* Published Sheets Grid (Image 5 Reference) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="px-4 py-2.5">Sheet Number</th>
              <th className="px-4 py-2.5">Sheet Name</th>
              <th className="px-4 py-2.5">Version</th>
              <th className="px-4 py-2.5">Issue Date</th>
              <th className="px-4 py-2.5">Sheet Info (Slides)</th>
              <th className="px-4 py-2.5">Upload Date</th>
              <th className="px-4 py-2.5">Uploaded By</th>
              <th className="px-4 py-2.5">Tags</th>
              <th className="px-4 py-2.5">Publish Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleSheets.map(s => {
              const curVer = s.versions[s.currentVersionIndex] || s.versions[0];

              return (
                <tr
                  key={s.id}
                  onClick={() => setSelectedSheetId(s.id)}
                  className="hover:bg-blue-50/50 cursor-pointer transition"
                >
                  <td className="px-4 py-2.5 font-bold font-mono text-blue-600 hover:underline">
                    {s.number}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{s.name}</td>
                  <td className="px-4 py-2.5">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px] font-bold">
                      {curVer.name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-600">{curVer.issueDate}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center space-x-1.5">
                      {/* Slide Count Badge e.g. Σ4, Σ3, Σ1 */}
                      <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold" title={`${curVer.slideCount} slides in PDF`}>
                        Σ{curVer.slideCount}
                      </span>
                      {s.hasMarkups && <span title="Pinned Markups Active">📌</span>}
                      {s.versions.length > 1 && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 rounded font-bold">
                          {s.versions.length} Revs
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 font-mono text-[11px]">{curVer.uploadedAt}</td>
                  <td className="px-4 py-2.5 text-slate-700">{curVer.uploadedBy}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex space-x-1">
                      {s.tags.map(t => (
                        <span key={t} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {s.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Upload &amp; Process New Sheets</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded text-[11px]">
                <b>AWS S3 Cloud Engine:</b> When you select a PDF, the backend worker automatically counts the slides/pages, generates thumbnails, and scans title blocks.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sheet Number</label>
                <input
                  type="text"
                  value={newNumber}
                  onChange={e => setNewNumber(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sheet Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
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
                onClick={handleCreateSheet}
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

