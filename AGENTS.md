# AGENTS.md — AstroClub Website Rules

## Dev Environment Setup
- Package Manager: `npm`
- Run Local Server: `npm run dev`
- Local URL: `http://localhost:3000`

## Tech Stack & Architecture
- Next.js 15 (App Router) & React 19.
- **CRITICAL STRUCTURE:** This repository does NOT use a `src/` directory. The `app/` folder sits directly at the root (`app/page.tsx` and `app/layout.tsx`). Never generate a `src/` folder.
- Styling: Tailwind CSS.
- Database: Public Supabase client using `@supabase/supabase-js`.

## Code & Database Constraints
- Form submissions target the `public.session_requests` table.
- **SQL CHECK CONSTRAINT:** The `accommodation` column strictly requires lowercase values: `'hosteler'` or `'day_scholar'`. Never send capitalized strings like 'Hosteler' or 'Day Scholar'.
- The `academic_year` column is an Integer (`INT`). Always parse string dropdown selections using `parseInt(value, 10)` before insertion.

## Rules of Engagement
- **STRICT SCOPE LIMITATION:** Make changes *only* to the file(s) directly related to the current task or code issue. Do not fix or touch random/unrelated files even if they could be improved, unless they directly affect the intended change.
- Always run programmatic builds or verify code logic using the terminal before declaring a task finished.
- Ask for user confirmation before executing destructive shell commands or deleting configuration files.