import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#0D9488] selection:text-white">
      {/* Floating Capsule Navbar */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-6 sticky top-0 z-40">
        <header className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-full px-6 h-16 flex items-center justify-between soft-shadow">
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
            <Link 
              href="/auth"
              className="bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition shadow-sm"
            >
              Login
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 flex flex-col justify-center">
        {children}
      </main>
    </div>
  );
}