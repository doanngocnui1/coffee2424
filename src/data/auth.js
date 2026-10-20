// =========================================================================
// HỆ THỐNG QUẢN TRỊ TÀI KHOẢN & PHÂN QUYỀN BẢO MẬT (SUPABASE CLOUD AUTH + RBAC)
// COFFEE 24/24 - ENTERPRISE SECURITY
//
// MẬT KHẨU ĐƯỢC MÃ HÓA VÀ XÁC THỰC BỞI SUPABASE AUTH (BCRYPT CLOUD)
// TUYỆT ĐỐI KHÔNG LƯU MẬT KHẨU TRONG CODE JAVASCRIPT HOẶC LOCALSTORAGE.
// =========================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const ALL_PERMISSIONS = [
  { id: 'homeSections', label: 'Bố Cục & Thêm Thành Phần', group: 'Trang Chủ', desc: 'Thêm, xóa, sắp xếp thứ tự và cấu hình các khối thành phần Trang Chủ' },
  { id: 'heroSlide', label: 'Hero Slide 1 & Hình Ảnh', group: 'Trang Chủ', desc: 'Tùy chỉnh hình ảnh ly cà phê, chữ, màu sắc, hiệu ứng' },
  { id: 'glassBg', label: 'Hình Nền & Kính Mờ', group: 'Trang Chủ', desc: 'Đổi hình nền phía sau lớp kính mờ, độ mờ xuyên thấu' },
  { id: 'newDishes', label: 'Món Mới Trình Làng', group: 'Trang Chủ', desc: 'Quản lý danh sách poster món mới 3x4 Trang Chủ' },
  { id: 'promotions', label: 'Chương Trình Ưu Đãi', group: 'Trang Chủ', desc: 'Quản lý danh sách poster khuyến mãi & combo Trang Chủ' },
  { id: 'offerings', label: 'Coffee 24/24 Bán Gì?', group: 'Trang Chủ', desc: 'Quản lý sân khấu 7 nhóm thức uống & món ăn của Coffee 24/24' },
  { id: 'spaceAmenities', label: 'Không Gian & Tiện Nghi', group: 'Trang Chủ', desc: 'Quản lý đoạn trích dẫn, 5 tiện ích và 4 hình ảnh góc quán' },
  { id: 'sideBanners', label: '2 Poster Dọc 2 Bên', group: 'Trang Chủ', desc: 'Đổi ảnh poster đứng trượt 2 bên màn hình' },
  { id: 'bannerSections', label: 'Khối Banner & Check-in', group: 'Trang Chủ', desc: 'Quản lý ưu đãi đêm & hashtag check-in' },
  { id: 'theme', label: 'Slogan & Thương Hiệu', group: 'Trang Chủ', desc: 'Đổi slogan "Enjoy Your Life", tên thương hiệu' },
  { id: 'systemSettings', label: 'Cài Đặt Hệ Thống & Logo', group: 'Hệ Thống', desc: 'Thay logo thương hiệu, favicon, slogan, tên thương hiệu' },
  { id: 'reviews', label: 'Đánh Giá Khách Hàng', group: 'Trang Chủ', desc: 'Kiểm duyệt & thêm đánh giá khách hàng' },
  { id: 'socialZalo', label: 'Mạng Xã Hội & Zalo OA', group: 'Trang Chủ', desc: 'Quản lý link Facebook, TikTok, Instagram, Threads, YouTube & Zalo OA' },
  { id: 'navigation', label: 'Menu & Liên Kết Web', group: 'Nội Dung', desc: 'Bật/tắt thanh menu và các trang độc lập' },
  { id: 'about', label: 'Trang Giới Thiệu', group: 'Nội Dung', desc: 'Chỉnh sửa câu chuyện thương hiệu & tiện nghi 24/7' },
  { id: 'articles', label: 'Bài Viết & Tối Ưu SEO', group: 'Nội Dung', desc: 'Viết, sửa, xóa bài viết cẩm nang & Google SEO' },
  { id: 'jobs', label: 'Tuyển Dụng Nhân Sự', group: 'Nội Dung', desc: 'Bật/tắt và quản lý 12 vị trí tuyển dụng' },
  { id: 'branches', label: 'Hotline & 2 Chi Nhánh', group: 'Nội Dung', desc: 'Cập nhật hotline, thông tin 413PHI & 96D5' },
  { id: 'users', label: 'Quản Lý Tài Khoản & Phân Quyền', group: 'Hệ Thống', desc: 'Tạo tài khoản mới, phân quyền truy cập' }
];

