-- Create storage bucket for attachments
insert into storage.buckets (id, name, public) values ('attachments', 'attachments', true);

-- Allow public access to read files
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'attachments' );

-- Allow anyone to upload files
create policy "Anyone can upload"
on storage.objects for insert
with check (
    bucket_id = 'attachments'
);
