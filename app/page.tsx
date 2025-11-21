"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import "../styles/globals.css";
import mainPageProjects from "@/data/main-page.json";
import Link from "next/link";

export default function Home() {
  const projects = (mainPageProjects as any) || [];

  // Minimal, data-driven 3-column layout. Add projects to `data/main-page.json`.
  // List all projects in their respective columns
  // Sort projects by date (descending, newest first)
  function sortByDate(arr: any[]) {
    return arr.slice().sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      return db - da;
    });
  }

  const leftProjects = sortByDate(projects.filter((p: any) => p.column === "left" || p.side === "left"));
  const rightProjects = sortByDate(projects.filter((p: any) => p.column === "right" || p.side === "right"));

  // State for middle column text and hovered project
  const React = require('react');
  const [hoverStates, setHoverStates] = React.useState(leftProjects.map(() => false));

  return (
    <div className="min-h-screen flex flex-col">
      <CustomCursor />
      <Header />

      <main className="flex-1 px-4 md:px-8" style={{ paddingTop: 100 }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left column: all left projects */}
          <div className="md:col-span-6">
            {leftProjects.map((project: any, idx: number) => (
              <div key={project.id} className="mb-12">
                <div
                  className="w-full min-h-[60vh] bg-neutral-100 relative overflow-hidden"
                  onMouseEnter={() => {
                    const newStates = [...hoverStates];
                    newStates[idx] = true;
                    setHoverStates(newStates);
                  }}
                  onMouseLeave={() => {
                    const newStates = [...hoverStates];
                    newStates[idx] = false;
                    setHoverStates(newStates);
                  }}
                >
                  {project.link && project.link !== "false" ? (
                    <Link href={project.link}>
                      <img
                        src={project.heroImage}
                        alt={project.alt?.hero || project.title}
                        className="absolute inset-0 w-full h-full object-cover object-center cursor-pointer"
                      />
                    </Link>
                  ) : (
                    <img
                      src={project.heroImage}
                      alt={project.alt?.hero || project.title}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  )}
                </div>
                <div className="pt-4">
                  {project.link && project.link !== "false" ? (
                    <Link href={project.link}>
                      <h2 className="text-xl font-semibold cursor-pointer">{project.title || ""}</h2>
                    </Link>
                  ) : (
                    <h2 className="text-xl font-semibold">{project.title || ""}</h2>
                  )}
                  <p className="text-lg text-neutral-700">{project.excerpt || project.credits || ""}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Middle column: info + hover description for left image */}
          <div className="md:col-span-3 flex flex-col items-start" style={{ position: 'relative', height: '100%' }}>
            {leftProjects.map((project: any, idx: number) => (
              <div
                key={project.id}
                className="mb-12 w-full"
                style={{ position: 'absolute', top: `calc(${idx} * 66vh + ${idx} * 1rem + 1rem)` }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: '70px' }}>
                  {hoverStates[idx] ? (
                    <>
                      <h3 className="text-2xl font-semibold mb-2" style={{ visibility: 'hidden', height: 0, margin: 0, padding: 0 }}>{project.title || ""}</h3>
                      <p className="text-4xl mt-2">{project.description || project.excerpt || ""}</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold mb-2">{project.title || ""}</h3>
                      <div className="text-2xl mb-1">{project.location || ""}</div>
                      <div className="text-2xl mb-1">{project.theme || ""}</div>
                      {project.collaborator && project.collaborator !== "false" && (
                        <div className="text-2xl mb-1">{project.collaborator}</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right column: all right projects */}
          <div
            className="md:col-span-3"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              width: '25%',
              height: '100vh',
              overflowY: 'hidden',
              background: 'white',
              zIndex: 10,
              scrollbarWidth: 'none', // Firefox
            }}
            onMouseEnter={e => {
              e.currentTarget.style.overflowY = 'auto';
              e.currentTarget.style.scrollbarWidth = 'none';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.overflowY = 'hidden';
            }}
          >
            <style>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
            <div className="no-scrollbar">
              {rightProjects.map((project: any) => (
                <div key={project.id} className="mb-12">
                  <div className="w-full min-h-[80vh] bg-neutral-100 relative overflow-hidden">
                    {project.link && project.link !== "false" ? (
                      <Link href={project.link}>
                        <img
                          src={project.portraitImage || project.heroImage}
                          alt={project.alt?.portrait || project.title}
                          className="absolute inset-0 w-full h-full object-cover object-center cursor-pointer"
                        />
                      </Link>
                    ) : (
                      <img
                        src={project.portraitImage || project.heroImage}
                        alt={project.alt?.portrait || project.title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                  <div className="pt-4">
                    {project.link && project.link !== "false" ? (
                      <Link href={project.link}>
                        <h4 className="text-lg font-semibold cursor-pointer">{project.title || ""}</h4>
                      </Link>
                    ) : (
                      <h4 className="text-lg font-semibold">{project.title || ""}</h4>
                    )}
                    <p className="text-lg text-neutral-700">{project.excerpt || project.credits || ""}</p>
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
