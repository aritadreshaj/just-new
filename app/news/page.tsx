"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import "@/styles/globals.css";

// Example news data (replace with your own or fetch dynamically)
const newsItems = [
	{
		date: "2025-04-17",
		title: "“Unbounded Spaces” part of the Atlantis Magazine at TU Delft",
		summary:
			"Looking through windows, real or imagined, to ask what belonging might mean when identity is fluid, unfinished, and alive.",
		projectLink: "https://drive.google.com/file/d/1CG-Da1FQmou52bolnD_uVE7un5ciL1Ip/view",
		place: "Delft, Netherlands",
	},
    	{
		date: "2025-01-20",
		title: "1st Place in Paris Social Housing Competition",
		summary:
			"173 apartments and 4 commercial spaces, with an amazing courtyard at Avenue de France. Contributed to the project as part of the team at LIN, in collaboration with Catherine Trabaljar and CSA Architects.",
		projectLink: "https://trebeljahr-architecte.net/projet.html?id=6DMdF1Xb5OvSBVqDu0xp",
		place: "Paris, France",
	},
        	{
		date: "2024-12-11",
		title: "Awarded 3rd place for the Bahnhofsquartier Leverkusen Mitte Competition",
		summary:
			"Offices, bicycle parking, and public space design for the reimagined district of Leverkusen Mitte. Contributed to the project as part of the team at LIN, in collaboration with Werner Sobek AG for structural engineering, and Atelier Miething for landscape.",
		projectLink: "https://www.wettbewerbe-aktuell.de/ergebnis/bahnhofsquartier-leverkusen-mitte-338150",
		place: "Leverkusen, Germany",
	},
        	{
		date: "2025-01-15",
		title: "Awarded 3rd place for the new U5 Arenen design competition in Hamburg",
		summary:
			"The competition called for the architectural and landscape design of the U5 “Arenen” event station in Hamburg, aiming to create a distinctive, crowd-optimized station and public space near major venues. Contributed to the project as part of the team at LIN, in collaboration with Bollinger + Grohman for the structure.",
		projectLink: "https://www.wettbewerbe-aktuell.de/ergebnis/bahnhofsquartier-leverkusen-mitte-338150",
		place: "Hamburg, Germany",
	},
	{
		date: "2025-04-03",
		title: "Dreshaj's “Estrangement” at the International Architectural Conference 25 at University of Brighton",
		summary:
			"Arita Dreshaj’s latest research on the concept of estrangement, exploring the theme of home, then and now.",
		projectLink: "https://blogs.brighton.ac.uk/domesticityundersiege/",
		place: "Brighton, United Kingdom",
	},
		{
		date: "2022-10-25",
		title: "1st Recognition for “New Archipelago” in Schöneweide",
		summary:
			"Inspired by O. M. Ungers’ concept of the city within the city, the proposal reimagines the post-industrial site as a fragmented archipelago of autonomous landscape islands. The typology responds to contaminated ground conditions with a thin, elevated layer of social housing, dormitories, and family houses, while integrating a plant-based remediation strategy to restore the soil over time.",
		projectLink: "https://www.wettbewerbe-aktuell.de/ergebnis/stadt-im-wandel-stadt-der-ideen-2022-berlin-brandenburg-206834",
		place: "Berlin, Germany",
	},
    	{
		date: "2024-06-10",
		title: "International Workshop on Cultural Resilience at Institute X",
		summary:
			"Selected and fully funded by Trans Europe Halles to participate in Rebuilding to Last: Becoming a Forest, a workshop held at Institute X in Aarhus. The program brought together practitioners across Europe to explore long-term strategies for sustainable cultural infrastructure and spatial resilience.",
		projectLink: "https://www.teh.net/inititatives/rebuilding-to-last/",
		place: "Aarhus, Denmark",
	},
    	{
		date: "2020-11-06",
		title: "Deutschlandstipendium Award - Granted for Academic and Creative Excellence",
		summary:
			"Granted by the Federal Ministry of Education and Research (BMBF) in collaboration with the Ferdinand and Charlotte Schimmelpfennig Foundation, the Deutschlandstipendium honors exceptional students across Germany.",
		projectLink: "https://www.teh.net/inititatives/rebuilding-to-last/",
		place: "Berlin, Germany",
	},
	{
		date: "2024-09-07",
		title: "On War and Avant-Garde at the 9th Biennial Conference of the European Architectural History Network",
		summary:
			"(Re)searching the (Un)conscious. Artistic and architectural responses to conflict and political shifts. A research collaboration with Edmond Drenogllava.",
		projectLink: "https://eam9.confer.uj.edu.pl/about-us1",
		place: "Krakow, Poland",
	},
];

// Helper to format date as "DD. Month YYYY"
function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	const day = date.getDate();
	const month = date.toLocaleString("en-US", { month: "long" });
	const year = date.getFullYear();
	return `${day}. ${month} ${year}`;
}

// Sort news items by date descending (newest first)
const sortedNewsItems = [...newsItems].sort(
	(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default function NewsPage() {
	return (
		<div className="min-h-screen relative" style={{ background: "#e7e7e7" }}>
			<CustomCursor />
			<Header />
			<div className="margin-rule">
				<main className="pt-40 pb-24" style={{ minHeight: 0, overflowY: "auto" }}>
					<ul className="space-y-20">
						{sortedNewsItems.map((item, idx) => (
							<li key={idx}>
								<div>
									<span
										className="block text-neutral-500 text-lg mb-1"
										style={{ fontSize: "1.25rem" }}
									>
										{formatDate(item.date)}
									</span>
									<h2
										className="font-bold text-neutral-900 transition-colors"
										style={{
											fontSize: "2.5rem",
											lineHeight: "1.1",
											letterSpacing: "0.01em",
											fontFamily: "'Poppins', sans-serif",
										}}
									>
										{item.projectLink ? (
											<Link
												href={item.projectLink}
												className="transition-colors"
												style={{
													textDecoration: "none",
													fontFamily: "'Poppins', sans-serif",
												}}
												target={item.projectLink.startsWith("http") ? "_blank" : undefined}
												rel={item.projectLink.startsWith("http") ? "noopener noreferrer" : undefined}
											>
												<span
													className="hover:text-[#ff6000]"
													style={{
														textDecoration: "none",
														fontFamily: "'Poppins', sans-serif",
													}}
												>
													{item.title}
												</span>
											</Link>
										) : (
											<span style={{ fontFamily: "'Poppins', sans-serif" }}>{item.title}</span>
										)}
									</h2>
									{item.place && (
										<span
											className="block text-neutral-500 text-base mb-4 mt-2"
											style={{
												fontSize: "1.25rem",
												fontStyle: "normal",
												fontFamily: "'Poppins', sans-serif",
											}}
										>
											{item.place}
										</span>
									)}
									<p
										className="text-neutral-700 mt-4"
										style={{
											fontSize: "1.25rem",
											fontFamily: "'Poppins', sans-serif",
										}}
									>
										{item.summary}
									</p>
								</div>
								{/* Remove the <hr> line completely */}
							</li>
						))}
					</ul>
				</main>
			</div>
			<Footer />
		</div>
	);
}