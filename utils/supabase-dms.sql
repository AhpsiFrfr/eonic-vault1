-- Drop existing table if it exists
drop table if exists direct_messages cascade;

-- Direct Messages table
create table direct_messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  sender_address text not null,
  recipient_address text not null,
  parent_id uuid references direct_messages(id) on delete cascade,
  thread_count integer default 0
);

-- Enable RLS
alter table direct_messages enable row level security;

-- RLS Policies for direct_messages
create policy "Users can read their own DMs"
  on direct_messages for select
  using (sender_address = auth.jwt() ->> 'sub' or recipient_address = auth.jwt() ->> 'sub');

create policy "Users can send DMs"
  on direct_messages for insert
  with check (sender_address = auth.jwt() ->> 'sub');

create policy "Users can delete their own DMs"
  on direct_messages for delete
  using (sender_address = auth.jwt() ->> 'sub');

-- Indexes for performance
create index direct_messages_sender_idx on direct_messages(sender_address);
create index direct_messages_recipient_idx on direct_messages(recipient_address);
create index direct_messages_thread_idx on direct_messages(parent_id);

-- DM attachments table
create table direct_message_attachments (
  id uuid default uuid_generate_v4() primary key,
  message_id uuid references direct_messages(id) on delete cascade not null,
  type text not null,
  url text not null,
  filename text not null,
  size integer not null,
  preview_url text
);

-- Enable RLS for attachments
alter table direct_message_attachments enable row level security;

-- RLS Policies for attachments
create policy "Anyone can read DM attachments"
  on direct_message_attachments for select
  using (true);

create policy "Message sender can add attachments"
  on direct_message_attachments for insert
  with check (exists (
    select 1 from direct_messages
    where id = message_id
    and sender_address = auth.jwt() ->> 'sub'
  ));
