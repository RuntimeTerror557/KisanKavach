# KisanKavach — AI Trust & Verification Layer

KisanKavach is an AI-powered trust and verification layer for agricultural farmer benefit programs. It provides role-based views for farmers, verification officers, and an audit trail, backed by a simulated blockchain ledger. No real personal data is stored — all data in this project is mocked for demonstration purposes.

## Features

- **Farmer Portal** — farmer-facing view for submitting and tracking benefit applications
- **Officer Desk** — verification and review workflow for officers
- **Audit Ledger** — simulated blockchain-style ledger for transparent record-keeping
- Role-based navigation via the top bar
- Responsive layout, built with Tailwind CSS
- Charts via Recharts, icons via Lucide

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Recharts](https://recharts.org/) — data visualization
- [Lucide React](https://lucide.dev/) — icons
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) — celebratory UI effects
- [Supabase JS client](https://supabase.com/docs/reference/javascript) — included as a dependency for future backend integration (not currently wired up; the app runs entirely on mock data)

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node.js)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   cd YOUR-REPO
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Open the URL printed in the terminal (usually [http://localhost:5173](http://localhost:5173)) to view the app. The dev server supports hot module reloading.

## Available Scripts

| Command            | Description                                              |
|---------------------|------------------------------------------------------------|
| `npm run dev`       | Start the Vite development server                          |
| `npm run build`     | Type-check and build an optimized production bundle to `dist/` |
| `npm run preview`   | Locally preview the production build                       |
| `npm run lint`      | Run ESLint over the codebase                                |
| `npm run typecheck` | Run the TypeScript compiler in no-emit mode to check types |

## Project Structure

```
src/
├── components/
│   ├── TopBar.tsx          # Top navigation, role switcher, scenario presets
│   ├── farmer/              # Farmer Portal views
│   ├── officer/              # Officer Desk views
│   ├── ledger/                # Audit Ledger view
│   └── ui/                    # Shared UI primitives
├── lib/
│   ├── store.tsx             # App-wide state (React context)
│   ├── mockData.ts           # Mock/demo data
│   ├── farmerForm.ts         # Farmer form logic/schema
│   ├── types.ts               # Shared TypeScript types
│   └── utils.ts                # Utility helpers
├── App.tsx                    # Root component and layout
├── main.tsx                   # App entry point
└── index.css                  # Global styles / Tailwind entry
```

## Deployment

This is a static Vite app and can be deployed to any static hosting provider (Vercel, Netlify, GitHub Pages, etc.).

### Deploying to Vercel via GitHub

1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) with your GitHub account.
3. Click **Add New → Project** and select this repository.
4. Vercel auto-detects the Vite framework preset:
   - Build Command: `npm run build` (or `vite build`)
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Click **Deploy**. Every subsequent push to the main branch will trigger an automatic redeploy.

No environment variables are required to run the app as-is, since it currently runs on mock data.

## License

No license specified. Add a `LICENSE` file if you intend to open-source this project.
