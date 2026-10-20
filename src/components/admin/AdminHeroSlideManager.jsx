import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Video, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Save, 
  Check, 
  Layers, 
  Type, 
  Move, 
  Trash2, 
  Copy, 
  Lock, 
  Unlock, 
  Maximize2, 
  Grid, 
  Sliders, 
  Palette, 
  Play, 
  Link as LinkIcon, 
  FolderPlus, 
  Smile, 
  Zap, 
  Compass, 
  ArrowUp, 
  ArrowDown, 
  Film, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../../data/siteConfig';
import { uploadImageToSupabase } from '../../lib/supabase';
import { 
  FONT_FAMILIES, 
  SHADOW_PRESETS, 
  ANIMATION_PRESETS, 
  BADGE_PRESETS, 
  COLOR_PALETTE, 
  BUILT_IN_STICKERS, 
  HERO_TEMPLATES, 
  getLayerTextShadow, 
  getLayerAnimationClass, 
  getLayerBadgeClass 
} from '../../data/bannerDesignerPresets';

export default function AdminHeroSlideManager({ config, onSaveConfig, triggerAlert }) {
  const currentBanner = config.heroBanner16x9 || DEFAULT_SITE_CONFIG.heroBanner16x9 || {};

  // Background Media State
  const [mediaType, setMediaType] = useState(currentBanner.type || 'auto');
  const [mediaUrl, setMediaUrl] = useState(currentBanner.mediaUrl || '/images/hero_banner.jpg');
  const [clickLink, setClickLink] = useState(currentBanner.link || '/dathang');
  const [altText, setAltText] = useState(currentBanner.alt || 'COFFEE 24/24');
  const [fixedBackground, setFixedBackground] = useState(currentBanner.fixedBackground || false);
  const [mobileAspectRatio, setMobileAspectRatio] = useState(currentBanner.mobileAspectRatio || 'full');

  // Background Lighting & Filter State
  const [filter, setFilter] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    overlayDarkness: 10,
    overlayColor: '#000000',
    vignette: true,
    ...(currentBanner.filter || {})
  });

  // Designer Layers State (Chữ, Hình ảnh, Sticker)
  const [layers, setLayers] = useState(currentBanner.layers || []);
  const [selectedLayerId, setSelectedLayerId] = useState(null);

  // Studio UI Canvas Controls
  const [activeTab, setActiveTab] = useState('layers'); // 'layers' | 'text' | 'image' | 'background' | 'templates'
  const [showSimulatedHeader, setShowSimulatedHeader] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(100); // 100 | 85 | 70

  // Drag & Drop State
  const canvasRef = useRef(null);
  const [draggingLayerId, setDraggingLayerId] = useState(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, layerX: 50, layerY: 50 });

  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  // Helper detect if current media is a video
  const isVideo = () => {
    if (mediaType === 'video') return true;
    if (mediaType === 'image' || mediaType === 'gif') return false;
    if (!mediaUrl || typeof mediaUrl !== 'string') return false;
    const clean = mediaUrl.toLowerCase().split('?')[0];
    return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov') || clean.endsWith('.ogg') || mediaUrl.startsWith('data:video/');
  };

  // Keyboard shortcut Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Delete' && selectedLayerId && !['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) {
        handleDeleteLayer(selectedLayerId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layers, filter, mediaUrl, mediaType, clickLink, selectedLayerId]);

  // Mouse & Touch Dragging on 16:9 Canvas
  const handleStartDrag = (e, layer) => {
    if (layer.locked) return;
    e.stopPropagation();
    setSelectedLayerId(layer.id);
    if (layer.type === 'text') setActiveTab('text');
    else if (layer.type === 'image') setActiveTab('image');
    setDraggingLayerId(layer.id);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      layerX: layer.x,
      layerY: layer.y
    };
  };

  const handleCanvasMouseMove = (e) => {
    if (!draggingLayerId || !canvasRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = ((clientX - dragStartRef.current.mouseX) / rect.width) * 100;
    const deltaY = ((clientY - dragStartRef.current.mouseY) / rect.height) * 100;

    const newX = Math.round(Math.min(98, Math.max(2, dragStartRef.current.layerX + deltaX)) * 10) / 10;
    const newY = Math.round(Math.min(98, Math.max(2, dragStartRef.current.layerY + deltaY)) * 10) / 10;

    setLayers(prev => prev.map(l => {
      if (l.id === draggingLayerId) {
        return { ...l, x: newX, y: newY };
      }
      return l;
    }));
  };

  const handleEndDrag = () => {
    setDraggingLayerId(null);
  };

  // Layer Operations: Add Text Layer
  const handleAddTextLayer = (templateType = 'title') => {
    let newLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: 'COFFEE 24/24',
      x: 50,
      y: 55,
      fontFamily: 'Montserrat',
      fontSize: 38,
      fontWeight: '800',
      fontStyle: 'normal',
      textDecoration: 'none',
      textTransform: 'uppercase',
      textAlign: 'center',
      color: '#ffffff',
      letterSpacing: 2,
      lineHeight: 1.2,
      rotation: 0,
      shadowType: 'soft',
      shadowColor: 'rgba(0,0,0,0.7)',
      shadowBlur: 14,
      shadowX: 0,
      shadowY: 4,
      bgBadge: 'none',
      animation: 'none',
      link: '/dathang',
      zIndex: layers.length + 1,
      visible: true,
      locked: false
    };

    if (templateType === 'title') {
      newLayer.text = 'COFFEE 24/24';
      newLayer.fontSize = 52;
      newLayer.fontFamily = 'Oswald';
      newLayer.shadowType = 'deep';
    } else if (templateType === 'subtitle') {
      newLayer.text = 'Hương Vị Cà Phê Mộc Nguyên Bản · Enjoy Your Life';
      newLayer.fontSize = 20;
      newLayer.fontWeight = '600';
      newLayer.fontFamily = 'Montserrat';
      newLayer.y = 68;
    } else if (templateType === 'badge') {
      newLayer.text = '⚡ Bếp Nóng & Cà Phê Mở Cửa 24/7 ⚡';
      newLayer.fontSize = 15;
      newLayer.fontWeight = '800';
      newLayer.bgBadge = 'espresso';
      newLayer.color = '#fbbf24';
      newLayer.y = 42;
      newLayer.animation = 'pulse';
    }

    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    setActiveTab('text');
    triggerAlert('✓ Đã thêm lớp chữ mới! Bạn có thể kéo thả trực tiếp trên màn hình xem trước.');
  };

  // Add Image / Sticker from user device
  const handleAddCustomImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hoặc GIF hợp lệ (PNG, JPG, WEBP, GIF).');
      return;
    }

    triggerAlert('⏳ Đang tải ảnh lên kho lưu trữ Supabase Cloud...');

    let finalUrl = null;
    try {
      finalUrl = await uploadImageToSupabase(file, 'stickers');
    } catch (uploadErr) {
      console.warn('Lỗi tải ảnh lên Supabase Storage:', uploadErr);
    }

    // Fallback: nếu chưa kết nối được storage hoặc mạng offline, nén ảnh qua canvas nhẹ dưới 80KB
    if (!finalUrl) {
      const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
      if (isGif) {
        finalUrl = await new Promise(res => {
          const r = new FileReader();
          r.onload = ev => res(ev.target.result);
          r.readAsDataURL(file);
        });
      } else {
        finalUrl = await new Promise(res => {
          const r = new FileReader();
          r.onload = ev => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let w = img.width;
              let h = img.height;
              const maxW = 600;
              if (w > maxW) {
                h = Math.round(h * (maxW / w));
                w = maxW;
              }
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);
              res(canvas.toDataURL('image/webp', 0.85));
            };
            img.src = ev.target.result;
          };
          r.readAsDataURL(file);
        });
      }
    }

    const newLayer = {
      id: `img-${Date.now()}`,
      type: 'image',
      imageUrl: finalUrl,
      title: file.name.replace(/\.[^/.]+$/, ''),
      x: 50,
      y: 50,
      width: 18, // 18% width of 16:9 banner
      rotation: 0,
      opacity: 100,
      borderRadius: 16,
      borderWidth: 0,
      borderColor: '#ffffff',
      shadow: 'soft',
      blendMode: 'normal',
      animation: 'none',
      link: '',
      zIndex: layers.length + 1,
      visible: true,
      locked: false
    };

    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    setActiveTab('image');
    triggerAlert('✓ Đã tải ảnh lên Supabase Storage thành công! Bấm "LƯU THIẾT KẾ TRANG CHỦ" để lưu và hiển thị ngoài trang chủ.');
    e.target.value = '';
  };

  // Add Built-in Vector Sticker
  const handleAddBuiltInSticker = (sticker) => {
    const newLayer = {
      id: `sticker-${Date.now()}`,
      type: 'image',
      imageUrl: sticker.dataUrl,
      title: sticker.name,
      x: 50,
      y: 50,
      width: 14,
      rotation: 0,
      opacity: 100,
      borderRadius: sticker.type === 'stamp' || sticker.type === 'seal' ? 9999 : 24,
      borderWidth: 0,
      borderColor: '#ffffff',
      shadow: 'glow',
      blendMode: 'normal',
      animation: sticker.type === 'stamp' ? 'spin_slow' : 'float',
      link: '/dathang',
      zIndex: layers.length + 1,
      visible: true,
      locked: false
    };

    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    setActiveTab('image');
    triggerAlert(`✓ Đã thêm "${sticker.name}" vào banner!`);
  };

  // Update specific property on selected layer
  const updateSelectedLayer = (key, val) => {
    if (!selectedLayerId) return;
    setLayers(prev => prev.map(l => {
      if (l.id === selectedLayerId) {
        return { ...l, [key]: val };
      }
      return l;
    }));
  };

  // Duplicate Layer
  const handleDuplicateLayer = (id) => {
    const target = layers.find(l => l.id === id);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `${target.type}-${Date.now()}`,
      x: Math.min(94, target.x + 3),
      y: Math.min(94, target.y + 3),
      zIndex: layers.length + 1
    };
    setLayers(prev => [...prev, duplicated]);
    setSelectedLayerId(duplicated.id);
    triggerAlert('✓ Đã nhân bản lớp thiết kế!');
  };

  // Delete Layer
  const handleDeleteLayer = (id) => {
    setLayers(prev => prev.filter(l => l.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  // Move Layer Up / Down in stacking order
  const handleMoveLayerOrder = (id, direction) => {
    const index = layers.findIndex(l => l.id === id);
    if (index === -1) return;
    const newLayers = [...layers];
    if (direction === 'up' && index < newLayers.length - 1) {
      const temp = newLayers[index];
      newLayers[index] = newLayers[index + 1];
      newLayers[index + 1] = temp;
    } else if (direction === 'down' && index > 0) {
      const temp = newLayers[index];
      newLayers[index] = newLayers[index - 1];
      newLayers[index - 1] = temp;
    }
    // Re-assign zIndexes
    const updated = newLayers.map((l, i) => ({ ...l, zIndex: i + 1 }));
    setLayers(updated);
  };

  // Apply a 1-Click Aesthetic Template
  const handleApplyTemplate = (tpl) => {
    if (window.confirm(`Bạn có chắc muốn áp dụng mẫu thiết kế "${tpl.title}"? Thiết kế hiện tại sẽ được cập nhật theo mẫu này.`)) {
      setFilter(tpl.filter || { brightness: 100, contrast: 100, saturation: 100, blur: 0, overlayDarkness: 10, vignette: true });
      // Give fresh IDs to template layers
      const newLayers = (tpl.layers || []).map((l, idx) => ({
        ...l,
        id: `tpl-${Date.now()}-${idx}`
      }));
      setLayers(newLayers);
      setSelectedLayerId(newLayers[0]?.id || null);
      triggerAlert(`✓ Đã áp dụng mẫu thiết kế: "${tpl.title}"! Bấm "Lưu Thiết Kế Trang Chủ" để cập nhật.`);
    }
  };

  // Upload Background Image or Video
  const handleBackgroundImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP, GIF).');
      return;
    }

    triggerAlert('⏳ Đang tải ảnh nền lên Supabase Storage...');

    try {
      const cloudUrl = await uploadImageToSupabase(file, 'hero-bg');
      if (cloudUrl) {
        setMediaUrl(cloudUrl);
        setMediaType(file.type === 'image/gif' ? 'gif' : 'image');
        triggerAlert('✓ Đã tải ảnh nền lên Supabase Storage thành công! Bấm "LƯU THIẾT KẾ TRANG CHỦ" để áp dụng.');
        e.target.value = '';
        return;
      }
    } catch (err) {
      console.warn('Lỗi tải ảnh nền lên Supabase:', err);
    }

    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const raw = loadEvt.target.result;
      if (isGif) {
        setMediaUrl(raw);
        setMediaType('gif');
        triggerAlert('✓ Đã tải ảnh GIF động nền thành công!');
        return;
      }

      // Optimize image size to 16:9
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        const maxW = 1920;
        const maxH = 1080;
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.90);
        setMediaUrl(compressed);
        setMediaType('image');
        triggerAlert('✓ Đã cập nhật ảnh nền 16:9 mới!');
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Upload Background Video
  const handleBackgroundVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Vui lòng chọn file video hợp lệ (MP4, WebM, MOV, OGG).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('File video vượt quá 50MB. Vui lòng nén dung lượng để trang chủ tải nhanh nhất.');
      return;
    }

    triggerAlert('⏳ Đang tải video lên Supabase Storage...');

    try {
      const cloudUrl = await uploadImageToSupabase(file, 'hero-video');
      if (cloudUrl) {
        setMediaUrl(cloudUrl);
        setMediaType('video');
        triggerAlert('✓ Đã tải video lên Supabase Storage thành công! Bấm "LƯU THIẾT KẾ TRANG CHỦ" để áp dụng.');
        e.target.value = '';
        return;
      }
    } catch (err) {
      console.warn('Lỗi tải video lên Supabase:', err);
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setMediaUrl(loadEvt.target.result);
      setMediaType('video');
      triggerAlert('✓ Đã tải video nền 16:9 thành công! Video sẽ tự động phát lặp lại.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Preset library background photos
  const libraryBackgrounds = [
    { label: 'Quầy Bar Espresso & Barista', url: '/images/hero_banner.jpg' },
    { label: 'Không Gian Phố Đêm Chi Nhánh', url: '/images/branch_downtown.jpg' },
    { label: 'Cold Brew & Trái Cây Mới', url: '/images/promo_banner.jpg' },
    { label: 'Hạt Cà Phê Mộc Rang Đậm', url: '/images/journey_roast.jpg' },
    { label: 'Nông Trại Cầu Đất Đà Lạt', url: '/images/journey_farm.jpg' },
    { label: 'Pha Chế Thủ Công Thả Chậm', url: '/images/blog_brewing.jpg' }
  ];

  // Save all canvas design to siteConfig
  const handleSave = () => {
    const updatedBanner = {
      type: mediaType,
      mediaUrl,
      link: clickLink,
      alt: altText,
      fixedBackground,
      mobileAspectRatio,
      filter,
      layers
    };

    const newConfig = {
      ...config,
      heroBanner16x9: updatedBanner
    };

    onSaveConfig(newConfig);
    triggerAlert('✓ ĐÃ LƯU THIẾT KẾ BANNER TRANG CHỦ THÀNH CÔNG! Cài đặt độ tối ảnh nền, cố định ảnh nền và các lớp chữ/sticker đã được cập nhật trực tiếp trên trang chủ.');
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục toàn bộ thiết kế ảnh bìa 16:9 về mặc định ban đầu?')) {
      const def = DEFAULT_SITE_CONFIG.heroBanner16x9;
      setMediaType(def.type);
      setMediaUrl(def.mediaUrl);
      setClickLink(def.link);
      setAltText(def.alt);
      setFixedBackground(false);
      setMobileAspectRatio('full');
      setFilter(def.filter || { brightness: 100, contrast: 100, saturation: 100, blur: 0, overlayDarkness: 10, overlayColor: '#000000', vignette: true });
      setLayers([]);
      setSelectedLayerId(null);

      const newConfig = {
        ...config,
        heroBanner16x9: def
      };
      onSaveConfig(newConfig);
      triggerAlert('Đã khôi phục thiết kế banner về mặc định ban đầu!');
    }
  };

  // Background filter CSS
  const bgFilterStyle = {
    filter: `brightness(${filter.brightness ?? 100}%) contrast(${filter.contrast ?? 100}%) saturate(${filter.saturation ?? 100}%) blur(${filter.blur ?? 0}px)`
  };

  return (
    <div className="space-y-6 select-none font-sans pb-16">
      
      {/* 1. TOP HEADER & MAIN ACTION BAR */}
      <div className="p-5 sm:p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 text-xs font-black tracking-wider uppercase mb-2 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio Thiết Kế Trực Quan Banner Trang Chủ (16:9 Canvas Designer)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Thiết Kế Banner Đầu Trang Chủ</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 font-mono font-normal">
              {layers.length} Lớp Thiết Kế
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
            Kéo thả tự do, thêm chữ, chọn 12 font Google Fonts nghệ thuật, bóng đổ 3D/Neon, tải sticker tem nhãn, hiệu ứng chuyển động và xem trước thời gian thực.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold border border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Khôi phục ảnh bìa gốc"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Khôi Phục Gốc</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyTemplate(HERO_TEMPLATES[0])}
            className="px-3.5 py-2.5 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 text-xs font-bold border border-amber-800/60 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mẫu Đêm 24/7</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_8px_25px_rgba(245,158,11,0.35)] flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>LƯU THIẾT KẾ TRANG CHỦ</span>
          </button>
        </div>
      </div>

      {/* 2. DOCK STUDIO 2 CỘT: PREVIEW TRÁI (STICKY) & BẢNG CHỈNH SỬA PHẢI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4 items-start">
        
        {/* CỘT TRÁI: LIVE 16:9 PREVIEW CANVAS (STICKY TẠI MẮT NHÌN) */}
        <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-2 z-10 space-y-2.5">
          <div className="p-3.5 sm:p-5 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl space-y-3">
        
        {/* Canvas Toolbar (Controls & Toggles) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 text-xs text-neutral-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Màn Hình Xem Trước & Kéo Thả Trực Quan (Tỉ Lệ 16:9)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Header Overlay */}
            <button
              type="button"
              onClick={() => setShowSimulatedHeader(!showSimulatedHeader)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showSimulatedHeader 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
              title="Bật/Tắt thanh Header đè lên để canh bố cục"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Header Đè Lên</span>
            </button>

            {/* Toggle Grid */}
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showGrid 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
              title="Bật lưới căn chỉnh 3x3"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Lưới Canh</span>
            </button>

            {/* Quick Deselect */}
            {selectedLayerId && (
              <button
                type="button"
                onClick={() => setSelectedLayerId(null)}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold border border-neutral-800 transition-all cursor-pointer"
              >
                Bỏ chọn layer
              </button>
            )}
          </div>
        </div>

        {/* 16:9 Interactive Canvas Viewport */}
        <div 
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleEndDrag}
          onMouseLeave={handleEndDrag}
          onTouchMove={handleCanvasMouseMove}
          onTouchEnd={handleEndDrag}
          onClick={(e) => {
            // Click outside layers to deselect
            if (e.target === canvasRef.current || e.target.tagName.toLowerCase() === 'img' || e.target.tagName.toLowerCase() === 'video') {
              setSelectedLayerId(null);
            }
          }}
          className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl sm:rounded-3xl bg-stone-900 border-2 border-neutral-700 shadow-[0_25px_60px_rgba(0,0,0,0.7)] select-none cursor-crosshair group"
          style={{
            containerType: 'inline-size',
            maxWidth: canvasZoom < 100 ? `${canvasZoom}%` : '100%',
            margin: '0 auto'
          }}
        >
          {/* Background Media */}
          {isVideo() ? (
            <video
              src={mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              style={bgFilterStyle}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          ) : (
            <img 
              src={mediaUrl} 
              alt={altText}
              style={bgFilterStyle}
              className="w-full h-full object-cover select-none pointer-events-none" 
            />
          )}

          {/* Dark Overlay Tint */}
          {(filter.overlayDarkness ?? 10) > 0 && (
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity" 
              style={{ 
                backgroundColor: filter.overlayColor || '#000000',
                opacity: (filter.overlayDarkness ?? 10) / 100 
              }} 
            />
          )}

          {/* Top Vignette Gradient */}
          {filter.vignette !== false && (
            <div className="absolute top-0 inset-x-0 h-24 sm:h-36 bg-gradient-to-b from-black/50 via-black/10 to-transparent pointer-events-none" />
          )}

          {/* Simulated Floating Header (So user sees how Header overlays banner!) */}
          {showSimulatedHeader && (
            <div className="absolute top-0 inset-x-0 z-40 pointer-events-none p-2 sm:p-4 animate-in fade-in duration-300">
              <div className="max-w-6xl mx-auto rounded-full border border-white/60 bg-white/50 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-2.5 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#2b170e] text-amber-200 flex items-center justify-center font-black text-xs">
                    ☕
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#2b170e] uppercase tracking-tight">
                    {config.brandName || 'COFFEE 24/24'}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[11px] font-bold text-[#4a3427]">
                  <span className="px-2.5 py-1 rounded-full bg-white/70 shadow-xs">Trang Chủ</span>
                  <span>Thực Đơn</span>
                  <span>Khuyến Mãi</span>
                  <span>Giới Thiệu</span>
                  <span>Tuyển Dụng</span>
                  <span>Bài Viết</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#2b170e] text-white text-[11px] font-bold">
                  ĐẶT MÓN
                </div>
              </div>
            </div>
          )}

          {/* Grid Overlay 3x3 */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none z-30 grid grid-cols-3 grid-rows-3 border border-amber-400/30">
              <div className="border-r border-b border-amber-400/25" />
              <div className="border-r border-b border-amber-400/25" />
              <div className="border-b border-amber-400/25" />
              <div className="border-r border-b border-amber-400/25" />
              <div className="border-r border-b border-amber-400/25" />
              <div className="border-b border-amber-400/25" />
              <div className="border-r border-amber-400/25" />
              <div className="border-r border-amber-400/25" />
              <div className="" />
            </div>
          )}

          {/* RENDER ALL DESIGNER LAYERS */}
          {layers.map((layer) => {
            if (layer.visible === false) return null;

            const isSelected = layer.id === selectedLayerId;
            const isText = layer.type === 'text';
            const animClass = getLayerAnimationClass(layer.animation);
            const badgeClass = isText ? getLayerBadgeClass(layer.bgBadge) : '';
            const textShadow = isText ? getLayerTextShadow(layer) : 'none';

            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleStartDrag(e, layer)}
                onTouchStart={(e) => handleStartDrag(e, layer)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLayerId(layer.id);
                }}
                className={`absolute select-none cursor-move transition-transform ${animClass} group/layer ${
                  isSelected ? 'z-50' : ''
                }`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation || 0}deg)`,
                  '--layer-rotate': `${layer.rotation || 0}deg`,
                  zIndex: isSelected ? 50 : (layer.zIndex || 10)
                }}
              >
                {/* Visual Bounding Box when Selected */}
                {isSelected && (
                  <div className="absolute -inset-2.5 rounded-xl border-2 border-dashed border-amber-400 bg-amber-500/10 pointer-events-none shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-in fade-in duration-150">
                    {/* Coordinate Indicator Pill */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-neutral-900 border border-amber-400 text-amber-300 font-mono text-[10px] font-bold whitespace-nowrap shadow-md">
                      X: {layer.x}% · Y: {layer.y}%
                    </div>

                    {/* Corner Handles */}
                    <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
                    <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
                  </div>
                )}

                {/* Layer Content */}
                {isText ? (
                  <div
                    className={`${badgeClass} inline-block transition-all`}
                    style={{
                      fontFamily: `'${layer.fontFamily || 'Montserrat'}', sans-serif`,
                      fontSize: `clamp(${Math.max(9, Math.round((layer.fontSize || 32) * 0.35))}px, ${(((layer.fontSize || 32) / 1440) * 100).toFixed(3)}cqw, ${(layer.fontSize || 32)}px)`,
                      fontWeight: layer.fontWeight || '700',
                      fontStyle: layer.fontStyle || 'normal',
                      textDecoration: layer.textDecoration || 'none',
                      textTransform: layer.textTransform || 'none',
                      textAlign: layer.textAlign || 'center',
                      color: layer.color || '#ffffff',
                      letterSpacing: `${layer.letterSpacing || 0}px`,
                      lineHeight: layer.lineHeight || 1.25,
                      textShadow: textShadow,
                      whiteSpace: layer.text?.includes('\n') ? 'pre' : 'nowrap'
                    }}
                  >
                    {layer.text || 'Chữ thiết kế'}
                  </div>
                ) : (
                  <div
                    className="inline-block transition-all"
                    style={{
                      width: `${(layer.width || 15)}cqw`,
                      opacity: (layer.opacity ?? 100) / 100,
                      mixBlendMode: layer.blendMode || 'normal',
                      filter: layer.shadow === 'glow' 
                        ? 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.8))' 
                        : layer.shadow === 'deep' 
                        ? 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.85))'
                        : layer.shadow === 'soft'
                        ? 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.55))'
                        : 'none'
                    }}
                  >
                    <img
                      src={layer.imageUrl}
                      alt={layer.title || 'Layer graphic'}
                      className="w-full h-auto block select-none pointer-events-none"
                      style={{
                        borderRadius: `${layer.borderRadius || 0}px`,
                        border: layer.borderWidth ? `${layer.borderWidth}px solid ${layer.borderColor || '#ffffff'}` : 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Canvas Bottom Quick Guide & Selected Layer Indicator */}
        <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
              {selectedLayer ? (
                <span className="text-amber-300 font-bold truncate max-w-[260px] sm:max-w-[340px]">
                  Đang chọn: {selectedLayer.type === 'text' ? `"${selectedLayer.text}"` : (selectedLayer.title || 'Sticker')} (X: {selectedLayer.x}% · Y: {selectedLayer.y}%)
                </span>
              ) : (
                <span className="text-neutral-400 text-[11px] truncate">
                  Bấm trực tiếp vào chữ hoặc sticker trên khung để chọn và kéo thả vị trí.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 text-neutral-500 font-mono text-[10px] shrink-0">
              <span>Ctrl + S: Lưu</span>
              <span>Delete: Xóa</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* CỘT PHẢI: BẢNG CHỈNH SỬA & 5 TABS (NGAY BÊN PHẢI MÀN HÌNH PREVIEW) */}
    <div className="lg:col-span-6 xl:col-span-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl overflow-hidden flex flex-col">
      
      {/* Navigation Tabs Bar (Sticky Top của panel phải) */}
      <div className="sticky top-0 z-20 flex items-center border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-md p-2 gap-1 overflow-x-auto scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('layers')}
          className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
            activeTab === 'layers' 
              ? 'bg-amber-500 text-stone-950 shadow-md' 
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
          title="Quản lý các lớp chữ, ảnh và thêm layer mới"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Lớp</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/25">
            {layers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
            activeTab === 'text' 
              ? 'bg-amber-500 text-stone-950 shadow-md' 
              : selectedLayer?.type === 'text'
              ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
          title="Định dạng font chữ, màu sắc, đổ bóng và chuyển động"
        >
          <Type className="w-3.5 h-3.5" />
          <span>2. Chữ</span>
          {selectedLayer?.type === 'text' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
            activeTab === 'image' 
              ? 'bg-amber-500 text-stone-950 shadow-md' 
              : selectedLayer?.type === 'image'
              ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
          title="Tải sticker, đổi hình ảnh và hiệu ứng ảnh"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>3. Sticker</span>
          {selectedLayer?.type === 'image' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('background')}
          className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
            activeTab === 'background' 
              ? 'bg-amber-500 text-stone-950 shadow-md' 
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
          title="Chọn ảnh/video nền 16:9 và tinh chỉnh bộ lọc ánh sáng"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>4. Nền 16:9 & Lọc</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
            activeTab === 'templates' 
              ? 'bg-amber-500 text-stone-950 shadow-md' 
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
          title="Bộ sưu tập 5 mẫu banner thiết kế sẵn"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>5. Mẫu Sẵn</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5">
          
          {/* =========================================================================
              TAB 1: QUẢN LÝ LỚP & THÊM MỚI (ADD TEXT / STICKER / MANAGE LAYERS)
              ========================================================================= */}
          {activeTab === 'layers' && (
            <div className="space-y-6">
              
              {/* Action Cards: Add Elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleAddTextLayer('title')}
                  className="p-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-700/80 hover:border-amber-500/60 text-left transition-all group cursor-pointer shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg mb-2.5 group-hover:scale-110 transition-transform">
                    <Type className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                    + Thêm Tiêu Đề Lớn
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Chữ to đậm nổi bật, font Oswald mạnh mẽ hoặc Montserrat.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddTextLayer('subtitle')}
                  className="p-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-700/80 hover:border-amber-500/60 text-left transition-all group cursor-pointer shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black text-lg mb-2.5 group-hover:scale-110 transition-transform">
                    <Type className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-white group-hover:text-sky-300 transition-colors">
                    + Thêm Phụ Đề / Slogan
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Dòng chữ phụ, lời chào, giới thiệu câu chuyện cà phê.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddTextLayer('badge')}
                  className="p-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-700/80 hover:border-amber-500/60 text-left transition-all group cursor-pointer shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-lg mb-2.5 group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-white group-hover:text-orange-300 transition-colors">
                    + Thêm Thẻ Giờ Mở Cửa 24/7
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Viên thuốc espresso đen bo tròn, chữ vàng kèm hiệu ứng thở.
                  </p>
                </button>

                <label className="p-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-700/80 hover:border-emerald-500/60 text-left transition-all group cursor-pointer shadow-md block">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAddCustomImage}
                    className="hidden" 
                  />
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg mb-2.5 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                    + Tải Ảnh / Sticker Lên
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Tải logo tách nền PNG, tem nhãn, huy hiệu từ máy tính.
                  </p>
                </label>
              </div>

              {/* 6 Built-in Coffee Vector Stickers */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Smile className="w-4 h-4 text-amber-400" />
                    <span>Bộ Con Dấu & Sticker Cà Phê Có Sẵn (Bấm Để Thêm Vào Banner)</span>
                  </h4>
                  <span className="text-[11px] text-neutral-400">Tự động chèn vào giữa khung hình</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {BUILT_IN_STICKERS.map((stk) => (
                    <button
                      key={stk.id}
                      type="button"
                      onClick={() => handleAddBuiltInSticker(stk)}
                      className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-400 hover:bg-neutral-850 flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
                    >
                      <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <img 
                          src={stk.dataUrl} 
                          alt={stk.name} 
                          className="max-w-full max-h-full object-contain filter drop-shadow-md"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-neutral-300 group-hover:text-amber-200 line-clamp-1">
                        {stk.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stacking Layers List */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Danh Sách Các Lớp Đang Có ({layers.length} Lớp)</span>
                  </h4>
                  {layers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Xóa sạch toàn bộ các lớp chữ và ảnh trên banner?')) {
                          setLayers([]);
                          setSelectedLayerId(null);
                        }
                      }}
                      className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
                    >
                      Xóa hết lớp
                    </button>
                  )}
                </div>

                {layers.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-neutral-800 text-center text-neutral-500 space-y-2">
                    <Type className="w-8 h-8 mx-auto text-neutral-600" />
                    <p className="text-sm font-bold text-neutral-400">Chưa có lớp chữ hoặc sticker nào trên ảnh bìa</p>
                    <p className="text-xs text-neutral-500">
                      Bấm vào các nút phía trên hoặc chọn "Mẫu Thiết Kế Sẵn" để bắt đầu sáng tạo!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {layers.map((l, idx) => {
                      const isSel = l.id === selectedLayerId;
                      const isTxt = l.type === 'text';

                      return (
                        <div
                          key={l.id}
                          onClick={() => setSelectedLayerId(l.id)}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isSel 
                              ? 'bg-amber-500/15 border-amber-400/80 shadow-md' 
                              : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          {/* Left: Icon & Title */}
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-neutral-800 text-neutral-400 font-mono text-[10px] flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-neutral-800 text-amber-400 flex items-center justify-center shrink-0">
                              {isTxt ? <Type className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-black text-white truncate max-w-[200px] sm:max-w-[280px]">
                                {isTxt ? (l.text || '(Chữ trống)') : (l.title || 'Hình ảnh sticker')}
                              </div>
                              <div className="text-[10px] text-neutral-400 font-mono">
                                Vị trí: X {l.x}% · Y {l.y}% {isTxt ? `· Font ${l.fontFamily}` : `· Rộng ${l.width}%`}
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                            {/* Layer Reorder */}
                            <button
                              type="button"
                              onClick={() => handleMoveLayerOrder(l.id, 'up')}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                              title="Đưa lên trên"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLayerOrder(l.id, 'down')}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                              title="Đưa xuống dưới"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Visibility Toggle */}
                            <button
                              type="button"
                              onClick={() => updateSelectedLayer('visible', l.visible === false ? true : false)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                              title={l.visible === false ? 'Bật hiển thị' : 'Ẩn lớp'}
                            >
                              {l.visible === false ? <EyeOff className="w-3.5 h-3.5 text-red-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>

                            {/* Lock Toggle */}
                            <button
                              type="button"
                              onClick={() => updateSelectedLayer('locked', !l.locked)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                              title={l.locked ? 'Mở khóa' : 'Khóa vị trí'}
                            >
                              {l.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-neutral-400" />}
                            </button>

                            {/* Duplicate */}
                            <button
                              type="button"
                              onClick={() => handleDuplicateLayer(l.id)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                              title="Nhân bản"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteLayer(l.id)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition-colors"
                              title="Xóa layer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: ĐỊNH DẠNG & HIỆU ỨNG CHỮ (TYPOGRAPHY & ADVANCED TEXT EFFECTS)
              ========================================================================= */}
          {activeTab === 'text' && (
            <div className="space-y-6">
              {!selectedLayer || selectedLayer.type !== 'text' ? (
                <div className="p-8 rounded-2xl border border-dashed border-neutral-800 text-center text-neutral-500 space-y-3">
                  <Type className="w-10 h-10 mx-auto text-neutral-600" />
                  <h4 className="text-sm font-bold text-neutral-300">Chưa có lớp chữ nào được chọn</h4>
                  <p className="text-xs text-neutral-500">
                    Bấm vào một dòng chữ trên khung xem trước, hoặc bấm nút dưới đây để tạo chữ mới!
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAddTextLayer('title')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-black text-xs inline-flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Type className="w-4 h-4" />
                    <span>+ Tạo Chữ Tiêu Đề Mới</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Selected Layer Info Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        Đang Chỉnh Sửa Chữ:
                      </span>
                      <span className="text-xs text-amber-300 font-bold truncate max-w-[200px]">
                        "{selectedLayer.text}"
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDuplicateLayer(selectedLayer.id)}
                        className="px-2.5 py-1 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Nhân bản</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLayer(selectedLayer.id)}
                        className="px-2.5 py-1 rounded-xl bg-red-950/60 text-red-300 hover:bg-red-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa chữ</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Text Content Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Nội dung văn bản</span>
                      <span className="text-[11px] text-neutral-500 font-normal">Hỗ trợ xuống dòng</span>
                    </label>
                    <textarea
                      rows={2}
                      value={selectedLayer.text}
                      onChange={(e) => updateSelectedLayer('text', e.target.value)}
                      placeholder="Nhập nội dung chữ hiển thị..."
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-700 text-white text-sm font-bold focus:border-amber-400 focus:outline-none transition-all"
                    />
                  </div>

                  {/* 2. Font Selection Grid (12 Google Fonts) */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Chọn Font Chữ Nghệ Thuật (12 Google Fonts)</span>
                      <span className="text-[11px] text-amber-400 font-bold">Font đang chọn: {selectedLayer.fontFamily}</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {FONT_FAMILIES.map((f) => {
                        const isFontActive = selectedLayer.fontFamily === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => updateSelectedLayer('fontFamily', f.id)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              isFontActive 
                                ? 'bg-amber-500/20 border-amber-400 shadow-sm' 
                                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                            }`}
                          >
                            <div 
                              className="text-base text-white truncate"
                              style={{ fontFamily: `'${f.id}', sans-serif` }}
                            >
                              COFFEE 24/24
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[11px] font-bold text-neutral-300">{f.name}</span>
                              <span className="text-[9px] text-neutral-500 uppercase">{f.style}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Text Formatting Controls: Size, Weight, Style, Align */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                    
                    {/* Font Size Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                        <span>Cỡ chữ:</span>
                        <span className="text-amber-300 font-mono font-black">{selectedLayer.fontSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="14" 
                        max="110" 
                        value={selectedLayer.fontSize}
                        onChange={(e) => updateSelectedLayer('fontSize', parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <div className="flex justify-between gap-1 text-[10px] text-neutral-400 pt-0.5">
                        <button type="button" onClick={() => updateSelectedLayer('fontSize', 18)} className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700">18px</button>
                        <button type="button" onClick={() => updateSelectedLayer('fontSize', 32)} className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700">32px</button>
                        <button type="button" onClick={() => updateSelectedLayer('fontSize', 48)} className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700">48px</button>
                        <button type="button" onClick={() => updateSelectedLayer('fontSize', 68)} className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700">68px</button>
                      </div>
                    </div>

                    {/* Font Weight */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-neutral-300 block">Độ đậm nét:</span>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { val: '400', label: 'Vừa' },
                          { val: '600', label: 'Dày' },
                          { val: '700', label: 'Đậm' },
                          { val: '900', label: 'Cực Đậm' }
                        ].map((w) => (
                          <button
                            key={w.val}
                            type="button"
                            onClick={() => updateSelectedLayer('fontWeight', w.val)}
                            className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              selectedLayer.fontWeight === w.val 
                                ? 'bg-amber-500 text-stone-950 font-black' 
                                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Style Toggles (Italic, Underline, Uppercase) */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-neutral-300 block">Kiểu chữ:</span>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => updateSelectedLayer('fontStyle', selectedLayer.fontStyle === 'italic' ? 'normal' : 'italic')}
                          className={`py-2 rounded-xl text-xs font-bold italic transition-all cursor-pointer ${
                            selectedLayer.fontStyle === 'italic' 
                              ? 'bg-amber-500 text-stone-950 font-black' 
                              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                          }`}
                          title="Chữ nghiêng (Italic)"
                        >
                          Nghiêng
                        </button>

                        <button
                          type="button"
                          onClick={() => updateSelectedLayer('textDecoration', selectedLayer.textDecoration === 'underline' ? 'none' : 'underline')}
                          className={`py-2 rounded-xl text-xs font-bold underline transition-all cursor-pointer ${
                            selectedLayer.textDecoration === 'underline' 
                              ? 'bg-amber-500 text-stone-950 font-black' 
                              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                          }`}
                          title="Gạch chân (Underline)"
                        >
                          Gạch Chân
                        </button>

                        <button
                          type="button"
                          onClick={() => updateSelectedLayer('textTransform', selectedLayer.textTransform === 'uppercase' ? 'none' : 'uppercase')}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedLayer.textTransform === 'uppercase' 
                              ? 'bg-amber-500 text-stone-950 font-black' 
                              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                          }`}
                          title="Viết hoa toàn bộ (UPPERCASE)"
                        >
                          IN HOA
                        </button>
                      </div>
                    </div>

                    {/* Rotation & Letter Spacing */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                        <span>Độ xoay nghiêng:</span>
                        <span className="text-amber-300 font-mono">{selectedLayer.rotation || 0}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="-45" 
                        max="45" 
                        value={selectedLayer.rotation || 0}
                        onChange={(e) => updateSelectedLayer('rotation', parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-500">
                        <button type="button" onClick={() => updateSelectedLayer('rotation', -8)} className="hover:text-amber-300">-8°</button>
                        <button type="button" onClick={() => updateSelectedLayer('rotation', 0)} className="hover:text-amber-300">0° (Thẳng)</button>
                        <button type="button" onClick={() => updateSelectedLayer('rotation', 8)} className="hover:text-amber-300">+8°</button>
                      </div>
                    </div>

                  </div>

                  {/* 4. Text Color & Palette */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Màu Sắc Chữ</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={selectedLayer.color || '#ffffff'}
                          onChange={(e) => updateSelectedLayer('color', e.target.value)}
                          className="w-6 h-6 rounded-md border-0 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-xs text-amber-300 uppercase">{selectedLayer.color || '#ffffff'}</span>
                      </div>
                    </label>

                    <div className="flex flex-wrap items-center gap-2">
                      {COLOR_PALETTE.map((pal) => (
                        <button
                          key={pal.color}
                          type="button"
                          onClick={() => updateSelectedLayer('color', pal.color)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            selectedLayer.color === pal.color 
                              ? 'border-amber-400 bg-neutral-800 shadow-sm' 
                              : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                          }`}
                        >
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0" 
                            style={{ backgroundColor: pal.color }}
                          />
                          <span className="text-neutral-300">{pal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Rich Shadow Effects (Càng nhiều hiệu ứng càng tốt!) */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Hiệu Ứng Bóng Đổ Đa Dạng (Shadow & Glow Effects)</span>
                      <span className="text-[11px] text-neutral-400">Tạo chiều sâu & tương phản sắc nét</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {SHADOW_PRESETS.map((sh) => {
                        const isShActive = selectedLayer.shadowType === sh.id;
                        return (
                          <button
                            key={sh.id}
                            type="button"
                            onClick={() => updateSelectedLayer('shadowType', sh.id)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              isShActive 
                                ? 'bg-amber-500/20 border-amber-400 shadow-md' 
                                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                            }`}
                          >
                            <div 
                              className="text-sm font-black text-white mb-1"
                              style={{ textShadow: sh.shadow }}
                            >
                              COFFEE 24/24
                            </div>
                            <div className="text-xs font-bold text-neutral-200">{sh.label}</div>
                            <div className="text-[10px] text-neutral-500 line-clamp-1">{sh.desc}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Shadow Sliders if 'custom' selected */}
                    {selectedLayer.shadowType === 'custom' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 animate-in fade-in">
                        <div className="space-y-1">
                          <span className="text-xs text-neutral-400">Độ mờ bóng (Blur): {selectedLayer.shadowBlur ?? 10}px</span>
                          <input 
                            type="range" min="0" max="40" 
                            value={selectedLayer.shadowBlur ?? 10}
                            onChange={(e) => updateSelectedLayer('shadowBlur', parseInt(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-neutral-400">Độ lệch dọc (Y): {selectedLayer.shadowY ?? 4}px</span>
                          <input 
                            type="range" min="-20" max="30" 
                            value={selectedLayer.shadowY ?? 4}
                            onChange={(e) => updateSelectedLayer('shadowY', parseInt(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-neutral-400">Màu bóng</span>
                          <input 
                            type="color"
                            value={selectedLayer.shadowColor || '#000000'}
                            onChange={(e) => updateSelectedLayer('shadowColor', e.target.value)}
                            className="w-full h-8 rounded-lg bg-transparent cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 6. Background Badge / Card for text */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-neutral-300 uppercase tracking-wider block">
                      Hộp Nền / Huy Hiệu Bao Quanh Chữ (Badge Pill)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {BADGE_PRESETS.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => updateSelectedLayer('bgBadge', b.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                            selectedLayer.bgBadge === b.id 
                              ? 'bg-amber-500 text-stone-950 border-amber-400 font-black' 
                              : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 7. Animation Presets (Chuyển động) */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Hiệu Ứng Chuyển Động (Animation)</span>
                      <span className="text-[11px] text-emerald-400 font-bold">Chuyển động mượt mà thời gian thực</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ANIMATION_PRESETS.map((an) => (
                        <button
                          key={an.id}
                          type="button"
                          onClick={() => updateSelectedLayer('animation', an.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                            selectedLayer.animation === an.id 
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                              : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="font-black truncate">{an.label}</div>
                          <div className="text-[10px] text-neutral-500">{an.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 8. Click Destination Link */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Đường Dẫn Khi Khách Bấm Vào Chữ Này (Tùy chọn)</span>
                    </label>
                    <input 
                      type="text" 
                      value={selectedLayer.link || ''}
                      onChange={(e) => updateSelectedLayer('link', e.target.value)}
                      placeholder="Ví dụ: /dathang hoặc /khuyenmai hoặc https://..."
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: STICKER & ẢNH CHÈN (STICKER / GRAPHIC LAYER EDITOR)
              ========================================================================= */}
          {activeTab === 'image' && (
            <div className="space-y-6">
              {!selectedLayer || selectedLayer.type !== 'image' ? (
                <div className="p-8 rounded-2xl border border-dashed border-neutral-800 text-center text-neutral-500 space-y-3">
                  <ImageIcon className="w-10 h-10 mx-auto text-neutral-600" />
                  <h4 className="text-sm font-bold text-neutral-300">Chưa có lớp hình ảnh / sticker nào được chọn</h4>
                  <p className="text-xs text-neutral-500">
                    Bấm vào một sticker trên khung xem trước hoặc thêm sticker mới bên dưới:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <label className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-black text-xs inline-flex items-center gap-1.5 shadow-md cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleAddCustomImage} className="hidden" />
                      <Upload className="w-4 h-4" />
                      <span>Tải Ảnh / Sticker Mới Lên</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Selected Layer Info Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-800 overflow-hidden flex items-center justify-center p-1 border border-neutral-700">
                        <img src={selectedLayer.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white uppercase tracking-wider block">
                          {selectedLayer.title || 'Sticker / Graphic'}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          X: {selectedLayer.x}% · Y: {selectedLayer.y}% · Rộng: {selectedLayer.width}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1 cursor-pointer">
                        <input type="file" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          triggerAlert('⏳ Đang tải ảnh mới lên Supabase Cloud...');
                          let url = null;
                          try {
                            url = await uploadImageToSupabase(file, 'stickers');
                          } catch (_) {}
                          if (url) {
                            updateSelectedLayer('imageUrl', url);
                            triggerAlert('✓ Đã cập nhật ảnh lên Supabase Storage thành công!');
                          } else {
                            const r = new FileReader();
                            r.onload = ev => updateSelectedLayer('imageUrl', ev.target.result);
                            r.readAsDataURL(file);
                          }
                        }} className="hidden" />
                        <Upload className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Đổi ảnh</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleDuplicateLayer(selectedLayer.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Nhân bản</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteLayer(selectedLayer.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>

                  {/* Size, Rotation, Opacity Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                    
                    {/* Width / Scale */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                        <span>Kích thước chiều rộng:</span>
                        <span className="text-amber-300 font-mono font-black">{selectedLayer.width || 15}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="55" 
                        value={selectedLayer.width || 15}
                        onChange={(e) => updateSelectedLayer('width', parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-500">
                        <span>Nhỏ (8%)</span>
                        <span>Vừa (18%)</span>
                        <span>Lớn (40%)</span>
                      </div>
                    </div>

                    {/* Rotation */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                        <span>Góc xoay:</span>
                        <span className="text-amber-300 font-mono font-black">{selectedLayer.rotation || 0}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="-180" 
                        max="180" 
                        value={selectedLayer.rotation || 0}
                        onChange={(e) => updateSelectedLayer('rotation', parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-500">
                        <button type="button" onClick={() => updateSelectedLayer('rotation', -15)}>-15°</button>
                        <button type="button" onClick={() => updateSelectedLayer('rotation', 0)}>0°</button>
                        <button type="button" onClick={() => updateSelectedLayer('rotation', 15)}>+15°</button>
                      </div>
                    </div>

                    {/* Opacity */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                        <span>Độ đậm / mờ:</span>
                        <span className="text-amber-300 font-mono font-black">{selectedLayer.opacity ?? 100}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="15" 
                        max="100" 
                        value={selectedLayer.opacity ?? 100}
                        onChange={(e) => updateSelectedLayer('opacity', parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-500">
                        <span>Mờ 30%</span>
                        <span>70%</span>
                        <span>Rõ 100%</span>
                      </div>
                    </div>

                  </div>

                  {/* Border Radius & Shadow */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Shadow Effect */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-black text-neutral-300 uppercase tracking-wider block">
                        Đổ bóng hình ảnh:
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'none', label: 'Không bóng' },
                          { id: 'soft', label: 'Bóng nhẹ' },
                          { id: 'deep', label: 'Bóng sâu 3D' },
                          { id: 'glow', label: 'Hào quang' }
                        ].map((sh) => (
                          <button
                            key={sh.id}
                            type="button"
                            onClick={() => updateSelectedLayer('shadow', sh.id)}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              (selectedLayer.shadow || 'none') === sh.id 
                                ? 'bg-amber-500 text-stone-950 border-amber-400 font-black' 
                                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            {sh.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Blend Mode */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-black text-neutral-300 uppercase tracking-wider block">
                        Chế độ hòa trộn nền (Blend Mode):
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'normal', label: 'Thường' },
                          { id: 'screen', label: 'Screen' },
                          { id: 'multiply', label: 'Multiply' },
                          { id: 'overlay', label: 'Overlay' }
                        ].map((bm) => (
                          <button
                            key={bm.id}
                            type="button"
                            onClick={() => updateSelectedLayer('blendMode', bm.id)}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              (selectedLayer.blendMode || 'normal') === bm.id 
                                ? 'bg-amber-500 text-stone-950 border-amber-400 font-black' 
                                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            {bm.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Animation for image */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-neutral-300 uppercase tracking-wider block">
                      Hiệu Ứng Chuyển Động Cho Sticker (Animation)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ANIMATION_PRESETS.map((an) => (
                        <button
                          key={an.id}
                          type="button"
                          onClick={() => updateSelectedLayer('animation', an.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                            selectedLayer.animation === an.id 
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                              : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="font-black truncate">{an.label}</div>
                          <div className="text-[10px] text-neutral-500">{an.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Click Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Đường Dẫn Khi Bấm Vào Sticker Này</span>
                    </label>
                    <input 
                      type="text" 
                      value={selectedLayer.link || ''}
                      onChange={(e) => updateSelectedLayer('link', e.target.value)}
                      placeholder="Ví dụ: /dathang hoặc /khuyenmai"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 4: ẢNH/VIDEO NỀN 16:9 & BỘ LỌC ÁNH SÁNG
              ========================================================================= */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              
              {/* Media Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Upload Image / GIF */}
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Tải Ảnh Bìa / GIF Động Mới (JPG, PNG, WEBP, GIF)
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Hệ thống tự động tối ưu hóa kích thước chuẩn 16:9 sắc nét cho mọi độ phân giải màn hình.
                  </p>
                  <label className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleBackgroundImageUpload}
                      className="hidden" 
                    />
                    <Upload className="w-4 h-4" />
                    <span>Chọn File Ảnh / GIF Từ Thiết Bị</span>
                  </label>
                </div>

                {/* Upload Video MP4 */}
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-sky-400" />
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Tải Video Chạy Nền 16:9 (MP4, WebM)
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Video tự động phát lặp lại (loop, muted) chuẩn 16:9 như trang chủ Apple/Starbucks.
                  </p>
                  <label className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm" 
                      onChange={handleBackgroundVideoUpload}
                      className="hidden" 
                    />
                    <Film className="w-4 h-4" />
                    <span>Chọn File Video MP4 (Dưới 28MB)</span>
                  </label>
                </div>

              </div>

              {/* Preset Coffee Photo Library */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-neutral-300 uppercase tracking-wider">
                  Hoặc Chọn Nhanh Ảnh Quán Từ Thư Viện Sẵn Có:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {libraryBackgrounds.map((lib) => (
                    <button
                      key={lib.url}
                      type="button"
                      onClick={() => {
                        setMediaUrl(lib.url);
                        setMediaType('image');
                        triggerAlert(`✓ Đã chọn ảnh nền: ${lib.label}`);
                      }}
                      className={`group rounded-2xl overflow-hidden border text-left transition-all cursor-pointer bg-neutral-900 ${
                        mediaUrl === lib.url ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-md' : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="w-full aspect-[16/9] overflow-hidden bg-stone-900">
                        <img 
                          src={lib.url} 
                          alt={lib.label} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="p-2 text-[11px] font-bold text-neutral-300 truncate">
                        {lib.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lighting & Filter Sliders */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>Bộ Lọc Ánh Sáng & Hiệu Ứng Nền (Lighting & Filters)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setFilter({ brightness: 100, contrast: 100, saturation: 100, blur: 0, overlayDarkness: 10, vignette: true })}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    Đặt lại mặc định
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Brightness */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                      <span>Độ sáng (Brightness):</span>
                      <span className="text-amber-300 font-mono">{filter.brightness ?? 100}%</span>
                    </div>
                    <input 
                      type="range" min="40" max="140" 
                      value={filter.brightness ?? 100}
                      onChange={(e) => setFilter(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                      <span>Độ tương phản (Contrast):</span>
                      <span className="text-amber-300 font-mono">{filter.contrast ?? 100}%</span>
                    </div>
                    <input 
                      type="range" min="60" max="140" 
                      value={filter.contrast ?? 100}
                      onChange={(e) => setFilter(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                      <span>Độ đậm màu (Saturation):</span>
                      <span className="text-amber-300 font-mono">{filter.saturation ?? 100}%</span>
                    </div>
                    <input 
                      type="range" min="20" max="180" 
                      value={filter.saturation ?? 100}
                      onChange={(e) => setFilter(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Blur */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                      <span>Làm mờ hậu cảnh (Blur):</span>
                      <span className="text-amber-300 font-mono">{filter.blur ?? 0}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="16" 
                      value={filter.blur ?? 0}
                      onChange={(e) => setFilter(prev => ({ ...prev, blur: parseInt(e.target.value) }))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Vignette Toggle */}
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                      <input 
                        type="checkbox"
                        checked={filter.vignette !== false}
                        onChange={(e) => setFilter(prev => ({ ...prev, vignette: e.target.checked }))}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-neutral-300">Dải bóng mờ đỉnh tách Header</span>
                    </label>
                  </div>

                </div>

                {/* =========================================================================
                    1. CHỨC NĂNG LÀM TỐI ẢNH NỀN (DARK OVERLAY & DIMMING)
                    ========================================================================= */}
                <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3.5 mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-amber-400" />
                      <h5 className="text-xs font-black text-white uppercase tracking-wider">
                        Chức Năng Làm Tối Ảnh Nền (Dark Overlay / Dim)
                      </h5>
                    </div>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Độ tối: {filter.overlayDarkness ?? 10}%
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Tăng độ tối cho ảnh/video nền để chữ tiêu đề, phụ đề, tem sticker và các khối giao diện nổi bật, dễ đọc và sang trọng hơn.
                  </p>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-neutral-500">Mức tối nhanh:</span>
                    {[
                      { val: 0, label: '0% (Sáng gốc)' },
                      { val: 20, label: '20% (Tối nhẹ)' },
                      { val: 40, label: '40% (Chuẩn đẹp)' },
                      { val: 60, label: '60% (Đậm nét)' },
                      { val: 80, label: '80% (Tối sâu)' }
                    ].map((ps) => (
                      <button
                        key={ps.val}
                        type="button"
                        onClick={() => setFilter(prev => ({ ...prev, overlayDarkness: ps.val }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          (filter.overlayDarkness ?? 10) === ps.val
                            ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                            : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        {ps.label}
                      </button>
                    ))}
                  </div>

                  {/* Continuous Slider */}
                  <div className="space-y-1 pt-1">
                    <input 
                      type="range" 
                      min="0" 
                      max="90" 
                      value={filter.overlayDarkness ?? 10}
                      onChange={(e) => setFilter(prev => ({ ...prev, overlayDarkness: parseInt(e.target.value) }))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                      <span>0% (Không phủ tối)</span>
                      <span>45% (Cân bằng)</span>
                      <span>90% (Gần như đen)</span>
                    </div>
                  </div>

                  {/* Tint Color Selector */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-neutral-900">
                    <span className="text-[11px] font-bold text-neutral-400">Tông màu phủ tối:</span>
                    {[
                      { color: '#000000', label: 'Đen tuyền (Chuẩn)' },
                      { color: '#1a0e08', label: 'Nâu Espresso' },
                      { color: '#0b1329', label: 'Xanh than đêm' },
                      { color: '#1c1917', label: 'Xám khói' }
                    ].map((tc) => (
                      <button
                        key={tc.color}
                        type="button"
                        onClick={() => setFilter(prev => ({ ...prev, overlayColor: tc.color }))}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          (filter.overlayColor || '#000000') === tc.color
                            ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                            : 'border-neutral-800 text-neutral-400 bg-neutral-900 hover:text-white'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: tc.color }} />
                        <span>{tc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* =========================================================================
                    2. TÙY CHỌN CỐ ĐỊNH ẢNH NỀN PHÍA SAU TRANG WEB (PARALLAX EFFECT)
                    ========================================================================= */}
                <div className={`p-4 rounded-2xl border transition-all mt-3 ${
                  fixedBackground 
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-md' 
                    : 'bg-neutral-950/80 border-neutral-800'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Compass className={`w-4 h-4 ${fixedBackground ? 'text-amber-400' : 'text-neutral-400'}`} />
                        <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <span>Cố Định Ảnh Nền Phía Sau Trang Web (Parallax Effect)</span>
                          {fixedBackground && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                              ĐANG BẬT
                            </span>
                          )}
                        </h5>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
                        Khi bật tùy chọn này, ảnh bìa 16:9 sẽ được ghim cố định ở vị trí phía sau (fixed background). Khi khách hàng cuộn trang xuống xem thực đơn, câu chuyện và đánh giá, các khối nội dung sẽ trượt lướt mượt mà nổi bật trên nền ảnh, tạo hiệu ứng chiều sâu 3D đẳng cấp.
                      </p>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setFixedBackground(!fixedBackground)}
                      className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        fixedBackground ? 'bg-amber-500' : 'bg-neutral-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-stone-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                          fixedBackground ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* =========================================================================
                    3. TÙY CHỌN TỈ LỆ ẢNH BÌA TRÊN ĐIỆN THOẠI (MOBILE ASPECT RATIO)
                    ========================================================================= */}
                <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3 mt-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <h5 className="text-xs font-black text-white uppercase tracking-wider">
                      Tỉ Lệ Hiển Thị Ảnh Bìa Trên Điện Thoại (Mobile)
                    </h5>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Mở to phạm vi chiều dài ảnh bìa trên màn hình điện thoại, tự động cắt đều 2 cạnh bên ảnh 16:9 để tạo cảm giác cao lớn, ấn tượng chuẩn poster dọc.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'full', label: 'Full Màn Hình (100dvh)', desc: 'Tự căn theo chiều dài mọi máy (Khuyên dùng)' },
                      { id: '3/4', label: '3:4 Dọc Chuẩn', desc: 'Mở to chiều dài & Cắt 2 bên ảnh' },
                      { id: '4/5', label: '4:5 Dọc Vừa', desc: 'Cao vừa vặn chuẩn Instagram' },
                      { id: '1/1', label: '1:1 Vuông', desc: 'Cắt nhẹ 2 bên ảnh' },
                      { id: '16/9', label: '16:9 Ngang', desc: 'Nguyên bản không cắt (nhỏ)' }
                    ].map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setMobileAspectRatio(r.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          (mobileAspectRatio === r.id || (!mobileAspectRatio && r.id === 'full'))
                            ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-amber-300">{r.label}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Banner Destination Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Đường Dẫn Khi Khách Bấm Vào Toàn Bộ Banner (Tùy chọn)</span>
                </label>
                <input 
                  type="text" 
                  value={clickLink}
                  onChange={(e) => setClickLink(e.target.value)}
                  placeholder="Ví dụ: /dathang hoặc https://..."
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 5: MẪU THIẾT KẾ SẴN (5 CURATED AESTHETIC TEMPLATES)
              ========================================================================= */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Bộ Sưu Tập Mẫu Thiết Kế Sẵn (1-Click Presets)</span>
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Bấm "Áp Dụng Mẫu" để tự động phối hợp font chữ nghệ thuật, màu sắc, bóng đổ và tem nhãn hài hòa nhất.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {HERO_TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-amber-400/70 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
                          {tpl.layers.length} Lớp Thiết Kế
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                        {tpl.title}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="w-full py-2.5 rounded-xl bg-neutral-800 group-hover:bg-amber-500 text-neutral-300 group-hover:text-stone-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Áp Dụng Mẫu Này</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  </div>
);
}
