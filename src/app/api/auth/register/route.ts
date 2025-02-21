import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Parent from '@/lib/models/Parent';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Check if parent already exists
    const existingParent = await Parent.findOne({ email });
    if (existingParent) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new parent
    const parent = await Parent.create({
      name,
      email,
      password,
      phone,
    });

    // Remove password from response
    const parentResponse = {
      id: parent._id,
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
    };

    return NextResponse.json(
      { message: 'Registration successful', parent: parentResponse },
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