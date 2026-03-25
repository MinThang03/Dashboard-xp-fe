# Frontend-Only Login (Temporary)

This project is currently configured to bypass backend auth for UI testing.

## Current mode

- File: `.env.local`
- Variable: `NEXT_PUBLIC_FRONTEND_AUTH_ONLY=true`
- Effect: Login uses frontend mock user, no backend API call, no OTP flow.

## How to switch back to backend auth

1. Open `.env.local`.
2. Set `NEXT_PUBLIC_FRONTEND_AUTH_ONLY=false`.
3. Restart the Next.js dev server.

## Quick test accounts on login page

- `admin` / `admin123`
- `leader` / `password`
- `officer` / `password`
- `citizen` / `password`

Role is chosen by the role dropdown. In frontend-only mode, credentials are used for UI testing only.
