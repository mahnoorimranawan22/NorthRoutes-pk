import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Models
import User from "./models/User.js";
import Destination from "./models/Destination.js";
import Tour from "./models/Tour.js";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/northroutes-pk";

// ===== DESTINATIONS DATA =====
const destinations = [
  {
    name: "Hunza Valley",
    slug: "hunza-valley",
    location: "Gilgit-Baltistan",
    province: "Gilgit-Baltistan",
    description: "Hunza Valley is a breathtaking mountain valley in the Gilgit-Baltistan region of Pakistan. Known for its stunning views of snow-capped peaks, ancient forts, and turquoise lakes, Hunza offers an unparalleled travel experience. The valley is home to the legendary Baltit and Altit Forts, and the warm hospitality of the Burusho people makes every visit unforgettable.",
    shortDescription: "A breathtaking mountain valley with ancient forts, turquoise lakes, and warm hospitality in Gilgit-Baltistan.",
    images: [
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200"
    ],
    coverImage: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200",
    activities: ["Trekking", "Hiking", "Photography", "Cultural Tours", "Boating", "Fort Visits"],
    bestSeason: "Summer",
    altitude: "2,438 meters",
    climate: "Cold desert, dry summers and harsh winters",
    category: "valley",
    rating: 4.9,
    reviewCount: 0,
    howToReach: {
      fromIslamabad: "Fly to Gilgit or drive via Karakoram Highway (12-14 hours)",
      fromAbbottabad: "Drive via Karakoram Highway through Besham (10-12 hours)",
      totalDistanceKm: 620,
      travelTimeHours: 12,
    },
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Skardu",
    slug: "skardu",
    location: "Gilgit-Baltistan",
    province: "Gilgit-Baltistan",
    description: "Skardu is the gateway to the world's highest peaks, including K2. This stunning valley in Gilgit-Baltistan offers dramatic landscapes with turquoise lakes, towering mountains, and ancient Buddhist rock carvings. Shangrila Resort, Lower Kachura Lake, and the mighty Indus River make Skardu a must-visit destination for adventure seekers and nature lovers alike.",
    shortDescription: "Gateway to K2 and the world's highest peaks, with turquoise lakes and dramatic mountain landscapes.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200"
    ],
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200",
    activities: ["Trekking", "Rock Climbing", "Boating", "Photography", "Camping", "Mountaineering"],
    bestSeason: "Summer",
    altitude: "2,228 meters",
    climate: "Cold desert with hot summers and freezing winters",
    category: "mountain",
    rating: 4.8,
    reviewCount: 0,
    howToReach: {
      fromIslamabad: "Fly to Skardu (1.5 hours) or drive via Karakoram Highway (24 hours)",
      fromAbbottabad: "Drive via Chilas and Karakoram Highway (18-20 hours)",
      totalDistanceKm: 480,
      travelTimeHours: 18,
    },
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Naran",
    slug: "naran",
    location: "Kaghan Valley",
    province: "Khyber Pakhtunkhwa",
    description: "Naran is the jewel of Kaghan Valley, nestled along the banks of the Kunhar River at an altitude of 2,400 meters. Famous for the mystical Lake Saif-ul-Malook, lush green meadows, and cool mountain air, Naran is Pakistan's most popular hill station. The area offers easy access to Babusar Top, Lake Lulusar, and countless waterfalls.",
    shortDescription: "The jewel of Kaghan Valley with mystical Lake Saif-ul-Malook and lush green meadows.",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200"
    ],
    coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200",
    activities: ["Boating", "Fishing", "Hiking", "Photography", "Camping", "Horse Riding"],
    bestSeason: "Summer",
    altitude: "2,400 meters",
    climate: "Cool summers, heavy snowfall in winter",
    category: "lake",
    rating: 4.7,
    reviewCount: 0,
    howToReach: {
      fromIslamabad: "Drive via Murree and Mansehra (6-7 hours)",
      fromAbbottabad: "Drive via Balakot (4-5 hours)",
      totalDistanceKm: 270,
      travelTimeHours: 6,
    },
    isFeatured: true,
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Babusar Top",
    slug: "babusar-top",
    location: "Kaghan-Diamer District",
    province: "Khyber Pakhtunkhwa",
    description: "Babusar Top is a high mountain pass at 4,173 meters connecting Kaghan Valley to Chilas and the Karakoram Highway. The journey to Babusar Top is one of the most scenic drives in Pakistan, offering panoramic views of Nanga Parbat, lush alpine meadows, and pristine mountain streams. Snow-capped peaks surround the pass even in summer months.",
    shortDescription: "A stunning mountain pass at 4,173m with panoramic views of Nanga Parbat and alpine meadows.",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200"
    ],
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
    activities: ["Mountain Pass Crossing", "Photography", "Trekking", "Sightseeing"],
    bestSeason: "Summer",
    altitude: "4,173 meters",
    climate: "Alpine, cold even in summer, closed in winter due to snow",
    category: "mountain",
    rating: 4.8,
    reviewCount: 0,
    howToReach: {
      fromIslamabad: "Drive via Naran and Kiwai (8-9 hours)",
      fromAbbottabad: "Drive via Balakot and Naran (6-7 hours)",
      totalDistanceKm: 350,
      travelTimeHours: 8,
    },
    isFeatured: true,
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Fairy Meadows",
    slug: "fairy-meadows",
    location: "Diamer District",
    province: "Gilgit-Baltistan",
    description: "Fairy Meadows is a lush green alpine meadow at the base of Nanga Parbat (8,126m), the world's ninth-highest mountain. Accessible only by a thrilling jeep ride and a 3-hour trek, this remote paradise offers unobstructed views of the massive Rupal Face of Nanga Parbat. The meadow is dotted with wooden cottages and offers some of the best stargazing in Pakistan.",
    shortDescription: "A lush alpine meadow at the base of Nanga Parbat, accessible only by jeep and trek.",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200"
    ],
    coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200",
    activities: ["Trekking", "Camping", "Stargazing", "Photography", "Nanga Parbat Base Camp Trek"],
    bestSeason: "Summer",
    altitude: "3,300 meters",
    climate: "Alpine, pleasant summers, heavy snowfall in winter",
    category: "adventure",
    rating: 4.9,
    reviewCount: 0,
    howToReach: {
      fromIslamabad: "Drive to Chilas (12 hours), then jeep to Tato village (2 hours), trek 3 hours",
      fromAbbottabad: "Drive via Karakoram Highway to Chilas (10 hours), then jeep and trek",
      totalDistanceKm: 400,
      travelTimeHours: 16,
    },
    isFeatured: true,
    isActive: true,
    sortOrder: 5,
  },
  {
    name: "Swat Valley",
    slug: "swat-valley",
    location: "Swat District",
    province: "Khyber Pakhtunkhwa",
    description: "Swat Valley, known as the 'Switzerland of Pakistan', is a picturesque valley in Khyber Pakhtunkhwa famous for its lush green hills, crystal-clear rivers, and ancient Buddhist ruins. Malam Jabba ski resort, Kalam Valley, and the ancient city of Mingora offer diverse experiences ranging from adventure sports to cultural exploration.",
    shortDescription: "The 'Switzerland of Pakistan' with lush green hills, crystal-clear rivers, and ancient Buddhist ruins.",
    images: [
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200"
    ],
    coverImage: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200",
    activities: ["Skiing", "Trekking", "Fishing", "Cultural Tours", "Hiking", "Sightseeing"],
    bestSeason: "All Year",
    altitude: "975 meters (Mingora)",
    climate: "Pleasant summers, cold winters with snowfall at higher altitudes",
    category: "valley",
    rating: 4.6,
    reviewCount: 0,
    howToReach: {
      fromIslamabad: "Drive via Mardan and Mingora (4-5 hours)",
      fromAbbottabad: "Drive via Mansehra and Mingora (3-4 hours)",
      totalDistanceKm: 250,
      travelTimeHours: 4,
    },
    isFeatured: true,
    isActive: true,
    sortOrder: 6,
  },
  {
    name: "Murree",
    slug: "murree",
    location: "Rawalpindi District",
    province: "Punjab",
    description: "Murree is Pakistan's most accessible and popular hill station, perched at 2,170 meters in the Pir Panjal Range. With its colonial-era architecture, pine-covered hills, and panoramic views of the Kashmir Valley, Murree offers a perfect weekend getaway. The famous Mall Road, Patriata Chairlift, and Ayubia National Park make it ideal for families.",
    shortDescription: "Pakistan's most popular hill station with colonial charm, pine forests, and family-friendly attractions.",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200"
    ],
    coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200",
    activities: ["Sightseeing", "Horse Riding", "Chairlift", "Shopping", "Hiking"],
    bestSeason: "All Year",
    altitude: "2,170 meters",
    climate: "Cool summers, cold and snowy winters",
    category: "valley",
    rating: 4.4,
    reviewCount: 0,
    howToReach: {
      fromIslamabad: "Drive via Murree Expressway (1.5-2 hours)",
      fromAbbottabad: "Drive via Mansehra and Murree Expressway (2-3 hours)",
      totalDistanceKm: 70,
      travelTimeHours: 2,
    },
    isFeatured: false,
    isActive: true,
    sortOrder: 7,
  },
  {
    name: "Neelum Valley",
    slug: "neelum-valley",
    location: "Neelum District",
    province: "Azad Kashmir",
    description: "Neelum Valley is a stunning 144km long bow-shaped valley in Azad Kashmir, known for its lush green forests, flowing rivers, and dramatic mountain scenery. The valley is home to iconic spots like Ratti Gali Lake, Keran, Sharda, and the Neelum River. Its untouched natural beauty and peaceful atmosphere make it a hidden gem for nature lovers.",
    shortDescription: "A stunning 144km bow-shaped valley in Azad Kashmir with lush forests and iconic Ratti Gali Lake.",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200"
    ],
    coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200",
    activities: ["Trekking", "Hiking", "Camping", "Fishing", "Photography", "Boating"],
    bestSeason: "Summer",
    altitude: "1,300 meters (Athmuqam)",
    climate: "Pleasant summers, heavy snowfall in winter",
    category: "valley",
    rating: 4.7,
    reviewCount: 0,
    howToReach: {
      fromIslamabad: "Drive via Muzaffarabad and Athmuqam (5-6 hours)",
      fromAbbottabad: "Drive via Muzaffarabad (4-5 hours)",
      totalDistanceKm: 200,
      travelTimeHours: 5,
    },
    isFeatured: true,
    isActive: true,
    sortOrder: 8,
  },
];

