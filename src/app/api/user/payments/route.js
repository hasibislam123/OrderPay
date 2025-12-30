import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(request) {
  try {
    const { authenticated, userId, error } = await authenticateRequest(request);

    if (!authenticated) {
      return unauthorizedResponse(error);
    }

    // Fetch user's payments from database
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        order: true // Include related order information
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    console.error('Payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}