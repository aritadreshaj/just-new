"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import "@/styles/globals.css";

export default function ContactPage() {
  return (
    <>
      <CustomCursor />
      <Header />
      <div className="min-h-screen flex flex-col relative bg-white">
        <div className="margin-rule flex-1 flex flex-col" style={{ flex: "1 0 auto" }}>
          <main className="flex flex-1 page-main-offset pb-16 md:pb-24" style={{ minHeight: 0 }}>
            <div className="w-full">
              <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-start">
                <div className="text-left">
                  <h2 className="text-neutral-600 text-base md:text-lg">For inquiries</h2>
                  <a
                    href="mailto:info@aritadreshaj.com"
                    className="inline-block text-[#000000] break-words text-2xl md:text-3xl transition-colors duration-200 hover:text-[#ff5a00] focus:text-[#ff5a00] active:text-[#ff0000]"
                  >
                    info@aritadreshaj.com
                  </a>
                </div>

                <div className="text-left md:text-right">
                  <h2 className="text-neutral-600 text-base md:text-lg">Instagram</h2>
                  <a
                    href="https://instagram.com/aritadreshaj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[#000000] text-2xl md:text-3xl transition-colors duration-200 hover:text-[#ff5a00] focus:text-[#ff5a00] active:text-[#ff0000]"
                  >
                    @aritadreshaj
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}