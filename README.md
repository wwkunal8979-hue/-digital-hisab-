# Digital Hisab (phase 1 scaffold)
1. Create a Supabase project; run `supabase/migrations/001_init.sql` in the SQL editor.
2. Auth → enable Email (confirmations on). Add redirect URLs for localhost and Vercel.
3. `cp .env.example .env.local`, fill URL + anon key. `npm i && npm run dev`. `npm test` runs ledger tests.
## Done
Schema + RLS + audit trigger + balance view; ledger/format service with tests; signup/login/logout; onboarding; dashboard (partial); customers; add transaction.
## Not yet built
Suppliers, ledger pages w/ filters, edit/delete txn, reminders, reports/CSV, global search, notifications, Hindi/English switcher, Google OAuth, forgot password, landing sections, shadcn/ui, rate limiting.
