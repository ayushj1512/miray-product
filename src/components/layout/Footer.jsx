"use client";

import Image from "next/image";

const LOGO =
  "https://res.cloudinary.com/djtva6hec/image/upload/v1767036287/miray/media/qopxsngt9pusq1bohaif.png";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-black/5 bg-white">
      <div className="mx-auto flex flex-col items-center justify-center gap-3 px-4 py-6 text-center sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Image
          src={LOGO}
          alt="Miray"
          width={120}
          height={36}
          className="h-8 w-auto object-contain opacity-90"
        />

        {/* Text */}
        <p className="text-xs text-neutral-500">
          © {new Date().getFullYear()} Miray Fashions · Internal Product Tool
        </p>

        {/* Accent line */}
        <div className="h-[2px] w-16 rounded-full bg-[#800020]/40" />
      </div>
    </footer>
  );
}