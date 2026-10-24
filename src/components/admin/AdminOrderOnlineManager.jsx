import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ExternalLink, 
  Globe, 
  Check, 
  Save, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Store, 
  ShieldCheck, 
  Copy,
  Plus,
  Trash2,
  PhoneCall
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../../data/siteConfig';
import { getBranches, saveBranches, DEFAULT_BRANCHES } from '../../data/branches';

export default function AdminOrderOnlineManager({ config, onSaveConfig, triggerAlert }) {
  const currentOrder = config.orderOnline || DEFAULT_SITE_CONFIG.orderOnline || {};

  const [enabled, setEnabled] = useState(currentOrder.enabled !== false);
  const [url, setUrl] = useState(currentOrder.url || 'https://coffee2424.web-store.online');
  const [openMode, setOpenMode] = useState(currentOrder.openMode || 'new_tab');
  const [buttonText, setButtonText] = useState(currentOrder.buttonText || 'Mở Web Đặt Hàng KiotViet');
  const [disableLocalMenus, setDisableLocalMenus] = useState(currentOrder.disableLocalMenus !== false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Dynamic Branches List
  const [branchesList, setBranchesList] = useState(getBranches);

  // Update specific branch
  const handleUpdateBranch = (idx, field, value) => {
    setBranchesList(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // Add new branch
  const handleAddNewBranch = () => {
    const newId = 'cn-' + Date.now().toString(36);
    const newCode = `CN${branchesList.length + 1}`;
    const newBranch = {
      id: newId,
      code: newCode,
      name: `Coffee 24/24 Chi Nhánh ${branchesList.length + 1}`,
      shortName: `Chi Nhánh ${branchesList.length + 1}`,
      address: '',
      district: 'Hồ Chí Minh',
      hotline: '0906916816',
      hours: 'Mở cửa 24/7',
      status: 'Đang mở cửa',
      image: '/images/branch_413phi.webp',
      menuUrl: 'https://coffee2424.web-store.online',
      mapUrl: '',
      features: ['Phục vụ 24/7', 'Wifi tốc độ cao', 'Ổ cắm điện'],
      description: 'Không gian cà phê mở cửa 24/7 chào đón bạn.'
    };
    setBranchesList(prev => [...prev, newBranch]);
    triggerAlert('Đã thêm 1 chi nhánh mới vào danh sách. Vui lòng điền thông tin và bấm "Lưu Cấu Hình"!');
  };

  // Remove branch
  const handleDeleteBranch = (idx) => {
    if (branchesList.length <= 1) {
      alert('Hệ thống cần tối thiểu 1 chi nhánh!');
      return;
    }
    const target = branchesList[idx];
    if (confirm(`Bạn có chắc muốn xóa "${target.name}" (${target.code})?`)) {
      setBranchesList(prev => prev.filter((_, i) => i !== idx));
      triggerAlert('Đã xóa chi nhánh. Bấm "Lưu Cấu Hình" để áp dụng!');
    }
  };

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const cleanUrl = url.trim() || 'https://coffee2424.web-store.online';

    // Lưu danh sách branches vào storage & sync
    saveBranches(branchesList);

    // Tìm URL của 2 chi nhánh chính để đồng bộ vào config
    const d5Branch = branchesList.find(b => b.id === 'cn-96d5' || b.code === '96D5');
    const phiBranch = branchesList.find(b => b.id === 'cn-413phi' || b.code === '413PHI');

    const clean96 = d5Branch?.menuUrl || 'https://coffee2424.web-store.online/menu/363827';
    const clean413 = phiBranch?.menuUrl || 'https://coffee2424.web-store.online/menu/363688';

    // Cập nhật lại danh sách homeSections nếu tắt các món menu thủ công
    let updatedHomeSections = config.homeSections;
    if (disableLocalMenus && Array.isArray(updatedHomeSections)) {
      updatedHomeSections = updatedHomeSections.map(sec => {
        if (sec.type === 'newDishes' || sec.type === 'offerings' || sec.id === 'sec-newDishes' || sec.id === 'sec-offerings') {
          return { ...sec, enabled: false };
        }
        return sec;
      });
    }

    const updatedConfig = {
      ...config,
      homeSections: updatedHomeSections,
      orderOnline: {
        enabled,
        url: cleanUrl,
        openMode,
        buttonText: buttonText.trim() || 'Mở Web Đặt Hàng KiotViet',
        disableLocalMenus,
        branch413PhiUrl: clean413,
        branch96D5Url: clean96
      }
    };

    onSaveConfig(updatedConfig);
    setSavedSuccess(true);
    triggerAlert('✓ Đã lưu cấu hình Chi Nhánh & Web Đặt Hàng KiotViet thành công!');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefault = () => {
    setUrl('https://coffee2424.web-store.online');
    setBranchesList(DEFAULT_BRANCHES);
    saveBranches(DEFAULT_BRANCHES);
    setOpenMode('new_tab');
    setEnabled(true);
    setDisableLocalMenus(true);
    triggerAlert('Đã khôi phục các chi nhánh và địa chỉ mặc định KiotViet!');
  };

  const handleTestOpen = (targetUrl) => {
    const toOpen = targetUrl || url || 'https://coffee2424.web-store.online';
    window.open(toOpen, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. HERO HEADER CARD */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#180d08] to-stone-950 border border-emerald-500/30 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Hệ Thống Đặt Món Trực Tuyến KiotViet</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Cấu Hình Chi Nhánh & Web Đặt Hàng</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Khi khách hàng bấm <span className="text-amber-300 font-bold">"Thực Đơn", "Đặt Món"</span>, một bảng chọn chi nhánh sẽ hiện ra để khách chọn đúng quán gần mình nhất. Bạn có thể thêm, bớt hoặc chỉnh sửa đường dẫn KiotViet của từng chi nhánh ngay tại đây.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleTestOpen(url)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>Mở Thử Web Tổng</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                savedSuccess
                  ? 'bg-emerald-500 text-black border border-emerald-400'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 hover:brightness-110'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  <span>Đã Lưu Xong!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu Cấu Hình</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. CHỨC NĂNG BẬT / TẮT & Ô NHẬP ĐỊA CHỈ WEB TỔNG */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/80 shadow-md space-y-6">
        
        {/* Toggle Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/90 border border-stone-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-[#2b170e]">
                Mở Bảng Chọn Chi Nhánh Đặt Hàng KiotViet
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                enabled ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-400/40' : 'bg-stone-200 text-stone-600'
              }`}>
                {enabled ? 'Đang Bật' : 'Đang Tắt'}
              </span>
            </div>
            <p className="text-xs text-[#7a5843] leading-relaxed">
              Khi bật: Bất kỳ khi nào khách nhấn vào <strong>"Thực Đơn", "Đặt Món"</strong>, website sẽ bật bảng chọn chi nhánh để khách mở trực tiếp link KiotViet của chi nhánh đó.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
            <input 
              type="checkbox" 
              checked={enabled} 
              onChange={(e) => setEnabled(e.target.checked)} 
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
          </label>
        </div>

        {/* Ô Nhập Địa Chỉ Web Đặt Hàng Tổng */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-extrabold text-[#2b170e] flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Địa Chỉ Web Bán Hàng KiotViet Chung (URL Tổng Dự Phòng)</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(url)}
                className="text-[11px] font-bold text-[#8c5932] hover:text-[#2b170e] flex items-center gap-1 cursor-pointer"
              >
                {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUrl ? 'Đã chép' : 'Sao chép link'}</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://coffee2424.web-store.online"
              className="w-full px-4 py-3.5 pr-28 rounded-2xl bg-white border border-stone-300 font-mono text-xs sm:text-sm text-[#2b170e] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-xs"
            />
            <button
              type="button"
              onClick={() => handleTestOpen(url)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
            >
              <span>Mở thử</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Tùy Chọn Kiểu Mở Tab */}
        <div className="pt-2 border-t border-stone-200/80">
          <label className="text-xs sm:text-sm font-extrabold text-[#2b170e] block mb-2">
            Cách Thức Mở Menu KiotViet
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOpenMode('new_tab')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                openMode === 'new_tab'
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-xs ring-1 ring-emerald-500/30'
                  : 'bg-white/80 hover:bg-white border-stone-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                openMode === 'new_tab' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-400 bg-white'
              }`}>
                {openMode === 'new_tab' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#2b170e] block">
                  Mở Trong Thẻ Mới (New Tab - Khuyên Dùng)
                </span>
                <span className="text-[11px] text-[#7a5843] block mt-0.5">
                  Khách xem menu trên tab mới, không bị mất trang chủ website Coffee 24/24.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setOpenMode('same_tab')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                openMode === 'same_tab'
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-xs ring-1 ring-emerald-500/30'
                  : 'bg-white/80 hover:bg-white border-stone-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                openMode === 'same_tab' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-400 bg-white'
              }`}>
                {openMode === 'same_tab' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#2b170e] block">
                  Chuyển Hướng Trên Thẻ Hiện Tại
                </span>
                <span className="text-[11px] text-[#7a5843] block mt-0.5">
                  Rời website chính và chuyển thẳng đến trang đặt hàng KiotViet.
                </span>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* 3. QUẢN LÝ TẤT CẢ CHI NHÁNH & LINK MENU RIÊNG (CÓ THỂ THÊM CHI NHÁNH MỚI) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#2b170e] flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-700" />
              <span>Danh Sách Chi Nhánh & Link Menu KiotViet Riêng Biệt ({branchesList.length} Chi Nhánh)</span>
            </h3>
            <p className="text-xs text-[#7a5843] mt-1">
              Khi khách bấm chọn chi nhánh, website sẽ mở chính xác link đặt hàng KiotViet của chi nhánh đó.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddNewBranch}
            className="px-4 py-2.5 rounded-2xl bg-[#2b170e] hover:bg-black text-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Chi Nhánh Mới</span>
          </button>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {branchesList.map((branch, idx) => {
            const isD5 = branch.id === 'cn-96d5' || branch.code === '96D5';
            const isPHI = branch.id === 'cn-413phi' || branch.code === '413PHI';

            return (
              <div 
                key={branch.id || idx} 
                className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3.5 relative hover:border-amber-600/50 transition-all"
              >
                {/* Branch Top Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-lg bg-stone-100 text-[#2b170e]">
                      MÃ: {branch.code || `CN${idx + 1}`}
                    </span>
                    {isD5 && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Chi nhánh D5
                      </span>
                    )}
                    {isPHI && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Chi nhánh Phan Huy Ích
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTestOpen(branch.menuUrl)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg"
                    >
                      <span>Mở thử</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {!isD5 && !isPHI && (
                      <button
                        type="button"
                        onClick={() => handleDeleteBranch(idx)}
                        className="text-xs text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        title="Xóa chi nhánh này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-[#7a5843] block mb-1">
                        Tên Chi Nhánh:
                      </label>
                      <input
                        type="text"
                        value={branch.name || ''}
                        onChange={(e) => handleUpdateBranch(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#7a5843] block mb-1">
                        Mã Chi Nhánh:
                      </label>
                      <input
                        type="text"
                        value={branch.code || ''}
                        onChange={(e) => handleUpdateBranch(idx, 'code', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono font-bold text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#7a5843] block mb-1">
                      Địa Chỉ Chi Nhánh:
                    </label>
                    <input
                      type="text"
                      value={branch.address || ''}
                      onChange={(e) => handleUpdateBranch(idx, 'address', e.target.value)}
                      placeholder="VD: 96 đường D5, Phường Thạnh Mỹ Tây, Bình Thạnh"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-[#7a5843] block mb-1">
                        Hotline Chi Nhánh:
                      </label>
                      <input
                        type="text"
                        value={branch.hotline || ''}
                        onChange={(e) => handleUpdateBranch(idx, 'hotline', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono font-bold text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#7a5843] block mb-1">
                        Giờ Hoạt Động:
                      </label>
                      <input
                        type="text"
                        value={branch.hours || 'Mở cửa 24/7'}
                        onChange={(e) => handleUpdateBranch(idx, 'hours', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                      />
                    </div>
                  </div>

                  {/* LINK MENU KIOTVIET (TRỌNG TÂM CỦA CHI NHÁNH) */}
                  <div className="pt-1">
                    <label className="text-[11px] font-black text-amber-900 flex items-center justify-between mb-1">
                      <span>🔗 Link Web Menu KiotViet Riêng Của Chi Nhánh Này:</span>
                    </label>
                    <input
                      type="url"
                      value={branch.menuUrl || ''}
                      onChange={(e) => handleUpdateBranch(idx, 'menuUrl', e.target.value)}
                      placeholder={
                        isD5 
                          ? 'https://coffee2424.web-store.online/menu/363827'
                          : isPHI 
                          ? 'https://coffee2424.web-store.online/menu/363688'
                          : 'https://coffee2424.web-store.online/menu/...'
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-amber-50/70 border border-amber-300/80 font-mono text-xs font-bold text-[#2b170e] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      {isD5 && 'Mặc định D5: https://coffee2424.web-store.online/menu/363827'}
                      {isPHI && 'Mặc định PHI: https://coffee2424.web-store.online/menu/363688'}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. NÚT LƯU CẤU HÌNH Ở CUỐI */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleResetDefault}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-[#5c3c26] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
        >
          Khôi phục mặc định
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
            savedSuccess
              ? 'bg-emerald-500 text-black border border-emerald-400'
              : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 text-white hover:brightness-110'
          }`}
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>Đã Lưu Cấu Hình Chi Nhánh!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình Chi Nhánh & Web Đặt Hàng</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
