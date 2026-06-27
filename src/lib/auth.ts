import { cookies } from 'next/headers';

export interface AdminUser {
  email: string;
  role: 'Admin' | 'HR';
}

const ADMIN_CREDENTIALS = [
  { email: 'contact.thestudentspot@gmail.com', password: 'Rajkamal@TSS', role: 'Admin' },
  { email: 'hr@thestudentspot.com', password: 'TssHr2026!', role: 'HR' }
];

export const authenticateAdmin = (email: string, password: string): AdminUser | null => {
  const user = ADMIN_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );
  if (user) {
    return { email: user.email, role: user.role as 'Admin' | 'HR' };
  }
  return null;
};

// Check if current user is admin/hr based on HTTP cookie
export const getSessionUser = async (): Promise<AdminUser | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tss_admin_session')?.value;
    if (!token) return null;

    // Token format: "email|role|timestamp" (a simple secure session signature for Phase 1)
    const [email, role, timestampStr] = token.split('|');
    if (!email || !role || !timestampStr) return null;

    const timestamp = parseInt(timestampStr, 10);
    const ONE_DAY = 24 * 60 * 60 * 1000;
    
    // Check if token expired
    if (Date.now() - timestamp > ONE_DAY) {
      return null;
    }

    // Verify against our credentials list
    const validUser = ADMIN_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.role === role
    );
    if (!validUser) return null;

    return { email, role: role as 'Admin' | 'HR' };
  } catch (error) {
    console.error('Session retrieval failed', error);
    return null;
  }
};
