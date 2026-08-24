import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;

export const tourService = {
  getAll: () => api.get("/tours"),
  getById: (id: number) => api.get(`/tours/${id}`),
  search: (query: string) => api.get(`/tours/search?q=${query}`),
};

export const hotelService = {
  getAll: () => api.get("/hotels"),
  getById: (id: number) => api.get(`/hotels/${id}`),
};

export const bookingService = {
  create: (data: any) => api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings/my"),
  cancel: (id: number) => api.delete(`/bookings/${id}`),
};

export const authService = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  register: (data: any) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
};
