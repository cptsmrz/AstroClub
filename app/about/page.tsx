"use client";

import { useState } from "react";
import StarfieldCanvas from "@/components/StarfieldCanvas";

interface Milestone {
  date: string;
  title: string;
  desc: string;
  icon: string;
}

interface Member {
  name: string;
  role: string;
  bio: string;
  initials: string;
  linkedin?: string;
  photo_url?: string;
}

const MILESTONES: Milestone[] = [
  {
    date: "Oct 2023",
    title: "Initial Department Link",
    desc: "Sameeraj establishes first contact with the CCASS directors at Academic Block XI, registering the first active student engagement in astronomy since the department's 2022 commencement.",
    icon: "🚪"
  },
  {
    date: "Dec 2023",
    title: "The Catalyst Seminar",
    desc: "He along with a friend, Riddhi Gupta, attends a seminar on black holes and expanding universes, initiating plans to transform the faculty association into a student-run collective.",
    icon: "🌌"
  },
  {
    date: "Feb 2024",
    title: "First Telescope Builds",
    desc: "The club's future council (unaware at this time) constructs its first custom instruments in a 2-day workshop: a Galilean telescope (Feb 1) and a Newtonian reflector (Feb 2).",
    icon: "🔧"
  },
  {
    date: "Feb 2024",
    title: "First Public Stargazing",
    desc: "The first council hosts the inaugural public observation night at the campus field, guiding over 130 students and faculty members to trace lunar and planetary coordinates.",
    icon: "🔭"
  },
  {
    date: "Feb 2024 - Mar 2025",
    title: "Council Expansion",
    desc: "Driven by growing student interest, the active student leadership gradually expands from the 7 founders to a 17-member council to prepare for future public operations.",
    icon: "🤝"
  },
  {
    date: "Jan 2025",
    title: "ESA Feature",
    desc: "The President Sameeraj & the Astrophotography Head Madhav capture the Heart Nebula using custom setups, earning official recognition from the European Space Agency (ESA).",
    icon: "🛰️"
  },
  {
    date: "Aug - Sep 2025",
    title: "Formalizing Structure",
    desc: "The club executes three structured recruitment drives in 10 days, establishing official departments, role hierarchy, and technical divisions.",
    icon: "📋"
  },
  {
    date: "Sep - Nov 2025",
    title: "Launching ASTR 101",
    desc: "The club founder conducts a 6-week curriculum in observational astronomy and telescope handling. It was an open classroom class for a cohort of 17+ student members.",
    icon: "🎓"
  },
  {
    date: "Early 2026",
    title: "South Africa Presentation",
    desc: "Director Dr. Anirudh Pradhan presents AstroClub's research internationally. The astrophotography team captured and identified sunspots, compiling a presentation proofread by the design team.",
    icon: "🌍"
  },
  {
    date: "Mar 2026",
    title: "University-Level Events",
    desc: "Under the new council led by President Aditi, the club independently organizes:\n• March 17: The first university-level Astronomy Quiz with 7,000+ INR in prizes.\n• March 24: The third public stargazing observation night.",
    icon: "🏆"
  },
  {
    date: "Jul 2026",
    title: "StellarPortal Deployment",
    desc: "The club's official website goes live, providing a digital hub for deep-space logs, member directories, and automated booking queues.",
    icon: "💻"
  },
  {
    date: "Aug 2026",
    title: "Constitutional Adoption",
    desc: "AstroClub adopts its first-ever constitution, standardizing operational guidelines, officer elections, and code of conduct.",
    icon: "📜"
  }
];

const BATCH_24: Member[] = [
  {
    name: "Sameeraj",
    role: "President & Founder",
    bio: "Pioneered the establishment of AstroClub, setting up the foundation for optical instrumentation workshops and observation routines.",
    initials: "S",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Madhav Gupta",
    role: "Astrophotography Head & Co-founder",
    bio: "Established the astrophotography division, introducing tracker mounts and deep-sky imaging pipelines to the club.",
    initials: "MG",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Prashant Chauhan",
    role: "Telescope Handler & Co-founder",
    bio: "Co-founded the club and oversaw the calibration, transport, and maintenance of all major optical components.",
    initials: "PC",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Kanika Agarwal",
    role: "Vice President",
    bio: "Coordinated administrative permissions, public relations, and university relations during the club's inaugural year.",
    initials: "KA",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Aditya Dubey",
    role: "Event Management Team",
    bio: "Managed logistics and scheduling for our regular stargazing sessions and guest lectures.",
    initials: "AD"
  },
  {
    name: "Priyanshu Thakur",
    role: "Event Management Team",
    bio: "Organized public outreach and coordinated event flow to ensure a seamless experience for visitors.",
    initials: "PT"
  },
  {
    name: "Bhavishya Sahu",
    role: "Event Management Team",
    bio: "Coordinated volunteer tasks and campus setup logistics for night observation events.",
    initials: "BS"
  }
];

