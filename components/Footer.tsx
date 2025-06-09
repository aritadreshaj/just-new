import typography from "@/styles/typography"; // Import the typography configuration
import "../styles/project-page.css";

export default function Footer({ className, fixed = false }: { className?: string, fixed?: boolean }) {
  return (
    <footer
      className={`border-t border-neutral-200 bg-white py-4 ${fixed ? 'fixed left-0 right-0 bottom-0 z-50' : ''} ${className || ''}`}
      style={fixed ? { width: '100vw' } : {}}
    >
      <div className="container mx-auto text-center">
        <p className={`${typography.sizes.xs} ${typography.colors.darkGray}`}>
          © 2024 Arita Dreshaj. All rights reserved.
        </p>
      </div>
    </footer>
  );
}