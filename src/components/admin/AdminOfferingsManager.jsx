import React, { useState } from 'react';
import { 
  Coffee, 
  Sparkles, 
  Sun, 
  Heart, 
  Flame, 
  Wind, 
  UtensilsCrossed, 
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
  ShoppingBag,
  Tag,
  Check,
  Zap,
  Star,
  Award
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../../data/siteConfig';
import { uploadImageToSupabase } from '../../lib/supabase';

// Danh sách biểu tượng phổ biến có thể chọn cho danh mục món
export const AVAILABLE_OFFERING_ICONS = [
  { name: 'Coffee', label: 'Cà phê', icon: Coffee },
  { name: 'Sparkles', label: 'Matcha / Ngôi sao', icon: Sparkles },
  { name: 'Sun', label: 'Trà trái cây / Mặt trời', icon: Sun },
  { name: 'Heart', label: 'Trà sữa / Trái tim', icon: Heart },
  { name: 'Flame', label: 'Cacao / Lửa ấm', icon: Flame },
  { name: 'Wind', label: 'Đá xay / Gió mát', icon: Wind },
  { name: 'UtensilsCrossed', label: 'Bếp / Thức ăn', icon: UtensilsCrossed },
  { name: 'Zap', label: 'Tia chớp / Năng lượng', icon: Zap },
  { name: 'Star', label: 'Ngôi sao / Đặc biệt', icon: Star },
  { name: 'Award', label: 'Huy chương / Cao cấp', icon: Award }
];

export function getOfferingIconComponent(iconName) {
  const found = AVAILABLE_OFFERING_ICONS.find(i => i.name === iconName);
  return found ? found.icon : Coffee;
}

export default function AdminOfferingsManager({ config, onSaveConfig, triggerAlert }) {
  const defaultOfferings = DEFAULT_SITE_CONFIG.offeringsList || [];
  const defaultSectionConfig = DEFAULT_SITE_CONFIG.offeringsSection || {
    enabled: true,
    title: 'COFFEE 24/24 BÁN GÌ?',
    quote: 'Chúng tôi có bán nhiều loại thức uống từ cà phê, matcha, matcha mk4, trà trái cây, trà trái cây tươi, trà sữa, thức uống chế biến từ cacao, các món đá xay, và phục vụ các loại thức ăn.'
  };

  const [offerings, setOfferings] = useState(config.offeringsList || defaultOfferings);
  const [sectionConfig, setSectionConfig] = useState(config.offeringsSection || defaultSectionConfig);
  const [activeOfferingIdx, setActiveOfferingIdx] = useState(0);
  const [previewOfferingIdx, setPreviewOfferingIdx] = useState(0);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'

  const currentItem = offerings[activeOfferingIdx] || offerings[0] || {};

  // Thêm nhóm món mới
  const handleAddOffering = () => {
    const newId = `offering-${Date.now()}`;
    const newOffering = {
      id: newId,
      tabLabel: `Món Mới ${offerings.length + 1}`,
      category: 'DANH MỤC THỨC UỐNG MỚI',
      icon: 'Coffee',
      badge: 'Đặc Quyền 24/7',
      title: 'Tên Bộ Sưu Tập Món Mới',
      subtitle: 'Hương vị độc đáo, tươi mới mỗi ngày',
      story: 'Mô tả chi tiết câu chuyện, nguồn gốc nguyên liệu và cảm nhận tinh tế khi thưởng thức món tại Coffee 24/24.',
      highlights: ['Món đặc trưng 1', 'Món đặc trưng 2', 'Món đặc trưng 3'],
      image: '/images/promo_banner.jpg',
      ctaText: 'Xem Chi Tiết Món & Đặt Ngay',
      ctaLink: '/dathang'
    };
    const updated = [...offerings, newOffering];
    setOfferings(updated);
    setActiveOfferingIdx(updated.length - 1);
    setPreviewOfferingIdx(updated.length - 1);
    triggerAlert?.('✓ Đã thêm nhóm món mới vào danh sách!');
  };

  // Xóa 1 nhóm món
  const handleDeleteOffering = (index, e) => {
    e?.stopPropagation();
    if (offerings.length <= 1) {
      alert('Phải giữ lại ít nhất 1 nhóm món trong danh sách.');
      return;
    }
    if (window.confirm(`Xóa nhóm món "${offerings[index]?.tabLabel || 'này'}"?`)) {
      const updated = offerings.filter((_, i) => i !== index);
      setOfferings(updated);
      const nextIdx = Math.max(0, Math.min(activeOfferingIdx, updated.length - 1));
      setActiveOfferingIdx(nextIdx);
      setPreviewOfferingIdx(Math.min(previewOfferingIdx, updated.length - 1));
      triggerAlert?.('✓ Đã xóa nhóm món!');
    }
  };

  // Nhân bản nhóm món
  const handleDuplicateOffering = (index, e) => {
    e?.stopPropagation();
    const source = offerings[index];
    if (!source) return;
    const duplicated = {
      ...source,
      id: `offering-${Date.now()}`,
      tabLabel: `${source.tabLabel} (Bản sao)`
    };
    const updated = [...offerings];
    updated.splice(index + 1, 0, duplicated);
    setOfferings(updated);
    setActiveOfferingIdx(index + 1);
    setPreviewOfferingIdx(index + 1);
    triggerAlert?.('✓ Đã nhân bản nhóm món!');
  };

  // Di chuyển thứ tự
  const handleMoveOffering = (index, direction, e) => {
    e?.stopPropagation();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= offerings.length) return;
    const updated = [...offerings];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setOfferings(updated);
    setActiveOfferingIdx(targetIndex);
    setPreviewOfferingIdx(targetIndex);
  };

  // Cập nhật trường của nhóm món đang chọn
  const handleUpdateCurrentField = (field, value) => {
    setOfferings(prev => {
      const updated = [...prev];
      if (updated[activeOfferingIdx]) {
        updated[activeOfferingIdx] = {
          ...updated[activeOfferingIdx],
          [field]: value
        };
      }
      return updated;
    });
  };

  // Tải ảnh trực tiếp lên Supabase Storage
  const handleUploadImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP, GIF...).');
      return;
    }

    triggerAlert?.('⏳ Đang tải ảnh lên Supabase Storage...');

    try {
      const cloudUrl = await uploadImageToSupabase(file, 'offerings');
      if (cloudUrl) {
        handleUpdateCurrentField('image', cloudUrl);
        triggerAlert?.(`✓ Đã tải ảnh lên Supabase Storage thành công! Bấm "LƯU CẤU HÌNH" để áp dụng.`);
        return;
      }
    } catch (err) {
      console.warn('Lỗi tải ảnh lên Supabase:', err);
    }

    // Fallback: nén canvas
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const maxW = 1200;
        const maxH = 900;
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
        handleUpdateCurrentField('image', compressed);
        triggerAlert?.(`✓ Đã nén và lưu ảnh dự phòng!`);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Quản lý highlights (danh sách món đặc trưng)
  const handleAddHighlight = () => {
    const currentHighlights = currentItem.highlights || [];
    handleUpdateCurrentField('highlights', [...currentHighlights, 'Món mới nổi bật']);
  };

  const handleUpdateHighlight = (hIdx, val) => {
    const currentHighlights = [...(currentItem.highlights || [])];
    currentHighlights[hIdx] = val;
    handleUpdateCurrentField('highlights', currentHighlights);
  };

  const handleDeleteHighlight = (hIdx) => {
    const currentHighlights = (currentItem.highlights || []).filter((_, i) => i !== hIdx);
    handleUpdateCurrentField('highlights', currentHighlights);
  };

  // Lưu toàn bộ cấu hình
  const handleSaveAll = () => {
    const updatedConfig = {
      ...config,
      offeringsSection: sectionConfig,
      offeringsList: offerings
    };
    onSaveConfig?.(updatedConfig);
    triggerAlert?.('✓ Đã lưu cấu hình "Coffee 24/24 Bán Gì?" thành công! Trang chủ đã tự động cập nhật.');
  };

  // Khôi phục mặc định
  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh sách và nội dung về 7 nhóm món mặc định ban đầu của Coffee 24/24?')) {
      setOfferings(defaultOfferings);
      setSectionConfig(defaultSectionConfig);
      const updatedConfig = {
        ...config,
        offeringsSection: defaultSectionConfig,
        offeringsList: defaultOfferings
      };
      onSaveConfig?.(updatedConfig);
      triggerAlert?.('✓ Đã khôi phục 7 nhóm món mặc định thành công!');
    }
  };

  const previewItem = offerings[previewOfferingIdx] || offerings[0] || {};
  const PreviewIcon = getOfferingIconComponent(previewItem.icon);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Card */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-[#2b170e] via-[#3a2215] to-[#1c0f09] text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
              <Coffee className="w-3.5 h-3.5" />
              <span>SÂN KHẤU TRÌNH DIỄN SẢN PHẨM TRANG CHỦ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Quản Lý "COFFEE 24/24 BÁN GÌ?"
            </h2>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
              Tùy biến 7 nhóm thức uống & món ăn đặc sắc (Cà phê rang mộc, Matcha MK4, Trà trái cây, Trà sữa, Cacao, Đá xay, Bếp đêm) hoặc thêm mới các nhóm tùy chỉnh theo nhu cầu quán.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-white/15 active:scale-95"
              title="Khôi phục 7 nhóm mặc định"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Khôi Phục Mặc Định</span>
            </button>

            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-black text-sm transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>LƯU CẤU HÌNH</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Tiêu Đề Mục & Câu Trích Dẫn Toàn Cục */}
      <div className="p-6 rounded-[28px] bg-white/80 backdrop-blur-xl border border-stone-200/70 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#8c5932]" />
            <h3 className="text-base font-bold text-[#2b170e]">Tiêu Đề & Câu Trích Dẫn Giới Thiệu Của Mục</h3>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={sectionConfig.enabled !== false}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, enabled: e.target.checked }))}
              className="rounded accent-amber-600 w-4 h-4"
            />
            <span className="text-xs font-bold text-[#422c1e]">Hiển thị mục này trên Trang Chủ</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-stone-600 block">Tiêu Đề Lớn Viết Hoa</label>
            <input 
              type="text"
              value={sectionConfig.title || ''}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, title: e.target.value }))}
              placeholder="COFFEE 24/24 BÁN GÌ?"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-black text-[#2b170e] focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          <div className="md:col-span-8 space-y-1.5">
            <label className="text-xs font-bold text-stone-600 block">Câu Trích Dẫn Giới Thiệu (Xuất hiện dưới tiêu đề)</label>
            <textarea 
              rows={2}
              value={sectionConfig.quote || ''}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, quote: e.target.value }))}
              placeholder="Chúng tôi có bán nhiều loại thức uống từ cà phê..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm text-[#4a3325] focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white resize-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Danh Sách & Bộ Biên Tập Từng Nhóm Món */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Cột Trái: Danh Sách Các Tab Nhóm Món */}
        <div className="xl:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#2b170e] uppercase tracking-wide">
              Danh Sách Nhóm Món ({offerings.length})
            </h3>
            <button
              onClick={handleAddOffering}
              className="px-3 py-1.5 rounded-lg bg-[#2b170e] hover:bg-[#422517] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Nhóm Mới</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {offerings.map((item, idx) => {
              const ItemIcon = getOfferingIconComponent(item.icon);
              const isSelected = idx === activeOfferingIdx;
              return (
                <div
                  key={item.id || idx}
                  onClick={() => {
                    setActiveOfferingIdx(idx);
                    setPreviewOfferingIdx(idx);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#2b170e] text-white border-[#2b170e] shadow-md'
                      : 'bg-white/80 hover:bg-white text-[#2b170e] border-stone-200/80 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isSelected ? 'bg-white/20 text-amber-300' : 'bg-stone-100 text-stone-600'
                    }`}>
                      0{idx + 1}
                    </span>
                    <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-white/10 text-amber-300' : 'bg-amber-50 text-[#8c5932]'}`}>
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs sm:text-sm font-bold block truncate">
                        {item.tabLabel || 'Chưa đặt tên'}
                      </span>
                      <span className={`text-[10.5px] block truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {item.title || item.category}
                      </span>
                    </div>
                  </div>

                  {/* Hành động nhanh: Lên, Xuống, Nhân bản, Xóa */}
                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleMoveOffering(idx, 'up', e)}
                      disabled={idx === 0}
                      className={`p-1 rounded-md transition-colors ${
                        idx === 0 ? 'opacity-30 cursor-not-allowed' : isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-stone-100 text-stone-600'
                      }`}
                      title="Lên trên"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleMoveOffering(idx, 'down', e)}
                      disabled={idx === offerings.length - 1}
                      className={`p-1 rounded-md transition-colors ${
                        idx === offerings.length - 1 ? 'opacity-30 cursor-not-allowed' : isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-stone-100 text-stone-600'
                      }`}
                      title="Xuống dưới"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDuplicateOffering(idx, e)}
                      className={`p-1 rounded-md transition-colors ${
                        isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-stone-100 text-stone-600'
                      }`}
                      title="Nhân bản"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteOffering(idx, e)}
                      className="p-1 rounded-md hover:bg-rose-500 hover:text-white text-rose-500 transition-colors"
                      title="Xóa nhóm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cột Phải: Form Chi Tiết Của Nhóm Món Đang Chọn */}
        <div className="xl:col-span-8 p-6 rounded-[32px] bg-white/85 backdrop-blur-xl border border-stone-200/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-900 font-mono font-bold text-xs flex items-center justify-center">
                #{activeOfferingIdx + 1}
              </span>
              <div>
                <h4 className="text-base font-bold text-[#2b170e]">
                  Chỉnh Sửa Nhóm: {currentItem.tabLabel}
                </h4>
                <p className="text-xs text-stone-500">Các thông tin sẽ hiển thị trên sân khấu sản phẩm Trang Chủ</p>
              </div>
            </div>

            <button
              onClick={handleSaveAll}
              className="px-4 py-1.5 rounded-xl bg-[#2b170e] hover:bg-[#422517] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Mục Này</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên Tab */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">Tên Nút Tab (Hiển thị thanh chuyển)</label>
              <input 
                type="text"
                value={currentItem.tabLabel || ''}
                onChange={(e) => handleUpdateCurrentField('tabLabel', e.target.value)}
                placeholder="vd: Cà Phê Rang Mộc"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold text-[#2b170e] focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            {/* Chọn Icon */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">Biểu Tượng (Icon)</label>
              <select
                value={currentItem.icon || 'Coffee'}
                onChange={(e) => handleUpdateCurrentField('icon', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-[#2b170e] focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {AVAILABLE_OFFERING_ICONS.map(i => (
                  <option key={i.name} value={i.name}>{i.label} ({i.name})</option>
                ))}
              </select>
            </div>

            {/* Danh mục phụ */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">Dòng Danh Mục Phụ (Chữ hoa nhỏ)</label>
              <input 
                type="text"
                value={currentItem.category || ''}
                onChange={(e) => handleUpdateCurrentField('category', e.target.value)}
                placeholder="vd: TỪ CÀ PHÊ RANG MỘC NGUYÊN BẢN"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold text-[#8c5932] uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            {/* Huy hiệu nhỏ (Badge) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">Huy Hiệu Nhỏ Trên Ảnh (Badge)</label>
              <input 
                type="text"
                value={currentItem.badge || ''}
                onChange={(e) => handleUpdateCurrentField('badge', e.target.value)}
                placeholder="vd: 100% Rang Mộc · Robusta & Arabica"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-[#2b170e] focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            {/* Tiêu đề chính */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-stone-700 block">Tiêu Đề Chính</label>
              <input 
                type="text"
                value={currentItem.title || ''}
                onChange={(e) => handleUpdateCurrentField('title', e.target.value)}
                placeholder="vd: Cà Phê Rang Mộc & Cold Brew 24H"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-base font-black text-[#2b170e] focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            {/* Lời bình / Phụ đề */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-stone-700 block">Lời Bình / Phụ Đề Ngắn</label>
              <input 
                type="text"
                value={currentItem.subtitle || ''}
                onChange={(e) => handleUpdateCurrentField('subtitle', e.target.value)}
                placeholder="vd: Khởi đầu sự tỉnh táo & tập trung cao độ"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold text-[#8c5932] focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            {/* Câu chuyện chi tiết */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-stone-700 block">Câu Chuyện & Trải Nghiệm Món</label>
              <textarea 
                rows={4}
                value={currentItem.story || ''}
                onChange={(e) => handleUpdateCurrentField('story', e.target.value)}
                placeholder="Chúng tôi tuyển chọn 100% hạt Robusta Đắk Lắk đậm đà..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm text-[#4a3225] focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white leading-relaxed resize-none"
              />
            </div>

            {/* Ảnh đại diện & Tải lên Supabase */}
            <div className="space-y-2 md:col-span-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-stone-800 uppercase tracking-wide">
                  Ảnh Đại Diện Sân Khấu (Tỉ lệ ~4:3 hoặc 16:9)
                </label>
                <span className="text-[11px] text-emerald-700 font-bold">✓ Tự động đẩy lên Supabase Cloud Storage</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-36 h-24 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0 relative group">
                  <img 
                    src={currentItem.image || '/images/hero_banner.jpg'} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    Xem ảnh
                  </div>
                </div>

                <div className="space-y-2 flex-1 w-full">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={currentItem.image || ''}
                      onChange={(e) => handleUpdateCurrentField('image', e.target.value)}
                      placeholder="https://... hoặc /images/..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none"
                    />
                    <label className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs active:scale-95">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh từ máy</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleUploadImage(e.target.files?.[0])}
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Gợi ý: Chọn ảnh chụp sản phẩm hoặc ảnh không gian đẹp để làm nổi bật câu chuyện thương hiệu.
                  </p>
                </div>
              </div>
            </div>

            {/* Danh sách món đặc trưng nổi bật (Highlights) */}
            <div className="space-y-2 md:col-span-2 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-black text-[#2b170e] uppercase tracking-wide block">
                    Món Đặc Trưng Nổi Bật (Highlights Pill Tags)
                  </label>
                  <span className="text-[11px] text-[#7a5843]">Hiển thị dưới dạng các thẻ bo tròn nhỏ</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Món</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {(currentItem.highlights || []).map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                    <input 
                      type="text"
                      value={highlight}
                      onChange={(e) => handleUpdateHighlight(hIdx, e.target.value)}
                      placeholder="Tên món nổi bật..."
                      className="flex-1 text-xs font-semibold text-[#2b170e] bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(hIdx)}
                      className="text-stone-400 hover:text-rose-500 transition-colors p-0.5"
                      title="Xóa tag này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút bấm CTA & Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">Chữ Trên Nút Bấm Kêu Gọi (CTA)</label>
              <input 
                type="text"
                value={currentItem.ctaText || 'Xem Chi Tiết Món & Đặt Ngay'}
                onChange={(e) => handleUpdateCurrentField('ctaText', e.target.value)}
                placeholder="Xem Chi Tiết Món & Đặt Ngay"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold text-[#2b170e] focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">Đường Dẫn Khi Bấm (URL)</label>
              <input 
                type="text"
                value={currentItem.ctaLink || '/dathang'}
                onChange={(e) => handleUpdateCurrentField('ctaLink', e.target.value)}
                placeholder="/dathang"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

          </div>
        </div>

      </div>

      {/* 4. Màn Hình Xem Trước Trực Quan (Live Interactive Stage Preview) */}
      <div className="p-6 rounded-[32px] bg-stone-100/80 border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-black text-[#2b170e] uppercase tracking-wide">
              Xem Trước Sân Khấu Trình Diễn Trên Trang Chủ
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                previewMode === 'desktop' ? 'bg-[#2b170e] text-white' : 'bg-white text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Máy tính</span>
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                previewMode === 'mobile' ? 'bg-[#2b170e] text-white' : 'bg-white text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Điện thoại</span>
            </button>
          </div>
        </div>

        {/* Khung Render Sân Khấu Đúng Y Hệt Trang Chủ */}
        <div className={`mx-auto transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-md' : 'max-w-6xl'}`}>
          <div className="p-6 sm:p-10 rounded-[36px] bg-white border border-stone-200 shadow-lg space-y-6">
            
            {/* Header Mục */}
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-[#2b170e] tracking-tight uppercase">
                {sectionConfig.title || 'COFFEE 24/24 BÁN GÌ?'}
              </h2>
              <p className="text-xs sm:text-sm text-[#4a3325] font-medium italic">
                "{sectionConfig.quote || ''}"
              </p>
            </div>

            {/* Thanh Tab Chuyển */}
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
              {offerings.map((item, idx) => {
                const TabIcon = getOfferingIconComponent(item.icon);
                const isActive = idx === previewOfferingIdx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewOfferingIdx(idx)}
                    className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                      isActive 
                        ? 'bg-[#2b170e] text-white shadow-md scale-105' 
                        : 'bg-stone-100 hover:bg-stone-200 text-[#5c3d2e]'
                    }`}
                  >
                    <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-[#8c5932]'}`} />
                    <span>{item.tabLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Sân Khấu Kính 2 Cột */}
            <div className="rounded-[32px] overflow-hidden border border-stone-200 shadow-md bg-stone-50">
              <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'} items-stretch`}>
                
                {/* Ảnh Trái */}
                <div className={`${previewMode === 'mobile' ? 'h-64' : 'lg:col-span-7 min-h-[380px]'} relative bg-stone-900 overflow-hidden`}>
                  <img 
                    src={previewItem.image || '/images/hero_banner.jpg'} 
                    alt={previewItem.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#2b170e]/90 text-amber-200 text-xs font-bold border border-white/20">
                      {previewItem.badge}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white/90 text-xs font-mono font-bold border border-white/20">
                      0{previewOfferingIdx + 1} / 0{offerings.length}
                    </span>
                  </div>
                </div>

                {/* Nội Dung Phải */}
                <div className={`${previewMode === 'mobile' ? 'p-5' : 'lg:col-span-5 p-7'} flex flex-col justify-between space-y-4`}>
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#8c5932] text-[11px] font-black uppercase tracking-wider border border-stone-200">
                      <PreviewIcon className="w-3.5 h-3.5" />
                      <span>{previewItem.category}</span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#2b170e] leading-snug">
                        {previewItem.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-[#8c5932] mt-1">
                        {previewItem.subtitle}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-[#4a3225] leading-relaxed">
                      {previewItem.story}
                    </p>

                    {/* Highlights tags */}
                    <div className="pt-2">
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-[#7a5843] block mb-1.5">
                        Món đặc trưng nổi bật:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(previewItem.highlights || []).map((dish, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#2b170e] font-semibold flex items-center gap-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            {dish}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="pt-4 border-t border-stone-200">
                    <button className="w-full py-3 rounded-full bg-[#2b170e] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{previewItem.ctaText || 'Xem Chi Tiết Món & Đặt Ngay'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
