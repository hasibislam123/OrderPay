import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import prisma from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_key_for_development'
    );
    
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Return user data with token
    const { password: hashedPassword, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        user: userWithoutPassword,
        token // Include token in response (in a real app, you might set it as a cookie instead)
      },
      { status: 200 }
    );

    // Optionally set the token as an HTTP-only cookie
    // response.cookies.set('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 60 * 60 * 24, // 24 hours
    //   path: '/',
    //   sameSite: 'strict',
    // });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}