import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Wifi, Car, UtensilsCrossed, Dumbbell, Waves, TreePine, ChevronDown } from "lucide-react";
import { MOCK_HOTELS } from "../../data/mockHotels";
import PageMeta from "../../components/common/PageMeta";
import HeroSlider from "../../components/common/HeroSlider";
import { HOTEL_SLIDES } from "../../data/sliderImages";

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  WiFi: Wifi, Parking: Car, Restaurant: UtensilsCrossed, Gym: Dumbbell,
  Pool: Waves, Spa: Dumbbell, Garden: TreePine, "Lake View": Waves,
  "Mountain View": TreePine,
};

const LOCATION_FILTERS = ["All Locations", "Hunza", "Skardu", "Naran", "Bhurban"];

export default function Hotels() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = MOCK_HOTELS.filter((h) => {
    if (!h.name.toLowerCase().includes(search.toLowerCase()) && !h.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (location !== "All Locations" && !h.location.includes(location)) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-low") return a.rooms[0].pricePerNight - b.rooms[0].pricePerNight;
    if (sortBy === "price-high") return b.rooms[b.rooms.length - 1].pricePerNight - a.rooms[a.rooms.length - 1].pricePerNight;
    return 0;
  });

  return (
    <>
      <PageMeta title="Hotels - Passu Peaks Travels" description="Find the best accommodations in Northern Pakistan" />

      {/* Hero Slider */}
      <HeroSlider
        slides={HOTEL_SLIDES}
        height="h-[280px] md:h-[340px]"
        overlay="from-black/60 to-black/30"
        autoPlayInterval={5000}
      >
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold font-heading text-white mb-2 drop-shadow-lg">
          Hotels & Accommodations
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-200 drop-shadow-md">
          Comfortable stays across Northern Pakistan
        </motion.p>
      </HeroSlider>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" placeholder="Search hotels or locations..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="relative">
              <select value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500">
                {LOCATION_FILTERS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="rating">Sort by Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-gray-500 mb-4">{filtered.length} hotel{filtered.length !== 1 ? "s" : ""} found</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((hotel, i) => (
            <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <Link to={`/hotels/${hotel.slug}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                {/* Image Gallery Preview */}
                <div className="relative h-56 overflow-hidden">
                  <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {hotel.images.slice(0, 4).map((img, j) => (
                      <div key={j} className={`w-10 h-10 rounded-lg overflow-hidden border-2 ${j === 0 ? "border-white" : "border-white/40"}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium">{hotel.rating}</span>
                    <span className="text-xs text-gray-400">({hotel.reviewCount})</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold font-heading text-lg group-hover:text-green-600 transition-colors">{hotel.name}</h3>
                      <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" /> {hotel.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{hotel.description}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 5).map((a) => {
                      const Icon = AMENITY_ICONS[a];
                      return (
                        <span key={a} className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                          {Icon && <Icon className="w-3 h-3" />} {a}
                        </span>
                      );
                    })}
                    {hotel.amenities.length > 5 && (
                      <span className="text-xs text-gray-400 px-2 py-1">+{hotel.amenities.length - 5} more</span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400">From</span>
                      <p className="text-green-700 font-bold text-xl">
                        PKR {hotel.rooms[0].pricePerNight.toLocaleString()}
                        <span className="text-sm font-normal text-gray-400"> / night</span>
                      </p>
                    </div>
                    <span className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:from-orange-600 group-hover:to-blue-700 transition-all shadow-sm">
                      View Rooms
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hotels found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  );
}
