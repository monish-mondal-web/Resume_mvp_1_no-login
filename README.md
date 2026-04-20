# Fresh Resume

Fresh Resume is a Next.js 16 App Router project for resume-building onboarding with a polished auth-first landing experience. The current codebase focuses on account creation, Google sign-in, OTP-based email verification, and password recovery backed by MongoDB.

## Stack

- Next.js 16.2.4 with the App Router
- React 19
- TypeScript
- NextAuth.js
- MongoDB with Mongoose
- Nodemailer for OTP delivery
- Tailwind CSS 4
- Zod for environment validation

## Current Features

- Email/password sign-up with password hardening
- Google sign-in through NextAuth
- OTP email verification before credentials login is allowed
- OTP resend throttling with escalating cooldowns
- Forgot-password flow with OTP reset
- JWT session strategy via NextAuth
- Centralized environment validation in `utils/env.ts`

## Authentication Flow

### Credentials sign-up

1. User submits `name`, `email`, and `password`
2. Password is validated and hashed on the server
3. User is stored in MongoDB with a verification OTP
4. Verification email is sent through Nodemailer
5. User verifies the OTP before credentials login is unlocked

### Credentials login

1. NextAuth credentials provider validates the email and password
2. Unverified users receive a fresh OTP and are redirected back into the verify flow
3. Verified users receive a JWT-based session

### Google login

1. User signs in with Google
2. NextAuth creates or updates the MongoDB user record
3. Google-authenticated users are marked verified automatically

### Password reset

1. User requests a reset OTP
2. Server applies resend throttling and stores the reset code
3. User submits OTP plus a new password
4. Password is re-hashed and reset tokens are cleared

## Project Structure

```text
app/
  api/auth/
    [...nextauth]/route.ts
    register/route.ts
    verify/route.ts
    resend-otp/route.ts
    forgot-password/route.ts
    reset-password/route.ts
  components/
    AuthModal.tsx
    Hero.tsx
    Navbar.tsx
lib/
  auth.ts
  mongodb.ts
models/
  User.ts
utils/
  env.ts
  mailer.ts
```

The live App Router setup is currently driven from the root `app/` directory. Environment files should stay in the project root, which matches the Next.js 16 docs.

## Environment Variables

Create a `.env.local` file in the project root and copy the variable names from `.env.example`.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Secret used by NextAuth to sign and verify tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `EMAIL_SERVER_USER` | Gmail address used to send OTP emails |
| `EMAIL_SERVER_PASSWORD` | Gmail app password for the sender account |

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local`, then fill in all values before running the app.

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Important Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/verify`
- `POST /api/auth/resend-otp`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET|POST /api/auth/[...nextauth]`

## Deployment Notes

- Add the same environment variables to your hosting provider before deployment
- Configure the Google OAuth callback URL as `/api/auth/callback/google`
- Use an SMTP-ready Gmail account with an app password for mail delivery
- Point `MONGODB_URI` to a production-safe MongoDB instance such as MongoDB Atlas

## Security Notes

- Verification OTPs and reset OTPs expire after 15 minutes
- Repeated resend requests are throttled with escalating cooldowns
- Keep `.env.local` private and never commit real secrets
- Use a Gmail app password, not your primary mailbox password

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Roadmap Ideas

- Resume builder editor and template management
- Protected dashboard routes after sign-in
- Usage credits and premium plan wiring
- Profile and account settings pages

## License

This project is currently private to the repository owner unless a separate license is added.
