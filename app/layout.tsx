import React from "react";
import "@/app/globals.css";
import "@/styles/typography.js";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Arita Dreshaj",
  description: "Discover the projects, news, and articles published by Arita Dreshaj.",
  openGraph: {
    title: "Arita Dreshaj - Research & Architecture",
    description: "Discover the projects, news, and articles published by Arita Dreshaj.",
    url: "https://www.aritadreshaj.com/",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        />
        {/* Favicon and Apple Touch Icon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/icon-web.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-web.png" />
        {/* Structured Data for Person and Key Projects */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Arita Dreshaj",
              "url": "https://www.aritadreshaj.com/",
              "jobTitle": "Architect",
              "hasPart": [
                {
                  "@type": "CreativeWork",
                  "name": "Actual Projects",
                  "url": "https://www.aritadreshaj.com/actual"
                },
                {
                  "@type": "CreativeWork",
                  "name": "A Home, A Way (Research)",
                  "url": "https://www.aritadreshaj.com/research/a-home-a-way"
                }
              ]
            })
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}