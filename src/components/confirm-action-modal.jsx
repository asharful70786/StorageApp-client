/* eslint-disable react/prop-types */

/**
 * Confirmation modal for destructive / important actions.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {string} props.title - Modal title.
 * @param {React.ReactNode} props.description - Modal body content.
 * @param {string} [props.confirmLabel] - Confirm button label.
 * @param {string} [props.cancelLabel] - Cancel button label.
 * @param {"danger"|"default"} [props.tone] - Visual tone for confirm button.
 * @param {() => void} props.onConfirm - Called when user confirms.
 * @param {() => void} props.onCancel - Called when user cancels / closes.
 * @returns {JSX.Element|null}
 */
export function ConfirmActionModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const isDanger = tone === "danger";
  const iconClass = isDanger
    ? "bg-red-50 text-red-600"
    : "bg-slate-100 text-slate-700";
  const confirmClass = isDanger
    ? "bg-red-600 hover:bg-red-700 shadow-[0_12px_28px_rgba(220,38,38,0.18)]"
    : "bg-slate-950 hover:bg-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.18)]";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold ${iconClass}`}
          aria-hidden="true"
        >
          !
        </div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <div className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${confirmClass}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
