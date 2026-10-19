import React, { useState } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  PhoneCall, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink,
  Award,
  Sparkles,
  Check
} from 'lucide-react';

/**
 * 1. Khối Banner Tùy Biến (Custom Banner / CTA)
 */
export function CustomBannerSection({ data = {}, title, navigate }) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="relative rounded-[36px] sm:rounded-[48px] overflow-hidden bg-gradient-to-br from-[#2b170e] via-[#3a2215] to-[#1a0e08] text-white p-8 sm:p-14 shadow-2xl border border-white/15">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            {data.tag && (
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase tracking-wider border border-amber-500/30">
                {data.tag}
              </span>
            )}
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {data.title || title || 'Thông Báo Từ Coffee 24/24'}
            </h2>
            {data.subtitle && (
              <p className="text-base sm:text-lg font-bold text-amber-200">
                {data.subtitle}
              </p>
            )}
            {data.description && (
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
                {data.description}
              </p>
            )}
            {data.buttonText && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    const link = data.buttonLink || '/dathang';
                    if (link.startsWith('http')) {
                      window.open(link, '_blank');
                    } else if (navigate) {
                      navigate(link);
                    }
                  }}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#2b170e] font-black text-sm tracking-wide shadow-lg inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <span>{data.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {data.image && (
            <div className="lg:col-span-5 rounded-3xl overflow-hidden aspect-video sm:aspect-4/3 shadow-xl border border-white/20">
              <img 
                src={data.image} 
                alt={data.title || 'Banner'} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * 2. Khối Con Số Ấn Tượng (Stats Counters)
 */
