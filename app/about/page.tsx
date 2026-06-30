"use client";

import StarfieldCanvas from "@/components/StarfieldCanvas";

interface Member {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

const BATCH_24: Member[] = [
  {
    name: "Sameeraj",
    role: "President & Founder",
    bio: "Pioneered the establishment of AstroClub, setting up the foundation for optical instrumentation workshops and observation routines.",
    initials: "S"
  },
  {
    name: "Madhav Gupta",
    role: "Astrophotography Head & Co-founder",
    bio: "Established the astrophotography division, introducing tracker mounts and deep-sky imaging pipelines to the club.",
    initials: "MG"
  },
  {
    name: "Prashant Chauhan",
    role: "Telescope Handler & Co-founder",
    bio: "Co-founded the club and oversaw the calibration, transport, and maintenance of all major optical components.",
    initials: "PC"
  },
  {
    name: "Kanika Agarwal",
    role: "Vice President",
    bio: "Coordinated administrative permissions, public relations, and university relations during the club's inaugural year.",
    initials: "KA"
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
    initials: "S"
  },
  {
    name: "Jatin Kumar",
    role: "Technical Head & Design Head",
    bio: "Spearheads telescope design and structural engineering for custom-built mount systems.",
    initials: "JK"
  },
  {
    name: "Madhav Gupta",
    role: "Astrophotography Head & Co-founder",
    bio: "Leads deep-space capturing sessions, specializing in narrow-band filtering and nebula stacking.",
    initials: "MG"
  },
  {
    name: "Prashant Chauhan",
    role: "Telescope Lead, Handler & Co-founder",
    bio: "Manages our active instrument catalog, specializing in optical alignment and mirror testing.",
    initials: "PC"
  },
  {
    name: "Kanika Agarwal",
    role: "Vice President",
    bio: "Supervises team actions, plans budget requests, and coordinates speaker programs.",
    initials: "KA"
  },
  {
    name: "Aditya Raj",
    role: "General Secretary",
    bio: "Manages active student memberships, calendars, correspondence, and institutional documentation.",
    initials: "AR"
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
    initials: "AV"
  },
  {
    name: "Meera Joshi",
    role: "Operations Coordinator",
    bio: "Plans site layouts, schedules equipment logistics, and ensures safety checklists are followed during field observations.",
    initials: "MJ"
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
  const BatchMilestone = ({ year, title, color }: { year: string; title: string; color: string }) => {
    let glowBg = "bg-cyan-500/10 text-cyan-400 border-cyan-800";
    let glowDot = "bg-cyan-400 shadow-[0_0_12px_#22d3ee]";
    if (color === "indigo") {
      glowBg = "bg-indigo-500/10 text-indigo-400 border-indigo-800";
      glowDot = "bg-indigo-400 shadow-[0_0_12px_#818cf8]";
    } else if (color === "emerald") {
      glowBg = "bg-emerald-500/10 text-emerald-400 border-emerald-800";
      glowDot = "bg-emerald-400 shadow-[0_0_12px_#34d399]";
    }

    return (
      <div className="relative flex items-center md:justify-center z-10 w-full mb-10 pl-12 md:pl-0">
        {/* Core Node on the center line */}
        <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-slate-900 ${glowDot}`} />
        
        {/* Glowing Badge */}
        <div className={`px-6 py-2 rounded-full border backdrop-blur-md text-xs md:text-sm font-bold tracking-wider uppercase ${glowBg}`}>
          Batch of 20{year} — {title}
        </div>
      </div>
    );
  };

  const MemberCard = ({ 
    member, 
    textAccent, 
    bgAccentGlow, 
    borderAccent,
    align 
  }: { 
    member: Member; 
    textAccent: string; 
    bgAccentGlow: string; 
    borderAccent: string;
    align: "left" | "right";
  }) => {
    return (
      <div className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/50 hover:shadow-lg hover:shadow-black/25 ${borderAccent}`}>
        {/* Visual Accent Glow on Hover */}
        <div 
          className={`absolute -right-12 -top-12 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none ${bgAccentGlow}`}
        />
        
        <div className={`flex items-start gap-4 relative z-10 ${align === "right" ? "flex-row-reverse" : "flex-row"}`}>
          {/* Monogram Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold border border-slate-800 bg-slate-900 text-slate-300 group-hover:text-white group-hover:scale-105 group-hover:border-slate-700 transition-all duration-300">
            {member.initials}
          </div>
          
          <div className={align === "right" ? "text-right" : "text-left"}>
            <span className={`inline-block text-[10px] font-bold tracking-widest uppercase mb-1 ${textAccent}`}>
              {member.role}
            </span>
            <h3 className="text-base font-semibold text-white transition-colors duration-300">
              {member.name}
            </h3>
          </div>
        </div>
        
        <p className="text-sm text-slate-400 leading-relaxed mt-4 relative z-10">
          {member.bio}
        </p>
      </div>
    );
  };

  const TimelineNode = ({ member, idx, accentColor }: { member: Member; idx: number; accentColor: string }) => {
    const isLeft = idx % 2 === 0;
    
    let textAccent = "text-cyan-400";
    let bgAccentGlow = "group-hover:bg-cyan-500/20";
    let borderAccent = "group-hover:border-cyan-500/50";
    let glowDot = "bg-cyan-400 shadow-[0_0_8px_#22d3ee]";
    if (accentColor === "indigo") {
      textAccent = "text-indigo-400";
      bgAccentGlow = "group-hover:bg-indigo-500/20";
      borderAccent = "group-hover:border-indigo-500/50";
      glowDot = "bg-indigo-400 shadow-[0_0_8px_#818cf8]";
    } else if (accentColor === "emerald") {
      textAccent = "text-emerald-400";
      bgAccentGlow = "group-hover:bg-emerald-500/20";
      borderAccent = "group-hover:border-emerald-500/50";
      glowDot = "bg-emerald-400 shadow-[0_0_8px_#34d399]";
    }

    return (
      <div className="relative flex flex-col md:flex-row w-full pl-12 md:pl-0 z-10">
        {/* Node Dot on Timeline */}
        <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 top-8 w-2.5 h-2.5 rounded-full border border-slate-900 ${glowDot}`} />

        {/* Horizontal Connector Line (desktop only) */}
        <div className={`hidden md:block absolute top-[36px] w-[24px] h-px border-t border-dashed border-slate-800 ${
          isLeft ? "right-1/2" : "left-1/2"
        }`} />

        {/* Desktop Layout (alternating left / right) */}
        <div className={`hidden md:flex w-full items-center ${isLeft ? "flex-row-reverse" : "flex-row"}`}>
          {/* Card Side */}
          <div className="w-1/2 px-12 text-left">
            <div className={`w-full max-w-md ${isLeft ? "ml-auto text-right" : "mr-auto"}`}>
              <MemberCard member={member} textAccent={textAccent} bgAccentGlow={bgAccentGlow} borderAccent={borderAccent} align={isLeft ? "right" : "left"} />
            </div>
          </div>
          {/* Empty Side */}
          <div className="w-1/2" />
        </div>

        {/* Mobile Layout (always on right) */}
        <div className="block md:hidden w-full text-left">
          <MemberCard member={member} textAccent={textAccent} bgAccentGlow={bgAccentGlow} borderAccent={borderAccent} align="left" />
        </div>
      </div>
    );
  };

  return (
    <>
      <StarfieldCanvas />
      
      <div className="relative z-10 flex flex-col gap-12 pb-16">
        {/* Intro Hero Header */}
        <div className="max-w-3xl mb-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Stellar Legacy.<br />
            <span className="text-slate-500">The People Behind AstroClub.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            AstroClub is driven by students passionate about exploring the night sky, engineering advanced optics, and sharing the wonders of astronomy. Explore the leaders, builders, and stargazers who define our journey.
          </p>
        </div>

        {/* Tree timeline wrapper */}
        <div className="relative flex flex-col w-full mt-4">
          {/* Central Vertical Trunk Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px border-l border-dashed border-slate-800 -translate-x-1/2 z-0" />

          {/* Batch of 24 Section */}
          <div className="relative mb-16">
            <BatchMilestone year="24" title="Alumni Pioneers" color="cyan" />
            <div className="flex flex-col gap-8 mt-6">
              {BATCH_24.map((member, idx) => (
                <TimelineNode 
                  key={member.name} 
                  member={member} 
                  idx={idx} 
                  accentColor="cyan" 
                />
              ))}
            </div>
          </div>

          {/* Batch of 25 Section */}
          <div className="relative mb-16">
            <BatchMilestone year="25" title="Senior Leadership" color="indigo" />
            <div className="flex flex-col gap-8 mt-6">
              {BATCH_25.map((member, idx) => (
                <TimelineNode 
                  key={member.name} 
                  member={member} 
                  idx={idx} 
                  accentColor="indigo" 
                />
              ))}
            </div>
          </div>

          {/* Batch of 26 Section */}
          <div className="relative">
            <BatchMilestone year="26" title="Rising Juniors" color="emerald" />
            <div className="flex flex-col gap-8 mt-6">
              {BATCH_26.map((member, idx) => (
                <TimelineNode 
                  key={member.name} 
                  member={member} 
                  idx={idx} 
                  accentColor="emerald" 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
