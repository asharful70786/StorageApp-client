import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaClock,
  FaCopy,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFolder,
  FaLink,
  FaLock,
  FaShareAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { fetchUser, logoutAllSessions, logoutUser } from "./api/userApi";
import { getMyShares, revokeShare } from "./api/share-api";
import { getDirectoryItems } from "./api/directoryApi";
import AppSidebar from "./components/AppSidebar";
import { formatSize } from "./components/DetailsPopup";

function formatDate(dateValue) {
  if (!dateValue) return "Never expires";
  return new Date(dateValue).toLocaleDateString();
}

function getShareStatus(share) {
  if (share.revokedAt) return "revoked";
  if (share.expiresAt && new Date(share.expiresAt) <= new Date()) {
    return "expired";
  }

  return "active";
}

function getStatusLabel(status) {
  if (status === "active") return "Live";
  if (status === "expired") return "Expired";
  return "Revoked";
}

function getTargetPath(share) {
  if (!share.target?.exists) return "";
  if (share.targetType === "directory") return `/directory/${share.targetId}`;

  return `${import.meta.env.VITE_BACKEND_BASE_URL}/file/${share.targetId}`;
}

function SharedByMePage() {
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [filter, setFilter] = useState("active");
  const [query, setQuery] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const [userPicture, setUserPicture] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [maxStorageInBytes, setMaxStorageInBytes] = useState(10 * 1024 ** 3);
  const [usedStorageInBytes, setUsedStorageInBytes] = useState(0);
  const [driveItemCount, setDriveItemCount] = useState(0);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await fetchUser();
        setUserName(user.name);
        setUserEmail(user.email);
        if (user.picture) setUserPicture(user.picture);
        setMaxStorageInBytes(user.maxStorageInBytes);
        setUsedStorageInBytes(user.usedStorageInBytes);
        setLoggedIn(true);
      } catch {
        setLoggedIn(false);
        navigate("/login");
      }
    }

    loadUser();
  }, [navigate]);

  useEffect(() => {
    async function loadShares() {
      try {
        const shareData = await getMyShares();
        setShares(shareData.shares || []);
      } catch (err) {
        setMessage(err.response?.data?.error || "Could not load shared links.");
      } finally {
        setLoading(false);
      }
    }

    async function loadDriveItemCount() {
      try {
        const driveData = await getDirectoryItems();
        setDriveItemCount(
          (driveData.directories?.length || 0) + (driveData.files?.length || 0)
        );
      } catch {
        setDriveItemCount(0);
      }
    }

    loadShares();
    loadDriveItemCount();
  }, []);

  useEffect(() => {
    function handleOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const activeShares = shares.filter((share) => getShareStatus(share) === "active");
  const downloadShares = activeShares.filter(
    (share) => share.permission === "download"
  );

  const filteredShares = useMemo(() => {
    return shares.filter((share) => {
      const status = getShareStatus(share);
      const matchesFilter = filter === "all" || status === filter;
      const targetName = share.target?.name || "";
      const matchesQuery = targetName.toLowerCase().includes(query.toLowerCase());

      return matchesFilter && matchesQuery;
    });
  }, [filter, query, shares]);

  const usedGB = usedStorageInBytes / 1024 ** 3;
  const totalGB = maxStorageInBytes / 1024 ** 3;
  const storagePercentage = Math.min((usedGB / totalGB) * 100, 100);
  const storageHigh = storagePercentage > 90;
  const storageMid = storagePercentage > 75 && !storageHigh;

  async function handleLogout() {
    try {
      await logoutUser();
      navigate("/login");
    } finally {
      setShowUserMenu(false);
    }
  }

  async function handleLogoutAll() {
    try {
      await logoutAllSessions();
      navigate("/login");
    } finally {
      setShowUserMenu(false);
    }
  }

  async function handleCopy(share) {
    if (!share.shareUrl) {
      setMessage("This older link cannot be copied. Create a fresh link from the item menu.");
      return;
    }

    try {
      await navigator.clipboard.writeText(share.shareUrl);
      setCopiedId(share.id);
      setMessage("Share link copied.");
      setTimeout(() => setCopiedId(""), 1800);
    } catch {
      setMessage("Copy failed. Open the link and copy it manually.");
    }
  }

  async function handleRevoke(shareId) {
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
    }
  }

  function handleOpenTarget(share) {
    const targetPath = getTargetPath(share);
    if (!targetPath) return;

    if (share.targetType === "directory") {
      navigate(targetPath);
      return;
    }

    window.location.href = targetPath;
  }

  const filters = [
    ["active", "Live"],
    ["expired", "Expired"],
    ["revoked", "Revoked"],
    ["all", "All"],
  ];

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff_0,#eef3f8_34%,#e8edf4_100%)]">
      <AppSidebar
        activeSection="shared"
        combinedItems={Array.from({ length: driveItemCount })}
        loggedIn={loggedIn}
        navigate={navigate}
        setShowUserMenu={setShowUserMenu}
        sharedCount={activeShares.length}
        showUserMenu={showUserMenu}
        storageHigh={storageHigh}
        storageMid={storageMid}
        storagePercentage={storagePercentage}
        totalGB={totalGB}
        usedGB={usedGB}
        userEmail={userEmail}
        userMenuRef={userMenuRef}
        userName={userName}
        userPicture={userPicture}
        handleLogout={handleLogout}
        handleLogoutAll={handleLogoutAll}
      />

      <main className="ml-60 min-h-screen flex-1 px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <section className="mb-6 overflow-hidden rounded-[28px] border border-white/80 bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
            <div className="relative px-6 py-7 text-white sm:px-8">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-cyan-100">
                    <FaLock className="text-[11px]" />
                    Secure link control
                  </div>
                  <h1 className="text-3xl font-black tracking-tight">
                    Shared by me
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    Review every link you have created, copy live links, open the
                    original item, or revoke access immediately.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                    <p className="text-2xl font-black">{activeShares.length}</p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Live
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                    <p className="text-2xl font-black">{downloadShares.length}</p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Download
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                    <p className="text-2xl font-black">{shares.length}</p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Total
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/85 p-3 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center">
            <div className="flex flex-1 gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
              {filters.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`min-h-9 flex-1 rounded-lg px-3 text-xs font-bold transition-all ${
                    filter === value
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shared items"
              className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 sm:w-72"
            />
          </div>

          {message && (
            <div className="mb-5 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
              {message}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-white/80 bg-white/85 p-10 text-center text-sm font-semibold text-slate-500">
              Loading shared links...
            </div>
          ) : filteredShares.length ? (
            <div className="grid gap-4">
              {filteredShares.map((share) => {
                const status = getShareStatus(share);
                const isActive = status === "active";
                const Icon = share.targetType === "directory" ? FaFolder : FaFileAlt;

                return (
                  <article
                    key={share.id}
                    className="group rounded-3xl border border-white/80 bg-white/90 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 shadow-sm">
                          <Icon />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-base font-black text-slate-950">
                              {share.target?.name || "Deleted item"}
                            </h2>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {getStatusLabel(status)}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                            <span className="capitalize">
                              {share.targetType}
                            </span>
                            <span>{formatSize(share.target?.size || 0)}</span>
                            <span className="capitalize">
                              {share.permission === "download"
                                ? "View and download"
                                : "View only"}
                            </span>
                            <span>Expires: {formatDate(share.expiresAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        {share.shareUrl ? (
                          <button
                            type="button"
                            onClick={() => handleCopy(share)}
                            className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition-all hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                          >
                            {copiedId === share.id ? <FaCheck /> : <FaCopy />}
                            {copiedId === share.id ? "Copied" : "Copy link"}
                          </button>
                        ) : (
                          <span className="flex min-h-10 items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 text-xs font-bold text-amber-700">
                            <FaClock />
                            Older link
                          </span>
                        )}

                        {share.shareUrl && (
                          <button
                            type="button"
                            onClick={() => window.open(share.shareUrl, "_blank")}
                            className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <FaExternalLinkAlt />
                            Open link
                          </button>
                        )}

                        {share.target?.exists && (
                          <button
                            type="button"
                            onClick={() => handleOpenTarget(share)}
                            className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                          >
                            <FaLink />
                            Open item
                          </button>
                        )}

                        {isActive && (
                          <button
                            type="button"
                            onClick={() => handleRevoke(share.id)}
                            className="flex min-h-10 items-center gap-2 rounded-xl border border-red-100 bg-white px-3 text-xs font-bold text-red-600 transition-all hover:bg-red-50"
                          >
                            <FaTrashAlt />
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/80 bg-white/90 px-8 py-16 text-center shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-600">
                <FaShareAlt />
              </div>
              <h2 className="text-lg font-black text-slate-950">
                No shared links here yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Open any file or folder menu, choose Share, and created links
                will appear here for quick access.
              </p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-all hover:bg-cyan-700"
              >
                Go to My Drive
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SharedByMePage;
