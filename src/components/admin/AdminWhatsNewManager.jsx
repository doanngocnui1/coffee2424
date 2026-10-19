import React, { useState, useEffect } from 'react';
import { 
  Flame, 
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
  ArrowRight,
  ExternalLink,
  Tag,
  Check
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../../data/siteConfig';

export default function AdminWhatsNewManager({ config, onSaveConfig, triggerAlert }) {
  // 1. Initial State
  const defaultItems = [
    {
      id: 'poster-1',
      tag: 'MÓN MỚI',
      title: 'Matcha MK4 Latte & Cold Brew Cam Vàng',
      discount: 'GIẢM 20%',
      image: '/images/promo_banner.jpg',
      cta: 'Thử Món Mới',
      link: '/dathang'
    },
    {
      id: 'poster-2',
      tag: 'COMBO HOT',
      title: 'Combo Sáng & Đêm Khuya 69K',
      discount: 'CHỈ 69.000đ',
      image: '/images/signature_drinks.jpg',
      cta: 'Đặt Combo 69K',
      link: '/dathang'
    },
    {
      id: 'poster-3',
      tag: 'GIỜ VÀNG',
      title: 'Happy Hour 16:00 - 19:00 Mỗi Ngày',
      discount: 'GIẢM 40%',
      image: '/images/journey_espresso.jpg',
      cta: 'Lấy Mã Giảm',
      link: '/khuyenmai'
    }
  ];

  const [posters, setPosters] = useState(() => {
    if (config?.homePosters && Array.isArray(config.homePosters) && config.homePosters.length > 0) {
      return config.homePosters;
    }
    return defaultItems;
  });

  const [sectionConfig, setSectionConfig] = useState(() => {
    return {
      enabled: config?.whatsNewSection?.enabled !== false,
      badge: config?.whatsNewSection?.badge || 'CỘNG ĐỒNG & ƯU ĐÃI',
      title: config?.whatsNewSection?.title || 'Món Mới Trình Làng &',
      highlightTitle: config?.whatsNewSection?.highlightTitle || 'Ưu Đãi Đặc Quyền',
      subtitle: config?.whatsNewSection?.subtitle || 'Cập nhật món mới và ưu đãi nổi bật dành cho học tập & làm việc.'
    };
  });

  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' (3 items) | 'mobile' (1 item)
  const [previewIndex, setPreviewIndex] = useState(0);

  // Sync when prop config updates
  useEffect(() => {
    if (config?.homePosters && Array.isArray(config.homePosters) && config.homePosters.length > 0) {
      setPosters(config.homePosters);
    }
    if (config?.whatsNewSection) {
      setSectionConfig({
        enabled: config.whatsNewSection.enabled !== false,
        badge: config.whatsNewSection.badge || 'CỘNG ĐỒNG & ƯU ĐÃI',
        title: config.whatsNewSection.title || 'Món Mới Trình Làng &',
        highlightTitle: config.whatsNewSection.highlightTitle || 'Ưu Đãi Đặc Quyền',
        subtitle: config.whatsNewSection.subtitle || 'Cập nhật món mới và ưu đãi nổi bật dành cho học tập & làm việc.'
      });
    }
  }, [config]);

  // Keep preview index in safe bounds
  const previewVisibleCount = previewMode === 'desktop' ? 3 : 1;
  const previewMaxIndex = Math.max(0, posters.length - previewVisibleCount);
  const safePreviewIndex = Math.min(previewIndex, previewMaxIndex);

  // 2. Poster Manipulations
  const handleAddPoster = () => {
    const newId = `poster-${Date.now()}`;
    const newPoster = {
      id: newId,
      tag: 'MÓN MỚI',
      title: 'Món Mới Đặc Biệt COFFEE 24/24',
      discount: 'GIẢM 20%',
      image: '/images/signature_drinks.jpg',
      cta: 'Thử Món Mới',
      link: '/dathang'
    };
    setPosters(prev => [...prev, newPoster]);
    triggerAlert?.('✓ Đã thêm 1 thẻ món mới! Hãy chỉnh sửa thông tin và nhấn Lưu.');
  };

  const handleDeletePoster = (index) => {
    if (posters.length <= 1) {
      alert('Cần giữ lại ít nhất 1 món mới để hiển thị trên website!');
      return;
    }
    const itemTitle = posters[index]?.title || `Món #${index + 1}`;
    if (window.confirm(`Bạn có chắc muốn xóa "${itemTitle}" khỏi danh sách?`)) {
      setPosters(prev => prev.filter((_, i) => i !== index));
      triggerAlert?.(`✓ Đã xóa món #${index + 1}. Nhấn Lưu để áp dụng.`);
    }
  };

  const handleDuplicatePoster = (index) => {
    const target = posters[index];
    if (!target) return;
    const duplicated = {
      ...target,
      id: `poster-${Date.now()}`,
      title: `${target.title} (Bản sao)`
    };
    const nextList = [...posters];
    nextList.splice(index + 1, 0, duplicated);
    setPosters(nextList);
    triggerAlert?.('✓ Đã nhân bản thẻ món mới!');
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setPosters(prev => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index) => {
    if (index === posters.length - 1) return;
    setPosters(prev => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleUpdateField = (index, field, value) => {
    setPosters(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value
      };
      return next;
    });
  };

  // Image Upload with Automatic 3:4 Aspect Ratio Canvas Compression
  const handleUploadPosterImage = (index, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một file ảnh hợp lệ (PNG, JPG, WEBP, JPEG)!');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Kích thước file ảnh quá lớn (>8MB). Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result;
      const img = new Image();
      img.onload = () => {
        // Create canvas with 3:4 target dimension (600 x 800)
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          handleUpdateField(index, 'image', rawDataUrl);
          return;
        }

        // Center crop to 3:4
        const targetRatio = 600 / 800;
        const imgRatio = img.width / img.height;
        let sWidth = img.width;
        let sHeight = img.height;
        let sx = 0;
        let sy = 0;

        if (imgRatio > targetRatio) {
          sWidth = img.height * targetRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / targetRatio;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 600, 800);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        handleUpdateField(index, 'image', compressedDataUrl);
        triggerAlert?.(`✓ Đã nén và cập nhật ảnh món #${index + 1} chuẩn tỉ lệ 3:4 thành công!`);
      };

      img.onerror = () => {
        alert('Không thể đọc file ảnh này. Vui lòng thử chọn ảnh khác.');
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Save to config
  const handleSaveAll = () => {
    const updatedConfig = {
      ...config,
      homePosters: posters,
      whatsNewSection: sectionConfig
    };

    onSaveConfig?.(updatedConfig);
    triggerAlert?.('✓ Đã lưu toàn bộ cấu hình Món Mới & Poster 3x4! Trang chủ đã tự động cập nhật ngay.');
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh sách 3 món mới mặc định ban đầu? Các tùy chỉnh hiện tại sẽ bị hoàn tác.')) {
      setPosters(defaultItems);
      setSectionConfig({
        enabled: true,
        badge: 'CỘNG ĐỒNG & ƯU ĐÃI',
        title: 'Món Mới Trình Làng &',
        highlightTitle: 'Ưu Đãi Đặc Quyền',
        subtitle: 'Cập nhật món mới và ưu đãi nổi bật dành cho học tập & làm việc.'
      });
      triggerAlert?.('✓ Đã khôi phục dữ liệu mặc định. Nhấn Lưu để áp dụng.');
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20">
              <Flame className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Quản Lý Món Mới Trình Làng & Ưu Đãi
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Dọc 3:4 Chuẩn
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Hiển thị 3 món trên máy tính và 1 món trên điện thoại. Tự động xuất hiện nút chuyển trái/phải khi có nhiều hơn.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleAddPoster}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm Món Mới</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center gap-1.5 border border-neutral-800 cursor-pointer transition-colors"
            title="Khôi phục lại 3 poster ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khôi Phục Mặc Định</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>LƯU CẤU HÌNH</span>
          </button>
        </div>
      </div>

      {/* 2. Cài Đặt Tiêu Đề Khối Trang Chủ */}
      <div className="p-5 sm:p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Tiêu Đề & Trạng Thái Khối Món Mới
            </h3>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs font-bold text-neutral-300">Bật hiển thị khối này:</span>
            <input
              type="checkbox"
              checked={sectionConfig.enabled}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, enabled: e.target.checked }))}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">Dòng chữ nhỏ trên đầu (Badge)</label>
            <input
              type="text"
              value={sectionConfig.badge}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, badge: e.target.value }))}
              placeholder="CỘNG ĐỒNG & ƯU ĐÃI"
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">Tiêu đề chính (Dòng 1)</label>
            <input
              type="text"
              value={sectionConfig.title}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Món Mới Trình Làng &"
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">Tiêu đề nổi bật (Dòng 2)</label>
            <input
              type="text"
              value={sectionConfig.highlightTitle}
              onChange={(e) => setSectionConfig(prev => ({ ...prev, highlightTitle: e.target.value }))}
              placeholder="Ưu Đãi Đặc Quyền"
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-bold focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1">Đoạn văn mô tả ngắn</label>
          <input
            type="text"
            value={sectionConfig.subtitle}
            onChange={(e) => setSectionConfig(prev => ({ ...prev, subtitle: e.target.value }))}
            placeholder="Cập nhật món mới và ưu đãi nổi bật dành cho học tập & làm việc."
            className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-medium focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Danh Sách Món Mới (Poster Cards List) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Danh Sách Món Mới ({posters.length} món)
            </h3>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
              Hiển thị: 3/lượt (máy tính) · 1/lượt (điện thoại)
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddPoster}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Món Mới</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posters.map((item, idx) => (
            <div 
              key={item.id || idx}
              className="bg-neutral-950 rounded-3xl border border-neutral-800 p-5 space-y-4 flex flex-col justify-between hover:border-neutral-700 transition-all shadow-md"
            >
              <div className="space-y-4">
                {/* Card Header with Reordering & Actions */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-black font-mono">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-black text-white truncate max-w-[140px]" title={item.title}>
                      {item.title || 'Món mới'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Di chuyển lên trước"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === posters.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Di chuyển xuống sau"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicatePoster(idx)}
                      className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-blue-400 cursor-pointer transition-colors"
                      title="Nhân bản thẻ này"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePoster(idx)}
                      className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-colors"
                      title="Xóa món này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3:4 Poster Preview Box */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-inner group">
                  <img
                    src={item.image || '/images/promo_banner.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top-left Tag */}
                  {item.tag && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
                      {item.tag}
                    </span>
                  )}

                  {/* Bottom-right Discount badge */}
                  {item.discount && (
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[11px] font-black shadow-md">
                      {item.discount}
                    </span>
                  )}

                  {item.image?.startsWith('data:image') && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-500/80 backdrop-blur-sm text-white text-[9.5px] font-bold shadow-xs">
                      Ảnh Tải Lên
                    </span>
                  )}
                </div>

                {/* Upload Image Button */}
                <div>
                  <input
                    type="file"
                    id={`whatsnew-file-input-${idx}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadPosterImage(idx, e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById(`whatsnew-file-input-${idx}`)?.click()}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải Poster Dọc 3:4 Từ Máy</span>
                  </button>
                </div>

                {/* Input Fields */}
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Nhãn góc trên (Tag)
                    </label>
                    <input
                      type="text"
                      value={item.tag || ''}
                      onChange={(e) => handleUpdateField(idx, 'tag', e.target.value)}
                      placeholder="MÓN MỚI, COMBO HOT..."
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-medium focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Tiêu đề món mới (Title)
                    </label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => handleUpdateField(idx, 'title', e.target.value)}
                      placeholder="Matcha MK4 Latte & Cold Brew Cam Vàng..."
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Huy hiệu giá / Ưu đãi
                      </label>
                      <input
                        type="text"
                        value={item.discount || ''}
                        onChange={(e) => handleUpdateField(idx, 'discount', e.target.value)}
                        placeholder="GIẢM 20%, CHỈ 69K..."
                        className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono font-bold focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Nút bấm (CTA)
                      </label>
                      <input
                        type="text"
                        value={item.cta || ''}
                        onChange={(e) => handleUpdateField(idx, 'cta', e.target.value)}
                        placeholder="Thử Món Mới..."
                        className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-medium focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Đường dẫn khi bấm (Link đích)
                    </label>
                    <input
                      type="text"
                      value={item.link || ''}
                      onChange={(e) => handleUpdateField(idx, 'link', e.target.value)}
                      placeholder="/dathang, /khuyenmai..."
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Đường dẫn ảnh trực tiếp (Image URL)
                    </label>
                    <input
                      type="text"
                      value={item.image || ''}
                      onChange={(e) => handleUpdateField(idx, 'image', e.target.value)}
                      placeholder="/images/promo_banner.jpg hoặc link https://..."
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-mono truncate focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive Live Preview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-500" />
              <span>Xem Trước Hiển Thị & Trượt Món Mới (Live Preview)</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Kiểm tra trực tiếp cách trượt trái/phải với số lượng {posters.length} món trên cả máy tính và điện thoại.
            </p>
          </div>

          {/* Desktop vs Mobile Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900 border border-neutral-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => { setPreviewMode('desktop'); setPreviewIndex(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewMode === 'desktop'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Máy Tính (3 món)</span>
            </button>
            <button
              type="button"
              onClick={() => { setPreviewMode('mobile'); setPreviewIndex(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewMode === 'mobile'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Điện Thoại (1 món)</span>
            </button>
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#f5ede3] border border-white/60 shadow-inner">
          <div className="max-w-5xl mx-auto">
            {/* Header Preview */}
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-white/80 border border-white/90 text-[#8c5932] text-xs font-black uppercase tracking-wider">
                {sectionConfig.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2b170e] uppercase">
                {sectionConfig.title} <span className="text-[#8c5932]">{sectionConfig.highlightTitle}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#5c3d2e] font-medium">
                {sectionConfig.subtitle}
              </p>
            </div>

            {/* Slider Mockup */}
            <div className={`mx-auto relative ${previewMode === 'mobile' ? 'max-w-xs' : 'max-w-4xl'}`}>
              {/* Navigation Left */}
              {posters.length > previewVisibleCount && (
                <button
                  type="button"
                  onClick={() => setPreviewIndex(prev => (prev <= 0 ? previewMaxIndex : prev - 1))}
                  className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-stone-200/90 shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Navigation Right */}
              {posters.length > previewVisibleCount && (
                <button
                  type="button"
                  onClick={() => setPreviewIndex(prev => (prev >= previewMaxIndex ? 0 : prev + 1))}
                  className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-stone-200/90 shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Slider Track */}
              <div className="overflow-hidden w-full px-1 py-1">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${safePreviewIndex * (100 / previewVisibleCount)}%)`
                  }}
                >
                  {posters.map((item, pIdx) => (
                    <div 
                      key={item.id || pIdx}
                      className={`shrink-0 p-2 ${previewMode === 'mobile' ? 'w-full' : 'w-1/3'}`}
                    >
                      <div className="rounded-[28px] overflow-hidden p-3 bg-white/80 border border-white/90 shadow-md flex flex-col justify-between h-full">
                        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-stone-900 shadow-inner">
                          <img
                            src={item.image || '/images/promo_banner.jpg'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          {item.tag && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-white text-[9.5px] font-black uppercase bg-black/60 backdrop-blur-md">
                              {item.tag}
                            </span>
                          )}
                          {item.discount && (
                            <span className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-[#1a0a04] font-mono text-[10.5px] font-black">
                              {item.discount}
                            </span>
                          )}
                        </div>
                        <div className="pt-2.5 px-0.5 flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-[#2b170e] truncate" title={item.title}>
                            {item.title}
                          </h4>
                          <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#2b170e] text-white text-[10px] font-bold inline-flex items-center gap-1">
                            <span>{item.cta || 'Xem'}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots */}
              {posters.length > previewVisibleCount && (
                <div className="flex items-center justify-center gap-1.5 mt-5">
                  {Array.from({ length: previewMaxIndex + 1 }).map((_, dIdx) => (
                    <button
                      key={dIdx}
                      type="button"
                      onClick={() => setPreviewIndex(dIdx)}
                      className={`h-2 rounded-full transition-all ${
                        safePreviewIndex === dIdx ? 'w-6 bg-[#8c5932]' : 'w-2 bg-stone-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Save Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm flex items-center gap-2 shadow-2xl cursor-pointer active:scale-95 transition-all"
        >
          <Save className="w-5 h-5 stroke-[2.5]" />
          <span>LƯU CẤU HÌNH MÓN MỚI & ƯU ĐÃI</span>
        </button>
      </div>
    </div>
  );
}
