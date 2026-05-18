import { Link } from "react-router-dom";
import {
  FaUser, FaSignOutAlt, FaCrown, FaCloud, FaFolder, FaCog, FaHdd, FaShareAlt,
} from "react-icons/fa";

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function AppSidebar({
  combinedItems,
  storageHigh,
  storageMid,
  usedGB,
  totalGB,
  storagePercentage,
  userMenuRef,
  showUserMenu,
  setShowUserMenu,
  userPicture,
  userName,
  userEmail,
  loggedIn,
  handleLogout,
  handleLogoutAll,
  navigate,
  activeSection = "drive",
  sharedCount = 0,
}) {
  const storageBarColor = storageHigh
    ? "bg-red-500"
    : storageMid
    ? "bg-amber-400"
    : "bg-gradient-to-r from-blue-500 to-violet-500";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-slate-200/60 bg-white shadow-xl">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-slate-200/60 px-5 py-[18px]">
        <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20">
          <FaCloud className="text-white text-sm" />
        </div>
        <div>
          <p className="text-[14.5px] font-bold leading-none tracking-tight text-slate-900">CloudStorage</p>
          <p className="mt-1 text-[11px] text-slate-400">Secure file storage</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Storage</p>

        <Link
          to="/"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
            activeSection === "drive"
              ? "bg-blue-50 border border-blue-200 text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <FaFolder className={`flex-shrink-0 text-base ${activeSection === "drive" ? "text-blue-500" : "text-slate-400"}`} />
          <span className={`flex-1 text-sm font-medium ${activeSection === "drive" ? "font-semibold" : ""}`}>My Drive</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            {combinedItems.length}
          </span>
        </Link>

        <Link
          to="/shared"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
            activeSection === "shared"
              ? "bg-cyan-50 border border-cyan-200 text-cyan-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <FaShareAlt className={`flex-shrink-0 text-base ${activeSection === "shared" ? "text-cyan-500" : "text-slate-400"}`} />
          <span className="flex-1 text-sm font-medium">Shared by me</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            activeSection === "shared" ? "bg-cyan-100 text-cyan-600" : "bg-slate-100 text-slate-500"
          }`}>
            {sharedCount}
          </span>
        </Link>
      </nav>

      {/* Bottom section */}
      <div className="space-y-1 border-t border-slate-200/60 px-3 py-4">
        {/* Storage */}
        <div className="mb-2 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FaHdd className="text-[11px] text-slate-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Storage</span>
            </div>
            {storageHigh && (
              <span className="text-[9px] font-bold uppercase tracking-wide text-red-500">Full soon</span>
            )}
          </div>

          <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ${storageBarColor}`}
              style={{ width: `${Math.max(storagePercentage, 2)}%` }}
            />
          </div>

          <div className="flex items-baseline justify-between">
            <span className={`text-sm font-bold ${storageHigh ? "text-red-500" : storageMid ? "text-amber-500" : "text-slate-700"}`}>
              {usedGB.toFixed(2)} GB
            </span>
            <span className="text-xs text-slate-400">of {totalGB.toFixed(0)} GB</span>
          </div>
        </div>

        {/* Plans link */}
        <Link
          to="/plans"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
        >
          <FaCog className="text-sm text-slate-400" />
          Settings
        </Link>

        {/* User */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((p) => !p)}
            className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all ${
              showUserMenu
                ? "border-slate-200 bg-slate-50 shadow-sm"
                : "border-transparent hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
              {userPicture ? (
                <img src={userPicture} alt={userName} className="h-full w-full object-cover" />
              ) : (
                <FaUser className="text-xs text-white" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-none text-slate-900">{userName}</p>
              <p className="mt-1 truncate text-[10.5px] text-slate-400">{userEmail}</p>
            </div>

            <ChevronRight />
          </button>

          {showUserMenu && (
            <div className="fade-in absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              {loggedIn ? (
                <>
                  <div className="border-b border-slate-100 p-4">
                    <div className="mb-3.5 flex items-center gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                        {userPicture ? (
                          <img src={userPicture} alt={userName} className="h-full w-full object-cover" />
                        ) : (
                          <FaUser className="text-base text-white" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{userName}</p>
                        <p className="truncate text-xs text-slate-500">{userEmail}</p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Storage used</span>
                        <span className="text-xs font-semibold text-slate-800">{usedGB.toFixed(2)} GB / {totalGB.toFixed(0)} GB</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full transition-all ${storageBarColor}`} style={{ width: `${Math.max(storagePercentage, 2)}%` }} />
                      </div>
                      {storageHigh && <p className="mt-1 text-xs font-medium text-red-500">Storage almost full</p>}
                    </div>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to="/plans"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                        <FaCrown className="text-xs text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Upgrade Storage</p>
                        <p className="text-xs text-slate-500">Get more space and features</p>
                      </div>
                    </Link>

                    <div className="h-px bg-slate-100 my-1.5" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                        <FaSignOutAlt className="text-sm text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Logout</p>
                        <p className="text-xs text-slate-500">Sign out from this device</p>
                      </div>
                    </button>

                    <button
                      onClick={handleLogoutAll}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                        <FaSignOutAlt className="text-sm text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Logout All Sessions</p>
                        <p className="text-xs text-slate-500">Sign out from all devices</p>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-5 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <FaUser className="text-xl text-slate-400" />
                  </div>
                  <p className="mb-1 text-sm font-bold text-slate-900">Guest User</p>
                  <p className="mb-4 text-xs text-slate-500">Sign in to access your files</p>
                  <button
                    onClick={() => { navigate("/login"); setShowUserMenu(false); }}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;