const BATCH_25: Member[] = [
  {
    name: "Sameeraj",
    role: "President & Founder",
    bio: "Continues to guide the club's long-term vision, mentoring new leads on optical assembly and dark-sky expeditions.",
    initials: "S",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Jatin Kumar",
    role: "Technical Head & Design Head",
    bio: "Spearheads telescope design and structural engineering for custom-built mount systems.",
    initials: "JK",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Madhav Gupta",
    role: "Astrophotography Head & Co-founder",
    bio: "Leads deep-space capturing sessions, specializing in narrow-band filtering and nebula stacking.",
    initials: "MG",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Prashant Chauhan",
    role: "Telescope Lead, Handler & Co-founder",
    bio: "Manages our active instrument catalog, specializing in optical alignment and mirror testing.",
    initials: "PC",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Kanika Agarwal",
    role: "Vice President",
    bio: "Supervises team actions, plans budget requests, and coordinates speaker programs.",
    initials: "KA",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Aditya Raj",
    role: "General Secretary",
    bio: "Manages active student memberships, calendars, correspondence, and institutional documentation.",
    initials: "AR",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Pawan Kumar",
    role: "Theoretical & Observational Astronomy Lead",
    bio: "Conducts academic seminars on astrophysics and leads field identifications of seasonal constellations.",
    initials: "PK"
  },
  {
    name: "Priyanshu Thakur",
    role: "Event Management Head",
    bio: "Directs the coordination team, planning large-scale campus observation nights and workshops.",
    initials: "PT"
  },
  {
    name: "Aditya Dubey",
    role: "Event Management Co-head",
    bio: "Supports the management operations, leading team deployment and equipment setups.",
    initials: "AD"
  },
  {
    name: "Manu Kumar",
    role: "Event Photographer",
    bio: "Captures and curates club events, stargazing sessions, and telescope building workshops.",
    initials: "MK"
  },
  {
    name: "Hemang Shikhar Rai",
    role: "Event Management Team",
    bio: "Handles field operations, crowd management, and alignment of visual aids for guests.",
    initials: "HR"
  },
  {
    name: "Ayush",
    role: "Management Team",
    bio: "Supports public safety, crowd direction, and equipment staging during large observation sessions.",
    initials: "A"
  },
  {
    name: "Paritosh Kumar Mishra",
    role: "Management Team",
    bio: "Assists with logistical setup, power distribution, and alignment aids on observation nights.",
    initials: "PK"
  },
  {
    name: "Dhruv Tigunayak",
    role: "Management Team",
    bio: "Coordinates team briefings and manages visitor registration desks during open-house nights.",
    initials: "DT"
  },
  {
    name: "Devansh Goyal",
    role: "Management Team",
    bio: "Assists in transportation of heavy mount systems and calibration of public viewing stations.",
    initials: "DG"
  },
  {
    name: "Sarthak Mishra",
    role: "Management Team",
    bio: "Manages setup checklists and supports digital media promotion for weekly observation runs.",
    initials: "SM"
  },
  {
    name: "Kartik Goel",
    role: "Management Team",
    bio: "Coordinates volunteer assignments and ensures smooth operational flow for campus observations.",
    initials: "KG"
  }
];

