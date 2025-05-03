-- Enable RLS
alter table messages enable row level security;
alter table message_attachments enable row level security;
alter table message_reactions enable row level security;

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

-- RLS Policies
create policy "Anyone can read messages"
  on messages for select
  using (true);

create policy "Anyone can insert messages"
  on messages for insert
  with check (true);

create policy "Anyone can read attachments"
  on message_attachments for select
  using (true);

create policy "Anyone can insert attachments"
  on message_attachments for insert
  with check (true);

create policy "Anyone can read reactions"
  on message_reactions for select
  using (true);

create policy "Anyone can insert/delete their own reactions"
  on message_reactions for all
  using (sender_address = auth.jwt()->>'sub')
  with check (sender_address = auth.jwt()->>'sub');

-- Indexes
create index messages_room_created_at_idx on messages(room, created_at desc);
create index messages_parent_id_idx on messages(parent_id);
create index message_attachments_message_id_idx on message_attachments(message_id);
create index message_reactions_message_id_idx on message_reactions(message_id);
