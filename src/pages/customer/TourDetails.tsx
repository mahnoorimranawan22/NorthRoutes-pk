import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, Clock, Star, Users, CheckCircle, XCircle,
  ChevronDown, Camera, Calendar, Shield, Phone, BedDouble, Sparkles
} from "lucide-react";
import { MOCK_TOURS } from "../../data/mockTours";
import { MOCK_HOTELS } from "../../data/mockHotels";
import PageMeta from "../../components/common/PageMeta"

const GROUP_PRICING = [
  { min: 1, max: 3, label: "1-3 persons", discount: 0 },
  { min: 4, max: 7, label: "4-7 persons", discount: 5 },
  { min: 8, max: 15, label: "8-15 persons", discount: 10 },
];

export default function TourDetails() {
  const { id } = useParams();
  const tour = MOCK_TOURS.find((t) => t.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [pickup, setPickup] = useState("Islamabad");
  const [groupSize, setGroupSize] = useState(1);
  const [hotelAddon, setHotelAddon] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(MOCK_HOTELS[0]?.id || "");
  const [selectedRoomType, setSelectedRoomType] = useState(0);

  // Get hotel add-on details
  const addOnHotel = MOCK_HOTELS.find((h) => h.id === selectedHotelId);
  const addOnRoom = addOnHotel?.rooms[selectedRoomType];
  const nights = parseInt(tour.duration) || 3;
  const roomUpgradeCost = hotelAddon && addOnRoom ? addOnRoom.pricePerNight * nights : 0;

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Tour Not Found</h1>
        <Link to="/tours" className="text-orange-600 hover:underline">← Back to Tours</Link>
      </div>
    );
  }

  const galleryImages = tour.gallery || [tour.image, tour.image, tour.image];
  const groupTier = GROUP_PRICING.find((g) => groupSize >= g.min && groupSize <= g.max) || GROUP_PRICING[0];
  const discountedPrice = tour.pricePerPerson * (1 - groupTier.discount / 100);
  const tourTotal = discountedPrice * groupSize;
  const totalPrice = tourTotal + (hotelAddon ? roomUpgradeCost * groupSize : 0);

  return (
    <>
      <PageMeta title={`${tour.title} - NorthRoutes PK`} description={tour.title} />

      {/* Hero Gallery */}
      <div className="relative h-[300px] md:h-[420px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={galleryImages[activeImage]}
            alt={tour.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <Link to="/tours" className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white flex items-center gap-1 z-10">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Gallery thumbnails */}
        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                activeImage === i ? "border-orange-500 scale-105" : "border-white/50 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Photo count */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 z-10">
          <Camera className="w-3.5 h-3.5" /> {galleryImages.length} photos
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-20 left-4 right-24 z-10">
          <div className="flex flex-wrap gap-2 mb-2">
            {tour.destinations.map((d) => (
              <span key={d} className="bg-white/20 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full">{d}</span>
            ))}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold font-heading text-white">{tour.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-orange-500" /> {tour.duration}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {tour.rating} rating
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-green-500" /> {tour.destinations.length} destinations
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-purple-500" /> Max 15 persons
              </div>
            </motion.div>

            {/* Itinerary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-bold font-heading mb-4">Day-by-Day Itinerary</h2>
              <div className="space-y-3">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <button
                      onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          openDay === day.day ? "bg-green-600 text-white" : "bg-green-50 text-green-600"
                        }`}>
                          {day.day}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{day.title}</h3>
                          <p className="text-sm text-gray-400 mt-0.5">Day {day.day} of {tour.itinerary.length}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        openDay === day.day ? "rotate-180" : ""
                      }`} />
                    </button>
                    <AnimatePresence>
                      {openDay === day.day && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pl-19 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 ml-14">
                            {day.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pricing Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold font-heading mb-4">Group Pricing</h2>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Group Size</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Per Person</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Discount</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Total (per person)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {GROUP_PRICING.map((g) => (
                      <tr key={g.label} className={groupSize >= g.min && groupSize <= g.max ? "bg-orange-50" : ""}>
                        <td className="px-5 py-3 font-medium">{g.label}</td>
                        <td className="px-5 py-3">PKR {tour.pricePerPerson.toLocaleString()}</td>
                        <td className="px-5 py-3">
                          {g.discount > 0 ? (
                            <span className="text-green-600 font-medium">-{g.discount}%</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 font-bold text-green-600">
                          PKR {Math.round(tour.pricePerPerson * (1 - g.discount / 100)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Inclusions & Exclusions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl font-bold font-heading mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inclusions */}
                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Inclusions
                  </h3>
                  <ul className="space-y-2.5">
                    {tour.inclusions.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Exclusions */}
                <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Exclusions
                  </h3>
                  <ul className="space-y-2.5">
                    {tour.exclusions.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-red-700">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="mb-4">
                  <span className="text-sm text-gray-400">Starting from</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-heading text-green-600">PKR {tour.pricePerPerson.toLocaleString()}</span>
                    <span className="text-sm text-gray-400">/ person</span>
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-4" />

                {/* Pickup Origin */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Pickup Origin</label>
                  <div className="grid grid-cols-2 gap-2">
                    {tour.pickupPoints.map((point) => (
                      <button
                        key={point}
                        onClick={() => setPickup(point)}
                        className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all ${
                          pickup === point
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300"
                        }`}
                      >
                        {point}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Group Size */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Group Size</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{groupSize}</span>
                    <button
                      onClick={() => setGroupSize(Math.min(15, groupSize + 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition"
                    >
                      +
                    </button>
                  </div>
                  {groupTier.discount > 0 && (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      🎉 {groupTier.discount}% group discount applied!
                    </p>
                  )}
                </div>

                <div className="h-px bg-gray-100 my-4" />

                {/* Hotel Room Add-on */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-purple-500" /> Hotel Room Upgrade
                    </label>
                    <button
                      onClick={() => setHotelAddon(!hotelAddon)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${hotelAddon ? "bg-orange-600" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${hotelAddon ? "translate-x-5" : ""}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {hotelAddon && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 bg-purple-50 rounded-xl p-4 border border-purple-100">
                          {/* Hotel Selector */}
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Select Hotel</label>
                            <select
                              value={selectedHotelId}
                              onChange={(e) => { setSelectedHotelId(e.target.value); setSelectedRoomType(0); }}
                              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              {MOCK_HOTELS.map((h) => (
                                <option key={h.id} value={h.id}>{h.name} — {h.location}</option>
                              ))}
                            </select>
                          </div>

                          {/* Room Type Selector */}
                          {addOnHotel && (
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">Room Type</label>
                              <div className="space-y-2">
                                {addOnHotel.rooms.map((room, i) => (
                                  <button
                                    key={room.id}
                                    onClick={() => setSelectedRoomType(i)}
                                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                                      selectedRoomType === i
                                        ? "border-purple-500 bg-white shadow-sm"
                                        : "border-gray-200 bg-white hover:border-purple-300"
                                    }`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <span className="font-medium block">{room.type}</span>
                                        <span className="text-xs text-gray-400">{room.bedType} · {room.size} · Max {room.maxGuests}</span>
                                      </div>
                                      <span className="text-purple-600 font-bold text-sm">PKR {room.pricePerNight.toLocaleString()}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {addOnRoom && (
                            <div className="flex items-center justify-between text-sm pt-2 border-t border-purple-200">
                              <span className="text-gray-600">Room upgrade ({nights} nights × {groupSize} guests)</span>
                              <span className="font-bold text-purple-600">+ PKR {(roomUpgradeCost * groupSize).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-gray-100 my-4" />

                {/* Price Summary */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tour ({groupSize} × PKR {Math.round(discountedPrice).toLocaleString()})</span>
                    <span className="font-medium">PKR {Math.round(tourTotal).toLocaleString()}</span>
                  </div>
                  {hotelAddon && addOnRoom && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Hotel ({nights}N × {groupSize} × PKR {addOnRoom.pricePerNight.toLocaleString()})</span>
                      <span className="font-medium text-purple-600">+ PKR {Math.round(roomUpgradeCost * groupSize).toLocaleString()}</span>
                    </div>
                  )}
                  {hotelAddon && (
                    <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5" /> Room upgrade included
                    </div>
                  )}
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="text-xl font-bold text-green-700">PKR {Math.round(totalPrice).toLocaleString()}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to={`/booking?tour=${tour.id}&pickup=${pickup}&guests=${groupSize}`}
                  className="block w-full text-center bg-gradient-to-r from-orange-500 to-green-600 text-white py-3.5 rounded-xl font-semibold font-heading hover:from-orange-600 hover:to-green-700 transition-all shadow-lg"
                >
                  Book This Tour
                </Link>

                {/* Trust badges */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" /> Free cancellation up to 48 hours
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="w-4 h-4 text-orange-500" /> 24/7 support: +92 300 1234567
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4 text-purple-500" /> Pickup from {pickup}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
