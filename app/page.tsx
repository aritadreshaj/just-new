"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // Import the reusable Footer component
import CustomCursor from "@/components/CustomCursor"; // Import the reusable CustomCursor component
import typography from "@/styles/typography"; // Import the typography configuration
import "../styles/globals.css";
import "@fontsource/poppins"; // Ensure the font is imported globally

function AnimatedFullMessage() {
  const [forward, setForward] = useState("");
  const [back, setBack] = useState("");
  const forwardText = "a way forward,";
  const backText = " a way back.";
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let j = 0;
    let forwardInterval: NodeJS.Timeout;
    let backTimeout: NodeJS.Timeout;
    let backInterval: NodeJS.Timeout;

    forwardInterval = setInterval(() => {
      setForward(forwardText.slice(0, i + 1));
      i++;
      if (i === forwardText.length) {
        clearInterval(forwardInterval);
        backTimeout = setTimeout(() => {
          backInterval = setInterval(() => {
            setBack(backText.slice(0, j + 1));
            j++;
            if (j === backText.length) {
              clearInterval(backInterval);
              setDone(true);
            }
          }, 70);
        }, 600);
      }
    }, 70);

    return () => {
      clearInterval(forwardInterval);
      clearTimeout(backTimeout);
      clearInterval(backInterval);
    };
  }, []);

  return (
    <span
      style={{
        color: "#e5e7eb", // Tailwind gray-200
        fontWeight: 300,
        fontSize: "1.5rem",
        letterSpacing: "0.01em",
      }}
      className="md:text-4xl text-xl text-center"
    >
      {forward}
      {back}
      {!done && <span className="animate-pulse">_</span>}
    </span>
  );
}

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
      <main className="flex-1">
        {/* Your existing content */}
        <section className="relative flex items-end justify-center h-screen w-full">
          {/* Fullscreen Crossfade Images */}
          <div className="absolute inset-0">
            {/* First image */}
            <Image
              src="/cover.jpg"
              alt="a way forward, a way back"
              fill
              className={`object-cover object-center transition-opacity duration-[2000ms] ease-in-out ${
                isInverted ? "opacity-0" : "opacity-100"
              }`}
              priority
            />
            {/* Second image */}
            <Image
              src="/cover-1.jpg"
              alt="a way forward, a way back (alt)"
              fill
              className={`object-cover object-center transition-opacity duration-[2000ms] ease-in-out absolute inset-0 ${
                isInverted ? "opacity-100" : "opacity-0"
              }`}
              priority
            />
          </div>

          {/* Text Overlay at Bottom */}
          <div className="relative z-10 flex flex-col items-center w-full pb-24">
            <h1 className="font-light text-center select-none">
              <AnimatedFullMessage />
            </h1>
          </div>
        </section>

        {/* "More to unfold" message directly under the image */}
        <div className="w-full flex justify-center">
          <p
            className={`mt-10 ${typography.colors.darkGray} italic ${typography.sizes.md} text-center`}
          >
            Live, but still evolving. More content coming soon...
          </p>
        </div>

        {/* Add margin-rule wrapper for content after the image */}
        <div className="margin-rule">
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
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}