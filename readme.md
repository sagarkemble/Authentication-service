<div
  class="container"
  align="center"
>
 <img src="https://ik.imagekit.io/lespresources/authentication-service-logo.png" style="height:5rem"/>

# Authentication Service

</div>

<p align="center">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="https://orm.drizzle.team/"><img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM"></a>
  <a href="https://resend.com/"><img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=mailgun&logoColor=white" alt="Resend"></a>
  <a href="https://github.com/dcodeIO/bcrypt.js"><img src="https://img.shields.io/badge/bcryptjs-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="bcryptjs"></a>
  <a href="https://bun.sh/"><img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun"></a>
  <a href="https://zod.dev/"><img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod"></a>
<a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT-FF4D6D?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"></a>
  <a href="https://imagekit.io/"><img src="https://img.shields.io/badge/ImageKit-17B5EB?style=for-the-badge&logo=imagekit&logoColor=white" alt="ImageKit"></a>
  <a href="https://github.com/expressjs/multer"><img src="https://img.shields.io/badge/Multer-FF6B6B?style=for-the-badge&logo=files&logoColor=white" alt="Multer"></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"></a>
  <a href="https://commitizen-tools.github.io/commitizen/"><img src="https://img.shields.io/badge/Commitizen-FF7A00?style=for-the-badge&logo=git&logoColor=white" alt="Commitizen"></a>
</p>

A production-ready Authentication REST API featuring JWT authentication, refresh token rotation, email verification workflows, secure password recovery, layered ZOD request validation, structured error handling, and scalable authentication patterns.

---

## Features

- User registration with email verification
- JWT-based authentication (Access + Refresh token pair)
- Refresh token rotation with `httpOnly` cookie storage
- Forgot password & reset password flow
- Authenticated password change
- Secure email change with verification
- Avatar upload & management via ImageKit
- Bcrypt-hashed one-time tokens (never stored in plaintext)
- Zod-powered request validation
- Structured API error & response classes
- Global error handling middleware
- Docker Compose for local PostgreSQL

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/sagarkemble/Authentication-service
cd Authentication-service
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Start the database

```bash
bun run db:up
# Starts a PostgreSQL container on port 5432
```

### 5. Run database migrations

```bash
bun run db:migrate
```

### 6. Start the development server

```bash
bun run dev
# Server starts with --watch (hot reload) at http://localhost:3000
```

### 7. (Optional) Open Drizzle Studio

```bash
bun run studio
# Visual database browser
```

### Build for production

```bash
bun run build
# Outputs compiled files to /dist
```

---

## API Reference

### Conventions

- All request bodies must be `Content-Type: application/json`
- Protected routes require `Authorization: Bearer <accessToken>` header
- The `refreshToken` is automatically managed via `httpOnly` cookie
- All tokens (email verification, password reset) have a **15-minute TTL**

---

### Auth Routes - Base URL: `/auth`

---

#### `POST /auth/register`

Register a new user account. Sends a verification email upon success.

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

---

#### `POST /auth/verify-email`

Verify a user's email address using the token sent to their inbox.

```json
{
  "token": "a3f9c2e1d4b7...",
  "email": "john.doe@example.com"
}
```

---

#### `GET /auth/verify-email`

Serves the HTML landing page for email verification links (browser-facing).

**No request body required.**

---

#### `POST /auth/login`

Authenticate a verified user. Returns an access token in the response body and sets the refresh token as an `httpOnly` cookie.

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

---

#### `POST /auth/logout`

**Protected** - Requires `Authorization: Bearer <accessToken>`

Invalidates the current refresh token in the database and clears the cookie.

**No request body required.** Reads `refreshToken` from cookie automatically.

**Success Response** - `200 OK`

```json
{
  "status": "success",
  "message": "Logout successful"
}
```

---

#### `POST /auth/refresh-token`

Issue a new access token + rotate the refresh token. Reads the refresh token from the `httpOnly` cookie automatically.

**No request body required.**

**Success Response** - `200 OK`

Sets new `Set-Cookie: refreshToken=<newToken>; HttpOnly`

