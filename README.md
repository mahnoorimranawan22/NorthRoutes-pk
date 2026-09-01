# 🏔️ Passu Peaks Travels — Full-Stack Travel Platform

A complete travel and tourism platform for Northern Pakistan, featuring tour booking, hotel reservations, destination exploration, and an admin CMS. Built with React, Express.js, MongoDB, and JWT authentication.

**Live Frontend:** [https://passupeaks.pk/](https://passupeaks.pk/)

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Admin Setup](#admin-setup)
- [Deployment](#deployment)
- [Limitations & Improvements](#limitations--improvements)

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **React Router v7** for routing
- **Framer Motion** for animations
- **Axios** for API calls
- **Lucide React** for icons
- **Swiper** for image sliders

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** (JSON Web Tokens) for authentication
- **bcryptjs** for password hashing
- **CORS** configured for frontend-backend communication

### Database
- **MongoDB Atlas** (cloud) or local MongoDB

### Deployment
- **Frontend:** GitHub Pages (auto-deploy via GitHub Actions)
- **Backend:** Render / Railway / any Node.js host
- **Database:** MongoDB Atlas free tier

---

## ✨ Features

### Customer-Facing
- 🏠 Homepage with HD image slider of Northern Pakistan
- 🗺️ 8 Destinations (Hunza, Skardu, Naran, Babusar Top, Fairy Meadows, Swat, Murree, Neelum Valley)
- 🚌 5 Tour Packages with day-by-day itineraries
- 🏨 4 Hotels with room types and nightly pricing
- 🔍 Advanced search & filter (destination, pickup point, budget, date)
- 📱 Mobile-first responsive design
- ✨ Page transitions, parallax effects, animated counters
- 💳 Multi-step checkout with Pakistani payment methods (JazzCash, EasyPaisa, Bank Transfer, Card)
- ⭐ Reviews and ratings system
- ❤️ Favorite destinations
- 👤 User registration and login

### Admin CMS
- 📊 Dashboard with booking analytics
- 🚌 Manage Tours (CRUD)
- 🏨 Manage Hotels & Rooms (CRUD)
- 🗺️ Manage Destinations (CRUD)
- 📋 Manage Bookings (view all, update status)
- 👥 Manage Users (view all, change roles)
- ⭐ Moderate Reviews

---

## 📁 Project Structure

```
passu-peaks-travels/
├── public/                    # Static assets (images, logos, favicons)
├── server/                    # Backend API
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tourController.js
│   │   ├── hotelController.js
│   │   ├── bookingController.js
│   │   ├── destinationController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js           # JWT auth + role authorization
│   ├── models/
│   │   ├── User.js
│   │   ├── Tour.js
│   │   ├── Hotel.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   ├── Destination.js
│   │   ├── Review.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tours.js
│   │   ├── hotels.js
│   │   ├── bookings.js
│   │   ├── destinations.js
│   │   ├── reviews.js
│   │   └── users.js
│   ├── utils/
│   │   └── jwt.js            # Token generation & verification
│   ├── server.js              # Express entry point
│   ├── seed.js                # Database seeder
│   ├── .env.example
│   └── package.json
├── src/                       # Frontend React app
│   ├── components/
│   │   ├── common/            # Reusable UI (PageTransition, GridShape, etc.)
│   │   ├── customer/          # Customer-facing (Navbar, Footer, Hero, etc.)
│   │   └── admin/             # Admin CMS components
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication state
│   ├── data/                  # Mock data (tours, hotels, destinations)
│   ├── hooks/
│   │   ├── useParallax.ts
│   │   └── useScrollReveal.ts
│   ├── pages/
│   │   ├── customer/          # Home, Tours, Hotels, Booking, etc.
│   │   ├── admin/             # Admin dashboard pages
│   │   └── AuthPages/         # Sign-in, Sign-up
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── services/
│   │   └── api.ts             # Axios API service layer
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .gitignore
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ (recommended 20+)
- MongoDB (local or Atlas)
- Git

### Clone & Install

```bash
git clone https://github.com/mahnoorimranawan22/passu-peaks-travels.git
cd passu-peaks-travels

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/passupeaks-travels?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`.env.local`)

```env
VITE_API_URL=http://localhost:5000/api
```

See `server/.env.example` for a template.

---

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create a free account at [mongodb.com](https://www.mongodb.com/)
2. Create a cluster (free tier M0)
3. Create a database user
4. Get your connection string
5. Add it to `server/.env` as `MONGODB_URI`

### Option 2: Local MongoDB

1. Install MongoDB Community Edition
2. Start the service
3. Use `mongodb://localhost:27017/passupeaks-travels` as your URI

### Seed the Database

```bash
cd server
node seed.js
```

This creates:
- Admin user: `admin@passupeaks.pk` / `admin123456`
- 8 destinations (Hunza, Skardu, Naran, etc.)
- 5 tour packages
- 4 hotels with rooms

---

## 🏃 Running Locally

### Start Backend

```bash
cd server
node server.js
# API runs on http://localhost:5000
```

### Start Frontend

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### Start Both (concurrent)

```bash
# Terminal 1
cd server && node server.js

# Terminal 2
npm run dev
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Tours
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tours` | List tours (filters: destination, pickup, budget, date) | No |
| GET | `/api/tours/:slug` | Get tour by slug | No |
| GET | `/api/tours/:slug/availability` | Available dates | No |
| POST | `/api/tours` | Create tour | Admin |
| PUT | `/api/tours/:id` | Update tour | Admin |
| DELETE | `/api/tours/:id` | Delete tour | Admin |

### Hotels
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/hotels` | List hotels (filters: destination, star rating, price) | No |
| GET | `/api/hotels/:id` | Get hotel with rooms | No |
| GET | `/api/hotels/:id/availability` | Room availability | No |
| POST | `/api/hotels` | Create hotel | Admin |
| PUT | `/api/hotels/:id` | Update hotel | Admin |
| DELETE | `/api/hotels/:id` | Delete hotel | Admin |

### Destinations
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/destinations` | List destinations (filters: province, category, search) | No |
| GET | `/api/destinations/:id` | Get destination | No |
| POST | `/api/destinations` | Create destination | Admin |
| PUT | `/api/destinations/:id` | Update destination | Admin |
| DELETE | `/api/destinations/:id` | Delete destination | Admin |
| POST | `/api/destinations/:id/favorite` | Toggle favorite | Yes |
| GET | `/api/destinations/favorites` | Get user's favorites | Yes |

### Bookings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create booking | Yes |
| GET | `/api/bookings/my-bookings` | Get user's bookings | Yes |
| GET | `/api/bookings/:ref` | Get booking by reference | Yes |
| PUT | `/api/bookings/:id/cancel` | Cancel booking | Yes |
| GET | `/api/bookings/admin/all` | Get all bookings | Admin |
| GET | `/api/bookings/admin/:id` | Get booking by ID | Admin |
| PUT | `/api/bookings/admin/:id/status` | Update booking status | Admin |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/reviews/:targetType/:targetId` | Get reviews for target | No |
| POST | `/api/reviews` | Create review | Yes |
| PUT | `/api/reviews/:id` | Update own review | Yes |
| DELETE | `/api/reviews/:id` | Delete own review | Yes |
| GET | `/api/reviews/admin/all` | Get all reviews | Admin |
| PUT | `/api/reviews/admin/:id/moderate` | Moderate review | Admin |

### Admin Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | List all users | Admin |
| GET | `/api/admin/users/:id` | Get user by ID | Admin |
| PUT | `/api/admin/users/:id/role` | Update user role | Super Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Super Admin |

---

## 🔑 Authentication Flow

1. **Register/Login** → Server validates credentials, hashes password with bcrypt (12 rounds)
2. **JWT Token** → Server generates access token (7 days) + refresh token (30 days)
3. **Frontend Storage** → Token stored in `localStorage` as `nr_token`
4. **API Requests** → Axios interceptor attaches `Authorization: Bearer <token>` header
5. **Protected Routes** → `protect` middleware verifies token, attaches `req.user`
6. **Admin Routes** → `authorize('admin', 'super_admin')` middleware checks role
7. **401 Response** → Auto-logout, redirect to sign-in page

---

## 👑 Admin Setup

### Create Admin via Seed Script
```bash
cd server && node seed.js
# Admin: admin@northroutespk.com / admin123456
```

### Create Admin Manually
```bash
# Register a normal account, then in MongoDB:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Admin Access
- Sign in with admin credentials
- Navigate to `/admin` for the Admin CMS
- Only users with `admin` or `super_admin` role can access

---

## 🚢 Deployment

### Frontend (GitHub Pages)

Already configured with GitHub Actions. Push to `master` branch to auto-deploy.

### Backend (Render - Free)

1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && node server.js`
   - **Port:** 5000
5. Add Environment Variables:
   - `MONGODB_URI` — Your MongoDB Atlas connection string
   - `JWT_SECRET` — A secure random string
   - `CLIENT_URL` — Your frontend URL (e.g., `https://mahnoorimranawan22.github.io`)
   - `NODE_ENV` — `production`
6. Deploy → Copy the Render URL

### Connect Frontend to Backend

Update `.env.local` or `src/services/api.ts`:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || "https://your-render-url.onrender.com/api";
```

For production, add to GitHub repo → Settings → Secrets:
```
VITE_API_URL = https://your-render-url.onrender.com/api
```

---

## 🧪 Testing

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get current user (with token)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Tours
```bash
# List all tours
curl http://localhost:5000/api/tours

# Filter by destination
curl "http://localhost:5000/api/tours?destination=Hunza"

# Get single tour
curl http://localhost:5000/api/tours/hunza-valley-babusar-expedition
```

### Test Bookings
```bash
# Create booking (with token)
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"bookingType":"tour_only","tourId":"TOUR_ID","guests":[{"name":"Test","isChild":false}],"pickupPoint":"Islamabad","tourStartDate":"2026-09-15"}'
```

---

## ⚠️ Limitations & Improvements

### Current Limitations
1. **Payment is simulated** — JazzCash/EasyPaisa/Bank Transfer forms collect info but don't process real payments
2. **Email notifications** — Not implemented (booking confirmations are UI-only)
3. **Image uploads** — Admin forms reference image URLs, no file upload yet
4. **Reviews** — Frontend review submission UI not yet built (API is ready)
5. **Favorites** — API ready, frontend UI not yet integrated

### Suggested Improvements
1. **Real Payment Gateway** — Integrate JazzCash/EasyPaisa API or Stripe
2. **Email Service** — SendGrid/Nodemailer for booking confirmations
3. **Image Upload** — Multer + Cloudinary for admin image management
4. **Review UI** — Add review forms on tour/hotel detail pages
5. **Favorites UI** — Heart icon on destination cards
6. **WhatsApp Integration** — Click-to-WhatsApp for inquiries
7. **PWA Support** — Service worker for offline access
8. **SEO** — Dynamic meta tags for each page
9. **Analytics** — Google Analytics for visitor tracking
10. **Rate Limiting** — Express rate limiter for API protection

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 🤝 Support

For issues or questions, contact: admin@passupeaks.pk

Built with ❤️ for Pakistan's Northern Tourism
