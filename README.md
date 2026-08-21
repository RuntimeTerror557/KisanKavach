# KisanSetu

**One trust layer. Two outcomes: fraud caught, farmers protected.**

KisanSetu is an AI-powered trust layer for agricultural welfare distribution. It sits between farmer applications and government benefit systems — scoring every claim for fraud risk while giving genuine but under-documented farmers (like tenants without formal land titles) an alternate path to verification instead of automatic rejection. Every decision is recorded on a tamper-evident blockchain ledger, so approvals, reviews, and payouts stay fully auditable without exposing sensitive personal data.

Built to plug into existing subsidy and insurance workflows — not replace them.

---

## The problem

India's subsidy and crop-insurance systems have a strange failure mode: they're both too loose and too strict at the same time.

- **Leakage** — duplicate claims, inconsistent records, and no single view of a claim across departments let fraud hide in the gaps.
- **Exclusion** — genuine tenant and small farmers without clean land-title paperwork get rejected the same way a fraudulent claim would.

Current systems are good at checking boxes. They're bad at judging context. A missing document and a forged document look identical to a rule-based check — even though they mean completely different things for the person behind the claim.

## The solution

KisanSetu asks a second question that today's systems never ask: *if a claim isn't valid, is that fraud — or just a farmer who can't prove what's actually true?*

1. **Verify** — build a Kisan Trust Profile from farmer, land/tenancy, crop, and benefit data.
2. **Analyze** — an AI model scores eligibility and fraud risk across multiple signals, and explains every flag.
3. **Review** — low-risk claims move fast; flagged claims go to a human reviewer instead of being auto-rejected.
4. **Prove** — every approval, review, and payout is written to a tamper-evident blockchain ledger.

## Key features

- **AI trust & risk engine** — eligibility, fraud scoring, duplicate/anomaly detection, with explainable reasoning behind every flag
- **Inclusive farmer verification** — alternate proof paths for landless cultivators and tenant farmers; human review for uncertain cases
- **Blockchain trust ledger** — tamper-evident verification and payment history; sensitive personal data stays off-chain
- **Transparent benefit tracking** — farmer and government dashboards showing status from submission to payout

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React / Next.js |
| Backend | Python / FastAPI |
| AI | Python + Scikit-learn |
| Blockchain | Solidity + EVM Testnet |
| Storage | Encrypted DB + IPFS |
| Identity | Verifiable Credentials / DIDs |

## Architecture

```
Farmer Input → AI Trust Engine → Human Verification → Blockchain Trust Layer → Benefit Tracking
```

Farmer submits claim details and evidence → AI scores plausibility and fraud risk → flagged claims route to an officer for review (never auto-rejected) → approved claims and their full decision trail are logged on-chain → payout status is tracked and visible end to end.

## Impact

| Today | With KisanSetu |
|---|---|
| Manual, fragmented verification | AI-assisted, explainable checks |
| Fraud caught after the fact | Anomalies flagged early |
| Genuine farmers can get excluded | Alternate paths for the undocumented |
| Little audit visibility | Tamper-evident trail, end to end |

## Scalability

Starts with crop insurance and farmer subsidies. Same trust layer extends to PM-KISAN, disaster relief, fertilizer subsidy, MSP support, and other public welfare schemes.

## Getting started

```bash
# Clone the repo
git clone https://github.com/<your-org>/kisansetu.git
cd kisansetu

# Backend
cd backend
pip install -r requirements.txt --break-system-packages
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Smart contracts
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

## Project structure

```
kisansetu/
├── frontend/       # React / Next.js farmer & officer dashboards
├── backend/        # FastAPI orchestration layer
├── ai-engine/       # Fraud risk & plausibility scoring model
├── contracts/       # Solidity smart contracts (claim ledger, payout triggers)
└── docs/            # Architecture notes, pitch deck, diagrams
```

## Team

[Team name / ID / college — fill in]

## License

[Add license, e.g. MIT]