const BATCH_26: Member[] = [
  {
    name: "Aditya Varma",
    role: "Observatory Assistant",
    bio: "Focuses on deep-sky astrophotography, capturing nebulae and globular clusters using DSLR tracker mounts.",
    initials: "AV",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Meera Joshi",
    role: "Operations Coordinator",
    bio: "Plans site layouts, schedules equipment logistics, and ensures safety checklists are followed during field observations.",
    initials: "MJ",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Varun Das",
    role: "Technical Associate",
    bio: "Developing custom automated tracking systems using Arduino and stepper motors to trace stars precisely.",
    initials: "VD"
  },
  {
    name: "Riya Bansal",
    role: "Digital Content Lead",
    bio: "Curates astronomy facts for newsletters, manages the website blogs editor, and produces digital media.",
    initials: "RB"
  }
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"all" | "25" | "26" | "24">("all");

  const MemberCard = ({ 
    member, 
    textAccent, 
    bgAccentGlow, 
    borderAccent 
  }: { 
    member: Member; 
    textAccent: string; 
    bgAccentGlow: string; 
    borderAccent: string;
  }) => {
    return (
      <div className={`group relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950/40 p-5 md:p-6 backdrop-blur-md transition-all duration-300 hover:border-slate-750 hover:bg-slate-900/30 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/30 flex flex-col justify-between h-full`}>
        {/* Hover Radial Background Glow */}
        <div className={`absolute -right-12 -top-12 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none ${bgAccentGlow}`} />
        
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              {/* Monogram/Avatar Photo Fallback */}
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="h-11 w-11 rounded-xl object-cover border border-slate-800"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold border border-slate-800 bg-slate-900 text-slate-350 group-hover:text-white group-hover:border-slate-750 transition-all duration-300 font-mono">
                  {member.initials}
                </div>
              )}
              
              <div>
                <h3 className="text-[15px] font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {member.name}
                </h3>
                <span className={`text-[10px] font-bold tracking-widest uppercase ${textAccent}`}>
                  {member.role}
                </span>
              </div>
            </div>

            {/* Optional LinkedIn profile */}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
                title={`${member.name} LinkedIn`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
          </div>
          
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            {member.bio}
          </p>
        </div>
      </div>
    );
  };

  const renderMemberSection = (members: Member[], title: string, color: string, badgeText: string) => {
    let textAccent = "text-cyan-400";
    let bgAccentGlow = "bg-cyan-500/10";
    let borderAccent = "border-cyan-800/30";
    if (color === "indigo") {
      textAccent = "text-indigo-400";
      bgAccentGlow = "bg-indigo-500/10";
      borderAccent = "border-indigo-800/30";
    } else if (color === "emerald") {
      textAccent = "text-emerald-400";
      bgAccentGlow = "bg-emerald-500/10";
      borderAccent = "border-emerald-800/30";
    }

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          <span className={`text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${borderAccent} ${bgAccentGlow} ${textAccent}`}>
            {badgeText}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member, idx) => (
            <div key={`${member.name}-${title}-${idx}`}>
              <MemberCard 
                member={member} 
                textAccent={textAccent} 
                bgAccentGlow={bgAccentGlow} 
                borderAccent={borderAccent} 
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <StarfieldCanvas />
      
      <div className="relative z-10 flex flex-col gap-12 pb-16">
        
        {/* Intro Hero Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold tracking-[0.25em] text-cyan-400 uppercase block mb-3">
            Core Legacy & Directory
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
            The Stellar Core of AstroClub
          </h1>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed">
            AstroClub is driven by students passionate about exploring deep space and crafting optical instruments. Meet the crew, builders, and stargazers who pave the path forward.
          </p>
        </div>

        {/* 1. CLUB MILESTONES (Horizontal Roadmap Slider) */}
        <section className="border-t border-slate-900 pt-10 relative overflow-hidden">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Our Journey & Roadmap
              </h2>
              <p className="text-slate-500 text-xs mt-1">Scroll horizontally to trace our key breakthroughs and historic milestones.</p>
            </div>
            
            {/* Scroll indicators */}
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const el = document.getElementById("roadmap-container");
                  if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
                }}
                className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all text-xs cursor-pointer select-none"
                aria-label="Scroll left"
              >
                ←
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById("roadmap-container");
                  if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
                }}
                className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all text-xs cursor-pointer select-none"
                aria-label="Scroll right"
              >
                →
              </button>
            </div>
          </div>

          {/* Horizontal scroll container with dashed progress line */}
          <div className="relative">
            {/* Horizontal connecting line across the scroll track */}
            <div className="absolute top-[20px] left-0 right-0 h-[1.5px] border-t border-dashed border-slate-900 z-0 pointer-events-none" />

            <div 
              id="roadmap-container"
              className="flex flex-row overflow-x-auto gap-5 pb-6 pt-2 px-1 custom-scrollbar scroll-smooth snap-x snap-mandatory z-10 relative"
            >
              {MILESTONES.map((m, idx) => (
                <div 
                  key={idx} 
                  className="min-w-[290px] md:min-w-[320px] max-w-[320px] snap-start flex flex-col gap-4 relative group"
                >
                  {/* Timeline Node Connector Circle */}
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-950 border-2 border-slate-900 text-sm w-10 h-10 rounded-full flex items-center justify-center group-hover:border-cyan-400 group-hover:bg-slate-900 transition-all duration-300 relative z-10 shadow-lg">
                      {m.icon}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider bg-cyan-950/30 border border-cyan-900/40 px-2 py-0.5 rounded-full">
                      {m.date}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-5 flex-grow backdrop-blur-sm transition-all hover:border-slate-850 hover:bg-slate-900/20 shadow-md flex flex-col gap-2 relative overflow-hidden">
                    {/* Subtle corner highlight */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                    
                    <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line flex-grow">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. MEMBER DIRECTORY SECTION */}
        <section className="border-t border-slate-900 pt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Member Directory
              </h2>
              <p className="text-slate-500 text-xs mt-1">The active crew, alumni pioneers, and core organizers.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-950 border border-slate-900 p-1 rounded-lg self-start">
              {(["all", "26", "25", "24"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wider uppercase transition-all ${
                    activeTab === tab 
                      ? "bg-slate-900 text-white border border-slate-800" 
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab === "all" ? "All Batches" : `'${tab} Batch`}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Rendering */}
          <div className="flex flex-col gap-6">
            {(activeTab === "all" || activeTab === "26") && 
              renderMemberSection(BATCH_26, "Batch of 2026", "emerald", "Rising Juniors")}
            
            {(activeTab === "all" || activeTab === "25") && 
              renderMemberSection(BATCH_25, "Batch of 2025", "indigo", "Senior Leadership")}
            
            {(activeTab === "all" || activeTab === "24") && 
              renderMemberSection(BATCH_24, "Batch of 2024", "cyan", "Alumni Pioneers")}
          </div>
        </section>

      </div>
    </>
  );
}
