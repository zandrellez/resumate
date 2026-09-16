"use client";

import React, { useEffect, useState } from "react";
import ResumeForm, { ResumeSection } from "@/app/components/ResumeForm";
import ResumePreview from "@/app/components/ResumePreview";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MasterResumePage() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  });

  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch resume data from Supabase on mount
  useEffect(() => {
    async function fetchMasterResume() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("master_resumes")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        if (data.personal_info) setPersonalInfo(data.personal_info);
        if (data.sections) setSections(data.sections);
      }
      setLoading(false);
    }

    fetchMasterResume();
  }, []);

  // Save resume data to Supabase
  const handleSaveResume = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("You must be logged in to save your resume.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("master_resumes")
      .upsert({
        user_id: user.id,
        personal_info: personalInfo,
        sections: sections,
        updated_at: new Date(),
      }, { onConflict: "user_id" });

    if (error) {
      alert(`Error saving resume: ${error.message}`);
    } else {
      alert("Master resume saved successfully to database!");
    }
    setSaving(false);
  };

  // Real PDF Parsing Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
      }

      // Send raw text to your API route for intelligent structuring
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: fullText }),
      });

      const data = await res.json();
      if (data.personalInfo) setPersonalInfo(data.personalInfo);
      
      if (data.sections) {
        // Guarantee unique IDs across all incoming sections and items to prevent React key collision warnings
        const sanitizedSections = data.sections.map((sec: any, sIdx: number) => ({
          ...sec,
          id: sec.id || `sec-${Date.now()}-${sIdx}`,
          items: (sec.items || []).map((item: any, iIdx: number) => ({
            ...item,
            id: item.id || `item-${Date.now()}-${sIdx}-${iIdx}`,
          })),
        }));
        setSections(sanitizedSections);
      }

      alert("Resume parsed successfully using AI!");
    } catch (err) {
      console.error(err);
      alert("AI parsing failed.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar for Database Sync */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Master Resume Workspace</h2>
          <p className="text-xs text-slate-500">Changes sync directly to your secure cloud database.</p>
        </div>
        <button
          onClick={handleSaveResume}
          disabled={saving || loading}
          className="bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Master Resume"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full max-w-7xl mx-auto">
        {/* Left Column: Form Editor */}
        <div className="xl:col-span-6 w-full space-y-6">
          <ResumeForm 
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
            sections={sections}
            setSections={setSections}
            onFileUpload={handleFileUpload}
          />
        </div>

        {/* Right Column: Live ATS-Friendly Document Preview */}
        <div className="xl:col-span-6">
          <ResumePreview personalInfo={personalInfo} sections={sections} />
        </div>
      </div>
    </div>
  );
}