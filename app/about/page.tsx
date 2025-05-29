"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import "@/styles/globals.css";

// Category data and content
const aboutSections = [
	{
		label: "Philosophy",
		content: (
			<>
				<p>
					Positioned at the intersection of architecture and research, grounded in an exploration of space,
           identity, and memory. Each project begins with an observation: of the physical, historical, and social
            context, not as constraint, but as material. This approach translates into careful attention to reuse, spatial structure, and the tactility of construction, bridging conceptual thinking with grounded intervention.
				</p>
			</>
		),
	},
	{
		label: "Background",
		content: (
			<>
				<p>
					Arita Dreshaj is trained as an architect and urban designer, with a Master's degree from
					Technical University of Berlin and a Bachelor's degree
					from the University of Prishtina. Her academic path includes an Erasmus+ exchange at the Dessau Institute 
          of Architecture, where she deepened her engagement with conceptual and international design approaches, 
          and several scholarships, including the Deutschlandstipendium, awarded by the German Federal Ministry of 
          Education (BMBF) to high-achieving students. She has worked on numerous public and
					private projects in Germany, France, and Kosova, both independently and
					in collaboration with architecture and planning offices.
				</p>
			</>
		),
	},
	{
		label: "Practice",
		content: (
			<>
				<p>
					The practice works across housing, adaptive reuse, and urban-scale studies, with a focus 
          on edge conditions, residual spaces, and the transformation of the built environment. 
          Projects span from early conceptual frameworks to detailed architectural design, and are developed 
          through competitions, collaborations, and independent research.
				</p>
				<p className="mt-4">
					Several awards and academic contributions reflect an ongoing
					interest in the evolving relationship between architecture, landscape,
					and the public domain.
				</p>
			</>
		),
	},
	{
		label: "Contact",
		content: (
			<>
				<p>
					Arita Dreshaj
					<br />
					Between Berlin & Prishtina
				</p>
				<p className="mt-4">
					For project inquiries, or collaborations, please get in touch via email:
					<br />
					<a
						href="mailto:info@aritadreshaj.com"
						className="text-[#ff6000]"
					>
						info@aritadreshaj.com
					</a>
				</p>
			</>
		),
	},
];

export default function AboutPage() {
	return (
		<>
			<CustomCursor />
			<Header />
			<div className="min-h-screen flex flex-col relative bg-white">
				<div className="margin-rule flex-1 flex flex-col" style={{ flex: "1 0 auto" }}>
					<main className="flex flex-1 pt-40 pb-24" style={{ minHeight: 0, overflowY: "auto" }}>
						{/* Left: Categories and Content */}
						<section className="flex flex-1 h-full">
							{/* Use a grid to align category and content rows */}
							<div
								className="w-full grid"
								style={{
									gridTemplateColumns: "max-content 2.5rem 1px 2.5rem auto",
									alignItems: "start",
									height: "100%",
								}}
							>
								{aboutSections.map((section, idx) => (
									<React.Fragment key={section.label}>
										{/* Category label, aligned with first line of content */}
										<div className="flex items-start justify-end pr-0">
											<span
												className="font-bold text-2xl tracking-wide"
												style={{
													color: "#222",
													lineHeight: 1.2,
													letterSpacing: "0.01em",
													fontWeight: 700,
													display: "inline-block",
													minWidth: "max-content",
												}}
											>
												{section.label}
											</span>
										</div>
										{/* Offset between category and divider */}
										<div />
										{/* Vertical Divider */}
										<div
											style={{
												width: "1px",
												background: "#d4d4d4",
												minHeight: "100%",
											}}
										/>
										{/* Offset between divider and content */}
										<div />
										{/* Content */}
										<div
											className="text-lg text-neutral-800 leading-relaxed mb-16"
											style={{ width: "100%", maxWidth: "100%" }}
										>
											{section.content}
										</div>
									</React.Fragment>
								))}
							</div>
						</section>
					</main>
				</div>
				<Footer />
			</div>
		</>
	);
}