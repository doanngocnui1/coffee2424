import React, { useState, useEffect } from 'react';
import { MapPin, Mail, BookOpen, QrCode, PhoneCall, ArrowUpRight, ExternalLink } from 'lucide-react';
import { getSiteConfig } from '../data/siteConfig';
import SocialFollowSection from './SocialFollowSection';

export default function Footer({ navigate }) {
  const [config, setConfig] = useState(getSiteConfig);

  useEffect(() => {
    const handleUpdate = () => setConfig(getSiteConfig());
    window.addEventListener('site-config-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('site-config-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <div className="w-full">
      {/* NỀN TẢNG MẠNG XÃ HỘI - THEO DÕI COFFEE 24/24 (BÊN TRÊN CHÂN TRANG) */}
      <SocialFollowSection />

      {/* MAIN FOOTER - FROSTED GLASSMORPHISM */}
      <footer className="bg-white/45 backdrop-blur-3xl text-[#2b170e] border-t border-white/70 pt-16 pb-12 font-sans shadow-[0_-10px_35px_rgba(60,35,15,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-[#dfd4c7]">
          
            {/* Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src="/images/logo.jpg" 
                    alt="COFFEE 24/24 Logo" 
                    className="w-12 h-12 rounded-full border-2 border-amber-500/40 object-cover bg-white shadow-md"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Mở cửa 24/7" />
                </div>
                <div>
                  <span className="text-xl font-black text-[#2b170e] tracking-wider block">COFFEE 24/24</span>
                  <span className="text-xs text-[#8c5932] font-black tracking-widest uppercase">{config.slogan || 'ENJOY YOUR LIFE'}</span>
                </div>
              </div>
              
              <p className="text-sm text-[#5c3d2e] leading-relaxed font-normal">
                Cà phê rang mộc nguyên chất, chắt lọc tinh hoa từ Buôn Ma Thuột & Cầu Đất. Không gian mở truyền cảm hứng làm việc & sáng tạo suốt 24 giờ.
              </p>

              <div className="flex flex-col gap-1.5 text-xs text-[#5c3d2e] font-semibold pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">☕</span>
                  <span>100% Cà phê hạt rang mộc nguyên bản</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">⚡</span>
                  <span>Wifi Gigabit & Ổ cắm riêng từng bàn</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">🌙</span>
                  <span>Phục vụ bếp nóng xuyên đêm 24/24</span>
                </div>
              </div>
            </div>

            {/* Quick Links - TÁCH RIÊNG 6 TRANG ĐỘC LẬP */}
            <div className="space-y-4">
              <h4 className="text-[#2b170e] text-sm font-black tracking-widest uppercase border-l-3 border-[#8c5932] pl-2.5">
                Khám Phá Website
              </h4>
              <ul className="space-y-2.5 text-sm sm:text-base">
                <li>
                  <button 
                    onClick={() => navigate('/')} 
                    className="hover:text-[#8c5932] text-[#4a3427] transition-colors font-semibold cursor-pointer flex items-center justify-between w-full group py-0.5"
                  >
                    <span>Trang Chủ</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#8c5932]" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/dathang')} 
                    className="hover:text-[#8c5932] transition-colors font-bold text-[#2b170e] flex items-center justify-between w-full group py-0.5 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>Thực Đơn Đặt Món</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2b170e] text-white font-black">Menu</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#8c5932]" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/khuyenmai')} 
                    className="hover:text-[#8c5932] text-[#4a3427] transition-colors font-semibold cursor-pointer flex items-center justify-between w-full group py-0.5"
                  >
                    <span>Chương Trình Khuyến Mãi</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#8c5932]" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/gioithieu')} 
                    className="hover:text-[#8c5932] text-[#4a3427] transition-colors font-semibold cursor-pointer flex items-center justify-between w-full group py-0.5"
                  >
                    <span>Về Chúng Tôi (Giới Thiệu)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#8c5932]" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/tuyendung')} 
                    className="hover:text-[#8c5932] text-[#4a3427] transition-colors font-semibold cursor-pointer flex items-center justify-between w-full group py-0.5"
                  >
                    <span>Tuyển Dụng Nhân Sự</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#8c5932]" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/baiviet')} 
                    className="hover:text-[#8c5932] text-[#4a3427] transition-colors font-semibold cursor-pointer flex items-center justify-between w-full group py-0.5"
                  >
                    <span>Bài Viết & Cẩm Nang</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#8c5932]" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Cửa Hàng Tại TP.HCM */}
            <div className="space-y-4">
              <h4 className="text-[#2b170e] text-sm font-black tracking-widest uppercase border-l-3 border-[#8c5932] pl-2.5">
                Cửa Hàng Tại TP.HCM
              </h4>
              <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
                {/* Chi nhánh 413PHI */}
                <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-sm space-y-1">
                  <p className="text-[#2b170e] font-black text-sm sm:text-base">
                    Coffee 24/24 413PHI
                  </p>
                  <p className="text-[#5c3d2e] font-medium text-xs sm:text-sm">
                    413 Phan Huy Ích, P. An Hội Tây, TP.HCM
                  </p>
                  <p className="text-[#2b170e] font-bold flex items-center gap-1.5 pt-1">
                    <PhoneCall className="w-3.5 h-3.5 text-[#8c5932]" />
                    <span>Hotline:</span>
                    <a href={`tel:${config.hotlinePHI || '0986511897'}`} className="text-[#8c5932] hover:underline font-mono">
                      {config.hotlinePHI || '0986511897'}
                    </a>
                  </p>
                </div>

                {/* Chi nhánh 96D5 */}
                <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-sm space-y-1">
                  <p className="text-[#2b170e] font-black text-sm sm:text-base">
                    Coffee 24/24 96D5
                  </p>
                  <p className="text-[#5c3d2e] font-medium text-xs sm:text-sm">
                    96 đường D5, P. Thạnh Mỹ Tây, TP.HCM
                  </p>
                  <p className="text-[#2b170e] font-bold flex items-center gap-1.5 pt-1">
                    <PhoneCall className="w-3.5 h-3.5 text-[#8c5932]" />
                    <span>Hotline:</span>
                    <a href={`tel:${config.hotlineD5 || '0347374858'}`} className="text-[#8c5932] hover:underline font-mono">
                      {config.hotlineD5 || '0347374858'}
                    </a>
                  </p>
                </div>

                {/* Hotline Tổng */}
                <div className="px-4 py-3 rounded-2xl bg-white/70 border border-white/90 shadow-xs flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#5c3d2e] font-medium">Hotline tổng 24/7:</span>
                  <a href={`tel:${config.hotlineGeneral || '0906916816'}`} className="text-sm sm:text-base font-black text-[#8c5932] hover:underline font-mono">
                    {config.hotlineGeneral || '0906 916 816'}
                  </a>
                </div>
              </div>
            </div>

            {/* Cột 4: Zalo Official Account & QR Code (Hoặc tùy biến theo Admin) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[#2b170e] text-sm font-black tracking-widest uppercase border-l-3 border-[#8c5932] pl-2.5">
                  {config.zaloOA?.title || 'Zalo Official Account'}
                </h4>
                {config.zaloOA?.badge && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 font-extrabold border border-blue-500/30">
                    {config.zaloOA.badge}
                  </span>
                )}
              </div>
              
              {/* Chế độ hiển thị: zalo_only (mặc định) | both | branch_menu_only */}
              {config.zaloOA?.displayMode !== 'branch_menu_only' && (
                <div className="p-4 rounded-3xl bg-white/75 border border-white/95 shadow-sm space-y-3 flex flex-col items-center text-center">
                  <div className="relative group p-2 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                    <img 
                      src={config.zaloOA?.qrImage || '/images/qr_zalo_oa.png'} 
                      alt="QR Zalo Official Account" 
                      className="w-24 h-24 object-contain rounded-xl group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                      Z
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-black text-[#2b170e]">{config.zaloOA?.oaName || 'COFFEE 24/24'}</p>
                    <p className="text-xs text-[#704f38] leading-relaxed font-medium">
                      {config.zaloOA?.desc || 'Quét QR qua Zalo hoặc nhấn nút để nhận ưu đãi & tích điểm 24/7.'}
                    </p>
                  </div>

                  <a 
                    href={config.zaloOA?.url || 'https://zalo.me/197464281190102692'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs sm:text-sm font-black tracking-wide shadow-xs hover:shadow-md transition-all inline-flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>{config.zaloOA?.buttonText || 'Mở Zalo OA Nhận Ưu Đãi'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>
              )}

              {/* Nếu admin chọn chế độ 'both' */}
              {config.zaloOA?.displayMode === 'both' && (
                <div className="pt-2 border-t border-white/60">
                  <p className="text-xs font-bold text-[#8c5932] uppercase tracking-wider mb-2">Hoặc Quét Menu Tại Bàn:</p>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-white/70 p-2.5 rounded-xl border border-white/90 shadow-2xs">
                      <img src="/images/qr_menu_table.png" alt="QR 413PHI" className="w-12 h-12 bg-white p-0.5 rounded-lg mx-auto border border-stone-200" />
                      <span className="text-[11px] text-[#2b170e] font-bold block mt-1">413PHI</span>
                    </div>
                    <div className="bg-white/70 p-2.5 rounded-xl border border-white/90 shadow-2xs">
                      <img src="/images/qr_menu_96d5.png" alt="QR 96D5" className="w-12 h-12 bg-white p-0.5 rounded-lg mx-auto border border-stone-200" />
                      <span className="text-[11px] text-[#2b170e] font-bold block mt-1">96D5</span>
                    </div>
                  </div>
                </div>
              )}

              {config.zaloOA?.displayMode === 'branch_menu_only' && (
                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="bg-white/70 p-3.5 rounded-2xl border border-white/90 shadow-sm">
                    <img src="/images/qr_menu_table.png" alt="QR 413PHI" className="w-18 h-18 bg-white p-1 rounded-xl mx-auto border border-stone-200" />
                    <span className="text-xs sm:text-sm text-[#2b170e] font-bold block mt-2">Menu 413PHI</span>
                  </div>
                  <div className="bg-white/70 p-3.5 rounded-2xl border border-white/90 shadow-sm">
                    <img src="/images/qr_menu_96d5.png" alt="QR 96D5" className="w-18 h-18 bg-white p-1 rounded-xl mx-auto border border-stone-200" />
                    <span className="text-xs sm:text-sm text-[#2b170e] font-bold block mt-2">Menu 96D5</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Bottom copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-[#7a5843] gap-4">
            <p>© {new Date().getFullYear()} COFFEE 24/24. Bản quyền thuộc về thương hiệu.</p>
            <div className="flex items-center gap-4 text-[#5c3d2e] font-medium">
              <span>413 Phan Huy Ích</span>
              <span>•</span>
              <span>96 Đường D5</span>
              <span>•</span>
              <span className="text-[#8c5932] font-black uppercase">{config.slogan || 'Enjoy Your Life'}</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
