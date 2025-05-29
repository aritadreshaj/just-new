"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Importing next/image for optimized image handling
import typography from "@/styles/typography"; // Import the typography configuration
import "@/styles/globals.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    console.log("Menu Open State:", menuOpen); // Debugging
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false); // Close the menu when the cursor leaves the menu area
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-neutral-200 fixed top-0 left-0 right-0 bg-white z-50">
        <div className="w-full flex justify-between items-center py-6">
          <Link
            href="/"
            className={`${typography.sizes.xl} ${typography.weights.medium} tracking-wide ${typography.colors.orange} pl-8`}
          >
            a r i t a d r e s h a j
          </Link>
          <div className="flex items-center gap-6 pr-6 relative">
            {/* Hamburger/Close Button */}
            <button
              onClick={handleMenuToggle}
              className="p-2 focus:outline-none z-50"
            >
              <Image
                src={menuOpen ? "/close.png" : "/open.png"} // Toggle between open and close icons
                alt={menuOpen ? "Close menu" : "Open menu"}
                width={24}
                height={24}
                priority // Ensures the image is loaded quickly
              />
            </button>
          </div>
        </div>
      </header>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: typeof window !== 'undefined' && window.innerWidth <= 640 ? '50%' : '20%' }} // Responsive width
        onMouseLeave={handleMenuClose} // Close the menu when the cursor leaves the menu area
      >
        <div className="flex flex-col items-start pl-8 pr-6 pt-6 pb-6 mt-2">
        <Link
            href="/research"
            className={`${typography.sizes.xl} ${typography.weights.medium} mb-4 hover:${typography.colors.orange}`}
          >
            Research
          </Link>
          <Link
            href="/architecture"
            className={`${typography.sizes.xl} ${typography.weights.medium} mb-4 hover:${typography.colors.orange}`}
          >
            Architecture
          </Link>
          <Link
            href="/news"
            className={`${typography.sizes.xl} ${typography.weights.medium} mb-4 hover:${typography.colors.orange}`}
          >
            News
          </Link>
          <Link
            href="/about"
            className={`${typography.sizes.xl} ${typography.weights.medium} hover:${typography.colors.orange}`}
          >
            About
          </Link>
        </div>
      </div>
    </>
  );
}