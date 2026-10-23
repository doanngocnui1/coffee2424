import React, { useState, useEffect } from 'react';
import { 
  Store, 
  X, 
  ExternalLink, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  ChevronRight,
  ShieldCheck,
  Coffee
} from 'lucide-react';
import { getBranches } from '../data/branches';
import { getSiteConfig } from '../data/siteConfig';

export default function BranchOrderModal({ isOpen, onClose, navigate }) {
  const [branches, setBranches] = useState(getBranches);
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);

  useEffect(() => {
    const handleUpdate = () => setBranches(getBranches());
    const handleConfigUpdate = () => setSiteConfig(getSiteConfig());
    window.addEventListener('branches-updated', handleUpdate);
    window.addEventListener('site-config-updated', handleConfigUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('branches-updated', handleUpdate);
      window.removeEventListener('site-config-updated', handleConfigUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Khóa cuộn body và lắng nghe phím ESC để đóng modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const orderOnline = siteConfig.orderOnline || {};
  const openMode = orderOnline.openMode || 'new_tab';

  const handleSelectBranch = (branch) => {
    // Menu URL theo từng chi nhánh:
    // D5: https://coffee2424.web-store.online/menu/363827
    // Phan Huy Ích: https://coffee2424.web-store.online/menu/363688
    let targetUrl = branch.menuUrl;
    if (!targetUrl || targetUrl.trim() === '') {
      if (branch.id === 'cn-96d5' || branch.code === '96D5') {
        targetUrl = 'https://coffee2424.web-store.online/menu/363827';
      } else if (branch.id === 'cn-413phi' || branch.code === '413PHI') {
        targetUrl = 'https://coffee2424.web-store.online/menu/363688';
      } else {
        targetUrl = orderOnline.url || 'https://coffee2424.web-store.online';
      }
    }

    if (openMode === 'same_tab') {
      window.location.href = targetUrl;
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }

    onClose();
  };

  const handleGoToOrderPage = () => {
    onClose();
    if (typeof navigate === 'function') {
      navigate('/dathang');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-[36px] sm:rounded-[44px] border border-white shadow-[0_25px_60px_rgba(43,23,14,0.35)] overflow-hidden p-6 sm:p-8 space-y-6 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Đóng bảng chọn"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-left pr-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 text-xs font-black tracking-wider uppercase border border-amber-600/20">
            <Store className="w-3.5 h-3.5 text-amber-700" />
            <span>Hệ Thống Đặt Món Trực Tuyến 24/7</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-[#2b170e] tracking-tight uppercase">
            Lựa Chọn Chi Nhánh Đặt Món
          </h3>

          <p className="text-xs sm:text-sm text-[#6b4e3d] font-medium leading-relaxed">
            Vui lòng chọn cơ sở gần nhất để mở thực đơn KiotViet của chi nhánh đó, tối ưu phí ship và thời gian nhận món nhanh nhất:
          </p>
        </div>

        {/* Branch Cards List */}
        <div className="space-y-4">
          {branches.map((branch) => {
            const isD5 = branch.id === 'cn-96d5' || branch.code === '96D5';
            const isPHI = branch.id === 'cn-413phi' || branch.code === '413PHI';

            return (
              <div
                key={branch.id}
                className="group relative p-5 sm:p-6 rounded-3xl bg-stone-50/90 hover:bg-white border-2 border-stone-200/80 hover:border-amber-600/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Branch Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#2b170e] text-amber-300 text-[11px] font-mono font-black">
                      {branch.code || (isD5 ? '96D5' : '413PHI')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1 border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Mở cửa 24/7
                    </span>
                    {isD5 && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Bình Thạnh
                      </span>
                    )}
                    {isPHI && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Gò Vấp
                      </span>
                    )}
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-[#2b170e] group-hover:text-amber-800 transition-colors">
                    {branch.name}
                  </h4>

                  <div className="space-y-1 text-xs text-[#5c4333]">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span className="leading-snug">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono font-bold text-[#2b170e]">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <a 
                        href={`tel:${branch.hotline}`} 
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Hotline: {branch.hotline}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Big Action Button */}
                <button
                  type="button"
                  onClick={() => handleSelectBranch(branch)}
                  className="sm:self-center w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#2b170e] via-[#4a2818] to-[#2b170e] hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0 group-hover:scale-102"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>ĐẶT MÓN CHI NHÁNH NÀY</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="pt-2 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 font-medium">
          <div className="flex items-center gap-1.5 text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Menu & bảng giá đồng bộ trực tiếp từ KiotViet</span>
          </div>

          <button
            type="button"
            onClick={handleGoToOrderPage}
            className="text-amber-800 hover:text-black font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Xem thông tin 2 cơ sở & mã QR tại bàn</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
