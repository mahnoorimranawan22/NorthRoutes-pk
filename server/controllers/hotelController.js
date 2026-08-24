import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// GET /api/hotels - List hotels with filters
export async function getHotels(req, res) {
  try {
    const {
      destination,
      starRating,
      minPrice,
      maxPrice,
      amenities,
      sort = "-rating",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { isActive: true };

    if (destination) {
      filter.destination = destination;
    }

    if (starRating) {
      filter.starRating = parseInt(starRating);
    }

    if (minPrice || maxPrice) {
      filter.startingPricePerNight = {};
      if (minPrice) filter.startingPricePerNight.$gte = parseInt(minPrice);
      if (maxPrice) filter.startingPricePerNight.$lte = parseInt(maxPrice);
    }

    if (amenities) {
      const amenityList = amenities.split(",");
      filter["amenities.name"] = { $all: amenityList };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalHotels = await Hotel.countDocuments(filter);
    const hotels = await Hotel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: hotels.length,
      total: totalHotels,
      totalPages: Math.ceil(totalHotels / parseInt(limit)),
      currentPage: parseInt(page),
      data: hotels,
    });
  } catch (error) {
    console.error("Get hotels error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels.",
    });
  }
}

// GET /api/hotels/:id - Get hotel with rooms
export async function getHotelById(req, res) {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found.",
      });
    }

    // Fetch room types for this hotel
    const rooms = await Room.find({ hotel: hotel._id, isActive: true }).sort("pricePerNight");

    res.status(200).json({
      success: true,
      data: {
        ...hotel.toObject(),
        rooms,
      },
    });
  } catch (error) {
    console.error("Get hotel error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotel.",
    });
  }
}

// GET /api/hotels/:id/availability - Check room availability
export async function getHotelAvailability(req, res) {
  try {
    const { checkIn, checkOut } = req.query;

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found.",
      });
    }

    const rooms = await Room.find({ hotel: hotel._id, isActive: true });

    // Check availability for each room type
    const availableRooms = rooms.map((room) => {
      let available = true;

      if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Check each night
        for (let d = new Date(checkInDate); d < checkOutDate; d.setDate(d.getDate() + 1)) {
          const dayStr = d.toISOString().split("T")[0];
          const dayAvail = room.availability.find(
            (a) => a.date.toISOString().split("T")[0] === dayStr
          );
          if (dayAvail && dayAvail.bookedRooms >= dayAvail.totalRooms) {
            available = false;
            break;
          }
        }
      }

      const nights = checkIn && checkOut
        ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
        : 1;

      return {
        id: room._id,
        type: room.type,
        bedType: room.bedType,
        sizeSqm: room.sizeSqm,
        maxGuests: room.maxGuests,
        pricePerNight: room.pricePerNight,
        totalPrice: room.pricePerNight * nights,
        amenities: room.amenities,
        images: room.images,
        available,
        nights,
      };
    });

    res.status(200).json({
      success: true,
      hotelId: hotel._id,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      rooms: availableRooms,
    });
  } catch (error) {
    console.error("Get availability error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check availability.",
    });
  }
}
