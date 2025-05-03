-- Create direct messages table if it doesn't exist
create table if not exists direct_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  sender_address text not null,
  recipient_address text not null,
  parent_id uuid references direct_messages(id) on delete cascade,
  thread_count integer default 0
);

-- Create attachments table if it doesn't exist
create table if not exists direct_message_attachments (
  id uuid default gen_random_uuid() primary key,
  message_id uuid references direct_messages(id) on delete cascade not null,
  type text not null,
  url text not null,
  filename text not null,
  size integer not null,
  preview_url text
);

-- Enable RLS on both tables
alter table direct_messages enable row level security;
alter table direct_message_attachments enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can read their own DMs" on direct_messages;
drop policy if exists "Users can send DMs" on direct_messages;
drop policy if exists "Users can delete their own DMs" on direct_messages;
drop policy if exists "Users can read message attachments" on direct_message_attachments;
drop policy if exists "Users can add attachments" on direct_message_attachments;

-- Create RLS policies for direct_messages
create policy "Users can read their own DMs"
  on direct_messages for select
  using (
    auth.role() = 'authenticated' and
    (sender_address = current_user or recipient_address = current_user)
  );

create policy "Users can send DMs"
  on direct_messages for insert
  with check (
    auth.role() = 'authenticated' and
    sender_address = current_user
  );

create policy "Users can delete their own DMs"
  on direct_messages for delete
  using (
    auth.role() = 'authenticated' and
    sender_address = current_user
  );

-- Create RLS policies for attachments
create policy "Users can read message attachments"
  on direct_message_attachments for select
  using (
    auth.role() = 'authenticated' and
    exists (
      select 1 from direct_messages
      where id = direct_message_attachments.message_id
      and (sender_address = current_user or recipient_address = current_user)
    )
  );

create policy "Users can add attachments"
  on direct_message_attachments for insert
  with check (
    auth.role() = 'authenticated' and
    exists (
      select 1 from direct_messages
      where id = direct_message_attachments.message_id
      and sender_address = current_user
    )
  );

-- Create function to get direct messages
create or replace function get_direct_messages(
  p_user_address text,
  p_recipient_address text
) returns setof direct_messages
language sql
security definer
set search_path = public
as $$
  select *
  from direct_messages
  where (sender_address = p_user_address and recipient_address = p_recipient_address)
     or (sender_address = p_recipient_address and recipient_address = p_user_address)
  order by created_at asc;
$$;

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on direct_messages to authenticated;
grant all on direct_message_attachments to authenticated;
