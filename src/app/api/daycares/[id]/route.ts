import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Daycare from '@/lib/models/Daycare';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const daycare = await Daycare.findById(params.id, {
      password: 0, // Exclude password
      __v: 0, // Exclude version key
    });

    if (!daycare) {
      return NextResponse.json(
        { message: 'Daycare not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(daycare);
  } catch (error: any) {
    console.error('Error fetching daycare:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch daycare' },
      { status: 500 }
    );
  }
} 