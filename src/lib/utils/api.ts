import { API_ROUTES } from '../constants';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Something went wrong',
    };
  }
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetchApi(API_ROUTES.auth.login, {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: any) =>
      fetchApi(API_ROUTES.auth.register, {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    logout: () =>
      fetchApi(API_ROUTES.auth.logout, {
        method: 'POST',
      }),
    check: () =>
      fetchApi(API_ROUTES.auth.check),
  },
  daycare: {
    register: (daycareData: any) =>
      fetchApi(API_ROUTES.daycare.register, {
        method: 'POST',
        body: JSON.stringify(daycareData),
      }),
    list: () =>
      fetchApi(API_ROUTES.daycare.list),
    details: (id: string) =>
      fetchApi(API_ROUTES.daycare.details(id)),
  },
  bookings: {
    create: (bookingData: any) =>
      fetchApi(API_ROUTES.bookings.create, {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }),
    list: () =>
      fetchApi(API_ROUTES.bookings.list),
    update: (id: string, data: any) =>
      fetchApi(API_ROUTES.bookings.update(id), {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
}; 