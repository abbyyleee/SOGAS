import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { sendContactEmail } from './utils/mailer.js';

const app = express();

// ----------------- Core config -----------------
const PORT = process.env.PORT || 4000;

// Parse JSON bodies
app.use(express.json({ limit: '100kb' }));

// ----------------- Security & visibility -----------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: false,
  })
);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ----------------- Rate Limiting -----------------
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,            // 120 req/min per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

const strictPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,                  // 20 requests / 15 min / IP
  message: { ok: false, error: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ----------------- Routes -----------------
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'southern-gas-backend',
    time: new Date().toISOString(),
  });
});

// Contact form endpoint
const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required').max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(5, 'Message is too short').max(5000),
});

app.post('/api/contact', strictPostLimiter, async (req, res, next) => {
  try {
    const data = ContactSchema.parse(req.body);

    await sendContactEmail(data);

    return res.json({ ok: true, message: 'Message sent successfully.' });
  } catch (err) {
    if (err?.name === 'ZodError') {
      const first = err.issues?.[0]?.message || 'Invalid input';
      return res.status(400).json({ ok: false, error: first, details: err.issues });
    }
    return next(err);
  }
});

app.get('/', (req, res) => {
  res.type('text/plain').send('Southern Gas Backend: OK');
});

// ----------------- 404 handler -----------------
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
});

// ----------------- Error handler -----------------
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled error:', err);
  }
  res.status(status).json({ ok: false, error: message });
});

// ----------------- Start server -----------------
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
