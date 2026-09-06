# Client Lead Management System (Mini CRM)

A simple CRM to manage leads coming from a website contact form — view leads, update their status, add follow-up notes, and track everything from a secure admin dashboard.

**Live site:** https://future-fs-02-s61n-one.vercel.app

## About

Built for a full-stack task: create a system where a business can view leads from their website, move them through a status pipeline (New → Contacted → Converted), add notes, and manage everything from a secure admin panel.

## Features

- Admin login (JWT-based, only admins can access the dashboard)
- Lead listing with name, email, source, and status
- Update lead status: New → Contacted → Converted
- Add follow-up notes to any lead
- Manually add a lead from the dashboard (with status and follow-up date)
- Search and filter leads by name, email, or status
- Analytics: total leads, conversion rate, status and source breakdown charts
- Activity log of every action (lead created, status changed, note added)
- A demo contact form to simulate real leads coming in from a website

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Recharts, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Deployment | Vercel (frontend + backend), MongoDB Atlas |

## Project Structure

```
mini-crm/
├── backend/              # Express API + MongoDB models
├── frontend/             # React admin dashboard
├── demo-contact-form/    # Standalone HTML form to simulate a website contact form
└── README.md
```

## Setup Instructions

### Step 0 — Prerequisites

Before you start, make sure you have:

- [Node.js](https://nodejs.org/) v18 or later installed
- npm (comes with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account (free tier is enough), or a local MongoDB instance

### Step 1 — Clone the repository

```bash
git clone https://github.com/Nidhikulal/FUTURE_FS_02.git
cd FUTURE_FS_02
```

### Step 2 — Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend` (you can copy `.env.example` if one is provided) with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### Step 3 — Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

### Step 4 — Log in

Open `http://localhost:5173` in your browser and log in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in the backend's `.env` file.

### Step 5 — (Optional) Test with the demo contact form

Open `demo-contact-form/index.html` directly in your browser — no server needed for this file itself. Submitting it sends a real lead to your running backend, so you'll see it appear on the dashboard right away, simulating how a real website's contact form would feed leads into this CRM.

## Demo Login (for the live deployed site)

```
Email:    admin@gmail.com
Password: CrmSecure123
```

## API Routes

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Admin login, returns a JWT |
| POST | `/api/leads` | Public | Create a lead (used by the contact form) |
| POST | `/api/leads/admin` | Admin | Manually add a lead with status/follow-up date |
| GET | `/api/leads` | Admin | List all leads (`?status=`, `?search=`) |
| GET | `/api/leads/:id` | Admin | Get one lead's full detail |
| PATCH | `/api/leads/:id/status` | Admin | Update a lead's status |
| POST | `/api/leads/:id/notes` | Admin | Add a follow-up note |
| DELETE | `/api/leads/:id` | Admin | Delete a lead |
| GET | `/api/leads/analytics/summary` | Admin | Totals, conversion rate, breakdowns |
| GET | `/api/activity` | Admin | Recent activity log |

## Notes

- The demo credentials above are for evaluation purposes only.
- `.env` files are not committed to this repository — you must create your own using the format shown above.
