'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be replaced with actual auth state
  const [userType, setUserType] = useState<'parent' | 'daycare' | null>(null); // This will be replaced with actual user type

  // This will be replaced with actual auth check
  useState(() => {
    // Check for token in cookies and user type
    const token = document.cookie.includes('token=');
    if (token) {
      setIsLoggedIn(true);
      // For now, we'll assume parent type. In real app, decode JWT to get user type
      setUserType('parent');
    }
  });

  const navLinks = isLoggedIn ? (
    userType === 'parent' ? [
      { href: '/daycare/search', label: 'Book Daycare' },
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/profile', label: 'Profile' },
      { href: '/auth/logout', label: 'Logout' },
    ] : [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/profile', label: 'Profile' },
      { href: '/auth/logout', label: 'Logout' },
    ]
  ) : [
    { href: '/auth/login', label: 'Login' },
    { href: '/auth/register', label: 'Register' },
    { href: '/daycare/register', label: 'Register Daycare' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
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
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 