import Tour from "../models/Tour.js";

// GET /api/tours - List tours with filters
export async function getTours(req, res) {
  try {
    const {
      destination,
      pickup,
      budget,
      date,
      category,
      difficulty,
      search,
      sort = "-createdAt",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { isActive: true };

    // Filter by destination
    if (destination && destination !== "All Destinations") {
      filter.destinations = { $in: [destination] };
    }

    // Filter by pickup point
    if (pickup && pickup !== "All Pickup Points") {
      filter.pickupPoints = { $in: [pickup] };
    }

    // Filter by budget range
    if (budget) {
      const ranges = {
        "under-25000": { $lt: 25000 },
        "25000-35000": { $gte: 25000, $lte: 35000 },
        "35000-50000": { $gte: 35000, $lte: 50000 },
        "above-50000": { $gt: 50000 },
      };
      if (ranges[budget]) {
        filter.pricePerPerson = ranges[budget];
      }
    }

    // Filter by available date
    if (date) {
      const targetDate = new Date(date);
      filter.availableDates = {
        $elemMatch: {
          startDate: { $lte: targetDate },
          endDate: { $gte: targetDate },
          status: "open",
          availableSpots: { $gt: 0 },
        },
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by difficulty
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Search by title or destinations
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { destinations: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalTours = await Tour.countDocuments(filter);
    const tours = await Tour.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: tours.length,
      total: totalTours,
      totalPages: Math.ceil(totalTours / parseInt(limit)),
      currentPage: parseInt(page),
      data: tours,
    });
  } catch (error) {
    console.error("Get tours error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tours.",
    });
  }
}

// GET /api/tours/:slug - Get single tour by slug
export async function getTourBySlug(req, res) {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug, isActive: true });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    console.error("Get tour error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tour.",
    });
  }
}

// GET /api/tours/:slug/availability - Check available dates for a tour
export async function getTourAvailability(req, res) {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug, isActive: true });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found.",
      });
    }

    const availableDates = tour.availableDates.filter(
      (d) => d.status === "open" && d.availableSpots > 0
    );

    res.status(200).json({
      success: true,
      tourId: tour._id,
      tourTitle: tour.title,
      maxGroupSize: tour.maxGroupSize,
      availableDates,
    });
  } catch (error) {
    console.error("Get availability error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check availability.",
    });
  }
}

// POST /api/tours - Create a new tour (admin)
export async function createTour(req, res) {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      success: true,
      message: "Tour created successfully.",
      data: tour,
    });
  } catch (error) {
    console.error("Create tour error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create tour.",
    });
  }
}

// PUT /api/tours/:id - Update a tour (admin)
export async function updateTour(req, res) {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found." });
    }
    res.status(200).json({
      success: true,
      message: "Tour updated successfully.",
      data: tour,
    });
  } catch (error) {
    console.error("Update tour error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update tour.",
    });
  }
}

// DELETE /api/tours/:id - Delete a tour (admin)
export async function deleteTour(req, res) {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found." });
    }
    res.status(200).json({
      success: true,
      message: "Tour deleted successfully.",
    });
  } catch (error) {
    console.error("Delete tour error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete tour.",
    });
  }
}
