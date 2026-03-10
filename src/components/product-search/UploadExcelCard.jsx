"use client";

import { useRef, useState } from "react";
import { Upload, Download, FileSpreadsheet, Loader2 } from "lucide-react";

export default function UploadExcelCard({
  onUpload,
  uploadedCodes,
  onDownloadSample,
  onPasteCodes,
  onAutoSearch,
  loading = false,
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const normalizeCodesFromResult = (result) => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.codes)) return result.codes;
    return [];
  };

  const processFile = async (file) => {
    if (!file || loading) return;

    try {
      const result = await onUpload(file);
      const parsedCodes = normalizeCodesFromResult(result);

      if (parsedCodes.length) {
        const joined = parsedCodes.join("\n");

        if (onPasteCodes) {
          onPasteCodes(joined);
        }

        if (onAutoSearch) {
          await onAutoSearch(parsedCodes);
        }
      }
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleFileChange = async (e) => {
    await processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    await processFile(file);
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items || [];

    const fileItem = Array.from(items).find(
      (item) =>
        item.type.includes("sheet") ||
        item.type.includes("csv") ||
        item.type.includes("excel")
    );

    if (fileItem) {
      const file = fileItem.getAsFile();
      await processFile(file);
      return;
    }

    const text = e.clipboardData?.getData("text");
    if (text?.trim() && onPasteCodes) {
      onPasteCodes(text);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-xl bg-neutral-100 p-2 text-neutral-700">
          <FileSpreadsheet size={18} />
        </div>

        <div>
          <h2 className="text-sm font-semibold">Excel Upload</h2>
          <p className="text-xs text-neutral-500">
            Upload, drag-drop, or paste Excel/CSV with <b>productCode</b>
          </p>
        </div>
      </div>

      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl py-8 text-center outline-none transition ${
          dragActive
            ? "bg-[#800020]/8"
            : "bg-[#f7f7f7] hover:bg-[#f1f1f1]"
        } ${loading ? "pointer-events-none opacity-70" : ""}`}
      >
        <div className="rounded-xl bg-[#800020]/10 p-3 text-[#800020]">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
        </div>

        <p className="mt-2 text-sm font-medium">
          {loading ? "Uploading & searching..." : "Upload Excel"}
        </p>
        <p className="text-xs text-neutral-500">
          Drag & drop, click, or paste from Excel
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>

      <div className="mt-3 rounded-xl bg-[#fafafa] p-3 text-xs text-neutral-600">
        Format: <b>productCode</b> column → <b>00229, 00336, 00175</b>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onDownloadSample}
          type="button"
          className="flex items-center gap-1 rounded-xl bg-black px-3 py-2 text-xs font-medium text-white hover:opacity-90"
        >
          <Download size={16} />
          Sample
        </button>

        <div className="rounded-xl bg-[#f1f1f1] px-3 py-2 text-xs font-medium">
          {uploadedCodes.length} uploaded
        </div>
      </div>
    </section>
  );
}