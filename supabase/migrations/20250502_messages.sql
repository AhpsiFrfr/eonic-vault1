-- Messages table for chat functionality
create table if not exists public.messages (
    id uuid primary key default uuid_generate_v4(),
    content text,
    sender_address text not null,
    room text not null,
    parent_id uuid references public.messages(id),
    created_at timestamptz default now()
);

-- Message attachments table for file sharing
create table if not exists public.message_attachments (
    id uuid primary key default uuid_generate_v4(),
    message_id uuid references public.messages(id) on delete cascade,
    type text not null check (type in ('image', 'file')),
    url text not null,
    filename text not null,
    size integer not null,
    created_at timestamptz default now()
);

-- Message reactions table for emoji reactions
create table if not exists public.message_reactions (
    id uuid primary key default uuid_generate_v4(),
    message_id uuid references public.messages(id) on delete cascade,
    user_address text not null,
    emoji text not null,
    created_at timestamptz default now(),
    unique(message_id, user_address, emoji)
);

-- Enable Row Level Security
alter table public.messages enable row level security;
alter table public.message_attachments enable row level security;
alter table public.message_reactions enable row level security;

-- RLS Policies for messages
drop policy if exists "Anyone can read messages" on public.messages;
create policy "Anyone can read messages"
    on public.messages for select
    using (true);

drop policy if exists "Anyone can insert messages" on public.messages;
create policy "Anyone can insert messages"
    on public.messages for insert
    with check (true);

-- RLS Policies for attachments
drop policy if exists "Anyone can read attachments" on public.message_attachments;
create policy "Anyone can read attachments"
    on public.message_attachments for select
    using (true);

drop policy if exists "Anyone can insert attachments" on public.message_attachments;
create policy "Anyone can insert attachments"
    on public.message_attachments for insert
    with check (true);

-- RLS Policies for reactions
drop policy if exists "Anyone can read reactions" on public.message_reactions;
create policy "Anyone can read reactions"
    on public.message_reactions for select
    using (true);

drop policy if exists "Anyone can insert reactions" on public.message_reactions;
create policy "Anyone can insert reactions"
    on public.message_reactions for insert
    with check (true);

-- Enable realtime subscriptions
begin;
    drop publication if exists supabase_realtime;
    create publication supabase_realtime;
    alter publication supabase_realtime add table public.messages;
    alter publication supabase_realtime add table public.message_attachments;
    alter publication supabase_realtime add table public.message_reactions;
commit;
