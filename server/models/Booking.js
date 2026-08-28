import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ["male", "female", "other"] },
  idType: { type: String, enum: ["cnic", "passport", "other"] },
  idNumber: { type: String },
  phone: { type: String },
  isChild: { type: Boolean, default: false },
}, { _id: false });

const PriceBreakdownSchema = new mongoose.Schema({
  baseTourPrice: { type: Number, default: 0 },
  tourDiscount: { type: Number, default: 0 },
  tourTotal: { type: Number, default: 0 },
  roomPricePerNight: { type: Number, default: 0 },
  roomNights: { type: Number, default: 0 },
  roomTotal: { type: Number, default: 0 },
  extraBedCharge: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  serviceCharge: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  currency: { type: String, default: "PKR" },
  depositPaid: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 },
}, { _id: false });

const BookingSchema = new mongoose.Schema(
  {
    // Booking Reference
    bookingRef: { type: String, required: true, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Booking Type
    bookingType: {
      type: String,
      required: true,
      enum: ["tour_only", "hotel_only", "tour_plus_hotel"],
    },

    // Tour Details (for tour_only and tour_plus_hotel)
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      default: null,
    },
    tourTitle: { type: String },
    tourStartDate: { type: Date },
    tourEndDate: { type: Date },
    destinations: [{ type: String }],

    // Pickup & Drop
    pickupPoint: {
      type: String,
      enum: ["Islamabad", "Abbottabad", null],
      default: null,
    },
    dropOffPoint: {
      type: String,
      enum: ["Islamabad", "Abbottabad", null],
      default: null,
    },
    pickupAddress: { type: String },

    // Hotel Details (for hotel_only and tour_plus_hotel)
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      default: null,
    },
    hotelName: { type: String },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    roomType: { type: String },
    checkInDate: { type: Date },
    checkOutDate: { type: Date },
    totalNights: { type: Number, default: 0 },

    // Guests
    guests: { type: [GuestSchema], required: true },
    totalGuests: { type: Number, required: true },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, default: 0 },
    extraBeds: { type: Number, default: 0 },

    // Pricing
    priceBreakdown: { type: PriceBreakdownSchema, required: true },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "jazzcash", "easypaisa", "cod", "card"],
      default: "bank_transfer",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "deposit_paid", "fully_paid", "refunded", "failed"],
      default: "pending",
    },
    transactionId: { type: String },
    paymentDate: { type: Date },

    // Booking Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      default: "pending",
    },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
    cancellationRefund: { type: Number, default: 0 },

    // Special Requests
    specialRequests: { type: String, maxlength: 500 },
    dietaryRequirements: { type: [String], default: [] },
    medicalConditions: { type: String },

    // Communication
    notes: { type: String },
    internalNotes: { type: String },

    // Feedback
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, maxlength: 1000 },
    reviewedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
BookingSchema.index({ bookingRef: 1 });
BookingSchema.index({ user: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ bookingType: 1 });
BookingSchema.index({ tour: 1 });
BookingSchema.index({ hotel: 1 });
BookingSchema.index({ tourStartDate: 1 });
BookingSchema.index({ checkInDate: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ createdAt: -1 });

// Virtual: is tour booking
BookingSchema.virtual("isTourBooking").get(function () {
  return this.bookingType === "tour_only" || this.bookingType === "tour_plus_hotel";
});

// Virtual: is hotel booking
BookingSchema.virtual("isHotelBooking").get(function () {
  return this.bookingType === "hotel_only" || this.bookingType === "tour_plus_hotel";
});

// Virtual: can cancel
BookingSchema.virtual("canCancel").get(function () {
  if (this.status === "cancelled" || this.status === "completed") return false;
  const startDate = this.tourStartDate || this.checkInDate;
  if (!startDate) return false;
  const hoursUntilStart = (startDate.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntilStart > 48;
});

// Pre-save: generate booking reference
BookingSchema.pre("save", function () {
  if (!this.bookingRef) {
    const prefix = this.bookingType === "tour_only" ? "TR"
      : this.bookingType === "hotel_only" ? "HT"
      : "TH";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingRef = `${prefix}-${timestamp}-${random}`;
  }
});

// Pre-save: calculate balance
BookingSchema.pre("save", function () {
  if (this.priceBreakdown) {
    this.priceBreakdown.balanceDue =
      this.priceBreakdown.grandTotal - this.priceBreakdown.depositPaid;
  }
});

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
