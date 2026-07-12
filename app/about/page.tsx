"use client";

import { useState } from "react";
import Link from "next/link";
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

export const MILESTONES: Milestone[] = [
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

export const MAIN_MILESTONES: Milestone[] = [
  MILESTONES[2], // Feb 2024 | First Telescope Builds
  MILESTONES[3], // Feb 2024 | First Public Stargazing
  MILESTONES[5], // Jan 2025 | ESA Feature
  MILESTONES[9]  // Mar 2026 | University-Level Events
];

const BATCH_24: Member[] = [
  {
    name: "Sameeraj",
    role: "President & Founder",
    bio: "Pioneered the establishment of AstroClub, setting up the foundation for optical instrumentation workshops and observation routines.",
    initials: "S",
    linkedin: "https://www.linkedin.com/in/sameeraj-k/"
  },
  {
    name: "Madhav Gupta",
    role: "Astrophotography Head & Co-founder",
    bio: "Established the astrophotography division, introducing tracker mounts and deep-sky imaging pipelines to the club.",
    initials: "MG",
    linkedin: "https://www.linkedin.com/in/madhav-gupta-71346b360/"
  },
  {
    name: "Prashant Chauhan",
    role: "Telescope Handler & Co-founder",
    bio: "Co-founded the club and oversaw the calibration, transport, and maintenance of all major optical components.",
    initials: "PC",
    linkedin: "https://www.linkedin.com/in/prashant-chauhan-15883a304/"
  },
  {
    name: "Aditya Dubey",
    role: "Event Management Team",
    bio: "Managed logistics and scheduling for our regular stargazing sessions and guest lectures.",
    initials: "AD",
    linkedin: "https://www.linkedin.com/in/aditya-dubey-659960291/"
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
    initials: "BS",
    linkedin: "https://www.linkedin.com/in/bhavishyasahu/"
  }
];

const BATCH_25: Member[] = [
  {
    name: "Sameeraj",
    role: "President & Founder",
    bio: "Continues to guide the club's long-term vision, mentoring new leads on optical assembly and dark-sky expeditions.",
    initials: "S",
    linkedin: "https://www.linkedin.com/in/sameeraj-k/"
  },
  {
    name: "Jatin Kumar",
    role: "Technical Head & Design Head",
    bio: "Spearheads telescope design and structural engineering for custom-built mount systems.",
    initials: "JK",
    linkedin: "https://www.linkedin.com/in/jatinkumar2704/"
  },
  {
    name: "Madhav Gupta",
    role: "Astrophotography Head & Co-founder",
    bio: "Leads deep-space capturing sessions, specializing in narrow-band filtering and nebula stacking.",
    initials: "MG",
    linkedin: "https://www.linkedin.com/in/madhav-gupta-71346b360/"
  },
  {
    name: "Prashant Chauhan",
    role: "Telescope Lead, Handler & Co-founder",
    bio: "Manages our active instrument catalog, specializing in optical alignment and mirror testing.",
    initials: "PC",
    linkedin: "https://www.linkedin.com/in/prashant-chauhan-15883a304/"
  },
  {
    name: "Aditya Raj",
    role: "General Secretary",
    bio: "Manages active student memberships, calendars, correspondence, and institutional documentation.",
    initials: "AR",
    linkedin: "https://www.linkedin.com/in/aditya-raj-b1ba9729a/"
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
    initials: "AD",
    linkedin: "https://www.linkedin.com/in/aditya-dubey-659960291/"
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
    initials: "HR",
    linkedin: "https://www.linkedin.com/in/hemang-shikhar-rai-089208254/"
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
    initials: "PK",
    linkedin: "https://www.linkedin.com/in/paritosh-kumar-mishra-451484351/"
  },
  {
    name: "Dhruv Tigunayak",
    role: "Management Team",
    bio: "Coordinates team briefings and manages visitor registration desks during open-house nights.",
    initials: "DT",
    linkedin: "https://www.linkedin.com/in/dhruv-tigunayak-349a82326/"
  },
  {
    name: "Devansh Goyal",
    role: "Management Team",
    bio: "Assists in transportation of heavy mount systems and calibration of public viewing stations.",
    initials: "DG",
    linkedin: "https://www.linkedin.com/in/goyaldevansh/"
  },
  {
    name: "Alex Vyas",
    role: "Management Team",
    bio: "Contributes to operational planning and on-ground coordination during club observation events.",
    initials: "AV",
    linkedin: "https://www.linkedin.com/in/alex-vyas-587437327/"
  },
  {
    name: "Sarthak Rathode",
    role: "Management Team",
    bio: "Manages setup checklists and supports digital media promotion for weekly observation runs.",
    initials: "SR"
  },
  {
    name: "Kartik Goel",
    role: "Management Team",
    bio: "Coordinates volunteer assignments and ensures smooth operational flow for campus observations.",
    initials: "KG"
  },
  {
    name: "Aditi Sharma",
    role: "Member",
    bio: "2nd Year · B.Tech CS AIML · Member since Sep '25",
    initials: "AS"
  },
  {
    name: "Anya Singh",
    role: "Member",
    bio: "1st Year · B.Tech ECSE · Member since Sep '25",
    initials: "AnS"
  },
  {
    name: "Teeya Saraswat",
    role: "Member",
    bio: "1st Year · B.Tech CS AIML · Member since Sep '25",
    initials: "TS"
  },
  {
    name: "Ishika Gupta",
    role: "Member",
    bio: "1st Year · B.Tech CS · Member since Sep '25",
    initials: "IG"
  },
  {
    name: "Yashashvi Gupta",
    role: "Member",
    bio: "1st Year · B.Tech CS AIML · Member since Sep '25",
    initials: "YG"
  },
  {
    name: "Manas Singh",
    role: "Member",
    bio: "1st Year · B.Tech CS · Member since Sep '25",
    initials: "MS"
  },
  {
    name: "Tanay Upadhyay",
    role: "Member",
    bio: "1st Year · B.Tech CS · Member since Sep '25",
    initials: "TU"
  },
  {
    name: "Atharva Mishra",
    role: "Member",
    bio: "1st Year · B.Tech CS · Member since Sep '25",
    initials: "AtM"
  },
  {
    name: "Shagun Gupta",
    role: "Member",
    bio: "2nd Year · B.Tech CS · Member since Sep '25",
    initials: "SG"
  },
  {
    name: "Nishant",
    role: "Member",
    bio: "2nd Year · B.Tech CS AIML · Member since Sep '25",
    initials: "N"
  },
  {
    name: "Naman Mehrotra",
    role: "Member",
    bio: "3rd Year · B.Tech CS · Member since Sep '25",
    initials: "NM"
  },
  {
    name: "Adamya Verma",
    role: "Member",
    bio: "3rd Year · B.Pharma · Member since Sep '25",
    initials: "AdV"
  },
  {
    name: "Divyanshu Pratap Singh",
    role: "Member",
    bio: "3rd Year · B.Pharma · Member since Sep '25",
    initials: "DPS"
  },
  {
    name: "Akash",
    role: "Member",
    bio: "3rd Year · B.Pharma · Member since Sep '25",
    initials: "Ak"
  },
  {
    name: "Aditya Pratap",
    role: "Member",
    bio: "2nd Year · B.Tech CS AIML · Member since Sep '25",
    initials: "AP"
  },
  {
    name: "Hit Agarwal",
    role: "Member",
    bio: "2nd Year · B.Tech CS · Member since Sep '25",
    initials: "HA"
  }
];

const BATCH_26: Member[] = [
  {
    name: "Aditi Sharma",
    role: "President",
    bio: "Led AstroClub's next chapter from Feb 1, 2026 — overseeing the university quiz, the third stargazing night, and official constitutional adoption.",
    initials: "AS",
    linkedin: "https://www.linkedin.com/in/aditi-sharma-6bb23133b/"
  },
  {
    name: "Dhruv Tigunayak",
    role: "Vice President",
    bio: "Maintains internal stability, manages cross-functional coordination, and co-approves membership and equipment access.",
    initials: "DT",
    linkedin: "https://www.linkedin.com/in/dhruv-tigunayak-349a82326/"
  },
  {
    name: "Paritosh Kumar Mishra",
    role: "General Secretary",
    bio: "Maintains official records and correspondence, tracks membership database, and ensures policy compliance.",
    initials: "PK",
    linkedin: "https://www.linkedin.com/in/paritosh-kumar-mishra-451484351/"
  },
  {
    name: "Sarthak Rathode",
    role: "Technical Head",
    bio: "Unified head of technical operations — coordinating the website, design, and content teams across all digital infrastructure.",
    initials: "SR"
  },
  {
    name: "Sameeraj",
    role: "Head of Advisory Committee",
    bio: "Pioneered the establishment of AstroClub, now advising the core council on operations and astronomy curriculum.",
    initials: "S",
    linkedin: "https://www.linkedin.com/in/sameeraj-k/"
  },
  {
    name: "Jatin Kumar",
    role: "Member of Advisory Committee",
    bio: "Provides advisory guidance on structural setups and technical operations.",
    initials: "JK",
    linkedin: "https://www.linkedin.com/in/jatinkumar2704/"
  },
  {
    name: "Madhav Gupta",
    role: "Astrophotography Head & Co-founder",
    bio: "Continues to head deep-space captures, narrow-band filtering, and nebula stacking coordinates.",
    initials: "MG",
    linkedin: "https://www.linkedin.com/in/madhav-gupta-71346b360/"
  },
  {
    name: "Aditya Raj",
    role: "Member of Advisory Committee",
    bio: "Advises the council on institutional records and membership workflow compliance.",
    initials: "AR",
    linkedin: "https://www.linkedin.com/in/aditya-raj-b1ba9729a/"
  },
  {
    name: "Priyanshu Thakur",
    role: "Member of Advisory Committee",
    bio: "Mentors the operations team on workshop execution and crowd staging logistics.",
    initials: "PT"
  },
  {
    name: "Devansh Goyal",
    role: "Treasurer",
    bio: "Manages the club financial ledger, equipment budgets, and workshop procurement records.",
    initials: "DG",
    linkedin: "https://www.linkedin.com/in/goyaldevansh/"
  },
  {
    name: "Anya Singh",
    role: "Core Member",
    bio: "B.Tech ECSE · Core operations support",
    initials: "AnS"
  },
  {
    name: "Teeya Saraswat",
    role: "Core Member",
    bio: "B.Tech CS AIML · Core operations support",
    initials: "TS"
  },
  {
    name: "Manas Singh",
    role: "Core Member",
    bio: "B.Tech CS · Core operations support",
    initials: "MS"
  },
  {
    name: "Tanay Upadhyay",
    role: "Core Member",
    bio: "B.Tech CS · Core operations support",
    initials: "TU"
  },
  {
    name: "Atharva Mishra",
    role: "Core Member",
    bio: "B.Tech CS · Core operations support",
    initials: "AtM"
  },
  {
    name: "Shagun Gupta",
    role: "Core Member & Web Dev Team",
    bio: "B.Tech CS · Actively contributing to digital portals",
    initials: "SG"
  },
  {
    name: "Nishant",
    role: "Core Member & Web Dev Team",
    bio: "B.Tech CS AIML · Actively contributing to digital portals",
    initials: "N"
  },
  {
    name: "Naman Mehrotra",
    role: "Content Head",
    bio: "B.Tech CS · Leading newsletters, content, and blog moderation checks",
    initials: "NM"
  },
  {
    name: "Adamya Verma",
    role: "Design Team & Core Member",
    bio: "B.Pharma · Graphic content and layout designer",
    initials: "AdV"
  },
  {
    name: "Divyanshu Pratap Singh",
    role: "Design Head",
    bio: "B.Pharma · Spearheading brand graphics and digital artwork layouts",
    initials: "DPS"
  },
  {
    name: "Akash",
    role: "Editor",
    bio: "B.Pharma · Editor for news, blog entries, and publications",
    initials: "Ak"
  },
  {
    name: "Aditya Pratap",
    role: "Web Dev Team",
    bio: "B.Tech CS AIML · Maintaining the StellarPortal codebases",
    initials: "AP"
  }
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"all" | "25" | "26" | "24">("all");

  const pathD = MAIN_MILESTONES.reduce((acc, _, idx) => {
    if (idx === 0) return "M 160 225";
    const prevX = (idx - 1) * 320 + 160;
    const currX = idx * 320 + 160;
    const midX = (prevX + currX) / 2;
    const controlY = (idx - 1) % 2 === 0 ? 100 : 350;
    return `${acc} Q ${midX} ${controlY} ${currX} 225`;
  }, "");



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

        {/* 1. CLUB MILESTONES (Horizontal Winding S-Roadmap) */}
        <section className="border-t border-slate-900 pt-10 relative overflow-hidden">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Our Journey & Roadmap
              </h2>
              <p className="text-slate-500 text-xs mt-1">Follow the winding S-curve track below to trace our key breakthroughs.</p>
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

          {/* Horizontal scroll container with winding road height */}
          <div className="relative h-[480px] w-full overflow-hidden">
            <div 
              id="roadmap-container"
              className="flex flex-row overflow-x-auto gap-0 pb-6 pt-2 px-0 custom-scrollbar scroll-smooth snap-x snap-mandatory z-10 relative h-full items-center"
            >
              {/* Horizontal connecting Bezier line across the scroll track */}
              <svg 
                className="absolute top-0 left-0 h-full pointer-events-none z-0" 
                style={{ width: `${MAIN_MILESTONES.length * 320}px` }}
                viewBox={`0 0 ${MAIN_MILESTONES.length * 320} 450`}
                fill="none"
              >
                <path 
                  d={pathD} 
                  stroke="url(#roadmap-line-gradient)" 
                  strokeWidth="2.5" 
                  strokeDasharray="6 6"
                />
                <defs>
                  <linearGradient id="roadmap-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>

              {MAIN_MILESTONES.map((m, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center justify-center shrink-0 w-[320px] h-[450px] relative group snap-start z-10"
                  >
                    {isEven ? (
                      <>
                        {/* 1. Card at the top */}
                        <div className="bg-slate-950/60 border border-slate-900/60 rounded-xl p-4 w-[280px] h-[175px] backdrop-blur-sm transition-all hover:border-slate-800 hover:bg-slate-900/20 shadow-md flex flex-col gap-1.5 relative overflow-hidden text-left">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">
                            {m.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-line flex-grow overflow-y-auto custom-scrollbar">
                            {m.desc}
                          </p>
                        </div>

                        {/* 2. Dotted vertical connector down to node */}
                        <div className="w-[1.5px] h-[35px] border-l border-dashed border-slate-850 mt-1" />

                        {/* 3. Node on the central path */}
                        <div className="bg-slate-950 border-2 border-slate-900 text-sm w-9 h-9 rounded-full flex items-center justify-center group-hover:border-cyan-400 group-hover:bg-slate-900 transition-all duration-300 shadow-lg relative z-10">
                          {m.icon}
                        </div>

                        {/* 4. Date badge below node */}
                        <span className="text-[9px] font-mono font-bold text-cyan-400 tracking-wider bg-cyan-950/30 border border-cyan-900/40 px-2 py-0.5 rounded-full mt-2 select-none">
                          {m.date}
                        </span>

                        {/* 5. Spacer to balance bottom */}
                        <div className="h-[175px] w-[280px] pointer-events-none" />
                      </>
                    ) : (
                      <>
                        {/* 1. Spacer to balance top */}
                        <div className="h-[175px] w-[280px] pointer-events-none" />

                        {/* 2. Date badge above node */}
                        <span className="text-[9px] font-mono font-bold text-cyan-400 tracking-wider bg-cyan-950/30 border border-cyan-900/40 px-2 py-0.5 rounded-full mb-2 select-none">
                          {m.date}
                        </span>

                        {/* 3. Node on the central path */}
                        <div className="bg-slate-950 border-2 border-slate-900 text-sm w-9 h-9 rounded-full flex items-center justify-center group-hover:border-cyan-400 group-hover:bg-slate-900 transition-all duration-300 shadow-lg relative z-10">
                          {m.icon}
                        </div>

                        {/* 4. Dotted vertical connector down to card */}
                        <div className="w-[1.5px] h-[35px] border-l border-dashed border-slate-850 mb-1" />

                        {/* 5. Card at the bottom */}
                        <div className="bg-slate-950/60 border border-slate-900/60 rounded-xl p-4 w-[280px] h-[175px] backdrop-blur-sm transition-all hover:border-slate-800 hover:bg-slate-900/20 shadow-md flex flex-col gap-1.5 relative overflow-hidden text-left">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">
                            {m.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-line flex-grow overflow-y-auto custom-scrollbar">
                            {m.desc}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Roadmap Link Button */}
          <div className="flex justify-center mt-6">
            <Link 
              href="/roadmap?src=about"
              className="px-6 py-2.5 rounded-lg border border-slate-900 bg-slate-950 hover:bg-slate-900 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-all uppercase tracking-wider flex items-center gap-2 group shadow-lg cursor-pointer"
            >
              <span>View Detailed Roadmap</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>

        {/* 2. MEMBER DIRECTORY SECTION */}
        <section className="border-t border-slate-900 pt-10">

          {/* — Era Selector (landing) — */}
          {activeTab === "all" && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Member Directory
                </h2>
                <p className="text-slate-500 text-xs mt-1">Select a council era to explore its members.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* BATCH_24 bundle */}
                <button
                  onClick={() => setActiveTab("24")}
                  className="group relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950 p-7 text-left transition-all duration-300 hover:border-cyan-900/60 hover:shadow-xl hover:shadow-cyan-950/20 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-500" />

                  <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-cyan-400/70 mb-4 block">Council Era I</span>

                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">Batch '24</h3>
                  <p className="text-xs text-slate-500 mb-5">Oct 2023 – Jul 2025</p>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 font-mono">S</div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Sameeraj</p>
                      <p className="text-[10px] text-slate-500">President &amp; Founder</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{BATCH_24.length} members</span>
                    <span className="text-xs text-cyan-400 font-bold group-hover:translate-x-1 transition-transform inline-block">View →</span>
                  </div>
                </button>

                {/* BATCH_25 bundle */}
                <button
                  onClick={() => setActiveTab("25")}
                  className="group relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950 p-7 text-left transition-all duration-300 hover:border-indigo-900/60 hover:shadow-xl hover:shadow-indigo-950/20 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-500" />

                  <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-indigo-400/70 mb-4 block">Council Era II</span>

                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">Batch '25</h3>
                  <p className="text-xs text-slate-500 mb-5">Aug 2025 – Jan 2026</p>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">S</div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Sameeraj</p>
                      <p className="text-[10px] text-slate-500">Continuing President</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{BATCH_25.length} members</span>
                    <span className="text-xs text-indigo-400 font-bold group-hover:translate-x-1 transition-transform inline-block">View →</span>
                  </div>
                </button>

                {/* BATCH_26 bundle */}
                <button
                  onClick={() => setActiveTab("26")}
                  className="group relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950 p-7 text-left transition-all duration-300 hover:border-violet-900/60 hover:shadow-xl hover:shadow-violet-950/20 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-violet-500/5 blur-2xl pointer-events-none group-hover:bg-violet-500/10 transition-all duration-500" />

                  {/* Active badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider">Active</span>
                  </div>

                  <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-violet-400/70 mb-4 block">Council Era III</span>

                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">Batch '26</h3>
                  <p className="text-xs text-slate-500 mb-5">Feb 2026 – Present</p>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-violet-400 font-mono">AS</div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Aditi Sharma</p>
                      <p className="text-[10px] text-slate-500">President</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{BATCH_26.length} members</span>
                    <span className="text-xs text-violet-400 font-bold group-hover:translate-x-1 transition-transform inline-block">View →</span>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* — Batch Detail View — */}
          {activeTab !== "all" && (() => {
            const batchMap = {
              "24": { members: BATCH_24, label: "Batch '24", period: "Oct 2023 – Jul 2025", accent: "cyan",  badge: "Council Era I",   color: "text-cyan-400",   border: "border-cyan-900/40",   bg: "bg-cyan-500/5"   },
              "25": { members: BATCH_25, label: "Batch '25", period: "Aug 2025 – Jan 2026", accent: "indigo", badge: "Council Era II",  color: "text-indigo-400", border: "border-indigo-900/40", bg: "bg-indigo-500/5" },
              "26": { members: BATCH_26, label: "Batch '26", period: "Feb 2026 – Present",  accent: "violet", badge: "Council Era III", color: "text-violet-400", border: "border-violet-900/40", bg: "bg-violet-500/5"  },
            } as const;

            const b = batchMap[activeTab as "24" | "25" | "26"];
            const textAccent = b.color;
            const bgAccentGlow = b.bg;
            const borderAccent = b.border;

            return (
              <div>
                {/* Back button + header */}
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => setActiveTab("all")}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors group cursor-pointer"
                  >
                    <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
                    All Eras
                  </button>
                  <div className="w-px h-4 bg-slate-800" />
                  <div>
                    <span className={`text-[9px] font-bold tracking-[0.22em] uppercase ${textAccent}`}>{b.badge}</span>
                    <h2 className="text-xl font-bold text-white tracking-tight leading-tight">{b.label} <span className="text-slate-500 text-sm font-normal">· {b.period}</span></h2>
                  </div>
                </div>

                {/* Member grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {b.members.map((member, idx) => (
                    <div key={`${member.name}-${activeTab}-${idx}`}>
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
          })()}

        </section>

      </div>
    </>
  );
}
