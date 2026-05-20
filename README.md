# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. Designed with clean architecture, scalable code practices, and a professional user experience.

## Live Deployment

- **Frontend Application:** [https://smart-leads-dashboard-1-078j.onrender.com](https://smart-leads-dashboard-1-078j.onrender.com)

## Features

- **Authentication System**: Secure JWT-based authentication with bcrypt hashing.
- **Role-Based Access Control**: Differentiates between 'Admin' (can delete leads) and 'Sales User' (view/edit only).
- **Leads Management**: Full CRUD capabilities for lead tracking.
- **Advanced Filtering & Search**: Debounced search by name/email, filter by status and source, and sorting capabilities.
- **Pagination**: Backend-driven pagination handling large datasets seamlessly.
- **CSV Export**: Export filtered/searched leads to a CSV file.
- **Dark Mode Support**: Seamless toggle between light and dark themes using TailwindCSS.
- **Responsive UI**: Clean, responsive design built with Tailwind CSS and accessible UI components.

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, lucide-react
- **State Management**: Zustand (Auth, Theme)
- **Routing**: React Router DOM v6
- **Forms & Validation**: react-hook-form, Zod
- **API Communication**: Axios

### Backend
- **Framework**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Validation**: Zod
- **Authentication**: jsonwebtoken, bcryptjs
- **Export**: json2csv

## Prerequisites

- Node.js (v18+)
- MongoDB (Local instance or Atlas URI)
- Docker & Docker Compose (optional, for Docker setup)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Environment Setup

**Backend `.env`** (create in `./backend/.env` based on `./backend/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leads-dashboard
JWT_SECRET=supersecretjwtkey_please_change
JWT_EXPIRES_IN=1d
```

**Frontend `.env`** (create in `./frontend/.env` based on `./frontend/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Locally (Without Docker)

**Start the Backend:**
```bash
cd backend
npm install
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Run with Docker Compose

Ensure Docker is running, then run the following command from the root directory:
```bash
docker-compose up --build
```
- Frontend will be accessible at `http://localhost` (or `http://localhost:80`)
- Backend will be accessible at `http://localhost:5000`

## API Documentation

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and get token | Public |
| GET | `/api/auth/profile` | Get current user | Private |
| GET | `/api/leads` | Get leads (supports pagination, filtering, search, sort) | Private |
| POST | `/api/leads` | Create a lead | Private |
| GET | `/api/leads/:id` | Get single lead | Private |
| PUT | `/api/leads/:id` | Update a lead | Private |
| DELETE | `/api/leads/:id` | Delete a lead | Private (Admin Only) |
| GET | `/api/leads/export` | Export leads to CSV | Private |
