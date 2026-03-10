"use client";

import Image from "next/image";
import { ImageIcon, Package2, Loader2 } from "lucide-react";

const getCategory = (product) =>
  Array.isArray(product?.categories) && product.categories.length
    ? product.categories.join(", ")
    : "-";

const getImages = (product) => {
  const rawImages = [
    product?.thumbnail,
    ...(Array.isArray(product?.images) ? product.images : []),
  ];

  return [...new Set(rawImages.filter(Boolean))];
};

export default function ProductTable({
  loading,
  products = [],
  onImageClick,
}) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#800020]/10 p-2 text-[#800020]">
            <Package2 size={18} />
          </div>

          <div>
            <h2 className="text-sm font-semibold">Results</h2>
            <p className="text-xs text-neutral-500">
              Product code, name, image, category
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#fafafa] px-3 py-2 text-xs font-medium text-neutral-600">
          {products.length} found
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#fafafa]">
            <tr>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                Code
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                Name
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                Image
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                Category
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
                    <Loader2 className="animate-spin" size={16} />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : !products.length ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center text-neutral-500">
                    <div className="rounded-xl bg-[#f5f5f5] p-3">
                      <Package2 size={22} />
                    </div>
                    <p className="mt-3 text-sm font-medium">No products found</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Search by code or upload sample Excel
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product, index) => {
                const images = getImages(product);
                const preview = images[0] || "";

                return (
                  <tr
                    key={product?._id || `${product?.productCode}-${index}`}
                    className="border-t border-neutral-100 hover:bg-[#fcfcfc]"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#800020]">
                      {product?.productCode || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                      {product?.title || "-"}
                    </td>

                    <td className="px-5 py-4">
                      {preview ? (
                        <button
                          type="button"
                          onClick={() =>
                            onImageClick?.({
                              images,
                              index: 0,
                              title: product?.title || "Product",
                            })
                          }
                          className="group relative h-16 w-16 overflow-hidden rounded-2xl bg-[#f7f7f7]"
                        >
                          <Image
                            src={preview}
                            alt={product?.title || "Product"}
                            fill
                            sizes="64px"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                        </button>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f3f3] text-neutral-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-neutral-700">
                      {getCategory(product)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}