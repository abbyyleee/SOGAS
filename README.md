# Southern Gas Services (SOGAS)

My first solo full-stack web project for **Southern Gas Services**: React frontend (Vite + Tailwind) and Node/Express backend
that handles contact form submissions and sends emails to the comapany inbox.

## Overview

- **Frontend (`client/`)**: Vite + React + Tailwind (via CDN), Framer Motion for animated effects.
- **Backend (`server/`)**: Node.js + Express w/ validation, CORS, Rate Limiting, and Email Delivery (SMTP/Nodemailer).
- **Goal**: A fast, well organized, professional site with a working contact form that delivers to company email: `notices@sogasservices.com`.

## Project Structure

SOGAS/<br/>
└─ southern-gas-services/<br/>
├─ client/ # Frontend (Vite + React)<br/>
├─ server/ # Backend (Node + Express)<br/>
├─ .gitignore<br/>
├─ LICENSE<br/>
└─ README.md

## Local Development

**1. Frontend:**<br/>
cd client<br/>
npm install<br/>
npm run dev

- Opens Vite dev server (default: http://localhost:5173)

**2. Backend:**<br/>
cd server<br/>
npm install<br/>
npm start<br/>

- Starts Express server

## Environment Variables (Backend)

Create a `.env` file inside `server/` with the following keys.  
**Use your own secure values** — These are example placeholders.

## Server

PORT=4000<br/>
NODE_ENV=development<br/>

## CORS (Frontend Origin)

CORS_ORIGIN=http://localhost:5173

## Email Routing (Placeholder)

EMAIL_TO=you@yourdomain.com<br/>
EMAIL_FROM="Your Website" <no-reply@yourdomain.com>

## SMTP (Email Provider)

SMTP_HOST=smtp.your-email-provider.com <br/>
SMTP_PORT=587<br/>
SMTP_USER=your_smtp_username<br/>
SMTP_PASS=your_smtp_password

## Basic rate limit

RATE_LIMIT_WINDOW_MS=60000<br/>
RATE_LIMIT_MAX=5

## Contact Form API

Endpoint: POST /api/contact<br/>
Content-Type: application/json

Request Body:<br/>
{<br/>
"name": "Your Name", // required, 1–100 chars<br/>
"email": "you@example.com", // required, valid email format<br/>
"message": "Your message here", // required, 1–5000 chars<br/>
"company": "Optional Co", // optional, up to 150 chars<br/>
"phone": "optional", // optional, up to 30 chars<br/>
"subject": "optional" // optional, up to 150 chars<br/>
}

Success (200)<br/>
{ "success": true, "message": "Your message has been sent." }

Validation Error (400)<br/>
{<br/>
"success": false,<br/>
"errors": {<br/>
"name": "Name is required",<br/>
"email": "Please enter a valid email",<br/>
"message": "Message is required"}<br/>
}

Rate Limited (429)<br/>
{ "success": false, "message": "Too many requests. Please try again later." }

Server Error (500)<br/>
{ "success": false, "message": "Unable to send your message right now. Please try again later." }

## Tech Stack

- Frontend: React + Vite + Tailwind (CDN) + Framer Motion
- Backend: Node.js + Express + Nodemailer + express-rate-limit + CORS + validation
- Tooling: Git + GitHub

## Scripts

**Frontend (client):**<br/>
npm run dev - starts Vite dev server<br/>
npm run build - production build</br>
npm run preview - preview production build

**Backend (server):**<br/>
npm start - starts Express server<br/>
npm run dev - start with nodemon

## License

© 2025 Abby Lee. All rights reserved.<br/>
This software is the intellectual property of Abby Lee and is licensed for use by Southern Gas Services.
No part of this repository may be copied, modified, or distributed without explicit written permission from the copyright holder.

## Contact

For project inquiries or licensing requests, contact:

Abby Lee<br/>
Email: abbychrislee@gmail.com<br/>
GitHub: http://github.com/abbyyleee

For Southern Gas Services business inquiries: notices@sogasservices.com
