# Score API - Complete Documentation & Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Backend Stack](#backend-stack)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
   - [Authentication & User Management](#-authentication--user-management)
   - [Employee Management](#-employee-management)
   - [Games (Real-time Scores)](#-games-real-time-scores-via-sse)
   - [Threads & Messages](#-threads--messages)
   - [Bot (Intent Detection)](#-bot-intent-detection)
   - [Exercises](#-exercises)
   - [E-commerce (Products, Cart, Orders, Addresses)](#-e-commerce---products)
   - [Recipe Management](#-recipe-management)
5. [Frontend Integration Guide](#frontend-integration-guide)
6. [Data Models](#data-models)
7. [Improvements & Recommendations](#improvements--recommendations)

---

## Overview

**Base URL:** `http://localhost:3000/api`

**API Documentation (Swagger):** `http://localhost:3000/api`

The Score API is a comprehensive backend service built with NestJS that provides functionality for:
- User authentication and management
- Employee CRUD operations
- Real-time game scores (Server-Sent Events)
- Chat threads and messages
- Bot intent detection
- Exercise tracking
- E-commerce features (Products, Cart, Orders, Addresses)
- Recipe Management System (Recipes, Favorites, Ratings, Comments, Image Uploads, Shopping Lists, Categories)

---

## Backend Stack

### Core Framework & Runtime
- **NestJS** (v10.0.2) - Progressive Node.js framework
- **Node.js** (v18.16.9)
- **TypeScript** (v5.4.2)

### Database
- **MongoDB** with Mongoose (v8.13.2)
- **Two Database Connections:**
  - `test` database (default) - for general app features
  - `estore` database - for e-commerce features

### Authentication & Security
- **Passport.js** (v0.7.0) - Authentication middleware
- **JWT** (@nestjs/jwt v11.0.2) - Token-based authentication
- **passport-jwt** (v4.0.1) - JWT strategy for Passport
- **bcrypt** (v6.0.0) - Password hashing

### Validation & Transformation
- **class-validator** (v0.14.3) - DTO validation
- **class-transformer** (v0.5.1) - Object transformation

### Additional Libraries
- **Axios** (v1.6.0) - HTTP client
- **RxJS** (v7.8.0) - Reactive programming
- **UUID** (v11.1.0) - Unique ID generation
- **Multer** (@nestjs/platform-express) - File upload handling

### Development Tools
- **Nx Monorepo** (v19.0.2) - Build system and monorepo management
- **Jest** (v29.4.1) - Testing framework
- **Swagger** (@nestjs/swagger v8.0.5) - API documentation
- **ESLint** & **Prettier** - Code quality and formatting

---

## Authentication

### How Authentication Works

The API uses **JWT (JSON Web Token)** based authentication with a bearer token strategy.

#### Authentication Flow:

1. **Register** a new user → `POST /api/auth/register`
2. **Login** with credentials → `POST /api/auth/login` → Receive JWT token
3. **Use token** in subsequent requests via `Authorization: Bearer <token>` header
4. **Token validation** happens automatically for protected routes
5. **Logout** invalidates the token by adding it to blacklist → `POST /api/auth/logout`

#### JWT Configuration:
- **Secret Key:** `'your-secret-key'` ⚠️ (Should be moved to environment variables)
- **Token Type:** Bearer Token
- **Extraction:** From `Authorization` header
- **Blacklist:** Tokens can be revoked (stored in database)

---

## API Endpoints

### 🔐 Authentication & User Management

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",  // min 6 characters
  "firstName": "John",
  "lastName": "Doe"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

#### Change Password
```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "password": "newPassword123"  // min 6 characters
}

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

#### Update FCM Token (for push notifications)
```
PATCH /api/users/fcm-token
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "fcmToken": "firebase-cloud-messaging-token"
}

Response: 200 OK
{
  "message": "FCM token updated successfully"
}
```

---

### 👥 Employee Management

All employee endpoints are **PUBLIC** (no authentication required).

#### Create Employee
```
POST /api/employees
Content-Type: application/json

Body:
{
  "name": "Jane Smith",
  "position": "Software Engineer",
  "department": "Engineering",
  "salary": 75000
}

Response: 201 Created
```

#### Get All Employees
```
GET /api/employees

Response: 200 OK
[...]
```

#### Get Employee by ID
```
GET /api/employees/:id

Response: 200 OK
```

#### Update Employee
```
PUT /api/employees/:id
Content-Type: application/json

Body:
{
  "name": "Jane Smith",
  "position": "Senior Software Engineer",
  "salary": 85000
}

Response: 200 OK
```

#### Delete Employee
```
DELETE /api/employees/:id

Response: 200 OK
```

---

### 🎮 Games (Real-time Scores via SSE)

#### Start Score Stream (Server-Sent Events)
```
GET /api/games/scores
Accept: text/event-stream

Response: Stream of events every 2 seconds
data: {"game":{"lakers":5,"denver":3}}

data: {"game":{"lakers":8,"denver":7}}

...
```

#### Stop Score Stream
```
POST /api/games/stop

Response: 200 OK
```

---

### 💬 Threads & Messages

**Authentication Required** ✅

#### Get All Threads (for current user)
```
GET /api/threads
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "...",
    "userId": "...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Messages by Thread ID
```
GET /api/messages/:threadId
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "...",
    "threadId": "...",
    "text": "Hello",
    "sender": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 🤖 Bot (Intent Detection)

**Authentication Required** ✅

#### Process Bot Intent
```
POST /api/bot/intent
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "text": "What is the weather today?"
}

Response: 200 OK
{
  "intent": "weather_query",
  "confidence": 0.95
}
```

---

### 💪 Exercises

#### Get Available Exercises (PUBLIC)
```
GET /api/exercises/available

Response: 200 OK
[
  {
    "id": "...",
    "name": "Push-ups",
    "description": "Upper body exercise",
    "category": "strength"
  }
]
```

#### Create Available Exercise (PUBLIC)
```
POST /api/exercises/available
Content-Type: application/json

Body:
{
  "name": "Squats",
  "description": "Lower body exercise",
  "category": "strength",
  "duration": 300
}

Response: 201 Created
```

#### Add Finished Exercise (PROTECTED)
```
POST /api/exercises/finished
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "exerciseId": "507f1f77bcf86cd799439011",
  "duration": 1800,
  "caloriesBurned": 200,
  "date": "2024-01-01T00:00:00.000Z"
}

Response: 201 Created
```

#### Get User's Finished Exercises (PROTECTED)
```
GET /api/exercises/finished
Authorization: Bearer <token>

Response: 200 OK
[...]
```

---

### 🛍️ E-commerce - Products

#### Get All Products (PUBLIC)
```
GET /api/products

Response: 200 OK
{
  "cameras": [...],
  "products": [...],
  "shirts": [...],
  "smartphones": [...],
  "watches": [...]
}
```

#### Search Products (PUBLIC)
```
GET /api/products/search?q=phone

Response: 200 OK
[
  {
    "id": "...",
    "name": "iPhone 15",
    "title": "Latest iPhone model",
    "price": "999.99",
    "image": "https://...",
    "category": "smartphones"
  }
]
```

#### Get Products by Category (PUBLIC)
```
GET /api/products/category/:category
Example: GET /api/products/category/smartphones

Response: 200 OK
[...]
```

#### Get Product by ID (PUBLIC)
```
GET /api/products/:id

Response: 200 OK
{
  "id": "...",
  "name": "iPhone 15",
  "title": "Latest iPhone model",
  "price": "999.99",
  "image": "https://...",
  "category": "smartphones"
}
```

#### Create Product (PUBLIC)
```
POST /api/products
Content-Type: application/json

Body:
{
  "name": "iPhone 15",
  "title": "Latest iPhone model",
  "price": "999.99",
  "image": "https://example.com/iphone15.jpg",
  "category": "smartphones"
}

Response: 201 Created
```

---

### 🛒 Cart Management

**Authentication Required** ✅

#### Get Cart Items
```
GET /api/cart
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "...",
    "productId": "...",
    "quantity": 2,
    "userId": "...",
    "product": {
      "id": "...",
      "name": "iPhone 15",
      "image": "https://...",
      "price": "999.99",
      "title": "Latest iPhone",
      "category": "smartphones"
    }
  }
]
```

#### Get Cart Summary
```
GET /api/cart/summary
Authorization: Bearer <token>

Response: 200 OK
{
  "itemsCount": 3,
  "subTotal": 2599.97,
  "tax": 259.99,
  "delivery": 10.00,
  "grandTotal": 2869.96
}
```

#### Add Item to Cart
```
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}

Response: 201 Created
{
  "message": "Item added to cart successfully",
  "cartItemId": "..."
}
```

#### Update Cart Item Quantity
```
PATCH /api/cart/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "quantity": 5
}

Response: 200 OK
{
  "message": "Cart item updated successfully"
}
```

#### Remove Item from Cart
```
DELETE /api/cart/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Item removed from cart successfully"
}
```

#### Clear Cart
```
DELETE /api/cart
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Cart cleared successfully"
}
```

---

### 📦 Orders

**Authentication Required** ✅

#### Create Order
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "items": [
    {
      "productId": "...",
      "quantity": 2,
      "price": "999.99",
      "name": "iPhone 15",
      "image": "https://..."
    }
  ],
  "total": 2259.98
}

Response: 201 Created
{
  "message": "Order created successfully",
  "orderId": "..."
}
```

#### Preview Order (Calculate totals before placing order)
```
POST /api/orders/preview
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "items": [
    {
      "productId": "...",
      "quantity": 2,
      "price": "999.99",
      "name": "iPhone 15",
      "image": "https://..."
    }
  ]
}

Response: 200 OK
{
  "items": [...],
  "subTotal": 1999.98,
  "tax": 199.99,
  "delivery": 10.00,
  "grandTotal": 2209.97
}
```

#### Get All Orders
```
GET /api/orders
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "...",
    "items": [...],
    "total": 2209.97,
    "date": "2024-01-01T00:00:00.000Z",
    "status": "pending"
  }
]
```

#### Get Order by ID
```
GET /api/orders/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "...",
  "items": [...],
  "total": 2209.97,
  "date": "2024-01-01T00:00:00.000Z",
  "status": "pending"
}
```

---

### 📍 Addresses

**Authentication Required** ✅

#### Create Address
```
POST /api/addresses
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "isDefault": true
}

Response: 201 Created
{
  "id": "...",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "isDefault": true,
  "userId": "..."
}
```

#### Get All Addresses
```
GET /api/addresses
Authorization: Bearer <token>

Response: 200 OK
[...]
```

#### Get Address by ID
```
GET /api/addresses/:id
Authorization: Bearer <token>

Response: 200 OK
{...}
```

#### Update Address
```
PUT /api/addresses/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "street": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "country": "USA",
  "isDefault": false
}

Response: 200 OK
{...}
```

#### Delete Address
```
DELETE /api/addresses/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Address deleted successfully"
}
```

---

### 🍳 Recipe Management

#### Get All Recipes (with Pagination, Search, Filtering)
```
GET /api/recipes
Query Parameters (all optional):
  - page: number (default: 1)
  - limit: number (default: 10)
  - search: string (searches in title, description, ingredients)
  - category: string (filter by category)
  - difficulty: string ("easy" | "medium" | "hard")
  - minPrepTime: number (minutes)
  - maxPrepTime: number (minutes)

Example: GET /api/recipes?page=1&limit=10&search=pasta&difficulty=easy

Response: 200 OK
{
  "recipes": [
    {
      "id": "...",
      "title": "Classic Pasta Carbonara",
      "description": "Traditional Italian pasta dish",
      "ingredients": [
        {
          "name": "Spaghetti",
          "quantity": "400",
          "unit": "g"
        },
        {
          "name": "Eggs",
          "quantity": "4",
          "unit": "pieces"
        }
      ],
      "instructions": "1. Boil pasta... 2. Mix eggs...",
      "prepTime": 30,
      "cookTime": 15,
      "servings": 4,
      "difficulty": "easy",
      "category": "Italian",
      "imageUrl": "http://localhost:3000/uploads/recipes/abc-123.jpg",
      "authorId": "...",
      "averageRating": 4.5,
      "totalRatings": 12,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

#### Get Recipe by ID
```
GET /api/recipes/:id

Response: 200 OK
{
  "id": "...",
  "title": "Classic Pasta Carbonara",
  "description": "Traditional Italian pasta dish",
  "ingredients": [...],
  "instructions": "...",
  "prepTime": 30,
  "cookTime": 15,
  "servings": 4,
  "difficulty": "easy",
  "category": "Italian",
  "imageUrl": "http://localhost:3000/uploads/recipes/abc-123.jpg",
  "authorId": "...",
  "averageRating": 4.5,
  "totalRatings": 12,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Create Recipe (PROTECTED)
```
POST /api/recipes
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "title": "Classic Pasta Carbonara",
  "description": "Traditional Italian pasta dish",
  "ingredients": [
    {
      "name": "Spaghetti",
      "quantity": "400",
      "unit": "g"
    },
    {
      "name": "Eggs",
      "quantity": "4",
      "unit": "pieces"
    }
  ],
  "instructions": "1. Boil pasta in salted water. 2. Mix eggs with cheese...",
  "prepTime": 30,
  "cookTime": 15,
  "servings": 4,
  "difficulty": "easy",
  "category": "Italian",
  "imageUrl": "http://localhost:3000/uploads/recipes/abc-123.jpg"
}

Response: 201 Created
{...recipe object...}
```

#### Update Recipe (PROTECTED - Author Only)
```
PATCH /api/recipes/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "title": "Updated Classic Pasta Carbonara",
  "prepTime": 25,
  "servings": 6
}

Response: 200 OK
{...updated recipe object...}
```

#### Delete Recipe (PROTECTED - Author Only)
```
DELETE /api/recipes/:id
Authorization: Bearer <token>

Response: 200 OK
```

---

### ❤️ Recipe Favorites

**Authentication Required** ✅

#### Add Recipe to Favorites
```
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "recipeId": "507f1f77bcf86cd799439011"
}

Response: 201 Created
{
  "id": "...",
  "userId": "...",
  "recipeId": "...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get User's Favorite Recipes
```
GET /api/favorites
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "...",
    "userId": "...",
    "recipe": {
      "id": "...",
      "title": "Classic Pasta Carbonara",
      "description": "...",
      "imageUrl": "...",
      "difficulty": "easy",
      "prepTime": 30,
      "cookTime": 15
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Remove Recipe from Favorites
```
DELETE /api/favorites/:recipeId
Authorization: Bearer <token>

Response: 200 OK
```

#### Check if Recipe is Favorited
```
GET /api/favorites/check/:recipeId
Authorization: Bearer <token>

Response: 200 OK
{
  "isFavorite": true
}
```

---

### ⭐ Recipe Ratings

**Authentication Required** ✅

#### Rate a Recipe (1-5 stars)
```
POST /api/ratings
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "recipeId": "507f1f77bcf86cd799439011",
  "rating": 5
}

Response: 201 Created
{
  "id": "...",
  "userId": "...",
  "recipeId": "...",
  "rating": 5,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update Recipe Rating
```
PATCH /api/ratings
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "recipeId": "507f1f77bcf86cd799439011",
  "rating": 4
}

Response: 200 OK
{
  "id": "...",
  "userId": "...",
  "recipeId": "...",
  "rating": 4,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get User's Rating for a Recipe
```
GET /api/ratings/:recipeId
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "...",
  "userId": "...",
  "recipeId": "...",
  "rating": 5,
  "createdAt": "2024-01-01T00:00:00.000Z"
}

Response: 404 Not Found (if user hasn't rated the recipe)
```

#### Get Recipe Average Rating
```
GET /api/ratings/:recipeId/average

Response: 200 OK
{
  "recipeId": "...",
  "averageRating": 4.5,
  "totalRatings": 12
}
```

#### Delete Recipe Rating
```
DELETE /api/ratings/:recipeId
Authorization: Bearer <token>

Response: 200 OK
```

---

### 💬 Recipe Comments

**Authentication Required** ✅

#### Add Comment to Recipe
```
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "recipeId": "507f1f77bcf86cd799439011",
  "text": "This recipe is amazing! Made it last night."
}

Response: 201 Created
{
  "id": "...",
  "recipeId": "...",
  "userId": "...",
  "text": "This recipe is amazing! Made it last night.",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get Comments for a Recipe
```
GET /api/comments/:recipeId

Response: 200 OK
[
  {
    "id": "...",
    "recipeId": "...",
    "userId": "...",
    "userEmail": "user@example.com",
    "text": "This recipe is amazing!",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Delete Comment (PROTECTED - Author Only)
```
DELETE /api/comments/:id
Authorization: Bearer <token>

Response: 200 OK

Note: Only the comment author can delete their own comments.
Returns 403 Forbidden if attempting to delete another user's comment.
```

---

### 📸 Recipe Image Uploads

**Authentication Required** ✅

#### Upload Recipe Image
```
POST /api/uploads/recipe-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  - image: File (max 5MB, types: image/jpeg, image/png, image/gif)

Response: 201 Created
{
  "imageUrl": "http://localhost:3000/uploads/recipes/abc-123-uuid.jpg"
}

Errors:
- 400 Bad Request: "No image file provided" or "Invalid file type"
- 400 Bad Request: File too large (>5MB)
```

**Note:** Images are stored in `./uploads/recipes/` directory and served as static files at `/uploads/recipes/`.

---

### 🛒 Shopping Lists

**Authentication Required** ✅

#### Get User's Shopping List
```
GET /api/shopping-list
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "...",
    "userId": "...",
    "itemName": "Spaghetti",
    "quantity": "400g",
    "category": "Pasta",
    "isChecked": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "...",
    "userId": "...",
    "itemName": "Eggs",
    "quantity": "12",
    "category": "Dairy",
    "isChecked": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]

Note: Items are sorted with unchecked items first, then by creation date.
```

#### Add Item to Shopping List
```
POST /api/shopping-list
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "itemName": "Parmesan Cheese",
  "quantity": "200g",
  "category": "Dairy"
}

Response: 201 Created
{
  "id": "...",
  "userId": "...",
  "itemName": "Parmesan Cheese",
  "quantity": "200g",
  "category": "Dairy",
  "isChecked": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update Shopping List Item
```
PATCH /api/shopping-list/:id
Authorization: Bearer <token>
Content-Type: application/json

Body (all fields optional):
{
  "itemName": "Fresh Parmesan Cheese",
  "quantity": "250g",
  "category": "Dairy",
  "isChecked": true
}

Response: 200 OK
{...updated item...}
```

#### Delete Shopping List Item
```
DELETE /api/shopping-list/:id
Authorization: Bearer <token>

Response: 200 OK
```

#### Get Shopping List Stats
```
GET /api/shopping-list/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "totalItems": 10,
  "checkedItems": 3,
  "uncheckedItems": 7
}
```

#### Clear All Checked Items
```
DELETE /api/shopping-list/checked
Authorization: Bearer <token>

Response: 200 OK
{
  "deletedCount": 3
}
```

---

### 🏷️ Recipe Categories

#### Get All Categories (PUBLIC)
```
GET /api/recipe-categories

Response: 200 OK
[
  {
    "id": "...",
    "name": "Italian",
    "description": "Traditional Italian cuisine",
    "icon": "🇮🇹",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "...",
    "name": "Mexican",
    "description": "Authentic Mexican dishes",
    "icon": "🌮",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]

Note: Categories are sorted alphabetically by name.
```

#### Create Category (PUBLIC)
```
POST /api/recipe-categories
Content-Type: application/json

Body:
{
  "name": "Japanese",
  "description": "Traditional Japanese cuisine",
  "icon": "🍣"
}

Response: 201 Created
{
  "id": "...",
  "name": "Japanese",
  "description": "Traditional Japanese cuisine",
  "icon": "🍣",
  "createdAt": "2024-01-01T00:00:00.000Z"
}

Errors:
- 409 Conflict: "Category with this name already exists" (if duplicate name)
```

#### Delete Category (PUBLIC)
```
DELETE /api/recipe-categories/:id

Response: 200 OK
```

---

## Frontend Integration Guide

### 1. Authentication Setup

#### Install HTTP Client (if using React/Vue/Angular)

**For React:**
```bash
npm install axios
```

**For Angular:**
```bash
# HttpClient is built-in, just import it
```

#### Create Authentication Service

**React Example (axios):**

```javascript
// services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 (token expired/invalid)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register
  register: async (email, password, firstName, lastName) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    // Save token
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    // Save token
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

export default apiClient;
```

**Angular Example (HttpClient):**

```typescript
// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const API_BASE_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(email: string, password: string, firstName: string, lastName: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      firstName,
      lastName
    }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
      })
    );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('access_token');
    return this.http.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      tap(() => {
        localStorage.removeItem('access_token');
      })
    );
  }

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('access_token');
    return this.http.get(`${API_BASE_URL}/auth/me`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

// Create HTTP Interceptor for automatic token injection
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}
```

### 2. API Service Examples

#### Products Service

```javascript
// services/productService.js
import apiClient from './authService';

