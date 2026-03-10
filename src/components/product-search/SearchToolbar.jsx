"use client";

import { Search, RefreshCw, Hash, ClipboardPaste } from "lucide-react";

export default function SearchToolbar({
  codesInput,
  setCodesInput,
  normalizedManualCodes,
  uploadedCodes,
  loading,
  onSearch,
  onReset,
}) {
  const activeCount = uploadedCodes.length || normalizedManualCodes.length;
  const isUploadedMode = uploadedCodes.length > 0;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-xl bg-[#800020]/10 p-2 text-[#800020]">
          <Hash size={18} />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Code Search</h2>
          <p className="text-xs text-neutral-500">
            Type, paste, or auto-fill from Excel upload
          </p>
        </div>
      </div>

      <textarea
        value={codesInput}
        onChange={(e) => setCodesInput(e.target.value)}
        placeholder={`00229\n00336\n00175`}
        className="min-h-[120px] w-full resize-none rounded-xl bg-[#f7f7f7] px-3 py-3 text-sm outline-none placeholder:text-neutral-400 focus:bg-white"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={onSearch}
          disabled={loading}
          className="flex items-center gap-1 rounded-xl bg-[#800020] px-4 py-2 text-xs font-medium text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search size={16} />
          {loading ? "Searching..." : "Search"}
        </button>

        <button
          onClick={onReset}
          disabled={loading}
          className="flex items-center gap-1 rounded-xl bg-[#f1f1f1] px-4 py-2 text-xs font-medium text-neutral-800 hover:bg-[#e9e9e9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} />
          Reset
        </button>

        <div className="inline-flex items-center gap-1 rounded-xl bg-[#fafafa] px-3 py-2 text-xs font-medium text-neutral-600">
          <ClipboardPaste size={14} />
          {activeCount} active
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-xl bg-[#fafafa] p-3">
          <div className="text-neutral-500">Codes</div>
          <div className="mt-1 break-words font-medium text-neutral-800">
            {normalizedManualCodes.length
              ? normalizedManualCodes.join(", ")
              : "—"}
          </div>
        </div>

        <div className="rounded-xl bg-[#fafafa] p-3">
          <div className="text-neutral-500">Source</div>
          <div className="mt-1 font-medium text-neutral-800">
            {isUploadedMode
              ? `${uploadedCodes.length} from upload`
              : "Typing manually"}
          </div>
        </div>
      </div>
    </section>
  );
}