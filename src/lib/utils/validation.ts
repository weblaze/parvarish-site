import { VALIDATION } from '../constants';

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < VALIDATION.password.minLength) return VALIDATION.password.message;
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  if (!VALIDATION.phone.pattern.test(phone)) return VALIDATION.phone.message;
  return null;
};

export const validateRequired = (value: string, field: string): string | null => {
  if (!value) return `${field} is required`;
  return null;
};

export const validateDate = (date: Date | null): string | null => {
  if (!date) return 'Date is required';
  if (date < new Date()) return 'Date cannot be in the past';
  return null;
}; 