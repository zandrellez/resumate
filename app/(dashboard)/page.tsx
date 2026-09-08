"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [jobUrl, setJobUrl] = useState("");
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tailoredResume, setTailoredResume] = useState("");

  const handleUrlScrape = async () => {
    if (!jobUrl) return;
    alert("Scraping job posting...");
    try {
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(jobUrl)}`);
      const data = await res.json();
      if (data.success) {
        setJobDescription(data.jobDescription);
        if (data.companyName) setCompanyName(data.companyName);
        if (data.roleTitle) setRoleTitle(data.roleTitle);
        setShowManualFallback(true); // Open fields to review
        alert("Job description extracted successfully!");
      } else {
        alert(data.message);
        setShowManualFallback(true);
      }
    } catch (err) {
      console.error(err);
      alert("Scraping failed. Please use manual entry.");
      setShowManualFallback(true);
    }
  }; 

  const handleTailorSubmit = async (descToUse: string) => {
    if (!descToUse && !jobUrl) {
      alert("Please provide a job description or URL.");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in to tailor resumes.");
        return;
      }

      const res = await fetch("/api/tailor-resume", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          jobUrl,
          companyName,
          roleTitle,
          jobDescription: descToUse,
        }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setTailoredResume(data.tailoredResume);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to tailoring pipeline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
      <div className="md:col-span-7 space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0F172A] leading-tight">
            Tailor your resume for any role now!
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-lg">
            With resumate, anyone can secure their dream position instantly. Just paste a job description or URL. It's that easy.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 p-2 rounded-full shadow-md flex items-center max-w-lg">
          <div className="pl-4 pr-3 text-xs font-semibold text-slate-400 border-r border-slate-200 hidden sm:block">
            Target URL
          </div>
          <input 
            type="url" 
            placeholder="Paste job posting link..."
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className="flex-1 bg-transparent px-4 py-2 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none"
          />
          <button 
            onClick={async () => {
              await handleUrlScrape();
              if (jobDescription) {
                await handleTailorSubmit(jobDescription);
              }
            }}
            disabled={loading}
            className="bg-[#0D9488] hover:bg-[#0F766E] text-white w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 shadow-sm disabled:opacity-50"
          >
            {loading ? "..." : "→"}
          </button>
        </div>

        <div>
          <button 
            onClick={() => setShowManualFallback(!showManualFallback)}
            className="text-xs font-medium text-slate-500 hover:text-[#0D9488] transition underline underline-offset-4"
          >
            {showManualFallback ? "Hide manual entry" : "URL blocked or unavailable? Enter details manually"}
          </button>
        </div>

        {showManualFallback && (
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-[#0F172A] rounded-xl focus:outline-none focus:border-[#0D9488]"
              />
              <input 
                type="text" 
                placeholder="Role Title"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-[#0F172A] rounded-xl focus:outline-none focus:border-[#0D9488]"
              />
            </div>
            <textarea 
              rows={3}
              placeholder="Paste full job description text here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-4 text-sm text-[#0F172A] rounded-xl focus:outline-none focus:border-[#0D9488] resize-none"
            />
            <button 
              onClick={() => handleTailorSubmit(jobDescription)}
              disabled={loading}
              className="w-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "Analyzing and Tailoring..." : "Analyze Description"}
            </button>
          </div>
        )}
      </div>

      <div className="md:col-span-5 flex justify-center w-full">
        {tailoredResume ? (
          <div className="w-full bg-white border border-slate-200 p-6 rounded-3xl shadow-md space-y-4 max-h-[600px] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#0F172A]">Tailored Resume Output</h3>
              <button 
                onClick={() => navigator.clipboard.writeText(tailoredResume)}
                className="text-xs bg-teal-50 text-[#0D9488] font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-100 transition"
              >
                Copy Markdown
              </button>
            </div>
            <pre className="flex-1 overflow-y-auto text-xs text-slate-700 whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
              {tailoredResume}
            </pre>
            <button 
              onClick={() => setTailoredResume("")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition"
            >
              Tailor Another
            </button>
          </div>
        ) : (
          <div className="w-full h-80 bg-gradient-to-br from-slate-100 to-slate-200/50 border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] font-bold text-xs">
                AI
              </div>
              <div className="text-sm font-bold text-slate-800">Match Optimization Ready</div>
              <p className="text-xs text-slate-500">Real-time keyword scoring and ATS alignment engine.</p>
            </div>
            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-2 shadow-sm">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Target Match Score</span>
                <span className="text-[#0D9488]">94%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0D9488] h-full w-[94%]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}