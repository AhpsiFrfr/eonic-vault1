-- Add edited_at and edited_by to messages
alter table public.messages
add column if not exists edited_at timestamptz,
add column if not exists edited_by uuid references auth.users(id);

-- Add thread_id to messages for threading support
alter table public.messages
add column if not exists thread_id uuid references public.messages(id),
add column if not exists reply_count integer default 0;

-- Create typing_indicators table
create table if not exists public.typing_indicators (
    id uuid primary key default uuid_generate_v4(),
    user_address text not null,
    room text not null,
    last_typed timestamptz default now(),
    created_at timestamptz default now()
);

-- Create read_receipts table
create table if not exists public.read_receipts (
    id uuid primary key default uuid_generate_v4(),
    message_id uuid references public.messages(id) on delete cascade,
    user_address text not null,
    read_at timestamptz default now(),
    created_at timestamptz default now()
);

-- Create user_profiles table
create table if not exists public.user_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_address text unique not null,
    display_name text,
    avatar_url text,
    status text default 'online',
    last_seen timestamptz default now(),
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.typing_indicators enable row level security;
alter table public.read_receipts enable row level security;
alter table public.user_profiles enable row level security;

-- RLS Policies for typing indicators
create policy "Anyone can read typing indicators"
    on public.typing_indicators for select
    using (true);

create policy "Anyone can insert typing indicators"
    on public.typing_indicators for insert
    with check (true);

create policy "Anyone can update their own typing indicators"
    on public.typing_indicators for update
    using (user_address = auth.jwt() ->> 'sub');

create policy "Anyone can delete their own typing indicators"
    on public.typing_indicators for delete
    using (user_address = auth.jwt() ->> 'sub');

-- RLS Policies for read receipts
create policy "Anyone can read read receipts"
    on public.read_receipts for select
    using (true);

create policy "Anyone can insert read receipts"
    on public.read_receipts for insert
    with check (true);

-- RLS Policies for user profiles
create policy "Anyone can read user profiles"
    on public.user_profiles for select
    using (true);

create policy "Anyone can insert their own profile"
    on public.user_profiles for insert
    with check (user_address = auth.jwt() ->> 'sub');

create policy "Anyone can update their own profile"
    on public.user_profiles for update
    using (user_address = auth.jwt() ->> 'sub');

-- Enable realtime subscriptions
begin;
    alter publication supabase_realtime add table public.typing_indicators;
    alter publication supabase_realtime add table public.read_receipts;
    alter publication supabase_realtime add table public.user_profiles;
commit;

-- Create indexes for better performance
create index if not exists typing_indicators_user_room_idx on public.typing_indicators(user_address, room);
create index if not exists read_receipts_message_user_idx on public.read_receipts(message_id, user_address);
create index if not exists messages_thread_id_idx on public.messages(thread_id);
create index if not exists user_profiles_user_address_idx on public.user_profiles(user_address);