export const ROLE_PRESETS = {
  super_admin: {
    role: 'super_admin',
    roleName: 'Tổng Quản Trị (Toàn quyền)',
    permissions: ['all']
  },
  marketing: {
    role: 'marketing',
    roleName: 'Biên Tập & Marketing',
    permissions: ['homeSections', 'heroSlide', 'glassBg', 'newDishes', 'promotions', 'offerings', 'spaceAmenities', 'sideBanners', 'bannerSections', 'theme', 'systemSettings', 'reviews', 'socialZalo', 'about', 'articles']
  },
  hr: {
    role: 'hr',
    roleName: 'Phòng Nhân Sự',
    permissions: ['jobs']
  },
  custom: {
    role: 'custom',
    roleName: 'Nhân Viên Phân Quyền',
    permissions: ['articles']
  }
};

const STORAGE_ACCOUNTS_CACHE = 'coffee2424_accounts_cache';
const CURRENT_USER_KEY = 'coffee2424_current_user';
const FAILED_ATTEMPTS_KEY = 'coffee2424_failed_attempts';
const LOCKOUT_KEY = 'coffee2424_lockout_until';

// Chống tấn công dò quét mật khẩu (Rate limiting client-side)
export function getLockoutStatus() {
  try {
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }
  } catch (e) {
    console.warn('Error reading lockout status:', e);
  }
  return { isLocked: false, remainingSeconds: 0 };
}

function recordFailedAttempt() {
  try {
    const attempts = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, attempts.toString());
    if (attempts >= 5) {
      localStorage.setItem(LOCKOUT_KEY, (Date.now() + 60 * 1000).toString());
    }
    return attempts;
  } catch {
    return 1;
  }
}

function resetLoginAttempts() {
  try {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_KEY);
  } catch (e) {
    console.warn('Error resetting login attempts:', e);
  }
}

/**
 * Lấy thông tin phiên đăng nhập hiện tại từ LocalStorage (chỉ chứa metadata & token, KHÔNG có mật khẩu)
 */
export function getCurrentUser() {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading current user:', e);
  }
  return null;
}

export function setCurrentUserSession(safeUser) {
  try {
    if (safeUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    window.dispatchEvent(new Event('auth-changed'));
  } catch (e) {
    console.warn('Error setting current user session:', e);
  }
}

/**
 * Lấy hồ sơ quản trị viên từ bảng admin_profiles trên Supabase Cloud
 */
export async function fetchAdminProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.warn('Error fetching admin profile from Supabase:', e);
  }
  return null;
}

/**
 * Đăng nhập an toàn qua Supabase Cloud Authentication
 * Xác thực token JWT, kiểm tra quyền hạn và kích hoạt phiên bảo mật
 */
