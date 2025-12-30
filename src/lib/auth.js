import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function authenticateRequest(request) {
  try {
    // Extract token from header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

    if (!token) {
      return {
        authenticated: false,
        error: 'Authentication required',
        userId: null
      };
    }

    // Verify the JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_key_for_development'
    );
    
    const verified = await jwtVerify(token, secret);
    const userId = verified.payload.userId;

    return {
      authenticated: true,
      error: null,
      userId: userId
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      authenticated: false,
      error: 'Invalid or expired token',
      userId: null
    };
  }
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}