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
          <main className="flex flex-1 pt-40 pb-24" style={{ minHeight: 0 }}>
            <div className="w-full">
              <div className="flex justify-between items-start">
                {/* Left: Inquiries */}
                <div className="text-left">
                  <h2 className="text-xl text-neutral-600">For inquiries:</h2>
                  <a href="mailto:info@aritadreshaj.com" className="text-xl text-[#ff6000] break-words">info@aritadreshaj.com</a>
                </div>

                {/* Right: Instagram */}
                <div className="text-right">
                  <h2 className="text-xl text-neutral-600">Follow my work:</h2>
                  <a href="https://instagram.com/aritadreshaj" target="_blank" rel="noopener noreferrer" className="text-xl text-[#ff6000]">@aritadreshaj</a>
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