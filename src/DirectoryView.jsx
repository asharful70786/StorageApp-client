import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateDirectoryModal from "./components/CreateDirectoryModal";
import RenameModal from "./components/RenameModal";
import DirectoryList from "./components/DirectoryList";
import MobileBottomNav from "./components/MobileBottomNav";
import AppSidebar from "./components/AppSidebar";
import { DirectoryContext } from "./context/DirectoryContext";
import { fetchUser, logoutAllSessions } from "./api/userApi";
import { useAuth } from "./context/AuthContext";
import {
  getDirectoryItems,
  createDirectory,
  deleteDirectory,
  renameDirectory,
} from "./api/directoryApi";
import {
  deleteFile,
  renameFile,
  uploadCancel,
  uploadComplete,
  uploadInitiate,
} from "./api/fileApi";
import DetailsPopup from "./components/DetailsPopup";
import { ShareModal } from "./components/share-modal";
import { ConfirmActionModal } from "./components/confirm-action-modal";
import {
  FaDatabase,
  FaFileAlt,
  FaFolder,
  FaFolderPlus,
  FaUpload,
} from "react-icons/fa";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

function getFileIcon(filename) {
  if (!filename) return "alt";
  const ext = filename.split(".").pop().toLowerCase();
  switch (ext) {
    case "pdf": return "pdf";
    case "png": case "jpg": case "jpeg": case "gif": return "image";
    case "mp4": case "mov": case "avi": return "video";
    case "zip": case "rar": case "tar": case "gz": return "archive";
    case "js": case "jsx": case "html": case "css": case "py": case "java": return "code";
    default: return "alt";
  }
}

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function DirectoryView() {
  const { dirId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const [userPicture, setUserPicture] = useState("");
  const [maxStorageInBytes, setMaxStorageInBytes] = useState(10 * 1024 ** 3);
  const [usedStorageInBytes, setUsedStorageInBytes] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);
  const fileInputRef = useRef(null);

  const [uploadItems, setUploadItems] = useState([]);
  const xhrRefs = useRef(new Map());

  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [shareItem, setShareItem] = useState(null);

  const openDetailsPopup = (item) => setDetailsItem(item);
  const closeDetailsPopup = () => setDetailsItem(null);
  const openShareModal = (item) => setShareItem(item);

  const usedGB = usedStorageInBytes / 1024 ** 3;
  const totalGB = maxStorageInBytes / 1024 ** 3;
  const storagePercentage = Math.min((usedGB / totalGB) * 100, 100);
  const storageHigh = storagePercentage > 90;
  const storageMid = storagePercentage > 75 && !storageHigh;

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

  useEffect(() => {
    function handleOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
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
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout all error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  const loadDirectory = useCallback(async () => {
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
  }, [dirId, navigate]);

  useEffect(() => {
    loadDirectory();
    setActiveContextMenu(null);
  }, [dirId, loadDirectory]);

  function handleRowClick(type, id) {
    if (type === "directory") {
      navigate(`/directory/${id}`);
    } else {
      window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/file/${id}`;
    }
  }

  async function handleFileSelect(e) {
    const selectedFiles = Array.from(e.target.files || []);
    e.target.value = "";
    if (!selectedFiles.length) return;

    const selectedSize = selectedFiles.reduce((total, file) => total + file.size, 0);
    const activeUploadSize = uploadItems.reduce((total, item) => total + item.size, 0);
    const remainingSpace = maxStorageInBytes - usedStorageInBytes - activeUploadSize;

    if (selectedSize > remainingSpace) {
      setErrorMessage("Not enough storage for the selected files.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const failedFiles = [];

    for (const [index, file] of selectedFiles.entries()) {
      const tempItem = {
        file, name: file.name, size: file.size,
        id: `temp-${Date.now()}-${index}`, isUploading: true, progress: 0,
      };

      try {
        const data = await uploadInitiate({
          filename: file.name, filesize: file.size,
          contentType: file.type || "application/octet-stream", parentDirId: dirId || null,
        });
        const { uploadSignedUrl, fileId } = data;
        const uploadItem = { ...tempItem, fileId };
        setFilesList((prev) => [uploadItem, ...prev]);
        setUploadItems((prev) => [uploadItem, ...prev]);
        startUpload({ item: uploadItem, uploadUrl: uploadSignedUrl, fileId });
      } catch (err) {
        failedFiles.push(file.name);
        setErrorMessage(err.response?.data?.error || "Upload initiation failed");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }

    if (failedFiles.length > 1) {
      setErrorMessage(`${failedFiles.length} files could not start uploading.`);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  function startUpload({ item, uploadUrl, fileId }) {
    const xhr = new XMLHttpRequest();
    xhrRefs.current.set(item.id, xhr);
    xhr.open("PUT", uploadUrl);

    xhr.upload.addEventListener("progress", (evt) => {
      if (evt.lengthComputable) {
        const progress = (evt.loaded / evt.total) * 100;
        setUploadItems((prev) => prev.map((u) => u.id === item.id ? { ...u, progress } : u));
        setFilesList((prev) => prev.map((f) => f.id === item.id ? { ...f, progress } : f));
      }
    });

    xhr.onload = async () => {
      let uploadCompleted = false;
      if (xhr.status === 200) {
        try {
          await uploadComplete(fileId);
          uploadCompleted = true;
        } catch (err) {
          setErrorMessage(err.response?.data?.error || "File not uploaded");
          setTimeout(() => setErrorMessage(""), 3000);
        }
      } else {
        setErrorMessage("File not uploaded");
        try { await uploadCancel(fileId); } catch { /* backend may have already removed failed upload */ }
        setTimeout(() => setErrorMessage(""), 3000);
      }
      if (uploadCompleted) setUsedStorageInBytes((prev) => prev + item.size);
      xhrRefs.current.delete(item.id);
      setUploadItems((prev) => prev.filter((u) => u.id !== item.id));
      loadDirectory();
    };

    xhr.onerror = () => {
      setErrorMessage("Something went wrong!");
      setFilesList((prev) => prev.filter((f) => f.id !== item.id));
      setUploadItems((prev) => prev.filter((u) => u.id !== item.id));
      xhrRefs.current.delete(item.id);
      setTimeout(() => setErrorMessage(""), 3000);
    };

    xhr.send(item.file);
  }

  async function handleCancelUpload(tempId) {
    const uploadItem = uploadItems.find((item) => item.id === tempId);
    const xhr = xhrRefs.current.get(tempId);
    if (xhr) { xhr.abort(); xhrRefs.current.delete(tempId); }
    const pendingFileId = uploadItem?.fileId || tempId;
    if (pendingFileId && !String(pendingFileId).startsWith("temp-")) {
      try { await uploadCancel(pendingFileId); } catch (err) {
        setErrorMessage(err.response?.data?.error || "Upload could not be cancelled.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
    setFilesList((prev) => prev.filter((f) => f.id !== tempId));
    setUploadItems((prev) => prev.filter((u) => u.id !== tempId));
  }

  async function confirmDelete(item) {
    try {
      if (item.isDirectory) await deleteDirectory(item.id);
      else await deleteFile(item.id);
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
    setRenameType(type); setRenameId(id); setRenameValue(currentName);
    setShowRenameModal(true);
  }

  async function handleRenameSubmit(e) {
    e.preventDefault();
    try {
      if (renameType === "file") await renameFile(renameId, renameValue);
      else await renameDirectory(renameId, renameValue);
      setShowRenameModal(false);
      setRenameValue(""); setRenameType(null); setRenameId(null);
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

  const combinedItems = [
    ...directoriesList.map((d) => ({ ...d, isDirectory: true })),
    ...filesList.map((f) => ({ ...f, isDirectory: false })),
  ];

  const isUploading = uploadItems.length > 0;
  const progressMap = uploadItems.reduce((map, item) => ({ ...map, [item.id]: item.progress || 0 }), {});
  const isAccessError = errorMessage === "Directory not found or you do not have access to it!";

  const filteredItems = searchQuery
    ? combinedItems.filter((i) => i.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : combinedItems;

  const folderCount = directoriesList.length;
  const fileCount = filesList.filter((f) => !f.isUploading).length;

  const ctxValue = {
    handleRowClick, activeContextMenu,
    handleContextMenu: (e, id) => {
      e.stopPropagation(); e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const isMoreButton = e.currentTarget.closest("[data-more-button]");
      const anchor = isMoreButton
        ? { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left }
        : { top: e.clientY, right: e.clientX, bottom: e.clientY, left: e.clientX };
      setActiveContextMenu((prev) => prev?.id === id ? null : { id, anchor });
    },
    getFileIcon, isUploading, progressMap, handleCancelUpload,
    setDeleteItem, openRenameModal, openDetailsPopup, openShareModal,
    closeContextMenu: () => setActiveContextMenu(null),
  };

  return (
    <DirectoryContext.Provider value={ctxValue}>
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform:translateY(16px) scale(0.95); }
          to { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes barShimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(-6px); }
          to { opacity:1; transform:translateY(0); }
        }
        .toast-in { animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .fade-in { animation: fadeIn 0.2s ease both; }
        .shimmer-bar {
          background: linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899,#3b82f6);
          background-size: 200% 100%;
          animation: barShimmer 1.8s linear infinite;
        }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
      `}</style>

      {/* ── Mobile Bottom Nav trigger ── */}
      <MobileBottomNav onUploadClick={() => fileInputRef.current?.click()} />

      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
          activeSection="drive"
          sharedCount={0}
        />
        {/* Main Content */}
        <div className="flex-1 min-h-screen flex flex-col w-full md:pl-60">
          {/* ── TOP BAR ── */}
          <header className="sticky top-0 z-30 flex md:hidden items-center justify-between gap-3 px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-semibold text-slate-600">My Drive</span>
              {dirId && (
                <>
                  <ChevronRight />
                  <span className="truncate text-sm font-bold text-slate-900">{directoryName}</span>
                </>
              )}
            </div>

            <button
              onClick={() => setShowUserMenu((p) => !p)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm"
            >
              {userPicture ? (
                <img src={userPicture} alt={userName} className="h-full w-full rounded-xl object-cover" />
              ) : (
                <span className="text-sm font-bold">{userName.charAt(0)}</span>
              )}
            </button>
          </header>

          {/* Desktop Header */}
          <header className="hidden md:flex sticky top-0 z-30 min-h-[72px] items-center justify-between gap-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl px-6 lg:px-8 shadow-sm">
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-transparent text-slate-500 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-900"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className="font-semibold flex-shrink-0">My Drive</span>
              {dirId && (
                <>
                  <ChevronRight />
                  <span className="truncate font-bold text-slate-800">{directoryName}</span>
                </>
              )}
            </div>

            <div className="flex flex-shrink-0 items-center gap-2.5">
              <button
                onClick={() => setShowCreateDirModal(true)}
                disabled={isAccessError}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaFolderPlus className="text-xs" />
                <span className="hidden sm:inline">New Folder</span>
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="flex min-h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 hover:shadow-md"
                title="Settings"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAccessError}
                className="flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaUpload className="text-xs" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </header>

          {/* ── PAGE CONTENT ── */}
          <main className="flex-1 px-4 md:px-6 lg:px-8 py-5 md:py-7 pb-24 md:pb-10">
            {errorMessage && !isAccessError && (
              <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 fade-in">
                <AlertIcon /> {errorMessage}
              </div>
            )}

            {/* ── STATS STRIP ── */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {[
                { icon: FaFolder, label: "Folders", value: folderCount, bg: "from-blue-50 to-white border-blue-100/80", iconBg: "bg-blue-600 text-white" },
                { icon: FaFileAlt, label: "Files", value: fileCount, bg: "from-violet-50 to-white border-violet-100/80", iconBg: "bg-violet-600 text-white" },
                { icon: FaDatabase, label: "Storage", value: `${usedGB.toFixed(2)} GB`, bg: storageHigh ? "from-red-50 to-white border-red-100/80" : "from-emerald-50 to-white border-emerald-100/80", iconBg: storageHigh ? "bg-red-600 text-white" : "bg-emerald-600 text-white" },
              ].map((s) => {
                const StatIcon = s.icon;
                return (
                  <div key={s.label} className={`flex items-center gap-3 md:gap-4 rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${s.bg}`}>
                    <div className={`flex h-10 w-10 md:h-11 md:w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm md:text-base shadow-sm ${s.iconBg}`}>
                      <StatIcon />
                    </div>
                    <div>
                      <p className="text-lg md:text-xl font-bold tracking-tight text-slate-900">{s.value}</p>
                      <p className="text-xs md:text-sm font-medium text-slate-400">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── SEARCH + COUNT ── */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xs md:max-w-sm">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <SearchIcon />
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files…"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <p className="shrink-0 text-xs md:text-sm font-medium text-slate-400">
                {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* ── FILE LIST ── */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
              {/* Desktop table header */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_80px] border-b border-slate-100 bg-slate-50/80 px-5 py-3">
                {["Name", "Type", "Size", ""].map((h, i) => (
                  <span key={i} className={`text-[10.5px] font-bold uppercase tracking-[0.08em] text-slate-400 ${i === 3 ? "text-right" : ""}`}>{h}</span>
                ))}
              </div>

              {filteredItems.length === 0 ? (
                isAccessError ? (
                  <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-6">
                    <div className="mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500">
                      <AlertIcon />
                    </div>
                    <p className="text-base font-bold text-slate-700 mb-1">Access denied</p>
                    <p className="max-w-xs text-sm text-slate-400">You don&apos;t have permission to view this directory.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-6">
                    <div className="mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                      {searchQuery ? <SearchIcon /> : <FaFolder />}
                    </div>
                    <p className="text-base font-bold text-slate-700 mb-1">
                      {searchQuery ? "No results found" : "This folder is empty"}
                    </p>
                    <p className="max-w-sm text-sm text-slate-400 mb-6">
                      {searchQuery ? `Nothing matches "${searchQuery}"` : "Upload files or create folders to get started."}
                    </p>
                    {!searchQuery && !isAccessError && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                      >
                        <FaUpload className="text-xs" />
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

      {/* Modals */}
      {showCreateDirModal && (
        <CreateDirectoryModal newDirname={newDirname} setNewDirname={setNewDirname} onClose={() => setShowCreateDirModal(false)} onCreateDirectory={handleCreateDirectory} />
      )}
      {showRenameModal && (
        <RenameModal renameType={renameType} renameValue={renameValue} setRenameValue={setRenameValue} onClose={() => setShowRenameModal(false)} onRenameSubmit={handleRenameSubmit} />
      )}
      {detailsItem && <DetailsPopup item={detailsItem} onClose={closeDetailsPopup} />}
      {shareItem && <ShareModal item={shareItem} onClose={() => setShareItem(null)} />}
      <ConfirmActionModal
        isOpen={Boolean(deleteItem)}
        tone="danger"
        title="Delete item?"
        description={
          deleteItem ? (
            <>
              This will permanently delete{" "}
              <span className="font-semibold text-slate-800">
                &quot;{deleteItem.name}&quot;
              </span>{" "}
              {deleteItem.isDirectory ? "folder" : "file"} from your storage.
            </>
          ) : null
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => setDeleteItem(null)}
        onConfirm={() => deleteItem && confirmDelete(deleteItem)}
      />

      <input type="file" ref={fileInputRef} multiple onChange={handleFileSelect} className="hidden" />

      {/* Upload Toast */}
      {uploadItems.length > 0 && (
        <div className="toast-in fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[9999] w-[340px] md:w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f14] shadow-2xl">
          <div className="shimmer-bar h-[3px]" />
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Uploading {uploadItems.length} file{uploadItems.length !== 1 ? "s" : ""}</p>
              <p className="text-xs font-medium text-white/40">{formatBytes(uploadItems.reduce((total, item) => total + item.size, 0))}</p>
            </div>
            <div className="max-h-[260px] space-y-3 overflow-y-auto pr-1">
              {uploadItems.map((uploadItem) => (
                <div key={uploadItem.id}>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/70">
                        <FaFileAlt />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{uploadItem.name}</p>
                        <p className="text-xs text-white/30">{formatBytes(uploadItem.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelUpload(uploadItem.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.05] text-white/40 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >×</button>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <div className="shimmer-bar h-full rounded-full transition-[width_0.3s_ease]" style={{ width: `${Math.round(uploadItem.progress || 0)}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/30">
                      {Math.round(uploadItem.progress || 0) >= 100 ? "Processing…" : "Uploading…"}
                    </span>
                    <span className="font-mono text-xs font-semibold text-blue-400">{Math.round(uploadItem.progress || 0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DirectoryContext.Provider>
  );
}

export default DirectoryView;
