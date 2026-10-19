import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw, 
  Edit3, 
  Check, 
  Sparkles, 
  Layout, 
  Image as ImageIcon, 
  Film, 
  HelpCircle, 
  Award, 
  BarChart3, 
  MapPin, 
  UtensilsCrossed, 
  Percent, 
  Coffee, 
  Armchair, 
  MessageSquare, 
  Share2, 
  Upload, 
  ExternalLink,
  ChevronRight,
  Sliders,
  X
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../../data/siteConfig';
import { uploadImageToSupabase } from '../../lib/supabase';

// Danh sách các mẫu thành phần có thể thêm vào Trang Chủ
export const COMPONENT_PRESET_LIBRARY = [
  {
    type: 'customBanner',
    title: 'Khối Banner Tùy Biến (Custom Banner / CTA)',
    desc: 'Tự do tùy biến tiêu đề, phụ đề, ảnh minh họa tải lên Supabase, nút bấm và màu nền.',
    icon: ImageIcon,
    color: 'from-amber-600 to-amber-700',
    defaultData: {
      tag: 'THÔNG BÁO MỚI',
      title: 'Không Gian Thưởng Thức Cà Phê Mộc 24/7',
      subtitle: 'Trải nghiệm phong cách sống năng động cùng Coffee 24/24',
      description: 'Dù là sáng sớm ngắm phố phường hay đêm muộn chạy deadline, chúng tôi luôn sẵn sàng phục vụ bạn với không gian tiện nghi nhất.',
      image: '/images/hero_banner.jpg',
      layout: 'image-right', // 'image-left' | 'image-right' | 'full-width'
      buttonText: 'Khám Phá Ngay',
      buttonLink: '/dathang',
      theme: 'glass-dark' // 'glass-dark' | 'glass-light' | 'amber-warm'
    }
  },
  {
    type: 'stats',
    title: 'Khối Con Số Ấn Tượng (Stats Counters)',
    desc: 'Hiển thị 4 ô số liệu thành tựu (24/7 mở cửa, 2 chi nhánh, 50+ món, 10.000+ khách hàng...).',
    icon: BarChart3,
    color: 'from-blue-600 to-indigo-700',
    defaultData: {
      badge: 'CON SỐ BIẾT NÓI',
      title: 'Dấu Ấn COFFEE 24/24',
      items: [
        { number: '24/7', label: 'Giờ Phục Vụ Mỗi Ngày' },
        { number: '02', label: 'Chi Nhánh Đắc Địa' },
        { number: '50+', label: 'Món Thức Uống Đậm Vị' },
        { number: '10K+', label: 'Khách Hàng Hài Lòng' }
      ]
    }
  },
  {
    type: 'features',
    title: 'Khối 3 Cam Kết Thương Hiệu (Brand Highlights)',
    desc: '3 cột giới thiệu giá trị cốt lõi: 100% Cà phê mộc, Ổ điện mọi vị trí, Bếp nóng 24/7.',
    icon: Award,
    color: 'from-emerald-600 to-teal-700',
    defaultData: {
      badge: 'GIÁ TRỊ CỐT LÕI',
      title: 'Vì Sao Khách Hàng Chọn Coffee 24/24?',
      subtitle: 'Những tiêu chuẩn cao nhất tạo nên trải nghiệm trọn vẹn của bạn',
      features: [
        { title: '100% Cà Phê Rang Mộc', desc: 'Không hương liệu hóa chất, chiết xuất chuẩn vị Robusta Đắk Lắk & Arabica Cầu Đất.' },
        { title: 'Ổ Điện Tại 100% Vị Trí', desc: 'Hệ thống điện & Wifi Gigabit ổn định cao, đảm bảo không gián đoạn công việc.' },
        { title: 'Bếp Nóng Phục Vụ Xuyên Đêm', desc: 'Mì xào, bánh mì, đồ ăn ấm nóng sẵn sàng tiếp năng lượng 24/7.' }
      ]
    }
  },
  {
    type: 'video',
    title: 'Khối Video Giới Thiệu (Video Studio)',
    desc: 'Nhúng video YouTube hoặc video tải lên Supabase Storage với tiêu đề và mô tả bắt mắt.',
    icon: Film,
    color: 'from-rose-600 to-red-700',
    defaultData: {
      badge: 'THƯỚC PHIM THỰC TẾ',
      title: 'Một Ngày Tại COFFEE 24/24',
      subtitle: 'Xem không gian học tập và làm việc sôi động từ sáng đến đêm',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: '/images/hero_banner.jpg'
    }
  },
  {
    type: 'faq',
    title: 'Khối Hỏi Đáp Nhanh (FAQ Accordion)',
    desc: 'Giải đáp nhanh các thắc mắc về chỗ để xe, wifi, ổ điện, đặt bàn nhóm...',
    icon: HelpCircle,
    color: 'from-purple-600 to-pink-700',
    defaultData: {
      badge: 'GIẢI ĐÁP NHANH',
      title: 'Câu Hỏi Thường Gặp',
      subtitle: 'Tất cả những gì bạn cần biết trước khi ghé thăm COFFEE 24/24',
      faqs: [
        { q: 'Quán có mở cửa suốt đêm thật không?', a: 'Có! Cả 2 chi nhánh của COFFEE 24/24 đều mở cửa 24/24 suốt 365 ngày trong năm.' },
        { q: 'Wifi và ổ điện ở quán như thế nào?', a: 'Quán trang bị ổ cắm điện ở 100% bàn ghế và hệ thống Wifi Gigabit chịu tải cao.' },
        { q: 'Có chỗ gửi xe máy và ô tô an toàn không?', a: 'Quán có bãi giữ xe máy miễn phí rộng rãi có bảo vệ túc trực 24/24.' }
      ]
    }
  },
  {
    type: 'branches',
    title: 'Khối 2 Chi Nhánh & Bản Đồ Nhanh',
    desc: 'Thẻ địa chỉ 413PHI & 96D5 kèm hotline gọi ngay và nút chỉ đường Google Maps.',
    icon: MapPin,
    color: 'from-amber-700 to-stone-800',
    defaultData: {
      badge: 'GHÉ THĂM QUÁN',
      title: 'Hệ Thống 2 Chi Nhánh Coffee 24/24',
      subtitle: 'Chọn chi nhánh gần bạn nhất để trải nghiệm không gian học tập lý tưởng'
    }
  }
];

