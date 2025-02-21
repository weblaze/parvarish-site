'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  _id: string;
  daycare: {
    name: string;
    address: string;
    city: string;
    state: string;
    operatingHours: string;
  };
  child: {
    name: string;
    age: number;
    specialNeeds: string;
    allergies: string;
  };
  startDate: string;
  endDate: string;
  schedule: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  notes: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        fetchBookings();
      }
    }
  }, [user, authLoading]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('An error occurred while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        fetchBookings(); // Refresh bookings after cancellation
      } else {
        setError('Failed to cancel booking');
      }
    } catch (err) {
      setError('An error occurred while cancelling the booking');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Bookings
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => router.push('/daycare/search')}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Book New Daycare
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {bookings.length === 0 ? (
              <li className="px-4 py-5 sm:px-6">
                <div className="text-center text-gray-500">
                  No bookings found. Start by booking a daycare!
                </div>
              </li>
            ) : (
              bookings.map((booking) => (
                <li key={booking._id} className="px-4 py-5 sm:px-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.daycare.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full
                          ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                          ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${booking.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                          ${booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : ''}
                        `}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {booking.daycare.address}, {booking.daycare.city}, {booking.daycare.state}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Child:</span> {booking.child.name} ({booking.child.age} years)
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Schedule:</span> {booking.schedule}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Dates:</span>{' '}
                          {new Date(booking.startDate).toLocaleDateString()} to{' '}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                        {booking.child.specialNeeds && (
                          <p className="text-sm">
                            <span className="font-medium">Special Needs:</span> {booking.child.specialNeeds}
                          </p>
                        )}
                        {booking.child.allergies && (
                          <p className="text-sm">
                            <span className="font-medium">Allergies:</span> {booking.child.allergies}
                          </p>
                        )}
                        {booking.notes && (
                          <p className="text-sm">
                            <span className="font-medium">Notes:</span> {booking.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 