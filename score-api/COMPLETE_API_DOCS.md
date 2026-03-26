# Complete E-Commerce API Documentation

## 📦 Products APIs

### 1. Get All Products (Grouped by Category)
```http
GET /api/products
```
**Response:**
```json
{
  "cameras": [...],
  "smartphones": [...],
  "watches": [...],
  "shirts": [...],
  "products": [...]
}
```

### 2. Get Product by ID ✨ NEW
```http
GET /api/products/:id
```
**Response:**
```json
{
  "id": "696bba3c91b5c3c6d4ae560c",
  "name": "Cannon EOS",
  "image": "img/5.jpg",
  "price": "36000.00",
  "title": "Cannon EOS",
  "category": "cameras"
}
```

### 3. Get Products by Category ✨ NEW
```http
GET /api/products/category/:category
```
**Example:** `GET /api/products/category/cameras`

**Response:**
```json
[
  {
    "id": "696bba3c91b5c3c6d4ae560c",
    "name": "Cannon EOS",
    "image": "img/5.jpg",
    "price": "36000.00",
    "title": "Cannon EOS",
    "category": "cameras"
  }
]
```

### 4. Search Products ✨ NEW
```http
GET /api/products/search?q=sony
```
**Response:** Array of matching products

---

## 🛒 Cart APIs

### 1. Get Cart Items
```http
GET /api/cart
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "696bce330d57d984a77099e0",
    "productId": "696bba3c91b5c3c6d4ae560c",
    "quantity": 2,
    "userId": "696b77b84e59b364a1fb2426",
    "product": {
      "id": "696bba3c91b5c3c6d4ae560c",
      "name": "Sony DSLR",
      "image": "img/3.jpg",
      "price": "36000.00",
      "title": "Sony DSLR",
      "category": "cameras"
    }
  }
]
```

### 2. Get Cart Summary ✨ NEW
```http
GET /api/cart/summary
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "itemsCount": 5,
  "subTotal": 72000.00,
  "tax": 12960.00,
  "delivery": 50,
  "grandTotal": 85010.00
}
```

### 3. Add to Cart
```http
POST /api/cart
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "productId": "696bba3c91b5c3c6d4ae560c",
  "quantity": 1
}
```

**Response:**
```json
{
  "message": "Item added to cart successfully",
  "cartItemId": "696bce330d57d984a77099e0"
}
```

### 4. Update Cart Item Quantity ✨ NEW
```http
PATCH /api/cart/:id
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "message": "Cart item updated successfully"
}
```

### 5. Remove Cart Item
```http
DELETE /api/cart/:id
```
**Headers:** `Authorization: Bearer <token>`

### 6. Clear Cart
```http
DELETE /api/cart
```
**Headers:** `Authorization: Bearer <token>`

---

## 📍 Address APIs ✨ NEW

### 1. Create Address
```http
POST /api/addresses
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+91 9876543210",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "isDefault": true
}
```

### 2. Get All Addresses
```http
GET /api/addresses
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "696bce330d57d984a77099e0",
    "fullName": "John Doe",
    "phone": "+91 9876543210",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India",
    "isDefault": true,
    "createdAt": "2026-01-17T18:00:00.000Z"
  }
]
```

### 3. Get Address by ID
```http
GET /api/addresses/:id
```
**Headers:** `Authorization: Bearer <token>`

### 4. Update Address
```http
PUT /api/addresses/:id
```
**Headers:** `Authorization: Bearer <token>`

**Body:** (all fields optional)
```json
{
  "phone": "+91 9876543211",
  "isDefault": true
}
```

### 5. Delete Address
```http
DELETE /api/addresses/:id
```
**Headers:** `Authorization: Bearer <token>`

---

## 📦 Orders APIs

### 1. Preview Order (Calculate Totals) ✨ NEW
```http
POST /api/orders/preview
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "items": [
    {
      "productId": "696bba3c91b5c3c6d4ae560c",
      "quantity": 1,
      "price": "36000.00",
      "name": "Sony DSLR",
      "image": "img/3.jpg"
    }
  ]
}
```

**Response:**
```json
{
  "items": [...],
  "subTotal": 37300.00,
  "tax": 6714.00,
  "delivery": 50,
  "grandTotal": 44064.00
}
```

