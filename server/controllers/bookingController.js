import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Valid pickup points
const VALID_PICKUP_POINTS = ["Islamabad", "Abbottabad"];

// POST /api/bookings - Create a new booking
export async function createBooking(req, res) {
  try {
    const {
      bookingType,
      tourId,
      hotelId,
      roomId,
      pickupPoint,
      dropOffPoint,
      guests,
      adultCount,
      childCount,
      checkInDate,
      checkOutDate,
      specialRequests,
      dietaryRequirements,
      paymentMethod,
    } = req.body;

    // Validate booking type
    const validTypes = ["tour_only", "hotel_only", "tour_plus_hotel"];
    if (!validTypes.includes(bookingType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid booking type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    // Validate pickup point
    if (bookingType !== "hotel_only" && pickupPoint) {
      if (!VALID_PICKUP_POINTS.includes(pickupPoint)) {
        return res.status(400).json({
          success: false,
          message: `Invalid pickup point. Must be: ${VALID_PICKUP_POINTS.join(" or ")}`,
        });
      }
    }

    // Validate guests
    if (!guests || !Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one guest is required.",
      });
    }

    const totalGuests = guests.length;
    const childGuests = guests.filter((g) => g.isChild).length;
    const adultGuests = totalGuests - childGuests;

    // ===== TOUR CALCULATIONS =====
    let tourTotal = 0;
    let tourDiscount = 0;
    let pricePerPerson = 0;
    let tourTitle = "";
    let tourStartDate = null;
    let tourEndDate = null;
    let destinations = [];
    let availableSpots = 0;

    if (bookingType === "tour_only" || bookingType === "tour_plus_hotel") {
      if (!tourId) {
        return res.status(400).json({
          success: false,
          message: "Tour ID is required for tour bookings.",
        });
      }

      const tour = await Tour.findById(tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: "Tour not found.",
        });
      }

      pricePerPerson = tour.pricePerPerson;
      tourTitle = tour.title;
      destinations = tour.destinations;

      // Calculate group discount
      const groupTier = tour.groupPricing.find(
        (g) => totalGuests >= g.minPersons && totalGuests <= g.maxPersons
      );
      if (groupTier) {
        tourDiscount = (pricePerPerson * groupTier.discountPercent) / 100;
      }

      const discountedPricePerPerson = pricePerPerson - tourDiscount;
      tourTotal = discountedPricePerPerson * adultGuests;

      // Child discount (50% of adult price)
      if (childGuests > 0) {
        tourTotal += childGuests * discountedPricePerPerson * 0.5;
      }

      // Check seat availability on available dates
      if (req.body.tourStartDate) {
        tourStartDate = new Date(req.body.tourStartDate);
        const matchingDate = tour.availableDates.find(
          (d) => d.startDate <= tourStartDate && d.endDate >= tourStartDate && d.status === "open"
        );

        if (matchingDate) {
          availableSpots = matchingDate.availableSpots;
          if (totalGuests > availableSpots) {
            return res.status(400).json({
              success: false,
              message: `Only ${availableSpots} spots available for this date. Requested: ${totalGuests}.`,
            });
          }
        }

        // Tour end date based on duration
        tourEndDate = new Date(tourStartDate);
        tourEndDate.setDate(tourEndDate.getDate() + tour.totalDays - 1);
      }
    }

    // ===== HOTEL ADD-ON CALCULATIONS =====
    let roomTotal = 0;
    let roomPricePerNight = 0;
    let roomNights = 0;
    let hotelName = "";
    let roomType = "";

    if (bookingType === "hotel_only" || bookingType === "tour_plus_hotel") {
      if (!hotelId || !roomId) {
        return res.status(400).json({
          success: false,
          message: "Hotel ID and Room ID are required for hotel bookings.",
        });
      }

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found.",
        });
      }
      hotelName = hotel.name;

      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found.",
        });
      }

      roomType = room.type;
      roomPricePerNight = room.pricePerNight;

      // Calculate nights
      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({
          success: false,
          message: "Check-in and check-out dates are required for hotel bookings.",
        });
      }

      const ci = new Date(checkInDate);
      const co = new Date(checkOutDate);
      roomNights = Math.ceil((co - ci) / 86400000);

      if (roomNights < 1) {
        return res.status(400).json({
          success: false,
          message: "Check-out must be after check-in.",
        });
      }

      // Check room availability for each night
      for (let d = new Date(ci); d < co; d.setDate(d.getDate() + 1)) {
        const dayStr = d.toISOString().split("T")[0];
        const dayAvail = room.availability.find(
          (a) => a.date.toISOString().split("T")[0] === dayStr
        );

        if (dayAvail && dayAvail.bookedRooms >= dayAvail.totalRooms) {
          return res.status(400).json({
            success: false,
            message: `Room not available on ${dayStr}.`,
          });
        }
      }

      roomTotal = roomPricePerNight * roomNights * totalGuests;

      // Extra bed charge
      const extraBeds = totalGuests > room.maxGuests ? totalGuests - room.maxGuests : 0;
      if (extraBeds > 0 && room.extraBedAllowed) {
        roomTotal += extraBeds * room.extraBedPrice * roomNights;
      }
    }

    // ===== GRAND TOTAL =====
    const taxes = Math.round((tourTotal + roomTotal) * 0.10); // 10% tax
    const grandTotal = tourTotal + roomTotal + taxes;
    const depositPaid = Math.round(grandTotal * 0.20); // 20% deposit

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      bookingType,
      tour: tourId || null,
      tourTitle,
      tourStartDate,
      tourEndDate,
      destinations,
      hotel: hotelId || null,
      hotelName,
      room: roomId || null,
      roomType,
      checkInDate: checkInDate ? new Date(checkInDate) : null,
      checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
      totalNights: roomNights,
      pickupPoint: pickupPoint || null,
      dropOffPoint: dropOffPoint || null,
      guests,
      totalGuests,
      adultCount: adultGuests,
      childCount: childGuests,
      specialRequests,
      dietaryRequirements,
      paymentMethod: paymentMethod || "bank_transfer",
      priceBreakdown: {
        baseTourPrice: pricePerPerson * adultGuests,
        tourDiscount: tourDiscount * adultGuests,
        tourTotal,
        roomPricePerNight,
        roomNights,
        roomTotal,
        taxes,
        grandTotal,
        depositPaid,
        balanceDue: grandTotal - depositPaid,
        currency: "PKR",
      },
    });

    // Update available spots if tour booking
    if (tourStartDate && (bookingType === "tour_only" || bookingType === "tour_plus_hotel")) {
      await Tour.updateOne(
        {
          _id: tourId,
          "availableDates.startDate": { $lte: tourStartDate },
          "availableDates.endDate": { $gte: tourStartDate },
        },
        {
          $inc: { "availableDates.$.availableSpots": -totalGuests },
        }
      );
    }

    // Update room availability if hotel booking
    if (checkInDate && checkOutDate && (bookingType === "hotel_only" || bookingType === "tour_plus_hotel")) {
      const ci = new Date(checkInDate);
      const co = new Date(checkOutDate);
      for (let d = new Date(ci); d < co; d.setDate(d.getDate() + 1)) {
        await Room.updateOne(
          {
            _id: roomId,
            "availability.date": {
              $gte: new Date(d.toISOString().split("T")[0]),
              $lt: new Date(new Date(d.toISOString().split("T")[0]).getTime() + 86400000),
            },
          },
          {
            $inc: { "availability.$.bookedRooms": totalGuests },
          }
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: {
        bookingRef: booking.bookingRef,
        id: booking._id,
        bookingType: booking.bookingType,
        tourTitle: booking.tourTitle,
        hotelName: booking.hotelName,
        roomType: booking.roomType,
        pickupPoint: booking.pickupPoint,
        totalGuests: booking.totalGuests,
        priceBreakdown: booking.priceBreakdown,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Booking creation failed. Please try again.",
    });
  }
}

// GET /api/bookings - Get user's bookings (protected)
export async function getMyBookings(req, res) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort("-createdAt")
      .populate("tour", "title slug image")
      .populate("hotel", "name slug");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
    });
  }
}

// GET /api/bookings/:ref - Get booking by reference
export async function getBookingByRef(req, res) {
  try {
    const booking = await Booking.findOne({ bookingRef: req.params.ref })
      .populate("tour", "title slug image duration destinations")
      .populate("hotel", "name slug images")
      .populate("room", "type bedType images");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Check ownership or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role === "user") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking.",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking.",
    });
  }
}