// ===== TOURS DATA =====
const tours = [
  {
    title: "5 Days Hunza Valley & Babusar Expedition",
    slug: "hunza-valley-babusar-expedition",
    description: "Experience the magic of Northern Pakistan on this 5-day expedition through Hunza Valley and Babusar Top. From the ancient forts of Karimabad to the snow-capped peaks of Nanga Parbat, this tour covers the most iconic destinations in the region.",
    shortDescription: "5-day journey through Hunza Valley's ancient forts and Babusar Top's snow-capped peaks.",
    destinations: ["Naran", "Babusar Top", "Hunza"],
    route: { startCity: "Islamabad", endCity: "Islamabad", waypoints: ["Abbottabad", "Naran", "Babusar Top", "Hunza", "Gilgit"], totalDistanceKm: 1200 },
    pickupPoints: ["Islamabad", "Abbottabad"],
    duration: "5 Days / 4 Nights",
    totalDays: 5,
    totalNights: 4,
    itinerary: [
      { day: 1, title: "Departure to Naran via Abbottabad & Balakot", description: "Scenic drive through Hazara Motorway. Stop at Kiwai waterfall and Shogran viewpoint. Overnight in Naran.", meals: ["dinner"], accommodation: "Hotel in Naran", highlights: ["Kiwai Waterfall", "Shogran Viewpoint"] },
      { day: 2, title: "Naran to Hunza via Babusar Top", description: "Cross the spectacular Babusar Top at 4,173m. Panoramic views of Nanga Parbat. Arrive in Karimabad, Hunza.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Hunza", highlights: ["Babusar Top", "Nanga Parbat Viewpoint"] },
      { day: 3, title: "Attabad Lake & Passu Cones", description: "Boating at the turquoise Attabad Lake, walk across Hussaini Suspension Bridge, and marvel at Passu Cathedral.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Hunza", highlights: ["Attabad Lake", "Hussaini Bridge", "Passu Cones"] },
      { day: 4, title: "Altit & Baltit Forts Tour", description: "Explore ancient heritage forts in Karimabad. Sunset at Eagles Nest viewpoint with panoramic Hunza views.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Hunza", highlights: ["Baltit Fort", "Altit Fort", "Eagles Nest"] },
      { day: 5, title: "Return Journey to Islamabad", description: "Drive back via Babusar/KKH with stops at Chilas rock carvings. Drop-off at Abbottabad and Islamabad.", meals: ["breakfast"], accommodation: "", highlights: ["Chilas Rock Carvings"] },
    ],
    pricePerPerson: 38000,
    currency: "PKR",
    groupPricing: [
      { minPersons: 2, maxPersons: 3, discountPercent: 0 },
      { minPersons: 4, maxPersons: 6, discountPercent: 5 },
      { minPersons: 7, maxPersons: 12, discountPercent: 10 },
      { minPersons: 13, maxPersons: 25, discountPercent: 15 },
    ],
    inclusions: ["Luxury Transport (Coaster/Van)", "Hotel Accommodations (4 Nights)", "Breakfast & Dinner", "Professional Tour Guide", "All Toll Taxes & Fuel", "Basic First Aid Kit"],
    exclusions: ["Personal Expenses", "Lunch (any meal)", "Boating & Entry Tickets", "Tips & Gratuities", "Anything Not Mentioned in Inclusions"],
    maxGroupSize: 25,
    minimumPersons: 2,
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=800",
    images: ["https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"],
    rating: 4.9,
    reviewCount: 0,
    category: "adventure",
    difficulty: "moderate",
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    title: "3 Days Naran, Batakundi & Lake Saif-ul-Malook",
    slug: "naran-batakundi-lake-saifulmalook",
    description: "A quick getaway to the enchanting Kaghan Valley. Visit the mystical Lake Saif-ul-Malook, explore Batakundi's riverside beauty, and enjoy the cool mountain air of Naran. Perfect for a short holiday with family or friends.",
    shortDescription: "Quick getaway to Kaghan Valley's mystical Lake Saif-ul-Malook and Batakundi's riverside beauty.",
    destinations: ["Naran", "Batakundi", "Babusar Top"],
    route: { startCity: "Islamabad", endCity: "Islamabad", waypoints: ["Abbottabad", "Balakot", "Naran", "Batakundi"], totalDistanceKm: 540 },
    pickupPoints: ["Islamabad", "Abbottabad"],
    duration: "3 Days / 2 Nights",
    totalDays: 3,
    totalNights: 2,
    itinerary: [
      { day: 1, title: "Islamabad/Abbottabad to Naran", description: "Pickup and scenic drive through Kaghan Valley. Check-in and evening walk at Naran Bazar along the Kunhar River.", meals: ["dinner"], accommodation: "Hotel in Naran", highlights: ["Kunhar River", "Naran Bazar"] },
      { day: 2, title: "Jeep Safari to Saif-ul-Malook & Batakundi", description: "Early morning jeep ride to the legendary Lake Saif-ul-Malook. Afternoon explore Jalkhad and riverside views in Batakundi.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Batakundi/Naran", highlights: ["Lake Saif-ul-Malook", "Jalkhad", "Batakundi Riverside"] },
      { day: 3, title: "Babusar Top Viewpoint & Departure", description: "Morning visit to Babusar Top viewpoint (seasonal). Return journey to Islamabad with drop-off.", meals: ["breakfast"], accommodation: "", highlights: ["Babusar Top Viewpoint"] },
    ],
    pricePerPerson: 22000,
    currency: "PKR",
    groupPricing: [
      { minPersons: 2, maxPersons: 3, discountPercent: 0 },
      { minPersons: 4, maxPersons: 8, discountPercent: 5 },
      { minPersons: 9, maxPersons: 15, discountPercent: 10 },
    ],
    inclusions: ["AC Transport (Coaster/Van)", "Hotel Accommodations (2 Nights)", "Daily Breakfast & Dinner", "Jeep Fare for Saif-ul-Malook", "Driver Allowance & Fuel"],
    exclusions: ["Lunch", "Tips & Gratuities", "Boating Charges", "Entry Tickets", "Personal Expenses"],
    maxGroupSize: 15,
    minimumPersons: 2,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
    images: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200", "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200"],
    rating: 4.8,
    reviewCount: 0,
    category: "family",
    difficulty: "easy",
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    title: "7 Days Skardu & Deosai Adventure",
    slug: "skardu-deosai-adventure",
    description: "A week-long adventure to the land of giants. Explore Skardu's turquoise lakes, visit the mighty K2 viewpoint at Concordia, and camp on the 'Land of Giants' - Deosai Plains. This tour is designed for adventure seekers who want to experience the raw beauty of Gilgit-Baltistan.",
    shortDescription: "Week-long adventure through Skardu's turquoise lakes and the legendary Deosai Plains.",
    destinations: ["Skardu", "Deosai"],
    route: { startCity: "Islamabad", endCity: "Islamabad", waypoints: ["Chilas", "Skardu", "Deosai", "Skardu"], totalDistanceKm: 1600 },
    pickupPoints: ["Islamabad"],
    duration: "7 Days / 6 Nights",
    totalDays: 7,
    totalNights: 6,
    itinerary: [
      { day: 1, title: "Fly to Skardu", description: "Morning flight from Islamabad to Skardu with stunning aerial views of K2 and Nanga Parbat. Transfer to hotel.", meals: ["dinner"], accommodation: "Hotel in Skardu", highlights: ["Aerial K2 View"] },
      { day: 2, title: "Skardu Valley Exploration", description: "Visit Shangrila Resort, Lower Kachura Lake, Upper Kachura Lake, and Skardu Fort.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Skardu", highlights: ["Shangrila Resort", "Lower Kachura Lake", "Skardu Fort"] },
      { day: 3, title: "Shigar Fort & Cold Desert", description: "Day trip to the 17th-century Shigar Fort, Cold Desert of Katpana, and Manthokha Waterfall.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Skardu", highlights: ["Shigar Fort", "Katpana Cold Desert", "Manthokha Waterfall"] },
      { day: 4, title: "Drive to Deosai Plains", description: "Scenic drive to Deosai National Park - the 'Land of Giants'. Set up camp at Sheosar Lake.", meals: ["breakfast", "dinner"], accommodation: "Camping", highlights: ["Deosai Plains", "Sheosar Lake"] },
      { day: 5, title: "Deosai Exploration", description: "Full day exploring Deosai: Bara Pani, Kala Pani, and wildlife spotting. Home to Himalayan brown bears and golden marmots.", meals: ["breakfast", "dinner"], accommodation: "Camping", highlights: ["Bara Pani", "Kala Pani", "Wildlife Spotting"] },
      { day: 6, title: "Return to Skardu", description: "Drive back to Skardu. Evening free for shopping and exploration of Skardu Bazaar.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Skardu", highlights: ["Skardu Bazaar"] },
      { day: 7, title: "Fly back to Islamabad", description: "Morning flight back to Islamabad. Tour ends with drop-off.", meals: ["breakfast"], accommodation: "", highlights: [] },
    ],
    pricePerPerson: 65000,
    currency: "PKR",
    groupPricing: [
      { minPersons: 2, maxPersons: 4, discountPercent: 0 },
      { minPersons: 5, maxPersons: 10, discountPercent: 5 },
    ],
    inclusions: ["Return Flights (Islamabad-Skardu)", "Hotel & Camping Accommodations", "All Meals (Breakfast & Dinner)", "4x4 Jeep for Deosai", "Professional Guide", "All Transfers"],
    exclusions: ["Lunch", "Personal Expenses", "Tips", "Anything Not Mentioned"],
    maxGroupSize: 10,
    minimumPersons: 2,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"],
    rating: 4.9,
    reviewCount: 0,
    category: "adventure",
    difficulty: "challenging",
    isFeatured: true,
    isActive: true,
    sortOrder: 3,
  },
  {
    title: "4 Days Swat Valley & Malam Jabba",
    slug: "swat-valley-malam-jabba",
    description: "Discover the 'Switzerland of Pakistan' on this 4-day tour of Swat Valley. Visit the ancient Buddhist ruins in Mingora, explore the stunning Kalam Valley, and enjoy skiing or chairlift rides at Malam Jabba ski resort.",
    shortDescription: "Explore Swat's 'Switzerland of Pakistan' with ancient ruins, Kalam Valley, and Malam Jabba.",
    destinations: ["Swat"],
    route: { startCity: "Islamabad", endCity: "Islamabad", waypoints: ["Mardan", "Mingora", "Malam Jabba", "Kalam"], totalDistanceKm: 500 },
    pickupPoints: ["Islamabad", "Abbottabad"],
    duration: "4 Days / 3 Nights",
    totalDays: 4,
    totalNights: 3,
    itinerary: [
      { day: 1, title: "Islamabad to Swat", description: "Drive through the scenic Swat Expressway to Mingora. Visit Swat Museum and Mingora Bazaar.", meals: ["dinner"], accommodation: "Hotel in Mingora", highlights: ["Swat Museum", "Mingora Bazaar"] },
      { day: 2, title: "Malam Jabba Day", description: "Full day at Malam Jabba ski resort. Chairlift ride, ski slopes, and panoramic mountain views.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Mingora", highlights: ["Malam Jabba Ski Resort", "Chairlift Ride"] },
      { day: 3, title: "Kalam Valley Exploration", description: "Drive to Kalam Valley. Visit Mahodand Lake, Ushu Forest, and enjoy trout fishing.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Kalam", highlights: ["Mahodand Lake", "Ushu Forest"] },
      { day: 4, title: "Return to Islamabad", description: "Morning drive back to Islamabad with stops at Bahrain and Manglawar.", meals: ["breakfast"], accommodation: "", highlights: ["Bahrain Village"] },
    ],
    pricePerPerson: 28000,
    currency: "PKR",
    groupPricing: [
      { minPersons: 2, maxPersons: 4, discountPercent: 0 },
      { minPersons: 5, maxPersons: 10, discountPercent: 5 },
    ],
    inclusions: ["AC Transport", "Hotel Accommodations (3 Nights)", "Breakfast & Dinner", "Malam Jabba Entry & Chairlift", "Driver Allowance"],
    exclusions: ["Lunch", "Ski Equipment Rental", "Tips", "Personal Expenses"],
    maxGroupSize: 15,
    minimumPersons: 2,
    image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=800",
    images: ["https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200"],
    rating: 4.6,
    reviewCount: 0,
    category: "family",
    difficulty: "easy",
    isFeatured: false,
    isActive: true,
    sortOrder: 4,
  },
  {
    title: "6 Days Fairy Meadows & Nanga Parbat",
    slug: "fairy-meadows-nanga-parbat",
    description: "The ultimate adventure tour for thrill-seekers. Trek to Fairy Meadows at the base of Nanga Parbat (8,126m), the world's 9th highest peak. Includes the famous jeep track, camping under the stars, and an optional trek to Nanga Parbat Base Camp.",
    shortDescription: "Ultimate adventure: Trek to Fairy Meadows at the base of Nanga Parbat, the 9th highest peak.",
    destinations: ["Fairy Meadows", "Babusar Top"],
    route: { startCity: "Islamabad", endCity: "Islamabad", waypoints: ["Chilas", "Tato", "Fairy Meadows"], totalDistanceKm: 800 },
    pickupPoints: ["Islamabad"],
    duration: "6 Days / 5 Nights",
    totalDays: 6,
    totalNights: 5,
    itinerary: [
      { day: 1, title: "Islamabad to Chilas", description: "Long drive via Karakoram Highway to Chilas. Overnight in hotel.", meals: ["dinner"], accommodation: "Hotel in Chilas", highlights: ["Karakoram Highway"] },
      { day: 2, title: "Chilas to Fairy Meadows", description: "Thrilling jeep ride on the world's most dangerous road to Tato village, then 3-hour trek to Fairy Meadows.", meals: ["breakfast", "dinner"], accommodation: "Cottage at Fairy Meadows", highlights: ["Famous Jeep Track", "Fairy Meadows Trek"] },
      { day: 3, title: "Fairy Meadows Exploration", description: "Full day at Fairy Meadows. Explore the meadow, photography, and enjoy the stunning Nanga Parbat views.", meals: ["breakfast", "lunch", "dinner"], accommodation: "Cottage at Fairy Meadows", highlights: ["Nanga Parbat View", "Fairy Meadows Exploration"] },
      { day: 4, title: "Nanga Parbat Base Camp Trek", description: "Optional trek to Nanga Parbat Base Camp (Beyal Camp). Panoramic views of the Rupal Face.", meals: ["breakfast", "lunch", "dinner"], accommodation: "Cottage at Fairy Meadows", highlights: ["Nanga Parbat Base Camp", "Rupal Face"] },
      { day: 5, title: "Fairy Meadows to Chilas", description: "Descend trek to Tato, jeep ride back to Chilas.", meals: ["breakfast", "dinner"], accommodation: "Hotel in Chilas", highlights: [] },
      { day: 6, title: "Chilas to Islamabad", description: "Return drive to Islamabad via Karakoram Highway.", meals: ["breakfast"], accommodation: "", highlights: [] },
    ],
    pricePerPerson: 45000,
    currency: "PKR",
    groupPricing: [
      { minPersons: 2, maxPersons: 4, discountPercent: 0 },
      { minPersons: 5, maxPersons: 10, discountPercent: 5 },
    ],
    inclusions: ["Transport (Islamabad-Chilas-Tato)", "Jeep Ride (Tato-Fairy Meadows)", "Cottage Accommodations", "All Meals at Fairy Meadows", "Professional Guide", "Porter for Luggage"],
    exclusions: ["Lunch during road travel", "Sleeping Bag Rental", "Tips", "Personal Expenses"],
    maxGroupSize: 10,
    minimumPersons: 2,
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800",
    images: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200"],
    rating: 4.9,
    reviewCount: 0,
    category: "adventure",
    difficulty: "difficult",
    isFeatured: true,
    isActive: true,
    sortOrder: 5,
  },
];

