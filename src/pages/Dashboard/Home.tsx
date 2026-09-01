import { useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

// Mock data for the dashboard
const stats = [
  {
    label: "Total Tours",
    value: "2",
    change: "+1",
    trend: "up",
    icon: "🏔️",
    color: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    label: "Total Bookings",
    value: "6",
    change: "+3",
    trend: "up",
    icon: "📋",
    color: "bg-green-50 dark:bg-green-900/20",
  },
  {
    label: "Total Hotels",
    value: "4",
    change: "+2",
    trend: "up",
    icon: "🏨",
    color: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    label: "Revenue",
    value: "PKR 427,600",
    change: "+18%",
    trend: "up",
    icon: "💰",
    color: "bg-purple-50 dark:bg-purple-900/20",
  },
];

const recentBookings = [
  {
    id: "TR-J1K2L3-GHI",
    customer: "Fatima Noor",
    tour: "5 Days Hunza Valley",
    type: "Tour+Hotel",
    guests: 3,
    amount: "PKR 130,200",
    status: "confirmed",
    date: "2026-02-20",
  },
  {
    id: "HT-G7H8I9-DEF",
    customer: "Usman Malik",
    hotel: "Shangrila Resort",
    type: "Hotel",
    guests: 2,
    amount: "PKR 38,400",
    status: "confirmed",
    date: "2026-02-18",
  },
  {
    id: "TR-M4N5O6-JKL",
    customer: "Ali Raza",
    tour: "3 Days Naran",
    type: "Tour",
    guests: 1,
    amount: "PKR 22,000",
    status: "pending",
    date: "2026-02-22",
  },
  {
    id: "HT-P7Q8R9-MNO",
    customer: "Zainab Ahmed",
    hotel: "Hunza Serena Inn",
    type: "Hotel",
    guests: 2,
    amount: "PKR 24,000",
    status: "confirmed",
    date: "2026-02-25",
  },
  {
    id: "TR-S1T2U3-VWX",
    customer: "Hassan Khan",
    tour: "5 Days Hunza Valley",
    type: "Tour",
    guests: 4,
    amount: "PKR 144,400",
    status: "cancelled",
    date: "2026-02-15",
  },
];

const popularTours = [
  {
    name: "5 Days Hunza Valley & Babusar Expedition",
    bookings: 4,
    revenue: "PKR 304,000",
    rating: 4.9,
  },
  {
    name: "3 Days Naran, Batakundi & Lake Saif-ul-Malook",
    bookings: 2,
    revenue: "PKR 44,000",
    rating: 4.8,
  },
];

const hotelOccupancy = [
  { hotel: "Hunza Serena Inn", rooms: 3, occupied: 2, rate: 67 },
  { hotel: "Shangrila Resort", rooms: 3, occupied: 1, rate: 33 },
  { hotel: "Naran Continental", rooms: 2, occupied: 1, rate: 50 },
  { hotel: "Pearl Continental Bhurban", rooms: 2, occupied: 0, rate: 0 },
];

const pickupStats = [
  { city: "Islamabad", count: 4, percentage: 67 },
  { city: "Abbottabad", count: 2, percentage: 33 },
];

export default function Home() {
  const [period] = useState("month");

  return (
    <>
      <PageMeta
        title="Admin Dashboard | Passu Peaks Travels"
        description="Passu Peaks Travels Admin Dashboard - Manage tours, hotels, and bookings"
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
          Passu Peaks Travels Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of your travel business
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} rounded-xl p-5 border border-gray-100 dark:border-gray-800`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold font-heading text-gray-900 dark:text-white">
                Recent Bookings
              </h2>
              <Link
                to="/admin/manage-bookings"
                className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
              >
                View All →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-5 py-3">
                    Booking
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-5 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-5 py-3">
                    Type
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-5 py-3">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-5 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono text-orange-600 dark:text-orange-400">
                        {booking.id}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {booking.date}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {booking.customer}
                      </p>
                      <p className="text-xs text-gray-400">
                        {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.type === "Tour+Hotel"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : booking.type === "Tour"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {booking.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {booking.amount}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : booking.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Popular Tours */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-heading text-gray-900 dark:text-white">
                Popular Tours
              </h2>
              <Link
                to="/admin/manage-tours"
                className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
              >
                Manage →
              </Link>
            </div>
            <div className="space-y-4">
              {popularTours.map((tour, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                    {tour.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {tour.bookings} bookings
                    </span>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      {tour.revenue}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-amber-500">★</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                      {tour.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup Points */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pickup Points
            </h2>
            <div className="space-y-3">
              {pickupStats.map((ps) => (
                <div key={ps.city}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {ps.city}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {ps.count} bookings
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${ps.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Occupancy */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Hotel Occupancy
          </h2>
          <Link
            to="/admin/manage-hotels"
            className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            Manage Hotels →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hotelOccupancy.map((h) => (
            <div
              key={h.hotel}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {h.hotel}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {h.occupied}/{h.rooms} rooms
                </span>
                <span
                  className={`text-xs font-bold ${
                    h.rate >= 50
                      ? "text-green-600 dark:text-green-400"
                      : h.rate > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-gray-400"
                  }`}
                >
                  {h.rate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    h.rate >= 50
                      ? "bg-green-500"
                      : h.rate > 0
                      ? "bg-amber-500"
                      : "bg-gray-300"
                  }`}
                  style={{ width: `${h.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/manage-tours"
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-orange-300 dark:hover:border-orange-700 transition-colors group"
        >
          <div className="text-3xl mb-3">🏔️</div>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
            Manage Tours
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create, edit, and manage tour packages, itineraries, and schedules
          </p>
        </Link>

        <Link
          to="/admin/manage-hotels"
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-orange-300 dark:hover:border-orange-700 transition-colors group"
        >
          <div className="text-3xl mb-3">🏨</div>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
            Manage Hotels
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update room rates, add room types, and control availability
          </p>
        </Link>

        <Link
          to="/admin/manage-bookings"
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-orange-300 dark:hover:border-orange-700 transition-colors group"
        >
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
            Manage Bookings
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View customer bookings, verify payments, update status
          </p>
        </Link>
      </div>
    </>
  );
}
