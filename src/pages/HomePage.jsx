import React, { useState, useEffect } from 'react';
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
  Share2
} from 'lucide-react';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import SocialFollowSection, { BrandIcons } from '../components/SocialFollowSection';
import { getSiteConfig } from '../data/siteConfig';
import { 
  getLayerTextShadow, 
  getLayerAnimationClass, 
  getLayerBadgeClass 
} from '../data/bannerDesignerPresets';

export default function HomePage({ navigate, onSelectBranch }) {
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);
  const [selectedOfferingIndex, setSelectedOfferingIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeNavSection, setActiveNavSection] = useState('hero');
  const [scrollY, setScrollY] = useState(0);
  const [whatsNewIndex, setWhatsNewIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [touchStartX, setTouchStartX] = useState(null);

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
        { id: 'whats-new', el: document.getElementById('whats-new') },
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
  const ALL_STORY_OFFERINGS = [
    {
      id: 'coffee',
      tabLabel: 'Cà Phê Rang Mộc',
      category: 'TỪ CÀ PHÊ RANG MỘC NGUYÊN BẢN',
      icon: Coffee,
      badge: '100% Rang Mộc · Robusta & Arabica',
      title: 'Cà Phê Rang Mộc & Cold Brew 24H',
      subtitle: 'Khởi đầu sự tỉnh táo & tập trung cao độ',
      story: 'Chúng tôi tuyển chọn 100% hạt Robusta Đắk Lắk đậm đà và Arabica Cầu Đất thơm nồng nàn, rang mộc nguyên chất không tẩm ướp. Từ phin truyền thống nhỏ từng giọt lắng đọng, espresso chiết xuất chuẩn áp suất, đến Cold Brew ủ lạnh suốt 24 giờ thơm hương hoa quả — tiếp lửa tỉnh táo bền bỉ suốt ngày dài và đêm thâu.',
      highlights: ['Phin Nguyên Bản Đậm Đà', 'Espresso / Latte Pha Máy', 'Cold Brew Cam Vàng Ủ 24h', 'Bạc Xỉu 3 Tầng Kem Sữa'],
      image: '/images/journey_espresso.jpg'
    },
    {
      id: 'matcha',
      tabLabel: 'Matcha & MK4',
      category: 'MATCHA & MATCHA MK4 THƯỢNG HẠNG',
      icon: Sparkles,
      badge: 'Specialty Grade · Nhập Khẩu Nhật Bản',
      title: 'Matcha Nghệ Nhân & Specialty MK4',
      subtitle: 'Tâm trí tĩnh tại, sáng tạo thông suốt',
      story: 'Dòng bột trà xanh Matcha cao cấp, đặc biệt là Specialty Matcha MK4 tuyển chọn chuẩn vùng Uji (Kyoto). Màu xanh ngọc bích tự nhiên, dồi dào chất chống oxy hóa và hoạt chất L-theanine giúp giải tỏa căng thẳng thần kinh, mang lại trạng thái tập trung sâu êm dịu, sảng khoái mà không cồn cào hay tim đập nhanh.',
      highlights: ['Matcha MK4 Latte Thượng Hạng', 'Macchiato Kem Muối Biển', 'Matcha Đá Xay Kem Tuyết', 'Matcha Sữa Dừa Thanh Mát'],
      image: '/images/blog_brewing.jpg'
    },
    {
      id: 'fruit-tea',
      tabLabel: 'Trà Trái Cây Tươi',
      category: 'TRÀ TRÁI CÂY & TRÀ TRÁI CÂY TƯƠI',
      icon: Sun,
      badge: '100% Trái Cây Tươi Trong Ngày',
      title: 'Trà Trái Cây & Trái Cây Tươi Tự Nhiên',
      subtitle: 'Năng lượng thanh mát, bừng tỉnh giác quan',
      story: 'Nấu từ cốt trà Oolong và trà đen hảo hạng ủ lạnh, kết hợp cùng các loại trái cây nhiệt đới tươi rói cắt lát mới mỗi ngày: cam vàng, đào giòn, ổi hồng ruột đỏ, dâu tây và hạt chia hữu cơ. Vị chua ngọt thanh khiết, cung cấp vitamin tự nhiên giúp giải nhiệt tức thì sau nhiều giờ nhìn màn hình laptop.',
      highlights: ['Trà Đào Cam Sả Hoàng Gia', 'Trà Ổi Hồng Hạt Chia', 'Trà Vải Hoa Hồng Tươi Mát', 'Trà Táo Quế Mật Ong Ấm'],
      image: '/images/promo_banner.jpg'
    },
    {
      id: 'milk-tea',
      tabLabel: 'Trà Sữa Đậm Vị',
      category: 'TRÀ SỮA ĐẬM VỊ CỐT TRÀ',
      icon: Heart,
      badge: 'Ủ Cốt Trà Thơm Nức · Chuẩn Gu',
      title: 'Trà Sữa Đậm Vị Cốt Trà Truyền Thống',
      subtitle: 'Ngọt ngào vỗ về những giờ học nhóm',
      story: 'Chắt lọc từ những búp trà đen và Oolong nướng than hoa thơm nức mũi, kết hợp tỷ lệ vàng cùng sữa tươi béo ngậy vừa vặn mà không ngấy. Topping trân châu hoàng kim dai giòn, thạch phô mai béo ngậy được chế biến thủ công trong ngày, tạo nên ly trà sữa đậm vị ngọt thanh, chuẩn gu các bạn trẻ.',
      highlights: ['Trà Sữa Oolong Nướng 24/24', 'Trà Sữa Thái Xanh Phô Mai', 'Trà Sữa Lài Kem Trứng Cháy', 'Topping Trân Châu Hoàng Kim'],
      image: '/images/blog_student_study.jpg'
    },
    {
      id: 'cacao',
      tabLabel: 'Cacao Thơm Béo',
      category: 'THỨC UỐNG CHẾ BIẾN TỪ CACAO',
      icon: Flame,
      badge: 'Cacao Đắk Lắk Nguyên Chất',
      title: 'Thức Uống Chế Biến Từ Cacao Thơm Béo',
      subtitle: 'Vòng tay ấm áp giữa đêm muộn se lạnh',
      story: 'Bột cacao nguyên chất sánh đặc, giàu magiê và dưỡng chất giúp giải tỏa mệt mỏi thể chất và vỗ về tâm trạng. Dù là một tách cacao nóng hổi bồng bềnh kẹo marshmallow tan chảy lúc 2 giờ sáng hay ly cacao sữa dừa đá xay thơm ngậy, đều đem lại cảm giác bình yên và nguồn năng lượng dồi dào.',
      highlights: ['Cacao Nóng Marshmallow Đêm Muộn', 'Cacao Sữa Dừa Béo Ngậy', 'Cacao Kem Cheese Béo Mặn', 'Dark Chocolate Sánh Đậm'],
      image: '/images/journey_roast.jpg'
    },
    {
      id: 'ice-blended',
      tabLabel: 'Món Đá Xay',
      category: 'CÁC MÓN ĐÁ XAY SẢNG KHOÁI',
      icon: Wind,
      badge: 'Đá Xay Tuyết Mịn · Bùng Nổ Vị Giác',
      title: 'Các Món Đá Xay Tuyết Sảng Khoái',
      subtitle: 'Đánh thức tinh thần tức thì',
      story: 'Dòng thức uống Ice-Blended xay tuyết nhuyễn mịn như nhung, kết hợp cà phê espresso đậm đặc, bánh Oreo giòn rụm hoặc caramel béo ngậy, phủ lớp kem tươi whipping cream bồng bềnh rưới sốt ngọt ngào. Món giải nhiệt sảng khoái lý tưởng giúp bạn nạp năng lượng nhanh và đánh bay cơn buồn ngủ.',
      highlights: ['Mocha Frappe Kem Tươi', 'Caramel Cookies & Cream', 'Matcha Tuyết Đá Xay', 'Chocolate Mint Blizzard'],
      image: '/images/blog_gaming_chill.jpg'
    },
    {
      id: 'food-service',
      tabLabel: 'Thức Ăn Bếp Đêm',
      category: 'PHỤC VỤ CÁC LOẠI THỨC ĂN 24/7',
      icon: UtensilsCrossed,
      badge: 'Bếp Nóng 24/7 · Cứu Đói Xuyên Đêm',
      title: 'Bếp Nóng Phục Vụ Các Loại Thức Ăn 24/24',
      subtitle: 'Nạp đầy năng lượng ấm bụng để học tập & làm việc thâu đêm',
      story: 'Chúng tôi hiểu rằng những giờ chạy deadline hay học nhóm thâu đêm không chỉ cần cà phê, mà cần một chiếc bụng no ấm. Bếp nóng COFFEE 24/24 luôn đỏ lửa 24/7, sẵn sàng phục vụ các món ăn nóng hổi vừa thổi vừa ăn: từ tô mì xào bò rau cải đầy đặn kèm trứng ốp la lòng đào, mì gói xúc xích nước cay ấm lòng 2h sáng, đến bánh mì que Hải Phòng giòn rụm và croissant bơ Pháp nướng nóng giòn tại chỗ.',
      highlights: ['Mì Xào Bò Trứng Ốp La Lòng Đào', 'Mì Gói Xúc Xích Siêu Cấp Cay Ấm', 'Bánh Mì Que Hải Phòng Nóng Giòn', 'Croissant Bơ Pháp Nướng Tại Chỗ'],
      image: '/images/blog_late_night_food.jpg'
    }
  ];

  // 3 Highlight Posters Dọc 3x4 (Món mới & Chương trình nổi bật)
  const defaultPosters = [
    {
      id: 'item-new-1',
      tag: 'MÓN MỚI',
      title: 'Matcha MK4 Latte & Cold Brew Cam Vàng',
      discount: 'GIẢM 20%',
      image: '/images/promo_banner.jpg',
      cta: 'Thử Món Mới',
      link: '/dathang'
    },
    {
      id: 'item-new-2',
      tag: 'COMBO HOT',
      title: 'Combo Sáng & Đêm Khuya 69K',
      discount: 'CHỈ 69.000đ',
      image: '/images/signature_drinks.jpg',
      cta: 'Đặt Combo 69K',
      link: '/dathang'
    },
    {
      id: 'item-new-3',
      tag: 'GIỜ VÀNG',
      title: 'Happy Hour 16:00 - 19:00 Mỗi Ngày',
      discount: 'GIẢM 40%',
      image: '/images/journey_espresso.jpg',
      cta: 'Lấy Mã Giảm',
      link: '/khuyenmai'
    }
  ];

  const whatsNewItems = (siteConfig.homePosters && siteConfig.homePosters.length > 0)
    ? siteConfig.homePosters
    : defaultPosters;

  const activeOffering = ALL_STORY_OFFERINGS[selectedOfferingIndex] || ALL_STORY_OFFERINGS[0];
  const ActiveIcon = activeOffering.icon;

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

  return (
    <div className="relative w-full font-sans select-none pb-12 overflow-hidden text-[#2b170e]">

      {/* FLOATING TOAST COPIED VOUCHER FEEDBACK */}
      {copiedCode && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2b170e] text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <div className="text-sm font-bold text-amber-200">Đã sao chép mã: <span className="font-mono text-white text-base font-black">{copiedCode}</span></div>
            <div className="text-xs text-stone-300">Dán vào ô mã giảm giá khi đặt món để nhận ưu đãi ngay!</div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ANIMATED SCROLL COMPANION (BIỂU TƯỢNG VÀ TIẾN TRÌNH CUỘN CHUYỂN ĐỘNG CÙNG)
          ========================================================================= */}
      <aside 
        aria-label="Thanh tiến trình cuộn trang"
        className="fixed right-3.5 sm:right-6 bottom-8 z-40 hidden md:flex flex-col items-center gap-2.5 p-2 rounded-full bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_12px_40px_rgba(43,23,14,0.15)] transition-all duration-300 group hover:shadow-2xl"
      >
        {/* Animated Rotating Cup with Steam */}
        <div 
          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2b170e] to-[#160a05] text-amber-200 flex items-center justify-center shadow-md relative cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Nhấn để cuộn lên đầu trang"
        >
          <Coffee 
            className="w-5 h-5 text-amber-200 transition-transform duration-200" 
            style={{ transform: `rotate(${scrollY * 0.12}deg)` }}
          />
          {/* Steam bubble */}
          <span className="absolute -top-1 w-1.5 h-3 rounded-full bg-amber-300/80 blur-[0.5px] animate-steam" />
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
            { id: 'whats-new', label: '02 Có Gì Mới' },
            { id: 'amenities', label: '03 Không Gian' },
            { id: 'menu', label: '04 Thực Đơn' },
            { id: 'reviews', label: '05 Đánh Giá' },
            { id: 'social', label: '06 Kết Nối' }
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
      </aside>

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

      {/* =========================================================================
          2. SECTION: CÓ GÌ MỚI TUẦN NÀY / THÁNG NÀY?
          (MÓN MỚI TRÌNH LÀNG & ƯU ĐÃI ĐẶC QUYỀN)
          ========================================================================= */}
      {siteConfig.whatsNewSection?.enabled !== false && (
        <section 
          id="whats-new" 
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
        >
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
            {siteConfig.whatsNewSection?.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white/90 text-[#8c5932] text-xs sm:text-sm font-black uppercase tracking-wider shadow-xs">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>{siteConfig.whatsNewSection.badge}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase leading-[1.3] sm:leading-[1.35]">
              {siteConfig.whatsNewSection?.title || 'Món Mới Trình Làng &'}{' '}
              <br className="hidden sm:inline" />
              <span className="text-[#8c5932] inline-block mt-1 sm:mt-2">
                {siteConfig.whatsNewSection?.highlightTitle || 'Ưu Đãi Đặc Quyền'}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#5c3d2e] font-medium leading-relaxed max-w-xl mx-auto">
              {siteConfig.whatsNewSection?.subtitle || 'Cập nhật món mới và ưu đãi nổi bật dành cho học tập & làm việc.'}
            </p>
          </div>

          {/* Carousel Container: 3 món trên máy tính, 1 món trên điện thoại */}
          {(() => {
            const visibleCount = isMobile ? 1 : 3;
            const maxWhatsNewIndex = Math.max(0, whatsNewItems.length - visibleCount);
            const safeWhatsNewIndex = Math.min(whatsNewIndex, maxWhatsNewIndex);
            const showNavButtons = whatsNewItems.length > visibleCount;

            const handlePrevWhatsNew = () => {
              setWhatsNewIndex(prev => (prev <= 0 ? maxWhatsNewIndex : prev - 1));
            };

            const handleNextWhatsNew = () => {
              setWhatsNewIndex(prev => (prev >= maxWhatsNewIndex ? 0 : prev + 1));
            };

            return (
              <div className="relative group/carousel px-0 sm:px-2">
                {/* Navigation Arrow Left */}
                {showNavButtons && (
                  <button
                    type="button"
                    onClick={handlePrevWhatsNew}
                    className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-stone-200/90 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md group"
                    aria-label="Xem món mới trước đó"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
                  </button>
                )}

                {/* Navigation Arrow Right */}
                {showNavButtons && (
                  <button
                    type="button"
                    onClick={handleNextWhatsNew}
                    className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-stone-200/90 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md group"
                    aria-label="Xem món mới tiếp theo"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}

                {/* Carousel Overflow Track */}
                <div 
                  className="overflow-hidden w-full py-2"
                  onTouchStart={(e) => setTouchStartX(e.targetTouches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchStartX === null) return;
                    const diff = touchStartX - e.changedTouches[0].clientX;
                    if (diff > 45) handleNextWhatsNew();
                    else if (diff < -45) handlePrevWhatsNew();
                    setTouchStartX(null);
                  }}
                >
                  <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${safeWhatsNewIndex * (100 / visibleCount)}%)`
                    }}
                  >
                    {whatsNewItems.map((promo, idx) => (
                      <div 
                        key={promo.id || idx}
                        className="w-full md:w-1/3 shrink-0 p-2 sm:p-3"
                      >
                        <div className="ios-glass-card rounded-[32px] overflow-hidden p-3.5 sm:p-4 border border-white/85 shadow-lg group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full bg-white/70 backdrop-blur-xl">
                          {/* 3:4 Vertical Poster Container (Chuẩn Tỉ Lệ Dọc 3x4) */}
                          <div 
                            onClick={() => navigate(promo.link || '/dathang')}
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
                            {promo.discount && (
                              <span className="absolute bottom-3 right-3 px-3.5 py-1 rounded-full bg-amber-400 text-[#1a0a04] font-mono text-xs font-black shadow-md">
                                {promo.discount}
                              </span>
                            )}
                          </div>

                          {/* Minimal Text: Tiêu đề gọn gàng & Nút hành động */}
                          <div className="pt-3.5 pb-1 px-1 flex items-center justify-between gap-3">
                            <h3 
                              onClick={() => navigate(promo.link || '/dathang')}
                              className="text-base sm:text-lg font-black text-[#2b170e] truncate group-hover:text-[#8c5932] transition-colors cursor-pointer" 
                              title={promo.title}
                            >
                              {promo.title}
                            </h3>
                            <button
                              type="button"
                              onClick={() => navigate(promo.link || '/dathang')}
                              className="shrink-0 px-4 py-2 rounded-full bg-[#2b170e] hover:bg-amber-600 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <span>{promo.cta || 'Xem Thêm'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots Indicator */}
                {showNavButtons && maxWhatsNewIndex > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
                    {Array.from({ length: maxWhatsNewIndex + 1 }).map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setWhatsNewIndex(dotIdx)}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          safeWhatsNewIndex === dotIdx 
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

          {/* Bonus Link to Promotions Page */}
          <div className="mt-8 sm:mt-10 text-center">
            <button
              onClick={() => navigate('/khuyenmai')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/70 hover:bg-white text-[#2b170e] text-xs sm:text-sm font-bold border border-white/90 shadow-sm transition-all cursor-pointer"
            >
              <span>Khám phá thêm các chương trình tại Trang Khuyến Mãi</span>
              <ChevronRight className="w-4 h-4 text-[#8c5932]" />
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          3. SECTION: KHÔNG GIAN & TIỆN NGHI 24/7
          ========================================================================= */}
      <section 
        id="amenities" 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
      >
        <div className="relative rounded-[40px] sm:rounded-[56px] ios-glass-panel p-6 sm:p-10 lg:p-12 border border-white/90 shadow-[0_24px_70px_rgba(60,35,15,0.07)] space-y-8 sm:space-y-10">
          
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2b170e] tracking-tight uppercase leading-[1.3] sm:leading-[1.35]">
              Không Gian Lý Tưởng Cho <br className="hidden sm:inline" />
              <span className="text-[#8c5932] inline-block mt-1">Học Tập & Làm Việc</span>
            </h2>

            {/* Exactly User's Provided Paragraph in an Elegant Compact Box */}
            <p className="text-sm sm:text-base md:text-lg text-[#3d2417] font-medium leading-relaxed p-5 sm:p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-white/90 shadow-2xs italic">
              “Với không gian rộng rãi, ánh sáng dịu nhẹ, âm thanh yên tĩnh, nhiệt độ phòng mát mẻ, và hệ thống ổ điện được trang bị ở tất cả các vị trí có bàn ghế, đảm bảo không gian làm việc và học tập thuận tiện cho khách hàng.”
            </p>
          </div>

          {/* 5 Sleek Compact Highlight Chips (Gọn gàng, ít chữ lại) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            <div className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/75 border border-white/90 shadow-2xs hover:bg-white transition-all">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#2b170e]">Ổ Điện 100% Bàn Ghế</span>
            </div>

            <div className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/75 border border-white/90 shadow-2xs hover:bg-white transition-all">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#2b170e]">Không Gian Rộng Rãi</span>
            </div>

            <div className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/75 border border-white/90 shadow-2xs hover:bg-white transition-all">
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-600 flex items-center justify-center shrink-0">
                <Sun className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#2b170e]">Ánh Sáng Dịu Nhẹ</span>
            </div>

            <div className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/75 border border-white/90 shadow-2xs hover:bg-white transition-all">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#2b170e]">Âm Thanh Yên Tĩnh</span>
            </div>

            <div className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/75 border border-white/90 shadow-2xs hover:bg-white transition-all col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-700 flex items-center justify-center shrink-0">
                <Wind className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#2b170e]">Nhiệt Độ Mát Mẻ</span>
            </div>
          </div>

          {/* Photo Gallery Grid of Coffee Shop Spaces */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="h-52 sm:h-56 rounded-3xl overflow-hidden relative shadow-md group">
              <img src="/images/branch_downtown.jpg" alt="Không gian học nhóm" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">Bàn Dài Học Nhóm 8-12 Bạn</span>
              </div>
            </div>
            <div className="h-52 sm:h-56 rounded-3xl overflow-hidden relative shadow-md group">
              <img src="/images/blog_workspace.jpg" alt="Ổ cắm điện riêng" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">Góc Chạy Deadline Yên Tĩnh</span>
              </div>
            </div>
            <div className="h-52 sm:h-56 rounded-3xl overflow-hidden relative shadow-md group">
              <img src="/images/blog_student_study.jpg" alt="Ánh sáng bảo vệ mắt" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">Ánh Sáng Chuẩn Công Thái Học</span>
              </div>
            </div>
            <div className="h-52 sm:h-56 rounded-3xl overflow-hidden relative shadow-md group">
              <img src="/images/blog_gaming_chill.jpg" alt="Sofa thư giãn" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">Sofa Thư Giãn & Xả Stress</span>
              </div>
            </div>
          </div>

        </div>
      </section>

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
            COFFEE 24/24 BÁN GÌ?
          </h2>

          {/* User's Exact Sentence Flowing Naturally */}
          <p className="text-base sm:text-lg md:text-xl text-[#4a3325] font-medium leading-relaxed max-w-3xl mx-auto italic pt-1">
            "Chúng tôi có bán nhiều loại thức uống từ cà phê, matcha, matcha mk4, trà trái cây, trà trái cây tươi, trà sữa, thức uống chế biến từ cacao, các món đá xay, và phục vụ các loại thức ăn."
          </p>
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
        <div className="relative ios-glass-panel rounded-[36px] sm:rounded-[48px] overflow-hidden border border-white/90 shadow-[0_24px_70px_rgba(60,35,15,0.08)] mt-6 sm:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[520px]">
            
            {/* Left: Cinematic Photo Canvas */}
            <div className="lg:col-span-6 xl:col-span-7 relative min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] overflow-hidden bg-stone-900 group">
              <img 
                key={activeOffering.id}
                src={activeOffering.image} 
                alt={activeOffering.title} 
                className="w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-105 animate-in fade-in zoom-in-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/30" />
              
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

            {/* Right: Rich Editorial Craft Narrative */}
            <div className="lg:col-span-6 xl:col-span-5 p-7 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 animate-in fade-in duration-300">
              
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
                  onClick={() => navigate('/dathang')}
                  className="ios-btn-primary px-7 py-3.5 rounded-full font-bold text-sm tracking-wide cursor-pointer inline-flex items-center gap-2.5 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Xem Chi Tiết Món & Đặt Ngay</span>
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

      {/* =========================================================================
          5. SECTION: KHÁCH HÀNG ĐÁNH GIÁ NHƯ THẾ NÀO VỀ CHÚNG TÔI?
          ========================================================================= */}
      <section 
        id="reviews" 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
      >
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white/90 text-[#8c5932] text-xs sm:text-sm font-black uppercase tracking-wider shadow-xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>CẢM NHẬN THỰC TẾ</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase leading-[1.3] sm:leading-[1.35]">
            Khách Hàng Đánh Giá <br className="hidden sm:inline" />
            <span className="text-[#8c5932] inline-block mt-1 sm:mt-2">Như Thế Nào Về Chúng Tôi?</span>
          </h2>

          <p className="text-base sm:text-lg text-[#5c3d2e] font-medium leading-relaxed">
            Hơn 1.200 đánh giá 5 sao từ cộng đồng học sinh, sinh viên các trường đại học lân cận, lập trình viên và giới freelancer chạy deadline thâu đêm.
          </p>
        </div>

        {/* Embed Customer Reviews Component */}
        <div className="w-full">
          <CustomerReviewsSection />
        </div>
      </section>

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

    </div>
  );
}
