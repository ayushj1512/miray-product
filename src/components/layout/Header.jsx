"use client";

import Image from "next/image";

const BRAND = "#800020";
const LOGO =
  "https://res.cloudinary.com/djtva6hec/image/upload/v1767036287/miray/media/qopxsngt9pusq1bohaif.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white">
      <div className="mx-auto flex h-16 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 -z-10 rounded-full blur-2xl"
            style={{ backgroundColor: `${BRAND}12` }}
          />

          <Image
            src={LOGO}
            alt="Miray"
            width={140}
            height={44}
            priority
            className="h-9 w-auto object-contain sm:h-10"
          />
        </div>
      </div>
    </header>
  );
}