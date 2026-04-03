import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // OAuth callback — redirect to onboarding (auth is handled client-side with signInWithPopup)
  return NextResponse.redirect(new URL('/onboarding', request.url));
}
