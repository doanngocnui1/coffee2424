// Hệ thống Quản Lý Tài Khoản & Phân Quyền (RBAC) COFFEE 24/24

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
  { id: 'reviews', label: 'Đánh Giá Khách Hàng', group: 'Trang Chủ', desc: 'Kiểm duyệt & thêm đánh giá khách hàng' },
  { id: 'socialZalo', label: 'Mạng Xã Hội & Zalo OA', group: 'Trang Chủ', desc: 'Quản lý link Facebook, TikTok, Instagram, Threads, YouTube & Zalo OA' },
  { id: 'navigation', label: 'Menu & Liên Kết Web', group: 'Nội Dung', desc: 'Bật/tắt thanh menu và các trang độc lập' },
  { id: 'about', label: 'Trang Giới Thiệu', group: 'Nội Dung', desc: 'Chỉnh sửa câu chuyện thương hiệu & tiện nghi 24/7' },
  { id: 'articles', label: 'Bài Viết & Tối Ưu SEO', group: 'Nội Dung', desc: 'Viết, sửa, xóa bài viết cẩm nang & Google SEO' },
  { id: 'jobs', label: 'Tuyển Dụng Nhân Sự', group: 'Nội Dung', desc: 'Bật/tắt và quản lý 12 vị trí tuyển dụng' },
  { id: 'branches', label: 'Hotline & 2 Chi Nhánh', group: 'Nội Dung', desc: 'Cập nhật hotline, thông tin 413PHI & 96D5' },
  { id: 'users', label: 'Quản Lý Tài Khoản & Phân Quyền', group: 'Hệ Thống', desc: 'Tạo tài khoản mới, phân quyền truy cập' }
];

export const INITIAL_ACCOUNTS = [
  {
    id: 'admin-super',
    email: 'Admin.coffee2424@gmail.com',
    password: 'Coffee24/24@1',
    name: 'Tổng Quản Trị Hệ Thống',
    role: 'super_admin',
    roleName: 'Tổng Quản Trị (Toàn quyền)',
    permissions: ['all'],
    active: true,
    createdAt: '16/10/2026'
  },
  {
    id: 'account-content',
    email: 'marketing.coffee2424@gmail.com',
    password: 'Coffee24/24@1',
    name: 'Biên Tập Viên Marketing',
    role: 'marketing',
    roleName: 'Biên Tập & Marketing',
    permissions: ['homeSections', 'heroSlide', 'glassBg', 'newDishes', 'promotions', 'offerings', 'whatsNew', 'spaceAmenities', 'sideBanners', 'bannerSections', 'theme', 'reviews', 'socialZalo', 'about', 'articles'],
    active: true,
    createdAt: '16/10/2026'
  },
  {
    id: 'account-hr',
    email: 'tuyendung.coffee2424@gmail.com',
    password: 'Coffee24/24@1',
    name: 'Quản Lý Tuyển Dụng & Nhân Sự',
    role: 'hr',
    roleName: 'Phòng Nhân Sự',
    permissions: ['jobs'],
    active: true,
    createdAt: '16/10/2026'
  }
];

const STORAGE_KEY = 'coffee2424_accounts';
const CURRENT_USER_KEY = 'coffee2424_current_user';

export function getAccounts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Đảm bảo tài khoản admin gốc luôn tồn tại và chính xác
      const hasSuper = parsed.some(a => a.email.toLowerCase() === 'admin.coffee2424@gmail.com');
      if (!hasSuper) {
        parsed.unshift(INITIAL_ACCOUNTS[0]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error loading accounts:', e);
  }
  return INITIAL_ACCOUNTS;
}

export function saveAccounts(accounts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    window.dispatchEvent(new Event('accounts-updated'));
    return true;
  } catch (e) {
    console.error('Error saving accounts:', e);
    return false;
  }
}

const FAILED_ATTEMPTS_KEY = 'coffee2424_failed_attempts';
const LOCKOUT_KEY = 'coffee2424_lockout_until';

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
      // Khóa 60 giây nếu nhập sai 5 lần liên tiếp
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

export function loginUser(email, password) {
  // 1. Kiểm tra chống Brute-Force (Dò quét mật khẩu)
  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      message: `Hệ thống tạm khóa do nhập sai nhiều lần. Vui lòng chờ ${lockout.remainingSeconds} giây để thử lại.`
    };
  }

  const accounts = getAccounts();
  const trimmedEmail = (email || '').trim().toLowerCase();
  const trimmedPassword = (password || '').trim();

  if (!trimmedEmail || !trimmedPassword) {
    return { success: false, message: 'Vui lòng điền đầy đủ Email và Mật khẩu!' };
  }

  const matched = accounts.find(acc => 
    acc.email.toLowerCase() === trimmedEmail && 
    acc.password === trimmedPassword
  );

  if (!matched) {
    const attempts = recordFailedAttempt();
    const remaining = 5 - (attempts % 5);
    if (attempts >= 5) {
      return {
        success: false,
        message: 'Bạn đã nhập sai 5 lần. Hệ thống đã tạm khóa 60 giây vì lý do bảo mật!'
      };
    }
    return { 
      success: false, 
      message: `Thông tin đăng nhập không chính xác! (Còn ${remaining} lần thử)` 
    };
  }

  if (matched.active === false) {
    return { success: false, message: 'Tài khoản này đã bị tạm khóa bởi Tổng Quản Trị!' };
  }

  // 2. Đăng nhập thành công -> Xóa bộ đếm sai
  resetLoginAttempts();

  // 3. Bảo mật phiên đăng nhập: Loại bỏ hoàn toàn password khỏi dữ liệu lưu trữ session
  const safeSessionUser = {
    id: matched.id,
    email: matched.email,
    name: matched.name,
    role: matched.role,
    roleName: matched.roleName,
    permissions: matched.permissions,
    active: matched.active,
    loginAt: Date.now()
  };

  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeSessionUser));
    window.dispatchEvent(new Event('auth-changed'));
  } catch (e) {
    console.warn('Could not store session in localStorage:', e);
  }

  return { success: true, user: safeSessionUser };
}

export function logoutUser() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new Event('auth-changed'));
  } catch (e) {
    console.error('Error during logout:', e);
  }
}

export function hasPermission(user, permissionId) {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  if (!user.permissions || !Array.isArray(user.permissions)) return false;
  if (user.permissions.includes('all')) return true;
  if (user.permissions.includes(permissionId)) return true;
  // Backward compatibility: if user has whatsNew, grant newDishes and promotions
  if ((permissionId === 'newDishes' || permissionId === 'promotions') && user.permissions.includes('whatsNew')) {
    return true;
  }
  return false;
}
