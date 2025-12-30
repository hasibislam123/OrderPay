import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(request) {
  try {
    const { authenticated, userId, error } = await authenticateRequest(request);

    if (!authenticated) {
      return unauthorizedResponse(error);
    }

    // Fetch user data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}