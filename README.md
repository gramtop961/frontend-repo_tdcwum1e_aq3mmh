# NoteBuddy — Share & Discover

Mobile-first, bilingual note-sharing app for Nepali +2 students. Public library with admin-only curation. PDFs hosted on Google Drive (manual links).

## Highlights
- Mobile-first UI with floating bottom nav and animated logo
- Bilingual EN/ने via i18n tokens (persisted in localStorage)
- No public signups; public uploads go to admin review
- Admin panel at /mukesh (buddy / buddy_mukesh123@)
- MongoDB persistence for notes, uploads, contributors, settings
- SEO meta via react-helmet-async
- PDF viewer using pdf.js with fallback to open in Drive

## Design System
- Colors: Cream #FAF9F6, Surface #FFFFFF, Primary #2F7DAF, Accent Green #86B44B, Accent Orange #F6A33D, Indigo #23486B, Subtle Gray #8A8F98
- Radius: 12px (cards/buttons), 24px (floating bar), pills 9999px
- Shadow: 0 6px 18px rgba(35,72,107,0.08)
- Spacing: 4, 8, 12, 16, 20, 24, 32, 48
- Type: Poppins/Nunito Sans (headings), Inter (body)

## Backend API
- Public
  - GET /api/notes — list, supports q, subject, class_level, college, skip, limit
  - GET /api/notes/{id}
  - POST /api/uploads — create pending upload
  - GET /api/leaderboard — top contributors
  - GET /api/settings
- Admin (Bearer admin-token)
  - POST /api/admin/login
  - GET /api/admin/uploads?status=pending|accepted|rejected
  - POST /api/admin/uploads/{id}/accept
  - POST /api/admin/uploads/{id}/reject
  - GET /api/admin/contributors
  - POST /api/admin/contributors
  - POST /api/admin/contributors/adjust-points
  - PUT /api/admin/settings

## Google Drive Workflow
1. Contributor: upload PDF to Drive, copy view-only link, submit via Upload modal
2. Admin: review in /mukesh pending list; Accept → creates a Note and assigns Knowledge Points to contributor name
3. If Drive link blocks preview, open in Drive via button

## Local Development
- Frontend: Vite + React + Tailwind
- Backend: FastAPI + Uvicorn + Motor
- .env
  - Frontend: VITE_BACKEND_URL=http://localhost:8000
  - Backend: DATABASE_URL=mongodb://localhost:27017, DATABASE_NAME=notebuddy

## Accessibility & SEO
- Keyboard accessible controls, focus rings, semantic labels
- Meta tags & OpenGraph via Helmet, JSON-LD can be added per page

## Roadmap
- Subjects/Colleges management UI
- Analytics dashboard
- More i18n coverage and content pages
