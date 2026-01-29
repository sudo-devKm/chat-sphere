# Chat Sphere — MERN + WebRTC Chat App

A modern chat & WebRTC calling application built with TypeScript:

- Backend: Node.js, Express, Socket.IO, MongoDB, Redis, JWT authentication, S3 integration
- Frontend: React + Vite, TypeScript, socket.io-client, react-query, Zustand

This README covers local development, environment configuration, available API endpoints, Socket.IO usage, Docker notes and troubleshooting.

---

Table of contents

- Project highlights
- Tech stack
- Repo layout
- Prerequisites
- Backend
  - Environment variables
  - Run locally (development)
  - Production / Docker notes
  - API endpoints (examples)
  - Socket.IO quick start
  - Troubleshooting (backend)
- Frontend
  - Environment variables
  - Run locally
  - Build for production
  - Troubleshooting (frontend)
- Development notes & recommended fixes
- Contributing
- License
- Detailed documentation (links)
  - Backend detailed docs
  - Frontend detailed docs

---

Project highlights

- Real-time chat and audio/video call features with Socket.IO and WebRTC.
- JWT-based authentication and protected APIs.
- Redis adapter support for Socket.IO (scales across instances).
- Ready-to-use docker-compose for MongoDB and Redis.

Tech stack

- Backend: Node.js, Express, TypeScript, Socket.IO, MongoDB (mongoose), Redis (ioredis), JWT, AWS S3 SDK, Winston (logging)
- Frontend: React + Vite, TypeScript, react-query, socket.io-client, Zustand
- Dev & tooling: nodemon (backend), vite (frontend), Docker & docker-compose

Repository layout (important files)

- backend/
  - package.json, Dockerfile, docker-compose.yaml (DB/Redis)
  - .env.example
  - src/app.ts — app bootstrap, middleware, Socket.IO setup
  - src/index.ts — entry
  - src/routes/\* — express routes (auth, chat, call, files)
  - src/config/env.validate.ts — runtime env validation
- frontend/
  - package.json, vite.config.ts
  - src/main.tsx, src/App.routes.tsx
  - src/config/env.ts — front-end env validation
  - src/socket/_, src/hooks/_, src/pages/\*

---

Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- Git
- MongoDB (local or container) and Redis (local or container) for local full functionality
- Docker & docker-compose (optional, recommended for DB/Redis in one command)
- (Optional) AWS credentials for S3 private file access if using S3 features

---

BACKEND

1. Environment
   Create a copy of backend/.env.example at backend/.env and set values.

Important variables (from .env.example and env.validate):

