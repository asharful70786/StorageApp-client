// DirectoryItem.js
import {
  FaFolder,
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileArchive,
  FaFileCode,
  FaFileAlt,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import ContextMenu from "./ContextMenu";
import { useDirectoryContext } from "../context/DirectoryContext";
import { formatSize } from "./DetailsPopup";

function DirectoryItem({ item, uploadProgress }) {
  const {
    handleRowClick,
    activeContextMenu,
    handleContextMenu,
    getFileIcon,
  } = useDirectoryContext();

  function renderFileIcon(iconString) {
    const iconClass = "text-lg";
    switch (iconString) {
      case "pdf":
        return <FaFilePdf className={`text-red-500 ${iconClass}`} />;
      case "image":
        return <FaFileImage className={`text-green-500 ${iconClass}`} />;
      case "video":
        return <FaFileVideo className={`text-purple-500 ${iconClass}`} />;
      case "archive":
        return <FaFileArchive className={`text-yellow-500 ${iconClass}`} />;
      case "code":
        return <FaFileCode className={`text-blue-500 ${iconClass}`} />;
      case "alt":
      default:
        return <FaFileAlt className={`text-gray-500 ${iconClass}`} />;
    }
  }

  const isUploadingItem =
    String(item.id).startsWith("temp-") || item.isUploading;

  return (
    <div
      className={`relative flex flex-col justify-between border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 ${
        isUploadingItem
          ? "cursor-default bg-blue-50/50"
          : "cursor-pointer bg-white hover:bg-slate-50/80"
      }`}
      onClick={() =>
        !(activeContextMenu || isUploadingItem) &&
        handleRowClick(item.isDirectory ? "directory" : "file", item.id)
      }
      onContextMenu={(e) => handleContextMenu(e, item.id)}
    >
      <div
        className="grid grid-cols-[2fr_1fr_1fr_80px] items-center gap-4"
        title={`Size: ${formatSize(item.size)}\nCreated At: ${new Date(item.createdAt).toLocaleString()}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
            {item.isDirectory ? (
              <FaFolder className="text-blue-500 text-xl" />
            ) : (
              <div className="text-gray-600">
                {renderFileIcon(getFileIcon(item.name))}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gray-900 font-medium text-sm truncate">
              {item.name}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              {isUploadingItem && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                  Uploading
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              item.isDirectory
                ? "bg-blue-50 text-blue-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {item.isDirectory ? "Folder" : "File"}
          </span>
        </div>

        <div className="text-[13px] font-medium text-slate-500">
          {formatSize(item.size)}
        </div>

        <div
          className="ml-auto flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          onClick={(e) => handleContextMenu(e, item.id)}
          title="More actions"
        >
          <BsThreeDotsVertical />
        </div>
        {activeContextMenu === item.id && (
          <ContextMenu item={item} isUploadingItem={isUploadingItem} />
        )}
      </div>
      {isUploadingItem && (
        <div className="relative mt-3 px-[52px]">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-slate-600">Uploading...</span>
            <span className="font-medium text-slate-700">
              {Math.floor(uploadProgress)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: uploadProgress === 100 ? "#10b981" : "#3b82f6",
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectoryItem;
