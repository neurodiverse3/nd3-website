import { NextResponse } from 'next/server';
import { 
  getEnvVars, 
  safeCompare, 
  signSession, 
  getIpAddress, 
  isLockedOut, 
  getLockoutDuration, 
  recordFailedAttempt, 
  clearFailedAttempts 
} from '../../../../lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const ip = getIpAddress(request);

  // 1. Check rate limit
  if (isLockedOut(ip)) {
    const remaining = getLockoutDuration(ip);
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${remaining} seconds.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode) {
      return NextResponse.json({ error: 'Passcode required' }, { status: 400 });
    }

    const env = getEnvVars();
    const securePassword = env.COMMAND_CENTRE_PASSWORD;

    if (!securePassword) {
      console.warn('[Login] COMMAND_CENTRE_PASSWORD is not configured. Rejecting all logins.');
      return NextResponse.json({ error: 'Authentication disabled (system unconfigured)' }, { status: 503 });
    }

    // 2. Validate passcode securely
    if (safeCompare(passcode, securePassword)) {
      clearFailedAttempts(ip);

      // Create session expires in 15 mins
      const expiresAt = Date.now() + 15 * 60 * 1000;
      const sessionToken = signSession(expiresAt, securePassword);

      const response = NextResponse.json({ success: true });
      
      // Set secure HttpOnly cookie
      response.cookies.set({
        name: 'nd3_admin_session',
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 900 // 15 mins
      });

      return response;
    } else {
      const attempt = recordFailedAttempt(ip);
      if (attempt.count >= 5) {
        return NextResponse.json(
          { error: 'Invalid passcode. Too many failed attempts. Account locked for 15 minutes.' },
          { status: 401 }
        );
      }
      const remainingAttempts = 5 - attempt.count;
      return NextResponse.json(
        { error: `Invalid passcode. ${remainingAttempts} attempts remaining.` },
        { status: 401 }
      );
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
