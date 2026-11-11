import React, { useState } from 'react';
import { Sheet, ShopDrawing, SheetVersion, ShopDrawingVersion } from '../../types';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface DocViewerProps {
  documentItem: Sheet | ShopDrawing;
  isShopDrawing?: boolean;
  onBack: () => void;
  onSaveMetadata: (updated: { number: string; name: string; tags: string[] }) => void;
  onAddMarkupPin: (comment: string, category: string) => void;
}

export const DocViewer: React.FC<DocViewerProps> = ({
  documentItem,
  isShopDrawing = false,
  onBack,
  onSaveMetadata,
  onAddMarkupPin
}) => {
  const { canEditDocs } = useAuthRBAC();

  const [docNumber, setDocNumber] = useState(documentItem.number);
  const [docName, setDocName] = useState(documentItem.name);
  const [docTags, setDocTags] = useState(documentItem.tags.join(', '));
  const [selectedVersionIdx, setSelectedVersionIdx] = useState<number>(documentItem.currentVersionIndex);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [showMarkupModal, setShowMarkupModal] = useState<boolean>(false);
  const [markupText, setMarkupText] = useState<string>('');
  const [markupCategory, setMarkupCategory] = useState<string>('Architectural Question (RFI)');

  const currentVersion: SheetVersion | ShopDrawingVersion = documentItem.versions[selectedVersionIdx] || documentItem.versions[0];
  const totalSlides = currentVersion.slideCount || 1;

  const handleSave = () => {
    onSaveMetadata({
      number: docNumber,
      name: docName,
      tags: docTags.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  const handleAddMarkup = () => {
    if (!markupText.trim()) return;
    onAddMarkupPin(markupText, markupCategory);
    setMarkupText('');
    setShowMarkupModal(false);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
      {/* Top Action Controls */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 text-xs">
        <button
          onClick={onBack}
          className="text-blue-600 hover:underline font-semibold flex items-center space-x-1"
        >
          <span>‹ Back to {isShopDrawing ? 'Shop Drawings' : 'Sheets'} Grid</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`px-3 py-1.5 rounded font-medium border transition ${
              isCompareMode ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isCompareMode ? 'Exit Comparison Mode' : '⇄ Compare Revisions'}
          </button>
          <button
            onClick={() => alert(`Streaming signed PDF from AWS S3 / Box for ${documentItem.number}...`)}
            className="px-3 py-1.5 rounded font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
          >
            ⤓ Download PDF
          </button>
        </div>
      </div>

      {/* Main Split-Pane Layout (Image 4 Reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata & Revision History (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isShopDrawing ? 'Shop Drawing Number *' : 'Sheet Number *'}
              </label>
              <input
                type="text"
                value={docNumber}
                disabled={!canEditDocs()}
                onChange={e => setDocNumber(e.target.value)}
                className="w-full text-xs font-mono font-bold bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isShopDrawing ? 'Shop Drawing Name' : 'Sheet Name'}
              </label>
              <input
                type="text"
                value={docName}
                disabled={!canEditDocs()}
                onChange={e => setDocName(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Version Set *</label>
              <select
                value={selectedVersionIdx}
                onChange={e => {
                  setSelectedVersionIdx(Number(e.target.value));
                  setCurrentSlide(0);
                }}
                className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              >
                {documentItem.versions.map((ver, idx) => (
                  <option key={ver.id} value={idx}>
                    {ver.name} ({ver.issueDate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tags</label>
              <input
                type="text"
                value={docTags}
                disabled={!canEditDocs()}
                onChange={e => setDocTags(e.target.value)}
                placeholder="e.g. Millwork, Lobby, Restroom"
                className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {canEditDocs() && (
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 rounded transition"
              >
                Save Changes
              </button>
            )}
          </div>

          {/* Bottom-Left Revision History Timeline (Ref Image 4) */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Revision History
            </h4>
            <div className="space-y-2">
              {documentItem.versions.map((v, i) => {
                const isViewing = i === selectedVersionIdx;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVersionIdx(i);
                      setCurrentSlide(0);
                    }}
                    className={`p-2.5 rounded border text-xs cursor-pointer transition ${
                      isViewing
                        ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{v.name}</span>
                      {isViewing && <span className="text-[10px] text-orange-600 font-bold">(now viewing)</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-normal">
                      Issued: {v.issueDate} | {v.slideCount} slides | {v.uploadedBy}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Slide PDF Canvas & Navigation (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-100 rounded-lg border border-slate-200 p-4">
          {/* Top Viewer Bar */}
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-md border border-slate-200 mb-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 font-mono">{documentItem.number}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">{documentItem.name}</span>
              <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2 py-0.5 rounded">
                {currentVersion.name}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-slate-600">
                <button
                  onClick={() => setZoomLevel(Math.max(0.6, zoomLevel - 0.2))}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-bold"
                >
                  −
                </button>
                <span className="font-mono text-[11px] px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.2))}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => setShowMarkupModal(true)}
                className="bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 font-semibold px-2.5 py-1 rounded text-xs transition"
              >
                ✎ Add Markup Pin
              </button>
            </div>
          </div>

          {/* In-Browser PDF Canvas Area */}
          <div className="relative flex-1 min-h-[460px] bg-slate-200/80 rounded border border-slate-300 flex items-center justify-center overflow-auto p-4">
            {/* Left/Right Slide Navigators */}
            <button
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              className="absolute left-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ‹
            </button>

            {/* Architectural Drawing Mock Graphic */}
            <div
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease' }}
              className="bg-white border border-slate-400 shadow-lg p-6 w-[640px] h-[420px] relative flex flex-col justify-between"
            >
              {/* Drawing Title & Border Block */}
              <div className="border border-slate-800 p-3 h-full flex flex-col justify-between relative">
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    QuadeConnect Architectural Millwork Spec 06 41 00
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-1">
                    {documentItem.number} — {documentItem.name}
                  </div>
                  <div className="text-xs text-blue-700 font-semibold mt-0.5">
                    Slide {currentSlide + 1} of {totalSlides} ({currentVersion.name})
                  </div>
                </div>

                {/* Simulated Casework / Plan CAD Lines */}
                <div className="my-auto border border-dashed border-slate-300 bg-slate-50 p-6 rounded flex items-center justify-center text-center">
                  <div>
                    <div className="text-3xl mb-2">{isShopDrawing ? '📐' : '🏛️'}</div>
                    <div className="text-xs font-mono text-slate-700 font-bold uppercase">
                      {isShopDrawing ? 'Fabrication CAD Elevation & Section Details' : 'Architectural Plan View & Room Schedule'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Streamed directly from AWS S3 Bucket via secure signed stream
                    </div>
                  </div>
                </div>

                {/* Bottom Architectural Title Block Grid */}
                <div className="border-t border-slate-800 pt-2 flex justify-between items-end text-[10px] font-mono">
                  <div>
                    <div>PROJECT: {documentItem.name}</div>
                    <div>ISSUE DATE: {currentVersion.issueDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs text-blue-700">SHEET NO: {documentItem.number}</div>
                    <div>SLIDE: {currentSlide + 1} / {totalSlides}</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              disabled={currentSlide >= totalSlides - 1}
              onClick={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
              className="absolute right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ›
            </button>
          </div>

          {/* Bottom Thumbnail Strip Carousel (Ref Image 4) */}
          <div className="mt-3 pt-3 border-t border-slate-200 flex space-x-2 overflow-x-auto">
            {Array.from({ length: totalSlides }, (_, i) => {
              const isActive = i === currentSlide;
              return (
                <div
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`flex-shrink-0 w-24 h-16 rounded border-2 cursor-pointer flex flex-col items-center justify-center text-[10px] transition ${
                    isActive ? 'border-orange-500 bg-orange-50 font-bold text-orange-950' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="font-mono text-xs">Slide {i + 1}</span>
                  <span className="text-[9px] text-slate-400">{i === 0 ? 'Cover/Plan' : `Detail ${i}`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Markup Modal */}
      {showMarkupModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Add PDF Markup / Pinned Comment</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pin Category</label>
                <select
                  value={markupCategory}
                  onChange={e => setMarkupCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>Architectural Question (RFI)</option>
                  <option>QC Non-Conformance</option>
                  <option>Field Verification Required</option>
                  <option>Hardware / Finish Coordination</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instruction / Redline Note</label>
                <textarea
                  rows={3}
                  value={markupText}
                  onChange={e => setMarkupText(e.target.value)}
                  placeholder="e.g. Verify countertop radius with GC; coordinate undermount sink cutouts."
                  className="w-full border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4 text-xs font-semibold">
              <button
                onClick={() => setShowMarkupModal(false)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMarkup}
                className="px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-700 text-white"
              >
                Pin Markup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

