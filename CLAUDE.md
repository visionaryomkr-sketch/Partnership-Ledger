# Partnership Tracker — Project Spec

## Overview

A transparency-first web app for a 3-person business partnership to log work, expenses/investments, and revenue — so every partner's contribution is visible, timestamped, and auditable. This is NOT a generic project management tool; it is specifically an **accountability and fairness ledger** between three co-founders.

## The Partners

| Name | Role | Primary Contribution Type |
|---|---|---|
| OM Kumar | Developer | Hours (development, bug fixes, security, deployment) |
| Shubham Jain | Ad Creative | Creative work + possible ad spend |
| Ashwin Pillai | Marketing | Marketing work + ad spend (₹) |

Each partner has an equal login; there is no "admin" hierarchy for viewing data — everyone sees everyone's entries. Entries can only be edited/deleted by the partner who created them (or left immutable — decide during build, but default to **immutable once submitted**, only allow a "correction note" to be appended, so history can't be quietly rewritten — this matters for trust).

## Tech Stack

- Frontend: React + Vite (match the pattern already used in the Jyotish app — TanStack Start/React/Vite, TypeScript)
- Backend: Supabase (Postgres + Auth + Row Level Security)
- Hosting: Cloudflare Pages
- Styling: Clean, minimal, professional — NOT the cosmic/astrology theme. Use a neutral business dashboard aesthetic (light background option preferred, since this is a financial/accountability tool, not a consumer product). Reference: something like Notion or Linear's clean data-table aesthetic.

## Core Data Model

### Table: `partners`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, linked to Supabase Auth user |
| name | text | "OM Kumar", "Shubham Jain", "Ashwin Pillai" |
| role | text | "Developer" / "Ad Creative" / "Marketing" |
| agreed_profit_share_percent | numeric | e.g. 33.33 — editable only via a joint-approval flow, not silently |

### Table: `work_entries`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| partner_id | uuid | FK → partners |
| date | date | |
| category | text | dropdown, see category list below |
| title | text | short summary |
| description | text | longer notes |
| hours_spent | numeric | |
| proof_url | text | optional — link to GitHub commit, Canva file, Google Doc, etc. |
| created_at | timestamptz | auto |

### Table: `expense_entries`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| partner_id | uuid | FK |
| date | date | |
| category | text | "Ads Spend" / "Hosting" / "Domain" / "Tools/Software" / "Design Assets" / "Other" |
| amount | numeric | in ₹ |
| description | text | |
| proof_file_url | text | Supabase Storage upload — screenshot/invoice |
| reimbursement_status | text | "Pending" / "Adjusted from Revenue" / "Not Needed" |
| created_at | timestamptz | auto |

### Table: `revenue_entries`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| date | date | |
| source | text | "Direct Sale" / "Ads-driven" / "Organic" |
| amount | numeric | in ₹ |
| customer_count | integer | optional |
| notes | text | |
| created_at | timestamptz | auto |
| entered_by | uuid | FK → partners (who logged it, for accountability) |

### Table: `settings`
| Column | Type | Notes |
|---|---|---|
| key | text | e.g. "hourly_rate_inr" |
| value | text | e.g. "1000" |

This `hourly_rate_inr` value is the single source of truth used to convert OM's logged hours into ₹ for fair comparison against Shubham/Ashwin's cash investment. Make it editable from a settings page (with a change-log so it can't be silently altered to favor one partner).

## Row Level Security (RLS) Rules

- All authenticated partners can **SELECT** (read) all rows in all tables — full transparency is the entire point.
- A partner can only **INSERT** rows with their own `partner_id`.
- **UPDATE** and **DELETE** should be heavily restricted or disabled entirely on submitted entries (see immutability note above). If you allow edits, log the edit history in a separate `entry_edit_log` table so nothing disappears silently.
- No public/anonymous access — 3 named accounts only, created manually in Supabase Auth (no public signup).

## Pages / Screens

1. **Login** — simple email/password, 3 pre-created accounts only.

2. **Dashboard (Home)** — the most important screen:
   - A summary card per partner showing: Total Hours Logged, Total ₹ Invested, Total ₹-equivalent Contribution (hours × hourly_rate + cash invested), and a simple bar chart comparing all 3 partners side by side.
   - Total Revenue to date, and a computed "Net Position" per partner: `(their total contribution) − (their share of revenue distributed so far)`. This is the single most important number in the whole app — it answers "who is owed what, right now."
   - Recent activity feed (latest 10 entries across all types, all partners, like a timeline).

3. **Work Log** — table view of all `work_entries`, filterable by partner and category, with an "Add Entry" form. Add-entry form should be fast to fill (partner is auto-filled from logged-in user, date defaults to today).

4. **Expenses / Investments** — same pattern as Work Log but for `expense_entries`. Must support file upload for proof (Supabase Storage bucket, private, only visible to logged-in partners).

5. **Revenue** — table + add-entry form for `revenue_entries`. Any partner can log revenue (e.g. whoever checks the payment gateway dashboard), but it's timestamped with who entered it.

6. **Settings** — edit `agreed_profit_share_percent` per partner and `hourly_rate_inr`. Changes here should require a visible confirmation ("This affects the fairness calculation for everyone — are you sure?") and get logged.

## Design Priorities

- **Radical transparency over polish.** Every number on the dashboard should be traceable back to the raw entries that produced it — no black-box calculations.
- **Fast data entry.** Partners are busy running a business, not filling forms. Minimize required fields, sensible defaults, mobile-friendly (they'll often add entries from their phone right after doing the work).
- **No editing history disappears.** This tool's entire value is trust — if entries can be silently changed or deleted, the tool is worse than useless, it would enable more disputes, not fewer.
- **Currency and hours must reconcile clearly.** The dashboard's core job is answering "is this fair, right now?" in one glance.

## Explicitly Out of Scope for v1

- No automated payment processing / no integration with Cashfree or Razorpay — this is a ledger, not a payment system.
- No task management / kanban features — this is not a project tracker, only a contribution + money ledger.
- No public-facing pages — 3 users only, private tool.

## Build Order (Suggested)

1. Supabase schema + RLS policies + 3 manually-created auth accounts.
2. Work Log page (simplest CRUD, validates the pattern).
3. Expense page (adds file upload).
4. Revenue page.
5. Dashboard with aggregation queries (this is the payoff screen — build it last so the data model is proven first).
6. Settings page.
7. Deploy to Cloudflare Pages under a subdomain or separate small domain (not on the astrology app's domain — this should feel like a separate, private internal tool).