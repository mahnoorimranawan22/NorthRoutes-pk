import PageMeta from "../../components/common/PageMeta";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { MapPin, Star, ArrowRight } from "lucide-react";

const destinations = [
  {
    name: "Naran",
    slug: "naran",
    description: "A scenic valley in Kaghan known for lush meadows, pine forests, and crystal-clear rivers. Home to the legendary Lake Saif-ul-Malook.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=85",
    rating: 4.7,
    tourCount: 12,
  },
  {
    name: "Batakundi",
    slug: "batakundi",
    description: "A peaceful village near Naran with breathtaking views of the Kaghan Valley, pristine riverside camps, and surrounding snow-capped peaks.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=85",
    rating: 4.6,
    tourCount: 8,
  },
  {
    name: "Babusar Top",
    slug: "babusar-top",
    description: "A high mountain pass at 4,173m offering panoramic views of Nanga Parbat, lush green valleys, and the winding Karakoram Highway.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85",
    rating: 4.8,
    tourCount: 10,
  },
  {
    name: "Hunza",
    slug: "hunza",
    description: "A mesmerizing valley in Gilgit-Baltistan with ancient Baltit Fort, crystal-clear Attabad Lake, towering Passu Cones, and golden autumn leaves.",
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=85",
    rating: 4.9,
    tourCount: 15,
  },
];

export default function Destinations() {
  return (
    <>
      <PageMeta title="Destinations - NorthRoutes PK" description="Explore Northern Pakistan's top destinations" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold font-heading text-gray-900 mb-2">Destinations</h1>
          <p className="text-gray-500 text-lg mb-10">Explore the breathtaking beauty of Northern Pakistan</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to={`/destinations/${dest.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="h-56 relative overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold font-heading text-white">{dest.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-500 text-sm mb-4">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {dest.rating}
                      </span>
                      <span>{dest.tourCount} tours</span>
                    </div>
                    <span className="flex items-center gap-1 text-orange-600 text-sm font-medium group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
