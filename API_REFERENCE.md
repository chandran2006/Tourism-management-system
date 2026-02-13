# API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "interests": ["Nature", "Adventure", "Beach"]
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "interests": "Nature,Adventure,Beach"
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "interests": "Nature,Adventure,Beach",
    "role": "user"
  }
}
```

---

## 🏞️ Places Endpoints

### Get All Places
```http
GET /places
Query Parameters (optional):
  - category: string (Nature, Temple, Beach, Food, Adventure, Heritage)
  - location: string
  - search: string

Example: GET /places?category=Beach&location=Goa

Response: 200 OK
[
  {
    "id": 1,
    "name": "Goa Beaches",
    "description": "Beautiful beaches...",
    "category": "Beach",
    "location": "Goa",
    "rating": 4.6,
    "imageUrl": "https://...",
    "latitude": 15.2993,
    "longitude": 74.1240
  }
]
```

### Get Place by ID
```http
GET /places/:id

Example: GET /places/1

Response: 200 OK
{
  "id": 1,
  "name": "Taj Mahal",
  "description": "Iconic white marble...",
  "category": "Heritage",
  "location": "Agra, Uttar Pradesh",
  "rating": 4.8,
  "imageUrl": "https://...",
  "latitude": 27.1751,
  "longitude": 78.0421,
  "reviews": [
    {
      "id": 1,
      "userId": 2,
      "userName": "Jane Doe",
      "rating": 5,
      "comment": "Amazing place!",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Get Places by Category
```http
GET /places/category/:category

Example: GET /places/category/Nature

Response: 200 OK
[
  {
    "id": 5,
    "name": "Kerala Backwaters",
    "category": "Nature",
    ...
  }
]
```

### Get Personalized Recommendations
```http
GET /places/recommendations
Authorization: Bearer {token}

Response: 200 OK
[
  // Places matching user's interests
]
```

### Create Place (Admin Only)
```http
POST /places
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "New Tourist Place",
  "description": "Description here",
  "category": "Nature",
  "location": "City, State",
  "imageUrl": "https://...",
  "latitude": 12.3456,
  "longitude": 78.9012
}

Response: 201 Created
{
  "message": "Place created successfully",
  "id": 21
}
```

### Update Place (Admin Only)
```http
PUT /places/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  ...
}

Response: 200 OK
{
  "message": "Place updated successfully"
}
```

### Delete Place (Admin Only)
```http
DELETE /places/:id
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "message": "Place deleted successfully"
}
```

### Generate Travel Itinerary
```http
POST /places/itinerary
Content-Type: application/json

{
  "city": "Goa",
  "duration": 3
}

Response: 200 OK
{
  "city": "Goa",
  "duration": 3,
  "itinerary": [
    {
      "day": 1,
      "places": [
        {
          "id": 2,
          "name": "Goa Beaches",
          ...
        }
      ],
      "activities": ["Visit Goa Beaches"]
    },
    {
      "day": 2,
      "places": [...],
      "activities": [...]
    }
  ]
}
```

---

## ❤️ Favorites Endpoints

### Get User Favorites
```http
GET /favorites
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "name": "Taj Mahal",
    "category": "Heritage",
    ...
  }
]
```

### Add to Favorites
```http
POST /favorites
Authorization: Bearer {token}
Content-Type: application/json

{
  "placeId": 1
}

Response: 201 Created
{
  "message": "Added to favorites"
}
```

### Remove from Favorites
```http
DELETE /favorites/:placeId
Authorization: Bearer {token}

Example: DELETE /favorites/1

Response: 200 OK
{
  "message": "Removed from favorites"
}
```

---

## ⭐ Reviews Endpoints

### Add Review
```http
POST /reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "placeId": 1,
  "rating": 5,
  "comment": "Amazing place! Must visit."
}

Response: 201 Created
{
  "message": "Review added successfully"
}
```

### Get Reviews for a Place
```http
GET /reviews/:placeId

Example: GET /reviews/1

Response: 200 OK
[
  {
    "id": 1,
    "userId": 2,
    "userName": "John Doe",
    "placeId": 1,
    "rating": 5,
    "comment": "Amazing place!",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## 🔒 Authentication Headers

For protected endpoints, include JWT token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Email already exists"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Place not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Error details"
}
```

---

## 📝 Testing with Postman/Thunder Client

### 1. Register a User
- POST to `/auth/register`
- Copy the token from response

### 2. Set Authorization
- Add header: `Authorization: Bearer {token}`

### 3. Test Protected Routes
- GET `/favorites`
- POST `/favorites`
- GET `/places/recommendations`

### 4. Test Admin Routes
- First, update user role to 'admin' in database
- Login again to get admin token
- POST `/places` (create)
- PUT `/places/:id` (update)
- DELETE `/places/:id` (delete)

---

## 🎯 Quick Test Sequence

1. **Register** → Get token
2. **Login** → Verify token
3. **Get Places** → See all places
4. **Get Place Details** → See specific place
5. **Add Favorite** → Save a place
6. **Get Favorites** → See saved places
7. **Add Review** → Rate a place
8. **Generate Itinerary** → Get travel plan
9. **Admin: Create Place** → Add new place
10. **Admin: Update Place** → Edit place
11. **Admin: Delete Place** → Remove place

---

## 💡 Tips

- Always include `Content-Type: application/json` for POST/PUT requests
- Token expires in 7 days
- Admin role must be set manually in database
- All coordinates are in decimal degrees format
- Ratings must be between 1-5

---

**Happy Testing! 🚀**
