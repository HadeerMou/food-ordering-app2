# Nour Restaurant — Full-Stack Food Ordering Prototype

A 24-hour-scope prototype built as a separate **Next.js/React frontend** and **Node.js/Express API**. It converts the supplied Nour Restaurant HTML concept into a working full-stack application.

## Included features

- Bilingual Arabic/English UI with RTL/LTR switching.
- Menu browsing with food images, categories, search, pricing, and item badges.
- Cart with quantity controls, delivery fee, and totals.
- Register/login with JWT sessions.
- Checkout with Cash on Delivery or a **mock online payment** method.
- Public order-ID tracking and a logged-in user's order history.
- Admin dashboard with summary statistics, order-status updates, product creation/editing/deletion, and availability controls.
- Local JSON persistence in `backend/data/db.json` after the first API start.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@nour.com` | `admin123` |
| Customer | `user@nour.com` | `user123` |

## Run locally

Prerequisite: Node.js 20.9 or later.

```bash
cd nour-food-ordering
npm install
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
npm run dev
```

Open `http://localhost:3000`.

The Express API runs at `http://localhost:4000`.

## Production notes

- Replace the `JWT_SECRET` in `backend/.env` before deployment.
- The online payment flow is deliberately simulated. It does **not** request, transmit, or store card data. Connect a PCI-compliant provider such as Paymob, Stripe, or a bank gateway for real online payments.
- JSON storage is appropriate for a prototype only. Use PostgreSQL, MongoDB, or another production database before launch.
- Restrict `FRONTEND_ORIGIN` to the deployed frontend URL.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a customer |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/menu` | List active menu items |
| POST/PATCH/DELETE | `/api/menu` | Admin product management |
| POST | `/api/orders` | Create an authenticated order |
| GET | `/api/orders/:id` | Public order tracking |
| GET | `/api/orders/me` | Current customer's order history |
| GET | `/api/admin/dashboard` | Admin overview statistics |
| GET | `/api/admin/orders` | Admin order monitor |
| PATCH | `/api/admin/orders/:id/status` | Update an order status |

## Project structure

```text
nour-food-ordering/
├── frontend/                 # Next.js + React App Router UI
│   ├── app/
│   └── components/
├── backend/                  # Express API
│   ├── src/
│   └── data/
└── package.json              # npm workspaces and combined scripts
```