- NODE_ENV (development | production | test)
- PORT (e.g. 3000)
- FRONTEND_URL (e.g. http://localhost:4200)
- MONGO_URI (string) <-- NOTE: .env.example used MONGODB_URI; env.validate expects MONGO_URI — see Troubleshooting
- JWT_SECRET
- JWT_EXPIRE (e.g. 15m)
- JWT_REFRESH_SECRET
- JWT_REFRESH_EXPIRE (e.g. 7d)
- ALLOWED_ORIGINS (comma separated)
- REDIS_URL or REDIS_HOST / REDIS_PORT
- TURN_SERVER_URL / TURN_USERNAME / TURN_CREDENTIAL (optional for WebRTC)
- STUN_SERVER_URL (optional)
- AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET (if using file upload / signed URLs)
- LOG_LEVEL (info | warn | debug, etc.)

Example backend .env (minimal)

```bash
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:4200
MONGO_URI=mongodb://localhost:27017/webrtc_voip
JWT_SECRET=replace_with_a_strong_secret
JWT_REFRESH_SECRET=replace_with_a_refresh_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=your-bucket
```

2. Run locally (development)

- Install dependencies and start backend in dev mode:

```bash
cd backend
npm install
# Start dev server with nodemon to reload Typescript on change
npm run dev
```

- By default server listens on PORT (3000 in example). Check logs for "Server is running on <PORT>".

3. Production notes / Docker

- The repo includes a Dockerfile that expects a production compiled JS entry (server.js). The repository currently contains TypeScript source and no build script; see "Development notes" below for recommended adjustments.
- To run MongoDB and Redis quickly:

```bash
# Starts only the DB and Redis services defined in backend/docker-compose.yaml
cd backend
docker compose up -d
```

- Build backend image (if you prepare a compiled production artifact or add a build step):

```bash
# From repo root (adjust paths or Dockerfile as needed)
docker build -t chat-backend ./backend
docker run --env-file ./backend/.env -p 3000:3000 chat-backend
```

If you want a full Docker Compose stack (backend + frontend + mongo + redis), create a top-level docker-compose.yml that includes services for frontend and backend and handles building/volumes. The provided backend/docker-compose.yaml only supplies DB and Redis.

4. API Endpoints (base path: /api)
   Note: all protected endpoints require authentication (JWT) — typically sent as Authorization: Bearer <token> or via cookie depending on how auth controller issues tokens.

Auth

- POST /api/auth/register
  - Body: { name, email, password } (see register validation)
  - Registers a user
  - Example:
    curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'

- POST /api/auth/login
  - Body: { email, password }
  - Returns auth tokens / session info
  - Example:
    curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@example.com","password":"secret"}'

- GET /api/auth/me
  - Protected: returns current user profile
  - Example:
    curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/auth/me

- POST /api/auth/logout
  - Protected: logs out user (invalidates token/refresh)

Chat

- GET /api/chats/messages
  - Protected. Query params validated with GetMessagesParamsSchema (commonly: skip, limit, withUserId or conversationId). Use query params to paginate or filter.
  - Example:
    curl -H "Authorization: Bearer <TOKEN>" "http://localhost:3000/api/chats/messages?skip=0&limit=20"

- GET /api/chats/with-user/:userId
  - Protected. Get chat/session data with a particular user.

Calls

- GET /api/call
  - Protected. Get call history (list).
- GET /api/call/stats
  - Protected. Get call statistics.
- GET /api/call/:id
  - Protected. Get single call by id.
- DELETE /api/call/:id
  - Protected. Delete a call record.

Files

- Files endpoints are available under /api/files — check controllers for upload, signed URL, and download endpoints. Files route is registered in routes list.

5. Socket.IO (real-time)

- Server Socket.IO configuration is in backend/src/app.ts and registers namespaced event handlers in src/libs/sockets.
- Connect from frontend with the socket.io-client. Typical connection:

```js
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
	auth: { token: '<JWT or session token>' }, // or include cookies
	withCredentials: true,
});
```

- The client uses events defined in frontend/src/constants/socket.events.ts. Use those to emit/listen for chat and call events.
- Note: socket auth middleware exists (src/middlewares/socket-auth.middleware.ts) — it will validate incoming auth tokens or cookies. Pass credentials accordingly.

6. Troubleshooting (backend)

- MONGODB_URI vs MONGO_URI mismatch:
  - .env.example uses MONGODB_URI but env.validate.ts expects MONGO_URI. To avoid an env validation error at startup, provide MONGO_URI in your .env (or update .env.example / env.validate.ts to match).
- Dockerfile production assumption:
  - Dockerfile's final CMD is `node server.js`. The repo does not include a compiled server.js by default. You should add a build step (tsc) to emit server.js or adjust Dockerfile to compile TypeScript during image build.
- Redis adapter/connectivity:
  - If Redis is not running or unreachable, the app logs a warning but continues. For production scale across nodes, ensure Redis is reachable and properly configured.

---

FRONTEND

1. Environment
   The frontend validates the following Vite environment variables (see frontend/src/config/env.ts):

- VITE_API_URL (e.g. http://localhost:3000/api) — base API URL
- VITE_SOCKET_URL (e.g. http://localhost:3000) — Socket.IO server URL
- VITE_SIP_WS_URL (SIP websocket for jssip if using SIP functionality)
- VITE_APP_PORT (port used to serve app locally; numeric)
- VITE_APP_NAME (optional)

Example frontend .env (create .env.local in frontend/ or set system env)

```bash
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_SIP_WS_URL=wss://sip.example.com
VITE_APP_PORT=5173
VITE_APP_NAME=ChatSphere
```

2. Run locally

```bash
cd frontend
npm install
npm run dev
```

- Vite dev server will start (default port shown in terminal). Open the app in your browser (or point to VITE_APP_PORT).

3. Build for production

```bash
cd frontend
npm run build
# Serve build with any static server (or integrate with Docker/hosting)
```

4. Common frontend notes

- The app uses react-query for data fetching, Zustand for call/auth state and socket provider to manage Socket.IO connection lifecycle.
- Ensure VITE_API_URL points to the backend /api route and VITE_SOCKET_URL to backend root (where Socket.IO server is listening).
- If you face CORS issues, confirm backend FRONTEND_URL includes your frontend dev/prod origin.

---

Development notes & recommended fixes

- env variable name mismatch: sync .env.example and src/config/env.validate.ts to use the same variable name (MONGO_URI vs MONGODB_URI). Recommendation: choose MONGO_URI and update .env.example accordingly.
- Backend Dockerfile currently expects compiled JS (server.js). Add a build stage to compile TypeScript (tsc) or run a script to compile to dist/ and run node dist/server.js:
  - Example change (high-level):
    - Add "build": "tsc -p tsconfig.json" in backend/package.json
    - Update Dockerfile to run npm run build in the builder stage and COPY dist/server.js to production image CMD.
- docker-compose.yaml in backend only starts MongoDB and Redis. To run the full stack via Docker Compose you can add services for backend and frontend (or create a top-level docker-compose).

Suggested quick fix to run backend in Docker (without changing Dockerfile), locally:

- Use a node image that runs via ts-node or mount source and run npm run dev. Example docker-compose override for dev (not optimized for production).

---

Troubleshooting checklist

- Server fails on startup with env validation error — verify all required env variables are present and names match env.validate.ts.
- Socket connection refused — check VITE_SOCKET_URL and backend FRONTEND_URL/CORS config and that backend is listening on expected port.
- Database connectivity errors — ensure MongoDB is up and MONGO_URI is correct.
- Redis adapter warnings — ensure Redis is running; app will still start but scaling may be degraded.

---

Contributing

- Contributions are welcome — open an issue first to discuss large changes.
- For bug fixes or features:
  - Fork the repo
  - Create a branch: git checkout -b feat/your-feature
  - Run tests / lint (if added) and ensure local dev works
  - Open a pull request with a clear description and testing steps

---

License

- This repository does not include an explicit license file. Add a LICENSE (for example MIT) if you want to make the code open source.

---

Detailed documentation (quick links)

- Backend detailed docs — jump to [Backend Detailed Documentation](#backend-detailed-documentation)
- Frontend detailed docs — jump to [Frontend Detailed Documentation](#frontend-detailed-documentation)

If you'd like these long documents in separate files, you can extract the sections into:

- backend/README.md
- frontend/README.md

Example (from repo root):

```bash
# Create backend/README.md and frontend/README.md from this file's sections:
# (copy/paste the sections manually or use a script)
```

---

Backend Detailed Documentation
<a name="backend-detailed-documentation"></a>

This section expands on the backend's setup, structure, environment configuration, production build recommendations, Socket.IO specifics, and common troubleshooting steps. Copy this into backend/README.md if you prefer a dedicated file.

1. Overview & Key files

- Entry & server:
  - src/index.ts — bootstraps the App class
  - src/app.ts — configures express, Socket.IO, Redis adapter, middlewares, routes and lifecycle
- Config & env:
  - src/config/env.validate.ts — runtime env validation (important source of truth for required env names)
  - backend/.env.example — sample env (note the MONGODB_URI naming difference)
- Networking & sockets:
  - Socket.IO is created in src/app.ts and registerSockets lives in src/libs/sockets
- Routes:
  - src/routes/\* — auth, call, users, chat, files

2. Required environment variables (exact keys from env.validate.ts)
   The backend uses envalid and expects the following keys (strict):

- NODE_ENV (development | production | test)
- PORT (number)
- MONGO_URI (required) — critical: env.validate.ts requires MONGO_URI
- JWT_SECRET
- REDIS_URL (optional, default '')
- REDIS_HOST (default '127.0.0.1')
- REDIS_PORT (default 6379)
- FRONTEND_URL
- AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET (if using S3 features)

Tip: Add additional keys used by controllers (JWT*REFRESH*\*, ALLOWED_ORIGINS, STUN/TURN) to your .env as needed — env.validate does not require all of them, but controllers may rely on them.

3. Local development

- Install & run in dev mode (nodemon + ts-node):

```bash
cd backend
npm install
npm run dev
```

- The "dev" script runs "nodemon src/index.ts" (see backend/package.json). This reloads on file changes.

4. Production build recommendations
   Current repo assumptions:

- Dockerfile's production stage runs `node server.js`, but the repo lacks a compiled server.js by default. To support a proper production image, add a build step.

Recommended package.json changes (suggested - document only):

```json
// backend/package.json (additions)
"scripts": {
  "dev": "nodemon src/index.ts",
  "build": "tsc -p tsconfig.json",
  "start": "node dist/index.js"
}
```

Recommended Dockerfile changes (high-level):

- In builder stage install devDependencies, run npm run build (tsc), copy dist/ to final image and run `node dist/index.js`.
- Alternatively, change final CMD to run ts-node (not recommended for production).

Example simplified Dockerfile production stage change (concept):

```dockerfile
# in builder
RUN npm ci
COPY . .
RUN npm run build

# in final
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

5. Running DB and Redis via docker-compose
   The repo provides backend/docker-compose.yaml that starts MongoDB and Redis. Use it for local integration tests:

```bash
cd backend
docker compose up -d
```

This exposes:

- MongoDB -> 27017
- Redis -> 6379

6. Socket.IO and Redis adapter

- app.ts configures Socket.IO with a CORS origin of envs.FRONTEND_URL and sets ping interval/timeouts.
- The Redis adapter uses ioredis duplicates. When redisClient exists it duplicates to create pub/sub clients; otherwise it creates new IORedis instances from REDIS_URL or REDIS_HOST/REDIS_PORT.
- If Redis is not available the adapter configuration will warn and continue without socket clustering support — the server still starts.
- To connect from client: pass auth token via socket auth (see Socket.IO quick start earlier).

7. API contract highlights

- Auth: /api/auth/register, /api/auth/login, /api/auth/me, /api/auth/logout
- Chat: /api/chats/messages?skip=0&limit=20, /api/chats/with-user/:userId
- Calls: /api/call, /api/call/stats, /api/call/:id
- Files: /api/files/\* (upload/signed-url/download controllers)

8. Logging & monitoring

- Logging uses Winston and winston-daily-rotate-file (see libs/logger).
- Health endpoint referenced in Dockerfile (`/health`) should return HTTP 200 when ready. Confirm an implementation exists or add a lightweight route that responds 200 to satisfy the Dockerfile HEALTHCHECK.

9. Troubleshooting (expanded)

- env validation fails:
  - Ensure MONGO_URI exists (env.validate.ts requires it). .env.example uses MONGODB_URI — update .env or .env.example accordingly.
- Docker start fails (server.js not found):
  - Add build step (tsc) and change Dockerfile to run compiled output.
- Redis connection errors:
  - Check REDIS_HOST / REDIS_PORT or REDIS_URL. App will log but continue.
- Socket auth rejects connections:
  - Ensure token is supplied through socket auth or cookie and that auth middleware decoding keys match JWT_SECRET/JWT_REFRESH_SECRET.
- Mongo connection:
  - Check MONGO_URI and network access to MongoDB (local or container). For mongo container, ensure MONGO_INITDB_DATABASE, username/password or URI are correct.

10. Recommended quick fixes (to implement in repo)

- Add "build" and "start" scripts to backend/package.json (tsc + node dist).
- Update backend/Dockerfile to compile TypeScript in builder stage and run compiled JS in production stage.
- Update backend/.env.example to use MONGO_URI (or change env.validate.ts to accept MONGODB_URI).

---

Frontend Detailed Documentation
<a name="frontend-detailed-documentation"></a>

This section expands on the frontend's setup, environment validation, build & deployment, socket/auth integration details, and troubleshooting. Copy this into frontend/README.md if you prefer a dedicated file.

1. Overview & key files

- Entry:
  - src/main.tsx — root bootstrap, QueryClientProvider, AuthBootstrapProvider
  - src/App.routes.tsx — route definitions and protected/public layouts
- Environment:
  - src/config/env.ts — runtime env validator (yup) that expects VITE\_\* variables
- Bundler:
  - Vite is used for dev and build
- Important directories:
  - src/socket — socket helpers/provider
  - src/pages — page components (login/register/dashboard)
  - src/hooks — custom hooks
  - src/api — fetch clients / react-query setup

2. Required environment variables (from src/config/env.ts)

- VITE_API_URL (string) — required
- VITE_SOCKET_URL (string) — required
- VITE_SIP_WS_URL (string) — required (used if SIP/jssip features are in use)
- VITE_APP_PORT (number) — required for dev server override
- VITE_APP_NAME (string) — optional

Note: Vite reads env var names prefixed with VITE\_. Add them to frontend/.env.local or to the environment that starts Vite.

3. Local development

- Install dependencies and run dev server:

```bash
cd frontend
npm install
npm run dev
```

- The dev server runs Vite and serves on VITE_APP_PORT (if provided) or default (5173). The terminal will show the exact URL.

4. Build & preview

- Build production bundle:

```bash
cd frontend
npm run build
```

- Preview the production build:

```bash
npm run preview
```

Note: package.json runs "tsc -b && vite build" as part of the build script to ensure type-checking.

5. Socket.IO & authentication integration

- The frontend connects using socket.io-client. The typical pattern:

```ts
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000', {
	auth: { token: '<JWT>' }, // backend checks auth in socket-auth.middleware.ts
	withCredentials: true,
});
```

- The app's socket provider likely handles connection lifecycle and reconnection logic; search src/socket for provider and event constants (frontend/src/constants/socket.events.ts).
- Ensure VITE_SOCKET_URL points to backend root that hosts Socket.IO and that backend FRONTEND_URL/CORS allows the frontend origin.

6. Deploying frontend (static hosting)

- The build output can be served by any static host (Netlify, Vercel, nginx, S3+CloudFront, etc.).
- If you need a Docker image to serve the frontend, a simple multi-stage Dockerfile can:
  - Build the app (npm run build)
  - Serve dist/ using an nginx static server image

Example Dockerfile (concept):

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

7. Troubleshooting (expanded)

- Vite dev server not using VITE_APP_PORT:
  - Confirm VITE_APP_PORT is set in frontend/.env.local. Vite sometimes exposes a different dev port in certain environments — check terminal output.
- CORS / socket refused:
  - Backend FRONTEND_URL must include the frontend origin. For dev, FRONTEND_URL often should include http://localhost:5173 (or the port Vite uses).
- Missing envs on start:
  - The frontend validates envs with a schema. If missing, an EnvValidationError is thrown. Ensure VITE_API_URL, VITE_SOCKET_URL, VITE_SIP_WS_URL, and VITE_APP_PORT are provided.

8. Testing & linting

- Lint with:

```bash
cd frontend
npm run lint
```

- Unit/test tooling (vitest, testing-library) is included as devDeps, add test scripts where required.

9. Recommended improvements (optional)

- If VITE_SIP_WS_URL isn't used in your deployment, consider making it optional in env.ts or providing a sensible default to avoid startup errors.
- Add CI jobs that run the frontend build and type checks to prevent deployment of broken builds.

---

If you want, I can:

- Extract the above backend and frontend detailed sections into separate backend/README.md and frontend/README.md files and provide a patch or script to add them to the repo.
- Create a top-level docker-compose.yml that builds and runs backend, frontend, MongoDB and Redis together.
- Propose a concrete Dockerfile and package.json patch for the backend to support production builds.

Happy to help set up a one-command local launch for the complete stack or prepare deployment manifests for Kubernetes / cloud.
