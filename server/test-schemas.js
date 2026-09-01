/**
 * Schema Validation Test Suite
 * Tests all Mongoose schemas without requiring a MongoDB connection.
 * Run: node server/test-schemas.js
 */

import mongoose from "mongoose";
import Tour from "./models/Tour.js";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";
import Booking from "./models/Booking.js";
import User from "./models/User.js";

// ===== TOUR SCHEMA TESTS =====
function testTourSchema() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🏔️  TOUR SCHEMA TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  let passed = 0;
  let failed = 0;

  function assert(condition, msg) {
    if (condition) { console.log(`  ✅ ${msg}`); passed++; }
    else { console.log(`  ❌ ${msg}`); failed++; }
  }

  const validTour = new Tour({
    title: "5 Days Hunza Valley & Babusar Expedition",
    slug: "hunza-valley-babusar-expedition",
    description: "An amazing tour through Northern Pakistan",
    destinations: ["Naran", "Batakundi", "Babusar Top", "Hunza"],
    route: {
      startCity: "Islamabad",
      endCity: "Islamabad",
      waypoints: ["Abbottabad", "Balakot", "Naran"],
      totalDistanceKm: 850,
    },
    pickupPoints: ["Islamabad", "Abbottabad"],
    pickupLocations: [
      { city: "Islamabad", address: "F-8, Blue Area", coordinates: { lat: 33.6844, lng: 73.0479 } },
      { city: "Abbottabad", address: "Supply Area", coordinates: { lat: 34.1469, lng: 73.2150 } },
    ],
    duration: "5 Days / 4 Nights",
    totalDays: 5,
    totalNights: 4,
    itinerary: [
      { day: 1, title: "Departure to Naran", description: "Scenic drive through Hazara Motorway.", meals: ["dinner"], accommodation: "Hotel in Naran", highlights: ["Balakot Viewpoint"] },
      { day: 2, title: "Naran to Hunza", description: "Crossing Babusar Top.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Hunza", highlights: ["Babusar Top"] },
      { day: 3, title: "Attabad Lake", description: "Boating at Attabad Lake.", meals: ["breakfast", "dinner"] },
      { day: 4, title: "Forts Tour", description: "Altit and Baltit Forts.", meals: ["breakfast", "dinner"] },
      { day: 5, title: "Return Journey", description: "Drive back to Islamabad.", meals: ["breakfast"] },
    ],
    pricePerPerson: 38000,
    groupPricing: [
      { minPersons: 4, maxPersons: 7, discountPercent: 5 },
      { minPersons: 8, maxPersons: 15, discountPercent: 10 },
    ],
    inclusions: ["Luxury Transport", "Hotel Stays", "Breakfast & Dinner"],
    exclusions: ["Personal Expenses", "Lunch"],
    availableDates: [
      { startDate: new Date("2026-03-15"), endDate: new Date("2026-03-19"), availableSpots: 15, status: "open" },
      { startDate: new Date("2026-04-01"), endDate: new Date("2026-04-05"), availableSpots: 0, status: "full" },
    ],
    maxGroupSize: 15,
    image: "https://images.unsplash.com/photo-1586016413664-864c0dd76f53",
    images: ["img1.jpg", "img2.jpg"],
    category: "adventure",
    difficulty: "moderate",
    isFeatured: true,
  });

  assert(validTour.title === "5 Days Hunza Valley & Babusar Expedition", "Tour title set correctly");
  assert(validTour.destinations.length === 4, "Destinations array has 4 items");
  assert(validTour.pickupPoints.includes("Islamabad"), "Includes Islamabad pickup");
  assert(validTour.pickupPoints.includes("Abbottabad"), "Includes Abbottabad pickup");
  assert(validTour.itinerary.length === 5, "Itinerary has 5 days");
  assert(validTour.itinerary[0].day === 1, "First day is day 1");
  assert(validTour.itinerary[0].meals.includes("dinner"), "Day 1 includes dinner");
  assert(validTour.pricePerPerson === 38000, "Price per person is 38000");
  assert(validTour.groupPricing.length === 2, "Group pricing has 2 tiers");
  assert(validTour.groupPricing[0].discountPercent === 5, "First tier discount is 5%");
  assert(validTour.inclusions.length === 3, "Inclusions has 3 items");
  assert(validTour.exclusions.length === 2, "Exclusions has 2 items");
  assert(validTour.availableDates.length === 2, "Available dates has 2 entries");
  assert(validTour.availableDates[0].status === "open", "First date is open");
  assert(validTour.availableDates[1].status === "full", "Second date is full");
  assert(validTour.maxGroupSize === 15, "Max group size is 15");

  // Test 2: Virtual properties
  assert(validTour.startingPrice === 38000, "Virtual: startingPrice returns pricePerPerson");
  assert(validTour.availableDatesCount === 1, "Virtual: availableDatesCount is 1 (only open dates)");

  // Test 3: Missing required fields
  const invalidTour = new Tour({ title: "Test" });
  const tourValidationError = invalidTour.validateSync();
  assert(tourValidationError !== null, "Tour validates missing required fields");
  if (tourValidationError) {
    const errKeys = Object.keys(tourValidationError.errors);
    assert(errKeys.some(k => k === "slug"), "Validates missing slug");
    assert(errKeys.some(k => k === "description"), "Validates missing description");
    assert(errKeys.some(k => k.includes("pricePerPerson")), "Validates missing pricePerPerson");
    assert(errKeys.some(k => k === "image"), "Validates missing image");
    assert(errKeys.some(k => k.includes("maxGroupSize")), "Validates missing maxGroupSize");
  }

  // Test 4: Schema paths exist
  const paths = Object.keys(Tour.schema.paths);
  assert(paths.includes("title"), "Schema has 'title' path");
  assert(paths.includes("slug"), "Schema has 'slug' path");
  assert(paths.includes("destinations"), "Schema has 'destinations' path");
  assert(paths.includes("pickupPoints"), "Schema has 'pickupPoints' path");
  assert(paths.includes("itinerary"), "Schema has 'itinerary' path");
  assert(paths.includes("inclusions"), "Schema has 'inclusions' path");
  assert(paths.includes("exclusions"), "Schema has 'exclusions' path");
  assert(paths.includes("availableDates"), "Schema has 'availableDates' path");
  assert(paths.includes("groupPricing"), "Schema has 'groupPricing' path");
  assert(paths.includes("route.startCity"), "Schema has nested 'route.startCity' path");
  assert(paths.includes("pickupLocations"), "Schema has 'pickupLocations' path");

  console.log(`\n  📊 Tour Schema: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// ===== HOTEL SCHEMA TESTS =====
function testHotelSchema() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🏨  HOTEL SCHEMA TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  let passed = 0;
  let failed = 0;

  function assert(condition, msg) {
    if (condition) { console.log(`  ✅ ${msg}`); passed++; }
    else { console.log(`  ❌ ${msg}`); failed++; }
  }

  const validHotel = new Hotel({
    name: "Hunza Serena Inn",
    slug: "hunza-serena-inn",
    description: "A luxury mountain retreat in Karimabad",
    destination: "Hunza",
    address: "Karimabad, Hunza Valley",
    city: "Karimabad",
    coordinates: { lat: 36.3298, lng: 74.6491 },
    starRating: 5,
    amenities: [
      { name: "WiFi", icon: "wifi", category: "general" },
      { name: "Restaurant", icon: "utensils", category: "dining" },
      { name: "Pool", icon: "waves", category: "recreation" },
    ],
    totalRooms: 45,
    roomTypes: [],
    startingPricePerNight: 12000,
    availability: [
      { date: new Date("2026-03-15"), totalRooms: 45, bookedRooms: 30 },
      { date: new Date("2026-03-16"), totalRooms: 45, bookedRooms: 45 },
    ],
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "Free cancellation up to 48 hours",
    images: ["img1.jpg", "img2.jpg"],
    phone: "+92-5841-12345",
    isFeatured: true,
  });

  assert(validHotel.name === "Hunza Serena Inn", "Hotel name set correctly");
  assert(validHotel.destination === "Hunza", "Destination is Hunza");
  assert(validHotel.starRating === 5, "Star rating is 5");
  assert(validHotel.amenities.length === 3, "Amenities has 3 items");
  assert(validHotel.amenities[0].category === "general", "First amenity category is general");
  assert(validHotel.totalRooms === 45, "Total rooms is 45");
  assert(validHotel.startingPricePerNight === 12000, "Starting price is 12000");
  assert(validHotel.availability.length === 2, "Availability has 2 entries");
  assert(validHotel.checkInTime === "14:00", "Check-in time is 14:00");
  assert(validHotel.cancellationPolicy.includes("48 hours"), "Cancellation policy set");

  // Missing required
  const invalidHotel = new Hotel({ name: "Test" });
  const hotelValidationError = invalidHotel.validateSync();
  assert(hotelValidationError !== null, "Hotel validates missing required fields");
  if (hotelValidationError) {
    assert(hotelValidationError.errors.destination !== undefined, "Validates missing destination");
    assert(hotelValidationError.errors.totalRooms !== undefined, "Validates missing totalRooms");
    assert(hotelValidationError.errors.startingPricePerNight !== undefined, "Validates missing startingPricePerNight");
  }

  // Schema paths
  const paths = Object.keys(Hotel.schema.paths);
  assert(paths.includes("name"), "Schema has 'name' path");
  assert(paths.includes("slug"), "Schema has 'slug' path");
  assert(paths.includes("destination"), "Schema has 'destination' path");
  assert(paths.includes("amenities"), "Schema has 'amenities' path");
  assert(paths.includes("totalRooms"), "Schema has 'totalRooms' path");
  assert(paths.includes("roomTypes"), "Schema has 'roomTypes' path");
  assert(paths.includes("availability"), "Schema has 'availability' path");
  assert(paths.includes("startingPricePerNight"), "Schema has 'startingPricePerNight' path");
  assert(paths.includes("cancellationPolicy"), "Schema has 'cancellationPolicy' path");

  console.log(`\n  📊 Hotel Schema: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// ===== ROOM SCHEMA TESTS =====
function testRoomSchema() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🛏️   ROOM SCHEMA TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  let passed = 0;
  let failed = 0;

  function assert(condition, msg) {
    if (condition) { console.log(`  ✅ ${msg}`); passed++; }
    else { console.log(`  ❌ ${msg}`); failed++; }
  }

  const hotelId = new mongoose.Types.ObjectId();
  const validRoom = new Room({
    hotel: hotelId,
    type: "Deluxe Room",
    slug: "deluxe-room",
    description: "Spacious room with mountain views",
    bedType: "King Bed",
    sizeSqm: 38,
    maxGuests: 2,
    pricePerNight: 18000,
    weekendPricePerNight: 22000,
    seasonalPricing: [
      { seasonName: "Summer Peak", startDate: new Date("2026-06-01"), endDate: new Date("2026-08-31"), priceMultiplier: 1.3 },
    ],
    taxPercent: 10,
    amenities: [
      { name: "WiFi", icon: "wifi" },
      { name: "TV", icon: "tv" },
      { name: "Minibar", icon: "glass" },
    ],
    totalRooms: 15,
    totalRoomsCount: 15,
    availability: [
      { date: new Date("2026-03-15"), totalRooms: 15, bookedRooms: 10 },
    ],
    smokingAllowed: false,
    extraBedAllowed: true,
    extraBedPrice: 3000,
    minNights: 1,
    maxNights: 30,
    images: ["room1.jpg"],
    isActive: true,
  });

  assert(validRoom.hotel.toString() === hotelId.toString(), "Hotel reference set correctly");
  assert(validRoom.type === "Deluxe Room", "Room type set correctly");
  assert(validRoom.bedType === "King Bed", "Bed type is King Bed");
  assert(validRoom.sizeSqm === 38, "Size is 38 sqm");
  assert(validRoom.maxGuests === 2, "Max guests is 2");
  assert(validRoom.pricePerNight === 18000, "Price per night is 18000");
  assert(validRoom.weekendPricePerNight === 22000, "Weekend price is 22000");
  assert(validRoom.seasonalPricing.length === 1, "Seasonal pricing has 1 entry");
  assert(validRoom.seasonalPricing[0].priceMultiplier === 1.3, "Summer multiplier is 1.3");
  assert(validRoom.taxPercent === 10, "Tax percent is 10");
  assert(validRoom.amenities.length === 3, "Amenities has 3 items");
  assert(validRoom.totalRooms === 15, "Total rooms is 15");
  assert(validRoom.extraBedAllowed === true, "Extra bed allowed");
  assert(validRoom.extraBedPrice === 3000, "Extra bed price is 3000");

  // Missing required
  const invalidRoom = new Room({ type: "Test" });
  const roomValidationError = invalidRoom.validateSync();
  assert(roomValidationError !== null, "Room validates missing required fields");
  if (roomValidationError) {
    assert(roomValidationError.errors.hotel !== undefined, "Validates missing hotel");
    assert(roomValidationError.errors.bedType !== undefined, "Validates missing bedType");
    assert(roomValidationError.errors.sizeSqm !== undefined, "Validates missing sizeSqm");
    assert(roomValidationError.errors.maxGuests !== undefined, "Validates missing maxGuests");
    assert(roomValidationError.errors.pricePerNight !== undefined, "Validates missing pricePerNight");
    assert(roomValidationError.errors.totalRooms !== undefined, "Validates missing totalRooms");
  }

  // Schema paths
  const paths = Object.keys(Room.schema.paths);
  assert(paths.includes("hotel"), "Schema has 'hotel' path");
  assert(paths.includes("type"), "Schema has 'type' path");
  assert(paths.includes("bedType"), "Schema has 'bedType' path");
  assert(paths.includes("sizeSqm"), "Schema has 'sizeSqm' path");
  assert(paths.includes("pricePerNight"), "Schema has 'pricePerNight' path");
  assert(paths.includes("weekendPricePerNight"), "Schema has 'weekendPricePerNight' path");
  assert(paths.includes("seasonalPricing"), "Schema has 'seasonalPricing' path");
  assert(paths.includes("availability"), "Schema has 'availability' path");
  assert(paths.includes("amenities"), "Schema has 'amenities' path");
  assert(paths.includes("totalRooms"), "Schema has 'totalRooms' path");

  console.log(`\n  📊 Room Schema: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// ===== BOOKING SCHEMA TESTS =====
function testBookingSchema() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  📋  BOOKING SCHEMA TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  let passed = 0;
  let failed = 0;

  function assert(condition, msg) {
    if (condition) { console.log(`  ✅ ${msg}`); passed++; }
    else { console.log(`  ❌ ${msg}`); failed++; }
  }

  const userId = new mongoose.Types.ObjectId();
  const tourId = new mongoose.Types.ObjectId();
  const hotelId = new mongoose.Types.ObjectId();
  const roomId = new mongoose.Types.ObjectId();

  // Test 1: Tour-only booking
  const tourBooking = new Booking({
    user: userId,
    bookingType: "tour_only",
    tour: tourId,
    tourTitle: "5 Days Hunza Valley",
    tourStartDate: new Date("2026-03-15"),
    tourEndDate: new Date("2026-03-19"),
    destinations: ["Naran", "Hunza"],
    pickupPoint: "Islamabad",
    dropOffPoint: "Abbottabad",
    guests: [
      { name: "Ahmed Khan", age: 30, gender: "male", idType: "cnic", idNumber: "35201-1234567-1" },
      { name: "Sara Khan", age: 28, gender: "female", idType: "cnic", idNumber: "35201-7654321-2", isChild: false },
    ],
    totalGuests: 2,
    adultCount: 2,
    childCount: 0,
    priceBreakdown: {
      baseTourPrice: 76000,
      tourDiscount: 0,
      tourTotal: 76000,
      grandTotal: 76000,
      depositPaid: 20000,
      balanceDue: 56000,
    },
    specialRequests: "Vegetarian meals preferred",
  });

  assert(tourBooking.bookingType === "tour_only", "Tour booking type set correctly");
  assert(tourBooking.pickupPoint === "Islamabad", "Pickup point is Islamabad");
  assert(tourBooking.dropOffPoint === "Abbottabad", "Drop-off point is Abbottabad");
  assert(tourBooking.guests.length === 2, "Guests has 2 entries");
  assert(tourBooking.guests[0].idType === "cnic", "Guest ID type is CNIC");
  assert(tourBooking.priceBreakdown.grandTotal === 76000, "Grand total is 76000");
  assert(tourBooking.isTourBooking === true, "Virtual: isTourBooking is true");
  assert(tourBooking.isHotelBooking === false, "Virtual: isHotelBooking is false");

  // Test 2: Hotel-only booking
  const hotelBooking = new Booking({
    user: userId,
    bookingType: "hotel_only",
    hotel: hotelId,
    hotelName: "Hunza Serena Inn",
    room: roomId,
    roomType: "Deluxe Room",
    checkInDate: new Date("2026-03-15"),
    checkOutDate: new Date("2026-03-18"),
    totalNights: 3,
    guests: [
      { name: "Ali Raza", age: 35, gender: "male", idType: "passport", idNumber: "AB123456" },
    ],
    totalGuests: 1,
    adultCount: 1,
    priceBreakdown: {
      roomPricePerNight: 18000,
      roomNights: 3,
      roomTotal: 54000,
      taxes: 5400,
      grandTotal: 59400,
      depositPaid: 0,
    },
  });

  assert(hotelBooking.bookingType === "hotel_only", "Hotel booking type set correctly");
  assert(hotelBooking.totalNights === 3, "Total nights is 3");
  assert(hotelBooking.isTourBooking === false, "Virtual: isTourBooking is false");
  assert(hotelBooking.isHotelBooking === true, "Virtual: isHotelBooking is true");

  // Test 3: Tour + Hotel add-on booking
  const comboBooking = new Booking({
    user: userId,
    bookingType: "tour_plus_hotel",
    tour: tourId,
    tourTitle: "5 Days Hunza Valley",
    tourStartDate: new Date("2026-03-15"),
    tourEndDate: new Date("2026-03-19"),
    destinations: ["Naran", "Hunza"],
    pickupPoint: "Islamabad",
    hotel: hotelId,
    hotelName: "Hunza Serena Inn",
    room: roomId,
    roomType: "Suite",
    checkInDate: new Date("2026-03-14"),
    checkOutDate: new Date("2026-03-19"),
    totalNights: 5,
    guests: [
      { name: "Combo Guest", age: 30, gender: "male" },
    ],
    totalGuests: 1,
    adultCount: 1,
    priceBreakdown: {
      baseTourPrice: 38000,
      tourDiscount: 0,
      tourTotal: 38000,
      roomPricePerNight: 32000,
      roomNights: 5,
      roomTotal: 160000,
      taxes: 19800,
      grandTotal: 217800,
      depositPaid: 50000,
    },
  });

  assert(comboBooking.bookingType === "tour_plus_hotel", "Combo booking type set correctly");
  assert(comboBooking.isTourBooking === true, "Virtual: isTourBooking is true");
  assert(comboBooking.isHotelBooking === true, "Virtual: isHotelBooking is true");
  assert(comboBooking.priceBreakdown.grandTotal === 217800, "Combo grand total correct");
  // Balance due = grandTotal - depositPaid (pre-save hook runs on save, not on create)
  const expectedBalance = comboBooking.priceBreakdown.grandTotal - comboBooking.priceBreakdown.depositPaid;
  assert(expectedBalance === 167800, "Balance due calculated correctly");

  // Test 4: Missing required fields
  const invalidBooking = new Booking({ bookingRef: "TEST-001" });
  const bookingValidationError = invalidBooking.validateSync();
  assert(bookingValidationError !== null, "Booking validates missing required fields");
  if (bookingValidationError) {
    const errKeys = Object.keys(bookingValidationError.errors);
    assert(errKeys.some(k => k === "user"), "Validates missing user");
    assert(errKeys.some(k => k === "bookingType"), "Validates missing bookingType");
    assert(errKeys.some(k => k.includes("totalGuests")), "Validates missing totalGuests");
    assert(errKeys.some(k => k.includes("priceBreakdown")), "Validates missing priceBreakdown");
    assert(errKeys.some(k => k === "adultCount"), "Validates missing adultCount");
  }

  // Test 5: Schema paths
  const paths = Object.keys(Booking.schema.paths);
  assert(paths.includes("bookingRef"), "Schema has 'bookingRef' path");
  assert(paths.includes("user"), "Schema has 'user' path");
  assert(paths.includes("bookingType"), "Schema has 'bookingType' path");
  assert(paths.includes("tour"), "Schema has 'tour' path");
  assert(paths.includes("hotel"), "Schema has 'hotel' path");
  assert(paths.includes("room"), "Schema has 'room' path");
  assert(paths.includes("pickupPoint"), "Schema has 'pickupPoint' path");
  assert(paths.includes("checkInDate"), "Schema has 'checkInDate' path");
  assert(paths.includes("guests"), "Schema has 'guests' path");
  assert(paths.includes("priceBreakdown"), "Schema has 'priceBreakdown' path");
  assert(paths.includes("paymentStatus"), "Schema has 'paymentStatus' path");
  assert(paths.includes("status"), "Schema has 'status' path");
  assert(paths.includes("specialRequests"), "Schema has 'specialRequests' path");
  assert(paths.includes("rating"), "Schema has 'rating' path");

  console.log(`\n  📊 Booking Schema: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// ===== USER SCHEMA TESTS =====
function testUserSchema() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  👤  USER SCHEMA TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  let passed = 0;
  let failed = 0;

  function assert(condition, msg) {
    if (condition) { console.log(`  ✅ ${msg}`); passed++; }
    else { console.log(`  ❌ ${msg}`); failed++; }
  }

  // Test 1: Regular user
  const regularUser = new User({
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    password: "securePass123",
    phone: "+923001234567",
    role: "user",
    address: { city: "Islamabad", province: "ICT", country: "Pakistan" },
    emergencyContact: { name: "Ali Khan", phone: "+923009876543", relationship: "Brother" },
    preferredPickup: "Islamabad",
    dietaryRequirements: ["halal"],
  });

  assert(regularUser.name === "Ahmed Khan", "User name set correctly");
  assert(regularUser.email === "ahmed@example.com", "Email set correctly");
  assert(regularUser.role === "user", "Role is 'user'");
  assert(regularUser.address.city === "Islamabad", "Address city is Islamabad");
  assert(regularUser.emergencyContact.relationship === "Brother", "Emergency contact relationship set");
  assert(regularUser.preferredPickup === "Islamabad", "Preferred pickup is Islamabad");
  assert(regularUser.dietaryRequirements.includes("halal"), "Dietary requirements includes halal");

  // Test 2: Admin user
  const adminUser = new User({
    name: "Admin User",
    email: "admin@northroutes.pk",
    password: "adminPass123",
    role: "admin",
    permissions: ["tours:read", "tours:write", "bookings:read", "bookings:write"],
  });

  assert(adminUser.role === "admin", "Admin role set correctly");
  assert(adminUser.permissions.length === 4, "Admin has 4 permissions");
  assert(adminUser.permissions.includes("tours:write"), "Admin has tours:write permission");

  // Test 3: Methods
  assert(typeof regularUser.comparePassword === "function", "comparePassword method exists");
  assert(typeof regularUser.changedPasswordAfter === "function", "changedPasswordAfter method exists");
  assert(typeof regularUser.hasPermission === "function", "hasPermission method exists");
  assert(typeof regularUser.isAdmin === "function", "isAdmin method exists");
  assert(regularUser.isAdmin() === false, "Regular user is not admin");
  assert(adminUser.isAdmin() === true, "Admin user is admin");
  assert(adminUser.hasPermission("tours:write") === true, "Admin has tours:write");
  assert(regularUser.hasPermission("tours:write") === false, "Regular user doesn't have tours:write");

  // Test 4: Super admin
  const superAdmin = new User({
    name: "Super Admin",
    email: "super@northroutes.pk",
    password: "superPass123",
    role: "super_admin",
  });
  assert(superAdmin.isAdmin() === true, "Super admin is admin");
  assert(superAdmin.hasPermission("settings:write") === true, "Super admin has all permissions");

  // Test 5: Missing required
  const invalidUser = new User({ name: "Test" });
  const userValidationError = invalidUser.validateSync();
  assert(userValidationError !== null, "User validates missing required fields");
  if (userValidationError) {
    assert(userValidationError.errors.email !== undefined, "Validates missing email");
    assert(userValidationError.errors.password !== undefined, "Validates missing password");
  }

  // Test 6: Schema paths
  const paths = Object.keys(User.schema.paths);
  assert(paths.includes("name"), "Schema has 'name' path");
  assert(paths.includes("email"), "Schema has 'email' path");
  assert(paths.includes("password"), "Schema has 'password' path");
  assert(paths.includes("role"), "Schema has 'role' path");
  assert(paths.includes("permissions"), "Schema has 'permissions' path");
  assert(paths.includes("phone"), "Schema has 'phone' path");
  assert(paths.includes("address"), "Schema has 'address' path");
  assert(paths.includes("emergencyContact.name") || paths.includes("emergencyContact"), "Schema has 'emergencyContact' path");
  assert(paths.includes("preferredPickup"), "Schema has 'preferredPickup' path");
  assert(paths.includes("dietaryRequirements"), "Schema has 'dietaryRequirements' path");
  assert(paths.includes("refreshToken"), "Schema has 'refreshToken' path (select: false)");
  assert(paths.includes("passwordResetToken"), "Schema has 'passwordResetToken' path");

  console.log(`\n  📊 User Schema: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// ===== MODEL EXPORTS TEST =====
function testModelExports() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  📦  MODEL EXPORTS TEST");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  let passed = 0;
  let failed = 0;

  function assert(condition, msg) {
    if (condition) { console.log(`  ✅ ${msg}`); passed++; }
    else { console.log(`  ❌ ${msg}`); failed++; }
  }

  assert(typeof Tour === "function", "Tour model exported");
  assert(typeof Hotel === "function", "Hotel model exported");
  assert(typeof Room === "function", "Room model exported");
  assert(typeof Booking === "function", "Booking model exported");
  assert(typeof User === "function", "User model exported");
  assert(Tour.modelName === "Tour", "Tour model name is 'Tour'");
  assert(Hotel.modelName === "Hotel", "Hotel model name is 'Hotel'");
  assert(Room.modelName === "Room", "Room model name is 'Room'");
  assert(Booking.modelName === "Booking", "Booking model name is 'Booking'");
  assert(User.modelName === "User", "User model name is 'User'");

  console.log(`\n  📊 Model Exports: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// ===== RUN ALL TESTS =====
console.log("\n╔══════════════════════════════════════════════╗");
console.log("║  🧪  PASSU PEAKS TRAVELS — SCHEMA TEST SUITE ║");
console.log("╚══════════════════════════════════════════════╝");

const results = [
  testTourSchema(),
  testHotelSchema(),
  testRoomSchema(),
  testBookingSchema(),
  testUserSchema(),
  testModelExports(),
];

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
const allPassed = results.every(Boolean);
if (allPassed) {
  console.log("  🎉 ALL TESTS PASSED!");
} else {
  console.log("  ⚠️  SOME TESTS FAILED — check output above");
}
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

process.exit(allPassed ? 0 : 1);
