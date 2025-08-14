# Southern Gas Services (SOGAS)

My first solo full-stack web project for **Southern Gas Services**: React frontend (Vite + Tailwind) and Node/Express backend
that handles contact form submissions and sends emails to the comapany inbox.


## Overview
- **Frontend (`client/`)**: Vite + React + Tailwind (via CDN), Framer Motion for animated effects.
- **Backend (`server/`)**: Node.js + Express w/ validation, CORS, Rate Limiting, and Email Delivery (SMTP/Nodemailer).
- **Goal**: A fast, well organized, professional site with a working contact form that delivers to company email: `notices@sogasservices.com`.


## Project Structure
SOGAS/
└─ southern-gas-services/
   ├─ client/           # Frontend (Vite + React)
   ├─ server/           # Backend (Node + Express)
   ├─ .gitignore
   ├─ LICENSE
   └─ README.md
   


## Local Development
1. Frontend
cd client
npm install
npm run dev
- Opens Vite dev server (default: http://localhost:5173)

2. Backend
cd server
npm install
npm start
- Start Express server


## Environment Variables (Backend)
Create a `.env` file inside `server/` with the following keys.  
**Use your own secure values** — These are example placeholders.

# Server
PORT=4000
NODE_ENV=development
# CORS (must match your frontend origin in dev)
CORS_ORIGIN=http://localhost:5173

# Email routing
EMAIL_TO=you@yourdomain.com
EMAIL_FROM="Your Website" <no-reply@yourdomain.com>

# SMTP (from your email provider)
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Basic rate limit
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5


## Contact Form API
Endpoint: POST /api/contact
Content-Type: application/json

Request Body:
{
    "name": "Your Name",            // required, 1–100 chars
    "email": "you@example.com",     // required, valid email format
    "message": "Your message here", // required, 1–5000 chars
    "company": "Optional Co",       // optional, up to 150 chars
     "phone": "optional",           // optional, up to ~30 chars
    "subject": "optional"           // optional, up to 150 chars
}
Success (200)
{ "success": true, "message": "Your message has been sent." }

Validation Error (400)
{
  "success": false,
  "errors": {
    "name": "Name is required",
    "email": "Please enter a valid email",
    "message": "Message is required"
  }
}

Rate Limited (429)
{ "success": false, "message": "Too many requests. Please try again later." }

Server Error (500)
{ "success": false, "message": "Unable to send your message right now. Please try again later." }


## Tech Stack
- Frontend: React + Vite + Tailwind (CDN) + Framer Motion
- Backend: Node.js + Express + Nodemailer + express-rate-limit + CORS + validation
- Tooling: Git + GitHub

## Scripts
Frontend (client)
npm run dev - starts Vite dev server
npm run build - production build
npm run preview - preview production build

Backend (server)
npm start - starts Express server
npm run dev - start with nodemon


## License
© 2025 Abby Lee. All rights reserved.
This software is the intellectual property of Abby Lee and is licensed for use by Southern Gas Services. 
No part of this repository may be copied, modified, or distributed without explicit written permission from the copyright holder.

## Contact

For project inquiries or licensing requests, contact:

Abby Lee
Email: abbychrislee@gmail.com
GitHub: http://github.com/abbyyleee

For Souther Gas Services business inquiries: notices@sogasservices.com
