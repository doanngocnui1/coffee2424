import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, Share2, Eye, X, Check, Globe } from 'lucide-react';
import { getSiteConfig } from '../data/siteConfig';

// Authentic Brand SVGs for Pixel-Perfect Social Media Appearance
export const BrandIcons = {
  facebook: () => (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  tiktok: () => (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  instagram: () => (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  threads: () => (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098c1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015c-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/>
    </svg>
  ),
  youtube: () => (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  zalo: () => (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24">
      <path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9453 0 1.0746.8697 1.9453 1.945 1.9453z"/>
    </svg>
  )
};

// Reusable Circular Social Buttons (Nút Tròn Siêu Đẹp & Tinh Tế)
export function SocialRoundButtons({ platforms = [] }) {
  return (
    <div className="flex items-center flex-wrap gap-4 sm:gap-6 justify-center">
      {platforms.map((platform) => {
        const IconComponent = BrandIcons[platform.id] || BrandIcons.facebook;
        const isPlaceholder = platform.isPlaceholder && !platform.url;

        // Custom platform hover glow and active styles
        const getButtonTheme = (id) => {
          switch (id) {
            case 'facebook':
              return 'text-[#1877F2] bg-white/90 border-blue-200 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_10px_25px_rgba(24,119,242,0.4)]';
            case 'tiktok':
              return 'text-neutral-900 bg-white/90 border-neutral-300 hover:bg-neutral-950 hover:text-white hover:border-black hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)]';
            case 'instagram':
              return 'text-[#E1306C] bg-white/90 border-pink-200 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-transparent hover:shadow-[0_10px_25px_rgba(225,48,108,0.4)]';
            case 'threads':
              return 'text-neutral-900 bg-white/90 border-neutral-300 hover:bg-neutral-950 hover:text-white hover:border-black hover:shadow-[0_10px_25px_rgba(17,17,17,0.4)]';
            case 'youtube':
              return 'text-[#FF0000] bg-white/90 border-red-200 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:shadow-[0_10px_25px_rgba(255,0,0,0.4)]';
            case 'zalo':
              return 'text-[#0068FF] bg-white/90 border-blue-200 hover:bg-[#0068FF] hover:text-white hover:border-[#0068FF] hover:shadow-[0_10px_25px_rgba(0,104,255,0.4)]';
            default:
              return 'text-[#8c5932] bg-white/90 border-stone-200 hover:bg-[#8c5932] hover:text-white hover:border-[#8c5932] hover:shadow-md';
          }
        };

        const themeClass = getButtonTheme(platform.id);

        return (
          <div key={platform.id} className="relative group/social">
            {/* Round Circular Button - Kích thước lớn hơn nổi bật */}
            <a
              href={platform.url || '#'}
              target="_blank"
              rel="noreferrer"
              aria-label={`Kết nối với ${platform.name}`}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm hover:-translate-y-1.5 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md ${
                isPlaceholder ? 'opacity-70 border-dashed border-stone-400 bg-white/50 text-stone-600 hover:opacity-100' : themeClass
              }`}
            >
              <IconComponent />

              {/* Status Indicator Dot (Xanh lá nếu chính thức hoạt động) */}
              {!isPlaceholder && (
                <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-2xs group-hover/social:scale-125 transition-transform" />
              )}
            </a>

            {/* Micro-Tooltip on Hover (Apple iOS Glass Style) */}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/social:opacity-100 group-hover/social:-translate-y-1 pointer-events-none transition-all duration-200 z-50 flex flex-col items-center">
              <div className="bg-neutral-900/95 text-white px-3.5 py-1.5 rounded-xl shadow-xl border border-white/10 backdrop-blur-md flex flex-col items-center gap-0.5 whitespace-nowrap">
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

// Component chính dùng tại Trang Chủ & Chân Trang
export default function SocialFollowSection({ config: propConfig } = {}) {
  const [internalConfig, setInternalConfig] = useState(getSiteConfig);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setInternalConfig(getSiteConfig());
    window.addEventListener('site-config-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('site-config-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const config = propConfig || internalConfig;
  const socialConfig = config.socialMedia || {};
  let platforms = (socialConfig.platforms || []).filter(p => p.visible !== false);

  // Đảm bảo luôn có Zalo OA trong danh sách hiển thị
  if (!platforms.some(p => p.id === 'zalo')) {
    platforms.push({
      id: 'zalo',
      name: 'Zalo OA',
      handle: config.zaloOA?.oaName || 'COFFEE 24/24',
      url: config.zaloOA?.url || 'https://zalo.me/197464281190102692',
      visible: true,
      isPlaceholder: false,
      badge: 'Chính thức',
      color: '#0068FF',
      desc: 'Quan tâm Zalo OA để nhận voucher thành viên & hỗ trợ 24/7'
    });
  }

  return (
    <div className="w-full relative font-sans space-y-6 sm:space-y-8">
      {/* 1. Thanh Kênh Mạng Xã Hội Tròn + Plugin Fanpage */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-md flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
        <div className="text-center lg:text-left">
          <span className="text-[11px] font-mono tracking-widest text-[#8c5932] font-black uppercase block">
            {socialConfig.sectionTitle || 'FOLLOW OUR JOURNEY · #ENJOYYOURLIFE'}
          </span>
          <h3 className="text-base sm:text-xl font-black text-[#2b170e] mt-1">
            {socialConfig.sectionSubtitle || 'Kết nối cùng cộng đồng COFFEE 24/24'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <SocialRoundButtons platforms={platforms} />

          {/* Nút Xem Plugin Fanpage */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-12 sm:h-14 px-4 sm:px-5 rounded-full bg-white/90 hover:bg-blue-600 text-[#1877F2] hover:text-white border border-blue-200 hover:border-transparent font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            title="Xem bảng tin Fanpage Facebook"
          >
            <Eye className="w-4 h-4" />
            <span>Plugin Fanpage</span>
          </button>
        </div>
      </div>

      {/* 2. Thẻ Zalo Official Account & Quét Mã QR Chính Thức */}
      {config.zaloOA?.visible !== false && (
        <div className="max-w-sm mx-auto p-5 sm:p-6 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/95 shadow-lg text-center space-y-3 hover:shadow-xl transition-all duration-300 group">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0068FF] text-[10.5px] font-black tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#0068FF] animate-pulse"></span>
            <span>{config.zaloOA?.title || 'Zalo Official Account'}</span>
          </div>

          {/* QR Code Frame */}
          <div className="relative inline-block p-2 bg-white rounded-2xl border border-stone-200 shadow-xs group-hover:scale-105 transition-transform duration-300">
            <img
              src={config.zaloOA?.qrImage || '/images/qr_zalo_oa.png'}
              alt="QR Zalo Official Account"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain mx-auto"
            />
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-black text-[#2b170e]">
              {config.zaloOA?.oaName || 'COFFEE 24/24'}
            </h4>
            <p className="text-[11px] sm:text-xs text-[#704f38] leading-relaxed max-w-xs mx-auto mt-1">
              {config.zaloOA?.desc || 'Quét mã QR bằng ứng dụng Zalo để nhận voucher thành viên & hỗ trợ 24/7.'}
            </p>
          </div>

          <a
            href={config.zaloOA?.url || 'https://zalo.me/197464281190102692'}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#0068FF] hover:bg-blue-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(0,104,255,0.3)] hover:shadow-[0_10px_24px_rgba(0,104,255,0.4)] transition-all active:scale-95 cursor-pointer block"
          >
            <span>{config.zaloOA?.buttonText || 'Mở Zalo OA Nhận Ưu Đãi'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Fanpage Preview Modal */}
      <SocialPluginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
