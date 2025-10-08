# Code2Lead Backend Server

A robust, secure, and scalable Node.js backend server for the Code2Lead application, built with Express.js and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user lifecycle management with admin controls
- **Security**: Rate limiting, CORS protection, input validation, account lockout
- **Profile Management**: Rich user profiles with social links and education tracking
- **Error Handling**: Comprehensive error handling with detailed error codes
- **Validation**: Robust input validation with express-validator
- **Database**: MongoDB with Mongoose ODM and optimized queries
- **Documentation**: Comprehensive API documentation and code comments

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Security Features](#security-features)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp config.env.example config.env
# Edit config.env with your configuration
```

4. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` by default.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

### Key Endpoints

#### Public Routes
- `POST /auth/admin` - Create admin user (first-time setup)
- `POST /auth/login` - User login
- `GET /auth/profile/:username` - Get public profile

#### Protected Routes
- `GET /auth/me` - Get current user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/logout` - User logout

#### Admin Routes
- `POST /auth/users` - Create new user
- `GET /auth/users` - Get all users (paginated)
- `PUT /auth/users/:userId/deactivate` - Deactivate user
- `PUT /auth/users/:userId/activate` - Activate user

### Example Usage

#### Create Admin User
```bash
curl -X POST http://localhost:5000/api/auth/admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "username": "admin",
    "email": "admin@example.com",
    "password": "Password123"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Password123"
  }'
```

#### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your-token>"
```

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 🏗️ Architecture

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

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with configurable expiration
- Role-based access control (user, trainer, admin)
- Account lockout after 5 failed login attempts
- Secure password requirements

### Input Validation
- Comprehensive input validation with express-validator
- SQL injection prevention
- XSS protection
- Email and URL format validation

### Rate Limiting
- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Configurable rate limits

### Security Headers
- Helmet.js for security headers
- Content Security Policy
- CORS protection with origin validation

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Environment Variables
See [config.env.example](./config.env.example) for all available environment variables.

### Code Style
- Use consistent error handling patterns
- Include comprehensive input validation
- Add proper error messages and codes
- Follow RESTful API conventions

### Testing
```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Enable secure cookies
- [ ] Configure CORS for production domains
- [ ] Set up MongoDB connection string
- [ ] Configure rate limiting
- [ ] Enable security headers

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-connection
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-domain.com
COOKIE_SECURE=true
COOKIE_SAMESITE=None
```

## 📊 Monitoring

### Health Check
The server provides a health check endpoint:
```
GET /api/health
```

### Logging
- Structured logging with timestamps
- Error logging in development mode
- Production-ready logging configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

### Code Standards
- Follow existing code style
- Add comprehensive error handling
- Include input validation
- Update documentation
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [API Documentation](./API_DOCUMENTATION.md)
- Review the [Commit Messages](./COMMIT_MESSAGES.md) for recent changes
- Open an issue in the repository

## 🔄 Changelog

### Recent Improvements
- Enhanced security with rate limiting and account lockout
- Improved error handling with detailed error codes
- Added comprehensive input validation
- Enhanced user model with advanced features
- Improved API documentation and code comments
- Added admin user management features
- Enhanced authentication and authorization

For detailed commit history, see [COMMIT_MESSAGES.md](./COMMIT_MESSAGES.md).

---

**Built with ❤️ for the Code2Lead project**

