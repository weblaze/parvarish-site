'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  _id: string;
  parent: {
    name: string;
    email: string;
    phone: string;
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

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  cancelledBookings: number;
  averageChildAge: number;
  mostCommonSchedule: string;
}

export default function DaycareDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.type !== 'daycare') {
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
        calculateStats(data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('An error occurred while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingData: Booking[]) => {
    const stats = {
      totalBookings: bookingData.length,
      pendingBookings: bookingData.filter(b => b.status === 'pending').length,
      approvedBookings: bookingData.filter(b => b.status === 'approved').length,
      rejectedBookings: bookingData.filter(b => b.status === 'rejected').length,
      cancelledBookings: bookingData.filter(b => b.status === 'cancelled').length,
      averageChildAge: 0,
      mostCommonSchedule: '',
    };

    // Calculate average child age
    const totalAge = bookingData.reduce((sum, booking) => sum + booking.child.age, 0);
    stats.averageChildAge = totalAge / bookingData.length || 0;

    // Find most common schedule
    const schedules = bookingData.map(b => b.schedule);
    const scheduleCount = schedules.reduce((acc, schedule) => {
      acc[schedule] = (acc[schedule] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    stats.mostCommonSchedule = Object.entries(scheduleCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    setStats(stats);
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchBookings(); // Refresh bookings after update
      } else {
        setError('Failed to update booking status');
      }
    } catch (err) {
      setError('An error occurred while updating booking');
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  );

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
        {/* Stats Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Bookings</h3>
              <p className="text-3xl font-bold text-indigo-600">{stats?.totalBookings}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Pending Bookings</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats?.pendingBookings}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Average Child Age</h3>
              <p className="text-3xl font-bold text-green-600">
                {stats?.averageChildAge.toFixed(1)} years
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Popular Schedule</h3>
              <p className="text-xl font-bold text-purple-600">{stats?.mostCommonSchedule}</p>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Bookings</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      Child: {booking.child.name} ({booking.child.age} years)
                    </h4>
                    <p className="text-sm text-gray-500">
                      Parent: {booking.parent.name} ({booking.parent.email})
                    </p>
                    <p className="text-sm text-gray-500">Phone: {booking.parent.phone}</p>
                    <div className="mt-2 space-y-1">
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
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${booking.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                      ${booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    {booking.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'approved')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'rejected')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredBookings.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No bookings found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 