import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  ShoppingBag, 
  CheckCircle2, 
  ExternalLink, 
  QrCode, 
  Sparkles,
  Coffee,
  X,
  Plus,
  Minus,
  Send,
  Navigation,
  Tag
} from 'lucide-react';
import { getBranches } from '../data/branches';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuItems';

export default function OrderPage({ selectedBranch, setSelectedBranch }) {
  const [branches, setBranches] = useState(getBranches);
  const [activeDistrict, setActiveDistrict] = useState('Tất cả');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [cart, setCart] = useState({});
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [qrModalBranch, setQrModalBranch] = useState(null);
  const [orderNote, setOrderNote] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState('takeaway');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Sync branches from localStorage
  useEffect(() => {
    const handleBranchesUpdate = () => {
      setBranches(getBranches());
    };
    window.addEventListener('branches-updated', handleBranchesUpdate);
    return () => window.removeEventListener('branches-updated', handleBranchesUpdate);
  }, []);

  // Filter branches
  const districts = ['Tất cả', 'Gò Vấp / An Hội Tây', 'Bình Thạnh / Thạnh Mỹ Tây'];

  const filteredBranches = branches.filter(branch => {
    return activeDistrict === 'Tất cả' || branch.district === activeDistrict;
  });

  // Filter menu items
  const filteredMenuItems = MENU_ITEMS.filter(item => {
    return activeCategory === 'Tất cả' || item.category === activeCategory;
  });

  // Cart operations
  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: {
        item,
        quantity: (prev[item.id]?.quantity || 0) + 1
      }
    }));
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prev => {
      const current = prev[itemId]?.quantity || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          quantity: next
        }
      };
    });
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const totalItemCount = cartItems.reduce((sum, entry) => sum + entry.quantity, 0);

  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  const handleApplyVoucher = (codeToApply) => {
    const code = (codeToApply || voucherInput).trim().toUpperCase();
    if (!code) return;

    if (code === 'HAPPY40') {
      const discount = Math.round(cartTotal * 0.4);
      setAppliedVoucher({ code, discount, label: 'Giảm 40% Giờ Vàng' });
      setVoucherError('');
    } else if (code === 'WELCOME24') {
      const discount = Math.min(25000, cartTotal);
      setAppliedVoucher({ code, discount, label: 'Giảm 25K Bạn Mới' });
      setVoucherError('');
    } else if (code === 'COMBO69K') {
      const discount = Math.min(20000, cartTotal);
      setAppliedVoucher({ code, discount, label: 'Ưu Đãi Combo 69K' });
      setVoucherError('');
    } else if (code === 'FREESHIP') {
      const discount = 15000;
      setAppliedVoucher({ code, discount, label: 'Freeship Đêm Khuya' });
      setVoucherError('');
    } else {
      setVoucherError('Mã không hợp lệ hoặc đã hết hạn.');
    }
  };

  const finalTotal = Math.max(0, cartTotal - (appliedVoucher?.discount || 0));

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalOpen(false);
      setCart({});
      setAppliedVoucher(null);
      setVoucherInput('');
    }, 2500);
  };

  return (
    <div className="text-[#2b170e] pb-28 font-sans">
      
      {/* PAGE HEADER HERO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <section className="relative overflow-hidden rounded-[36px] sm:rounded-[48px] bg-white/60 backdrop-blur-3xl border border-white/80 p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(60,35,15,0.06)]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-white/90 text-[#8c5932] text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
            <Coffee className="w-4 h-4 text-[#8c5932]" />
            <span>Thực Đơn Đặt Món Trực Tuyến</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#2b170e] tracking-tight uppercase">
            Đặt Món <span className="text-[#8c5932]">COFFEE 24/24</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5c3d2e] max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
            Lựa chọn điểm nhận món thuận tiện nhất và thưởng thức cà phê rang mộc nguyên chất cùng các thức uống tươi mát.
          </p>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        
        {/* CURRENT SELECTED BRANCH BAR */}
        {selectedBranch ? (
          <div className="bg-white/75 backdrop-blur-2xl border-2 border-[#8c5932] rounded-[32px] p-5 sm:p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/90 shadow-md">
                <img src={selectedBranch.image} alt={selectedBranch.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-[#2b170e] text-white font-black">
                    ĐANG CHỌN
                  </span>
                  <span className="text-xs text-[#7a5843] font-medium">Cửa hàng phục vụ:</span>
                  <span className="text-xs font-mono font-bold text-[#8c5932] px-2 py-0.5 rounded-lg bg-white border border-stone-200">
                    {selectedBranch.code}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#2b170e] mt-1">
                  {selectedBranch.name}
                </h3>
                <p className="text-sm text-[#5c3d2e] flex items-center gap-1.5 mt-0.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#8c5932] flex-shrink-0" />
                  {selectedBranch.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <a
                href={selectedBranch.menuUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-initial px-5 py-3 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <span>Menu KiotViet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setQrModalBranch(selectedBranch)}
                className="p-3 rounded-full bg-white/80 hover:bg-white text-[#2b170e] text-xs font-bold transition-all cursor-pointer border border-white/90 shadow-xs"
                title="Xem mã QR"
              >
                <QrCode className="w-4 h-4 text-[#8c5932]" />
              </button>

              <button
                onClick={() => setSelectedBranch(null)}
                className="px-4 py-3 rounded-full bg-white/80 hover:bg-white text-[#5c3d2e] text-xs sm:text-sm font-bold transition-all cursor-pointer border border-white/90 shadow-xs"
              >
                Đổi cửa hàng
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-[28px] p-5 text-center text-[#8c5932] text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-xs">
            <Sparkles className="w-5 h-5 text-[#8c5932]" />
            <span>Hãy bấm "Chọn Điểm Này Để Đặt Món" ở 1 trong các cơ sở bên dưới.</span>
          </div>
        )}

        {/* STEP 1: CÁC ĐIỂM CỬA HÀNG */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#dfd4c7]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2b170e] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8c5932]" />
                <span>Chọn Điểm Nhận Món</span>
              </h2>
              <p className="text-sm text-[#5c3d2e] mt-1">
                Lựa chọn cơ sở thuận tiện nhất để đặt món mang về hoặc tới trải nghiệm tại chỗ.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {districts.map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDistrict(d)}
                  className={`text-xs sm:text-sm px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                    activeDistrict === d
                      ? 'bg-[#2b170e] text-white font-black shadow-md'
                      : 'bg-white/70 text-[#5c3d2e] hover:bg-white border border-white/90 shadow-xs'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Branches Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBranches.map((branch) => {
              const isCurrent = selectedBranch?.id === branch.id;
              return (
                <div
                  key={branch.id}
                  className={`bg-white/65 backdrop-blur-2xl rounded-[32px] overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-[0_12px_36px_rgba(60,35,15,0.06)] hover:shadow-[0_20px_45px_rgba(60,35,15,0.12)] ${
                    isCurrent 
                      ? 'border-[#8c5932] ring-2 ring-[#8c5932]/30 shadow-xl' 
                      : 'border-white/80 hover:border-white'
                  }`}
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative h-60 overflow-hidden bg-stone-100">
                      <img 
                        src={branch.image} 
                        alt={branch.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/90 text-[#2b170e] border border-white font-black text-xs shadow-md">
                          Mã: {branch.code}
                        </span>
                      </div>

                      <div className="absolute bottom-3.5 left-4 right-4">
                        <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                          {branch.name}
                        </h3>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-3">
                      <p className="text-sm text-[#5c3d2e] flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#8c5932] flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{branch.address}</span>
                      </p>

                      {branch.features && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {branch.features.map((f, i) => (
                            <span key={i} className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/80 text-[#5c3d2e] border border-white/90 shadow-2xs">
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setSelectedBranch(branch)}
                      className={`flex-1 py-3 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#2b170e] text-white shadow-md'
                          : 'bg-white/80 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-white/90 shadow-xs'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                          <span>Đang Chọn Điểm Này</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Chọn Điểm Này Để Đặt Món</span>
                        </>
                      )}
                    </button>

                    <a
                      href={branch.menuUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-3 px-4 rounded-full bg-white/80 hover:bg-white text-[#2b170e] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-white/90 shadow-xs transition-colors"
                      title="Mở menu trực tiếp KiotViet"
                    >
                      <span>Web Menu</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#8c5932]" />
                    </a>

                    <button
                      onClick={() => setQrModalBranch(branch)}
                      className="p-3 rounded-full bg-white/80 hover:bg-white text-[#8c5932] border border-white/90 shadow-xs flex items-center justify-center transition-colors cursor-pointer"
                      title="Mã QR"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STEP 2: THỰC ĐƠN ĐẶT MÓN */}
        <section className="bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 space-y-8 shadow-[0_15px_40px_rgba(60,35,15,0.06)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#dfd4c7]">
            <div>
              <span className="text-xs font-black text-[#8c5932] tracking-wider uppercase flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-[#8c5932]" />
                Thực Đơn Đặt Món Trực Tuyến
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2b170e] mt-1">
                {selectedBranch ? `Thực Đơn: ${selectedBranch.name}` : 'Thực Đơn Đặc Trưng COFFEE 24/24'}
              </h2>
              <p className="text-sm text-[#5c3d2e] mt-1 font-medium">
                {selectedBranch 
                  ? `Đang chọn đặt hàng tại ${selectedBranch.address}.`
                  : 'Hãy chọn điểm nhận món ở phía trên để hệ thống xử lý đơn.'}
              </p>
            </div>

            {selectedBranch && (
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2.5 rounded-full border border-white/90 shadow-xs">
                <QrCode className="w-4 h-4 text-[#8c5932]" />
                <span className="text-xs text-[#7a5843]">Menu KiotViet:</span>
                <a 
                  href={selectedBranch.menuUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs text-[#8c5932] font-black hover:underline flex items-center gap-1"
                >
                  Truy cập ngay <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Menu Category tabs */}
          <div className="flex flex-wrap gap-2.5">
            {MENU_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs sm:text-sm px-5 py-2.5 rounded-full font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#2b170e] text-white font-black shadow-md'
                    : 'bg-white/70 text-[#5c3d2e] hover:bg-white border border-white/90 shadow-xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMenuItems.map(item => {
              const inCartQty = cart[item.id]?.quantity || 0;
              return (
                <div 
                  key={item.id}
                  className="group ios-glass-card rounded-[28px] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div 
                      className="relative aspect-[3/4] bg-stone-100 overflow-hidden"
                      style={{ aspectRatio: '3/4' }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full bg-white/95 text-[#2b170e] border border-white shadow-xs">
                        {item.badge}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="font-bold text-[#2b170e] text-base leading-snug group-hover:text-[#8c5932] transition-colors">{item.name}</h4>
                      <span className="text-[#8c5932] font-black text-base block">{item.priceFormatted}</span>
                      <p className="text-xs sm:text-sm text-[#5c3d2e] line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    {inCartQty > 0 ? (
                      <div className="flex items-center justify-between bg-white p-1.5 rounded-full border border-stone-200 shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-stone-100 text-[#2b170e] hover:bg-stone-200 flex items-center justify-center cursor-pointer shadow-xs transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black text-[#2b170e] px-2">{inCartQty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-[#2b170e] text-white hover:bg-[#3d2215] flex items-center justify-center cursor-pointer shadow-sm font-bold transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="ios-btn-primary w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm vào giỏ</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </section>

      </div>

      {/* FLOATING CART BAR */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-11/12 max-w-2xl ios-glass-panel rounded-[32px] p-4 shadow-[0_20px_50px_rgba(60,35,15,0.18)] animate-in slide-in-from-bottom-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2b170e] to-[#180d08] text-white flex items-center justify-center font-black text-base shadow-sm">
                {totalItemCount}
              </div>
              <div>
                <span className="text-xs text-[#7a5843] font-medium block">
                  {selectedBranch ? `Cửa hàng: ${selectedBranch.name}` : 'Chưa chọn cửa hàng'}
                </span>
                <span className="text-lg font-black text-[#2b170e]">
                  {cartTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <button
              onClick={() => setOrderModalOpen(true)}
              className="ios-btn-primary py-3.5 px-8 rounded-full font-black text-sm flex items-center gap-2 shadow-md cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 text-white stroke-[2.5]" />
              <span>XEM ĐƠN & ĐẶT MÓN</span>
            </button>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {qrModalBranch && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-3xl border border-white rounded-[36px] max-w-sm w-full p-6 text-center space-y-4 shadow-2xl text-[#2b170e]">
            <div className="flex items-center justify-between pb-3 border-b border-[#dfd4c7]">
              <h3 className="text-base font-black text-[#2b170e]">Mã QR Menu Trực Tuyến</h3>
              <button onClick={() => setQrModalBranch(null)} className="p-1 rounded-lg text-stone-400 hover:text-[#2b170e] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-[#8c5932] font-black">{qrModalBranch.name}</p>
            <p className="text-xs text-[#5c3d2e]">{qrModalBranch.address}</p>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-sm border border-stone-200">
              <img src={qrModalBranch.qrImage} alt="QR Code" className="w-48 h-48 object-contain" />
            </div>

            <p className="text-xs text-[#7a5843] leading-relaxed">
              Quét bằng Camera điện thoại hoặc Zalo để mở thực đơn đặt món trực tiếp.
            </p>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setQrModalBranch(null)}
                className="w-full py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-[#2b170e] font-bold text-xs cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER CHECKOUT MODAL */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-3xl border border-white rounded-[36px] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl text-[#2b170e]">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#dfd4c7]">
              <h3 className="text-lg font-black text-[#2b170e] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#8c5932]" />
                <span>Xác Nhận Đơn Hàng</span>
              </h3>
              <button 
                onClick={() => setOrderModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-[#2b170e] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-[#2b170e]">Đặt Món Thành Công!</h4>
                <p className="text-sm text-[#5c3d2e]">
                  Cửa hàng {selectedBranch ? selectedBranch.name : 'COFFEE 24/24'} đã tiếp nhận đơn và đang chuẩn bị món cho bạn.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmOrder} className="space-y-4">
                
                {/* Branch info */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-xs text-[#7a5843] font-bold block">Địa Điểm Nhận Món:</span>
                  <span className="text-base font-black text-[#2b170e] block">
                    {selectedBranch ? selectedBranch.name : 'Chưa chọn cửa hàng'}
                  </span>
                  <span className="text-xs text-[#5c3d2e] block">
                    {selectedBranch ? selectedBranch.address : 'Vui lòng chọn cửa hàng trước khi gửi đơn'}
                  </span>
                </div>

                {/* Cart summary list */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {cartItems.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-stone-100">
                      <div>
                        <span className="font-bold text-[#2b170e]">{item.name}</span>
                        <span className="text-[#7a5843] ml-2 font-medium">x{quantity}</span>
                      </div>
                      <span className="font-bold text-[#8c5932]">
                        {(item.price * quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))}
                </div>

                {/* Customer fields */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-[#2b170e] block mb-1">Tên khách hàng *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#2b170e] placeholder-stone-400 focus:outline-none focus:border-[#8c5932] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2b170e] block mb-1">Số điện thoại nhận món *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#2b170e] placeholder-stone-400 focus:outline-none focus:border-[#8c5932] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2b170e] block mb-1">Ghi chú pha chế (ít đường, nhiều đá...)</label>
                    <input
                      type="text"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Ghi chú thêm..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#2b170e] placeholder-stone-400 focus:outline-none focus:border-[#8c5932] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Voucher code input box */}
                <div className="pt-2 border-t border-[#dfd4c7] space-y-2">
                  <label className="text-xs font-bold text-[#2b170e] block">Mã Ưu Đãi / Voucher</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => {
                        setVoucherInput(e.target.value.toUpperCase());
                        setVoucherError('');
                      }}
                      placeholder="HAPPY40, COMBO69K, WELCOME24..."
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-[#2b170e] uppercase focus:outline-none focus:border-[#8c5932] focus:bg-white placeholder-stone-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyVoucher()}
                      className="px-5 py-2.5 rounded-xl bg-[#2b170e] hover:bg-[#3d2215] text-white border border-transparent text-xs font-bold transition-all cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {voucherError && (
                    <p className="text-xs text-red-600 font-bold">{voucherError}</p>
                  )}
                  {appliedVoucher && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                        <span>{appliedVoucher.label} ({appliedVoucher.code})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                           setAppliedVoucher(null);
                           setVoucherInput('');
                        }}
                        className="text-xs text-[#7a5843] hover:text-[#2b170e] font-bold underline cursor-pointer"
                      >
                        Bỏ mã
                      </button>
                    </div>
                  )}
                </div>

                {/* Subtotal, discount & Final Total */}
                <div className="pt-2 border-t border-[#dfd4c7] space-y-1.5 text-sm">
                  <div className="flex items-center justify-between text-[#5c3d2e]">
                    <span>Tạm tính giỏ hàng:</span>
                    <span className="font-bold text-[#2b170e]">{cartTotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  {appliedVoucher && (
                    <div className="flex items-center justify-between text-emerald-700 font-bold">
                      <span>Ưu đãi giảm ({appliedVoucher.code}):</span>
                      <span>-{appliedVoucher.discount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  <div className="pt-2 flex items-center justify-between text-base font-black border-t border-[#dfd4c7]">
                    <span>Tổng tiền thanh toán:</span>
                    <span className="text-[#8c5932] text-xl">{finalTotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="flex-1 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#2b170e] font-bold text-sm cursor-pointer transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>GỬI ĐƠN HÀNG</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
