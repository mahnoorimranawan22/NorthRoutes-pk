import { motion } from "framer-motion";
import { useParallax } from "../../hooks/useParallax";
import AnimatedCounter from "../common/AnimatedCounter";
import { Mountain, MapPin, Users, Heart } from "lucide-react";

const stats = [
  { icon: Mountain, end: 50, suffix: "+", label: "Tour Packages" },
  { icon: MapPin, end: 12, suffix: "+", label: "Destinations" },
  { icon: Users, end: 5000, suffix: "+", label: "Happy Travelers" },
  { icon: Heart, end: 98, suffix: "%", label: "Satisfaction Rate" },
];

export default function StatsSection() {
  const parallaxStyle = useParallax(0.3);

  return (
    <section className="relative overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920')",
            ...parallaxStyle,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-teal-900/80 to-blue-950/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
            Trusted by Thousands
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            We&apos;ve been connecting adventurers to Pakistan&apos;s most breathtaking landscapes since 2020
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                  <Icon className="w-7 h-7 text-green-400" />
                </div>
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  label={stat.label}
                  duration={2000 + i * 300}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
