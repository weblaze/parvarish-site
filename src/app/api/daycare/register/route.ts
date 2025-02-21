import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Daycare from '@/lib/models/Daycare';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      zipCode,
      capacity,
      description,
      operatingHours,
      ageRange,
      licensingInfo,
    } = body;

    // Check if daycare already exists
    const existingDaycare = await Daycare.findOne({ email });
    if (existingDaycare) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new daycare
    const daycare = await Daycare.create({
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      zipCode,
      capacity: Number(capacity),
      description,
      operatingHours,
      ageRange,
      licensingInfo,
    });

    // Remove password from response
    const daycareResponse = {
      id: daycare._id,
      name: daycare.name,
      email: daycare.email,
      phone: daycare.phone,
      address: daycare.address,
      city: daycare.city,
      state: daycare.state,
      zipCode: daycare.zipCode,
      capacity: daycare.capacity,
      description: daycare.description,
      operatingHours: daycare.operatingHours,
      ageRange: daycare.ageRange,
      licensingInfo: daycare.licensingInfo,
      isApproved: daycare.isApproved,
    };

    return NextResponse.json(
      { message: 'Registration successful', daycare: daycareResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
} 