// ===== HOTELS DATA =====
const hotels = [
  {
    name: "Hunza Serena Inn",
    slug: "hunza-serena-inn",
    description: "Perched on a hilltop in Karimabad with panoramic views of Rakaposhi, Ultar Sar, and the Hunza Valley, Hunza Serena Inn is one of the finest hotels in Northern Pakistan. The hotel offers world-class amenities, traditional Baltit architecture, and warm Burusho hospitality.",
    shortDescription: "Finesse hilltop hotel in Karimabad with panoramic mountain views and world-class amenities.",
    destination: "Hunza",
    address: "Karimabad, Hunza Valley",
    city: "Karimabad",
    coordinates: { lat: 36.3167, lng: 74.6500 },
    starRating: 4,
    rating: 4.7,
    reviewCount: 0,
    amenities: [
      { name: "Free WiFi", icon: "wifi", category: "general" },
      { name: "Restaurant", icon: "utensils", category: "dining" },
      { name: "Room Service", icon: "concierge-bell", category: "dining" },
      { name: "Mountain View", icon: "mountain", category: "recreation" },
      { name: "Garden", icon: "flower-2", category: "recreation" },
      { name: "Parking", icon: "car", category: "transport" },
      { name: "24/7 Front Desk", icon: "clock", category: "general" },
      { name: "Laundry Service", icon: "shirt", category: "general" },
    ],
    totalRooms: 40,
    startingPricePerNight: 18000,
    currency: "PKR",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
    childPolicy: "Children under 5 stay free. Ages 5-12 charged 50%.",
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200", "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200"],
    phone: "+92-5811-456789",
    email: "info@hunzaserena.com",
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Pearl Continental Hotel, Bhurban",
    slug: "pearl-continental-bhurban",
    description: "Pearl Continental Hotel Bhurban is a luxury mountain resort perched at 7,000 feet in the scenic hills near Murree. With stunning views of the Kashmir Valley, an 18-hole golf course, and world-class dining, it offers the perfect blend of luxury and nature.",
    shortDescription: "Luxury mountain resort at 7,000 feet with Kashmir Valley views and 18-hole golf course.",
    destination: "Murree",
    address: "Bhurban, Murree",
    city: "Bhurban",
    coordinates: { lat: 33.9500, lng: 73.3800 },
    starRating: 5,
    rating: 4.5,
    reviewCount: 0,
    amenities: [
      { name: "Free WiFi", icon: "wifi", category: "general" },
      { name: "Golf Course", icon: "flag", category: "recreation" },
      { name: "Swimming Pool", icon: "waves", category: "recreation" },
      { name: "Spa", icon: "sparkles", category: "recreation" },
      { name: "Multiple Restaurants", icon: "utensils", category: "dining" },
      { name: "Conference Hall", icon: "presentation", category: "business" },
      { name: "Fitness Center", icon: "dumbbell", category: "recreation" },
      { name: "Airport Transfer", icon: "plane", category: "transport" },
    ],
    totalRooms: 100,
    startingPricePerNight: 35000,
    currency: "PKR",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    cancellationPolicy: "Free cancellation up to 72 hours before check-in.",
    childPolicy: "Children under 6 stay free.",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200"],
    phone: "+92-51-5568000",
    email: "reservations@pchotels.com",
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Shangrila Resort Skardu",
    slug: "shangrila-resort-skardu",
    description: "Shangrila Resort, also known as 'Heaven on Earth', sits on the banks of the stunning Lower Kachura Lake in Skardu. With its iconic red-roofed villas, beautiful gardens, and the turquoise lake as a backdrop, it is one of the most photographed hotels in Pakistan.",
    shortDescription: "'Heaven on Earth' resort on the banks of Lower Kachura Lake with iconic red-roofed villas.",
    destination: "Skardu",
    address: "Lower Kachura, Skardu",
    city: "Skardu",
    coordinates: { lat: 35.4167, lng: 75.7000 },
    starRating: 4,
    rating: 4.6,
    reviewCount: 0,
    amenities: [
      { name: "Lake View", icon: "waves", category: "recreation" },
      { name: "Restaurant", icon: "utensils", category: "dining" },
      { name: "Garden", icon: "flower-2", category: "recreation" },
      { name: "Boating", icon: "ship", category: "recreation" },
      { name: "Free WiFi", icon: "wifi", category: "general" },
      { name: "Parking", icon: "car", category: "transport" },
      { name: "Room Service", icon: "concierge-bell", category: "dining" },
      { name: "Gift Shop", icon: "shopping-bag", category: "general" },
    ],
    totalRooms: 60,
    startingPricePerNight: 25000,
    currency: "PKR",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
    childPolicy: "Children under 5 stay free.",
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200", "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200"],
    phone: "+92-5811-451234",
    email: "info@shangrilaskardu.com",
    isFeatured: true,
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "PTDC Motel Naran",
    slug: "ptdc-motel-naran",
    description: "PTDC Motel Naran is a government-run accommodation located in the heart of Naran Valley along the Kunhar River. It offers clean, comfortable rooms at affordable prices with easy access to Lake Saif-ul-Malook and other Kaghan Valley attractions.",
    shortDescription: "Government-run motel in Naran with Kunhar River views and affordable comfort.",
    destination: "Naran",
    address: "Naran Bazaar, Kaghan Valley",
    city: "Naran",
    coordinates: { lat: 34.9000, lng: 73.6500 },
    starRating: 3,
    rating: 4.0,
    reviewCount: 0,
    amenities: [
      { name: "Restaurant", icon: "utensils", category: "dining" },
      { name: "Parking", icon: "car", category: "transport" },
      { name: "Garden", icon: "flower-2", category: "recreation" },
      { name: "Room Service", icon: "concierge-bell", category: "dining" },
    ],
    totalRooms: 20,
    startingPricePerNight: 8000,
    currency: "PKR",
    checkInTime: "12:00",
    checkOutTime: "11:00",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in.",
    childPolicy: "Children under 5 stay free.",
    images: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200", "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200"],
    phone: "+92-997-456789",
    email: "naran@ptdc.com.pk",
    isFeatured: false,
    isActive: true,
    sortOrder: 4,
  },
];

