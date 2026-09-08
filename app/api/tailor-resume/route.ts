import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(req: Request) {
  try {
    const { companyName, roleTitle, jobDescription, jobUrl } = await req.json();

    // 1. Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 2. Extract authorization headers to verify the logged-in user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header. Please log in." }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized user session." }, { status: 401 });
    }

    // 3. Fetch the logged-in user's master resume using their strict user_id
    const { data: resumeData, error: resumeError } = await supabase
      .from("master_resumes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (resumeError || !resumeData) {
      return NextResponse.json({ error: "Master resume not found for this account. Please save your master resume first." }, { status: 404 });
    }

    // 4. Send Payload to your n8n Webhook
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_TAILOR_WEBHOOK_URL || "";
    if (!n8nWebhookUrl) {
      return NextResponse.json({ error: "n8n webhook URL is not configured." }, { status: 500 });
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: {
          personalInfo: resumeData.personal_info,
          sections: resumeData.sections,
        },
        jobDescription: jobDescription || `Target URL: ${jobUrl}`,
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error("Failed to generate tailored resume from n8n workflow.");
    }

    const n8nResult = await n8nResponse.json();
    // n8n returns an array or object depending on your webhook configuration; handle both:
    const tailoredResumeMarkdown = Array.isArray(n8nResult) 
    ? (n8nResult[0]?.tailoredResume || n8nResult[0]?.output || "") 
    : (n8nResult.tailoredResume || n8nResult.output || "");

    // 5. Save the tailored entry into the job applications tracking table
    const { error: insertError } = await supabase
      .from("job_applications")
      .insert({
        user_id: user.id,
        company: companyName || "Target Company",
        role: roleTitle || "Target Role",
        status: "applied",
        tailored_resume: tailoredResumeMarkdown,
      });

    if (insertError) {
      console.error("Database save error:", insertError.message);
    }

    return NextResponse.json({ success: true, tailoredResume: tailoredResumeMarkdown });
  } catch (err: any) {
    console.error("Tailoring error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}