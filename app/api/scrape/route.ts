import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ success: false, error: "Missing URL parameter" }, { status: 400 });
  }

  try {
    // Using Jina AI Reader API to convert any public job posting URL into clean text/markdown
    const jinaResponse = await fetch(`https://r.jina.ai/${encodeURIComponent(targetUrl)}`, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!jinaResponse.ok) {
      throw new Error("Failed to fetch page content from URL.");
    }

    const data = await jinaResponse.json();
    const scrapedText = data.data?.content || data.content || "";

    return NextResponse.json({
      success: true,
      jobDescription: scrapedText,
      companyName: data.data?.title ? data.data.title.split("–")[0]?.trim() : "",
      roleTitle: data.data?.title ? data.data.title.split("–")[1]?.trim() : "",
    });
  } catch (err: any) {
    console.error("Scraping error:", err);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to scrape URL automatically. Please paste details manually.' 
    }, { status: 500 });
  }
}