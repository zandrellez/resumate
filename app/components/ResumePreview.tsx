"use client";

import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  CredentialItem,
  LanguageItem,
  ProjectItem,
  ReferenceItem,
  ResumeSection,
  SkillCategoryItem,
  StandardItem,
  StructuredItem,
} from "@/app/components/ResumeForm";

export interface ResumePreviewPersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

interface ResumePreviewProps {
  personalInfo: ResumePreviewPersonalInfo;
  sections: ResumeSection[];
}

export default function ResumePreview({ personalInfo, sections }: ResumePreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const paperFrameRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [paperScale, setPaperScale] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const frame = paperFrameRef.current;
    if (!frame) return;

    const updateScale = () => setPaperScale(Math.min(1, frame.clientWidth / 816));
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const handleDownloadPdf = async () => {
    const element = captureRef.current;
    if (!element) return;

    setIsDownloading(true);
    try {
        const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
            // Strip out any elements using unsupported color functions if necessary
            const target = clonedDoc.getElementById("capture-root");
            if (target) {
            target.style.color = "#000000";
            target.style.backgroundColor = "#FFFFFF";
            }
        },
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("tailored-resume.pdf");
    } catch (err) {
        console.error("PDF generation failed:", err);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
    };

  function formatMonthYear(dateString: string) {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    if (!year || !month) return dateString;
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  }

  function estimateItemHeight(section: ResumeSection, item: unknown) {
    const text = Object.values(item as Record<string, unknown>).filter(value => typeof value === "string").join(" ");
    const lines = Math.max(1, Math.ceil(text.length / 90));
    return section.type === "structured" || section.type === "projects" ? 31 + lines * 13 : 18 + lines * 13;
  }

  function splitText(text: string, maxLength = 500) {
    const chunks: string[] = [];
    let remaining = text;
    while (remaining.length > maxLength) {
      let splitAt = remaining.lastIndexOf(" ", maxLength);
      if (splitAt < maxLength * 0.6) splitAt = maxLength;
      chunks.push(remaining.slice(0, splitAt));
      remaining = remaining.slice(splitAt).trimStart();
    }
    if (remaining) chunks.push(remaining);
    return chunks.length ? chunks : [""];
  }

  function prepareSectionItems(section: ResumeSection) {
    const textField = section.type === "structured" || section.type === "projects"
      ? "description"
      : section.type === "standard"
        ? "content"
        : section.type === "skills"
          ? "skills"
          : null;
    if (!textField) return section.items;

    return section.items.flatMap((item, itemIdx) => {
      const text = item[textField] || "";
      const chunks = splitText(text);
      const baseId = item.id || `item-${section.id}-${itemIdx}`;
      return chunks.map((chunk, index) => ({
        ...item,
        id: `${baseId}-part-${index}`,
        [textField]: chunk,
        ...(index > 0 && section.type === "structured" ? { title: "", subtitle: "", location: "", startDate: "", endDate: "" } : {}),
        ...(index > 0 && section.type === "projects" ? { title: "", startDate: "", endDate: "" } : {}),
        ...(index > 0 && section.type === "skills" ? { groupName: "" } : {}),
      }));
    });
  }

  const pages = (() => {
    const pageCapacity = 920;
    const result: ResumeSection[][] = [[]];
    let usedHeight = 0;

    sections.forEach((section) => {
      let sectionItems: unknown[] = [];
      let sectionHeight = 23;

      prepareSectionItems(section).forEach((item) => {
        const itemHeight = estimateItemHeight(section, item);
        if (sectionItems.length > 0 && usedHeight + sectionHeight + itemHeight > pageCapacity) {
          result[result.length - 1].push({ ...section, items: sectionItems });
          result.push([]);
          usedHeight = 0;
          sectionItems = [];
          sectionHeight = 23;
        }
        sectionItems.push(item);
        sectionHeight += itemHeight;
      });

      if (sectionItems.length > 0) {
        if (usedHeight > 0 && usedHeight + sectionHeight > pageCapacity) {
          result.push([]);
          usedHeight = 0;
        }
        result[result.length - 1].push({ ...section, items: sectionItems });
        usedHeight += sectionHeight;
      }
    });

    return result;
  })();

  const pageIndex = Math.min(currentPage, pages.length - 1);

  function renderSection(section: ResumeSection) {
    return (
      <div key={section.id} className="space-y-1.5 break-inside-avoid">
        <h3 className="text-[11px] font-bold uppercase tracking-wide text-black border-b border-slate-300 pb-0.5">{section.title}</h3>

        {section.type === "structured" ? (
          <div className="space-y-3">
            {section.items.map((item: StructuredItem) => (
              <div key={item.id} className="space-y-0.5 break-inside-avoid">
                <div className="flex justify-between font-bold text-black text-[11px]">
                  <span>{item.title}</span>
                  <span className="font-normal">{formatMonthYear(item.startDate)} {item.startDate && item.endDate ? "–" : ""} {formatMonthYear(item.endDate)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-800 italic"><span>{item.subtitle}</span><span>{item.location}</span></div>
                <div className="text-[11px] text-slate-800 leading-normal whitespace-pre-wrap pt-0.5">{item.description}</div>
              </div>
            ))}
          </div>
        ) : section.type === "projects" ? (
          <div className="space-y-3">
            {section.items.map((item: ProjectItem) => (
              <div key={item.id} className="space-y-0.5 break-inside-avoid">
                <div className="flex justify-between font-bold text-black text-[11px]"><span>{item.title}</span><span className="font-normal">{formatMonthYear(item.startDate)} {item.startDate && item.endDate ? "–" : ""} {formatMonthYear(item.endDate)}</span></div>
                <div className="text-[11px] text-slate-800 leading-normal whitespace-pre-wrap pt-0.5">{item.description}</div>
              </div>
            ))}
          </div>
        ) : section.type === "skills" ? (
          <div className="space-y-1">
            {section.items.map((item: SkillCategoryItem) => <div key={item.id} className="text-[11px] text-slate-800 leading-normal break-inside-avoid"><span className="font-bold text-black">{item.groupName}: </span><span>{item.skills}</span></div>)}
          </div>
        ) : section.type === "credentials" ? (
          <div className="space-y-2">
            {section.items.map((item: CredentialItem) => <div key={item.id} className="flex justify-between text-[11px] break-inside-avoid"><div><span className="font-bold text-black">{item.name}</span>{item.issuer ? <span className="text-slate-700"> — {item.issuer}</span> : null}</div><span className="text-slate-600">{formatMonthYear(item.startDate)} {item.startDate && item.endDate ? "–" : ""} {formatMonthYear(item.endDate)}</span></div>)}
          </div>
        ) : section.type === "references" ? (
          <div className="space-y-1.5">
            {section.items.map((item: ReferenceItem) => <div key={item.id} className="text-[11px] space-y-0.5 break-inside-avoid"><div className="font-bold text-black">{item.name} {item.company ? `(${item.company})` : ""}</div><div className="text-slate-700">{item.phone} {item.phone && item.email ? "•" : ""} {item.email}</div></div>)}
          </div>
        ) : section.type === "languages" ? (
          <div className="space-y-1">
            {section.items.map((item: LanguageItem) => <div key={item.id} className="text-[11px] text-slate-800 break-inside-avoid"><span className="font-bold text-black">{item.language}</span>{item.proficiency ? <span className="text-slate-700"> ({item.proficiency})</span> : null}</div>)}
          </div>
        ) : (
          <ul className="space-y-1">
            {section.items.map((item: StandardItem) => <li key={item.id} className="text-[11px] text-slate-800 leading-normal whitespace-pre-wrap break-inside-avoid">• {item.content}</li>)}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="w-full max-w-[816px] bg-slate-200 p-3 rounded-t-xl flex justify-between items-center text-xs font-semibold text-slate-700">
        <span>ATS Document Preview (Letter Size)</span>
        <div className="flex items-center gap-3">
          {pages.length > 1 && <span className="bg-teal-700 text-white px-2.5 py-1 rounded-md text-[10px]">Page {pageIndex + 1} of {pages.length}</span>}
          <button 
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-sm disabled:opacity-50"
          >
            {isDownloading ? "Generating PDF..." : "Save as PDF"}
          </button>
        </div>
      </div>

      <div ref={paperFrameRef} className="relative w-full max-w-[816px] aspect-[8.5/11]">
        {/* Hidden clean unscaled element dedicated for canvas image generation */}
        <div 
          style={{ position: "absolute", top: "-9999px", left: "-9999px", width: "816px", height: "1056px" }}
        >
              <div id="capture-root" ref={captureRef} className="w-[816px] h-[1056px] bg-white p-[48px] flex flex-col justify-between text-[#000000] font-sans box-border">            <div className="space-y-4 pr-1">
              <div className="border-b border-slate-400 pb-3 text-center space-y-1">
                <h1 className="text-[13px] font-bold tracking-tight uppercase">{personalInfo.name || "YOUR NAME"}</h1>
                <p className="text-[11px] text-slate-700">{[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github].filter(Boolean).join(" | ")}</p>
              </div>
              <div className="space-y-4 text-[11px]">{pages[pageIndex]?.map(renderSection)}</div>
            </div>
          </div>
        </div>

        {/* Visible interactive preview frame */}
        <div className="absolute left-0 top-0 w-[816px] h-[1056px] bg-white border-x border-b border-slate-300 p-[48px] shadow-lg flex flex-col justify-between text-[#000000] font-sans box-border overflow-hidden origin-top-left" style={{ transform: `scale(${paperScale})` }}>
          <div className="space-y-4 pr-1">
            {pageIndex === 0 && <div className="border-b border-slate-400 pb-3 text-center space-y-1"><h1 className="text-[13px] font-bold tracking-tight uppercase">{personalInfo.name || "YOUR NAME"}</h1><p className="text-[11px] text-slate-700">{[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github].filter(Boolean).join(" | ")}</p></div>}
            {sections.length === 0 && pageIndex === 0 && <div className="text-center py-32 text-slate-400 text-xs italic">Add sections or upload a PDF on the left to see your live ATS preview here.</div>}
            <div className="space-y-4 text-[11px]">{pages[pageIndex]?.map(renderSection)}</div>
          </div>
          {pages.length > 1 && <div className="text-center text-[10px] text-slate-400 border-t border-slate-200 pt-2 mt-2">Page {pageIndex + 1} of {pages.length}</div>}
        </div>
      </div>

      {pages.length > 1 && <div className="flex items-center gap-4 mt-4" aria-label="Preview page navigation"><button type="button" onClick={() => setCurrentPage(pageIndex - 1)} disabled={pageIndex === 0} aria-label="Previous preview page" className="w-9 h-9 rounded-full border border-slate-300 bg-white text-slate-700 text-lg leading-none disabled:opacity-35 disabled:cursor-not-allowed hover:bg-slate-50">←</button><span className="text-xs font-semibold text-slate-600">{pageIndex + 1} / {pages.length}</span><button type="button" onClick={() => setCurrentPage(pageIndex + 1)} disabled={pageIndex === pages.length - 1} aria-label="Next preview page" className="w-9 h-9 rounded-full border border-slate-300 bg-white text-slate-700 text-lg leading-none disabled:opacity-35 disabled:cursor-not-allowed hover:bg-slate-50">→</button></div>}
    </div>
  );
}