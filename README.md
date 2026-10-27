# Our Teacher School — Phase 2

Next.js + Supabase foundation for a real public school website.

## Setup
1. Create a Supabase project.
2. Run `supabase-schema.sql` in Supabase SQL Editor.
3. Create an Email/Password Auth user for the school administrator.
4. In Supabase SQL Editor, authorize that user by running the `insert into public.admin_users` statement at the bottom of `supabase-schema.sql` with the administrator email.
5. Copy `.env.example` to `.env.local` and add the matching Supabase URL + anon key.
6. Run `npm install`
7. Run `npm run dev`
8. Open `/admin/login`.

## Before public launch
- Create a Supabase Storage bucket if you want to upload images instead of entering image URLs.
- Add real YouTube IDs.
- Add Khmer/English public pages that read from Supabase.
- Set `NEXT_PUBLIC_SITE_URL` to the final public domain (for example, `https://ourteacherschool.com`). This keeps canonical URLs, robots.txt, and sitemap.xml correct.
- After deployment, verify the domain in Google Search Console and submit `https://your-domain.com/sitemap.xml` for indexing.
- Deploy to Vercel or another Next.js host and connect the school domain.

School identity:
- Name: Our Teacher School
- Established: 2002
- Brand color: #2E3192
- Phones: 010744440 / 077244440


## Phase 1 + Phase 2
Phase 1 public pages are included in this same project under `public/`.
Phase 2 provides Next.js + Supabase + Admin.
Do not maintain two separate website folders; use this combined project as the main project.
