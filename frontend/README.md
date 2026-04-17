# Student Management System - Frontend

A React + TypeScript frontend for the Student Management System with full CRUD operations and photo upload.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Notifications:** Sonner

## Prerequisites

- Node.js (v18+)
- Backend server running on http://localhost:5000

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Student list page with stats, filters |
| `/students/new` | Add new student |
| `/students/:id` | View student details (read-only) |
| `/students/:id/edit` | Edit existing student |

## Features

- **Student List:**
  - Responsive table (desktop) / cards (mobile)
  - Stats cards: Total Students, New Admissions This Month, Active Courses
  - Search by name, admission number, course
  - Course filter dropdown
  - Year filter dropdown
  - Photo thumbnails
  - Actions: View, Edit, Delete
  - Delete confirmation modal
  - Loading skeletons / empty states
  - Dark/light mode toggle

- **Add/Edit Student:**
  - Form with all required fields
  - Photo upload with preview
  - Zod + React Hook Form validation
  - Progress indicator during submission
  - Success/error toasts

- **Student Details Page:**
  - Read-only view of all student fields
  - Photo display
  - Back button to list
  - Edit button to edit page
  - Loading skeleton
  - 404 handling if student not found

## How to Test

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. Add a student with photo
5. Edit the student
6. Delete a student

## API Connection

The frontend connects to the backend via:
- `VITE_API_URL` environment variable (default: http://localhost:5000)

Proxy is configured in vite.config.ts to forward API and upload requests to backend.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx        # App header with theme toggle
│   │   ├── StatsCard.tsx     # Stats display card
│   │   ├── Modal.tsx         # Delete confirmation modal
│   │   ├── Skeleton.tsx      # Loading skeleton
│   │   └── ThemeToggle.tsx  # Dark/light mode toggle
│   ├── context/
│   │   └── ThemeContext.tsx  # Theme provider
│   ├── lib/
│   │   ├── api.ts          # Axios API client
│   │   └── utils.ts        # Utility functions
│   ├── pages/
│   │   ├── StudentList.tsx   # List with filters/search
│   │   ├── StudentForm.tsx  # Add/Edit form
│   │   └── StudentDetails.tsx # Read-only details
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Tailwind imports
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── index.html
```