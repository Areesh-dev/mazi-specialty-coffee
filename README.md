# ☕ Mazi Specialty Coffee — Karachi

A premium full-stack web application for Mazi Specialty Coffee, a nostalgic backyard café in Karachi. Built with React, Node.js, Express, and Supabase.

![Mazi Specialty Coffee](https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200)

---

## 📖 Overview

Mazi Specialty Coffee is a complete café management system with:

- **Public Website** — Modern, responsive, editorial-style design showcasing menu, events, collaborations, and reviews
- **Admin Panel** — Full CRUD management for every aspect of the café
- **Secure Backend** — Express API with JWT authentication, Zod validation, and Supabase RLS
- **Database-Driven** — Every piece of content is dynamic and manageable from the admin panel

---

## ✨ Features

### Public Website
| Feature | Description |
|---------|-------------|
| 🏠 **Modern Landing Page** | Editorial hero slider with animated transitions |
| 📖 **Digital Menu** | Category filtering, search, and detailed item pages |
| 🎉 **Events** | Past events with gallery + upcoming events with booking |
| 🤝 **Collaborations** | Partner showcase with editorial layout |
| ⭐ **Reviews** | Verified customer reviews with submission form |
| 📞 **Contact** | Live map, contact info, and business hours |
| 🔍 **Global Search** | Search across menu, events, and collaborations |
| 🌓 **Dynamic Theme** | Live color/typography customization from admin |

### Admin Panel
| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Real-time stats with quick actions |
| 📂 **Categories** | Full CRUD with images and display order |
| ☕ **Menu Management** | Items with featured/availability toggles |
| 🎉 **Events** | Past events + per-event gallery management |
| 📅 **Upcoming Events** | Featured events with booking URLs |
| 🤝 **Collaborations** | Partner management |
| ⭐ **Review Moderation** | Approve / Decline / Delete with tabs |
| 🎨 **Website Content** | Hero slides, About, Contact, Footer editor |
| ⚙️ **Settings** | Live theme, typography, and account settings |
| 🔒 **Secure Auth** | Supabase Auth with admin role verification |

### Security
- ✅ Supabase Row Level Security (RLS) on all tables
- ✅ JWT-based admin authentication
- ✅ Zod schema validation on all inputs
- ✅ Helmet + CORS + Rate limiting
- ✅ Safe file uploads (type, size, MIME validation)
- ✅ Environment-based secret management
- ✅ Service-role key isolated to backend only

---

## 🛠 Technology Stack

### Frontend
- **React 18** — UI library
- **Vite** — Build tool & dev server
- **React Router v6** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **GSAP** — Advanced animations
- **Lucide React** — Icon library
- **MUI** — Selected Material components
- **Zod** — Frontend validation

### Backend
- **Node.js** — Runtime
- **Express.js** — Web framework
- **Zod** — Request validation
- **Multer** — File uploads
- **Helmet** — Security headers
- **CORS** — Cross-origin requests
- **Express Rate Limit** — Abuse prevention
- **Morgan** — HTTP logging

### Database & Auth
- **Supabase PostgreSQL** — Database
- **Supabase Auth** — Admin authentication
- **Supabase Storage** — Image hosting
- **Row Level Security** — Fine-grained access control

---

## 📁 Folder Structure
