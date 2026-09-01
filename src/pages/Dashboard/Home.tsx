import { useState, useEffect } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { toursAPI, hotelsAPI, adminAPI } from "../../services/api";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState({ tours: 0, bookings: 0, hotels: 0, revenue: 0, pending: 0, confirmed: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [popularTours, setPopularTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [toursRes, hotelsRes, bookingsRes] = await Promise.allSettled([
          toursAPI.getAll({ limit: 100 }),
          hotelsAPI.getAll({ limit: 100 }),
          adminAPI.getAllBookings({ limit: 50 }),
        ]);

        const tours = toursRes.status === "fulfilled" ? (toursRes.value.data.data || []) : [];
        const hotels = hotelsRes.status === "fulfilled" ? (hotelsRes.value.data.data || []) : [];
        const bookings = bookingsRes.status === "fulfilled" ? (bookingsRes.value.data.data || []) : [];

        const revenue = bookings
          .filter((b: any) => b.status !== "cancelled")
          .reduce((sum: number, b: any) => sum + (b.pricing?.totalAmount || 0), 0);

        setStats({
          tours: tours.length,
          bookings: bookings.length,
          hotels: hotels.length,
          revenue,
          pending: bookings.filter((b: any) => b.status === "pending").length,
          confirmed: bookings.filter((b: any) => b.status === "confirmed").length,
        });

        setRecentBookings(bookings.slice(0, 5));
        setPopularTours(tours.slice(0, 3));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { label: "Total Tours", value: stats.tours, icon: "🏔️", color: "bg-orange-50" },
    { label: "Total Bookings", value: stats.bookings, icon: "📋", color: "bg-green-50" },
    { label: "Total Hotels", value: stats.hotels, icon: "🏨", color: "bg-amber-50" },
    { label: "Revenue", value: `PKR ${stats.revenue.toLocaleString()}`, icon: "💰", color: "bg-purple-50" },
  ];

  return (
    <>
      <PageMeta title="Admin Dashboard | Passu Peaks Travels" description="Passu Peaks Travels Admin Dashboard" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">Passu Peaks Travels Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your travel business</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat) => (
              <div key={stat.label} className={`${stat.color} rounded-xl p-5 border border-gray-100`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Bookings */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold font-heading text-gray-900">Recent Bookings</h2>
                  <Link to="/admin/manage-bookings" className="text-sm text-orange-600 hover:text-orange-700">View All →</Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Ref</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Customer</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Amount</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.length > 0 ? recentBookings.map((booking: any) => (
                      <tr key={booking._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <span className="text-sm font-mono text-orange-600">{booking.bookingRef || booking._id?.slice(-8)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900">{booking.user?.name || "Unknown"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-gray-900">PKR {(booking.pricing?.totalAmount || 0).toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "confirmed" ? "bg-green-100 text-green-700"
                              : booking.status === "pending" ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}>{booking.status}</span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">No bookings yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular Tours */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold font-heading text-gray-900">Tours</h2>
                <Link to="/admin/manage-tours" className="text-sm text-orange-600 hover:text-orange-700">Manage →</Link>
              </div>
              <div className="space-y-4">
                {popularTours.length > 0 ? popularTours.map((tour: any) => (
                  <div key={tour._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={tour.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{tour.title}</p>
                        <p className="text-xs text-gray-500">{tour.duration} · PKR {tour.pricePerPerson?.toLocaleString()}</p>
                      </div>
                      <span className="text-xs text-amber-500">★ {tour.rating}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-center py-8 text-gray-400 text-sm">No tours yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/admin/manage-tours" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-300 transition-colors group">
              <div className="text-3xl mb-3">🏔️</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">Manage Tours</h3>
              <p className="text-sm text-gray-500 mt-1">Create, edit, and manage tour packages</p>
            </Link>
            <Link to="/admin/manage-hotels" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-300 transition-colors group">
              <div className="text-3xl mb-3">🏨</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">Manage Hotels</h3>
              <p className="text-sm text-gray-500 mt-1">Update room rates and availability</p>
            </Link>
            <Link to="/admin/manage-bookings" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-300 transition-colors group">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">Manage Bookings</h3>
              <p className="text-sm text-gray-500 mt-1">View customer bookings and payments</p>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
