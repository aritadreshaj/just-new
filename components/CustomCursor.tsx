"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    // Disable custom cursor on touch devices or small screens
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768)
    ) {
      // Ensure default cursor is visible on mobile/touch devices
      document.body.style.cursor = "";
      return;
    }

    // Create the custom cursor element
    const cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    cursor.style.position = "fixed";
    cursor.style.width = "12px";
    cursor.style.height = "12px";
    cursor.style.borderRadius = "50%";
    cursor.style.backgroundColor = "#ff6000"; // Default color is orange
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "9999";
    cursor.style.transform = "translate(-50%, -50%)";
    cursor.style.transition = "background-color 0.2s ease, transform 0.1s ease";
    document.body.appendChild(cursor);

    // Hide the default cursor globally
    document.body.style.cursor = "none";

    // Apply `cursor: none` to all clickable elements
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important; /* Disable the default hand cursor globally */
      }
    `;
    document.head.appendChild(style);

    const isClickable = (element: HTMLElement | null) => {
      if (!element) return false;

      if (
        element.closest(
          'a, button, [role="button"], [role="link"], summary, label[for], input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [onclick], [tabindex]:not([tabindex="-1"]), [data-clickable="true"]',
        )
      ) {
        return true;
      }

      let current: HTMLElement | null = element;
      while (current) {
        if (window.getComputedStyle(current).cursor === "pointer") {
          return true;
        }
        current = current.parentElement;
      }

      return false;
    };

    // Move the custom cursor with the mouse and switch color on clickable targets
    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      const target = e.target as HTMLElement | null;
      cursor.style.backgroundColor = isClickable(target) ? "black" : "#ff6000";
    };

    // Add event listeners
    document.addEventListener("mousemove", moveCursor);

    // Cleanup on component unmount
    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.body.style.cursor = ""; // Restore the default cursor
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style); // Remove the added style
      }
    };
  }, []);

  return null; // This component doesn't render anything directly
}