import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit3, Save, X, Search, Bed, Home,
  CheckCircle, AlertCircle, ToggleLeft, ToggleRight, Loader2
} from "lucide-react";
import { hotelsAPI } from "../../services/api";

export default function ManageHotels() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [hotelForm, setHotelForm] = useState({
    name: "", description: "", shortDescription: "", destination: "", address: "", city: "",
    starRating: 3, startingPricePerNight: 0, phone: "", email: "",
    amenities: [] as string[], images: [] as string[],
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await hotelsAPI.getAll({ limit: 100 });
      setHotels(res.data.data || []);
    } catch (err: any) {
      showToast("error", "Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const filtered = hotels.filter((h: any) =>
    h.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.location?.toLowerCase().includes(search.toLowerCase()) ||
    h.destination?.toLowerCase().includes(search.toLowerCase())
  );

  const activeHotel = selectedHotel ? hotels.find((h: any) => h._id === selectedHotel) : null;

  const handleSaveHotel = async () => {
    if (!hotelForm.name || !hotelForm.destination) {
      showToast("error", "Name and destination are required");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...hotelForm,
        slug: hotelForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        currency: "PKR",
        checkInTime: "14:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Free cancellation up to 24 hours before check-in.",
        totalRooms: 20,
      };
      if (editingHotel) {
        await hotelsAPI.update(editingHotel._id, payload);
        showToast("success", "Hotel updated");
      } else {
        await hotelsAPI.create(payload);
        showToast("success", "Hotel created");
      }
      setShowHotelForm(false);
      setEditingHotel(null);
      setHotelForm({ name: "", description: "", shortDescription: "", destination: "", address: "", city: "", starRating: 3, startingPricePerNight: 0, phone: "", email: "", amenities: [], images: [] });
      fetchHotels();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to save hotel");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHotel = async (id: string) => {
    if (!confirm("Delete this hotel?")) return;
    try {
      await hotelsAPI.delete(id);
      showToast("success", "Hotel deleted");
      if (selectedHotel === id) setSelectedHotel(null);
      fetchHotels();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to delete");
    }
  };

  const handleEditHotel = (hotel: any) => {
    setHotelForm({
      name: hotel.name || "", description: hotel.description || "", shortDescription: hotel.shortDescription || "",
      destination: hotel.destination || "", address: hotel.address || hotel.location || "", city: hotel.city || "",
      starRating: hotel.starRating || 3, startingPricePerNight: hotel.startingPricePerNight || 0,
      phone: hotel.phone || "", email: hotel.email || "",
      amenities: hotel.amenities?.map((a: any) => typeof a === "string" ? a : a.name) || [],
      images: hotel.images || [],
    });
    setEditingHotel(hotel);
    setShowHotelForm(true);
  };

  return (
    <div className="p-6">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}>
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Hotels</h1>
          <p className="text-sm text-gray-500">{loading ? "Loading..." : `${hotels.length} hotels`}</p>
        </div>
        <button onClick={() => { setHotelForm({ name: "", description: "", shortDescription: "", destination: "", address: "", city: "", starRating: 3, startingPricePerNight: 0, phone: "", email: "", amenities: [], images: [] }); setEditingHotel(null); setShowHotelForm(true); }}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 transition">
          <Plus className="w-4 h-4" /> Add Hotel
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hotel List */}
          <div className="lg:col-span-1">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search hotels..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              {filtered.map((hotel: any) => (
                <button key={hotel._id} onClick={() => { setSelectedHotel(hotel._id); setShowHotelForm(false); }}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selectedHotel === hotel._id ? "border-brand-500 bg-brand-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}>
                  <div className="flex items-center gap-3">
                    <img src={hotel.images?.[0] || hotel.image || ""} alt="" className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='%23e5e7eb'><rect width='24' height='24' rx='4'/></svg>"; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{hotel.name}</p>
                      <p className="text-xs text-gray-400">{hotel.destination || hotel.location} · ⭐{hotel.starRating}</p>
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No hotels found</p>}
            </div>
          </div>

          {/* Hotel Detail / Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {showHotelForm ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">{editingHotel ? "Edit Hotel" : "Add New Hotel"}</h2>
                    <button onClick={() => setShowHotelForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Hotel Name *</label>
                      <input value={hotelForm.name} onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Awan Alpine Resort" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Destination *</label>
                      <input value={hotelForm.destination} onChange={(e) => setHotelForm({ ...hotelForm, destination: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Naran" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                      <textarea value={hotelForm.description} onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })} rows={3}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Star Rating</label>
                      <select value={hotelForm.starRating} onChange={(e) => setHotelForm({ ...hotelForm, starRating: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s} Star</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Starting Price/Night (PKR)</label>
                      <input type="number" value={hotelForm.startingPricePerNight || ""} onChange={(e) => setHotelForm({ ...hotelForm, startingPricePerNight: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                      <input value={hotelForm.phone} onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                      <input value={hotelForm.email} onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button onClick={() => setShowHotelForm(false)} className="px-4 py-2.5 text-sm text-gray-600 font-medium">Cancel</button>
                    <button onClick={handleSaveHotel} disabled={saving}
                      className="flex items-center gap-2 bg-brand-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 transition disabled:opacity-50">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {editingHotel ? "Update" : "Create Hotel"}
                    </button>
                  </div>
                </motion.div>
              ) : activeHotel ? (
                <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold">{activeHotel.name}</h2>
                      <p className="text-sm text-gray-500">{activeHotel.destination || activeHotel.location} · ⭐{activeHotel.starRating} · From PKR {activeHotel.startingPricePerNight?.toLocaleString()}/night</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditHotel(activeHotel)} className="p-2 hover:bg-orange-50 rounded-lg text-orange-600"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteHotel(activeHotel._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{activeHotel.description}</p>
                  {activeHotel.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activeHotel.amenities.map((a: any, i: number) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          {typeof a === "string" ? a : a.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {activeHotel.images?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {activeHotel.images.slice(0, 3).map((img: string, i: number) => (
                        <img key={i} src={img} alt="" className="w-full h-32 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
                  <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Select a hotel to view details</p>
                  <p className="text-sm mt-1">Or click "Add Hotel" to create a new one</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
