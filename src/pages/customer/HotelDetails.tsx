import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Star, MapPin, Wifi, Car, UtensilsCrossed, Dumbbell, Waves,
  TreePine, ChevronLeft, ChevronRight, Users, BedDouble, Maximize, Check, X
} from "lucide-react";
import { MOCK_HOTELS } from "../../data/mockHotels";
import PageMeta from "../../components/common/PageMeta";

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  WiFi: Wifi, Parking: Car, Restaurant: UtensilsCrossed, Gym: Dumbbell,
  Pool: Waves, Spa: Dumbbell, Garden: TreePine, "Lake View": Waves,
  "Mountain View": TreePine,  "Room Service": UtensilsCrossed, "Airport Transfer": Car,
  Laundry: TreePine, "Conference Hall": Dumbbell, Tennis: Dumbbell,
};

export default function HotelDetails() {
  const { slug } = useParams();
  const hotel = MOCK_HOTELS.find((h) => h.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Hotel Not Found</h1>
        <Link to="/hotels" className="text-orange-600 hover:underline">← Back to Hotels</Link>
      </div>
    );
  }

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 1;
  const selected = hotel.rooms.find((r) => r.id === selectedRoom);

  return (
    <>
      <PageMeta title={`${hotel.name} - Passu Peaks Travels`} description={hotel.description} />

      {/* Photo Gallery */}
      <div className="relative h-[300px] md:h-[450px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={hotel.images[activeImage]}
            alt={hotel.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <Link to="/hotels" className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white flex items-center gap-1 z-10">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Gallery Nav */}
        <button onClick={() => setActiveImage((prev) => (prev === 0 ? hotel.images.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setActiveImage((prev) => (prev === hotel.images.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition z-10">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Thumbnails */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-10">
          {hotel.images.map((img, i) => (
            <button key={i} onClick={() => setActiveImage(i)}
              className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                activeImage === i ? "border-orange-500 scale-105" : "border-white/40 opacity-70 hover:opacity-100"
              }`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="absolute bottom-20 left-4 right-4 z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{hotel.rating}</span>
              <span className="text-xs text-gray-400">({hotel.reviewCount} reviews)</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold font-heading text-white">{hotel.name}</h1>
          <p className="flex items-center gap-1 text-white/80 text-sm mt-1">
            <MapPin className="w-4 h-4" /> {hotel.location}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold font-heading mb-3">About {hotel.name}</h2>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            </motion.div>

            {/* Amenities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-bold font-heading mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hotel.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a] || Check;
                  return (
                    <div key={a} className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700">
                      <Icon className="w-4 h-4 text-green-500" /> {a}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Rooms */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold font-heading mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room) => (
                  <div key={room.id}
                    className={`bg-white rounded-xl border-2 p-5 transition-all cursor-pointer ${
                      selectedRoom === room.id ? "border-orange-500 shadow-md" : "border-gray-100 hover:border-gray-200"
                    }`}
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={room.images[0]} alt={room.type} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold font-heading text-lg">{room.type}</h3>
                            <p className="text-sm text-gray-500 mt-1">{room.description}</p>
                          </div>
                          {selectedRoom === room.id && (
                            <div className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 my-3">
                          <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {room.bedType}</span>
                          <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {room.size}</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Max {room.maxGuests} guests</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {room.amenities.map((a) => (
                            <span key={a} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{a}</span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div>
                            <span className="text-xl font-bold text-green-700">PKR {room.pricePerNight.toLocaleString()}</span>
                            <span className="text-sm text-gray-400 ml-1">/ night</span>
                          </div>
                          <span className={`text-sm font-medium ${room.available ? "text-green-600" : "text-red-500"}`}>
                            {room.available ? "Available" : "Sold Out"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <p className="text-3xl font-bold text-orange-600">
                    PKR {hotel.rooms[0].pricePerNight.toLocaleString()}
                    <span className="text-sm font-normal text-gray-400 ml-1">/ night</span>
                  </p>
                </div>

                <div className="h-px bg-gray-100 my-4" />

                {/* Check-in / Check-out */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Check-in</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Check-out</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>

                {/* Room Selection */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Select Room</label>
                  <div className="space-y-2">
                    {hotel.rooms.map((room) => (
                      <button key={room.id} onClick={() => setSelectedRoom(room.id)}
                        className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${selectedRoom === room.id ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{room.type}</span>
                          <span className="text-orange-600 font-bold">PKR {room.pricePerNight.toLocaleString()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-4" />

                {/* Price Summary */}
                {selected && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{selected.type}</span>
                      <span>PKR {selected.pricePerNight.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Nights</span>
                      <span>× {nights}</span>
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-green-700">PKR {(selected.pricePerNight * nights).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link
                  to={`/booking?hotel=${hotel.id}&room=${selectedRoom || ""}&checkin=${checkIn}&checkout=${checkOut}`}
                  className={`block w-full text-center py-3.5 rounded-xl font-semibold font-heading transition-all ${
                    selectedRoom
                      ? "bg-gradient-to-r from-orange-500 to-blue-600 text-white hover:from-orange-600 hover:to-blue-700 shadow-sm"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {selectedRoom ? "Book This Room" : "Select a Room"}
                </Link>

                <p className="text-xs text-center text-gray-400 mt-3">Free cancellation up to 48 hours before check-in</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
