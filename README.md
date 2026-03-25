# Angular + Elysia Task Manager

Full-stack task manager application with:
- Angular frontend
- Elysia backend (Bun runtime)
- PostgreSQL database via Prisma

## Project Structure

```
angular-elysia/
|- backend/    # Elysia API + Prisma + PostgreSQL
|- frontend/   # Angular UI
`- README.md
```

## Tech Stack

- Frontend: Angular 18, RxJS
- Backend: Elysia, Bun, Zod
- Database: PostgreSQL, Prisma ORM

## Prerequisites

Install these before running the project:
- Node.js 18+ (recommended for Angular tooling)
- Bun 1.0+
- PostgreSQL 14+

## Environment Variables

Create a `.env` file inside `backend/`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME?schema=public"
```

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager?schema=public"
```

## Installation

Install dependencies for both apps:

```bash
# root (optional tooling deps)
npm install

# backend
cd backend
bun install

# frontend
cd ../frontend
npm install
```

## Database Setup (Prisma)

From `backend/`:

```bash
# apply existing migration(s)
bunx prisma migrate deploy

# generate Prisma client
bunx prisma generate
```

For local development, you can also use:

```bash
bunx prisma migrate dev
```

## Run the Application

Run backend and frontend in separate terminals.

### 1) Start Backend (Elysia)

From `backend/`:

```bash
bun run dev
```

Backend URL:
- `http://localhost:3000`

### 2) Start Frontend (Angular)

From `frontend/`:

```bash
npm start
```

Frontend URL:
- `http://localhost:4200`

## API Overview

Base URL: `http://localhost:3000`

### Categories

- `GET /categories` - list categories
- `POST /categories` - create category

Create category payload:

```json
{
	"name": "Work"
}
```

### Tasks

- `GET /tasks` - list active (not soft-deleted) tasks
- `GET /tasks/:id` - get one task
- `POST /tasks` - create task
- `PUT /tasks/:id` - update task
- `DELETE /tasks/:id` - soft delete task (`deletedAt` is set)

Task status values:
- `pending`
- `in_progress`
- `done`

Create task payload:

```json
{
	"title": "Finish homework",
	"description": "Complete Angular and backend integration",
	"status": "pending",
	"categoryId": 1
}
```

Update task payload (all fields optional):

```json
{
	"status": "done"
}
```

## Useful Commands

From `backend/`:

```bash
bun run dev            # start API in watch mode
bun run start          # start API once
bunx prisma studio     # open Prisma Studio
```

From `frontend/`:

```bash
npm start              # run Angular dev server
npm run build          # production build
npm test               # unit tests
```

## Notes

- CORS is configured in backend for `http://localhost:4200`.
- Frontend services call backend directly at:
	- `http://localhost:3000/tasks`
	- `http://localhost:3000/categories`
