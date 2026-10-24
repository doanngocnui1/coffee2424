import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://ilyxybkcndjcnzrtjjiq.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_llbDzmgJcXZh7tTZMXreKg_luy9yVV0';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const isLocalhost = (() => {
  if (typeof window === 'undefined') return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host.endsWith('.local');
})();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Tải ảnh trực tiếp lên Supabase Storage bucket 'coffee2424-media'
 * @param {File|Blob} file - File hoặc Blob hình ảnh
 * @param {string} folder - Thư mục phân loại (dishes, promos, hero, banners)
 * @returns {Promise<string|null>} URL công khai của hình ảnh hoặc null nếu lỗi
 */
export async function uploadImageToSupabase(file, folder = 'general') {
  if (!isSupabaseConfigured) return null;
  try {
    let ext = 'jpg';
    let contentType = 'image/jpeg';
    if (file.name) {
      ext = file.name.split('.').pop().toLowerCase();
      contentType = file.type || (ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg');
    } else if (file.type) {
      ext = file.type.split('/')[1] || 'jpg';
      if (ext === 'jpeg') ext = 'jpg';
      contentType = file.type;
    }
    const cleanName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { error } = await supabase.storage
      .from('coffee2424-media')
      .upload(cleanName, file, {
        contentType,
        cacheControl: '31536000',
        upsert: false
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('coffee2424-media')
      .getPublicUrl(cleanName);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Lỗi tải ảnh lên Supabase Storage:', err);
    return null;
  }
}

/**
 * Lấy cấu hình toàn trang từ bảng site_config trên Supabase
 */
export async function fetchCloudSiteConfig() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('data, updated_at')
      .eq('id', 'main')
      .maybeSingle();

    if (error) {
      console.warn('Lỗi khi tải cấu hình từ Supabase (có thể bảng chưa được tạo):', error.message);
      return null;
    }

    return data?.data || null;
  } catch (err) {
    console.warn('Không thể kết nối Supabase:', err);
    return null;
  }
}

/**
 * Lưu cấu hình toàn trang lên Supabase Cloud
 */
export async function saveCloudSiteConfig(config) {
  if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };
  try {
    const { error } = await supabase
      .from('site_config')
      .upsert({
        id: 'main',
        data: config,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Lỗi khi lưu cấu hình lên Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Lỗi ngoại lệ khi lưu Supabase:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Lắng nghe thay đổi Realtime từ Supabase
 */
export function subscribeToCloudSiteConfig(onUpdate) {
  if (!isSupabaseConfigured) return () => {};

  try {
    const channel = supabase
      .channel('public:site_config')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, (payload) => {
        if (payload?.new?.data && typeof onUpdate === 'function') {
          onUpdate(payload.new.data);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Lỗi khởi tạo Realtime Supabase:', err);
    return () => {};
  }
}
