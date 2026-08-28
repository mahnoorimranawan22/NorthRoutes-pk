import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.VERCEL ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nr_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response error interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("nr_token");
      localStorage.removeItem("nr_user");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// ── Tours ─────────────────────────────────────────────────────
export interface TourQuery {
  destination?: string;
  pickup?: string;
  budget?: string;
  date?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const toursAPI = {
  getAll: (params?: TourQuery) => api.get("/tours", { params }),
  getBySlug: (slug: string) => api.get(`/tours/${slug}`),
  getAvailability: (slug: string) => api.get(`/tours/${slug}/availability`),
  create: (data: any) => api.post("/tours", data),
  update: (id: string, data: any) => api.put(`/tours/${id}`, data),
  delete: (id: string) => api.delete(`/tours/${id}`),
};

// ── Hotels ────────────────────────────────────────────────────
export interface HotelQuery {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const hotelsAPI = {
  getAll: (params?: HotelQuery) => api.get("/hotels", { params }),
  getById: (id: string) => api.get(`/hotels/${id}`),
  getAvailability: (id: string, params?: { checkIn?: string; checkOut?: string }) =>
    api.get(`/hotels/${id}/availability`, { params }),
  create: (data: any) => api.post("/hotels", data),
  update: (id: string, data: any) => api.put(`/hotels/${id}`, data),
  delete: (id: string) => api.delete(`/hotels/${id}`),
};

// ── Bookings ──────────────────────────────────────────────────
export interface GuestInfo {
  name: string;
  age?: number;
  gender?: "male" | "female" | "other";
  idType?: "cnic" | "passport" | "other";
  idNumber?: string;
  phone?: string;
  isChild?: boolean;
}

export interface BookingPayload {
  bookingType: "tour_only" | "hotel_only" | "tour_plus_hotel";
  tourId?: string;
  hotelId?: string;
  roomId?: string;
  pickupPoint?: string;
  dropOffPoint?: string;
  guests: GuestInfo[];
  adultCount?: number;
  childCount?: number;
  tourStartDate?: string;
  checkInDate?: string;
  checkOutDate?: string;
  specialRequests?: string;
  dietaryRequirements?: string[];
  paymentMethod?: string;
}

export const bookingsAPI = {
  create: (data: BookingPayload) => api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings/my-bookings"),
  getByRef: (ref: string) => api.get(`/bookings/${ref}`),
  cancel: (id: string, reason?: string) => api.put(`/bookings/${id}/cancel`, { reason }),
};

// ── Destinations ──────────────────────────────────────────────
export interface DestinationQuery {
  search?: string;
  province?: string;
  category?: string;
  bestSeason?: string;
  featured?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const destinationsAPI = {
  getAll: (params?: DestinationQuery) => api.get("/destinations", { params }),
  getById: (id: string) => api.get(`/destinations/${id}`),
  toggleFavorite: (id: string) => api.post(`/destinations/${id}/favorite`),
  getFavorites: () => api.get("/destinations/favorites"),
  create: (data: any) => api.post("/destinations", data),
  update: (id: string, data: any) => api.put(`/destinations/${id}`, data),
  delete: (id: string) => api.delete(`/destinations/${id}`),
};

// ── Reviews ────────────────────────────────────────────────────
export interface ReviewPayload {
  targetType: "tour" | "destination" | "hotel";
  targetId: string;
  rating: number;
  title?: string;
  comment: string;
  visitDate?: string;
  travelType?: "solo" | "couple" | "family" | "friends" | "business";
  wouldRecommend?: boolean;
}

export const reviewsAPI = {
  getForTarget: (targetType: string, targetId: string, params?: { sort?: string; page?: number; limit?: number }) =>
    api.get(`/reviews/${targetType}/${targetId}`, { params }),
  create: (data: ReviewPayload) => api.post("/reviews", data),
  update: (id: string, data: Partial<ReviewPayload>) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
  // Admin
  getAll: (params?: { targetType?: string; isApproved?: string; page?: number }) =>
    api.get("/reviews/admin/all", { params }),
  moderate: (id: string, data: { isApproved: boolean; isFeatured?: boolean; moderationNote?: string }) =>
    api.put(`/reviews/admin/${id}/moderate`, data),
};

// ── Admin ──────────────────────────────────────────────────────
export const adminAPI = {
  // Users
  getUsers: (params?: { role?: string; search?: string; page?: number }) =>
    api.get("/admin/users", { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateUserRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Bookings
  getAllBookings: (params?: { status?: string; bookingType?: string; page?: number }) =>
    api.get("/bookings/admin/all", { params }),
  getBookingById: (id: string) => api.get(`/bookings/admin/${id}`),
  updateBookingStatus: (id: string, data: { status?: string; paymentStatus?: string; internalNotes?: string }) =>
    api.put(`/bookings/admin/${id}/status`, data),
};

// ── Health ────────────────────────────────────────────────────
export const healthAPI = {
  check: () => api.get("/health"),
};

export default api;