// Helper lấy thông tin icon và tên loại của 1 section
export function getSectionMeta(section) {
  switch (section.type) {
    case 'hero':
      return { label: 'Banner 16:9 Tràn Viền', icon: Layout, color: 'text-amber-500 bg-amber-50' };
    case 'newDishes':
      return { label: 'Món Mới Trình Làng (Poster 3:4)', icon: UtensilsCrossed, color: 'text-orange-500 bg-orange-50' };
    case 'promotions':
      return { label: 'Chương Trình Ưu Đãi (Poster 3:4)', icon: Percent, color: 'text-rose-500 bg-rose-50' };
    case 'spaceAmenities':
      return { label: 'Không Gian & Tiện Nghi 24/7', icon: Armchair, color: 'text-emerald-500 bg-emerald-50' };
    case 'offerings':
      return { label: 'Coffee 24/24 Bán Gì? (7 Nhóm Món)', icon: Coffee, color: 'text-amber-600 bg-amber-50' };
    case 'reviews':
      return { label: 'Cảm Nhận & Đánh Giá Khách Hàng', icon: MessageSquare, color: 'text-indigo-500 bg-indigo-50' };
    case 'social':
      return { label: 'Kết Nối Mạng Xã Hội & Fanpage', icon: Share2, color: 'text-blue-500 bg-blue-50' };
    case 'customBanner':
      return { label: 'Khối Banner Tùy Biến', icon: ImageIcon, color: 'text-amber-500 bg-amber-50' };
    case 'stats':
      return { label: 'Khối Con Số Ấn Tượng', icon: BarChart3, color: 'text-blue-500 bg-blue-50' };
    case 'features':
      return { label: 'Khối 3 Cam Kết Thương Hiệu', icon: Award, color: 'text-emerald-500 bg-emerald-50' };
    case 'video':
      return { label: 'Khối Video Giới Thiệu', icon: Film, color: 'text-rose-500 bg-rose-50' };
    case 'faq':
      return { label: 'Khối Hỏi Đáp FAQ', icon: HelpCircle, color: 'text-purple-500 bg-purple-50' };
    case 'branches':
      return { label: 'Khối 2 Chi Nhánh Nhanh', icon: MapPin, color: 'text-stone-600 bg-stone-100' };
    default:
      return { label: section.title || 'Thành Phần Khối', icon: Layers, color: 'text-stone-500 bg-stone-50' };
  }
}

