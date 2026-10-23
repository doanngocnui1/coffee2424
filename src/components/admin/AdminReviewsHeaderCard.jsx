import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Sparkles, 
  Eye, 
  Save, 
  RotateCcw, 
  Check, 
  Sliders, 
  Type, 
  Globe 
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../../data/siteConfig';

export default function AdminReviewsHeaderCard({ config, onSaveConfig, triggerAlert }) {
  const defaultHeader = DEFAULT_SITE_CONFIG.reviewsSection || {
    enabled: true,
    badge: 'CẢM NHẬN THỰC TẾ',
    showBadge: true,
    title: 'Khách Hàng Đánh Giá',
    highlightTitle: 'Như Thế Nào Về Chúng Tôi?',
    subtitle: 'Hơn 1.200 đánh giá 5 sao từ cộng đồng học sinh, sinh viên các trường đại học lân cận, lập trình viên và giới freelancer chạy deadline thâu đêm.',
    googleRatingText: '4.9 / 5.0 ⭐ trên Google Maps (1.200+ đánh giá)',
    showGoogleRating: true
  };

  const [headerData, setHeaderData] = useState(() => {
    return config?.reviewsSection || defaultHeader;
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (config?.reviewsSection) {
      setHeaderData(config.reviewsSection);
      setIsDirty(false);
    }
  }, [config?.reviewsSection]);

  const updateField = (field, val) => {
    setHeaderData(prev => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const updatedConfig = {
      ...config,
      reviewsSection: headerData
    };
    if (onSaveConfig) {
      onSaveConfig(updatedConfig);
    }
    setIsDirty(false);
    if (triggerAlert) {
      triggerAlert('✓ Đã lưu cấu hình Tiêu đề & Giới thiệu khối Đánh Giá thành công!');
    }
  };

  const handleReset = () => {
    if (window.confirm('Khôi phục tiêu đề & mô tả khối Đánh Giá về nội dung chuẩn ban đầu?')) {
      setHeaderData(defaultHeader);
      const updatedConfig = {
        ...config,
        reviewsSection: defaultHeader
      };
      if (onSaveConfig) {
        onSaveConfig(updatedConfig);
      }
      setIsDirty(false);
      if (triggerAlert) {
        triggerAlert('Đã đặt lại tiêu đề khối Đánh Giá về mặc định!');
      }
    }
  };

  return (
    <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-6 sm:p-7 shadow-xl space-y-6">
      {/* Top Banner & Section Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>Cấu Hình Tiêu Đề & Giới Thiệu Khối Đánh Giá</span>
              {isDirty && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold animate-pulse">
                  Chưa lưu
                </span>
              )}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Chỉnh sửa nội dung văn bản hiển thị phía trên danh sách đánh giá tại Trang Chủ.
            </p>
          </div>
        </div>

        {/* Global Visibility Toggle */}
        <div className="flex items-center gap-3 bg-neutral-900/90 px-4 py-2 rounded-2xl border border-neutral-800">
          <span className="text-xs text-neutral-300 font-bold">Khối Trên Trang Chủ:</span>
          <button
            type="button"
            onClick={() => updateField('enabled', headerData.enabled === false ? true : false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              headerData.enabled !== false
                ? 'bg-emerald-500 text-stone-950 shadow-xs'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            {headerData.enabled !== false ? '✓ ĐANG BẬT' : '✕ ĐÃ ẨN'}
          </button>
        </div>
      </div>

      {/* Live Interactive Preview Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400 font-bold">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Xem trước trực tiếp hiển thị Trang Chủ (Live Preview):</span>
          </span>
          <span className="text-[11px] text-neutral-500 italic">Tự động cập nhật theo nội dung bạn gõ</span>
        </div>

        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#e8decb]/90 via-[#f4eee4]/95 to-[#ede4d4]/90 border border-amber-900/20 shadow-inner text-center space-y-4 relative overflow-hidden">
          {/* Preview Badge */}
          {headerData.showBadge !== false && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white/90 text-[#8c5932] text-xs font-black uppercase tracking-wider shadow-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{headerData.badge || 'CẢM NHẬN THỰC TẾ'}</span>
            </div>
          )}

          {/* Preview Title */}
          <h2 className="text-2xl sm:text-4xl font-black text-[#2b170e] tracking-tight uppercase leading-[1.3]">
            {headerData.title || 'Khách Hàng Đánh Giá'}{' '}
            <br className="hidden sm:inline" />
            <span className="text-[#8c5932] inline-block mt-1">
              {headerData.highlightTitle || 'Như Thế Nào Về Chúng Tôi?'}
            </span>
          </h2>

          {/* Preview Subtitle */}
          {headerData.subtitle && (
            <p className="text-xs sm:text-base text-[#5c3d2e] font-medium leading-relaxed max-w-2xl mx-auto">
              {headerData.subtitle}
            </p>
          )}

          {/* Preview Google Rating Pill */}
          {headerData.showGoogleRating !== false && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 text-[#5c3d2e] text-xs font-bold border border-white shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{headerData.googleRatingText || '4.9 / 5.0 ⭐ trên Google Maps (1.200+ đánh giá)'}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Editing Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Huy hiệu Badge */}
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Huy Hiệu Nhỏ (Badge)</span>
            </label>
            <button
              type="button"
              onClick={() => updateField('showBadge', headerData.showBadge === false ? true : false)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                headerData.showBadge !== false
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-neutral-800 text-neutral-500'
              }`}
            >
              {headerData.showBadge !== false ? 'Đang hiện' : 'Đang ẩn'}
            </button>
          </div>
          <input
            type="text"
            value={headerData.badge || ''}
            onChange={(e) => updateField('badge', e.target.value)}
            placeholder="VD: CẢM NHẬN THỰC TẾ"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Dòng Điểm Uy Tín Google Maps */}
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Huy Hiệu Google Maps (Thanh Hành Động)</span>
            </label>
            <button
              type="button"
              onClick={() => updateField('showGoogleRating', headerData.showGoogleRating === false ? true : false)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                headerData.showGoogleRating !== false
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-neutral-800 text-neutral-500'
              }`}
            >
              {headerData.showGoogleRating !== false ? 'Đang hiện' : 'Đang ẩn'}
            </button>
          </div>
          <input
            type="text"
            value={headerData.googleRatingText || ''}
            onChange={(e) => updateField('googleRatingText', e.target.value)}
            placeholder="VD: 4.9 / 5.0 ⭐ trên Google Maps (1.200+ đánh giá)"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Tiêu đề Dòng 1 */}
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <label className="text-xs font-bold text-neutral-300 block">
            Tiêu Đề Chính (Dòng 1)
          </label>
          <input
            type="text"
            value={headerData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="VD: Khách Hàng Đánh Giá"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Chữ Nhấn Màu Đồng Dòng 2 */}
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <label className="text-xs font-bold text-amber-400 block">
            Chữ Nhấn Màu Đồng Nổi Bật (Dòng 2)
          </label>
          <input
            type="text"
            value={headerData.highlightTitle || ''}
            onChange={(e) => updateField('highlightTitle', e.target.value)}
            placeholder="VD: Như Thế Nào Về Chúng Tôi?"
            className="w-full bg-neutral-950 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Đoạn Mô Tả Chi Tiết */}
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-neutral-300 block">
            Đoạn Văn Mô Tả / Phụ Đề
          </label>
          <textarea
            rows={2}
            value={headerData.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="VD: Hơn 1.200 đánh giá 5 sao từ cộng đồng học sinh, sinh viên các trường đại học lân cận..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        {/* Link Trang Đích Khi Bấm Nút Đánh Giá (Zalo OA / Chat Zalo) */}
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-400">
              Trang Đích Khi Bấm Nút "Đánh Giá" (Mở Chat Zalo Tiếp Nhận Đánh Giá)
            </label>
            <span className="text-[11px] text-emerald-400 font-bold">Zalo: 0906 916 816</span>
          </div>
          <input
            type="text"
            value={headerData.reviewLink || 'https://zalo.me/0906916816'}
            onChange={(e) => updateField('reviewLink', e.target.value)}
            placeholder="https://zalo.me/0906916816"
            className="w-full bg-neutral-950 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono font-bold"
          />
          <p className="text-[11px] text-neutral-400">
            Khi khách hàng bấm nút "Đánh giá" trên Trang Chủ, hệ thống sẽ tự động mở trang đích Zalo này để khách gửi phản hồi & góp ý trực tiếp.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/80">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Khôi Phục Mặc Định</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
            isDirty
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 scale-102 animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>{isDirty ? 'LƯU THAY ĐỔI TIÊU ĐỀ' : 'ĐÃ ĐỒNG BỘ MỚI NHẤT'}</span>
        </button>
      </div>
    </div>
  );
}
