import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParallax } from "../../hooks/useParallax";

interface Slide {
  image: string;
  title?: string;
  subtitle?: string;
}

interface HeroSliderProps {
  slides: Slide[];
  height?: string;
  overlay?: string;
  autoPlayInterval?: number;
  showControls?: boolean;
  showDots?: boolean;
  children?: React.ReactNode;
}

export default function HeroSlider({
  slides,
  height = "h-[500px] md:h-[600px]",
  overlay = "from-black/60 via-black/20 to-black/50",
  autoPlayInterval = 5000,
  showControls = true,
  showDots = true,
  children,
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  useEffect(() => {
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, autoPlayInterval]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 1.05,
    }),
  };

  const parallaxStyle = useParallax(0.15);

  return (
    <div className={`relative ${height} overflow-hidden`}>
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title || "Northern Pakistan"}
            className="w-full h-full object-cover scale-105"
            style={parallaxStyle}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* Children content (text, etc.) */}
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {children}
        </div>
      )}

      {/* Navigation Arrows */}
      {showControls && slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-8 h-3 bg-white shadow-lg"
                  : "w-3 h-3 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 bg-black/40 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
          {current + 1} / {slides.length}
        </div>
      )}
    </div>
  );
}
