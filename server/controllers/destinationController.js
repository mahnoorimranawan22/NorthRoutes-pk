import Destination from "../models/Destination.js";

// GET /api/destinations - List all destinations with filters
export async function getDestinations(req, res) {
  try {
    const {
      search,
      province,
      category,
      bestSeason,
      featured,
      sort = "-createdAt",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (province) filter.province = province;
    if (category) filter.category = category;
    if (bestSeason) filter.bestSeason = bestSeason;
    if (featured === "true") filter.isFeatured = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Destination.countDocuments(filter);
    const destinations = await Destination.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: destinations.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: destinations,
    });
  } catch (error) {
    console.error("Get destinations error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch destinations." });
  }
}

// GET /api/destinations/:id - Get single destination
export async function getDestinationById(req, res) {
  try {
    const destination = await Destination.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isActive: true,
    });

    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found." });
    }

    res.status(200).json({ success: true, data: destination });
  } catch (error) {
    console.error("Get destination error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch destination." });
  }
}

// POST /api/destinations - Create destination (admin)
export async function createDestination(req, res) {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({
      success: true,
      message: "Destination created successfully.",
      data: destination,
    });
  } catch (error) {
    console.error("Create destination error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create destination.",
    });
  }
}

// PUT /api/destinations/:id - Update destination (admin)
export async function updateDestination(req, res) {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found." });
    }
    res.status(200).json({
      success: true,
      message: "Destination updated successfully.",
      data: destination,
    });
  } catch (error) {
    console.error("Update destination error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update destination.",
    });
  }
}

// DELETE /api/destinations/:id - Delete destination (admin)
export async function deleteDestination(req, res) {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found." });
    }
    res.status(200).json({ success: true, message: "Destination deleted successfully." });
  } catch (error) {
    console.error("Delete destination error:", error);
    res.status(500).json({ success: false, message: "Failed to delete destination." });
  }
}

// POST /api/destinations/:id/favorite - Toggle favorite
export async function toggleFavorite(req, res) {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found." });
    }

    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user._id);

    const alreadyFavorited = user.favorites.some(
      (fav) => fav.toString() === req.params.id
    );

    if (alreadyFavorited) {
      user.favorites = user.favorites.filter(
        (fav) => fav.toString() !== req.params.id
      );
      await user.save({ validateBeforeSave: false });
      return res.status(200).json({
        success: true,
        message: "Removed from favorites.",
        data: { isFavorited: false },
      });
    } else {
      user.favorites.push(req.params.id);
      await user.save({ validateBeforeSave: false });
      return res.status(200).json({
        success: true,
        message: "Added to favorites.",
        data: { isFavorited: true },
      });
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({ success: false, message: "Failed to update favorites." });
  }
}

// GET /api/users/favorites - Get user's favorite destinations
export async function getFavorites(req, res) {
  try {
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user._id).populate("favorites");
    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch favorites." });
  }
}
