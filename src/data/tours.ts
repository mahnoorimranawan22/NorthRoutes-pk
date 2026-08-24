export interface Tour {
  id: number;
  name: string;
  location: string;
  description: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  highlights: string[];
  maxGroupSize: number;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  rating: number;
  image: string;
  amenities: string[];
}

export const tours: Tour[] = [
  {
    id: 1,
    name: "Hunza Valley Adventure",
    location: "Hunza, Gilgit-Baltistan",
    description: "Experience the breathtaking beauty of Hunza Valley with our curated 5-day adventure. Explore ancient forts, pristine lakes, and towering mountains.",
    duration: "5 Days",
    price: 45000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    highlights: ["Visit Baltit Fort and Altit Fort", "Boat ride on Attabad Lake", "Sunset at Eagle's Nest", "Explore Karimabad Bazaar", "Visit Passu Cones"],
    maxGroupSize: 15,
  },
  {
    id: 2,
    name: "Skardu Explorer",
    location: "Skardu, Gilgit-Baltistan",
    description: "Discover the wonders of Skardu, gateway to K2 and the world's highest peaks.",
    duration: "7 Days",
    price: 65000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400",
    highlights: ["Shangrila Resort visit", "Upper and Lower Kachura Lakes", "Deosai Plains excursion", "Skardu Fort visit"],
    maxGroupSize: 12,
  },
  {
    id: 3,
    name: "Naran Kaghan Trip",
    location: "Naran, KPK",
    description: "A scenic journey through the lush green valleys of Khyber Pakhtunkhwa.",
    duration: "4 Days",
    price: 35000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
    highlights: ["Lulusar Lake visit", "Babusar Top excursion", "Shogran and Siri Paye Meadows", "Naran Bazaar"],
    maxGroupSize: 20,
  },
  {
    id: 4,
    name: "Fairy Meadows Trek",
    location: "Nanga Parbat, GB",
    description: "Trek to one of the most scenic viewpoints in the world, facing Nanga Parbat.",
    duration: "3 Days",
    price: 28000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400",
    highlights: ["Jeep ride to Tato village", "Trek through pine forests", "Camp under the stars", "Nanga Parbat base camp view"],
    maxGroupSize: 10,
  },
  {
    id: 5,
    name: "Swat Valley Tour",
    location: "Swat, KPK",
    description: "Explore the Switzerland of Pakistan with its lush meadows and crystal-clear rivers.",
    duration: "6 Days",
    price: 42000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400",
    highlights: ["Malam Jabba ski resort", "Mingora bazaar", "Kalam Valley visit", "Mahodand Lake"],
    maxGroupSize: 18,
  },
  {
    id: 6,
    name: "Deosai Plains Safari",
    location: "Deosai, GB",
    description: "Visit the second-highest plateau in the world, home to Himalayan brown bears.",
    duration: "4 Days",
    price: 52000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400",
    highlights: ["Spot Himalayan brown bears", "Sheosar Lake visit", "Wildflower meadows", "Camping on the plateau"],
    maxGroupSize: 8,
  },
];

export const hotels: Hotel[] = [
  {
    id: 1,
    name: "Hunza Serena Inn",
    location: "Hunza",
    description: "Luxury hotel with stunning views of the Hunza Valley.",
    pricePerNight: 12000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    amenities: ["wifi", "parking", "restaurant", "spa"],
  },
  {
    id: 2,
    name: "Shangrila Resort",
    location: "Skardu",
    description: "Iconic resort on the shores of Lower Kachura Lake.",
    pricePerNight: 18000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
    amenities: ["wifi", "parking", "restaurant", "pool"],
  },
  {
    id: 3,
    name: "Naran Continental",
    location: "Naran",
    description: "Comfortable hotel in the heart of Naran.",
    pricePerNight: 8000,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
    amenities: ["wifi", "restaurant", "parking"],
  },
  {
    id: 4,
    name: "Pearl Continental Bhurban",
    location: "Bhurban",
    description: "Premium hill station hotel with panoramic views.",
    pricePerNight: 15000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    amenities: ["wifi", "parking", "restaurant", "gym"],
  },
];
