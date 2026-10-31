// Import necessary modules and components
"use client";

import projectsData from '@/data/research-prj.json'; // Import project data
import { useParams } from 'next/navigation'; // For accessing dynamic route parameters
import Link from 'next/link'; // For navigation links
import React, { useState, useEffect } from 'react'; // React hooks for state management
import Header from '@/components/Header'; // Header component
import Footer from '@/components/Footer'; // Footer component
import CustomCursor from '@/components/CustomCursor'; // Custom cursor component
import MarkdownText, { InlineMarkdown } from '@/components/MarkdownText'; // Safe Markdown rendering for descriptions
import '@/styles/typography.js'; // Typography styles
import '@/styles/project-page.css'; // Project-specific styles
import "../../../styles/globals.css"; // Global styles

// Define the type for a project
type Project = {
  title: string;
  slug: string;
  date: string;
  location: string;
  publisher?: string;
  institute?: string;
  isbn?: string; // Optional, shown only when provided
  theme?: string;
  content: string | string[]; // Markdown; an array is treated as one paragraph per item
  layout: string;
  category: string;
  role?: string;
  images: (string | { src: string; caption?: string })[]; // a plain path, or { "src": "...", "caption": "..." }
  portraitImages?: { src: string; caption?: string }[];
  collaborator?: string;
  private?: boolean;
  // Optional extra information, shown only when provided
  extraParagraphs?: string[];
  gallery?: { src: string; caption?: string }[];
  video?: string; // e.g. "/videos/file.mp4" or an embed URL (YouTube/Vimeo)
  links?: { text: string; url: string }[];
  linkCategory?: {
    text: string;
    url: string;
    active?: boolean;
  };
};

// Explicitly type the projects array
const projects: Project[] = projectsData;

const imageSrc = (img: Project["images"][number]) => (typeof img === "string" ? img : img.src);

