-- Enable RLS
alter table messages enable row level security;
alter table message_reactions enable row level security;

-- Create message_reactions table
create table if not exists message_reactions (
  id uuid default uuid_generate_v4() primary key,
  message_id uuid references messages(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('emoji', 'gif', 'sticker')),
  content text not null, -- emoji character, gif URL, or sticker ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure unique reactions per user per message (can't react twice with same content)
  unique(message_id, user_id, reaction_type, content)
);

-- Create index for faster lookups
create index message_reactions_message_id_idx on message_reactions(message_id);
create index message_reactions_user_id_idx on message_reactions(user_id);

-- RLS policies
create policy "Users can view reactions on messages they can see"
  on message_reactions for select
  using (
    exists (
      select 1 from messages m
      where m.id = message_reactions.message_id
      and (
        m.sender_id = auth.uid() or
        exists (
          select 1 from message_participants mp
          where mp.message_id = m.id
          and mp.user_id = auth.uid()
        )
      )
    )
  );

create policy "Users can add reactions to messages they can see"
  on message_reactions for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from messages m
      where m.id = message_reactions.message_id
      and (
        m.sender_id = auth.uid() or
        exists (
          select 1 from message_participants mp
          where mp.message_id = m.id
          and mp.user_id = auth.uid()
        )
      )
    )
  );

create policy "Users can delete their own reactions"
  on message_reactions for delete
  using (auth.uid() = user_id); 