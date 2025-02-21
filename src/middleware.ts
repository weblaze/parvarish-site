import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/daycare/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/daycare/register',
];

// Routes that require parent role
const parentRoutes = [
  '/dashboard',
  '/daycare/search',
  '/booking/new',
];

// Routes that require daycare role
const daycareRoutes = [
  '/daycare/dashboard',
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/api/public/'))) {
    return NextResponse.next();
  }

  // Handle API routes separately
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // Verify token and get user type
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const userType = verified.payload.type as string;

    // Check access based on user type
    if (userType === 'parent' && daycareRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (userType === 'daycare' && parentRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/daycare/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If token is invalid, clear it and redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 