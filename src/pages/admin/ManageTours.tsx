import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronUp,
  MapPin, Calendar, DollarSign, Clock, Users, Image, Search,
  CheckCircle, AlertCircle, GripVertical
} from "lucide-react";
import { MOCK_TOURS } from "../../data/mockTours";

const DESTINATIONS = ["Naran", "Batakundi", "Babusar Top", "Hunza", "Skardu", "Fairy Meadows", "Swat", "Deosai"];
const PICKUP_POINTS = ["Islamabad", "Abbottabad"];
const CATEGORIES = ["adventure", "cultural", "family", "luxury", "budget", "honeymoon"];
const DIFFICULTIES = ["easy", "moderate", "challenging", "difficult"];

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  accommodation: string;
}

interface TourForm {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  destinations: string[];
  pickupPoints: string[];
  duration: string;
  totalDays: number;
  totalNights: number;
  pricePerPerson: number;
  maxGroupSize: number;
  category: string;
  difficulty: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  image: string;
  isFeatured: boolean;
}

const emptyForm: TourForm = {
  title: "", slug: "", description: "", shortDescription: "",
  destinations: [], pickupPoints: [],
  duration: "", totalDays: 1, totalNights: 0,
  pricePerPerson: 0, maxGroupSize: 15,
  category: "adventure", difficulty: "moderate",
  inclusions: [], exclusions: [],
  itinerary: [], image: "", isFeatured: false,
};

