import { useDirectoryContext } from "../context/DirectoryContext";

function ContextMenu({ item, isUploadingItem }) {
  const {
    handleCancelUpload,
    setDeleteItem,
    openRenameModal,
    openDetailsPopup,
  } = useDirectoryContext();

  const menuClass =
    "absolute right-5 top-12 z-50 min-w-[168px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 text-sm shadow-[0_18px_42px_rgba(15,23,42,0.16)]";
  const itemClass =
    "rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors";
  const dangerClass =
    "rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 cursor-pointer transition-colors";

  if (item.isDirectory) {
    return (
      <div className={menuClass}>
        <div
          className={itemClass}
          onClick={() => openRenameModal("directory", item.id, item.name)}
        >
          Rename
        </div>
        <div className={dangerClass} onClick={() => setDeleteItem(item)}>
          Delete
        </div>
        <div className={itemClass} onClick={() => openDetailsPopup(item)}>
          Details
        </div>
      </div>
    );
  }

  if (isUploadingItem && item.isUploading) {
    return (
      <div className={menuClass}>
        <div className={dangerClass} onClick={() => handleCancelUpload(item.id)}>
          Cancel
        </div>
      </div>
    );
  }

  return (
    <div className={menuClass}>
      <div
        className={itemClass}
        onClick={() =>
          (window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/file/${item.id}?action=download`)
        }
      >
        Download
      </div>
      <div
        className={itemClass}
        onClick={() => openRenameModal("file", item.id, item.name)}
      >
        Rename
      </div>
      <div className={dangerClass} onClick={() => setDeleteItem(item)}>
        Delete
      </div>
      <div className={itemClass} onClick={() => openDetailsPopup(item)}>
        Details
      </div>
    </div>
  );
}

export default ContextMenu;
