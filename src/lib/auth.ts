import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export async function createSessionToken(payload: { userId: string; email: string; type: 'parent' | 'daycare' }) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d') // Token expires in 30 days
      .setIssuedAt()
      .sign(new TextEncoder().encode(JWT_SECRET));

    return token;
  } catch (error) {
    console.error('Error creating session token:', error);
    throw error;
  }
}

export async function setSessionCookie(token: string) {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export async function getSession() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return null;

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    return {
      userId: verified.payload.userId as string,
      email: verified.payload.email as string,
      type: verified.payload.type as 'parent' | 'daycare',
    };
  } catch (error) {
    return null;
  }
}

export function clearSession() {
  cookies().delete('token');
} 