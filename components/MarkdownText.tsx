"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

// Renders Markdown (*italic*, **bold**, ***bold italic***, links, paragraphs, line breaks) as React elements.
// No raw HTML is rendered, and react-markdown strips unsafe URLs such as javascript: links.
export default function MarkdownText({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkBreaks]}
      skipHtml
      components={{
        p: ({ children }) => <p className="research-prose-p">{children}</p>,
        a: ({ href, children }) => {
          const external = !!href && /^https?:\/\//i.test(href);
          return (
            <a
              href={href}
              className="underline underline-offset-2 text-[#ff6000]"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

// Inline-only Markdown (*italic*, **bold**) for short texts such as titles.
export function InlineMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown skipHtml allowedElements={["p", "em", "strong"]} unwrapDisallowed components={{ p: ({ children }) => <>{children}</> }}>
      {children}
    </ReactMarkdown>
  );
}
