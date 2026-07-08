"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import StarfieldCanvas from "@/components/StarfieldCanvas";
import { CONSTITUTION_TEXT } from "@/lib/constitutionText";

const SECTIONS = [
  { id: "preamble", label: "Preamble" },
  { id: "article-i-name-and-purpose", label: "Art. I: Name & Purpose" },
  { id: "article-ii-membership", label: "Art. II: Membership" },
  { id: "article-iii-leadership-structure-and-governance", label: "Art. III: Governance" },
  { id: "article-iv-meetings-and-calls-for-club-work", label: "Art. IV: Meetings" },
  { id: "article-v-finances", label: "Art. V: Finances" },
  { id: "article-vi-equipment-management", label: "Art. VI: Equipment" },
  { id: "article-vii-amendments", label: "Art. VII: Amendments" },
  { id: "article-viii-dissolution", label: "Art. VIII: Dissolution" },
  { id: "article-ix-parliamentary-authority-and-conflict-resolution", label: "Art. IX: Conflict Resolution" },
  { id: "article-x-anti-hazing-policy", label: "Art. X: Anti-Hazing" },
  { id: "article-xi-risk-management-and-liability", label: "Art. XI: Risk & Liability" },
];

export default function ConstitutionPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeSection, setActiveSection] = useState("preamble");

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
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

    // Short processing delay for UI feedback, then download instantly
    setTimeout(() => {
      try {
        generatePDF();
      } catch (err) {
        console.error("PDF generation failed:", err);
      } finally {
        setIsDownloading(false);
      }
    }, 450);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const headings = container.querySelectorAll("h2");
    
    let currentActive = "preamble";
    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // If the heading is near the top of the container viewport
      if (rect.top - containerRect.top < 100) {
        currentActive = heading.id;
      }
    });

    if (currentActive) {
      setActiveSection(currentActive);
    }
  };

  return (
    <>
      <StarfieldCanvas />

      <div className="relative z-10 flex flex-col gap-10 pb-16">
        
        {/* Header Console Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-900">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-[0.25em] text-cyan-400 uppercase">
                Official Governing Charter
              </span>
              <span className="text-[9px] font-mono text-slate-500 border border-slate-800/80 px-2 py-0.5 rounded">
                V1.0 (2026)
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Club Constitution
            </h1>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
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
                  : "bg-white text-slate-950 hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] shadow-white/5"
              }`}
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating PDF...</span>
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
          </div>
        </div>

        {/* Scrollbox Layout with Table of Contents Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 hidden lg:block sticky top-24 self-start">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 px-2">
              Charter Chapters
            </h3>
            <ul className="flex flex-col gap-1 border-l border-slate-900">
              {SECTIONS.map(({ id, label }) => {
                const isActive = activeSection === id;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={`text-[13px] block py-1.5 pl-4 border-l-2 -ml-[1px] transition-all ${
                        isActive 
                          ? "border-cyan-400 text-cyan-400 font-medium" 
                          : "border-transparent text-slate-400 hover:text-white"
                      }`}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Constitution Content Display */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-900 bg-slate-950/40 p-6 md:p-10 backdrop-blur-md max-h-[75vh] overflow-y-auto custom-scrollbar shadow-2xl scroll-smooth" onScroll={handleScroll}>
            <article className="prose prose-invert prose-slate max-w-none text-slate-350">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-3xl font-extrabold text-white mt-8 mb-4 tracking-tight border-b border-slate-900 pb-4" {...props} />
                  ),
                  h2: ({ ...props }) => {
                    const text = String(props.children || "");
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <h2 
                        id={id} 
                        className="text-xl font-bold text-white mt-12 mb-4 border-b border-slate-900 pb-2 tracking-tight scroll-mt-6" 
                        {...props} 
                      />
                    );
                  },
                  h3: ({ ...props }) => (
                    <h3 className="text-base font-semibold text-cyan-400 mt-6 mb-2 tracking-tight" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="text-slate-300 leading-relaxed mb-4 text-[14px]" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc pl-5 mb-4 text-slate-355 space-y-1.5 text-[14px]" {...props} />
                  ),
                  li: ({ ...props }) => <li className="pl-1" {...props} />,
                  hr: ({ ...props }) => <hr className="border-slate-900 my-8" {...props} />,
                  strong: ({ ...props }) => <strong className="text-white font-semibold" {...props} />,
                  em: ({ ...props }) => <em className="text-slate-500 italic text-[11px]" {...props} />,
                }}
              >
                {CONSTITUTION_TEXT}
              </ReactMarkdown>
            </article>
          </div>

        </div>

      </div>
    </>
  );
}
