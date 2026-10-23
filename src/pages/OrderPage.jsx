import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  ShoppingBag, 
  CheckCircle2, 
  ExternalLink, 
  QrCode, 
  Sparkles,
  Coffee,
  X,
  PhoneCall,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Store,
  Wifi,
  Zap,
  Flame,
  Check
} from 'lucide-react';
import { getBranches } from '../data/branches';
import { getSiteConfig } from '../data/siteConfig';

export default function OrderPage({ selectedBranch, setSelectedBranch }) {
  const [branches, setBranches] = useState(getBranches);
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);
  const [qrModalBranch, setQrModalBranch] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState('Tất cả');

  // Lắng nghe sự kiện đồng bộ branches và siteConfig
  useEffect(() => {
    const handleBranchesUpdate = () => setBranches(getBranches());
    const handleConfigUpdate = () => setSiteConfig(getSiteConfig());

    window.addEventListener('branches-updated', handleBranchesUpdate);
    window.addEventListener('site-config-updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);

    return () => {
      window.removeEventListener('branches-updated', handleBranchesUpdate);
      window.removeEventListener('site-config-updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  // Khóa cuộn body và lắng nghe phím ESC để đóng modal QR
  useEffect(() => {
    if (!qrModalBranch) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setQrModalBranch(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [qrModalBranch]);

  const orderOnline = siteConfig.orderOnline || {};
  const mainOrderUrl = orderOnline.url || 'https://coffee2424.web-store.online';
  const openMode = orderOnline.openMode || 'new_tab';

  const handleOpenStore = (customUrl) => {
    const targetUrl = customUrl || mainOrderUrl;
    if (openMode === 'same_tab') {
      window.location.href = targetUrl;
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const districts = ['Tất cả', 'Gò Vấp / An Hội Tây', 'Bình Thạnh / Thạnh Mỹ Tây'];

  const filteredBranches = branches.filter(branch => {
    return activeDistrict === 'Tất cả' || branch.district === activeDistrict;
  });

  return (
    <div className="text-[#2b170e] pb-28 font-sans">
      
      {/* 1. HERO HEADER BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <section className="relative overflow-hidden rounded-[36px] sm:rounded-[48px] bg-gradient-to-br from-white/80 via-white/60 to-amber-500/10 backdrop-blur-3xl border border-white/90 p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(60,35,15,0.08)]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Hệ Thống Đặt Món Trực Tuyến KiotViet</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase">
            Đặt Món <span className="text-[#8c5932]">COFFEE 24/24</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5c3d2e] max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
            Thực đơn món ăn, thức uống và chương trình ưu đãi được đồng bộ trực tiếp từ hệ thống <strong>KiotViet</strong> để phục vụ quý khách nhanh chóng và chính xác nhất.
          </p>

          {/* MAIN BIG ACTION BUTTON */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleOpenStore(mainOrderUrl)}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#2b170e] via-[#4a2818] to-[#2b170e] text-white font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-3 shadow-[0_12px_30px_rgba(43,23,14,0.35)] hover:shadow-[0_16px_36px_rgba(43,23,14,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>MỞ WEB ĐẶT HÀNG KIOTVIET</span>
              <ExternalLink className="w-4 h-4 text-amber-300" />
            </button>
            <div className="text-xs text-[#7a5843] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>coffee2424.web-store.online</span>
            </div>
          </div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        
        {/* 2. CHỌN CHI NHÁNH ĐỂ ĐẶT MÓN */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#dfd4c7]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2b170e] flex items-center gap-2">
                <Store className="w-5 h-5 text-[#8c5932]" />
                <span>Chọn Menu Theo Chi Nhánh (2 Cơ Sở Phục Vụ 24/7)</span>
              </h2>
              <p className="text-sm text-[#5c3d2e] mt-1 font-medium">
                Quý khách có thể chọn đặt trực tiếp tại chi nhánh gần nhất để tối ưu thời gian giao hàng.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {districts.map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDistrict(d)}
                  className={`text-xs sm:text-sm px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                    activeDistrict === d
                      ? 'bg-[#2b170e] text-white font-black shadow-md'
                      : 'bg-white/70 text-[#5c3d2e] hover:bg-white border border-white/90 shadow-xs'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Branches Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBranches.map((branch) => {
              const branchKiotUrl = branch.menuUrl || (
                branch.id === 'cn-413phi' || branch.code === '413PHI'
                  ? (orderOnline.branch413PhiUrl || 'https://coffee2424.web-store.online/menu/363688')
                  : branch.id === 'cn-96d5' || branch.code === '96D5'
                  ? (orderOnline.branch96D5Url || 'https://coffee2424.web-store.online/menu/363827')
                  : (orderOnline.url || 'https://coffee2424.web-store.online')
              );

              return (
                <div
                  key={branch.id}
                  className="bg-white/70 backdrop-blur-2xl rounded-[32px] overflow-hidden border border-white/80 transition-all duration-300 flex flex-col justify-between shadow-[0_12px_36px_rgba(60,35,15,0.06)] hover:shadow-[0_20px_45px_rgba(60,35,15,0.15)] group"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative h-64 overflow-hidden bg-stone-100">
                      <img 
                        src={branch.image} 
                        alt={branch.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2 z-10">
                        <span className="px-3 py-1 rounded-full bg-[#2b170e] text-amber-200 border border-white/20 font-black text-xs shadow-md">
                          Mã: {branch.code}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>Mở cửa 24/7</span>
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      <div className="absolute bottom-4 left-5 right-5">
                        <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                          {branch.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-200 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{branch.address}</span>
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-3.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-[#2b170e] font-bold">
                          <PhoneCall className="w-4 h-4 text-[#8c5932]" />
                          <span>Hotline:</span>
                          <a href={`tel:${branch.hotline}`} className="text-[#8c5932] font-black hover:underline font-mono">
                            {branch.hotline}
                          </a>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30">
                          {branch.district}
                        </span>
                      </div>

                      {branch.features && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {branch.features.map((f, i) => (
                            <span key={i} className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/80 text-[#5c3d2e] border border-stone-200/60 shadow-2xs">
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => handleOpenStore(branchKiotUrl)}
                      className="flex-1 py-3 px-5 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                      <span>Đặt Món Chi Nhánh {branch.code}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                    </button>

                    <button
                      onClick={() => setQrModalBranch(branch)}
                      className="py-3 px-4 rounded-full bg-white/90 hover:bg-white text-[#2b170e] font-bold text-xs sm:text-sm border border-stone-200 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Quét mã QR đặt món qua điện thoại"
                    >
                      <QrCode className="w-4 h-4 text-[#8c5932]" />
                      <span className="hidden sm:inline">Mã QR</span>
                    </button>

                    {branch.mapUrl && (
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-full bg-white/90 hover:bg-white text-[#8c5932] border border-stone-200 shadow-xs flex items-center justify-center transition-colors"
                        title="Chỉ đường trên Google Maps"
                      >
                        <Navigation className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. QUY TRÌNH ĐẶT MÓN ĐƠN GIẢN 3 BƯỚC */}
        <section className="bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 space-y-6 shadow-[0_15px_40px_rgba(60,35,15,0.06)]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-[#8c5932] tracking-wider uppercase">
              HƯỚNG DẪN GỌI MÓN
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2b170e]">
              Quy Trình Đặt Món Nhanh Chóng 24/7
            </h3>
            <p className="text-xs sm:text-sm text-[#5c3d2e]">
              Chỉ 3 bước đơn giản để thưởng thức ly cà phê đậm đà và đồ ăn nóng sốt xuyên đêm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-3xl bg-white/80 border border-white/95 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 font-black text-lg flex items-center justify-center mx-auto">
                01
              </div>
              <h4 className="font-black text-base text-[#2b170e]">Mở Web Bán Hàng KiotViet</h4>
              <p className="text-xs text-[#7a5843] leading-relaxed">
                Nhấn nút đặt món ở trên hoặc quét mã QR bằng điện thoại để vào trang bán hàng chính thức của Coffee 24/24.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/80 border border-white/95 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 font-black text-lg flex items-center justify-center mx-auto">
                02
              </div>
              <h4 className="font-black text-base text-[#2b170e]">Lựa Chọn Thức Uống & Món Ăn</h4>
              <p className="text-xs text-[#7a5843] leading-relaxed">
                Xem đầy đủ thực đơn cà phê rang mộc, matcha, trà trái cây, đá xay và các món bếp đêm kèm giá bán chuẩn xác.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/80 border border-white/95 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto">
                03
              </div>
              <h4 className="font-black text-base text-[#2b170e]">Xác Nhận & Giao Tận Nơi</h4>
              <p className="text-xs text-[#7a5843] leading-relaxed">
                Nhập số điện thoại và địa chỉ nhận hàng. Quán sẽ lập tức chuẩn bị và giao ngay trong vòng 20 - 30 phút.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* MODAL MÃ QR CHI NHÁNH */}
      {qrModalBranch && (
        <div 
          onClick={() => setQrModalBranch(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[36px] max-w-sm w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl border border-stone-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-black text-[#8c5932] uppercase">
                MÃ QR MENU KIOTVIET
              </span>
              <button 
                onClick={() => setQrModalBranch(null)}
                className="p-1 rounded-full text-stone-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-black text-[#2b170e]">
              {qrModalBranch.name}
            </h3>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 inline-block">
              <img 
                src={qrModalBranch.qrImage} 
                alt={`Mã QR ${qrModalBranch.name}`} 
                className="w-48 h-48 object-contain mx-auto rounded-xl"
              />
            </div>

            <p className="text-xs text-[#7a5843]">
              Dùng camera điện thoại hoặc ứng dụng Zalo quét mã để mở ngay thực đơn KiotViet của chi nhánh này.
            </p>

            <button
              onClick={() => {
                const target = qrModalBranch.menuUrl || (
                  qrModalBranch.id === 'cn-413phi' || qrModalBranch.code === '413PHI'
                    ? (orderOnline.branch413PhiUrl || 'https://coffee2424.web-store.online/menu/363688')
                    : qrModalBranch.id === 'cn-96d5' || qrModalBranch.code === '96D5'
                    ? (orderOnline.branch96D5Url || 'https://coffee2424.web-store.online/menu/363827')
                    : (orderOnline.url || 'https://coffee2424.web-store.online')
                );
                handleOpenStore(target);
              }}
              className="w-full py-3 rounded-full bg-[#2b170e] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Mở Trực Tiếp Trên Trình Duyệt</span>
              <ExternalLink className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