// ===== ROOMS DATA =====
const rooms = [
  // Hunza Serena Inn rooms
  {
    hotelIndex: 0,
    type: "Standard Room",
    slug: "standard-room",
    description: "Comfortable room with valley views, modern amenities, and traditional decor.",
    bedType: "Queen Bed",
    sizeSqm: 28,
    maxGuests: 2,
    pricePerNight: 18000,
    totalRooms: 20,
    totalRoomsCount: 20,
    amenities: [{ name: "WiFi" }, { name: "TV" }, { name: "Heater" }, { name: "Attached Bath" }],
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800"],
    isActive: true,
    sortOrder: 1,
  },
  {
    hotelIndex: 0,
    type: "Deluxe Room",
    slug: "deluxe-room",
    description: "Spacious room with panoramic mountain views, balcony, and premium amenities.",
    bedType: "King Bed",
    sizeSqm: 38,
    maxGuests: 2,
    pricePerNight: 28000,
    totalRooms: 12,
    totalRoomsCount: 12,
    amenities: [{ name: "WiFi" }, { name: "TV" }, { name: "Heater" }, { name: "Balcony" }, { name: "Mountain View" }, { name: "Mini Bar" }],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"],
    isActive: true,
    sortOrder: 2,
  },
  {
    hotelIndex: 0,
    type: "Suite",
    slug: "suite",
    description: "Luxury suite with separate living area, stunning Rakaposhi views, and premium service.",
    bedType: "King Bed + Sofa Bed",
    sizeSqm: 55,
    maxGuests: 3,
    pricePerNight: 45000,
    totalRooms: 8,
    totalRoomsCount: 8,
    amenities: [{ name: "WiFi" }, { name: "TV" }, { name: "Heater" }, { name: "Balcony" }, { name: "Mountain View" }, { name: "Mini Bar" }, { name: "Living Room" }, { name: "Room Service" }],
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800"],
    isActive: true,
    sortOrder: 3,
  },
  // Pearl Continental rooms
  {
    hotelIndex: 1,
    type: "Classic Room",
    slug: "classic-room",
    description: "Elegant room with garden or valley views and contemporary furnishings.",
    bedType: "Queen Bed",
    sizeSqm: 32,
    maxGuests: 2,
    pricePerNight: 35000,
    totalRooms: 50,
    totalRoomsCount: 50,
    amenities: [{ name: "WiFi" }, { name: "TV" }, { name: "AC" }, { name: "Mini Bar" }, { name: "Safe" }],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"],
    isActive: true,
    sortOrder: 1,
  },
  {
    hotelIndex: 1,
    type: "Executive Suite",
    slug: "executive-suite",
    description: "Premium suite with separate living area, Kashmir Valley views, and executive lounge access.",
    bedType: "King Bed",
    sizeSqm: 60,
    maxGuests: 3,
    pricePerNight: 55000,
    totalRooms: 20,
    totalRoomsCount: 20,
    amenities: [{ name: "WiFi" }, { name: "TV" }, { name: "AC" }, { name: "Mini Bar" }, { name: "Living Room" }, { name: "Valley View" }, { name: "Lounge Access" }],
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800"],
    isActive: true,
    sortOrder: 2,
  },
  // Shangrila Resort rooms
  {
    hotelIndex: 2,
    type: "Standard Villa",
    slug: "standard-villa",
    description: "Traditional red-roofed villa with lake or garden views.",
    bedType: "Queen Bed",
    sizeSqm: 30,
    maxGuests: 2,
    pricePerNight: 25000,
    totalRooms: 30,
    totalRoomsCount: 30,
    amenities: [{ name: "WiFi" }, { name: "TV" }, { name: "Garden View" }, { name: "Attached Bath" }],
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800"],
    isActive: true,
    sortOrder: 1,
  },
  {
    hotelIndex: 2,
    type: "Lake View Suite",
    slug: "lake-view-suite",
    description: "Premium suite with direct lake views and private balcony overlooking Lower Kachura Lake.",
    bedType: "King Bed",
    sizeSqm: 48,
    maxGuests: 2,
    pricePerNight: 40000,
    totalRooms: 15,
    totalRoomsCount: 15,
    amenities: [{ name: "WiFi" }, { name: "TV" }, { name: "Lake View" }, { name: "Balcony" }, { name: "Mini Bar" }],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"],
    isActive: true,
    sortOrder: 2,
  },
];

