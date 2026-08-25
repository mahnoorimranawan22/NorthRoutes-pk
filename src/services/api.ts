import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
export interface BookingPayload {
  type: "tour_only" | "hotel_only" | "tour_hotel";
  tour?: { tourId: string; date: string; guests: number; pickupPoint: string };
  hotel?: { hotelId: string; roomId: string; checkIn: string; checkOut: string; guests: number };
  customer: { name: string; email: string; phone: string; cnic: string };
  payment: { method: string; details?: any };
}

export const bookingsAPI = {
  create: (data: BookingPayload) => api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings"),
  getByRef: (ref: string) => api.get(`/bookings/${ref}`),
};

// ── Health ────────────────────────────────────────────────────
export const healthAPI = {
  check: () => api.get("/health"),
};

export default api;
