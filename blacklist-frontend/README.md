# Blacklist Frontend

Next.js frontend application for the Blacklist project.

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Homepage**: Simple interface with a button to fetch greetings from the backend
- **API Integration**: Connects to backend at `http://localhost:3001`
- **Error Handling**: Graceful error handling for API requests

## Project Structure

```
src/
└── app/
    ├── page.tsx        # Main homepage with greeting button
    ├── layout.tsx      # Root layout
    └── globals.css     # Global styles
```

## Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run linting

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Runtime**: Bun
