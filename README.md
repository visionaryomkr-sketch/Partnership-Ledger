# Partnership Ledger

A private financial, work, and equity tracking system for startup partnerships. Powered by **React, Vite, Tailwind CSS, and Supabase**.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a free project on [Supabase](https://supabase.com).
2. Go to **Project Settings -> API** and copy:
   - **Project URL**
   - **anon / public key**
3. Create or update `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Setup Database (Optional)

In your Supabase Dashboard:
1. Open the **SQL Editor**.
2. Paste and run the contents of [supabase_schema.sql](supabase_schema.sql).
3. This creates all necessary tables (`profiles`, `partners`, `work_entries`, `expense_entries`, `revenue_entries`, `milestones`, `decisions`) with Row Level Security (RLS) policies.

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- **Authentication**: Email/password registration, login, password recovery, and Google OAuth with Supabase.
- **Dashboard**: Net partner positions, revenue breakdown, work contribution charts, and pending reimbursements.
- **Work Log**: Track hours, categories, and proof links for partnership contributions.
- **Expenses**: Submit and categorize expenses with reimbursement statuses.
- **Revenue**: Verified revenue tracking across direct sales and organic streams.
- **Equity & Milestones**: Cap table visibility, project roadmap, and team decision logging.
