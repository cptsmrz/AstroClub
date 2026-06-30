"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import StarfieldCanvas from "@/components/StarfieldCanvas";
import { CONSTITUTION_TEXT } from "@/lib/constitutionText";

const CONSTITUTION_SUMMARY = `# EXECUTIVE SUMMARY

AstroClub is a student-run, non-profit observational astronomy organization operating under the official guidance of the **Center for Cosmology, Astrophysics & Space Science (CCASS)** at GLA University, Mathura. Guided by the core tenet of *"members first"*, the Club aims to foster a dedicated community of astronomy enthusiasts, telescope builders, and student researchers. 

The Club is structured around an Executive Council, Specialized Officers, and Faculty Mentors. It administers its own hands-on telescope training, schedules weekly observation campaigns (Stella Nocturna), and manages its assets and finances with strict accountability to CCASS.

---

# THE HEART OF THE CONSTITUTION

### Member-First Principle
Every person in AstroClub — from the new recruit to the veteran officer — holds the same fundamental identity: **Club Member**. Leadership roles (President, VP, General Secretary) represent temporary functional responsibilities, not hierarchy or rank.

### Academic Excellence
All position holders must maintain strict academic standards throughout their tenure:
* **President:** Minimum CGPA of **7.0**.
* **Other Officers:** Minimum CGPA of **6.5**.

### Equipment & Instrument Accountability
All optical instruments, telescopes, mounts and learning material are the property of CCASS, GLA University. Using them follows the given protocols:
* Standard check-outs require formal written approval from an **Authorized Approver**.
* Independent access is restricted to approved **Members** and **Core Members**.
* Active use is audited daily via the physical **Equipment Log (Telescope Diary)**.

### Attendance & Participation
The club enforces strict active participation guidelines:
* Attendance is mandatory for all formal calls for club work (meetings, newsletters, event setups).
* **Three consecutive unexcused absences** result in immediate termination of membership.
* Terminated members are barred from reinstatement for the current and subsequent semesters.
`;

