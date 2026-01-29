# Chat Sphere — Backend Architecture

This document describes the architecture of the backend service (backend/). It explains components, data flow, socket integration, persistence, and deployment notes.

## High-level overview

- Express + TypeScript application exposing a REST API on `/api/*`.
- Socket.IO server attached to the same HTTP server for real-time events (chat, call signaling).
- MongoDB (mongoose) as primary persistent store for users, chats and call records.
- Redis (ioredis) used for caching/session and as Socket.IO adapter (pub/sub) for multi-instance socket coordination.
- AWS S3 for file storage/signed URLs (optional).
- JWT-based authentication (access + refresh tokens).

## Key components and responsibilities

- src/index.ts — bootstrap and start the App class
- src/app.ts — configures express middlewares, Socket.IO, Redis adapter, routes, and lifecycle
- src/config/env.validate.ts — runtime environment validation (envalid)
- src/routes/\* — route modules:
  - auth — registration/login/logout and token handling
  - chat — message retrieval and chat-related endpoints
  - call — call history and call resources
  - files — upload, signed URL generation and downloads
- src/libs/\* — shared utilities (logger, sockets, database, redis client)
- src/middlewares/\* — auth, socket-auth, request-id, error handler and validation middleware

## Data flow (REST)

1. Client calls HTTP endpoint (e.g. POST /api/auth/login).
2. Express middlewares handle parsing, CORS and auth validation.
3. Controller validates input, accesses mongoose models and returns JSON response.
4. Sensitive changes (new message, call event) will typically also emit socket events to connected clients.

## Real-time flow (Socket.IO + Redis)

- Socket.IO is attached to the same HTTP server and set to allow the origin configured in FRONTEND_URL.
- On connect, the socket auth middleware validates JWT presented via socket.auth or cookies.
- For single-instance deployments, Socket.IO functions normally. For multiple instances:
  - The app configures the Redis adapter in app.ts using ioredis duplicates.
  - Pub/sub clients are created (pubClient/subClient) and passed to createAdapter.
  - This enables broadcasts, rooms, and cross-instance messaging.
- Connection lifecycle:
  - Client connects → server authenticates → server registers the socket (user->socketId mapping) → socket events (message, typing, call) route to listeners → server optionally persists events to DB and emits to recipient(s).

## Authentication & sessions

- JWT tokens used for API auth; auth middleware and socket-auth.middleware validate tokens using JWT_SECRET and JWT_REFRESH_SECRET.
- Token flows:
  - login returns access token (short-lived) and refresh token (longer-lived).
  - refresh route rotates refresh tokens (implementation dependent).

## Persistence

- MongoDB stores users, messages, call records, and metadata (mongoose models).
- Redis used as:
  - Fast cache / ephemeral state (presence, call sessions)
  - Socket.IO adapter pub/sub for multi-instance setups

## Logging & monitoring

- Logging: Winston, optionally rotated by winston-daily-rotate-file.
- Health check: Dockerfile expects a `/health` endpoint returning 200 — ensure it exists or add a small route.

## Deployment notes

- Dockerfile currently expects a compiled JS entry (server.js). Recommended approach:
  - Add "build": "tsc -p tsconfig.json" to backend/package.json.
  - Update Dockerfile to run the TypeScript build in a builder stage and copy `dist` into the final image.
  - Run with `node dist/index.js` (or similar).
- Use backend/docker-compose.yaml for local DB and Redis; extend top-level docker-compose to add backend and frontend services for full-stack composition.
- Ensure REDIS_URL or REDIS_HOST/REDIS_PORT and MONGO_URI are available to the container.

## Scaling considerations

- Use Redis adapter for Socket.IO to scale across multiple backend instances.
- Use a process supervisor / k8s with liveness/readiness probes and rolling updates.
- Keep long-lived in-memory state minimal — prefer Redis for cross-process state.

## Troubleshooting tips

- Env validation fails: ensure MONGO_URI is set (env.validate.ts requires MONGO_URI).
- Redis adapter warnings: check REDIS_URL / REDIS_HOST settings.
- Docker startup fails complaining about server.js: add a build step and update Dockerfile.
- Socket auth rejects: confirm tokens passed either in socket auth payload or cookies and that secrets match.

## Suggested improvements (short-term)

- Add `build` and `start` scripts to backend/package.json:
  - build: `tsc -p tsconfig.json`
  - start: `node dist/index.js`
- Update Dockerfile to build TypeScript in the builder stage and run compiled JS in production stage.
- Add a simple `/health` route returning 200 to satisfy Docker HEALTHCHECK.
