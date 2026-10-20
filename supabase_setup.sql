-- =========================================================================
-- COFFEE 24/24 - SUPABASE ENTERPRISE SECURITY & DATABASE SCHEMA SETUP
-- HƯỚNG DẪN BẢO MẬT TUYỆT ĐỐI CHO HỆ THỐNG:
-- 1. Mở Supabase Dashboard (https://supabase.com/dashboard) -> Chọn dự án Coffee 24/24
-- 2. Vào mục "SQL Editor" ở menu bên trái -> Nhấn "New query"
-- 3. Dán toàn bộ nội dung file này vào và nhấn "Run" (hoặc phím tắt Ctrl + Enter)
-- 4. Vào mục "Authentication" -> "Users" -> Nhấn "Add User" -> Chọn "Create User":
--    - Email: Admin.coffee2424@gmail.com
--    - Password: Nhập mật khẩu bí mật của bạn (Tối thiểu 8 ký tự, có chữ hoa, số, ký tự đặc biệt)
--    - Bật "Auto Confirm User" -> Nhấn "Create User"
--
-- LỢI ÍCH BẢO MẬT:
--  Mật khẩu được băm (hash) bằng thuật toán bcrypt trực tiếp trên máy chủ Supabase,
--   HOÀN TOÀN KHÔNG LƯU TRONG CODE CỦA WEB hay LocalStorage.
--  Bật Row Level Security (RLS): Kẻ xấu dù biết link API và anon key cũng KHÔNG THỂ
--   chỉnh sửa, xóa dữ liệu hay làm sập web vì hệ thống từ chối mọi yêu cầu chưa đăng nhập.
-- =========================================================================

-- =========================================================================
-- PHẦN 1: BẢNG CẤU HÌNH WEBSITE (public.site_config)
-- =========================================================================
create table if not exists public.site_config (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Kích hoạt Row Level Security (RLS) để khóa chặt dữ liệu
alter table public.site_config enable row level security;

-- 1.1. Khách truy cập web CHỈ ĐƯỢC PHÉP ĐỌC (SELECT) để hiển thị giao diện trang chủ
drop policy if exists "Cho phep doc cong khai site_config" on public.site_config;
drop policy if exists "Public read site_config" on public.site_config;
create policy "Public read site_config" on public.site_config
  for select
  using (true);

-- 1.2. CHỈ TÀI KHOẢN ĐÃ ĐĂNG NHẬP (authenticated) MỚI ĐƯỢC PHÉP GHI / SỬA / XÓA CẤU HÌNH WEB
-- Người lạ truy cập từ bên ngoài sẽ bị chặn đứng 100% bởi PostgreSQL RLS
drop policy if exists "Cho phep cap nhat site_config" on public.site_config;
drop policy if exists "Authenticated users can manage site_config" on public.site_config;
create policy "Authenticated users can manage site_config" on public.site_config
  for all
  to authenticated
  using (true)
  with check (true);

-- Bật tính năng Supabase Realtime cho bảng site_config
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
-- PHẦN 2: BẢNG HỒ SƠ QUẢN TRỊ VIÊN & PHÂN QUYỀN (public.admin_profiles)
-- Liên kết trực tiếp với bảng tài khoản auth.users của Supabase
-- =========================================================================
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  role text not null default 'marketing', -- 'super_admin' | 'marketing' | 'hr' | 'custom'
  role_name text default 'Biên Tập & Marketing',
  permissions text[] default array['articles']::text[],
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Kích hoạt RLS cho bảng admin_profiles
alter table public.admin_profiles enable row level security;

-- Chỉ người dùng đã đăng nhập vào Supabase mới được đọc danh sách tài khoản quản trị
drop policy if exists "Authenticated read admin_profiles" on public.admin_profiles;
create policy "Authenticated read admin_profiles" on public.admin_profiles
  for select
  to authenticated
  using (true);

-- Chỉ người dùng đã đăng nhập mới được cập nhật quyền hạn quản trị
drop policy if exists "Authenticated manage admin_profiles" on public.admin_profiles;
create policy "Authenticated manage admin_profiles" on public.admin_profiles
  for all
  to authenticated
  using (true)
  with check (true);

-- Bật tính năng Supabase Realtime cho bảng admin_profiles
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'admin_profiles'
  ) then
    alter publication supabase_realtime add table public.admin_profiles;
  end if;
end $$;


-- =========================================================================
-- PHẦN 3: TỰ ĐỘNG ĐỒNG BỘ HỒ SƠ KHI TẠO USER MỚI TRONG SUPABASE AUTH
-- =========================================================================
create or replace function public.handle_new_admin_user()
returns trigger as $$
begin
  insert into public.admin_profiles (id, email, name, role, role_name, permissions, active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    case 
      when lower(new.email) in ('admin.coffee2424@gmail.com', 'doanngocnui.2424@gmail.com') or lower(new.email) like '%admin%' or lower(new.email) like '%doanngocnui%' then 'super_admin'
      when lower(new.email) like '%hr%' or lower(new.email) like '%tuyendung%' then 'hr'
      else coalesce(new.raw_user_meta_data->>'role', 'marketing')
    end,
    case 
      when lower(new.email) in ('admin.coffee2424@gmail.com', 'doanngocnui.2424@gmail.com') or lower(new.email) like '%admin%' or lower(new.email) like '%doanngocnui%' then 'Tổng Quản Trị (Toàn quyền)'
      when lower(new.email) like '%hr%' or lower(new.email) like '%tuyendung%' then 'Phòng Nhân Sự'
      else coalesce(new.raw_user_meta_data->>'roleName', 'Biên Tập & Marketing')
    end,
    case 
      when lower(new.email) in ('admin.coffee2424@gmail.com', 'doanngocnui.2424@gmail.com') or lower(new.email) like '%admin%' or lower(new.email) like '%doanngocnui%' then array['all']
      when lower(new.email) like '%hr%' or lower(new.email) like '%tuyendung%' then array['jobs']
      else array['homeSections', 'heroSlide', 'glassBg', 'newDishes', 'promotions', 'offerings', 'spaceAmenities', 'sideBanners', 'bannerSections', 'theme', 'systemSettings', 'reviews', 'socialZalo', 'about', 'articles']
    end,
    true
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Gắn trigger tự động kích hoạt
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_admin_user();

-- Đồng bộ nếu trước đó đã có tài khoản sẵn trong auth.users
insert into public.admin_profiles (id, email, name, role, role_name, permissions, active)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  case 
    when lower(email) in ('admin.coffee2424@gmail.com', 'doanngocnui.2424@gmail.com') or lower(email) like '%admin%' or lower(email) like '%doanngocnui%' then 'super_admin'
    when lower(email) like '%hr%' or lower(email) like '%tuyendung%' then 'hr'
    else 'marketing'
  end,
  case 
    when lower(email) in ('admin.coffee2424@gmail.com', 'doanngocnui.2424@gmail.com') or lower(email) like '%admin%' or lower(email) like '%doanngocnui%' then 'Tổng Quản Trị (Toàn quyền)'
    when lower(email) like '%hr%' or lower(email) like '%tuyendung%' then 'Phòng Nhân Sự'
    else 'Biên Tập & Marketing'
  end,
  case 
    when lower(email) in ('admin.coffee2424@gmail.com', 'doanngocnui.2424@gmail.com') or lower(email) like '%admin%' or lower(email) like '%doanngocnui%' then array['all']
    when lower(email) like '%hr%' or lower(email) like '%tuyendung%' then array['jobs']
    else array['homeSections', 'heroSlide', 'glassBg', 'newDishes', 'promotions', 'offerings', 'spaceAmenities', 'sideBanners', 'bannerSections', 'theme', 'systemSettings', 'reviews', 'socialZalo', 'about', 'articles']
  end,
  true
from auth.users
on conflict (id) do nothing;


-- =========================================================================
-- PHẦN 4: BUCKET LƯU TRỮ HÌNH ẢNH (SUPABASE STORAGE) ĐƯỢC KHÓA CHẶT
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('coffee2424-media', 'coffee2424-media', true)
on conflict (id) do update set public = true;

-- 4.1. Cho phép xem ảnh công khai (để khách vào web thấy được ảnh món nước, ảnh banner)
drop policy if exists "Public media view" on storage.objects;
create policy "Public media view" on storage.objects
  for select using (bucket_id = 'coffee2424-media');

-- 4.2. CHỈ TÀI KHOẢN ĐÃ ĐĂNG NHẬP MỚI ĐƯỢC TẢI ẢNH LÊN CLOUD (Ngăn chặn kẻ xấu spam tệp tin)
drop policy if exists "Public media upload" on storage.objects;
drop policy if exists "Authenticated media upload" on storage.objects;
create policy "Authenticated media upload" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'coffee2424-media');

-- 4.3. CHỈ TÀI KHOẢN ĐÃ ĐĂNG NHẬP MỚI ĐƯỢC SỬA ẢNH
drop policy if exists "Public media update" on storage.objects;
drop policy if exists "Authenticated media update" on storage.objects;
create policy "Authenticated media update" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'coffee2424-media');

-- 4.4. CHỈ TÀI KHOẢN ĐÃ ĐĂNG NHẬP MỚI ĐƯỢC XÓA ẢNH
drop policy if exists "Public media delete" on storage.objects;
drop policy if exists "Authenticated media delete" on storage.objects;
create policy "Authenticated media delete" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'coffee2424-media');