export default function ManageTours() {
  const [tours, setTours] = useState(MOCK_TOURS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TourForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [expandedTour, setExpandedTour] = useState<string | null>(null);
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = tours.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.destinations.some((d) => d.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = () => {
    if (!form.title || !form.description || form.pricePerPerson <= 0) {
      showToast("error", "Please fill all required fields");
      return;
    }
    if (editingId) {
      setTours(tours.map((t) => t.id === editingId ? { ...t, ...form } : t));
      showToast("success", "Tour updated successfully");
    } else {
      const newTour = {
        ...form,
        id: `tour-${Date.now()}`,
        slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        rating: 0,
      };
      setTours([newTour, ...tours]);
      showToast("success", "Tour created successfully");
    }
    setForm(emptyForm);
    setEditingId(null);
    setActiveTab("list");
  };

  const handleEdit = (tour: any) => {
    setForm({
      title: tour.title, slug: tour.slug, description: tour.description || "",
      shortDescription: "", destinations: tour.destinations, pickupPoints: ["Islamabad", "Abbottabad"],
      duration: tour.duration, totalDays: parseInt(tour.duration) || 5, totalNights: parseInt(tour.duration) - 1 || 4,
      pricePerPerson: tour.pricePerPerson, maxGroupSize: 15, category: "adventure",
      difficulty: "moderate", inclusions: tour.inclusions || [], exclusions: tour.exclusions || [],
      itinerary: tour.itinerary || [], image: tour.image, isFeatured: false,
    });
    setEditingId(tour.id);
    setActiveTab("create");
  };

  const handleDelete = (id: string) => {
    setTours(tours.filter((t) => t.id !== id));
    showToast("success", "Tour deleted successfully");
  };

  const addItineraryDay = () => {
    setForm({
      ...form,
      itinerary: [
        ...form.itinerary,
        { day: form.itinerary.length + 1, title: "", description: "", meals: [], accommodation: "" },
      ],
    });
  };

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const updated = [...form.itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, itinerary: updated });
  };

  const removeItineraryDay = (index: number) => {
    const updated = form.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
    setForm({ ...form, itinerary: updated });
  };

  return (
    <div className="p-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Tours</h1>
          <p className="text-sm text-gray-500">{tours.length} tours in system</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setActiveTab("create"); }}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 transition"
        >
          <Plus className="w-4 h-4" /> Add New Tour
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "list" ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" placeholder="Search tours..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-96 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Tours Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Tour</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Destinations</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Duration</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Price</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Dates</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={tour.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-gray-900">{tour.title}</p>
                            <p className="text-xs text-gray-400">{tour.rating}★ · {tour.pickupPoints?.join(", ")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {tour.destinations.map((d) => (
                            <span key={d} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{d}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{tour.duration}</td>
                      <td className="px-5 py-3 font-bold text-brand-600">PKR {tour.pricePerPerson.toLocaleString()}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">—</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(tour)} className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-600 transition">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(tour.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400">No tours found</div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Tour Form */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">{editingId ? "Edit Tour" : "Create New Tour"}</h2>
                <button onClick={() => setActiveTab("list")} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Tour Title *</label>
                      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="5 Days Hunza Valley Adventure" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Duration *</label>
                      <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="5 Days / 4 Nights" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
                      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={3} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Describe the tour experience..." />
                    </div>
                  </div>
                </div>

                {/* Destinations & Pickup */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Route & Pickup Points</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Destinations *</label>
                      <div className="flex flex-wrap gap-2">
                        {DESTINATIONS.map((d) => (
                          <button key={d} type="button"
                            onClick={() => setForm({
                              ...form,
                              destinations: form.destinations.includes(d)
                                ? form.destinations.filter((x) => x !== d)
                                : [...form.destinations, d],
                            })}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                              form.destinations.includes(d) ? "bg-brand-500 text-white border-brand-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-300"
                            }`}>
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Pickup Points *</label>
                      <div className="flex flex-wrap gap-2">
                        {PICKUP_POINTS.map((p) => (
                          <button key={p} type="button"
                            onClick={() => setForm({
                              ...form,
                              pickupPoints: form.pickupPoints.includes(p)
                                ? form.pickupPoints.filter((x) => x !== p)
                                : [...form.pickupPoints, p],
                            })}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                              form.pickupPoints.includes(p) ? "bg-green-500 text-white border-green-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300"
                            }`}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Group */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pricing & Group</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Price/Person (PKR) *</label>
                      <input type="number" value={form.pricePerPerson || ""} onChange={(e) => setForm({ ...form, pricePerPerson: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="38000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Max Group Size</label>
                      <input type="number" value={form.maxGroupSize} onChange={(e) => setForm({ ...form, maxGroupSize: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Difficulty</label>
                      <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Itinerary */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Day-by-Day Itinerary</h3>
                    <button onClick={addItineraryDay} className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium">
                      <Plus className="w-3.5 h-3.5" /> Add Day
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.itinerary.map((day, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-brand-600">Day {day.day}</span>
                          <button onClick={() => removeItineraryDay(i)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input value={day.title} onChange={(e) => updateItineraryDay(i, "title", e.target.value)}
                            placeholder="Day title" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                          <input value={day.description} onChange={(e) => updateItineraryDay(i, "description", e.target.value)}
                            placeholder="Description" className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                      </div>
                    ))}
                    {form.itinerary.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">No itinerary days added. Click "Add Day" to start.</p>
                    )}
                  </div>
                </div>

                {/* Inclusions / Exclusions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Inclusions</h3>
                    <div className="flex gap-2 mb-2">
                      <input value={newInclusion} onChange={(e) => setNewInclusion(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && newInclusion) { setForm({ ...form, inclusions: [...form.inclusions, newInclusion] }); setNewInclusion(""); } }}
                        placeholder="Add inclusion" className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                      <button onClick={() => { if (newInclusion) { setForm({ ...form, inclusions: [...form.inclusions, newInclusion] }); setNewInclusion(""); } }}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">+</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.inclusions.map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full">
                          {item}
                          <button onClick={() => setForm({ ...form, inclusions: form.inclusions.filter((_, j) => j !== i) })} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Exclusions</h3>
                    <div className="flex gap-2 mb-2">
                      <input value={newExclusion} onChange={(e) => setNewExclusion(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && newExclusion) { setForm({ ...form, exclusions: [...form.exclusions, newExclusion] }); setNewExclusion(""); } }}
                        placeholder="Add exclusion" className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                      <button onClick={() => { if (newExclusion) { setForm({ ...form, exclusions: [...form.exclusions, newExclusion] }); setNewExclusion(""); } }}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">+</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.exclusions.map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-full">
                          {item}
                          <button onClick={() => setForm({ ...form, exclusions: form.exclusions.filter((_, j) => j !== i) })} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Cover Image URL</label>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="https://images.unsplash.com/..." />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button onClick={() => setActiveTab("list")} className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
                  <button onClick={handleSave} className="flex items-center gap-2 bg-brand-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 transition">
                    <Save className="w-4 h-4" /> {editingId ? "Update Tour" : "Create Tour"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
