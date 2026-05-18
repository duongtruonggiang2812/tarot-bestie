-- Run this in Supabase SQL Editor

create table if not exists public.users (
  id text primary key,
  email text unique not null,
  name text,
  avatar text,
  coins integer default 20,
  free_reads_today integer default 0,
  last_reset date default current_date,
  created_at timestamptz default now()
);

create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.users(id) on delete cascade,
  theme text not null,
  cards jsonb not null,
  ai_summary text,
  created_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid references public.readings(id) on delete cascade,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- RLS policies
alter table public.users enable row level security;
alter table public.readings enable row level security;
alter table public.chat_messages enable row level security;

create policy "Users can read own data" on public.users for select using (auth.uid()::text = id);
create policy "Users can update own data" on public.users for update using (auth.uid()::text = id);
create policy "Service role full access users" on public.users for all using (true);

create policy "Users can read own readings" on public.readings for select using (auth.uid()::text = user_id);
create policy "Service role full access readings" on public.readings for all using (true);

create policy "Users can read own messages" on public.chat_messages for select using (
  exists (select 1 from public.readings where id = reading_id and user_id = auth.uid()::text)
);
create policy "Service role full access messages" on public.chat_messages for all using (true);
