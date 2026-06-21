import { NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const adminUser = authenticateAdmin(email, password);
    if (!adminUser) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate token: "email|role|timestamp"
    const timestamp = Date.now();
    const token = `${adminUser.email}|${adminUser.role}|${timestamp}`;

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: adminUser.email,
        role: adminUser.role
      }
    });

    // Set HTTP-Only secure cookie
    response.cookies.set({
      name: 'tss_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
