import PageMeta from "../../components/common/PageMeta";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowLeft, Compass, Mountain } from "lucide-react";

const destinationData: Record<string, {
  name: string;
  description: string;
  image: string;
  highlights: string[];
  bestTime: string;
  altitude: string;
}> = {
  naran: {
    name: "Naran",
    description: "Naran is a scenic valley town in the Kaghan Valley, Khyber Pakhtunkhwa, Pakistan. Known for its lush green meadows, pine forests, and the famous Lake Saif-ul-Malook, it's one of the most popular tourist destinations in Pakistan.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&q=85",
    highlights: ["Lake Saif-ul-Malook", "Kaghan Valley", "Shogran Meadows", "Siri Paye"],
    bestTime: "May - September",
    altitude: "2,438m",
  },
  batakundi: {
    name: "Batakundi",
    description: "Batakundi is a serene village located near Naran in the Kaghan Valley. It offers stunning views of the surrounding mountains and is a perfect stopover for travelers heading to Babusar Top or Fairy Meadows.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400&q=85",
    highlights: ["Riverside Views", "Mountain Trekking", "Peaceful Retreats", "Proximity to Naran"],
    bestTime: "June - August",
    altitude: "2,800m",
  },
  "babusar-top": {
    name: "Babusar Top",
    description: "Babusar Top is a high mountain pass at 4,173 meters that connects the Kaghan Valley with Chilas and the Karakoram Highway. It offers breathtaking panoramic views of Nanga Parbat and the surrounding peaks.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=85",
    highlights: ["Nanga Parbat Views", "Mountain Pass", "Photography", "Adventure Drive"],
    bestTime: "June - September",
    altitude: "4,173m",
  },
  hunza: {
    name: "Hunza",
    description: "Hunza is a magical valley in Gilgit-Baltistan, famous for its ancient forts, crystal-clear lakes, and stunning mountain scenery. It's often called the 'Shangri-La' of Pakistan.",
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1400&q=85",
    highlights: ["Attabad Lake", "Baltit Fort", "Eagle's Nest", "Passu Cones"],
    bestTime: "March - October",
    altitude: "2,438m",
  },
};

export default function DestinationDetail() {
  const { slug } = useParams();
  const dest = destinationData[slug || ""];

  if (!dest) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Destination Not Found</h1>
        <Link to="/destinations" className="text-orange-600 hover:underline">← Back to Destinations</Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={`${dest.name} - NorthRoutes PK`} description={dest.description} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/destinations" className="inline-flex items-center gap-1 text-orange-600 hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> All Destinations
          </Link>

          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-2">{dest.name}</h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Northern Pakistan</span>
                <span className="flex items-center gap-1"><Mountain className="w-4 h-4" /> {dest.altitude}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.8</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold font-heading mb-4">About {dest.name}</h2>
              <p className="text-gray-600 leading-relaxed mb-8">{dest.description}</p>

              <h3 className="text-xl font-semibold font-heading mb-4">Highlights</h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {dest.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-gray-600">
                    <Compass className="w-4 h-4 text-orange-500" /> {h}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
              <h3 className="font-semibold font-heading text-lg mb-4">Plan Your Visit</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Best Time</span><span className="font-medium">{dest.bestTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Altitude</span><span className="font-medium">{dest.altitude}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Region</span><span className="font-medium">Northern Pakistan</span></div>
              </div>
              <Link to="/tours" className="block w-full text-center bg-gradient-to-r from-orange-500 to-green-600 text-white py-3 rounded-lg font-medium font-heading hover:from-orange-600 hover:to-green-700 transition-all shadow-sm mt-6">
                View Tours
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
