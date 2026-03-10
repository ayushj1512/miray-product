"use client";

import { create } from "zustand";

const API = (process.env.NEXT_PUBLIC_API_URL || "").trim();

const buildUrl = (path = "") => {
  const base = API.replace(/\/+$/, "");
  const cleanPath = String(path || "").replace(/^\/+/, "");
  return `${base}/api/products/${cleanPath}`;
};

const parseJsonSafe = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Invalid server response" };
  }
};

export const useProductStore = create((set) => ({
  product: null,
  products: [],
  loading: false,
  error: null,

  clearProductState: () =>
    set({
      product: null,
      products: [],
      error: null,
    }),

  getProductByCode: async (code) => {
    try {
      const cleanCode = String(code || "").trim();

      if (!cleanCode) throw new Error("productCode is required");

      set({ loading: true, error: null });

      const res = await fetch(buildUrl(`code/${encodeURIComponent(cleanCode)}`), {
        method: "GET",
        credentials: "include",
      });

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch product");
      }

      set({
        product: data || null,
        loading: false,
      });

      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.message || "Failed to fetch product",
      });
      throw err;
    }
  },

  getProductsByCodes: async (codes = []) => {
    try {
      const normalizedCodes = Array.isArray(codes)
        ? codes.map((c) => String(c || "").trim()).filter(Boolean)
        : typeof codes === "string"
          ? codes.split(",").map((c) => String(c || "").trim()).filter(Boolean)
          : [];

      if (!normalizedCodes.length) throw new Error("codes is required");

      set({ loading: true, error: null });

      const res = await fetch(buildUrl("by-codes"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codes: normalizedCodes }),
      });

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch products");
      }

      set({
        products: data?.products || [],
        loading: false,
      });

      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.message || "Failed to fetch products",
      });
      throw err;
    }
  },
}));