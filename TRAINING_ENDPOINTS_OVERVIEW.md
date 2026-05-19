# Training Endpoints Technical Overview

## Overview
This document provides detailed technical specifications for the training/exercise endpoints in the Score API.

---

## 1. `GET /api/exercises/available` - Fetch Available Exercises

**Authentication:** None (Public endpoint)

### Model Maintained:
- **Collection:** `availableExercises` (MongoDB)
- **Schema:** `AvailableExercise`
  - `name`: string (required) - Exercise name
  - `duration`: number (required) - Duration in minutes
  - `calories`: number (required) - Calories burned
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)

### Request:
```http
GET /api/exercises/available
```
No request body or parameters required.

### Response: `200 OK`
```json
[
  {
    "id": "string",
    "name": "string",
    "duration": number,
    "calories": number
  }
]
```

---

## 2. `POST /api/exercises/finished` - Submit Completed Exercise

**Authentication:** Required (JWT Bearer Token)

### Model Maintained:
- **Collection:** `finishedExercises` (MongoDB)
- **Schema:** `FinishedExercise`
  - `name`: string (required) - Exercise name
  - `duration`: number (required) - Duration in minutes
  - `calories`: number (required) - Calories burned
  - `date`: Date (required) - Exercise completion date
  - `state`: enum (required) - 'completed' | 'cancelled'
  - `userId`: ObjectId (required) - Reference to User collection
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)

### Request:
```http
POST /api/exercises/finished
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Request Body:
```json
{
  "name": "string",
  "duration": number,
  "calories": number,
  "date": "ISO8601 Date string",
  "state": "completed" | "cancelled"
}
```

### Validation Rules:
- `name`: Non-empty string
- `duration`: Number, not empty
- `calories`: Number, not empty
- `date`: Valid date (transformed from string to Date object)
- `state`: Enum - must be 'completed' or 'cancelled'

### Response: `201 Created`
```json
{
  "id": "string",
  "name": "string",
  "duration": number,
  "calories": number,
  "date": "ISO8601 Date string",
  "state": "completed" | "cancelled",
  "userId": "string"
}
```

---

## 3. `GET /api/exercises/finished` - Retrieve Past Exercises

**Authentication:** Required (JWT Bearer Token)

### Model Maintained:
- **Collection:** `finishedExercises` (MongoDB)
- **Schema:** Same as endpoint #2 above

### Request:
```http
GET /api/exercises/finished
Authorization: Bearer <jwt_token>
```
No request body required. User ID is extracted from JWT token.

### Response: `200 OK`
```json
[
  {
    "id": "string",
    "name": "string",
    "duration": number,
    "calories": number,
    "date": "ISO8601 Date string",
    "state": "completed" | "cancelled",
    "userId": "string"
  }
]
```

### Notes:
- Results are sorted by `date` in descending order (most recent first)
- Only returns exercises for the authenticated user
- Returns empty array if no exercises found

---

## Key Implementation Details

- **Framework:** NestJS with TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT-based authentication via `JwtAuthGuard` for protected endpoints
- **Validation:** Class-validator for DTO validation
- **Transformation:** Class-transformer for type conversion (e.g., string to Date)
- **Controllers:** [exercises.controller.ts](score-api/src/app/controllers/exercises.controller.ts)
- **Services:** [exercises.service.ts](score-api/src/app/service/exercises.service.ts)
- **DTOs:** 
  - [exercise.dto.ts](score-api/src/app/dto/exercise.dto.ts)
  - [available-exercise.dto.ts](score-api/src/app/dto/available-exercise.dto.ts)
- **Schemas:** [exercise.schema.ts](score-api/src/app/schema/exercise.schema.ts)

---

## Example Usage

### Get Available Exercises
```bash
curl -X GET http://localhost:3000/api/exercises/available
```

### Submit Completed Exercise
```bash
curl -X POST http://localhost:3000/api/exercises/finished \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Running",
    "duration": 30,
    "calories": 250,
    "date": "2026-04-27T10:00:00.000Z",
    "state": "completed"
  }'
```

### Get Finished Exercises
```bash
curl -X GET http://localhost:3000/api/exercises/finished \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
