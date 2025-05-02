-- Create message reactions table
create table if not exists public.message_reactions (
    id uuid primary key default uuid_generate_v4(),
    message_id uuid references public.messages(id) on delete cascade,
    user_address text not null,
    emoji text not null,
    created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.message_reactions enable row level security;

-- RLS Policies for reactions
drop policy if exists "Anyone can read reactions" on public.message_reactions;
create policy "Anyone can read reactions"
    on public.message_reactions for select
    using (true);

drop policy if exists "Anyone can insert reactions" on public.message_reactions;
create policy "Anyone can insert reactions"
    on public.message_reactions for insert
    with check (true);

drop policy if exists "Anyone can delete their own reactions" on public.message_reactions;
create policy "Anyone can delete their own reactions"
    on public.message_reactions for delete
    using (user_address = auth.jwt() ->> 'sub');

-- Enable realtime subscriptions
begin;
    alter publication supabase_realtime add table public.message_reactions;
commit;

-- Create index for faster lookups
create index if not exists message_reactions_message_id_idx on public.message_reactions(message_id);
create index if not exists message_reactions_user_address_idx on public.message_reactions(user_address);
