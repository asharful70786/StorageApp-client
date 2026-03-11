import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateDirectoryModal from "./components/CreateDirectoryModal";
import RenameModal from "./components/RenameModal";
import DirectoryList from "./components/DirectoryList";
import AppSidebar from "./components/AppSidebar";
import { DirectoryContext } from "./context/DirectoryContext";
import { fetchUser, logoutUser, logoutAllSessions } from "./api/userApi";
import {
  getDirectoryItems,
  createDirectory,
  deleteDirectory,
  renameDirectory,
} from "./api/directoryApi";
import {
  deleteFile,
  renameFile,
  uploadComplete,
  uploadInitiate,
} from "./api/fileApi";
import DetailsPopup from "./components/DetailsPopup";
import ConfirmDeleteModal from "./components/ConfirmDeleteModel";
import { FaFolderPlus, FaUpload } from "react-icons/fa";

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getFileIcon(filename) {
  if (!filename) return "📎";
  const ext = filename.split(".").pop().toLowerCase();

  switch (ext) {
    case "pdf":
      return "📄";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return "🖼️";
    case "mp4":
    case "mov":
    case "avi":
      return "🎬";
    case "zip":
    case "rar":
    case "tar":
    case "gz":
      return "📦";
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "html":
    case "css":
    case "py":
    case "java":
      return "💻";
    default:
      return "📎";
  }
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const ChevronRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

function DirectoryView() {
  const { dirId } = useParams();
  const navigate = useNavigate();

  // ── Directory state ────────────────────────────────────────────────────────
  const [directoryName, setDirectoryName] = useState("My Drive");
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [newDirname, setNewDirname] = useState("New Folder");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameType, setRenameType] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ── User / storage state ───────────────────────────────────────────────────
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const [userPicture, setUserPicture] = useState("");
  const [maxStorageInBytes, setMaxStorageInBytes] = useState(10 * 1024 ** 3);
  const [usedStorageInBytes, setUsedStorageInBytes] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);
  const fileInputRef = useRef(null);

  // ── Upload state ───────────────────────────────────────────────────────────
  const [uploadItem, setUploadItem] = useState(null);
  const xhrRef = useRef(null);

  // ── Context menu / modals ─────────────────────────────────────────────────
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const openDetailsPopup = (item) => setDetailsItem(item);
  const closeDetailsPopup = () => setDetailsItem(null);

  // ── Derived storage values ─────────────────────────────────────────────────
  const usedGB = usedStorageInBytes / 1024 ** 3;
  const totalGB = maxStorageInBytes / 1024 ** 3;
  const storagePercentage = Math.min((usedGB / totalGB) * 100, 100);
  const storageHigh = storagePercentage > 90;
  const storageMid = storagePercentage > 75 && !storageHigh;

  // ── Load user ──────────────────────────────────────────────────────────────
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
      }
    }

    loadUser();
  }, []);

  // ── Close user menu on outside click ──────────────────────────────────────
  useEffect(() => {
    function handleOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ── Logout handlers ────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllSessions();
      navigate("/login");
    } catch (err) {
      console.error("Logout all error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  // ── Load directory ─────────────────────────────────────────────────────────
  const loadDirectory = async () => {
    try {
      const data = await getDirectoryItems(dirId);
      setDirectoryName(dirId ? data.name : "My Drive");
      setDirectoriesList([...data.directories].reverse());
      setFilesList([...data.files].reverse());
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setErrorMessage(err.response?.data?.error || err.message);
      }
    }
  };

  useEffect(() => {
    loadDirectory();
    setActiveContextMenu(null);
  }, [dirId]);

  // ── File/directory handlers ────────────────────────────────────────────────
  function handleRowClick(type, id) {
    if (type === "directory") {
      navigate(`/directory/${id}`);
    } else {
      window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/file/${id}`;
    }
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadItem?.isUploading) {
      setErrorMessage("An upload is already in progress. Please wait.");
      setTimeout(() => setErrorMessage(""), 3000);
      e.target.value = "";
      return;
    }

    const tempItem = {
      file,
      name: file.name,
      size: file.size,
      id: `temp-${Date.now()}`,
      isUploading: true,
      progress: 0,
    };

    try {
      const data = await uploadInitiate({
        name: file.name,
        size: file.size,
        contentType: file.type,
        parentDirId: dirId,
      });

      const { uploadSignedUrl, fileId } = data;

      setFilesList((prev) => [tempItem, ...prev]);
      setUploadItem(tempItem);
      e.target.value = "";

      startUpload({
        item: tempItem,
        uploadUrl: uploadSignedUrl,
        fileId,
      });
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Upload initiation failed");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  function startUpload({ item, uploadUrl, fileId }) {
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.open("PUT", uploadUrl);

    xhr.upload.addEventListener("progress", (evt) => {
      if (evt.lengthComputable) {
        const progress = (evt.loaded / evt.total) * 100;
        setUploadItem((prev) => (prev ? { ...prev, progress } : prev));
      }
    });

    xhr.onload = async () => {
      if (xhr.status === 200) {
        await uploadComplete(fileId);
      } else {
        setErrorMessage("File not uploaded");
        setTimeout(() => setErrorMessage(""), 3000);
      }

      setUploadItem(null);
      loadDirectory();
    };

    xhr.onerror = () => {
      setErrorMessage("Something went wrong!");
      setFilesList((prev) => prev.filter((f) => f.id !== item.id));
      setUploadItem(null);
      setTimeout(() => setErrorMessage(""), 3000);
    };

    xhr.send(item.file);
  }

  function handleCancelUpload(tempId) {
    if (uploadItem && uploadItem.id === tempId && xhrRef.current) {
      xhrRef.current.abort();
    }

    setFilesList((prev) => prev.filter((f) => f.id !== tempId));
    setUploadItem(null);
  }

  async function confirmDelete(item) {
    try {
      if (item.isDirectory) {
        await deleteDirectory(item.id);
      } else {
        await deleteFile(item.id);
      }

      setDeleteItem(null);
      loadDirectory();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
    }
  }

  async function handleCreateDirectory(e) {
    e.preventDefault();

    try {
      await createDirectory(dirId, newDirname);
      setNewDirname("New Folder");
      setShowCreateDirModal(false);
      loadDirectory();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
    }
  }

  function openRenameModal(type, id, currentName) {
    setRenameType(type);
    setRenameId(id);
    setRenameValue(currentName);
    setShowRenameModal(true);
  }

  async function handleRenameSubmit(e) {
    e.preventDefault();

    try {
      if (renameType === "file") {
        await renameFile(renameId, renameValue);
      } else {
        await renameDirectory(renameId, renameValue);
      }

      setShowRenameModal(false);
      setRenameValue("");
      setRenameType(null);
      setRenameId(null);
      loadDirectory();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
    }
  }

  useEffect(() => {
    const fn = () => setActiveContextMenu(null);
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const combinedItems = [
    ...directoriesList.map((d) => ({ ...d, isDirectory: true })),
    ...filesList.map((f) => ({ ...f, isDirectory: false })),
  ];

  const isUploading = !!uploadItem?.isUploading;
  const progressMap = uploadItem
    ? { [uploadItem.id]: uploadItem.progress || 0 }
    : {};
  const isAccessError =
    errorMessage === "Directory not found or you do not have access to it!";

  const filteredItems = searchQuery
    ? combinedItems.filter((i) =>
        i.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : combinedItems;

  const folderCount = directoriesList.length;
  const fileCount = filesList.filter((f) => !f.isUploading).length;

  const ctxValue = {
    handleRowClick,
    activeContextMenu,
    handleContextMenu: (e, id) => {
      e.stopPropagation();
      e.preventDefault();
      setActiveContextMenu((prev) => (prev === id ? null : id));
    },
    getFileIcon,
    isUploading,
    progressMap,
    handleCancelUpload,
    setDeleteItem,
    openRenameModal,
    openDetailsPopup,
  };

  return (
    <DirectoryContext.Provider value={ctxValue} >
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform:translateY(16px) scale(0.95); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes barShimmer {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .toast-in {
          animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .fade-in {
          animation: fadeIn 0.2s ease both;
        }
        .shimmer-bar {
          background: linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899,#3b82f6);
          background-size: 200% 100%;
          animation: barShimmer 1.8s linear infinite;
        }
      `}</style>

      <div className="flex min-h-screen bg-[#f0f2f6]">
        <AppSidebar
          combinedItems={combinedItems}
          storageHigh={storageHigh}
          storageMid={storageMid}
          usedGB={usedGB}
          totalGB={totalGB}
          storagePercentage={storagePercentage}
          userMenuRef={userMenuRef}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
          userPicture={userPicture}
          userName={userName}
          userEmail={userEmail}
          loggedIn={loggedIn}
          handleLogout={handleLogout}
          handleLogoutAll={handleLogoutAll}
          navigate={navigate}
        />

        <div className="ml-60 flex flex-1 flex-col min-h-screen">
          {/* ── TOP BAR ── */}
          <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between gap-4 border-b border-[#e4e7ec] bg-[#f0f2f6]/90 px-8 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-slate-400 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-black/[0.06] transition-colors text-slate-500 flex-shrink-0"
                title="Go back"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <span className="text-slate-500 font-semibold flex-shrink-0">
                My Drive
              </span>

              {dirId && (
                <>
                  <ChevronRight />
                  <span className="truncate font-bold text-slate-800">
                    {directoryName}
                  </span>
                </>
              )}
            </div>
            {/* // adjust here the update NAvbAr and folder   */}
            <div className="flex items-center gap-2.5 flex-shrink-0 mt-60">
              <button
                onClick={() => setShowCreateDirModal(true)}
                disabled={isAccessError}
                className="flex items-center gap-2 rounded-xl border border-[#dde1e8] bg-white px-4 py-[9px] text-[13px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <FaFolderPlus className="text-[12px]" />
                New Folder
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAccessError}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-[9px] text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(37,99,235,0.32)] hover:bg-blue-700 hover:shadow-[0_4px_16px_rgba(37,99,235,0.42)] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <FaUpload className="text-[11px]" />
                Upload
              </button>
            </div>
          </header>

          {/* ── PAGE CONTENT ── */}
          <main className="flex-1 px-8 py-7">
            {errorMessage && !isAccessError && (
              <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600 fade-in">
                <AlertIcon /> {errorMessage}
              </div>
            )}

            {/* ── STATS STRIP ── */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              {[
                {
                  icon: "🗂️",
                  label: "Folders",
                  value: folderCount,
                  bg: "bg-blue-50 border-blue-100",
                  iconBg: "bg-blue-100",
                  val: "text-blue-700",
                },
                {
                  icon: "📎",
                  label: "Files",
                  value: fileCount,
                  bg: "bg-violet-50 border-violet-100",
                  iconBg: "bg-violet-100",
                  val: "text-violet-700",
                },
                {
                  icon: "💾",
                  label: "Space used",
                  value: `${usedGB.toFixed(2)} GB`,
                  bg: storageHigh
                    ? "bg-red-50 border-red-100"
                    : "bg-emerald-50 border-emerald-100",
                  iconBg: storageHigh ? "bg-red-100" : "bg-emerald-100",
                  val: storageHigh ? "text-red-700" : "text-emerald-700",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${s.bg}`}
                >
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl ${s.iconBg}`}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p
                      className={`text-[22px] font-bold tracking-tight leading-none ${s.val}`}
                    >
                      {s.value}
                    </p>
                    <p className="mt-1 text-[12px] font-medium text-slate-400">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── SEARCH + COUNT ── */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="relative max-w-xs flex-1">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <SearchIcon />
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files and folders…"
                  className="w-full rounded-xl border border-[#dde1e8] bg-white py-2.5 pl-10 pr-4 text-[13px] text-slate-700 shadow-sm placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <p className="shrink-0 text-[12px] font-medium text-slate-400">
                {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* ── FILE LIST CARD ── */}
          <div className="rounded-2xl border border-[#e4e7ec] bg-white shadow-sm">


              {filteredItems.length > 0 && (
                <div className="grid grid-cols-[2fr_1fr_1fr_80px] border-b border-[#f0f2f5] bg-[#f8f9fb] px-5 py-2.5">
                  {["Name", "Type", "Size", ""].map((h, i) => (
                    <span
                      key={i}
                      className={`text-[10.5px] font-bold uppercase tracking-[0.08em] text-slate-400 ${
                        i === 3 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {filteredItems.length === 0 ? (
                isAccessError ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <div className="relative mb-5 h-20 w-20 flex items-center justify-center">
                      <div className="absolute inset-0 animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-slate-200" />
                      <div className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-3xl">
                        🚫
                      </div>
                    </div>
                    <p className="text-[15px] font-bold text-slate-700 mb-1">
                      Access denied
                    </p>
                    <p className="max-w-[220px] text-[13px] leading-relaxed text-slate-400">
                      You don't have permission to view this directory.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <div className="relative mb-5 h-20 w-20 flex items-center justify-center">
                      <div className="absolute inset-0 animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-slate-200" />
                      <div className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-3xl">
                        {searchQuery ? "🔍" : "📁"}
                      </div>
                    </div>

                    <p className="text-[15px] font-bold text-slate-700 mb-1">
                      {searchQuery ? "No results found" : "This folder is empty"}
                    </p>

                    <p className="max-w-[240px] text-[13px] leading-relaxed text-slate-400 mb-6">
                      {searchQuery
                        ? `Nothing matches "${searchQuery}"`
                        : "Upload files or create folders to get started."}
                    </p>

                    {!searchQuery && !isAccessError && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_2px_10px_rgba(37,99,235,0.28)] hover:bg-blue-700 transition-all active:scale-[0.98]"
                      >
                        <FaUpload className="text-[11px]" />
                        Upload your first file
                      </button>
                    )}
                  </div>
                )
              ) : (
                <DirectoryList items={filteredItems} />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* ─═══ MODALS ════ */}
      {showCreateDirModal && (
        <CreateDirectoryModal
          newDirname={newDirname}
          setNewDirname={setNewDirname}
          onClose={() => setShowCreateDirModal(false)}
          onCreateDirectory={handleCreateDirectory}
        />
      )}

      {showRenameModal && (
        <RenameModal
          renameType={renameType}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          onClose={() => setShowRenameModal(false)}
          onRenameSubmit={handleRenameSubmit}
        />
      )}

      {detailsItem && (
        <DetailsPopup item={detailsItem} onClose={closeDetailsPopup} />
      )}

      {deleteItem && (
        <ConfirmDeleteModal
          item={deleteItem}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteItem(null)}
        />
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ─═══ UPLOAD TOAST ════ */}
      {uploadItem && (
        <div className="toast-in fixed bottom-6 right-6 z-[9999] w-[336px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f14] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="shimmer-bar h-[3px]" />

          <div className="p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-[15px]">
                  {getFileIcon(uploadItem.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-white">
                    {uploadItem.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/30">
                    {formatBytes(uploadItem.size)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCancelUpload(uploadItem.id)}
                title="Cancel"
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.05] text-[17px] text-white/40 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-all"
              >
                ×
              </button>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="shimmer-bar h-full rounded-full transition-[width_0.3s_ease]"
                style={{ width: `${Math.round(uploadItem.progress || 0)}%` }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[11.5px] font-medium text-white/30">
                {Math.round(uploadItem.progress || 0) >= 100
                  ? "Processing…"
                  : "Uploading…"}
              </span>
              <span className="font-mono text-[12px] font-semibold text-blue-400">
                {Math.round(uploadItem.progress || 0)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </DirectoryContext.Provider>
  );
}

export default DirectoryView;