import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import Parent from '@/lib/models/Parent';
import Daycare from '@/lib/models/Daycare';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user data based on type
    let user;
    if (session.type === 'daycare') {
      user = await Daycare.findById(session.userId).select('-password');
    } else {
      user = await Parent.findById(session.userId).select('-password');
    }

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: session.type,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Authentication check failed' },
      { status: 500 }
    );
  }
} 