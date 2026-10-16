import React, { useState } from 'react';
import { 
  Coffee, 
  Sparkles, 
  Flame, 
  Droplets, 
  ArrowRight, 
  Heart,
  Star,
  Award
} from 'lucide-react';

const FEATURED_HERO_DRINKS = [
  {
    id: 1,
    title: 'Coffee',
    subtitle: 'The Best For You',
    drinkName: 'Cappuccino Latte Art',
    desc: 'Robusta & Arabica rang mộc nguyên chất, hòa quyện lớp bọt sữa thanh trùng sánh mịn vẽ hình trái tim nghệ thuật.',
    image: '/images/signature_drinks.jpg',
    price: '45.000đ',
    badge: 'Signature',
    rating: '4.9 ★',
    origin: 'Cầu Đất Farm'
  },
  {
    id: 2,
    title: 'Cold Brew',
    subtitle: 'Pure & Refreshing',
    drinkName: 'Cold Brew Cam Vàng',
    desc: 'Ủ lạnh 24 giờ thơm hương hoa quả nhiệt đới, hòa cùng cam vàng mọng nước mang đến vị chua ngọt thanh khiết.',
    image: '/images/promo_banner.jpg',
    price: '49.000đ',
    badge: 'Món Mới',
    rating: '5.0 ★',
    origin: 'Đắk Lắk Blend'
  },
  {
    id: 3,
    title: 'Espresso',
    subtitle: 'Wake Up Your Passion',
    drinkName: 'Cà Phê Sữa Đá 24/24',
    desc: 'Hạt cà phê nguyên bản Đắk Lắk đậm đà, phối sữa đặc béo ngậy ngọt sâu, tiếp lửa làm việc và sáng tạo xuyên đêm.',
    image: '/images/journey_espresso.jpg',
    price: '35.000đ',
    badge: 'Bestseller',
    rating: '4.9 ★',
    origin: 'Rang Mộc 100%'
  }
];

