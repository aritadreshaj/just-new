import React from "react";
import "@/app/globals.css";
import "@/styles/typography.js";
import { ThemeProvider } from "@/components/theme-provider";
import CustomCursor from "@/components/CustomCursor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aritadreshaj.com"),

  title: "Arita Dreshaj | Research & Architecture",

  description:
    "Engaging with transformation, memory, identity, and the continued life of existing spaces.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Arita Dreshaj | Research & Architecture",
    description:
      "Engaging with transformation, memory, identity, and the continued life of existing spaces.",
    url: "/",
    siteName: "Arita Dreshaj",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Arita Dreshaj | Research & Architecture",
    description:
      "Engaging with transformation, memory, identity, and the continued life of existing spaces.",
  },

  icons: {
    icon: "/icon-web.png",
    apple: "/icon-web.png",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.aritadreshaj.com/#arita-dreshaj",

  name: "Arita Dreshaj",
  url: "https://www.aritadreshaj.com/",

  jobTitle: "Architect and Researcher",

  description:
    "Arita Dreshaj is an architect and researcher working across transformation, memory, identity, and the continued life of existing spaces.",

  sameAs: [
    // Add ONLY profiles that belong to you:
    // "https://www.instagram.com/aritadreshaj/",
    // "https://www.linkedin.com/in/YOUR_PROFILE/",
    // "https://lina.community/projects/5c811c36-53e4-428d-a244-12d46becf099/L",
    // "https://www.competitionline.com/de/personen/arita-dreshaj-272192",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </head>

      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}