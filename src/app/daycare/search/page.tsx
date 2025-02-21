'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Daycare {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  description: string;
  operatingHours: string;
  ageRange: string;
}

export default function SearchDaycarePage() {
  const router = useRouter();
  const [daycares, setDaycares] = useState<Daycare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    ageRange: '',
  });

  useEffect(() => {
    fetchDaycares();
  }, []);

  const fetchDaycares = async () => {
    try {
      const response = await fetch('/api/daycares');
      if (!response.ok) {
        throw new Error('Failed to fetch daycares');
      }
      const data = await response.json();
      setDaycares(data);
    } catch (err) {
      setError('Failed to load daycares');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDaycares = daycares.filter(daycare => {
    const matchesSearch = daycare.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      daycare.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = !filters.city || daycare.city.toLowerCase().includes(filters.city.toLowerCase());
    const matchesState = !filters.state || daycare.state.toLowerCase().includes(filters.state.toLowerCase());
    const matchesAge = !filters.ageRange || daycare.ageRange.toLowerCase().includes(filters.ageRange.toLowerCase());

    return matchesSearch && matchesCity && matchesState && matchesAge;
  });

  const initiateBooking = (daycareId: string) => {
    router.push(`/booking/new?daycare=${daycareId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading daycares...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Daycares</h1>
          <p className="mt-2 text-gray-600">Find and book the perfect daycare for your child</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search daycares..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Filter by city..."
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Filter by state..."
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Filter by age range..."
              value={filters.ageRange}
              onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Daycares Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDaycares.map((daycare) => (
            <div
              key={daycare._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{daycare.name}</h2>
                <p className="text-gray-600 mb-4">{daycare.description}</p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {daycare.address}, {daycare.city}, {daycare.state} {daycare.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Capacity:</span> {daycare.capacity} children
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Hours:</span> {daycare.operatingHours}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Age Range:</span> {daycare.ageRange}
                  </p>
                </div>

                <button
                  onClick={() => initiateBooking(daycare._id)}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDaycares.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No daycares found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 