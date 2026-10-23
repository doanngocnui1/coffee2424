import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  Sparkles, 
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
  ArrowRight
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../../data/siteConfig';
import { uploadImageToSupabase } from '../../lib/supabase';

export default function AdminNewDishesManager({ config, onSaveConfig, triggerAlert }) {
  const defaultDishes = DEFAULT_SITE_CONFIG.newDishesList || [];

  const defaultSectionConfig = DEFAULT_SITE_CONFIG.newDishesSection || {
    enabled: true,
    badge: 'MENU MỚI TRÌNH LÀNG',
    showBadge: true,
    title: 'Món Mới Nổi Bật',
    highlightTitle: 'Đánh Thức Vị Giác',
    subtitle: 'Khám phá các thức uống sáng tạo và bánh nướng tươi ngon vừa ra mắt tại COFFEE 24/24.'
  };

  const [dishes, setDishes] = useState(() => {
    if (config?.newDishesList && Array.isArray(config.newDishesList) && config.newDishesList.length > 0) {
      return config.newDishesList;
    }
    return defaultDishes;
  });

  const [sectionConfig, setSectionConfig] = useState(() => {
    return {
      enabled: config?.newDishesSection?.enabled !== false,
      badge: config?.newDishesSection?.badge || defaultSectionConfig.badge,
      showBadge: config?.newDishesSection?.showBadge !== false,
      title: config?.newDishesSection?.title || defaultSectionConfig.title,
      highlightTitle: config?.newDishesSection?.highlightTitle || defaultSectionConfig.highlightTitle,
      subtitle: config?.newDishesSection?.subtitle || defaultSectionConfig.subtitle
    };
  });

  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' (3) | 'mobile' (1)
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    if (config?.newDishesList && Array.isArray(config.newDishesList) && config.newDishesList.length > 0) {
      setDishes(config.newDishesList);
    }
    if (config?.newDishesSection) {
      setSectionConfig({
        enabled: config.newDishesSection.enabled !== false,
        badge: config.newDishesSection.badge || defaultSectionConfig.badge,
        showBadge: config.newDishesSection.showBadge !== false,
        title: config.newDishesSection.title || defaultSectionConfig.title,
        highlightTitle: config.newDishesSection.highlightTitle || defaultSectionConfig.highlightTitle,
        subtitle: config.newDishesSection.subtitle || defaultSectionConfig.subtitle
      });
    }
  }, [config]);

  const previewVisibleCount = previewMode === 'desktop' ? 3 : 1;
  const previewMaxIndex = Math.max(0, dishes.length - previewVisibleCount);
  const safePreviewIndex = Math.min(previewIndex, previewMaxIndex);

  const handleAddDish = () => {
    const newId = `dish-${Date.now()}`;
    const newDish = {
      id: newId,
      tag: 'MÓN MỚI',
      title: 'Món Mới Đặc Sắc COFFEE 24/24',
      price: '45.000đ',
      image: '/images/signature_drinks.jpg',
      cta: 'Thử Món Mới',
      link: '/dathang'
    };
    setDishes(prev => [...prev, newDish]);
    triggerAlert?.('✓ Đã thêm 1 thẻ món mới! Hãy chỉnh sửa thông tin và nhấn Lưu.');
  };

  const handleDeleteDish = (index) => {
    if (dishes.length <= 1) {
      alert('Cần giữ lại ít nhất 1 món mới để hiển thị trên website!');
      return;
    }
    const itemTitle = dishes[index]?.title || `Món #${index + 1}`;
    if (window.confirm(`Bạn có chắc muốn xóa "${itemTitle}" khỏi danh sách món mới?`)) {
      const updated = dishes.filter((_, i) => i !== index);
      setDishes(updated);
      triggerAlert?.(`Đã xóa món "${itemTitle}". Nhớ nhấn nút Lưu để áp dụng.`);
    }
  };

  const handleDuplicateDish = (index) => {
    const target = dishes[index];
    if (!target) return;
    const duplicated = {
      ...target,
      id: `dish-${Date.now()}`,
      title: `${target.title} (Bản sao)`
    };
    const updated = [...dishes];
    updated.splice(index + 1, 0, duplicated);
    setDishes(updated);
    triggerAlert?.('✓ Đã nhân bản món mới!');
  };

  const handleMoveDish = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dishes.length) return;
    const updated = [...dishes];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setDishes(updated);
  };

  const handleUpdateDishField = (index, field, value) => {
    setDishes(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  // Tải ảnh lên Supabase Storage (kèm nén ảnh dự phòng)
  const handleUploadDishImage = async (index, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP, GIF...).');
      return;
    }

    triggerAlert?.('⏳ Đang tải ảnh món mới lên Supabase Storage...');

    try {
      const cloudUrl = await uploadImageToSupabase(file, 'dishes');
      if (cloudUrl) {
        handleUpdateDishField(index, 'image', cloudUrl);
        triggerAlert?.(`✓ Đã tải ảnh món số ${index + 1} lên Supabase Storage thành công! Bấm "LƯU CẤU HÌNH" để áp dụng.`);
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
        handleUpdateDishField(index, 'image', compressed);
        triggerAlert?.(`✓ Đã nén và lưu ảnh cho món số ${index + 1}!`);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = () => {
    const isEnabled = sectionConfig.enabled !== false;
    const currentHomeSections = config?.homeSections || DEFAULT_SITE_CONFIG.homeSections;
    const updatedHomeSections = currentHomeSections.map(sec => {
      if (sec.type === 'newDishes' || sec.id === 'sec-newDishes') {
        return { ...sec, enabled: isEnabled };
      }
      return sec;
    });

    const updatedConfig = {
      ...config,
      newDishesSection: sectionConfig,
      newDishesList: dishes,
      homeSections: updatedHomeSections
    };
    onSaveConfig?.(updatedConfig);
    triggerAlert?.('✓ Đã lưu toàn bộ Cấu Hình & Danh Sách Món Mới thành công! Trang chủ đã tự động cập nhật.');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh sách Món Mới về 3 món mặc định ban đầu? Các thay đổi tùy chỉnh sẽ bị đặt lại.')) {
      setDishes(defaultDishes);
      setSectionConfig(defaultSectionConfig);
      const updatedConfig = {
        ...config,
        newDishesSection: defaultSectionConfig,
        newDishesList: defaultDishes
      };
      onSaveConfig?.(updatedConfig);
      triggerAlert?.('Đã đặt lại danh sách Món Mới về mặc định!');
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Box */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-950 p-6 rounded-3xl border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Quản Lý Món Mới Trình Làng</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {dishes.length} Món
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Quản lý thẻ poster dọc 3x4 giới thiệu các món đồ uống và món ăn mới nhất trên Trang Chủ.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddDish}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Thêm Món Mới</span>
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

      {/* 2. Cấu hình tiêu đề khối Món Mới */}
      <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
              Tiêu Đề & Giới Thiệu Khối Món Mới (Trang Chủ)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-bold">Hiển Thị Trên Trang Chủ:</span>
            <button
              type="button"
              onClick={() => setSectionConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                sectionConfig.enabled
                  ? 'bg-emerald-500 text-stone-950 shadow-xs'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {sectionConfig.enabled ? '✓ ĐANG BẬT' : '✕ ĐÃ ẨN'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-300">Huy Hiệu (Badge)</label>
              <button
                type="button"
                onClick={() => setSectionConfig(prev => ({ ...prev, showBadge: !prev.showBadge }))}
                className="text-[10px] text-amber-400 hover:underline font-bold"
              >
                {sectionConfig.showBadge ? 'Ẩn badge' : 'Hiện badge'}
              </button>
            </div>
            <input
              type="text"
              value={sectionConfig.badge}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, badge: e.target.value }))}
              placeholder="VD: MENU MỚI TRÌNH LÀNG"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300">Tiêu Đề Dòng 1</label>
            <input
              type="text"
              value={sectionConfig.title}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, title: e.target.value }))}
              placeholder="VD: Món Mới Nổi Bật"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-400">Chữ Nhấn Màu Đồng Dòng 2</label>
            <input
              type="text"
              value={sectionConfig.highlightTitle}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, highlightTitle: e.target.value }))}
              placeholder="VD: Đánh Thức Vị Giác"
              className="w-full bg-neutral-900 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-amber-300 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-neutral-300">Mô Tả Ngắn Phụ Đề</label>
            <input
              type="text"
              value={sectionConfig.subtitle}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="VD: Khám phá các thức uống sáng tạo và bánh nướng tươi ngon vừa ra mắt tại COFFEE 24/24."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Live Interactive Preview (Desktop 3 món, Mobile 1 món) */}
      <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
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
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Máy tính (3 Món)</span>
            </button>
            <button
              type="button"
              onClick={() => { setPreviewMode('mobile'); setPreviewIndex(0); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === 'mobile'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Điện thoại (1 Món)</span>
            </button>
          </div>
        </div>

        {/* Live Preview Container with Glassmorphism */}
        <div className="rounded-2xl p-5 sm:p-7 bg-gradient-to-b from-[#e8decb]/90 via-[#f4eee4]/95 to-[#ede4d4]/90 border border-amber-900/20 shadow-inner">
          {/* Header Preview */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
            {sectionConfig.showBadge && sectionConfig.badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white/90 text-[#8c5932] text-[11px] font-black uppercase tracking-wider shadow-2xs">
                <UtensilsCrossed className="w-3 h-3 text-amber-600" />
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
            {dishes.length > previewVisibleCount && (
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
                {dishes.map((dish, i) => (
                  <div
                    key={dish.id || i}
                    className={`${previewMode === 'mobile' ? 'w-full' : 'w-1/3'} shrink-0 px-2`}
                  >
                    <div className="relative rounded-2xl overflow-hidden aspect-3/4 border-2 border-white/80 shadow-md group bg-stone-900">
                      <img 
                        src={dish.image} 
                        alt={dish.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = '/images/signature_drinks.jpg'; }}
                      />
                      {dish.tag && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2b170e]/90 text-amber-300 border border-white/20 shadow-xs">
                            {dish.tag}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/95 via-black/75 to-transparent text-white space-y-1">
                        <h4 className="text-xs font-black leading-tight line-clamp-1">{dish.title}</h4>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-bold text-amber-300">{dish.price || '45.000đ'}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-0.5">
                            <span>{dish.cta || 'Thử Ngay'}</span>
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
            {dishes.length > previewVisibleCount && previewMaxIndex > 0 && (
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

      {/* 4. Form Danh sách Món Mới (Chỉnh sửa từng món) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <span>Danh Sách Thẻ Món Mới ({dishes.length} thẻ)</span>
          </h3>
          <button
            type="button"
            onClick={handleAddDish}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Món Mới Nữa</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dishes.map((dish, idx) => (
            <div 
              key={dish.id || idx}
              className="bg-neutral-950 rounded-3xl border border-neutral-800 p-5 space-y-4 shadow-md flex flex-col justify-between relative group hover:border-amber-500/50 transition-colors"
            >
              <div className="space-y-3.5">
                {/* Top Action Header */}
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Món Số #{idx + 1}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveDish(idx, 'up')}
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Chuyển lên trước"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === dishes.length - 1}
                      onClick={() => handleMoveDish(idx, 'down')}
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Chuyển ra sau"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateDish(idx)}
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white cursor-pointer"
                      title="Nhân bản thẻ này"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDish(idx)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                      title="Xóa món này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Image Preview & Upload */}
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-neutral-900 border border-neutral-800 group/img">
                  <img 
                    src={dish.image} 
                    alt={dish.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/images/signature_drinks.jpg'; }}
                  />
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-1.5 text-white text-xs font-bold cursor-pointer transition-opacity backdrop-blur-xs">
                    <Upload className="w-5 h-5 text-amber-400" />
                    <span>Đổi Ảnh Từ Máy Tính</span>
                    <span className="text-[10px] text-neutral-400">Tỉ lệ chuẩn 3:4</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleUploadDishImage(idx, e.target.files?.[0])}
                    />
                  </label>
                </div>

                {/* Form Fields */}
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Huy Hiệu Góc (Tag)
                    </label>
                    <input
                      type="text"
                      value={dish.tag || ''}
                      onChange={(e) => handleUpdateDishField(idx, 'tag', e.target.value)}
                      placeholder="VD: MÓN MỚI / SIGNATURE"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Tên Món Mới
                    </label>
                    <input
                      type="text"
                      value={dish.title || ''}
                      onChange={(e) => handleUpdateDishField(idx, 'title', e.target.value)}
                      placeholder="VD: Matcha MK4 Latte & Cold Brew Cam Vàng"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-amber-400 block mb-1">
                        Giá / Điểm Nhấn
                      </label>
                      <input
                        type="text"
                        value={dish.price || ''}
                        onChange={(e) => handleUpdateDishField(idx, 'price', e.target.value)}
                        placeholder="VD: 45.000đ"
                        className="w-full bg-neutral-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Nút Bấm (CTA)
                      </label>
                      <input
                        type="text"
                        value={dish.cta || ''}
                        onChange={(e) => handleUpdateDishField(idx, 'cta', e.target.value)}
                        placeholder="VD: Thử Món Mới"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Liên Kết Khi Bấm (URL)
                    </label>
                    <input
                      type="text"
                      value={dish.link || ''}
                      onChange={(e) => handleUpdateDishField(idx, 'link', e.target.value)}
                      placeholder="VD: /dathang"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="pt-3 border-t border-neutral-800/80 mt-2 flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[11px]">COFFEE 24/24 Menu</span>
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
          💡 Thẻ món mới sẽ tự động hiển thị trên Trang Chủ (3 thẻ trên máy tính, 1 thẻ trên điện thoại) kèm nút bấm điều hướng.
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleAddDish}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            + Thêm Món
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>LƯU TẤT CẢ MÓN MỚI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
