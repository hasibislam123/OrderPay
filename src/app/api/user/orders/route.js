import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(request) {
  try {
    const { authenticated, userId, error } = await authenticateRequest(request);

    if (!authenticated) {
      return unauthorizedResponse(error);
    }

    // Fetch user's orders from database
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}