export default function ConstitutionPage() {
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let currentY = 32;
    let pageNum = 1;

    // Helper to draw headers & footers on each page
    const drawHeaderFooter = (pdfDoc: any, pageNo: number) => {
      pdfDoc.setFontSize(8);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.setTextColor(148, 163, 184); // slate-400
      
      // Top Header text
      pdfDoc.text("ASTROCLUB CONSTITUTION — V1.0", margin, 12);
      pdfDoc.text("GLA UNIVERSITY, MATHURA", pageWidth - margin - 45, 12);
      
      // Top Divider line
      pdfDoc.setDrawColor(51, 65, 85); // slate-800
      pdfDoc.setLineWidth(0.25);
      pdfDoc.line(margin, 14, pageWidth - margin, 14);

      // Bottom Footer text
      pdfDoc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
      pdfDoc.text("Official Departmental Document — CCASS", margin, pageHeight - 11);
      pdfDoc.text(`Page ${pageNo}`, pageWidth - margin - 12, pageHeight - 11);
    };

    const checkPageBreak = (lineHeight: number) => {
      if (currentY + lineHeight > pageHeight - 20) {
        doc.addPage();
        pageNum++;
        currentY = 32;
        drawHeaderFooter(doc, pageNum);
      }
    };

    // Draw header/footer on first page
    drawHeaderFooter(doc, pageNum);

    const rawLines = CONSTITUTION_TEXT.split("\n");

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i].trim();
      if (!line) {
        currentY += 4;
        continue;
      }

      // Check if line is a decorative divider line
      if (line === "---") {
        checkPageBreak(6);
        doc.setDrawColor(226, 232, 240); // clean divider
        doc.setLineWidth(0.2);
        doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
        currentY += 8;
        continue;
      }

      // Main Heading (H1)
      if (line.startsWith("# ")) {
        const text = line.replace("# ", "");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42); // slate-900
        const h = 18 * 0.3528 * 1.5;
        checkPageBreak(h + 10);
        currentY += 4;
        doc.text(text, margin, currentY);
        currentY += h + 4;
        continue;
      }

      // H2 Section Headers
      if (line.startsWith("## ")) {
        const text = line.replace("## ", "");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42); // slate-900
        const h = 13 * 0.3528 * 1.5;
        checkPageBreak(h + 8);
        currentY += 3;
        doc.text(text, margin, currentY);
        currentY += h + 3;
        continue;
      }

      // H3 Article Headers
      if (line.startsWith("### ")) {
        const text = line.replace("### ", "");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59); // slate-800
        const h = 11 * 0.3528 * 1.4;
        checkPageBreak(h + 6);
        currentY += 2;
        doc.text(text, margin, currentY);
        currentY += h + 2;
        continue;
      }

      // Body / Standard Paragraph Text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105); // slate-600

      // Strip markdown tags and normalize list dots
      const cleanLine = line
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/^[*-]\s+/, "• ");

      const splitLines = doc.splitTextToSize(cleanLine, contentWidth);
      const h = 9.5 * 0.3528 * 1.4;

      splitLines.forEach((splitLine: string) => {
        checkPageBreak(h);
        doc.text(splitLine, margin, currentY);
        currentY += h;
      });
      currentY += 2; // paragraph spacing
    }

    doc.save("astroclub-constitution.pdf");
  };

  const handleDownloadClick = () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setProgress(0);

    // 35% chance to simulate a slow network
    const slowMode = Math.random() < 0.35;
    setIsSlow(slowMode);

    const totalDuration = slowMode ? 6000 : 2500; // Slow takes ~6s, Normal takes ~2.5s
    const intervalTime = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      
      // Calculate progress percentage
      let currentProgress = Math.min((elapsed / totalDuration) * 100, 100);

      if (slowMode) {
        // Slow network behavior: crawl slowly and stall at 97%
        if (currentProgress >= 97 && elapsed < totalDuration - 800) {
          currentProgress = 97;
        }
      }

      setProgress(Math.floor(currentProgress));

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          generatePDF();
          setIsDownloading(false);
          setProgress(0);
        }, 500);
      }
    }, intervalTime);
  };

  return (
    <>
      <StarfieldCanvas />

      <div className="relative z-10 flex flex-col gap-10 pb-16">
        
        {/* Header Console Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-900">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.25em] text-slate-500 uppercase block mb-2">
              Official Governing Charter
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Club Constitution
            </h1>
            <p className="text-slate-400 leading-relaxed">
              Adopted under the supervision of the Center for Cosmology, Astrophysics & Space Science (CCASS), GLA University. This document outlines the supreme governance guidelines for AstroClub.
            </p>
          </div>

          <div className="flex flex-col gap-2 self-start md:self-auto min-w-[240px]">
            <button
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-300 shadow-lg ${
                isDownloading 
                  ? "bg-slate-900 text-slate-400 border border-slate-800 cursor-not-allowed" 
                  : "bg-white text-slate-950 hover:bg-slate-200 hover:scale-[1.02] shadow-white/5 active:scale-[0.98]"
              }`}
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{isSlow ? "Slow connection..." : "Downloading..."} {progress}%</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Download Constitution (PDF)</span>
                </>
              )}
            </button>

            {/* Glowing progress bar */}
            {isDownloading && (
              <div className="w-full bg-slate-950 border border-slate-800/80 rounded-full h-2 overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-100 ease-out shadow-[0_0_8px_#38bdf8]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Scrollbox Display Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 md:p-10 backdrop-blur-sm max-h-[70vh] overflow-y-auto custom-scrollbar shadow-2xl shadow-black/45">
          <article className="prose prose-invert prose-slate max-w-none text-slate-300">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-extrabold text-white mt-8 mb-4 tracking-tight" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold text-white mt-10 mb-3 border-b border-slate-800 pb-2 tracking-tight" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-semibold text-slate-100 mt-6 mb-2 tracking-tight" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-slate-400 leading-relaxed mb-4 text-sm" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5 mb-4 text-slate-400 space-y-1 text-sm" {...props} />
                ),
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                hr: ({ node, ...props }) => <hr className="border-slate-800 my-8" {...props} />,
                strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
                em: ({ node, ...props }) => <em className="text-slate-500 italic text-xs" {...props} />,
              }}
            >
              {CONSTITUTION_SUMMARY}
            </ReactMarkdown>
          </article>
        </div>

      </div>
    </>
  );
}
