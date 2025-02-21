import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
import mongoose from 'mongoose';

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

    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    console.log('Fetching bookings for:', { userId, userType }); // Debug log

    let bookings;
    if (userType === 'daycare') {
      // If daycare, get bookings for this daycare with parent details
      bookings = await Booking.find({ 
        daycare: new mongoose.Types.ObjectId(userId) 
      })
      .populate({
        path: 'parent',
        select: 'name email phone',
      })
      .populate({
        path: 'daycare',
        select: 'name address city state operatingHours',
      })
      .sort({ createdAt: -1 });

      console.log('Found daycare bookings:', bookings.length); // Debug log
    } else {
      // If parent, get bookings made by this parent with daycare details
      bookings = await Booking.find({ 
        parent: new mongoose.Types.ObjectId(userId) 
      })
      .populate({
        path: 'daycare',
        select: 'name address city state operatingHours',
      })
      .populate({
        path: 'parent',
        select: 'name email phone',
      })
      .sort({ createdAt: -1 });

      console.log('Found parent bookings:', bookings.length); // Debug log
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

    // Ensure daycare ID is valid
    if (!mongoose.Types.ObjectId.isValid(daycare)) {
      return NextResponse.json(
        { message: 'Invalid daycare ID' },
        { status: 400 }
      );
    }

    // Create new booking
    const booking = await Booking.create({
      parent: new mongoose.Types.ObjectId(userId),
      daycare: new mongoose.Types.ObjectId(daycare),
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