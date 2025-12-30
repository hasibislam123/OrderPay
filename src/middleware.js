import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/api/auth/register', '/api/auth/login', '/api/auth/logout', '/login', '/register'];

export async function middleware(request) {
  // Check if this is a public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + '/')
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check for authentication
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    // Redirect to login if not authenticated and trying to access protected route
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    // Verify the JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_key_for_development'
    );
    
    const verified = await jwtVerify(token, secret);
    
    // Token is valid, allow the request to continue
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};