import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Daycare from '@/lib/models/Daycare';

export async function GET(request: Request) {
  try {
    await connectDB();

    // Only fetch approved daycares and exclude sensitive information
    const daycares = await Daycare.find(
      { isApproved: true },
      {
        password: 0, // Exclude password
        __v: 0, // Exclude version key
      }
    );

    return NextResponse.json(daycares);
  } catch (error: any) {
    console.error('Error fetching daycares:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch daycares' },
      { status: 500 }
    );
  }
} 