export default function ProjectPage() {
  // Extract the slug parameter from the URL
  const params = useParams() as Record<string, string | string[]> | null;
  const slug = params?.slug;

  // If the slug is not available, show a loading message
  if (!slug) {
    return <p>Loading...</p>;
  }

  // Find the project that matches the slug
  const project = projects.find((project: { slug: string | string[]; }) => project.slug === slug);

  // If the project is not found, show an error message
  if (!project) {
    return <p>Project not found</p>;
  }

  // If the project is private, prevent access
  if (project.private) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">This project is private and currently unavailable.</h1>
        <Link href="/research">
          <span className="text-blue-500 underline mt-4 cursor-pointer">Go back to Research</span>
        </Link>
      </div>
    );
  }

  // Every other project, newest first, starting with the one right after the current project (older ones),
  // then wrapping around to the newer ones. The current project is excluded to avoid repetition.
  const byDate = [...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentIndex = byDate.findIndex((p) => p.slug === project.slug);
  const otherProjects = [...byDate.slice(currentIndex + 1), ...byDate.slice(0, currentIndex)];

  return (
    <div className="min-h-screen flex flex-col relative bg-white" style={{ overflowX: "hidden" }}>
      <CustomCursor />
      <Header />
      <main className="flex-1 flex flex-col px-0 page-main-offset pb-20" style={{ minHeight: 0, overflowX: "hidden" }}>
        <div className="margin-rule flex flex-col" style={{ boxSizing: "border-box", marginTop: 0 }}>
          <div className="w-full text-black">
            {/* Title (left), theme as subtitle (right), close button */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 pb-10">
              <h1 className="font-bold leading-[1.02] text-4xl md:text-6xl" style={{ letterSpacing: "-0.02em" }}>
                {project.title}
              </h1>
              <div className="flex flex-col items-start md:items-end gap-6">
                {project.theme && (
                  <p className="font-bold leading-tight text-xl md:text-3xl md:text-right">{project.theme}</p>
                )}
                <Link href="/research" aria-label="Close">
                  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <line x1="2" y1="2" x2="34" y2="34" />
                    <line x1="34" y1="2" x2="2" y2="34" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="border-t border-neutral-300" />

            <div className="pt-10 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                {[
                  ["Publisher", project.publisher?.trim()],
                  ["Institute", project.institute?.trim()],
                  ["Location", project.location],
                  ["ISBN", project.isbn?.trim()],
                ].map(([label, value]) =>
                  value ? (
                    <p key={label} className="font-bold text-base md:text-lg mb-3 max-w-[60ch]">
                      {value}
                    </p>
                  ) : null
                )}
              </div>
              {project.collaborator && (
                <p className="text-base md:text-lg mb-3 text-right sm:shrink-0 sm:whitespace-nowrap">
                  {project.collaborator}
                </p>
              )}
            </div>
            <div>
              <div className="research-prose mt-[28px] mb-10">
                <MarkdownText>
                  {[project.content, ...(project.extraParagraphs ?? [])].flat().filter(Boolean).join("\n\n")}
                </MarkdownText>
              </div>
              {project.video && (
                <div className="mb-6 aspect-video w-full bg-black">
                  {/\.(mp4|webm|ogg)$/i.test(project.video) ? (
                    <video src={project.video} controls className="w-full h-full" />
                  ) : (
                    <iframe
                      src={project.video}
                      title={project.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  )}
                </div>
              )}
              {(() => {
                const gallery = project.gallery?.length
                  ? project.gallery
                  : project.images.map((img) => (typeof img === "string" ? { src: img, caption: "" } : img));
                const portraitGallery = project.portraitImages && project.portraitImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1" aria-label="Portrait images">
                    {project.portraitImages.map((item, i) => (
                      <figure key={item.src}>
                        <img
                          src={item.src}
                          alt={item.caption || `${project.title} – portrait ${i + 1}`}
                          className="block aspect-[3/4] w-full object-cover"
                        />
                        {item.caption && (
                          <figcaption className="research-prose research-caption mt-2">
                            <InlineMarkdown>{item.caption}</InlineMarkdown>
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                ) : null;
                const portraitsAfterGallery = project.slug === "rilindja-revealed";
                return gallery.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    {!portraitsAfterGallery && portraitGallery}
                    {gallery.map((item, i) => (
                      <figure key={i}>
                        <img
                          src={item.src}
                          alt={item.caption || `${project.title} – image ${i + 1}`}
                          className="w-full h-auto block"
                        />
                        {item.caption && (
                          <figcaption className="research-prose research-caption mt-2"><InlineMarkdown>{item.caption}</InlineMarkdown></figcaption>
                        )}
                      </figure>
                    ))}
                    {portraitsAfterGallery && portraitGallery}
                  </div>
                ) : null;
              })()}
              {project.links && project.links.length > 0 && (
                <ul className="mb-6">
                  {project.links.map((l) => (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="underline text-[#ff6000]">
                        {l.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {project.linkCategory && project.linkCategory.active && project.linkCategory.text && project.linkCategory.url && (
                <div className="mt-8 mb-6">
                  <Link
                    href={project.linkCategory.url}
                    className="italic underline text-[#ff6000]"
                  >
                    {project.linkCategory.text}
                  </Link>
                </div>
              )}
            </div>

            {/* Scrollable overview of all projects at the end of the page */}
            <ProjectStrip projects={otherProjects} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Horizontal overview of all projects that scrolls in a loop. Only public projects are clickable.
function ProjectStrip({ projects }: { projects: Project[] }) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const scrollSettleTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = projects.length;

  // Width of one full set of cards (including gaps); the list is rendered three times
  const setWidth = () => {
    const el = scroller.current;
    if (!el || count === 0 || el.children.length <= count) return 0;
    return (el.children[count] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
  };

  // Keep the scroll position inside the middle copy after scrolling has settled.
  const recenter = () => {
    const el = scroller.current;
    const w = setWidth();
    if (!el || !w) return;
    if (el.scrollLeft < w * 0.5) el.scrollLeft += w;
    else if (el.scrollLeft >= w * 1.5) el.scrollLeft -= w;
  };

  useEffect(() => {
    const el = scroller.current;
    const w = setWidth();
    if (el && w) el.scrollLeft = w;
  }, [count]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el || el.children.length < 2) return;
    const step = (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
    const target = Math.round(el.scrollLeft / step) * step + direction * step * 2;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  React.useEffect(() => () => {
    if (scrollSettleTimer.current) clearTimeout(scrollSettleTimer.current);
  }, []);

  // Original black arrow images, placed over the left and right edges of the strip
  const arrow = (side: "left" | "right") => (
    <button
      type="button"
      aria-label={side === "left" ? "Scroll to previous projects" : "Scroll to next projects"}
      onClick={() => scrollByCard(side === "left" ? -1 : 1)}
      className={`absolute top-[calc(50%-1.5rem)] z-10 -translate-y-1/2 p-2 hidden sm:block ${side === "left" ? "left-1" : "right-1"}`}
    >
      <img src={side === "left" ? "/next.png" : "/previous.png"} alt="" className="h-8 w-8" />
    </button>
  );

  return (
    <div className="border-t border-neutral-300 pt-6 relative">
      {arrow("left")}
      {arrow("right")}
      <div
        ref={scroller}
        onScroll={() => {
          if (scrollSettleTimer.current) clearTimeout(scrollSettleTimer.current);
          scrollSettleTimer.current = setTimeout(recenter, 150);
        }}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {[0, 1, 2].flatMap((copy) =>
          projects.map((p) => {
            const card = (
              <>
                <div className="w-full aspect-[4/3] bg-gray-200 overflow-hidden">
                  <img src={imageSrc(p.images[0])} alt={copy === 1 ? p.title : ""} className="w-full h-full object-cover grayscale block" />
                </div>
                <span className="block mt-3 font-bold text-lg">{p.title}</span>
              </>
            );
            const cardClass = "block shrink-0 snap-start basis-[calc(50%-0.75rem)]";
            const key = `${copy}-${p.slug}`;
            return p.private ? (
              <div key={key} className={`${cardClass} opacity-60`} aria-hidden={copy !== 1 || undefined}>{card}</div>
            ) : (
              <Link
                key={key}
                href={`/research/${p.slug}`}
                className={cardClass}
                aria-hidden={copy !== 1 || undefined}
                tabIndex={copy !== 1 ? -1 : undefined}
              >
                {card}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}