// ===== ADMIN USER =====
const adminUser = {
  name: "Admin",
  email: "admin@northroutespk.com",
  password: "admin123456",
  role: "admin",
  phone: "+92-300-1234567",
  preferredPickup: "Islamabad",
  isActive: true,
  isEmailVerified: true,
};

// ===== SEED FUNCTION =====
async function seed() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Tour.deleteMany({});
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    console.log("✅ Cleared all collections\n");

    // Create admin user
    console.log("👤 Creating admin user...");
    const admin = await User.create(adminUser);
    console.log(`   ✅ Admin: ${admin.email} (password: admin123456)\n`);

    // Create destinations
    console.log("🗺️  Creating destinations...");
    for (const dest of destinations) {
      await Destination.create(dest);
      console.log(`   ✅ ${dest.name}`);
    }
    console.log(`   → ${destinations.length} destinations created\n`);

    // Create tours
    console.log("🚌 Creating tours...");
    for (const tour of tours) {
      await Tour.create(tour);
      console.log(`   ✅ ${tour.title}`);
    }
    console.log(`   → ${tours.length} tours created\n`);

    // Create hotels
    console.log("🏨 Creating hotels...");
    const createdHotels = [];
    for (const hotel of hotels) {
      const created = await Hotel.create(hotel);
      createdHotels.push(created);
      console.log(`   ✅ ${hotel.name}`);
    }
    console.log(`   → ${hotels.length} hotels created\n`);

    // Create rooms
    console.log("🛏️  Creating rooms...");
    let roomCount = 0;
    for (const room of rooms) {
      await Room.create({
        ...room,
        hotel: createdHotels[room.hotelIndex]._id,
      });
      roomCount++;
    }
    console.log(`   → ${roomCount} rooms created\n`);

    console.log("🎉 Database seeded successfully!");
    console.log("\n📋 Admin Login Credentials:");
    console.log("   Email: admin@northroutespk.com");
    console.log("   Password: admin123456\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
