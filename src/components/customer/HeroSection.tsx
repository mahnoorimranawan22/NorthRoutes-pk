import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Search, MapPin, Calendar, DollarSign, Star, Clock, ChevronDown, X, Filter } from "lucide-react";
import { MOCK_TOURS } from "../../data/mockTours";

const DESTINATIONS = ["All Destinations", "Naran", "Batakundi", "Babusar Top", "Hunza"];
const PICKUP_POINTS = ["All Pickup Points", "Islamabad", "Abbottabad"];

const BUDGET_RANGES = [
  { label: "Any Budget", min: 0, max: 100000 },
  { label: "Under PKR 25,000", min: 0, max: 25000 },
  { label: "PKR 25,000 - 35,000", min: 25000, max: 35000 },
  { label: "PKR 35,000 - 50,000", min: 35000, max: 50000 },
  { label: "Above PKR 50,000", min: 50000, max: 100000 },
];

export default function HeroSection() {
  const [destination, setDestination] = useState("All Destinations");
  const [pickup, setPickup] = useState("All Pickup Points");
  const [budgetIndex, setBudgetIndex] = useState(0);
  const [travelDate, setTravelDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTours = useMemo(() => {
    return MOCK_TOURS.filter((tour) => {
      if (destination !== "All Destinations" && !tour.destinations.includes(destination)) return false;
      if (pickup !== "All Pickup Points" && !tour.pickupPoints.includes(pickup)) return false;
      const range = BUDGET_RANGES[budgetIndex];
      if (range.max < 100000 && (tour.pricePerPerson < range.min || tour.pricePerPerson > range.max)) return false;
      return true;
    });
  }, [destination, pickup, budgetIndex]);

  const activeFilterCount = [destination !== "All Destinations", pickup !== "All Pickup Points", budgetIndex !== 0, travelDate !== ""].filter(Boolean).length;

  const clearFilters = () => {
    setDestination("All Destinations");
    setPickup("All Pickup Points");
    setBudgetIndex(0);
    setTravelDate("");
  };

  return (
    <div className="relative">
      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400"
          alt="Northern Pakistan Mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Discover the Majestic
            <br />
            <span className="text-orange-400">North of Pakistan</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-200 text-lg md:text-xl max-w-2xl"
          >
            Curated tours from Islamabad & Abbottabad to Naran, Hunza, and beyond
          </motion.p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6"
        >
          {/* Desktop Filter Row */}
          <div className="hidden md:grid grid-cols-4 gap-4">
            {/* Destination */}
            <div className="relative">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 block">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Pickup Point */}
            <div className="relative">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 block">Pickup Point</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {PICKUP_POINTS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Travel Date */}
            <div className="relative">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 block">Travel Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Budget */}
            <div className="relative">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 block">Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={budgetIndex}
                  onChange={(e) => setBudgetIndex(Number(e.target.value))}
                  className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {BUDGET_RANGES.map((b, i) => (
                    <option key={i} value={i}>{b.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between py-3 text-sm font-medium text-gray-700"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {showFilters && (
              <div className="space-y-3 pb-2">
                <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                  {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                  {PICKUP_POINTS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                <select value={budgetIndex} onChange={(e) => setBudgetIndex(Number(e.target.value))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                  {BUDGET_RANGES.map((b, i) => <option key={i} value={i}>{b.label}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Active Filters + Clear */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Active:</span>
              {destination !== "All Destinations" && (
                <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-xs px-2.5 py-1 rounded-full">
                  {destination} <X className="w-3 h-3 cursor-pointer" onClick={() => setDestination("All Destinations")} />
                </span>
              )}
              {pickup !== "All Pickup Points" && (
                <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-xs px-2.5 py-1 rounded-full">
                  {pickup} <X className="w-3 h-3 cursor-pointer" onClick={() => setPickup("All Pickup Points")} />
                </span>
              )}
              {budgetIndex !== 0 && (
                <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-xs px-2.5 py-1 rounded-full">
                  {BUDGET_RANGES[budgetIndex].label} <X className="w-3 h-3 cursor-pointer" onClick={() => setBudgetIndex(0)} />
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 ml-auto">Clear all</button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Tour Cards */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredTours.length} Tour{filteredTours.length !== 1 ? "s" : ""} Found
          </h2>
        </div>

        {filteredTours.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tours match your filters</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria</p>
            <button onClick={clearFilters} className="text-orange-600 hover:underline font-medium">Clear all filters</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour, i) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link to={`/tours/${tour.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="h-48 relative overflow-hidden">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-medium text-gray-700">
                      {tour.duration}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium">{tour.rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{tour.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tour.destinations.slice(0, 3).map((d) => (
                        <span key={d} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{d}</span>
                      ))}
                      {tour.destinations.length > 3 && (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">+{tour.destinations.length - 3}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {tour.duration}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {tour.pickupPoints[0]}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-400">From</span>
                        <p className="text-orange-600 font-bold text-xl">PKR {tour.pricePerPerson.toLocaleString()}</p>
                        <span className="text-xs text-gray-400">per person</span>
                      </div>
                      <span className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-orange-700 transition-colors">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
