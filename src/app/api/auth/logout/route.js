import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // In a real application, you would clear the session cookie here
    // For now, we'll just return a success message
    
    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}