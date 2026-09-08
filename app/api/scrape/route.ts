import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  // Returns a clean JSON response instead of a 404 HTML page, 
  // triggering your frontend's graceful manual-paste fallback.
  return NextResponse.json({ 
    success: false, 
    message: 'Auto-scraping is disabled. Please paste the job description manually.' 
  });
}