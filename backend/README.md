# WebRTC VoIP Backend

A robust Node.js/Express backend server for a real-time WebRTC voice calling application with MongoDB database integration, Redis caching, and Socket.IO signaling.

## Overview

The backend server handles:

- User authentication and authorization (JWT-based)
- Database management with MongoDB
- Real-time WebRTC signaling via Socket.IO
- Session management with Redis
- Comprehensive logging and error handling
- Security features including CORS, Helmet, HPP, and compression

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 5.x
- **Database:** MongoDB 9.x
- **Cache/Session:** Redis 5.x
- **Real-time Communication:** Socket.IO 4.x
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Argon2
- **Logging:** Winston
- **Type Safety:** TypeScript 5.x
- **Validation:** Zod

## Project Structure

```
src/
├── @types/                    # TypeScript global type definitions
├── config/                    # Configuration and environment validation
│   └── env.validate.ts       # Environment variable validation
├── constants/                 # Application constants
├── exceptions/                # Custom exception classes
│   └── http.exception.ts      # HTTP error handling
├── libs/                      # Core libraries and services
│   ├── database/             # MongoDB connection
│   ├── logger/               # Winston logger configuration
│   ├── redis/                # Redis client configuration
│   └── socket/               # Socket.IO signaling service
├── middlewares/               # Express middlewares
│   ├── auth.middleware.ts    # JWT authentication
│   ├── error.handler.middleware.ts # Error handling
│   ├── request-id.middleware.ts    # Request tracking
│   └── validation.schema.middleware.ts # Request validation
├── models/                    # MongoDB schemas
│   ├── user.model.ts         # User schema and methods
│   └── call.model.ts         # Call history schema
├── routes/                    # API routes and controllers
│   ├── auth/                 # Authentication routes
│   ├── call/                 # Call management routes
│   └── users/                # User management routes
├── types/                     # TypeScript type definitions
├── utils/                     # Utility functions
├── app.ts                     # Express app configuration
└── index.ts                   # Application entry point
```

## Features

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Refresh token mechanism
- Password hashing with Argon2
- Secure cookie handling

### User Management

- User profile management
- User status tracking (online/offline)
- Last seen timestamp
- Avatar support

### Call Management

- Initiate and manage calls
- Accept/reject calls
- Call history tracking
- Real-time call notifications via Socket.IO

### Real-time Communication

- WebRTC signaling via Socket.IO
- Peer discovery
- ICE candidate exchange
- Offer/answer negotiation
- Redis-based pub/sub for multi-instance support

### Database

- User information storage
- Call history and logs
- Session management

### Logging & Monitoring

- Structured logging with Winston
- Daily rotation of log files
- Request ID tracking for tracing
- Different log levels (info, warn, error, debug)

### Security

- CORS configuration
- Helmet for secure headers
- HPP (HTTP Parameter Pollution) protection
- Input validation with Zod
- Request size limiting
- Cookie parsing and security

## Installation & Setup

### Prerequisites

- Node.js v18 or higher
- MongoDB 6.0 or higher
- Redis 7.0 or higher

### Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:4200

# Database
MONGODB_URI=mongodb://localhost:27017/webrtc-voip
MONGODB_TEST_URI=mongodb://localhost:27017/webrtc-voip-test

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - Logout user

### User Routes (`/api/users`)

- `GET /users/me` - Get current user profile
- `GET /users` - Get all online users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user account

### Call Routes (`/api/calls`)

- `POST /calls` - Initiate a call
- `GET /calls/:id` - Get call details
- `PUT /calls/:id` - Update call status
- `GET /calls/history/:userId` - Get call history
- `DELETE /calls/:id` - End/delete call

## WebSocket Events (Socket.IO)

### Client to Server

- `register` - Register user with signaling server
- `offer` - Send WebRTC offer to peer
- `answer` - Send WebRTC answer to peer
- `ice-candidate` - Send ICE candidate to peer
- `disconnect` - User disconnects

### Server to Client

- `user-joined` - Notify when user comes online
- `user-left` - Notify when user goes offline
- `offer` - Receive WebRTC offer from peer
- `answer` - Receive WebRTC answer from peer
- `ice-candidate` - Receive ICE candidate from peer
- `call-notification` - Incoming call notification
- `call-rejected` - Call rejected by peer
- `call-ended` - Call ended notification

## Middleware

### Auth Middleware

Validates JWT token from Authorization header or cookies. Attaches user info to request.

### Error Handler Middleware

Catches all errors and returns consistent JSON error responses.

### Request ID Middleware

Generates unique request ID for tracking and logging.

### Validation Schema Middleware

Validates request body/params using Zod schemas.

## Database Models

### User Model

```typescript
{
  email: string (unique)
  username: string (unique)
  password: string (hashed)
  status?: string
  isActive?: boolean
  lastSeen?: number
  socketId?: string
  avatar?: string
  refreshTokens?: Array<{token, createdAt}>
}
```

### Call Model

```typescript
{
  initiatorId: ObjectId (ref: User)
  recipientId: ObjectId (ref: User)
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  startedAt?: Date
  endedAt?: Date
  duration?: number
  notes?: string
}
```

## Error Handling

The application uses custom HTTP exceptions with consistent error responses:

```json
{
	"statusCode": 400,
	"message": "Error description",
	"timestamp": "2026-01-15T12:00:00.000Z",
	"path": "/api/endpoint"
}
```

## Logging

Logs are stored in `logs/` directory with daily rotation:

- `combined.log` - All logs
- `error.log` - Error logs only
- `warn.log` - Warning logs only

## Development

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Consistent naming conventions

### Running Tests

```bash
npm test
```

### Debugging

Use Node.js inspector:

```bash
node --inspect=9229 dist/index.js
```

Then open DevTools at `chrome://inspect`

## Performance Optimization

- **Compression:** Gzip compression for response bodies
- **Caching:** Redis for session and cache management
- **Database:** MongoDB with proper indexing
- **Real-time:** Socket.IO with Redis adapter for horizontal scaling
- **Rate Limiting:** Helmet and HPP for protection

## Deployment

### Docker

A Dockerfile is provided for containerization:

```bash
docker build -t webrtc-backend .
docker run -p 3000:3000 webrtc-backend
```

### Docker Compose

```bash
docker-compose up
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Set up CDN if needed

## Troubleshooting

### MongoDB Connection Issues

- Check MongoDB is running
- Verify connection string in `.env`
- Check network connectivity to MongoDB

### Redis Connection Issues

- Check Redis is running: `redis-cli ping`
- Verify Redis configuration in `.env`
- Check firewall rules

### Socket.IO Issues

- Check browser console for connection errors
- Verify CORS origins in app configuration
- Check socket namespace and events

### JWT Expiry Issues

- Verify JWT_EXPIRY format (e.g., "1h", "7d")
- Check JWT secrets are properly configured
- Implement refresh token rotation

## Contributing

1. Create a feature branch
2. Make changes following code style guidelines
3. Write/update tests
4. Submit pull request with description

## License

ISC

## Support

For issues or questions:

1. Check logs in `logs/` directory
2. Enable debug logging: `LOG_LEVEL=debug`
3. Check MongoDB and Redis connectivity
4. Review error messages in server console

---

**Last Updated:** January 15, 2026
