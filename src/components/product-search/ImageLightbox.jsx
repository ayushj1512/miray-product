"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageLightbox({ image, onClose }) {
  const images = useMemo(() => {
    if (!image) return [];
    if (Array.isArray(image)) return image.filter(Boolean);
    if (Array.isArray(image?.images)) return image.images.filter(Boolean);
    if (typeof image === "string") return [image];
    return [];
  }, [image]);

  const initialIndex =
    typeof image?.index === "number" && image.index >= 0 ? image.index : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, image]);

  useEffect(() => {
    if (!images.length) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images, onClose]);

  if (!images.length) return null;

  const currentImage = images[currentIndex];

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-5 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-5 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div
        className="relative flex h-[84vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white/5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-1">
          <Image
            src={currentImage}
            alt={`Preview ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {images.length > 1 && (
          <div className="border-t border-white/10 bg-black/20 px-4 py-3">
            <div className="mb-3 text-center text-xs font-medium text-white/80">
              {currentIndex + 1} / {images.length}
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {images.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border ${
                    idx === currentIndex
                      ? "border-white"
                      : "border-white/10 opacity-70"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}