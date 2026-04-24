function ConfirmDeleteModal({ item, onConfirm, onCancel }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl font-bold text-red-600">
          !
        </div>
        <h2 className="text-lg font-bold text-slate-950">Delete item?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          This will permanently delete{" "}
          <span className="font-semibold text-slate-800">
            &quot;{item.name}&quot;
          </span>{" "}
          {item.isDirectory ? "folder" : "file"} from your storage.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="min-h-11 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(220,38,38,0.18)] transition-colors hover:bg-red-700"
            onClick={() => onConfirm(item)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