```json
{
  "status": "success",
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Possible Errors** - `400 Bad Request` (no cookie), `401 Unauthorized` (invalid/expired token)

---

#### `POST /auth/forgot-password`

Initiates the password reset flow. Sends a reset link to the user's email.

```json
{
  "email": "john.doe@example.com"
}
```

---

#### `GET /auth/reset-password`

Serves the HTML page for the reset password form (browser-facing).

**No request body required.**

---

#### `POST /auth/reset-password`

Complete the password reset using the token from the email.

```json
{
  "token": "b8d2a1f3c5e7...",
  "email": "john.doe@example.com",
  "password": "newSecurePassword456"
}
```

---

#### `POST /auth/change-password`

**Protected** - Requires `Authorization: Bearer <accessToken>`

Change password while authenticated by providing the current password for verification.

```json
{
  "oldPassword": "securePassword123",
  "newPassword": "evenMoreSecure789"
}
```

---

#### `POST /auth/resend-verify-email`

Resend the email verification link with a fresh token (invalidates the previous one).

```json
{
  "status": "success",
  "message": "Verification email resent successfully"
}
```

---

#### `POST /auth/resend-forgot-password`

Resend the password reset email with a fresh token (invalidates the previous one).

```json
{
  "status": "success",
  "message": "Password reset email resent successfully"
}
```

---

### User Routes - Base URL: `/user`

> All user routes require `Authorization: Bearer <accessToken>`.

---

#### `GET /user/me`

**Protected** - Fetch the currently authenticated user's profile.

**No request body required.**

**Success Response** - `200 OK`

```json
{
  "status": "success",
  "message": "...",
  "data": {
    "id": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "avatarUrl": "https://ik.imagekit.io/...",
    "isVerified": true
  }
}
```

---

#### `PATCH /user/me`

**Protected** - Update the authenticated user's profile fields. All fields are optional.

```json
{
  "firstName": "Jonathan"
}
```

---

#### `DELETE /user/me`

**Protected** - Permanently delete the authenticated user's account. Password confirmation required.

```json
{
  "password": "securePassword123"
}
```

---

#### `POST /user/change-email`

**Protected** - Initiate an email address change. Sends a verification email to the **new** address. The old email remains active until verified.

```json
{
  "currentPassword": "securePassword123",
  "newEmail": "new.email@example.com"
}
```

---

#### `GET /user/verify-email`

Serves the HTML landing page for email change verification links (browser-facing, no auth required).

---

#### `POST /user/verify-email`

Confirm the email address change using the token sent to the new email.

**No authentication required** (token serves as proof).

```json
{
  "status": "success",
  "message": "Email verified successfully."
}
```

---

#### `POST /user/avatar`

**Protected** - Upload or replace the user's avatar image. Uploads to ImageKit CDN and automatically deletes the previous avatar if one exists.

**Request Format** - `multipart/form-data`

**Example (curl)**

```bash
curl -X POST http://localhost:3000/user/avatar \
  -H "Authorization: Bearer <token>" \
  -F "avatar=@/path/to/photo.jpg"
```

---

#### `POST /user/resend-verify-email`

Resend the email change verification link with a fresh token.

```json
{
  "status": "success",
  "message": "Verification email resent successfully"
}
```

---

#### `GET /health`

Health check endpoint used for uptime monitoring, container orchestration, and load balancer checks.

**No authentication required.**

**Success Response** - `200 OK`

```json
{
  "success": true,
  "code": "SUCCESS",
  "status": 200,
  "message": "Server is healthy",
  "data": {
    "uptime": 124.52,
    "timestamp": "2026-05-08T00:00:00.000Z"
  }
}
```

## Response Format

**Success**

```json
{
  "success": true,
  "code": "SUCCESS",
  "status": 200,
  "message": "Request completed successfully.",
  "data": {}
}
```

**Error**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "status": 400,
    "details": []
  }
}
```

---

## 🐳 Docker

The included `docker-compose.yml` spins up a local PostgreSQL instance:

```yaml
Container: postgres
Port: 5432
Database: auth_db
Username: admin
Password: password
```

```bash
bun run db:up     # Start containers
bun run db:down   # Stop containers
```
