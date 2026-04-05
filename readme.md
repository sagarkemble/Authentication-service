<div
  class="container"
  align="center"
>
 <img src="https://ik.imagekit.io/lespresources/auth-service-logo.png" style="height:5rem"/>

# Authentication Service

</div>

<p align="center">
<a href="#"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"></a>
<a href="#"><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
<a href="#"><img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose"></a>
<a href="#"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"></a>
<a href="#"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
<a href="#"><img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod"></a>
<a href="#"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"></a>
<a href="#"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
<a href="#"><img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=mailgun&logoColor=white" alt="Resend"></a>
<a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm"></a>
<a href="#"><img src="https://img.shields.io/badge/Commitlint-000000?style=for-the-badge&logo=git&logoColor=white" alt="Commitlint"></a>
</p>

# Auth Backend Service

A complete user authentication REST API built with TypeScript, Express, and MongoDB, implementing JWT authentication, refresh tokens, email verification, and secure cookie-based auth.

## Features

- User registration with email verification
- Secure login with JWT-based authentication (access + refresh tokens)
- Refresh token rotation using HTTP-only cookies
- Runtime Input validation with Zod
- Forgot password flow with email-based reset link
- Protected routes with authentication middleware
- Cookie-based token storage
- MongoDB with Mongoose ODM
- Docker support for MongoDB

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- pnpm/npm/yarn/bun

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sagarkemble/Authentication-service
cd Authentication-service
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the variables as shown in the `.env.example` file

**Important**: Replace the JWT secrets with strong strings in production.

### 4. Start MongoDB with Docker

Start the MongoDB container:

```bash
npm run db:up
```

This will start MongoDB on `localhost:27017` with:

- Username: `admin`
- Password: `password`
- Database: `authdb` (or whatever you specify in MONGODB_URI)

To stop the database:

```bash
npm run db:down
```

### 5. Start the development server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the PORT you specified in `.env`).

## API Endpoints

### Authentication Routes

All routes are prefixed with `/auth`

#### Register a new user ` /auth/register`

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "John Doe"
}
```

#### Verify email `/auth/verify-mail`

```http
POST /auth/verify-mail
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

#### Login `/auth/login`

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Refresh access token `/auth/refresh-access-token`

```http
POST /auth/refresh-access-token
Cookie: refreshToken=<refresh_token>
```

#### Get current user (Protected) `/auth/getme`

```http
GET /auth/getme
Authorization: Bearer <access_token>
```

#### Logout (Protected) `/auth/logout`

```http
POST /auth/logout
Cookie: accessToken=<access_token>
```

#### Forgot password `/auth/forgot-password`

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset password `/auth/reset-password`

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "yournewpassword"
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run db:up` - Start MongoDB Docker container
- `npm run db:down` - Stop MongoDB Docker container
- `npm run commit` - Commit with Commitizen (conventional commits)

### Git Hooks

This project uses Husky for git hooks:

- Pre-commit: Runs linting/formatting checks
- Commit-msg: Validates commit message format (conventional commits)
