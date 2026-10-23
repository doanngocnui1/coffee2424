import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  Flame, 
  Plus, 
  Trash2, 
  Upload, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Save, 
  RotateCcw, 
  Eye, 
  Smartphone, 
  Monitor, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sliders,
  Layout,
  Globe,
  Tag,
  Navigation,
  Ticket
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../../data/siteConfig';
import { uploadImageToSupabase } from '../../lib/supabase';

export default function AdminPromotionsManager({ config, onSaveConfig, triggerAlert }) {
  const defaultPromotions = DEFAULT_SITE_CONFIG.promotionsList || [];

  const defaultSectionConfig = DEFAULT_SITE_CONFIG.promotionsSection || {
    enabled: true,
    badge: 'ƯU ĐÃI ĐẶC QUYỀN',
    showBadge: true,
    title: 'Chương Trình Ưu Đãi',
    highlightTitle: 'Dành Riêng Cho Bạn',
    subtitle: 'Tổng hợp các voucher giảm giá, combo tiết kiệm và giờ vàng ưu đãi dành cho học sinh, sinh viên và cộng đồng chạy deadline.'
  };

  const [promotions, setPromotions] = useState(() => {
    if (config?.promotionsList && Array.isArray(config.promotionsList) && config.promotionsList.length > 0) {
      return config.promotionsList;
    }
    return defaultPromotions;
  });

  const [sectionConfig, setSectionConfig] = useState(() => {
    return {
      enabled: config?.promotionsSection?.enabled !== false,
      badge: config?.promotionsSection?.badge || defaultSectionConfig.badge,
      showBadge: config?.promotionsSection?.showBadge !== false,
      title: config?.promotionsSection?.title || defaultSectionConfig.title,
      highlightTitle: config?.promotionsSection?.highlightTitle || defaultSectionConfig.highlightTitle,
      subtitle: config?.promotionsSection?.subtitle || defaultSectionConfig.subtitle
    };
  });

  // State điều khiển hiển thị Tab "Khuyến Mãi" trên Header Navigation Bar
  const [headerMenuVisible, setHeaderMenuVisible] = useState(() => {
    const promoItem = (config?.navMenu || DEFAULT_SITE_CONFIG.navMenu || []).find(item => item.id === 'promo');
    return promoItem ? promoItem.visible !== false : true;
  });
  const [headerMenuLabel, setHeaderMenuLabel] = useState(() => {
    const promoItem = (config?.navMenu || DEFAULT_SITE_CONFIG.navMenu || []).find(item => item.id === 'promo');
    return promoItem?.label || 'Khuyến Mãi';
  });

  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' (3) | 'mobile' (1)
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    if (config?.promotionsList && Array.isArray(config.promotionsList) && config.promotionsList.length > 0) {
      setPromotions(config.promotionsList);
    }
    if (config?.promotionsSection) {
      setSectionConfig({
        enabled: config.promotionsSection.enabled !== false,
        badge: config.promotionsSection.badge || defaultSectionConfig.badge,
        showBadge: config.promotionsSection.showBadge !== false,
        title: config.promotionsSection.title || defaultSectionConfig.title,
        highlightTitle: config.promotionsSection.highlightTitle || defaultSectionConfig.highlightTitle,
        subtitle: config.promotionsSection.subtitle || defaultSectionConfig.subtitle
      });
    }
    if (config?.navMenu) {
      const promoItem = config.navMenu.find(item => item.id === 'promo');
      if (promoItem) {
        setHeaderMenuVisible(promoItem.visible !== false);
        setHeaderMenuLabel(promoItem.label || 'Khuyến Mãi');
      }
    }
  }, [config]);

  const previewVisibleCount = previewMode === 'desktop' ? 3 : 1;
  const previewMaxIndex = Math.max(0, promotions.length - previewVisibleCount);
  const safePreviewIndex = Math.min(previewIndex, previewMaxIndex);

  const handleAddPromotion = () => {
    const newId = `promo-${Date.now()}`;
    const newPromo = {
      id: newId,
      tag: 'ƯU ĐÃI MỚI',
      badge: 'HOT DEAL 🔥',
      title: 'Chương Trình Ưu Đãi Mới COFFEE 24/24',
      subtitle: 'Khung giờ vàng & combo tiết kiệm',
      discount: 'GIẢM 25%',
      discountValue: 'Tiết kiệm 25%',
      code: 'PROMO24',
      validUntil: 'Cả ngày & đêm 24/24',
      category: 'drinks',
      usedPercent: 80,
      remainingCount: 30,
      showVoucherCode: true,
      showCopyBtn: true,
      showCtaBtn: true,
      image: DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image || 'https://ilyxybkcndjcnzrtjjiq.supabase.co/storage/v1/object/public/coffee2424-media/promos/1792406318618_erer5hh.png',
      description: 'Nạp năng lượng và thưởng thức trọn vẹn menu cà phê rang mộc nguyên chất, thức uống pha tươi và món nóng cứu đói 24/7.',
      condition: 'Áp dụng trên toàn hệ thống 2 chi nhánh 413PHI & 96D5 hoặc đặt món online.',
      cta: 'Nhận Ưu Đãi',
      link: '/khuyenmai'
    };
    setPromotions(prev => [...prev, newPromo]);
    triggerAlert?.('✓ Đã thêm 1 thẻ ưu đãi mới! Hãy chỉnh sửa thông tin và nhấn Lưu.');
  };

  const handleDeletePromotion = (index) => {
    if (promotions.length <= 1) {
      alert('Cần giữ lại ít nhất 1 chương trình ưu đãi để hiển thị trên website!');
      return;
    }
    const itemTitle = promotions[index]?.title || `Ưu đãi #${index + 1}`;
    if (window.confirm(`Bạn có chắc muốn xóa "${itemTitle}" khỏi danh sách ưu đãi?`)) {
      const updated = promotions.filter((_, i) => i !== index);
      setPromotions(updated);
      triggerAlert?.(`Đã xóa ưu đãi "${itemTitle}". Nhớ nhấn nút Lưu để áp dụng.`);
    }
  };

  const handleDuplicatePromotion = (index) => {
    const target = promotions[index];
    if (!target) return;
    const duplicated = {
      ...target,
      id: `promo-${Date.now()}`,
      title: `${target.title} (Bản sao)`
    };
    const updated = [...promotions];
    updated.splice(index + 1, 0, duplicated);
    setPromotions(updated);
    triggerAlert?.('✓ Đã nhân bản thẻ ưu đãi!');
  };

  const handleMovePromotion = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= promotions.length) return;
    const updated = [...promotions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPromotions(updated);
  };

  const handleUpdatePromotionField = (index, field, value) => {
    setPromotions(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  // Tải ảnh ưu đãi lên Supabase Storage (kèm nén ảnh dự phòng)
  const handleUploadPromotionImage = async (index, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP, GIF...).');
      return;
    }

    triggerAlert?.('⏳ Đang tải ảnh ưu đãi lên Supabase Storage...');

    try {
      const cloudUrl = await uploadImageToSupabase(file, 'promos');
      if (cloudUrl) {
        handleUpdatePromotionField(index, 'image', cloudUrl);
        triggerAlert?.(`✓ Đã tải ảnh ưu đãi số ${index + 1} lên Supabase Storage thành công! Bấm "LƯU CẤU HÌNH" để áp dụng.`);
        return;
      }
    } catch (err) {
      console.warn('Lỗi tải ảnh lên Supabase:', err);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
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
        const compressed = canvas.toDataURL('image/jpeg', 0.86);
        handleUpdatePromotionField(index, 'image', compressed);
        triggerAlert?.(`✓ Đã nén và tải ảnh cho ưu đãi số ${index + 1}!`);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = () => {
    const currentNavMenu = Array.isArray(config?.navMenu) && config.navMenu.length > 0 
      ? config.navMenu 
      : DEFAULT_SITE_CONFIG.navMenu;
    const updatedNavMenu = currentNavMenu.map(item => {
      if (item.id === 'promo') {
        return {
          ...item,
          visible: headerMenuVisible,
          label: headerMenuLabel.trim() || 'Khuyến Mãi'
        };
      }
      return item;
    });

    const currentHomeSections = Array.isArray(config?.homeSections) && config.homeSections.length > 0 
      ? config.homeSections 
      : (DEFAULT_SITE_CONFIG.homeSections || []);
    const updatedHomeSections = currentHomeSections.map(sec => {
      if (sec.type === 'promotions' || sec.id === 'sec-promotions') {
        return {
          ...sec,
          enabled: sectionConfig.enabled
        };
      }
      return sec;
    });

    const updatedConfig = {
      ...config,
      navMenu: updatedNavMenu,
      homeSections: updatedHomeSections,
      promotionsSection: sectionConfig,
      promotionsList: promotions
    };
    onSaveConfig?.(updatedConfig);
    window.dispatchEvent(new Event('site-config-updated'));
    triggerAlert?.('✓ Đã lưu cấu hình Khuyến Mãi (Header, Trang Chủ & Trang Khuyến Mãi) thành công!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh sách Ưu Đãi về 3 chương trình mặc định ban đầu? Các thay đổi tùy chỉnh sẽ bị đặt lại.')) {
      setPromotions(defaultPromotions);
      setSectionConfig(defaultSectionConfig);
      const updatedConfig = {
        ...config,
        promotionsSection: defaultSectionConfig,
        promotionsList: defaultPromotions
      };
      onSaveConfig?.(updatedConfig);
      triggerAlert?.('Đã đặt lại danh sách Ưu Đãi về mặc định!');
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Box */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-950 p-6 rounded-3xl border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Percent className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Quản Lý Trang Khuyến Mãi & Ưu Đãi</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {promotions.length} Ưu Đãi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Quản lý các poster khuyến mãi 3:4, voucher và combo đồng bộ trực tiếp giữa Trang Khuyến Mãi (/khuyenmai) và khối Ưu Đãi trên Trang Chủ.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddPromotion}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Thêm Ưu Đãi Mới</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold border border-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Khôi phục danh sách mẫu ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Gốc</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>LƯU TẤT CẢ</span>
          </button>
        </div>
      </div>

      {/* 2. Cấu hình Tab Header & Hiển thị ngoài Trang Chủ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 2A. Điều khiển Tab Khuyến Mãi trên Header Navigation */}
        <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-5 sm:p-6 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    Tab Khuyến Mãi Trên Header
                  </h3>
                  <span className="text-[11px] text-neutral-400">Thanh điều hướng đầu trang (Navigation Bar)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHeaderMenuVisible(prev => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  headerMenuVisible
                    ? 'bg-emerald-500 text-stone-950 shadow-xs'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                <span>{headerMenuVisible ? '✓ ĐANG HIỆN' : '✕ ĐÃ ẨN'}</span>
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Bật hoặc tắt tab Khuyến Mãi xuất hiện trên thanh điều hướng đầu trang (Header) của website. Khi tắt, người dùng sẽ không thấy tab này trên menu.
            </p>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-neutral-300">
                Tên Hiển Thị Của Tab Trên Header
              </label>
              <input
                type="text"
                value={headerMenuLabel}
                onChange={(e) => setHeaderMenuLabel(e.target.value)}
                placeholder="VD: Khuyến Mãi"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 font-bold"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800/80 text-[11px] text-amber-400/90 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>Liên kết tự động tới trang <strong className="text-white">/khuyenmai</strong> khi khách click vào.</span>
          </div>
        </div>

        {/* 2B. Cấu hình hiển thị Khối Ưu Đãi ngoài Trang Chủ */}
        <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-5 sm:p-6 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Layout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    Khối Ưu Đãi Ngoài Trang Chủ
                  </h3>
                  <span className="text-[11px] text-neutral-400">Bố cục trượt ngang 3:4 trên Trang Chủ</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSectionConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  sectionConfig.enabled
                    ? 'bg-emerald-500 text-stone-950 shadow-xs'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                <span>{sectionConfig.enabled ? '✓ ĐANG BẬT' : '✕ ĐÃ ẨN'}</span>
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Hiển thị carousel trượt các chương trình ưu đãi (tỉ lệ 3:4) ngoài Trang Chủ. Tùy chọn này được đồng bộ hai chiều với mục <strong>"Bố Cục & Thêm Thành Phần"</strong> trong sidebar.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-neutral-300">Huy Hiệu (Badge)</label>
                  <button
                    type="button"
                    onClick={() => setSectionConfig(prev => ({ ...prev, showBadge: !prev.showBadge }))}
                    className="text-[10px] text-orange-400 hover:underline font-bold cursor-pointer"
                  >
                    {sectionConfig.showBadge ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
                <input
                  type="text"
                  value={sectionConfig.badge}
                  onChange={(e) => setSectionConfig(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="VD: ƯU ĐÃI ĐẶC QUYỀN"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-orange-400">Chữ Nhấn Màu Đồng</label>
                <input
                  type="text"
                  value={sectionConfig.highlightTitle}
                  onChange={(e) => setSectionConfig(prev => ({ ...prev, highlightTitle: e.target.value }))}
                  placeholder="VD: Dành Riêng Cho Bạn"
                  className="w-full bg-neutral-900 border border-orange-500/40 rounded-xl px-3 py-2 text-xs text-orange-300 placeholder-neutral-600 focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Tiêu đề chính: <strong className="text-white">{sectionConfig.title}</strong></span>
            <span className="text-emerald-400 font-bold">Đồng bộ tự động 2 chiều</span>
          </div>
        </div>
      </div>

      {/* 3. Live Interactive Preview (Desktop 3 ưu đãi, Mobile 1 ưu đãi) */}
      <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm sm:text-base font-black text-white">
              Xem Trước Hiển Thị Trượt Ngang (Live Slider Preview)
            </h3>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => { setPreviewMode('desktop'); setPreviewIndex(0); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === 'desktop'
                  ? 'bg-orange-500 text-stone-950 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Máy tính (3 Ưu Đãi)</span>
            </button>
            <button
              type="button"
              onClick={() => { setPreviewMode('mobile'); setPreviewIndex(0); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === 'mobile'
                  ? 'bg-orange-500 text-stone-950 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Điện thoại (1 Ưu Đãi)</span>
            </button>
          </div>
        </div>

        {/* Live Preview Container with Glassmorphism */}
        <div className="rounded-2xl p-5 sm:p-7 bg-gradient-to-b from-[#e8decb]/90 via-[#f4eee4]/95 to-[#ede4d4]/90 border border-amber-900/20 shadow-inner">
          {/* Header Preview */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
            {sectionConfig.showBadge && sectionConfig.badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white/90 text-[#8c5932] text-[11px] font-black uppercase tracking-wider shadow-2xs">
                <Percent className="w-3 h-3 text-orange-600" />
                <span>{sectionConfig.badge}</span>
              </div>
            )}
            <h3 className="text-xl sm:text-2xl font-black text-[#2b170e] uppercase tracking-tight leading-tight">
              {sectionConfig.title}{' '}
              <span className="text-[#8c5932]">{sectionConfig.highlightTitle}</span>
            </h3>
            {sectionConfig.subtitle && (
              <p className="text-xs text-[#5c3d2e] font-medium leading-relaxed">
                {sectionConfig.subtitle}
              </p>
            )}
          </div>

          {/* Interactive Carousel Preview */}
          <div className={`relative mx-auto ${previewMode === 'mobile' ? 'max-w-sm' : 'max-w-5xl'}`}>
            {promotions.length > previewVisibleCount && (
              <>
                <button
                  type="button"
                  onClick={() => setPreviewIndex(prev => (prev <= 0 ? previewMaxIndex : prev - 1))}
                  className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 text-[#2b170e] hover:bg-[#2b170e] hover:text-white border border-stone-200/90 shadow-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewIndex(prev => (prev >= previewMaxIndex ? 0 : prev + 1))}
                  className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 text-[#2b170e] hover:bg-[#2b170e] hover:text-white border border-stone-200/90 shadow-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

            <div className="overflow-hidden py-1">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${safePreviewIndex * (100 / previewVisibleCount)}%)`
                }}
              >
                {promotions.map((promo, i) => (
                  <div
                    key={promo.id || i}
                    className={`${previewMode === 'mobile' ? 'w-full' : 'w-1/3'} shrink-0 px-2`}
                  >
                    <div className="relative rounded-2xl overflow-hidden aspect-3/4 border-2 border-white/80 shadow-md group bg-stone-900">
                      <img 
                        src={promo.image} 
                        alt={promo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image || 'https://ilyxybkcndjcnzrtjjiq.supabase.co/storage/v1/object/public/coffee2424-media/promos/1792406318618_erer5hh.png'; }}
                      />
                      {promo.tag && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                            {promo.tag}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/95 via-black/75 to-transparent text-white space-y-1">
                        <h4 className="text-xs font-black leading-tight line-clamp-1">{promo.title}</h4>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-bold text-amber-300">{promo.discount || 'GIẢM 20%'}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-0.5">
                            <span>{promo.cta || 'Xem Chi Tiết'}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Dots */}
            {promotions.length > previewVisibleCount && previewMaxIndex > 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {Array.from({ length: previewMaxIndex + 1 }).map((_, dIdx) => (
                  <button
                    key={dIdx}
                    type="button"
                    onClick={() => setPreviewIndex(dIdx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      safePreviewIndex === dIdx
                        ? 'w-6 bg-[#2b170e]'
                        : 'w-1.5 bg-[#8c5932]/30 hover:bg-[#8c5932]/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Form Danh sách Ưu Đãi (Chỉnh sửa từng ưu đãi) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <span>Danh Sách Thẻ Ưu Đãi ({promotions.length} thẻ)</span>
          </h3>
          <button
            type="button"
            onClick={handleAddPromotion}
            className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Ưu Đãi Nữa</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions.map((promo, idx) => (
            <div 
              key={promo.id || idx}
              className="bg-neutral-950 rounded-3xl border border-neutral-800 p-5 space-y-4 shadow-md flex flex-col justify-between relative group hover:border-orange-500/50 transition-colors"
            >
              <div className="space-y-3.5">
                {/* Top Action Header */}
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                  <span className="text-xs font-black text-orange-400 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5" />
                    <span>Ưu Đãi Số #{idx + 1}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMovePromotion(idx, 'up')}
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Chuyển lên trước"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === promotions.length - 1}
                      onClick={() => handleMovePromotion(idx, 'down')}
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Chuyển ra sau"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicatePromotion(idx)}
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white cursor-pointer"
                      title="Nhân bản thẻ này"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePromotion(idx)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                      title="Xóa ưu đãi này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Image Preview & Upload (Portrait 3:4) */}
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-neutral-800 group/img">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image || 'https://ilyxybkcndjcnzrtjjiq.supabase.co/storage/v1/object/public/coffee2424-media/promos/1792406318618_erer5hh.png'; }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                      {promo.tag || 'ƯU ĐÃI'}
                    </span>
                  </div>
                  <label className="absolute inset-0 bg-black/70 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-1.5 text-white text-xs font-bold cursor-pointer transition-opacity backdrop-blur-xs">
                    <Upload className="w-5 h-5 text-orange-400" />
                    <span>Đổi Ảnh Từ Máy Tính</span>
                    <span className="text-[10px] text-amber-300 font-mono">Tỉ lệ dọc chuẩn 3:4</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleUploadPromotionImage(idx, e.target.files?.[0])}
                    />
                  </label>
                </div>

                {/* Form Fields */}
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Huy Hiệu Góc (Tag)
                      </label>
                      <input
                        type="text"
                        value={promo.tag || ''}
                        onChange={(e) => handleUpdatePromotionField(idx, 'tag', e.target.value)}
                        placeholder="VD: GIỜ VÀNG"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Nhãn Badge (Nổi bật)
                      </label>
                      <input
                        type="text"
                        value={promo.badge || ''}
                        onChange={(e) => handleUpdatePromotionField(idx, 'badge', e.target.value)}
                        placeholder="VD: HOT DEAL 🔥"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Tên Chương Trình / Combo
                    </label>
                    <input
                      type="text"
                      value={promo.title || ''}
                      onChange={(e) => handleUpdatePromotionField(idx, 'title', e.target.value)}
                      placeholder="VD: GIẢM 40% TẤT CẢ ĐỒ UỐNG"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Danh Mục (Filter Tab)
                      </label>
                      <select
                        value={promo.category || 'all'}
                        onChange={(e) => handleUpdatePromotionField(idx, 'category', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="all">Tất Cả Ưu Đãi</option>
                        <option value="drinks">Giảm Giá Đồ Uống</option>
                        <option value="combo">Combo No Bụng</option>
                        <option value="night">Cú Đêm 22h - 6h</option>
                        <option value="student">Học Nhóm & Sinh Viên</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-amber-400 block mb-1">
                        Mã Voucher (Code)
                      </label>
                      <input
                        type="text"
                        value={promo.code || ''}
                        onChange={(e) => handleUpdatePromotionField(idx, 'code', e.target.value.toUpperCase())}
                        placeholder="VD: HAPPY40"
                        className="w-full bg-neutral-900 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-amber-300 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-rose-400 block mb-1">
                        Mức Giảm (Hiển thị)
                      </label>
                      <input
                        type="text"
                        value={promo.discount || ''}
                        onChange={(e) => handleUpdatePromotionField(idx, 'discount', e.target.value)}
                        placeholder="VD: GIẢM 40%"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-rose-300 placeholder-neutral-600 focus:outline-none focus:border-orange-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Giá Trị Chiết Khấu
                      </label>
                      <input
                        type="text"
                        value={promo.discountValue || ''}
                        onChange={(e) => handleUpdatePromotionField(idx, 'discountValue', e.target.value)}
                        placeholder="VD: 40% hoặc Tiết kiệm 35K"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Khung Giờ / Thời Hạn Áp Dụng
                    </label>
                    <input
                      type="text"
                      value={promo.validUntil || ''}
                      onChange={(e) => handleUpdatePromotionField(idx, 'validUntil', e.target.value)}
                      placeholder="VD: 16:00 - 19:00 Mỗi Ngày hoặc 24/24"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Mô Tả Chi Tiết Ưu Đãi
                    </label>
                    <textarea
                      rows={2}
                      value={promo.description || ''}
                      onChange={(e) => handleUpdatePromotionField(idx, 'description', e.target.value)}
                      placeholder="Mô tả các món áp dụng hoặc đối tượng khách hàng..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Điều Kiện Áp Dụng (Hiển thị khi bấm Xem Điều Kiện)
                    </label>
                    <input
                      type="text"
                      value={promo.condition || ''}
                      onChange={(e) => handleUpdatePromotionField(idx, 'condition', e.target.value)}
                      placeholder="VD: Áp dụng trên toàn hệ thống 2 chi nhánh 413PHI & 96D5..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Nút Bấm (CTA)
                      </label>
                      <input
                        type="text"
                        value={promo.cta || ''}
                        onChange={(e) => handleUpdatePromotionField(idx, 'cta', e.target.value)}
                        placeholder="VD: Dùng ngay / Lấy Mã"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Liên Kết (URL)
                      </label>
                      <input
                        type="text"
                        value={promo.link || ''}
                        onChange={(e) => handleUpdatePromotionField(idx, 'link', e.target.value)}
                        placeholder="VD: /khuyenmai hoặc /dathang"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Tùy chọn Ẩn / Hiện Mã Voucher, Nút Chép Mã, Nút Dùng Ngay */}
                  <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2 mt-1">
                    <span className="text-[10.5px] font-black text-amber-400 block uppercase tracking-wider">
                      ⚙️ Bật / Ẩn Nút Trên Thẻ Khuyến Mãi
                    </span>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {/* 1. Mã Voucher */}
                      <button
                        type="button"
                        onClick={() => handleUpdatePromotionField(idx, 'showVoucherCode', promo.showVoucherCode === false ? true : false)}
                        className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                          promo.showVoucherCode !== false
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                        }`}
                        title="Bật/Tắt hiển thị ô mã voucher"
                      >
                        <span>Mã Voucher</span>
                        <span className="font-mono text-[9px] font-black">{promo.showVoucherCode !== false ? '✓ ĐANG HIỆN' : '✕ ĐÃ ẨN'}</span>
                      </button>

                      {/* 2. Nút Chép Mã */}
                      <button
                        type="button"
                        onClick={() => handleUpdatePromotionField(idx, 'showCopyBtn', promo.showCopyBtn === false ? true : false)}
                        className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                          promo.showCopyBtn !== false
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                        }`}
                        title="Bật/Tắt nút chép mã"
                      >
                        <span>Nút Chép Mã</span>
                        <span className="font-mono text-[9px] font-black">{promo.showCopyBtn !== false ? '✓ ĐANG HIỆN' : '✕ ĐÃ ẨN'}</span>
                      </button>

                      {/* 3. Nút Dùng Ngay */}
                      <button
                        type="button"
                        onClick={() => handleUpdatePromotionField(idx, 'showCtaBtn', promo.showCtaBtn === false ? true : false)}
                        className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                          promo.showCtaBtn !== false
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                        }`}
                        title="Bật/Tắt nút dùng ngay"
                      >
                        <span>Nút Dùng Ngay</span>
                        <span className="font-mono text-[9px] font-black">{promo.showCtaBtn !== false ? '✓ ĐANG HIỆN' : '✕ ĐÃ ẨN'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="pt-3 border-t border-neutral-800/80 mt-2 flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[11px]">COFFEE 24/24 Promo</span>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Save className="w-3 h-3" />
                  <span>Lưu Thẻ Này</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Bottom Action Bar */}
      <div className="mt-8 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-neutral-400">
          💡 Thẻ ưu đãi sẽ tự động hiển thị trên Trang Chủ (3 thẻ trên máy tính, 1 thẻ trên điện thoại) kèm nút bấm điều hướng.
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleAddPromotion}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            + Thêm Ưu Đãi
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>LƯU TẤT CẢ ƯU ĐÃI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
