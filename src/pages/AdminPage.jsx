import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Palette, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Globe, 
  Eye, 
  Sparkles, 
  Layers,
  ArrowLeft,
  RefreshCw,
  Layout,
  Megaphone,
  Compass,
  PhoneCall,
  Check,
  Sliders,
  Image as ImageIcon,
  Upload,
  Type,
  Briefcase,
  XCircle,
  Star,
  Menu,
  X,
  Home,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Users,
  Lock,
  LogOut,
  UserPlus,
  ShieldCheck,
  EyeOff,
  Key,
  Shield,
  Share2,
  Flame,
  Quote,
  RotateCcw,
  MessageSquare,
  Heart,
  Armchair,
  UtensilsCrossed,
  Percent
} from 'lucide-react';
import SocialFollowSection, { BrandIcons } from '../components/SocialFollowSection';
import { INITIAL_ARTICLES } from '../data/articles';
import { getBranches, saveBranches } from '../data/branches';
import { getSiteConfig, saveSiteConfig } from '../data/siteConfig';
import { getJobs, saveJobs } from '../data/jobs';
import { getReviews, saveReviews, DEFAULT_REVIEWS } from '../data/reviews';
import { 
  getAccounts, 
  saveAccounts, 
  getCurrentUser, 
  loginUser, 
  logoutUser, 
  hasPermission, 
  ALL_PERMISSIONS 
} from '../data/auth';
import AdminHeroSlideManager from '../components/admin/AdminHeroSlideManager';
import AdminGlassBackgroundManager from '../components/admin/AdminGlassBackgroundManager';
import AdminWhatsNewManager from '../components/admin/AdminWhatsNewManager';
import AdminNewDishesManager from '../components/admin/AdminNewDishesManager';
import AdminPromotionsManager from '../components/admin/AdminPromotionsManager';
import AdminSpaceAmenitiesManager from '../components/admin/AdminSpaceAmenitiesManager';
import AdminReviewsHeaderCard from '../components/admin/AdminReviewsHeaderCard';

