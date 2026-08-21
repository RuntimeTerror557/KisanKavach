# KisanKavach — AI Trust & Verification Layer

**Live Demo:** [https://kisan-kavach.vercel.app/](https://kisan-kavach.vercel.app/)

KisanKavach ("Farmer's Shield") is a simulated AI-powered trust and verification layer for agricultural farmer benefit programs. It demonstrates how an AI screening engine, a human officer review workflow, and an immutable audit ledger can work together to fast-track genuine farmers, flag fraud, and include tenant farmers who lack land ownership records — all while masking sensitive personal data.

> This is a **frontend simulation / concept prototype**. All AI scoring, fraud detection, and blockchain ledger behaviour is deterministically simulated in the browser using mock data — see the important notes below before treating this as a production-ready system.

---

## Key Features

- **Role-based views** — switch instantly between three perspectives via the top bar:
  - **Farmer Portal** — submit a benefit application and watch a simulated AI verification pipeline run in real time
  - **Officer Review Desk** — review AI-screened applications, inspect trust signals, and approve/reject/request tenancy proof
  - **Immutable Audit Ledger** — view every application's lifecycle as a chained, hash-linked ledger
- **Quick Scenario presets** — three pre-built demo cases (Happy Path, Sybil/Fraud Attempt, Tenant Farmer Inclusion) to instantly showcase how the system behaves for different farmer profiles
- **AI trust signal breakdown** — duplicate bank risk, land parcel overlap, yield consistency, and crop-weather alignment scores per application
- **Trust badges** — visual verification badges (Bank Verified, Cultivation Verified, Land Ownership Confirmed, etc.) with verified/pending/failed states
- **Tenant farmer inclusion path** — landless tenant farmers with strong cultivation evidence are routed to an alternative verification path instead of automatic rejection
- **Fraud/Sybil detection simulation** — duplicate bank accounts and overlapping land parcels are flagged with a fraud risk score and human-readable reasoning
- **Masked sensitive data** — bank account numbers are shown masked (e.g. `HDFC••••4921`) throughout the UI
- **Simulated blockchain audit trail** — every stage of an application's lifecycle is recorded as a chained, hash-linked block
- **Fully responsive UI** with smooth transitions, built on Tailwind CSS
- **Data visualizations** via Recharts, iconography via Lucide, and celebratory confetti effects via canvas-confetti

## Tech Stack

| Layer | Technology |
|---|---|
| UI Library | [React 18](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite 5](https://vitejs.dev/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Effects | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| State Management | React Context API (`src/lib/store.tsx`) |
| Linting | ESLint + typescript-eslint |
| Hosting | [Vercel](https://vercel.com/) |
| Backend/DB | None — `@supabase/supabase-js` is listed as a dependency but is **not currently wired up or used** anywhere in the codebase |

## Project Structure

```
kisan-kavach/
├── public/                        # Static assets
├── src/
│   ├── components/
│   │   ├── TopBar.tsx              # Brand header, role switcher, quick-scenario bar
│   │   ├── farmer/                 # Farmer Portal: application form + AI verification flow
│   │   ├── officer/                # Officer Review Desk: queue, signal breakdown, decisions
│   │   ├── ledger/                 # Immutable Audit Ledger view (chained blocks)
│   │   └── ui/                     # Shared UI primitives (buttons, badges, cards, etc.)
│   ├── lib/
│   │   ├── store.tsx               # App-wide state via React Context (role, applications, ledger)
│   │   ├── mockData.ts             # Scenario presets, hash simulation, ledger builder, seed data
│   │   ├── farmerForm.ts           # Farmer application form schema, defaults, verification step copy
│   │   ├── types.ts                # Shared TypeScript types (Application, LedgerBlock, etc.)
│   │   └── utils.ts                # Utility helpers (e.g. classname merging)
│   ├── App.tsx                     # Root layout and role-based routing
│   ├── main.tsx                    # App entry point (mounts to #root)
│   └── index.css                   # Global styles / Tailwind entry point
├── index.html                      # HTML shell
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
└── package.json
```

## Application Flow

1. **Farmer submits an application** (Farmer Portal) — either by filling the form manually or loading a Quick Scenario preset from the top bar.
2. **Simulated AI verification pipeline runs**, stepping through four checks (credential validation, land registry/satellite overlay, crop-weather consistency, duplicate claim fingerprinting) and produces:
   - an **eligibility score**
   - a **fraud risk score**
   - a **trust signal breakdown** (duplicate bank risk, land overlap, yield consistency, crop-weather alignment)
   - a list of **plain-language reasoning statements**
3. **Application status is set** based on the outcome: `FastTrackApproved`, `HighRiskFlagged`, `TenancyVerificationRequired`, `PendingReview`, etc.
4. **Officer Review Desk** picks up flagged/pending applications, inspects the AI's signal breakdown and reasoning, and makes a final decision — `Approved`, `Rejected`, or `TenancyProofRequested`.
5. **Every stage transition** (`Created → AIScreened → OfficerApproved/Rejected → DisbursementInitiated`, etc.) is written as a new block to the **Immutable Audit Ledger**, each block cryptographically chained to the previous one via a hash pointer.
6. **Audit Ledger view** lets anyone inspect the full, tamper-evident history of every application.

## Security Module

KisanKavach's "security" layer in this prototype consists of:

- **Data masking** — bank account numbers are never shown in full (`HDFC••••4921`), and no full personal identifiers are exposed in the UI.
- **Fraud/Sybil signal detection** — the simulated engine flags applications where a bank account is linked to multiple prior claims, or where a claimed land parcel overlaps significantly with an already-registered parcel.
- **Chained, hash-linked audit trail** — every state transition is recorded as a block containing a hash of the previous block, so any tampering with historical records would break the hash chain (see the blockchain note below for what this does and doesn't guarantee).
- **Role separation** — Farmer, Officer, and Ledger views are logically separated in the UI to reflect the principle of least privilege (though this demo has no real authentication — see below).

**What is *not* implemented:** there is no real authentication/authorization, no encryption at rest or in transit for application data (since nothing is persisted), no server-side validation, and no protection against a user simply switching roles in the UI (the role switcher is open to anyone using the demo).

## AI Integration

Despite the "AI screening" language throughout the UI, **no real machine learning model or external AI API is called anywhere in this codebase.** The "AI verification pipeline" is:

- A deterministic, pre-scripted sequence of UI steps (`VERIFICATION_STEPS` in `src/lib/farmerForm.ts`) that plays out with simulated delays to *look and feel* like a live AI pipeline.
- Eligibility scores, fraud risk scores, trust signals, and reasoning text for the three built-in Quick Scenario presets are **hard-coded** in `src/lib/mockData.ts`, not computed by a model.

This project should be understood as a **UX/concept demonstration** of what an AI-assisted verification system could look like, not a working AI integration. Wiring in a real model (e.g. via the Anthropic API, OpenAI, or a custom classifier) would be a meaningful next step — see Future Enhancements.

## Important Note About the Blockchain

The "Immutable Audit Ledger" is **not a real blockchain.** There is:

- No distributed network, no consensus mechanism, and no external chain (public or private).
- No cryptographic hash function — `simulateHash()` in `src/lib/mockData.ts` is an explicitly-labelled **pseudo-hash** (an FNV-style mix, not SHA-256) used purely for visual/demo purposes.
- No persistence — the "chain" is rebuilt from scratch in memory every time the app loads, from the current in-memory application list (`buildLedgerFromApplications`).

The ledger view is a **UI concept demonstrating what a chained, tamper-evident audit trail could look like**, not a cryptographically secure or persistent blockchain implementation.

## Important Note About Storage

**This application has no backend and no persistent storage.**

- All data (applications, ledger blocks, role state) lives entirely in **React state, in memory, in the browser tab.**
- Refreshing the page, closing the tab, or navigating away **resets everything** back to the three seeded demo applications.
- No data is sent to or stored on any server, database, or third party.
- `@supabase/supabase-js` is present in `package.json` but is **not initialized or called anywhere** in the source — it's a placeholder for potential future backend integration, not an active dependency.
- **No real personal or financial data should ever be entered into this demo** — everything shown (farmer names, credential IDs, bank details) is fictional/mock data intended for demonstration only.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (bundled with Node.js)
- Git (to clone the repository)

## Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO

# Install dependencies
npm install
```

## Run the Application (Development)

```bash
npm run dev
```

This starts the Vite dev server, typically at [http://localhost:5173](http://localhost:5173), with hot module reloading enabled. Open the printed URL in your browser.

## Production Build

```bash
# Type-check and build an optimized bundle
npm run build

# Locally preview the production build
npm run preview
```

The build output is written to the `dist/` folder as static HTML/CSS/JS, ready to be deployed to any static hosting provider.

## Available npm Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Starts the local development server with HMR |
| `build` | `vite build` | Type-checks and builds the production bundle into `dist/` |
| `preview` | `vite preview` | Serves the production build locally for a final check |
| `lint` | `eslint .` | Runs ESLint across the codebase |
| `typecheck` | `tsc --noEmit -p tsconfig.app.json` | Runs the TypeScript compiler in check-only mode |

## Environment Variables

**None are required to run this project as-is.** The app runs entirely on client-side mock data and has no backend calls.

If you choose to wire up the included (but currently unused) Supabase client for real persistence, you would typically add a `.env` file at the project root with:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

These are **not currently read anywhere in the code** — they're listed here only as guidance for future integration. Remember to also add any such variables in your Vercel project's **Settings → Environment Variables** if you add them.

## Troubleshooting

| Issue | Likely Cause / Fix |
|---|---|
| `npm install` fails | Ensure Node.js 18+ is installed (`node -v`). Delete `node_modules` and `package-lock.json`, then retry. |
| Blank page after `npm run dev` | Check the browser console for errors; ensure you're visiting the exact URL/port Vite printed (default `5173`). |
| Port already in use | Stop the other process using the port, or run `npm run dev -- --port 5174`. |
| Styles not applying | Confirm `tailwind.config.js` `content` paths match your file locations, and restart the dev server after config changes. |
| Data disappeared after refresh | Expected behaviour — this app has no persistent storage (see "Important Note About Storage" above). |
| Vercel build fails | Check the Vercel build logs; confirm Build Command is `npm run build` / `vite build` and Output Directory is `dist`. Run `npm run build` locally first to reproduce the error. |
| TypeScript errors on build | Run `npm run typecheck` locally to see full errors before building. |
| Blockchain/ledger looks "wrong" after edits | Remember the ledger is rebuilt from current in-memory applications on every render — it is not persisted or cryptographically real (see notes above). |

## Demo & Development

- Use the **Quick Scenario** buttons in the top bar to instantly load one of three pre-built farmer profiles (Happy Path, Fraud Attempt, Tenant Inclusion) without filling the form manually — ideal for demos.
- Switch between **Farmer Portal**, **Officer Review Desk**, and **Immutable Audit Ledger** using the role switcher in the top bar to see the full lifecycle of an application from every perspective.
- Since there's no backend, feel free to experiment freely — a page refresh always resets the app to its seeded demo state.
- Live deployment for reference: **[kisan-kavach.vercel.app](https://kisan-kavach.vercel.app/)**

## Future Enhancements

- Integrate a real AI/ML scoring model (e.g. via an LLM API or a trained classifier) to replace the hard-coded scenario scores
- Add a real backend (e.g. Supabase, which is already a listed dependency) for persistent storage of applications and ledger state
- Implement genuine authentication and role-based access control instead of an open role switcher
- Replace the simulated pseudo-hash with real cryptographic hashing (e.g. Web Crypto `SubtleCrypto.digest` with SHA-256), and optionally anchor the ledger to a real blockchain or verifiable data structure
- Add real satellite/geo-boundary and weather data integrations for land overlap and crop-weather alignment checks
- Add automated tests (unit and integration) and CI checks
- Add multi-language support for farmer-facing screens
- Add exportable/printable officer decision reports and audit trail exports

## License

No license currently specified. Add a `LICENSE` file (e.g. MIT) if you intend to open-source this project.

## Author / Project Info

- **Project name:** KisanKavach — AI Trust & Verification Layer
- **Live demo:** [https://kisan-kavach.vercel.app/](https://kisan-kavach.vercel.app/)
- **Origin:** Built with [Bolt](https://bolt.new/) and deployed via Vercel
- Update this section with your name/organization and contact details as appropriate.

## Disclaimer

KisanKavach is a **conceptual prototype and UI/UX demonstration only**. It is **not connected to any real government benefits scheme, bank, land registry, satellite data provider, weather service, or blockchain network.** All farmer names, credential IDs, bank details, districts, scores, and outcomes shown are **fictional mock data** generated for demonstration purposes.

Do not use this application to make, or as a basis for making, real eligibility, fraud, or benefit-disbursement decisions. Do not enter real personal, financial, or government identification data into this application under any circumstances. This project carries **no warranty of any kind** and should not be relied upon for production, legal, financial, or governmental use without substantial further development, security review, and real data integration.
