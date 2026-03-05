# NutriSync AI — Admin Guide

## Table of Contents

1. [Overview](#overview)
2. [Environment Setup](#environment-setup)
3. [Creating an Admin Account](#creating-an-admin-account)
4. [Logging In as Admin](#logging-in-as-admin)
5. [Admin Pages & Capabilities](#admin-pages--capabilities)
6. [Route Protection Rules](#route-protection-rules)
7. [How Role Detection Works](#how-role-detection-works)
8. [Security Notes](#security-notes)

---

## Overview

Admin accounts are separate from regular user accounts but share the **same login page** (`/sign-in`). After sign-in, the app automatically routes each person to the correct area:

- **Admin** → `/admin` (Admin Panel)
- **Regular User** → `/dashboard`

Admin accounts can **only be created via a secured API endpoint** — they cannot self-register through the sign-up page.

---

## Environment Setup

Make sure your `.env` file contains the following variable:

```env
# Admin Creation Secret (keep this private)
ADMIN_CREATE_SECRET=<your-secret-here>
```

This secret acts as the password to the admin-creation endpoint. Choose a long, random string and never expose it publicly.

---

## Creating an Admin Account

Admin accounts are created by calling the `POST /api/admin/create` endpoint with the secret header.

### Endpoint

```
POST /api/admin/create
```

### Required Header

| Header           | Value                                           |
| ---------------- | ----------------------------------------------- |
| `x-admin-secret` | Value of `ADMIN_CREATE_SECRET` from your `.env` |
| `Content-Type`   | `application/json`                              |

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "admin1234",
  "name": "John Admin"
}
```

| Field      | Required | Description              |
| ---------- | -------- | ------------------------ |
| `email`    | Yes      | Valid email address      |
| `password` | Yes      | Minimum 8 characters (no breach check enforced — any simple password works) |
| `name`     | Yes      | Full name (first + last) |

### Successful Response — `201 Created`

```json
{
  "message": "Admin created successfully",
  "adminId": "65f3a2b..."
}
```

### Error Responses

| Status | Reason                                            |
| ------ | ------------------------------------------------- |
| `401`  | Missing or wrong `x-admin-secret` header          |
| `400`  | Missing required fields or invalid email/password |
| `409`  | Account with this email already exists            |
| `500`  | Internal server error                             |

---

### Example: curl

```bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: m8sz0gpNtWY7nj3wEOPof1eick4DrdClLZRHyUSxGaBqAXTF" \
  -d '{"email":"admin@nutrisync.com","password":"admin1234","name":"Site Admin"}'
```

### Example: PowerShell

```powershell
$headers = @{
    "Content-Type"   = "application/json"
    "x-admin-secret" = $env:ADMIN_CREATE_SECRET   # or paste your secret directly
}

$body = @{
    email    = "admin@nutrisync.com"
    password = "admin1234"
    name     = "Site Admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/create" `
                  -Method POST `
                  -Headers $headers `
                  -Body $body
```

### Example: JavaScript (Node.js / fetch)

```js
const res = await fetch("http://localhost:3000/api/admin/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-admin-secret": process.env.ADMIN_CREATE_SECRET,
  },
  body: JSON.stringify({
    email: "admin@nutrisync.com",
    password: "admin1234",
    name: "Site Admin",
  }),
});

const data = await res.json();
console.log(data);
```

---

## Logging In as Admin

1. Go to `/sign-in` — the **same page** regular users use.
2. Enter the admin email and password.
3. After successful login, the app detects the `admin` role from Clerk and automatically redirects to `/admin`.

> There is no separate admin login URL. Same page, different destination based on role.

---

## Admin Pages & Capabilities

| Page              | URL                        | Description                                         |
| ----------------- | -------------------------- | --------------------------------------------------- |
| Admin Dashboard   | `/admin`                   | Overview with pending request counts                |
| Food Requests     | `/admin/food-requests`     | Review and approve/reject user-submitted food items |
| Exercise Requests | `/admin/exercise-requests` | Review and approve/reject user-submitted exercises  |

---

## Route Protection Rules

| Who             | Visits                                                                     | Result                     |
| --------------- | -------------------------------------------------------------------------- | -------------------------- |
| Unauthenticated | Any protected page                                                         | Redirected to `/sign-in`   |
| Regular user    | `/admin/*`                                                                 | Redirected to `/dashboard` |
| Admin           | `/dashboard`, `/meals`, `/exercises`, `/history`, `/community`, `/profile` | Redirected to `/admin`     |

This is enforced at the **middleware level** — no client-side code can bypass it.

---

## How Role Detection Works

1. When an admin is created via the endpoint, Clerk is immediately set with `publicMetadata: { role: "admin" }` and MongoDB stores `role: "admin"`.
2. On every request, the middleware first tries `sessionClaims.metadata.role` from the Clerk JWT. If the JWT template is not configured, it falls back to calling the Clerk Backend API (`clerk.users.getUser`) to read `publicMetadata.role` directly — so no Clerk dashboard JWT template setup is required.
3. After sign-in, the `/auth-redirect` page fetches `/api/user/profile` and uses the MongoDB `role` field as the authoritative source for routing. Clerk's `publicMetadata.role` is used as a fallback if the DB call fails.
4. The MongoDB `User` document stores `role: "admin"` for use in all API route authorization checks.
5. If an admin user somehow doesn't exist in MongoDB yet (e.g. created via Clerk dashboard), `getCurrentUser()` will automatically create the MongoDB document with `role: "admin"` and `onboarded: true` by reading `publicMetadata.role` from Clerk.

---

## Security Notes

- **Keep `ADMIN_CREATE_SECRET` private.** Anyone who has it can create an admin account. Rotate it if it is ever exposed.
- The `/api/admin/create` endpoint is listed as a public route in middleware so unauthenticated requests can reach it. The `x-admin-secret` header is the sole protection layer — never expose it to untrusted clients.
- Password breach checks are skipped (`skipPasswordChecks: true`) so simple passwords like `admin1234` are accepted. Use a strong password in production.
- Admins cannot access any user-facing pages. The restriction is enforced in [middleware.js](middleware.js), not just the UI.
- Admin accounts are set to `onboarded: true` by default so they skip the user onboarding flow.
- Do not create admin accounts through the Clerk dashboard without also ensuring the corresponding MongoDB `User` document has `role: "admin"`. The API endpoint handles both automatically.
