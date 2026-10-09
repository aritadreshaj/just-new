"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Link from "next/link";
import projects from "@/data/architecture-prj.json";
import "@/styles/globals.css";

type SortKey = "project" | "typology" | "intervention" | "place" | "year" | "status";
type SortDirection = "asc" | "desc";

type ArchitectureProject = {
  slug: string;
  isPublished?: boolean;
  sections?: Array<{ type?: string; fields?: Record<string, unknown> }>;
  theme?: string;
  title: string;
  subtitle?: string;
  number?: string | number;
  intervention?: string;
  status?: string;
};

type ProjectMeta = {
  project: ArchitectureProject;
  index: number;
  number: string;
  yearValue: number | null;
  yearText: string;
  typology: string;
  intervention: string;
  place: string;
  status: string;
  subtitle: string;
  isLinkable: boolean;
};

const getFieldText = (fields: Record<string, unknown>, key: string) =>
  typeof fields[key] === "string" ? fields[key].trim() : "";

const parseYear = (yearText: string) => {
  const match = yearText.match(/\d{4}/);
  return match ? Number.parseInt(match[0], 10) : null;
};

const getDefaultDirection = (key: SortKey): SortDirection => (key === "year" ? "desc" : "asc");

export default function ArchitecturePage() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

  const projectsWithMeta = useMemo(
    () =>
      (projects as ArchitectureProject[]).map((project, index): ProjectMeta => {
        const infoSection = project.sections?.find((section) => section.type === "info");
        const fields = infoSection?.fields ?? {};
        const yearText = getFieldText(fields, "Year");

        return {
          project,
          index,
          yearValue: parseYear(yearText),
          yearText,
          typology: getFieldText(fields, "Type") || project.theme || "",
          number: String(project.number ?? "").trim(),
          intervention: project.intervention?.trim() || getFieldText(fields, "Intervention"),
          place: getFieldText(fields, "Location"),
          status: project.status?.trim() || getFieldText(fields, "Status"),
          subtitle:
            project.subtitle?.trim() ||
            ["Subtitle", "Developed at", "Collaborators", "Collaborator", "Institution", "Client"]
              .map((key) => getFieldText(fields, key))
              .find((value) => value && value.toLowerCase() !== "false") ||
            "",
          isLinkable: project.isPublished === true && project.slug.length > 0,
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
    const byYearDesc = (a: ProjectMeta, b: ProjectMeta) => {
      if (a.yearValue !== b.yearValue) {
        if (a.yearValue === null) return 1;
        if (b.yearValue === null) return -1;
        return b.yearValue - a.yearValue;
      }
      return a.index - b.index;
    };

    if (!sortKey || !sortDirection) {
      return [...projectsWithMeta].sort((a, b) => {
        const left = Number.parseInt(a.number, 10);
        const right = Number.parseInt(b.number, 10);
        const leftValid = !Number.isNaN(left);
        const rightValid = !Number.isNaN(right);

        if (leftValid && rightValid && left !== right) return right - left;
        if (leftValid !== rightValid) return leftValid ? -1 : 1;
        return byYearDesc(a, b);
      });
    }

    const direction = sortDirection;
    const key = sortKey;

    return [...projectsWithMeta].sort((a, b) => {
      if (key === "year") {
        if (a.yearValue !== b.yearValue) {
          if (a.yearValue === null) return 1;
          if (b.yearValue === null) return -1;
          return direction === "asc" ? a.yearValue - b.yearValue : b.yearValue - a.yearValue;
        }
        return a.index - b.index;
      }

      const values: Record<Exclude<SortKey, "year">, (project: ProjectMeta) => string> = {
        project: (project) => project.project.title,
        typology: (project) => project.typology,
        intervention: (project) => project.intervention,
        place: (project) => project.place,
        status: (project) => project.status,
      };
      const left = values[key](a).toLowerCase();
      const right = values[key](b).toLowerCase();

      if (left < right) return direction === "asc" ? -1 : 1;
      if (left > right) return direction === "asc" ? 1 : -1;
      return a.index - b.index;
    });
  }, [projectsWithMeta, sortDirection, sortKey]);

  const columns: Array<{ key: SortKey; label: string }> = [
    { key: "project", label: "Project" },
    { key: "typology", label: "Typology" },
    { key: "intervention", label: "Intervention" },
    { key: "place", label: "Place" },
    { key: "year", label: "Year" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <CustomCursor />
      <Header />

      <main className="page-main-offset flex flex-1 bg-[#e7e7e7]       text-black">
        <div className="w-full px-4 pb-12 md:px-16">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] table-fixed border-collapse font-mono text-base leading-snug md:text-xl">
              <colgroup>
                <col className="w-[4%]" />
                <col className="w-[38%]" />
                <col className="w-[12%]" />
                <col className="w-[14%]" />
                <col className="w-[16%]" />
                <col className="w-[6%]" />
                <col className="w-[10%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-neutral-900/15                 text-left font-sans text-base font-bold uppercase leading-none text-black md:text-xl">
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
                {sortedProjects.map((projectMeta, index) => {
                  const { project } = projectMeta;
                  const year = projectMeta.yearText || "—";
                  const number = (projectMeta.number || String(sortedProjects.length + 10 - index)).padStart(3, "0");

                  return (
                    <tr
                      key={project.slug}
                      className={`border-b border-neutral-900/10 align-top last:border-b-0 ${projectMeta.isLinkable ? "hover:font-bold" : ""}`}
                    >
                      <td className="py-3 pr-3 font-bold">{number}</td>
                      <td className="py-3 pr-3">
                        {projectMeta.isLinkable ? (
                          <Link
                            href={`/architecture/${project.slug}`}
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
                      <td className="py-3 pr-3">{projectMeta.typology || "—"}</td>
                      <td className="py-3 pr-3">{projectMeta.intervention || "—"}</td>
                      <td className="py-3 pr-3">{projectMeta.place || "—"}</td>
                      <td className="py-3 pr-3 text-right">{year}</td>
                      <td className="py-3 uppercase">{projectMeta.status || "—"}</td>
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