export default function AdminHomeSectionsManager({ config, onSaveConfig, triggerAlert, onNavigateTab }) {
  const defaultSections = DEFAULT_SITE_CONFIG.homeSections || [
    { id: 'sec-hero', type: 'hero', title: 'Banner 16:9 Tràn Viền', enabled: true },
    { id: 'sec-newDishes', type: 'newDishes', title: 'Món Mới Trình Làng (Poster 3:4)', enabled: true },
    { id: 'sec-promotions', type: 'promotions', title: 'Chương Trình Ưu Đãi (Poster 3:4)', enabled: true },
    { id: 'sec-spaceAmenities', type: 'spaceAmenities', title: 'Không Gian & Tiện Nghi 24/7', enabled: true },
    { id: 'sec-offerings', type: 'offerings', title: 'Coffee 24/24 Bán Gì?', enabled: true },
    { id: 'sec-reviews', type: 'reviews', title: 'Cảm Nhận & Đánh Giá Khách Hàng', enabled: true },
    { id: 'sec-social', type: 'social', title: 'Kết Nối Mạng Xã Hội & Fanpage', enabled: true },
  ];

  const [sections, setSections] = useState(config.homeSections || defaultSections);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null); // section being edited in modal
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Lưu cấu hình
  const handleSaveSections = () => {
    const updatedConfig = {
      ...config,
      homeSections: sections
    };
    onSaveConfig?.(updatedConfig);
    triggerAlert?.('✓ Đã lưu bố cục & thứ tự các thành phần Trang Chủ thành công! Trang chủ đã tự động cập nhật.');
  };

  // Khôi phục mặc định
  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục bố cục Trang Chủ về thứ tự và danh sách các thành phần chuẩn ban đầu?')) {
      setSections(defaultSections);
      const updatedConfig = {
        ...config,
        homeSections: defaultSections
      };
      onSaveConfig?.(updatedConfig);
      triggerAlert?.('✓ Đã khôi phục bố cục mặc định thành công!');
    }
  };

  // Bật/tắt 1 section
  const handleToggleEnabled = (idx) => {
    setSections(prev => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        enabled: updated[idx].enabled === false ? true : false
      };
      return updated;
    });
  };

  // Di chuyển thứ tự
  const handleMoveSection = (idx, direction) => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    setSections(prev => {
      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  // Xóa section
  const handleDeleteSection = (idx) => {
    const item = sections[idx];
    if (window.confirm(`Bạn có chắc chắn muốn xóa thành phần "${item.title || item.type}" khỏi Trang Chủ?`)) {
      setSections(prev => prev.filter((_, i) => i !== idx));
      triggerAlert?.('✓ Đã xóa thành phần khỏi bố cục!');
    }
  };

  // Thêm thành phần từ thư viện preset
  const handleSelectPresetToAdd = (preset) => {
    const newSectionId = `sec-${preset.type}-${Date.now()}`;
    const newSection = {
      id: newSectionId,
      type: preset.type,
      title: preset.title,
      enabled: true,
      data: { ...preset.defaultData }
    };

    setSections(prev => [...prev, newSection]);
    setShowAddModal(false);
    triggerAlert?.(`✓ Đã thêm thành phần "${preset.title}" vào Trang Chủ! Bạn có thể kéo thả hoặc chỉnh sửa ngay.`);
    
    // Nếu là khối custom hoặc stats/faq/features, mở luôn modal chỉnh sửa
    if (['customBanner', 'stats', 'features', 'video', 'faq', 'branches'].includes(preset.type)) {
      setEditingSection({ ...newSection });
    }
  };

  // Mở trình chỉnh sửa cho section
  const handleOpenEdit = (section) => {
    // Nếu là các khối cốt lõi đã có tab quản lý riêng, gợi ý chuyển qua tab đó
    if (section.type === 'hero') {
      onNavigateTab?.('heroSlide');
      return;
    }
    if (section.type === 'newDishes') {
      onNavigateTab?.('newDishes');
      return;
    }
    if (section.type === 'promotions') {
      onNavigateTab?.('promotions');
      return;
    }
    if (section.type === 'spaceAmenities') {
      onNavigateTab?.('spaceAmenities');
      return;
    }
    if (section.type === 'offerings') {
      onNavigateTab?.('offerings');
      return;
    }
    if (section.type === 'reviews') {
      onNavigateTab?.('reviews');
      return;
    }
    if (section.type === 'social') {
      onNavigateTab?.('socialZalo');
      return;
    }

    // Với các khối tùy biến, mở modal chỉnh sửa chi tiết
    setEditingSection(JSON.parse(JSON.stringify(section)));
  };

  // Lưu chỉnh sửa section tùy biến
  const handleSaveEditedSection = () => {
    if (!editingSection) return;
    setSections(prev => prev.map(s => s.id === editingSection.id ? editingSection : s));
    setEditingSection(null);
    triggerAlert?.('✓ Đã cập nhật nội dung thành phần thành công! Nhớ bấm "LƯU BỐ CỤC TRANG CHỦ" để áp dụng.');
  };

  // Tải ảnh cho section tùy biến lên Supabase
  const handleUploadCustomImage = async (file) => {
    if (!file) return;
    setIsUploadingImage(true);
    triggerAlert?.('⏳ Đang tải ảnh thành phần lên Supabase Cloud...');
    try {
      const url = await uploadImageToSupabase(file, 'custom-sections');
      if (url && editingSection) {
        setEditingSection(prev => ({
          ...prev,
          data: {
            ...(prev.data || {}),
            image: url
          }
        }));
        triggerAlert?.('✓ Đã tải ảnh lên Supabase Storage thành công!');
      }
    } catch (e) {
      console.warn('Lỗi tải ảnh:', e);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* 1. Header Card & Banner */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-[#2b170e] via-[#3d2315] to-[#1c0f09] text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
              <Layout className="w-3.5 h-3.5" />
              <span>PAGE BUILDER STUDIO · TRÌNH TẠO BỐ CỤC LINH ĐỘNG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Bố Cục & Thêm Thành Phần Trang Chủ
            </h2>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
              Bạn có thể tự do thêm thành phần mới, đổi thứ tự hiển thị (Lên/Xuống), ẩn/hiện hoặc tùy chỉnh nội dung trực tiếp ngay tại đây mà <strong>không cần phải sửa mã nguồn (code)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-[#2b170e] font-black text-sm transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 ring-2 ring-white/30"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>+ THÊM THÀNH PHẦN</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-white/15 active:scale-95"
              title="Khôi phục thứ tự chuẩn"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Khôi Phục Mặc Định</span>
            </button>

            <button
              onClick={handleSaveSections}
              className="px-6 py-3 rounded-2xl bg-[#2b170e] hover:bg-[#1a0e08] text-white font-black text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 border border-white/20"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>LƯU BỐ CỤC</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Danh Sách Các Thành Phần Đang Có Trên Trang Chủ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#2b170e] uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8c5932]" />
              <span>Các Khối Thành Phần Đang Hiển Thị Trên Trang Chủ ({sections.length})</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Thứ tự từ trên xuống dưới tương ứng với vị trí hiển thị từ đỉnh đến đáy Trang Chủ.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#8c5932] border border-amber-200/80 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-700" />
            <span>Thêm Khối Mới</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {sections.map((section, idx) => {
            const meta = getSectionMeta(section);
            const Icon = meta.icon;
            const isEnabled = section.enabled !== false;
            const isFirst = idx === 0;
            const isLast = idx === sections.length - 1;

            return (
              <div 
                key={section.id || idx}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isEnabled 
                    ? 'bg-white/90 backdrop-blur-md border-stone-200/80 shadow-xs hover:shadow-md' 
                    : 'bg-stone-100/70 border-stone-200 opacity-60'
                }`}
              >
                {/* Thông tin thành phần */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 font-mono font-black text-xs flex items-center justify-center shrink-0 border border-stone-200">
                    #{idx + 1}
                  </div>

                  <div className={`p-2.5 rounded-2xl shrink-0 ${meta.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-[#2b170e] block truncate">
                        {section.title || meta.label}
                      </span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono font-medium shrink-0">
                        {section.type}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500 block truncate mt-0.5">
                      {meta.label}
                    </span>
                  </div>
                </div>

                {/* Hành động: Bật/Tắt, Lên, Xuống, Chỉnh sửa, Xóa */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  
                  {/* Nút Ẩn / Hiện */}
                  <button
                    type="button"
                    onClick={() => handleToggleEnabled(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isEnabled 
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200' 
                        : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    }`}
                    title={isEnabled ? 'Nhấp để ẨN khỏi trang chủ' : 'Nhấp để HIỂN THỊ lại'}
                  >
                    {isEnabled ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-stone-500" />}
                    <span>{isEnabled ? 'Đang Bật' : 'Đang Tắt'}</span>
                  </button>

                  {/* Nút Lên / Xuống */}
                  <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200">
                    <button
                      type="button"
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={isFirst}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white text-stone-700 shadow-2xs'
                      }`}
                      title="Di chuyển lên trên"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={isLast}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isLast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white text-stone-700 shadow-2xs'
                      }`}
                      title="Di chuyển xuống dưới"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Nút Chỉnh Sửa */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(section)}
                    className="px-3 py-1.5 rounded-xl bg-[#2b170e] hover:bg-[#452718] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs active:scale-95"
                    title="Chỉnh sửa nội dung thành phần này"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cấu Hình</span>
                  </button>

                  {/* Nút Xóa (Cho các khối bổ sung hoặc tùy chọn) */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(idx)}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Xóa thành phần này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MODAL: Thư Viện Chọn Loại Thành Phần Để Thêm (+ THÊM THÀNH PHẦN) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-white/40">
            
            {/* Modal Header */}
            <div className="p-6 sm:p-7 bg-gradient-to-r from-[#2b170e] to-[#422517] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/15 text-amber-300">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Thêm Thành Phần Mới Vào Trang Chủ
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Chọn loại khối muốn thêm. Bạn có thể tự do chỉnh sửa nội dung và kéo thả vị trí sau khi tạo.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Danh Sách Preset */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMPONENT_PRESET_LIBRARY.map((preset) => {
                  const PresetIcon = preset.icon;
                  return (
                    <div
                      key={preset.type}
                      onClick={() => handleSelectPresetToAdd(preset)}
                      className="p-5 rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-stone-50/50 hover:bg-white hover:border-amber-500/50 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${preset.color} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                            <PresetIcon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                            + Thêm khối này
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-black text-[#2b170e] group-hover:text-amber-800 transition-colors">
                            {preset.title}
                          </h4>
                          <p className="text-xs text-stone-600 leading-relaxed mt-1">
                            {preset.desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-[#8c5932]">
                        <span>Tùy biến nhanh không cần code</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Các khối cốt lõi có sẵn */}
              <div className="pt-4 border-t border-stone-200">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block mb-3">
                  Hoặc thêm lại các thành phần cốt lõi của quán:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSelectPresetToAdd({
                      type: 'newDishes',
                      title: 'Món Mới Trình Làng (Poster 3:4)',
                      defaultData: {}
                    })}
                    className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold flex items-center gap-1.5 border border-orange-200 cursor-pointer"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
                    <span>+ Món Mới Trình Làng</span>
                  </button>

                  <button
                    onClick={() => handleSelectPresetToAdd({
                      type: 'promotions',
                      title: 'Chương Trình Ưu Đãi (Poster 3:4)',
                      defaultData: {}
                    })}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1.5 border border-rose-200 cursor-pointer"
                  >
                    <Percent className="w-3.5 h-3.5 text-rose-600" />
                    <span>+ Chương Trình Ưu Đãi</span>
                  </button>

                  <button
                    onClick={() => handleSelectPresetToAdd({
                      type: 'offerings',
                      title: 'Coffee 24/24 Bán Gì? (7 Nhóm Món)',
                      defaultData: {}
                    })}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 border border-amber-200 cursor-pointer"
                  >
                    <Coffee className="w-3.5 h-3.5 text-amber-600" />
                    <span>+ Coffee 24/24 Bán Gì?</span>
                  </button>

                  <button
                    onClick={() => handleSelectPresetToAdd({
                      type: 'spaceAmenities',
                      title: 'Không Gian & Tiện Nghi 24/7',
                      defaultData: {}
                    })}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 cursor-pointer"
                  >
                    <Armchair className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+ Không Gian & Tiện Nghi</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 4. MODAL: Chỉnh Sửa Chi Tiết Cho Khối Tùy Biến (Custom Banner, Stats, FAQ, Features, etc.) */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-white/40">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#2b170e] to-[#422517] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/15 text-amber-300">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Cấu Hình Chi Tiết: {editingSection.title}
                  </h3>
                  <span className="text-xs text-stone-300 font-mono">Loại: {editingSection.type}</span>
                </div>
              </div>

              <button
                onClick={() => setEditingSection(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
              
              {/* Tiêu đề mục */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">Tiêu Đề Thành Phần (Hiển thị trong Admin & Trang Chủ)</label>
                <input 
                  type="text"
                  value={editingSection.title || ''}
                  onChange={(e) => setEditingSection(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold text-[#2b170e] focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Form riêng cho Custom Banner */}
              {editingSection.type === 'customBanner' && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">Huy Hiệu Nhỏ (Tag / Badge)</label>
                    <input 
                      type="text"
                      value={editingSection.data?.tag || ''}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev,
                        data: { ...(prev.data || {}), tag: e.target.value }
                      }))}
                      placeholder="THÔNG BÁO MỚI"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold text-amber-700 uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">Phụ Đề Ngắn</label>
                    <input 
                      type="text"
                      value={editingSection.data?.subtitle || ''}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev,
                        data: { ...(prev.data || {}), subtitle: e.target.value }
                      }))}
                      placeholder="Trải nghiệm phong cách sống..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">Nội Dung Đoạn Văn</label>
                    <textarea 
                      rows={3}
                      value={editingSection.data?.description || ''}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev,
                        data: { ...(prev.data || {}), description: e.target.value }
                      }))}
                      placeholder="Mô tả chi tiết nội dung..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-700 resize-none"
                    />
                  </div>

                  {/* Ảnh minh họa & Upload Supabase */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <label className="text-xs font-bold text-stone-700 block">Ảnh Minh Họa Khối</label>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                        <img 
                          src={editingSection.data?.image || '/images/hero_banner.jpg'} 
                          alt="Banner" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input 
                          type="text"
                          value={editingSection.data?.image || ''}
                          onChange={(e) => setEditingSection(prev => ({
                            ...prev,
                            data: { ...(prev.data || {}), image: e.target.value }
                          }))}
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                        />
                        <label className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingImage ? 'Đang tải...' : 'Tải ảnh lên Supabase'}</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            disabled={isUploadingImage}
                            onChange={(e) => handleUploadCustomImage(e.target.files?.[0])}
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Nút bấm & Liên kết */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block">Chữ Trên Nút Bấm</label>
                      <input 
                        type="text"
                        value={editingSection.data?.buttonText || ''}
                        onChange={(e) => setEditingSection(prev => ({
                          ...prev,
                          data: { ...(prev.data || {}), buttonText: e.target.value }
                        }))}
                        placeholder="Khám Phá Ngay"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block">Đường Dẫn (URL)</label>
                      <input 
                        type="text"
                        value={editingSection.data?.buttonLink || ''}
                        onChange={(e) => setEditingSection(prev => ({
                          ...prev,
                          data: { ...(prev.data || {}), buttonLink: e.target.value }
                        }))}
                        placeholder="/dathang hoặc https://..."
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form cho Video */}
              {editingSection.type === 'video' && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">Đường Dẫn Video (YouTube Embed hoặc file MP4)</label>
                    <input 
                      type="text"
                      value={editingSection.data?.videoUrl || ''}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev,
                        data: { ...(prev.data || {}), videoUrl: e.target.value }
                      }))}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">Phụ Đề Ngắn</label>
                    <input 
                      type="text"
                      value={editingSection.data?.subtitle || ''}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev,
                        data: { ...(prev.data || {}), subtitle: e.target.value }
                      }))}
                      placeholder="Xem không gian học tập..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Form cho Stats */}
              {editingSection.type === 'stats' && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-stone-700 block">4 Con Số Ấn Tượng:</span>
                  <div className="grid grid-cols-2 gap-3">
                    {(editingSection.data?.items || []).map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                        <input 
                          type="text"
                          value={item.number || ''}
                          onChange={(e) => {
                            const newItems = [...(editingSection.data?.items || [])];
                            newItems[i] = { ...newItems[i], number: e.target.value };
                            setEditingSection(prev => ({ ...prev, data: { ...prev.data, items: newItems } }));
                          }}
                          placeholder="24/7"
                          className="w-full px-2 py-1 rounded border border-stone-300 text-xs font-black text-amber-700"
                        />
                        <input 
                          type="text"
                          value={item.label || ''}
                          onChange={(e) => {
                            const newItems = [...(editingSection.data?.items || [])];
                            newItems[i] = { ...newItems[i], label: e.target.value };
                            setEditingSection(prev => ({ ...prev, data: { ...prev.data, items: newItems } }));
                          }}
                          placeholder="Giờ Phục Vụ..."
                          className="w-full px-2 py-1 rounded border border-stone-300 text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-300 cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveEditedSection}
                className="px-5 py-2 rounded-xl bg-[#2b170e] hover:bg-[#452718] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Cập Nhật Thành Phần</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
