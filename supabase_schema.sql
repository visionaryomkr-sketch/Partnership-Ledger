-- =======================================================
-- PARTNERSHIP LEDGER - SUPABASE DATABASE SCHEMA
-- =======================================================
-- Paste this entire SQL into your Supabase project:
-- Dashboard -> SQL Editor -> New Query -> Run
-- =======================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text default 'partner' check (role in ('admin', 'partner', 'viewer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PARTNERS TABLE
create table if not exists public.partners (
  id text primary key,
  name text not null,
  email text,
  role text not null,
  color text default '#4A5FE8',
  hours numeric default 0,
  invested numeric default 0,
  contribution numeric default 0,
  net numeric default 0,
  share numeric default 0,
  detail text,
  last_active text default 'Today',
  entries_this_week integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. WORK ENTRIES TABLE
create table if not exists public.work_entries (
  id bigserial primary key,
  date date default current_date not null,
  partner text not null,
  category text not null,
  title text not null,
  description text,
  hours numeric not null,
  proof text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. EXPENSE ENTRIES TABLE
create table if not exists public.expense_entries (
  id bigserial primary key,
  date date default current_date not null,
  partner text not null,
  category text not null,
  amount numeric not null,
  description text not null,
  proof text,
  status text default 'Pending' check (status in ('Pending', 'Adjusted', 'Not Needed')),
  updated text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. REVENUE ENTRIES TABLE
create table if not exists public.revenue_entries (
  id bigserial primary key,
  date date default current_date not null,
  source text not null,
  amount numeric not null,
  customers integer default 0,
  notes text,
  partner text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. MILESTONES TABLE
create table if not exists public.milestones (
  id bigserial primary key,
  title text not null,
  description text,
  target_date date,
  completion_date date,
  status text default 'Upcoming' check (status in ('Upcoming', 'Pending', 'In Progress', 'Completed')),
  owners jsonb default '[]'::jsonb,
  created_by text default 'OM Kumar',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. DECISIONS TABLE
create table if not exists public.decisions (
  id bigserial primary key,
  date date default current_date not null,
  title text not null,
  description text,
  status text default 'Approved' check (status in ('Proposed', 'Approved', 'Rejected')),
  voted_by jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. APP SETTINGS TABLE
create table if not exists public.app_settings (
  id text primary key default 'general',
  hourly_rate numeric default 1000,
  upfront_payment numeric default 50000,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by text default 'OM Kumar'
);

-- 9. SETTINGS CHANGELOG TABLE
create table if not exists public.settings_changelog (
  id bigserial primary key,
  who text not null,
  field text not null,
  when_text text not null,
  old_value text not null,
  next_value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. DOCUMENTS TABLE
create table if not exists public.documents (
  id bigserial primary key,
  name text not null,
  uploaded_by text not null,
  date date default current_date not null,
  category text not null default 'Legal',
  type text default 'PDF',
  file_url text,
  file_size text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. ROLES TABLE
create table if not exists public.roles (
  id bigserial primary key,
  partner text not null,
  role_title text not null,
  responsibility text not null,
  deliverables text not null,
  authority text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. PARTNERSHIP TIMELINE TABLE
create table if not exists public.partnership_timeline (
  id bigserial primary key,
  date text not null,
  title text not null,
  description text not null,
  category text default 'Milestone',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================
alter table public.profiles enable row level security;
alter table public.partners enable row level security;
alter table public.work_entries enable row level security;
alter table public.expense_entries enable row level security;
alter table public.revenue_entries enable row level security;
alter table public.milestones enable row level security;
alter table public.decisions enable row level security;
alter table public.app_settings enable row level security;
alter table public.settings_changelog enable row level security;
alter table public.documents enable row level security;
alter table public.roles enable row level security;
alter table public.partnership_timeline enable row level security;

-- Allow authenticated users full read and write access to ledger tables
create policy "Authenticated users can read profiles" on public.profiles for select using (auth.role() = 'authenticated');
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Authenticated users can read partners" on public.partners for select using (auth.role() = 'authenticated');
create policy "Authenticated users can update partners" on public.partners for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage work entries" on public.work_entries for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage expenses" on public.expense_entries for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage revenue" on public.revenue_entries for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage milestones" on public.milestones for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage decisions" on public.decisions for all using (auth.role() = 'authenticated');

create policy "Authenticated users can read app_settings" on public.app_settings for select using (auth.role() = 'authenticated');
create policy "Authenticated users can manage app_settings" on public.app_settings for all using (auth.role() = 'authenticated');

create policy "Authenticated users can read settings_changelog" on public.settings_changelog for select using (auth.role() = 'authenticated');
create policy "Authenticated users can manage settings_changelog" on public.settings_changelog for all using (auth.role() = 'authenticated');

create policy "Authenticated users can read documents" on public.documents for select using (auth.role() = 'authenticated');
create policy "Authenticated users can manage documents" on public.documents for all using (auth.role() = 'authenticated');

create policy "Authenticated users can read roles" on public.roles for select using (auth.role() = 'authenticated');
create policy "Authenticated users can manage roles" on public.roles for all using (auth.role() = 'authenticated');

create policy "Authenticated users can read timeline" on public.partnership_timeline for select using (auth.role() = 'authenticated');
create policy "Authenticated users can manage timeline" on public.partnership_timeline for all using (auth.role() = 'authenticated');

-- =======================================================
-- INITIAL SEED DATA
-- =======================================================
insert into public.partners (id, name, email, role, color, hours, invested, contribution, net, share, detail, last_active, entries_this_week)
values
  ('om', 'OM Kumar', 'omkumar97678@gmail.com', 'Developer', '#4A5FE8', 324, 62000, 386000, 159600, 40, 'Built the entire platform end-to-end: the astronomical calculation engine, Gun Milan matching system, PDF report generation, backend security, and deployment.', 'Today', 5),
  ('shubham', 'Shubham Jain', null, 'Ad Creative', '#D14F9C', 60, 18000, 78000, -91800, 30, 'Responsible for designing ad creatives, video content, and campaign visuals.', '2 days ago', 2),
  ('ashwin', 'Ashwin Pillai', null, 'Marketing', '#E8734A', 77, 25000, 102000, -67800, 30, 'Responsible for running ad campaigns, audience targeting, and growth marketing.', '3 days ago', 1)
on conflict (id) do nothing;

insert into public.app_settings (id, hourly_rate, upfront_payment, updated_by)
values ('general', 1000, 50000, 'OM Kumar')
on conflict (id) do nothing;

insert into public.documents (name, uploaded_by, date, type, category)
values
  ('Partnership Terms (Informal)', 'OM Kumar', '2026-06-15', 'PDF', 'Legal'),
  ('Terms of Service — Jyotish App', 'OM Kumar', '2026-08-20', 'HTML', 'Legal'),
  ('Privacy Policy — Jyotish App', 'OM Kumar', '2026-08-20', 'HTML', 'Legal'),
  ('Refund Policy — Jyotish App', 'OM Kumar', '2026-08-20', 'HTML', 'Legal'),
  ('Q3 Budget Projection', 'Ashwin Pillai', '2026-07-15', 'XLSX', 'Financial'),
  ('Pitch Deck v2', 'Shubham Jain', '2026-08-01', 'PDF', 'Product'),
  ('Ad Creative Briefs', 'Shubham Jain', '2026-08-22', 'PDF', 'Product'),
  ('Security Audit Report', 'OM Kumar', '2026-08-31', 'PDF', 'Other')
on conflict do nothing;

insert into public.roles (partner, role_title, responsibility, deliverables, authority)
values
  ('OM Kumar', 'Technical Development', 'Technical Development', 'Platform, calculation engine, security, deployment, PDF reports', 'Final say on technical architecture, code quality, and security decisions'),
  ('Shubham Jain', 'Ad Creative Production', 'Ad Creative Production', 'Ad creatives, video content, campaign visuals, brand identity', 'Final say on creative direction and visual brand identity'),
  ('Ashwin Pillai', 'Marketing & Growth', 'Marketing & Growth', 'Ad campaigns, audience targeting, growth strategy, marketing budget', 'Final say on ad spend allocation and marketing channels')
on conflict do nothing;

insert into public.partnership_timeline (date, title, description)
values
  ('Jun 15, 2026', 'Project started', 'Initial concept and business plan agreed by all three partners.'),
  ('Jul 2, 2026', 'Domain live', 'jyotishfuture.in registered and configured.'),
  ('Jul 15, 2026', 'Marketing strategy defined', 'Channels, budget, and KPIs established.'),
  ('Aug 10, 2026', 'Platform backend complete', 'Data services, authentication, and authorization built.'),
  ('Aug 15, 2026', 'Astronomical calculation engine', 'Core planetary position calculations operational.'),
  ('Aug 20, 2026', 'API key security incident', 'Exposed API key discovered — full backend security overhaul initiated.'),
  ('Aug 28, 2026', 'Platform development completed', 'All technical systems built, tested, and deployment-ready.'),
  ('Sep 1, 2026', '₹50,000 upfront payment proposed', 'Fair acknowledgment of completed verifiable work ahead of revenue.')
on conflict do nothing;
-- =======================================================
-- 10. AUDIT HISTORY TABLE (Permanent Audit Trail)
-- =======================================================
create table if not exists public.audit_history (
  id bigserial primary key,
  action text not null check (action in ('CREATED', 'UPDATED', 'DELETED')),
  entity_type text not null, -- 'Decision', 'Work Entry', 'Expense', 'Milestone', 'Document', 'Setting', 'Profit Share'
  entity_id text,
  actor text not null default 'OM Kumar',
  title text not null,
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audit_history enable row level security;
create policy "Authenticated users can read audit history" on public.audit_history for select to authenticated using (true);
create policy "Authenticated users can insert audit history" on public.audit_history for insert to authenticated with check (true);
create policy "No direct updates to audit history" on public.audit_history for update to authenticated using (false);
create policy "No direct deletes from audit history" on public.audit_history for delete to authenticated using (false);
