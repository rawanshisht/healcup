# Setup & Development Guide

## Quick Start

```bash
cd hijama-clinic
npm run dev
# → http://localhost:3000
```

## Environment Variables (`.env.local`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string ✅ set |
| `ADMIN_USERNAME` | Admin login username (default: `admin`) |
| `ADMIN_PASSWORD` | Admin login password (default: `hijama2024!`) |
| `AUTH_SECRET` | Random 32-char string — **change before going live** |
| `RESEND_API_KEY` | Get from resend.com — needed for confirmation emails |
| `RESEND_FROM` | From email address for booking confirmations |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (digits only, no + or spaces) |
| `NEXT_PUBLIC_CLINIC_PHONE` | Display phone number |
| `NEXT_PUBLIC_CLINIC_EMAIL` | Display email address |
| `NEXT_PUBLIC_CLINIC_NAME` | Clinic name shown in header/footer |
| `NEXT_PUBLIC_GOOGLE_MAPS_URL` | Google Maps link for contact page |

## Pages

| URL | Description |
|---|---|
| `/` | Home |
| `/about` | About Us |
| `/services` | Services & Prices |
| `/how-it-works` | Treatment process + pre/aftercare |
| `/book` | 3-step booking request form |
| `/faq` | FAQ (12 questions, accordion) |
| `/contact` | Contact + map |
| `/privacy` | Privacy Policy & Terms |
| `/admin/login` | Admin login |
| `/admin` | Appointment dashboard |
| `/admin/services` | Manage services (add/edit/hide) |
| `/admin/blocked-dates` | Block off dates |

## Database

- **Provider:** Neon PostgreSQL (serverless)
- **Project:** `hijama-clinic` (ID: `red-pine-50320867`)
- **ORM:** Drizzle ORM

Tables: `services`, `appointments`, `blocked_dates`

## Email (Resend)

1. Sign up at resend.com
2. Add your domain and verify it
3. Set `RESEND_API_KEY` and `RESEND_FROM` in `.env.local`
4. Confirmation emails will be sent automatically on booking

## Before Going Live

- [ ] Change `ADMIN_PASSWORD` in `.env.local`
- [ ] Generate a proper `AUTH_SECRET` (`openssl rand -base64 32`)
- [ ] Set up Resend API key and verified sending domain
- [ ] Update clinic name, phone, email, WhatsApp number in `.env.local`
- [ ] Update address in `Footer.tsx` and `contact/page.tsx`
- [ ] Add Google Maps embed to contact page
- [ ] Add Instagram/social media links in `Footer.tsx`
- [ ] Update opening hours in `contact/page.tsx`
- [ ] Replace stock image references with real clinic photos
- [ ] Update testimonials in `page.tsx` with real reviews
- [ ] Set a real domain and update `NEXTAUTH_URL`
