import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router";
import {
  CheckCircle, ChevronRight, ChevronLeft, MapPin, Calendar,
  Users, Building2, Upload, AlertCircle, Phone,
  Mail, User, Car, Star, Shield, Clock
} from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { MOCK_TOURS } from "../../data/mockTours";

const steps = [
  { id: 1, label: "Order Summary" },
  { id: 2, label: "Your Details" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Confirmation" },
];

const fmt = (n: number) => n.toLocaleString("en-PK");

export default function Booking() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);

  // Read from URL params
  const tourId = searchParams.get("tour") || MOCK_TOURS[0].id;
  const tour = MOCK_TOURS.find((t) => t.id === tourId) || MOCK_TOURS[0];
  const urlGuests = parseInt(searchParams.get("guests") || "1", 10);
  const urlPickup = searchParams.get("pickup") || "Islamabad";
  const urlDate = searchParams.get("date") || "2026-03-15";

  const [guests, setGuests] = useState(urlGuests);
  const [pickupOrigin, setPickupOrigin] = useState(urlPickup);
  const travelDate = urlDate;
  const [hotelAddOnEnabled, setHotelAddOnEnabled] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", cnic: "",
    pickupPoint: "Islamabad", specialRequests: "",
  });
  const [payMethod, setPayMethod] = useState("");
  const [payDetails, setPayDetails] = useState<Record<string, string>>({});
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [bookingRef, setBookingRef] = useState("");

  const hotelAddOn = hotelAddOnEnabled ? { hotelName: "Hunza Serena Inn", roomType: "Deluxe Room", nights: 4, pricePerNight: 18000 } : null;
  const basePrice = tour.pricePerPerson * guests;
  const discount = guests >= 8 ? 0.10 : guests >= 4 ? 0.05 : 0;
  const tourDiscount = Math.round(basePrice * discount);
  const tourTotal = basePrice - tourDiscount;
  const hotelTotal = hotelAddOn ? hotelAddOn.pricePerNight * hotelAddOn.nights : 0;
  const subtotal = tourTotal + hotelTotal;
  const tax = Math.round(subtotal * 0.10);
  const total = subtotal + tax;
  const deposit = Math.round(total * 0.20);
  const balance = total - deposit;

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const next = () => {
    if (step === 3) setBookingRef("NR-" + Date.now().toString(36).toUpperCase());
    setStep((s) => Math.min(s + 1, 4));
  };

  const inputCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent";

  return (
    <>
      <PageMeta title="Checkout - NorthRoutes PK" description="Complete your booking" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-orange-500 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
            <p className="text-orange-100 mt-1">Complete your NorthRoutes PK booking</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.id ? "bg-[#EA580C] text-white shadow-md" : "bg-gray-200 text-gray-500"}`}>
                    {step > s.id ? "✓" : s.id}
                  </div>
                  <span className={`text-xs mt-2 font-medium hidden sm:block ${step >= s.id ? "text-green-600" : "text-gray-400"}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 sm:mx-4 ${step > s.id ? "bg-green-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>

              {/* STEP 1: Order Summary */}
              {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl border p-5">
                      <div className="flex items-start gap-4">
                        <img src={tour.image} alt={tour.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{tour.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <Clock className="w-3.5 h-3.5" />{tour.duration}
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{tour.rating}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {tour.destinations.map((d) => (
                              <span key={d} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full">{d}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Per person</p>
                          <p className="font-bold text-green-700">PKR {fmt(tour.pricePerPerson)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border p-5">
                      <h3 className="font-bold text-gray-900 mb-4">Trip Details</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#EA580C]" /><div><p className="text-xs text-gray-400">Pickup</p><p className="text-sm font-medium">{pickupOrigin}</p></div></div>
                        <div className="flex items-center gap-2"><Users className="w-4 h-4 text-[#EA580C]" /><div><p className="text-xs text-gray-400">Guests</p><p className="text-sm font-medium">{guests}</p></div></div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#EA580C]" /><div><p className="text-xs text-gray-400">Travel Date</p><p className="text-sm font-medium">{travelDate}</p></div></div>
                        <div className="flex items-center gap-2"><Car className="w-4 h-4 text-[#EA580C]" /><div><p className="text-xs text-gray-400">Transport</p><p className="text-sm font-medium">AC Van</p></div></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-[#EA580C]" />Hotel Room Add-on</h3>
                        <button onClick={() => setHotelAddOnEnabled(!hotelAddOnEnabled)} className={`relative w-12 h-6 rounded-full transition-colors ${hotelAddOnEnabled ? "bg-green-500" : "bg-gray-300"}`}>
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${hotelAddOnEnabled ? "translate-x-6" : ""}`} />
                        </button>
                      </div>
                      {hotelAddOnEnabled && hotelAddOn && (
                        <div className="flex items-center justify-between">
                          <div><p className="font-medium">{hotelAddOn.hotelName}</p><p className="text-sm text-gray-500">{hotelAddOn.roomType} · {hotelAddOn.nights} nights</p></div>
                          <div className="text-right"><p className="text-sm text-gray-400">PKR {fmt(hotelAddOn.pricePerNight)}/night × {hotelAddOn.nights}</p><p className="font-bold text-gray-900">PKR {fmt(hotelTotal)}</p></div>
                        </div>
                      )}
                      {!hotelAddOnEnabled && (
                        <p className="text-sm text-gray-400">Toggle to add a hotel room to your booking</p>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border p-5 sticky top-24">
                      <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">Tour ({guests} × PKR {fmt(tour.pricePerPerson)})</span><span>PKR {fmt(basePrice)}</span></div>
                        {discount > 0 && <div className="flex justify-between text-green-600"><span>Group Discount ({discount * 100}%)</span><span>-PKR {fmt(tourDiscount)}</span></div>}
                        {hotelAddOnEnabled && hotelAddOn && <div className="flex justify-between"><span className="text-gray-600">Hotel ({hotelAddOn.nights} nights)</span><span>PKR {fmt(hotelTotal)}</span></div>}
                        <div className="border-t pt-3 flex justify-between"><span className="text-gray-600">Subtotal</span><span>PKR {fmt(subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Tax (10%)</span><span>PKR {fmt(tax)}</span></div>
                        <div className="border-t pt-3"><div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-[#EA580C]">PKR {fmt(total)}</span></div></div>
                        <div className="bg-orange-50 rounded-lg p-3 mt-3">
                          <p className="text-xs font-medium text-[#EA580C] mb-1">Pay Now (20% Deposit)</p>
                          <p className="text-xl font-bold text-green-700">PKR {fmt(deposit)}</p>
                          <p className="text-xs text-gray-500 mt-1">Balance PKR {fmt(balance)} due before departure</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Customer Details */}
              {step === 2 && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl border p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1.5"><User className="w-3.5 h-3.5 inline mr-1" /> Full Name *</label><input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="As per CNIC / Passport" className={inputCls} /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5"><Mail className="w-3.5 h-3.5 inline mr-1" /> Email *</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className={inputCls} /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5"><Phone className="w-3.5 h-3.5 inline mr-1" /> Phone *</label><input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+92 3XX XXXXXXX" className={inputCls} /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">CNIC Number</label><input type="text" value={form.cnic} onChange={(e) => update("cnic", e.target.value)} placeholder="XXXXX-XXXXXXX-X" className={inputCls} /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5"><MapPin className="w-3.5 h-3.5 inline mr-1" /> Pickup Point</label><select value={form.pickupPoint} onChange={(e) => update("pickupPoint", e.target.value)} className={inputCls}><option>Islamabad</option><option>Abbottabad</option></select></div>
                      <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests</label><textarea rows={3} value={form.specialRequests} onChange={(e) => update("specialRequests", e.target.value)} placeholder="Dietary needs, accessibility requirements..." className={inputCls + " resize-none"} /></div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment */}
              {step === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Select Payment Method</h3>

                    {/* JazzCash */}
                    <button onClick={() => setPayMethod("jazzcash")} className={`w-full text-left p-5 rounded-xl border-2 transition-all ${payMethod === "jazzcash" ? "border-[#EA580C] bg-orange-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-xl">📱</div>
                        <div className="flex-1"><p className="font-bold text-gray-900">JazzCash</p><p className="text-sm text-gray-500">Pay via Mobile Account or Voucher</p></div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === "jazzcash" ? "border-[#EA580C] bg-[#EA580C]" : "border-gray-300"}`}>{payMethod === "jazzcash" && <div className="w-2 h-2 bg-white rounded-full" />}</div>
                      </div>
                      <AnimatePresence>{payMethod === "jazzcash" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 pt-4 border-t border-orange-100">
                          <div className="space-y-3">
                            <div><label className="block text-xs font-medium text-gray-600 mb-1">JazzCash Account Number</label><input type="tel" placeholder="03XX XXXXXXX" onChange={(e) => setPayDetails({ ...payDetails, jazzcash: e.target.value })} className={inputCls} /></div>
                            <div className="bg-amber-50 rounded-lg p-3"><p className="text-xs text-amber-700"><AlertCircle className="w-3.5 h-3.5 inline mr-1" />You will receive a confirmation call/SMS to authorize PKR {fmt(deposit)} payment.</p></div>
                          </div>
                        </motion.div>
                      )}</AnimatePresence>
                    </button>

                    {/* EasyPaisa */}
                    <button onClick={() => setPayMethod("easypaisa")} className={`w-full text-left p-5 rounded-xl border-2 transition-all ${payMethod === "easypaisa" ? "border-[#EA580C] bg-orange-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-xl">💚</div>
                        <div className="flex-1"><p className="font-bold text-gray-900">EasyPaisa</p><p className="text-sm text-gray-500">Pay via Mobile Account</p></div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === "easypaisa" ? "border-[#EA580C] bg-[#EA580C]" : "border-gray-300"}`}>{payMethod === "easypaisa" && <div className="w-2 h-2 bg-white rounded-full" />}</div>
                      </div>
                      <AnimatePresence>{payMethod === "easypaisa" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 pt-4 border-t border-orange-100">
                          <div className="space-y-3">
                            <div><label className="block text-xs font-medium text-gray-600 mb-1">EasyPaisa Account Number</label><input type="tel" placeholder="03XX XXXXXXX" onChange={(e) => setPayDetails({ ...payDetails, easypaisa: e.target.value })} className={inputCls} /></div>
                            <div className="bg-amber-50 rounded-lg p-3"><p className="text-xs text-amber-700"><AlertCircle className="w-3.5 h-3.5 inline mr-1" />You will receive an SMS to authorize payment of PKR {fmt(deposit)}.</p></div>
                          </div>
                        </motion.div>
                      )}</AnimatePresence>
                    </button>

                    {/* Bank Transfer */}
                    <button onClick={() => setPayMethod("bank")} className={`w-full text-left p-5 rounded-xl border-2 transition-all ${payMethod === "bank" ? "border-[#EA580C] bg-orange-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl">🏦</div>
                        <div className="flex-1"><p className="font-bold text-gray-900">Bank Transfer</p><p className="text-sm text-gray-500">Direct bank transfer with proof upload</p></div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === "bank" ? "border-[#EA580C] bg-[#EA580C]" : "border-gray-300"}`}>{payMethod === "bank" && <div className="w-2 h-2 bg-white rounded-full" />}</div>
                      </div>
                      <AnimatePresence>{payMethod === "bank" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 pt-4 border-t border-orange-100">
                          <div className="space-y-3">
                            <div className="bg-gray-50 rounded-lg p-4 text-sm">
                              <p className="font-medium text-gray-900 mb-2">Transfer to:</p>
                              <div className="space-y-1 text-gray-600">
                                <p><span className="font-medium">Bank:</span> Meezan Bank</p>
                                <p><span className="font-medium">Account Title:</span> NorthRoutes PK (Pvt) Ltd</p>
                                <p><span className="font-medium">Account No:</span> 0XXX-XXXX-XXXX</p>
                                <p><span className="font-medium">IBAN:</span> PKXX XXXX XXXX XXXX XXXX XX</p>
                              </div>
                            </div>
                            <div><label className="block text-xs font-medium text-gray-600 mb-1">Sender Reference Number</label><input type="text" placeholder="Transaction reference" onChange={(e) => setPayDetails({ ...payDetails, bankRef: e.target.value })} className={inputCls} /></div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1"><Upload className="w-3.5 h-3.5 inline mr-1" />Upload Proof of Transaction</label>
                              <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#EA580C] transition">
                                <div className="text-center">{proofFile ? <p className="text-sm text-green-600 font-medium">✓ {proofFile.name}</p> : <><Upload className="w-5 h-5 mx-auto text-gray-400" /><p className="text-xs text-gray-500 mt-1">Screenshot / receipt image</p></>}</div>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
                              </label>
                            </div>
                          </div>
                        </motion.div>
                      )}</AnimatePresence>
                    </button>

                    {/* Card */}
                    <button onClick={() => setPayMethod("card")} className={`w-full text-left p-5 rounded-xl border-2 transition-all ${payMethod === "card" ? "border-[#EA580C] bg-orange-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-xl">💳</div>
                        <div className="flex-1"><p className="font-bold text-gray-900">Debit / Credit Card</p><p className="text-sm text-gray-500">Visa, Mastercard, UnionPay</p></div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === "card" ? "border-[#EA580C] bg-[#EA580C]" : "border-gray-300"}`}>{payMethod === "card" && <div className="w-2 h-2 bg-white rounded-full" />}</div>
                      </div>
                      <AnimatePresence>{payMethod === "card" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 pt-4 border-t border-orange-100">
                          <div className="space-y-3">
                            <div><label className="block text-xs font-medium text-gray-600 mb-1">Card Number</label><input type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} onChange={(e) => setPayDetails({ ...payDetails, card: e.target.value })} className={inputCls} /></div>
                            <div className="grid grid-cols-2 gap-3">
                              <div><label className="block text-xs font-medium text-gray-600 mb-1">Expiry</label><input type="text" placeholder="MM/YY" maxLength={5} onChange={(e) => setPayDetails({ ...payDetails, expiry: e.target.value })} className={inputCls} /></div>
                              <div><label className="block text-xs font-medium text-gray-600 mb-1">CVV</label><input type="password" placeholder="•••" maxLength={4} onChange={(e) => setPayDetails({ ...payDetails, cvv: e.target.value })} className={inputCls} /></div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500"><Shield className="w-3.5 h-3.5" />Secured by 256-bit SSL encryption</div>
                          </div>
                        </motion.div>
                      )}</AnimatePresence>
                    </button>
                  </div>

                  {/* Payment Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border p-5 sticky top-24">
                      <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600"><span>Tour Package</span><span>PKR {fmt(tourTotal)}</span></div>
                        {hotelAddOnEnabled && hotelAddOn && <div className="flex justify-between text-gray-600"><span>Hotel Add-on</span><span>PKR {fmt(hotelTotal)}</span></div>}
                        <div className="flex justify-between text-gray-600"><span>Tax (10%)</span><span>PKR {fmt(tax)}</span></div>
                        <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>PKR {fmt(total)}</span></div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 mt-4">
                        <p className="text-xs font-medium text-green-700">Pay Now (Deposit)</p>
                        <p className="text-xl font-bold text-green-700">PKR {fmt(deposit)}</p>
                        <p className="text-xs text-gray-500 mt-1">Remaining PKR {fmt(balance)} on arrival</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500"><Shield className="w-3.5 h-3.5 text-green-500" /><span>Secure payment</span></div>
                        <div className="flex items-center gap-2 text-xs text-gray-500"><CheckCircle className="w-3.5 h-3.5 text-green-500" /><span>Free cancellation up to 48hrs</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Confirmation */}
              {step === 4 && (
                <div className="max-w-lg mx-auto text-center">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.5 }}>
                    <div className="bg-white rounded-2xl border p-8 shadow-lg">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-green-600" /></div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                      <p className="text-gray-500 mb-6">Your NorthRoutes PK trip has been booked successfully</p>
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-xs text-gray-400 mb-1">Booking Reference</p>
                        <p className="text-2xl font-bold text-[#EA580C] font-mono tracking-wider">{bookingRef}</p>
                      </div>
                      <div className="space-y-3 text-left text-sm mb-6">
                        <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Tour</span><span className="font-medium text-right">{tour.title}</span></div>
                        <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Pickup</span><span className="font-medium">{form.pickupPoint}</span></div>
                        <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Guests</span><span className="font-medium">{guests}</span></div>
                        <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Payment</span><span className="font-medium capitalize">{payMethod === "bank" ? "Bank Transfer" : payMethod}</span></div>
                        <div className="flex justify-between py-2"><span className="text-gray-500">Amount Paid</span><span className="font-bold text-green-700">PKR {fmt(deposit)}</span></div>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-4 text-left mb-6">
                        <p className="text-sm text-amber-700 font-medium mb-1">What's Next?</p>
                        <ul className="text-xs text-amber-600 space-y-1">
                          <li>• Confirmation email will be sent to {form.email || "your email"}</li>
                          <li>• Our team will contact you within 24 hours</li>
                          <li>• Pickup details shared 24hrs before departure</li>
                        </ul>
                      </div>
                      <a href="/" className="inline-flex items-center justify-center w-full bg-[#EA580C] text-white py-3 rounded-lg font-medium hover:bg-[#3B50DF] transition">Back to Home</a>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav Buttons */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-8">
              {step > 1 ? (
                <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"><ChevronLeft className="w-4 h-4" /> Back</button>
              ) : <div />}
              <button onClick={next} disabled={step === 3 && !payMethod} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#EA580C] rounded-lg hover:bg-[#3B50DF] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md">
                {step === 3 ? <><CheckCircle className="w-4 h-4" /> Confirm & Pay PKR {fmt(deposit)}</> : <>Continue <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
