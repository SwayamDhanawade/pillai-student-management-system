# Student Management System - Backend

This is the backend API for the Pillai Student Management System built with Fastify, TypeScript, PostgreSQL, and Prisma.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Fastify
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **File Upload:** @fastify/multipart + @fastify/static

## Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Edit `.env` with your PostgreSQL connection string:
```
DATABASE_URL=postgresql://username:password@localhost:5432/student_management
PORT=5000
NODE_ENV=development
```

### 3. Run Prisma Migration

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Available Endpoints

### Health Check
```
GET /api/health
```

### Get All Students
```
GET /api/students
```

### Get Student by ID
```
GET /api/students/:id
```

### Create Student (with optional photo)
```
POST /api/students
Content-Type: multipart/form-data
```

Fields:
- name (string, required)
- course (string, required)
- year (number, required)
- dateOfBirth (string, required)
- email (string, required)
- mobileNumber (string, required)
- gender (string, required)
- address (string, required)
- photo (file, optional) - Image files only, max 5MB

### Update Student (with optional photo update)
```
PUT /api/students/:id
Content-Type: multipart/form-data
```

### Delete Student
```
DELETE /api/students/:id
```

## Photo Upload

- Photos are stored in `backend/public/uploads/` (local storage)
- Thumbnails are generated (150x150) and stored in `backend/public/uploads/`
- Files are served via `/uploads/*` route
- Supported formats: jpg, jpeg, png, gif, webp
- Max file size: 5MB
- Old photo is replaced when updating with new photo
- Photos are sent as base64 in the request body (not multipart form data)

### Storage Limitation

> **Important:** This implementation uses local file storage. On platforms with ephemeral/restartable containers (like Railway, Render, Heroku), uploaded files will be lost on container restart or redeployment.

For a production system, consider using object storage:
- **AWS S3** + CloudFront CDN
- **Cloudinary** (includes image transformations)
- **Uploadcare** - Simple file upload API

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | Required |
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| CORS_ORIGIN | Allowed frontend origins (comma-separated) | http://localhost:5173,http://localhost:3000 |

### CORS_ORIGIN Configuration

For local development:
```
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

For production (example with Vercel and custom domain):
```
CORS_ORIGIN=https://your-app.vercel.app,https://yourdomain.com
```

Multiple origins can be comma-separated:
```
CORS_ORIGIN=https://app1.vercel.app,https://app2.vercel.app
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations

## Project Structure

```
backend/
├── src/
│   ├── app.ts              # Fastify configuration
│   ├── server.ts           # Entry point
│   ├── lib/prisma.ts       # Prisma client
│   ├── routes/             # Route definitions
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── schemas/            # Zod validation
│   ├── utils/              # Utilities
│   │   ├── generateAdmissionNumber.ts
│   │   └── fileUpload.ts
│   └── types/              # TypeScript types
├── public/uploads/        # Uploaded photos
├── prisma/schema.prisma   # Database schema
└── package.json
```

## Features

- [x] Full CRUD operations
- [x] Auto-generated admission numbers (ADM2026XXXX)
- [x] Zod validation
- [x] Photo upload and storage
- [x] CORS enabled
- [x] Centralized error handling