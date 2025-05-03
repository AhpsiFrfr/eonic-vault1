-- Drop existing table if it exists
drop table if exists online_users cascade;

-- Online users table
create table online_users (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text,
  wallet_address text not null,
  room_id text not null default 'general',
  last_seen timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(wallet_address, room_id)
);

-- Enable RLS
alter table online_users enable row level security;

-- RLS Policies for online_users
create policy "Anyone can read online users"
  on online_users for select
  using (true);

create policy "Anyone can insert online users"
  on online_users for insert
  with check (true);

create policy "Anyone can update online users"
  on online_users for update
  using (true);

-- Index for performance
create index online_users_room_id_idx on online_users(room_id);
create index online_users_last_seen_idx on online_users(last_seen);

-- Function to clean up stale users (older than 5 minutes)
create or replace function cleanup_stale_users()
returns trigger as $$
begin
  delete from online_users
  where last_seen < now() - interval '5 minutes';
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to cleanup stale users on any insert/update
create trigger cleanup_stale_users_trigger
  after insert or update on online_users
  execute procedure cleanup_stale_users();
