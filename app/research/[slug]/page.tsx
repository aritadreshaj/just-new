// Import necessary modules and components
"use client";

import projectsData from '@/data/research-prj.json'; // Import project data
import { useParams } from 'next/navigation'; // For accessing dynamic route parameters
import Link from 'next/link'; // For navigation links
import React, { useState, useEffect } from 'react'; // React hooks for state management
import Header from '@/components/Header'; // Header component
import Footer from '@/components/Footer'; // Footer component
import CustomCursor from '@/components/CustomCursor'; // Custom cursor component
import NavigationArrows from '@/components/NavigationArrows'; // Navigation arrows for project navigation
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
  theme?: string;
  content: string;
  layout: string;
  category: string;
  images: string[];
  collaborator?: string;
  private?: boolean;
  linkCategory?: {
    text: string;
    url: string;
    active?: boolean;
  };
};

// Explicitly type the projects array
const projects: Project[] = projectsData;

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

  // Filter out private projects
  const publicProjects = projects.filter((project) => !project.private);

  // Sort public projects by date in descending order
  const sortedProjects = publicProjects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Find the index of the current project and determine the previous and next public projects
  const projectIndex = sortedProjects.findIndex((p) => p.slug === slug);
  const prevProject =
    projectIndex + 1 < sortedProjects.length
      ? sortedProjects[projectIndex + 1]
      : sortedProjects[0];
  const nextProject =
    projectIndex - 1 >= 0
      ? sortedProjects[projectIndex - 1]
      : sortedProjects[sortedProjects.length - 1];

  return (
    <div className="min-h-screen flex flex-col relative bg-white" style={{ overflowX: "hidden" }}>
      <CustomCursor />
      <Header />
      <main className="flex-1 flex flex-col px-0" style={{ minHeight: 0, paddingTop: "6rem", paddingBottom: "5rem", overflowX: "hidden" }}>
        <div className="margin-rule flex flex-col items-center" style={{ boxSizing: "border-box", marginTop: 0 }}>
          {/* Centered image and text, both inside margin-rule (60% width) */}
          <div className="flex flex-col items-center w-full">
            <div className="aspect-[21/9] bg-gray-200 flex items-center justify-center shadow overflow-hidden w-full max-h-[320px]" style={{ marginTop: 0, borderRadius: 0 }}>
              <img
                src={project.images[0]}
                alt={`Arita Dreshaj – ${project.title}`}
                className="object-cover w-full h-full"
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderRadius: 0,
                }}
              />
            </div>
            {/* Text underneath the image */}
            <div className="w-full mt-8">
              <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
              <p className="text-neutral-700 mb-2"><span className="font-semibold">Publisher:</span> {project.publisher || 'N/A'}</p>
              <p className="text-neutral-700 mb-2"><span className="font-semibold">Institute:</span> {project.institute || 'N/A'}</p>
              <p className="text-neutral-700 mb-2"><span className="font-semibold">Location:</span> {project.location}</p>
              <p className="text-neutral-700 mb-2"><span className="font-semibold">Date:</span> {project.date}</p>
              <p className="text-neutral-700 mb-2"><span className="font-semibold">Theme:</span> {project.theme || 'N/A'}</p>
              <p className="text-neutral-700 mb-6">{project.content}</p>
              {project.linkCategory && project.linkCategory.active && project.linkCategory.text && project.linkCategory.url && (
                <div className="mt-8">
                  <Link
                    href={project.linkCategory.url}
                    className="italic underline text-[#ff6000]"
                  >
                    {project.linkCategory.text}
                  </Link>
                </div>
              )}
              {project.collaborator && (
                <p className="text-neutral-700 mt-4"><span className="font-semibold">Collaborator:</span> {project.collaborator}</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <NavigationArrows
        prevProjectUrl={prevProject ? `/research/${prevProject.slug}` : null}
        nextProjectUrl={nextProject ? `/research/${nextProject.slug}` : null}
      />
      <Footer />
    </div>
  );
}