# Fahad Jeweller System

A full-stack jewellery website and admin management system built with Node.js, Express, and PostgreSQL.

## Overview

The project includes:

- Public site pages: home, about, gallery, rates, contact, and order.
- Admin dashboard for managing categories, products, gallery images, orders, messages, rates, and site settings.
- Secure authentication, request validation, upload handling, and activity logging.

## Tech Stack

- Node.js, Express, PostgreSQL
- HTML, CSS, JavaScript
- JWT authentication, bcrypt, express-validator, helmet, multer, nodemailer

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

3. Initialize the database:

```bash
npm run db:init
```

4. Create an admin user:

```bash
npm run admin:create
```

5. Start the app:

```bash
npm run dev
```

## Project Structure

- `admin/` — admin panel frontend
- `backend/` — server source, database schema, scripts
- `css/`, `js/`, `images/` — public site assets
- `*.html` — public website pages

## Environment

Required values in `.env`:

- `DATABASE_URL`
- `JWT_SECRET`
- `CSRF_SECRET`
- `UPLOAD_DIR`

Optional:

- `NODE_ENV`, `PORT`, `JWT_EXPIRES_IN`, `MAX_UPLOAD_MB`, SMTP settings

## Usage

- Public site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`
- API base: `/api`

## Scripts

- `npm start` — start server
- `npm run dev` — start server with nodemon
- `npm run db:init` — load database schema
- `npm run admin:create` — create/update admin account
