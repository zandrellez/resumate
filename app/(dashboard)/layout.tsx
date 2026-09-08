"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserSession() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch the user's full name from the profiles table we created earlier
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();

        if (profile?.full_name) {
          // Extract only the first name
          const first = profile.full_name.trim().split(" ")[0];
          setFirstName(first);
        } else {
          setFirstName("Account");
        }
      }
      setLoading(false);
    }

    getUserSession();

    // Listen for auth state changes (login/logout events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setFirstName(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setFirstName(null);
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#0D9488] selection:text-white">
      {/* Floating Capsule Navbar */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-6 sticky top-0 z-40">
        <header className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-full px-6 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-base font-extrabold tracking-tight text-[#0F172A]">
              resumate<span className="text-[#0D9488]">.</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/"
                className="text-xs font-semibold tracking-wide text-slate-600 hover:text-[#0F172A] transition"
              >
                Home
              </Link>
              <Link 
                href="/jobs"
                className="text-xs font-semibold tracking-wide text-slate-600 hover:text-[#0F172A] transition"
              >
                Jobs
              </Link>
              <Link 
                href="/resume"
                className="text-xs font-semibold tracking-wide text-slate-600 hover:text-[#0F172A] transition"
              >
                Master Resume
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {!loading && (
              firstName ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#0F172A] bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                    Hi, {firstName}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-semibold text-slate-500 hover:text-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/auth"
                  className="bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition shadow-sm"
                >
                  Login
                </Link>
              )
            )}
          </div>
        </header>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 flex flex-col justify-center">
        {children}
      </main>
    </div>
  );
}