import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Daycare from '@/lib/models/Daycare';

export async function GET(request: Request) {
  try {
    await connectDB();

    // Fetch all daycares (removing isApproved filter for now)
    const daycares = await Daycare.find(
      {},
      {
        password: 0, // Exclude password
        __v: 0, // Exclude version key
      }
    );

    console.log('Found daycares:', daycares.length); // Debug log

    return NextResponse.json(daycares);
  } catch (error: any) {
    console.error('Error fetching daycares:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch daycares' },
      { status: 500 }
    );
  }
} 