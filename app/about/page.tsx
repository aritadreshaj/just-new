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
					The work of Arita Dreshaj moves between architecture and research, grounded in an exploration of space,
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
					Arita Dreshaj holds a Master of Science from the
					Technical University of Berlin and a Bachelor's degree
					from the University of Prishtina. Her academic path also includes an Erasmus+
					exchange at the Dessau Institute of Architecture, where she deepened her
					engagement with conceptual and international design approaches. She has worked on numerous public and
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
					The work is developed across different scales, from concept and research
					to detailed design. The practice engages in public competitions, private
					commissions, and research-driven studies. Current work includes housing
					concepts, adaptive reuse strategies, and spatial studies on urban
					peripheries.
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
					Berlin, Deutschland
					<br />
					<a
						href="mailto:info@aritadreshaj.com"
						className="text-[#ff6000]"
					>
						info@aritadreshaj.com
					</a>
					<br />
				</p>
			</>
		),
	},
];

export default function AboutPage() {
	return (
		<div className="min-h-screen flex flex-col relative bg-white">
			<CustomCursor />
			<Header />
			<div className="margin-rule flex-1 flex flex-col" style={{ flex: "1 0 auto" }}>
				<main className="flex flex-1 py-24" style={{ minHeight: 0, overflowY: "auto" }}>
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
			<style jsx global>{`
				header {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					z-index: 50;
				}
				footer {
					position: fixed;
					bottom: 0;
					left: 0;
					right: 0;
					z-index: 50;
				}
			`}</style>
		</div>
	);
}