export function StatsSection({ data = {}, title }) {
  const items = data.items || [
    { number: '24/7', label: 'Giờ Phục Vụ Mỗi Ngày' },
    { number: '02', label: 'Chi Nhánh Đắc Địa' },
    { number: '50+', label: 'Món Thức Uống Đậm Vị' },
    { number: '10K+', label: 'Khách Hàng Hài Lòng' }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
        {data.badge && (
          <span className="px-3.5 py-1 rounded-full bg-white/80 border border-white text-[#8c5932] text-xs font-black uppercase tracking-wider shadow-2xs">
            {data.badge}
          </span>
        )}
        <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase">
          {data.title || title || 'Dấu Ấn COFFEE 24/24'}
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((stat, i) => (
          <div key={i} className="p-6 sm:p-8 rounded-[32px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-md text-center space-y-2 hover:scale-102 transition-transform">
            <span className="text-3xl sm:text-5xl font-black text-[#2b170e] font-mono tracking-tight block">
              {stat.number}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#8c5932] block">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 3. Khối 3 Cam Kết Thương Hiệu (Brand Highlights)
 */
export function FeaturesSection({ data = {}, title }) {
  const features = data.features || [
    { title: '100% Cà Phê Rang Mộc', desc: 'Không hương liệu hóa chất, chiết xuất chuẩn vị Robusta Đắk Lắk & Arabica Cầu Đất.' },
    { title: 'Ổ Điện Tại 100% Vị Trí', desc: 'Hệ thống điện & Wifi Gigabit ổn định cao, đảm bảo không gián đoạn công việc.' },
    { title: 'Bếp Nóng Phục Vụ Xuyên Đêm', desc: 'Mì xào, bánh mì, đồ ăn ấm nóng sẵn sàng tiếp năng lượng 24/7.' }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
        {data.badge && (
          <span className="px-3.5 py-1 rounded-full bg-white/80 border border-white text-[#8c5932] text-xs font-black uppercase tracking-wider shadow-2xs">
            {data.badge}
          </span>
        )}
        <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase">
          {data.title || title || 'Vì Sao Chọn Coffee 24/24?'}
        </h2>
        {data.subtitle && (
          <p className="text-sm sm:text-base text-[#5c3d2e] font-medium max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feat, i) => (
          <div key={i} className="p-7 rounded-[32px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-md space-y-3 hover:shadow-xl transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#2b170e] text-amber-300 flex items-center justify-center font-bold text-sm">
              0{i + 1}
            </div>
            <h3 className="text-lg font-black text-[#2b170e]">
              {feat.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 4. Khối Video Giới Thiệu
 */
export function VideoSection({ data = {}, title }) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
        {data.badge && (
          <span className="px-3.5 py-1 rounded-full bg-white/80 border border-white text-[#8c5932] text-xs font-black uppercase tracking-wider shadow-2xs">
            {data.badge}
          </span>
        )}
        <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase">
          {data.title || title || 'Video Giới Thiệu'}
        </h2>
        {data.subtitle && (
          <p className="text-sm sm:text-base text-[#5c3d2e] font-medium">
            {data.subtitle}
          </p>
        )}
      </div>
      <div className="max-w-4xl mx-auto rounded-[36px] overflow-hidden shadow-2xl border border-white/90 aspect-video bg-black">
        {data.videoUrl?.includes('youtube') ? (
          <iframe 
            src={data.videoUrl} 
            title="Video Showcase" 
            className="w-full h-full" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
          />
        ) : (
          <video 
            src={data.videoUrl} 
            controls 
            className="w-full h-full object-cover" 
            poster={data.thumbnail} 
          />
        )}
      </div>
    </section>
  );
}

/**
 * 5. Khối Hỏi Đáp Nhanh (FAQ Accordion)
 */
export function FaqSection({ data = {}, title }) {
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = data.faqs || [
    { q: 'Quán có mở cửa suốt đêm thật không?', a: 'Có! Cả 2 chi nhánh của COFFEE 24/24 đều mở cửa 24/24 suốt 365 ngày trong năm.' },
    { q: 'Wifi và ổ điện ở quán như thế nào?', a: 'Quán trang bị ổ cắm điện ở 100% bàn ghế và hệ thống Wifi Gigabit chịu tải cao.' },
    { q: 'Có chỗ gửi xe máy và ô tô an toàn không?', a: 'Quán có bãi giữ xe máy miễn phí rộng rãi có bảo vệ túc trực 24/24.' }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
        {data.badge && (
          <span className="px-3.5 py-1 rounded-full bg-white/80 border border-white text-[#8c5932] text-xs font-black uppercase tracking-wider shadow-2xs">
            {data.badge}
          </span>
        )}
        <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase">
          {data.title || title || 'Câu Hỏi Thường Gặp'}
        </h2>
        {data.subtitle && (
          <p className="text-sm sm:text-base text-[#5c3d2e] font-medium">
            {data.subtitle}
          </p>
        )}
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className="rounded-2xl bg-white/85 border border-white/90 shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-sm sm:text-base text-[#2b170e] cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-amber-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5c3d2e] leading-relaxed border-t border-stone-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * 6. Khối 2 Chi Nhánh & Hotline
 */
export function BranchesSection({ data = {}, title }) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
        {data.badge && (
          <span className="px-3.5 py-1 rounded-full bg-white/80 border border-white text-[#8c5932] text-xs font-black uppercase tracking-wider shadow-2xs">
            {data.badge}
          </span>
        )}
        <h2 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase">
          {data.title || title || 'Hệ Thống 2 Chi Nhánh'}
        </h2>
        {data.subtitle && (
          <p className="text-sm sm:text-base text-[#5c3d2e] font-medium">
            {data.subtitle}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 rounded-[36px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 font-black text-xs">CHI NHÁNH 1</span>
          <h3 className="text-xl font-black text-[#2b170e]">413 Phan Huy Ích, P.14, Gò Vấp</h3>
          <p className="text-xs text-stone-600">Hotline: 0986 511 897 • Mở cửa: 24/7</p>
          <div className="pt-2 flex gap-3">
            <a href="tel:0986511897" className="px-4 py-2 rounded-full bg-[#2b170e] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Gọi Hotline</span>
            </a>
            <a href="https://maps.google.com/?q=413+Phan+Huy+Ich+Go+Vap" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-[#2b170e] text-xs font-bold inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Chỉ Đường</span>
            </a>
          </div>
        </div>

        <div className="p-7 rounded-[36px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 font-black text-xs">CHI NHÁNH 2</span>
          <h3 className="text-xl font-black text-[#2b170e]">96 Đường D5, P.25, Bình Thạnh</h3>
          <p className="text-xs text-stone-600">Hotline: 0347 374 858 • Mở cửa: 24/7</p>
          <div className="pt-2 flex gap-3">
            <a href="tel:0347374858" className="px-4 py-2 rounded-full bg-[#2b170e] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Gọi Hotline</span>
            </a>
            <a href="https://maps.google.com/?q=96+D5+Binh+Thanh" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-[#2b170e] text-xs font-bold inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Chỉ Đường</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
