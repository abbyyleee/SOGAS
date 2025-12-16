# Project SOGAS — Southern Gas Services Website + Admin Dashboard

A production-ready full-stack application built for **Southern Gas Services**. It combines a modern React frontend (Vite + Tailwind) with a Node/Express API, Supabase (Postgres) database, and Resend email service to power a public marketing site and a secure admin dashboard for managing site content, gallery images, and contact submissions.

## Overview

- **Frontend (`client/`)**: Vite + React + Tailwind (via CDN) with a custom blue theme, plus Framer Motion for smooth, production-quality animations.
- **Backend (`server/`)**: Node.js + Express REST API with validation, CORS, rate limiting, health checks, and admin-protected routes.
- **Data & Storage**: Supabase (Postgres) for persistent storage of site content, gallery images/metadata, and contact submissions.
- **Email Delivery**: Resend for sending contact form notifications to the Southern Gas Services inbox.
- **Goal**: A real-world, production-ready marketing site and a user-friendly admin dashboard that the company can use to manage content, gallery media, and customer inquiries without touching the codebase.

## Project Structure

```txt
southern-gas-services/
├── client/           # Frontend (Vite + React + Tailwind + Framer Motion)
├── server/           # Backend (Node + Express REST API)
├── .gitignore        # Git ignore rules (node_modules, env files, build output, etc.)
├── LICENSE           # Project license and ownership terms
└── README.md         # Project documentation (this file)
```

## Local Development

**1. Frontend (`client/`):**<br/>
cd client<br/>
npm install<br/>
npm run dev<br/>
- Starts Vite dev server (default: http://localhost:5173)

**2. Backend (`server/`):**<br/>
cd server<br/>
npm install<br/>
npm run dev<br/>
- Starts Express API server (default: http://localhost:5000, or whatever `PORT` is set to in your `.env`)


## Environment Variables (Backend)

Create a `.env` file inside `server/` with the following keys.  
**Use your own secure values** — the values below are examples and should be replaced with your real secrets locally.

**Server**<br/>
PORT=3000<br/>
NODE_ENV=development<br/>

**CORS / Frontend Origin**<br/>
CORS_ORIGIN=http://localhost:5173<br/>

**Email (IONOS SMTP)**<br/>
SMTP_HOST=smtp.ionos.com<br/>
SMTP_PORT=587<br/>
SMTP_SECURE=false<br/>
SMTP_USER=notices@sogasservices.com<br/>
SMTP_PASS=your_smtp_password_here<br/>

**Email (Resend + routing)**<br/>
RESEND_API_KEY=your_resend_api_key_here<br/>
EMAIL_FROM=SOGAS Website <notices@sogasservices.com><br/>
CONTACT_TO=notices@sogasservices.com<br/>
CONTACT_FROM=SOGAS Website <notices@sogasservices.com><br/>

**Cloudinary (media storage)**<br/>
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here<br/>
CLOUDINARY_API_KEY=your_cloudinary_api_key_here<br/>
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here<br/>

**Database (Supabase / Postgres)**<br/>
DATABASE_URL=postgresql://your_user:your_password@your-host:your-port/your-db-name<br/>

**Auth**<br/>
JWT_SECRET=your_jwt_secret_here<br/>

## Contact Form API

Endpoint: `POST /api/contact`<br/>
Content-Type: `application/json`

**Request Body**<br/>
{<br/>
&nbsp;&nbsp;"name": "Your Name", &nbsp;// required, 1–100 chars<br/>
&nbsp;&nbsp;"email": "you@example.com", &nbsp;// required, valid email format<br/>
&nbsp;&nbsp;"message": "Your message here", &nbsp;// required, 1–5000 chars<br/>
&nbsp;&nbsp;"company": "Optional Co", &nbsp;// optional, up to 150 chars<br/>
&nbsp;&nbsp;"phone": "optional", &nbsp;// optional, up to 30 chars<br/>
&nbsp;&nbsp;"subject": "optional" &nbsp;// optional, up to 150 chars<br/>
}

**Behavior**<br/>
- Validates the request body (required fields, lengths, and formats).<br/>
- Enforces rate limiting based on `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX`.<br/>
- Sends a notification email to `CONTACT_TO` using the configured email provider (Resend / SMTP).<br/>
- (Optionally) Stores the submission in the database for viewing in the admin dashboard, depending on the current deployment configuration.<br/>

**Success (200)**<br/>
{ "success": true, "message": "Your message has been sent." }

**Validation Error (400)**<br/>
{<br/>
&nbsp;&nbsp;"success": false,<br/>
&nbsp;&nbsp;"errors": {<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"name": "Name is required",<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"email": "Please enter a valid email",<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"message": "Message is required"<br/>
&nbsp;&nbsp;}<br/>
}

**Rate Limited (429)**<br/>
{ "success": false, "message": "Too many requests. Please try again later." }

**Server Error (500)**<br/>
{ "success": false, "message": "Unable to send your message right now. Please try again later." }

## Tech Stack

- **Frontend:** React + Vite + Tailwind (CDN) + Framer Motion  
- **Backend:** Node.js + Express (REST API) + validation + CORS + express-rate-limit  
- **Database:** Supabase (Postgres), connected via `DATABASE_URL`  
- **Email:** Resend (primary) and IONOS SMTP (historical/backup configuration)  
- **Media Storage:** Cloudinary for hosting gallery images (URL + metadata stored in the database)  
- **Tooling:** Git + GitHub, environment-based configuration with `.env` files (not committed)


## Scripts

**Frontend (`client/`):**<br/>
npm run dev - start Vite dev server (development)<br/>
npm run build - create optimized production build<br/>
npm run preview - preview the production build locally<br/>

**Backend (`server/`):**<br/>
npm run dev - start Express server in development mode (e.g., with nodemon)<br/>
npm start - start Express server in production mode<br/>

## License

© 2025 Abby Lee. All rights reserved.<br/>
This software is the intellectual property of Abby Lee and is licensed for use by Southern Gas Services.<br/>
No part of this repository may be copied, modified, or distributed without explicit written permission from the copyright holder.

## Contact

For project inquiries or licensing requests, contact:<br/><br/>
Abby Lee<br/>
Email: abbychrislee@gmail.com<br/>
GitHub: https://github.com/abbyyleee<br/>

For Southern Gas Services business inquiries:<br/>
notices@sogasservices.com

