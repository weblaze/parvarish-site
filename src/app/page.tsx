'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Daycare {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  description: string;
  operatingHours: string;
  ageRange: string;
}

export default function HomePage() {
  const router = useRouter();
  const [daycares, setDaycares] = useState<Daycare[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchDaycares();
    // Check if user is logged in
    const token = document.cookie.includes('token=');
    setIsLoggedIn(token);
  }, []);

  const fetchDaycares = async () => {
    try {
      const response = await fetch('/api/daycares');
      if (response.ok) {
        const data = await response.json();
        setDaycares(data);
      } else {
        setError('Failed to fetch daycares');
      }
    } catch (err) {
      setError('An error occurred while fetching daycares');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (daycareId: string) => {
    if (!isLoggedIn) {
      // Show login alert and redirect to login page
      alert('Please log in to book a daycare');
      router.push('/auth/login');
      return;
    }
    router.push(`/booking/new?daycare=${daycareId}`);
  };

  const filteredDaycares = daycares.filter(daycare =>
    daycare.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    daycare.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    daycare.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Find the Perfect Daycare for Your Child
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
              Browse through our curated list of trusted daycare centers and find the best care for your little ones.
            </p>
            {!isLoggedIn && (
              <div className="mt-8 flex justify-center space-x-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Register as Parent
                </Link>
                <Link
                  href="/daycare/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600"
                >
                  Register Your Daycare
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by daycare name, city, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Daycares Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading daycares...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDaycares.map((daycare) => (
              <div
                key={daycare._id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{daycare.name}</h3>
                  <p className="mt-2 text-gray-600">
                    {daycare.city}, {daycare.state}
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Capacity:</span> {daycare.capacity} children
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Ages:</span> {daycare.ageRange}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Hours:</span> {daycare.operatingHours}
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 line-clamp-3">{daycare.description}</p>
                  <div className="mt-6">
                    <button
                      onClick={() => handleBooking(daycare._id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredDaycares.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No daycares found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50 mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Are you a daycare provider?</span>
            <span className="block text-indigo-600">Join our platform today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/daycare/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Register Your Daycare
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 