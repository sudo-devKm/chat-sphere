# Chat Sphere — Frontend Architecture

This document describes the frontend architecture (frontend/) including component layout, data flow, socket integration, environment expectations, and build/deploy guidance.

## High-level overview

- React + Vite + TypeScript single-page application.
- React Query for server state (caching, background refetch).
- Zustand for client/local state (auth, call state, socket lifecycle).
- Socket.IO client for real-time chat and call signaling.
- Vite for dev server and production bundling.

## Key components

- src/main.tsx — application bootstrap (QueryClientProvider, AuthBootstrapProvider)
- src/App.routes.tsx — react-router-based routing and protected layout
- src/socket — socket provider, helpers and shared event constants
- src/api — axios/react-query setup for REST interactions
- src/hooks — reusable hooks (auth, useSocket, useCalls, etc.)
- src/pages — page components (Login, Register, Dashboard, Home)
- src/layouts — PublicLayout and ProtectedLayout (guards and route wrappers)

## Data & state flow

- Server state:
  - Use react-query for API-backed data (messages, chat lists, call history).
  - Queries are keyed and cached with automatic background revalidation.
- Client state:
  - Use Zustand for ephemeral client state like current call session, presence, and current user info.
- Component communication:
  - Socket provider exposes connection and event handlers (subscribe/unsubscribe) so pages/components can listen for events.
  - Auth bootstrap obtains current user and stores tokens in secure storage (httpOnly cookies recommended for production).

## Socket integration

- Single Socket provider manages the socket instance lifecycle and reconnections.
- Socket connection is created with auth: { token } or with cookies (withCredentials: true).
- Events are defined centrally (frontend/src/constants/socket.events.ts) to avoid mismatched event names.
- On socket events (message, call.offer, call.answer, call.hangup), dispatch to Zustand or invalidate react-query caches as needed.

## Environment variables

- Required (frontend/src/config/env.ts):
  - VITE_API_URL — base REST API
  - VITE_SOCKET_URL — Socket.IO server URL
  - VITE_SIP_WS_URL — SIP websocket (if using jssip)
  - VITE_APP_PORT — dev server port (dev only)
- Provide these in frontend/.env.local or in your CI/CD pipeline.

## Build & deploy

- Build script: `npm run build` (runs `tsc -b && vite build`).
- Preview: `npm run preview`.
- For Docker: multi-stage build where builder runs npm ci and npm run build, final stage serves dist/ via nginx.
- Host static files on Netlify, Vercel, S3+CloudFront, or an nginx container.

## Performance & UX considerations

- Use react-query background refetching and optimistic updates for snappy chat UX.
- Lazy-load heavy pages and components (e.g., call UI) to reduce initial bundle size.
- Use request deduping and pagination for chat history fetches.

## Testing and quality

- Linting with ESLint and formatting with Prettier configured in the repo.
- Unit tests with Vitest and React Testing Library (add CI steps to run tests).
- Include a smoke test in CI to run `npm run build` and ensure type checks pass.

## Troubleshooting tips

- Vite fails due to missing envs: validate that VITE\_\* values exist and match env.ts requirements.
- Socket failed to connect: check VITE_SOCKET_URL, backend FRONTEND_URL/CORS, and that backend socket server is listening.
- Incorrect token behavior: ensure token storage strategy is consistent between REST and socket auth.

## Suggested improvements

- Make VITE_SIP_WS_URL optional if SIP features are not always used.
- Add integration tests for socket events using a test Socket server or mocking utilities.
