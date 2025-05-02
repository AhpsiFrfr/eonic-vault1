-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Messages table for chat functionality
create table if not exists public.messages (
    id uuid primary key default uuid_generate_v4(),
    content text not null,
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

-- Proposals table for governance
create table if not exists public.proposals (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text not null,
    creator_address text not null,
    votes_for integer default 0,
    votes_against integer default 0,
    status text not null check (status in ('active', 'completed', 'cancelled')),
    created_at timestamptz default now(),
    ends_at timestamptz not null
);

-- Votes table for governance voting
create table if not exists public.votes (
    id uuid primary key default uuid_generate_v4(),
    proposal_id uuid references public.proposals(id) on delete cascade,
    voter_address text not null,
    vote text not null check (vote in ('for', 'against')),
    voting_power integer not null,
    created_at timestamptz default now(),
    unique(proposal_id, voter_address)
);

-- Enable Row Level Security
alter table public.messages enable row level security;
alter table public.message_attachments enable row level security;
alter table public.message_reactions enable row level security;
alter table public.proposals enable row level security;
alter table public.votes enable row level security;

-- RLS Policies for messages
create policy "Anyone can read messages"
    on public.messages for select
    using (true);

create policy "Anyone can insert messages"
    on public.messages for insert
    with check (true);

-- RLS Policies for attachments
create policy "Anyone can read attachments"
    on public.message_attachments for select
    using (true);

create policy "Anyone can insert attachments"
    on public.message_attachments for insert
    with check (true);

-- RLS Policies for reactions
create policy "Anyone can read reactions"
    on public.message_reactions for select
    using (true);

create policy "Users can manage their own reactions"
    on public.message_reactions for all
    using (auth.uid()::text = user_address);

-- RLS Policies for proposals
create policy "Anyone can read proposals"
    on public.proposals for select
    using (true);

create policy "Authenticated users can create proposals"
    on public.proposals for insert
    with check (auth.role() = 'authenticated');

-- RLS Policies for votes
create policy "Anyone can read votes"
    on public.votes for select
    using (true);

create policy "Users can manage their own votes"
    on public.votes for all
    using (auth.uid()::text = voter_address);

-- Enable realtime subscriptions
begin;
    alter publication supabase_realtime add table public.messages;
    alter publication supabase_realtime add table public.message_reactions;
    alter publication supabase_realtime add table public.proposals;
    alter publication supabase_realtime add table public.votes;
commit;
