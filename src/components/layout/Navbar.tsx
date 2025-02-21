'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Define navigation links based on user type
  const getNavLinks = () => {
    if (!user) {
      // Public navigation
      return [
        { href: '/', label: 'Home' },
        { href: '/auth/login', label: 'Login' },
        { href: '/auth/register', label: 'Register as Parent' },
        { href: '/daycare/register', label: 'Register Daycare' },
      ];
    }

    if (user.type === 'parent') {
      // Parent navigation
      return [
        { href: '/dashboard', label: 'My Bookings' },
        { href: '/daycare/search', label: 'Find Daycare' },
        { href: '/profile', label: 'Profile' },
      ];
    }

    // Daycare navigation
    return [
      { href: '/daycare/dashboard', label: 'Dashboard' },
      { href: '/profile', label: 'Profile' },
    ];
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {pathname !== '/' && (
              <button
                onClick={() => router.back()}
                className="mr-4 text-gray-500 hover:text-gray-700"
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
            )}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Parvarish</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`ml-8 px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="ml-8 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 text-base font-medium ${
                pathname === link.href
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 