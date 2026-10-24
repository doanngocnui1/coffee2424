import React, { useState, useEffect } from 'react';
import { 
  Armchair, 
  Sparkles, 
  Zap, 
  Compass, 
  Sun, 
  Volume2, 
  Wind, 
  Wifi, 
  Coffee, 
  Upload, 
  Trash2, 
  Plus, 
  RotateCcw, 
  Save, 
  Eye, 
  Image as ImageIcon,
  Check,
  Loader2
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG, saveSiteConfig } from '../../data/siteConfig';
import { uploadImageToSupabase, isSupabaseConfigured, saveCloudSiteConfig } from '../../lib/supabase';

export const CHIP_ICONS = {
  zap: Zap,
  compass: Compass,
  sun: Sun,
  volume2: Volume2,
  wind: Wind,
  armchair: Armchair,
  wifi: Wifi,
  coffee: Coffee
};

export default function AdminSpaceAmenitiesManager({ config, onSaveConfig, triggerAlert }) {
  const defaultSpaceConfig = DEFAULT_SITE_CONFIG.spaceAmenities || {
    enabled: true,
    title: 'Không Gian Lý Tưởng Cho',
    highlightTitle: 'Học Tập & Làm Việc',
    quote: 'Với không gian rộng rãi, ánh sáng dịu nhẹ, âm thanh yên tĩnh, nhiệt độ phòng mát mẻ, và hệ thống ổ điện được trang bị ở tất cả các vị trí có bàn ghế, đảm bảo không gian làm việc và học tập thuận tiện cho khách hàng.',
    chips: [
      { id: 'chip-1', title: 'Ổ Điện 100% Bàn Ghế', icon: 'zap', color: 'amber' },
      { id: 'chip-2', title: 'Không Gian Rộng Rãi', icon: 'compass', color: 'emerald' },
      { id: 'chip-3', title: 'Ánh Sáng Dịu Nhẹ', icon: 'sun', color: 'orange' },
      { id: 'chip-4', title: 'Âm Thanh Yên Tĩnh', icon: 'volume2', color: 'indigo' },
      { id: 'chip-5', title: 'Nhiệt Độ Mát Mẻ', icon: 'wind', color: 'teal' }
    ],
    photos: [
      { id: 'photo-1', title: 'Bàn Dài Học Nhóm 8-12 Bạn', image: '/images/branch_downtown.jpg' },
      { id: 'photo-2', title: 'Góc Chạy Deadline Yên Tĩnh', image: '/images/blog_workspace.jpg' },
      { id: 'photo-3', title: 'Ánh Sáng Chuẩn Công Thái Học', image: '/images/blog_student_study.jpg' },
      { id: 'photo-4', title: 'Sofa Thư Giãn & Xả Stress', image: '/images/blog_gaming_chill.jpg' }
    ]
  };

  const [spaceData, setSpaceData] = useState(() => {
    const baseConfig = config?.spaceAmenities || defaultSpaceConfig;
    const basePhotos = baseConfig.photos || defaultSpaceConfig.photos || [];
    const restoredPhotos = basePhotos.map((p, idx) => {
      const storedImg = localStorage.getItem(`coffee2424_space_photo_${idx}`);
      const storedTitle = localStorage.getItem(`coffee2424_space_title_${idx}`);
      return {
        ...p,
        title: storedTitle || p.title,
        image: storedImg || p.image
      };
    });
    return {
      ...baseConfig,
      photos: restoredPhotos
    };
  });

  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (config?.spaceAmenities) {
      const basePhotos = config.spaceAmenities.photos || defaultSpaceConfig.photos || [];
      const restoredPhotos = basePhotos.map((p, idx) => {
        const storedImg = localStorage.getItem(`coffee2424_space_photo_${idx}`);
        const storedTitle = localStorage.getItem(`coffee2424_space_title_${idx}`);
        return {
          ...p,
          title: storedTitle || p.title,
          image: storedImg || p.image
        };
      });
      setSpaceData({
        ...config.spaceAmenities,
        photos: restoredPhotos
      });
    }
  }, [config]);

  // Update text fields
  const handleUpdateText = (field, val) => {
    setSpaceData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  // Update chip field
  const handleUpdateChip = (index, field, val) => {
    setSpaceData(prev => {
      const chips = [...(prev.chips || [])];
      if (chips[index]) {
        chips[index] = { ...chips[index], [field]: val };
      }
      return { ...prev, chips };
    });
  };

  // Update photo field
  const handleUpdatePhoto = (index, field, val) => {
    setSpaceData(prev => {
      const photos = [...(prev.photos || [])];
      if (photos[index]) {
        photos[index] = { ...photos[index], [field]: val };
      }
      return { ...prev, photos };
    });
  };

  // Upload photo from device with auto compression (16:9 aspect, max 800x450, JPEG 0.85)
  // và tải trực tiếp lên Supabase Storage bucket 'coffee2424-media' thư mục 'spaces'
  const handleUploadPhoto = async (index, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WEBP)!');
      return;
    }

    setUploadingIndex(index);
    triggerAlert?.(`⏳ Đang tối ưu và tải ảnh góc quán #${index + 1} lên Supabase Storage...`);

    // 1. Center-crop 16:9 & nén ảnh bằng canvas (max 800x450, JPEG 0.85)
    let compressedBlob = null;
    let localDataUrl = null;

    try {
      const result = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const rawDataUrl = e.target?.result;
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 450;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              resolve({ blob: file, dataUrl: rawDataUrl });
              return;
            }

            const targetRatio = 800 / 450;
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

            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 800, 450);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

            canvas.toBlob((blob) => {
              resolve({ blob: blob || file, dataUrl });
            }, 'image/jpeg', 0.85);
          };
          img.onerror = () => resolve({ blob: file, dataUrl: rawDataUrl });
          img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
      });

      compressedBlob = result.blob;
      localDataUrl = result.dataUrl;

      // 2. Tải trực tiếp lên Supabase Storage bucket 'coffee2424-media' thư mục 'spaces'
      const uploadTarget = compressedBlob || file;
      const cloudUrl = await uploadImageToSupabase(uploadTarget, 'spaces');

      if (cloudUrl) {
        handleUpdatePhoto(index, 'image', cloudUrl);
        try {
          localStorage.setItem(`coffee2424_space_photo_${index}`, cloudUrl);
        } catch (_) {}
        triggerAlert?.(`✓ Đã tải ảnh góc quán #${index + 1} lên Supabase Storage thành công! Bấm "LƯU CẤU HÌNH" để áp dụng cho mọi thiết bị.`);
        setUploadingIndex(null);
        return;
      }
    } catch (err) {
      console.warn('Lỗi khi tải ảnh lên Supabase Storage:', err);
    }

    // 3. Dự phòng nếu tải lên Supabase Storage gặp lỗi
    if (localDataUrl) {
      handleUpdatePhoto(index, 'image', localDataUrl);
      try {
        localStorage.setItem(`coffee2424_space_photo_${index}`, localDataUrl);
      } catch (_) {}
      triggerAlert?.(`⚠️ Đã lưu ảnh cục bộ trên máy. Không thể tải lên Supabase Storage (vui lòng kiểm tra quyền Storage hoặc kết nối mạng).`);
    }
    setUploadingIndex(null);
  };

  // Save changes
  const handleSaveAll = async () => {
    setIsSaving(true);
    triggerAlert?.('⏳ Đang lưu cấu hình và đồng bộ lên Supabase Cloud...');

    // 1. Kiểm tra nếu còn ảnh nào là base64 thì cố gắng tải lên Supabase Storage trước khi lưu
    const currentPhotos = [...(spaceData.photos || [])];
    for (let i = 0; i < currentPhotos.length; i++) {
      const p = currentPhotos[i];
      if (p.image && p.image.startsWith('data:image')) {
        try {
          const res = await fetch(p.image);
          const blob = await res.blob();
          const cloudUrl = await uploadImageToSupabase(blob, 'spaces');
          if (cloudUrl) {
            currentPhotos[i] = { ...p, image: cloudUrl };
          }
        } catch (uploadErr) {
          console.warn(`Lỗi upload ảnh #${i + 1} từ base64 lên Supabase:`, uploadErr);
        }
      }
    }

    const finalSpaceData = {
      ...spaceData,
      photos: currentPhotos
    };
    setSpaceData(finalSpaceData);

    // 2. Lưu trực tiếp các URL và tiêu đề vào bộ nhớ local
    currentPhotos.forEach((photo, idx) => {
      if (photo.image) {
        try {
          localStorage.setItem(`coffee2424_space_photo_${idx}`, photo.image);
        } catch (e) {
          console.warn(`Could not save photo ${idx} into dedicated key:`, e);
        }
      }
      if (photo.title) {
        try {
          localStorage.setItem(`coffee2424_space_title_${idx}`, photo.title);
        } catch (_) {}
      }
    });

    try {
      localStorage.setItem('coffee2424_space_amenities_backup', JSON.stringify(finalSpaceData));
    } catch (_) {}

    const updatedConfig = {
      ...config,
      spaceAmenities: finalSpaceData
    };

    saveSiteConfig(updatedConfig);
    onSaveConfig?.(updatedConfig);
    window.dispatchEvent(new Event('site-config-updated'));

    // 3. Đồng bộ trực tiếp lên Supabase Cloud database
    const cloudRes = await saveCloudSiteConfig(updatedConfig);
    setIsSaving(false);

    if (cloudRes && cloudRes.success) {
      triggerAlert?.('✓ ĐÃ ĐỒNG BỘ LÊN SUPABASE CLOUD THÀNH CÔNG! Điện thoại và máy tính khác đã cập nhật ngay.');
    } else {
      const errDetail = cloudRes?.error || 'Lỗi kết nối';
      console.warn('Lỗi lưu Supabase Cloud:', errDetail);
      if (errDetail.includes('violates row-level security policy') || errDetail.includes('42501')) {
        alert('⚠️ Chưa thể đồng bộ lên Cloud Supabase do phiên đăng nhập quản trị bị chặn quyền (RLS).\n\nVui lòng vào Supabase Dashboard -> SQL Editor và chạy câu lệnh cấp quyền:\n\nCREATE POLICY "Public manage site_config" ON public.site_config FOR ALL USING (true) WITH CHECK (true);\nCREATE POLICY "Public media upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = \'coffee2424-media\');');
      } else {
        triggerAlert?.(`⚠️ Đã lưu trên máy này. Lưu Cloud: ${errDetail}`);
      }
    }
  };

  // Reset defaults
  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục lại nội dung và 4 ảnh không gian mặc định ban đầu?')) {
      for (let i = 0; i < 4; i++) {
        localStorage.removeItem(`coffee2424_space_photo_${i}`);
        localStorage.removeItem(`coffee2424_space_title_${i}`);
      }
      localStorage.removeItem('coffee2424_space_amenities_backup');
      setSpaceData(defaultSpaceConfig);
      const updatedConfig = {
        ...config,
        spaceAmenities: defaultSpaceConfig
      };
      saveSiteConfig(updatedConfig);
      onSaveConfig?.(updatedConfig);
      window.dispatchEvent(new Event('site-config-updated'));
      triggerAlert?.('✓ Đã khôi phục dữ liệu ban đầu và lưu áp dụng.');
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-lg shadow-amber-500/20">
              <Armchair className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Quản Lý Không Gian & Tiện Nghi 24/7
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Mục 3 Trang Chủ
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Chỉnh sửa tiêu đề, đoạn văn cam kết trải nghiệm, 5 tiện ích ổ điện/ánh sáng và 4 ảnh chụp góc quán thực tế.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center gap-1.5 border border-neutral-800 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Mặc Định</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ĐANG ĐỒNG BỘ CLOUD...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>LƯU CẤU HÌNH</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Tiêu Đề & Đoạn Văn Cam Kết */}
      <div className="p-5 sm:p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Nội Dung Chữ & Đoạn Trích Dẫn Cam Kết
            </h3>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs font-bold text-neutral-300">Bật hiển thị khối này trên Trang Chủ:</span>
            <input
              type="checkbox"
              checked={spaceData.enabled !== false}
              onChange={(e) => handleUpdateText('enabled', e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">Tiêu đề dòng 1</label>
            <input
              type="text"
              value={spaceData.title || ''}
              onChange={(e) => handleUpdateText('title', e.target.value)}
              placeholder="Không Gian Lý Tưởng Cho"
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">Tiêu đề nổi bật dòng 2</label>
            <input
              type="text"
              value={spaceData.highlightTitle || ''}
              onChange={(e) => handleUpdateText('highlightTitle', e.target.value)}
              placeholder="Học Tập & Làm Việc"
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-bold focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1">
            Đoạn văn trích dẫn cam kết (Hiển thị trong khung kính mờ)
          </label>
          <textarea
            rows={3}
            value={spaceData.quote || ''}
            onChange={(e) => handleUpdateText('quote', e.target.value)}
            placeholder="Với không gian rộng rãi, ánh sáng dịu nhẹ, âm thanh yên tĩnh, nhiệt độ phòng mát mẻ..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs leading-relaxed focus:border-amber-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* 3. 5 Tiện Ích Nổi Bật (Chips) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800/80">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            5 Tiện Nghi Nổi Bật (Thanh 5 Huy Hiệu)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {(spaceData.chips || []).map((chip, idx) => {
            const IconComponent = CHIP_ICONS[chip.icon] || Zap;
            return (
              <div key={chip.id || idx} className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    Tiện ích #{idx + 1}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 block mb-1">Tên tiện ích</label>
                  <input
                    type="text"
                    value={chip.title || ''}
                    onChange={(e) => handleUpdateChip(idx, 'title', e.target.value)}
                    placeholder="Tên tiện ích..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 block mb-1">Biểu tượng (Icon)</label>
                  <select
                    value={chip.icon || 'zap'}
                    onChange={(e) => handleUpdateChip(idx, 'icon', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="zap">⚡ Ổ Điện (Zap)</option>
                    <option value="compass">🧭 Không Gian (Compass)</option>
                    <option value="sun">☀️ Ánh Sáng (Sun)</option>
                    <option value="volume2">🔊 Âm Thanh (Volume)</option>
                    <option value="wind">💨 Nhiệt Độ (Wind)</option>
                    <option value="armchair">🛋️ Ghế Êm (Armchair)</option>
                    <option value="wifi">📶 Wifi Cáp Quang (Wifi)</option>
                    <option value="coffee">☕ Cà Phê (Coffee)</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quản Lý 4 Bức Ảnh Không Gian Góc Quán */}
      <div className="p-5 sm:p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800/80">
          <ImageIcon className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            4 Bức Ảnh Không Gian & Góc Quán Thực Tế
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(spaceData.photos || []).map((photo, idx) => (
            <div key={photo.id || idx} className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  Góc ảnh #{idx + 1}
                </span>
                {photo.image?.includes('supabase.co') ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    ✓ Đã Lưu Cloud
                  </span>
                ) : photo.image?.startsWith('data:image') ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                    Ảnh Cục Bộ
                  </span>
                ) : null}
              </div>

              {/* Photo Preview Box */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-inner group">
                <img
                  src={photo.image || '/images/branch_downtown.jpg'}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {uploadingIndex === idx && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
                    <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                    <span className="text-[11px] font-bold text-white">Đang tải lên Supabase...</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-bold text-white truncate w-full">
                    {photo.title || `Góc #${idx + 1}`}
                  </span>
                </div>
              </div>

              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  id={`space-photo-input-${idx}`}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUploadPhoto(idx, e.target.files[0]);
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={uploadingIndex === idx}
                  onClick={() => document.getElementById(`space-photo-input-${idx}`)?.click()}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                >
                  {uploadingIndex === idx ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang Tải Lên...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Đổi Ảnh Từ Máy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Caption Title */}
              <div>
                <label className="text-[10px] font-bold text-neutral-400 block mb-1">Tên chú thích ảnh</label>
                <input
                  type="text"
                  value={photo.title || ''}
                  onChange={(e) => handleUpdatePhoto(idx, 'title', e.target.value)}
                  placeholder="VD: Bàn Dài Học Nhóm..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Direct Image URL */}
              <div>
                <label className="text-[10px] font-bold text-neutral-400 block mb-1">Đường dẫn ảnh (URL)</label>
                <input
                  type="text"
                  value={photo.image || ''}
                  onChange={(e) => handleUpdatePhoto(idx, 'image', e.target.value)}
                  placeholder="/images/... hoặc link https://..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 text-[11px] font-mono truncate focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Live Preview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Xem Trước Đồng Bộ Trên Website (Live Preview)
            </h3>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            Khớp Tuyệt Đối Với Trang Chủ
          </span>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-[#f5ede3] border border-white/60 shadow-inner">
          <div className="rounded-[36px] p-6 sm:p-8 bg-white/75 backdrop-blur-xl border border-white/90 shadow-md space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-[#2b170e] uppercase">
                {spaceData.title} <span className="text-[#8c5932]">{spaceData.highlightTitle}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#3d2417] font-medium leading-relaxed p-4 rounded-2xl bg-white/80 border border-white italic">
                “{spaceData.quote}”
              </p>
            </div>

            {/* Chips Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-4xl mx-auto">
              {(spaceData.chips || []).map((chip, idx) => {
                const IconComponent = CHIP_ICONS[chip.icon] || Zap;
                return (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-white shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#2b170e] truncate">{chip.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Photos Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {(spaceData.photos || []).map((photo, idx) => (
                <div key={idx} className="h-28 sm:h-32 rounded-2xl overflow-hidden relative shadow-xs">
                  <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white truncate">{photo.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Bottom Save Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm flex items-center gap-2 shadow-2xl cursor-pointer active:scale-95 transition-all"
        >
          <Save className="w-5 h-5 stroke-[2.5]" />
          <span>LƯU CẤU HÌNH KHÔNG GIAN & TIỆN NGHI</span>
        </button>
      </div>
    </div>
  );
}
