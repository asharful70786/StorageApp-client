import { useEffect, useState } from "react";

/**
 * Format a byte value into a readable storage size.
 *
 * @param {number} bytes - Size in bytes.
 * @returns {string} Human-readable size label.
 */
export const formatSize = (bytes = 0) => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) return (bytes / GB).toFixed(2) + " GB";
  if (bytes >= MB) return (bytes / MB).toFixed(2) + " MB";
  if (bytes >= KB) return (bytes / KB).toFixed(2) + " KB";
  return bytes + " B";
};

function DetailsPopup({ item, onClose }) {
  const [details] = useState({
    path: "/",
    size: 0,
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
    numberOfFiles: 0,
    numberOfFolders: 0,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!item) return null;

  const { name, isDirectory, size, createdAt, updatedAt } = item;
  const { path, numberOfFiles, numberOfFolders } = details;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-950">Details</h2>
        <p className="mt-1 truncate text-sm font-medium text-slate-500">
          {name}
        </p>
        <div className="mt-5 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 text-sm">
          <div className="grid grid-cols-[112px_1fr] gap-3 px-4 py-3">
            <span className="font-semibold text-slate-500">Name</span>
            <span className="break-all font-medium text-slate-900">{name}</span>
          </div>
          <div className="grid grid-cols-[112px_1fr] gap-3 px-4 py-3">
            <span className="font-semibold text-slate-500">Path</span>
            <span className="break-all font-medium text-slate-900">{path}</span>
          </div>
          <div className="grid grid-cols-[112px_1fr] gap-3 px-4 py-3">
            <span className="font-semibold text-slate-500">Size</span>
            <span className="font-medium text-slate-900">{formatSize(size)}</span>
          </div>
          <div className="grid grid-cols-[112px_1fr] gap-3 px-4 py-3">
            <span className="font-semibold text-slate-500">Created</span>
            <span className="font-medium text-slate-900">
              {new Date(createdAt).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-[112px_1fr] gap-3 px-4 py-3">
            <span className="font-semibold text-slate-500">Updated</span>
            <span className="font-medium text-slate-900">
              {new Date(updatedAt).toLocaleString()}
            </span>
          </div>
          {isDirectory && (
            <>
              <div className="grid grid-cols-[112px_1fr] gap-3 px-4 py-3">
                <span className="font-semibold text-slate-500">Files</span>
                <span className="font-medium text-slate-900">
                  {numberOfFiles}
                </span>
              </div>
              <div className="grid grid-cols-[112px_1fr] gap-3 px-4 py-3">
                <span className="font-semibold text-slate-500">Folders</span>
                <span className="font-medium text-slate-900">
                  {numberOfFolders}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            className="min-h-11 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-colors hover:bg-blue-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsPopup;
