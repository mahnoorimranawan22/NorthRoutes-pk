import PageMeta from "../../components/common/PageMeta";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { MOCK_TOURS } from "../../data/mockTours";

export default function Tours() {
  const [search, setSearch] = useState("");

  const filteredTours = MOCK_TOURS.filter((tour) =>
    tour.title.toLowerCase().includes(search.toLowerCase()) ||
    tour.destinations.some((d) => d.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <PageMeta title="Tours - NorthRoutes PK" description="Browse our curated tours" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold font-heading mb-2">Our Tours</h1>
        <p className="text-gray-500 mb-6">Find the perfect adventure in Northern Pakistan</p>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tours or destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour, i) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link to={`/tours/${tour.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
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
                  <h3 className="font-bold font-heading text-lg mb-2 group-hover:text-green-600 transition-colors">{tour.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tour.destinations.slice(0, 3).map((d) => (
                      <span key={d} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{d}</span>
                    ))}
                    {tour.destinations.length > 3 && (
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">+{tour.destinations.length - 3}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {tour.duration}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {tour.pickupPoints[0]}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400">From</span>
                      <p className="text-green-700 font-bold text-xl">PKR {tour.pricePerPerson.toLocaleString()}</p>
                    </div>
                    <span className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:from-orange-600 group-hover:to-green-700 transition-all shadow-sm">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tours found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        )}
      </div>
    </>
  );
}