### 2. Place Order
```http
POST /api/orders
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "items": [
    {
      "productId": "696bba3c91b5c3c6d4ae560c",
      "quantity": 1,
      "price": "36000.00",
      "name": "Sony DSLR",
      "image": "img/3.jpg"
    }
  ],
  "total": 44064
}
```

**Response:**
```json
{
  "message": "Order placed successfully",
  "orderId": "696bd1234567890abcdef123"
}
```

### 3. Get All Orders
```http
GET /api/orders
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "696bd1234567890abcdef123",
    "items": [...],
    "total": 44064,
    "date": "2026-01-17T18:00:00.000Z",
    "status": "pending"
  }
]
```

### 4. Get Order by ID
```http
GET /api/orders/:id
```
**Headers:** `Authorization: Bearer <token>`

---

## 🔐 Authentication
## Additional Controller APIs

### Comments
- Routes:
  - `GET /api/comments` — list comments (query by `recipeId` or `userId`)
  - `GET /api/comments/:id` — get single comment
  - `POST /api/comments` — create comment (auth required)
  - `DELETE /api/comments/:id` — delete comment (auth required; owner or admin)
- Request DTOs:
  - `create-comment.dto.ts` — `{ recipeId: string, content: string }`
- Response DTOs:
  - `comment-response.dto.ts` — `{ id, userId, content, recipeId, createdAt }`
- Example (create):
```json
{ "recipeId": "abc123", "content": "Great recipe!" }
```
- Common errors: `400` (validation), `401` (unauth), `403` (not owner), `404` (comment/recipe not found)

### Favorites / Wishlist
- Routes:
  - `GET /api/favorites` — list user's favorites (auth required)
  - `POST /api/favorites` — add favorite (auth required)
  - `DELETE /api/favorites/:id` — remove favorite (auth required)
- Request DTOs:
  - `create-favorite.dto.ts` — `{ productId?: string, recipeId?: string }`
- Response DTOs:
  - `favorite-recipe-response.dto.ts` — `{ id, userId, itemId, type }`
- Example (add):
```json
{ "productId": "696bba3c91b5c3c6d4ae560c" }
```
- Common errors: `400`, `401`, `404`

### Ratings
- Routes:
  - `GET /api/ratings` — list ratings (query `productId`/`recipeId`)
  - `POST /api/ratings` — submit rating (auth required)
  - `PATCH /api/ratings/:id` — update rating (auth/admin)
- Request DTOs:
  - `create-rating.dto.ts` — `{ productId?: string, recipeId?: string, rating: number, comment?: string }`
- Response DTOs:
  - `rating-response.dto.ts` — `{ id, userId, rating, comment, createdAt }`
- Example (submit):
```json
{ "productId": "p1", "rating": 5, "comment": "Loved it" }
```
- Common errors: `400`, `401`, `403`, `404`

### Recipes & Recipe Categories
- Routes:
  - `GET /api/recipes` — list recipes (supports paging/filtering)
  - `GET /api/recipes/:id` — recipe details
  - `POST /api/recipes` — create recipe (auth required)
  - `PUT /api/recipes/:id` — update recipe (auth/owner)
  - `DELETE /api/recipes/:id` — delete recipe (auth/owner/admin)
  - `GET /api/recipe-categories` — list categories
  - `POST /api/recipe-categories` — create category (admin)
- Request DTOs:
  - `create-recipe.dto.ts`, `update-recipe.dto.ts`, `create-recipe-category.dto.ts`
- Response DTOs:
  - `recipe-with-rating.dto.ts`, `paginated-recipes-response.dto.ts`, `recipe-category-response.dto.ts`
- Example (create recipe):
```json
{ "title": "Pancakes", "ingredients": [{"name":"Flour","quantity":"2 cups"}], "steps": ["Mix","Cook"], "categoryId": "cat1" }
```
- Common errors: `400`, `401`, `403`, `404`

### Shopping List
- Routes:
  - `GET /api/shopping-list` — user's shopping list (auth required)
  - `POST /api/shopping-list` — add item (auth required)
  - `PATCH /api/shopping-list/:id` — update item
  - `DELETE /api/shopping-list/:id` — remove item
- Request DTOs:
  - `create-shopping-list.dto.ts`, `update-shopping-list.dto.ts`
