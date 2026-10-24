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
 * Tự động nén và chuyển đổi hình ảnh sang định dạng WebP siêu nhẹ
 * @param {File|Blob} file - File ảnh đầu vào
 * @param {Object} options - Tùy chọn nén
 * @param {number} options.maxWidth - Chiều rộng tối đa (mặc định 1920)
 * @param {number} options.maxHeight - Chiều cao tối đa (mặc định 1920)
 * @param {number} options.quality - Chất lượng WebP từ 0 đến 1 (mặc định 0.82)
 * @returns {Promise<File|Blob>} File WebP đã nén
 */
export async function compressImageToWebP(file, { maxWidth = 1920, maxHeight = 1920, quality = 0.82 } = {}) {
  if (!file || typeof window === 'undefined') return file;

  // Giữ nguyên video, SVG hoặc GIF động
  const mimeType = file.type || '';
  if (
    mimeType.startsWith('video/') ||
    mimeType === 'image/svg+xml' ||
    mimeType === 'image/gif' ||
    mimeType === 'image/x-icon'
  ) {
    return file;
  }

  // Bỏ qua nếu không phải định dạng ảnh
  if (!mimeType.startsWith('image/') && file.name && !/\.(jpe?g|png|webp|bmp|heic|tiff?)$/i.test(file.name)) {
    return file;
  }

  try {
    let imgBitmap;
    let width = 0;
    let height = 0;

    // Ưu tiên dùng createImageBitmap vì xử lý nhanh và tự động xoay theo EXIF ảnh chụp điện thoại
    if (typeof window.createImageBitmap === 'function') {
      try {
        imgBitmap = await createImageBitmap(file);
        width = imgBitmap.width;
        height = imgBitmap.height;
      } catch (_) {
        imgBitmap = null;
      }
    }

    if (!imgBitmap) {
      // Fallback bằng HTMLImageElement
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(file);
        image.onload = () => {
          URL.revokeObjectURL(url);
          resolve(image);
        };
        image.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(e);
        };
        image.src = url;
      });
      width = img.naturalWidth || img.width;
      height = img.naturalHeight || img.height;
      imgBitmap = img;
    }

    if (!width || !height) return file;

    // Giảm kích thước nếu vượt quá maxWidth/maxHeight (giữ nguyên tỉ lệ)
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgBitmap, 0, 0, width, height);

    if (typeof imgBitmap.close === 'function') {
      imgBitmap.close();
    }

    // Xuất sang WebP
    let blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality);
    });

    // Nếu trình duyệt không hỗ trợ WebP export trong canvas, fallback sang JPEG
    if (!blob || blob.type !== 'image/webp') {
      blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', quality);
      });
    }

    if (!blob) return file;

    // Nếu file gốc đã là webp và file sau nén lại lớn hơn thì giữ nguyên gốc
    if (file.type === 'image/webp' && file.size && blob.size >= file.size) {
      return file;
    }

    const isWebP = blob.type === 'image/webp';
    const targetExt = isWebP ? 'webp' : 'jpg';
    const originalName = file.name || `image.${targetExt}`;
    const baseName = originalName.replace(/\.[^.]+$/, '');
    const finalFileName = `${baseName}.${targetExt}`;

    return new File([blob], finalFileName, {
      type: blob.type,
      lastModified: Date.now()
    });
  } catch (err) {
    console.warn('Lỗi nén ảnh sang WebP, giữ nguyên ảnh gốc:', err);
    return file;
  }
}

/**
 * Tải ảnh trực tiếp lên Supabase Storage bucket 'coffee2424-media'
 * Tự động nén và tối ưu sang định dạng WebP siêu nhẹ trước khi tải lên
 * @param {File|Blob} file - File hoặc Blob hình ảnh
 * @param {string} folder - Thư mục phân loại (dishes, promos, hero, banners, branches...)
 * @param {Object} options - Tùy chọn nén { maxWidth, maxHeight, quality, autoCompress }
 * @returns {Promise<string|null>} URL công khai của hình ảnh hoặc null nếu lỗi
 */
export async function uploadImageToSupabase(file, folder = 'general', options = {}) {
  if (!isSupabaseConfigured) return null;
  try {
    // 1. Tự động nén và tối ưu sang WebP
    let fileToUpload = file;
    if (options.autoCompress !== false) {
      fileToUpload = await compressImageToWebP(file, {
        maxWidth: options.maxWidth || 1920,
        maxHeight: options.maxHeight || 1920,
        quality: options.quality || 0.82
      });
    }

    // 2. Xác định phần mở rộng và Content-Type
    let ext = 'webp';
    let contentType = fileToUpload.type || 'image/webp';
    if (fileToUpload.name) {
      ext = fileToUpload.name.split('.').pop().toLowerCase();
    } else if (fileToUpload.type) {
      ext = fileToUpload.type.split('/')[1] || 'webp';
      if (ext === 'jpeg') ext = 'jpg';
    }

    const cleanName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // 3. Tải lên Supabase Storage
    const { error } = await supabase.storage
      .from('coffee2424-media')
      .upload(cleanName, fileToUpload, {
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
