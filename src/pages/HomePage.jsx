import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  Copy, 
  Check, 
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Coffee,
  Heart,
  Percent,
  MessageSquare,
  BookOpen,
  ArrowUp,
  PhoneCall,
  ExternalLink,
  QrCode,
  ArrowUpRight
} from 'lucide-react';
import CoffeeStorySlider from '../components/CoffeeStorySlider';
import { BrandIcons } from '../components/SocialFollowSection';
import { INITIAL_ARTICLES } from '../data/articles';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import { getSiteConfig } from '../data/siteConfig';

const SLIDES_NAV = [
  { id: 0, label: '01 Khám Phá', icon: Coffee },
  { id: 1, label: '02 Thực Đơn', icon: Sparkles },
  { id: 2, label: '03 Ưu Đãi', icon: Percent },
  { id: 3, label: '04 Đánh Giá', icon: MessageSquare },
  { id: 4, label: '05 Cẩm Nang', icon: BookOpen },
  { id: 5, label: '06 Kết Nối', icon: Heart }
];

export default function HomePage({ navigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const isLockedRef = useRef(false);
  const touchStartYRef = useRef(0);
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);

  const TOTAL_SLIDES = SLIDES_NAV.length;

  useEffect(() => {
    const handleConfigUpdate = () => setSiteConfig(getSiteConfig());
    window.addEventListener('site-config-updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);
    return () => {
      window.removeEventListener('site-config-updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  const goToSlide = (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= TOTAL_SLIDES) return;
    if (isLockedRef.current) return;

    isLockedRef.current = true;
    setCurrentSlide(targetIndex);

    // Lock for 800ms so one wheel gesture / flick snaps cleanly to exactly one slide
    setTimeout(() => {
      isLockedRef.current = false;
    }, 800);
  };

  // One-Scroll Fullpage Snap Listener (Cuộn 1 cái nhảy luôn sang slide tiếp theo)
  useEffect(() => {
    const handleWheel = (e) => {
      // Don't intercept if review modal or similar modal is open
      if (document.querySelector('.review-modal-open')) return;

      e.preventDefault();
      if (isLockedRef.current) return;

      // Threshold to avoid micro jitters
      if (Math.abs(e.deltaY) < 18) return;

      if (e.deltaY > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    };

    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isLockedRef.current) return;
      const diff = touchStartYRef.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 45) return;

      if (diff > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    };

    const handleKeyDown = (e) => {
      if (isLockedRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.target.matches('input, textarea'))) {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // 4 Signature Drinks (Chuẩn 4 thẻ như Ảnh 2)
  const signatureDrinks = [
    {
      id: 4,
      name: 'Cold Brew Cam Vàng',
      category: 'Specialty Cold Brew',
      price: '49.000đ',
      image: '/images/signature_drinks.jpg'
    },
    {
      id: 99,
      name: 'Cà Phê Muối Kem Béo',
      category: 'Traditional Recipe',
      price: '42.000đ',
      image: '/images/promo_banner.jpg'
    },
    {
      id: 1,
      name: 'Cà Phê Sữa Đá 24/24',
      category: 'Pure Robusta',
      price: '35.000đ',
      image: '/images/journey_espresso.jpg'
    },
    {
      id: 3,
      name: 'Bạc Xỉu 3 Tầng Kem',
      category: 'Classic Blend',
      price: '39.000đ',
      image: '/images/blog_brewing.jpg'
    }
  ];

  // 3 Minimalist Vouchers (Chuẩn 3 voucher như Ảnh 3)
  const minimalistVouchers = [
    {
      id: 'happy40',
      tag: 'GIỜ VÀNG',
      discount: 'GIẢM 40%',
      title: 'Tất Cả Đồ Uống 16:00 - 19:00 Mỗi Ngày',
      code: 'HAPPY40'
    },
    {
      id: 'cudem69',
      tag: 'COMBO ĐÊM',
      discount: 'CHỈ 69K',
      title: 'Cà Phê Mộc + Mì Xào Bò Trứng Ốp La',
      code: 'CUDEM69'
    },
    {
      id: 'shipfree',
      tag: 'GIAO HỎA TỐC',
      discount: 'FREESHIP',
      title: 'Miễn Phí Giao Hàng Cho Đơn Từ 99K',
      code: 'FREESHIP'
    }
  ];

  const latestArticles = INITIAL_ARTICLES.slice(0, 3);

  const socialPlatforms = (siteConfig.socialMedia?.platforms || []).filter(p => p.visible !== false);

  return (
    <div className="relative w-full h-full overflow-hidden select-none font-sans">
      
      {/* =========================================================================
          FLOATING SLIDE DOTS NAVIGATION (Thanh chỉ báo slide tinh gọn chuẩn Apple)
          ========================================================================= */}
      <div className="fixed right-3.5 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2.5 py-3.5 px-1.5 w-7 sm:w-8 shrink-0 rounded-full bg-white/55 backdrop-blur-2xl border border-white/85 shadow-[0_10px_35px_rgba(43,23,14,0.12)] pointer-events-auto">
        {SLIDES_NAV.map((s) => {
          const isActive = currentSlide === s.id;
          return (
            <button
              key={s.id}
              onClick={() => goToSlide(s.id)}
              className="group relative flex items-center justify-center p-1 cursor-pointer"
              title={s.label}
              aria-label={s.label}
            >
              {/* Tooltip nổi tách biệt tuyệt đối sang bên trái (Không làm phình to thanh tròn) */}
              <span
                className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-black tracking-tight whitespace-nowrap transition-all duration-300 pointer-events-none shadow-lg border border-white/95 bg-white text-[#2b170e] ${
                  isActive
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {s.label}
              </span>

              {/* Điểm dừng / Viên thuốc chỉ báo slide */}
              <div
                className={`transition-all duration-300 ${
                  isActive
                    ? 'w-2.5 h-6 rounded-full bg-gradient-to-b from-[#2b170e] to-[#180d08] shadow-md ring-2 ring-[#2b170e]/25'
                    : 'w-2 h-2 rounded-full bg-[#8c5932]/45 group-hover:bg-[#8c5932] group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          MAIN FULLPAGE TRACK (Trượt 100% không lỗ hổng, cuộn 1 cái nhảy luôn)
          ========================================================================= */}
      <div 
        className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateY(-${currentSlide * 100}%)` }}
      >

        {/* ---------------------------------------------------------------------
            SLIDE 0: HERO SLIDER (Ảnh 1)
            --------------------------------------------------------------------- */}
        <div className="w-full h-full flex-shrink-0 flex flex-col justify-center items-center px-3 sm:px-6 lg:px-8 py-2 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center">
            <CoffeeStorySlider onOrderClick={() => navigate('/dathang')} />

            {/* Bouncing Prompt to jump directly to Slide 1 */}
            <div className="mt-1 sm:mt-2 z-20">
              <button
                onClick={() => goToSlide(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/55 hover:bg-white text-[#2b170e] text-xs sm:text-sm font-bold border border-white/85 shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-95 animate-bounce backdrop-blur-md"
              >
                <span>Cuộn khám phá thực đơn</span>
                <ChevronDown className="w-4 h-4 text-[#8c5932] group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------
            SLIDE 1: THỰC ĐƠN TUYỂN CHỌN (Ảnh 2)
            --------------------------------------------------------------------- */}
        <div className="w-full h-full flex-shrink-0 flex flex-col justify-center items-center px-3 sm:px-6 lg:px-8 py-4 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto flex flex-col justify-center">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#2b170e]/10">
              <div className="space-y-0.5">
                <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-800 block">
                  CURATED COLLECTION
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2b170e] uppercase tracking-tight">
                  Thực Đơn Tuyển Chọn
                </h2>
              </div>

              <button
                onClick={() => navigate('/dathang')}
                className="text-sm sm:text-base font-bold text-[#4a3427] hover:text-[#2b170e] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto group"
              >
                <span>Xem Toàn Bộ Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#2b170e]" />
              </button>
            </div>

            {/* 4 Drinks Grid (To rõ, kính mờ iOS) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
              {signatureDrinks.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => navigate('/dathang')}
                  className="group cursor-pointer flex flex-col justify-between ios-glass-card rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] sm:aspect-[3/4] max-h-48 sm:max-h-56 overflow-hidden bg-stone-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col justify-between gap-2.5">
                    <div>
                      <span className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-[#85634b] block">
                        {item.category}
                      </span>
                      <h3 className="text-sm sm:text-base lg:text-lg font-black text-[#2b170e] group-hover:text-[#8c5932] transition-colors line-clamp-1 mt-0.5">
                        {item.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#2b170e]/10">
                      <span className="text-base sm:text-lg font-black text-[#2b170e]">
                        {item.price}
                      </span>
                      <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#2b170e] group-hover:bg-[#2b170e] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110 group-active:scale-95">
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Jump button to next slide */}
            <div className="flex justify-center pt-6">
              <button
                onClick={() => goToSlide(2)}
                className="p-2.5 rounded-full bg-white/45 hover:bg-white text-[#2b170e] hover:text-[#8c5932] border border-white/75 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Sang Ưu Đãi Hôm Nay"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* ---------------------------------------------------------------------
            SLIDE 2: ƯU ĐÃI HÔM NAY (Ảnh 3)
            --------------------------------------------------------------------- */}
        <div className="w-full h-full flex-shrink-0 flex flex-col justify-center items-center px-3 sm:px-6 lg:px-8 py-4 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto flex flex-col justify-center">
            
            <div className="rounded-[36px] sm:rounded-[44px] ios-glass-panel p-6 sm:p-10 lg:p-12 space-y-6 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#2b170e]/10">
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#8c5932] block">
                    SPECIAL OFFERS
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2b170e] uppercase tracking-tight">
                    Ưu Đãi Hôm Nay
                  </h2>
                </div>

                <button
                  onClick={() => navigate('/khuyenmai')}
                  className="text-sm sm:text-base font-bold text-[#4a3427] hover:text-[#2b170e] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto group"
                >
                  <span>Xem Tất Cả Ưu Đãi</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#2b170e]" />
                </button>
              </div>

              {/* 3 Voucher Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {minimalistVouchers.map((v) => (
                  <div 
                    key={v.id}
                    className="ios-glass-card p-5 sm:p-6 rounded-[28px] flex flex-col justify-between space-y-4 relative overflow-hidden"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#8c5932] uppercase tracking-wider bg-white/90 px-3 py-1 rounded-full border border-white shadow-2xs">
                          {v.tag}
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-[#2b170e]">
                          {v.discount}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base font-bold text-[#3d2719] leading-snug">
                        {v.title}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#2b170e]/10 flex items-center justify-between">
                      <span className="font-mono text-sm font-black text-[#2b170e] bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                        {v.code}
                      </span>

                      <button
                        onClick={() => handleCopy(v.code)}
                        className="ios-btn-primary text-xs sm:text-sm font-bold px-4 py-2 rounded-full cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95"
                      >
                        {copiedCode === v.code ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-white" />
                            <span>Lưu mã</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Jump button to next slide */}
            <div className="flex justify-center pt-6">
              <button
                onClick={() => goToSlide(3)}
                className="p-2.5 rounded-full bg-white/45 hover:bg-white text-[#2b170e] hover:text-[#8c5932] border border-white/75 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Sang Trải Nghiệm Khách Hàng"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* ---------------------------------------------------------------------
            SLIDE 3: TRẢI NGHIỆM KHÁCH HÀNG (Ảnh 4)
            --------------------------------------------------------------------- */}
        <div className="w-full h-full flex-shrink-0 flex flex-col justify-center items-center px-3 sm:px-6 lg:px-8 py-4 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto flex flex-col justify-center">
            <CustomerReviewsSection className="py-0 sm:py-0" />

            {/* Jump button to next slide */}
            <div className="flex justify-center pt-6">
              <button
                onClick={() => goToSlide(4)}
                className="p-2.5 rounded-full bg-white/45 hover:bg-white text-[#2b170e] hover:text-[#8c5932] border border-white/75 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Sang Bài Viết & Cẩm Nang"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------
            SLIDE 4: BÀI VIẾT & CẨM NANG
            --------------------------------------------------------------------- */}
        <div className="w-full h-full flex-shrink-0 flex flex-col justify-center items-center px-3 sm:px-6 lg:px-8 py-4 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto flex flex-col justify-center space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#2b170e]/10">
              <div className="space-y-0.5">
                <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-800 block">
                  COFFEE CULTURE & STORIES
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2b170e] uppercase tracking-tight">
                  Bài Viết & Cẩm Nang
                </h2>
              </div>

              <button
                onClick={() => navigate('/baiviet')}
                className="text-sm sm:text-base font-bold text-[#4a3427] hover:text-[#2b170e] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto group"
              >
                <span>Đọc Thêm Bài Viết</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#2b170e]" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {latestArticles.map((art) => (
                <div 
                  key={art.id}
                  onClick={() => navigate('/baiviet')}
                  className="group cursor-pointer ios-glass-card rounded-[28px] overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl"
                >
                  <div className="h-44 sm:h-52 overflow-hidden bg-stone-100 relative">
                    <img 
                      src={art.coverImage} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2b170e] shadow-xs">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-xs text-[#8c5932] font-semibold">
                      {art.date} • {art.readTime}
                    </div>
                    <h3 className="font-bold text-[#2b170e] text-base sm:text-lg group-hover:text-[#8c5932] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Jump button to Footer slide */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => goToSlide(5)}
                className="p-2.5 rounded-full bg-white/45 hover:bg-white text-[#2b170e] hover:text-[#8c5932] border border-white/75 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Sang Chân Trang & Kết Nối"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* ---------------------------------------------------------------------
            SLIDE 5: CHÂN TRANG & MẠNG XÃ HỘI (Ảnh 5)
            --------------------------------------------------------------------- */}
        <div className="w-full h-full flex-shrink-0 flex flex-col justify-center items-center px-3 sm:px-6 lg:px-8 py-3 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto flex flex-col justify-center space-y-4">
            
            {/* Top: Follow Our Journey (Ảnh 5) */}
            <div className="rounded-[28px] ios-glass-panel p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#8c5932] font-black block">
                  {siteConfig.socialMedia?.sectionTitle || 'FOLLOW OUR JOURNEY · #ENJOYYOURLIFE'}
                </span>
                <div className="text-base sm:text-lg font-black text-[#2b170e]">
                  {siteConfig.socialMedia?.sectionSubtitle || 'Kết nối cùng cộng đồng COFFEE 24/24'}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {socialPlatforms.map((platform) => {
                  const IconComponent = BrandIcons[platform.id] || BrandIcons.facebook;
                  const isPlaceholder = platform.isPlaceholder;

                  if (isPlaceholder && !platform.url) {
                    return (
                      <div
                        key={platform.id}
                        className="px-3.5 py-2 rounded-2xl bg-white/40 border border-dashed border-[#8c5932]/40 text-[#5c3d2e] inline-flex items-center gap-2 text-xs font-semibold shadow-2xs"
                        title={platform.desc || `Ô nhúng ${platform.name}`}
                      >
                        <div className="w-5 h-5 rounded-md bg-stone-200/80 text-stone-600 flex items-center justify-center shrink-0">
                          <IconComponent />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-[#2b170e] text-[11px] flex items-center gap-1">
                            <span>{platform.name}</span>
                            <span className="text-[8px] px-1 rounded-full bg-stone-200 text-stone-600 font-bold">
                              {platform.badge || 'Sắp ra mắt'}
                            </span>
                          </span>
                          <span className="text-[9.5px] text-[#7a5843]">{platform.handle || platform.placeholderText || 'Chờ liên kết'}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={platform.id}
                      href={platform.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-3.5 sm:px-4 py-2 rounded-2xl border transition-all inline-flex items-center gap-2 text-xs sm:text-sm font-bold shadow-2xs hover:shadow-md active:scale-95 group ${
                        platform.id === 'facebook'
                          ? 'bg-blue-600/10 hover:bg-blue-600 hover:text-white border-blue-500/30 text-[#1877F2]'
                          : platform.id === 'tiktok'
                          ? 'bg-black/5 hover:bg-black hover:text-white border-black/20 text-[#180d08]'
                          : platform.id === 'instagram'
                          ? 'bg-pink-500/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white border-pink-400/30 text-[#E1306C]'
                          : platform.id === 'threads'
                          ? 'bg-stone-900/10 hover:bg-black hover:text-white border-black/20 text-[#111]'
                          : platform.id === 'youtube'
                          ? 'bg-red-500/10 hover:bg-red-600 hover:text-white border-red-500/30 text-[#FF0000]'
                          : 'bg-white/70 hover:bg-white text-[#2b170e] border-white/90'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-md bg-white/90 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-[#2b170e]">
                        <IconComponent />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="flex items-center gap-1 leading-tight text-xs font-black">
                          <span>{platform.name}</span>
                          {platform.badge && (
                            <span className="text-[8px] px-1 rounded-full bg-white/80 text-[#2b170e] font-extrabold shadow-2xs">
                              {platform.badge}
                            </span>
                          )}
                        </span>
                        <span className="text-[9.5px] font-normal opacity-80 group-hover:opacity-100">
                          {platform.handle}
                        </span>
                      </div>
                      <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-all" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Bottom 4 Columns (Ảnh 5) */}
            <div className="rounded-[32px] ios-glass-panel p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 shadow-xl">
              
              {/* Brand info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/images/logo.jpg" 
                    alt="Logo" 
                    className="w-10 h-10 rounded-full border border-white/90 object-cover shadow-sm"
                  />
                  <div>
                    <span className="text-base font-black text-[#2b170e] tracking-wider block">COFFEE 24/24</span>
                    <span className="text-[10px] text-[#8c5932] font-black tracking-widest uppercase">{siteConfig.slogan || 'ENJOY YOUR LIFE'}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
                  Cà phê rang mộc nguyên chất, chắt lọc tinh hoa từ những vùng trồng trứ danh. Không gian mở truyền cảm hứng làm việc & sáng tạo suốt 24 giờ.
                </p>
                <div className="text-xs text-[#2b170e] font-bold bg-white/70 px-3 py-1.5 rounded-xl border border-white/90 inline-flex items-center gap-1 shadow-2xs">
                  <span>☕</span>
                  <span>Hương vị cà phê nguyên bản & mộc mạc</span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
                <h4 className="text-[#2b170e] text-xs font-black tracking-widest uppercase border-l-2 border-[#8c5932] pl-2">
                  Khám Phá Website
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm">
                  <li>
                    <button onClick={() => goToSlide(0)} className="hover:text-[#8c5932] text-[#4a3427] font-semibold cursor-pointer">
                      Trang Chủ
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/dathang')} className="hover:text-[#8c5932] text-[#2b170e] font-bold cursor-pointer inline-flex items-center gap-1.5">
                      <span>Thực Đơn Đặt Món</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#2b170e] text-white">Menu</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/khuyenmai')} className="hover:text-[#8c5932] text-[#4a3427] font-semibold cursor-pointer">
                      Chương Trình Khuyến Mãi
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/gioithieu')} className="hover:text-[#8c5932] text-[#4a3427] font-semibold cursor-pointer">
                      Về Chúng Tôi (Giới Thiệu)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/tuyendung')} className="hover:text-[#8c5932] text-[#4a3427] font-semibold cursor-pointer">
                      Tuyển Dụng Nhân Sự
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/baiviet')} className="hover:text-[#8c5932] text-[#4a3427] font-semibold cursor-pointer">
                      Bài Viết & Cẩm Nang
                    </button>
                  </li>
                </ul>
              </div>

              {/* Chi nhánh */}
              <div className="space-y-2">
                <h4 className="text-[#2b170e] text-xs font-black tracking-widest uppercase border-l-2 border-[#8c5932] pl-2">
                  Cửa Hàng Tại TP.HCM
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/60 border border-white/80 space-y-0.5">
                    <p className="text-[#2b170e] font-black">Coffee 24/24 413PHI</p>
                    <p className="text-[#5c3d2e]">413 Phan Huy Ích, P. An Hội Tây, TP.HCM</p>
                    <p className="text-[#2b170e] font-bold flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-[#8c5932]" />
                      <span>Hotline:</span>
                      <a href={`tel:${siteConfig.hotlinePHI || '0986511897'}`} className="text-[#8c5932] hover:underline font-mono">
                        {siteConfig.hotlinePHI || '0986511897'}
                      </a>
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/60 border border-white/80 space-y-0.5">
                    <p className="text-[#2b170e] font-black">Coffee 24/24 96D5</p>
                    <p className="text-[#5c3d2e]">96 đường D5, P. Thạnh Mỹ Tây, TP.HCM</p>
                    <p className="text-[#2b170e] font-bold flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-[#8c5932]" />
                      <span>Hotline:</span>
                      <a href={`tel:${siteConfig.hotlineD5 || '0347374858'}`} className="text-[#8c5932] hover:underline font-mono">
                        {siteConfig.hotlineD5 || '0347374858'}
                      </a>
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white/60 border border-white/80 flex items-center justify-between text-xs">
                    <span className="text-[#5c3d2e]">Hotline 24/7:</span>
                    <a href={`tel:${siteConfig.hotlineGeneral || '0906916816'}`} className="font-black text-[#8c5932] font-mono">
                      {siteConfig.hotlineGeneral || '0906 916 816'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Cột 4: Zalo Official Account & QR Code (Hoặc tùy biến theo Admin) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[#2b170e] text-xs font-black tracking-widest uppercase border-l-2 border-[#8c5932] pl-2">
                    {siteConfig.zaloOA?.title || 'Zalo Official Account'}
                  </h4>
                  {siteConfig.zaloOA?.badge && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 font-extrabold border border-blue-500/30">
                      {siteConfig.zaloOA.badge}
                    </span>
                  )}
                </div>

                {/* Chế độ hiển thị: zalo_only (mặc định) | both | branch_menu_only */}
                {siteConfig.zaloOA?.displayMode !== 'branch_menu_only' && (
                  <div className="p-3 rounded-2xl bg-white/75 border border-white/95 shadow-sm space-y-2 flex flex-col items-center text-center">
                    <div className="relative group p-1.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                      <img 
                        src={siteConfig.zaloOA?.qrImage || '/images/qr_zalo_oa.png'} 
                        alt="QR Zalo Official Account" 
                        className="w-20 h-20 sm:w-22 sm:h-22 object-contain rounded-lg group-hover:scale-105 transition-transform" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px] shadow-sm">
                        Z
                      </div>
                    </div>
                    
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-[#2b170e]">{siteConfig.zaloOA?.oaName || 'COFFEE 24/24'}</p>
                      <p className="text-[10.5px] text-[#704f38] leading-tight font-medium">
                        {siteConfig.zaloOA?.desc || 'Quét QR qua Zalo hoặc nhấn nút để nhận ưu đãi & tích điểm 24/7.'}
                      </p>
                    </div>

                    <a 
                      href={siteConfig.zaloOA?.url || 'https://zalo.me/197464281190102692'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[11px] font-black tracking-wide shadow-xs hover:shadow-md transition-all inline-flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>{siteConfig.zaloOA?.buttonText || 'Mở Zalo OA Nhận Ưu Đãi'}</span>
                      <ExternalLink className="w-3 h-3 text-white" />
                    </a>
                  </div>
                )}

                {/* Nếu admin cấu hình chế độ 'both' */}
                {siteConfig.zaloOA?.displayMode === 'both' && (
                  <div className="pt-2 border-t border-white/60">
                    <p className="text-[10px] font-bold text-[#8c5932] uppercase tracking-wider mb-1">Hoặc Quét Menu Tại Bàn:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="p-1.5 rounded-xl bg-white/60 border border-white/80 text-center">
                        <img src="/images/qr_menu_phihuyich.png" alt="QR 413PHI" className="w-10 h-10 object-contain mx-auto" />
                        <span className="text-[9px] font-bold text-[#2b170e] block">413PHI</span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-white/60 border border-white/80 text-center">
                        <img src="/images/qr_menu_d5.png" alt="QR 96D5" className="w-10 h-10 object-contain mx-auto" />
                        <span className="text-[9px] font-bold text-[#2b170e] block">96D5</span>
                      </div>
                    </div>
                  </div>
                )}

                {siteConfig.zaloOA?.displayMode === 'branch_menu_only' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-white/70 border border-white/90 text-center flex flex-col items-center">
                      <img src="/images/qr_menu_phihuyich.png" alt="QR 413PHI" className="w-16 h-16 object-contain" />
                      <span className="text-[10px] font-bold text-[#2b170e] mt-1">Menu 413PHI</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white/70 border border-white/90 text-center flex flex-col items-center">
                      <img src="/images/qr_menu_d5.png" alt="QR 96D5" className="w-16 h-16 object-contain" />
                      <span className="text-[10px] font-bold text-[#2b170e] mt-1">Menu 96D5</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Back to Top Prompt */}
            <div className="flex justify-center">
              <button
                onClick={() => goToSlide(0)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/50 hover:bg-white text-[#2b170e] text-xs font-bold border border-white/80 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#8c5932]" />
                <span>Về đầu trang</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