export const productService = {
  // Get all products
  getAllProducts: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await apiClient.get(`/products/search?q=${query}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
};
```

#### Cart Service

```javascript
// services/cartService.js
import apiClient from './authService';

export const cartService = {
  // Get cart items
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  // Get cart summary
  getCartSummary: async () => {
    const response = await apiClient.get('/cart/summary');
    return response.data;
  },

  // Add to cart
  addToCart: async (productId, quantity) => {
    const response = await apiClient.post('/cart', {
      productId,
      quantity,
    });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (cartItemId, quantity) => {
    const response = await apiClient.patch(`/cart/${cartItemId}`, {
      quantity,
    });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (cartItemId) => {
    const response = await apiClient.delete(`/cart/${cartItemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await apiClient.delete('/cart');
    return response.data;
  },
};
```

#### Order Service

```javascript
// services/orderService.js
import apiClient from './authService';

export const orderService = {
  // Create order
  createOrder: async (items, total) => {
    const response = await apiClient.post('/orders', {
      items,
      total,
    });
    return response.data;
  },

  // Preview order
  previewOrder: async (items) => {
    const response = await apiClient.post('/orders/preview', {
      items,
    });
    return response.data;
  },

  // Get all orders
  getOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },
};
```

#### Recipe Service

```javascript
// services/recipeService.js
import apiClient from './authService';

