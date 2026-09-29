"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Link from "next/link";
import projects from '@/data/research-prj.json';
import "@/styles/globals.css";

type SortKey = "name" | "location" | "type" | "year";
type SortDirection = "asc" | "desc";

const styles = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: "1.875rem",
  textColor: "#9ca3af",
  titleColor: "#000000",
};
const columnLayoutClass = "md:grid-cols-[3fr_1.5fr_1fr_0.7fr]";

export default function ResearchPage() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

  const getDefaultDirection = (key: SortKey): SortDirection =>
    key === "year" ? "desc" : "asc";

  const projectsWithMeta = useMemo(
    () =>
      projects.map((project, index) => {
        const dateValue = new Date(project.date).getTime();
        const yearValue = Number.isNaN(dateValue) ? null : new Date(project.date).getFullYear();

        return {
          project,
          index,
          dateValue,
          yearValue,
          location: project.location ?? "",
          category: project.category ?? "",
          isLinkable: !project.private,
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
          if (a.dateValue !== b.dateValue) {
            if (Number.isNaN(a.dateValue)) return 1;
            if (Number.isNaN(b.dateValue)) return -1;
            return b.dateValue - a.dateValue;
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
          return sortDirection === "asc"
            ? a.yearValue - b.yearValue
            : b.yearValue - a.yearValue;
        }

        if (a.dateValue !== b.dateValue) {
          if (Number.isNaN(a.dateValue)) return 1;
          if (Number.isNaN(b.dateValue)) return -1;
          return sortDirection === "asc"
            ? a.dateValue - b.dateValue
            : b.dateValue - a.dateValue;
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
    () =>
      Object.fromEntries(
        projectsWithMeta.map((projectMeta) => [projectMeta.project.slug, projectMeta]),
      ),
    [projectsWithMeta],
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <CustomCursor />
      <Header />

      <main className="flex flex-1 pt-40">
        <div className="margin-rule">
          <div className="mb-6 pb-2 text-lg" style={{ fontFamily: styles.fontFamily }}>
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

          <div className="space-y-2" style={{ fontFamily: styles.fontFamily, fontSize: styles.fontSize, fontWeight: 400, color: styles.textColor }}>
            {sortedProjects.map((project) => {
              const projectMeta = projectMetaBySlug[project.slug];
              const year = projectMeta.yearValue !== null ? String(projectMeta.yearValue) : "-";

              return (
                <div key={project.slug} className={`grid grid-cols-1 ${columnLayoutClass} gap-4 py-2`}>
                  <div>
                    {projectMeta.isLinkable ? (
                      <Link
                        href={`/research/${project.slug}`}
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
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}