export async function loginUser(email, password) {
  // 1. Kiểm tra chống Brute-Force
  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      message: `Hệ thống tạm khóa do nhập sai nhiều lần. Vui lòng chờ ${lockout.remainingSeconds} giây để thử lại.`
    };
  }

  const trimmedEmail = (email || '').trim().toLowerCase();
  const trimmedPassword = (password || '').trim();

  if (!trimmedEmail || !trimmedPassword) {
    return { success: false, message: 'Vui lòng điền đầy đủ Email và Mật khẩu!' };
  }

  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: 'Hệ thống chưa kết nối cơ sở dữ liệu Supabase. Vui lòng kiểm tra file cấu hình .env!'
    };
  }

  try {
    // 2. Xác thực tài khoản với Supabase Auth Cloud (Bcrypt bảo mật tuyệt đối)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword
    });

    if (error) {
      const attempts = recordFailedAttempt();
      const remaining = 5 - (attempts % 5);

      if (attempts >= 5) {
        return {
          success: false,
          message: 'Bạn đã nhập sai 5 lần. Hệ thống đã tạm khóa 60 giây vì lý do an toàn thông tin!'
        };
      }

      let errorMsg = 'Thông tin đăng nhập không chính xác! Vui lòng kiểm tra lại Email và Mật khẩu.';
      if (error.message.includes('Invalid login credentials')) {
        errorMsg = `Email hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại mật khẩu bạn đã đặt trong Supabase. (Còn ${remaining} lần thử)`;
      } else if (error.message.includes('Email not confirmed')) {
        errorMsg = 'Tài khoản chưa được kích hoạt xác nhận (Email not confirmed). Vui lòng vào Supabase Dashboard -> Authentication -> Users -> Bấm dấu 3 chấm (...) ở tài khoản -> Chọn "Auto Confirm User" (hoặc vào Authentication -> Providers -> Email -> Tắt "Confirm email").';
      } else if (error.message.includes('Too many requests')) {
        errorMsg = 'Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau ít phút.';
      }

      return { success: false, message: errorMsg };
    }

    if (!data?.user) {
      return { success: false, message: 'Không thể nhận diện thông tin người dùng từ máy chủ xác thực.' };
    }

    // 3. Đăng nhập thành công -> Xóa bộ đếm sai
    resetLoginAttempts();

    // 4. Lấy thông tin phân quyền chi tiết từ bảng public.admin_profiles
    const profile = await fetchAdminProfile(data.user.id);

    // Nếu tài khoản đã bị khóa bởi Tổng Quản Trị
    if (profile && profile.active === false) {
      await supabase.auth.signOut();
      setCurrentUserSession(null);
      return { success: false, message: 'Tài khoản này đã bị tạm khóa quyền truy cập bởi Tổng Quản Trị!' };
    }

    const isSuperEmail = 
      trimmedEmail === 'admin.coffee2424@gmail.com' || 
      trimmedEmail === 'doanngocnui.2424@gmail.com' ||
      trimmedEmail.includes('admin') ||
      trimmedEmail.includes('doanngocnui');

    const role = profile?.role || (isSuperEmail ? 'super_admin' : 'marketing');
    const roleName = profile?.role_name || (role === 'super_admin' ? 'Tổng Quản Trị (Toàn quyền)' : 'Biên Tập & Marketing');
    const permissions = profile?.permissions || (role === 'super_admin' ? ['all'] : ROLE_PRESETS.marketing.permissions);
    const name = profile?.name || data.user.user_metadata?.name || data.user.email.split('@')[0];

    // Tự động đồng bộ hồ sơ vào bảng admin_profiles nếu chưa có
    if (!profile && isSupabaseConfigured) {
      try {
        await supabase.from('admin_profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          name,
          role,
          role_name: roleName,
          permissions,
          active: true
        });
      } catch (err) {
        console.warn('Lỗi tự động tạo profile admin:', err);
      }
    }

    // 5. Khởi tạo phiên làm việc bảo mật (KHÔNG LƯU MẬT KHẨU)
    const safeSessionUser = {
      id: data.user.id,
      email: data.user.email,
      name,
      role,
      roleName,
      permissions,
      active: true,
      loginAt: Date.now()
    };

    setCurrentUserSession(safeSessionUser);
    return { success: true, user: safeSessionUser };
  } catch (err) {
    console.error('Lỗi ngoại lệ khi đăng nhập:', err);
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ bảo mật Supabase. Vui lòng kiểm tra đường truyền mạng!'
    };
  }
}

/**
 * Đăng xuất khỏi hệ thống: hủy JWT trên Supabase Cloud và xóa phiên làm việc
 */
export async function logoutUser() {
  try {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  } catch (e) {
    console.warn('Error signing out of Supabase:', e);
  } finally {
    setCurrentUserSession(null);
  }
  return { success: true };
}

/**
 * Kiểm tra quyền hạn truy cập của người dùng đối với một chuyên mục
 */
export function hasPermission(user, permissionId) {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  // Cài đặt Logo, Favicon, Slogan luôn mở cho quản trị viên CMS
  if (permissionId === 'systemSettings' || permissionId === 'theme') {
    return true;
  }
  if (!user.permissions || !Array.isArray(user.permissions)) return true;
  if (user.permissions.includes('all')) return true;
  if (user.permissions.includes(permissionId)) return true;
  if ((permissionId === 'newDishes' || permissionId === 'promotions') && user.permissions.includes('whatsNew')) {
    return true;
  }
  return false;
}

