# Audio Interactivo 2026 - Course Site

A brutalist, minimal course website built with Next.js 14 and Notion as a CMS.

## Features

- **Next.js 14 App Router**
- **Notion CMS**: Content managed entirely in a Notion Database.
- **Brutalist Design**: High contrast, minimal aesthetic with Tailwind CSS.
- **Dark Mode**: Fully supported system/manual toggle.
- **Static & ISR**: Fast loading with `revalidate = 3600` (1 hour).

## Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd audio-interactivo-2026
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your Notion credentials:
   ```bash
   cp .env.example .env.local
   ```
   
   - `NOTION_TOKEN`: Internal Integration Token from Notion.
   - `NOTION_DATABASE_ID`: The ID of your course database.
   - `GOOGLE_FORM_URL`: URL for the "Claim Points" form.

3. **Notion Setup**
   Ensure your database has the following properties:
   - `Name` (Title)
   - `Slug` (Text)
   - `Semana` (Number)
   - `Fecha` (Date)
   - `Resumen` (Text)
   - `Publicado` (Checkbox)
   - `Clave` (Text) - Optional

   **Important**: You must share the database with your integration.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

## Deployment

Deploy on Vercel:
1. Push to GitHub.
2. Import project in Vercel.
3. Add Environment Variables (`NOTION_TOKEN`, `NOTION_DATABASE_ID`, `GOOGLE_FORM_URL`).
4. Deploy.
