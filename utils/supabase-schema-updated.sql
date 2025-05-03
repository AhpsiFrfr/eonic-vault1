-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist
drop table if exists message_reactions cascade;
drop table if exists message_attachments cascade;
drop table if exists messages cascade;

-- Messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  sender_address text not null,
  room text not null default 'general',
  parent_id uuid references messages(id),
  thread_count integer default 0
);

-- Message attachments
create table message_attachments (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  message_id uuid references messages(id) on delete cascade not null,
  type text not null,
  url text not null,
  filename text not null,
  size integer not null,
  preview_url text
);

-- Message reactions
create table message_reactions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  message_id uuid references messages(id) on delete cascade not null,
  sender_address text not null,
  emoji text not null,
  unique(message_id, sender_address, emoji)
);

-- Enable RLS
alter table messages enable row level security;
alter table message_attachments enable row level security;
alter table message_reactions enable row level security;

-- RLS Policies for messages
create policy "Anyone can read messages"
  on messages for select
  using (true);

create policy "Anyone can insert messages"
  on messages for insert
  with check (true);

-- RLS Policies for attachments
create policy "Anyone can read attachments"
  on message_attachments for select
  using (true);

create policy "Anyone can insert attachments"
  on message_attachments for insert
  with check (true);

-- RLS Policies for reactions
create policy "Anyone can read reactions"
  on message_reactions for select
  using (true);

create policy "Anyone can insert their own reactions"
  on message_reactions for insert
  with check (sender_address = sender_address);

create policy "Anyone can delete their own reactions"
  on message_reactions for delete
  using (sender_address = sender_address);

-- Indexes for performance
create index messages_room_created_at_idx on messages(room, created_at desc);
create index messages_parent_id_idx on messages(parent_id);
create index message_attachments_message_id_idx on message_attachments(message_id);
create index message_reactions_message_id_idx on message_reactions(message_id);

-- Storage setup for attachments (if not exists)
do $$ 
begin
  if not exists (select 1 from storage.buckets where id = 'attachments') then
    insert into storage.buckets (id, name, public) 
    values ('attachments', 'attachments', true);
  end if;
end $$;

-- Storage policies for public access (drop if exists first)
drop policy if exists "Attachments are publicly accessible" on storage.objects;
drop policy if exists "Anyone can upload attachments" on storage.objects;

create policy "Attachments are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'attachments' );

create policy "Anyone can upload attachments"
  on storage.objects for insert
  with check ( bucket_id = 'attachments' );
