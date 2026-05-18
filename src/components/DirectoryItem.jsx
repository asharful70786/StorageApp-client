/* eslint-disable react/prop-types */
import { FaFolder, FaFilePdf, FaFileImage, FaFileVideo, FaFileArchive, FaFileCode, FaFileAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import ContextMenu from "./ContextMenu";
import { useDirectoryContext } from "../context/DirectoryContext";
import { formatSize } from "./DetailsPopup";

function formatDateShort(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateRelative(dateValue) {
  const now = new Date();
  const date = new Date(dateValue);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateShort(dateValue);
}

function DirectoryItem({ item, uploadProgress }) {
  const { handleRowClick, activeContextMenu, handleContextMenu, getFileIcon } = useDirectoryContext();

  function renderFileIcon(iconString) {
    const sizeClass = "text-lg";
    switch (iconString) {
      case "pdf": return <FaFilePdf className={`text-red-500 ${sizeClass}`} />;
      case "image": return <FaFileImage className={`text-green-500 ${sizeClass}`} />;
      case "video": return <FaFileVideo className={`text-purple-500 ${sizeClass}`} />;
      case "archive": return <FaFileArchive className={`text-yellow-500 ${sizeClass}`} />;
      case "code": return <FaFileCode className={`text-blue-500 ${sizeClass}`} />;
      case "alt":
      default: return <FaFileAlt className={`text-gray-500 ${sizeClass}`} />;
    }
  }

  const isUploadingItem = String(item.id).startsWith("temp-") || item.isUploading;

  const handleClick = () => {
    if (activeContextMenu || isUploadingItem) return;
    handleRowClick(item.isDirectory ? "directory" : "file", item.id);
  };

  return (
    <div
      className={`relative transition-colors ${
        isUploadingItem
          ? "cursor-default bg-blue-50/50"
          : "cursor-pointer bg-white hover:bg-slate-50/80 active:bg-slate-100"
      }`}
      onClick={handleClick}
      onContextMenu={(e) => handleContextMenu(e, item.id)}
    >
      {/* ── Desktop Table Row ── */}
      <div
        className="hidden md:grid grid-cols-[2fr_1fr_1fr_80px] items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-b-0"
        title={`Size: ${formatSize(item.size)}\nCreated: ${new Date(item.createdAt).toLocaleString()}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
            {item.isDirectory ? (
              <FaFolder className="text-blue-500 text-xl" />
            ) : (
              <div className="text-gray-600">{renderFileIcon(getFileIcon(item.name))}</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gray-900 font-medium text-sm truncate">{item.name}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>{formatDateRelative(item.createdAt)}</span>
              {isUploadingItem && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">Uploading</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            item.isDirectory ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
          }`}>
            {item.isDirectory ? "Folder" : "File"}
          </span>
        </div>

        <div className="text-sm font-medium text-slate-500">{formatSize(item.size)}</div>

        <div
          data-more-button
          className={`ml-auto flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors ${
            activeContextMenu?.id === item.id
              ? "bg-slate-900 text-white shadow-lg"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          }`}
          onClick={(e) => { e.stopPropagation(); handleContextMenu(e, item.id); }}
          title="More actions"
        >
          <BsThreeDotsVertical />
        </div>

        {activeContextMenu?.id === item.id && (
          <ContextMenu item={item} anchor={activeContextMenu.anchor} isUploadingItem={isUploadingItem} />
        )}
      </div>

      {/* ── Mobile Card ── */}
      <div
        className="md:hidden flex items-center gap-3 px-4 py-4 border-b border-slate-100"
        onClick={handleClick}
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
          {item.isDirectory ? (
            <FaFolder className="text-blue-500 text-2xl" />
          ) : (
            <div className="text-gray-600 text-xl">{renderFileIcon(getFileIcon(item.name))}</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-900 truncate pr-2">{item.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              item.isDirectory ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
            }`}>
              {item.isDirectory ? "Folder" : "File"}
            </span>
            <span className="text-xs text-slate-400">{formatSize(item.size)}</span>
            {isUploadingItem && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Uploading</span>
            )}
          </div>
        </div>

        <div
          data-more-button
          className={`flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors ${
            activeContextMenu?.id === item.id
              ? "bg-slate-900 text-white"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          }`}
          onClick={(e) => { e.stopPropagation(); handleContextMenu(e, item.id); }}
        >
          <BsThreeDotsVertical />
        </div>

        {activeContextMenu?.id === item.id && (
          <ContextMenu item={item} anchor={activeContextMenu.anchor} isUploadingItem={isUploadingItem} />
        )}
      </div>

      {/* Upload Progress */}
      {isUploadingItem && (
        <div className="md:hidden relative px-4 pb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-600">Uploading...</span>
            <span className="font-medium text-slate-700">{Math.floor(uploadProgress)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: uploadProgress === 100 ? "#10b981" : "#3b82f6",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectoryItem;