-- Create storage bucket for attachments if it doesn't exist
insert into storage.buckets (id, name, public)
select 'attachments', 'attachments', true
where not exists (
    select 1 from storage.buckets where id = 'attachments'
);

-- Enable uploads without authentication
create policy "Enable public uploads"
on storage.objects for insert
with check (
    bucket_id = 'attachments'
);

-- Enable public read access
create policy "Enable public read"
on storage.objects for select
using (
    bucket_id = 'attachments'
);

-- Enable owners to update and delete their files
create policy "Enable owner updates"
on storage.objects for update
using (
    bucket_id = 'attachments'
)
with check (
    bucket_id = 'attachments'
);

create policy "Enable owner deletes"
on storage.objects for delete
using (
    bucket_id = 'attachments'
);
