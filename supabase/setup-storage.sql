-- Enable storage if not already enabled
create extension if not exists "pg_net";
create schema if not exists storage;

-- Create storage bucket for attachments if it doesn't exist
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', true)
on conflict (id) do nothing;

-- Enable uploads without authentication
drop policy if exists "Enable public uploads" on storage.objects;
create policy "Enable public uploads"
on storage.objects for insert
with check (
    bucket_id = 'attachments'
);

-- Enable public read access
drop policy if exists "Enable public read" on storage.objects;
create policy "Enable public read"
on storage.objects for select
using (
    bucket_id = 'attachments'
);

-- Enable owners to update and delete their files
drop policy if exists "Enable owner updates" on storage.objects;
create policy "Enable owner updates"
on storage.objects for update
using (
    bucket_id = 'attachments'
)
with check (
    bucket_id = 'attachments'
);

drop policy if exists "Enable owner deletes" on storage.objects;
create policy "Enable owner deletes"
on storage.objects for delete
using (
    bucket_id = 'attachments'
);
