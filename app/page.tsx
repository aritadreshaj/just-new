"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import "../styles/globals.css";
import mainPageProjects from "@/data/main-page.json";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const projects = (mainPageProjects as any[]) || [];
  const OUTER_GAP = "4rem";
  const LEFT_MIDDLE_GAP = "0.5rem";
  const MIDDLE_RIGHT_GAP = "4rem";
  const [headerHeight, setHeaderHeight] = useState(80);
  const [hoveredLeftIndex, setHoveredLeftIndex] = useState<number | null>(null);
  const [isRightPanelHovered, setIsRightPanelHovered] = useState(false);

  const sorted = projects.slice().sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  const leftProjects = sorted.filter((p) => p.column === "left" || p.side === "left");
  const rightProjects = sorted.filter((p) => p.column === "right" || p.side === "right");
  const hasLink = (p: any) => p.link && p.link !== "false";
  const topOffset = `calc(${headerHeight}px + ${OUTER_GAP})`;

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header");
      if (header) setHeaderHeight(Math.round(header.getBoundingClientRect().height));
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <CustomCursor />
      <Header />

      <main className="flex-1" style={{ paddingInline: OUTER_GAP }}>
        <div className="grid grid-cols-1 md:grid-cols-12" style={{ gap: 0, marginTop: topOffset }}>
          <div className="md:col-span-6">
            {leftProjects.map((p: any, idx: number) => (
              <div key={p.id} style={{ marginBottom: OUTER_GAP }}>
                <div
                  className="w-full md:w-[90%] aspect-[6/4] bg-neutral-100 relative overflow-hidden"
                  onMouseEnter={() => setHoveredLeftIndex(idx)}
                  onMouseLeave={() => setHoveredLeftIndex(null)}
                >
                  {hasLink(p) ? (
                    <Link href={p.link}>
                      <img src={p.heroImage} alt={p.alt?.hero || p.title} className="absolute inset-0 w-full h-full object-cover object-center cursor-pointer" />
                    </Link>
                  ) : (
                    <img src={p.heroImage} alt={p.alt?.hero || p.title} className="absolute inset-0 w-full h-full object-cover object-center" />
                  )}
                </div>
                <div className="pt-4">
                  {hasLink(p) ? (
                    <Link href={p.link}>
                      <h2 className="text-xl font-semibold cursor-pointer">{p.title || ""}</h2>
                    </Link>
                  ) : (
                    <h2 className="text-xl font-semibold">{p.title || ""}</h2>
                  )}
                  <p className="text-lg text-neutral-700">{p.excerpt || p.credits || ""}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2" style={{ marginLeft: LEFT_MIDDLE_GAP }}>
            {leftProjects.map((p: any, idx: number) => (
              <div key={`meta-${p.id}`} style={{ marginBottom: OUTER_GAP }}>
                <div className="w-full">
                  {hoveredLeftIndex === idx ? (
                    <p className="text-2xl leading-snug">{p.description || p.excerpt || ""}</p>
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold mb-2">{p.title || ""}</h3>
                      <div className="text-2xl mb-1 text-neutral-500">{p.location || ""}</div>
                      {p.collaborator && p.collaborator !== "false" ? <div className="text-2xl mb-1 text-neutral-500">{p.collaborator}</div> : null}
                      <div className="text-2xl mb-1">{p.theme || ""}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className="md:col-span-4"
            style={{
              position: "sticky",
              top: topOffset,
              paddingLeft: MIDDLE_RIGHT_GAP,
              alignSelf: "flex-start",
              width: "100%",
              maxHeight: `calc(100vh - ${topOffset})`,
              overflowY: isRightPanelHovered ? "auto" : "hidden",
              scrollbarWidth: "none",
            }}
            onMouseEnter={() => setIsRightPanelHovered(true)}
            onMouseLeave={() => setIsRightPanelHovered(false)}
            onWheelCapture={(e) => isRightPanelHovered && e.stopPropagation()}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <div className="no-scrollbar">
              {rightProjects.map((p: any) => (
                <div key={p.id} style={{ marginBottom: OUTER_GAP }}>
                  <div className="w-full md:w-[70%] md:ml-auto">
                    <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden">
                      {hasLink(p) ? (
                        <Link href={p.link}>
                          <img src={p.portraitImage || p.heroImage} alt={p.alt?.portrait || p.title} className="absolute inset-0 w-full h-full object-cover object-center cursor-pointer" />
                        </Link>
                      ) : (
                        <img src={p.portraitImage || p.heroImage} alt={p.alt?.portrait || p.title} className="absolute inset-0 w-full h-full object-cover object-center" />
                      )}
                    </div>
                    <div className="pt-4 space-y-2">
                      {hasLink(p) ? (
                        <Link href={p.link}>
                          <h4 className="text-lg font-semibold cursor-pointer">{p.title || ""}</h4>
                        </Link>
                      ) : (
                        <h4 className="text-lg font-semibold">{p.title || ""}</h4>
                      )}
                      <p className="text-lg text-neutral-700">{p.excerpt || p.credits || ""}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
