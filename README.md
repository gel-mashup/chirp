# Chirp
A Twitter-like microblogging application. This app is intentionally built with bugs, performance issues, and UX problems at various skill levels.

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development without Docker)

## Quick Start with Docker (Recommended)

The fastest way to get the app running — no local PostgreSQL or Node.js setup needed.

```bash
# Start the application
docker-compose up

# The app will be available at http://localhost:3000
# PostgreSQL will be available at localhost:5432
```

## Local Development (Without Docker)

If you prefer to run without Docker, you'll need PostgreSQL installed locally.

## Test Accounts

After seeding, you can log in with any of these accounts:

| Email | Password |
|-------|----------|
| alice@example.com | password123 |
| bob@example.com | password123 |
| charlie@example.com | password123 |
| diana@example.com | password123 |
| evan@example.com | password123 |

## Features

- User registration and authentication
- Create and view posts (chirps)
- Like posts
- Follow/unfollow users
- Search users
- User profile pages
- Timeline view

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   │   ├── auth/     # Auth endpoints (login/register)
│   │   │   ├── posts/    # Posts endpoints
│   │   │   ├── users/    # Users endpoints
│   │   │   └── reports/  # Activity reports
│   │   ├── (auth)/       # Auth pages (login/register)
│   │   ├── explore/      # Explore page
│   │   └── profile/      # Profile page
│   ├── components/       # React components
│   ├── lib/              # Utilities, Prisma client, auth, report
│   └── types/            # TypeScript types
├── __tests__/            # Test files
├── docker-compose.yml    # Development Docker setup
├── Dockerfile           # Development Dockerfile
└── Dockerfile.prod      # Production Dockerfile
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm test` | Run baseline feature tests |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | postgresql://... |
| `NEXTAUTH_SECRET` | Secret for NextAuth | - |
| `NEXTAUTH_URL` | Application URL | http://localhost:3000 |

## License

MIT
