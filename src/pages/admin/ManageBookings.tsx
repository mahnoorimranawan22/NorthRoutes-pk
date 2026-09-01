import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Eye, CheckCircle, XCircle, Clock, AlertCircle,
  ChevronDown, User, MapPin, Calendar, Check, X, Loader2
} from "lucide-react";
import { adminAPI } from "../../services/api";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-100", icon: XCircle },
  completed: { label: "Completed", color: "text-blue-700", bg: "bg-blue-100", icon: CheckCircle },
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (typeFilter !== "all") params.bookingType = typeFilter;
      const res = await adminAPI.getAllBookings(params);
      setBookings(res.data.data || []);
    } catch (err: any) {
      showToast("error", "Failed to load bookings: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [statusFilter, typeFilter]);

  const filtered = bookings.filter((b: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (b.customer?.name?.toLowerCase().includes(s) || b.bookingRef?.toLowerCase().includes(s) ||
      b.user?.name?.toLowerCase().includes(s) || b.user?.email?.toLowerCase().includes(s));
  });

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdating(id);
      await adminAPI.updateBookingStatus(id, { status: newStatus });
      showToast("success", `Booking updated to ${newStatus}`);
      fetchBookings();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to update");
    } finally {
      setUpdating(null);
    }
  };

  const activeBooking = selectedBooking ? bookings.find((b: any) => (b._id || b.id) === selectedBooking) : null;

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b: any) => b.status === "pending").length,
    confirmed: bookings.filter((b: any) => b.status === "confirmed").length,
    cancelled: bookings.filter((b: any) => b.status === "cancelled").length,
    revenue: bookings.filter((b: any) => b.status !== "cancelled").reduce((sum: number, b: any) => sum + (b.pricing?.totalAmount || b.totalAmount || 0), 0),
  };

  return (
    <div className="p-6">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}>
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <p className="text-sm text-gray-500">View and manage all customer bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Bookings", value: stats.total, color: "text-gray-900" },
          { label: "Pending", value: stats.pending, color: "text-yellow-600" },
          { label: "Confirmed", value: stats.confirmed, color: "text-green-600" },
          { label: "Cancelled", value: stats.cancelled, color: "text-red-600" },
          { label: "Revenue", value: `PKR ${stats.revenue.toLocaleString()}`, color: "text-brand-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name or booking ref..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All Types</option>
            <option value="tour_only">Tour Only</option>
            <option value="hotel_only">Hotel Only</option>
            <option value="tour_plus_hotel">Tour + Hotel</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Bookings Table */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Booking</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Customer</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Amount</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((booking: any) => {
                    const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                    const StatusIcon = config.icon;
                    const bookingType = booking.bookingType || "tour_only";
                    const amount = booking.pricing?.totalAmount || booking.totalAmount || 0;
                    const paid = booking.pricing?.amountPaid || booking.paid || 0;
                    const customerName = booking.user?.name || booking.customer?.name || "Unknown";
                    const bookingRef = booking.bookingRef || booking._id?.slice(-8) || "N/A";
                    return (
                      <tr key={booking._id} className={`hover:bg-gray-50 cursor-pointer ${selectedBooking === booking._id ? "bg-brand-50" : ""}`}
                        onClick={() => setSelectedBooking(booking._id)}>
                        <td className="px-5 py-3">
                          <p className="font-mono text-xs font-medium text-brand-600">{bookingRef}</p>
                          <p className="text-xs text-gray-400">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "—"}</p>
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-medium">{customerName}</p>
                          <p className="text-xs text-gray-400">{booking.guests?.length || booking.adultCount || 0} guests</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            bookingType === "tour_plus_hotel" ? "bg-purple-100 text-purple-700"
                              : bookingType === "hotel_only" ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {bookingType === "tour_plus_hotel" ? "Tour+Hotel" : bookingType === "hotel_only" ? "Hotel" : "Tour"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-bold">PKR {amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Paid: PKR {paid.toLocaleString()}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}>
                            <StatusIcon className="w-3 h-3" /> {config.label}
                          </span>
                        </td>
                        <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            {booking.status === "pending" && (
                              <>
                                <button onClick={() => updateStatus(booking._id, "confirmed")} disabled={updating === booking._id}
                                  className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition" title="Confirm">
                                  {updating === booking._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                </button>
                                <button onClick={() => updateStatus(booking._id, "cancelled")} disabled={updating === booking._id}
                                  className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition" title="Cancel">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button onClick={() => setSelectedBooking(booking._id)}
                              className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-600 transition" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <p className="text-center py-12 text-gray-400">No bookings found</p>}
          </div>

          {/* Booking Detail Sidebar */}
          <div className="xl:col-span-1">
            {activeBooking ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl border border-gray-100 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Booking Details</h3>
                  <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-mono text-sm font-bold text-brand-600">{activeBooking.bookingRef || activeBooking._id}</p>
                    <p className="text-xs text-gray-400">Created: {activeBooking.createdAt ? new Date(activeBooking.createdAt).toLocaleDateString() : "—"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{activeBooking.user?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-400">{activeBooking.user?.email || ""}</p>
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold">PKR {(activeBooking.pricing?.totalAmount || 0).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Paid</span><span className="text-green-600 font-medium">PKR {(activeBooking.pricing?.amountPaid || 0).toLocaleString()}</span></div>
                    <div className="flex justify-between border-t pt-2"><span className="text-gray-500">Balance</span><span className="font-bold text-red-600">PKR {(activeBooking.pricing?.balanceDue || 0).toLocaleString()}</span></div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Update Status</p>
                    <div className="flex gap-2">
                      {["pending", "confirmed", "cancelled", "completed"].map((status) => {
                        const cfg = STATUS_CONFIG[status];
                        return (
                          <button key={status} onClick={() => updateStatus(activeBooking._id, status)}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
                              activeBooking.status === status ? `${cfg.bg} ${cfg.color} border-current` : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                            }`}>{cfg.label}</button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
                <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Select a booking to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
