import { useEffect, useState } from "react";
/* eslint-disable react/prop-types */
import {
  createShare,
  getSharesForItem,
  revokeShare,
} from "../api/share-api";

function formatDate(dateValue) {
  if (!dateValue) return "Never expires";
  return new Date(dateValue).toLocaleDateString();
}

function getActiveShares(shares) {
  return shares.filter((share) => !share.revokedAt);
}

function getTargetType(item) {
  return item?.isDirectory ? "directory" : "file";
}

function getExpiryTimestamp(dateValue) {
  if (!dateValue) return null;

  const expiryDate = new Date(dateValue);
  expiryDate.setHours(23, 59, 59, 999);
  return expiryDate.toISOString();
}

function ShareModal({ item, onClose }) {
  const [permission, setPermission] = useState("view");
  const [expiresAt, setExpiresAt] = useState("");
  const [shares, setShares] = useState([]);
  const [shareUrl, setShareUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const targetType = getTargetType(item);

  useEffect(() => {
    async function loadShares() {
      if (!item) return;

      try {
        const data = await getSharesForItem(targetType, item.id);
        setShares(data.shares || []);
      } catch (err) {
        setMessage(err.response?.data?.error || "Could not load share links.");
      }
    }

    loadShares();
  }, [item, targetType]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleCreateShare(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const createdShare = await createShare({
        targetType,
        targetId: item.id,
        permission,
        expiresAt: getExpiryTimestamp(expiresAt),
      });

      setShareUrl(createdShare.shareUrl);
      setShares((currentShares) => [createdShare, ...currentShares]);
      setMessage("Share link created.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Could not create share link.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(url) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied.");
    } catch {
      setMessage("Copy failed. Select the link and copy it manually.");
    }
  }

  async function handleRevoke(shareId) {
    setLoading(true);
    setMessage("");

    try {
      await revokeShare(shareId);
      setShares((currentShares) =>
        currentShares.map((share) =>
          share.id === shareId ? { ...share, revokedAt: new Date() } : share
        )
      );
      setMessage("Share link revoked.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Could not revoke share link.");
    } finally {
      setLoading(false);
    }
  }

  if (!item) return null;

  const activeShares = getActiveShares(shares);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-950">Share link</h2>
            <p className="mt-1 truncate text-sm font-medium text-slate-500">
              {item.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title="Close"
          >
            x
          </button>
        </div>

        <form onSubmit={handleCreateShare} className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                Permission
              </span>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="view">View only</option>
                <option value="download">View and download</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                Expires
              </span>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create secure link"}
          </button>
        </form>

        {shareUrl && (
          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-blue-600">
              New link
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="min-w-0 flex-1 rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none"
              />
              <button
                onClick={() => handleCopy(shareUrl)}
                className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <div className="mt-5">
          <h3 className="mb-2 text-sm font-bold text-slate-900">
            Active links
          </h3>
          {activeShares.length ? (
            <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
              {activeShares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold capitalize text-slate-800">
                      {share.permission}
                    </p>
                    <p className="text-xs text-slate-500">
                      Expires: {formatDate(share.expiresAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRevoke(share.id)}
                    disabled={loading}
                    className="rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-500">
              No active share links yet.
            </p>
          )}
        </div>

        {message && (
          <p className="mt-4 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ShareModal;
