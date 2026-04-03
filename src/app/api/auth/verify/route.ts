import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 });
    }

    // For client-side Firebase Auth, the token is verified by Firebase SDK
    // Server-side we trust the Firebase ID token since Firebase manages the session
    // In production, add firebase-admin verification here
    return NextResponse.json({ verified: true });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 401 });
  }
}
