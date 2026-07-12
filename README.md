# Shipyard Live

Production-oriented Android testing marketplace built with React, Vite, Supabase and Razorpay.

## Included

- Public marketing website and pricing
- Developer/tester registration and role-aware dashboards
- Real Supabase authentication
- Developer project creation and progress dashboard
- Tester marketplace, assignments, daily evidence uploads and bug reports
- Admin project/user/revenue overview
- Secure Razorpay order creation, signature verification and webhook handling
- Private Supabase Storage bucket for testing proofs
- Row Level Security policies
- Vercel SPA routing

## 1. Install

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

## 2. Create Supabase backend

1. Create a new Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql` once.
3. In Authentication → URL Configuration, set Site URL to your final domain and add `http://localhost:5173` as a redirect URL.
4. Copy Project URL and anon key into `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_RAZORPAY_KEY_ID=rzp_test_...
VITE_SITE_URL=http://localhost:5173
VITE_SUPPORT_EMAIL=support@yourdomain.com
```

Restart `npm run dev` after editing environment variables.

## 3. Make your first admin

Sign up normally, then run this in Supabase SQL Editor using your email:

```sql
update public.profiles set role='admin' where email='YOUR_EMAIL';
```

Sign out and sign in again.

## 4. Deploy payment functions

Install Supabase CLI and log in:

```powershell
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy razorpay-webhook --no-verify-jwt
```

Set function secrets (never put the secret key in Vite):

```powershell
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx
supabase secrets set RAZORPAY_KEY_SECRET=your_secret
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

Supabase automatically provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to deployed Edge Functions.

## 5. Razorpay setup

1. Use Test Mode first.
2. Add a webhook pointing to:
   `https://YOUR_PROJECT_REF.supabase.co/functions/v1/razorpay-webhook`
3. Subscribe to `payment.captured` and `payment.failed`.
4. Use the same webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
5. Complete Razorpay KYC before switching to Live Mode.
6. Replace `VITE_RAZORPAY_KEY_ID` in Vercel with your live public key and replace Edge Function secrets with live credentials.

## 6. Deploy to Vercel

Push this folder to GitHub and import it into Vercel. Add these environment variables in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_RAZORPAY_KEY_ID`
- `VITE_SITE_URL`
- `VITE_SUPPORT_EMAIL`

Build command: `npm run build`  
Output directory: `dist`

After attaching the domain, update Supabase Authentication URLs and `VITE_SITE_URL`.

## Before accepting real customers

- Replace the placeholder legal pages with policies reviewed for your registered business.
- Add your legal business name, address, support email and grievance contact.
- Test refunds, failed payments and webhook retries.
- Add transactional email (Resend is a practical option).
- Decide tester reward/payout terms and tax treatment.
- Add moderation rules, fraud controls and support procedures.
- Do not promise Google Play approval; market the service as managed real-user testing and QA evidence.

## Production limitations

This code provides the complete core platform and secure payment flow, but external accounts still require manual activation: Supabase, Razorpay KYC/live keys, email provider, domain DNS and Vercel. Tester payouts are represented in the database but are intentionally not auto-disbursed until your payout/KYC process is chosen.

## Multi-workspace accounts

This build supports one email/account with Developer and Tester access.
After running the multi-workspace SQL upgrade in Supabase:

- Developers can click **Become a tester** in the sidebar.
- Testers can click **Enable developer tools**.
- Users with both roles get a workspace switcher.
- Never register the same email twice; sign in and add the second workspace.
