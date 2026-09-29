"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Link from "next/link";
import projects from "@/data/architecture-prj.json";
import "@/styles/globals.css";

type SortKey = "name" | "location" | "type" | "year";
type SortDirection = "asc" | "desc";

const styles = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: "1.875rem",
  textColor: "#9ca3af",
};
const columnLayoutClass = "md:grid-cols-[3fr_1.5fr_1fr_0.7fr]";

export default function ArchitecturePage() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

  const getDefaultDirection = (key: SortKey): SortDirection => (key === "year" ? "desc" : "asc");

  const parseYear = (yearText: string | undefined) => {
    if (!yearText) return null;
    const match = yearText.match(/\d{4}/);
    if (!match) return null;
    return Number.parseInt(match[0], 10);
  };

  const projectsWithMeta = useMemo(
    () =>
      projects.map((project, index) => {
        const infoSection = project.sections?.find((section) => section.type === "info");
        const fields = (infoSection?.fields ?? {}) as Record<string, unknown>;
        const yearText = fields["Year"] as string | undefined;
        const yearValue = parseYear(yearText);

        return {
          project,
          index,
          yearValue,
          yearText,
          location: (fields["Location"] as string) ?? "",
          category: (fields["Type"] as string) ?? project.theme ?? "",
          isLinkable: typeof project.slug === "string" && project.slug.length > 0,
        };
      }),
    [],
  );

  const handleSortClick = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection(getDefaultDirection(key));
      return;
    }

    const defaultDirection = getDefaultDirection(key);
    if (sortDirection === defaultDirection) {
      setSortDirection(defaultDirection === "asc" ? "desc" : "asc");
      return;
    }

    setSortKey(null);
    setSortDirection(null);
  };

  const sortedProjects = useMemo(() => {
    if (!sortKey || !sortDirection) {
      return [...projectsWithMeta]
        .sort((a, b) => {
          if (a.yearValue !== b.yearValue) {
            if (a.yearValue === null) return 1;
            if (b.yearValue === null) return -1;
            return b.yearValue - a.yearValue;
          }
          return a.index - b.index;
        })
        .map(({ project }) => project);
    }

    return [...projectsWithMeta]
      .sort((a, b) => {
        if (sortKey === "year") {
          if (a.yearValue !== b.yearValue) {
            if (a.yearValue === null) return 1;
            if (b.yearValue === null) return -1;
            return sortDirection === "asc" ? a.yearValue - b.yearValue : b.yearValue - a.yearValue;
          }
          return a.index - b.index;
        }

        const left =
          sortKey === "name"
            ? a.project.title.toLowerCase()
            : sortKey === "location"
              ? a.location.toLowerCase()
              : a.category.toLowerCase();
        const right =
          sortKey === "name"
            ? b.project.title.toLowerCase()
            : sortKey === "location"
              ? b.location.toLowerCase()
              : b.category.toLowerCase();

        if (left < right) return sortDirection === "asc" ? -1 : 1;
        if (left > right) return sortDirection === "asc" ? 1 : -1;
        return a.index - b.index;
      })
      .map(({ project }) => project);
  }, [projectsWithMeta, sortDirection, sortKey]);

  const projectMetaBySlug = useMemo(
    () => Object.fromEntries(projectsWithMeta.map((projectMeta) => [projectMeta.project.slug, projectMeta])),
    [projectsWithMeta],
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <CustomCursor />
      <Header />

      <main className="flex flex-1 pt-[calc(80px+1rem)] md:pt-[calc(80px+4rem)]">
        <div className="margin-rule">
          <div className="mb-6 pb-2 text-lg hidden md:block" style={{ fontFamily: styles.fontFamily }}>
            <div className={`grid grid-cols-1 ${columnLayoutClass} gap-4 uppercase tracking-[0.02em]`}>
              <button type="button" onClick={() => { handleSortClick("name"); }} className="text-left cursor-pointer hover:text-black" style={{ color: styles.textColor, fontWeight: sortKey === "name" ? 600 : 400 }}>
                Name
              </button>
              <button type="button" onClick={() => { handleSortClick("location"); }} className="text-left cursor-pointer hover:text-black" style={{ color: styles.textColor, fontWeight: sortKey === "location" ? 600 : 400 }}>
                Venue
              </button>
              <button type="button" onClick={() => { handleSortClick("type"); }} className="text-left cursor-pointer hover:text-black" style={{ color: styles.textColor, fontWeight: sortKey === "type" ? 600 : 400 }}>
                Type
              </button>
              <button type="button" onClick={() => { handleSortClick("year"); }} className="text-left cursor-pointer hover:text-black text-right" style={{ color: styles.textColor, fontWeight: sortKey === "year" ? 600 : 400 }}>
                Year
              </button>
            </div>
          </div>

          <div className="space-y-1 md:space-y-2" style={{ fontFamily: styles.fontFamily, fontWeight: 400, color: styles.textColor }}>
            {sortedProjects.map((project) => {
              const projectMeta = projectMetaBySlug[project.slug];
              const year = projectMeta.yearValue !== null ? String(projectMeta.yearValue) : projectMeta.yearText ?? "-";

              return (
                <div key={project.slug} className="py-3">
                  <div className={`hidden md:grid grid-cols-1 ${columnLayoutClass} gap-4`} style={{ fontSize: styles.fontSize }}>
                    <div>
                      {projectMeta.isLinkable ? (
                        <Link
                          href={`/architecture/${project.slug}`}
                          className="inline-block font-bold text-black transition-colors duration-200 hover:text-[#ff5a00] focus:text-[#ff5a00] active:text-[#ff0000]"
                        >
                          {project.title}
                        </Link>
                      ) : (
                        <span className="inline-block font-bold text-black">
                          {project.title}
                        </span>
                      )}
                    </div>
                    <div style={{ color: styles.textColor }}>{projectMeta.location}</div>
                    <div style={{ color: styles.textColor }}>{projectMeta.category}</div>
                    <div className="text-right" style={{ color: styles.textColor }}>{year}</div>
                  </div>
                  <div className="md:hidden space-y-1">
                    {projectMeta.isLinkable ? (
                      <Link
                        href={`/architecture/${project.slug}`}
                        className="inline-block text-3xl font-bold text-black leading-tight transition-colors duration-200 hover:text-[#ff5a00] focus:text-[#ff5a00] active:text-[#ff0000]"
                      >
                        {project.title}
                      </Link>
                    ) : (
                      <span className="inline-block text-3xl font-bold text-black leading-tight">
                        {project.title}
                      </span>
                    )}
                    {projectMeta.location ? <div className="text-lg text-neutral-500">{projectMeta.location}</div> : null}
                    {projectMeta.category ? <div className="text-lg text-neutral-500">{projectMeta.category}</div> : null}
                    <div className="text-lg text-neutral-500">{year}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
