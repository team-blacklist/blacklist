# Blacklist
### An agent that hacks into your website, so that the bad guys don't.


## Project Structure
A full-stack application with Next.js frontend and Fastify backend.

```
blacklist/
├── blacklist-frontend/    # Next.js frontend application
└── blacklist-backend/     # Fastify backend server
```

## Getting Started

- you'll have to run the backend and the frontend

### Backend (Port 3001)

```bash
cd blacklist-backend
bun install
bun run start
```

### Frontend (Port 3000)

```bash
cd blacklist-frontend
bun install
bun run dev
```

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Fastify, TypeScript
- **Runtime**: Bun

## Team Resources

- Backend API runs on `http://localhost:3001`
- Frontend runs on `http://localhost:3000`
- Each directory has its own README with detailed instructions
