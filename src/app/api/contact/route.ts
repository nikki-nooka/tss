import { NextResponse } from 'next/server';
import { getMessages, insertMessage, ContactMessage } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// GET: Fetch contact messages (Admin/HR only)
export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST: Submit a contact message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Server-side validation
    if (!name || name.trim().length < 3) {
      return NextResponse.json({ error: 'Name must be at least 3 characters' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }
    if (!phone || phone.trim().length < 10) {
      return NextResponse.json({ error: 'Please enter a valid phone number' }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters long' }, { status: 400 });
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString()
    };

    await insertMessage(newMessage);

    return NextResponse.json({ message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) {
    console.error('Failed to submit contact message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
