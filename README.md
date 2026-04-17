# Student Management System

A full-stack student management application built with Node.js, Fastify, React, and PostgreSQL.

## Tech Stack

### Backend
- Node.js + TypeScript
- Fastify (web framework)
- Prisma (ORM)
- PostgreSQL (database)
- Zod (validation)

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- TanStack Query (data fetching)
- React Hook Form + Zod (forms)
- React Router DOM

## Features

| Feature | Status |
|---------|--------|
| Add Student | ✓ |
| Edit Student | ✓ |
| Delete Student | ✓ |
| View Student List | ✓ |
| Student Details (read-only) | ✓ |
| Photo Upload | ✓ |
| Auto-generated Admission Number | ✓ |
| Course Filter | ✓ |
| Year Filter | ✓ |
| Search | ✓ |
| Stats Cards | ✓ |
| Dark/Light Mode | ✓ |
| Responsive Design | ✓ |

## Project Structure

```
pillai-student-management-system/
├── backend/                 # Fastify API server
│   ├── src/
│   │   ├── app.ts        # Fastify configuration
│   │   ├── server.ts     # Entry point
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # Route definitions
│   │   ├── schemas/     # Zod validation
│   │   └── utils/      # Utilities
│   ├── public/          # Static files (uploads)
│   ├── prisma/         # Database schema
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/    # Page components
│   │   ├── lib/      # API client
│   │   └── context/   # React context
│   └── package.json
├── package.json           # Root scripts
└── README.md            # This file
```

## Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm

### Step 1: Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

Or individually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/student_management
PORT=5000
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Step 3: Run Database Migration

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### Step 4: Start Development Servers

```bash
# From root - starts both frontend and backend
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| PORT | Server port | No (default: 5000) |
| CORS_ORIGIN | Allowed frontend origins | No |
| NODE_ENV | Environment mode | No |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | No (default: http://localhost:5000) |

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/health | Health check |
| GET | /api/students | List all students |
| GET | /api/students/:id | Get student by ID |
| POST | /api/students | Create student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |
