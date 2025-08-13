
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  cover_url text,
  play_url text not null,
  source_host text,
  tags text[] default '{}',
  status text not null default 'active',
  submitter_id uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table public.games enable row level security;

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  author_id uuid default auth.uid(),
  content text not null,
  created_at timestamptz default now(),
  is_deleted boolean default false
);
alter table public.comments enable row level security;

create policy if not exists "games_select_public" on public.games for select using (true);
create policy if not exists "comments_select_public" on public.comments for select using (true);

create policy if not exists "games_insert_auth" on public.games for insert with check (auth.uid() is not null);
create policy if not exists "comments_insert_auth" on public.comments for insert with check (auth.uid() is not null);
