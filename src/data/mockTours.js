export const MOCK_TOURS = [
  {
    id: "tour-1",
    title: "5 Days Hunza Valley & Babusar Expedition",
    slug: "hunza-valley-babusar-expedition",
    destinations: ["Naran", "Batakundi", "Babusar Top", "Hunza"],
    pickupPoints: ["Islamabad", "Abbottabad"],
    duration: "5 Days / 4 Nights",
    pricePerPerson: 38000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=80",
    ],
    inclusions: ["Luxury Transport", "Hotel Stays", "Breakfast & Dinner", "Tour Guide", "Toll Taxes"],
    exclusions: ["Personal Expenses", "Lunch", "Boating & Entry Tickets"],
    itinerary: [
      { day: 1, title: "Departure to Naran via Abbottabad & Balakot", description: "Scenic drive through Hazara Motorway and overnight stay in Naran." },
      { day: 2, title: "Naran to Hunza via Babusar Top", description: "Crossing Babusar Top, viewpoint of Nanga Parbat, arriving in Karimabad, Hunza." },
      { day: 3, title: "Attabad Lake & Passu Cones", description: "Boating at Attabad Lake, Hussaini Suspension Bridge, and Passu Cathedral." },
      { day: 4, title: "Altit & Baltit Forts Tour", description: "Exploring ancient heritage in Karimabad and sunset at Eagles Nest." },
      { day: 5, title: "Return Journey to Islamabad", description: "Drive back via Babusar / KKH with drop-off at Abbottabad and Islamabad." }
    ]
  },
  {
    id: "tour-2",
    title: "3 Days Naran, Batakundi & Lake Saif-ul-Malook",
    slug: "naran-batakundi-lake-saifulmalook",
    destinations: ["Naran", "Batakundi", "Babusar Top"],
    pickupPoints: ["Islamabad", "Abbottabad"],
    duration: "3 Days / 2 Nights",
    pricePerPerson: 22000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80",
    ],
    inclusions: ["AC Transport", "Hotel Accommodations", "Daily Breakfast", "Jeep Fare for Saif-ul-Malook"],
    exclusions: ["Lunch & Dinner", "Tips", "Extras"],
    itinerary: [
      { day: 1, title: "Islamabad/Abbottabad to Naran", description: "Pickup and travel through Kaghan Valley. Check-in and evening walk at Naran Bazar." },
      { day: 2, title: "Jeep Safari to Saif-ul-Malook & Batakundi", description: "Explore Lake Saif-ul-Malook, Jalkhad, and riverside views in Batakundi." },
      { day: 3, title: "Babusar Top Viewpoint & Departure", description: "Morning visit to Babusar Top and return trip." }
    ]
  }
];
