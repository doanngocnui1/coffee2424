import React, { useState, useRef } from 'react';
import { 
  Sliders, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  RefreshCw, 
  Eye, 
  Globe, 
  ExternalLink, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle, 
  Laptop, 
  Compass, 
  Coffee, 
  Shield, 
  Zap,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import { uploadImageToSupabase, isSupabaseConfigured } from '../../lib/supabase';
import { updateDocumentFavicon } from '../../data/siteConfig';

export default function AdminSystemSettingsManager({ config, onSaveConfig, triggerAlert }) {
  const fileInputRef = useRef(null);

  const [logo, setLogo] = useState(config.logo || '/images/logo.jpg');
  const [brandName, setBrandName] = useState(config.brandName || 'COFFEE 24/24');
  const [slogan, setSlogan] = useState(config.slogan || 'Enjoy Your Life');
  const [heroHeadline, setHeroHeadline] = useState(config.heroHeadline || 'CÀ PHÊ 24/24');
  const [heroSubheadline, setHeroSubheadline] = useState(config.heroSubheadline || 'Không gian mở cửa 24/7 xuyên đêm.');
  const [announcementBar, setAnnouncementBar] = useState(config.announcementBar || {
    enabled: false,
    text: '⚡ Thưởng thức bộ sưu tập cà phê mộc & specialty mới nhất tại Coffee 24/24!',
    linkPath: '/dathang'
  });

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Xử lý khi chọn file ảnh từ máy tính
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  const processImageFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một file hình ảnh (PNG, JPG, WEBP, SVG)!');
      return;
    }

    setUploading(true);
    setUploadStatus('Đang đọc file ảnh...');

    // 1. Tạo preview Base64 tức thì để hiển thị ngay không phải chờ đợi
    const reader = new FileReader();
    reader.onload = async (event) => {
      const previewUrl = event.target.result;
      setLogo(previewUrl);

      // Cập nhật favicon tạm thời trên tab để admin thấy kết quả ngay
      updateDocumentFavicon(previewUrl);

      // 2. Tải lên Supabase Storage nếu có cấu hình
      if (isSupabaseConfigured) {
        setUploadStatus('Đang tải lên Supabase Storage Cloud...');
        try {
          const cloudUrl = await uploadImageToSupabase(file, 'brand');
          if (cloudUrl) {
            setLogo(cloudUrl);
            updateDocumentFavicon(cloudUrl);
            setUploadStatus('✓ Đã tải lên Cloud Supabase thành công!');
          } else {
            setUploadStatus('✓ Đã lưu ảnh cục bộ (Base64)!');
          }
        } catch (err) {
          console.warn('Lỗi tải ảnh Supabase:', err);
          setUploadStatus('✓ Đã lưu ảnh cục bộ (Base64)!');
        }
      } else {
        setUploadStatus('✓ Đã nạp ảnh thành công!');
      }

      setUploading(false);
      setTimeout(() => setUploadStatus(null), 3500);
    };

    reader.readAsDataURL(file);
  };

  // Kéo thả file ảnh
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  // Khôi phục logo tròn mặc định
  const handleResetDefaultLogo = () => {
    const defaultLogoUrl = '/images/logo.jpg';
    setLogo(defaultLogoUrl);
    updateDocumentFavicon(defaultLogoUrl);
    setUploadStatus('✓ Đã khôi phục logo mặc định COFFEE 24/24');
    setTimeout(() => setUploadStatus(null), 3000);
  };

  // Lưu toàn bộ cài đặt hệ thống & logo
  const handleSave = (e) => {
    e?.preventDefault();

    const updatedConfig = {
      ...config,
      logo: logo || '/images/logo.jpg',
      favicon: logo || '/images/logo.jpg',
      brandName: brandName.trim() || 'COFFEE 24/24',
      slogan: slogan.trim() || 'Enjoy Your Life',
      heroHeadline: heroHeadline.trim(),
      heroSubheadline: heroSubheadline.trim(),
      announcementBar
    };

    if (typeof onSaveConfig === 'function') {
      onSaveConfig(updatedConfig);
    }

    updateDocumentFavicon(logo || '/images/logo.jpg');
    triggerAlert?.('✓ Đã lưu logo và cài đặt hệ thống thành công! Toàn bộ website đã được đồng bộ.');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16 font-sans">
      
      {/* 1. TOP HEADER BOX */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-950 p-6 sm:p-7 rounded-3xl border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Cài Đặt Hệ Thống & Logo Thương Hiệu
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                Tự Động Đồng Bộ
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Thay đổi logo sẽ lập tức đồng bộ đến 4 vị trí: Thanh cuộn đồng hành, Header, Tab trình duyệt và Chân trang.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => window.open('/', '_blank')}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            <span>Xem Website</span>
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black inline-flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>LƯU CÀI ĐẶT HỆ THỐNG</span>
          </button>
        </div>
      </div>

      {/* 2. KHỐI THAY LOGO & TẢI ẢNH LÊN */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-neutral-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Quản Lý Logo Thương Hiệu
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                  Logo Chính & Favicon
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Tải lên file ảnh Logo mới từ máy tính hoặc dán link ảnh trực tiếp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaultLogo}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-stone-300 hover:text-white border border-neutral-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              title="Khôi phục logo mặc định ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span>Dùng Logo Gốc Tròn</span>
            </button>
          </div>
        </div>

        {/* Khu vực xem trước hiện tại + Khu vực tải ảnh */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Logo hiện tại xem trước lớn */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center relative group">
            <div className="relative mb-3">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-amber-500/60 shadow-2xl bg-white p-1 flex items-center justify-center relative">
                <img 
                  src={logo || '/images/logo.jpg'} 
                  alt="Logo Preview" 
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-neutral-900 flex items-center justify-center text-white" title="Đang kích hoạt">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>

            <span className="text-sm font-black text-white block">Logo Đang Áp Dụng</span>
            <span className="text-[11px] text-amber-400 font-bold block mt-0.5 break-all max-w-full truncate">
              {logo.startsWith('data:') ? 'Ảnh Tải Lên (Bộ Nhớ Local)' : logo}
            </span>

            {uploadStatus && (
              <div className="mt-3 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          {/* Vùng Dropzone & Tải File */}
          <div className="lg:col-span-8 space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
                isDragOver 
                  ? 'border-amber-500 bg-amber-500/10 scale-[1.01]' 
                  : 'border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900 hover:border-amber-500/60'
              }`}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
              
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                {uploading ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                ) : (
                  <Upload className="w-6 h-6 stroke-[2.2]" />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {uploading ? 'Đang nạp file ảnh...' : 'Bấm vào đây để chọn ảnh Logo từ máy tính'}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Hoặc kéo thả file ảnh Logo vào khung này (Hỗ trợ PNG, JPG, WEBP, SVG tròn hoặc vuông)
                </p>
              </div>

              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-neutral-800 text-stone-300 border border-neutral-700">
                Tỉ lệ khuyên dùng: 1:1 (Hình vuông hoặc hình tròn)
              </span>
            </div>

            {/* Hoặc dán đường dẫn URL trực tiếp */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 block">
                Hoặc dán trực tiếp đường dẫn URL của ảnh Logo:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setLogo(newUrl);
                    updateDocumentFavicon(newUrl);
                  }}
                  placeholder="https://... hoặc /images/logo.jpg"
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleResetDefaultLogo()}
                  className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-stone-300 border border-neutral-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  Mặc Định
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TRỰC QUAN ĐỒNG BỘ 4 VỊ TRÍ TRÊN WEBSITE (LIVE PREVIEWS) */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Xem Trước Trực Quan Đồng Bộ 4 Vị Trí
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Logo mới sẽ tự động hiển thị ăn khớp hoàn hảo tại tất cả các vị trí sau trên giao diện khách:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* MOCKUP 1: THANH CUỘN ĐỒNG HÀNH (SCROLL COMPANION) */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Vị Trí 1: Thanh Cuộn Đồng Hành (Ảnh 1)
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">Trang Chủ Desktop</span>
            </div>

            <p className="text-xs text-neutral-400">
              Nút tròn ở đầu thanh tiến trình cuộn trang lơ lửng bên phải màn hình:
            </p>

            {/* Khung mô phỏng */}
            <div className="h-36 rounded-xl bg-[#ede6dc] p-3 flex items-center justify-center relative border border-white/40 shadow-inner">
              <div className="flex flex-col items-center gap-2 p-2 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-lg">
                <div className="w-9 h-9 rounded-full bg-[#2b170e] flex items-center justify-center p-0.5 shadow-md relative overflow-hidden">
                  <img src={logo || '/images/logo.jpg'} alt="Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-[9px] font-black text-[#8c5932]">35%</span>
                <div className="w-1.5 h-6 bg-stone-300 rounded-full overflow-hidden">
                  <div className="w-full h-1/2 bg-amber-600 rounded-full" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#2b170e]" />
              </div>
            </div>
          </div>

          {/* MOCKUP 2: THANH HEADER VIÊN NĂNG (CAPSULE HEADER) */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Vị Trí 2: Thanh Header Viên Nang (Ảnh 2)
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">Đầu Tất Cả Các Trang</span>
            </div>

            <p className="text-xs text-neutral-400">
              Logo tròn 40px đặt cạnh tên thương hiệu và slogan trên thanh menu:
            </p>

            {/* Khung mô phỏng Header */}
            <div className="h-36 rounded-xl bg-[#2b170e] p-3 flex items-center justify-center relative border border-white/10 shadow-inner">
              <div className="w-full max-w-sm rounded-full bg-white/90 backdrop-blur-xl border border-white px-4 py-2 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#2b170e] flex items-center justify-center p-0.5 shadow-md shrink-0 overflow-hidden ring-1 ring-black/10">
                    <img src={logo || '/images/logo.jpg'} alt="Logo" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#2b170e] uppercase leading-tight">
                      {brandName}
                    </span>
                    <span className="text-[10px] text-[#704f38] font-bold leading-tight">
                      {slogan}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-[#2b170e]">
                  <span className="px-2 py-0.5 rounded-full bg-white font-black shadow-xs">Menu</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#2b170e] text-white">Đặt Món</span>
                </div>
              </div>
            </div>
          </div>

          {/* MOCKUP 3: TAB TRÌNH DUYỆT (BROWSER TAB FAVICON) */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Vị Trí 3: Tab Trình Duyệt / Favicon (Ảnh 3)
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">Thẻ &lt;link rel="icon"&gt;</span>
            </div>

            <p className="text-xs text-neutral-400">
              Biểu tượng thu nhỏ hiển thị cạnh tiêu đề trên tab trình duyệt Chrome/Edge/Safari:
            </p>

            {/* Khung mô phỏng Tab Trình Duyệt */}
            <div className="h-36 rounded-xl bg-slate-900 p-3 flex flex-col justify-center border border-white/10 shadow-inner">
              <div className="bg-slate-800/90 rounded-t-xl px-3 py-2 flex items-center gap-2 border-b border-slate-700 max-w-xs shadow-md">
                <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 bg-white shadow-xs">
                  <img src={logo || '/images/logo.jpg'} alt="Favicon" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-xs font-bold text-slate-200 truncate flex-1">
                  {brandName} | {slogan}
                </span>
                <span className="text-slate-400 text-xs">×</span>
              </div>
              <div className="bg-slate-850 px-3 py-1.5 rounded-b-xl flex items-center gap-2 border border-slate-700/60 max-w-xs">
                <span className="text-[10px] text-slate-400 truncate font-mono">
                  https://coffee2424.com
                </span>
              </div>
            </div>
          </div>

          {/* MOCKUP 4: CHÂN TRANG FOOTER (FOOTER BRAND CARD) */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Vị Trí 4: Chân Trang Website (Ảnh 4)
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">Cuối Tất Cả Các Trang</span>
            </div>

            <p className="text-xs text-neutral-400">
              Logo tròn 48px kèm chấm xanh "Mở cửa 24/7" ở góc chân trang Footer:
            </p>

            {/* Khung mô phỏng Footer */}
            <div className="h-36 rounded-xl bg-[#ede6dc] p-3 flex items-center justify-center border border-white/40 shadow-inner">
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md p-3 rounded-2xl border border-white shadow-md max-w-xs w-full">
                <div className="relative shrink-0">
                  <img 
                    src={logo || '/images/logo.jpg'} 
                    alt="Footer Logo" 
                    className="w-11 h-11 rounded-full border-2 border-amber-500/40 object-cover bg-white shadow-sm"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="truncate">
                  <span className="text-sm font-black text-[#2b170e] uppercase block leading-tight truncate">
                    {brandName}
                  </span>
                  <span className="text-[10px] text-[#8c5932] font-black uppercase tracking-wider block mt-0.5 truncate">
                    {slogan}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. CÀI ĐẶT THÔNG TIN THƯƠNG HIỆU & KHẨU HIỆU */}
      <form onSubmit={handleSave} className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Thông Tin Thương Hiệu & Khẩu Hiệu Website</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Điều chỉnh tên thương hiệu, khẩu hiệu, tiêu đề trang chủ và thanh thông báo chạy trên cùng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1.5">Tên Thương Hiệu (Brand Name)</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white font-black focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1.5">Slogan Thương Hiệu (Khẩu Hiệu)</label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1.5">Tiêu Đề Banner Trang Chủ (Hero Headline)</label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1.5">Mô Tả Ngắn Trang Chủ</label>
            <textarea
              rows={2}
              value={heroSubheadline}
              onChange={(e) => setHeroSubheadline(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Thanh Thông Báo Trên Cùng (Top Announcement Bar)
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={announcementBar?.enabled}
                onChange={(e) => setAnnouncementBar({ ...announcementBar, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
          
          <input
            type="text"
            value={announcementBar?.text || ''}
            onChange={(e) => setAnnouncementBar({ ...announcementBar, text: e.target.value })}
            placeholder="Nội dung thông báo / ưu đãi hiển thị chạy trên đỉnh website..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        {/* Nút lưu chính */}
        <div className="pt-2 flex items-center justify-end gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Đã lưu thành công!
            </span>
          )}

          <button
            type="submit"
            className="px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-xl cursor-pointer active:scale-95 transition-all"
          >
            <Save className="w-4 h-4 stroke-[3]" />
            <span>LƯU CÀI ĐẶT HỆ THỐNG & LOGO</span>
          </button>
        </div>
      </form>

    </div>
  );
}
