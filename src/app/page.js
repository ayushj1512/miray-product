"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  PackageSearch,
  Download,
  FileSpreadsheet,
  Search,
  AlertCircle,
} from "lucide-react";

import { useProductStore } from "@/app/store/productStore";
import SearchToolbar from "@/components/product-search/SearchToolbar";
import UploadExcelCard from "@/components/product-search/UploadExcelCard";
import ProductTable from "@/components/product-search/ProductTable";
import ImageLightbox from "@/components/product-search/ImageLightbox";

const BRAND = "#800020";

const normalizeCode = (value) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.slice(-5).padStart(5, "0");
};

const sampleRows = [["productCode"], ["00229"], ["00336"], ["00175"], ["00019"]];

const readCodesFromFile = async (file) => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  return [...new Set(rows.flat().map(normalizeCode).filter(Boolean))];
};

export default function Page() {
  const { products = [], loading, error, getProductsByCodes } = useProductStore();

  const [codesInput, setCodesInput] = useState("");
  const [uploadedCodes, setUploadedCodes] = useState([]);
  const [lastSearchedCodes, setLastSearchedCodes] = useState([]);
  const [localError, setLocalError] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const normalizedManualCodes = useMemo(() => {
    return [
      ...new Set(
        String(codesInput)
          .split(/[\n,\s]+/)
          .map(normalizeCode)
          .filter(Boolean)
      ),
    ];
  }, [codesInput]);

  const activeCodes = uploadedCodes.length ? uploadedCodes : normalizedManualCodes;

  const runSearch = async (codes) => {
    try {
      setLocalError("");

      if (!codes?.length) {
        setLocalError("Please enter product codes or upload an Excel file.");
        return;
      }

      setLastSearchedCodes(codes);
      await getProductsByCodes(codes);
    } catch (e) {
      setLocalError(e?.message || "Failed to fetch products.");
    }
  };

  const handleSearch = async () => {
    await runSearch(activeCodes);
  };

  const handleReset = () => {
    setCodesInput("");
    setUploadedCodes([]);
    setLastSearchedCodes([]);
    setLocalError("");
  };

  const handleFileUpload = async (file) => {
    try {
      setLocalError("");

      const codes = await readCodesFromFile(file);

      if (!codes.length) {
        setUploadedCodes([]);
        setLocalError("No valid product codes found in the uploaded file.");
        return { codes: [] };
      }

      setUploadedCodes(codes);
      setCodesInput(codes.join("\n"));

      return { codes };
    } catch {
      setUploadedCodes([]);
      setLocalError("Could not read the Excel file. Please use the sample format.");
      return { codes: [] };
    }
  };

  const handleAutoSearch = async (codesFromUpload = []) => {
    const normalized = [
      ...new Set((codesFromUpload || []).map(normalizeCode).filter(Boolean)),
    ];

    if (!normalized.length) return;
    await runSearch(normalized);
  };

  const handlePasteCodes = (text) => {
    const parsed = [
      ...new Set(
        String(text || "")
          .split(/[\n,\s]+/)
          .map(normalizeCode)
          .filter(Boolean)
      ),
    ];

    setUploadedCodes([]);
    setCodesInput(parsed.join("\n"));
    setLocalError("");
  };

  const handleDownloadSample = () => {
    const ws = XLSX.utils.aoa_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProductCodes");
    XLSX.writeFile(wb, "product-code-sample.xlsx");
  };

  const stats = [
    {
      label: "Active Codes",
      value: activeCodes.length,
      icon: <FileSpreadsheet size={18} />,
      iconClass: "bg-neutral-100 text-neutral-700",
    },
    {
      label: "Last Search",
      value: lastSearchedCodes.length,
      icon: <Search size={18} />,
      iconClass: "bg-neutral-100 text-neutral-700",
    },
    {
      label: "Products Found",
      value: products.length || 0,
      icon: <PackageSearch size={18} />,
      iconClass: "",
      iconStyle: { backgroundColor: `${BRAND}14`, color: BRAND },
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black">
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-5 rounded-3xl bg-white px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${BRAND}14`, color: BRAND }}
              >
                <PackageSearch size={24} />
              </div>

              <div>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Product Code Lookup
                </h1>
                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                  Search by code or upload Excel. Table shows code, name, image, and category only.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95"
              style={{ backgroundColor: BRAND }}
            >
              <Download size={16} />
              Sample Excel
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_0.9fr]">
          <SearchToolbar
            codesInput={codesInput}
            setCodesInput={setCodesInput}
            normalizedManualCodes={normalizedManualCodes}
            uploadedCodes={uploadedCodes}
            loading={loading}
            onSearch={handleSearch}
            onReset={handleReset}
          />

          <UploadExcelCard
            onUpload={handleFileUpload}
            uploadedCodes={uploadedCodes}
            onDownloadSample={handleDownloadSample}
            onPasteCodes={handlePasteCodes}
            onAutoSearch={handleAutoSearch}
            loading={loading}
          />
        </div>

        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-xl p-2 ${item.iconClass || ""}`}
                  style={item.iconStyle}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">
                    {item.label}
                  </div>
                  <div className="mt-1 text-xl font-semibold">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {(localError || error) && (
          <section className="mt-5 rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-2" style={{ color: BRAND }}>
              <AlertCircle className="mt-0.5" size={16} />
              <p className="text-sm font-medium">{localError || error}</p>
            </div>
          </section>
        )}

        <section className="mt-5">
          <ProductTable
            loading={loading}
            products={products}
            onImageClick={setPreviewImage}
          />
        </section>
      </div>

      <ImageLightbox image={previewImage} onClose={() => setPreviewImage("")} />
    </main>
  );
}