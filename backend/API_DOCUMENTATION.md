# Code2Lead Backend API Documentation

## Overview
This is a comprehensive REST API for the Code2Lead application, built with Node.js, Express.js, and MongoDB. The API provides authentication, user management, and profile management features.

## Table of Contents
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Security Features](#security-features)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation
1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp config.env.example config.env
```

3. Update `config.env` with your configuration

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens can be provided via:
- Authorization header: `Bearer <token>`
- HTTP-only cookies (automatic)

### Token Structure
```json
{
  "id": "user_id",
  "role": "user|trainer|admin",
  "email": "user@example.com",
  "username": "username",
  "iat": 1234567890,
  "exp": 1234567890,
  "iss": "code2lead-api",
  "aud": "code2lead-client"
}
```

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Public Routes

#### 1. Create Admin User
**POST** `/auth/admin`

Creates the first admin user (for initial setup).

**Request Body:**
```json
{
  "name": "Admin User",
  "username": "admin",
  "email": "admin@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "data": {
    "id": "user_id",
    "name": "Admin User",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### 2. User Login
**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "username": "username",
      "email": "user@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### 3. Get Public Profile
**GET** `/auth/profile/:username`

Retrieves a user's public profile by username.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "User Name",
    "username": "username",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "User bio",
    "social": {
      "github": "https://github.com/username",
      "linkedin": "https://linkedin.com/in/username"
    },
    "studies": [
      {
        "institution": "University Name",
        "degree": "Bachelor's Degree",
        "startDate": "2020-01-01T00:00:00.000Z",
        "endDate": "2024-01-01T00:00:00.000Z",
        "description": "Study description"
      }
    ],
    "publicProfile": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Protected Routes (Require Authentication)

#### 4. Get Current User
**GET** `/auth/me`

Gets the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "User Name",
    "username": "username",
    "email": "user@example.com",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "User bio",
    "social": {
      "github": "https://github.com/username",
      "linkedin": "https://linkedin.com/in/username"
    },
    "publicProfile": true,
    "isActive": true,
    "lastLogin": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### 5. Update Profile
**PUT** `/auth/profile`

Updates the current user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "avatar": "https://example.com/new-avatar.jpg",
  "social": {
    "github": "https://github.com/newusername",
    "linkedin": "https://linkedin.com/in/newusername"
  },
  "studies": [
    {
      "institution": "New University",
      "degree": "Master's Degree",
      "startDate": "2022-01-01T00:00:00.000Z",
      "endDate": "2024-01-01T00:00:00.000Z",
      "description": "New study description"
    }
  ],
  "publicProfile": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_id",
    "name": "Updated Name",
    "username": "username",
    "email": "user@example.com",
    "role": "user",
    "avatar": "https://example.com/new-avatar.jpg",
    "bio": "Updated bio",
    "social": {
      "github": "https://github.com/newusername",
      "linkedin": "https://linkedin.com/in/newusername"
    },
    "studies": [
      {
        "institution": "New University",
        "degree": "Master's Degree",
        "startDate": "2022-01-01T00:00:00.000Z",
        "endDate": "2024-01-01T00:00:00.000Z",
        "description": "New study description"
      }
    ],
    "publicProfile": true,
    "isActive": true,
    "lastLogin": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### 6. User Logout
**POST** `/auth/logout`

Logs out the current user by clearing the authentication cookie.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Admin Routes (Require Admin Role)

#### 7. Create User
**POST** `/auth/users`

Creates a new user (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "New User",
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "Password123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "user_id",
    "name": "New User",
    "username": "newuser",
    "email": "newuser@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### 8. Get All Users
**GET** `/auth/users`

Gets all users with pagination (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (user, trainer, admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "docs": [
      {
        "id": "user_id",
        "name": "User Name",
        "username": "username",
        "email": "user@example.com",
        "role": "user",
        "isActive": true,
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 1,
    "limit": 10,
    "page": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

#### 9. Deactivate User
**PUT** `/auth/users/:userId/deactivate`

Deactivates a user account (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "id": "user_id",
    "name": "User Name",
    "username": "username",
    "email": "user@example.com",
    "role": "user",
    "isActive": false,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### 10. Activate User
**PUT** `/auth/users/:userId/activate`

Activates a user account (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User activated successfully",
  "data": {
    "id": "user_id",
    "name": "User Name",
    "username": "username",
    "email": "user@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Health Check

#### 11. Health Check
**GET** `/health`

Checks if the server is running.

**Response:**
```json
{
  "success": true,
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "field_name",
    "message": "Field-specific error message"
  }
}
```

### Common Error Codes
- `MISSING_TOKEN`: Authentication token is required
- `INVALID_TOKEN`: Invalid or malformed token
- `TOKEN_EXPIRED`: Token has expired
- `AUTH_REQUIRED`: Authentication is required
- `INSUFFICIENT_PERMISSIONS`: User doesn't have required permissions
- `VALIDATION_ERROR`: Request validation failed
- `DUPLICATE_FIELD`: Duplicate field value (e.g., email already exists)
- `USER_NOT_FOUND`: User not found
- `ACCOUNT_LOCKED`: Account is temporarily locked
- `ACCOUNT_DEACTIVATED`: Account is deactivated
- `RATE_LIMIT_EXCEEDED`: Too many requests

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `423`: Locked
- `429`: Too Many Requests
- `500`: Internal Server Error

## Security Features

### 1. Rate Limiting
- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

### 2. Password Security
- Minimum 6 characters
- Must contain uppercase, lowercase, and number
- Bcrypt hashing with salt rounds of 12

### 3. Account Lockout
- 5 failed login attempts locks account for 2 hours
- Automatic unlock after lockout period

### 4. CORS Protection
- Configurable allowed origins
- Credentials support for cookies

### 5. Security Headers
- Helmet.js for security headers
- Content Security Policy
- XSS protection

### 6. Input Validation
- Comprehensive validation for all inputs
- SQL injection prevention
- XSS prevention

## Database Schema

### User Model
```javascript
{
  name: String (required, 2-100 chars, letters and spaces only),
  username: String (required, unique, 3-30 chars, alphanumeric + underscore),
  email: String (required, unique, valid email format),
  password: String (required, min 6 chars, hashed),
  role: String (enum: 'user', 'trainer', 'admin', default: 'user'),
  bio: String (optional, max 1000 chars),
  avatar: String (optional, valid image URL),
  social: {
    github: String (optional, valid GitHub URL),
    linkedin: String (optional, valid LinkedIn URL),
    facebook: String (optional, valid Facebook URL),
    instagram: String (optional, valid Instagram URL)
  },
  studies: [{
    institution: String (required, 1-200 chars),
    degree: String (required, 1-200 chars),
    startDate: Date (required, not future),
    endDate: Date (optional, after startDate),
    description: String (optional, max 500 chars)
  }],
  publicProfile: Boolean (default: true),
  isActive: Boolean (default: true),
  lastLogin: Date (optional),
  loginAttempts: Number (default: 0),
  lockUntil: Date (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Environment Variables

### Required Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `FRONTEND_URL`: Frontend URL for CORS

### Optional Variables
- `JWT_EXPIRE`: JWT expiration time (default: 7d)
- `COOKIE_NAME`: Cookie name (default: token)
- `COOKIE_MAX_AGE_DAYS`: Cookie lifetime in days (default: 7)
- `COOKIE_SAMESITE`: Cookie SameSite attribute (default: Lax)
- `COOKIE_SECURE`: Secure cookie flag (default: false)
- `COOKIE_DOMAIN`: Cookie domain (optional)
- `RATE_LIMIT_MAX`: General rate limit (default: 100)
- `AUTH_RATE_LIMIT_MAX`: Auth rate limit (default: 5)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in ms (default: 900000)
- `HELMET_ENABLED`: Enable security headers (default: true)
- `TRUST_PROXY`: Trust proxy setting (default: true)

## Development

### Project Structure
```
server/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── authController.js    # Authentication controllers
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── error.js            # Error handling middleware
├── models/
│   └── User.js             # User model
├── routes/
│   └── auth.js             # Authentication routes
├── services/
│   └── authService.js      # Authentication business logic
├── config.env              # Environment variables
├── config.env.example      # Environment variables template
├── index.js                # Application entry point
└── package.json            # Dependencies and scripts
```

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

### Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT handling
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **express-rate-limit**: Rate limiting
- **helmet**: Security headers
- **cors**: CORS handling
- **cookie-parser**: Cookie parsing
- **dotenv**: Environment variables

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Write comprehensive tests
5. Update documentation

## License

This project is licensed under the MIT License.