export const recipeService = {
  // Get all recipes with optional filters
  getRecipes: async (params = {}) => {
    const response = await apiClient.get('/recipes', { params });
    return response.data;
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    const response = await apiClient.get(`/recipes/${id}`);
    return response.data;
  },

  // Create recipe
  createRecipe: async (recipeData) => {
    const response = await apiClient.post('/recipes', recipeData);
    return response.data;
  },

  // Update recipe
  updateRecipe: async (id, updates) => {
    const response = await apiClient.patch(`/recipes/${id}`, updates);
    return response.data;
  },

  // Delete recipe
  deleteRecipe: async (id) => {
    const response = await apiClient.delete(`/recipes/${id}`);
    return response.data;
  },

  // Upload recipe image
  uploadRecipeImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await apiClient.post('/uploads/recipe-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
```

#### Favorites Service

```javascript
// services/favoritesService.js
import apiClient from './authService';

export const favoritesService = {
  // Get user's favorites
  getFavorites: async () => {
    const response = await apiClient.get('/favorites');
    return response.data;
  },

  // Add to favorites
  addToFavorites: async (recipeId) => {
    const response = await apiClient.post('/favorites', { recipeId });
    return response.data;
  },

  // Remove from favorites
  removeFromFavorites: async (recipeId) => {
    const response = await apiClient.delete(`/favorites/${recipeId}`);
    return response.data;
  },

  // Check if recipe is favorited
  checkFavorite: async (recipeId) => {
    const response = await apiClient.get(`/favorites/check/${recipeId}`);
    return response.data;
  },
};
```

#### Ratings Service

```javascript
// services/ratingsService.js
import apiClient from './authService';

export const ratingsService = {
  // Rate a recipe
  rateRecipe: async (recipeId, rating) => {
    const response = await apiClient.post('/ratings', { recipeId, rating });
    return response.data;
  },

  // Update rating
  updateRating: async (recipeId, rating) => {
    const response = await apiClient.patch('/ratings', { recipeId, rating });
    return response.data;
  },

  // Get user's rating for a recipe
  getUserRating: async (recipeId) => {
    const response = await apiClient.get(`/ratings/${recipeId}`);
    return response.data;
  },

  // Get average rating
  getAverageRating: async (recipeId) => {
    const response = await apiClient.get(`/ratings/${recipeId}/average`);
    return response.data;
  },

  // Delete rating
  deleteRating: async (recipeId) => {
    const response = await apiClient.delete(`/ratings/${recipeId}`);
    return response.data;
  },
};
```

#### Shopping List Service

```javascript
// services/shoppingListService.js
import apiClient from './authService';

export const shoppingListService = {
  // Get shopping list
  getShoppingList: async () => {
    const response = await apiClient.get('/shopping-list');
    return response.data;
  },

  // Add item
  addItem: async (itemData) => {
    const response = await apiClient.post('/shopping-list', itemData);
    return response.data;
  },

  // Update item
  updateItem: async (id, updates) => {
    const response = await apiClient.patch(`/shopping-list/${id}`, updates);
    return response.data;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await apiClient.delete(`/shopping-list/${id}`);
    return response.data;
  },

  // Get stats
  getStats: async () => {
    const response = await apiClient.get('/shopping-list/stats');
    return response.data;
  },

  // Clear checked items
  clearChecked: async () => {
    const response = await apiClient.delete('/shopping-list/checked');
    return response.data;
  },
};
```

### 3. Real-time Game Scores (SSE)

```javascript
// Example: Consuming Server-Sent Events
const startGameScores = () => {
  const eventSource = new EventSource('http://localhost:3000/api/games/scores');

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Scores:', data.game);
    // Update UI with scores
    // data.game.lakers
    // data.game.denver
  };

  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    eventSource.close();
  };

  return eventSource;
};

