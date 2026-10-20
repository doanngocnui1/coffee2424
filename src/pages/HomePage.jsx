import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Coffee, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ShoppingBag, 
  Percent, 
  Copy, 
  Check, 
  Star, 
  Zap, 
  Wifi, 
  Wind, 
  Armchair, 
  Clock, 
  MapPin, 
  ChevronDown, 
  Heart, 
  Compass, 
  Tag, 
  Volume2, 
  Eye, 
  Sun, 
  UtensilsCrossed, 
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  MessageSquare,
  Share2,
  BarChart3,
  HelpCircle,
  Award,
  Film,
  Layout,
  PhoneCall
} from 'lucide-react';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import SocialFollowSection, { BrandIcons } from '../components/SocialFollowSection';
import { getSiteConfig, DEFAULT_SITE_CONFIG } from '../data/siteConfig';
import { getOfferingIconComponent } from '../components/admin/AdminOfferingsManager';
import { 
  CustomBannerSection, 
  StatsSection, 
  FeaturesSection, 
  VideoSection, 
  FaqSection, 
  BranchesSection 
} from '../components/home/CustomHomeSections';
import { 
  getLayerTextShadow, 
  getLayerAnimationClass, 
  getLayerBadgeClass 
} from '../data/bannerDesignerPresets';

const AMENITY_ICONS = {
  zap: Zap,
  compass: Compass,
  sun: Sun,
  volume2: Volume2,
  wind: Wind,
  armchair: Armchair,
  wifi: Wifi,
  coffee: Coffee
};

const AMENITY_COLORS = {
  amber: 'bg-amber-500/15 text-amber-700',
  emerald: 'bg-emerald-500/15 text-emerald-700',
  orange: 'bg-orange-500/15 text-orange-600',
  indigo: 'bg-indigo-500/15 text-indigo-600',
  teal: 'bg-teal-500/15 text-teal-700',
  rose: 'bg-rose-500/15 text-rose-600',
  cyan: 'bg-cyan-500/15 text-cyan-700',
  purple: 'bg-purple-500/15 text-purple-700'
};

