import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Eye, CheckCircle, XCircle, Clock, AlertCircle,
  ChevronDown, Download, MoreVertical, CreditCard, User, MapPin,
  Calendar, Check, X, MessageSquare
} from "lucide-react";

const MOCK_BOOKINGS = [
  { id: "TR-A1B2C3-XYZ", customer: "Ahmed Khan", email: "ahmed@email.com", phone: "+923001234567", tour: "5 Days Hunza Valley & Babusar Expedition", type: "tour_only", pickup: "Islamabad", guests: 2, totalAmount: 76000, paid: 20000, status: "confirmed", date: "2026-03-15", createdAt: "2026-02-10" },
  { id: "TR-D4E5F6-ABC", customer: "Sara Ali", email: "sara@email.com", phone: "+923009876543", tour: "3 Days Naran, Batakundi & Lake Saif-ul-Malook", type: "tour_plus_hotel", pickup: "Abbottabad", guests: 4, totalAmount: 143000, paid: 28600, status: "pending", date: "2026-04-01", createdAt: "2026-02-15" },
  { id: "HT-G7H8I9-DEF", customer: "Usman Malik", email: "usman@email.com", phone: "+923005551234", tour: null, hotel: "Hunza Serena Inn", type: "hotel_only", roomType: "Deluxe Room", guests: 2, nights: 3, totalAmount: 54000, paid: 54000, status: "confirmed", checkIn: "2026-03-20", createdAt: "2026-02-18" },
  { id: "TR-J1K2L3-GHI", customer: "Fatima Noor", email: "fatima@email.com", phone: "+923007778899", tour: "5 Days Hunza Valley & Babusar Expedition", type: "tour_plus_hotel", pickup: "Islamabad", guests: 3, totalAmount: 167800, paid: 50000, status: "confirmed", date: "2026-04-10", createdAt: "2026-02-20" },
  { id: "TR-M4N5O6-JKL", customer: "Ali Raza", email: "ali@email.com", phone: "+923003334455", tour: "3 Days Naran, Batakundi & Lake Saif-ul-Malook", type: "tour_only", pickup: "Islamabad", guests: 1, totalAmount: 22000, paid: 0, status: "cancelled", date: "2026-03-25", createdAt: "2026-02-22" },
  { id: "HT-P7Q8R9-MNO", customer: "Zainab Ahmed", email: "zainab@email.com", phone: "+923001112233", tour: null, hotel: "Shangrila Resort", type: "hotel_only", roomType: "Suite", guests: 2, nights: 5, totalAmount: 275000, paid: 275000, status: "confirmed", checkIn: "2026-03-15", createdAt: "2026-02-25" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-100", icon: XCircle },
  completed: { label: "Completed", color: "text-blue-700", bg: "bg-blue-100", icon: CheckCircle },
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = bookings.filter((b) => {
    if (search && !b.customer.toLowerCase().includes(search.toLowerCase()) && !b.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (typeFilter !== "all" && b.type !== typeFilter) return false;
    return true;
  });

  const updateStatus = (id: string, newStatus: string) => {
    setBookings(bookings.map((b) => b.id === id ? { ...b, status: newStatus } : b));
    showToast("success", `Booking ${id} updated to ${newStatus}`);
  };

  const activeBooking = selectedBooking ? bookings.find((b) => b.id === selectedBooking) : null;

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    revenue: bookings.filter((b) => b.status !== "cancelled").reduce((sum, b) => sum + b.paid, 0),
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
          { label: "Revenue Collected", value: `PKR ${stats.revenue.toLocaleString()}`, color: "text-brand-600" },
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
            <input type="text" placeholder="Search by name or booking ID..." value={search} onChange={(e) => setSearch(e.target.value)}
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
                {filtered.map((booking) => {
                  const config = STATUS_CONFIG[booking.status];
                  const StatusIcon = config.icon;
                  return (
                    <tr key={booking.id} className={`hover:bg-gray-50 cursor-pointer ${selectedBooking === booking.id ? "bg-brand-50" : ""}`}
                      onClick={() => setSelectedBooking(booking.id)}>
                      <td className="px-5 py-3">
                        <p className="font-mono text-xs font-medium text-brand-600">{booking.id}</p>
                        <p className="text-xs text-gray-400">{booking.createdAt}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium">{booking.customer}</p>
                        <p className="text-xs text-gray-400">{booking.guests} guests</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          booking.type === "tour_plus_hotel" ? "bg-purple-100 text-purple-700"
                            : booking.type === "hotel_only" ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {booking.type === "tour_plus_hotel" ? "Tour+Hotel" : booking.type === "hotel_only" ? "Hotel" : "Tour"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-bold">PKR {booking.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Paid: PKR {booking.paid.toLocaleString()}</p>
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
                              <button onClick={() => updateStatus(booking.id, "confirmed")}
                                className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition" title="Confirm">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => updateStatus(booking.id, "cancelled")}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition" title="Cancel">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button onClick={() => setSelectedBooking(booking.id)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition" title="View Details">
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
          {filtered.length === 0 && <p className="text-center py-12 text-gray-400">No bookings match your filters</p>}
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
                  <p className="font-mono text-sm font-bold text-brand-600">{activeBooking.id}</p>
                  <p className="text-xs text-gray-400">Created: {activeBooking.createdAt}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activeBooking.customer}</p>
                    <p className="text-xs text-gray-400">{activeBooking.email}</p>
                    <p className="text-xs text-gray-400">{activeBooking.phone}</p>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="space-y-2 text-sm">
                  {activeBooking.tour && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{activeBooking.tour}</p>
                        {activeBooking.pickup && <p className="text-xs text-gray-400">Pickup: {activeBooking.pickup}</p>}
                      </div>
                    </div>
                  )}
                  {activeBooking.hotel && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{activeBooking.hotel}</p>
                        {activeBooking.roomType && <p className="text-xs text-gray-400">{activeBooking.roomType} · {activeBooking.nights} nights</p>}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{activeBooking.date || `Check-in: ${activeBooking.checkIn}`}</span>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Total Amount</span><span className="font-bold">PKR {activeBooking.totalAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Amount Paid</span><span className="text-green-600 font-medium">PKR {activeBooking.paid.toLocaleString()}</span></div>
                  <div className="flex justify-between border-t pt-2"><span className="text-gray-500">Balance Due</span><span className="font-bold text-red-600">PKR {(activeBooking.totalAmount - activeBooking.paid).toLocaleString()}</span></div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Status Actions */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Update Status</p>
                  <div className="flex gap-2">
                    {["pending", "confirmed", "cancelled", "completed"].map((status) => {
                      const cfg = STATUS_CONFIG[status];
                      return (
                        <button key={status}
                          onClick={() => updateStatus(activeBooking.id, status)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
                            activeBooking.status === status
                              ? `${cfg.bg} ${cfg.color} border-current`
                              : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                          }`}>
                          {cfg.label}
                        </button>
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
              <p className="text-sm mt-1">Click any row in the table</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
