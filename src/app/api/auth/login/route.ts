import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Parent from '@/lib/models/Parent';
import Daycare from '@/lib/models/Daycare';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password, type } = body;

    let user;
    let userType: 'parent' | 'daycare';

    // Check if user exists
    if (type === 'daycare') {
      user = await Daycare.findOne({ email });
      userType = 'daycare';
    } else {
      user = await Parent.findOne({ email });
      userType = 'parent';
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSessionToken({
      userId: user._id.toString(),
      email: user.email,
      type: userType,
    });

    // Set session cookie
    await setSessionCookie(token);

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      type: userType,
    };

    return NextResponse.json(
      { 
        message: 'Login successful',
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
} 