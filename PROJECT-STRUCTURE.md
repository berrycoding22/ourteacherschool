# Our Teacher School — Clean Next.js Structure

This version is the single master website. The Homepage is the native Next.js route at `app/page.tsx`.

```text
our-teacher-school/
├── app/
│   ├── page.tsx                 # Full Homepage (/)
│   ├── layout.tsx               # Global metadata/layout
│   ├── globals.css               # Global site styles
│   └── admin/                    # Admin area
├── components/                   # Reusable UI components (future expansion)
├── lib/                          # Supabase/server helpers
├── public/
│   ├── logo.png
│   ├── robots.txt
│   └── sitemap.xml
├── supabase-schema.sql
├── package.json
├── .env.example
└── README.md
```

The old Phase 1 `.html` pages were removed from `public/` so there is no duplicate static website. Future pages should be implemented as Next.js routes such as `app/about/page.tsx`, `app/gallery/page.tsx`, etc.
