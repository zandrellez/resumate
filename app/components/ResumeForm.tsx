"use client";

import React, { useState } from "react";

export interface StructuredItem {
  id: string;
  title: string;
  subtitle: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CredentialItem {
  id: string;
  name: string;
  issuer: string;
  startDate: string;
  endDate: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface StandardItem {
  id: string;
  content: string;
}

export interface SkillCategoryItem {
  id: string;
  groupName: string;
  skills: string;
}

export interface ResumeSection {
  id: string;
  title: string;
  type: "structured" | "standard" | "skills" | "projects" | "credentials" | "references" | "languages";
  items: any[];
}

const AVAILABLE_SECTIONS = [
  { title: "Experience", type: "structured" },
  { title: "Education", type: "structured" },
  { title: "Projects", type: "projects" },
  { title: "Technical Skills & Competencies", type: "skills" },
  { title: "Summary or Objective", type: "standard" },
  { title: "Certifications & Licenses", type: "credentials" },
  { title: "Awards", type: "credentials" },
  { title: "Languages", type: "languages" },
  { title: "References", type: "references" },
  { title: "Affiliations", type: "structured" },
  { title: "Custom Section (Simple)", type: "standard" },
  { title: "Custom Section (Advanced)", type: "structured" },
];

interface ResumeFormProps {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  setPersonalInfo: React.Dispatch<React.SetStateAction<any>>;
  sections: ResumeSection[];
  setSections: React.Dispatch<React.SetStateAction<ResumeSection[]>>;
  onFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ResumeForm({
  personalInfo,
  setPersonalInfo,
  sections,
  setSections,
  onFileUpload,
}: ResumeFormProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>("experience");
  const [editingHeaderId, setEditingHeaderId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      alert(`Successfully uploaded ${file.name}. Parsing PDF contents...`);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleTitleChange = (sectionId: string, newTitle: string) => {
    setSections(sections.map(sec => sec.id === sectionId ? { ...sec, title: newTitle } : sec));
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(sec => sec.id !== sectionId));
    if (openAccordion === sectionId) setOpenAccordion(null);
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, items: sec.items.filter(i => i.id !== itemId) };
      }
      return sec;
    }));
  };

  const handleMoveItem = (sectionId: string, index: number, direction: "up" | "down") => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        const newItems = [...sec.items];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return sec;
        const temp = newItems[index];
        newItems[index] = newItems[targetIndex];
        newItems[targetIndex] = temp;
        return { ...sec, items: newItems };
      }
      return sec;
    }));
  };

  const handleAddSectionPreset = (presetTitle: string, presetType: any) => {
    let finalTitle = presetTitle;
    if (presetTitle.includes("Custom Section (Simple)")) finalTitle = "Custom Section";
    if (presetTitle.includes("Custom Section (Advanced)")) finalTitle = "Custom Advanced Section";

    let defaultItem: any = { id: `item-${Date.now()}` };
    if (presetType === "structured") {
      defaultItem = { ...defaultItem, title: "", subtitle: "", location: "", startDate: "", endDate: "", description: "" };
    } else if (presetType === "projects") {
      defaultItem = { ...defaultItem, title: "", startDate: "", endDate: "", description: "" };
    } else if (presetType === "skills") {
      defaultItem = { ...defaultItem, groupName: "Skill Group", skills: "" };
    } else if (presetType === "credentials") {
      defaultItem = { ...defaultItem, name: "", issuer: "", startDate: "", endDate: "" };
    } else if (presetType === "references") {
      defaultItem = { ...defaultItem, name: "", company: "", phone: "", email: "" };
    } else if (presetType === "languages") {
      defaultItem = { ...defaultItem, language: "", proficiency: "" };
    } else {
      defaultItem = { ...defaultItem, content: "" };
    }

    const newSec: ResumeSection = {
      id: `sec-${Date.now()}`,
      title: finalTitle,
      type: presetType,
      items: [defaultItem],
    };
    setSections([...sections, newSec]);
    setOpenAccordion(newSec.id);
  };

  const handleAddItem = (sectionId: string, type: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        let newItem: any = { id: `item-${Date.now()}` };
        if (type === "structured") {
          newItem = { ...newItem, title: "", subtitle: "", location: "", startDate: "", endDate: "", description: "" };
        } else if (type === "projects") {
          newItem = { ...newItem, title: "", startDate: "", endDate: "", description: "" };
        } else if (type === "skills") {
          newItem = { ...newItem, groupName: `Skill Group`, skills: "" };
        } else if (type === "credentials") {
          newItem = { ...newItem, name: "", issuer: "", startDate: "", endDate: "" };
        } else if (type === "references") {
          newItem = { ...newItem, name: "", company: "", phone: "", email: "" };
        } else if (type === "languages") {
          newItem = { ...newItem, language: "", proficiency: "" };
        } else {
          newItem = { ...newItem, content: "" };
        }
        return { ...sec, items: [...sec.items, newItem] };
      }
      return sec;
    }));
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updatedSections = [...sections];
    const draggedItem = updatedSections[draggedIndex];
    updatedSections.splice(draggedIndex, 1);
    updatedSections.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setSections(updatedSections);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A]">Import Master Resume</h2>
        <input 
          type="file" 
          accept="application/pdf"
          onChange={onFileUpload}
          className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F172A] file:text-white hover:file:bg-slate-800 cursor-pointer"
        />
      </div>

      {/* Personal Info */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A]">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Full Name</label>
            <input 
              type="text" 
              value={personalInfo.name}
              onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-[#0F172A] rounded-xl focus:outline-none focus:border-[#0D9488]"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Email Address</label>
            <input 
              type="email" 
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-[#0F172A] rounded-xl focus:outline-none focus:border-[#0D9488]"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Phone Number</label>
            <input 
              type="text" 
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-[#0F172A] rounded-xl focus:outline-none focus:border-[#0D9488]"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Location</label>
            <input 
              type="text" 
              value={personalInfo.location}
              onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-[#0F172A] rounded-xl focus:outline-none focus:border-[#0D9488]"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">LinkedIn URL</label>
            <input 
              type="text" 
              value={personalInfo.linkedin}
              onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-[#0F172A] rounded-xl focus:outline-none focus:border-[#0D9488]"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">GitHub / Portfolio</label>
            <input 
              type="text" 
              value={personalInfo.github}
              onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-[#0F172A] rounded-xl focus:outline-none focus:border-[#0D9488]"
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0F172A]">Resume Sections</h2>
          <span className="text-[10px] text-slate-400 font-medium">Drag ⠿ to reorder</span>
        </div>
        
        <div className="space-y-3">
          {sections.map((sec, index) => (
            <div 
              key={sec.id} 
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 cursor-grab active:cursor-grabbing"
            >
              {/* Accordion Header */}
              <div 
                className="flex items-center justify-between p-4 bg-white border-b border-slate-100 select-none"
                onClick={() => setOpenAccordion(openAccordion === sec.id ? null : sec.id)}
              >
                <div className="flex items-center gap-3 flex-1" onClick={(e) => e.stopPropagation()}>
                  <span className="text-slate-300 font-bold text-xs hover:text-slate-500 cursor-grab" title="Drag to reorder">
                    ⠿
                  </span>
                  {editingHeaderId === sec.id ? (
                    <input 
                      type="text" 
                      value={sec.title}
                      autoFocus
                      onBlur={() => setEditingHeaderId(null)}
                      onChange={(e) => handleTitleChange(sec.id, e.target.value)}
                      className="font-bold text-sm text-[#0F172A] bg-white border border-[#0D9488] px-2 py-0.5 rounded focus:outline-none"
                    />
                  ) : (
                    <span className="font-bold text-sm text-[#0F172A] cursor-pointer">
                      {sec.title}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setEditingHeaderId(editingHeaderId === sec.id ? null : sec.id)}
                    className="text-slate-400 hover:text-[#0D9488] transition p-1"
                    title="Edit section header"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteSection(sec.id)}
                    className="text-slate-400 hover:text-red-600 transition p-1"
                    title="Delete section"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                  <span className="text-slate-400 text-xs font-bold cursor-pointer" onClick={() => setOpenAccordion(openAccordion === sec.id ? null : sec.id)}>
                    {openAccordion === sec.id ? "−" : "+"}
                  </span>
                </div>
              </div>

              {/* Accordion Content */}
              {openAccordion === sec.id && (
                <div className="p-4 space-y-4">
                  {sec.type === "structured" ? (
                    sec.items.map((item: StructuredItem, idx: number) => (
                      <div key={item.id} className="space-y-3 bg-white p-4 border border-slate-200 rounded-xl relative">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Item #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <button onClick={() => handleMoveItem(sec.id, idx, "up")} disabled={idx === 0} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▲</button>
                              <button onClick={() => handleMoveItem(sec.id, idx, "down")} disabled={idx === sec.items.length - 1} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▼</button>
                            </div>
                            <button onClick={() => handleDeleteItem(sec.id, item.id)} className="text-slate-400 hover:text-red-600 text-xs transition">✕ Remove</button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Title</label>
                            <input 
                              type="text" 
                              value={item.title} 
                              placeholder="Job title, degree, etc."
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, title: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Employer / Institution</label>
                            <input 
                              type="text" 
                              value={item.subtitle} 
                              placeholder="Employer, school, etc."
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, subtitle: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Location</label>
                            <input 
                              type="text" 
                              value={item.location || ""} 
                              placeholder="City, Country"
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, location: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Start Date</label>
                            <input 
                              type="month" 
                              value={item.startDate} 
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, startDate: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">End Date</label>
                            <input 
                              type="month" 
                              value={item.endDate} 
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, endDate: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Description</label>
                          <textarea 
                            rows={3}
                            value={item.description}
                            placeholder="Description / key achievements..."
                            onChange={(e) => {
                              const updated = sections.map(s => s.id === sec.id ? {
                                ...s,
                                items: s.items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i)
                              } : s);
                              setSections(updated);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 p-3 text-xs rounded-lg resize-none"
                          />
                        </div>
                      </div>
                    ))
                  ) : sec.type === "projects" ? (
                    sec.items.map((item: ProjectItem, idx: number) => (
                      <div key={item.id} className="space-y-3 bg-white p-4 border border-slate-200 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Project #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <button onClick={() => handleMoveItem(sec.id, idx, "up")} disabled={idx === 0} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▲</button>
                              <button onClick={() => handleMoveItem(sec.id, idx, "down")} disabled={idx === sec.items.length - 1} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▼</button>
                            </div>
                            <button onClick={() => handleDeleteItem(sec.id, item.id)} className="text-slate-400 hover:text-red-600 text-xs transition">✕ Remove</button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Project Title</label>
                          <input 
                            type="text" 
                            value={item.title} 
                            placeholder="Project Title"
                            onChange={(e) => {
                              const updated = sections.map(s => s.id === sec.id ? {
                                ...s,
                                items: s.items.map(i => i.id === item.id ? { ...i, title: e.target.value } : i)
                              } : s);
                              setSections(updated);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Start Date</label>
                            <input 
                              type="month" 
                              value={item.startDate} 
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, startDate: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">End Date</label>
                            <input 
                              type="month" 
                              value={item.endDate} 
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, endDate: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Description</label>
                          <textarea 
                            rows={3}
                            value={item.description}
                            placeholder="Project description and tech stack used..."
                            onChange={(e) => {
                              const updated = sections.map(s => s.id === sec.id ? {
                                ...s,
                                items: s.items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i)
                              } : s);
                              setSections(updated);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 p-3 text-xs rounded-lg resize-none"
                          />
                        </div>
                      </div>
                    ))
                  ) : sec.type === "skills" ? (
                    sec.items.map((item: SkillCategoryItem, idx: number) => (
                      <div key={item.id} className="space-y-2 bg-white p-3 border border-slate-200 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">SKILL GROUP #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <button onClick={() => handleMoveItem(sec.id, idx, "up")} disabled={idx === 0} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▲</button>
                              <button onClick={() => handleMoveItem(sec.id, idx, "down")} disabled={idx === sec.items.length - 1} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▼</button>
                            </div>
                            <button onClick={() => handleDeleteItem(sec.id, item.id)} className="text-slate-400 hover:text-red-600 text-xs transition">✕ Remove</button>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Group Name</label>
                          <input 
                            type="text" 
                            value={item.groupName} 
                            placeholder="Group Name (e.g., frontend)"
                            onChange={(e) => {
                              const updated = sections.map(s => s.id === sec.id ? {
                                ...s,
                                items: s.items.map(i => i.id === item.id ? { ...i, groupName: e.target.value } : i)
                              } : s);
                              setSections(updated);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Skills</label>
                          <input 
                            type="text" 
                            value={item.skills} 
                            placeholder="Skills (comma separated, e.g., React, TypeScript, Tailwind)"
                            onChange={(e) => {
                              const updated = sections.map(s => s.id === sec.id ? {
                                ...s,
                                items: s.items.map(i => i.id === item.id ? { ...i, skills: e.target.value } : i)
                              } : s);
                              setSections(updated);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                          />
                        </div>
                      </div>
                    ))
                  ) : sec.type === "credentials" ? (
                    sec.items.map((item: CredentialItem, idx: number) => (
                      <div key={item.id} className="space-y-2 bg-white p-3 border border-slate-200 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Item #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <button onClick={() => handleMoveItem(sec.id, idx, "up")} disabled={idx === 0} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▲</button>
                              <button onClick={() => handleMoveItem(sec.id, idx, "down")} disabled={idx === sec.items.length - 1} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▼</button>
                            </div>
                            <button onClick={() => handleDeleteItem(sec.id, item.id)} className="text-slate-400 hover:text-red-600 text-xs transition">✕ Remove</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Name / Title</label>
                            <input 
                              type="text" 
                              value={item.name} 
                              placeholder="Name / Title"
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Issuer / Institution</label>
                            <input 
                              type="text" 
                              value={item.issuer} 
                              placeholder="Issuer / Institution"
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, issuer: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Start Date</label>
                            <input 
                              type="month" 
                              value={item.startDate} 
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, startDate: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-2.5 py-2 text-xs rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">End Date</label>
                            <input 
                              type="month" 
                              value={item.endDate} 
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, endDate: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-2.5 py-2 text-xs rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : sec.type === "references" ? (
                    sec.items.map((item: ReferenceItem, idx: number) => (
                      <div key={item.id} className="space-y-2 bg-white p-3 border border-slate-200 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Reference #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <button onClick={() => handleMoveItem(sec.id, idx, "up")} disabled={idx === 0} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▲</button>
                              <button onClick={() => handleMoveItem(sec.id, idx, "down")} disabled={idx === sec.items.length - 1} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▼</button>
                            </div>
                            <button onClick={() => handleDeleteItem(sec.id, item.id)} className="text-slate-400 hover:text-red-600 text-xs transition">✕ Remove</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Name</label>
                            <input 
                              type="text" 
                              value={item.name} 
                              placeholder="Name"
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Company</label>
                            <input 
                              type="text" 
                              value={item.company} 
                              placeholder="Company"
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, company: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Phone</label>
                            <input 
                              type="text" 
                              value={item.phone} 
                              placeholder="Phone"
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, phone: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Email</label>
                            <input 
                              type="email" 
                              value={item.email} 
                              placeholder="Email"
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, email: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : sec.type === "languages" ? (
                    sec.items.map((item: LanguageItem, idx: number) => (
                      <div key={item.id} className="space-y-2 bg-white p-3 border border-slate-200 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Language #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <button onClick={() => handleMoveItem(sec.id, idx, "up")} disabled={idx === 0} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▲</button>
                              <button onClick={() => handleMoveItem(sec.id, idx, "down")} disabled={idx === sec.items.length - 1} className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30">▼</button>
                            </div>
                            <button onClick={() => handleDeleteItem(sec.id, item.id)} className="text-slate-400 hover:text-red-600 text-xs transition">✕ Remove</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Language</label>
                            <input 
                              type="text" 
                              value={item.language} 
                              placeholder="Language (e.g., English, Filipino)"
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, language: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Proficiency</label>
                            <input 
                              type="text" 
                              value={item.proficiency} 
                              placeholder="Proficiency (e.g., Native, Fluent)"
                              onChange={(e) => {
                                const updated = sections.map(s => s.id === sec.id ? {
                                  ...s,
                                  items: s.items.map(i => i.id === item.id ? { ...i, proficiency: e.target.value } : i)
                                } : s);
                                setSections(updated);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    sec.items.map((item: StandardItem, idx: number) => (
                      <div key={item.id} className="flex gap-2 items-center">
                        <div className="flex flex-col gap-1">
                          <button onClick={() => handleMoveItem(sec.id, idx, "up")} disabled={idx === 0} className="text-[10px] text-slate-400 hover:text-slate-700 disabled:opacity-30">▲</button>
                          <button onClick={() => handleMoveItem(sec.id, idx, "down")} disabled={idx === sec.items.length - 1} className="text-[10px] text-slate-400 hover:text-slate-700 disabled:opacity-30">▼</button>
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Content</label>
                          <textarea 
                            rows={2}
                            value={item.content}
                            placeholder="Enter content details..."
                            onChange={(e) => {
                              const updated = sections.map(s => s.id === sec.id ? {
                                ...s,
                                items: s.items.map(i => i.id === item.id ? { ...i, content: e.target.value } : i)
                              } : s);
                              setSections(updated);
                            }}
                            className="w-full bg-white border border-slate-200 p-3 text-xs text-slate-700 rounded-lg focus:outline-none focus:border-[#0D9488] resize-none"
                          />
                        </div>
                        <button 
                          onClick={() => handleDeleteItem(sec.id, item.id)}
                          className="text-slate-400 hover:text-red-600 px-2 text-xs transition self-end pb-3"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}

                  <button 
                    onClick={() => handleAddItem(sec.id, sec.type)}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    + Add Item
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Section Buttons Grid */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <label className="text-[10px] uppercase font-semibold text-slate-400 block">Add Section</label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_SECTIONS.map((preset) => {
              const isCustom = preset.title.includes("Custom");
              const isAlreadyAdded = !isCustom && sections.some(s => s.title === preset.title);
              return (
                <button
                  key={preset.title}
                  disabled={isAlreadyAdded}
                  onClick={() => handleAddSectionPreset(preset.title, preset.type)}
                  className={`text-xs font-medium px-3 py-2 rounded-xl border text-left transition flex items-center justify-between ${
                    isAlreadyAdded 
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60" 
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-[#0D9488]"
                  }`}
                >
                  <span className="truncate">{preset.title}</span>
                  <span className="text-teal-600 font-bold ml-1">{isAlreadyAdded ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}