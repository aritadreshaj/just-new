"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Link from "next/link";
import projects from "@/data/research-prj.json";
import "@/styles/globals.css";

type SortKey = "project" | "format" | "role" | "place" | "year";
type SortDirection = "asc" | "desc";

type ResearchProject = {
  slug: string;
  title: string;
  date?: string;
  location?: string;
  publisher?: string;
  institute?: string;
  category?: string;
  role?: string;
  private?: boolean;
};

type ProjectMeta = {
  project: ResearchProject;
  index: number;
  dateValue: number | null;
  yearText: string;
  format: string;
  role: string;
  place: string;
  subtitle: string;
  isLinkable: boolean;
};

const getDefaultDirection = (key: SortKey): SortDirection => (key === "year" ? "desc" : "asc");

export default function ResearchPage() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

  const projectsWithMeta = useMemo(
    () =>
      (projects as ResearchProject[]).map((project, index): ProjectMeta => {
        const time = new Date(project.date ?? "").getTime();
        const dateValue = Number.isNaN(time) ? null : time;

        return {
          project,
          index,
          dateValue,
          yearText: dateValue !== null ? String(new Date(dateValue).getFullYear()) : "",
          format: project.category?.trim() ?? "",
          role: project.role?.trim() ?? "",
          place: project.location?.trim() ?? "",
          subtitle: project.publisher?.trim() || project.institute?.trim() || "",
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

  const byDateDesc = (a: ProjectMeta, b: ProjectMeta) => {
    if (a.dateValue !== b.dateValue) {
      if (a.dateValue === null) return 1;
      if (b.dateValue === null) return -1;
      return b.dateValue - a.dateValue;
    }
    return a.index - b.index;
  };

  const numberById = useMemo(() => {
    const ordered = [...projectsWithMeta].sort(byDateDesc);
    return new Map(ordered.map((meta, position) => [meta.project.slug, ordered.length - position]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsWithMeta]);

  const sortedProjects = useMemo(() => {
    if (!sortKey || !sortDirection) return [...projectsWithMeta].sort(byDateDesc);

    const direction = sortDirection;
    const key = sortKey;

    return [...projectsWithMeta].sort((a, b) => {
      if (key === "year") {
        if (a.dateValue !== b.dateValue) {
          if (a.dateValue === null) return 1;
          if (b.dateValue === null) return -1;
          return direction === "asc" ? a.dateValue - b.dateValue : b.dateValue - a.dateValue;
        }
        return a.index - b.index;
      }

      const values: Record<Exclude<SortKey, "year">, (project: ProjectMeta) => string> = {
        project: (project) => project.project.title,
        format: (project) => project.format,
        role: (project) => project.role,
        place: (project) => project.place,
      };
      const left = values[key](a).toLowerCase();
      const right = values[key](b).toLowerCase();

      if (left < right) return direction === "asc" ? -1 : 1;
      if (left > right) return direction === "asc" ? 1 : -1;
      return a.index - b.index;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsWithMeta, sortDirection, sortKey]);

  const columns: Array<{ key: SortKey; label: string }> = [
    { key: "project", label: "Project" },
    { key: "format", label: "Format" },
    { key: "role", label: "Role" },
    { key: "place", label: "Place" },
    { key: "year", label: "Year" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <CustomCursor />
      <Header />

      <main className="page-main-offset flex flex-1 bg-[#e7e7e7] text-black">
        <div className="w-full px-4 pb-12 md:px-16">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-fixed border-collapse font-mono text-base leading-snug md:text-xl">
              <colgroup>
                <col className="w-[4%]" />
                <col className="w-[40%]" />
                <col className="w-[14%]" />
                <col className="w-[16%]" />
                <col className="w-[17%]" />
                <col className="w-[9%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-neutral-900/15 text-left font-sans text-base font-bold uppercase leading-none text-black md:text-xl">
                  <th scope="col" className="pb-3 pr-3 pt-0 font-bold">No.</th>
                  {columns.map(({ key, label }) => (
                    <th
                      key={key}
                      scope="col"
                      aria-sort={sortKey === key ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
                      className={`pb-3 pr-3 pt-0 font-bold ${key === "year" ? "text-right" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSortClick(key)}
                        className="cursor-pointer text-left transition-colors hover:text-[#ff6000] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black"
                      >
                        {label}
                        {sortKey === key && sortDirection ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedProjects.map((projectMeta) => {
                  const { project } = projectMeta;
                  const number = String(numberById.get(project.slug) ?? "").padStart(3, "0");

                  return (
                    <tr
                      key={project.slug}
                      className={`border-b border-neutral-900/10 align-top last:border-b-0 ${projectMeta.isLinkable ? "hover:font-bold" : ""}`}
                    >
                      <td className="py-3 pr-3 font-bold">{number}</td>
                      <td className="py-3 pr-3">
                        {projectMeta.isLinkable ? (
                          <Link
                            href={`/research/${project.slug}`}
                            className="block transition-colors hover:text-[#ff6000] focus-visible:text-[#ff6000]"
                          >
                            {project.title}
                          </Link>
                        ) : (
                          <span className="block">{project.title}</span>
                        )}
                        {projectMeta.subtitle ? (
                          <span className="block font-normal text-neutral-500">{projectMeta.subtitle}</span>
                        ) : null}
                      </td>
                      <td className="py-3 pr-3">{projectMeta.format || "—"}</td>
                      <td className="py-3 pr-3">{projectMeta.role || "—"}</td>
                      <td className="py-3 pr-3">{projectMeta.place || "—"}</td>
                      <td className="py-3 text-right">{projectMeta.yearText || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
