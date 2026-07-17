"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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



const MemberCard = ({ 
  member, 
  colorTheme 
}: { 
  member: Member; 
  colorTheme: "cyan" | "indigo" | "violet" | "emerald"; 
}) => {
  const themes = {
    cyan: { text: "text-cyan-400", border: "border-cyan-500/30", bgHover: "hover:bg-cyan-950/20", glow: "from-cyan-500/20" },
    indigo: { text: "text-indigo-400", border: "border-indigo-500/30", bgHover: "hover:bg-indigo-950/20", glow: "from-indigo-500/20" },
    violet: { text: "text-violet-400", border: "border-violet-500/30", bgHover: "hover:bg-violet-950/20", glow: "from-violet-500/20" },
    emerald: { text: "text-emerald-400", border: "border-emerald-500/30", bgHover: "hover:bg-emerald-950/20", glow: "from-emerald-500/20" },
  };
  
  const t = themes[colorTheme] || themes.cyan;

  return (
    <div className={`group relative h-full flex flex-col p-6 rounded-3xl border border-slate-900 bg-black/40 backdrop-blur-md transition-all duration-700 hover:border-slate-700 ${t.bgHover} overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${t.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none`} />
      
      <div className="flex items-center gap-4 mb-5 z-10">
        {member.photo_url ? (
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-800 shadow-xl">
            <Image src={member.photo_url} alt={member.name} fill sizes="56px" className="object-cover" />
          </div>
        ) : (
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold font-mono border border-slate-800 bg-slate-950 text-slate-400 group-hover:${t.text} transition-colors shadow-inner`}>
            {member.initials}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white tracking-wide group-hover:text-slate-200 transition-colors">{member.name}</h3>
          <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${t.text} mt-1`}>{member.role}</p>
        </div>
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors" title="LinkedIn">
             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
        )}
      </div>
      <p className="text-slate-400 text-sm leading-relaxed z-10 flex-grow font-serif italic">{member.bio}</p>
    </div>
  );
};


