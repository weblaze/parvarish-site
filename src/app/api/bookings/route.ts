import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
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

    // Verify token and get user ID and type
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const userId = verified.payload.userId as string;
    const userType = verified.payload.type as string;

    let bookings;
    if (userType === 'daycare') {
      // If daycare, get bookings for this daycare with parent details
      bookings = await Booking.find({ daycare: userId })
        .populate({
          path: 'parent',
          select: 'name email phone', // Exclude sensitive info
        })
        .populate({
          path: 'daycare',
          select: 'name address city state operatingHours', // Include relevant daycare info
        })
        .sort({ createdAt: -1 });
    } else {
      // If parent, get bookings made by this parent with daycare details
      bookings = await Booking.find({ parent: userId })
        .populate({
          path: 'daycare',
          select: 'name address city state operatingHours',
        })
        .populate({
          path: 'parent',
          select: 'name email phone',
        })
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    // Verify token and get user ID
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const userId = verified.payload.userId as string;
    const userType = verified.payload.type as string;

    // Only parents can create bookings
    if (userType !== 'parent') {
      return NextResponse.json(
        { message: 'Only parents can create bookings' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      daycare,
      childName,
      childAge,
      startDate,
      endDate,
      schedule,
      specialNeeds,
      allergies,
      notes,
    } = body;

    // Create new booking
    const booking = await Booking.create({
      parent: userId,
      daycare,
      child: {
        name: childName,
        age: childAge,
        specialNeeds,
        allergies,
      },
      startDate,
      endDate,
      schedule,
      notes,
    });

    // Populate the booking with parent and daycare details
    await booking.populate([
      {
        path: 'parent',
        select: 'name email phone',
      },
      {
        path: 'daycare',
        select: 'name address city state operatingHours',
      },
    ]);

    return NextResponse.json(
      { message: 'Booking created successfully', booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
} 