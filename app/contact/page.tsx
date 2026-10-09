"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import "@/styles/globals.css";

const linkClass =
  "transition-colors duration-200 hover:text-[#ff5a00] focus-visible:text-[#ff5a00] active:text-[#ff0000]";

const legal = [
  {
    title: "Liability for content",
    text: "The content of this website has been prepared with due care. However, no guarantee is given for its accuracy, completeness or currentness.",
  },
  {
    title: "Liability for external links",
    text: "This website contains links to external websites over whose content I have no control. Responsibility for the content of linked pages lies with their respective operators. If I become aware of unlawful content, the relevant links will be removed.",
  },
  {
    title: "Copyright",
    text: "Unless otherwise indicated, the texts, images, drawings and other content on this website are protected by copyright. Reproduction, modification or use beyond what is permitted by law requires prior permission from the respective rights holder.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <CustomCursor />
      <Header />

      <div className="margin-rule flex-1 flex flex-col" style={{ flex: "1 0 auto" }}>
        <main className="page-main-offset flex-1 pb-16 text-base leading-snug text-black md:pb-24 md:text-xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            <div className="space-y-6">
              <p>
                For collaborations, commissions, research and other enquiries, get in touch:
                                <br />
                <br />
                <a href="mailto:info@aritadreshaj.com" className={`break-words ${linkClass}`}>
                  info@aritadreshaj.com
                </a>
                <br />
                <a
                  href="https://instagram.com/aritadreshaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  @aritadreshaj
                </a>
              </p>

              <p>
                Based between:
                <br />
                Berlin and Prishtina
              </p>

              <p>
                USt-IdNr.:
                <br />
                DE465370002
              </p>
            </div>

            <div className="space-y-6">
              {legal.map(({ title, text }) => (
                <section key={title}>
                  <h2 className="uppercase">{title}</h2>
                  <p className="text-neutral-500">{text}</p>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
