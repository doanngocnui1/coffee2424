-- =========================================================================
-- COFFEE 24/24 - SUPABASE DATABASE INITIALIZATION & SCHEMA SETUP
-- Hướng dẫn: Copy toàn bộ nội dung file này, vào Supabase Dashboard
-- -> Chọn "SQL Editor" -> Bấm "New query" -> Dán vào và bấm "Run" (hoặc Ctrl+Enter)
-- =========================================================================

-- 1. TẠO BẢNG CẤU HÌNH WEBSITE (BANNER, MÓN MỚI, ƯU ĐÃI, KHÔNG GIAN, CHỦ ĐỀ...)
create table if not exists public.site_config (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Bật tính năng bảo mật Row Level Security (RLS)
alter table public.site_config enable row level security;

-- Cho phép đọc công khai (để tất cả khách truy cập website đọc được dữ liệu trang chủ)
drop policy if exists "Cho phep doc cong khai site_config" on public.site_config;
create policy "Cho phep doc cong khai site_config" on public.site_config
  for select using (true);

-- Cho phép ghi / cập nhật (để trang Admin lưu cấu hình lên cloud)
drop policy if exists "Cho phep cap nhat site_config" on public.site_config;
create policy "Cho phep cap nhat site_config" on public.site_config
  for all using (true);

-- Bật tính năng Realtime (khi Admin lưu, mọi khách đang mở web nhận dữ liệu ngay lập tức không cần F5)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'site_config'
  ) then
    alter publication supabase_realtime add table public.site_config;
  end if;
end $$;


-- =========================================================================
-- 2. TẠO BUCKET LƯU TRỮ HÌNH ẢNH (SUPABASE STORAGE)
-- Giúp lưu ảnh món mới, ảnh banner, ảnh avatar lên Cloud tốc độ cao (thay vì Base64 nặng máy)
-- =========================================================================

insert into storage.buckets (id, name, public)
values ('coffee2424-media', 'coffee2424-media', true)
on conflict (id) do update set public = true;

-- Cho phép xem ảnh công khai
drop policy if exists "Public media view" on storage.objects;
create policy "Public media view" on storage.objects
  for select using (bucket_id = 'coffee2424-media');

-- Cho phép tải ảnh lên từ admin
drop policy if exists "Public media upload" on storage.objects;
create policy "Public media upload" on storage.objects
  for insert with check (bucket_id = 'coffee2424-media');

-- Cho phép cập nhật ảnh
drop policy if exists "Public media update" on storage.objects;
create policy "Public media update" on storage.objects
  for update using (bucket_id = 'coffee2424-media');

-- Cho phép xóa ảnh
drop policy if exists "Public media delete" on storage.objects;
create policy "Public media delete" on storage.objects
  for delete using (bucket_id = 'coffee2424-media');
