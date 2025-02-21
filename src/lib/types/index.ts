// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  type: 'parent' | 'daycare';
  phone: string;
}

export interface Parent extends User {
  type: 'parent';
}

export interface Daycare extends User {
  type: 'daycare';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  description: string;
  operatingHours: string;
  ageRange: string;
  licensingInfo: string;
  isApproved: boolean;
}

// Booking Types
export interface Booking {
  _id: string;
  parent: Parent;
  daycare: Daycare;
  child: {
    name: string;
    age: number;
    specialNeeds: string;
    allergies: string;
  };
  startDate: string;
  endDate: string;
  schedule: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
  type: 'parent' | 'daycare';
}

export interface AuthResponse {
  user: User;
  message: string;
} 