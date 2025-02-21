// Environment Variables with defaults
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parvarish';

// Authentication
export const TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// Route Configurations
export const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/daycare/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/daycare/register',
] as const;

export const PARENT_ROUTES = [
  '/dashboard',
  '/daycare/search',
  '/booking/new',
] as const;

export const DAYCARE_ROUTES = [
  '/daycare/dashboard',
] as const;

// API Endpoints
export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    check: '/api/auth/check',
  },
  daycare: {
    register: '/api/daycare/register',
    list: '/api/daycares',
    details: (id: string) => `/api/daycares/${id}`,
  },
  bookings: {
    create: '/api/bookings',
    list: '/api/bookings',
    update: (id: string) => `/api/bookings/${id}`,
  },
} as const;

// Validation
export const VALIDATION = {
  password: {
    minLength: 6,
    message: 'Password must be at least 6 characters long',
  },
  phone: {
    pattern: /^\+?[\d\s-]{10,}$/,
    message: 'Please enter a valid phone number',
  },
} as const;

// Booking Configuration
export const BOOKING_SCHEDULES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time-morning', label: 'Part Time - Morning' },
  { value: 'part-time-afternoon', label: 'Part Time - Afternoon' },
] as const; 