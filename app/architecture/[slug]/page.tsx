"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import projects from "@/data/architecture-prj.json";
import typography from "@/styles/typography";

// ─────────────────── Chapter overlay hook ───────────────────────────────────
const useChapterOverlay = () => {
  const chapterRefs = useRef<Record<string, HTMLHeadingElement>>({});
  const [opacity, setOpacity] = useState(0);

  const register = (id: string) => (el: HTMLHeadingElement | null) => {
    if (el) chapterRefs.current[id] = el;
  };

  useEffect(() => {
    const onScroll = () => {
      const refs = Object.values(chapterRefs.current);
      if (!refs.length) return;
      const centerY = window.innerHeight / 2;
      const threshold = window.innerHeight * 0.35;
      let max = 0;
      refs.forEach((h) => {
        const rect = h.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - centerY);
        const pct = 1 - Math.min(1, dist / threshold);
        if (pct > max) max = pct;
      });
      setOpacity(max);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { opacity, register } as const;
};

// --- Typography-aware paragraph renderer ---
function renderParagraphs(
  text: string,
  opts?: { size?: keyof typeof typography.sizes; align?: "left" | "center" | "right"; className?: string }
) {
  const sizeClass = typography.sizes[opts?.size || "md"] || "";
  const alignClass = opts?.align === "left" ? "text-left" : opts?.align === "right" ? "text-right" : "text-center";
  const extra = opts?.className || "";
  return text.split(/\s*<p>\s*/).map((para, i) => (
    <p key={i} className={`${sizeClass} ${alignClass} ${extra}`}>{para}</p>
  ));
}

// ─────────────────── Main component ─────────────────────────────────────────
export default function ProjectPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const project = Array.isArray(projects)
    ? projects.find((p) => p.slug === slug)
    : null;
  if (!project) return notFound ? notFound() : <div>Not found</div>;

  const [showIntro, setShowIntro] = useState(true);
  useEffect(() => {
    if (!showIntro) return;
    const dismiss = () => {
      setShowIntro(false);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
    window.addEventListener("scroll", dismiss, { passive: true });
    window.addEventListener("pointerdown", dismiss);
    return () => {
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, [showIntro]);

  const { opacity, register } = useChapterOverlay();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Dynamic section refs for overlays/scroll
  const sectionCount = Array.isArray(project.sections) ? project.sections.length : 0;
  const sectionRefs = Array.from({ length: sectionCount }, () => useRef<HTMLElement | null>(null));

  return (
    <div className="bg-white">
      {/* Progress bar */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-[80]" />

      {/* Chapter tint overlay – disabled while intro splash is visible */}
      <AnimatePresence>
        {!showIntro && opacity > 0.05 && (
          <motion.div
            key="chapter-tint"
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ background: "#002F6C" }}
            className="fixed inset-0 z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <CustomCursor />

      {/* Header kept above intro splash */}
      <div className="relative z-[90]">
        <Header />
      </div>

      {/* Intro theme layer */}
      {showIntro && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider" style={{ background: "#002F6C", color: "white", letterSpacing: "0.1em" }}>
          {project.theme || project.title}
        </div>
      )}

      {/* Content */}
      <main className="w-full flex flex-col items-center bg-white">
        {(project.sections || []).map((section, idx) => {
          switch (section.type) {
            case "hero":
              return (
                <section ref={sectionRefs[idx]} key={idx} className="w-full h-screen flex items-center justify-center relative min-h-[80vh]">
                  <img src={section.image} alt={project.title} className="w-full h-full object-cover" />
                </section>
              );
            case "info":
              return (
                <section ref={sectionRefs[idx]} key={idx} className="w-full flex flex-col md:flex-row max-w-6xl mx-auto py-24 px-4 gap-12 items-stretch min-h-[60vh]">
                  <div className="flex-1 flex items-start">
                    <h2 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 uppercase">{project.title}</h2>
                  </div>
                  <div className="flex-1 flex flex-col gap-4 text-lg text-gray-700 max-w-xl">
                    {section.fields && Object.entries(section.fields).map(([label, value]) => (
                      <p key={label}><span className="font-bold">{label}:</span> {value}</p>
                    ))}
                    {section.text && renderParagraphs(
                      section.text,
                      {
                        size: "md", // always md for info text
                        align: (section as any)?.align || "left"
                      }
                    )}
                  </div>
                </section>
              );
            case "image": {
              // Support layout: left, right, center, landscape and size: S, M, XL
              const layout = (section as any).layout || "center";
              const size = (section as any).size || "M";
              let imageClass = "object-cover mb-6";
              let sectionClass = "w-full flex flex-col items-center mx-auto py-24 px-4 min-h-[60vh]";
              if (size === "S") {
                sectionClass += " max-w-md";
                imageClass += " w-full";
              } else if (size === "M") {
                sectionClass += " max-w-2xl";
                imageClass += " w-full";
              } else if (size === "XL") {
                sectionClass += " max-w-full";
                imageClass += " w-full";
              } else {
                sectionClass += " max-w-4xl";
                imageClass += " w-full";
              }
              if (layout === "left") {
                sectionClass += " md:items-start";
                imageClass += " md:mr-auto";
              } else if (layout === "right") {
                sectionClass += " md:items-end";
                imageClass += " md:ml-auto";
              } else if (layout === "landscape") {
                imageClass += " aspect-[16/9]";
              }
              // center is default
              return (
                <section ref={sectionRefs[idx]} key={idx} className={sectionClass}>
                  <img src={section.image} alt={section.caption || project.title} className={imageClass} />
                  {section.caption && renderParagraphs(
                    section.caption,
                    {
                      size: "sm", // always sm for captions
                      align: (section as any)?.captionAlign || "center",
                      className: "text-gray-700 max-w-2xl"
                    }
                  )}
                </section>
              );
            }
            case "imageRow": {
              const size = (section as any).size || "M";
              let imgClass = "object-cover mb-2 w-full";
              if (size === "S") {
                imgClass += " max-w-xs";
              } else if (size === "M") {
                imgClass += " max-w-md";
              } else if (size === "XL") {
                imgClass += " max-w-full";
              } else {
                imgClass += " max-w-lg";
              }
              return (
                <section ref={sectionRefs[idx]} key={idx} className="w-full flex flex-col items-center max-w-6xl mx-auto py-24 px-4 min-h-[40vh]">
                  <div className="flex flex-row gap-6 w-full justify-center">
                    {(section as any).images && (section as any).images.map((img: any, i: any) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <img src={img.src} alt={img.caption || project.title} className={imgClass} />
                        {img.caption && renderParagraphs(
                          img.caption,
                          {
                            size: "sm", // always sm for captions
                            align: (img as any)?.captionAlign || "center",
                            className: "text-gray-600 text-center"
                          }
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            case "centerText":
              return (
                <section ref={sectionRefs[idx]} key={idx} className="w-full flex flex-col items-center max-w-4xl mx-auto py-24 px-4 min-h-[40vh]">
                  <h3 className="text-xxl md:text-4xl font-bold text-center mb-8">{section.title}</h3>
                </section>
              );
            case "chapter":
              return (
                <section ref={sectionRefs[idx]} key={idx} className="w-full flex flex-col items-center justify-center min-h-[50vh] py-24 px-4">
                  <h2
                    ref={register(
                      typeof section.title === "string"
                        ? section.title.toLowerCase().replace(/\s/g, "-")
                        : `chapter-${idx}`
                    )}
                    className={`relative z-40 font-bold text-white uppercase tracking-wider mb-8 text-5xl md:text-7xl lg:text-8xl ${(section as { align?: "left" | "center" | "right" })?.align === "left"
                      ? "text-left"
                      : (section as { align?: "left" | "center" | "right" })?.align === "right"
                      ? "text-right"
                      : "text-center"
                    }`}
                    style={{ letterSpacing: "0.08em" }}
                  >
                    {section.title}
                  </h2>
                  {section.text && renderParagraphs(
                    section.text,
                    {
                      size: "md", // always md for chapter text
                      align: (section as any)?.textAlign || (section as any)?.align || "center"
                    }
                  )}
                </section>
              );
            case "text":
              return (
                <section ref={sectionRefs[idx]} key={idx} className="w-full flex flex-col items-center max-w-4xl mx-auto py-24 px-4 min-h-[40vh]">
                  {renderParagraphs(
                    section.text || "",
                    {
                      size: "md", // always md for text
                      align: (section as any)?.align || "center"
                    }
                  )}
                </section>
              );
            case "note":
              return (
                <section ref={sectionRefs[idx]} key={idx} className="w-full flex flex-col items-center max-w-3xl mx-auto py-8 px-4">
                  {renderParagraphs(
                    section.text || "",
                    {
                      size: "sm", // always sm for note
                      align: (section as any)?.align || "center",
                      className: "italic text-gray-500"
                    }
                  )}
                </section>
              );
          }
        })}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