- Response DTOs:
  - `shopping-list-response.dto.ts`
- Example (add):
```json
{ "name": "Milk", "quantity": 2 }
```
- Common errors: `400`, `401`, `404`

### Uploads
- Routes:
  - `POST /api/uploads` — file upload (auth required if protected)
  - `GET /api/uploads/:id` — get file metadata / URL
- Request DTOs:
  - (multipart file) — returns `file-upload-response.dto.ts`
- Example response:
```json
{ "id": "u1", "url": "https://.../uploads/u1.jpg", "filename": "u1.jpg" }
```
- Common errors: `400`, `401`, `413` (too large)

### Messages & Threads
- Routes:
  - `GET /api/threads` — list conversation threads (auth required)
  - `POST /api/threads` — create thread
  - `GET /api/threads/:threadId/messages` — list messages in thread
  - `POST /api/threads/:threadId/messages` — post message
- Request/Response DTOs:
  - typical `{ subject?, participants?: string[] }`, message `{ threadId, text }`
- Common errors: `400`, `401`, `403`, `404`

### Exercises & Bot
- Routes (examples):
  - `GET /api/exercises` — list exercises
  - `GET /api/exercises/:id` — exercise details
  - `POST /api/bot/message` — bot interaction
- DTOs:
  - `available-exercise.dto.ts`, `exercise.dto.ts`, `bot.dto.ts`
- Common errors: `400`, `401`

### Games / Employee (misc admin endpoints)
- Routes (examples):
  - `GET /api/games` — listing
  - `POST /api/employee` — employee create/update (admin)
- DTOs:
  - domain-specific DTOs; document exact shapes from source when ready

### Auth endpoints (explicit)
- Routes:
  - `POST /api/auth/register` — register new user
    - Request: `auth.dto.ts` — `{ name?, email, password }`
    - Response: `201` with user summary + token
  - `POST /api/auth/login` — login
    - Request: `auth.dto.ts` — `{ email, password }`
    - Response: `{ accessToken: string, refreshToken?: string }`
  - `POST /api/auth/refresh` — refresh tokens
    - Request: `{ refreshToken: string }`
    - Response: `{ accessToken: string, refreshToken?: string }`
  - `POST /api/auth/logout` — logout / blacklist token
    - Request: `{ refreshToken?: string }` (auth required)
- Common errors: `400`, `401`, `409` (duplicate account on register)

### Notes
- For controllers above, exact route names and DTO fields should be copied directly from the controller and DTO files for parity. The list here reflects typical routes implemented by files in `score-api/src/app/controllers` and `score-api/src/app/dto`.


## 🔐 Authentication
All cart, order, and address endpoints require JWT authentication.

**Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 📊 Business Logic

### Tax Calculation
- **Tax Rate:** 18% of subtotal
- Applied to all orders and cart summaries

### Delivery Charges
- **Flat Rate:** ₹50 for all orders
- **Free Delivery:** When cart is empty (₹0)

### Cart Behavior
- Adding existing product updates quantity
- Cart automatically cleared after successful order
- Prices populated from product database

### Address Management
- Only one address can be default
- Setting new default automatically unsets others
- Addresses sorted by default status, then creation date

---

## 🎯 Frontend Integration Guide

### Complete E-Commerce Flow

1. **Product Discovery**
   - List all products: `GET /products`
   - Category browsing: `GET /products/category/:category`
   - Search: `GET /products/search?q=query`
   - Product details: `GET /products/:id`

2. **Cart Management**
   - Add to cart: `POST /cart` with `{productId, quantity}`
   - View cart: `GET /cart` (includes full product details)
   - Update quantity: `PATCH /cart/:id` with `{quantity}`
   - View summary: `GET /cart/summary` (for checkout totals)
   - Remove item: `DELETE /cart/:id`

3. **Checkout Process**
   - Get/create shipping address: `GET/POST /addresses`
   - Preview order totals: `POST /orders/preview`
   - Place order: `POST /orders` with items and total
   - Cart auto-clears on success

4. **Order History**
   - List orders: `GET /orders`
   - View order details: `GET /orders/:id`

---

## 🚀 What's Implemented

