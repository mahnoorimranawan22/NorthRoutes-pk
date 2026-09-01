import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PageTransition from "../components/common/PageTransition";

// Customer Pages
import CustomerHome from "../pages/customer/Home";
import Tours from "../pages/customer/Tours";
import TourDetails from "../pages/customer/TourDetails";
import Hotels from "../pages/customer/Hotels";
import HotelDetails from "../pages/customer/HotelDetails";
import Booking from "../pages/customer/Booking";
import Destinations from "../pages/customer/Destinations";
import DestinationDetail from "../pages/customer/DestinationDetail";

// Layout
import CustomerLayout from "../components/customer/CustomerLayout";
import AppLayout from "../layout/AppLayout";
import { ScrollToTop } from "../components/common/ScrollToTop";

// Admin Pages
import Home from "../pages/Dashboard/Home";
import ManageTours from "../pages/admin/ManageTours";
import ManageHotels from "../pages/admin/ManageHotels";
import ManageBookings from "../pages/admin/ManageBookings";

// Auth
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import NotFound from "../pages/OtherPage/NotFound";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Customer Routes (with Navbar + Footer) */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<PageTransition><CustomerHome /></PageTransition>} />
          <Route path="/tours" element={<PageTransition><Tours /></PageTransition>} />
          <Route path="/tours/:id" element={<PageTransition><TourDetails /></PageTransition>} />
          <Route path="/hotels" element={<PageTransition><Hotels /></PageTransition>} />
          <Route path="/hotels/:slug" element={<PageTransition><HotelDetails /></PageTransition>} />
          <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
          <Route path="/destinations" element={<PageTransition><Destinations /></PageTransition>} />
          <Route path="/destinations/:slug" element={<PageTransition><DestinationDetail /></PageTransition>} />
        </Route>

        {/* Admin Routes (inside admin layout) - Protected */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AppLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          {/* Passu Peaks Travels Admin CMS */}
          <Route path="manage-tours" element={<ManageTours />} />
          <Route path="manage-hotels" element={<ManageHotels />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function getBasename() {
  const path = window.location.pathname;
  if (path.startsWith("/passu-peaks-travels/")) return "/passu-peaks-travels";
  if (path.startsWith("/NorthRoutes-pk/")) return "/NorthRoutes-pk";
  return "/";
}

export default function AppRoutes() {
  return (
    <Router basename={getBasename()}>
      <AuthProvider>
        <ScrollToTop />
        <AnimatedRoutes />
      </AuthProvider>
    </Router>
  );
}
