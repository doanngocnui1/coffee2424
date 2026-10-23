import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Upload, 
  Sliders, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  Image as ImageIcon,
  Save,
  Check,
  Loader2,
  Smartphone,
  RefreshCw,
  Info
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../../data/siteConfig';
import { uploadImageToSupabase, saveCloudSiteConfig } from '../../lib/supabase';

export default function AdminGlassBackgroundManager({ config, onSaveConfig, triggerAlert }) {
  const [localGlassBg, setLocalGlassBg] = useState(() => {
    return config.glassBackground || DEFAULT_SITE_CONFIG.glassBackground;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (config.glassBackground) {
      setLocalGlassBg(config.glassBackground);
    }
  }, [config.glassBackground]);

  // Curated wallpaper presets
  const wallpaperPresets = [
    {
      id: 'warm_cafe',
      label: 'Quán Cà Phê Ấm Cúng',
      desc: 'Quầy bar espresso hiện đại với ánh đèn vàng ấm áp',
      image: '/images/hero_banner.jpg',
      presetSettings: { opacity: 0.42, blur: 6, glassBgOpacity: 0.25, glassBlur: 24 }
    },
    {
      id: 'coffee_beans',
      label: 'Hạt Cà Phê Mộc Rang Đậm',
      desc: 'Cận cảnh hạt Robusta & Arabica bóng bẩy hấp dẫn',
      image: '/images/journey_roast.jpg',
      presetSettings: { opacity: 0.38, blur: 5, glassBgOpacity: 0.28, glassBlur: 22 }
    },
    {
      id: 'caudat_farm',
      label: 'Nông Trại Cà Phê Cầu Đất',
      desc: 'Đồi chè và nương cà phê xanh mát, không khí trong lành',
      image: '/images/journey_farm.jpg',
      presetSettings: { opacity: 0.35, blur: 6, glassBgOpacity: 0.30, glassBlur: 24 }
    },
    {
      id: 'downtown_branch',
      label: 'Chi Nhánh Phố Đi Bộ Sang Trọng',
      desc: 'Không gian kính sang trọng, góc nhìn toàn cảnh phố thị',
      image: '/images/branch_downtown.jpg',
      presetSettings: { opacity: 0.45, blur: 7, glassBgOpacity: 0.22, glassBlur: 26 }
    },
    {
      id: 'night_chill',
      label: 'Góc Gaming & Thức Đêm Chill',
      desc: 'Tone màu ấm êm dịu, hoàn hảo cho cảm hứng học tập 24/24',
      image: '/images/blog_gaming_chill.jpg',
      presetSettings: { opacity: 0.40, blur: 6, glassBgOpacity: 0.26, glassBlur: 22 }
    },
    {
      id: 'rooftop_open',
      label: 'Rooftop Hoàng Hôn Lãng Mạn',
      desc: 'Ánh chiều tà ấm áp bao trùm toàn bộ không gian',
      image: '/images/branch_rooftop.jpg',
      presetSettings: { opacity: 0.42, blur: 6, glassBgOpacity: 0.24, glassBlur: 24 }
    }
  ];

  // Update field locally for silky-smooth slider response & live DOM preview
  const updateGlassBg = (field, val) => {
    const updated = {
      ...localGlassBg,
      [field]: val
    };
    setLocalGlassBg(updated);
    setSaveSuccess(false);
    // Cập nhật cấu hình lên trình duyệt máy tính ngay lập tức để nhìn thấy trực tiếp
    onSaveConfig({ ...config, glassBackground: updated });
  };

  const handleApplyPreset = (preset) => {
    const updated = {
      ...localGlassBg,
      image: preset.image,
      preset: preset.id,
      ...preset.presetSettings
    };
    setLocalGlassBg(updated);
    setSaveSuccess(false);
    onSaveConfig({ ...config, glassBackground: updated });
    triggerAlert(`Đã chọn mẫu hình nền: ${preset.label}! Bấm "Lưu Cấu Hình" để đồng bộ sang điện thoại.`);
  };

  // Upload ảnh lên Supabase Storage thay vì Base64 (tránh lỗi 413 Payload Too Large làm điện thoại không cập nhật)
  const handleUploadWallpaper = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File ảnh quá lớn (>10MB). Vui lòng chọn ảnh dung lượng nhỏ hơn.');
      return;
    }

    setIsUploading(true);
    try {
      const cloudUrl = await uploadImageToSupabase(file, 'glass_bg');
      if (cloudUrl) {
        updateGlassBg('image', cloudUrl);
        updateGlassBg('preset', 'custom');
        triggerAlert('✓ Đã tải ảnh lên đám mây thành công! Bấm "Lưu Cấu Hình" để đồng bộ sang điện thoại.');
      } else {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const dataUrl = loadEvt.target.result;
          updateGlassBg('image', dataUrl);
          updateGlassBg('preset', 'custom');
          triggerAlert('Đã tải ảnh lên trình duyệt. Vui lòng bấm "Lưu Cấu Hình"!');
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Lỗi khi tải ảnh nền:', err);
      alert('Lỗi tải ảnh: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Đồng bộ cấu hình lên Supabase Cloud (để điện thoại nhận được ngay)
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updatedConfig = { ...config, glassBackground: localGlassBg };
      onSaveConfig(updatedConfig);

      // Đẩy trực tiếp lên Supabase Cloud
      const cloudRes = await saveCloudSiteConfig(updatedConfig);
      if (cloudRes?.success !== false) {
        setSaveSuccess(true);
        triggerAlert('✓ ĐÃ ĐỒNG BỘ LÊN MÁY CHỦ THÀNH CÔNG! Mở điện thoại vuốt tải lại trang (F5) để thấy độ mờ mới.');
      } else {
        triggerAlert('⚠️ Đã lưu trên máy tính nhưng máy chủ báo lỗi: ' + (cloudRes?.error || 'Không rõ nguyên nhân'));
      }
    } catch (err) {
      console.error('Lỗi lưu cấu hình:', err);
      triggerAlert('⚠️ Lỗi: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục toàn bộ cài đặt hình nền và kính mờ về mặc định?')) {
      const def = DEFAULT_SITE_CONFIG.glassBackground;
      setLocalGlassBg(def);
      onSaveConfig({
        ...config,
        glassBackground: def
      });
      try {
        localStorage.removeItem('coffee2424_glass_bg_img');
      } catch {}
      triggerAlert('Đã khôi phục cài đặt hình nền kính mờ mặc định! Nhớ bấm "Lưu Cấu Hình" để đồng bộ sang điện thoại.');
    }
  };

  const glassBg = localGlassBg;

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER BANNER & ACTION BAR */}
      <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 text-xs font-black tracking-wider uppercase mb-2">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            <span>Hiệu Ứng Chiều Sâu Website</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2b170e] tracking-tight">
            Hình Nền & Hiệu Ứng Kính Mờ (Frosted Glass)
          </h2>
          <p className="text-xs sm:text-sm text-[#7a5843] font-medium mt-1">
            Thay đổi hình nền phía sau các lớp kính mờ, điều chỉnh độ mờ kính để người xem nhìn thấu rõ rệt hình nền phong cảnh phía sau.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200/80 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Khôi Phục Gốc</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 shadow-md transition-all cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-gradient-to-r from-[#2b170e] via-[#4a2818] to-[#2b170e] hover:brightness-110 text-white shadow-[#2b170e]/20'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Đang Đồng Bộ Lên Đám Mây...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Đã Đồng Bộ Lên Điện Thoại!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-400" />
                <span>LƯU CẤU HÌNH & ĐỒNG BỘ ĐIỆN THOẠI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE SYNC INSTRUCTION NOTICE */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-600/30 flex items-start gap-3.5 shadow-xs">
        <Smartphone className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
          <strong className="text-[#2b170e] font-black uppercase tracking-wide block">
            Tại sao chỉnh trên máy tính mà điện thoại chưa đổi ngay?
          </strong>
          <p className="mt-1">
            1. Máy tính và Điện thoại là 2 thiết bị độc lập. Sau khi kéo chỉnh độ mờ trên máy tính, bạn cần bấm nút <strong>"LƯU CẤU HÌNH & ĐỒNG BỘ ĐIỆN THOẠI"</strong> để gửi thông số mới lên máy chủ đám mây.
          </p>
          <p className="mt-1 flex items-center gap-1.5 flex-wrap">
            <span>2. Sau khi lưu, trên điện thoại hãy</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-[#2b170e] font-black border border-amber-600/30">
              <RefreshCw className="w-3 h-3 text-amber-600" />
              Vuốt màn hình từ trên xuống để tải lại (Pull to refresh)
            </span>
            <span>thì điện thoại sẽ cập nhật ngay lập tức!</span>
          </p>
        </div>
      </div>

      {/* LIVE INTERACTIVE GLASS SIMULATOR PREVIEW */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ede6dc] border border-white/90 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 z-20 relative">
          <span className="text-xs font-black uppercase tracking-wider text-[#8c5932] flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#8c5932]" />
            <span>Mô Phỏng Trực Tiếp Lớp Kính Mờ & Hình Nền (Live Glass View)</span>
          </span>
          <span className="text-[11px] font-bold text-stone-600 bg-white/80 px-2.5 py-1 rounded-full shadow-2xs">
            Kính trong suốt nhìn thấu ảnh nền phía sau
          </span>
        </div>

        {/* Outer Viewport Container with Background Wallpaper */}
        <div className="relative w-full h-80 sm:h-96 rounded-[32px] overflow-hidden flex items-center justify-center p-6 sm:p-10 border border-white/80 shadow-inner">
          
          {/* Background Wallpaper Layer */}
          {glassBg.enabled !== false && glassBg.image && (
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
                glassBg.animation === 'ken_burns' ? 'animate-pulse-subtle scale-105' : ''
              }`}
              style={{
                backgroundImage: `url(${glassBg.image})`,
                opacity: glassBg.opacity ?? 0.38,
                filter: `blur(${glassBg.blur ?? 6}px) brightness(${glassBg.brightness ?? 95}%) contrast(${glassBg.contrast ?? 105}%) saturate(${glassBg.saturate ?? 110}%)`,
                WebkitFilter: `blur(${glassBg.blur ?? 6}px) brightness(${glassBg.brightness ?? 95}%) contrast(${glassBg.contrast ?? 105}%) saturate(${glassBg.saturate ?? 110}%)`
              }}
            />
          )}

          {/* Tint Overlay */}
          <div 
            className="absolute inset-0 transition-all duration-300 pointer-events-none"
            style={{
              backgroundColor: glassBg.overlayColor || '#ede6dc',
              opacity: glassBg.overlayOpacity ?? 0.30
            }}
          />

          {/* Ambient Glowing Orbs */}
          {glassBg.showAmbientOrbs !== false && (
            <>
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-amber-500/40 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-orange-400/40 blur-2xl pointer-events-none" />
            </>
          )}

          {/* THE SIMULATED FROSTED GLASS CARD */}
          <div 
            className="relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl transition-all duration-300"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${glassBg.glassBgOpacity ?? 0.28})`,
              backdropFilter: `blur(${glassBg.glassBlur ?? 24}px) saturate(210%)`,
              WebkitBackdropFilter: `blur(${glassBg.glassBlur ?? 24}px) saturate(210%)`,
              border: `1px solid rgba(255, 255, 255, ${glassBg.glassBorderOpacity ?? 0.65})`,
              boxShadow: '0 20px 50px rgba(60, 35, 15, 0.12), inset 0 1.5px 2px rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md text-[#8c5932] text-xs font-black uppercase tracking-wider border border-white">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lớp Kính Mờ Thấu Nền</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2b170e] tracking-tight">
              COFFEE 24/24 · ENJOY YOUR LIFE
            </h3>
            <p className="text-xs sm:text-sm text-[#5a4233] font-medium leading-relaxed">
              Bạn có thể nhìn thấy hình nền phong cảnh hoặc hạt cà phê mờ ảo tuyệt đẹp phía sau tấm kính này!
            </p>
            <div className="pt-1 flex items-center justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-[#2b170e] text-white text-xs font-bold shadow-md">
                Độ Mờ Kính: {glassBg.glassBlur ?? 24}px
              </span>
              <span className="px-4 py-2 rounded-full bg-white/80 text-[#2b170e] text-xs font-bold shadow-xs border border-white">
                Độ Đục: {Math.round((glassBg.glassBgOpacity ?? 0.28) * 100)}%
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* QUICK PRESET BUTTONS (CHO CHỌN NHANH ĐỘ TRONG SUỐT) */}
      <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-[#7a5843]">
          Mẫu Kính Mờ Sẵn Có:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              updateGlassBg('glassBgOpacity', 0.16);
              updateGlassBg('glassBlur', 16);
              updateGlassBg('opacity', 0.50);
              triggerAlert('Đã bật chế độ Kính Siêu Trong Suốt (Thấy rõ nền nhất)! Nhớ bấm "Lưu Cấu Hình".');
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 text-xs font-bold border border-amber-600/30 cursor-pointer transition-colors"
          >
            ✨ Trong Suốt Thấy Rõ Nền Nhất (16% đục)
          </button>

          <button
            type="button"
            onClick={() => {
              updateGlassBg('glassBgOpacity', 0.28);
              updateGlassBg('glassBlur', 24);
              updateGlassBg('opacity', 0.38);
              triggerAlert('Đã áp dụng Kính Mờ Cân Bằng Chuẩn iOS!');
            }}
            className="px-3.5 py-2 rounded-xl bg-[#2b170e] hover:bg-[#180d08] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            💎 Kính Mờ Cân Bằng Chuẩn iOS (Mặc định)
          </button>

          <button
            type="button"
            onClick={() => {
              updateGlassBg('glassBgOpacity', 0.42);
              updateGlassBg('glassBlur', 32);
              updateGlassBg('opacity', 0.25);
              triggerAlert('Đã áp dụng Kính Mờ Sâu Sang Trọng!');
            }}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold cursor-pointer transition-colors"
          >
            🌫️ Kính Mờ Sâu Dày Dặn (42% đục)
          </button>
        </div>
      </div>

      {/* 2 MAIN SECTIONS: WALLPAPER SELECTION + GLASS ADJUSTMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: CHỌN HÌNH NỀN PHÍA SAU */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#2b170e] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#8c5932]" />
              <span>1. Chọn Hình Nền Phía Sau</span>
            </h3>
            <button
              type="button"
              onClick={() => updateGlassBg('enabled', glassBg.enabled === false)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                glassBg.enabled !== false ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-600'
              }`}
            >
              {glassBg.enabled !== false ? 'ĐANG BẬT NỀN' : 'TẮT NỀN'}
            </button>
          </div>

          {/* Upload or Custom URL */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-[#5c3d2e] block">Tải ảnh nền từ máy tính của bạn:</label>
                <span className="text-[11px] text-stone-500">Tự động tải lên Supabase Storage chuẩn nét cho điện thoại</span>
              </div>
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2b170e] hover:bg-[#180d08] text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{isUploading ? 'Đang Tải Lên...' : 'Tải Ảnh Lên'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  disabled={isUploading}
                  onChange={handleUploadWallpaper} 
                  className="hidden" 
                />
              </label>
            </div>
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-500 block">Hoặc dán đường link URL ảnh:</label>
              <input 
                type="text" 
                value={glassBg.image || ''} 
                onChange={(e) => updateGlassBg('image', e.target.value)}
                placeholder="/images/hero_banner.jpg hoặc https://..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-[#2b170e] focus:outline-none"
              />
            </div>
          </div>

          {/* Preset Wallpapers List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5c3d2e] block">Bộ sưu tập hình nền sắc nét tuyển chọn:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wallpaperPresets.map(preset => (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    glassBg.image === preset.image
                      ? 'border-[#2b170e] bg-amber-500/10 shadow-sm ring-2 ring-[#2b170e]/20'
                      : 'border-stone-200/80 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-stone-100 relative mb-2">
                    <img 
                      src={preset.image} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    {glassBg.image === preset.image && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#2b170e] text-white text-[10px] font-black uppercase">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2b170e] block group-hover:text-[#8c5932] transition-colors">
                      {preset.label}
                    </span>
                    <span className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {preset.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wallpaper Filters (Opacity, Blur, Brightness, Saturation) */}
          <div className="space-y-4 pt-3 border-t border-stone-200/80">
            <h4 className="text-xs font-black text-[#2b170e] uppercase tracking-wider">
              Căn Chỉnh Hình Nền Phía Sau:
            </h4>

            {/* Opacity */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#5c3d2e]">
                <span>Độ Rõ Của Ảnh Nền (Opacity):</span>
                <span className="font-mono text-[#8c5932]">{Math.round((glassBg.opacity ?? 0.38) * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.05" 
                max="1.0" 
                step="0.02"
                value={glassBg.opacity ?? 0.38}
                onChange={(e) => updateGlassBg('opacity', parseFloat(e.target.value))}
                className="w-full accent-[#8c5932] cursor-pointer"
              />
              <span className="text-[10px] text-stone-500 block">Kéo cao hơn để ảnh nền hiện rõ mồn một qua lớp kính</span>
            </div>

            {/* Wallpaper Blur */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#5c3d2e]">
                <span>Độ Nhòe Ảnh Nền (Blur):</span>
                <span className="font-mono text-[#8c5932]">{glassBg.blur ?? 6}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="24" 
                step="1"
                value={glassBg.blur ?? 6}
                onChange={(e) => updateGlassBg('blur', parseInt(e.target.value, 10))}
                className="w-full accent-[#8c5932] cursor-pointer"
              />
              <span className="text-[10px] text-stone-500 block">Kéo về 0px để ảnh nền sắc nét 100%, kéo cao để nhòe nghệ thuật</span>
            </div>

            {/* Brightness & Saturation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#5c3d2e]">
                  <span>Độ Sáng Ảnh:</span>
                  <span className="font-mono text-[#8c5932]">{glassBg.brightness ?? 95}%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="140" 
                  step="5"
                  value={glassBg.brightness ?? 95}
                  onChange={(e) => updateGlassBg('brightness', parseInt(e.target.value, 10))}
                  className="w-full accent-[#8c5932] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#5c3d2e]">
                  <span>Độ Tươi Màu:</span>
                  <span className="font-mono text-[#8c5932]">{glassBg.saturate ?? 110}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  step="5"
                  value={glassBg.saturate ?? 110}
                  onChange={(e) => updateGlassBg('saturate', parseInt(e.target.value, 10))}
                  className="w-full accent-[#8c5932] cursor-pointer"
                />
              </div>
            </div>

          </div>

        </div>

        {/* COLUMN 2: TÙY CHỈNH LỚP KÍNH MỜ (ĐỂ NHÌN THẤU NỀN) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-[#2b170e] uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#8c5932]" />
            <span>2. Tùy Chỉnh Lớp Kính Mờ (Độ Nhìn Thấu)</span>
          </h3>

          {/* 1. Glass White Opacity (Độ đục màu trắng của kính) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-600/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-[#2b170e]">
              <span>Độ Đục Màu Trắng Kính (Glass Opacity):</span>
              <span className="font-mono text-sm font-black text-[#8c5932]">
                {Math.round((glassBg.glassBgOpacity ?? 0.28) * 100)}%
              </span>
            </div>
            <input 
              type="range" 
              min="0.08" 
              max="0.60" 
              step="0.02"
              value={glassBg.glassBgOpacity ?? 0.28}
              onChange={(e) => updateGlassBg('glassBgOpacity', parseFloat(e.target.value))}
              className="w-full accent-[#8c5932] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-stone-600 font-semibold">
              <span>8% (Rất trong suốt, thấy rõ nền)</span>
              <span>60% (Kính đục dày đặc)</span>
            </div>
            <p className="text-[11px] text-amber-900 font-medium pt-1">
              💡 <strong>Mẹo:</strong> Kéo thanh trượt này về mức <strong>15% - 25%</strong> sẽ giúp tấm kính trở nên trong suốt lung linh, nhìn thấy rõ hình nền phía sau!
            </p>
          </div>

          {/* 2. Glass Backdrop Blur */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#5c3d2e]">
              <span>Độ Mờ Kính (Backdrop Blur):</span>
              <span className="font-mono text-[#8c5932]">{glassBg.glassBlur ?? 24}px</span>
            </div>
            <input 
              type="range" 
              min="4" 
              max="40" 
              step="2"
              value={glassBg.glassBlur ?? 24}
              onChange={(e) => updateGlassBg('glassBlur', parseInt(e.target.value, 10))}
              className="w-full accent-[#8c5932] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span>4px (Ít mờ, nét hơn)</span>
              <span>40px (Mờ mịn như sương mù)</span>
            </div>
          </div>

          {/* 3. Glass Border Opacity */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#5c3d2e]">
              <span>Độ Đậm Viền Kính Phản Quang:</span>
              <span className="font-mono text-[#8c5932]">{Math.round((glassBg.glassBorderOpacity ?? 0.65) * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.2" 
              max="1.0" 
              step="0.05"
              value={glassBg.glassBorderOpacity ?? 0.65}
              onChange={(e) => updateGlassBg('glassBorderOpacity', parseFloat(e.target.value))}
              className="w-full accent-[#8c5932] cursor-pointer"
            />
          </div>

          {/* 4. Ambient Orbs Toggle */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#2b170e] block">
                Đốm Sáng Gradient Chuyển Động (Ambient Orbs):
              </span>
              <span className="text-[11px] text-stone-500">
                Các quả cầu ánh sáng màu cà phê hổ phách bay lơ lửng hòa quyện cùng hình nền
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateGlassBg('showAmbientOrbs', glassBg.showAmbientOrbs === false)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                glassBg.showAmbientOrbs !== false ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-600'
              }`}
            >
              {glassBg.showAmbientOrbs !== false ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
            </button>
          </div>

          {/* 5. Wallpaper Motion Animation */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <label className="text-xs font-bold text-[#2b170e] block">
              Hiệu Ứng Chuyển Động Hình Nền:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateGlassBg('animation', 'none')}
                className={`py-2 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  glassBg.animation === 'none' || !glassBg.animation
                    ? 'bg-[#2b170e] text-white shadow-xs'
                    : 'bg-white border border-stone-300 text-stone-700'
                }`}
              >
                Tĩnh Yên Ả (Mặc định)
              </button>

              <button
                type="button"
                onClick={() => updateGlassBg('animation', 'ken_burns')}
                className={`py-2 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  glassBg.animation === 'ken_burns'
                    ? 'bg-[#2b170e] text-white shadow-xs'
                    : 'bg-white border border-stone-300 text-stone-700'
                }`}
              >
                Ken Burns (Phóng to chậm)
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM FLOATING SAVE BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/90 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#2b170e]">
              Đồng bộ hình nền & độ mờ sang điện thoại
            </h4>
            <p className="text-[11px] text-stone-500">
              Nhấn nút bên cạnh để áp dụng lên máy chủ đám mây Supabase Cloud.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-black tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
            saveSuccess
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              : 'bg-gradient-to-r from-[#2b170e] via-[#4a2818] to-[#2b170e] hover:brightness-110 text-white shadow-[#2b170e]/25'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Đang Đồng Bộ Lên Đám Mây...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Đã Đồng Bộ Lên Điện Thoại Thành Công!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-amber-400" />
              <span>LƯU CẤU HÌNH & ĐỒNG BỘ ĐIỆN THOẠI</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
