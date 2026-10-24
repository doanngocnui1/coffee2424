import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function SideBanners({ config, navigate }) {
  const [leftDismissed, setLeftDismissed] = useState(false);
  const [rightDismissed, setRightDismissed] = useState(false);

  if (!config?.sideBanners?.enabled) return null;

  const { left, right } = config.sideBanners;

  return (
    <>
      {/* POSTER BÊN TRÁI (TỶ LỆ 9:21, TÙY CHỌN BẬT/TẮT CHỮ THEO ADMIN, CLICK CHUYỂN TRANG) */}
      {!leftDismissed && left && (
        <aside 
          aria-label="Poster quảng cáo bên trái"
          className="hidden xl:block fixed top-24 2xl:top-28 left-3 xl:left-4 2xl:left-7 z-40 w-48 xl:w-52 2xl:w-60 select-none animate-in slide-in-from-left duration-500 group"
        >
          {/* Nút đóng X ở góc */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLeftDismissed(true);
            }}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#2b170e] hover:text-black border border-white/90 shadow-md flex items-center justify-center transition-all z-30 cursor-pointer hover:scale-110 active:scale-95 backdrop-blur-md"
            title="Đóng quảng cáo"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Click thẳng vào poster chuyển sang trang liên quan (Khung tự động co giãn theo tỉ lệ ảnh) */}
          <div
            onClick={() => navigate(left.link || '/dathang')}
            className="relative w-full overflow-hidden rounded-[28px] border-2 border-white/80 shadow-[0_15px_40px_rgba(60,35,15,0.12)] group-hover:shadow-[0_20px_50px_rgba(60,35,15,0.22)] group-hover:border-white group-hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-xl max-h-[82vh]"
          >
            <img 
              src={left.image || '/images/poster_vertical_left.jpg'} 
              alt={left.title || 'Poster COFFEE 24/24'} 
              loading="lazy"
              decoding="async"
              className="w-full h-auto max-h-[82vh] block group-hover:scale-105 transition-transform duration-700"
            />

            {/* BẬT/TẮT HUY HIỆU (BADGE) NẾU ADMIN BẬT */}
            {left.showBadge && (
              <div className="absolute top-3.5 left-3.5 z-30 pointer-events-none">
                <span className="px-3.5 py-1 rounded-full bg-[#2b170e] text-white text-xs xl:text-sm font-black uppercase tracking-wider shadow-lg border border-white/30 inline-flex items-center">
                  {left.badge || 'NEW'}
                </span>
              </div>
            )}

            {/* BẬT/TẮT THÔNG TIN CHỮ NẾU ADMIN BẬT */}
            {(left.showTitle || left.showSubtitle || left.showDesc) && (
              <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 bg-gradient-to-t from-[#180d08]/95 via-[#180d08]/80 to-transparent space-y-1.5 text-white z-30 pointer-events-none">
                {left.showTitle && (
                  <h4 className="text-xs xl:text-sm font-black tracking-wider text-amber-300 uppercase leading-tight line-clamp-1">
                    {left.title || 'MÓN MỚI'}
                  </h4>
                )}
                {left.showSubtitle && (
                  <p className="text-base xl:text-lg font-black text-white leading-tight line-clamp-2 drop-shadow-md">
                    {left.subtitle || 'Cold Brew Cam Vàng'}
                  </p>
                )}
                {left.showDesc && (
                  <p className="text-xs xl:text-sm text-stone-200 leading-tight line-clamp-2 pt-0.5">
                    {left.desc || 'Ủ lạnh 24 giờ thơm mát sảng khoái'}
                  </p>
                )}
              </div>
            )}

            {/* Lớp bóng kính tương tác nhẹ khi hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </aside>
      )}

      {/* POSTER BÊN PHẢI (TỶ LỆ 9:21, TÙY CHỌN BẬT/TẮT CHỮ THEO ADMIN, CLICK CHUYỂN TRANG) */}
      {!rightDismissed && right && (
        <aside 
          aria-label="Poster quảng cáo bên phải"
          className="hidden xl:block fixed top-24 2xl:top-28 right-3 xl:right-4 2xl:right-7 z-40 w-48 xl:w-52 2xl:w-60 select-none animate-in slide-in-from-right duration-500 group"
        >
          {/* Nút đóng X ở góc */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRightDismissed(true);
            }}
            className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#2b170e] hover:text-black border border-white/90 shadow-md flex items-center justify-center transition-all z-30 cursor-pointer hover:scale-110 active:scale-95 backdrop-blur-md"
            title="Đóng quảng cáo"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Click thẳng vào poster chuyển sang trang liên quan (Khung tự động co giãn theo tỉ lệ ảnh) */}
          <div
            onClick={() => navigate(right.link || '/khuyenmai')}
            className="relative w-full overflow-hidden rounded-[28px] border-2 border-white/80 shadow-[0_15px_40px_rgba(60,35,15,0.12)] group-hover:shadow-[0_20px_50px_rgba(60,35,15,0.22)] group-hover:border-white group-hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-xl max-h-[82vh]"
          >
            <img 
              src={right.image || '/images/poster_vertical_right.jpg'} 
              alt={right.title || 'Poster Ưu Đãi COFFEE 24/24'} 
              loading="lazy"
              decoding="async"
              className="w-full h-auto max-h-[82vh] block group-hover:scale-105 transition-transform duration-700"
            />

            {/* BẬT/TẮT HUY HIỆU (BADGE) NẾU ADMIN BẬT */}
            {right.showBadge && (
              <div className="absolute top-3.5 left-3.5 z-30 pointer-events-none">
                <span className="px-3.5 py-1 rounded-full bg-[#8c5932] text-white text-xs xl:text-sm font-black uppercase tracking-wider shadow-lg border border-white/30 inline-flex items-center">
                  {right.badge || '69K'}
                </span>
              </div>
            )}

            {/* BẬT/TẮT THÔNG TIN CHỮ NẾU ADMIN BẬT */}
            {(right.showTitle || right.showSubtitle || right.showDesc) && (
              <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 bg-gradient-to-t from-[#180d08]/95 via-[#180d08]/80 to-transparent space-y-1.5 text-white z-30 pointer-events-none">
                {right.showTitle && (
                  <h4 className="text-xs xl:text-sm font-black tracking-wider text-amber-300 uppercase leading-tight line-clamp-1">
                    {right.title || 'COMBO HOT'}
                  </h4>
                )}
                {right.showSubtitle && (
                  <p className="text-base xl:text-lg font-black text-white leading-tight line-clamp-2 drop-shadow-md">
                    {right.subtitle || 'Cà Phê & Croissant'}
                  </p>
                )}
                {right.showDesc && (
                  <p className="text-xs xl:text-sm text-stone-200 leading-tight line-clamp-2 pt-0.5">
                    {right.desc || 'Combo sáng năng lượng chỉ 69K'}
                  </p>
                )}
              </div>
            )}

            {/* Lớp bóng kính tương tác nhẹ khi hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </aside>
      )}
    </>
  );
}
