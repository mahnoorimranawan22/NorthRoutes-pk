import { motion } from "framer-motion";

function Pulse({ className }: { className?: string }) {
  return (
    <motion.div
      className={`bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${className || ""}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}

// Tour card skeleton
export function TourCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <Pulse className="h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <Pulse className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Pulse className="h-6 w-16 rounded-full" />
          <Pulse className="h-6 w-16 rounded-full" />
          <Pulse className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex gap-4">
          <Pulse className="h-4 w-24" />
          <Pulse className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="space-y-1">
            <Pulse className="h-3 w-10" />
            <Pulse className="h-6 w-28" />
          </div>
          <Pulse className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Hotel card skeleton
export function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <Pulse className="h-56 rounded-none" />
      <div className="p-5 space-y-3">
        <Pulse className="h-5 w-2/3" />
        <Pulse className="h-4 w-1/2" />
        <Pulse className="h-4 w-full" />
        <div className="flex gap-2">
          <Pulse className="h-6 w-14 rounded-full" />
          <Pulse className="h-6 w-14 rounded-full" />
          <Pulse className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="space-y-1">
            <Pulse className="h-3 w-10" />
            <Pulse className="h-6 w-28" />
          </div>
          <Pulse className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Pulse className={`h-4 ${i === 0 ? "w-24" : "w-20"}`} />
        </td>
      ))}
    </tr>
  );
}

// Page header skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2 mb-8">
      <Pulse className="h-8 w-64" />
      <Pulse className="h-5 w-96" />
    </div>
  );
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-3">
      <div className="flex items-center justify-between">
        <Pulse className="h-8 w-8 rounded-lg" />
        <Pulse className="h-6 w-12 rounded-full" />
      </div>
      <Pulse className="h-8 w-20" />
      <Pulse className="h-4 w-24" />
    </div>
  );
}

// Hero skeleton
export function HeroSkeleton() {
  return <Pulse className="w-full h-[500px] rounded-none" />;
}

// Detail page skeleton
export function DetailPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Pulse className="h-[400px] rounded-2xl mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Pulse className="h-8 w-64" />
          <Pulse className="h-20 w-full" />
          <Pulse className="h-8 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Pulse key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Pulse className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