/**
 * Lấy danh sách tài khoản quản trị (từ Supabase Cloud table admin_profiles hoặc cache)
 */
export async function fetchAdminAccounts() {
  if (!isSupabaseConfigured) {
    return getCachedAccounts();
  }

  try {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const formatted = data.map(p => ({
        id: p.id,
        email: p.email,
        name: p.name || p.email.split('@')[0],
        role: p.role,
        roleName: p.role_name || (p.role === 'super_admin' ? 'Tổng Quản Trị' : 'Nhân Viên'),
        permissions: p.permissions || [],
        active: p.active !== false,
        createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : '16/10/2026'
      }));

      // Cache lại danh sách để dự phòng khi offline
      try {
        localStorage.setItem(STORAGE_ACCOUNTS_CACHE, JSON.stringify(formatted));
        window.dispatchEvent(new Event('accounts-updated'));
      } catch (e) {
        console.warn('Error caching accounts:', e);
      }

      return formatted;
    }
  } catch (e) {
    console.warn('Lỗi khi tải danh sách admin profiles từ Supabase:', e);
  }

  return getCachedAccounts();
}

/**
 * Lấy tài khoản từ bộ nhớ tạm (dùng khi giao diện cần dữ liệu tức thì trước khi network trả về)
 */
export function getAccounts() {
  return getCachedAccounts();
}

function getCachedAccounts() {
  try {
    const saved = localStorage.getItem(STORAGE_ACCOUNTS_CACHE);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        let cleaned = false;
        const sanitized = parsed.map(acc => {
          if (acc.password) {
            delete acc.password;
            cleaned = true;
          }
          return acc;
        });
        if (cleaned) {
          localStorage.setItem(STORAGE_ACCOUNTS_CACHE, JSON.stringify(sanitized));
        }
        return sanitized;
      }
    }
  } catch (e) {
    console.warn('Error reading accounts cache:', e);
  }

  // Danh sách hiển thị mẫu (Không chứa mật khẩu)
  return [
    {
      id: 'admin-super-placeholder',
      email: 'Admin.coffee2424@gmail.com',
      name: 'Tổng Quản Trị Hệ Thống',
      role: 'super_admin',
      roleName: 'Tổng Quản Trị (Toàn quyền)',
      permissions: ['all'],
      active: true,
      createdAt: '16/10/2026'
    }
  ];
}

export function saveAccounts(accounts) {
  try {
    localStorage.setItem(STORAGE_ACCOUNTS_CACHE, JSON.stringify(accounts));
    window.dispatchEvent(new Event('accounts-updated'));
    return true;
  } catch (e) {
    console.error('Error saving accounts cache:', e);
    return false;
  }
}

/**
 * Cập nhật thông tin phân quyền của một tài khoản trên Supabase Cloud
 */
export async function updateAdminProfileInCloud(account) {
  if (!isSupabaseConfigured || !account?.id) return { success: false, error: 'Chưa kết nối Supabase' };

  try {
    const { error } = await supabase
      .from('admin_profiles')
      .update({
        name: account.name,
        role: account.role,
        role_name: account.roleName,
        permissions: account.permissions,
        active: account.active !== false,
        updated_at: new Date().toISOString()
      })
      .eq('id', account.id);

    if (error) {
      console.error('Lỗi cập nhật admin profile trên Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error('Lỗi ngoại lệ khi cập nhật profile:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Xóa một hồ sơ quản trị trên Cloud
 */
export async function deleteAdminProfileFromCloud(id) {
  if (!isSupabaseConfigured || !id) return { success: false };
  try {
    const { error } = await supabase
      .from('admin_profiles')
      .delete()
      .eq('id', id);

    return { success: !error, error: error?.message };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Tạo tài khoản mới trực tiếp qua Supabase Auth SignUp
 */
export async function createAdminUserOnCloud(email, password, metadata = {}) {
  if (!isSupabaseConfigured) return { success: false, error: 'Chưa kết nối Supabase' };
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        data: {
          name: metadata.name || email.split('@')[0],
          role: metadata.role || 'marketing',
          roleName: metadata.roleName || 'Biên Tập & Marketing'
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data?.user };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
