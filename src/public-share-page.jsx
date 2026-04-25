import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  FaCloud,
  FaDownload,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFolder,
} from "react-icons/fa";
import { getPublicShare } from "./api/share-api";
import { formatSize } from "./components/DetailsPopup";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

function getPublicFileUrl(token, fileId, download = false) {
  const action = download ? "?action=download" : "";
  return `${BACKEND_BASE_URL}/public-shares/${token}/files/${fileId}${action}`;
}

function PublicSharePage() {
  const { token } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [shareData, setShareData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const currentDirId = searchParams.get("dirId") || "";

  useEffect(() => {
    async function loadShare() {
      try {
        setLoading(true);
        const data = await getPublicShare(token, currentDirId);
        setShareData(data);
        setErrorMessage("");
      } catch (err) {
        setErrorMessage(
          err.response?.data?.error || "This share link could not be opened."
        );
      } finally {
        setLoading(false);
      }
    }

    loadShare();
  }, [token, currentDirId]);

  function openDirectory(dirId) {
    setSearchParams({ dirId });
  }

  function goToRoot() {
    setSearchParams({});
  }

  function renderFileShare() {
    const { file, permission } = shareData;

    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-white/80 bg-white/90 p-7 text-center shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <FaFileAlt className="text-2xl" />
        </div>
        <h1 className="break-words text-2xl font-bold tracking-tight text-slate-950">
          {file.name}
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          {formatSize(file.size)}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={getPublicFileUrl(token, file.id)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-colors hover:bg-blue-700"
          >
            <FaExternalLinkAlt className="text-xs" />
            Open file
          </a>
          {permission === "download" && file.canDownload && (
            <a
              href={getPublicFileUrl(token, file.id, true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <FaDownload className="text-xs" />
              Download
            </a>
          )}
        </div>
      </div>
    );
  }

  function renderDirectoryShare() {
    const { directory, directories = [], files = [], permission } = shareData;
    const itemsCount = directories.length + files.length;
    const isRoot = directory.id === directory.rootId;

    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <button
              onClick={goToRoot}
              disabled={isRoot}
              className="mb-2 text-sm font-semibold text-blue-600 disabled:cursor-default disabled:text-slate-400"
            >
              Shared folder
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {directory.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {itemsCount} item{itemsCount !== 1 ? "s" : ""} -{" "}
              {formatSize(directory.size)}
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            {permission === "download" ? "Downloads enabled" : "View only"}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
          {itemsCount ? (
            <>
              <div className="grid grid-cols-[2fr_1fr_130px] border-b border-slate-100 bg-slate-50/80 px-5 py-3">
                {["Name", "Size", ""].map((heading) => (
                  <span
                    key={heading}
                    className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-slate-400"
                  >
                    {heading}
                  </span>
                ))}
              </div>

              {directories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openDirectory(item.id)}
                  className="grid w-full grid-cols-[2fr_1fr_130px] items-center border-b border-slate-100 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-blue-50 text-blue-500 shadow-sm">
                      <FaFolder />
                    </span>
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {item.name}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {formatSize(item.size)}
                  </span>
                  <span className="text-right text-xs font-bold text-blue-600">
                    Open
                  </span>
                </button>
              ))}

              {files.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[2fr_1fr_130px] items-center border-b border-slate-100 px-5 py-4 last:border-b-0"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500 shadow-sm">
                      <FaFileAlt />
                    </span>
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {item.name}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {formatSize(item.size)}
                  </span>
                  <span className="flex justify-end gap-2">
                    <a
                      href={getPublicFileUrl(token, item.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      Open
                    </a>
                    {permission === "download" && item.canDownload && (
                      <a
                        href={getPublicFileUrl(token, item.id, true)}
                        className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                      >
                        Save
                      </a>
                    )}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <FaFolder />
              </div>
              <p className="text-sm font-bold text-slate-700">
                This shared folder is empty
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff_0,#eef3f8_34%,#e8edf4_100%)] px-5 py-8">
      <header className="mx-auto mb-8 flex max-w-5xl items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_14px_32px_rgba(59,130,246,0.32)]">
          <FaCloud />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-950">CloudStorage</p>
          <p className="text-xs font-medium text-slate-500">Secure share link</p>
        </div>
      </header>

      {loading ? (
        <div className="mx-auto max-w-xl rounded-3xl border border-white/80 bg-white/90 p-8 text-center text-sm font-semibold text-slate-500 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
          Opening shared item...
        </div>
      ) : errorMessage ? (
        <div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
          <h1 className="text-xl font-bold text-slate-950">Link unavailable</h1>
          <p className="mt-2 text-sm font-medium text-red-500">
            {errorMessage}
          </p>
        </div>
      ) : shareData?.targetType === "file" ? (
        renderFileShare()
      ) : (
        renderDirectoryShare()
      )}
    </div>
  );
}

export default PublicSharePage;
