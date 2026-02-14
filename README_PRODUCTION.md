# 🏆 Smart Tourist Guide & Travel Recommendation System
## Production-Ready | Hackathon-Winning Edition

A full-stack, production-level web application that helps users discover tourist places with AI-powered recommendations, smart trip planning, and comprehensive travel assistance.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Status](https://img.shields.io/badge/status-production--ready-success)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌟 Key Features

### 🧠 Smart Intelligence
- **Personalized Recommendations** - AI-based suggestions using user interests
- **Dynamic Trip Timeline** - Auto-generated day-wise itineraries with time slots
- **Smart Travel Companion** - Real-time tips, crowd levels, best visiting times
- **Budget Estimator** - Intelligent cost calculation for trips

### 🗺️ Interactive Experience
- **Interactive Maps** - Leaflet integration with place markers
- **Nearby Attractions** - Distance-based recommendations
- **Weather Integration** - Real-time weather information
- **Trending Places** - Popularity-based rankings

### 💾 User Features
- **Favorites System** - Save and manage favorite destinations
- **Trip Plans** - Save complete itineraries
- **Reviews & Ratings** - Community-driven feedback
- **Multi-language** - English/Tamil support

### 🎨 Modern UI/UX
- **Dark Mode** - Seamless theme switching
- **Lazy Loading** - Optimized image performance
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Professional transitions

### 🔒 Security & Performance
- **JWT Authentication** - Secure user sessions
- **Role-based Access** - Admin dashboard
- **Optimized Performance** - Lazy loading, caching
- **Error Handling** - Graceful error boundaries

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI library
- **React Router DOM 6** - Client-side routing
- **Axios** - HTTP client
- **React Leaflet** - Interactive maps
- **React Icons** - Icon library
- **CSS3** - Modern styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd miniproject

# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 2. Database Setup

```sql
CREATE DATABASE tourist_guide_db;
```

### 3. Configure Environment

**backend/.env:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tourist_guide_db
JWT_SECRET=your_jwt_secret_key_here
WEATHER_API_KEY=your_openweathermap_key (optional)
```

### 4. Run Application

```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm start
```

Visit: `http://localhost:3000`

---

## 📁 Project Structure

```
miniproject/
├── backend/
│   ├── config/
│   │   ├── database.js          # MySQL connection
│   │   └── initDb.js            # Schema & sample data
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── placeController.js   # Places CRUD
│   │   ├── favoriteController.js
│   │   ├── reviewController.js
│   │   └── enhancedController.js # Advanced features
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── placeRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── enhancedRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js                # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── PlaceCard.js
│   │   │   ├── OptimizedImage.js
│   │   │   ├── TrendingPlaces.js
│   │   │   ├── BudgetEstimator.js
│   │   │   ├── SmartTravelCompanion.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── EmptyState.js
│   │   │   └── ErrorBoundary.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── LanguageContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Explore.js
│   │   │   ├── PlaceDetails.js
│   │   │   ├── TravelPlanner.js
│   │   │   ├── TripTimeline.js
│   │   │   ├── Favorites.js
│   │   │   ├── Auth.js
│   │   │   ├── Admin.js
│   │   │   └── NotFound.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── PRODUCTION_UPGRADE_GUIDE.md
├── ENHANCED_FEATURES.md
├── SMART_COMPANION_GUIDE.md
├── TIMELINE_AND_OPTIMIZATION.md
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register user
POST   /api/auth/login         # Login user
```

### Places
```
GET    /api/places             # Get all places (with filters)
GET    /api/places/:id         # Get place details
GET    /api/places/category/:category
GET    /api/places/recommendations  # Personalized (auth)
POST   /api/places             # Create (admin)
PUT    /api/places/:id         # Update (admin)
DELETE /api/places/:id         # Delete (admin)
POST   /api/places/itinerary   # Generate itinerary
POST   /api/places/timeline    # Generate timeline
```

### Enhanced Features
```
GET    /api/enhanced/trending  # Trending places
GET    /api/enhanced/nearby    # Nearby attractions
GET    /api/enhanced/weather   # Weather info
POST   /api/enhanced/budget    # Budget calculation
POST   /api/enhanced/plans     # Save trip plan (auth)
GET    /api/enhanced/plans     # Get saved plans (auth)
DELETE /api/enhanced/plans/:id # Delete plan (auth)
```

### Favorites & Reviews
```
GET    /api/favorites          # Get favorites (auth)
POST   /api/favorites          # Add favorite (auth)
DELETE /api/favorites/:placeId # Remove favorite (auth)
POST   /api/reviews            # Add review (auth)
GET    /api/reviews/:placeId   # Get reviews
```

---

## 🎯 Feature Highlights

### 1. Smart Recommendations
- Based on user interests (Nature, Temple, Beach, Food, Adventure, Heritage)
- Location-based filtering
- Rating-based sorting
- Popularity scoring

### 2. Trip Timeline
- 1-day or 2-day itineraries
- Time slot scheduling (9 AM, 12 PM, 3 PM, 6 PM)
- Vertical timeline visualization
- Visit duration estimates
- Travel tips included

### 3. Travel Companion
- Best visiting time
- Estimated visit duration
- Crowd level indicators (Low/Medium/High)
- Practical travel tips
- Nearby food recommendations
- Suggested next destination

### 4. Performance Optimization
- Lazy loading images
- Shimmer placeholders
- Fixed dimensions (no layout shift)
- Optimized API responses
- Component memoization

### 5. Professional UI/UX
- Airbnb-style design
- Smooth animations
- Glassmorphism effects
- Dark mode support
- Mobile responsive
- Loading states
- Empty states
- Error boundaries

---

## 👤 Admin Access

To create an admin user:

```sql
USE tourist_guide_db;

-- Register normally, then update role
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 📊 Database Schema

### Users
- id, name, email, password, interests, role, created_at

### Tourist Places
- id, name, description, category, location, rating, imageUrl
- latitude, longitude, bestTime, visitDuration, crowdLevel
- travelTips, nearbyFood, nextSuggestion, popularityScore, viewCount

### Favorites
- id, userId, placeId, created_at

### Reviews
- id, userId, placeId, rating, comment, created_at

### Saved Plans
- id, userId, planName, city, duration, places (JSON), budget

---

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Configure production database (AWS RDS/PlanetScale)
3. Enable CORS for production domain
4. Deploy

### Frontend (Vercel/Netlify)
1. Update API_URL to production backend
2. Build: `npm run build`
3. Deploy build folder

---

## 📈 Performance Metrics

### Target Lighthouse Scores:
- ⚡ Performance: 90+
- ♿ Accessibility: 95+
- ✅ Best Practices: 95+
- 🔍 SEO: 90+

### Optimizations:
- Lazy loading images
- Code splitting
- Minified bundles
- Compressed assets
- Cached responses

---

## 🎨 UI/UX Features

✅ Clean card-based layout
✅ Smooth hover animations
✅ Modern typography
✅ Consistent spacing
✅ Color-coded categories
✅ Intuitive navigation
✅ Loading indicators
✅ Empty state messages
✅ Error handling
✅ Responsive breakpoints

---

## 🔒 Security Features

✅ JWT authentication
✅ Password hashing (bcrypt)
✅ Protected API routes
✅ Role-based access control
✅ SQL injection prevention
✅ XSS protection
✅ CORS configuration
✅ Environment variables

---

## 📱 Responsive Design

- **Desktop** (1200px+): Full layout
- **Tablet** (768px-1199px): Adapted grid
- **Mobile** (<768px): Stacked layout

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
# Verify credentials in .env
# Ensure database exists
```

### Port Already in Use
```bash
# Change PORT in backend .env
# Update API_URL in frontend
```

### Module Not Found
```bash
npm install  # In both backend and frontend
```

---

## 📚 Documentation

- **PRODUCTION_UPGRADE_GUIDE.md** - Complete upgrade documentation
- **ENHANCED_FEATURES.md** - Advanced features guide
- **SMART_COMPANION_GUIDE.md** - Travel companion details
- **TIMELINE_AND_OPTIMIZATION.md** - Timeline & performance

---

## 🏆 Hackathon Presentation

### Demo Flow:
1. **Landing** - Hero, trending places
2. **Search** - Smart filtering
3. **Details** - Travel companion mode
4. **Timeline** - Day-wise itinerary
5. **Personalization** - Recommendations
6. **Admin** - CRUD operations
7. **Mobile** - Responsive design

### Key Talking Points:
- ✨ Modern, professional UI
- 🚀 Optimized performance
- 🧠 Smart recommendations
- 📱 Fully responsive
- 🌙 Dark mode
- 🌍 Multi-language
- 💰 Budget estimation
- 🗺️ Interactive maps

---

## 🎯 Competitive Advantages

1. **Complete Feature Set** - All essential features
2. **Production-Ready** - Clean, scalable code
3. **Modern Stack** - Latest technologies
4. **Performance** - Optimized loading
5. **Professional UI** - Airbnb-style design
6. **Security** - JWT, bcrypt, protected routes
7. **Scalable** - MVC architecture
8. **Well Documented** - Comprehensive guides

---

## 📄 License

MIT License - Free to use for learning and development

---

## 🎉 Acknowledgments

Built with ❤️ for SIH-level demonstration

**Version 2.0.0 - Production Ready**

---

## 📧 Support

For issues or questions:
- Check documentation files
- Review console logs
- Verify database schema
- Check API endpoints

---

**🏆 Ready to Win Hackathons! 🚀**