### ✅ Must-Have (Complete)
- [x] Product by ID
- [x] Products by category
- [x] Product search
- [x] Update cart quantity
- [x] Cart summary with calculations
- [x] Full address CRUD
- [x] Order preview with calculations

### 📝 Recommended Next Steps
1. **Wishlist APIs** - Save for later functionality
2. **Order Status Updates** - Track shipment progress
3. **Invoice Generation** - PDF download
4. **User Statistics** - Spending insights
5. **Product Reviews** - Ratings & feedback
6. **Reorder** - Quick repeat purchase

---

## 🔧 Technical Notes

### MongoDB Collections
- **Products** (`estore` database)
- **CartItems** (`estore` database) - References User & Product
- **Orders** (`estore` database) - Embedded items array
- **Addresses** (`estore` database) - References User

### Validation
- All DTOs use `class-validator`
- Required fields enforced
- Minimum values checked (quantity >= 1)
- JWT authentication on protected routes

### Error Handling
- 400: Bad Request (validation failed)
- 401: Unauthorized (missing/invalid token)
- 404: Not Found (resource doesn't exist)
- 201: Created (successful creation)
- 200: OK (successful operation)


## Audience & Purpose
This document is intended for three primary audiences:
- UI engineers: quick integration examples, payloads, and auth notes.
- Product & business: endpoints that impact UX, KPIs, and roadmap suggestions.
- Engineering: technical details, validation, error handling, and operational notes.

## Quick Start (for UI teams)
- Base API URL: `http://localhost:3000/api`
- Auth: include header `Authorization: Bearer <token>` for protected endpoints.

Common flows:
- List products: `GET /api/products` → response grouped by category.
- Product details: `GET /api/products/:id` → show full product card.
- Add item to cart: `POST /api/cart` with `{productId, quantity}`.
- Checkout preview: `POST /api/orders/preview` with `items` array to calculate totals.

Mocking for dev:
- Use the `GET` endpoints to seed UI fixtures. Backend responses in this doc are safe to mock.

## Data Models & DTOs (summary)
These interfaces reflect the typical payloads used by the frontend. Fields may be present as strings (IDs/prices) in DB responses.

- Product
  - `id: string`
  - `name: string`
  - `image: string` (relative path)
  - `price: string` (decimal as string, e.g. "36000.00")
  - `title: string`
  - `category: string`

- CartItem
  - `id: string`
  - `productId: string`
  - `quantity: number`
  - `userId: string`
  - `product: Product` (embedded product object)

- Address
  - `id: string`
  - `fullName: string`
  - `phone: string`
  - `addressLine1: string`
  - `addressLine2?: string`
  - `city: string`
  - `state: string`
  - `pincode: string`
  - `country: string`
  - `isDefault: boolean`
  - `createdAt?: string`

- Order / Preview Item
  - `productId: string`
  - `quantity: number`
  - `price: string | number`
  - `name: string`
  - `image?: string`

Additional DTOs (source: `score-api/src/app/dto/`)

- `auth.dto.ts`
  - `RegisterDto`:
    - `email: string`
    - `password: string`
    - `firstName: string`
    - `lastName: string`
  - `LoginDto`:
    - `email: string`
    - `password: string`
  - `AuthResponseDto`:
    - `access_token: string`
    - `user: { id: string, email: string, firstName: string, lastName: string }`
  - `ChangePasswordDto`:
    - `password: string`

- `cart.dto.ts`
  - `AddToCartDto`:
    - `productId: string`
    - `quantity: number`
  - `UpdateCartItemDto`:
    - `quantity: number`
  - `ProductDetailsDto`:
    - `id: string`, `name: string`, `image: string`, `price: string`, `title: string`, `category: string`
  - `CartItemResponseDto`:
    - `id: string`, `productId: string`, `quantity: number`, `userId: string`, `product: ProductDetailsDto`
  - `CartSummaryDto`:
    - `itemsCount: number`, `subTotal: number`, `tax: number`, `delivery: number`, `grandTotal: number`

- `create-comment.dto.ts`
  - `CreateCommentDto`:
    - `text: string`

- `comment-response.dto.ts`
  - `CommentResponseDto`:
    - `id: string`, `recipeId: string`, `userId: string`, `text: string`, `createdAt: Date`, `updatedAt: Date`
  - `RecipeCommentsResponseDto`:
    - `totalComments: number`, `comments: CommentResponseDto[]`

- `create-favorite.dto.ts`
  - `CreateFavoriteDto`:
    - `recipeId: string`

- `favorite-recipe-response.dto.ts`
  - `FavoriteRecipeResponseDto`:
    - `favoriteId: string`, `recipe: Recipe`, `createdAt: Date`

- `create-rating.dto.ts`
  - `CreateRatingDto`:
    - `rating: number` (1-5)

- `rating-response.dto.ts`
  - `RatingResponseDto`:
    - `id: string`, `rating: number`, `recipeId: string`, `userId: string`, `createdAt: Date`, `updatedAt: Date`
  - `RecipeRatingsResponseDto`:
    - `averageRating: number`, `totalRatings: number`, `ratings: RatingResponseDto[]`

- `product.dto.ts`
  - `ProductDto`:
    - `id?: string`, `name: string`, `image: string`, `price: string`, `title: string`, `category: string`
  - `ProductsResponseDto`:
    - `cameras: ProductDto[]`, `products: ProductDto[]`, `shirts: ProductDto[]`, `smartphones: ProductDto[]`, `watches: ProductDto[]`

- `address.dto.ts`
  - `CreateAddressDto`:
    - `fullName: string`, `phone: string`, `addressLine1: string`, `addressLine2?: string`, `city: string`, `state: string`, `pincode: string`, `country: string`, `isDefault?: boolean`
  - `UpdateAddressDto`:
    - optional versions of the same fields
  - `AddressResponseDto`:
    - `id: string`, `fullName: string`, `phone: string`, `addressLine1: string`, `addressLine2?: string`, `city: string`, `state: string`, `pincode: string`, `country: string`, `isDefault: boolean`, `createdAt: Date`

- `order.dto.ts`
  - `OrderItemDto`:
    - `productId: string`, `quantity: number`, `price: string`, `name: string`, `image: string`
  - `CreateOrderDto`:
    - `items: OrderItemDto[]`, `total: number`
  - `OrderResponseDto`:
    - `id: string`, `items: OrderItemDto[]`, `total: number`, `date: Date`, `status: string`
  - `PreviewOrderDto`:
    - `items: OrderItemDto[]`
  - `OrderPreviewResponseDto`:
    - `items: OrderItemDto[]`, `subTotal: number`, `tax: number`, `delivery: number`, `grandTotal: number`

- `ingredient.dto.ts`
  - `IngredientDto`:
    - `name: string`, `quantity: number`, `unit: string`

- `create-recipe.dto.ts` / `update-recipe.dto.ts`
  - `CreateRecipeDto`:
    - `title: string`, `description: string`, `imageUrl?: string`, `cookingTime: number`, `servings: number`, `difficulty: Difficulty`, `ingredients: IngredientDto[]`, `instructions: string[]`, `authorId: string`, `category: string`
  - `UpdateRecipeDto`: same fields optional

- `create-recipe-category.dto.ts`
  - `CreateRecipeCategoryDto`:
    - `name: string`, `icon: string`

- `recipe-with-rating.dto.ts` / `paginated-recipes-response.dto.ts` / `recipe-category-response.dto.ts`
  - `RecipeWithRatingDto` extends `Recipe` with `averageRating?: number`, `totalRatings?: number`
  - `PaginatedRecipesWithRatingsResponseDto`:
    - `data: RecipeWithRatingDto[]`, `page: number`, `totalPages: number`, `totalItems: number`
  - `PaginatedRecipesResponseDto`:
    - `data: Recipe[]`, `page: number`, `totalPages: number`, `totalItems: number`
  - `RecipeCategoryResponseDto`:
    - `id: string`, `name: string`, `icon: string`, `createdAt: Date`, `updatedAt: Date`

- `create-shopping-list.dto.ts` / `update-shopping-list.dto.ts` / `shopping-list-response.dto.ts`
  - `CreateShoppingListDto`:
    - `name: string`, `quantity: number`, `unit: string`, `checked?: boolean`
  - `UpdateShoppingListDto`: same fields optional
  - `ShoppingListResponseDto`:
    - `id: string`, `userId: string`, `name: string`, `quantity: number`, `unit: string`, `checked: boolean`, `createdAt: Date`, `updatedAt: Date`

- `available-exercise.dto.ts` / `exercise.dto.ts`
  - `CreateAvailableExerciseDto`:
    - `name: string`, `duration: number`, `calories: number`
  - `CreateFinishedExerciseDto`:
    - `name: string`, `duration: number`, `calories: number`, `date: Date`, `state: 'completed' | 'cancelled'`
  - `ExerciseResponseDto` / `FinishedExerciseResponseDto`:
    - fields: `id`, `name`, `duration`, `calories`, `date?`, `state?`, `userId?`

- `bot.dto.ts`
  - `BotIntentDto`:
    - `text: string`
  - `BotResponseDto`:
    - `intent: 'weather' | 'currency' | 'joke' | 'unknown'`, `response: string`, `data?: any`
  - `FcmTokenDto`:
    - `fcmToken: string`

- `file-upload-response.dto.ts`
  - `FileUploadResponseDto`:
    - `url: string`

- `recipe-query.dto.ts`
  - `RecipeQueryDto`:
    - `page?: number`, `limit?: number`, `search?: string`, `category?: string`, `difficulty?: Difficulty`, `authorId?: string`

## HTTP Statuses & Errors (guidance)
- `200 OK` — Successful GET / PATCH / DELETE operations
- `201 Created` — Successful POST creating resources
- `400 Bad Request` — Validation errors (response includes an array of messages)
- `401 Unauthorized` — Missing/invalid token
- `404 Not Found` — Resource doesn't exist
- `409 Conflict` — Resource already exists (e.g., duplicate email)

Error example:
```json
{
  "statusCode": 400,
  "message": ["quantity must be a positive number"],
  "error": "Bad Request"
}
```

## Authentication & Security Notes
- All cart, orders, and addresses endpoints require JWT-based auth.
- `Authorization` header: `Bearer <token>`.
- Tokens are blacklisted on logout; ensure frontend discards token after logout.
- Never store tokens in insecure cross-site storage; prefer `httpOnly` cookies if backend supports it.

## Business Logic & Calculation Rules (concise)
- Tax: 18% of subtotal.
- Delivery: flat ₹50 (free when subtotal is ₹0).
- Cart behavior: adding an existing product increments quantity.
- Only one default address; setting a new default unsets others.

## Caching, Rate-Limits & Performance
- Recommended caching:
  - Cache `GET /api/products` (short TTL, e.g. 60s) at CDN layer to reduce load.
  - Cache product images via CDN and set long cache-control.
- Rate limiting: recommend a per-IP rate limit (e.g., 100 requests/min) for public endpoints; stricter for auth endpoints.

## Versioning & Backwards Compatibility
- Start versioning when breaking changes are needed: e.g. `/api/v2/products`.
- Maintain backwards-compatible fields (avoid renaming fields; add new optional fields instead).

## Testing & Mocking Guidance
- Frontend teams should mock API responses using the example payloads in this doc.
- Create a lightweight mock server (JSON responses) for integration tests.

## Roadmap & Recommendations (Product & Business)
- High Priority (Q1)
  - Wishlist / Save-for-later API (improves conversions).
  - Order status lifecycle (placed → shipped → delivered) for UX transparency.
- Medium Priority (Q2)
  - Simple invoice generation (PDF) for completed orders.
  - Product reviews & ratings (improves discovery & trust).
- Low Priority (Q3+)
  - Personalized recommendations / Recently viewed products.
  - Reorder / quick repeat purchase flow.

KPIs to monitor:
- Cart-to-order conversion rate
- Average order value (AOV)
- Checkout abandonment rate
- Repeat purchase rate

## Engineering Tasks & Priorities
- Implement request-level logging for cart and checkout flows (priority: high).
- Add automated tests for order preview and totals (tax/delivery correctness).
- Add pagination to product listing endpoints if product count grows (future-proof).

## Changelog
- 2026-01-17: Added product-by-id, category endpoints, search, cart summary, address CRUD, update cart quantity, and order preview.

## Contact & Next Steps
- Doc owner: backend team (see repo README for contacts).
- Suggested next steps:
  1. Frontend: implement mocks and validate payloads against interfaces above.
  2. Product: prioritize wishlist and order-tracking features.
  3. Engineering: add tests, logging, and caching as recommended.

---