export default function AdminPage({ navigate }) {
  const [activeTab, setActiveTab] = useState('sideBanners');
  const [saveAlert, setSaveAlert] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Accounts & RBAC state
  const [accountsList, setAccountsList] = useState(getAccounts);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [accountPasswordVisible, setAccountPasswordVisible] = useState(false);

  // Accordion open/close state for Sidebar Page Groups
  const [openGroups, setOpenGroups] = useState({
    home: true, // Trang Chủ is open initially
    about: false,
    articles: false,
    jobs: false,
    branches: false,
    navigation: false,
    users: false
  });

  // Automatically expand group containing activeTab when activeTab changes
  useEffect(() => {
    if (['heroSlide', 'glassBg', 'newDishes', 'promotions', 'whatsNew', 'spaceAmenities', 'sideBanners', 'bannerSections', 'theme', 'reviews', 'socialZalo'].includes(activeTab)) {
      setOpenGroups(prev => ({ ...prev, home: true }));
    } else if (activeTab === 'about') {
      setOpenGroups(prev => ({ ...prev, about: true }));
    } else if (activeTab === 'articles') {
      setOpenGroups(prev => ({ ...prev, articles: true }));
    } else if (activeTab === 'jobs') {
      setOpenGroups(prev => ({ ...prev, jobs: true }));
    } else if (activeTab === 'branches') {
      setOpenGroups(prev => ({ ...prev, branches: true }));
    } else if (activeTab === 'navigation') {
      setOpenGroups(prev => ({ ...prev, navigation: true }));
    } else if (activeTab === 'users') {
      setOpenGroups(prev => ({ ...prev, users: true }));
    }
  }, [activeTab]);

  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const scrollToAnchor = (anchorId) => {
    setTimeout(() => {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Sync auth and accounts state
  useEffect(() => {
    const handleAuthChange = () => setCurrentUser(getCurrentUser());
    const handleAccountsUpdate = () => setAccountsList(getAccounts());
    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('accounts-updated', handleAccountsUpdate);
    window.addEventListener('storage', handleAccountsUpdate);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('accounts-updated', handleAccountsUpdate);
      window.removeEventListener('storage', handleAccountsUpdate);
    };
  }, []);

  // Ensure activeTab is permitted for currentUser
  useEffect(() => {
    if (currentUser && !hasPermission(currentUser, activeTab)) {
      const allTabs = ['heroSlide', 'glassBg', 'newDishes', 'promotions', 'whatsNew', 'spaceAmenities', 'sideBanners', 'bannerSections', 'theme', 'reviews', 'socialZalo', 'navigation', 'about', 'articles', 'jobs', 'branches', 'users'];
      const firstAllowed = allTabs.find(tab => hasPermission(currentUser, tab));
      if (firstAllowed) setActiveTab(firstAllowed);
    }
  }, [currentUser, activeTab]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const res = loginUser(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setCurrentUser(res.user);
      setLoginError('');
      triggerAlert(`Xin chào ${res.user.name || res.user.email}! Đăng nhập thành công.`);
    }
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!editingAccount.email || !editingAccount.password) {
      alert('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }

    let updated;
    if (isNewAccount) {
      if (accountsList.some(a => a.email.toLowerCase() === editingAccount.email.trim().toLowerCase())) {
        alert('Email này đã được sử dụng cho một tài khoản khác!');
        return;
      }
      const newAcc = {
        ...editingAccount,
        id: 'acc-' + Date.now(),
        createdAt: new Date().toLocaleDateString('vi-VN'),
        active: editingAccount.active !== false
      };
      updated = [newAcc, ...accountsList];
    } else {
      updated = accountsList.map(a => a.id === editingAccount.id ? editingAccount : a);
    }

    setAccountsList(updated);
    saveAccounts(updated);
    setEditingAccount(null);
    triggerAlert('Đã lưu tài khoản nhân sự thành công!');
  };

  const handleDeleteAccount = (accId) => {
    const target = accountsList.find(a => a.id === accId);
    if (target?.id === 'admin-super' || target?.email.toLowerCase() === 'admin.coffee2424@gmail.com') {
      alert('Không thể xóa tài khoản Tổng Quản Trị mặc định!');
      return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${target?.name || target?.email}" không?`)) {
      const updated = accountsList.filter(a => a.id !== accId);
      setAccountsList(updated);
      saveAccounts(updated);
      triggerAlert('Đã xóa tài khoản.');
    }
  };

  const handleToggleAccountActive = (accId) => {
    const target = accountsList.find(a => a.id === accId);
    if (target?.id === 'admin-super' || target?.email.toLowerCase() === 'admin.coffee2424@gmail.com') {
      alert('Không thể khóa tài khoản Tổng Quản Trị mặc định!');
      return;
    }
    const updated = accountsList.map(a => {
      if (a.id === accId) {
        return { ...a, active: a.active === false ? true : false };
      }
      return a;
    });
    setAccountsList(updated);
    saveAccounts(updated);
    triggerAlert('Đã cập nhật trạng thái tài khoản.');
  };

  // Articles state
  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('coffee2424_articles');
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  // Editor modal state for articles
  const [editingArticle, setEditingArticle] = useState(null);
  const [isNewPost, setIsNewPost] = useState(false);

  // Site theme & config state
  const [config, setConfig] = useState(getSiteConfig);

  // Branches state
  const [branchesList, setBranchesList] = useState(getBranches);

  // Jobs state (12 vị trí tuyển dụng)
  const [jobsList, setJobsList] = useState(getJobs);
  const [editingJob, setEditingJob] = useState(null);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobFilterDept, setJobFilterDept] = useState('ALL');
  const [jobFilterStatus, setJobFilterStatus] = useState('ALL');

  // Reviews state (Đánh giá khách hàng)
  const [reviewsList, setReviewsList] = useState(getReviews);
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [reviewFilterStatus, setReviewFilterStatus] = useState('ALL');
  const [reviewFilterRating, setReviewFilterRating] = useState('ALL');
  const [reviewFilterBranch, setReviewFilterBranch] = useState('ALL');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null); // null = thêm mới, string = sửa
  const [reviewFormData, setReviewFormData] = useState({
    author: '',
    role: 'Khách hàng thân thiết',
    rating: 5,
    branch: 'Chi nhánh 96 D5, Bình Thạnh',
    favoriteItem: 'Cold Brew Cam Vàng & Croissant bơ tỏi',
    content: '',
    avatar: '',
    date: 'Hôm nay',
    verified: true,
    active: true
  });

  // Save articles helper
  const handleSaveArticle = (e) => {
    e.preventDefault();
    let updated;
    if (isNewPost) {
      const newPost = {
        ...editingArticle,
        id: Date.now(),
        date: new Date().toLocaleDateString('vi-VN'),
        views: 0
      };
      updated = [newPost, ...articles];
    } else {
      updated = articles.map(a => a.id === editingArticle.id ? editingArticle : a);
    }
    setArticles(updated);
    localStorage.setItem('coffee2424_articles', JSON.stringify(updated));
    setEditingArticle(null);
    triggerAlert('Đã lưu bài viết thành công!');
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này không?')) {
      const updated = articles.filter(a => a.id !== id);
      setArticles(updated);
      localStorage.setItem('coffee2424_articles', JSON.stringify(updated));
      triggerAlert('Đã xóa bài viết.');
    }
  };

  // Save site configuration
  const handleSaveConfig = (e) => {
    if (e) e.preventDefault();
    saveSiteConfig(config);
    triggerAlert('Đã lưu cấu hình website thành công!');
  };

  const updateAboutField = (field, val) => {
    setConfig(prev => ({
      ...prev,
      aboutPage: {
        ...(prev.aboutPage || {}),
        [field]: val
      }
    }));
  };

  const updateAboutMission = (index, field, val) => {
    setConfig(prev => {
      const missions = [...(prev.aboutPage?.missions || [])];
      if (missions[index]) {
        missions[index] = { ...missions[index], [field]: val };
      }
      return {
        ...prev,
        aboutPage: {
          ...(prev.aboutPage || {}),
          missions
        }
      };
    });
  };

  const updateAboutAmenity = (index, field, val) => {
    setConfig(prev => {
      const amenities = [...(prev.aboutPage?.amenities || [])];
      if (amenities[index]) {
        amenities[index] = { ...amenities[index], [field]: val };
      }
      return {
        ...prev,
        aboutPage: {
          ...(prev.aboutPage || {}),
          amenities
        }
      };
    });
  };

  const togglePermission = (permId) => {
    if (!editingAccount) return;
    const current = editingAccount.permissions || [];
    let updated;
    if (current.includes(permId)) {
      updated = current.filter(p => p !== permId);
    } else {
      updated = [...current, permId];
    }
    setEditingAccount({ ...editingAccount, permissions: updated });
  };

  // Save branches helper
  const handleSaveBranches = () => {
    saveBranches(branchesList);
    // Also sync the hotlines into siteConfig
    const phiBranch = branchesList.find(b => b.code === '413PHI');
    const d5Branch = branchesList.find(b => b.code === '96D5');
    const updatedConfig = {
      ...config,
      hotlinePHI: phiBranch ? phiBranch.hotline : config.hotlinePHI,
      hotlineD5: d5Branch ? d5Branch.hotline : config.hotlineD5
    };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
    triggerAlert('Đã lưu thông tin 2 chi nhánh & Hotline thành công!');
  };

  const triggerAlert = (msg) => {
    setSaveAlert(msg);
    setTimeout(() => setSaveAlert(null), 3000);
  };

  // Lắng nghe sự kiện đồng bộ dữ liệu tuyển dụng
  useEffect(() => {
    const handleSyncJobs = () => {
      setJobsList(getJobs());
    };
    window.addEventListener('jobs-updated', handleSyncJobs);
    window.addEventListener('storage', handleSyncJobs);
    return () => {
      window.removeEventListener('jobs-updated', handleSyncJobs);
      window.removeEventListener('storage', handleSyncJobs);
    };
  }, []);

  // Helper Bật / Tắt 1 vị trí tuyển dụng
  const handleToggleJobActive = (jobId) => {
    const target = jobsList.find(j => j.id === jobId);
    const newStatus = target ? target.active === false : false;
    const updated = jobsList.map(job => {
      if (job.id === jobId) {
        return { ...job, active: newStatus };
      }
      return job;
    });
    setJobsList(updated);
    saveJobs(updated);
    triggerAlert(`Đã ${newStatus ? 'BẬT MỞ TUYỂN' : 'TẠM DỪNG TUYỂN'} vị trí: "${target?.title}"!`);
  };

  // Helper Bật / Tắt toàn bộ 12 vị trí tuyển dụng
  const handleToggleAllJobs = (setActive) => {
    const updated = jobsList.map(job => ({ ...job, active: setActive }));
    setJobsList(updated);
    saveJobs(updated);
    triggerAlert(`Đã ${setActive ? 'BẬT MỞ TUYỂN TẤT CẢ' : 'TẠM DỪNG TUYỂN TẤT CẢ'} 12 vị trí!`);
  };

  // Helper Lưu chỉnh sửa chi tiết 1 vị trí tuyển dụng
  const handleSaveEditJob = (e) => {
    e.preventDefault();
    if (!editingJob) return;
    const updated = jobsList.map(job => job.id === editingJob.id ? editingJob : job);
    setJobsList(updated);
    saveJobs(updated);
    setEditingJob(null);
    triggerAlert(`Đã cập nhật thông tin vị trí "${editingJob.title}" thành công!`);
  };

  // Lắng nghe sự kiện đồng bộ dữ liệu đánh giá khách hàng
  useEffect(() => {
    const handleSyncReviews = () => {
      setReviewsList(getReviews());
    };
    window.addEventListener('reviews-updated', handleSyncReviews);
    window.addEventListener('storage', handleSyncReviews);
    return () => {
      window.removeEventListener('reviews-updated', handleSyncReviews);
      window.removeEventListener('storage', handleSyncReviews);
    };
  }, []);

  // Helper Bật / Tắt 1 đánh giá của khách hàng
  const handleToggleReviewActive = (reviewId) => {
    const target = reviewsList.find(r => r.id === reviewId);
    const newStatus = target ? target.active === false : false;
    const updated = reviewsList.map(r => {
      if (r.id === reviewId) {
        return { ...r, active: newStatus };
      }
      return r;
    });
    setReviewsList(updated);
    saveReviews(updated);
    triggerAlert(`Đã ${newStatus ? 'BẬT HIỂN THỊ' : 'ẨN'} đánh giá của "${target?.author}"!`);
  };

  // Helper Xóa 1 đánh giá của khách hàng
  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này không?')) {
      const updated = reviewsList.filter(r => r.id !== reviewId);
      setReviewsList(updated);
      saveReviews(updated);
      triggerAlert('Đã xóa đánh giá thành công.');
    }
  };

  // Helper Mở modal Thêm đánh giá mới
  const handleOpenAddReview = () => {
    setEditingReviewId(null);
    setReviewFormData({
      author: '',
      role: 'Khách hàng thân thiết',
      rating: 5,
      branch: 'Chi nhánh 96 D5, Bình Thạnh',
      favoriteItem: 'Cold Brew Cam Vàng & Croissant bơ tỏi',
      content: '',
      avatar: '',
      date: 'Hôm nay',
      verified: true,
      active: true
    });
    setIsReviewModalOpen(true);
  };

  // Helper Mở modal Chỉnh sửa đánh giá hiện có
  const handleOpenEditReview = (rev) => {
    setEditingReviewId(rev.id);
    setReviewFormData({
      author: rev.author || '',
      role: rev.role || 'Khách hàng',
      rating: Number(rev.rating) || 5,
      branch: rev.branch || 'Chi nhánh 96 D5, Bình Thạnh',
      favoriteItem: rev.favoriteItem || '',
      content: rev.content || '',
      avatar: rev.avatar || '',
      date: rev.date || 'Hôm nay',
      verified: rev.verified !== false,
      active: rev.active !== false
    });
    setIsReviewModalOpen(true);
  };

  // Helper Lưu form Thêm / Sửa đánh giá
  const handleSaveReviewForm = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!reviewFormData.author.trim()) {
      alert('Vui lòng nhập họ tên khách hàng!');
      return;
    }
    if (!reviewFormData.content.trim()) {
      alert('Vui lòng nhập nội dung đánh giá!');
      return;
    }

    let updated;
    const authorName = reviewFormData.author.trim();
    if (editingReviewId) {
      updated = reviewsList.map(r => {
        if (r.id === editingReviewId) {
          return {
            ...r,
            ...reviewFormData,
            author: authorName,
            initial: authorName.charAt(0).toUpperCase(),
            rating: Number(reviewFormData.rating) || 5
          };
        }
        return r;
      });
      triggerAlert(`✓ Đã cập nhật đánh giá của "${authorName}"!`);
    } else {
      const newReview = {
        id: 'rev-' + Date.now(),
        ...reviewFormData,
        author: authorName,
        initial: authorName.charAt(0).toUpperCase(),
        rating: Number(reviewFormData.rating) || 5
      };
      updated = [newReview, ...reviewsList];
      triggerAlert(`✓ Đã thêm đánh giá mới của "${authorName}" thành công!`);
    }

    setReviewsList(updated);
    saveReviews(updated);
    setIsReviewModalOpen(false);
  };

  // Helper Tải avatar khách hàng từ máy và nén nhẹ
  const handleUploadReviewAvatar = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const raw = loadEvt.target.result;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 160;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        setReviewFormData(prev => ({ ...prev, avatar: compressed }));
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  };

  // Helper Khôi phục danh sách đánh giá mặc định
  const handleResetDefaultReviews = () => {
    if (window.confirm('Khôi phục danh sách đánh giá mẫu ban đầu (6 đánh giá 5 sao chuẩn)? Mọi thay đổi tùy chỉnh sẽ được đặt lại.')) {
      setReviewsList(DEFAULT_REVIEWS);
      saveReviews(DEFAULT_REVIEWS);
      triggerAlert('Đã khôi phục 6 đánh giá khách hàng mặc định ban đầu!');
    }
  };

  // Helper nén tự động và tải ảnh poster từ máy tính
  const handleUploadBannerImage = (side, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP, GIF...)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        // Tối ưu hóa kích thước poster đứng 9:21 (chuẩn max 600x1400px, dung lượng ~80-120KB)
        const maxW = 600;
        const maxH = 1400;
        let w = img.width;
        let h = img.height;
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);

        const updatedConfig = {
          ...config,
          sideBanners: {
            ...config.sideBanners,
            [side]: {
              ...config.sideBanners?.[side],
              image: compressedDataUrl
            }
          }
        };

        setConfig(updatedConfig);
        const ok = saveSiteConfig(updatedConfig);
        if (ok) {
          triggerAlert(`✓ Đã đổi ảnh poster bên ${side === 'left' ? 'Trái' : 'Phải'} thành công! Trang chủ và các trang ngoài đã tự động cập nhật ngay.`);
        } else {
          alert('Không thể lưu ảnh vào bộ nhớ trình duyệt. Vui lòng chọn ảnh có kích thước nhẹ hơn.');
        }
      };
      img.onerror = () => {
        alert('Không thể đọc file ảnh này. Vui lòng thử chọn file ảnh khác.');
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Helper nén tự động và tải ảnh poster dọc 3x4 Trang Chủ từ máy tính
  const handleUploadHomePoster = (index, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP, GIF...)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        // Tối ưu hóa kích thước poster dọc 3:4 (chuẩn max 600x800px, dung lượng ~80-120KB)
        const maxW = 600;
        const maxH = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);

        const currentPosters = config.homePosters && config.homePosters.length > 0 
          ? [...config.homePosters] 
          : [
              { id: 'poster-1', tag: 'MÓN MỚI', title: 'Matcha MK4 Latte & Cold Brew Cam Vàng', discount: 'GIẢM 20%', image: '/images/promo_banner.jpg', cta: 'Thử Món Mới', link: '/dathang' },
              { id: 'poster-2', tag: 'COMBO HOT', title: 'Combo Sáng & Đêm Khuya 69K', discount: 'CHỈ 69.000đ', image: '/images/signature_drinks.jpg', cta: 'Đặt Combo 69K', link: '/dathang' },
              { id: 'poster-3', tag: 'GIỜ VÀNG', title: 'Happy Hour 16:00 - 19:00 Mỗi Ngày', discount: 'GIẢM 40%', image: '/images/journey_espresso.jpg', cta: 'Lấy Mã Giảm', link: '/khuyenmai' }
            ];

        if (!currentPosters[index]) {
          currentPosters[index] = { id: `poster-${index + 1}` };
        }
        currentPosters[index] = {
          ...currentPosters[index],
          image: compressedDataUrl
        };

        const updatedConfig = {
          ...config,
          homePosters: currentPosters
        };

        setConfig(updatedConfig);
        const ok = saveSiteConfig(updatedConfig);
        if (ok) {
          triggerAlert(`✓ Đã đổi ảnh poster 3x4 số ${index + 1} thành công! Trang chủ đã tự động cập nhật.`);
        } else {
          alert('Không thể lưu ảnh vào bộ nhớ trình duyệt. Vui lòng chọn ảnh có kích thước nhẹ hơn.');
        }
      };
      img.onerror = () => {
        alert('Không thể đọc file ảnh này. Vui lòng thử chọn file ảnh khác.');
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateHomePoster = (index, field, value) => {
    const currentPosters = config.homePosters && config.homePosters.length > 0 
      ? [...config.homePosters] 
      : [
          { id: 'poster-1', tag: 'MÓN MỚI', title: 'Matcha MK4 Latte & Cold Brew Cam Vàng', discount: 'GIẢM 20%', image: '/images/promo_banner.jpg', cta: 'Thử Món Mới', link: '/dathang' },
          { id: 'poster-2', tag: 'COMBO HOT', title: 'Combo Sáng & Đêm Khuya 69K', discount: 'CHỈ 69.000đ', image: '/images/signature_drinks.jpg', cta: 'Đặt Combo 69K', link: '/dathang' },
          { id: 'poster-3', tag: 'GIỜ VÀNG', title: 'Happy Hour 16:00 - 19:00 Mỗi Ngày', discount: 'GIẢM 40%', image: '/images/journey_espresso.jpg', cta: 'Lấy Mã Giảm', link: '/khuyenmai' }
        ];

    if (!currentPosters[index]) {
      currentPosters[index] = { id: `poster-${index + 1}` };
    }
    currentPosters[index] = {
      ...currentPosters[index],
      [field]: value
    };

    const updatedConfig = {
      ...config,
      homePosters: currentPosters
    };

    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
  };

  // Helper bật/tắt hiển thị từng trường chữ (showBadge, showTitle, showSubtitle, showDesc)
  const handleToggleBannerField = (side, fieldKey) => {
    const currentVal = !!config.sideBanners?.[side]?.[fieldKey];
    const updatedConfig = {
      ...config,
      sideBanners: {
        ...config.sideBanners,
        [side]: {
          ...config.sideBanners?.[side],
          [fieldKey]: !currentVal
        }
      }
    };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
    const fieldLabels = {
      showBadge: 'Huy hiệu (Badge)',
      showTitle: 'Tiêu đề lớn',
      showSubtitle: 'Tên món / Phụ đề',
      showDesc: 'Mô tả ngắn'
    };
    triggerAlert(`Đã ${!currentVal ? 'BẬT' : 'TẮT'} hiển thị "${fieldLabels[fieldKey] || fieldKey}" trên poster bên ${side === 'left' ? 'Trái' : 'Phải'}!`);
  };

  // Helper bật hoặc tắt toàn bộ chữ trên poster cùng lúc
  const handleToggleAllTextFields = (side, enable) => {
    const updatedConfig = {
      ...config,
      sideBanners: {
        ...config.sideBanners,
        [side]: {
          ...config.sideBanners?.[side],
          showBadge: enable,
          showTitle: enable,
          showSubtitle: enable,
          showDesc: enable
        }
      }
    };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
    triggerAlert(`Đã ${enable ? 'BẬT tất cả chữ' : 'TẮT toàn bộ chữ (Chỉ hiển thị ảnh poster thuần túy)'} cho poster bên ${side === 'left' ? 'Trái' : 'Phải'}!`);
  };

  // Helper cập nhật nội dung text của poster
  const handleUpdateBannerField = (side, fieldKey, val) => {
    const updatedConfig = {
      ...config,
      sideBanners: {
        ...config.sideBanners,
        [side]: {
          ...config.sideBanners?.[side],
          [fieldKey]: val
        }
      }
    };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
  };

  // Helper bật/tắt hiển thị trường của Bonus Banner (Ưu Đãi Đêm)
  const handleToggleBonusField = (fieldKey) => {
    const currentVal = config.bonusPromoBanner?.[fieldKey] !== false;
    const updatedConfig = {
      ...config,
      bonusPromoBanner: {
        ...config.bonusPromoBanner,
        [fieldKey]: !currentVal
      }
    };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
    const labels = {
      enabled: 'Toàn bộ Banner Ưu Đãi Đêm',
      showBadge: 'Huy hiệu (Badge)',
      showTitle: 'Tiêu đề lớn',
      showDesc: 'Mô tả chi tiết',
      showButton: 'Nút bấm hành động'
    };
    triggerAlert(`Đã ${!currentVal ? 'BẬT' : 'TẮT'} hiển thị "${labels[fieldKey] || fieldKey}" trên banner!`);
  };

  // Helper cập nhật text của Bonus Banner
  const handleUpdateBonusField = (fieldKey, val) => {
    const updatedConfig = {
      ...config,
      bonusPromoBanner: {
        ...config.bonusPromoBanner,
        [fieldKey]: val
      }
    };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
  };

  // Helper bật/tắt hiển thị trường của Check-in Hashtag Banner
  const handleToggleCheckinField = (fieldKey) => {
    const currentVal = config.checkinHashtagBanner?.[fieldKey] !== false;
    const updatedConfig = {
      ...config,
      checkinHashtagBanner: {
        ...config.checkinHashtagBanner,
        [fieldKey]: !currentVal
      }
    };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
    const labels = {
      enabled: 'Toàn bộ Khối Check-in',
      showTitle: 'Tiêu đề',
      showDesc: 'Mô tả ưu đãi',
      showHashtags: 'Cụm thẻ Hashtag'
    };
    triggerAlert(`Đã ${!currentVal ? 'BẬT' : 'TẮT'} hiển thị "${labels[fieldKey] || fieldKey}" trên khối Check-in!`);
  };

  // Helper cập nhật text của Check-in Hashtag Banner
  const handleUpdateCheckinField = (fieldKey, val) => {
    const updatedConfig = {
      ...config,
      checkinHashtagBanner: {
        ...config.checkinHashtagBanner,
        [fieldKey]: val
      }
    };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
  };

  // Helper update Zalo OA fields
  const handleUpdateZaloOA = (field, val) => {
    const updated = {
      ...config,
      zaloOA: {
        ...(config.zaloOA || {}),
        [field]: val
      }
    };
    setConfig(updated);
    saveSiteConfig(updated);
  };

  // Helper upload custom Zalo QR code
  const handleZaloQrUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File ảnh quá lớn! Vui lòng chọn ảnh QR dung lượng dưới 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      handleUpdateZaloOA('qrImage', dataUrl);
      triggerAlert('✓ Đã cập nhật ảnh mã QR Zalo OA thành công!');
    };
    reader.readAsDataURL(file);
  };

  // Helper update Social platform
  const handleUpdateSocialPlatform = (platformId, field, val) => {
    const platforms = [...(config.socialMedia?.platforms || [])];
    const idx = platforms.findIndex(p => p.id === platformId);
    if (idx !== -1) {
      platforms[idx] = { ...platforms[idx], [field]: val };
      const updated = {
        ...config,
        socialMedia: {
          ...(config.socialMedia || {}),
          platforms
        }
      };
      setConfig(updated);
      saveSiteConfig(updated);
    }
  };

  // Helper toggle platform visibility
  const handleTogglePlatformVisible = (platformId) => {
    const platforms = [...(config.socialMedia?.platforms || [])];
    const idx = platforms.findIndex(p => p.id === platformId);
    if (idx !== -1) {
      const current = platforms[idx].visible !== false;
      platforms[idx] = { ...platforms[idx], visible: !current };
      const updated = {
        ...config,
        socialMedia: {
          ...(config.socialMedia || {}),
          platforms
        }
      };
      setConfig(updated);
      saveSiteConfig(updated);
      triggerAlert(`Đã ${!current ? 'BẬT' : 'TẮT'} hiển thị nền tảng ${platforms[idx].name}!`);
    }
  };

  // Helper to toggle a navigation item's visibility
  const toggleNavVisibility = (navId) => {
    const updatedNav = (config.navMenu || []).map(item => {
      if (item.id === navId) {
        return { ...item, visible: !item.visible };
      }
      return item;
    });
    const updatedConfig = { ...config, navMenu: updatedNav };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
    triggerAlert('Đã cập nhật trạng thái hiển thị menu!');
  };

  // Helper to update a navigation item's label
  const updateNavLabel = (navId, newLabel) => {
    const updatedNav = (config.navMenu || []).map(item => {
      if (item.id === navId) {
        return { ...item, label: newLabel };
      }
      return item;
    });
    setConfig({ ...config, navMenu: updatedNav });
  };

  // Helper to add a new nav item
  const handleAddNavItem = () => {
    const newId = 'page-' + Date.now();
    const newItem = {
      id: newId,
      label: 'Trang Mới',
      path: '/trang-moi',
      visible: true
    };
    const updatedNav = [...(config.navMenu || []), newItem];
    const updatedConfig = { ...config, navMenu: updatedNav };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
    triggerAlert('Đã thêm liên kết menu mới!');
  };

  // Helper to remove a nav item
  const handleRemoveNavItem = (navId) => {
    const updatedNav = (config.navMenu || []).filter(item => item.id !== navId);
    const updatedConfig = { ...config, navMenu: updatedNav };
    setConfig(updatedConfig);
    saveSiteConfig(updatedConfig);
    triggerAlert('Đã xóa liên kết menu.');
  };

  // LOGIN SCREEN (Khi chưa đăng nhập)
  if (!currentUser) {
    return (
      <div className="admin-liquid-glass min-h-screen flex items-center justify-center p-4 bg-[#ede6dc] text-[#2b170e] font-sans relative overflow-hidden select-none">
        {/* Dynamic Animated Ambient Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#df934e]/60 via-[#f4bd80]/50 to-[#fedbb9]/40 blur-[100px] animate-orb-drift-1" />
          <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#b86d32]/55 via-[#d48c4e]/45 to-[#f3cfad]/35 blur-[110px] animate-orb-drift-2" />
          <div className="absolute -bottom-40 left-1/3 w-[720px] h-[720px] rounded-full bg-gradient-to-t from-[#dec5ab]/65 via-[#eed8c2]/55 to-[#fdf4ea]/45 blur-[125px] animate-orb-drift-3" />
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md p-7 sm:p-9 rounded-[36px] bg-white/75 backdrop-blur-3xl border border-white/90 shadow-[0_24px_70px_rgba(43,23,14,0.14)] space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2.5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2b170e] to-[#150904] text-amber-200 flex items-center justify-center mx-auto shadow-xl ring-4 ring-white/80">
              <Lock className="w-7 h-7 text-amber-300" />
            </div>

            <div>
              <span className="inline-block text-[11px] font-black tracking-widest text-[#8c5932] uppercase bg-amber-100/70 border border-amber-200 px-3 py-1 rounded-full mb-1">
                HỆ THỐNG QUẢN TRỊ NỘI BỘ
              </span>
              <h1 className="text-2xl font-black text-[#1f0f09] tracking-tight">
                COFFEE 24/24 CMS
              </h1>
              <p className="text-xs text-[#5c3c26] mt-1 font-medium">
                Vui lòng đăng nhập tài khoản được cấp quyền để truy cập
              </p>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-700 text-xs font-bold flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-[#1f0f09] block mb-1.5 flex items-center gap-1.5">
                <span>Email Đăng Nhập</span>
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                placeholder="name@coffee2424.com"
                className="w-full bg-white/80 border border-white/95 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1f0f09] font-bold focus:outline-none focus:ring-2 focus:ring-[#2b170e]/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-extrabold text-[#1f0f09]">Mật Khẩu</label>
                <button
                  type="button"
                  onClick={() => setLoginShowPassword(!loginShowPassword)}
                  className="text-[11px] font-bold text-[#8c5932] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {loginShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{loginShowPassword ? 'Ẩn' : 'Hiện'}</span>
                </button>
              </div>
              <input
                type={loginShowPassword ? 'text' : 'password'}
                required
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
                placeholder="••••••••••••"
                className="w-full bg-white/80 border border-white/95 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1f0f09] font-bold focus:outline-none focus:ring-2 focus:ring-[#2b170e]/20 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl ios-btn-primary font-black text-xs sm:text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Key className="w-4 h-4 text-amber-300" />
              <span>ĐĂNG NHẬP HỆ THỐNG</span>
            </button>
          </form>

          {/* Security & SSL Encryption Notice */}
          <div className="pt-2 border-t border-[#dfd4c7]/70 flex flex-col items-center gap-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#5c3c26] font-semibold bg-white/70 px-3 py-1.5 rounded-full border border-white/90 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Kết Nối Bảo Mật SSL 256-Bit • Mã Hóa Phiên Đăng Nhập</span>
            </div>
            <p className="text-[10.5px] text-[#7a5843]">
              Hệ thống bảo vệ chống brute-force • Giám sát truy cập nội bộ
            </p>
          </div>

          {/* Return Home */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-bold text-[#8c5932] hover:text-[#1f0f09] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang chủ Coffee 24/24</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="admin-liquid-glass h-screen overflow-hidden flex flex-col bg-[#ede6dc] text-[#2b170e] font-sans selection:bg-[#2b170e] selection:text-white relative">
      
      {/* Dynamic Animated Ambient Orbs for Authentic iOS Frosted Glass Translucency */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#df934e]/60 via-[#f4bd80]/50 to-[#fedbb9]/40 blur-[100px] animate-orb-drift-1" />
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#b86d32]/55 via-[#d48c4e]/45 to-[#f3cfad]/35 blur-[110px] animate-orb-drift-2" />
        <div className="absolute top-2/3 -left-20 w-[480px] h-[480px] rounded-full bg-gradient-to-r from-[#f7ba72]/50 to-[#df8e43]/40 blur-[90px] animate-pulse-subtle" />
        <div className="absolute bottom-1/4 -right-20 w-[520px] h-[520px] rounded-full bg-gradient-to-l from-[#d49457]/50 to-[#f5caa1]/40 blur-[100px] animate-orb-drift-2" />
        <div className="absolute -bottom-40 left-1/3 w-[720px] h-[720px] rounded-full bg-gradient-to-t from-[#dec5ab]/65 via-[#eed8c2]/55 to-[#fdf4ea]/45 blur-[125px] animate-orb-drift-3" />
      </div>

      {/* ADMIN TOPBAR (EDGE-TO-EDGE) */}
      <header className="sticky top-0 z-40 px-3 sm:px-4 lg:px-5 py-2.5 flex items-center justify-between backdrop-blur-3xl bg-white/65 border-b border-white/75 shadow-xs relative shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/70 text-[#2b170e] hover:bg-white border border-white/80 cursor-pointer shadow-xs"
            title="Mở menu điều hướng"
          >
            {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2b170e] to-[#180d08] text-amber-200 flex items-center justify-center font-black text-sm shadow-md">
            24
          </div>
          <div>
            <h1 className="text-lg font-black text-[#2b170e] flex items-center gap-2">
              COFFEE 24/24 <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2b170e] text-white font-black tracking-wider shadow-xs">ADMIN CMS</span>
            </h1>
            <span className="text-xs text-[#5a3823] block font-semibold">Bảng Điều Khiển Quản Trị Website & SEO</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* User Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/75 border border-white/90 text-xs shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2b170e] to-[#180d08] text-amber-200 flex items-center justify-center font-bold text-[11px] shrink-0">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[#1f0f09] font-black text-xs leading-none truncate max-w-[140px]">
                {currentUser.name || currentUser.email}
              </span>
              <span className="text-[10px] text-[#7a5843] font-bold leading-tight mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{currentUser.roleName || (currentUser.role === 'super_admin' ? 'Tổng Quản Trị' : 'Nhân Viên')}</span>
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              logoutUser();
              setCurrentUser(null);
              triggerAlert('Đã đăng xuất tài khoản thành công.');
            }}
            className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-red-50 text-[#5c3c26] hover:text-red-600 border border-white/90 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden md:inline">Đăng Xuất</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="text-xs px-3.5 py-1.5 rounded-full ios-btn-primary flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Về Website Khách</span>
          </button>
        </div>
      </header>

      {/* ALERT TOAST */}
      {saveAlert && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-500 text-black font-black text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>{saveAlert}</span>
        </div>
      )}

      {/* 2-COLUMN DASHBOARD: LEFT SIDEBAR + RIGHT CONTENT (FULL-WIDTH FLUID LAYOUT) */}
      <div className="flex-1 flex w-full px-2 sm:px-3.5 lg:px-4 py-2 sm:py-2.5 gap-3 sm:gap-4 items-start relative overflow-hidden h-[calc(100vh-64px)]">
        
        {/* MOBILE BACKDROP */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* LEFT SIDEBAR MENU (SÁT VÀO BÊN TRÁI MÀN HÌNH) */}
        <aside className={`
          admin-sidebar-refined
          fixed lg:static z-50 lg:z-10
          inset-y-0 left-0 w-72 sm:w-80 lg:w-72 xl:w-[295px] shrink-0
          bg-white/50 backdrop-blur-3xl
          border-r lg:border border-white/80 lg:rounded-3xl
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          shadow-2xl lg:shadow-xl
          h-full overflow-hidden
        `}>
          {/* Mobile Sidebar Close Bar */}
          <div className="lg:hidden p-4 border-b border-white/70 flex items-center justify-between bg-white/60 backdrop-blur-md">
            <span className="text-sm font-extrabold text-[#2b170e] uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#8c5932]" />
              <span>Menu Quản Trị CMS</span>
            </span>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-xl text-[#2b170e] hover:bg-white/80 bg-white/60 border border-white/80 cursor-pointer shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Navigation Groups - Accordion System By Page */}
          <div className="p-3 sm:p-3.5 space-y-2.5 flex-1 overflow-y-auto">
            
            {/* NHÓM 1: 🏠 TRANG CHỦ */}
            {['heroSlide', 'glassBg', 'newDishes', 'promotions', 'whatsNew', 'spaceAmenities', 'sideBanners', 'bannerSections', 'theme', 'reviews', 'socialZalo'].some(p => hasPermission(currentUser, p)) && (
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                ['heroSlide', 'glassBg', 'newDishes', 'promotions', 'whatsNew', 'spaceAmenities', 'sideBanners', 'bannerSections', 'theme', 'reviews', 'socialZalo'].includes(activeTab)
                  ? 'bg-amber-500/10 border-amber-600/40 shadow-xs'
                  : 'bg-white/70 hover:bg-white/90 border-white/80'
              }`}>
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => {
                    toggleGroup('home');
                    if (!['heroSlide', 'glassBg', 'newDishes', 'promotions', 'whatsNew', 'spaceAmenities', 'sideBanners', 'bannerSections', 'theme', 'reviews', 'socialZalo'].includes(activeTab)) {
                      setActiveTab('heroSlide');
                    }
                  }}
                  className="w-full px-3.5 py-3 text-left flex items-center justify-between cursor-pointer select-none transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      ['heroSlide', 'glassBg', 'newDishes', 'promotions', 'whatsNew', 'sideBanners', 'bannerSections', 'theme', 'reviews', 'socialZalo'].includes(activeTab)
                        ? 'bg-[#2b170e] text-amber-300 shadow-xs'
                        : 'bg-white/90 text-[#8c5932] group-hover:bg-[#2b170e] group-hover:text-amber-300'
                    }`}>
                      <Home className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-extrabold text-[#1f0f09] block truncate leading-tight">
                        Trang Chủ
                      </span>
                      <span className="text-[11.5px] font-medium text-[#7a5843] block truncate mt-0.5">
                        7 phân mục tùy biến
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-[#7a5843] bg-white/90 px-2 py-0.5 rounded-full border border-stone-200/60 shadow-2xs">
                      7 mục
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openGroups.home ? 'rotate-180 text-amber-600' : 'text-stone-400 group-hover:text-stone-600'}`} />
                  </div>
                </button>

                {/* Accordion Sub-items (Sổ xuống) */}
                {openGroups.home && (
                  <div className="px-2 pb-2.5 pt-1 space-y-1.5 border-t border-amber-900/10 bg-white/40">
                    {/* 1.1: Hero Slide 1 & Hình Ảnh */}
                    {hasPermission(currentUser, 'heroSlide') && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('heroSlide'); setMobileSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          activeTab === 'heroSlide'
                            ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                            : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === 'heroSlide' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                          <div className="truncate">
                            <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Ảnh Bìa / Video 16:9 Đầu Trang</span>
                            <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'heroSlide' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                              Tải ảnh, gif hoặc video 16:9
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeTab === 'heroSlide' ? 'translate-x-0.5 text-amber-300' : 'text-stone-400 group-hover:translate-x-0.5'}`} />
                      </button>
                    )}

                    {/* 1.2: Hình Nền & Kính Mờ */}
                    {hasPermission(currentUser, 'glassBg') && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('glassBg'); setMobileSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          activeTab === 'glassBg'
                            ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                            : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Palette className={`w-4 h-4 shrink-0 ${activeTab === 'glassBg' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                          <div className="truncate">
                            <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Hình Nền & Kính Mờ</span>
                            <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'glassBg' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                              Đổi nền sau kính, độ mờ
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeTab === 'glassBg' ? 'translate-x-0.5 text-amber-300' : 'text-stone-400 group-hover:translate-x-0.5'}`} />
                      </button>
                    )}
                    {/* 1.1: 2 Poster Dọc 2 Bên */}
                    {hasPermission(currentUser, 'sideBanners') && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('sideBanners'); setMobileSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          activeTab === 'sideBanners'
                            ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                            : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Megaphone className={`w-4 h-4 shrink-0 ${activeTab === 'sideBanners' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                          <div className="truncate">
                            <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">2 Poster Dọc 2 Bên</span>
                            <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'sideBanners' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                              Poster đứng trượt 2 bên
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeTab === 'sideBanners' ? 'translate-x-0.5 text-amber-300' : 'text-stone-400 group-hover:translate-x-0.5'}`} />
                      </button>
                    )}

                    {/* 1.1b: Món Mới Trình Làng (Poster 3:4) */}
                    {hasPermission(currentUser, 'newDishes') && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('newDishes'); setMobileSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          activeTab === 'newDishes'
                            ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                            : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <UtensilsCrossed className={`w-4 h-4 shrink-0 ${activeTab === 'newDishes' ? 'text-amber-300' : 'text-orange-600'}`} />
                          <div className="truncate">
                            <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Món Mới Trình Làng</span>
                            <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'newDishes' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                              Poster món mới 3:4
                            </span>
                          </div>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-2xs ${
                          activeTab === 'newDishes' ? 'bg-white/20 text-white' : 'bg-white/90 text-[#2b170e] border border-stone-200/60'
                        }`}>
                          {(config.newDishesList || []).length || 3}
                        </span>
                      </button>
                    )}

                    {/* 1.1c: Chương Trình Ưu Đãi (Poster 3:4) */}
                    {hasPermission(currentUser, 'promotions') && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('promotions'); setMobileSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          activeTab === 'promotions'
                            ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                            : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Percent className={`w-4 h-4 shrink-0 ${activeTab === 'promotions' ? 'text-amber-300' : 'text-rose-600'}`} />
                          <div className="truncate">
                            <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Chương Trình Ưu Đãi</span>
                            <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'promotions' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                              Poster khuyến mãi 3:4
                            </span>
                          </div>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-2xs ${
                          activeTab === 'promotions' ? 'bg-white/20 text-white' : 'bg-white/90 text-[#2b170e] border border-stone-200/60'
                        }`}>
                          {(config.promotionsList || []).length || 3}
                        </span>
                      </button>
                    )}

                    {/* 1.1c: Không Gian & Tiện Nghi */}
                    {hasPermission(currentUser, 'spaceAmenities') && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('spaceAmenities'); setMobileSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          activeTab === 'spaceAmenities'
                            ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                            : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Armchair className={`w-4 h-4 shrink-0 ${activeTab === 'spaceAmenities' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                          <div className="truncate">
                            <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Không Gian & Tiện Nghi</span>
                            <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'spaceAmenities' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                              Tiện ích & 4 ảnh góc quán
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeTab === 'spaceAmenities' ? 'translate-x-0.5 text-amber-300' : 'text-stone-400 group-hover:translate-x-0.5'}`} />
                      </button>
                    )}

                    {/* 1.2: Khối Banner & Check-in */}
                    {hasPermission(currentUser, 'bannerSections') && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('bannerSections'); setMobileSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          activeTab === 'bannerSections'
                            ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                            : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Layers className={`w-4 h-4 shrink-0 ${activeTab === 'bannerSections' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                          <div className="truncate">
                            <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Khối Banner & Check-in</span>
                            <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'bannerSections' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                              Ưu đãi đêm & hashtag
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeTab === 'bannerSections' ? 'translate-x-0.5 text-amber-300' : 'text-stone-400 group-hover:translate-x-0.5'}`} />
                      </button>
                    )}

                    {/* 1.3: Slogan & Cấu Hình Trang Chủ */}
                    {hasPermission(currentUser, 'theme') && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('theme'); setMobileSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          activeTab === 'theme'
                            ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                            : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Sliders className={`w-4 h-4 shrink-0 ${activeTab === 'theme' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                          <div className="truncate">
                            <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Slogan & Cấu Hình</span>
                            <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'theme' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                              Slogan "Enjoy Your Life"
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeTab === 'theme' ? 'translate-x-0.5 text-amber-300' : 'text-stone-400 group-hover:translate-x-0.5'}`} />
                      </button>
                    )}

                    {/* 1.4: Đánh Giá Khách Hàng */}
                    {hasPermission(currentUser, 'reviews') && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('reviews'); setMobileSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          activeTab === 'reviews'
                            ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                            : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Star className={`w-4 h-4 shrink-0 ${activeTab === 'reviews' ? 'text-amber-300 fill-amber-300' : 'text-[#8c5932]'}`} />
                          <div className="truncate">
                            <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Đánh Giá Khách Hàng</span>
                            <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'reviews' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                              Nằm trên phần Mạng Xã Hội
                            </span>
                          </div>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-2xs ${
                          activeTab === 'reviews' ? 'bg-white/20 text-white' : 'bg-white/90 text-[#2b170e] border border-stone-200/60'
                        }`}>
                          {reviewsList.filter(r => r.active !== false).length}
                        </span>
                      </button>
                    )}

                    {/* 1.5: Mạng Xã Hội & Zalo OA */}
                    {hasPermission(currentUser, 'socialZalo') && (
                      <button
                        type="button"
                        onClick={() => { setActiveTab('socialZalo'); setMobileSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          activeTab === 'socialZalo'
                            ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                            : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Share2 className={`w-4 h-4 shrink-0 ${activeTab === 'socialZalo' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                          <div className="truncate">
                            <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Mạng Xã Hội & Zalo OA</span>
                            <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'socialZalo' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                              Facebook, TikTok & QR Zalo
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeTab === 'socialZalo' ? 'translate-x-0.5 text-amber-300' : 'text-stone-400 group-hover:translate-x-0.5'}`} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* NHÓM 2: ✨ TRANG GIỚI THIỆU */}
            {hasPermission(currentUser, 'about') && (
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                activeTab === 'about'
                  ? 'bg-amber-500/10 border-amber-600/40 shadow-xs'
                  : 'bg-white/70 hover:bg-white/90 border-white/80'
              }`}>
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => {
                    toggleGroup('about');
                    setActiveTab('about');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full px-3.5 py-3 text-left flex items-center justify-between cursor-pointer select-none transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeTab === 'about'
                        ? 'bg-[#2b170e] text-amber-300 shadow-xs'
                        : 'bg-white/90 text-[#8c5932] group-hover:bg-[#2b170e] group-hover:text-amber-300'
                    }`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-extrabold text-[#1f0f09] block truncate leading-tight">
                        Trang Giới Thiệu
                      </span>
                      <span className="text-[11.5px] font-medium text-[#7a5843] block truncate mt-0.5">
                        Câu chuyện & Tiện nghi 24/7
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-[#7a5843] bg-white/90 px-2 py-0.5 rounded-full border border-stone-200/60 shadow-2xs">
                      3 phần
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openGroups.about ? 'rotate-180 text-amber-600' : 'text-stone-400 group-hover:text-stone-600'}`} />
                  </div>
                </button>

                {/* Sub-items (Sổ xuống) */}
                {openGroups.about && (
                  <div className="px-2 pb-2.5 pt-1 space-y-1.5 border-t border-amber-900/10 bg-white/40">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('about'); scrollToAnchor('about-part-1'); setMobileSidebarOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xs font-mono font-bold text-amber-600 bg-amber-500/15 w-5 h-5 rounded-md flex items-center justify-center shrink-0">1</span>
                        <div className="truncate">
                          <span className="text-xs sm:text-[13px] font-bold block truncate">Hero Banner & Khẩu Hiệu</span>
                          <span className="text-[10.5px] text-[#7a5843] block truncate">Tiêu đề lớn & slogan</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('about'); scrollToAnchor('about-part-2'); setMobileSidebarOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xs font-mono font-bold text-amber-600 bg-amber-500/15 w-5 h-5 rounded-md flex items-center justify-center shrink-0">2</span>
                        <div className="truncate">
                          <span className="text-xs sm:text-[13px] font-bold block truncate">4 Nhóm Khách Hàng Mục Tiêu</span>
                          <span className="text-[10.5px] text-[#7a5843] block truncate">Sứ mệnh phục vụ 24/7</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('about'); scrollToAnchor('about-part-3'); setMobileSidebarOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xs font-mono font-bold text-amber-600 bg-amber-500/15 w-5 h-5 rounded-md flex items-center justify-center shrink-0">3</span>
                        <div className="truncate">
                          <span className="text-xs sm:text-[13px] font-bold block truncate">6 Tiện Nghi Đẳng Cấp 24/7</span>
                          <span className="text-[10.5px] text-[#7a5843] block truncate">Wifi, ổ điện, máy lạnh, an ninh</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* NHÓM 3: 📝 TRANG BÀI VIẾT */}
            {hasPermission(currentUser, 'articles') && (
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                activeTab === 'articles'
                  ? 'bg-amber-500/10 border-amber-600/40 shadow-xs'
                  : 'bg-white/70 hover:bg-white/90 border-white/80'
              }`}>
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => {
                    toggleGroup('articles');
                    setActiveTab('articles');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full px-3.5 py-3 text-left flex items-center justify-between cursor-pointer select-none transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeTab === 'articles'
                        ? 'bg-[#2b170e] text-amber-300 shadow-xs'
                        : 'bg-white/90 text-[#8c5932] group-hover:bg-[#2b170e] group-hover:text-amber-300'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-extrabold text-[#1f0f09] block truncate leading-tight">
                        Trang Bài Viết
                      </span>
                      <span className="text-[11.5px] font-medium text-[#7a5843] block truncate mt-0.5">
                        Cẩm nang & Tối ưu Google SEO
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-[#7a5843] bg-white/90 px-2 py-0.5 rounded-full border border-stone-200/60 shadow-2xs">
                      {articles.length} bài
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openGroups.articles ? 'rotate-180 text-amber-600' : 'text-stone-400 group-hover:text-stone-600'}`} />
                  </div>
                </button>

                {/* Sub-items (Sổ xuống) */}
                {openGroups.articles && (
                  <div className="px-2 pb-2.5 pt-1 space-y-1.5 border-t border-amber-900/10 bg-white/40">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('articles'); setMobileSidebarOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                        activeTab === 'articles'
                          ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                          : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'articles' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                        <div className="truncate">
                          <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Danh Sách & SEO Google</span>
                          <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'articles' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                            {articles.length} bài viết xuất bản
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeTab === 'articles' ? 'translate-x-0.5 text-amber-300' : 'text-stone-400 group-hover:translate-x-0.5'}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('articles');
                        setEditingArticle({
                          title: '',
                          slug: '',
                          category: 'Không Gian 24/7',
                          excerpt: '',
                          content: '',
                          coverImage: '/images/blog_workspace.jpg',
                          author: 'Admin Coffee 24/24',
                          readTime: '4 phút đọc',
                          seoTitle: '',
                          seoDescription: '',
                          keywords: ['coffee 24/24', 'cà phê 24/7']
                        });
                        setIsNewPost(true);
                        setMobileSidebarOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-amber-800 hover:text-amber-950 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 font-bold group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Plus className="w-4 h-4 shrink-0 text-amber-700 stroke-[2.5]" />
                        <span className="text-xs font-bold truncate">+ Soạn Thảo Bài Mới</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* NHÓM 4: 💼 TRANG TUYỂN DỤNG */}
            {hasPermission(currentUser, 'jobs') && (
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                activeTab === 'jobs'
                  ? 'bg-amber-500/10 border-amber-600/40 shadow-xs'
                  : 'bg-white/70 hover:bg-white/90 border-white/80'
              }`}>
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => {
                    toggleGroup('jobs');
                    setActiveTab('jobs');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full px-3.5 py-3 text-left flex items-center justify-between cursor-pointer select-none transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeTab === 'jobs'
                        ? 'bg-[#2b170e] text-amber-300 shadow-xs'
                        : 'bg-white/90 text-[#8c5932] group-hover:bg-[#2b170e] group-hover:text-amber-300'
                    }`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-extrabold text-[#1f0f09] block truncate leading-tight">
                        Trang Tuyển Dụng
                      </span>
                      <span className="text-[11.5px] font-medium text-[#7a5843] block truncate mt-0.5">
                        Cơ hội việc làm 12 vị trí
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-[#7a5843] bg-white/90 px-2 py-0.5 rounded-full border border-stone-200/60 shadow-2xs">
                      {jobsList.filter(j => j.active !== false).length}/12 mở
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openGroups.jobs ? 'rotate-180 text-amber-600' : 'text-stone-400 group-hover:text-stone-600'}`} />
                  </div>
                </button>

                {/* Sub-items (Sổ xuống) */}
                {openGroups.jobs && (
                  <div className="px-2 pb-2.5 pt-1 space-y-1.5 border-t border-amber-900/10 bg-white/40">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('jobs'); setMobileSidebarOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                        activeTab === 'jobs'
                          ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                          : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Briefcase className={`w-4 h-4 shrink-0 ${activeTab === 'jobs' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                        <div className="truncate">
                          <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Quản Lý 12 Vị Trí</span>
                          <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'jobs' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                            Bật/tắt & chỉnh sửa chi tiết
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeTab === 'jobs' ? 'translate-x-0.5 text-amber-300' : 'text-stone-400 group-hover:translate-x-0.5'}`} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* NHÓM 5: 📍 TRANG CHI NHÁNH & HOTLINE */}
            {hasPermission(currentUser, 'branches') && (
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                activeTab === 'branches'
                  ? 'bg-amber-500/10 border-amber-600/40 shadow-xs'
                  : 'bg-white/70 hover:bg-white/90 border-white/80'
              }`}>
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => {
                    toggleGroup('branches');
                    setActiveTab('branches');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full px-3.5 py-3 text-left flex items-center justify-between cursor-pointer select-none transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeTab === 'branches'
                        ? 'bg-[#2b170e] text-amber-300 shadow-xs'
                        : 'bg-white/90 text-[#8c5932] group-hover:bg-[#2b170e] group-hover:text-amber-300'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-extrabold text-[#1f0f09] block truncate leading-tight">
                        Trang Chi Nhánh
                      </span>
                      <span className="text-[11.5px] font-medium text-[#7a5843] block truncate mt-0.5">
                        Hotline & 2 cơ sở 24/7
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-[#7a5843] bg-white/90 px-2 py-0.5 rounded-full border border-stone-200/60 shadow-2xs">
                      2 cơ sở
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openGroups.branches ? 'rotate-180 text-amber-600' : 'text-stone-400 group-hover:text-stone-600'}`} />
                  </div>
                </button>

                {/* Sub-items (Sổ xuống) */}
                {openGroups.branches && (
                  <div className="px-2 pb-2.5 pt-1 space-y-1.5 border-t border-amber-900/10 bg-white/40">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('branches'); scrollToAnchor('branches-hotline'); setMobileSidebarOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <PhoneCall className="w-4 h-4 text-[#8c5932] shrink-0" />
                        <div className="truncate">
                          <span className="text-xs sm:text-[13px] font-bold block truncate">Hotline Tổng & CSKH</span>
                          <span className="text-[10.5px] text-[#7a5843] block truncate">{config.hotlineGeneral || '0906 916 816'}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('branches'); scrollToAnchor('branches-locations'); setMobileSidebarOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin className="w-4 h-4 text-[#8c5932] shrink-0" />
                        <div className="truncate">
                          <span className="text-xs sm:text-[13px] font-bold block truncate">413 PHI & 96 D5</span>
                          <span className="text-[10.5px] text-[#7a5843] block truncate">SĐT & Menu KiotViet</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* NHÓM 6: 🧭 MENU & ĐIỀU HƯỚNG WEBSITE */}
            {hasPermission(currentUser, 'navigation') && (
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                activeTab === 'navigation'
                  ? 'bg-amber-500/10 border-amber-600/40 shadow-xs'
                  : 'bg-white/70 hover:bg-white/90 border-white/80'
              }`}>
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => {
                    toggleGroup('navigation');
                    setActiveTab('navigation');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full px-3.5 py-3 text-left flex items-center justify-between cursor-pointer select-none transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeTab === 'navigation'
                        ? 'bg-[#2b170e] text-amber-300 shadow-xs'
                        : 'bg-white/90 text-[#8c5932] group-hover:bg-[#2b170e] group-hover:text-amber-300'
                    }`}>
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-extrabold text-[#1f0f09] block truncate leading-tight">
                        Menu Điều Hướng
                      </span>
                      <span className="text-[11.5px] font-medium text-[#7a5843] block truncate mt-0.5">
                        Cấu trúc menu & liên kết
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-[#7a5843] bg-white/90 px-2 py-0.5 rounded-full border border-stone-200/60 shadow-2xs">
                      {config.navMenu?.length || 6} menu
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openGroups.navigation ? 'rotate-180 text-amber-600' : 'text-stone-400 group-hover:text-stone-600'}`} />
                  </div>
                </button>

                {/* Sub-items (Sổ xuống) */}
                {openGroups.navigation && (
                  <div className="px-2 pb-2.5 pt-1 space-y-1.5 border-t border-amber-900/10 bg-white/40">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('navigation'); setMobileSidebarOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                        activeTab === 'navigation'
                          ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                          : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Compass className={`w-4 h-4 shrink-0 ${activeTab === 'navigation' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                        <div className="truncate">
                          <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Menu Header & Footer</span>
                          <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'navigation' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                            {config.navMenu?.length || 6} liên kết trang web
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeTab === 'navigation' ? 'translate-x-0.5 text-amber-300' : 'text-stone-400 group-hover:translate-x-0.5'}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('navigation');
                        handleAddNavItem();
                        setMobileSidebarOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-amber-800 hover:text-amber-950 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 font-bold group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Plus className="w-4 h-4 shrink-0 text-amber-700 stroke-[2.5]" />
                        <span className="text-xs font-bold truncate">+ Thêm Menu / Trang Mới</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* NHÓM 7: 🛡️ HỆ THỐNG & BẢO MẬT */}
            {hasPermission(currentUser, 'users') && (
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                activeTab === 'users'
                  ? 'bg-amber-500/10 border-amber-600/40 shadow-xs'
                  : 'bg-white/70 hover:bg-white/90 border-white/80'
              }`}>
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => {
                    toggleGroup('users');
                    setActiveTab('users');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full px-3.5 py-3 text-left flex items-center justify-between cursor-pointer select-none transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeTab === 'users'
                        ? 'bg-[#2b170e] text-amber-300 shadow-xs'
                        : 'bg-white/90 text-[#8c5932] group-hover:bg-[#2b170e] group-hover:text-amber-300'
                    }`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-extrabold text-[#1f0f09] block truncate leading-tight">
                        Hệ Thống & Bảo Mật
                      </span>
                      <span className="text-[11.5px] font-medium text-[#7a5843] block truncate mt-0.5">
                        Tài khoản & Phân quyền RBAC
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-[#7a5843] bg-white/90 px-2 py-0.5 rounded-full border border-stone-200/60 shadow-2xs">
                      RBAC
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openGroups.users ? 'rotate-180 text-amber-600' : 'text-stone-400 group-hover:text-stone-600'}`} />
                  </div>
                </button>

                {/* Sub-items (Sổ xuống) */}
                {openGroups.users && (
                  <div className="px-2 pb-2.5 pt-1 space-y-1.5 border-t border-amber-900/10 bg-white/40">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('users'); setMobileSidebarOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                        activeTab === 'users'
                          ? 'active-sidebar-tab bg-gradient-to-r from-[#2b170e] to-[#1a0e08] text-white shadow-md font-bold'
                          : 'text-[#422c1e] hover:text-[#180d08] hover:bg-white/80 border border-transparent hover:border-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Users className={`w-4 h-4 shrink-0 ${activeTab === 'users' ? 'text-amber-300' : 'text-[#8c5932]'}`} />
                        <div className="truncate">
                          <span className="sidebar-item-title text-xs sm:text-[13.5px] font-bold block truncate leading-tight">Tài Khoản & Phân Quyền</span>
                          <span className={`sidebar-item-subtitle text-[11px] font-medium block truncate mt-0.5 ${activeTab === 'users' ? 'text-stone-300' : 'text-[#7a5843]'}`}>
                            Cấp quyền nhân sự CMS
                          </span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-2xs ${
                        activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-white/90 text-[#2b170e] border border-stone-200/60'
                      }`}>
                        {accountsList.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('users');
                        setEditingAccount({
                          id: '',
                          email: '',
                          password: '',
                          name: '',
                          role: 'custom',
                          roleName: 'Nhân Viên Phân Quyền',
                          permissions: ['articles'],
                          active: true
                        });
                        setIsNewAccount(true);
                        setAccountPasswordVisible(false);
                        setMobileSidebarOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-amber-800 hover:text-amber-950 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 font-bold group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <UserPlus className="w-4 h-4 shrink-0 text-amber-700 stroke-[2.5]" />
                        <span className="text-xs font-bold truncate">+ Thêm Tài Khoản Mới</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* SIDEBAR FOOTER */}
          <div className="p-4 border-t border-white/70 bg-white/40 rounded-b-3xl space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs sm:text-[13px] px-1">
              <span className="text-[#6e503e] font-semibold">Hệ thống:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Hoạt động 24/7</span>
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/80 hover:bg-white text-[#2b170e] border border-white/95 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-[#8c5932]" />
              <span>Xem Website Ngoài</span>
            </button>
          </div>

        </aside>

        {/* RIGHT MAIN WORKSPACE */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto space-y-6 pr-1 sm:pr-2 pb-16">
          
          {/* Breadcrumb & Section Indicator Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="text-neutral-500 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin CMS</span>
              </span>
              <span className="text-neutral-700">/</span>
              <span className="text-neutral-400 font-bold">
                {['heroSlide', 'glassBg', 'sideBanners', 'bannerSections', 'theme', 'reviews', 'socialZalo'].includes(activeTab) 
                  ? 'Trang Chủ' 
                  : activeTab === 'about'
                    ? 'Trang Giới Thiệu'
                    : activeTab === 'articles'
                      ? 'Trang Bài Viết'
                      : activeTab === 'jobs'
                        ? 'Trang Tuyển Dụng'
                        : activeTab === 'branches'
                          ? 'Trang Chi Nhánh & Hotline'
                          : activeTab === 'navigation'
                            ? 'Menu Điều Hướng'
                            : 'Hệ Thống & Bảo Mật'}
              </span>
              <span className="text-neutral-700">/</span>
              <span className="text-amber-400 font-black flex items-center gap-1.5">
                {activeTab === 'heroSlide' && <><span>✨</span> Ảnh Bìa / Video 16:9 Đầu Trang</>}
                {activeTab === 'glassBg' && <><span>🎨</span> Hình Nền & Kính Mờ</>}
                {activeTab === 'sideBanners' && <><span>📢</span> 2 Poster Dọc 2 Bên</>}
                {activeTab === 'bannerSections' && <><span>🖼️</span> Khối Banner & Check-in</>}
                {activeTab === 'theme' && <><span>⚙️</span> Slogan & Trang Chủ</>}
                {activeTab === 'reviews' && <><span>⭐</span> Đánh Giá Khách Hàng</>}
                {activeTab === 'socialZalo' && <><span>🌐</span> Mạng Xã Hội & Zalo OA</>}
                {activeTab === 'navigation' && <><span>🧭</span> Menu & Các Trang Web</>}
                {activeTab === 'about' && <><span>✨</span> Trang Giới Thiệu</>}
                {activeTab === 'articles' && <><span>📝</span> Bài Viết & Tối Ưu SEO</>}
                {activeTab === 'jobs' && <><span>💼</span> Tuyển Dụng (12 Vị Trí)</>}
                {activeTab === 'branches' && <><span>📍</span> Hotline & 2 Chi Nhánh</>}
                {activeTab === 'users' && <><span>🛡️</span> Tài Khoản & Phân Quyền</>}
              </span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-[11px] text-neutral-400 font-mono bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
                coffee2424.com/admin
              </span>
            </div>
          </div>

        {/* TAB HERO SLIDE 1 & HÌNH ẢNH */}
        {activeTab === 'heroSlide' && (
          <AdminHeroSlideManager 
            config={config} 
            onSaveConfig={(newConf) => {
              setConfig(newConf);
              saveSiteConfig(newConf);
            }} 
            triggerAlert={triggerAlert} 
          />
        )}

        {/* TAB HÌNH NỀN & HIỆU ỨNG KÍNH MỜ */}
        {activeTab === 'glassBg' && (
          <AdminGlassBackgroundManager 
            config={config} 
            onSaveConfig={(newConf) => {
              setConfig(newConf);
              saveSiteConfig(newConf);
            }} 
            triggerAlert={triggerAlert} 
          />
        )}

        {/* TAB MÓN MỚI TRÌNH LÀNG TRANG CHỦ */}
        {activeTab === 'newDishes' && (
          <AdminNewDishesManager 
            config={config} 
            onSaveConfig={(newConf) => {
              setConfig(newConf);
              saveSiteConfig(newConf);
            }} 
            triggerAlert={triggerAlert} 
          />
        )}

        {/* TAB CHƯƠNG TRÌNH ƯU ĐÃI TRANG CHỦ */}
        {activeTab === 'promotions' && (
          <AdminPromotionsManager 
            config={config} 
            onSaveConfig={(newConf) => {
              setConfig(newConf);
              saveSiteConfig(newConf);
            }} 
            triggerAlert={triggerAlert} 
          />
        )}

        {/* TAB MÓN MỚI & ƯU ĐÃI TRANG CHỦ (LEGACY FALLBACK) */}
        {activeTab === 'whatsNew' && (
          <AdminNewDishesManager 
            config={config} 
            onSaveConfig={(newConf) => {
              setConfig(newConf);
              saveSiteConfig(newConf);
            }} 
            triggerAlert={triggerAlert} 
          />
        )}

        {/* TAB KHÔNG GIAN & TIỆN NGHI TRANG CHỦ */}
        {activeTab === 'spaceAmenities' && (
          <AdminSpaceAmenitiesManager 
            config={config} 
            onSaveConfig={(newConf) => {
              setConfig(newConf);
              saveSiteConfig(newConf);
            }} 
            triggerAlert={triggerAlert} 
          />
        )}

        {/* TAB 1: 2 POSTER DỌC 2 BÊN */}
        {activeTab === 'sideBanners' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-500" />
                  <span>Quản Lý 2 Poster Dọc 2 Bên Màn Hình</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Hai poster dọc trượt theo hai bên màn hình máy tính để quảng cáo món mới, combo hoặc chương trình khuyến mãi. Khách hàng có thể đóng bằng dấu [x].
                </p>
              </div>

              {/* Master Toggle */}
              <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 p-2.5 px-4 rounded-2xl">
                <span className="text-xs font-bold text-neutral-300">
                  Hiển thị 2 Poster:
                </span>
                <button
                  onClick={() => {
                    const newEnabled = !config.sideBanners?.enabled;
                    const updatedConfig = {
                      ...config,
                      sideBanners: { ...config.sideBanners, enabled: newEnabled }
                    };
                    setConfig(updatedConfig);
                    saveSiteConfig(updatedConfig);
                    triggerAlert(`Đã ${newEnabled ? 'BẬT' : 'TẮT'} 2 poster quảng cáo 2 bên!`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                    config.sideBanners?.enabled
                      ? 'bg-emerald-500 text-black'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${config.sideBanners?.enabled ? 'bg-black' : 'bg-red-500'}`}></span>
                  <span>{config.sideBanners?.enabled ? 'ĐANG BẬT' : 'ĐANG TẮT'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* POSTER BÊN TRÁI */}
              <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase">
                    POSTER BÊN TRÁI
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">Khung tự động co giãn theo tỉ lệ ảnh</span>
                </div>

                {/* 1. KHU VỰC TẢI ẢNH LÊN TỪ MÁY TÍNH */}
                <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Hình Ảnh Poster Bên Trái</span>
                    </label>
                    <span className="text-[10px] text-neutral-400 font-medium">Tự động nén giữ nguyên tỉ lệ ảnh</span>
                  </div>

                  {/* Nút bấm tải ảnh từ máy */}
                  <input
                    type="file"
                    id="left-banner-file-input"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleUploadBannerImage('left', e.target.files[0]);
                      }
                    }}
                  />
                  <label
                    htmlFor="left-banner-file-input"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
                  >
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>TẢI ẢNH MỚI TỪ MÁY TÍNH LÊN (CẬP NHẬT NGAY TRANG CHỦ)</span>
                  </label>

                  {/* Hoặc chọn từ danh sách mẫu có sẵn */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-sm font-semibold text-neutral-700 block">Hoặc chọn từ kho ảnh mẫu:</span>
                    <select
                      value={config.sideBanners?.left?.image || ''}
                      onChange={(e) => {
                        const updated = {
                          ...config,
                          sideBanners: {
                            ...config.sideBanners,
                            left: { ...config.sideBanners?.left, image: e.target.value }
                          }
                        };
                        setConfig(updated);
                        saveSiteConfig(updated);
                        triggerAlert('Đã cập nhật ảnh poster bên Trái!');
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                    >
                      <option value="/images/poster_vertical_left.jpg">Poster Dọc 9:21 - Cold Brew Specialty</option>
                      <option value="/images/poster_vertical_right.jpg">Poster Dọc 9:21 - Combo Deals Bánh & Cafe</option>
                      <option value="/images/signature_drinks.jpg">Đồ uống Signature</option>
                      <option value="/images/promo_banner.jpg">Combo Khuyến Mãi</option>
                      <option value="/images/blog_workspace.jpg">Bàn Làm Việc Đêm</option>
                    </select>
                  </div>

                  {/* Hoặc dán đường dẫn URL trực tiếp */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-sm font-semibold text-neutral-700 block">Hoặc dán URL ảnh trực tiếp:</span>
                    <input
                      type="text"
                      value={config.sideBanners?.left?.image || ''}
                      onChange={(e) => {
                        const updated = {
                          ...config,
                          sideBanners: {
                            ...config.sideBanners,
                            left: { ...config.sideBanners?.left, image: e.target.value }
                          }
                        };
                        setConfig(updated);
                        saveSiteConfig(updated);
                      }}
                      placeholder="https://... hoặc /images/..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 font-mono"
                    />
                  </div>
                </div>

                {/* 2. ĐƯỜNG DẪN CHUYỂN TRANG KHI BẤM POSTER */}
                <div className="space-y-1.5">
                  <label className="text-sm text-neutral-800 font-bold block">
                    Đường dẫn khi click vào poster (Link đích chuyển trang)
                  </label>
                  <input
                    type="text"
                    value={config.sideBanners?.left?.link || ''}
                    onChange={(e) => {
                      const updated = {
                        ...config,
                        sideBanners: {
                          ...config.sideBanners,
                          left: { ...config.sideBanners?.left, link: e.target.value }
                        }
                      };
                      setConfig(updated);
                      saveSiteConfig(updated);
                    }}
                    placeholder="/dathang, /khuyenmai, /baiviet..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-amber-800 font-mono font-bold"
                  />
                  <span className="text-xs text-neutral-600 block font-medium">
                    Khách hàng bấm vào bất kỳ đâu trên poster sẽ chuyển ngay đến liên kết này.
                  </span>
                </div>

                {/* 3. NỘI DUNG CHỮ & CÁC NÚT BẬT / TẮT HIỂN THỊ */}
                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-black text-neutral-900 flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-amber-600" />
                      <span>Các Trường Chữ Đè Lên Poster (Bật / Tắt Từng Mục)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAllTextFields('left', false)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-600 hover:text-black border border-neutral-800 transition-colors font-bold cursor-pointer"
                        title="Tắt toàn bộ chữ để poster chỉ hiện ảnh thuần túy"
                      >
                        Tắt hết chữ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleAllTextFields('left', true)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 border border-amber-500/30 transition-colors font-bold cursor-pointer"
                        title="Bật hiển thị cả 4 dòng chữ"
                      >
                        Bật hết chữ
                      </button>
                    </div>
                  </div>

                  {/* 1. Huy hiệu góc trên (Badge) */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    config.sideBanners?.left?.showBadge
                      ? 'bg-neutral-900/90 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-950 border-neutral-900'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <span>Huy hiệu góc trên (Badge)</span>
                        {config.sideBanners?.left?.showBadge ? (
                          <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-medium bg-neutral-800/40 px-1.5 py-0.5 rounded">
                            Đang tắt
                          </span>
                        )}
                      </span>
                      {/* NÚT BẬT / TẮT */}
                      <button
                        type="button"
                        onClick={() => handleToggleBannerField('left', 'showBadge')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          config.sideBanners?.left?.showBadge
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.sideBanners?.left?.showBadge ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.sideBanners?.left?.showBadge ? 'BẬT HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={config.sideBanners?.left?.badge || ''}
                      onChange={(e) => handleUpdateBannerField('left', 'badge', e.target.value)}
                      placeholder="Ví dụ: NEW, 69K, GIẢM 40%..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-medium focus:border-amber-500/50 outline-none"
                    />
                  </div>

                  {/* 2. Tiêu đề lớn */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    config.sideBanners?.left?.showTitle
                      ? 'bg-neutral-900/90 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-950 border-neutral-900'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <span>Tiêu đề lớn</span>
                        {config.sideBanners?.left?.showTitle ? (
                          <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-medium bg-neutral-800/40 px-1.5 py-0.5 rounded">
                            Đang tắt
                          </span>
                        )}
                      </span>
                      {/* NÚT BẬT / TẮT */}
                      <button
                        type="button"
                        onClick={() => handleToggleBannerField('left', 'showTitle')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          config.sideBanners?.left?.showTitle
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.sideBanners?.left?.showTitle ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.sideBanners?.left?.showTitle ? 'BẬT HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={config.sideBanners?.left?.title || ''}
                      onChange={(e) => handleUpdateBannerField('left', 'title', e.target.value)}
                      placeholder="Ví dụ: MÓN MỚI, SPECIALTY..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-bold focus:border-amber-500/50 outline-none"
                    />
                  </div>

                  {/* 3. Tên món / Phụ đề */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    config.sideBanners?.left?.showSubtitle
                      ? 'bg-neutral-900/90 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-950 border-neutral-900'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <span>Tên món / Phụ đề</span>
                        {config.sideBanners?.left?.showSubtitle ? (
                          <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-medium bg-neutral-800/40 px-1.5 py-0.5 rounded">
                            Đang tắt
                          </span>
                        )}
                      </span>
                      {/* NÚT BẬT / TẮT */}
                      <button
                        type="button"
                        onClick={() => handleToggleBannerField('left', 'showSubtitle')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          config.sideBanners?.left?.showSubtitle
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.sideBanners?.left?.showSubtitle ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.sideBanners?.left?.showSubtitle ? 'BẬT HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={config.sideBanners?.left?.subtitle || ''}
                      onChange={(e) => handleUpdateBannerField('left', 'subtitle', e.target.value)}
                      placeholder="Ví dụ: Cold Brew Cam Vàng, Cà Phê Mộc..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-medium focus:border-amber-500/50 outline-none"
                    />
                  </div>

                  {/* 4. Mô tả ngắn */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    config.sideBanners?.left?.showDesc
                      ? 'bg-neutral-900/90 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-950 border-neutral-900'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <span>Mô tả ngắn</span>
                        {config.sideBanners?.left?.showDesc ? (
                          <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-medium bg-neutral-800/40 px-1.5 py-0.5 rounded">
                            Đang tắt
                          </span>
                        )}
                      </span>
                      {/* NÚT BẬT / TẮT */}
                      <button
                        type="button"
                        onClick={() => handleToggleBannerField('left', 'showDesc')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          config.sideBanners?.left?.showDesc
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.sideBanners?.left?.showDesc ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.sideBanners?.left?.showDesc ? 'BẬT HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={config.sideBanners?.left?.desc || ''}
                      onChange={(e) => handleUpdateBannerField('left', 'desc', e.target.value)}
                      placeholder="Ví dụ: Ủ lạnh 24 giờ thơm mát sảng khoái..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-medium focus:border-amber-500/50 outline-none"
                    />
                  </div>
                </div>

                {/* 4. KHUNG XEM TRƯỚC POSTER (TỰ ĐỘNG CO GIÃN THEO TỈ LỆ ẢNH) */}
                <div className="pt-3 border-t border-neutral-900 flex items-start gap-4">
                  <div 
                    className="relative w-36 shrink-0 rounded-2xl overflow-hidden border-2 border-neutral-700 shadow-xl bg-neutral-900 max-h-80"
                  >
                    <img 
                      src={config.sideBanners?.left?.image || '/images/poster_vertical_left.jpg'} 
                      alt="Preview Left" 
                      className="w-full h-auto block"
                    />

                    {/* Huy hiệu xem trước */}
                    {config.sideBanners?.left?.showBadge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow z-30">
                        {config.sideBanners.left.badge || 'NEW'}
                      </span>
                    )}

                    {/* Lớp chữ xem trước */}
                    {(config.sideBanners?.left?.showTitle || config.sideBanners?.left?.showSubtitle || config.sideBanners?.left?.showDesc) && (
                      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-1 text-white z-30 pointer-events-none">
                        {config.sideBanners?.left?.showTitle && (
                          <h5 className="text-xs font-black text-amber-300 uppercase leading-tight line-clamp-1 drop-shadow-sm">
                            {config.sideBanners.left.title || 'MÓN MỚI'}
                          </h5>
                        )}
                        {config.sideBanners?.left?.showSubtitle && (
                          <p className="text-xs font-black text-white leading-tight line-clamp-1 drop-shadow-sm">
                            {config.sideBanners.left.subtitle || 'Cold Brew Cam Vàng'}
                          </p>
                        )}
                        {config.sideBanners?.left?.showDesc && (
                          <p className="text-[10px] text-stone-200 leading-tight line-clamp-2 drop-shadow-sm">
                            {config.sideBanners.left.desc || 'Ủ lạnh 24 giờ thơm mát sảng khoái'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm flex-1">
                    <span className="text-neutral-700 font-semibold block">Xem trước trực tiếp:</span>
                    <span className="text-amber-800 font-bold block text-sm">Poster Trái (Tự động co giãn theo tỉ lệ ảnh)</span>
                    <span className="text-neutral-600 block text-xs font-mono">Đích đến: {config.sideBanners?.left?.link || '/dathang'}</span>
                    
                    {/* Trạng thái hiển thị chữ */}
                    <div className="pt-1">
                      {!(config.sideBanners?.left?.showBadge || config.sideBanners?.left?.showTitle || config.sideBanners?.left?.showSubtitle || config.sideBanners?.left?.showDesc) ? (
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-800 text-xs font-bold border border-emerald-500/30">
                          ✨ Đang ở chế độ Ảnh Thuần Túy (Không đè chữ)
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-900 text-xs font-bold border border-amber-500/30">
                          👁️ Đang hiển thị chữ đè lên ảnh
                        </span>
                      )}
                    </div>

                    {config.sideBanners?.left?.image?.startsWith('data:image') && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                        ✓ Ảnh tải lên từ thiết bị đã lưu
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* POSTER BÊN PHẢI */}
              <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/40 uppercase">
                    POSTER BÊN PHẢI
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">Khung tự động co giãn theo tỉ lệ ảnh</span>
                </div>

                {/* 1. KHU VỰC TẢI ẢNH LÊN TỪ MÁY TÍNH */}
                <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Hình Ảnh Poster Bên Phải</span>
                    </label>
                    <span className="text-[10px] text-neutral-400 font-medium">Tự động nén giữ nguyên tỉ lệ ảnh</span>
                  </div>

                  {/* Nút bấm tải ảnh từ máy */}
                  <input
                    type="file"
                    id="right-banner-file-input"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleUploadBannerImage('right', e.target.files[0]);
                      }
                    }}
                  />
                  <label
                    htmlFor="right-banner-file-input"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
                  >
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>TẢI ẢNH MỚI TỪ MÁY TÍNH LÊN (CẬP NHẬT NGAY TRANG CHỦ)</span>
                  </label>

                  {/* Hoặc chọn từ danh sách mẫu có sẵn */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-sm font-semibold text-neutral-700 block">Hoặc chọn từ kho ảnh mẫu:</span>
                    <select
                      value={config.sideBanners?.right?.image || ''}
                      onChange={(e) => {
                        const updated = {
                          ...config,
                          sideBanners: {
                            ...config.sideBanners,
                            right: { ...config.sideBanners?.right, image: e.target.value }
                          }
                        };
                        setConfig(updated);
                        saveSiteConfig(updated);
                        triggerAlert('Đã cập nhật ảnh poster bên Phải!');
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                    >
                      <option value="/images/poster_vertical_right.jpg">Poster Dọc 9:21 - Combo Deals Bánh & Cafe</option>
                      <option value="/images/poster_vertical_left.jpg">Poster Dọc 9:21 - Cold Brew Specialty</option>
                      <option value="/images/promo_banner.jpg">Combo Khuyến Mãi 69K</option>
                      <option value="/images/signature_drinks.jpg">Đồ uống Signature</option>
                      <option value="/images/blog_workspace.jpg">Bàn Làm Việc Đêm</option>
                    </select>
                  </div>

                  {/* Hoặc dán đường dẫn URL trực tiếp */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-sm font-semibold text-neutral-700 block">Hoặc dán URL ảnh trực tiếp:</span>
                    <input
                      type="text"
                      value={config.sideBanners?.right?.image || ''}
                      onChange={(e) => {
                        const updated = {
                          ...config,
                          sideBanners: {
                            ...config.sideBanners,
                            right: { ...config.sideBanners?.right, image: e.target.value }
                          }
                        };
                        setConfig(updated);
                        saveSiteConfig(updated);
                      }}
                      placeholder="https://... hoặc /images/..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 font-mono"
                    />
                  </div>
                </div>

                {/* 2. ĐƯỜNG DẪN CHUYỂN TRANG KHI BẤM POSTER */}
                <div className="space-y-1.5">
                  <label className="text-sm text-neutral-800 font-bold block">
                    Đường dẫn khi click vào poster (Link đích chuyển trang)
                  </label>
                  <input
                    type="text"
                    value={config.sideBanners?.right?.link || ''}
                    onChange={(e) => {
                      const updated = {
                        ...config,
                        sideBanners: {
                          ...config.sideBanners,
                          right: { ...config.sideBanners?.right, link: e.target.value }
                        }
                      };
                      setConfig(updated);
                      saveSiteConfig(updated);
                    }}
                    placeholder="/khuyenmai, /dathang, /baiviet..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-amber-800 font-mono font-bold"
                  />
                  <span className="text-xs text-neutral-600 block font-medium">
                    Khách hàng bấm vào bất kỳ đâu trên poster sẽ chuyển ngay đến liên kết này.
                  </span>
                </div>

                {/* 3. NỘI DUNG CHỮ & CÁC NÚT BẬT / TẮT HIỂN THỊ */}
                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-black text-neutral-900 flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-amber-600" />
                      <span>Các Trường Chữ Đè Lên Poster (Bật / Tắt Từng Mục)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAllTextFields('right', false)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-600 hover:text-black border border-neutral-800 transition-colors font-bold cursor-pointer"
                        title="Tắt toàn bộ chữ để poster chỉ hiện ảnh thuần túy"
                      >
                        Tắt hết chữ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleAllTextFields('right', true)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 border border-amber-500/30 transition-colors font-bold cursor-pointer"
                        title="Bật hiển thị cả 4 dòng chữ"
                      >
                        Bật hết chữ
                      </button>
                    </div>
                  </div>

                  {/* 1. Huy hiệu góc trên (Badge) */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    config.sideBanners?.right?.showBadge
                      ? 'bg-neutral-900/90 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-950 border-neutral-900'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <span>Huy hiệu góc trên (Badge)</span>
                        {config.sideBanners?.right?.showBadge ? (
                          <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-medium bg-neutral-800/40 px-1.5 py-0.5 rounded">
                            Đang tắt
                          </span>
                        )}
                      </span>
                      {/* NÚT BẬT / TẮT */}
                      <button
                        type="button"
                        onClick={() => handleToggleBannerField('right', 'showBadge')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          config.sideBanners?.right?.showBadge
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.sideBanners?.right?.showBadge ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.sideBanners?.right?.showBadge ? 'BẬT HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={config.sideBanners?.right?.badge || ''}
                      onChange={(e) => handleUpdateBannerField('right', 'badge', e.target.value)}
                      placeholder="Ví dụ: 69K, HOT, COMBO..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-medium focus:border-amber-500/50 outline-none"
                    />
                  </div>

                  {/* 2. Tiêu đề lớn */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    config.sideBanners?.right?.showTitle
                      ? 'bg-neutral-900/90 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-950 border-neutral-900'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <span>Tiêu đề lớn</span>
                        {config.sideBanners?.right?.showTitle ? (
                          <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-medium bg-neutral-800/40 px-1.5 py-0.5 rounded">
                            Đang tắt
                          </span>
                        )}
                      </span>
                      {/* NÚT BẬT / TẮT */}
                      <button
                        type="button"
                        onClick={() => handleToggleBannerField('right', 'showTitle')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          config.sideBanners?.right?.showTitle
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.sideBanners?.right?.showTitle ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.sideBanners?.right?.showTitle ? 'BẬT HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={config.sideBanners?.right?.title || ''}
                      onChange={(e) => handleUpdateBannerField('right', 'title', e.target.value)}
                      placeholder="Ví dụ: COMBO HOT, ƯU ĐÃI ĐÊM..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-bold focus:border-amber-500/50 outline-none"
                    />
                  </div>

                  {/* 3. Tên món / Phụ đề */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    config.sideBanners?.right?.showSubtitle
                      ? 'bg-neutral-900/90 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-950 border-neutral-900'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <span>Tên món / Phụ đề</span>
                        {config.sideBanners?.right?.showSubtitle ? (
                          <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-medium bg-neutral-800/40 px-1.5 py-0.5 rounded">
                            Đang tắt
                          </span>
                        )}
                      </span>
                      {/* NÚT BẬT / TẮT */}
                      <button
                        type="button"
                        onClick={() => handleToggleBannerField('right', 'showSubtitle')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          config.sideBanners?.right?.showSubtitle
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.sideBanners?.right?.showSubtitle ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.sideBanners?.right?.showSubtitle ? 'BẬT HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={config.sideBanners?.right?.subtitle || ''}
                      onChange={(e) => handleUpdateBannerField('right', 'subtitle', e.target.value)}
                      placeholder="Ví dụ: Cà Phê & Croissant..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-medium focus:border-amber-500/50 outline-none"
                    />
                  </div>

                  {/* 4. Mô tả ngắn */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    config.sideBanners?.right?.showDesc
                      ? 'bg-neutral-900/90 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-950 border-neutral-900'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <span>Mô tả ngắn</span>
                        {config.sideBanners?.right?.showDesc ? (
                          <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-medium bg-neutral-800/40 px-1.5 py-0.5 rounded">
                            Đang tắt
                          </span>
                        )}
                      </span>
                      {/* NÚT BẬT / TẮT */}
                      <button
                        type="button"
                        onClick={() => handleToggleBannerField('right', 'showDesc')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          config.sideBanners?.right?.showDesc
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.sideBanners?.right?.showDesc ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.sideBanners?.right?.showDesc ? 'BẬT HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={config.sideBanners?.right?.desc || ''}
                      onChange={(e) => handleUpdateBannerField('right', 'desc', e.target.value)}
                      placeholder="Ví dụ: Combo sáng năng lượng chỉ 69K..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-medium focus:border-amber-500/50 outline-none"
                    />
                  </div>
                </div>

                {/* 4. KHUNG XEM TRƯỚC POSTER (TỰ ĐỘNG CO GIÃN THEO TỈ LỆ ẢNH) */}
                <div className="pt-3 border-t border-neutral-900 flex items-start gap-4">
                  <div 
                    className="relative w-36 shrink-0 rounded-2xl overflow-hidden border-2 border-neutral-700 shadow-xl bg-neutral-900 max-h-80"
                  >
                    <img 
                      src={config.sideBanners?.right?.image || '/images/poster_vertical_right.jpg'} 
                      alt="Preview Right" 
                      className="w-full h-auto block"
                    />

                    {/* Huy hiệu xem trước */}
                    {config.sideBanners?.right?.showBadge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow z-30">
                        {config.sideBanners.right.badge || '69K'}
                      </span>
                    )}

                    {/* Lớp chữ xem trước */}
                    {(config.sideBanners?.right?.showTitle || config.sideBanners?.right?.showSubtitle || config.sideBanners?.right?.showDesc) && (
                      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-1 text-white z-30 pointer-events-none">
                        {config.sideBanners?.right?.showTitle && (
                          <h5 className="text-xs font-black text-amber-300 uppercase leading-tight line-clamp-1 drop-shadow-sm">
                            {config.sideBanners.right.title || 'COMBO HOT'}
                          </h5>
                        )}
                        {config.sideBanners?.right?.showSubtitle && (
                          <p className="text-xs font-black text-white leading-tight line-clamp-1 drop-shadow-sm">
                            {config.sideBanners.right.subtitle || 'Cà Phê & Croissant'}
                          </p>
                        )}
                        {config.sideBanners?.right?.showDesc && (
                          <p className="text-[10px] text-stone-200 leading-tight line-clamp-2 drop-shadow-sm">
                            {config.sideBanners.right.desc || 'Combo sáng năng lượng chỉ 69K'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm flex-1">
                    <span className="text-neutral-700 font-semibold block">Xem trước trực tiếp:</span>
                    <span className="text-amber-800 font-bold block text-sm">Poster Phải (Tự động co giãn theo tỉ lệ ảnh)</span>
                    <span className="text-neutral-600 block text-xs font-mono">Đích đến: {config.sideBanners?.right?.link || '/khuyenmai'}</span>
                    
                    {/* Trạng thái hiển thị chữ */}
                    <div className="pt-1">
                      {!(config.sideBanners?.right?.showBadge || config.sideBanners?.right?.showTitle || config.sideBanners?.right?.showSubtitle || config.sideBanners?.right?.showDesc) ? (
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-800 text-xs font-bold border border-emerald-500/30">
                          ✨ Đang ở chế độ Ảnh Thuần Túy (Không đè chữ)
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-900 text-xs font-bold border border-amber-500/30">
                          👁️ Đang hiển thị chữ đè lên ảnh
                        </span>
                      )}
                    </div>

                    {config.sideBanners?.right?.image?.startsWith('data:image') && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                        ✓ Ảnh tải lên từ thiết bị đã lưu
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* THÔNG BÁO CHUYỂN TIẾP SANG TAB MÓN MỚI CHUYÊN BIỆT */}
            <div className="pt-8 border-t border-neutral-800">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-950/40 via-neutral-900 to-neutral-950 border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-orange-500 text-black shadow-lg">
                    <Flame className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>Quản Lý Món Mới & Chương Trình Ưu Đãi (Poster Dọc 3:4)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30">
                        2 Mục Riêng Biệt
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Đã được tách thành 2 tab chuyên biệt: Món Mới Trình Làng và Chương Trình Ưu Đãi để quản lý riêng rẽ, nén ảnh tự động và trượt xem tiện lợi.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('newDishes')}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all whitespace-nowrap"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Quản Lý Món Mới</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('promotions')}
                    className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all whitespace-nowrap"
                  >
                    <Percent className="w-3.5 h-3.5" />
                    <span>Quản Lý Ưu Đãi</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSaveConfig}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>LƯU CẤU HÌNH 2 POSTER DỌC 2 BÊN</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB: QUẢN LÝ CÁC KHỐI BANNER & CHECK-IN TRANG CHỦ */}
        {activeTab === 'bannerSections' && (
          <div className="space-y-10">
            {/* Page Header */}
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                <span>Quản Lý Các Khối Banner & Check-in (Ẩn / Hiện & Chỉnh Sửa)</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Tùy chỉnh nội dung chữ, bật/tắt từng trường hiển thị hoặc bật/tắt toàn bộ cho Banner Ưu Đãi Đêm (Trang chủ) và Khối Check-in Hashtag (Trên chân trang).
              </p>
            </div>

            {/* KHỐI 1: BANNER CỘNG ĐỒNG CÀY DEADLINE & HỌC NHÓM 24/24 */}
            <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      1. BANNER ƯU ĐÃI ĐÊM & HỌC NHÓM
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">Nằm trong Khối Khuyến Mãi Trang Chủ</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Banner nền gradient cà phê đậm với huy hiệu lấp lánh, tiêu đề lớn, đoạn mô tả và nút điều hướng xem ưu đãi.
                  </p>
                </div>

                {/* Master Toggle Banner 1 */}
                <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-2 px-3.5 rounded-2xl flex-shrink-0">
                  <span className="text-xs font-bold text-neutral-300">
                    Hiển thị Banner này:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleBonusField('enabled')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                      config.bonusPromoBanner?.enabled !== false
                        ? 'bg-emerald-500 text-black'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${config.bonusPromoBanner?.enabled !== false ? 'bg-black' : 'bg-red-500'}`}></span>
                    <span>{config.bonusPromoBanner?.enabled !== false ? 'ĐANG BẬT' : 'ĐANG TẮT'}</span>
                  </button>
                </div>
              </div>

              {/* Form fields with individual Hide/Show toggles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Input controls */}
                <div className="space-y-4">
                  
                  {/* Trường 1: Huy hiệu (Badge) */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    config.bonusPromoBanner?.showBadge !== false
                      ? 'bg-neutral-900/80 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-900/40 border-neutral-800/80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Huy hiệu nhỏ (Badge góc trên)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleBonusField('showBadge')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          config.bonusPromoBanner?.showBadge !== false
                            ? 'bg-emerald-500 text-black shadow-xs'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${config.bonusPromoBanner?.showBadge !== false ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.bonusPromoBanner?.showBadge !== false ? 'HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={config.bonusPromoBanner?.badgeText || ''}
                      onChange={(e) => handleUpdateBonusField('badgeText', e.target.value)}
                      placeholder="Cộng Đồng Cày Deadline & Học Nhóm 24/24"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-medium focus:border-amber-500/50 outline-none"
                    />
                  </div>

                  {/* Trường 2: Tiêu đề lớn (Title) */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    config.bonusPromoBanner?.showTitle !== false
                      ? 'bg-neutral-900/80 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-900/40 border-neutral-800/80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <Type className="w-3.5 h-3.5 text-amber-500" />
                        <span>Tiêu đề chính của Banner</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleBonusField('showTitle')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          config.bonusPromoBanner?.showTitle !== false
                            ? 'bg-emerald-500 text-black shadow-xs'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${config.bonusPromoBanner?.showTitle !== false ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.bonusPromoBanner?.showTitle !== false ? 'HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={config.bonusPromoBanner?.title || ''}
                      onChange={(e) => handleUpdateBonusField('title', e.target.value)}
                      placeholder="Bạn Cần Không Gian Xuyên Đêm & Ưu Đãi Nhóm?"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-bold focus:border-amber-500/50 outline-none"
                    />
                  </div>

                  {/* Trường 3: Đoạn mô tả (Description) */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    config.bonusPromoBanner?.showDesc !== false
                      ? 'bg-neutral-900/80 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-900/40 border-neutral-800/80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        <span>Đoạn mô tả chi tiết</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleBonusField('showDesc')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          config.bonusPromoBanner?.showDesc !== false
                            ? 'bg-emerald-500 text-black shadow-xs'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${config.bonusPromoBanner?.showDesc !== false ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.bonusPromoBanner?.showDesc !== false ? 'HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={config.bonusPromoBanner?.desc || ''}
                      onChange={(e) => handleUpdateBonusField('desc', e.target.value)}
                      placeholder="Khám phá thêm mã Mua 3 Tặng 1 cho nhóm học, voucher 40K bạn mới..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-600 font-medium focus:border-amber-500/50 outline-none resize-none"
                    />
                  </div>

                  {/* Trường 4: Nút bấm (Button) */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    config.bonusPromoBanner?.showButton !== false
                      ? 'bg-neutral-900/80 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-900/40 border-neutral-800/80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                        <span>Nút bấm hành động (CTA Button)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleBonusField('showButton')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          config.bonusPromoBanner?.showButton !== false
                            ? 'bg-emerald-500 text-black shadow-xs'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${config.bonusPromoBanner?.showButton !== false ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.bonusPromoBanner?.showButton !== false ? 'HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-neutral-400 block mb-1">Chữ trên nút:</span>
                        <input
                          type="text"
                          value={config.bonusPromoBanner?.buttonText || ''}
                          onChange={(e) => handleUpdateBonusField('buttonText', e.target.value)}
                          placeholder="Xem Trọn Bộ Ưu Đãi"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-bold focus:border-amber-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block mb-1">Đường dẫn khi click:</span>
                        <input
                          type="text"
                          value={config.bonusPromoBanner?.buttonLink || ''}
                          onChange={(e) => handleUpdateBonusField('buttonLink', e.target.value)}
                          placeholder="/khuyenmai"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-mono focus:border-amber-500/50 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right: Live Preview Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-500" />
                      <span>Xem Trước Trực Tiếp (Live Preview)</span>
                    </span>
                    <span className="text-[11px] text-neutral-500">Tự động cập nhật theo các nút bật/tắt</span>
                  </div>

                  <div className="p-4 sm:p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 min-h-[220px] flex items-center justify-center">
                    {config.bonusPromoBanner?.enabled === false ? (
                      <div className="text-center py-10 text-neutral-500 text-xs font-medium space-y-1">
                        <div className="text-base">🚫</div>
                        <p>Banner này đang bị TẮT hoàn toàn trên trang chủ.</p>
                      </div>
                    ) : (
                      <div className="w-full bg-gradient-to-r from-[#2b1808] via-[#4a2c11] to-[#3a1d06] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="space-y-2 text-center md:text-left">
                          {config.bonusPromoBanner?.showBadge !== false && config.bonusPromoBanner?.badgeText && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                              <Sparkles className="w-3.5 h-3.5" />
                              {config.bonusPromoBanner.badgeText}
                            </span>
                          )}
                          {config.bonusPromoBanner?.showTitle !== false && config.bonusPromoBanner?.title && (
                            <h3 className="text-lg sm:text-xl font-black text-amber-100">
                              {config.bonusPromoBanner.title}
                            </h3>
                          )}
                          {config.bonusPromoBanner?.showDesc !== false && config.bonusPromoBanner?.desc && (
                            <p className="text-xs text-stone-300 max-w-xl">
                              {config.bonusPromoBanner.desc}
                            </p>
                          )}
                        </div>

                        {config.bonusPromoBanner?.showButton !== false && config.bonusPromoBanner?.buttonText && (
                          <div className="px-5 py-2.5 rounded-full bg-amber-500 text-[#2b1808] font-black text-xs whitespace-nowrap shadow-lg flex items-center gap-1.5 flex-shrink-0">
                            <span>{config.bonusPromoBanner.buttonText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* KHỐI 2: GHÉ QUÁN & CHECK-IN CÙNG HASHTAG #COFFEE2424 */}
            <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 uppercase">
                      2. KHỐI CHECK-IN HASHTAG & NHẬN VOUCHER 20%
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">Nằm trong Khối Mạng Xã Hội trên Chân Trang</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Khối thông báo quà tặng voucher 20% khi khách chụp ảnh check-in và gắn thẻ thương hiệu cùng các thẻ hashtag.
                  </p>
                </div>

                {/* Master Toggle Banner 2 */}
                <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-2 px-3.5 rounded-2xl flex-shrink-0">
                  <span className="text-xs font-bold text-neutral-300">
                    Hiển thị Khối này:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleCheckinField('enabled')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                      config.checkinHashtagBanner?.enabled !== false
                        ? 'bg-emerald-500 text-black'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${config.checkinHashtagBanner?.enabled !== false ? 'bg-black' : 'bg-red-500'}`}></span>
                    <span>{config.checkinHashtagBanner?.enabled !== false ? 'ĐANG BẬT' : 'ĐANG TẮT'}</span>
                  </button>
                </div>
              </div>

              {/* Form fields with individual Hide/Show toggles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Input controls */}
                <div className="space-y-4">
                  
                  {/* Trường 1: Tiêu đề & Từ khóa hashtag */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    config.checkinHashtagBanner?.showTitle !== false
                      ? 'bg-neutral-900/80 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-900/40 border-neutral-800/80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <Type className="w-3.5 h-3.5 text-amber-500" />
                        <span>Tiêu đề khối Check-in</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleCheckinField('showTitle')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          config.checkinHashtagBanner?.showTitle !== false
                            ? 'bg-emerald-500 text-black shadow-xs'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${config.checkinHashtagBanner?.showTitle !== false ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.checkinHashtagBanner?.showTitle !== false ? 'HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-neutral-400 block mb-1">Dòng chữ tiêu đề:</span>
                        <input
                          type="text"
                          value={config.checkinHashtagBanner?.title || ''}
                          onChange={(e) => handleUpdateCheckinField('title', e.target.value)}
                          placeholder="Ghé quán & Check-in cùng hashtag"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 font-bold focus:border-amber-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block mb-1">Hashtag nhấn mạnh:</span>
                        <input
                          type="text"
                          value={config.checkinHashtagBanner?.highlightTag || ''}
                          onChange={(e) => handleUpdateCheckinField('highlightTag', e.target.value)}
                          placeholder="#Coffee2424"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold focus:border-amber-500/50 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trường 2: Đoạn mô tả ưu đãi */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    config.checkinHashtagBanner?.showDesc !== false
                      ? 'bg-neutral-900/80 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-900/40 border-neutral-800/80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        <span>Mô tả thể lệ quà tặng check-in</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleCheckinField('showDesc')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          config.checkinHashtagBanner?.showDesc !== false
                            ? 'bg-emerald-500 text-black shadow-xs'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${config.checkinHashtagBanner?.showDesc !== false ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.checkinHashtagBanner?.showDesc !== false ? 'HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={config.checkinHashtagBanner?.desc || ''}
                      onChange={(e) => handleUpdateCheckinField('desc', e.target.value)}
                      placeholder="Gắn thẻ @coffee2424 trên Instagram hoặc TikTok để nhận ngay voucher giảm 20%..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-600 font-medium focus:border-amber-500/50 outline-none resize-none"
                    />
                  </div>

                  {/* Trường 3: Cụm thẻ Hashtags */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    config.checkinHashtagBanner?.showHashtags !== false
                      ? 'bg-neutral-900/80 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-900/40 border-neutral-800/80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Cụm thẻ Hashtag bên phải</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleCheckinField('showHashtags')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          config.checkinHashtagBanner?.showHashtags !== false
                            ? 'bg-emerald-500 text-black shadow-xs'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${config.checkinHashtagBanner?.showHashtags !== false ? 'bg-black' : 'bg-neutral-600'}`}></span>
                        <span>{config.checkinHashtagBanner?.showHashtags !== false ? 'HIỂN THỊ' : 'ĐANG ẨN'}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-neutral-400 block mb-1">Hashtag 1:</span>
                        <input
                          type="text"
                          value={config.checkinHashtagBanner?.hashtag1 || ''}
                          onChange={(e) => handleUpdateCheckinField('hashtag1', e.target.value)}
                          placeholder="#Coffee2424"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-amber-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block mb-1">Hashtag 2:</span>
                        <input
                          type="text"
                          value={config.checkinHashtagBanner?.hashtag2 || ''}
                          onChange={(e) => handleUpdateCheckinField('hashtag2', e.target.value)}
                          placeholder="#ThucCungDamMe"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold focus:border-amber-500/50 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right: Live Preview Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-500" />
                      <span>Xem Trước Trực Tiếp (Live Preview)</span>
                    </span>
                    <span className="text-[11px] text-neutral-500">Tự động cập nhật theo các nút bật/tắt</span>
                  </div>

                  <div className="p-4 sm:p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 min-h-[220px] flex items-center justify-center">
                    {config.checkinHashtagBanner?.enabled === false ? (
                      <div className="text-center py-10 text-neutral-500 text-xs font-medium space-y-1">
                        <div className="text-base">🚫</div>
                        <p>Khối Check-in này đang bị TẮT hoàn toàn trên website.</p>
                      </div>
                    ) : (
                      <div className="w-full rounded-3xl bg-[#faf8f5] border border-stone-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-stone-900 shadow-md">
                        <div className="space-y-1">
                          {config.checkinHashtagBanner?.showTitle !== false && (
                            <h4 className="font-black text-stone-900 text-base sm:text-lg">
                              {config.checkinHashtagBanner?.title || 'Ghé quán & Check-in cùng hashtag'}{' '}
                              {config.checkinHashtagBanner?.highlightTag && (
                                <span className="text-[#4a2c11]">{config.checkinHashtagBanner.highlightTag}</span>
                              )}
                            </h4>
                          )}
                          {config.checkinHashtagBanner?.showDesc !== false && config.checkinHashtagBanner?.desc && (
                            <p className="text-xs text-stone-600">
                              {config.checkinHashtagBanner.desc}
                            </p>
                          )}
                        </div>

                        {config.checkinHashtagBanner?.showHashtags !== false && (
                          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-center">
                            {config.checkinHashtagBanner?.hashtag1 && (
                              <span className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-stone-800 font-mono text-xs font-bold shadow-2xs">
                                {config.checkinHashtagBanner.hashtag1}
                              </span>
                            )}
                            {config.checkinHashtagBanner?.hashtag2 && (
                              <span className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-[#4a2c11] font-mono text-xs font-bold shadow-2xs">
                                {config.checkinHashtagBanner.hashtag2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                onClick={handleSaveConfig}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>LƯU CẤU HÌNH CÁC KHỐI BANNER</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MENU ĐIỀU HƯỚNG & CÁC TRANG WEB */}
        {activeTab === 'navigation' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-500" />
                  <span>Quản Lý Menu Điều Hướng & Các Trang Website</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Bật / tắt trang hiển thị trên thanh Header, đổi tên nút menu hoặc thêm liên kết trang mới.
                </p>
              </div>

              <button
                onClick={handleAddNavItem}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Trang / Menu Mới</span>
              </button>
            </div>

            <div className="space-y-3">
              {(config.navMenu || []).map((navItem, idx) => (
                <div 
                  key={navItem.id || idx}
                  className="bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-mono text-neutral-400">
                      {idx + 1}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className="text-[11px] text-neutral-500 block mb-1">Tên hiển thị trên Menu</label>
                        <input
                          type="text"
                          value={navItem.label}
                          onChange={(e) => updateNavLabel(navItem.id, e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-neutral-500 block mb-1">Đường dẫn (URL / Path)</label>
                        <input
                          type="text"
                          value={navItem.path}
                          onChange={(e) => {
                            const updatedNav = [...config.navMenu];
                            updatedNav[idx].path = e.target.value;
                            setConfig({ ...config, navMenu: updatedNav });
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* Visibility Toggle Button */}
                    <button
                      onClick={() => toggleNavVisibility(navItem.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        navItem.visible !== false
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-neutral-900 text-neutral-500 border border-neutral-800 hover:text-neutral-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${navItem.visible !== false ? 'bg-emerald-400' : 'bg-neutral-600'}`}></span>
                      <span>{navItem.visible !== false ? 'Đang Hiển Thị' : 'Đang Ẩn'}</span>
                    </button>

                    {/* Delete button (only for custom pages) */}
                    {idx >= 6 && (
                      <button
                        onClick={() => handleRemoveNavItem(navItem.id)}
                        className="p-2 rounded-xl bg-neutral-900 text-neutral-500 hover:text-red-400 border border-neutral-800"
                        title="Xóa menu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveConfig}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>LƯU CẤU HÌNH MENU</span>
            </button>
          </div>
        )}

        {/* TAB: TRANG GIỚI THIỆU (ABOUT PAGE CMS) */}
        {activeTab === 'about' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Nội Dung Trang Giới Thiệu (About Us)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Chỉnh sửa câu chuyện thương hiệu, sứ mệnh phục vụ 4 đối tượng và 6 tiện nghi cao cấp 24/7.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/gioithieu')}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span>Xem Trang Ngoài</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>LƯU NỘI DUNG</span>
                </button>
              </div>
            </div>

            {/* PHẦN 1: HERO BANNER & TIÊU ĐỀ CHÍNH */}
            <div id="about-part-1" className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
                <span className="text-amber-400 font-black text-xs uppercase tracking-wider">Phần 1</span>
                <span className="text-white font-black text-sm">Hero Banner & Khẩu Hiệu Thương Hiệu</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Huy Hiệu Vàng (Hero Badge)</label>
                <input
                  type="text"
                  value={config.aboutPage?.heroBadge || ''}
                  onChange={(e) => updateAboutField('heroBadge', e.target.value)}
                  placeholder="VD: Câu Chuyện Thương Hiệu COFFEE 24/24"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Tiêu Đề Lớn (Hero Title H1) *</label>
                <textarea
                  rows={2}
                  value={config.aboutPage?.heroTitle || ''}
                  onChange={(e) => updateAboutField('heroTitle', e.target.value)}
                  placeholder="Tiêu đề chính của trang giới thiệu..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-black focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Đoạn Văn Mô Tả Sứ Mệnh (Hero Subtitle) *</label>
                <textarea
                  rows={3}
                  value={config.aboutPage?.heroSubtitle || ''}
                  onChange={(e) => updateAboutField('heroSubtitle', e.target.value)}
                  placeholder="Nội dung truyền cảm hứng về không gian 24/7..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-300 leading-relaxed focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* PHẦN 2: 4 NHÓM ĐỐI TƯỢNG & SỨ MỆNH PHỤC VỤ */}
            <div id="about-part-2" className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-black text-xs uppercase tracking-wider">Phần 2</span>
                  <span className="text-white font-black text-sm">4 Nhóm Khách Hàng Mục Tiêu & Giải Pháp</span>
                </div>
                <span className="text-[11px] font-bold text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
                  4 Thẻ Phân Khu
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Tiêu Đề Khu Vực</label>
                  <input
                    type="text"
                    value={config.aboutPage?.missionsTitle || ''}
                    onChange={(e) => updateAboutField('missionsTitle', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Mô Tả Ngắn Phụ</label>
                  <input
                    type="text"
                    value={config.aboutPage?.missionsDesc || ''}
                    onChange={(e) => updateAboutField('missionsDesc', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {(config.aboutPage?.missions || []).map((m, idx) => (
                  <div key={m.id || idx} className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </span>
                        <span>Nhóm {idx + 1}</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">ID: {m.id}</span>
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Tiêu đề nhóm</label>
                      <input
                        type="text"
                        value={m.title || ''}
                        onChange={(e) => updateAboutMission(idx, 'title', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Nội dung mô tả</label>
                      <textarea
                        rows={3}
                        value={m.desc || ''}
                        onChange={(e) => updateAboutMission(idx, 'desc', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHẦN 3: 6 TIỆN NGHI 5 SAO PHỤC VỤ 24/24 */}
            <div id="about-part-3" className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-black text-xs uppercase tracking-wider">Phần 3</span>
                  <span className="text-white font-black text-sm">6 Tiện Nghi Đẳng Cấp Trang Bị 24/24</span>
                </div>
                <span className="text-[11px] font-bold text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
                  6 Tiện Ích
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Tiêu Đề Khu Vực</label>
                  <input
                    type="text"
                    value={config.aboutPage?.amenitiesTitle || ''}
                    onChange={(e) => updateAboutField('amenitiesTitle', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Mô Tả Ngắn Phụ</label>
                  <input
                    type="text"
                    value={config.aboutPage?.amenitiesDesc || ''}
                    onChange={(e) => updateAboutField('amenitiesDesc', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {(config.aboutPage?.amenities || []).map((a, idx) => (
                  <div key={a.id || idx} className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </span>
                        <span>Tiện ích {idx + 1}</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">ID: {a.id}</span>
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Tên tiện nghi</label>
                      <input
                        type="text"
                        value={a.title || ''}
                        onChange={(e) => updateAboutAmenity(idx, 'title', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Mô tả chi tiết</label>
                      <textarea
                        rows={3}
                        value={a.desc || ''}
                        onChange={(e) => updateAboutAmenity(idx, 'desc', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-xl cursor-pointer"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>LƯU TẤT CẢ NỘI DUNG TRANG GIỚI THIỆU</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BÀI VIẾT & SEO CMS */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <span>Danh Sách Bài Viết & Tối Ưu Hóa SEO</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Đăng bài chia sẻ cẩm nang cà phê, tối ưu Google Search, tiêu đề thẻ meta và từ khóa SEO.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingArticle({
                    title: '',
                    slug: '',
                    category: 'Không Gian 24/7',
                    excerpt: '',
                    content: '',
                    coverImage: '/images/blog_workspace.jpg',
                    author: 'Admin Coffee 24/24',
                    readTime: '4 phút đọc',
                    seoTitle: '',
                    seoDescription: '',
                    keywords: ['coffee 24/24', 'cà phê 24/7']
                  });
                  setIsNewPost(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Viết Bài Mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {articles.map((art) => (
                <div 
                  key={art.id}
                  className="bg-neutral-950 rounded-2xl p-4 sm:p-5 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={art.coverImage} 
                      alt={art.title} 
                      className="w-20 h-20 rounded-xl object-cover bg-neutral-900 flex-shrink-0" 
                    />
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        {art.category}
                      </span>
                      <h3 className="font-bold text-white text-base leading-snug line-clamp-1">{art.title}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-1">{art.excerpt}</p>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-1">
                        <span>Ngày: {art.date}</span>
                        <span>•</span>
                        <span>{art.readTime}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">SEO: Chuẩn Top 1</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setEditingArticle(art);
                        setIsNewPost(false);
                      }}
                      className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-neutral-800"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sửa bài</span>
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="p-2 rounded-xl bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 text-xs transition-colors cursor-pointer border border-neutral-800"
                      title="Xóa bài"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: 2 CHI NHÁNH & HOTLINE */}
        {activeTab === 'branches' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Quản Lý 2 Chi Nhánh & Hotline Tổng</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Cập nhật chính xác số điện thoại và đường dẫn đặt hàng trực tuyến KiotViet cho từng chi nhánh.
              </p>
            </div>

            {/* Hotline tổng */}
            <div id="branches-hotline" className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 space-y-4">
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                1. Hotline Tổng & Email CSKH
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1 font-bold">
                    Hotline Tổng Phục Vụ 24/7 *
                  </label>
                  <input
                    type="text"
                    value={config.hotlineGeneral || '0906 916 816'}
                    onChange={(e) => setConfig({ ...config, hotlineGeneral: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">Mặc định: 0906 916 816</span>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1 font-bold">
                    Email Liên Hệ
                  </label>
                  <input
                    type="text"
                    value={config.email || 'contact@coffee2424.com'}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">Email hỗ trợ khách hàng</span>
                </div>
              </div>
            </div>

            {/* 2 Chi Nhánh Thực Tế */}
            <div id="branches-locations" className="space-y-4">
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                2. Thông Tin Chi Tiết 2 Chi Nhánh
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {branchesList.map((branch, idx) => (
                  <div key={branch.id} className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                      <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        MÃ: {branch.code}
                      </span>
                      <span className="text-xs text-emerald-400 font-bold">24/7 OPEN</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-neutral-400 block mb-1">Tên Chi Nhánh</label>
                        <input
                          type="text"
                          value={branch.name}
                          onChange={(e) => {
                            const copy = [...branchesList];
                            copy[idx].name = e.target.value;
                            setBranchesList(copy);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-neutral-400 block mb-1">Hotline Chi Nhánh (Chính xác)</label>
                        <input
                          type="text"
                          value={branch.hotline}
                          onChange={(e) => {
                            const copy = [...branchesList];
                            copy[idx].hotline = e.target.value;
                            setBranchesList(copy);
                          }}
                          className="w-full bg-neutral-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white font-black"
                        />
                        <span className="text-[11px] text-amber-400/80 mt-0.5 block">
                          {branch.code === '413PHI' ? 'Hotline PHI: 0986511897' : 'Hotline D5: 0347374858'}
                        </span>
                      </div>

                      <div>
                        <label className="text-xs text-neutral-400 block mb-1">Địa chỉ thực tế</label>
                        <input
                          type="text"
                          value={branch.address}
                          onChange={(e) => {
                            const copy = [...branchesList];
                            copy[idx].address = e.target.value;
                            setBranchesList(copy);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-neutral-400 block mb-1">Link Web Menu KiotViet</label>
                        <input
                          type="text"
                          value={branch.menuUrl}
                          onChange={(e) => {
                            const copy = [...branchesList];
                            copy[idx].menuUrl = e.target.value;
                            setBranchesList(copy);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveBranches}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>LƯU THAY ĐỔI CHI NHÁNH & HOTLINE</span>
            </button>
          </div>
        )}

        {/* TAB 5: SLOGAN & NỘI DUNG TRANG CHỦ */}
        {activeTab === 'theme' && (
          <form onSubmit={handleSaveConfig} className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                <span>Chỉnh Sửa Slogan & Nội Dung Trang Chủ</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">Thay đổi thương hiệu, slogan, tiêu đề banner và thanh thông báo chạy trên đầu web.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Tên Thương Hiệu</label>
                <input
                  type="text"
                  value={config.brandName || 'COFFEE 24/24'}
                  onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Slogan Thương Hiệu</label>
                <input
                  type="text"
                  value={config.slogan || 'Enjoy Your Life'}
                  onChange={(e) => setConfig({ ...config, slogan: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Tiêu Đề Banner Trang Chủ (Hero Headline)</label>
                <input
                  type="text"
                  value={config.heroHeadline || 'CÀ PHÊ 24/24'}
                  onChange={(e) => setConfig({ ...config, heroHeadline: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Mô Tả Ngắn Trang Chủ</label>
                <textarea
                  rows={2}
                  value={config.heroSubheadline || 'Không gian mở cửa 24/7 xuyên đêm.'}
                  onChange={(e) => setConfig({ ...config, heroSubheadline: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              {/* Announcement Bar */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Thanh Thông Báo Trên Cùng (Top Announcement Bar)</span>
                  <input
                    type="checkbox"
                    checked={config.announcementBar?.enabled}
                    onChange={(e) => setConfig({
                      ...config,
                      announcementBar: { ...config.announcementBar, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={config.announcementBar?.text || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    announcementBar: { ...config.announcementBar, text: e.target.value }
                  })}
                  placeholder="Nội dung khuyến mãi hiển thị trên đầu web..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>LƯU NỘI DUNG TRANG CHỦ</span>
            </button>
          </form>
        )}

        {/* TAB: MẠNG XÃ HỘI & ZALO OFFICIAL ACCOUNT */}
        {activeTab === 'socialZalo' && (
          <div className="space-y-8 max-w-5xl">
            {/* Header Box */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-950 p-6 rounded-3xl border border-neutral-800">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      Mạng Xã Hội & Zalo Official Account
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">
                        Đang Hoạt Động
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Tùy chỉnh liên kết Facebook, TikTok, Instagram, Threads, YouTube và mã QR Zalo OA ở chân trang.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => window.open('/', '_blank')}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Xem Website Khách</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black inline-flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>LƯU TẤT CẢ THAY ĐỔI</span>
                </button>
              </div>
            </div>

            {/* KHỐI 1: ZALO OFFICIAL ACCOUNT & MÃ QR (ĐẶT Ở CHÂN TRANG THAY THẾ CHỖ MENU 2 CHI NHÁNH) */}
            <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-neutral-800/80 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">
                    Z
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      Zalo Official Account & Mã QR Chân Trang
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold border border-blue-500/30">
                        Chân Trang & Slide 5
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Thay thế mục quét menu 2 chi nhánh ở dưới cùng để tập trung nhận diện Zalo OA & tích điểm khách hàng.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-300 font-semibold">Trạng thái:</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateZaloOA('enabled', !(config.zaloOA?.enabled !== false))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      config.zaloOA?.enabled !== false
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {config.zaloOA?.enabled !== false ? '✓ Đang Bật' : '✕ Đang Tắt'}
                  </button>
                </div>
              </div>

              {/* Tùy chọn Chế độ hiển thị Chân Trang */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-neutral-200 block uppercase tracking-wider">
                  Chế Độ Hiển Thị Ở Khối Chân Trang:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleUpdateZaloOA('displayMode', 'zalo_only')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      (config.zaloOA?.displayMode || 'zalo_only') === 'zalo_only'
                        ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white">Chỉ Zalo OA</span>
                      {(config.zaloOA?.displayMode || 'zalo_only') === 'zalo_only' && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <span className="text-[11px] block leading-tight text-neutral-400">
                      ★ Khuyên Dùng: Thay thế 2 QR chi nhánh bằng Zalo OA chính thức
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateZaloOA('displayMode', 'both')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      config.zaloOA?.displayMode === 'both'
                        ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white">Cả Zalo OA & Menu</span>
                      {config.zaloOA?.displayMode === 'both' && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <span className="text-[11px] block leading-tight text-neutral-400">
                      Hiển thị Zalo OA ở trên kèm 2 mã menu chi nhánh bên dưới
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateZaloOA('displayMode', 'branch_menu_only')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      config.zaloOA?.displayMode === 'branch_menu_only'
                        ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white">Chỉ Menu 2 Chi Nhánh</span>
                      {config.zaloOA?.displayMode === 'branch_menu_only' && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <span className="text-[11px] block leading-tight text-neutral-400">
                      Chỉ hiển thị QR menu 413PHI & 96D5
                    </span>
                  </button>
                </div>
              </div>

              {/* Chi tiết nội dung Zalo OA */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
                {/* Cột trái: Form thông tin */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1">
                        Tiêu Đề Cột (Heading)
                      </label>
                      <input
                        type="text"
                        value={config.zaloOA?.title || ''}
                        onChange={(e) => handleUpdateZaloOA('title', e.target.value)}
                        placeholder="Zalo Official Account"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1">
                        Huy Hiệu (Badge)
                      </label>
                      <input
                        type="text"
                        value={config.zaloOA?.badge || ''}
                        onChange={(e) => handleUpdateZaloOA('badge', e.target.value)}
                        placeholder="KẾT NỐI CHÍNH THỨC"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1">
                        Liên Kết Zalo OA (URL)
                      </label>
                      <input
                        type="text"
                        value={config.zaloOA?.url || ''}
                        onChange={(e) => handleUpdateZaloOA('url', e.target.value)}
                        placeholder="https://zalo.me/197464281190102692"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1">
                        Mã Zalo OA ID
                      </label>
                      <input
                        type="text"
                        value={config.zaloOA?.oaId || ''}
                        onChange={(e) => handleUpdateZaloOA('oaId', e.target.value)}
                        placeholder="197464281190102692"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Mô Tả Hướng Dẫn Quét Mã
                    </label>
                    <textarea
                      rows={2}
                      value={config.zaloOA?.desc || ''}
                      onChange={(e) => handleUpdateZaloOA('desc', e.target.value)}
                      placeholder="Quét mã QR bằng ứng dụng Zalo để nhận ngay ưu đãi thành viên & hỗ trợ 24/7..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Chữ Nút Bấm Hành Động (Call-to-Action)
                    </label>
                    <input
                      type="text"
                      value={config.zaloOA?.buttonText || ''}
                      onChange={(e) => handleUpdateZaloOA('buttonText', e.target.value)}
                      placeholder="Mở Zalo OA Nhận Ưu Đãi"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                    />
                  </div>
                </div>

                {/* Cột phải: Quản lý ảnh QR Zalo OA */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center space-y-3">
                  <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                    Ảnh Mã QR Zalo OA Hiện Tại
                  </span>
                  
                  <div className="relative p-2.5 bg-white rounded-2xl border-2 border-dashed border-blue-500/50 shadow-md group">
                    <img
                      src={config.zaloOA?.qrImage || '/images/qr_zalo_oa.png'}
                      alt="Zalo QR Preview"
                      className="w-32 h-32 object-contain rounded-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                      Z
                    </div>
                  </div>

                  <div className="w-full space-y-2 pt-1">
                    <label className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black tracking-wide inline-flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải Ảnh QR Mới Lên</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleZaloQrUpload}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateZaloOA('qrImage', '/images/qr_zalo_oa.png');
                        try { localStorage.removeItem('coffee2424_zalo_qr_img'); } catch {}
                        triggerAlert('Đã khôi phục ảnh QR Zalo gốc ban đầu!');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      Khôi Phục QR Mặc Định
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* KHỐI 2: QUẢN LÝ 6 NỀN TẢNG MẠNG XÃ HỘI (Facebook, TikTok, Instagram, Threads, YouTube, Zalo) */}
            <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-neutral-800/80 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      Kết Nối Mạng Xã Hội (6 Nền Tảng)
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-extrabold border border-pink-500/30">
                        Top Slide 5 & Chân Trang
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Đã kết nối Facebook, TikTok & Zalo OA; Chừa sẵn các ô nhúng cho Instagram, Threads, YouTube.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                    {(config.socialMedia?.platforms || []).filter(p => p.visible !== false).length}/6 Kênh Hiển Thị
                  </span>
                </div>
              </div>

              {/* Tiêu đề nhóm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Tiêu Đề Dòng Tag (Section Title)
                  </label>
                  <input
                    type="text"
                    value={config.socialMedia?.sectionTitle || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      socialMedia: { ...(config.socialMedia || {}), sectionTitle: e.target.value }
                    })}
                    placeholder="FOLLOW OUR JOURNEY · #ENJOYYOURLIFE"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Tiêu Đề Lớn (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={config.socialMedia?.sectionSubtitle || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      socialMedia: { ...(config.socialMedia || {}), sectionSubtitle: e.target.value }
                    })}
                    placeholder="Kết nối cùng cộng đồng COFFEE 24/24"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                  />
                </div>
              </div>

              {/* Danh sách 6 nền tảng */}
              <div className="space-y-4">
                {(config.socialMedia?.platforms || []).map((platform) => {
                  const IconComp = BrandIcons[platform.id] || BrandIcons.facebook;
                  const isVisible = platform.visible !== false;

                  return (
                    <div
                      key={platform.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isVisible
                          ? 'bg-neutral-900 border-neutral-800'
                          : 'bg-neutral-900/40 border-neutral-800/50 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-800/70">
                        {/* Title & Brand Icon */}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${
                            platform.id === 'facebook'
                              ? 'bg-blue-600'
                              : platform.id === 'tiktok'
                              ? 'bg-black border border-white/20'
                              : platform.id === 'instagram'
                              ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                              : platform.id === 'threads'
                              ? 'bg-black border border-white/20'
                              : platform.id === 'zalo'
                              ? 'bg-[#0068FF]'
                              : 'bg-red-600'
                          }`}>
                            <IconComp />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white">{platform.name}</h4>
                              {platform.isPlaceholder ? (
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30">
                                  Ô Chờ Nhúng
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                                  Đang Hoạt Động
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-neutral-400 block mt-0.5">
                              {platform.desc || `Kênh ${platform.name} chính thức của COFFEE 24/24`}
                            </span>
                          </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center gap-3 self-end lg:self-auto">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-neutral-400">Hiển thị:</span>
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={() => handleTogglePlatformVisible(platform.id)}
                              className="w-4 h-4 accent-amber-500 cursor-pointer"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => handleUpdateSocialPlatform(platform.id, 'isPlaceholder', !platform.isPlaceholder)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                              platform.isPlaceholder
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                            }`}
                          >
                            {platform.isPlaceholder ? 'Chế độ: Ô Chờ Nhúng' : 'Chế độ: Link Trực Tiếp'}
                          </button>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
                        <div>
                          <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                            Đường Dẫn URL Liên Kết
                          </label>
                          <input
                            type="text"
                            value={platform.url || ''}
                            onChange={(e) => handleUpdateSocialPlatform(platform.id, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                            Tên Người Dùng / Handle
                          </label>
                          <input
                            type="text"
                            value={platform.handle || ''}
                            onChange={(e) => handleUpdateSocialPlatform(platform.id, 'handle', e.target.value)}
                            placeholder="@coffee2424"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                            Huy Hiệu (Badge nhỏ)
                          </label>
                          <input
                            type="text"
                            value={platform.badge || ''}
                            onChange={(e) => handleUpdateSocialPlatform(platform.id, 'badge', e.target.value)}
                            placeholder="Chính thức / Sắp ra mắt"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIVE PREVIEW KHỐI (XEM TRƯỚC GIAO DIỆN CLIENT ĐỒNG BỘ 100%) */}
            <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                  <Eye className="w-4 h-4 text-amber-500" />
                  <span>Xem Trước Hiển Thị Trên Website (Live Preview Đồng Bộ 100%)</span>
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Khớp Tuyệt Đối Với Trang Chủ
                </span>
              </div>
              
              <div className="p-4 sm:p-8 rounded-3xl bg-[#f5ede3] border border-white/60 shadow-inner">
                <SocialFollowSection config={config} />
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm flex items-center gap-2 shadow-2xl cursor-pointer active:scale-95 transition-all"
              >
                <Save className="w-5 h-5 stroke-[2.5]" />
                <span>LƯU CẤU HÌNH MẠNG XÃ HỘI & ZALO OA</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: QUẢN LÝ 12 VỊ TRÍ TUYỂN DỤNG */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Header Box */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-950 p-6 rounded-3xl border border-neutral-800">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      Quản Lý Tin Tuyển Dụng (12 Vị Trí)
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        {jobsList.filter(j => j.active !== false).length}/12 Đang Mở Tuyển
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Bật / Tắt trạng thái mở tuyển cho từng vị trí. Khi tắt, vị trí sẽ tự động ẩn khỏi trang Tuyển Dụng và dropdown nộp hồ sơ.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAllJobs(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bật Tuyển Tất Cả</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAllJobs(false)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-rose-400 border border-rose-500/30 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Tạm Dừng Tất Cả</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/tuyendung')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Xem Trang Tuyển Dụng</span>
                </button>
              </div>
            </div>

            {/* 3 KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl">
                  {jobsList.length}
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Tổng vị trí quy hoạch</span>
                  <span className="text-base font-black text-white">12 Vị Trí Tuyển Dụng</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950 border border-emerald-500/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-xl">
                  {jobsList.filter(j => j.active !== false).length}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400 font-bold block">Đang Bật Mở Tuyển</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <span className="text-base font-black text-white">Hiển thị trên website</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center font-black text-xl">
                  {jobsList.filter(j => j.active === false).length}
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Tạm dừng tuyển dụng</span>
                  <span className="text-base font-black text-neutral-300">Đã ẩn khỏi trang khách</span>
                </div>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm vị trí (VD: Tổng quản lý, Pha chế, Bảo vệ, Marketing, QC...)..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <select
                  value={jobFilterDept}
                  onChange={(e) => setJobFilterDept(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="ALL">Tất cả phòng ban</option>
                  <option value="Ban Điều Hành">Ban Điều Hành</option>
                  <option value="Phòng Kế Toán - Tài Chính">Kế Toán - Tài Chính</option>
                  <option value="Phòng Marketing & Thương Hiệu">Marketing & Brand</option>
                  <option value="Vận Hành Cửa Hàng">Vận Hành Cửa Hàng</option>
                  <option value="Khối An Ninh & Trật Tự">Bảo Vệ & An Ninh</option>
                  <option value="Khối Vệ Sinh & Tạp Vụ">Vệ Sinh & Tạp Vụ</option>
                  <option value="Khối Đảm Bảo Chất Lượng (QA/QC)">QC - Quản Lý Chất Lượng</option>
                  <option value="Phòng Hành Chính - Nhân Sự (HR)">HR - Nhân Sự</option>
                </select>

                <select
                  value={jobFilterStatus}
                  onChange={(e) => setJobFilterStatus(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="ACTIVE">Chỉ vị trí ĐANG BẬT</option>
                  <option value="INACTIVE">Chỉ vị trí ĐÃ TẮT</option>
                </select>
              </div>
            </div>

            {/* 12 JOBS LIST */}
            <div className="space-y-3">
              {jobsList
                .filter(job => {
                  if (jobFilterDept !== 'ALL' && job.department !== jobFilterDept) return false;
                  if (jobFilterStatus === 'ACTIVE' && job.active === false) return false;
                  if (jobFilterStatus === 'INACTIVE' && job.active !== false) return false;
                  if (jobSearchQuery.trim()) {
                    const q = jobSearchQuery.toLowerCase();
                    return job.title.toLowerCase().includes(q) || 
                           job.department.toLowerCase().includes(q) ||
                           job.salary.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((job, idx) => {
                  const isActive = job.active !== false;
                  return (
                    <div
                      key={job.id}
                      className={`p-5 rounded-2xl transition-all border ${
                        isActive
                          ? 'bg-neutral-950 border-neutral-800 hover:border-amber-500/40 shadow-sm'
                          : 'bg-neutral-950/40 border-neutral-900 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                            isActive
                              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                              : 'bg-neutral-800 text-neutral-500'
                          }`}>
                            {idx + 1}
                          </div>

                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className={`text-base font-black ${isActive ? 'text-white' : 'text-neutral-400 line-through'}`}>
                                {job.title}
                              </h3>
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800 font-medium">
                                {job.department}
                              </span>
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                                {job.salary}
                              </span>
                            </div>

                            <p className="text-xs text-neutral-400 line-clamp-2 max-w-3xl leading-relaxed">
                              {job.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                              <span>🕒 {job.shift}</span>
                              <span>•</span>
                              <span>📍 {job.locations?.join(' | ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* TOGGLE BUTTON & ACTIONS */}
                        <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingJob({ ...job })}
                            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                            title="Chỉnh sửa chi tiết vị trí này"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                            <span className="hidden sm:inline">Chỉnh sửa</span>
                          </button>

                          {/* TOGGLE SWITCH BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleToggleJobActive(job.id)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-md shadow-emerald-500/10'
                                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                                <span>ĐANG BẬT TUYỂN</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-neutral-500 stroke-[2.5]" />
                                <span>TẠM DỪNG TUYỂN</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 8: QUẢN LÝ ĐÁNH GIÁ KHÁCH HÀNG (CUSTOMER REVIEWS REDESIGN) */}
        {activeTab === 'reviews' && (() => {
          const avgReviewRating = reviewsList.length > 0 
            ? (reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviewsList.length).toFixed(1) 
            : '5.0';
          const activeReviewsCount = reviewsList.filter(r => r.active !== false).length;
          const fiveStarCount = reviewsList.filter(r => (Number(r.rating) || 5) === 5).length;

          const filteredReviews = reviewsList.filter(r => {
            if (reviewFilterStatus === 'ACTIVE' && r.active === false) return false;
            if (reviewFilterStatus === 'INACTIVE' && r.active !== false) return false;
            if (reviewFilterRating !== 'ALL' && (Number(r.rating) || 5) !== Number(reviewFilterRating)) return false;
            if (reviewFilterBranch !== 'ALL' && !r.branch.toLowerCase().includes(reviewFilterBranch.toLowerCase())) return false;
            if (reviewSearchQuery.trim()) {
              const q = reviewSearchQuery.toLowerCase();
              return r.author.toLowerCase().includes(q) ||
                     (r.favoriteItem && r.favoriteItem.toLowerCase().includes(q)) ||
                     r.content.toLowerCase().includes(q) ||
                     r.branch.toLowerCase().includes(q);
            }
            return true;
          });

          return (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-950 p-6 rounded-3xl border border-neutral-800 shadow-xl">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Star className="w-6 h-6 fill-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white flex flex-wrap items-center gap-2">
                        <span>Quản Lý Đánh Giá Khách Hàng</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                          {activeReviewsCount} Đang Hiển Thị
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                        Thêm mới, chỉnh sửa và kiểm duyệt các phản hồi thực tế từ khách hàng để tạo uy tín cho COFFEE 24/24 trên Trang Chủ.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleOpenAddReview}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_8px_25px_rgba(245,158,11,0.35)] active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ THÊM ĐÁNH GIÁ MỚI</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDefaultReviews}
                    className="px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Khôi phục lại danh sách 6 đánh giá chuẩn ban đầu"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Khôi Phục Gốc</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Xem Trang Chủ</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-3.5 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg shrink-0">
                    {reviewsList.length}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-neutral-400 block truncate font-medium">Tổng số phản hồi</span>
                    <span className="text-sm sm:text-base font-black text-white truncate block">{reviewsList.length} Đánh Giá</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-emerald-500/30 flex items-center gap-3.5 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-lg shrink-0">
                    {activeReviewsCount}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-emerald-400 font-bold truncate">Đang Hiển Thị</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                    </div>
                    <span className="text-sm sm:text-base font-black text-white truncate block">{activeReviewsCount} Xuất Hiện</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-3.5 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-lg shrink-0">
                    {avgReviewRating}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-neutral-400 block truncate font-medium">Điểm đánh giá TB</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-400 shrink-0" />
                      ))}
                      <span className="text-xs font-bold text-white ml-1">{avgReviewRating}/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-3.5 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-black text-lg shrink-0">
                    {fiveStarCount}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-neutral-400 block truncate font-medium">Đánh giá 5 sao</span>
                    <span className="text-sm sm:text-base font-black text-white truncate block">
                      {reviewsList.length > 0 ? Math.round((fiveStarCount / reviewsList.length) * 100) : 100}% Tuyệt Đối
                    </span>
                  </div>
                </div>
              </div>

              {/* KHỐI CẤU HÌNH TIÊU ĐỀ & GIỚI THIỆU KHỐI ĐÁNH GIÁ TRANG CHỦ */}
              <AdminReviewsHeaderCard 
                config={config} 
                onSaveConfig={(newConf) => {
                  setConfig(newConf);
                  saveSiteConfig(newConf);
                }} 
                triggerAlert={triggerAlert} 
              />

              {/* Filter and Search Bar */}
              <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={reviewSearchQuery}
                    onChange={(e) => setReviewSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên khách, món yêu thích, chi nhánh, nội dung..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={reviewFilterStatus}
                    onChange={(e) => setReviewFilterStatus(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="ACTIVE">Chỉ đánh giá ĐANG BẬT ({activeReviewsCount})</option>
                    <option value="INACTIVE">Chỉ đánh giá ĐÃ ẨN ({reviewsList.length - activeReviewsCount})</option>
                  </select>

                  <select
                    value={reviewFilterRating}
                    onChange={(e) => setReviewFilterRating(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="ALL">Tất cả số sao</option>
                    <option value="5">5 Sao ★★★★★</option>
                    <option value="4">4 Sao ★★★★☆</option>
                    <option value="3">3 Sao ★★★☆☆</option>
                  </select>

                  <select
                    value={reviewFilterBranch}
                    onChange={(e) => setReviewFilterBranch(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="ALL">Tất cả chi nhánh</option>
                    <option value="96 D5">Chi nhánh 96 D5 (Bình Thạnh)</option>
                    <option value="413 Phan Huy Ích">Chi nhánh 413 Phan Huy Ích (Gò Vấp)</option>
                  </select>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {filteredReviews.length === 0 ? (
                  <div className="p-12 text-center bg-neutral-950 rounded-3xl border border-neutral-800 space-y-3">
                    <MessageSquare className="w-10 h-10 text-neutral-600 mx-auto" />
                    <h4 className="text-base font-bold text-white">Không tìm thấy đánh giá nào phù hợp</h4>
                    <p className="text-xs text-neutral-400">Thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Thêm Đánh Giá Mới" phía trên.</p>
                  </div>
                ) : (
                  filteredReviews.map((rev) => {
                    const isActive = rev.active !== false;
                    return (
                      <div
                        key={rev.id}
                        className={`p-5 rounded-2xl transition-all border ${
                          isActive
                            ? 'bg-neutral-950 border-neutral-800 hover:border-amber-500/40 shadow-sm'
                            : 'bg-neutral-950/50 border-neutral-900 opacity-60 hover:opacity-90'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4 min-w-0">
                            {rev.avatar ? (
                              <img 
                                src={rev.avatar} 
                                alt={rev.author} 
                                className="w-12 h-12 rounded-2xl object-cover border border-neutral-800 shrink-0 shadow-md"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center font-black text-base shrink-0 shadow-md">
                                {rev.initial || rev.author.charAt(0)}
                              </div>
                            )}

                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className={`text-base font-black ${isActive ? 'text-white' : 'text-neutral-400 line-through'}`}>
                                  {rev.author}
                                </h4>
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800 font-medium">
                                  {rev.role}
                                </span>
                                {rev.verified !== false && (
                                  <span className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Xác thực</span>
                                  </span>
                                )}
                                <div className="flex items-center gap-0.5 text-amber-400">
                                  {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                                  ))}
                                  <span className="text-xs font-bold text-amber-400 ml-1">{rev.rating || 5}.0</span>
                                </div>
                                <span className="text-[11px] text-neutral-500">
                                  • {rev.date}
                                </span>
                              </div>

                              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic max-w-3xl">
                                "{rev.content}"
                              </p>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 pt-0.5">
                                <span className="flex items-center gap-1">📍 {rev.branch}</span>
                                {rev.favoriteItem && (
                                  <>
                                    <span className="text-neutral-600">•</span>
                                    <span className="text-amber-400/90 font-medium flex items-center gap-1">☕ {rev.favoriteItem}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* ACTION BUTTONS (SỬA, BẬT/ẨN, XÓA) */}
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0">
                            {/* Nút Chỉnh Sửa */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditReview(rev)}
                              className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-400 border border-neutral-800 hover:border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                              title="Chỉnh sửa nội dung đánh giá này"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>

                            {/* Nút Bật / Ẩn */}
                            <button
                              type="button"
                              onClick={() => handleToggleReviewActive(rev.id)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'
                              }`}
                              title={isActive ? 'Nhấn để ẩn khỏi trang chủ' : 'Nhấn để bật hiển thị trên trang chủ'}
                            >
                              {isActive ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                                  <span>HIỂN THỊ</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-neutral-500 stroke-[2.5]" />
                                  <span>ĐÃ ẨN</span>
                                </>
                              )}
                            </button>

                            {/* Nút Xóa */}
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(rev.id)}
                              className="p-2 rounded-xl bg-neutral-900 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-500/40 transition-colors cursor-pointer text-xs"
                              title="Xóa vĩnh viễn đánh giá này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* MODAL THÊM / CHỈNH SỬA ĐÁNH GIÁ KHÁCH HÀNG */}
              {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
                  <div className="w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto text-white">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                          <span>{editingReviewId ? 'Chỉnh Sửa Đánh Giá Khách Hàng' : 'Thêm Đánh Giá Khách Hàng Mới'}</span>
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Đánh giá sẽ được hiển thị trực tiếp trong khối cảm nhận khách hàng trên Trang Chủ.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsReviewModalOpen(false)}
                        className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Body / Form */}
                    <form onSubmit={handleSaveReviewForm} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 1. Tên khách hàng */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300 block">
                            Họ và tên khách hàng <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={reviewFormData.author}
                            onChange={(e) => setReviewFormData(prev => ({ ...prev, author: e.target.value }))}
                            placeholder="Ví dụ: Nguyễn Hoàng Minh"
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        {/* 2. Nghề nghiệp / Danh xưng */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300 block">
                            Nghề nghiệp / Danh xưng
                          </label>
                          <input
                            type="text"
                            value={reviewFormData.role}
                            onChange={(e) => setReviewFormData(prev => ({ ...prev, role: e.target.value }))}
                            placeholder="Ví dụ: Freelance Designer / Sinh viên ĐH"
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-amber-400 focus:outline-none"
                          />
                          {/* Quick suggestions */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {['Sinh viên ĐH', 'Freelance Designer', 'Senior Developer', 'Khách quen ca đêm', 'Content Creator'].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setReviewFormData(prev => ({ ...prev, role: tag }))}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-300 border border-neutral-800 cursor-pointer"
                              >
                                + {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 3. Số sao đánh giá (Clickable Star Picker) */}
                      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                        <label className="text-xs font-black text-amber-300 uppercase tracking-wider block">
                          Số sao đánh giá:
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((starVal) => {
                            const isSelected = (reviewFormData.rating || 5) >= starVal;
                            return (
                              <button
                                key={starVal}
                                type="button"
                                onClick={() => setReviewFormData(prev => ({ ...prev, rating: starVal }))}
                                className="p-2 rounded-xl hover:bg-neutral-800 transition-transform active:scale-90 cursor-pointer"
                                title={`${starVal} sao`}
                              >
                                <Star 
                                  className={`w-7 h-7 transition-colors ${
                                    isSelected 
                                      ? 'text-amber-400 fill-amber-400' 
                                      : 'text-neutral-600 hover:text-neutral-400'
                                  }`} 
                                />
                              </button>
                            );
                          })}
                          <span className="text-sm font-black text-amber-300 ml-2">
                            {reviewFormData.rating || 5} Sao ({
                              reviewFormData.rating === 5 ? 'Tuyệt vời / Xuất sắc' :
                              reviewFormData.rating === 4 ? 'Rất tốt' :
                              reviewFormData.rating === 3 ? 'Bình thường' : 'Cần cải thiện'
                            })
                          </span>
                        </div>
                      </div>

                      {/* 4. Chi nhánh */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300 block">
                          Chi nhánh khách hàng đã trải nghiệm
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            'Chi nhánh 96 D5, Bình Thạnh',
                            'Chi nhánh 413 Phan Huy Ích, Gò Vấp'
                          ].map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setReviewFormData(prev => ({ ...prev, branch: b }))}
                              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                                reviewFormData.branch === b
                                  ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                              }`}
                            >
                              <span>📍 {b}</span>
                              {reviewFormData.branch === b && <Check className="w-4 h-4 text-amber-400" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 5. Món nước & Đồ ăn yêu thích */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300 block">
                          Món nước & Thức ăn khách yêu thích (Favorite Item)
                        </label>
                        <input
                          type="text"
                          value={reviewFormData.favoriteItem}
                          onChange={(e) => setReviewFormData(prev => ({ ...prev, favoriteItem: e.target.value }))}
                          placeholder="Ví dụ: Cold Brew Cam Vàng & Croissant bơ tỏi"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-amber-400 focus:outline-none"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {[
                            'Cold Brew Cam Vàng & Croissant bơ tỏi',
                            'Cà Phê Muối Kem Béo & Trà Đào Cam Sả',
                            'Espresso Rang Mộc & Bạc Xỉu 3 Tầng',
                            'Mì Xào Bò Trứng Ốp La Lòng Đào',
                            'Trà Trái Cây Nhiệt Đới & Tiramisu',
                            'Caramel Macchiato & Khoai Tây Chiên'
                          ].map((fav) => (
                            <button
                              key={fav}
                              type="button"
                              onClick={() => setReviewFormData(prev => ({ ...prev, favoriteItem: fav }))}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-300 border border-neutral-800 cursor-pointer"
                            >
                              ☕ {fav}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 6. Avatar Khách hàng */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300 block">
                          Ảnh đại diện Avatar (Tùy chọn)
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          {reviewFormData.avatar ? (
                            <img
                              src={reviewFormData.avatar}
                              alt="Avatar Preview"
                              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shrink-0 shadow-md"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 font-black text-lg flex items-center justify-center shrink-0">
                              {reviewFormData.author ? reviewFormData.author.trim().charAt(0).toUpperCase() : '?'}
                            </div>
                          )}

                          <label className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold border border-neutral-700 hover:border-amber-400 flex items-center gap-1.5 cursor-pointer transition-all">
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span>Tải ảnh từ máy tính</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadReviewAvatar(e.target.files?.[0])}
                              className="hidden"
                            />
                          </label>

                          {reviewFormData.avatar && (
                            <button
                              type="button"
                              onClick={() => setReviewFormData(prev => ({ ...prev, avatar: '' }))}
                              className="text-xs text-rose-400 hover:underline cursor-pointer"
                            >
                              Xóa ảnh (dùng chữ cái viết tắt)
                            </button>
                          )}
                        </div>

                        {/* Sample Avatars */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[11px] text-neutral-500">Hoặc chọn avatar mẫu:</span>
                          {[
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
                          ].map((imgUrl, idx) => (
                            <img
                              key={idx}
                              src={imgUrl}
                              alt={`Sample ${idx}`}
                              onClick={() => setReviewFormData(prev => ({ ...prev, avatar: imgUrl }))}
                              className="w-8 h-8 rounded-xl object-cover border border-neutral-700 hover:border-amber-400 hover:scale-110 transition-all cursor-pointer"
                            />
                          ))}
                        </div>
                      </div>

                      {/* 7. Nội dung cảm nhận */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300 block">
                          Nội dung đánh giá & cảm nhận <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={reviewFormData.content}
                          onChange={(e) => setReviewFormData(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Chia sẻ cảm nhận về không gian cà phê, đồ uống, wifi, đồ ăn bếp đêm, phong cách phục vụ của nhân viên..."
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3.5 text-xs sm:text-sm text-white focus:border-amber-400 focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* 8. Thời gian & Tùy chọn hiển thị */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300 block">Thời gian hiển thị</label>
                          <input
                            type="text"
                            value={reviewFormData.date}
                            onChange={(e) => setReviewFormData(prev => ({ ...prev, date: e.target.value }))}
                            placeholder="Hôm nay / 2 ngày trước"
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="sm:col-span-2 flex flex-col justify-end gap-2">
                          <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                            <input
                              type="checkbox"
                              checked={reviewFormData.active !== false}
                              onChange={(e) => setReviewFormData(prev => ({ ...prev, active: e.target.checked }))}
                              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                            />
                            <span className="text-xs font-bold text-neutral-300">Bật hiển thị ngay trên Trang Chủ</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                            <input
                              type="checkbox"
                              checked={reviewFormData.verified !== false}
                              onChange={(e) => setReviewFormData(prev => ({ ...prev, verified: e.target.checked }))}
                              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                            />
                            <span className="text-xs font-bold text-neutral-300">Gắn huy hiệu "Khách hàng đã xác thực"</span>
                          </label>
                        </div>
                      </div>

                      {/* LIVE CARD PREVIEW TRONG MODAL */}
                      <div className="p-4 rounded-2xl bg-[#f5ede3] text-[#2b170e] space-y-2 border border-white/60 shadow-inner">
                        <span className="text-[10px] font-mono tracking-widest text-[#8c5932] font-black uppercase block">
                          XEM TRƯỚC HIỂN THỊ TRÊN GIAO DIỆN KHÁCH HÀNG:
                        </span>
                        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {[...Array(Number(reviewFormData.rating) || 5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                              ))}
                            </div>
                            <Quote className="w-4 h-4 text-[#8c5932]/30" />
                          </div>
                          <p className="text-xs sm:text-sm font-medium italic text-[#3d2719] line-clamp-3">
                            "{reviewFormData.content || 'Nội dung cảm nhận sẽ hiển thị ở đây...'}"
                          </p>
                          <div className="flex items-center gap-2.5 pt-1">
                            {reviewFormData.avatar ? (
                              <img src={reviewFormData.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-amber-300" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#2b170e] text-amber-200 flex items-center justify-center font-black text-xs">
                                {reviewFormData.author ? reviewFormData.author.trim().charAt(0).toUpperCase() : 'M'}
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-black text-[#2b170e]">
                                {reviewFormData.author || 'Tên Khách Hàng'}
                              </div>
                              <div className="text-[10px] text-[#704f38]">
                                {reviewFormData.role || 'Khách hàng'} • {reviewFormData.branch}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                        <button
                          type="button"
                          onClick={() => setIsReviewModalOpen(false)}
                          className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Hủy Bỏ
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>{editingReviewId ? 'Lưu Thay Đổi Đánh Giá' : 'Thêm Đánh Giá Ngay'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB: QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN (USERS & RBAC) */}
        {activeTab === 'users' && (
          <div className="space-y-6 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <span>Quản Lý Tài Khoản & Phân Quyền (RBAC)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Kiểm soát tài khoản nhân sự truy cập CMS, phân quyền chi tiết cho từng chuyên mục website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingAccount({
                    id: '',
                    email: '',
                    password: '',
                    name: '',
                    role: 'custom',
                    roleName: 'Nhân Viên Phân Quyền',
                    permissions: ['articles'],
                    active: true
                  });
                  setIsNewAccount(true);
                  setAccountPasswordVisible(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Thêm Tài Khoản Mới</span>
              </button>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">Tổng Tài Khoản</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white">{accountsList.length}</span>
                  <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm">
                    <Users className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">Tổng Quản Trị</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-amber-400">
                    {accountsList.filter(a => a.role === 'super_admin').length}
                  </span>
                  <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                    <Shield className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">Marketing / Biên Tập</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-sky-400">
                    {accountsList.filter(a => a.role === 'marketing' || (a.permissions && a.permissions.includes('articles'))).length}
                  </span>
                  <span className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold text-sm">
                    <FileText className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">Nhân Sự Tuyển Dụng</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-emerald-400">
                    {accountsList.filter(a => a.role === 'hr' || (a.permissions && a.permissions.includes('jobs'))).length}
                  </span>
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    <Briefcase className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>

            {/* Info notice about default super admin */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold block mb-0.5">Tài khoản Tổng Quản Trị Mặc Định:</strong>
                Tài khoản <code className="bg-neutral-900/90 px-2 py-0.5 rounded text-amber-300 font-bold font-mono">Admin.coffee2424@gmail.com</code> có toàn quyền truy cập tất cả 10 phân hệ của website. Tài khoản này được bảo vệ tự động, không thể bị xóa hoặc khóa để đảm bảo an toàn hệ thống.
              </div>
            </div>

            {/* Accounts List Cards */}
            <div className="space-y-3.5">
              {accountsList.map((acc) => {
                const isSuper = acc.role === 'super_admin' || acc.id === 'admin-super' || acc.email.toLowerCase() === 'admin.coffee2424@gmail.com';
                const isCurrentUser = currentUser?.email.toLowerCase() === acc.email.toLowerCase();
                const permCount = isSuper ? 10 : (acc.permissions ? acc.permissions.length : 0);

                return (
                  <div
                    key={acc.id}
                    className={`p-4 sm:p-5 rounded-2xl bg-neutral-950 border transition-all ${
                      acc.active !== false
                        ? isSuper 
                          ? 'border-amber-500/40 shadow-sm shadow-amber-500/5' 
                          : 'border-neutral-800 hover:border-neutral-700'
                        : 'border-neutral-900 opacity-60 bg-neutral-950/60'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Left: User Identity */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-md ${
                          isSuper 
                            ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-black shadow-amber-500/20'
                            : acc.role === 'marketing'
                              ? 'bg-gradient-to-br from-sky-500 to-sky-700 text-white'
                              : acc.role === 'hr'
                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white'
                                : 'bg-gradient-to-br from-neutral-700 to-neutral-800 text-amber-300'
                        }`}>
                          {acc.name ? acc.name.charAt(0).toUpperCase() : acc.email.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-white text-sm sm:text-base truncate">
                              {acc.name || acc.email}
                            </span>

                            {isCurrentUser && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">
                                Bạn đang đăng nhập
                              </span>
                            )}

                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              isSuper
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/35'
                                : acc.role === 'marketing'
                                  ? 'bg-sky-500/15 text-sky-300 border-sky-500/35'
                                  : acc.role === 'hr'
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                            }`}>
                              {acc.roleName || (isSuper ? 'Tổng Quản Trị' : 'Nhân Viên')}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-neutral-400">
                            <span className="font-mono text-neutral-300 select-all">{acc.email}</span>
                            <span className="text-neutral-600 hidden sm:inline">•</span>
                            <span className="text-[11px] text-neutral-500">Mật khẩu: ••••••••••••</span>
                            <span className="text-neutral-600 hidden sm:inline">•</span>
                            <span className="text-[11px] text-neutral-500">Tạo: {acc.createdAt || '16/10/2026'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
                        {/* Status Button */}
                        {!isSuper ? (
                          <button
                            type="button"
                            onClick={() => handleToggleAccountActive(acc.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer border transition-colors ${
                              acc.active !== false
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:text-neutral-300'
                            }`}
                            title={acc.active !== false ? 'Bấm để khóa tài khoản' : 'Bấm để mở khóa'}
                          >
                            <span className={`w-2 h-2 rounded-full ${acc.active !== false ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`}></span>
                            <span>{acc.active !== false ? 'HOẠT ĐỘNG' : 'ĐÃ TẠM KHÓA'}</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                            <span>MẶC ĐỊNH BẬT</span>
                          </span>
                        )}

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAccount({ ...acc });
                            setIsNewAccount(false);
                            setAccountPasswordVisible(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Sửa Quyền</span>
                        </button>

                        {/* Delete Button (disabled for super admin) */}
                        {!isSuper && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAccount(acc.id)}
                            className="p-2 rounded-xl bg-neutral-900 hover:bg-red-500/20 text-neutral-500 hover:text-red-400 border border-neutral-800 hover:border-red-500/30 transition-colors cursor-pointer"
                            title="Xóa tài khoản này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Permissions Badges Row */}
                    <div className="mt-3.5 pt-3 border-t border-neutral-900 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-neutral-500 mr-1 flex items-center gap-1">
                        <Key className="w-3 h-3 text-amber-400" />
                        <span>Quyền hạn ({permCount}):</span>
                      </span>

                      {isSuper ? (
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black">
                          ★ TOÀN QUYỀN HỆ THỐNG (10/10 MỤC)
                        </span>
                      ) : (
                        (acc.permissions || []).map((permId) => {
                          const pObj = ALL_PERMISSIONS.find(p => p.id === permId);
                          return (
                            <span
                              key={permId}
                              className="px-2.5 py-0.5 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800 text-[11px] font-medium"
                            >
                              {pObj?.label || permId}
                            </span>
                          );
                        })
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        </main>
      </div>

      {/* ARTICLE EDITOR MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-black text-white">
                {isNewPost ? 'Viết Bài Mới & Tối Ưu SEO' : 'Chỉnh Sửa Bài Viết'}
              </h3>
              <button 
                onClick={() => setEditingArticle(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Tiêu Đề Bài Viết *</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[đĐ]/g, "d")
                      .replace(/[^a-z0-9 ]/g, "")
                      .replace(/\s+/g, "-");
                    setEditingArticle({ ...editingArticle, title, slug });
                  }}
                  placeholder="Ví dụ: Top 5 Loại Cà Phê Ngon Nhất Tại Coffee 24/24..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Chuyên Mục</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Không Gian 24/7">Không Gian 24/7</option>
                    <option value="Cẩm Nang Cà Phê">Cẩm Nang Cà Phê</option>
                    <option value="Văn Hóa Cà Phê">Văn Hóa Cà Phê</option>
                    <option value="Khuyến Mãi & Sự Kiện">Khuyến Mãi & Sự Kiện</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Ảnh Bìa</label>
                  <select
                    value={editingArticle.coverImage}
                    onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="/images/blog_workspace.jpg">Ảnh 1: Bàn làm việc đêm (Laptop & Coffee)</option>
                    <option value="/images/blog_brewing.jpg">Ảnh 2: Pha chế Pour Over V60</option>
                    <option value="/images/blog_origin.jpg">Ảnh 3: Hạt cà phê mộc & nông trại</option>
                    <option value="/images/signature_drinks.jpg">Ảnh 4: Bộ sưu tập đồ uống Signature</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Tóm Tắt Ngắn (Excerpt cho SEO Google) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  placeholder="Mô tả ngắn gọn trong 1-2 câu để hiển thị trên Google..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Nội Dung Chi Tiết Bài Viết *</label>
                <textarea
                  rows={6}
                  required
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Nhập nội dung bài viết..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              {/* Google Preview Snippet */}
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 block">Xem trước hiển thị Google Search:</span>
                <span className="text-xs text-blue-400 font-bold block truncate">
                  {editingArticle.title || 'Tiêu đề bài viết'} | Coffee 24/24
                </span>
                <span className="text-[11px] text-emerald-500 block truncate font-mono">
                  https://coffee2424.com/baiviet/{editingArticle.slug || 'duong-dan-bai-viet'}
                </span>
                <span className="text-[11px] text-neutral-300 line-clamp-2 block">
                  {editingArticle.excerpt || 'Mô tả bài viết chuẩn SEO...'}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="flex-1 py-3 rounded-xl bg-neutral-900 text-neutral-300 font-bold text-xs cursor-pointer hover:bg-neutral-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-md cursor-pointer"
                >
                  {isNewPost ? 'XUẤT BẢN BÀI VIẾT NGAY' : 'LƯU THAY ĐỔI'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* JOB QUICK EDITOR MODAL */}
      {editingJob && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-500" />
                  <span>Chỉnh Sửa Vị Trí Tuyển Dụng</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{editingJob.title}</p>
              </div>
              <button 
                onClick={() => setEditingJob(null)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditJob} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Chức Danh / Vị Trí *</label>
                <input
                  type="text"
                  required
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Phòng Ban</label>
                  <input
                    type="text"
                    value={editingJob.department}
                    onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Hình Thức Làm Việc</label>
                  <input
                    type="text"
                    value={editingJob.type}
                    onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Mức Lương / Thu Nhập *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.salary}
                    onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                    placeholder="VD: 30.000.000đ - 45.000.000đ/tháng"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Thời Gian / Ca Làm Việc</label>
                  <input
                    type="text"
                    value={editingJob.shift}
                    onChange={(e) => setEditingJob({ ...editingJob, shift: e.target.value })}
                    placeholder="VD: Ca xoay 8 tiếng..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Mô Tả Công Việc</label>
                <textarea
                  rows={3}
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              {/* Status toggle inside modal */}
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Trạng Thái Hiển Thị Mở Tuyển</span>
                  <span className="text-[11px] text-neutral-400">
                    {editingJob.active !== false ? 'Vị trí này đang hiển thị trên website' : 'Vị trí này đang bị ẩn khỏi website'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingJob({ ...editingJob, active: editingJob.active === false ? true : false })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer border ${
                    editingJob.active !== false
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {editingJob.active !== false ? 'BẬT MỞ TUYỂN' : 'TẠM DỪNG'}
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="flex-1 py-3 rounded-xl bg-neutral-900 text-neutral-300 font-bold text-xs cursor-pointer hover:bg-neutral-800 border border-neutral-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-md cursor-pointer"
                >
                  LƯU THAY ĐỔI VỊ TRÍ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER ACCOUNT MODAL */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {isNewAccount ? 'Tạo Tài Khoản Nhân Viên Mới' : 'Chỉnh Sửa Tài Khoản Nhân Viên'}
                  </h3>
                  <span className="text-[11px] text-neutral-400 block">
                    Phân quyền chi tiết cho nhân sự truy cập CMS Coffee 24/24
                  </span>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setEditingAccount(null)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAccount} className="space-y-4">
              
              {/* Row 1: Email & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Email Đăng Nhập *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!isNewAccount && (editingAccount.id === 'admin-super' || editingAccount.email?.toLowerCase() === 'admin.coffee2424@gmail.com')}
                    value={editingAccount.email || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                    placeholder="vd: nhanvien@coffee2424.com"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Họ Và Tên / Tên Hiển Thị *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAccount.name || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                    placeholder="vd: Nguyễn Văn A (Marketing)"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              {/* Row 2: Password with eye toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Mật Khẩu Đăng Nhập *
                  </label>
                  <button
                    type="button"
                    onClick={() => setAccountPasswordVisible(!accountPasswordVisible)}
                    className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {accountPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{accountPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</span>
                  </button>
                </div>
                <input
                  type={accountPasswordVisible ? 'text' : 'password'}
                  required
                  value={editingAccount.password || ''}
                  onChange={(e) => setEditingAccount({ ...editingAccount, password: e.target.value })}
                  placeholder="Nhập mật khẩu (vd: Coffee24/24@1)..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Row 3: Role Presets */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Chọn Mẫu Vai Trò (Role Preset)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAccount({
                        ...editingAccount,
                        role: 'super_admin',
                        roleName: 'Tổng Quản Trị (Toàn quyền)',
                        permissions: ['all']
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      editingAccount.role === 'super_admin'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-black block leading-tight">👑 Tổng Quản Trị</span>
                    <span className="text-[10px] opacity-75 mt-0.5 block">Toàn quyền 10/10</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingAccount({
                        ...editingAccount,
                        role: 'marketing',
                        roleName: 'Biên Tập & Marketing',
                        permissions: ['sideBanners', 'bannerSections', 'theme', 'reviews', 'about', 'articles']
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      editingAccount.role === 'marketing'
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-black block leading-tight">📢 Marketing</span>
                    <span className="text-[10px] opacity-75 mt-0.5 block">6 quyền bài & banner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingAccount({
                        ...editingAccount,
                        role: 'hr',
                        roleName: 'Phòng Nhân Sự',
                        permissions: ['jobs']
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      editingAccount.role === 'hr'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-black block leading-tight">💼 Tuyển Dụng</span>
                    <span className="text-[10px] opacity-75 mt-0.5 block">12 tin tuyển dụng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingAccount({
                        ...editingAccount,
                        role: 'custom',
                        roleName: 'Nhân Viên Tùy Chọn'
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      editingAccount.role === 'custom'
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-black block leading-tight">⚙️ Tự Chọn</span>
                    <span className="text-[10px] opacity-75 mt-0.5 block">Checklist bên dưới</span>
                  </button>
                </div>
              </div>

              {/* Row 4: Detailed Permissions Checklist */}
              {editingAccount.role !== 'super_admin' ? (
                <div className="space-y-2.5 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-neutral-300">
                      Danh Sách Phân Quyền Chi Tiết ({editingAccount.permissions?.length || 0}/10 mục)
                    </label>

                    {/* Quick filter buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setEditingAccount({ ...editingAccount, permissions: ALL_PERMISSIONS.map(p => p.id) })}
                        className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold border border-neutral-800 cursor-pointer"
                      >
                        Chọn Hết
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAccount({ ...editingAccount, permissions: ['sideBanners', 'bannerSections', 'theme', 'reviews', 'about', 'articles'] })}
                        className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-sky-400 font-bold border border-neutral-800 cursor-pointer"
                      >
                        Marketing
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAccount({ ...editingAccount, permissions: ['jobs'] })}
                        className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-emerald-400 font-bold border border-neutral-800 cursor-pointer"
                      >
                        Tuyển Dụng
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAccount({ ...editingAccount, permissions: [] })}
                        className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-bold border border-neutral-800 cursor-pointer"
                      >
                        Bỏ Chọn
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 bg-neutral-900/40 rounded-2xl border border-neutral-800/80">
                    {ALL_PERMISSIONS.map((perm) => {
                      const isChecked = editingAccount.permissions?.includes(perm.id) || editingAccount.permissions?.includes('all');
                      return (
                        <div
                          key={perm.id}
                          onClick={() => togglePermission(perm.id)}
                          className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-amber-500/15 border-amber-500/40 text-white'
                              : 'bg-neutral-900/70 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(isChecked)}
                            onChange={() => {}} // handled by parent div
                            className="mt-0.5 rounded text-amber-500 focus:ring-0 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold leading-tight truncate">{perm.label}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 shrink-0 font-medium">
                                {perm.group}
                              </span>
                            </div>
                            <span className="text-[10.5px] opacity-75 line-clamp-1 block mt-0.5">
                              {perm.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-200">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Tài khoản <strong>Tổng Quản Trị</strong> tự động có toàn quyền truy cập tất cả 10 mục của website.</span>
                </div>
              )}

              {/* Status toggle inside modal */}
              {editingAccount.id !== 'admin-super' && (
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Trạng Thái Tài Khoản</span>
                    <span className="text-[11px] text-neutral-400">
                      {editingAccount.active !== false ? 'Tài khoản được phép đăng nhập CMS' : 'Tài khoản đang bị tạm khóa'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingAccount({ ...editingAccount, active: editingAccount.active === false ? true : false })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer border ${
                      editingAccount.active !== false
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {editingAccount.active !== false ? 'KÍCH HOẠT' : 'TẠM KHÓA'}
                  </button>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="flex-1 py-3 rounded-xl bg-neutral-900 text-neutral-300 font-bold text-xs cursor-pointer hover:bg-neutral-800 border border-neutral-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>{isNewAccount ? 'TẠO TÀI KHOẢN MỚI' : 'LƯU TÀI KHOẢN'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

