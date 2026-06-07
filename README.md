# DevCanvas — Personal Blog Platform

A full-stack personal blog with a public reading experience and an admin dashboard for writing posts, moderating comments, and viewing stats.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, React Router, Lucide React |
| **Backend** | Node.js, Express, Mongoose |
| **Database** | MongoDB |
| **Auth** | JWT, bcryptjs |
| **Deployment** | Vercel (frontend and backend as separate projects) |

## Project Structure

```
├── frontend/     # React + Vite client
├── backend/      # Express REST API
│   ├── api/      # Vercel serverless entry point
│   ├── config/   # Database connection
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=mongodb://127.0.0.1:27017/personal_blog
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Optional admin seed values (used when no users exist yet):

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword123
ADMIN_USERNAME=Blog Admin
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the app

Run the backend and frontend in separate terminals:

```bash
# Terminal 1 — API (default port 5000)
cd backend
npm start

# Terminal 2 — client (default port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Default admin login

If no admin user exists, one is created on first API request:

- **Email:** `admin@example.com`
- **Password:** `adminpassword123`

## Available Scripts

### Backend (`backend/`)

| Command | Description |
|---------|-------------|
| `npm start` | Start the Express server |

### Frontend (`frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## API Overview

| Route prefix | Purpose |
|--------------|---------|
| `/api/auth` | Login and session |
| `/api/posts` | Blog posts (public + admin) |
| `/api/comments` | Comments on posts |

Health check: `GET /` returns `Personal Blog API is running...`

## Deploying to Vercel

Deploy **frontend** and **backend** as two separate Vercel projects:

| Project | Root Directory | Key env vars |
|---------|----------------|--------------|
| Frontend | `frontend` | `VITE_API_URL=https://your-backend.vercel.app/api` |
| Backend | `backend` | `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` |

After changing environment variables, redeploy so the build picks up the latest values (especially `VITE_API_URL` on the frontend).
