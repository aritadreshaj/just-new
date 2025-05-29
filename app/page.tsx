"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // Import the reusable Footer component
import CustomCursor from "@/components/CustomCursor"; // Import the reusable CustomCursor component
import { Typewriter } from "react-simple-typewriter";
import typography from "@/styles/typography"; // Import the typography configuration
import "../styles/globals.css";
import "@fontsource/poppins"; // Ensure the font is imported globally

export default function Home() {
  const [isInverted, setIsInverted] = useState(false); // State for toggling the image

  // Effect to toggle the image between normal and inverted
  useEffect(() => {
    const interval = setInterval(() => {
      setIsInverted((prev) => !prev); // Toggle the image state
    }, 500); // Change every 2 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Header */}
      <Header />
      <div className="margin-rule">
        <main className="flex-1">
          {/* Your existing content */}
          <section className="flex flex-col items-center justify-center h-screen relative pt-40">
            {/* Image */}
            <div className="w-[30%] relative" style={{ aspectRatio: "1 / 1" }}>
              <Image
                src={isInverted ? "/headline-invert.jpg" : "/headline.jpg"} // Toggle between images
                alt="a way forward, a way back"
                fill
                className="object-cover transition-all duration-200" // Smooth transition
                priority
              />
            </div>

            {/* Text Below the Image */}
            <div className="mt-8 text-center">
              <h1
                className={`${typography.colors.orange} ${typography.sizes.md} font-light`}
              >
                <Typewriter
                  words={["a way forward, a way back."]}
                  loop={false}
                  cursor
                  cursorStyle="_"
                  typeSpeed={50}
                  delaySpeed={1000}
                  onLoopDone={() => {}}
                />
              </h1>

              {/* Significant Space */}
              <p
                className={`mt-[250px] ${typography.colors.darkGray} italic ${typography.sizes.md}`}
              >
                More to unfold. Come back soon.
              </p>
            </div>
          </section>

          <section className="py-16 md:py-24 container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2
                  className={`${typography.sizes.xl} ${typography.weights.light} ${typography.colors.black} mb-6`}
                >
                  About
                </h2>
                <p
                  className={`${typography.sizes.sm} ${typography.weights.light} ${typography.colors.darkGray} mb-4`}
                >
                  Arita Dreshaj is an architect and urban designer whose research
                  draws on historical theory to examine the social dimensions of
                  space and memory.
                </p>
                <Button asChild variant="outline" className="group">
                  <Link href="/about">
                    Find out more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <div>
                <h2
                  className={`${typography.sizes.xl} ${typography.weights.light} ${typography.colors.black} mb-6`}
                >
                  Categories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Link Research to app/research */}
                  <Link
                    href="/research"
                    className="border border-neutral-200 p-4 hover:bg-neutral-50 transition-colors"
                  >
                    Research
                  </Link>

                  {/* Updated links */}
                  <Link
                    href="/architecture"
                    className="border border-neutral-200 p-4 hover:bg-neutral-50 transition-colors"
                  >
                    Architecture
                  </Link>
                  <Link
                    href="/news"
                    className="border border-neutral-200 p-4 hover:bg-neutral-50 transition-colors"
                  >
                    News
                  </Link>
                  <Link
                    href="/actual"
                    className="border border-neutral-200 p-4 hover:bg-neutral-50 transition-colors"
                  >
                    Actual
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}