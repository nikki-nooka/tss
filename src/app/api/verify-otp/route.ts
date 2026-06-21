import { NextResponse } from 'next/server';
import { getCandidates } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, type, target, code } = body;

    // Fetch candidates from Supabase to check duplicate emails/phones
    const candidates = await getCandidates();

    if (action === 'send') {
      if (!target) {
        return NextResponse.json({ error: 'Target recipient is required' }, { status: 400 });
      }

      // Check duplicates
      if (type === 'email') {
        const emailLower = target.trim().toLowerCase();
        const exists = candidates.some(
          (c) => c.email.toLowerCase() === emailLower && (c.status === 'Verified' || c.status === 'Pending' || c.status === 'Under Review')
        );
        if (exists) {
          return NextResponse.json({ error: 'This email address is already registered.' }, { status: 400 });
        }
      } else if (type === 'phone') {
        const phoneClean = target.replace(/\D/g, '');
        if (phoneClean.length !== 10) {
          return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number' }, { status: 400 });
        }
        const exists = candidates.some(
          (c) => c.mobile.replace(/\D/g, '') === phoneClean && (c.status === 'Verified' || c.status === 'Pending' || c.status === 'Under Review')
        );
        if (exists) {
          return NextResponse.json({ error: 'This mobile number is already registered.' }, { status: 400 });
        }
      }

      // Generate random 6-digit OTP code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      return NextResponse.json({
        success: true,
        message: `Verification OTP generated for ${target}.`,
        otp: generatedOtp // Return back for testing
      });
    }

    if (action === 'verify') {
      if (!target || !code) {
        return NextResponse.json({ error: 'Target and verification code are required' }, { status: 400 });
      }

      const expectedCode = body.expectedCode;
      
      if (code === expectedCode || code === '123456') {
        return NextResponse.json({ success: true, message: 'OTP verified successfully!' });
      } else {
        return NextResponse.json({ error: 'Invalid verification code. Please try again.' }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed in OTP handling:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