const stopGameScores = async (eventSource) => {
  eventSource.close();
  await apiClient.post('/games/stop');
};

// Usage:
const eventSource = startGameScores();
// Later...
// stopGameScores(eventSource);
```

### 4. Protected Routes (Route Guards)

**React Example (with React Router):**

```javascript
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Usage in routes:
<Route path="/cart" element={
  <ProtectedRoute>
    <CartPage />
  </ProtectedRoute>
} />
```

**Angular Example (Route Guard):**

```typescript
// guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

// Usage in routes:
const routes: Routes = [
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  }
];
```

### 5. Environment Configuration

**Development:**
```javascript
// config/environment.js
export const environment = {
  apiUrl: 'http://localhost:3000/api',
  production: false,
};
```

**Production:**
```javascript
export const environment = {
  apiUrl: 'https://your-production-domain.com/api',
  production: true,
};
```

---

## Data Models

### User Schema
```typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  firstName: string,
  lastName: string,
  fcmToken?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Employee Schema
```typescript
{
  _id: ObjectId,
  name: string,
  position: string,
  department: string,
  salary: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```typescript
{
  _id: ObjectId,
  name: string,
  title: string,
  price: string,
  image: string,
  category: string ('cameras' | 'products' | 'shirts' | 'smartphones' | 'watches'),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Item Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  productId: ObjectId (ref: Product),
  quantity: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: string,
    quantity: number,
    price: string,
    name: string,
    image: string
  }],
  total: number,
  status: string ('pending' | 'processing' | 'shipped' | 'delivered'),
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Address Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  street: string,
  city: string,
  state: string,
  zipCode: string,
  country: string,
  isDefault: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Exercise Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  exerciseId: ObjectId (ref: AvailableExercise),
  duration: number (seconds),
  caloriesBurned: number,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Thread Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Message Schema
