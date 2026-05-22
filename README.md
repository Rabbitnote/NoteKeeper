# NoteKeeper

A real-time collaborative notes app with a Kanban board, live collaboration via SSE, and JWT authentication.

## Screenshots

![Login](backend/screenshots/Login.png)
![Kanban Board](backend/screenshots/Kanbanboard.png)
![New Note](backend/screenshots/new-note.png)
![Live Notes](backend/screenshots/live-note.png)

## Stack

**Backend**
- Go + Gin
- PostgreSQL + pgx
- JWT authentication
- SSE (Server-Sent Events) for real-time updates

**Frontend**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Ant Design (dark theme)
- React Query
- Drag-and-drop Kanban board

## Features

- Register / Login with JWT auth
- Personal notes (My Notes) — private to each user
- Live notes (Live Notes) — shared and collaborative in real-time
- Kanban board with three columns: Todo, Ongoing, Done
- Drag-and-drop to change note status
- Real-time sync across users and tabs via SSE
- Auth-protected routes

## Project Structure

```
notekeeper/
├── backend/
│   ├── db/
│   │   └── migrations/       # SQL migration files
│   ├── internal/
│   │   ├── auth/             # Register, Login handlers + JWT service
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── models/           # User, Note structs
│   │   ├── notes/            # Notes CRUD handlers + service
│   │   └── sse/              # SSE broker + stream handler
│   ├── main.go
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── app/              # Next.js pages
│       ├── components/       # UI components
│       ├── lib/              # API client, hooks, utilities
│       └── types/            # TypeScript types
├── docker-compose.yml
└── README.md
```

## Getting Started

### With Docker (recommended)

```bash
docker-compose up --build
```

This starts PostgreSQL and the Go backend. Migrations run automatically.

### Without Docker

**Backend**

1. Create a `.env` file in `/backend`:
```env
DB_URL=postgres://notekeeper:notekeeper@localhost:5432/notekeeper_db?sslmode=disable
JWT_SECRET=your_secret_here
```

2. Run PostgreSQL and create the database:
```bash
psql -U postgres -c "CREATE USER notekeeper WITH PASSWORD 'notekeeper';"
psql -U postgres -c "CREATE DATABASE notekeeper_db OWNER notekeeper;"
```

3. Run migrations:
```bash
psql "postgres://notekeeper:notekeeper@localhost:5432/notekeeper_db" -f backend/db/migrations/000001_create_users_table.up.sql
psql "postgres://notekeeper:notekeeper@localhost:5432/notekeeper_db" -f backend/db/migrations/000002_create_notes_table.up.sql
```

4. Start the backend:
```bash
cd backend && go run main.go
```

**Frontend**

1. Create a `.env.local` file in `/frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. Install dependencies and start:
```bash
cd frontend && npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT | No |
| GET | `/notes?is_live=false` | Get user's private notes | Yes |
| GET | `/notes?is_live=true` | Get all live notes | Yes |
| POST | `/notes` | Create a note | Yes |
| PUT | `/notes/:id` | Update a note | Yes |
| DELETE | `/notes/:id` | Delete a note | Yes |
| GET | `/notes/stream` | SSE stream for live updates | Yes |

## Real-time Flow

```
User updates a live note
        ↓
PUT /notes/:id → saved to PostgreSQL
        ↓
SSE Broker broadcasts note ID to all connected clients
        ↓
All clients on Live Notes tab refetch and update instantly
```
