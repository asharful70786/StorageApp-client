import { Link, useLocation } from "react-router-dom";
import { FaHome, FaShareAlt, FaUpload, FaUser } from "react-icons/fa";

function MobileBottomNav({ onUploadClick }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || (path === "/" && location.pathname.startsWith("/directory"));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-slate-200 px-2 pb-safe">
      <div className="flex items-center justify-around h-16">
        {/* My Drive */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors ${
            isActive("/") ? "text-blue-600" : "text-slate-400"
          }`}
        >
          <FaHome className="text-xl" />
          <span className="text-[10px] font-semibold">Drive</span>
        </Link>

        {/* Shared */}
        <Link
          to="/shared"
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors ${
            isActive("/shared") ? "text-blue-600" : "text-slate-400"
          }`}
        >
          <FaShareAlt className="text-lg" />
          <span className="text-[10px] font-semibold">Shared</span>
        </Link>

        {/* Upload FAB */}
        <button
          onClick={onUploadClick}
          className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40 active:scale-95 transition-transform"
          aria-label="Upload files"
        >
          <FaUpload className="text-lg" />
        </button>

        {/* Settings */}
        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors ${
            isActive("/settings") ? "text-blue-600" : "text-slate-400"
          }`}
        >
          <FaUser className="text-lg" />
          <span className="text-[10px] font-semibold">Settings</span>
        </Link>
      </div>
    </nav>
  );
}

export default MobileBottomNav;