import React, { useState } from 'react';
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
  PhoneCall
} from 'lucide-react';
import { PROMOTIONS, PROMOTION_CATEGORIES } from '../data/promotions';
import { getSiteConfig } from '../data/siteConfig';

export default function PromotionsPage({ navigate }) {
  const [siteConfig] = useState(() => getSiteConfig());
  const activePromo = (siteConfig?.promotionsList && siteConfig.promotionsList.length > 0)
    ? siteConfig.promotionsList[0]
    : null;
  const heroImage = activePromo?.image || 'https://ilyxybkcndjcnzrtjjiq.supabase.co/storage/v1/object/public/coffee2424-media/promos/1792406318618_erer5hh.png';
  const heroTitle = activePromo?.title || 'Giờ Vàng Giảm 40% Tất Cả Đồ Uống';
  const heroTag = activePromo?.tag || 'ƯU ĐÃI NỔI BẬT NHẤT';
  const heroDiscount = activePromo?.discount || 'GIẢM 40%';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);
  const [expandedConditions, setExpandedConditions] = useState({});

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleUseNow = (code) => {
    handleCopy(code);
    navigate('/dathang');
  };

  const toggleCondition = (id) => {
    setExpandedConditions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter promotions by category
  const filteredPromotions = selectedCategory === 'all'
    ? PROMOTIONS
    : PROMOTIONS.filter(p => p.category === selectedCategory);

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
        <section className="relative overflow-hidden rounded-[36px] sm:rounded-[48px] bg-white/60 backdrop-blur-3xl border border-white/80 p-8 sm:p-14 shadow-[0_20px_50px_rgba(60,35,15,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-[#8c5932] text-xs font-black uppercase tracking-wider border border-white/90 shadow-xs">
                <Flame className="w-4 h-4 text-orange-600 fill-orange-600 animate-pulse" />
                <span>Đặc Quyền Tiếp Sức 24/24</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2b170e] tracking-tight leading-[1.3] sm:leading-[1.35]">
                Kho Voucher & Ưu Đãi <br />
                <span className="text-[#8c5932] inline-block mt-1 sm:mt-2">
                  Dành Riêng Cho Bạn
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#5c3d2e] font-normal max-w-2xl leading-relaxed">
                Giảm tới <strong className="text-[#2b170e] font-black">40% Giờ Vàng</strong>, combo <strong className="text-[#2b170e] font-black">Cú Đêm 69K</strong>, món nóng cứu đói và mã freeship xuyên đêm. Thưởng thức trọn vẹn menu cà phê rang mộc nguyên chất 24/7 không lo về giá!
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => navigate('/dathang')}
                  className="px-8 py-4 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-black text-sm tracking-wide flex items-center gap-2.5 shadow-xl hover:shadow-2xl hover:scale-102 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>ĐẶT MÓN & ÁP MÃ NGAY</span>
                </button>

                <a
                  href="#voucher-grid"
                  className="px-6 py-4 rounded-full bg-white/70 hover:bg-white text-[#2b170e] font-bold text-sm border border-white/90 shadow-sm transition-all flex items-center gap-2"
                >
                  <span>Xem Danh Sách Voucher</span>
                  <ArrowRight className="w-4 h-4 text-[#8c5932]" />
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-[#dfd4c7] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#2b170e]">6+ Deals</div>
                  <div className="text-xs sm:text-sm text-[#7a5843] font-medium">Cập nhật mỗi ngày</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#2b170e]">Tới 40%</div>
                  <div className="text-xs sm:text-sm text-[#7a5843] font-medium">Chiết khấu trực tiếp</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#2b170e]">24/24 H</div>
                  <div className="text-xs sm:text-sm text-[#7a5843] font-medium">Phục vụ xuyên đêm</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#2b170e]">25 Phút</div>
                  <div className="text-xs sm:text-sm text-[#7a5843] font-medium">Giao hỏa tốc đêm</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative group">
                <div className="relative rounded-[32px] overflow-hidden border border-white/80 shadow-2xl bg-white/70">
                  <div className="relative h-72 sm:h-96 overflow-hidden">
                    <img 
                      src={heroImage} 
                      alt={heroTitle} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.src = 'https://ilyxybkcndjcnzrtjjiq.supabase.co/storage/v1/object/public/coffee2424-media/promos/1792406318618_erer5hh.png'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b170e]/90 via-[#2b170e]/20 to-transparent" />
                    
                    {/* Floating Ticket Feature Overlay */}
                    <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white text-[#2b170e] space-y-2 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-[#8c5932] tracking-wider flex items-center gap-1.5">
                          <Flame className="w-4 h-4 fill-orange-600 text-orange-600" />
                          {heroTag}
                        </span>
                        <span className="text-xs font-black bg-red-600 text-white px-2.5 py-0.5 rounded-full">
                          {heroDiscount}
                        </span>
                      </div>
                      <div className="text-base font-black text-[#2b170e] line-clamp-1">{heroTitle}</div>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-[#5c3d2e] pt-1 border-t border-[#dfd4c7]">
                        <span>Mã: <strong className="font-mono text-[#8c5932] font-black">HAPPY40</strong></span>
                        <span className="text-[#8c5932] font-bold">16:00 - 19:00 Mỗi ngày</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

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
                ? PROMOTIONS.length 
                : PROMOTIONS.filter(p => p.category === cat.id).length;
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

          {/* Voucher Ticket Stubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPromotions.map((promo) => (
              <div 
                key={promo.id}
                className="ios-glass-card rounded-[32px] overflow-hidden flex flex-col justify-between group relative"
              >
                {/* TOP: Image, Badges & Overlays */}
                <div>
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Floating badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="px-3.5 py-1 rounded-full bg-[#2b170e] text-white text-xs font-black uppercase shadow-md flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
                        {promo.badge}
                      </span>
                    </div>

                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-3.5 py-1 rounded-full bg-white/95 text-[#8c5932] border border-white text-xs font-black shadow-md backdrop-blur-xs">
                        {promo.discount}
                      </span>
                    </div>

                    {/* Time validity tag */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs sm:text-sm font-bold">
                      <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        {promo.validUntil}
                      </span>
                    </div>
                  </div>

                  {/* MIDDLE BODY: Title, description, Urgency bar */}
                  <div className="p-6 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#8c5932] tracking-wider bg-white/80 px-2.5 py-1 rounded-lg border border-white/90 shadow-xs">
                        {promo.subtitle}
                      </span>
                      <span className="text-sm font-black text-[#8c5932]">
                        {promo.discountValue}
                      </span>
                    </div>

                    <h3 className="font-black text-[#2b170e] text-xl leading-snug group-hover:text-[#8c5932] transition-colors">
                      {promo.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#5c3d2e] leading-relaxed">
                      {promo.description}
                    </p>

                    {/* Scarcity Urgency Progress Bar */}
                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                        <span className="text-orange-600 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-orange-600 animate-pulse" />
                          Đã nhận {promo.usedPercent}%
                        </span>
                        <span className="text-[#7a5843]">
                          Còn {promo.remainingCount} suất
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-200/80 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-700"
                          style={{ width: `${promo.usedPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Condition Note or Accordion */}
                    <div className="pt-1">
                      <button
                        onClick={() => toggleCondition(promo.id)}
                        className="text-xs sm:text-sm text-[#7a5843] hover:text-[#2b170e] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Info className="w-4 h-4 text-[#8c5932]" />
                        <span>{expandedConditions[promo.id] ? 'Thu gọn điều kiện' : 'Xem điều kiện áp dụng'}</span>
                      </button>
                      {expandedConditions[promo.id] && (
                        <p className="mt-2 p-3 rounded-2xl bg-white/80 text-xs sm:text-sm text-[#5c3d2e] border border-white/90 leading-relaxed shadow-xs animate-in fade-in duration-200">
                          {promo.condition}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* TICKET NOTCH PERFORATION CUTOUTS */}
                <div className="relative my-0">
                  <div className="border-t-2 border-dashed border-[#dfd4c7] w-full" />
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#ede6dc] border-r border-[#dfd4c7]" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#ede6dc] border-l border-[#dfd4c7]" />
                </div>

                {/* BOTTOM VOUCHER STUB ACTIONS */}
                <div className="p-6 bg-white/40 border-t border-white/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-[#7a5843] block font-bold uppercase tracking-wider">Mã Ưu Đãi</span>
                    <span className="text-base font-mono font-black text-[#2b170e] bg-white/80 border border-white/90 px-3 py-1 rounded-xl inline-block shadow-xs mt-0.5">
                      {promo.code}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(promo.code)}
                      className="px-4 py-2.5 rounded-full bg-white/80 hover:bg-white text-[#2b170e] text-xs sm:text-sm font-bold border border-white/90 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      title="Sao chép mã"
                    >
                      {copiedCode === promo.code ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span className="text-emerald-700">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#8c5932]" />
                          <span>Chép mã</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleUseNow(promo.code)}
                      className="ios-btn-primary px-5 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Dùng ngay</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* 3. HƯỚNG DẪN 3 BƯỚC DÙNG VOUCHER */}
        <section className="bg-white/60 backdrop-blur-2xl rounded-[36px] sm:rounded-[44px] p-8 sm:p-12 border border-white/80 shadow-[0_15px_40px_rgba(60,35,15,0.06)] space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-[#8c5932] uppercase tracking-wider bg-white/80 px-4 py-1.5 rounded-full border border-white/90 inline-block shadow-xs">
              Cách Thức Áp Dụng
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2b170e]">
              3 Bước Sử Dụng Voucher Cực Dễ Dàng
            </h2>
            <p className="text-sm sm:text-base text-[#5c3d2e] leading-relaxed">
              Chỉ với vài thao tác đơn giản, bạn sẽ nhận ngay ưu đãi giảm giá tốt nhất khi đặt món trực tuyến hoặc thưởng thức tại quán.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white/70 rounded-3xl p-6 sm:p-7 border border-white/90 space-y-3 relative shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#2b170e] text-white font-black text-lg flex items-center justify-center shadow-md">
                01
              </div>
              <h3 className="text-lg font-black text-[#2b170e]">Lưu Mã Ưu Đãi</h3>
              <p className="text-sm sm:text-base text-[#5c3d2e] leading-relaxed">
                Chọn voucher phù hợp với nhu cầu và nhấn nút <strong>"Chép mã"</strong> hoặc <strong>"Dùng ngay"</strong> để hệ thống tự động lưu mã vào bộ nhớ.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/70 rounded-3xl p-6 sm:p-7 border border-white/90 space-y-3 relative shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#8c5932] text-white font-black text-lg flex items-center justify-center shadow-md">
                02
              </div>
              <h3 className="text-lg font-black text-[#2b170e]">Chọn Thức Uống & Món Ăn</h3>
              <p className="text-sm sm:text-base text-[#5c3d2e] leading-relaxed">
                Khám phá thực đơn Cà Phê Rang Mộc, Cold Brew Cam Vàng, Bánh Nướng Giòn hoặc Mì Xào Bếp Đêm rồi thêm vào giỏ hàng.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/70 rounded-3xl p-6 sm:p-7 border border-white/90 space-y-3 relative shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center shadow-md">
                03
              </div>
              <h3 className="text-lg font-black text-[#2b170e]">Áp Mã & Thưởng Thức</h3>
              <p className="text-sm sm:text-base text-[#5c3d2e] leading-relaxed">
                Tại bước xác nhận đơn, dán mã đã sao chép để được giảm giá trực tiếp vào hóa đơn và nhận đồ uống trong 15-25 phút!
              </p>
            </div>

          </div>
        </section>

        {/* 4. CAM KẾT DỊCH VỤ 24/24 */}
        <section className="bg-white/60 backdrop-blur-3xl rounded-[36px] sm:rounded-[44px] p-8 sm:p-12 border border-white/80 shadow-[0_15px_40px_rgba(60,35,15,0.06)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 text-[#8c5932] text-xs font-bold border border-white/90 shadow-xs">
                <Coffee className="w-4 h-4 text-[#8c5932]" />
                Chuẩn Mực Phục Vụ 24/7
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#2b170e] tracking-tight leading-snug">
                Không Chỉ Là Cà Phê, <br />
                <span className="text-[#8c5932]">Đó Là Trạm Năng Lượng 24/24</span>
              </h2>
              <p className="text-sm sm:text-base text-[#5c3d2e] leading-relaxed font-normal">
                Cho dù bạn cần một không gian yên tĩnh cày deadline lúc 2 giờ sáng, tụ họp học nhóm hay một ly cà phê mộc đậm đà khởi đầu ngày mới — COFFEE 24/24 luôn sẵn sàng chào đón bạn.
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

            {/* 4 Feature Highlights */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/75 border border-white/90 space-y-2 shadow-xs">
                <div className="text-[#2b170e] font-black text-base flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-[#8c5932]" /> Rang Mộc Nguyên Chất
                </div>
                <p className="text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
                  100% hạt Robusta & Arabica chọn lọc từ nông trại Đắk Lắk & Cầu Đất, rang mộc chuẩn vị không phụ gia.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/75 border border-white/90 space-y-2 shadow-xs">
                <div className="text-[#2b170e] font-black text-base flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#8c5932]" /> Bếp Nóng 24/24
                </div>
                <p className="text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
                  Mì xào bò bốc khói, trứng ốp la, bánh nướng giòn rụm phục vụ cả ngày lẫn đêm không tính phụ thu giờ khuya.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/75 border border-white/90 space-y-2 shadow-xs">
                <div className="text-[#2b170e] font-black text-base flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#8c5932]" /> Wifi 500Mbps & Ổ Sạc
                </div>
                <p className="text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
                  Đường truyền internet cáp quang tốc độ cao, ổ cắm điện cắm sạc laptop và điện thoại tại từng vị trí ngồi.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/75 border border-white/90 space-y-2 shadow-xs">
                <div className="text-[#2b170e] font-black text-base flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#8c5932]" /> Giao Hỏa Tốc 25 Phút
                </div>
                <p className="text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
                  Đội ngũ giao nhận hỏa tốc chuyên nghiệp khắp khu vực Phú Nhuận, Gò Vấp và Bình Thạnh trong đêm.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 5. HOTLINE & HỖ TRỢ ĐẶT BÀN NHÓM */}
        <section className="p-6 sm:p-8 rounded-[32px] bg-white/70 backdrop-blur-2xl border border-white/90 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_rgba(60,35,15,0.05)]">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#2b170e] flex items-center justify-center flex-shrink-0 border border-white/90 shadow-sm">
              <PhoneCall className="w-7 h-7 text-[#8c5932]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#2b170e]">
                Bạn Có Câu Hỏi Về Mã Ưu Đãi Hoặc Cần Đặt Bàn Nhóm?
              </h3>
              <p className="text-xs sm:text-sm text-[#5c3d2e]">
                Liên hệ hotline chăm sóc khách hàng 24/7: <a href="tel:0906916816" className="font-bold text-[#8c5932] hover:underline font-mono">0906 916 816</a> hoặc ghé trực tiếp chi nhánh gần nhất.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dathang')}
            className="px-6 py-3.5 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Dùng Voucher Đặt Món</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </section>

      </div>

    </div>
  );
}
