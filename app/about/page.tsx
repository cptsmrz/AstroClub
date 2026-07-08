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
    date: "Feb 2024",
    title: "Club Genesis",
    desc: "AstroClub founded by Sameeraj, Madhav, and Prashant under the CCASS department to promote optical instrumentation and observational science.",
    icon: "✨"
  },
  {
    date: "Apr 2024",
    title: "First Handcrafted Optics",
    desc: "Successfully built and calibrated our first Newtonian Reflector telescope, achieving clear lunar and planetary resolution.",
    icon: "🔭"
  },
  {
    date: "Sep 2024",
    title: "Observatory Spot Assigned",
    desc: "Sanctioned observation camp setup at the Basketball Court campus zone, launching bi-weekly stargazing public nights.",
    icon: "🏛️"
  },
  {
    date: "Feb 2025",
    title: "Astronomy Quiz Inauguration",
    desc: "Organized the first campus-wide Astronomy trivia tournament with over 300+ students participating.",
    icon: "🌌"
  },
  {
    date: "Jan 2026",
    title: "StellarPortal Deployment",
    desc: "Launched the automated observation booking queue and integrated S.AI content moderation controls.",
    icon: "💻"
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

        {/* 1. CLUB MILESTONES (Chronological Progress timeline) */}
        <section className="border-t border-slate-900 pt-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Our Journey & Milestones
            </h2>
            <p className="text-slate-500 text-xs mt-1">Key highlights and operational breakthroughs since inception.</p>
          </div>

          <div className="relative border-l border-dashed border-slate-800 ml-3 pl-8 py-2 flex flex-col gap-8">
            {MILESTONES.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Node Indicator */}
                <span className="absolute -left-[41px] top-1.5 bg-slate-950 border border-slate-800 text-sm w-6 h-6 rounded-full flex items-center justify-center group-hover:border-cyan-400 transition-all duration-300">
                  {m.icon}
                </span>

                <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4">
                  <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider w-24 shrink-0">
                    {m.date}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {m.title}
                    </h4>
                    <p className="text-xs md:text-sm text-slate-450 leading-relaxed mt-1">
                      {m.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
