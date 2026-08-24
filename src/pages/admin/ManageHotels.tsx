import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit3, Save, X, Search, Bed, DollarSign,
  Calendar, CheckCircle, AlertCircle, Home, ToggleLeft, ToggleRight
} from "lucide-react";
import { MOCK_HOTELS } from "../../data/mockHotels";

interface RoomForm {
  type: string;
  bedType: string;
  pricePerNight: number;
  sizeSqm: number;
  maxGuests: number;
  description: string;
  amenities: string[];
  available: boolean;
}

export default function ManageHotels() {
  const [hotels, setHotels] = useState(MOCK_HOTELS);
  const [search, setSearch] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState<RoomForm>({
    type: "", bedType: "Queen Bed", pricePerNight: 0, sizeSqm: 25,
    maxGuests: 2, description: "", amenities: [], available: true,
  });
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [hotelRooms, setHotelRooms] = useState<Record<string, any[]>>(() => {
    const map: Record<string, any[]> = {};
    MOCK_HOTELS.forEach((h) => { map[h.id] = [...h.rooms]; });
    return map;
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = hotels.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  const activeHotel = selectedHotel ? hotels.find((h) => h.id === selectedHotel) : null;
  const activeRooms = selectedHotel ? hotelRooms[selectedHotel] || [] : [];

  const handleSaveRoom = () => {
    if (!selectedHotel || !roomForm.type || roomForm.pricePerNight <= 0) {
      showToast("error", "Please fill all required fields");
      return;
    }

    const rooms = hotelRooms[selectedHotel] || [];
    if (editingRoom) {
      const updated = rooms.map((r) => r.id === editingRoom ? { ...r, ...roomForm } : r);
      setHotelRooms({ ...hotelRooms, [selectedHotel]: updated });
      showToast("success", "Room updated successfully");
    } else {
      const newRoom = { ...roomForm, id: `room-${Date.now()}` };
      setHotelRooms({ ...hotelRooms, [selectedHotel]: [...rooms, newRoom] });
      showToast("success", "Room added successfully");
    }
    setRoomForm({ type: "", bedType: "Queen Bed", pricePerNight: 0, sizeSqm: 25, maxGuests: 2, description: "", amenities: [], available: true });
    setEditingRoom(null);
    setShowRoomForm(false);
  };

  const handleDeleteRoom = (hotelId: string, roomId: string) => {
    setHotelRooms({ ...hotelRooms, [hotelId]: hotelRooms[hotelId].filter((r) => r.id !== roomId) });
    showToast("success", "Room deleted");
  };

  const handleEditRoom = (room: any) => {
    setRoomForm({ ...room });
    setEditingRoom(room.id);
    setShowRoomForm(true);
  };

  const toggleRoomAvailability = (hotelId: string, roomId: string) => {
    const rooms = hotelRooms[hotelId].map((r) =>
      r.id === roomId ? { ...r, available: !r.available } : r
    );
    setHotelRooms({ ...hotelRooms, [hotelId]: rooms });
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
          <h1 className="text-2xl font-bold">Manage Hotels & Rooms</h1>
          <p className="text-sm text-gray-500">{hotels.length} hotels · {Object.values(hotelRooms).flat().length} total rooms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hotel List */}
        <div className="lg:col-span-1">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search hotels..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="space-y-2">
            {filtered.map((hotel) => (
              <button key={hotel.id} onClick={() => { setSelectedHotel(hotel.id); setShowRoomForm(false); setEditingRoom(null); }}
                className={`w-full text-left p-4 rounded-xl border transition ${
                  selectedHotel === hotel.id ? "border-brand-500 bg-brand-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                }`}>
                <div className="flex items-center gap-3">
                  <img src={hotel.images?.[0] || hotel.image || ''} alt="" className="w-12 h-12 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="%23e5e7eb" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="%23f3f4f6"/><path d="M12 8v8M8 12h8" stroke="%23d1d5db" stroke-width="1.5"/></svg>'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{hotel.name}</p>
                    <p className="text-xs text-gray-400">{hotel.location}</p>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                    {hotelRooms[hotel.id]?.length || 0} rooms
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Room Management */}
        <div className="lg:col-span-2">
          {activeHotel ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold">{activeHotel.name}</h2>
                  <p className="text-sm text-gray-500">{activeHotel.location} · From PKR {activeHotel.rooms[0]?.pricePerNight?.toLocaleString()}/night</p>
                </div>
                <button onClick={() => { setRoomForm({ type: "", bedType: "Queen Bed", pricePerNight: 0, sizeSqm: 25, maxGuests: 2, description: "", amenities: [], available: true }); setEditingRoom(null); setShowRoomForm(true); }}
                  className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition">
                  <Plus className="w-4 h-4" /> Add Room Type
                </button>
              </div>

              {/* Room Form Modal */}
              <AnimatePresence>
                {showRoomForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm">{editingRoom ? "Edit Room" : "Add New Room"}</h3>
                        <button onClick={() => setShowRoomForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Room Type *</label>
                          <input value={roomForm.type} onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                            placeholder="Deluxe Room" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Bed Type</label>
                          <select value={roomForm.bedType} onChange={(e) => setRoomForm({ ...roomForm, bedType: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                            {["Single Bed", "Twin Beds", "Queen Bed", "King Bed", "2 Queen Beds", "King Bed + Sofa Bed"].map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Price/Night (PKR) *</label>
                          <input type="number" value={roomForm.pricePerNight || ""} onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Size (sqm)</label>
                          <input type="number" value={roomForm.sizeSqm} onChange={(e) => setRoomForm({ ...roomForm, sizeSqm: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Max Guests</label>
                          <input type="number" value={roomForm.maxGuests} onChange={(e) => setRoomForm({ ...roomForm, maxGuests: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div className="flex items-end">
                          <button onClick={handleSaveRoom}
                            className="w-full flex items-center justify-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition">
                            <Save className="w-4 h-4" /> {editingRoom ? "Update" : "Add Room"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Room Cards */}
              <div className="space-y-3">
                {activeRooms.map((room) => (
                  <div key={room.id} className={`flex items-center justify-between p-4 rounded-xl border transition ${
                    room.available ? "border-gray-200 bg-white" : "border-red-200 bg-red-50"
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        room.available ? "bg-blue-50 text-blue-600" : "bg-red-100 text-red-500"
                      }`}>
                        <Bed className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{room.type}</p>
                        <p className="text-xs text-gray-400">{room.bedType} · {room.sizeSqm} sqm · Max {room.maxGuests}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-brand-600">PKR {room.pricePerNight?.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">/ night</p>
                      </div>
                      <button onClick={() => toggleRoomAvailability(selectedHotel!, room.id)}
                        className={`p-1 rounded-lg transition ${room.available ? "text-green-500 hover:bg-green-50" : "text-red-500 hover:bg-red-50"}`}>
                        {room.available ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                      <button onClick={() => handleEditRoom(room)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteRoom(selectedHotel!, room.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {activeRooms.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">No rooms configured. Click "Add Room Type" to start.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
              <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Select a hotel to manage rooms</p>
              <p className="text-sm mt-1">Choose from the list on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
