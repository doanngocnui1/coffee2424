import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, Share2, Eye, X, Check, Globe } from 'lucide-react';
import { getSiteConfig } from '../data/siteConfig';

// Authentic Brand SVGs for Pixel-Perfect Social Media Appearance
export const BrandIcons = {
  facebook: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  tiktok: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  instagram: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  threads: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12.186 24C5.46 24 0 18.663 0 12.08 0 5.5 5.46.16 12.186.16c6.643 0 11.968 5.176 11.968 11.75 0 .685-.064 1.37-.183 2.046h-4.08c.112-.663.168-1.341.168-2.046 0-4.32-3.528-7.794-7.873-7.794-4.344 0-7.872 3.474-7.872 7.794 0 4.321 3.528 7.795 7.872 7.795 2.18 0 4.156-.88 5.586-2.308l2.912 2.875C18.892 22.392 15.72 24 12.186 24z"/>
    </svg>
  ),
  youtube: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  zalo: () => (
    <span className="font-black text-xs tracking-tight text-blue-600 bg-white px-1 rounded-sm">
      Zalo
    </span>
  )
};

// Reusable Circular Social Buttons (Nút Tròn Siêu Đẹp & Tinh Tế)
export function SocialRoundButtons({ platforms = [], onOpenPlugin, showPluginBtn = true }) {
  return (
    <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 justify-center sm:justify-start">
      {platforms.map((platform) => {
        const IconComponent = BrandIcons[platform.id] || BrandIcons.facebook;
        const isPlaceholder = platform.isPlaceholder && !platform.url;

        // Custom platform hover glow and active styles
        const getButtonTheme = (id) => {
          switch (id) {
            case 'facebook':
              return 'text-[#1877F2] bg-white/85 border-blue-200/80 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_8px_20px_rgba(24,119,242,0.35)]';
            case 'tiktok':
              return 'text-neutral-900 bg-white/85 border-neutral-300/80 hover:bg-neutral-950 hover:text-white hover:border-black hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)]';
            case 'instagram':
              return 'text-[#E1306C] bg-white/85 border-pink-200/80 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-transparent hover:shadow-[0_8px_20px_rgba(225,48,108,0.35)]';
            case 'threads':
              return 'text-neutral-800 bg-white/85 border-neutral-300/80 hover:bg-neutral-900 hover:text-white hover:border-black hover:shadow-[0_8px_20px_rgba(17,17,17,0.35)]';
            case 'youtube':
              return 'text-[#FF0000] bg-white/85 border-red-200/80 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:shadow-[0_8px_20px_rgba(255,0,0,0.35)]';
            default:
              return 'text-[#8c5932] bg-white/85 border-stone-200 hover:bg-[#8c5932] hover:text-white hover:border-[#8c5932] hover:shadow-md';
          }
        };

        const themeClass = getButtonTheme(platform.id);

        return (
          <div key={platform.id} className="relative group/social">
            {/* Round Circular Button */}
            <a
              href={platform.url || '#'}
              target="_blank"
              rel="noreferrer"
              aria-label={`Kết nối với ${platform.name}`}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-300 shadow-xs hover:-translate-y-1 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md ${
                isPlaceholder ? 'opacity-70 border-dashed border-stone-400 bg-white/50 text-stone-600 hover:opacity-100' : themeClass
              }`}
            >
              <IconComponent />

              {/* Status Indicator Dot (Xanh lá nếu chính thức hoạt động) */}
              {!isPlaceholder && (
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs group-hover/social:scale-125 transition-transform" />
              )}
            </a>

            {/* Micro-Tooltip on Hover (Apple iOS Glass Style) */}
            <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/social:opacity-100 group-hover/social:-translate-y-1 pointer-events-none transition-all duration-200 z-50 flex flex-col items-center">
              <div className="bg-neutral-900/95 text-white px-3 py-1.5 rounded-xl shadow-xl border border-white/10 backdrop-blur-md flex flex-col items-center gap-0.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wide">{platform.name}</span>
                  {platform.badge && (
                    <span className="text-[8.5px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-bold">
                      {platform.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-300 font-mono">
                  {platform.handle || platform.placeholderText || 'Chờ liên kết'}
                </span>
              </div>
              {/* Arrow */}
              <div className="w-2 h-2 bg-neutral-900/95 rotate-45 -mt-1 border-r border-b border-white/10" />
            </div>
          </div>
        );
      })}

      {/* Nút Xem Plugin / Fanpage Preview */}
      {showPluginBtn && onOpenPlugin && (
        <button
          type="button"
          onClick={onOpenPlugin}
          className="h-11 sm:h-12 px-4 rounded-full bg-white/70 hover:bg-white text-[#2b170e] hover:text-[#1877F2] border border-white/90 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-2 text-xs font-bold active:scale-95 cursor-pointer backdrop-blur-md group"
          title="Xem bảng tin Fanpage Facebook trực tiếp"
        >
          <div className="w-5 h-5 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">Xem Plugin Fanpage</span>
          <span className="sm:hidden">Plugin</span>
        </button>
      )}
    </div>
  );
}

// Modal Xem Nhanh Plugin Fanpage & Mạng Xã Hội
export function SocialPluginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#fcfaf7] border border-stone-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <BrandIcons.facebook />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#2b170e]">COFFEE 24/24 Official Page</h3>
              <p className="text-[11px] text-[#8c5932] font-semibold">Plugin nhúng Fanpage & Kênh truyền thông</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Facebook Plugin Iframe */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-center space-y-4">
          <div className="w-full max-w-[360px] rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-md flex justify-center py-2">
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcoffee2424&tabs=timeline&width=340&height=460&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="340"
              height="460"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Facebook Fanpage Coffee 24/24"
            />
          </div>

          {/* Quick Direct Links */}
          <div className="w-full grid grid-cols-2 gap-2 pt-2">
            <a
              href="https://www.facebook.com/coffee2424"
              target="_blank"
              rel="noreferrer"
              className="py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors shadow-xs"
            >
              <span>Mở Fanpage</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.tiktok.com/@hethongcoffee2424"
              target="_blank"
              rel="noreferrer"
              className="py-2 px-3 rounded-xl bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-stone-900 transition-colors shadow-xs"
            >
              <span>Mở TikTok</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 text-center">
          <p className="text-[11px] text-stone-500">
            Hệ thống COFFEE 24/24 phục vụ 24/7 tại 413 Phan Huy Ích & 96 đường D5, TP.HCM
          </p>
        </div>
      </div>
    </div>
  );
}

// Component chính dùng tại Chân Trang
export default function SocialFollowSection() {
  const [config, setConfig] = useState(getSiteConfig);
  const [isPluginModalOpen, setIsPluginModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setConfig(getSiteConfig());
    window.addEventListener('site-config-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('site-config-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const socialConfig = config.socialMedia || {};
  const platforms = (socialConfig.platforms || []).filter(p => p.visible !== false);

  return (
    <section className="bg-white/45 backdrop-blur-2xl border-t border-white/70 py-8 sm:py-10 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
          
          {/* Brand Statement */}
          <div className="space-y-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-600/30 text-[11px] font-mono tracking-widest uppercase text-[#8c5932] font-black">
              <Share2 className="w-3.5 h-3.5" />
              <span>{socialConfig.sectionTitle || 'FOLLOW OUR JOURNEY · #ENJOYYOURLIFE'}</span>
            </div>
            <div className="text-base sm:text-xl font-black text-[#2b170e]">
              {socialConfig.sectionSubtitle || 'Kết nối cùng cộng đồng COFFEE 24/24'}
            </div>
            <p className="text-xs text-[#704f38] hidden sm:block">
              Theo dõi fanpage, tiktok và kênh chính thức để nhận ngay tin tức mới nhất & ưu đãi bí mật.
            </p>
          </div>

          {/* Nút Tròn Mạng Xã Hội */}
          <SocialRoundButtons 
            platforms={platforms} 
            onOpenPlugin={() => setIsPluginModalOpen(true)}
            showPluginBtn={true}
          />

        </div>
      </div>

      {/* Modal Plugin */}
      <SocialPluginModal 
        isOpen={isPluginModalOpen} 
        onClose={() => setIsPluginModalOpen(false)} 
      />
    </section>
  );
}
