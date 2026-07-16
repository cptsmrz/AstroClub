import EventGallery from "@/components/events/EventGallery";
import SectionTitle from "@/components/home/SectionTitle";

export const metadata = {
  title: "Events Archives | AstroClub",
  description: "Browse high-resolution photo galleries from past AstroClub observation camps, workshops, and competitions.",
};

const EVENTS_DATA = [
  {
    id: "stargazing-winter-arc-3",
    title: "Stargazing Winter Arc 3.0",
    description: "Deep sky observations under peak winter visibility. Members tracked Jovian moons, captured Orion nebula emissions, and explored deep space objects.",
    date: "March 24, 2026",
    pathPrefix: "/images/events/stargazing-winter-arc-3.0",
    imageCount: 25,
  },
  {
    id: "stellar-showdown",
    title: "Stellar Showdown",
    description: "Our premier astro-trivia and telescope alignment competition. Teams raced to align Newtonian reflectors to specific coordinates.",
    date: "March 17, 2026",
    pathPrefix: "/images/events/stellar-showdown",
    imageCount: 17,
  },
  {
    id: "telescope-making-workshop",
    title: "Telescope Making Workshop",
    description: "A comprehensive two-day workshop where members ground mirrors, assembled optical tubes, and built functioning Newtonian telescopes from scratch.",
    date: "Feb 1 & 2, 2024",
    pathPrefix: "/images/events/telescope-making-workshop",
    imageCount: 20,
  },
  {
    id: "stargazing-event-2024",
    title: "Stargazing Event",
    description: "An introductory stargazing session mapping the Orion nebula and teaching newcomers how to navigate the night sky.",
    date: "Feb 17, 2024",
    pathPrefix: "/images/events/stargazing-event-2024",
    imageCount: 23,
  }
];

export default function EventsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
          <span className="bg-gradient-to-br from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            Mission Logs
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-body max-w-3xl leading-relaxed">
          Explore thousands of photographs from our observation camps, workshops, and competitions. 
          A visual record of our exploration of the cosmos.
        </p>
      </div>

      <div className="space-y-32">
        {EVENTS_DATA.map((event) => (
          <div key={event.id} id={event.id} className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <SectionTitle>{event.title}</SectionTitle>
                <p className="text-slate-400 text-sm md:text-base mt-2 font-body max-w-2xl">
                  {event.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                  {event.date}
                </span>
                <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
                  {event.imageCount} captures
                </span>
              </div>
            </div>

            <EventGallery 
              pathPrefix={event.pathPrefix} 
              imageCount={event.imageCount} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
