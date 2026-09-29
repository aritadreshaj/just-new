"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import "../styles/globals.css";
import mainPageProjects from "@/data/main-page.json";
import architectureProjects from "@/data/architecture-prj.json";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MainPageProject = {
  id: string;
  title: string;
  side?: string;
  column?: string;
  heroImage?: string;
  portraitImage?: string;
  excerpt?: string;
  credits?: string;
  description?: string;
  location?: string;
  collaborator?: string;
  theme?: string;
  link?: string;
  architectureSlug?: string;
  alt?: {
    hero?: string;
    portrait?: string;
  };
};

type ArchitectureProject = {
  slug: string;
  title: string;
  isPublished?: boolean;
};

const normalizeText = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
const isRoutableLink = (value: string) => value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://");

export default function Home() {
  const projects = (mainPageProjects as MainPageProject[]) || [];

  // Strict desktop layout + softer mobile spacing
  const OUTER_GAP_DESKTOP = "4rem";
  const OUTER_GAP_MOBILE = "1rem";
  const LEFT_MIDDLE_GAP_DESKTOP = "2rem";
  const MIDDLE_RIGHT_GAP_DESKTOP = "4rem";
  const LEFT_IMAGE_WIDTH_DESKTOP = "65%";
  const RIGHT_COLUMN_WIDTH_DESKTOP = "25%";

  const [headerHeight, setHeaderHeight] = useState(80);
  const [hoveredLeftIndex, setHoveredLeftIndex] = useState<number | null>(null);
  const [isRightPanelHovered, setIsRightPanelHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false,
  );

  const { architectureByTitle, publishedArchitectureSlugs } = useMemo(() => {
    const items = (architectureProjects as ArchitectureProject[]) || [];
    const published = items.filter((project) => project.isPublished === true);
    return {
      architectureByTitle: new Map(published.map((project) => [normalizeText(project.title), project.slug])),
      publishedArchitectureSlugs: new Set(published.map((project) => project.slug)),
    };
  }, []);

  const sorted = projects.slice().sort((a, b) => new Date((b as any).date || 0).getTime() - new Date((a as any).date || 0).getTime());
  const leftProjects = sorted.filter((p) => p.column === "left" || p.side === "left");
  const rightProjects = sorted.filter((p) => p.column === "right" || p.side === "right");
  const getProjectLink = (project: MainPageProject) => {
    if (project.link && project.link !== "false" && isRoutableLink(project.link)) return project.link;
    if (project.architectureSlug && publishedArchitectureSlugs.has(project.architectureSlug)) {
      return `/architecture/${project.architectureSlug}`;
    }
    const matchedSlug = architectureByTitle.get(normalizeText(project.title || ""));
    return matchedSlug ? `/architecture/${matchedSlug}` : null;
  };
  const outerGap = isDesktop ? OUTER_GAP_DESKTOP : OUTER_GAP_MOBILE;
  const topOffset = `calc(${headerHeight}px + ${outerGap})`;

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header");
      if (header) setHeaderHeight(Math.round(header.getBoundingClientRect().height));
      setIsDesktop(window.innerWidth >= 768);
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <CustomCursor />
      <Header />

      <main className="flex-1" style={{ paddingInline: outerGap }}>
        <div className="flex flex-col md:flex-row" style={{ marginTop: topOffset, columnGap: isDesktop ? MIDDLE_RIGHT_GAP_DESKTOP : "1.25rem" }}>
          <div className="flex-1">
            {leftProjects.map((p: MainPageProject, idx: number) => {
              const projectLink = getProjectLink(p);

              return (
                <div
                  key={p.id}
                  className="grid"
                  style={{
                    marginBottom: outerGap,
                    gridTemplateColumns: isDesktop
                      ? `minmax(0, ${LEFT_IMAGE_WIDTH_DESKTOP}) ${LEFT_MIDDLE_GAP_DESKTOP} minmax(0, 1fr)`
                      : "minmax(0, 1fr)",
                  }}
                >
                  <div style={{ gridColumn: "1" }}>
                    <div
                      className="aspect-[7/5] bg-neutral-100 relative overflow-hidden"
                      onMouseEnter={() => setHoveredLeftIndex(idx)}
                      onMouseLeave={() => setHoveredLeftIndex(null)}
                    >
                      {projectLink ? (
                        <Link href={projectLink}>
                          <img src={p.heroImage} alt={p.alt?.hero || p.title} className="absolute inset-0 w-full h-full object-cover object-center cursor-pointer" />
                        </Link>
                      ) : (
                        <img src={p.heroImage} alt={p.alt?.hero || p.title} className="absolute inset-0 w-full h-full object-cover object-center" />
                      )}
                    </div>
                    {isDesktop ? (
                      <div className="pt-4">
                        {projectLink ? (
                          <Link href={projectLink}>
                            <h2 className="text-xl font-semibold cursor-pointer">{p.title || ""}</h2>
                          </Link>
                        ) : (
                          <h2 className="text-xl font-semibold">{p.title || ""}</h2>
                        )}
                        <p className="text-lg text-neutral-700">{p.excerpt || p.credits || ""}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-3 md:mt-0" style={{ gridColumn: isDesktop ? "3" : "1" }}>
                    {isDesktop && hoveredLeftIndex === idx ? (
                      <p className="text-base md:text-2xl leading-snug">{p.description || p.excerpt || ""}</p>
                    ) : (
                      <>
                        {projectLink ? (
                          <Link href={projectLink}>
                            <h3 className="text-lg md:text-2xl font-semibold mb-2 cursor-pointer">{p.title || ""}</h3>
                          </Link>
                        ) : (
                          <h3 className="text-lg md:text-2xl font-semibold mb-2">{p.title || ""}</h3>
                        )}
                        {!isDesktop && p.description ? <p className="text-base md:text-2xl mb-2 leading-snug">{p.description}</p> : null}
                        {p.collaborator && p.collaborator !== "false" ? <div className="text-base md:text-2xl mb-1 text-neutral-500">{p.collaborator}</div> : null}
                        {p.location ? <div className="text-base md:text-2xl mb-1 text-neutral-500">{p.location}</div> : null}
                        {isDesktop ? <div className="text-base md:text-2xl mb-1">{p.theme || ""}</div> : null}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="w-full md:flex-none mt-2 md:mt-0"
            style={{
              width: isDesktop ? RIGHT_COLUMN_WIDTH_DESKTOP : "100%",
              minWidth: isDesktop ? RIGHT_COLUMN_WIDTH_DESKTOP : "100%",
              position: isDesktop ? "sticky" : "static",
              top: isDesktop ? topOffset : undefined,
              alignSelf: "flex-start",
              maxHeight: isDesktop ? `calc(100vh - ${topOffset})` : undefined,
              overflowY: isDesktop && isRightPanelHovered ? "auto" : "visible",
              scrollbarWidth: "none",
            }}
            onMouseEnter={() => setIsRightPanelHovered(true)}
            onMouseLeave={() => setIsRightPanelHovered(false)}
            onWheelCapture={(e) => isRightPanelHovered && e.stopPropagation()}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <div className="no-scrollbar">
              {rightProjects.map((p: MainPageProject) => {
                const projectLink = getProjectLink(p);

                return (
                  <div key={p.id} style={{ marginBottom: outerGap }}>
                    <div className="w-full">
                      <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden">
                        {projectLink ? (
                          <Link href={projectLink}>
                            <img src={p.portraitImage || p.heroImage} alt={p.alt?.portrait || p.title} className="absolute inset-0 w-full h-full object-cover object-center cursor-pointer" />
                          </Link>
                        ) : (
                          <img src={p.portraitImage || p.heroImage} alt={p.alt?.portrait || p.title} className="absolute inset-0 w-full h-full object-cover object-center" />
                        )}
                      </div>
                      <div className="pt-4 space-y-2">
                        {projectLink ? (
                          <Link href={projectLink}>
                            <h4 className="text-lg font-semibold cursor-pointer">{p.title || ""}</h4>
                          </Link>
                        ) : (
                          <h4 className="text-lg font-semibold">{p.title || ""}</h4>
                        )}
                        <p className="text-lg text-neutral-700">{p.excerpt || p.credits || ""}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
