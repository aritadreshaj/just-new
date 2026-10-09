"use client";

import { useParams, notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import projects from "@/data/architecture-prj.json";
import "@/styles/globals.css";

type Section =
  | { type: "hero"; image: string; caption?: string }
  | {
      type: "info";
      fields?: Record<string, string>;
      text?: string;
    }
  | {
      type: "image";
      image: string;
      caption?: string;
      size?: "S" | "M" | "L" | "XL";
    }
  | {
      type: "imageRow";
      images?: Array<{ src: string; caption?: string; size?: "S" | "M" | "L" | "XL" }>;
    }
  | { type: "chapter"; title?: string; text?: string }
  | { type: "text"; text?: string }
  | { type: "note"; text?: string }
  | { type: "fullscreenImage"; image: string; caption?: string };

type Project = {
  title: string;
  slug: string;
  isPublished?: boolean;
  status?: string;
  intervention?: string;
  sections?: Section[];
};

const titleFontSize = "1.875rem";

const FIELD_ORDER = [
  "Year",
  "Type",
  "Location",
  "Status",
  "Intervention",
  "Institution",
  "Developed at",
  "Client",
  "Collaborators",
  "Contractors",
];

const FIELD_ALIASES: Record<string, string> = {
  collaborator: "Collaborators",
  contractor: "Contractors",
};

const canonicalLabel = (label: string) => {
  const key = label.trim().toLowerCase();
  const alias = FIELD_ALIASES[key];
  if (alias) return alias;
  return FIELD_ORDER.find((name) => name.toLowerCase() === key) ?? label.trim();
};

const isFilled = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "" && value.trim().toLowerCase() !== "false";

function getInfoFields(project: Project, fields: Record<string, string> = {}) {
  const merged = new Map<string, string>();

  Object.entries(fields).forEach(([label, value]) => {
    const name = canonicalLabel(label);
    if (isFilled(value) && !merged.has(name)) merged.set(name, value.trim());
  });

  if (isFilled(project.status)) merged.set("Status", project.status.trim());
  if (isFilled(project.intervention)) merged.set("Intervention", project.intervention.trim());

  const rank = (label: string) => {
    const index = FIELD_ORDER.indexOf(label);
    return index === -1 ? FIELD_ORDER.length : index;
  };

  return [...merged.entries()]
    .map((entry, position) => ({ entry, position }))
    .sort((a, b) => rank(a.entry[0]) - rank(b.entry[0]) || a.position - b.position)
    .map(({ entry }) => entry);
}

function renderParagraphs(text?: string, className = "") {
  if (!text) return null;
  return text
    .split(/\s*<p>\s*/)
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index} className={className}>
        {paragraph}
      </p>
    ));
}

function getImageMaxWidth(size?: "S" | "M" | "L" | "XL") {
  if (size === "S") return "480px";
  if (size === "M") return "768px";
  if (size === "XL") return "100%";
  return "1000px";
}

export default function ArchitectureProjectPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const project = (projects as Project[]).find((item) => item.slug === slug);
  if (!project) return notFound();
  if (project.isPublished !== true) return notFound();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CustomCursor />
      <Header />

      <div className="margin-rule flex-1">
        <main className="page-main-offset pb-24">
          <h1
            className="font-bold text-black mb-10"
            style={{ fontSize: titleFontSize, lineHeight: 1.15 }}
          >
            {project.title}
          </h1>

          <div className="space-y-16">
            {(project.sections || []).map((section, index) => {
              if (section.type === "hero" || section.type === "fullscreenImage") {
                return (
                  <section key={index} className="w-full">
                    <img
                      src={section.image}
                      alt={`Arita Dreshaj – ${project.title}`}
                      className="w-full h-auto object-cover"
                    />
                    {section.caption && (
                      <div className="mt-3 text-sm text-neutral-500">
                        {renderParagraphs(section.caption)}
                      </div>
                    )}
                  </section>
                );
              }

              if (section.type === "image") {
                return (
                  <section key={index} className="w-full">
                    <div style={{ maxWidth: getImageMaxWidth(section.size) }}>
                      <img
                        src={section.image}
                        alt={`Arita Dreshaj – ${project.title}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    {section.caption && (
                      <div className="mt-3 text-sm text-neutral-500">
                        {renderParagraphs(section.caption)}
                      </div>
                    )}
                  </section>
                );
              }

              if (section.type === "imageRow") {
                return (
                  <section key={index} className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(section.images || []).map((image, imageIndex) => (
                        <div key={imageIndex}>
                          <img
                            src={image.src}
                            alt={`Arita Dreshaj – ${project.title}`}
                            className="w-full h-auto object-cover"
                          />
                          {image.caption && (
                            <div className="mt-2 text-sm text-neutral-500">
                              {renderParagraphs(image.caption)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (section.type === "info") {
                return (
                  <section key={index} className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2 text-neutral-700">
                      {getInfoFields(project, section.fields).map(([label, value]) => (
                        <p key={label}>
                          <span className="font-semibold text-black">{label}:</span> {value}
                        </p>
                      ))}
                    </div>
                    <div className="space-y-4 text-neutral-700 leading-relaxed">
                      {renderParagraphs(section.text)}
                    </div>
                  </section>
                );
              }

              if (section.type === "chapter") {
                return (
                  <section key={index} className="w-full space-y-4">
                    {section.title ? (
                      <h2 className="text-2xl md:text-3xl font-semibold text-black">{section.title}</h2>
                    ) : null}
                    <div className="space-y-4 text-neutral-700 leading-relaxed">
                      {renderParagraphs(section.text)}
                    </div>
                  </section>
                );
              }

              if (section.type === "text") {
                return (
                  <section key={index} className="w-full space-y-4 text-neutral-700 leading-relaxed">
                    {renderParagraphs(section.text)}
                  </section>
                );
              }

              if (section.type === "note") {
                return (
                  <section key={index} className="w-full text-sm italic text-neutral-500 leading-relaxed">
                    {renderParagraphs(section.text)}
                  </section>
                );
              }

              return null;
            })}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
