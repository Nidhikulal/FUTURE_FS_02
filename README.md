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
- Manually add a lead from the dashboard
- Search and filter leads
- Analytics: total leads, conversion rate, status and source breakdown charts
- Activity log of every action (lead created, status changed, note added)
- A demo contact form to simulate real leads coming in

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT
- **Deployment:** Vercel

## Project Structure

```
mini-crm/
├── backend/         # Express API
├── frontend/        # React dashboard
└── demo-contact-form/  # Test form to simulate a website contact form
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
```

Run it:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Open `http://localhost:5173` and log in with the admin email/password from your backend `.env`.

### Test it

Open `demo-contact-form/index.html` in your browser and submit it — the lead will show up on your dashboard right away.

## Demo Login (for the live site)

```
Email: admin@gmail.com
Password: CrmSecure123
```

## API Routes

| Method | Route | Access |
|---|---|---|
| POST | /api/auth/login | Public |
| POST | /api/leads | Public (used by contact form) |
| POST | /api/leads/admin | Admin (manual add) |
| GET | /api/leads | Admin |
| PATCH | /api/leads/:id/status | Admin |
| POST | /api/leads/:id/notes | Admin |
| DELETE | /api/leads/:id | Admin |
| GET | /api/leads/analytics/summary | Admin |
| GET | /api/activity | Admin |