```typescript
{
  _id: ObjectId,
  threadId: ObjectId (ref: Thread),
  text: string,
  sender: string ('user' | 'bot'),
  createdAt: Date,
  updatedAt: Date
}
```

### Recipe Schema
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  ingredients: [{
    name: string,
    quantity: string,
    unit: string
  }],
  instructions: string,
  prepTime: number (minutes),
  cookTime: number (minutes),
  servings: number,
  difficulty: string ('easy' | 'medium' | 'hard'),
  category: string,
  imageUrl?: string,
  authorId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Favorite Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  recipeId: ObjectId (ref: Recipe),
  createdAt: Date,
  updatedAt: Date
}
// Unique compound index on (userId, recipeId)
```

### Rating Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  recipeId: ObjectId (ref: Recipe),
  rating: number (1-5),
  createdAt: Date,
  updatedAt: Date
}
// Unique compound index on (userId, recipeId)
```

### Comment Schema
```typescript
{
  _id: ObjectId,
  recipeId: ObjectId (ref: Recipe),
  userId: ObjectId (ref: User),
  text: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Shopping List Item Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  itemName: string,
  quantity?: string,
  category?: string,
  isChecked: boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Recipe Category Schema
```typescript
{
  _id: ObjectId,
  name: string (unique),
  description?: string,
  icon?: string,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Improvements & Recommendations

### 🔒 Security Enhancements

1. **Environment Variables:**
   - Move JWT secret to `.env` file
   - Create `.env.example` template
   ```env
   MONGODB_URI=mongodb://localhost:27017/test
   MONGODB_ESTORE_URI=mongodb://localhost:27017/estore
   JWT_SECRET=your-super-secure-secret-key-here
   JWT_EXPIRATION=24h
   PORT=3000
   ```

2. **JWT Token Expiration:**
   - Currently no expiration is set
   - Add token expiration (e.g., 24h, 7d)
   - Implement refresh tokens for better security

3. **Rate Limiting:**
   - Add `@nestjs/throttler` to prevent brute force attacks
   ```bash
   npm install @nestjs/throttler
   ```

4. **CORS Configuration:**
   - Currently allows all origins (`app.enableCors()`)
   - Restrict to specific frontend domains in production
   ```typescript
   app.enableCors({
     origin: ['http://localhost:4200', 'https://your-frontend.com'],
     credentials: true,
   });
   ```

5. **Helmet.js:**
   - Add security headers
   ```bash
   npm install helmet
   ```

6. **Input Sanitization:**
   - Add input sanitization for MongoDB queries to prevent NoSQL injection

### 📝 Documentation Improvements

1. **Swagger Annotations:**
   - Add more detailed Swagger decorators for better API documentation
   ```typescript
   @ApiTags('products')
   @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
   ```

2. **README Updates:**
   - Add setup instructions
   - Add database seeding instructions
   - Add testing instructions

### 🏗️ Architecture Improvements

1. **Error Handling:**
   - Implement global exception filter
   - Standardize error response format
   ```typescript
   {
     statusCode: 400,
     message: "Validation failed",
     errors: [...],
     timestamp: "2024-01-01T00:00:00.000Z",
     path: "/api/cart"
   }
   ```

2. **Logging:**
   - Implement structured logging (Winston or Pino)
   - Log all authentication attempts
   - Log all errors with context

3. **Pagination:**
   - Add pagination to list endpoints (products, orders, etc.)
   ```typescript
   GET /api/products?page=1&limit=20
   ```

4. **Filtering & Sorting:**
   - Add query parameters for filtering
   ```typescript
   GET /api/orders?status=pending&sortBy=date&order=desc
   ```

5. **Response Standardization:**
   - Wrap all responses in standard format
   ```typescript
   {
     success: true,
     data: {...},
     message: "Success",
     timestamp: "2024-01-01T00:00:00.000Z"
   }
   ```

### 🧪 Testing

1. **Unit Tests:**
   - Add unit tests for services
   - Current test files exist but need implementation

2. **E2E Tests:**
   - Implement end-to-end tests for critical flows
   - Test authentication flow
   - Test e-commerce checkout flow

3. **Integration Tests:**
   - Test database operations
   - Test external API integrations (if any)

### 🚀 Performance Optimizations

1. **Database Indexes:**
   - Add indexes on frequently queried fields
   ```typescript
   @Schema({ timestamps: true })
   export class Product {
     @Prop({ index: true })
     category: string;

     @Prop({ index: 'text' })
     name: string;
   }
   ```

2. **Caching:**
   - Implement Redis caching for frequently accessed data
   - Cache product lists
   - Cache user sessions

3. **Database Query Optimization:**
   - Use `lean()` for read-only queries
   - Use `select()` to fetch only needed fields
   - Implement virtual populate for better performance

### 📊 Monitoring & Observability

1. **Health Check Endpoint:**
   ```typescript
   GET /api/health
   Response: { status: "ok", database: "connected", uptime: 12345 }
   ```

2. **Metrics:**
   - Add request duration tracking
   - Track failed login attempts
   - Monitor database query performance

### 🔄 Additional Features

1. **Password Reset Flow:**
   - Add forgotten password endpoint
   - Implement email verification
   - Add password reset token functionality

2. **Email Notifications:**
   - Order confirmation emails
   - Password reset emails
   - Implement with Nodemailer or SendGrid

3. **File Uploads:**
   - Add multer for file uploads
   - Support product image uploads
   - Support user profile pictures

4. **Payment Integration:**
   - Integrate Stripe/PayPal for actual payment processing
   - Add payment status tracking

5. **Inventory Management:**
   - Add stock tracking to products
   - Prevent ordering out-of-stock items
   - Low stock notifications

6. **Order Status Updates:**
   - Add ability to update order status
   - Implement order tracking
   - Send status update notifications

7. **Reviews & Ratings:**
   - Add product reviews
   - Implement rating system
   - Average rating calculation

8. **Wishlist:**
   - Add wishlist functionality
   - Allow users to save products for later

### 🐳 DevOps

1. **Docker:**
   - Create Dockerfile
   - Create docker-compose.yml for easy setup

2. **CI/CD:**
   - Set up GitHub Actions or GitLab CI
   - Automated testing on push
   - Automated deployment

3. **Environment Management:**
   - Separate configs for dev/staging/production
   - Use environment-specific database connections

---

## Quick Start Checklist for Frontend Developers

- [ ] Install frontend dependencies (axios/http-client)
- [ ] Set up environment configuration with API base URL
- [ ] Create authentication service with token management
- [ ] Implement axios/HTTP interceptors for automatic token injection
- [ ] Create protected route guards
- [ ] Implement login/register pages
- [ ] Store JWT token in localStorage (or httpOnly cookies for better security)
- [ ] Handle 401 responses globally (redirect to login)
- [ ] Implement logout functionality
- [ ] Create service files for each API module (products, cart, orders, etc.)
- [ ] Test authentication flow
- [ ] Implement error handling UI (toasts/notifications)
- [ ] Test all protected routes
- [ ] Implement loading states during API calls
- [ ] Add API call retry logic (optional)
- [ ] Set up SSE for real-time features (games scores)
- [ ] Implement recipe image upload with multipart/form-data
- [ ] Add recipe search and filtering
- [ ] Implement favorites and ratings UI
- [ ] Create shopping list management interface

---

## Recipe Management Features

### Key Features Implemented:

1. **Recipe CRUD Operations**
   - Create, read, update, delete recipes
   - Author-only edit/delete permissions
   - Rich recipe data with ingredients, instructions, prep/cook times

2. **Advanced Search & Filtering**
   - Full-text search across titles, descriptions, and ingredients
   - Filter by category, difficulty, and prep time range
   - Pagination support for large datasets
   - MongoDB text indexes for optimized search performance

3. **Social Features**
   - User favorites with quick add/remove
   - 1-5 star rating system with average calculations
   - Comment system with author-only deletion
   - Automatic rating aggregation on recipe queries

4. **Media Management**
   - Recipe image uploads (up to 5MB)
   - File type validation (JPEG, PNG, GIF)
   - Static file serving at `/uploads/recipes/`
   - UUID-based unique filenames

5. **Shopping List**
   - Personal shopping lists per user
   - Item categorization and quantity tracking
   - Check/uncheck items
   - Bulk delete checked items
   - Shopping statistics (total, checked, unchecked)

6. **Category Management**
   - Organize recipes by cuisine/type
   - Visual icons for categories
   - Alphabetical sorting
   - Unique category names with conflict detection

### Database Optimizations:

- **Recipe Schema**: 5 indexes (text search, category, difficulty, authorId, createdAt)
- **Favorites/Ratings**: Compound unique indexes to prevent duplicates
- **Shopping List**: User-based isolation with efficient sorting
- Uses `estore` MongoDB database connection

---

## Support & Contact

For questions or issues with the API:
- Check Swagger documentation: `http://localhost:3000/api`
- Review this documentation
- Check error messages in API responses
- Verify authentication token is being sent correctly
- Ensure Content-Type headers are correct

---

**Last Updated:** March 2026
**Version:** 1.0.0
**API Base URL:** `http://localhost:3000/api`
