# Score API - Complete Documentation & Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Backend Stack](#backend-stack)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
   - [Authentication & User Management](#-authentication--user-management)
   - [Profile](#-profile)
   - [Employee Management](#-employee-management)
   - [Games (Real-time Scores)](#-games-real-time-scores-via-sse)
   - [Threads & Messages](#-threads--messages)
   - [Bot (Intent Detection)](#-bot-intent-detection)
   - [Exercises](#-exercises)
   - [Workout Plans](#-workout-plans)
   - [Goals](#-goals)
   - [E-commerce (Products, Cart, Orders, Addresses)](#-e-commerce---products)
   - [Meals](#-meals)
   - [Recipe Management](#-recipe-management)
5. [curl Examples](#curl-examples)
6. [Frontend Integration Guide](#frontend-integration-guide)
7. [Data Models](#data-models)
8. [Environment & Config Notes](#environment--config-notes)
9. [Improvements & Recommendations](#improvements--recommendations)

---

## Overview

**Base URL:** `http://localhost:3000/api`

**Swagger UI:** `http://localhost:3000/docs`

The Score API is a comprehensive backend service built with NestJS that provides functionality for:
- User authentication and management
- Employee CRUD operations
- Real-time game scores (Server-Sent Events)
- Chat threads and messages
- Bot intent detection
- Exercise tracking (available exercises, finished exercises, stats, weekly/monthly summaries)
- Workout plan management
- Weekly goal tracking
- E-commerce features (Products, Cart, Orders, Addresses)
- Meal catalog
- Recipe Management System (Recipes, Favorites, Ratings, Comments, Image Uploads, Shopping Lists, Categories)

---

## Backend Stack

### Core Framework & Runtime
- **NestJS** - Progressive Node.js framework
- **Node.js** - JavaScript runtime
- **TypeScript** - Typed JavaScript

### Database
- **MongoDB** with Mongoose (v8+)
- **Multiple Database Connections:**
  - `test` database (default) – general app features (auth, employees, exercises, threads, messages, bot)
  - `estore` database – e-commerce features (products, cart, orders, addresses)
  - `recipes` database – recipe management system
  - `meals` database – meal catalog

### Authentication & Security
- **Passport.js** – Authentication middleware
- **JWT** (`@nestjs/jwt`) – Token-based authentication
- **passport-jwt** – JWT strategy for Passport
- **bcrypt** – Password hashing

### Validation & Transformation
- **class-validator** – DTO validation
- **class-transformer** – Object transformation

### Additional Libraries
- **RxJS** – Reactive programming (SSE)
- **UUID** – Unique ID generation for uploaded file names
- **Multer** (`@nestjs/platform-express`) – File upload handling

### Development Tools
- **Nx Monorepo** – Build system and monorepo management
- **Jest** – Testing framework
- **Swagger** (`@nestjs/swagger`) – API documentation (served at `/docs`)
- **ESLint** & **Prettier** – Code quality and formatting

---

## Authentication

### How Authentication Works

The API uses **JWT (JSON Web Token)** based authentication with a bearer token strategy.

#### Authentication Flow:

1. **Register** a new user → `POST /api/auth/register`
2. **Login** with credentials → `POST /api/auth/login` → Receive JWT token
3. **Use token** in subsequent requests via `Authorization: Bearer <token>` header
4. **Token validation** happens automatically for protected routes
5. **Logout** invalidates the token by adding it to a database blacklist → `POST /api/auth/logout`

#### JWT Configuration:
- **Secret Key:** Read from the `JWT_SECRET` environment variable (see `.env.example`)
- **Token Expiration:** Read from the `JWT_EXPIRATION` environment variable (default: `24h`)
- **Token Type:** Bearer Token
- **Extraction:** From `Authorization` header
- **Blacklist:** Tokens are revoked at logout and stored in the database; subsequent requests with a blacklisted token return `401 Unauthorized`

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

Note: The token is added to a blacklist in the database and becomes invalid immediately.
```

#### Change Password
```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "password": "newPassword123"  // min 6 characters (the new password)
}

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

#### Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}

Response: 200 OK
{
  "message": "Password reset email sent"  // or similar; exact message from service
}
```

#### Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

Body:
{
  "token": "<reset-token-from-email>",
  "newPassword": "newSecurePass123"  // min 6 characters
}

Response: 200 OK
{
  "message": "Password reset successfully"
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

### 👤 Profile

**Authentication Required** ✅

#### Get Profile
```
GET /api/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Update Profile
```
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

Body (all fields optional):
{
  "firstName": "Jane",
  "lastName": "Smith"
}

Response: 200 OK
{
  "id": "...",
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

#### Change Profile Password
```
PUT /api/profile/password
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePass123"  // min 6 characters
}

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

---

### 👥 Employee Management

All employee endpoints are **PUBLIC** (no authentication required).

The Employee schema is flexible and accepts partial data. Common fields include:

#### Create Employee
```
POST /api/employees
Content-Type: application/json

Body (all fields optional; pass any Employee fields you need):
{
  "id": "EMP001",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "salary": 75000,
  "age": 30
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "EMP001",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "salary": 75000,
  ...
}
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
{...}
```

#### Update Employee
```
PUT /api/employees/:id
Content-Type: application/json

Body (partial Employee fields):
{
  "salary": 85000
}

Response: 200 OK
{...}
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
  "intent": "weather",   // "weather" | "currency" | "joke" | "unknown"
  "response": "Here is the current weather...",
  "data": {...}          // optional extra data depending on intent
}
```

---

### 💪 Exercises

**All exercise endpoints require authentication** ✅

#### Get Available Exercises
```
GET /api/exercises/available
Authorization: Bearer <token>
Query Parameters (optional):
  - category: string ("Cardio" | "Strength" | "Flexibility" | "HIIT" | "Other")
  - difficulty: string ("Beginner" | "Intermediate" | "Advanced")

Response: 200 OK
[
  {
    "id": "...",
    "name": "Push-ups",
    "duration": 600,
    "calories": 50,
    "category": "Strength",
    "difficulty": "Beginner",
    "userId": null
  }
]
```

#### Create Available Exercise
```
POST /api/exercises/available
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "Squats",
  "duration": 600,
  "calories": 60,
  "category": "Strength",      // optional: "Cardio"|"Strength"|"Flexibility"|"HIIT"|"Other"
  "difficulty": "Beginner"     // optional: "Beginner"|"Intermediate"|"Advanced"
}

Response: 201 Created
{...exercise object...}
```

#### Delete Available Exercise
```
DELETE /api/exercises/available/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Exercise deleted successfully"
}
```

#### Add Finished Exercise
```
POST /api/exercises/finished
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "Morning Run",
  "duration": 1800,           // seconds
  "calories": 200,
  "date": "2024-01-01T00:00:00.000Z",
  "state": "completed"        // "completed" | "cancelled"
}

Response: 201 Created
{...finished exercise object...}
```

#### Get User's Finished Exercises
```
GET /api/exercises/finished
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "...",
    "name": "Morning Run",
    "duration": 1800,
    "calories": 200,
    "date": "2024-01-01T00:00:00.000Z",
    "state": "completed",
    "userId": "..."
  }
]
```

#### Get Finished Exercise Stats
```
GET /api/exercises/finished/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "totalSessions": 15,
  "totalCalories": 3200,
  "totalDuration": 27000,
  "streakDays": 5,
  "completionRate": 0.93
}
```

#### Get Finished Exercises Summary
```
GET /api/exercises/finished/summary
Authorization: Bearer <token>
Query Parameters (optional):
  - groupBy: "week" | "month"  (default: "week")

Response: 200 OK
[
  {
    "period": "2024-W01",
    "totalSessions": 5,
    "totalCalories": 800,
    "totalDuration": 9000
  }
]
```

#### Update Finished Exercise
```
PUT /api/exercises/finished/:id
Authorization: Bearer <token>
Content-Type: application/json

Body (all fields optional):
{
  "name": "Evening Run",
  "duration": 2100,
  "calories": 230,
  "state": "completed"
}

Response: 200 OK
{...updated exercise object...}
```

#### Delete Finished Exercise
```
DELETE /api/exercises/finished/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Exercise record deleted successfully"
}
```

---

### 🏋️ Workout Plans

**Authentication Required** ✅

#### List Workout Plans
```
GET /api/workout-plans
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "...",
    "userId": "...",
    "name": "Morning Routine",
    "exerciseIds": ["...", "..."],
    "isTemplate": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create Workout Plan
```
POST /api/workout-plans
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "Morning Routine",
  "exerciseIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "isTemplate": false   // optional, default false
}

Response: 201 Created
{...workout plan object...}
```

#### Update Workout Plan
```
PUT /api/workout-plans/:id
Authorization: Bearer <token>
Content-Type: application/json

Body (all fields optional):
{
  "name": "Updated Routine",
  "exerciseIds": ["..."],
  "isTemplate": true
}

Response: 200 OK
{...updated workout plan object...}
```

#### Delete Workout Plan
```
DELETE /api/workout-plans/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Workout plan deleted successfully"
}
```

---

### 🎯 Goals

**Authentication Required** ✅

Weekly fitness goals per user. Calling `POST /api/goals` when a goal already exists for the current week will upsert (update) it.

#### Set / Update Weekly Goal
```
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

Body (all fields optional):
{
  "targetSessions": 5,
  "targetCalories": 2000,
  "targetMinutes": 300
}

Response: 201 Created (or 200 OK on upsert)
{
  "id": "...",
  "userId": "...",
  "weekStart": "2024-01-01T00:00:00.000Z",
  "targetSessions": 5,
  "targetCalories": 2000,
  "targetMinutes": 300
}
```

#### Get Current Weekly Goal
```
GET /api/goals/current
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "...",
  "userId": "...",
  "weekStart": "2024-01-01T00:00:00.000Z",
  "targetSessions": 5,
  "targetCalories": 2000,
  "targetMinutes": 300
}
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
  "fullName": "John Doe",
  "phone": "+1-555-0100",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",   // optional
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "country": "USA",
  "isDefault": true           // optional, default false
}

Response: 201 Created
{
  "id": "...",
  "fullName": "John Doe",
  "phone": "+1-555-0100",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "country": "USA",
  "isDefault": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
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

Body (all fields optional):
{
  "fullName": "Jane Doe",
  "addressLine1": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "pincode": "90001",
  "country": "USA",
  "isDefault": false
}

Response: 200 OK
{...updated address object...}
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

All recipe endpoints are **PUBLIC** (no authentication required).

#### Get All Recipes (with Pagination, Search, Filtering)
```
GET /api/recipes
Query Parameters (all optional):
  - page: number (default: 1)
  - limit: number (default: 10)
  - search: string (searches in title and description)
  - category: string (filter by category name)
  - difficulty: string ("easy" | "medium" | "hard")
  - authorId: string (filter by author)

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
          "quantity": 400,
          "unit": "g"
        },
        {
          "name": "Eggs",
          "quantity": 4,
          "unit": "pieces"
        }
      ],
      "instructions": ["Boil pasta in salted water.", "Mix eggs with cheese..."],
      "cookingTime": 45,
      "servings": 4,
      "difficulty": "easy",
      "category": "Italian",
      "imageUrl": "/uploads/recipes/abc-123.jpg",
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
  "instructions": ["Step 1...", "Step 2..."],
  "cookingTime": 45,
  "servings": 4,
  "difficulty": "easy",
  "category": "Italian",
  "imageUrl": "/uploads/recipes/abc-123.jpg",
  "authorId": "...",
  "averageRating": 4.5,
  "totalRatings": 12,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Create Recipe (PUBLIC)
```
POST /api/recipes
Content-Type: application/json

Body:
{
  "title": "Classic Pasta Carbonara",
  "description": "Traditional Italian pasta dish",
  "ingredients": [
    {
      "name": "Spaghetti",
      "quantity": 400,
      "unit": "g"
    },
    {
      "name": "Eggs",
      "quantity": 4,
      "unit": "pieces"
    }
  ],
  "instructions": [
    "Boil pasta in salted water.",
    "Mix eggs with grated cheese.",
    "Combine everything off heat."
  ],
  "cookingTime": 45,
  "servings": 4,
  "difficulty": "easy",
  "category": "Italian",
  "authorId": "507f1f77bcf86cd799439011",
  "imageUrl": "/uploads/recipes/abc-123.jpg"   // optional
}

Response: 201 Created
{...recipe object...}
```

#### Update Recipe (PUBLIC)
```
PUT /api/recipes/:id
Content-Type: application/json

Body (all fields optional):
{
  "title": "Updated Classic Pasta Carbonara",
  "cookingTime": 40,
  "servings": 6
}

Response: 200 OK
{...updated recipe object...}
```

#### Delete Recipe (PUBLIC)
```
DELETE /api/recipes/:id

Response: 200 OK
{...deleted recipe object...}
```

---

### ❤️ Recipe Favorites

**Authentication Required** ✅

#### Add Recipe to Favorites
```
POST /api/recipes/:id/favorite
Authorization: Bearer <token>

Response: 201 Created
{
  "id": "...",
  "userId": "...",
  "recipeId": "...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Remove Recipe from Favorites
```
DELETE /api/recipes/:id/favorite
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Recipe removed from favorites"
}
```

#### Get User's Favorite Recipes
```
GET /api/users/me/favorites
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
      "cookingTime": 45
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### ⭐ Recipe Ratings

#### Rate / Update a Recipe Rating (PROTECTED)
```
POST /api/recipes/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "rating": 5   // integer 1–5
}

Response: 201 Created
{
  "id": "...",
  "userId": "...",
  "recipeId": "...",
  "rating": 5,
  "createdAt": "2024-01-01T00:00:00.000Z"
}

Note: If the user has already rated this recipe, the existing rating is updated (upsert).
```

#### Get All Ratings for a Recipe (PUBLIC)
```
GET /api/recipes/:id/ratings

Response: 200 OK
{
  "recipeId": "...",
  "averageRating": 4.5,
  "totalRatings": 12,
  "ratings": [...]
}
```

---

### 💬 Recipe Comments

#### Add Comment to Recipe (PROTECTED)
```
POST /api/recipes/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "text": "This recipe is amazing! Made it last night."  // max 1000 characters
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

#### Get Comments for a Recipe (PUBLIC)
```
GET /api/recipes/:id/comments

Response: 200 OK
{
  "recipeId": "...",
  "totalComments": 3,
  "comments": [
    {
      "id": "...",
      "recipeId": "...",
      "userId": "...",
      "text": "This recipe is amazing!",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Delete Comment (PROTECTED - Author Only)
```
DELETE /api/comments/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Comment deleted successfully"
}

Note: Only the comment author can delete their own comments.
Returns 403 Forbidden if attempting to delete another user's comment.
```

---

### 📸 Image Uploads

No authentication required.

#### Upload Recipe Image
```
POST /api/uploads/recipe-image
Content-Type: multipart/form-data

Form Data:
  - file: File (max 5 MB, types: image/jpeg, image/jpg, image/png, image/gif, image/webp)

Response: 200 OK
{
  "url": "/uploads/recipes/abc-123-uuid.jpg"
}

Errors:
- 400 Bad Request: "No file uploaded"
- 400 Bad Request: "Only image files are allowed (jpeg, jpg, png, gif, webp)"
- 400 Bad Request: File too large (> 5 MB)
```

**Note:** Recipe images are stored in `./uploads/recipes/` and served as static files at `/uploads/recipes/<filename>`.

#### Upload Meal Image
```
POST /api/uploads/images
Content-Type: multipart/form-data

Form Data:
  - image: File (max 5 MB, types: image/jpeg, image/jpg, image/png, image/gif, image/webp)

Response: 200 OK
{
  "url": "/uploads/images/abc-123-uuid.jpg"
}
```

**Note:** Meal images are stored in `./uploads/images/` and served at `/uploads/images/<filename>`.

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
    "name": "Spaghetti",
    "quantity": 400,
    "unit": "g",
    "checked": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "...",
    "userId": "...",
    "name": "Eggs",
    "quantity": 12,
    "unit": "pieces",
    "checked": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Add Item to Shopping List
```
POST /api/shopping-list
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "Parmesan Cheese",
  "quantity": 200,
  "unit": "g",
  "checked": false   // optional, default false
}

Response: 201 Created
{
  "id": "...",
  "userId": "...",
  "name": "Parmesan Cheese",
  "quantity": 200,
  "unit": "g",
  "checked": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update Shopping List Item
```
PUT /api/shopping-list/:id
Authorization: Bearer <token>
Content-Type: application/json

Body (all fields optional):
{
  "name": "Fresh Parmesan Cheese",
  "quantity": 250,
  "unit": "g",
  "checked": true
}

Response: 200 OK
{...updated item...}
```

#### Delete Shopping List Item
```
DELETE /api/shopping-list/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Shopping list item deleted successfully"
}
```

#### Get Shopping List Stats
```
GET /api/shopping-list/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "total": 10,
  "checked": 3,
  "unchecked": 7
}
```

#### Clear All Checked Items
```
DELETE /api/shopping-list
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Checked items cleared successfully",
  "deletedCount": 3
}
```

---

### 🏷️ Recipe Categories

All category endpoints are **PUBLIC**.

#### Get All Categories
```
GET /api/recipe-categories

Response: 200 OK
[
  {
    "id": "...",
    "name": "Italian",
    "icon": "🇮🇹",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "...",
    "name": "Mexican",
    "icon": "🌮",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]

Note: Categories are sorted alphabetically by name.
```

#### Create Category
```
POST /api/recipe-categories
Content-Type: application/json

Body:
{
  "name": "Japanese",
  "icon": "🍣"
}

Response: 201 Created
{
  "id": "...",
  "name": "Japanese",
  "icon": "🍣",
  "createdAt": "2024-01-01T00:00:00.000Z"
}

Errors:
- 409 Conflict: "Category with this name already exists" (if duplicate name)
```

#### Delete Category
```
DELETE /api/recipe-categories/:id

Response: 200 OK
{
  "message": "Category deleted successfully"
}
```

---

### 🍽️ Meals

All meal endpoints are **PUBLIC** (no authentication required).

#### Get All Meals
```
GET /api/meals

Response: 200 OK
[
  {
    "id": "...",
    "title": "Spaghetti Bolognese",
    "slug": "spaghetti-bolognese",
    "image": "/uploads/images/uuid.jpg",
    "summary": "A classic Italian pasta dish...",
    "instructions": "Step 1...",
    "creator": "Chef John",
    "creator_email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Meal by Slug
```
GET /api/meals/:slug
Example: GET /api/meals/spaghetti-bolognese

Response: 200 OK
{
  "id": "...",
  "title": "Spaghetti Bolognese",
  "slug": "spaghetti-bolognese",
  "image": "/uploads/images/uuid.jpg",
  "summary": "A classic Italian pasta dish...",
  "instructions": "Step 1...",
  "creator": "Chef John",
  "creator_email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Create Meal
```
POST /api/meals
Content-Type: application/json

Body:
{
  "name": "Chef John",
  "email": "john@example.com",
  "title": "Spaghetti Bolognese",
  "summary": "A classic Italian pasta dish with rich meat sauce.",
  "instructions": "1. Brown meat. 2. Add tomato sauce. 3. Serve over pasta.",
  "image": "/uploads/images/uuid.jpg"
}

Response: 201 Created
{...meal object...}
```

---

## curl Examples

### Register a new user
```bash
curl -s -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
```

### Login and capture the token
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.access_token')
echo "Token: $TOKEN"
```

### Make a protected request (get current user)
```bash
curl -s http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Logout (blacklist the token)
```bash
curl -s -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### Subscribe to live game scores (SSE)
```bash
curl -N http://localhost:3000/api/games/scores \
  -H 'Accept: text/event-stream'
# Outputs a new score line every ~2 seconds:
# data: {"game":{"lakers":3,"denver":2}}
# data: {"game":{"lakers":5,"denver":6}}
# ...
# Press Ctrl+C to stop
```

### Stop the score stream
```bash
curl -s -X POST http://localhost:3000/api/games/stop
```

### Upload a recipe image
```bash
curl -s -X POST http://localhost:3000/api/uploads/recipe-image \
  -F 'file=@/path/to/image.jpg'
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
    const response = await apiClient.put(`/recipes/${id}`, updates);
    return response.data;
  },

  // Delete recipe
  deleteRecipe: async (id) => {
    const response = await apiClient.delete(`/recipes/${id}`);
    return response.data;
  },

  // Upload recipe image (form field name: 'file')
  uploadRecipeImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
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
    const response = await apiClient.get('/users/me/favorites');
    return response.data;
  },

  // Add to favorites
  addToFavorites: async (recipeId) => {
    const response = await apiClient.post(`/recipes/${recipeId}/favorite`);
    return response.data;
  },

  // Remove from favorites
  removeFromFavorites: async (recipeId) => {
    const response = await apiClient.delete(`/recipes/${recipeId}/favorite`);
    return response.data;
  },
};
```

#### Ratings Service

```javascript
// services/ratingsService.js
import apiClient from './authService';

export const ratingsService = {
  // Rate (or update rating for) a recipe
  rateRecipe: async (recipeId, rating) => {
    const response = await apiClient.post(`/recipes/${recipeId}/rate`, { rating });
    return response.data;
  },

  // Get all ratings for a recipe (public)
  getRecipeRatings: async (recipeId) => {
    const response = await apiClient.get(`/recipes/${recipeId}/ratings`);
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

  // Update item (PUT, not PATCH)
  updateItem: async (id, updates) => {
    const response = await apiClient.put(`/shopping-list/${id}`, updates);
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

  // Clear all checked items (DELETE /shopping-list with no path segment)
  clearChecked: async () => {
    const response = await apiClient.delete('/shopping-list');
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
  password: string (hashed with bcrypt),
  firstName: string,
  lastName: string,
  fcmToken?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Employee Schema
```typescript
// Collection: employeesdata
{
  _id: ObjectId,
  id: string (unique),
  firstName: string,
  lastName: string,
  email: string (unique),
  employee_name?: string,
  employee_age?: number,
  employee_salary?: number,
  contactNumber?: string,
  age?: number,
  dob?: string,
  salary?: number,
  address?: string,
  S_No?: number,
  surname?: string,
  created_time: Date,  // timestamps use custom names
  updated_time: Date
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
  fullName: string,
  phone: string,
  addressLine1: string,
  addressLine2?: string,
  city: string,
  state: string,
  pincode: string,
  country: string,
  isDefault: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### AvailableExercise Schema
```typescript
// Collection: availableExercises
{
  _id: ObjectId,
  name: string,
  duration: number,   // seconds
  calories: number,
  category: string ('Cardio' | 'Strength' | 'Flexibility' | 'HIIT' | 'Other', default: 'Other'),
  difficulty: string ('Beginner' | 'Intermediate' | 'Advanced', default: 'Beginner'),
  userId: ObjectId | null (ref: User),  // null for global exercises
  createdAt: Date,
  updatedAt: Date
}
```

### FinishedExercise Schema
```typescript
// Collection: finishedExercises
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: string,
  duration: number,   // seconds
  calories: number,
  date: Date,
  state: string ('completed' | 'cancelled'),
  createdAt: Date,
  updatedAt: Date
}
```

### WorkoutPlan Schema
```typescript
// Collection: workoutPlans
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: string,
  exerciseIds: ObjectId[] (ref: AvailableExercise),
  isTemplate: boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Goal Schema
```typescript
// Collection: goals
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  weekStart: Date,
  targetSessions: number | null,
  targetCalories: number | null,
  targetMinutes: number | null,
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

### Meal Schema
```typescript
{
  _id: ObjectId,
  title: string,
  slug: string (unique),
  image: string,
  summary: string,
  instructions: string,
  creator: string,
  creator_email: string,
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
    quantity: number,
    unit: string
  }],
  instructions: string[],      // array of step strings
  cookingTime: number,         // total time in minutes
  servings: number,
  difficulty: string ('easy' | 'medium' | 'hard'),
  category: string,
  imageUrl?: string,
  authorId: string,
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
  text: string (max 1000 chars),
  createdAt: Date,
  updatedAt: Date
}
```

### ShoppingList Schema
```typescript
{
  _id: ObjectId,
  userId: string,
  name: string,
  quantity: number,
  unit: string,
  checked: boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### RecipeCategory Schema
```typescript
{
  _id: ObjectId,
  name: string (unique),
  icon: string,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment & Config Notes

Create a `.env` file at the root of the project (see `.env.example` for reference):

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/test
MONGODB_ESTORE_URI=mongodb://localhost:27017/estore
MONGODB_RECIPES_URI=mongodb://localhost:27017/recipes
MONGODB_MEALS_URI=mongodb://localhost:27017/meals

# JWT Configuration
# IMPORTANT: Change this to a strong random string in production
JWT_SECRET=your-super-secure-secret-key-change-this-in-production
JWT_EXPIRATION=24h

# Server Configuration
PORT=3000

# Upload Configuration (optional)
MAX_FILE_SIZE=5242880   # 5 MB in bytes
UPLOAD_PATH=./uploads/recipes
```

**Key Notes:**
- JWT tokens expire after `JWT_EXPIRATION` (default `24h`). After expiry, re-login is required.
- The `test` database is used for auth, employees, exercises, goals, workout plans, threads, messages, and bot features.
- The `estore` database is used for products, cart, orders, and addresses.
- The `recipes` database is used for recipes, favorites, ratings, comments, shopping lists, and recipe categories.
- The `meals` database is used for the meal catalog.
- Uploaded files are stored locally in `./uploads/` and served as static assets.

---

## Improvements & Recommendations

### 🔒 Security Enhancements

1. **Rate Limiting:**
   - Add `@nestjs/throttler` to prevent brute force attacks on auth endpoints
   ```bash
   npm install @nestjs/throttler
   ```

2. **CORS Configuration:**
   - Currently allows all origins (`app.enableCors()`)
   - Restrict to specific frontend domains in production
   ```typescript
   app.enableCors({
     origin: ['http://localhost:4200', 'https://your-frontend.com'],
     credentials: true,
   });
   ```

3. **Helmet.js:**
   - Add security headers
   ```bash
   npm install helmet
   ```

4. **Input Sanitization:**
   - Add input sanitization for MongoDB queries to prevent NoSQL injection

5. **Auth Guards on Recipe CRUD:**
   - Currently all recipe create/update/delete endpoints are public; consider adding `JwtAuthGuard` to protect them

### 📝 Documentation Improvements

1. **Swagger Annotations:**
   - Add more detailed Swagger decorators for better Swagger UI documentation
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

3. **Refresh Tokens:**
   - Implement short-lived access tokens + long-lived refresh tokens for better security

4. **Pagination:**
   - Add pagination to remaining list endpoints (employees, orders, products)
   ```
   GET /api/products?page=1&limit=20
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

### 🚀 Performance Optimizations

1. **Caching:**
   - Implement Redis caching for frequently accessed data (e.g., product lists)

2. **Database Query Optimization:**
   - Use `lean()` for read-only queries
   - Use `select()` to fetch only needed fields

### 🔄 Additional Features

1. **Email Notifications:**
   - Order confirmation emails
   - Password reset emails (the forgot-password endpoint is implemented; wire up email delivery)
   - Implement with Nodemailer or SendGrid

2. **Payment Integration:**
   - Integrate Stripe/PayPal for actual payment processing
   - Add payment status tracking

3. **Inventory Management:**
   - Add stock tracking to products
   - Prevent ordering out-of-stock items

4. **Order Status Updates:**
   - Add ability to update order status
   - Implement order tracking

5. **Product Reviews:**
   - Add product reviews and rating system

### 🐳 DevOps

1. **Docker:**
   - Create Dockerfile
   - Create docker-compose.yml for easy setup

2. **CI/CD:**
   - Set up GitHub Actions for automated testing and deployment

3. **Environment Management:**
   - Separate configs for dev/staging/production

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
- [ ] Implement logout functionality (calls `POST /api/auth/logout` to blacklist token)
- [ ] Create service files for each API module (products, cart, orders, etc.)
- [ ] Test authentication flow
- [ ] Implement error handling UI (toasts/notifications)
- [ ] Test all protected routes
- [ ] Implement loading states during API calls
- [ ] Add API call retry logic (optional)
- [ ] Set up SSE for real-time features (games scores) using `EventSource`
- [ ] Implement recipe image upload with multipart/form-data (form field: `file`)
- [ ] Add recipe search and filtering
- [ ] Implement favorites and ratings UI (use `/api/recipes/:id/favorite` and `/api/recipes/:id/rate`)
- [ ] Create shopping list management interface

---

## Recipe Management Features

### Key Features Implemented:

1. **Recipe CRUD Operations**
   - Create, read, update, delete recipes (all routes currently public)
   - Rich recipe data with ingredients, instructions, cooking time, servings, difficulty

2. **Advanced Search & Filtering**
   - Full-text search across titles and descriptions
   - Filter by category, difficulty, and authorId
   - Pagination support for large datasets
   - MongoDB text indexes for optimized search performance

3. **Social Features**
   - User favorites: add/remove via `POST/DELETE /api/recipes/:id/favorite`
   - 1–5 star rating system with automatic upsert via `POST /api/recipes/:id/rate`
   - Comment system with author-only deletion
   - Automatic rating aggregation on recipe queries

4. **Media Management**
   - Recipe image uploads (up to 5 MB, form field: `file`)
   - Meal image uploads (up to 5 MB, form field: `image`)
   - Allowed types: JPEG, JPG, PNG, GIF, WebP
   - Static file serving at `/uploads/recipes/` and `/uploads/images/`
   - UUID-based unique filenames

5. **Shopping List**
   - Personal shopping lists per user (fields: `name`, `quantity` (number), `unit`, `checked`)
   - Check/uncheck items
   - Bulk delete checked items via `DELETE /api/shopping-list`
   - Shopping statistics: `{ total, checked, unchecked }`

6. **Category Management**
   - Organize recipes by cuisine/type (fields: `name`, `icon`)
   - Alphabetical sorting
   - Unique category names with conflict detection

### Database Optimizations:

- **Recipe Schema**: 5 indexes (text search, category, difficulty, authorId, createdAt)
- **Favorites/Ratings**: Compound unique indexes to prevent duplicates
- **Shopping List**: User-based isolation with efficient sorting indexes
- Recipes, favorites, ratings, comments, shopping list use the `recipes` MongoDB database

---

## Support & Contact

For questions or issues with the API:
- Check Swagger documentation: `http://localhost:3000/docs`
- Review this documentation
- Check error messages in API responses
- Verify authentication token is being sent correctly
- Ensure Content-Type headers are correct

---

**Last Updated:** May 2026
**Version:** 1.0.0
**API Base URL:** `http://localhost:3000/api`
**Swagger UI:** `http://localhost:3000/docs`
