import React from 'react';
import { MapPin, Mail, BookOpen, QrCode, PhoneCall, ArrowUpRight } from 'lucide-react';
import { getSiteConfig } from '../data/siteConfig';
import SocialFollowSection from './SocialFollowSection';

export default function Footer({ navigate }) {
  const config = getSiteConfig();

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
                <img 
                  src="/images/logo.jpg" 
                  alt="COFFEE 24/24 Logo" 
                  className="w-12 h-12 rounded-full border border-white/90 object-cover bg-white shadow-md"
                />
                <div>
                  <span className="text-xl font-black text-[#2b170e] tracking-wider block">COFFEE 24/24</span>
                  <span className="text-xs text-[#8c5932] font-black tracking-widest uppercase">{config.slogan || 'Enjoy Your Life'}</span>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-[#5c3d2e] leading-relaxed font-normal">
                Cà phê rang mộc nguyên chất, chắt lọc tinh hoa từ những vùng trồng trứ danh. Không gian mở truyền cảm hứng làm việc & sáng tạo suốt 24 giờ.
              </p>

              <div className="text-xs sm:text-sm text-[#2b170e] font-bold bg-white/80 px-4 py-2.5 rounded-2xl border border-white/90 w-fit shadow-xs inline-flex items-center gap-1.5">
                <span>☕</span>
                <span>Hương vị cà phê nguyên bản & mộc mạc</span>
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

            {/* Quét QR Thực Đơn Trực Tuyến */}
            <div className="space-y-4">
              <h4 className="text-[#2b170e] text-sm font-black tracking-widest uppercase border-l-3 border-[#8c5932] pl-2.5">
                Quét QR Thực Đơn
              </h4>
              
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-white/70 p-3.5 rounded-2xl border border-white/90 shadow-sm">
                  <img 
                    src="/images/qr_menu_table.png" 
                    alt="QR Menu 413PHI" 
                    className="w-18 h-18 bg-white p-1 rounded-xl mx-auto border border-stone-200"
                  />
                  <span className="text-xs sm:text-sm text-[#2b170e] font-bold block mt-2">Menu 413PHI</span>
                </div>
                <div className="bg-white/70 p-3.5 rounded-2xl border border-white/90 shadow-sm">
                  <img 
                    src="/images/qr_menu_96d5.png" 
                    alt="QR Menu 96D5" 
                    className="w-18 h-18 bg-white p-1 rounded-xl mx-auto border border-stone-200"
                  />
                  <span className="text-xs sm:text-sm text-[#2b170e] font-bold block mt-2">Menu 96D5</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#7a5843] pt-1 leading-relaxed">
                Quét mã QR bằng camera điện thoại để xem nhanh thực đơn & chọn món tại bàn.
              </p>
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
