import { Link } from "react-router";
import { motion } from "framer-motion";
import { Mountain, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-emerald-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-heading text-white">
              North<span className="text-orange-400">Routes</span>
              <span className="text-sm font-medium text-green-400 ml-1">PK</span>
            </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Discover the breathtaking beauty of Northern Pakistan with guided tours, premium stays, and unforgettable adventures.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Phone className="w-4 h-4" />
              <span>+92 300 1234567</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
              <Mail className="w-4 h-4" />
              <span>info@northroutes.pk</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
              <MapPin className="w-4 h-4" />
              <span>Islamabad, Pakistan</span>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-white font-semibold font-heading mb-4">Destinations</h3>
            <ul className="space-y-2 text-sm">
              {["Naran", "Batakundi", "Babusar Top", "Hunza", "Skardu", "Fairy Meadows"].map((dest) => (
                <li key={dest}>
                  <Link to={`/destinations/${dest.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-orange-400 transition-colors">
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold font-heading mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "All Tours", path: "/tours" },
                { name: "Hotel Stays", path: "/hotels" },
                { name: "Book a Trip", path: "/booking" },
                { name: "About Us", path: "/" },
                { name: "Contact", path: "/" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-orange-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pickup Points */}
          <div>
            <h3 className="text-white font-semibold font-heading mb-4">Pickup Points</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Islamabad
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Abbottabad
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-semibold text-sm mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {["Facebook", "Instagram", "WhatsApp"].map((social, i) => (
                  <motion.span
                    key={social}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-400 hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                  >
                    {social[0]}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500"
        >
          &copy; {new Date().getFullYear()} NorthRoutes PK. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}