export default function HomePage({ navigate, onSelectBranch }) {
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);
  const [selectedOfferingIndex, setSelectedOfferingIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeNavSection, setActiveNavSection] = useState('hero');
  const [scrollY, setScrollY] = useState(0);
  const [newDishesIndex, setNewDishesIndex] = useState(0);
  const [promotionsIndex, setPromotionsIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [touchDishesStartX, setTouchDishesStartX] = useState(null);
  const [touchPromosStartX, setTouchPromosStartX] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Responsive resize listener for Món Mới carousel (3 on desktop, 1 on mobile)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync site config updates
  useEffect(() => {
    const handleConfigUpdate = () => setSiteConfig(getSiteConfig());
    window.addEventListener('site-config-updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);
    return () => {
      window.removeEventListener('site-config-updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  // Continuous Scroll Listener for Animations & Companion Tracker
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);

      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = winHeight > 0 ? Math.min(100, Math.max(0, Math.round((currentY / winHeight) * 100))) : 0;
      setScrollProgress(progress);

      // Detect active section based on scroll offset
      const sections = [
        { id: 'hero', offset: 0 },
        { id: 'new-dishes', el: document.getElementById('new-dishes') },
        { id: 'promotions', el: document.getElementById('promotions') },
        { id: 'amenities', el: document.getElementById('amenities') },
        { id: 'menu', el: document.getElementById('menu') },
        { id: 'reviews', el: document.getElementById('reviews') },
        { id: 'social', el: document.getElementById('social') }
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec.el) {
          const top = sec.el.getBoundingClientRect().top;
          if (top <= window.innerHeight * 0.45) {
            setActiveNavSection(sec.id);
            break;
          }
        } else if (i === 0) {
          setActiveNavSection('hero');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // 7 Core Product & Service Offerings (Unified Storytelling Collection)
  const rawOfferings = (siteConfig.offeringsList && siteConfig.offeringsList.length > 0)
    ? siteConfig.offeringsList 
    : (DEFAULT_SITE_CONFIG.offeringsList || []);

  const ALL_STORY_OFFERINGS = rawOfferings.map(item => ({
    ...item,
    icon: typeof item.icon === 'string' ? getOfferingIconComponent(item.icon) : (item.icon || Coffee)
  }));

  const offeringsSectionConfig = siteConfig.offeringsSection || DEFAULT_SITE_CONFIG.offeringsSection || {
    enabled: true,
    title: 'COFFEE 24/24 BÁN GÌ?',
    quote: 'Chúng tôi có bán nhiều loại thức uống từ cà phê, matcha, matcha mk4, trà trái cây, trà trái cây tươi, trà sữa, thức uống chế biến từ cacao, các món đá xay, và phục vụ các loại thức ăn.'
  };

  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // 3 Highlight Posters Món Mới Dọc 3x4
  const defaultNewDishes = [
    {
      id: 'dish-1',
      tag: 'MÓN MỚI',
      title: 'Matcha MK4 Latte & Cold Brew Cam Vàng',
      price: '45.000đ',
      image: '/images/promo_banner.jpg',
      cta: 'Thử Món Mới',
      link: '/dathang'
    },
    {
      id: 'dish-2',
      tag: 'SIGNATURE',
      title: 'Cà Phê Muối Kem Béo & Bạc Xỉu 3 Tầng',
      price: '39.000đ',
      image: '/images/signature_drinks.jpg',
      cta: 'Đặt Món Ngay',
      link: '/dathang'
    },
    {
      id: 'dish-3',
      tag: 'BÁNH TƯƠI',
      title: 'Croissant Bơ Pháp Nướng & Bánh Mì Que',
      price: '29.000đ',
      image: '/images/journey_espresso.jpg',
      cta: 'Thưởng Thức',
      link: '/dathang'
    }
  ];

  // 3 Highlight Posters Chương Trình Ưu Đãi Dọc 3x4
  const defaultPromotions = [
    {
      id: 'promo-1',
      tag: 'COMBO HOT',
      title: 'Combo Sáng & Đêm Khuya 69K',
      discount: 'CHỈ 69.000đ',
      image: '/images/signature_drinks.jpg',
      cta: 'Đặt Combo 69K',
      link: '/dathang'
    },
    {
      id: 'promo-2',
      tag: 'GIỜ VÀNG',
      title: 'Happy Hour 16:00 - 19:00 Mỗi Ngày',
      discount: 'GIẢM 40%',
      image: '/images/journey_espresso.jpg',
      cta: 'Lấy Mã Giảm',
      link: '/khuyenmai'
    },
    {
      id: 'promo-3',
      tag: 'HỌC NHÓM',
      title: 'Đi 4 Tính Tiền 3 - Cày Deadline Thâu Đêm',
      discount: 'MUA 3 TẶNG 1',
      image: '/images/promo_banner.jpg',
      cta: 'Xem Chi Tiết',
      link: '/khuyenmai'
    }
  ];

  const newDishesItems = (siteConfig.newDishesList && siteConfig.newDishesList.length > 0)
    ? siteConfig.newDishesList
    : (siteConfig.homePosters && siteConfig.homePosters.length > 0 ? siteConfig.homePosters : defaultNewDishes);

  const promotionsItems = (siteConfig.promotionsList && siteConfig.promotionsList.length > 0)
    ? siteConfig.promotionsList
    : defaultPromotions;

  const fallbackOffering = {
    id: 'offering-coffee',
    tabLabel: 'Cà Phê',
    category: 'TỪ CÀ PHÊ RANG MỘC NGUYÊN BẢN',
    badge: '100% Rang Mộc',
    title: 'Cà Phê Rang Mộc & Cold Brew',
    subtitle: 'Khởi đầu sự tỉnh táo & tập trung cao độ',
    icon: Coffee,
    highlights: ['100% Robusta & Arabica Cầu Đất', 'Rang mộc nguyên chất'],
    story: 'Chúng tôi tuyển chọn 100% hạt Robusta Đắk Lắk và Arabica Cầu Đất thơm nồng nàn.',
    image: '/images/hero_banner.jpg',
    ctaText: 'Xem Chi Tiết Món & Đặt Ngay',
    ctaLink: '/dathang'
  };

  const safeOfferingIndex = (ALL_STORY_OFFERINGS && ALL_STORY_OFFERINGS.length > 0)
    ? Math.min(Math.max(0, selectedOfferingIndex), ALL_STORY_OFFERINGS.length - 1)
    : 0;

  const activeOffering = (ALL_STORY_OFFERINGS && ALL_STORY_OFFERINGS[safeOfferingIndex]) || fallbackOffering;
  const ActiveIcon = activeOffering?.icon || Coffee;

  // 16:9 Hero Media detection (Image, GIF, Video)
  const heroMedia = siteConfig.heroBanner16x9?.mediaUrl || siteConfig.heroSection?.items?.[0]?.image || '/images/hero_banner.jpg';
  const isHeroVideo = (() => {
    if (siteConfig.heroBanner16x9?.type === 'video') return true;
    if (!heroMedia || typeof heroMedia !== 'string') return false;
    const clean = heroMedia.toLowerCase().split('?')[0];
    return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov') || clean.endsWith('.ogg') || heroMedia.startsWith('data:video/');
  })();

  const isFixedBg = siteConfig.heroBanner16x9?.fixedBackground === true;
  const heroLayers = siteConfig.heroBanner16x9?.layers || [];
  const heroFilter = siteConfig.heroBanner16x9?.filter || {};
  const heroFilterStyle = {
    filter: `brightness(${heroFilter.brightness ?? 100}%) contrast(${heroFilter.contrast ?? 100}%) saturate(${heroFilter.saturation ?? 100}%) blur(${heroFilter.blur ?? 0}px)`
  };

  const dynamicHomeSections = (siteConfig.homeSections && siteConfig.homeSections.length > 0)
    ? siteConfig.homeSections
    : (DEFAULT_SITE_CONFIG.homeSections || []);

  return (
    <div className="relative w-full font-sans select-none pb-12 overflow-hidden text-[#2b170e]">

      {/* FLOATING TOAST COPIED VOUCHER FEEDBACK (CỐ ĐỊNH TRÊN MÀN HÌNH QUA PORTAL) */}
      {copiedCode && mounted && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 z-50 bg-[#2b170e] text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <div className="text-sm font-bold text-amber-200">Đã sao chép mã: <span className="font-mono text-white text-base font-black">{copiedCode}</span></div>
            <div className="text-xs text-stone-300">Dán vào ô mã giảm giá khi đặt món để nhận ưu đãi ngay!</div>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          ANIMATED SCROLL COMPANION (BIỂU TƯỢNG VÀ TIẾN TRÌNH CUỘN CỐ ĐỊNH TRÊN MÀN HÌNH QUA PORTAL)
          ========================================================================= */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <aside 
          aria-label="Thanh tiến trình cuộn trang"
          className="fixed right-3.5 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-2.5 p-2 rounded-full bg-white/75 backdrop-blur-2xl border border-white/90 shadow-[0_12px_40px_rgba(43,23,14,0.15)] transition-all duration-300 group hover:shadow-2xl pointer-events-auto"
        >
          {/* Animated Rotating Cup with Steam / Brand Logo */}
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2b170e] to-[#160a05] text-amber-200 flex items-center justify-center shadow-md relative cursor-pointer hover:scale-105 active:scale-95 transition-transform overflow-hidden ring-1 ring-amber-500/30"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Nhấn để cuộn lên đầu trang"
          >
            {siteConfig.logo ? (
              <img 
                src={siteConfig.logo} 
                alt={siteConfig.brandName || "Logo"} 
                className="w-full h-full object-cover rounded-full" 
              />
            ) : (
              <Coffee 
                className="w-5 h-5 text-amber-200 transition-transform duration-200" 
                style={{ transform: `rotate(${scrollY * 0.12}deg)` }}
              />
            )}
            {/* Steam bubble */}
            <span className="absolute -top-1 w-1.5 h-3 rounded-full bg-amber-300/80 blur-[0.5px] animate-steam pointer-events-none" />
          </div>

          {/* Scroll Progress Indicator Pill */}
          <div className="flex flex-col items-center gap-1 py-1">
            <span className="text-[10px] font-black text-[#8c5932] tracking-tighter">
              {scrollProgress}%
            </span>
            <div className="w-1.5 h-20 bg-stone-300/60 rounded-full overflow-hidden relative">
              <div 
                className="w-full bg-gradient-to-b from-amber-600 to-[#2b170e] rounded-full transition-all duration-150"
                style={{ height: `${scrollProgress}%` }}
              />
            </div>
          </div>

          {/* Quick Section Jump Dots */}
          <div className="flex flex-col items-center gap-2 pt-1 pb-1">
            {[
              { id: 'hero', label: '01 Trang Đầu' },
              { id: 'new-dishes', label: '02 Món Mới' },
              { id: 'promotions', label: '03 Ưu Đãi' },
              { id: 'amenities', label: '04 Không Gian' },
              { id: 'menu', label: '05 Thực Đơn' },
              { id: 'reviews', label: '06 Đánh Giá' },
              { id: 'social', label: '07 Kết Nối' }
            ].map(dot => (
              <button
                key={dot.id}
                onClick={() => scrollToSection(dot.id)}
                className="group/dot relative p-1 cursor-pointer"
                title={dot.label}
              >
                <div 
                  className={`transition-all duration-300 rounded-full ${
                    activeNavSection === dot.id
                      ? 'w-2.5 h-5 bg-[#2b170e] shadow-xs ring-2 ring-amber-500/40'
                      : 'w-2 h-2 bg-[#8c5932]/40 hover:bg-[#8c5932] hover:scale-125'
                  }`}
                />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#2b170e] text-white whitespace-nowrap opacity-0 group-hover/dot:opacity-100 pointer-events-none transition-opacity shadow-lg">
                  {dot.label}
                </span>
              </button>
            ))}
          </div>
        </aside>,
        document.body
      )}

      {/* PARALLAX DRIFTING PARTICLES IN BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute -top-10 left-10 w-24 h-24 rounded-full bg-amber-400/20 blur-xl transition-transform duration-700"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        />
        <div 
          className="absolute top-1/3 right-10 w-32 h-32 rounded-full bg-orange-400/15 blur-2xl transition-transform duration-700"
          style={{ transform: `translateY(-${scrollY * 0.06}px)` }}
        />
        <div 
          className="absolute top-2/3 left-1/4 w-40 h-40 rounded-full bg-amber-500/15 blur-2xl transition-transform duration-700"
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        />
      </div>

            {/* =========================================================================
          DYNAMIC HOMEPAGE SECTIONS: RENDER THEO BỐ CỤC ĐỘNG TỪ TRANG ADMIN (PAGE BUILDER)
          ========================================================================= */}
      {dynamicHomeSections.map((sec, secIdx) => {
        if (sec.enabled === false) return null;
        const sectionKey = sec.id || `home-sec-${sec.type}-${secIdx}`;

        // 1. Khối tùy biến từ Page Builder Studio (+ THÊM THÀNH PHẦN)
        if (sec.type === 'customBanner') {
          return <CustomBannerSection key={sectionKey} data={sec.data} title={sec.title} navigate={navigate} />;
        }
        if (sec.type === 'stats') {
          return <StatsSection key={sectionKey} data={sec.data} title={sec.title} />;
        }
        if (sec.type === 'features') {
          return <FeaturesSection key={sectionKey} data={sec.data} title={sec.title} />;
        }
        if (sec.type === 'video') {
          return <VideoSection key={sectionKey} data={sec.data} title={sec.title} />;
        }
        if (sec.type === 'faq') {
          return <FaqSection key={sectionKey} data={sec.data} title={sec.title} />;
        }
        if (sec.type === 'branches') {
          return <BranchesSection key={sectionKey} data={sec.data} title={sec.title} />;
        }

        // 2. Khối cốt lõi: Hero 16:9 Banner / Video / Layers
        if (sec.type === 'hero') {
          return (
            <React.Fragment key={sectionKey}>
              {/* =========================================================================
          1. HERO SECTION: ẢNH BÌA / GIF / VIDEO TỈ LỆ 16:9 TRÀN VIỀN (FULL-BLEED)
          ========================================================================= */}
      <section 
        id="hero" 
        className="relative w-full p-0 pb-10 sm:pb-16 mt-0"
      >
        <div 
          onClick={() => {
            const link = siteConfig.heroBanner16x9?.link || '/dathang';
            if (link) {
              if (link.startsWith('http')) {
                window.open(link, '_blank');
              } else {
                navigate(link);
              }
            }
          }}
          className="relative w-full aspect-[16/9] overflow-hidden bg-stone-900 group cursor-pointer shadow-[0_20px_60px_rgba(43,23,14,0.18)]"
        >
          {isHeroVideo ? (
            <video
              src={heroMedia}
              autoPlay
              loop
              muted
              playsInline
              style={heroFilterStyle}
              className={`w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ${isFixedBg ? 'fixed top-0 left-0 w-full h-full pointer-events-none -z-10 object-cover' : ''}`}
            />
          ) : isFixedBg ? (
            <div 
              role="img"
              aria-label={siteConfig.heroBanner16x9?.alt || 'COFFEE 24/24'}
              style={{
                backgroundImage: `url(${heroMedia})`,
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center top',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                ...heroFilterStyle
              }}
              className="w-full h-full group-hover:scale-102 transition-transform duration-700"
            />
          ) : (
            <img 
              src={heroMedia} 
              alt={siteConfig.heroBanner16x9?.alt || 'COFFEE 24/24'}
              style={heroFilterStyle}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" 
            />
          )}

          {/* Dark Overlay Tint if configured */}
          {(heroFilter.overlayDarkness ?? 10) > 0 && (
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300" 
              style={{ 
                backgroundColor: heroFilter.overlayColor || '#000000',
                opacity: (heroFilter.overlayDarkness ?? 10) / 100 
              }} 
            />
          )}

          {/* Top Subtle Vignette to give floating frosted header ultra-crisp specular separation */}
          {heroFilter.vignette !== false && (
            <div className="absolute top-0 inset-x-0 h-28 sm:h-44 bg-gradient-to-b from-black/40 via-black/10 to-transparent pointer-events-none" />
          )}

          {/* DESIGNER OVERLAY LAYERS (CHỮ & HÌNH ẢNH / STICKER TỰ THIẾT KẾ) */}
          {heroLayers.map((layer) => {
            if (layer.visible === false) return null;

            const isText = layer.type === 'text';
            const animClass = getLayerAnimationClass(layer.animation);
            const badgeClass = isText ? getLayerBadgeClass(layer.bgBadge) : '';
            const textShadow = isText ? getLayerTextShadow(layer) : 'none';

            return (
              <div
                key={layer.id}
                onClick={(e) => {
                  if (layer.link) {
                    e.stopPropagation();
                    if (layer.link.startsWith('http')) {
                      window.open(layer.link, '_blank');
                    } else {
                      navigate(layer.link);
                    }
                  }
                }}
                className={`absolute select-none pointer-events-auto transition-transform ${animClass} ${layer.link ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation || 0}deg)`,
                  '--layer-rotate': `${layer.rotation || 0}deg`,
                  zIndex: layer.zIndex || 10
                }}
              >
                {isText ? (
                  <div
                    className={`${badgeClass} inline-block transition-all`}
                    style={{
                      fontFamily: `'${layer.fontFamily || 'Montserrat'}', sans-serif`,
                      fontSize: `clamp(${Math.max(11, Math.round((layer.fontSize || 32) * 0.42))}px, ${(((layer.fontSize || 32) / 1440) * 100).toFixed(3)}vw, ${(layer.fontSize || 32)}px)`,
                      fontWeight: layer.fontWeight || '700',
                      fontStyle: layer.fontStyle || 'normal',
                      textDecoration: layer.textDecoration || 'none',
                      textTransform: layer.textTransform || 'none',
                      textAlign: layer.textAlign || 'center',
                      color: layer.color || '#ffffff',
                      letterSpacing: `${layer.letterSpacing || 0}px`,
                      lineHeight: layer.lineHeight || 1.25,
                      textShadow: textShadow,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {layer.text || ''}
                  </div>
                ) : (
                  <div
                    className="inline-block transition-all"
                    style={{
                      width: `clamp(36px, ${(layer.width || 15)}vw, 600px)`,
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

          {/* Subtle Glare reflection highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />
        </div>
      </section>
            </React.Fragment>
          );
        }

        // 3. Khối cốt lõi: Món Mới Trình Làng
        if (sec.type === 'newDishes') {
          return (
            <React.Fragment key={sectionKey}>
              {/* =========================================================================
          2A. SECTION: MÓN MỚI TRÌNH LÀNG (POSTER DỌC 3:4)
          ========================================================================= */}
      {siteConfig.newDishesSection?.enabled !== false && (
        <section 
          id="new-dishes" 
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
        >
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
            {siteConfig.newDishesSection?.showBadge !== false && (siteConfig.newDishesSection?.badge || 'MENU MỚI TRÌNH LÀNG') && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white/90 text-[#8c5932] text-xs sm:text-sm font-black uppercase tracking-wider shadow-xs">
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <span>{siteConfig.newDishesSection?.badge || 'MENU MỚI TRÌNH LÀNG'}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase leading-[1.3] sm:leading-[1.35]">
              {siteConfig.newDishesSection?.title || 'Món Mới Nổi Bật'}{' '}
              <br className="hidden sm:inline" />
              <span className="text-[#8c5932] inline-block mt-1 sm:mt-2">
                {siteConfig.newDishesSection?.highlightTitle || 'Đánh Thức Vị Giác'}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#5c3d2e] font-medium leading-relaxed max-w-xl mx-auto">
              {siteConfig.newDishesSection?.subtitle || 'Khám phá các thức uống sáng tạo và bánh nướng tươi ngon vừa ra mắt tại COFFEE 24/24.'}
            </p>
          </div>

          {/* Carousel Container: 3 món trên máy tính, 1 món trên điện thoại */}
          {(() => {
            const visibleCount = isMobile ? 1 : 3;
            const maxIndex = Math.max(0, newDishesItems.length - visibleCount);
            const safeIndex = Math.min(newDishesIndex, maxIndex);
            const showNav = newDishesItems.length > visibleCount;

            const handlePrev = () => {
              setNewDishesIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
            };

            const handleNext = () => {
              setNewDishesIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
            };

            return (
              <div className="relative group/carousel px-0 sm:px-2">
                {/* Navigation Arrow Left */}
                {showNav && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-stone-200/90 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md group"
                    aria-label="Xem món mới trước đó"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
                  </button>
                )}

                {/* Navigation Arrow Right */}
                {showNav && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-stone-200/90 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md group"
                    aria-label="Xem món mới tiếp theo"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}

                {/* Carousel Overflow Track */}
                <div 
                  className="overflow-hidden w-full py-2"
                  onTouchStart={(e) => setTouchDishesStartX(e.targetTouches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchDishesStartX === null) return;
                    const diff = touchDishesStartX - e.changedTouches[0].clientX;
                    if (diff > 45) handleNext();
                    else if (diff < -45) handlePrev();
                    setTouchDishesStartX(null);
                  }}
                >
                  <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${safeIndex * (100 / visibleCount)}%)`
                    }}
                  >
                    {newDishesItems.map((dish, idx) => (
                      <div 
                        key={dish.id || idx}
                        className="w-full md:w-1/3 shrink-0 p-2 sm:p-3"
                      >
                        <div className="ios-glass-card rounded-[32px] overflow-hidden p-3.5 sm:p-4 border border-white/85 shadow-lg group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full bg-white/70 backdrop-blur-xl">
                          {/* 3:4 Vertical Poster Container */}
                          <div 
                            onClick={() => navigate(dish.link || '/dathang')}
                            className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-stone-900 shadow-inner cursor-pointer"
                          >
                            <img 
                              src={dish.image} 
                              alt={dish.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            {dish.tag && (
                              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-[11px] font-black uppercase tracking-wider shadow-md bg-black/60 backdrop-blur-md border border-white/20">
                                {dish.tag}
                              </span>
                            )}
                            {(dish.price || dish.discount) && (
                              <span className="absolute bottom-3 right-3 px-3.5 py-1 rounded-full bg-amber-400 text-[#1a0a04] font-mono text-xs font-black shadow-md">
                                {dish.price || dish.discount}
                              </span>
                            )}
                          </div>

                          {/* Minimal Text: Tiêu đề & Nút đặt món */}
                          <div className="pt-3.5 pb-1 px-1 flex items-center justify-between gap-3">
                            <h3 
                              onClick={() => navigate(dish.link || '/dathang')}
                              className="text-base sm:text-lg font-black text-[#2b170e] truncate group-hover:text-[#8c5932] transition-colors cursor-pointer" 
                              title={dish.title}
                            >
                              {dish.title}
                            </h3>
                            <button
                              type="button"
                              onClick={() => navigate(dish.link || '/dathang')}
                              className="shrink-0 px-4 py-2 rounded-full bg-[#2b170e] hover:bg-amber-600 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <span>{dish.cta || 'Thử Ngay'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots Indicator */}
                {showNav && maxIndex > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
                    {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setNewDishesIndex(dotIdx)}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          safeIndex === dotIdx 
                            ? 'w-8 bg-[#8c5932] shadow-xs' 
                            : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                        }`}
                        aria-label={`Chuyển đến trang món mới ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Section Footer CTA */}
          <div className="mt-8 sm:mt-10 text-center">
            <button
              onClick={() => navigate('/dathang')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/70 hover:bg-white text-[#2b170e] text-xs sm:text-sm font-bold border border-white/90 shadow-sm transition-all cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#8c5932]" />
              <span>Xem Toàn Bộ Thực Đơn & Đặt Món Trực Tiếp</span>
              <ChevronRight className="w-4 h-4 text-[#8c5932]" />
            </button>
          </div>
        </section>
      )}
            </React.Fragment>
          );
        }

        // 4. Khối cốt lõi: Chương Trình Ưu Đãi
        if (sec.type === 'promotions') {
          return (
            <React.Fragment key={sectionKey}>
              {/* =========================================================================
          2B. SECTION: CHƯƠNG TRÌNH ƯU ĐÃI (POSTER DỌC 3:4)
          ========================================================================= */}
      {siteConfig.promotionsSection?.enabled !== false && (
        <section 
          id="promotions" 
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
        >
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
            {siteConfig.promotionsSection?.showBadge !== false && (siteConfig.promotionsSection?.badge || 'ƯU ĐÃI ĐẶC QUYỀN') && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white/90 text-rose-700 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xs">
                <Percent className="w-4 h-4 text-rose-600" />
                <span>{siteConfig.promotionsSection?.badge || 'ƯU ĐÃI ĐẶC QUYỀN'}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase leading-[1.3] sm:leading-[1.35]">
              {siteConfig.promotionsSection?.title || 'Chương Trình Ưu Đãi'}{' '}
              <br className="hidden sm:inline" />
              <span className="text-[#8c5932] inline-block mt-1 sm:mt-2">
                {siteConfig.promotionsSection?.highlightTitle || 'Dành Riêng Cho Bạn'}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#5c3d2e] font-medium leading-relaxed max-w-xl mx-auto">
              {siteConfig.promotionsSection?.subtitle || 'Tổng hợp các voucher giảm giá, combo tiết kiệm và giờ vàng ưu đãi dành cho học sinh, sinh viên và cộng đồng chạy deadline.'}
            </p>
          </div>

          {/* Carousel Container: 3 ưu đãi trên máy tính, 1 trên điện thoại */}
          {(() => {
            const visibleCount = isMobile ? 1 : 3;
            const maxIndex = Math.max(0, promotionsItems.length - visibleCount);
            const safeIndex = Math.min(promotionsIndex, maxIndex);
            const showNav = promotionsItems.length > visibleCount;

            const handlePrev = () => {
              setPromotionsIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
            };

            const handleNext = () => {
              setPromotionsIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
            };

            return (
              <div className="relative group/carousel px-0 sm:px-2">
                {/* Navigation Arrow Left */}
                {showNav && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-stone-200/90 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md group"
                    aria-label="Xem ưu đãi trước đó"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
                  </button>
                )}

                {/* Navigation Arrow Right */}
                {showNav && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-stone-200/90 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md group"
                    aria-label="Xem ưu đãi tiếp theo"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}

                {/* Carousel Overflow Track */}
                <div 
                  className="overflow-hidden w-full py-2"
                  onTouchStart={(e) => setTouchPromosStartX(e.targetTouches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchPromosStartX === null) return;
                    const diff = touchPromosStartX - e.changedTouches[0].clientX;
                    if (diff > 45) handleNext();
                    else if (diff < -45) handlePrev();
                    setTouchPromosStartX(null);
                  }}
                >
                  <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${safeIndex * (100 / visibleCount)}%)`
                    }}
                  >
                    {promotionsItems.map((promo, idx) => (
                      <div 
                        key={promo.id || idx}
                        className="w-full md:w-1/3 shrink-0 p-2 sm:p-3"
                      >
                        <div className="ios-glass-card rounded-[32px] overflow-hidden p-3.5 sm:p-4 border border-white/85 shadow-lg group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full bg-white/70 backdrop-blur-xl">
                          {/* 3:4 Vertical Poster Container */}
                          <div 
                            onClick={() => navigate(promo.link || '/khuyenmai')}
                            className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-stone-900 shadow-inner cursor-pointer"
                          >
                            <img 
                              src={promo.image} 
                              alt={promo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            {promo.tag && (
                              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-[11px] font-black uppercase tracking-wider shadow-md bg-black/60 backdrop-blur-md border border-white/20">
                                {promo.tag}
                              </span>
                            )}
                            {(promo.discount || promo.price) && (
                              <span className="absolute bottom-3 right-3 px-3.5 py-1 rounded-full bg-rose-500 text-white font-mono text-xs font-black shadow-md">
                                {promo.discount || promo.price}
                              </span>
                            )}
                          </div>

                          {/* Minimal Text: Tiêu đề & Nút xem ưu đãi */}
                          <div className="pt-3.5 pb-1 px-1 flex items-center justify-between gap-3">
                            <h3 
                              onClick={() => navigate(promo.link || '/khuyenmai')}
                              className="text-base sm:text-lg font-black text-[#2b170e] truncate group-hover:text-[#8c5932] transition-colors cursor-pointer" 
                              title={promo.title}
                            >
                              {promo.title}
                            </h3>
                            <button
                              type="button"
                              onClick={() => navigate(promo.link || '/khuyenmai')}
                              className="shrink-0 px-4 py-2 rounded-full bg-[#2b170e] hover:bg-rose-600 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <span>{promo.cta || 'Xem Ưu Đãi'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots Indicator */}
                {showNav && maxIndex > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
                    {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setPromotionsIndex(dotIdx)}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          safeIndex === dotIdx 
                            ? 'w-8 bg-[#8c5932] shadow-xs' 
                            : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                        }`}
                        aria-label={`Chuyển đến trang ưu đãi ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Section Footer CTA */}
          <div className="mt-8 sm:mt-10 text-center">
            <button
              onClick={() => navigate('/khuyenmai')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/70 hover:bg-white text-[#2b170e] text-xs sm:text-sm font-bold border border-white/90 shadow-sm transition-all cursor-pointer"
            >
              <Percent className="w-4 h-4 text-rose-600" />
              <span>Khám Phá Tất Cả Chương Trình Tại Trang Khuyến Mãi</span>
              <ChevronRight className="w-4 h-4 text-[#8c5932]" />
            </button>
          </div>
        </section>
      )}
            </React.Fragment>
          );
        }

        // 5. Khối cốt lõi: Không Gian & Tiện Nghi 24/7
        if (sec.type === 'spaceAmenities') {
          return (
            <React.Fragment key={sectionKey}>
              {/* =========================================================================
          3. SECTION: KHÔNG GIAN & TIỆN NGHI 24/7 (ĐIỀU KHIỂN TỪ TRANG ADMIN)
          ========================================================================= */}
      {(siteConfig.spaceAmenities?.enabled !== false) && (
        <section 
          id="amenities" 
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
        >
          <div className="relative rounded-[40px] sm:rounded-[56px] ios-glass-panel p-6 sm:p-10 lg:p-12 border border-white/90 shadow-[0_24px_70px_rgba(60,35,15,0.07)] space-y-8 sm:space-y-10">
            
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2b170e] tracking-tight uppercase leading-[1.3] sm:leading-[1.35]">
                {siteConfig.spaceAmenities?.title || 'Không Gian Lý Tưởng Cho'}{' '}
                <br className="hidden sm:inline" />
                <span className="text-[#8c5932] inline-block mt-1">
                  {siteConfig.spaceAmenities?.highlightTitle || 'Học Tập & Làm Việc'}
                </span>
              </h2>

              {/* Exactly User's Provided Paragraph in an Elegant Compact Box */}
              {siteConfig.spaceAmenities?.quote && (
                <p className="text-sm sm:text-base md:text-lg text-[#3d2417] font-medium leading-relaxed p-5 sm:p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-white/90 shadow-2xs italic">
                  “{siteConfig.spaceAmenities.quote}”
                </p>
              )}
            </div>

            {/* Sleek Compact Highlight Chips (Được cấu hình trong Admin) */}
            {(siteConfig.spaceAmenities?.chips || []).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
                {siteConfig.spaceAmenities.chips.map((chip, idx) => {
                  const IconComp = AMENITY_ICONS[chip.icon] || Zap;
                  const colorClass = AMENITY_COLORS[chip.color] || 'bg-amber-500/15 text-amber-700';
                  const isLastOdd = idx === (siteConfig.spaceAmenities.chips.length - 1) && (siteConfig.spaceAmenities.chips.length % 2 !== 0);

                  return (
                    <div 
                      key={chip.id || idx}
                      className={`flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/75 border border-white/90 shadow-2xs hover:bg-white transition-all ${
                        isLastOdd ? 'col-span-2 sm:col-span-1' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                        <IconComp className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#2b170e] truncate">{chip.title}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Photo Gallery Grid of Coffee Shop Spaces (Được cấu hình & upload từ Admin) */}
            {(siteConfig.spaceAmenities?.photos || []).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {siteConfig.spaceAmenities.photos.map((photo, idx) => (
                  <div key={photo.id || idx} className="h-52 sm:h-56 rounded-3xl overflow-hidden relative shadow-md group">
                    <img 
                      src={photo.image} 
                      alt={photo.title || `Không gian ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      onError={(e) => {
                        e.currentTarget.src = '/images/branch_downtown.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <span className="text-xs font-bold text-white line-clamp-1">{photo.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      )}
            </React.Fragment>
          );
        }

        // 6. Khối cốt lõi: Coffee 24/24 Bán Gì? (7 Bộ Sưu Tập Thức Uống & Món Ăn)
        if (sec.type === 'offerings') {
          if (offeringsSectionConfig.enabled === false) return null;
          return (
            <React.Fragment key={sectionKey}>
              {/* =========================================================================
          4. SECTION: COFFEE 24/24 BÁN GÌ? (TRÌNH DIỄN ĐƠN NHẤT & LIỀN MẠCH)
          ========================================================================= */}
      <section 
        id="menu" 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
      >
        {/* Section Header: Seamless & Editorial */}
        <div className="text-center max-w-4xl mx-auto space-y-3 mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase leading-[1.3] sm:leading-[1.35]">
            {offeringsSectionConfig.title || 'COFFEE 24/24 BÁN GÌ?'}
          </h2>

          {/* User's Exact Sentence Flowing Naturally */}
          {offeringsSectionConfig.quote && (
            <p className="text-base sm:text-lg md:text-xl text-[#4a3325] font-medium leading-relaxed max-w-3xl mx-auto italic pt-1">
              "{offeringsSectionConfig.quote}"
            </p>
          )}
        </div>

        {/* Interactive Segmented Switcher (7 Categories) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
          {ALL_STORY_OFFERINGS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === selectedOfferingIndex;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedOfferingIndex(idx)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2b170e] text-white shadow-lg scale-105 ring-2 ring-[#8c5932]/40'
                    : 'bg-white/75 hover:bg-white text-[#5c3d2e] border border-white/90 shadow-2xs hover:shadow-xs'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-[#8c5932]'}`} />
                <span>{item.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* The Single Unified Stage (Sân khấu đơn nhất, không phân mảnh nhiều thẻ) */}
        <div className="relative ios-glass-panel rounded-[36px] sm:rounded-[48px] p-4 sm:p-6 lg:p-8 border border-white/90 shadow-[0_24px_70px_rgba(60,35,15,0.08)] mt-6 sm:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left: 1:1 Square Image Canvas with Gorgeous Rounded Corners */}
            <div className="lg:col-span-6 xl:col-span-6 flex justify-center w-full">
              <div className="relative w-full aspect-square max-w-[540px] rounded-[28px] sm:rounded-[38px] overflow-hidden bg-stone-900 group shadow-[0_16px_40px_rgba(43,23,14,0.18)] border border-white/60">
                <img 
                  key={activeOffering.id}
                  src={activeOffering.image} 
                  alt={activeOffering.title} 
                  className="w-full h-full aspect-square object-cover transition-all duration-700 ease-out transform group-hover:scale-105 animate-in fade-in zoom-in-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                {/* Badge */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#2b170e]/90 backdrop-blur-md text-amber-200 text-xs font-bold border border-white/20 shadow-md">
                    {activeOffering.badge}
                  </span>
                </div>

                {/* Number indicator */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-mono font-bold border border-white/20">
                    0{selectedOfferingIndex + 1} / 0{ALL_STORY_OFFERINGS.length}
                  </span>
                </div>

                {/* Bottom controls on image */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
                  {/* 7 Progress Dots */}
                  <div className="flex items-center gap-1.5">
                    {ALL_STORY_OFFERINGS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedOfferingIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === selectedOfferingIndex ? 'w-7 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Chuyển đến phần ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Arrow Navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOfferingIndex((prev) => (prev === 0 ? ALL_STORY_OFFERINGS.length - 1 : prev - 1))}
                      className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all active:scale-95 cursor-pointer"
                      title="Trước đó"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedOfferingIndex((prev) => (prev === ALL_STORY_OFFERINGS.length - 1 ? 0 : prev + 1))}
                      className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all active:scale-95 cursor-pointer"
                      title="Tiếp theo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Rich Editorial Craft Narrative */}
            <div className="lg:col-span-6 xl:col-span-6 p-2 sm:p-4 lg:p-6 flex flex-col justify-between space-y-6 animate-in fade-in duration-300">
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-[#8c5932] text-xs font-black uppercase tracking-wider border border-white shadow-2xs">
                  <ActiveIcon className="w-3.5 h-3.5 text-[#8c5932]" />
                  <span>{activeOffering.category}</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2b170e] leading-[1.25]">
                    {activeOffering.title}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-[#8c5932] mt-1.5">
                    {activeOffering.subtitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#4a3225] leading-relaxed font-normal pt-1">
                  {activeOffering.story}
                </p>

                {/* Highlights */}
                <div className="pt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#7a5843] block mb-2.5">
                    Món đặc trưng nổi bật:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeOffering.highlights.map((dish, idx) => (
                      <span 
                        key={idx}
                        className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-white/90 border border-white text-[#2b170e] font-semibold shadow-2xs flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link to Full Menu */}
              <div className="pt-6 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => {
                    const ctaLink = activeOffering.ctaLink || '/dathang';
                    if (ctaLink.startsWith('http')) window.open(ctaLink, '_blank');
                    else navigate(ctaLink);
                  }}
                  className="ios-btn-primary px-7 py-3.5 rounded-full font-bold text-sm tracking-wide cursor-pointer inline-flex items-center gap-2.5 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>{activeOffering.ctaText || 'Xem Chi Tiết Món & Đặt Ngay'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={() => scrollToSection('amenities')}
                  className="text-xs sm:text-sm font-bold text-[#8c5932] hover:text-[#2b170e] transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Khám phá không gian</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Global CTA Banner to Ordering Page */}
        <div className="mt-12 sm:mt-14 text-center">
          <div className="max-w-2xl mx-auto p-6 sm:p-7 rounded-[32px] bg-white/75 backdrop-blur-xl border border-white/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#2b170e]">
                Xem Bảng Giá Chi Tiết & Tùy Chọn Topping?
              </h4>
              <p className="text-xs text-[#5c3d2e] leading-relaxed mt-0.5">
                Đầy đủ size M/L, độ ngọt, mức đá và bếp nóng giao tận nơi hoặc tại bàn.
              </p>
            </div>
            <button
              onClick={() => navigate('/dathang')}
              className="px-6 py-3 rounded-full ios-btn-primary font-bold text-xs sm:text-sm tracking-wide cursor-pointer whitespace-nowrap shadow-sm"
            >
              Đặt Món Trực Tuyến
            </button>
          </div>
        </div>
      </section>
            </React.Fragment>
          );
        }

        // 7. Khối cốt lõi: Khách Hàng Đánh Giá
        if (sec.type === 'reviews') {
          return (
            <React.Fragment key={sectionKey}>
              {/* =========================================================================
          5. SECTION: KHÁCH HÀNG ĐÁNH GIÁ NHƯ THẾ NÀO VỀ CHÚNG TÔI? (ĐIỀU KHIỂN TỪ ADMIN)
          ========================================================================= */}
      {siteConfig.reviewsSection?.enabled !== false && (
        <section 
          id="reviews" 
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
        >
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-14">
            {siteConfig.reviewsSection?.showBadge !== false && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white/90 text-[#8c5932] text-xs sm:text-sm font-black uppercase tracking-wider shadow-xs">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{siteConfig.reviewsSection?.badge || 'CẢM NHẬN THỰC TẾ'}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase leading-[1.3] sm:leading-[1.35]">
              {siteConfig.reviewsSection?.title || 'Khách Hàng Đánh Giá'}{' '}
              <br className="hidden sm:inline" />
              <span className="text-[#8c5932] inline-block mt-1 sm:mt-2">
                {siteConfig.reviewsSection?.highlightTitle || 'Như Thế Nào Về Chúng Tôi?'}
              </span>
            </h2>

            {siteConfig.reviewsSection?.subtitle && (
              <p className="text-base sm:text-lg text-[#5c3d2e] font-medium leading-relaxed">
                {siteConfig.reviewsSection.subtitle}
              </p>
            )}
          </div>

          {/* Embed Customer Reviews Component */}
          <div className="w-full">
            <CustomerReviewsSection reviewsConfig={siteConfig.reviewsSection} />
          </div>
        </section>
      )}
            </React.Fragment>
          );
        }

        // 8. Khối cốt lõi: Kết Nối Mạng Xã Hội
        if (sec.type === 'social') {
          return (
            <React.Fragment key={sectionKey}>
              {/* =========================================================================
          6. SECTION: KẾT NỐI VỚI COFFEE 24/24 QUA MẠNG XÃ HỘI
          ========================================================================= */}
      <section 
        id="social" 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
      >
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white/90 text-[#8c5932] text-xs sm:text-sm font-black uppercase tracking-wider shadow-xs">
            <Share2 className="w-4 h-4 text-[#8c5932]" />
            <span>CỘNG ĐỒNG & KẾT NỐI</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase leading-[1.3] sm:leading-[1.35]">
            Kết Nối Với <span className="text-[#8c5932]">COFFEE 24/24</span> <br className="hidden sm:inline" />
            <span className="inline-block mt-1 sm:mt-2.5">Qua Mạng Xã Hội</span>
          </h2>

          <p className="text-base sm:text-lg text-[#5c3d2e] font-medium leading-relaxed">
            Theo dõi fanpage, tiktok và kênh chính thức để nhận ngay tin tức mới nhất & ưu đãi bí mật.
          </p>
        </div>

        {/* Social Follow Section */}
        <div className="w-full">
          <SocialFollowSection />
        </div>
      </section>
            </React.Fragment>
          );
        }

        return null;
      })}

    </div>
  );
}
