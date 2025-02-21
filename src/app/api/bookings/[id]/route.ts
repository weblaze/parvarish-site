import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Get token from cookies
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and get user type
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const userType = verified.payload.type as string;

    // Only daycares can update booking status
    if (userType !== 'daycare') {
      return NextResponse.json(
        { message: 'Only daycares can update booking status' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
} 