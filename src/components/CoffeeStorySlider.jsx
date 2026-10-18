import React, { useState, useEffect } from 'react';
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
import { getSiteConfig, DEFAULT_SITE_CONFIG } from '../data/siteConfig';

export default function CoffeeStorySlider({ onOrderClick }) {
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);
  const [selectedIdx, setSelectedIdx] = useState(0);

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

  const hero = siteConfig.heroSection || DEFAULT_SITE_CONFIG.heroSection;
  const items = (hero.items && hero.items.length > 0) ? hero.items : DEFAULT_SITE_CONFIG.heroSection.items;

  // Ensure selectedIdx is in bounds
  const safeIdx = (selectedIdx >= 0 && selectedIdx < items.length) ? selectedIdx : 0;
  const currentDrink = items[safeIdx] || items[0] || {};

  const imageStyle = hero.imageStyle || DEFAULT_SITE_CONFIG.heroSection.imageStyle;

  // 4 iOS Squircle Glass Quick Icons
  const quickIcons = [
    { icon: Coffee, label: 'Cà phê nóng' },
    { icon: Droplets, label: 'Cold brew' },
    { icon: Sparkles, label: 'Đặc sản' },
    { icon: Heart, label: 'Rang mộc' }
  ];

  return (
    <div className="w-full font-sans select-none relative">
      {/* iOS Frosted Glass Panel Container with Specular Reflections */}
      <div className="relative w-full rounded-[36px] sm:rounded-[52px] overflow-hidden ios-glass-panel px-6 sm:px-10 lg:px-14 xl:px-16 py-6 sm:py-9 lg:py-11 xl:py-12 transition-all duration-500 shadow-[0_24px_70px_rgba(60,35,15,0.08)] border border-white/90">
        
        {/* Subtle Glass Diagonal Glare Line */}
        <div className="absolute -top-32 -left-32 w-80 h-[500px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -rotate-45 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center relative z-10">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-left">
            
            {/* Brand mini-tag with glowing pulse */}
            {hero.badge?.enabled !== false && (
              <div 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/90 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs transition-all duration-300"
                style={{
                  backgroundColor: hero.badge?.bgColor || 'rgba(255, 255, 255, 0.75)',
                  color: hero.badge?.textColor || '#704f38'
                }}
              >
                <Coffee className="w-4 h-4 text-[#2b170e]" />
                <span>{hero.badge?.text || 'COFFEE 24/24 · ENJOY YOUR LIFE'}</span>
                {hero.badge?.showDot !== false && (
                  <span 
                    className="w-2 h-2 rounded-full animate-pulse ml-1"
                    style={{ backgroundColor: hero.badge?.dotColor || '#10b981' }}
                  />
                )}
              </div>
            )}

            {/* Big Clean Headline */}
            {hero.headline?.enabled !== false && (
              <div className="space-y-2">
                <h1 
                  className={`font-black tracking-tight leading-[1.25] sm:leading-[1.3] transition-all duration-300 ${
                    hero.headline?.size === 'huge' ? 'text-5xl sm:text-7xl lg:text-8xl xl:text-[90px]' :
                    hero.headline?.size === 'medium' ? 'text-3xl sm:text-5xl lg:text-6xl xl:text-[68px]' :
                    hero.headline?.size === 'normal' ? 'text-2xl sm:text-4xl lg:text-5xl xl:text-[56px]' :
                    'text-4xl sm:text-6xl lg:text-7xl xl:text-[80px]'
                  }`}
                  style={{
                    color: hero.headline?.colorLine1 || '#2b170e',
                    textShadow: hero.headline?.effect === 'glow' ? '0 0 24px rgba(217, 119, 6, 0.45)' :
                                hero.headline?.effect === 'shadow' ? '2px 4px 14px rgba(43, 23, 14, 0.28)' : 'none'
                  }}
                >
                  {currentDrink.title || hero.headline?.line1 || 'Coffee'} <br />
                  <span 
                    className="font-extrabold transition-colors duration-300 inline-block mt-1 sm:mt-2"
                    style={{ color: hero.headline?.colorLine2 || '#3d2215' }}
                  >
                    {currentDrink.subtitle || hero.headline?.line2 || 'The Best For You'}
                  </span>
                </h1>

                {/* Description Text */}
                {hero.description?.enabled !== false && (
                  <p 
                    className={`max-w-xl leading-relaxed pt-1 sm:pt-2 font-medium transition-all duration-300 ${
                      hero.description?.size === 'large' ? 'text-lg sm:text-xl lg:text-2xl' :
                      hero.description?.size === 'small' ? 'text-sm sm:text-base' :
                      'text-base sm:text-lg lg:text-xl'
                    }`}
                    style={{ color: hero.description?.color || '#5a4233' }}
                  >
                    {currentDrink.desc || hero.description?.text}
                  </p>
                )}
              </div>
            )}

            {/* CTA Button: Nút viên thuốc espresso có hiệu ứng tia sáng quét (Shimmer Light Sweep) */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {hero.ctaButton?.enabled !== false && (
                <button
                  onClick={onOrderClick}
                  className="ios-btn-primary px-8 sm:px-10 py-4 rounded-full font-bold text-sm sm:text-base tracking-wide cursor-pointer inline-flex items-center gap-3 shadow-lg group transition-transform active:scale-95"
                  style={{
                    background: hero.ctaButton?.colorScheme === 'amber' ? 'linear-gradient(135deg, #d97706, #b45309)' :
                                hero.ctaButton?.colorScheme === 'gradient_rich' ? 'linear-gradient(135deg, #8c5932, #2b170e)' :
                                'linear-gradient(135deg, #2b170e 0%, #1f0f09 100%)'
                  }}
                >
                  <span>{hero.ctaButton?.text || 'Xem Menu'}</span>
                  <ArrowRight className="w-4 h-4 text-white stroke-[2.5] transform group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {hero.originBadge?.enabled !== false && (
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/85 text-xs sm:text-sm font-bold text-[#6b4a36] shadow-2xs">
                  {hero.originBadge?.showIcon !== false && <Award className="w-4 h-4 text-amber-600" />}
                  <span>{currentDrink.origin || hero.originBadge?.text || 'Cầu Đất Farm'}</span>
                </div>
              )}
            </div>

            {/* Row of 4 iOS Squircle Glass Icons (Bouncing Squircle Micro-interactions) */}
            <div className="pt-3 sm:pt-4 flex items-center gap-3 sm:gap-4">
              {quickIcons.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = safeIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => idx < items.length && setSelectedIdx(idx)}
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

          {/* Right Column: Hero Coffee Cup Art on Saucer with FLOATING ANIMATION */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div 
              className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[410px] lg:h-[410px] xl:w-[450px] xl:h-[450px] flex items-center justify-center transition-all duration-300"
              style={{
                transform: `scale(${(imageStyle.scale || 100) / 100})`,
                opacity: (imageStyle.opacity || 100) / 100
              }}
            >
              
              {/* Glowing Ambient Radial Aura pulsing in background */}
              {imageStyle.showGlowAura !== false && (
                <div className="absolute inset-0 bg-gradient-to-tr from-[#d8a36c]/45 via-[#f0caa3]/55 to-[#fae5ce]/45 rounded-full blur-3xl transform scale-125 animate-pulse-subtle pointer-events-none" />
              )}

              {/* Floating Decorative Glass Capsule (Top Left): Rating */}
              {hero.ratingBadge?.enabled !== false && (
                <div className="absolute -top-3 -left-3 sm:top-2 sm:-left-4 lg:-top-2 lg:-left-6 z-20 px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_10px_25px_rgba(60,35,15,0.12)] flex items-center gap-1.5 animate-float-reverse">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs sm:text-sm font-black text-[#2b170e]">{currentDrink.rating || hero.ratingBadge?.rating || '4.9 ★'}</span>
                  <span className="text-[11px] sm:text-xs text-[#7a5843] font-medium hidden sm:inline">{hero.ratingBadge?.subtext || '(1.2k+ đánh giá)'}</span>
                </div>
              )}

              {/* Floating Decorative Glass Capsule (Top Right): 24/7 Hot Fresh */}
              {hero.freshBadge?.enabled !== false && (
                <div className="absolute -top-2 -right-3 sm:top-3 sm:-right-4 lg:-top-1 lg:-right-6 z-20 px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_10px_25px_rgba(60,35,15,0.12)] flex items-center gap-1.5 animate-float-slow">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                  <span className="text-xs sm:text-sm font-black text-[#2b170e]">{hero.freshBadge?.text || 'Pha Tươi 24/7'}</span>
                </div>
              )}

              {/* THE FLOATING COFFEE CUP & SAUCER CONTAINER */}
              <div className={`relative transition-transform duration-700 ${imageStyle.animation === 'none' ? '' : 'animate-float-slow'}`}>
                
                {/* Subtle steam wave rising up */}
                {imageStyle.showSteam !== false && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-10 pointer-events-none flex justify-center gap-2.5">
                    <span className="w-1.5 h-7 rounded-full bg-white/40 blur-[1px] animate-steam" />
                    <span className="w-1.5 h-9 rounded-full bg-white/30 blur-[1px] animate-steam" style={{ animationDelay: '0.8s' }} />
                  </div>
                )}

                {/* Cup Body Container Shape */}
                <div className={`relative flex items-center justify-center transition-all duration-700 hover:rotate-2 group cursor-pointer ${
                  imageStyle.shape === 'squircle' ? 'w-60 h-60 sm:w-76 sm:h-76 lg:w-[360px] lg:h-[360px] xl:w-[390px] xl:h-[390px] rounded-[48px] bg-white p-4 shadow-[0_32px_70px_rgba(60,35,15,0.20)] border border-white/95' :
                  imageStyle.shape === 'circle_plain' ? 'w-60 h-60 sm:w-76 sm:h-76 lg:w-[360px] lg:h-[360px] xl:w-[390px] xl:h-[390px] rounded-full bg-white p-4 shadow-[0_32px_70px_rgba(60,35,15,0.20)] border border-white/95' :
                  imageStyle.shape === 'rounded_card' ? 'w-64 h-56 sm:w-80 sm:h-72 lg:w-[380px] lg:h-[340px] rounded-[36px] bg-white p-4 shadow-[0_32px_70px_rgba(60,35,15,0.20)] border border-white/95' :
                  'w-60 h-60 sm:w-76 sm:h-76 lg:w-[360px] lg:h-[360px] xl:w-[390px] xl:h-[390px] rounded-full bg-white p-3.5 sm:p-5 shadow-[0_32px_70px_rgba(60,35,15,0.22)] border border-white/95'
                }`}>
                  
                  {/* Outer cup rim / inner frame */}
                  <div className={`w-full h-full p-3 sm:p-4 shadow-inner border border-stone-200 flex items-center justify-center ${
                    imageStyle.shape === 'rounded_card' ? 'rounded-2xl bg-[#faf7f3]' :
                    imageStyle.shape === 'squircle' ? 'rounded-[36px] bg-[#faf7f3]' :
                    'rounded-full bg-[#faf7f3]'
                  }`}>
                    
                    {/* Coffee surface with rich foam and latte art */}
                    <div className={`w-full h-full overflow-hidden relative shadow-[inset_0_4px_14px_rgba(0,0,0,0.28)] ${
                      imageStyle.shape === 'rounded_card' ? 'rounded-xl' :
                      imageStyle.shape === 'squircle' ? 'rounded-[28px]' :
                      'rounded-full'
                    }`}>
                      <img 
                        key={currentDrink.id || safeIdx}
                        src={currentDrink.image || '/images/signature_drinks.jpg'} 
                        alt={currentDrink.drinkName || 'Hero Coffee'} 
                        className="w-full h-full object-cover object-center animate-in fade-in zoom-in-95 duration-500 transition-all duration-300"
                        style={{
                          filter: `blur(${imageStyle.blur || 0}px) brightness(${imageStyle.brightness || 100}%) contrast(${imageStyle.contrast || 100}%) saturate(${imageStyle.saturation || 115}%)`
                        }}
                      />
                      {/* Realistic glass specular reflection over coffee surface */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/35 pointer-events-none" />
                    </div>

                  </div>

                  {/* Cup handle sticking out slightly to the right (Only for cup_saucer) */}
                  {imageStyle.shape === 'cup_saucer' && imageStyle.showSaucer !== false && (
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-12 rounded-r-2xl border-4 border-l-0 border-white bg-white/70 shadow-md" />
                  )}

                </div>
              </div>

              {/* Floating pill badge showing drink name and price */}
              {hero.drinkPill?.enabled !== false && (
                <div className="absolute -bottom-5 sm:-bottom-3 left-1/2 -translate-x-1/2 px-7 py-3 rounded-full bg-white/95 backdrop-blur-2xl border border-white/95 shadow-[0_14px_35px_rgba(60,35,15,0.15)] text-center whitespace-nowrap z-20 animate-float-reverse">
                  <span className="text-xs sm:text-sm font-black text-[#2b170e] uppercase tracking-wider block">
                    {currentDrink.drinkName || hero.drinkPill?.drinkName || 'CAPPUCCINO LATTE ART'}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#8c5932] mt-0.5 block">
                    {currentDrink.price || '45.000đ'} • {currentDrink.badge || 'Signature'}
                  </span>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