export default function CoffeeStorySlider({ onOrderClick }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentDrink = FEATURED_HERO_DRINKS[selectedIdx];

  const quickIcons = [
    { id: 0, icon: Coffee, label: 'Cà phê nóng' },
    { id: 1, icon: Droplets, label: 'Cold brew' },
    { id: 2, icon: Sparkles, label: 'Đặc sản' },
    { id: 'heart', icon: Heart, label: 'Rang mộc' }
  ];

  return (
    <div className="w-full font-sans select-none relative">
      {/* iOS Frosted Glass Panel Container with Specular Reflections - Fits Header Width Exactly */}
      <div className="relative w-full rounded-[36px] sm:rounded-[52px] overflow-hidden ios-glass-panel px-6 sm:px-10 lg:px-14 xl:px-16 py-6 sm:py-9 lg:py-11 xl:py-12 transition-all duration-500 shadow-[0_24px_70px_rgba(60,35,15,0.08)] border border-white/90">
        
        {/* Subtle Glass Diagonal Glare Line */}
        <div className="absolute -top-32 -left-32 w-80 h-[500px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -rotate-45 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center relative z-10">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-left">
            
            {/* Brand mini-tag with glowing pulse */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-white/90 text-xs sm:text-sm font-bold text-[#704f38] uppercase tracking-wider shadow-xs">
              <Coffee className="w-4 h-4 text-[#2b170e]" />
              <span>COFFEE 24/24 · ENJOY YOUR LIFE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </div>

            {/* Big Clean Headline (Y hệt ảnh mẫu: "Coffee / The Best For You") */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-black text-[#2b170e] tracking-tight leading-[1.04] transition-all duration-300">
                {currentDrink.title} <br />
                <span className="text-[#3d2215] font-extrabold">{currentDrink.subtitle}</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-[#5a4233] max-w-xl leading-relaxed pt-1 sm:pt-2 font-medium">
                {currentDrink.desc}
              </p>
            </div>

            {/* CTA Button: Nút viên thuốc espresso có hiệu ứng tia sáng quét (Shimmer Light Sweep) */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOrderClick}
                className="ios-btn-primary px-8 sm:px-10 py-4 rounded-full font-bold text-sm sm:text-base tracking-wide cursor-pointer inline-flex items-center gap-3 shadow-lg"
              >
                <span>Xem Menu</span>
                <ArrowRight className="w-4 h-4 text-white stroke-[2.5] transform group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/85 text-xs sm:text-sm font-bold text-[#6b4a36] shadow-2xs">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{currentDrink.origin}</span>
              </div>
            </div>

            {/* Row of 4 iOS Squircle Glass Icons (Bouncing Squircle Micro-interactions) */}
            <div className="pt-3 sm:pt-4 flex items-center gap-3 sm:gap-4">
              {quickIcons.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = selectedIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => typeof item.id === 'number' && setSelectedIdx(item.id)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-[22px] transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#2b170e] text-white shadow-xl scale-110 ring-2 ring-[#2b170e]/30'
                        : 'ios-squircle-btn text-[#2b170e]'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Hero Coffee Cup Art on Saucer with FLOATING ANIMATION (Ly nước bay lên xuống) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[410px] lg:h-[410px] xl:w-[450px] xl:h-[450px] flex items-center justify-center">
              
              {/* Glowing Ambient Radial Aura pulsing in background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d8a36c]/45 via-[#f0caa3]/55 to-[#fae5ce]/45 rounded-full blur-3xl transform scale-125 animate-pulse-subtle pointer-events-none" />

              {/* Floating Decorative Glass Capsule (Top Left): Rating */}
              <div className="absolute -top-3 -left-3 sm:top-2 sm:-left-4 lg:-top-2 lg:-left-6 z-20 px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_10px_25px_rgba(60,35,15,0.12)] flex items-center gap-1.5 animate-float-reverse">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs sm:text-sm font-black text-[#2b170e]">{currentDrink.rating}</span>
                <span className="text-[11px] sm:text-xs text-[#7a5843] font-medium hidden sm:inline">(1.2k+ đánh giá)</span>
              </div>

              {/* Floating Decorative Glass Capsule (Top Right): 24/7 Hot Fresh */}
              <div className="absolute -top-2 -right-3 sm:top-3 sm:-right-4 lg:-top-1 lg:-right-6 z-20 px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_10px_25px_rgba(60,35,15,0.12)] flex items-center gap-1.5 animate-float-slow">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-black text-[#2b170e]">Pha Tươi 24/7</span>
              </div>

              {/* THE FLOATING COFFEE CUP & SAUCER (Hiệu ứng ly cà phê bay lên xuống uyển chuyển) */}
              <div className="relative animate-float-slow transition-transform duration-700">
                
                {/* Subtle steam wave rising up */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-10 pointer-events-none flex justify-center gap-2.5">
                  <span className="w-1.5 h-7 rounded-full bg-white/40 blur-[1px] animate-steam" />
                  <span className="w-1.5 h-9 rounded-full bg-white/30 blur-[1px] animate-steam" style={{ animationDelay: '0.8s' }} />
                </div>

                {/* White Saucer Plate with Soft Radial Edge */}
                <div className="relative w-60 h-60 sm:w-76 sm:h-76 lg:w-[360px] lg:h-[360px] xl:w-[390px] xl:h-[390px] rounded-full bg-white p-3.5 sm:p-5 shadow-[0_32px_70px_rgba(60,35,15,0.22)] border border-white/95 flex items-center justify-center transition-all duration-700 hover:rotate-3 group cursor-pointer">
                  
                  {/* Outer cup rim */}
                  <div className="w-full h-full rounded-full bg-[#faf7f3] p-3 sm:p-4 shadow-inner border border-stone-200 flex items-center justify-center">
                    
                    {/* Coffee surface with rich foam and latte art */}
                    <div className="w-full h-full rounded-full overflow-hidden relative shadow-[inset_0_4px_14px_rgba(0,0,0,0.28)]">
                      <img 
                        key={currentDrink.id}
                        src={currentDrink.image} 
                        alt={currentDrink.drinkName} 
                        className="w-full h-full object-cover object-center filter saturate-115 animate-in fade-in zoom-in-95 duration-500"
                      />
                      {/* Realistic glass specular reflection over coffee surface */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/35 pointer-events-none" />
                    </div>

                  </div>

                  {/* Cup handle sticking out slightly to the right */}
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-12 rounded-r-2xl border-4 border-l-0 border-white bg-white/70 shadow-md" />

                </div>
              </div>

              {/* Floating pill badge showing drink name and price */}
              <div className="absolute -bottom-5 sm:-bottom-3 left-1/2 -translate-x-1/2 px-7 py-3 rounded-full bg-white/95 backdrop-blur-2xl border border-white/95 shadow-[0_14px_35px_rgba(60,35,15,0.15)] text-center whitespace-nowrap z-20 animate-float-reverse">
                <span className="text-xs sm:text-sm font-black text-[#2b170e] uppercase tracking-wider block">
                  {currentDrink.drinkName}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#8c5932] mt-0.5 block">
                  {currentDrink.price} • {currentDrink.badge}
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
