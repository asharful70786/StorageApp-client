import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaDownload,
  FaEdit,
  FaInfoCircle,
  FaShareAlt,
  FaTimesCircle,
  FaTrashAlt,
} from "react-icons/fa";
import { useDirectoryContext } from "../context/DirectoryContext";
/* eslint-disable react/prop-types */

const menuGap = 10;
const viewportPadding = 12;

function getInitialPosition(anchor) {
  return {
    left: anchor?.right || viewportPadding,
    top: (anchor?.bottom || viewportPadding) + menuGap,
  };
}

function getSafePosition({ anchor, menuRect }) {
  const preferLeft = (anchor?.right || 0) - menuRect.width;
  const fallbackLeft = anchor?.left || viewportPadding;
  const maxLeft = Math.max(
    viewportPadding,
    window.innerWidth - menuRect.width - viewportPadding
  );
  const left = Math.min(
    Math.max(preferLeft || fallbackLeft, viewportPadding),
    maxLeft
  );

  const openBelow = (anchor?.bottom || 0) + menuGap;
  const openAbove = (anchor?.top || 0) - menuRect.height - menuGap;
  const availableBelow = window.innerHeight - openBelow - viewportPadding;
  const shouldOpenAbove =
    availableBelow < menuRect.height && openAbove > viewportPadding;
  const maxTop = Math.max(
    viewportPadding,
    window.innerHeight - menuRect.height - viewportPadding
  );

  const top = shouldOpenAbove
    ? openAbove
    : Math.min(Math.max(openBelow, viewportPadding), maxTop);

  return { left, top };
}

function MenuAction({
  children,
  icon,
  onClick,
  tone = "default",
  title,
}) {
  const toneClass =
    tone === "danger"
      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950";

  return (
    <button
      type="button"
      className={`group flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] font-semibold transition-all ${toneClass}`}
      onClick={onClick}
      title={title}
    >
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[13px] transition-colors ${
          tone === "danger"
            ? "bg-red-50 text-red-500 group-hover:bg-red-100"
            : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  );
}

function ContextMenu({ item, anchor, isUploadingItem }) {
  const {
    handleCancelUpload,
    setDeleteItem,
    openRenameModal,
    openDetailsPopup,
    openShareModal,
    closeContextMenu,
  } = useDirectoryContext();

  const menuRef = useRef(null);
  const [position, setPosition] = useState(getInitialPosition(anchor));

  useLayoutEffect(() => {
    if (!menuRef.current) return;

    setPosition(
      getSafePosition({
        anchor,
        menuRect: menuRef.current.getBoundingClientRect(),
      })
    );
  }, [anchor]);

  function runAction(action) {
    action();
    closeContextMenu();
  }

  const menuClass =
    "fixed z-[1000] w-[218px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-2 text-sm shadow-[0_22px_56px_rgba(15,23,42,0.22)] backdrop-blur-xl";

  const divider = <div className="my-1 h-px bg-slate-100" />;

  if (isUploadingItem && item.isUploading) {
    return createPortal(
      <div
        ref={menuRef}
        className={menuClass}
        style={position}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuAction
          icon={<FaTimesCircle />}
          tone="danger"
          title="Cancel upload"
          onClick={() => runAction(() => handleCancelUpload(item.id))}
        >
          Cancel upload
        </MenuAction>
      </div>,
      document.body
    );
  }

  const commonActions = (
    <>
      <MenuAction
        icon={<FaEdit />}
        title="Rename"
        onClick={() =>
          runAction(() =>
            openRenameModal(
              item.isDirectory ? "directory" : "file",
              item.id,
              item.name
            )
          )
        }
      >
        Rename
      </MenuAction>
      <MenuAction
        icon={<FaShareAlt />}
        title="Share"
        onClick={() => runAction(() => openShareModal(item))}
      >
        Share
      </MenuAction>
      <MenuAction
        icon={<FaInfoCircle />}
        title="View details"
        onClick={() => runAction(() => openDetailsPopup(item))}
      >
        Details
      </MenuAction>
      {divider}
      <MenuAction
        icon={<FaTrashAlt />}
        tone="danger"
        title="Delete"
        onClick={() => runAction(() => setDeleteItem(item))}
      >
        Delete
      </MenuAction>
    </>
  );

  return createPortal(
    <div
      ref={menuRef}
      className={menuClass}
      style={position}
      onClick={(e) => e.stopPropagation()}
    >
      {!item.isDirectory && (
        <>
          <MenuAction
            icon={<FaDownload />}
            title="Download"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/file/${item.id}?action=download`;
              closeContextMenu();
            }}
          >
            Download
          </MenuAction>
          {divider}
        </>
      )}
      {commonActions}
    </div>,
    document.body
  );
}

export default ContextMenu;
