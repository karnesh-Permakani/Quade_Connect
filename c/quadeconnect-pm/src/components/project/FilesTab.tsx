import React, { useState } from 'react';
import { ProjectFile } from '../../types';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface FilesTabProps {
  files: ProjectFile[];
  onUploadFile: (file: ProjectFile) => void;
}

const CATEGORIES: ProjectFile['category'][] = [
  'Contracts', 'Specifications', 'Cut Sheets', 'Client Uploads', 'Photos', 'Shared with Client'
];

export const FilesTab: React.FC<FilesTabProps> = ({
  files,
  onUploadFile
}) => {
  const { isClient } = useAuthRBAC();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');
  const [newFileCat, setNewFileCat] = useState<ProjectFile['category']>('Client Uploads');

  const allowedCategories = isClient()
    ? ['Client Uploads', 'Shared with Client']
    : ['All', ...CATEGORIES];

  const visibleFiles = files.filter(f => {
    if (isClient() && !['Client Uploads', 'Shared with Client'].includes(f.category)) return false;
    if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
    return true;
  });

  const handleUpload = () => {
    if (!newFileName.trim()) return;
    const newFile: ProjectFile = {
      id: `f-${Date.now()}`,
      name: newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`,
      category: newFileCat,
      sizeFormatted: '2.1 MB',
      uploadedBy: isClient() ? 'Client Representative' : 'Staff Drafter',
      date: new Date().toLocaleDateString(),
      s3Uri: `s3://quadeconnect-prod/projects/P-26-1132/${newFileCat.toLowerCase()}/${newFileName}.pdf`
    };

    onUploadFile(newFile);
    setShowUploadModal(false);
    setNewFileName('');
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Toolbar */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 py-1.5 rounded transition flex items-center space-x-1"
        >
          <span>☁</span>
          <span>Upload File to AWS S3 / Box</span>
        </button>
        <span className="text-slate-500 font-mono text-[11px]">
          AWS S3 Bucket (us-east-1) &amp; Box Enterprise Sync Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Left Folder Tree (3 cols) */}
        <div className="md:col-span-3 p-4 bg-slate-50/50 space-y-1 text-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
            Cloud Folders
          </div>
          {allowedCategories.map(cat => {
            const count = cat === 'All'
              ? files.length
              : files.filter(f => f.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex justify-between items-center px-2.5 py-1.5 rounded text-left transition ${
                  isSelected
                    ? 'bg-blue-100 text-blue-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>📁 {cat}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 rounded-full font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right File Table (9 cols) */}
        <div className="md:col-span-9 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-4 py-2.5">File Name</th>
                <th className="px-4 py-2.5">Folder</th>
                <th className="px-4 py-2.5">Size</th>
                <th className="px-4 py-2.5">Uploaded By</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">S3 URI</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleFiles.map(f => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>📄</span>
                    <span>{f.name}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {f.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-600">{f.sizeFormatted}</td>
                  <td className="px-4 py-2.5 text-slate-700">{f.uploadedBy}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-600">{f.date}</td>
                  <td className="px-4 py-2.5 font-mono text-[10px] text-slate-400 truncate max-w-xs">
                    {f.s3Uri}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => alert(`Opening secure pre-signed in-browser viewer for ${f.name}...`)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Upload File to S3 / Box</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  placeholder="e.g. Architectural Addendum # 03.pdf"
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Folder Destination</label>
                <select
                  value={newFileCat}
                  onChange={e => setNewFileCat(e.target.value as ProjectFile['category'])}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
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
                onClick={handleUpload}
                className="px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-700 text-white"
              >
                Upload to Cloud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