export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"all" | "25" | "26" | "24">("all");

  const poeticQuotes = [
    '"Somewhere, something incredible is waiting to be known." — Carl Sagan',
    '"Do not go gentle into that good night... Rage, rage against the dying of the light." — Dylan Thomas',
    '"Nature uses only the longest threads to weave her patterns." — Richard Feynman',
  ];

  return (
    <>
      <StarfieldCanvas />
      
      <div className="relative z-10 w-full overflow-hidden">
        
        {/* HERO SECTION - MASSIVE TYPOGRAPHY */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-8 relative pt-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none" />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xs md:text-sm uppercase tracking-[0.4em] text-cyan-400 font-bold mb-6 font-mono"
          >
            Our Genesis & Continuity
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-500 tracking-tighter mb-8 max-w-5xl"
            style={{ lineHeight: 1.1 }}
          >
            We observe the abyss, and the abyss reveals its light.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl font-serif italic leading-relaxed"
          >
            "For we are made of star-stuff. We are a way for the cosmos to know itself." 
            <br/><span className="text-sm font-sans not-italic text-slate-500 mt-4 block uppercase tracking-widest">— The AstroClub Collective</span>
          </motion.p>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-pulse" />
          </motion.div>
        </section>

        {/* MISSION STATEMENT */}
        <section className="py-24 px-4 md:px-8 border-y border-white/5 bg-black/40 backdrop-blur-sm relative">
           <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-200 mb-8 font-serif">A sanctuary for the curious minds.</h2>
             <p className="text-slate-400 text-lg leading-relaxed mb-6">
                What began as a flicker of curiosity has erupted into a supernova of exploration. From grinding our own mirrors to capturing the faint photons of distant nebulae, we refuse to sit idly beneath the night sky.
             </p>
             <p className="text-slate-400 text-lg leading-relaxed">
                We are mechanics of the optical, cartographers of the celestial, and students of the infinite.
             </p>
           </div>
        </section>

        {/* ERAS AND MEMBERS */}
        <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs uppercase tracking-[0.3em] text-slate-500 font-bold mb-4 font-mono">The Architects</h2>
            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Eras of the Council</h3>
          </div>

          {activeTab === "all" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Era I */}
               <button onClick={() => setActiveTab("24")} className="group relative text-left bg-black border border-white/10 rounded-3xl p-10 overflow-hidden hover:border-cyan-500/50 transition-all duration-700">
                  <div className="absolute inset-0 bg-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
                  <span className="text-cyan-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">Era I</span>
                  <h4 className="text-3xl font-bold text-white mb-2">The Founders</h4>
                  <p className="text-slate-500 font-serif italic mb-12">"Setting the cornerstone in the dark."</p>
                  <div className="flex items-end justify-between border-t border-white/10 pt-6">
                    <span className="text-sm text-slate-400">Oct '23 - Jul '25</span>
                    <span className="text-cyan-400 group-hover:translate-x-2 transition-transform">Explore →</span>
                  </div>
               </button>

               {/* Era II */}
               <button onClick={() => setActiveTab("25")} className="group relative text-left bg-black border border-white/10 rounded-3xl p-10 overflow-hidden hover:border-indigo-500/50 transition-all duration-700">
                  <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
                  <span className="text-indigo-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">Era II</span>
                  <h4 className="text-3xl font-bold text-white mb-2">The Expansion</h4>
                  <p className="text-slate-500 font-serif italic mb-12">"Forging the structures of tomorrow."</p>
                  <div className="flex items-end justify-between border-t border-white/10 pt-6">
                    <span className="text-sm text-slate-400">Aug '25 - Jan '26</span>
                    <span className="text-indigo-400 group-hover:translate-x-2 transition-transform">Explore →</span>
                  </div>
               </button>

               {/* Era III */}
               <button onClick={() => setActiveTab("26")} className="group relative text-left bg-black border border-white/10 rounded-3xl p-10 overflow-hidden hover:border-violet-500/50 transition-all duration-700">
                  <div className="absolute inset-0 bg-violet-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
                  <div className="absolute top-8 right-8 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                     <span className="text-[10px] uppercase font-bold text-violet-500 tracking-widest">Active</span>
                  </div>
                  <span className="text-violet-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 block">Era III</span>
                  <h4 className="text-3xl font-bold text-white mb-2">The Legacy</h4>
                  <p className="text-slate-500 font-serif italic mb-12">"Carrying the torch into the night."</p>
                  <div className="flex items-end justify-between border-t border-white/10 pt-6">
                    <span className="text-sm text-slate-400">Feb '26 - Present</span>
                    <span className="text-violet-400 group-hover:translate-x-2 transition-transform">Explore →</span>
                  </div>
               </button>
            </div>
          )}

          {activeTab !== "all" && (() => {
            const batchMap = {
              "24": { members: BATCH_24, label: "The Founders", subtitle: "Era I · Oct '23 – Jul '25", theme: "cyan" as const, quote: poeticQuotes[0] },
              "25": { members: BATCH_25, label: "The Expansion", subtitle: "Era II · Aug '25 – Jan '26", theme: "indigo" as const, quote: poeticQuotes[2] },
              "26": { members: BATCH_26, label: "The Legacy", subtitle: "Era III · Feb '26 – Present", theme: "violet" as const, quote: poeticQuotes[1] },
            };
            const b = batchMap[activeTab as "24" | "25" | "26"];

            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-white/10 pb-12">
                  <div>
                    <button onClick={() => setActiveTab("all")} className="text-slate-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold mb-8 flex items-center gap-2">
                      <span>←</span> Return to Timeline
                    </button>
                    <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">{b.label}</h3>
                    <p className={`text-sm md:text-base font-mono uppercase tracking-widest text-${b.theme}-400`}>{b.subtitle}</p>
                  </div>
                  <div className="max-w-sm">
                    <p className="text-slate-400 font-serif italic text-lg">{b.quote}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {b.members.map((member, idx) => (
                    <MemberCard key={`${member.name}-${idx}`} member={member} colorTheme={b.theme} />
                  ))}
                </div>
              </motion.div>
            );
          })()}
        </section>

      </div>
    </>
  );
}
