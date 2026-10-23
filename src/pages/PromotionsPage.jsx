import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Sparkles, 
  Copy, 
  Check, 
  Calendar, 
  ArrowRight, 
  ShoppingBag,
  Flame,
  Clock,
  Zap,
  Utensils,
  Moon,
  Users,
  Percent,
  Truck,
  Gift,
  HelpCircle,
  Coffee,
  CheckCircle2,
  ChevronRight,
  Info,
  PhoneCall,
  X
} from 'lucide-react';
import { PROMOTIONS, PROMOTION_CATEGORIES } from '../data/promotions';
import { getSiteConfig, DEFAULT_SITE_CONFIG } from '../data/siteConfig';

export default function PromotionsPage({ navigate }) {
  const [siteConfig, setSiteConfig] = useState(() => getSiteConfig());

  // Lắng nghe sự kiện cập nhật cấu hình từ Admin CMS
  useEffect(() => {
    const handleConfigUpdate = () => {
      setSiteConfig(getSiteConfig());
    };
    window.addEventListener('site-config-updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);
    return () => {
      window.removeEventListener('site-config-updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  const pageConfig = siteConfig?.promotionsPageConfig || DEFAULT_SITE_CONFIG.promotionsPageConfig || {};
  const heroConfig = pageConfig?.hero || DEFAULT_SITE_CONFIG.promotionsPageConfig?.hero;
  const guideConfig = pageConfig?.guideSteps || DEFAULT_SITE_CONFIG.promotionsPageConfig?.guideSteps;
  const commitConfig = pageConfig?.commitments || DEFAULT_SITE_CONFIG.promotionsPageConfig?.commitments;
  const hotlineConfig = pageConfig?.hotline || DEFAULT_SITE_CONFIG.promotionsPageConfig?.hotline;

  const livePromotions = (siteConfig?.promotionsList && Array.isArray(siteConfig.promotionsList) && siteConfig.promotionsList.length > 0)
    ? siteConfig.promotionsList
    : PROMOTIONS;

  const activePromo = livePromotions[0] || null;
  const heroImage = activePromo?.image || DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image || 'https://ilyxybkcndjcnzrtjjiq.supabase.co/storage/v1/object/public/coffee2424-media/promos/1792406318618_erer5hh.png';
  const heroTitle = activePromo?.title || 'Giờ Vàng Giảm 40% Tất Cả Đồ Uống';
  const heroTag = activePromo?.tag || activePromo?.highlightTag || 'ƯU ĐÃI NỔI BẬT NHẤT';
  const heroDiscount = activePromo?.discount || 'GIẢM 40%';
  const heroCode = activePromo?.code || 'HAPPY40';
  const heroValidUntil = activePromo?.validUntil || '16:00 - 19:00 Mỗi ngày';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedDetailPromo, setSelectedDetailPromo] = useState(null);

  // Khóa cuộn màn hình và phím ESC khi mở modal xem chi tiết
  useEffect(() => {
    if (!selectedDetailPromo) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedDetailPromo(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDetailPromo]);

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleUseNow = (code) => {
    if (code) {
      handleCopy(code);
    }
    navigate('/dathang');
  };

  // Lọc danh sách ưu đãi theo danh mục được chọn
  const filteredPromotions = selectedCategory === 'all'
    ? livePromotions
    : livePromotions.filter(p => (p.category || 'all') === selectedCategory || (selectedCategory === 'drinks' && p.category === 'drinks'));

  // Category Icon helper
  const renderCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4 text-orange-600" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-[#8c5932]" />;
      case 'Moon': return <Moon className="w-4 h-4 text-indigo-700" />;
      case 'Users': return <Users className="w-4 h-4 text-emerald-700" />;
      default: return <Sparkles className="w-4 h-4 text-[#8c5932]" />;
    }
  };

  return (
    <div className="text-[#2b170e] pb-24 font-sans">
      
      {/* FLOATING TOAST FEEDBACK WHEN COPYING VOUCHER */}
      {copiedCode && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2b170e] text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <div className="text-sm font-bold text-amber-200">Đã chép mã: <span className="font-mono text-white text-base font-black">{copiedCode}</span></div>
            <div className="text-xs text-stone-300">Dán vào ô mã giảm giá khi đặt món để nhận ưu đãi ngay!</div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-12">

        {/* 1. HERO BANNER - FROSTED GLASS */}
        {heroConfig?.enabled !== false && (
          <section className="relative overflow-hidden rounded-[36px] sm:rounded-[48px] bg-white/60 backdrop-blur-3xl border border-white/80 p-8 sm:p-14 shadow-[0_20px_50px_rgba(60,35,15,0.06)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-[#8c5932] text-xs font-black uppercase tracking-wider border border-white/90 shadow-xs">
                  <Flame className="w-4 h-4 text-orange-600 fill-orange-600 animate-pulse" />
                  <span>{heroConfig?.badge || 'Đặc Quyền Tiếp Sức 24/24'}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2b170e] tracking-tight leading-[1.3] sm:leading-[1.35]">
                  {heroConfig?.title || 'Kho Voucher & Ưu Đãi'} <br />
                  <span className="text-[#8c5932] inline-block mt-1 sm:mt-2">
                    {heroConfig?.highlightTitle || 'Dành Riêng Cho Bạn'}
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#5c3d2e] font-normal max-w-2xl leading-relaxed">
                  {heroConfig?.description || 'Giảm tới 40% Giờ Vàng, combo Cú Đêm 69K, món nóng cứu đói và mã freeship xuyên đêm. Thưởng thức trọn vẹn menu cà phê rang mộc nguyên chất 24/7 không lo về giá!'}
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => navigate(heroConfig?.ctaLink || '/dathang')}
                    className="px-8 py-4 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-black text-sm tracking-wide flex items-center gap-2.5 shadow-xl hover:shadow-2xl hover:scale-102 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                    <span>{heroConfig?.ctaText || 'ĐẶT MÓN & ÁP MÃ NGAY'}</span>
                  </button>

                  <a
                    href="#voucher-grid"
                    className="px-6 py-4 rounded-full bg-white/70 hover:bg-white text-[#2b170e] font-bold text-sm border border-white/90 shadow-sm transition-all flex items-center gap-2"
                  >
                    <span>{heroConfig?.secondaryText || 'Xem Danh Sách Voucher'}</span>
                    <ArrowRight className="w-4 h-4 text-[#8c5932]" />
                  </a>
                </div>

                {/* Quick Trust Highlights */}
                {Array.isArray(heroConfig?.stats) && heroConfig.stats.length > 0 && (
                  <div className="pt-6 border-t border-[#dfd4c7] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
                    {heroConfig.stats.map((stat, sIdx) => (
                      <div key={stat.id || sIdx}>
                        <div className="text-2xl sm:text-3xl font-black text-[#2b170e]">{stat.number}</div>
                        <div className="text-xs sm:text-sm text-[#7a5843] font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Hero Image Card (Portrait 3:4) */}
              <div className="lg:col-span-5">
                <div className="relative group">
                  <div className="relative rounded-[32px] overflow-hidden border border-white/80 shadow-2xl bg-white/70">
                    <div className="relative w-full aspect-[3/4] max-h-[520px] overflow-hidden bg-stone-900">
                      <img 
                        src={heroImage} 
                        alt={heroTitle} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.src = DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image || 'https://ilyxybkcndjcnzrtjjiq.supabase.co/storage/v1/object/public/coffee2424-media/promos/1792406318618_erer5hh.png'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2b170e]/95 via-[#2b170e]/30 to-transparent" />
                      
                      {/* Floating Ticket Feature Overlay */}
                      <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white text-[#2b170e] space-y-2 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-[#8c5932] tracking-wider flex items-center gap-1.5">
                            <Flame className="w-4 h-4 fill-orange-600 text-orange-600" />
                            {heroTag}
                          </span>
                          <span className="text-xs font-black bg-rose-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                            {heroDiscount}
                          </span>
                        </div>
                        <div className="text-base font-black text-[#2b170e] line-clamp-1">{heroTitle}</div>
                        <div className="flex items-center justify-between text-xs sm:text-sm text-[#5c3d2e] pt-1 border-t border-[#dfd4c7]">
                          <span>Mã: <strong className="font-mono text-[#8c5932] font-black">{heroCode}</strong></span>
                          <span className="text-[#8c5932] font-bold">{heroValidUntil}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* 2. CATEGORY FILTER TABS & VOUCHER GRID */}
        <section id="voucher-grid" className="space-y-8">
          
          {/* Section title & Subtext */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-black text-[#8c5932] uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8c5932]" />
                Danh Mục Ưu Đãi Đang Hoạt Động
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#2b170e] tracking-tight">
                Săn Phiếu Quà Tặng & Voucher
              </h2>
              <p className="text-sm sm:text-base text-[#5c3d2e]">
                Bấm "Chép mã" hoặc "Dùng ngay" để tự động áp dụng ưu đãi khi chọn món.
              </p>
            </div>

            <div className="text-sm font-bold text-[#5c3d2e] bg-white/70 border border-white/90 px-4 py-2 rounded-full w-fit shadow-xs">
              Hiển thị <span className="font-black text-[#2b170e]">{filteredPromotions.length}</span> ưu đãi
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {PROMOTION_CATEGORIES.map((cat) => {
              const count = cat.id === 'all' 
                ? livePromotions.length 
                : livePromotions.filter(p => p.category === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2b170e] text-white font-black shadow-md'
                      : 'bg-white/70 text-[#5c3d2e] hover:bg-white border border-white/90 shadow-xs'
                  }`}
                >
                  {renderCategoryIcon(cat.icon)}
                  <span>{cat.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white font-black' : 'bg-stone-200 text-[#5c3d2e]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Voucher Ticket Stubs Grid (Portrait 3:4 Cards - Clean, Crisp & Clickable) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPromotions.map((promo, idx) => (
              <div 
                key={promo.id || idx}
                onClick={() => setSelectedDetailPromo(promo)}
                className="ios-glass-card rounded-[32px] overflow-hidden flex flex-col justify-between group relative border border-white/80 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 bg-white/75 backdrop-blur-xl cursor-pointer"
              >
                {/* TOP: Image (3:4 Ratio), Badges & Overlays */}
                <div>
                  <div className="relative w-full aspect-[3/4] bg-stone-900 overflow-hidden rounded-t-[32px]">
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.src = DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image || 'https://ilyxybkcndjcnzrtjjiq.supabase.co/storage/v1/object/public/coffee2424-media/promos/1792406318618_erer5hh.png'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                    
                    {/* Floating badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="px-3.5 py-1 rounded-full bg-[#2b170e]/90 backdrop-blur-md text-white text-xs font-black uppercase shadow-md flex items-center gap-1.5 border border-white/20">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
                        {promo.badge || promo.tag || 'HOT DEAL 🔥'}
                      </span>
                    </div>

                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-3.5 py-1 rounded-full bg-white/95 text-[#8c5932] border border-white text-xs font-black shadow-md backdrop-blur-xs">
                        {promo.discount || 'ƯU ĐÃI'}
                      </span>
                    </div>

                    {/* Time validity tag */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs sm:text-sm font-bold">
                      <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        {promo.validUntil || 'Cả ngày & đêm 24/24'}
                      </span>
                    </div>
                  </div>

                  {/* MIDDLE BODY: Title, Subtitle & Click hint (NO LONG DESCRIPTION CLUTTER) */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#8c5932] tracking-wider bg-white/80 px-2.5 py-1 rounded-lg border border-white/90 shadow-xs">
                        {promo.subtitle || 'Ưu Đãi Đặc Quyền'}
                      </span>
                      <span className="text-sm font-black text-[#8c5932]">
                        {promo.discountValue || promo.discount}
                      </span>
                    </div>

                    <h3 className="font-black text-[#2b170e] text-lg sm:text-xl leading-snug group-hover:text-[#8c5932] transition-colors">
                      {promo.title}
                    </h3>

                    {/* Click prompt to view details */}
                    <div className="pt-2 flex items-center justify-between text-xs text-[#8c5932] font-bold">
                      <span className="inline-flex items-center gap-1.5 group-hover:underline">
                        <span>Nhấn để xem chi tiết & thể lệ</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* TICKET NOTCH PERFORATION CUTOUTS */}
                <div className="relative my-0">
                  <div className="border-t-2 border-dashed border-[#dfd4c7] w-full" />
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#ede6dc] border-r border-[#dfd4c7]" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#ede6dc] border-l border-[#dfd4c7]" />
                </div>

                {/* BOTTOM VOUCHER STUB ACTIONS (Controlled by Admin Toggles) */}
                {promo.showVoucherCode === false && promo.showCopyBtn === false && promo.showCtaBtn === false ? (
                  <div className="p-4 bg-white/40 border-t border-white/60 flex items-center justify-between text-xs font-bold text-[#8c5932]">
                    <span>COFFEE 24/24 Đặc Quyền</span>
                    <span className="flex items-center gap-1">Bấm Xem Chi Tiết <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                ) : (
                  <div className="p-5 bg-white/40 border-t border-white/60 flex items-center justify-between gap-3">
                    {promo.showVoucherCode !== false && (
                      <div>
                        <span className="text-[11px] text-[#7a5843] block font-bold uppercase tracking-wider">Mã Ưu Đãi</span>
                        <span className="text-sm sm:text-base font-mono font-black text-[#2b170e] bg-white/80 border border-white/90 px-2.5 py-1 rounded-xl inline-block shadow-xs mt-0.5">
                          {promo.code || 'PROMO24'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      {promo.showCopyBtn !== false && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(promo.code || 'PROMO24');
                          }}
                          className="px-3.5 py-2 rounded-full bg-white/80 hover:bg-white text-[#2b170e] text-xs font-bold border border-white/90 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                          title="Sao chép mã"
                        >
                          {copiedCode === (promo.code || 'PROMO24') ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              <span className="text-emerald-700">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#8c5932]" />
                              <span>Chép mã</span>
                            </>
                          )}
                        </button>
                      )}

                      {promo.showCtaBtn !== false && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseNow(promo.code || 'PROMO24');
                          }}
                          className="ios-btn-primary px-4 py-2 rounded-full font-black text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <span>{promo.cta || 'Dùng ngay'}</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

        </section>

        {/* 3. HƯỚNG DẪN CÁC BƯỚC DÙNG VOUCHER */}
        {guideConfig?.enabled !== false && (
          <section className="bg-white/60 backdrop-blur-2xl rounded-[36px] sm:rounded-[44px] p-8 sm:p-12 border border-white/80 shadow-[0_15px_40px_rgba(60,35,15,0.06)] space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black text-[#8c5932] uppercase tracking-wider bg-white/80 px-4 py-1.5 rounded-full border border-white/90 inline-block shadow-xs">
                {guideConfig?.badge || 'CÁCH THỨC ÁP DỤNG'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2b170e]">
                {guideConfig?.title || '3 Bước Sử Dụng Voucher Cực Dễ Dàng'}
              </h2>
              <p className="text-sm sm:text-base text-[#5c3d2e] leading-relaxed">
                {guideConfig?.description || 'Chỉ với vài thao tác đơn giản, bạn sẽ nhận ngay ưu đãi giảm giá tốt nhất khi đặt món trực tuyến hoặc thưởng thức tại quán.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(guideConfig?.steps || DEFAULT_SITE_CONFIG.promotionsPageConfig.guideSteps.steps).map((item, idx) => (
                <div key={item.id || idx} className="bg-white/70 rounded-3xl p-6 sm:p-7 border border-white/90 space-y-3 relative shadow-sm">
                  <div 
                    className="w-12 h-12 rounded-2xl text-white font-black text-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: item.color || (idx === 0 ? '#2b170e' : idx === 1 ? '#8c5932' : '#047857') }}
                  >
                    {item.step || `0${idx + 1}`}
                  </div>
                  <h3 className="text-lg font-black text-[#2b170e]">{item.title}</h3>
                  <p className="text-sm sm:text-base text-[#5c3d2e] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. CAM KẾT DỊCH VỤ 24/24 */}
        {commitConfig?.enabled !== false && (
          <section className="bg-white/60 backdrop-blur-3xl rounded-[36px] sm:rounded-[44px] p-8 sm:p-12 border border-white/80 shadow-[0_15px_40px_rgba(60,35,15,0.06)] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 text-[#8c5932] text-xs font-bold border border-white/90 shadow-xs">
                  <Coffee className="w-4 h-4 text-[#8c5932]" />
                  {commitConfig?.badge || 'Chuẩn Mực Phục Vụ 24/7'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-[#2b170e] tracking-tight leading-snug">
                  {commitConfig?.title || 'Không Chỉ Là Cà Phê,'} <br />
                  <span className="text-[#8c5932]">{commitConfig?.highlightTitle || 'Đó Là Trạm Năng Lượng 24/24'}</span>
                </h2>
                <p className="text-sm sm:text-base text-[#5c3d2e] leading-relaxed font-normal">
                  {commitConfig?.description || 'Cho dù bạn cần một không gian yên tĩnh cày deadline lúc 2 giờ sáng, tụ họp học nhóm hay một ly cà phê mộc đậm đà khởi đầu ngày mới — COFFEE 24/24 luôn sẵn sàng chào đón bạn.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/dathang')}
                    className="px-6 py-3.5 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                    <span>Đặt Món Ngay Bây Giờ</span>
                  </button>
                  <button
                    onClick={() => navigate('/gioithieu')}
                    className="px-6 py-3.5 rounded-full bg-white/70 hover:bg-white text-[#2b170e] font-bold text-sm border border-white/90 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Xem Không Gian Quán</span>
                  </button>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(commitConfig?.items || DEFAULT_SITE_CONFIG.promotionsPageConfig.commitments.items).map((com, cIdx) => (
                  <div key={com.id || cIdx} className="p-5 rounded-2xl bg-white/75 border border-white/90 space-y-2 shadow-xs">
                    <div className="text-[#2b170e] font-black text-base flex items-center gap-2">
                      {cIdx === 0 && <Coffee className="w-5 h-5 text-[#8c5932]" />}
                      {cIdx === 1 && <Utensils className="w-5 h-5 text-[#8c5932]" />}
                      {cIdx === 2 && <Zap className="w-5 h-5 text-[#8c5932]" />}
                      {cIdx >= 3 && <Truck className="w-5 h-5 text-[#8c5932]" />}
                      <span>{com.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
                      {com.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* 5. HOTLINE & HỖ TRỢ ĐẶT BÀN NHÓM */}
        {hotlineConfig?.enabled !== false && (
          <section className="p-6 sm:p-8 rounded-[32px] bg-white/70 backdrop-blur-2xl border border-white/90 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_rgba(60,35,15,0.05)]">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white text-[#2b170e] flex items-center justify-center flex-shrink-0 border border-white/90 shadow-sm">
                <PhoneCall className="w-7 h-7 text-[#8c5932]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#2b170e]">
                  {hotlineConfig?.title || 'Bạn Có Câu Hỏi Về Mã Ưu Đãi Hoặc Cần Đặt Bàn Nhóm?'}
                </h3>
                <p className="text-xs sm:text-sm text-[#5c3d2e]">
                  {hotlineConfig?.desc || 'Liên hệ hotline chăm sóc khách hàng 24/7:'}{' '}
                  <a href={hotlineConfig?.phoneLink || 'tel:0906916816'} className="font-bold text-[#8c5932] hover:underline font-mono">
                    {hotlineConfig?.phone || '0906 916 816'}
                  </a>
                  {' '}hoặc ghé trực tiếp chi nhánh gần nhất.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dathang')}
              className="px-6 py-3.5 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{hotlineConfig?.ctaText || 'Dùng Voucher Đặt Món'}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </section>
        )}

      </div>

      {/* 6. MODAL CHI TIẾT CHƯƠNG TRÌNH KHUYẾN MÃI (KHI BẤM VÀO THẺ) */}
      {selectedDetailPromo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedDetailPromo(null)}
        >
          <div 
            className="relative w-full max-w-xl bg-[#fcfaf7] rounded-[32px] sm:rounded-[36px] shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[90vh] text-[#2b170e]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedDetailPromo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md"
              aria-label="Đóng"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Poster Header */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-neutral-900 flex-shrink-0">
              <img
                src={selectedDetailPromo.image || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80'}
                alt={selectedDetailPromo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#f39c12] text-white text-xs font-black shadow-md uppercase tracking-wider">
                  {selectedDetailPromo.badge || selectedDetailPromo.tag || 'HOT DEAL 🔥'}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-white text-[#8c5932] text-xs font-black shadow-md">
                  {selectedDetailPromo.discount || 'ƯU ĐÃI'}
                </span>
              </div>

              {/* Time Validity */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs sm:text-sm font-bold">
                <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10">
                  <Clock className="w-4 h-4 text-amber-300" />
                  {selectedDetailPromo.validUntil || 'Cả ngày & đêm 24/24'}
                </span>
                {selectedDetailPromo.category && (
                  <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs uppercase font-semibold">
                    {selectedDetailPromo.category}
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-5 flex-1">
              {/* Subtitle & Title */}
              <div>
                <span className="text-xs font-black uppercase text-[#8c5932] tracking-wider bg-white px-3 py-1 rounded-lg border border-[#e8ded3] shadow-2xs inline-block mb-2">
                  {selectedDetailPromo.subtitle || 'Ưu Đãi Đặc Quyền'}
                </span>
                <h3 className="font-black text-xl sm:text-2xl text-[#2b170e] leading-snug">
                  {selectedDetailPromo.title}
                </h3>
              </div>

              {/* Scarcity Bar if present */}
              {(selectedDetailPromo.claimed || selectedDetailPromo.remaining) && (
                <div className="p-3.5 rounded-2xl bg-white border border-[#e8ded3] space-y-2">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-orange-600 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" />
                      Đã nhận {selectedDetailPromo.claimed || 85}%
                    </span>
                    <span className="text-[#8c5932]">
                      Còn {selectedDetailPromo.remaining || 20} suất hôm nay
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: `${selectedDetailPromo.claimed || 85}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#7a5843] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8c5932]" />
                  Chi Tiết Chương Trình
                </h4>
                <div className="p-4 rounded-2xl bg-white border border-[#e8ded3] text-sm text-[#4a2e1b] leading-relaxed whitespace-pre-line font-medium shadow-2xs">
                  {selectedDetailPromo.description || 'Ưu đãi đặc quyền dành riêng cho khách hàng trải nghiệm tại COFFEE 24/24.'}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#7a5843] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#8c5932]" />
                  Điều Kiện Áp Dụng
                </h4>
                <div className="p-4 rounded-2xl bg-[#f4ece1] border border-[#e5d8c7] text-xs sm:text-sm text-[#5c3d2e] leading-relaxed whitespace-pre-line">
                  {selectedDetailPromo.condition || 'Áp dụng cho toàn bộ khách hàng dùng tại quán hoặc đặt giao tận nơi 24/24. Không áp dụng đồng thời với các chương trình khuyến mãi khác.'}
                </div>
              </div>
            </div>

            {/* Bottom Actions Stub */}
            <div className="p-5 bg-white border-t border-[#e8ded3] flex items-center justify-between gap-3 shadow-lg flex-shrink-0">
              {selectedDetailPromo.showVoucherCode !== false && (
                <div>
                  <span className="text-[11px] text-[#7a5843] block font-bold uppercase tracking-wider">Mã Ưu Đãi</span>
                  <span className="text-base font-mono font-black text-[#2b170e] bg-[#f7f2eb] border border-[#dfd4c7] px-3 py-1 rounded-xl inline-block shadow-2xs mt-0.5">
                    {selectedDetailPromo.code || 'PROMO24'}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {selectedDetailPromo.showCopyBtn !== false && (
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedDetailPromo.code || 'PROMO24')}
                    className="px-4 py-2.5 rounded-full bg-[#f4ece1] hover:bg-[#ede1d2] text-[#2b170e] text-xs font-bold border border-[#dfd4c7] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    {copiedCode === (selectedDetailPromo.code || 'PROMO24') ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <span className="text-emerald-700">Đã chép mã</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#8c5932]" />
                        <span>Chép mã</span>
                      </>
                    )}
                  </button>
                )}

                {selectedDetailPromo.showCtaBtn !== false && (
                  <button
                    type="button"
                    onClick={() => {
                      handleUseNow(selectedDetailPromo.code || 'PROMO24');
                      setSelectedDetailPromo(null);
                    }}
                    className="ios-btn-primary px-5 py-2.5 rounded-full font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>{selectedDetailPromo.cta || 'Dùng ngay'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                )}

                {selectedDetailPromo.showCtaBtn === false && selectedDetailPromo.showCopyBtn === false && (
                  <button
                    type="button"
                    onClick={() => setSelectedDetailPromo(null)}
                    className="px-5 py-2.5 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Đóng
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
