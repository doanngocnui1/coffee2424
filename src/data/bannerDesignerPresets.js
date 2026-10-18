// =========================================================================
// BANNER DESIGNER PRESETS & UTILITIES (BỘ CÔNG CỤ THIẾT KẾ BANNER TRANG CHỦ)
// =========================================================================

export const FONT_FAMILIES = [
  { id: 'Montserrat', name: 'Montserrat', category: 'Hiện đại · Sang trọng', style: 'Sans-Serif' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', category: 'Công nghệ · Sắc nét', style: 'Sans-Serif' },
  { id: 'Playfair Display', name: 'Playfair Display', category: 'Cổ điển · Đẳng cấp', style: 'Serif' },
  { id: 'Cinzel', name: 'Cinzel', category: 'Hoàng gia · Quý phái', style: 'Serif' },
  { id: 'Oswald', name: 'Oswald', category: 'Tiêu đề lớn · Mạnh mẽ', style: 'Display' },
  { id: 'Bebas Neue', name: 'Bebas Neue', category: 'Đậm nét · Gọn gàng', style: 'Display' },
  { id: 'Dancing Script', name: 'Dancing Script', category: 'Chữ viết tay · Mềm mại', style: 'Handwriting' },
  { id: 'Pacifico', name: 'Pacifico', category: 'Retro · Vui vẻ', style: 'Handwriting' },
  { id: 'Great Vibes', name: 'Great Vibes', category: 'Chữ ký nghệ nhân', style: 'Script' },
  { id: 'Caveat', name: 'Caveat', category: 'Ghi chú thân thiện', style: 'Handwriting' },
  { id: 'Courier Prime', name: 'Courier Prime', category: 'Máy đánh chữ · Vintage', style: 'Monospace' },
  { id: 'Comfortaa', name: 'Comfortaa', category: 'Bo tròn · Tươi trẻ', style: 'Rounded' }
];

export const SHADOW_PRESETS = [
  { id: 'none', label: 'Không bóng', shadow: 'none', desc: 'Chữ phẳng nguyên bản' },
  { id: 'soft', label: 'Bóng mềm tự nhiên', shadow: '0 4px 14px rgba(0, 0, 0, 0.65)', desc: 'Tách chữ nhẹ nhàng' },
  { id: 'deep', label: 'Bóng sâu điện ảnh', shadow: '0 8px 28px rgba(0, 0, 0, 0.95), 0 2px 6px rgba(0, 0, 0, 0.8)', desc: 'Tương phản cực cao' },
  { id: '3d', label: 'Khối 3D cổ điển', shadow: '3px 3px 0px #000000, 5px 5px 0px rgba(0, 0, 0, 0.5), 7px 7px 14px rgba(0, 0, 0, 0.8)', desc: 'Chữ nổi khối 3D' },
  { id: 'neon_amber', label: 'Hào quang Amber 24/7', shadow: '0 0 10px #f59e0b, 0 0 22px #d97706, 0 0 38px #b45309, 0 0 50px rgba(245, 158, 11, 0.7)', desc: 'Neon vàng hổ phách' },
  { id: 'neon_cyan', label: 'Hào quang Neon Xanh', shadow: '0 0 10px #06b6d4, 0 0 22px #0891b2, 0 0 38px #0e7490, 0 0 50px rgba(6, 182, 212, 0.7)', desc: 'Neon xanh hiện đại' },
  { id: 'stroke', label: 'Viền chữ sắc nét', shadow: '-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000, 0 4px 14px rgba(0, 0, 0, 0.8)', desc: 'Rõ nét trên nền ảnh rối' },
  { id: 'custom', label: 'Tùy chỉnh tự do', shadow: '', desc: 'Chỉnh X, Y, Blur, Màu' }
];

export const ANIMATION_PRESETS = [
  { id: 'none', label: 'Tĩnh (Không chuyển động)', class: '', desc: 'Cố định' },
  { id: 'float', label: 'Bồng bềnh lơ lửng', class: 'canvas-anim-float', desc: 'Chuyển động êm ái' },
  { id: 'pulse', label: 'Thở / Nhịp đập', class: 'canvas-anim-pulse', desc: 'Co giãn nhịp nhàng' },
  { id: 'glow_pulse', label: 'Hào quang chớp tắt', class: 'canvas-anim-glow-pulse', desc: 'Neon phát sáng' },
  { id: 'bounce', label: 'Nhún nhảy vui nhộn', class: 'canvas-anim-bounce', desc: 'Nhún nhẹ vui tươi' },
  { id: 'wiggle', label: 'Lắc lư thu hút', class: 'canvas-anim-wiggle', desc: 'Lắc qua lại nhẹ' },
  { id: 'spin_slow', label: 'Xoay tròn nghệ thuật', class: 'canvas-anim-spin-slow', desc: 'Thích hợp cho con dấu' },
  { id: 'shimmer', label: 'Quét sáng lấp lánh', class: 'canvas-anim-shimmer', desc: 'Tia sáng quét qua' },
  { id: 'slide_up', label: 'Bay từ dưới lên', class: 'canvas-anim-slide-up', desc: 'Xuất hiện mượt' }
];

export const BADGE_PRESETS = [
  { id: 'none', label: 'Không hộp nền (Chữ trong suốt)' },
  { id: 'frosted', label: 'Viên thuốc Kính mờ iOS' },
  { id: 'espresso', label: 'Viên thuốc Đen Espresso' },
  { id: 'gold', label: 'Ruy-băng Vàng Hoàng Kim' },
  { id: 'neon', label: 'Thẻ viền Neon phát sáng' }
];

export const COLOR_PALETTE = [
  { label: 'Trắng tinh khôi', color: '#ffffff' },
  { label: 'Vàng Amber Coffee', color: '#f59e0b' },
  { label: 'Cam Caramel', color: '#ea580c' },
  { label: 'Kem Sữa Oat Milk', color: '#fef3c7' },
  { label: 'Vàng Kim Gold', color: '#fbbf24' },
  { label: 'Đỏ Ruby Khuyến Mãi', color: '#ef4444' },
  { label: 'Xanh Matcha Tuyết', color: '#10b981' },
  { label: 'Xanh Dương Neon', color: '#06b6d4' },
  { label: 'Tím Hoàng Hôn', color: '#a855f7' },
  { label: 'Đen Espresso Đậm', color: '#1c1917' }
];

// 6 Built-in Vector Stickers / Stamps as inline SVG Data URIs
export const BUILT_IN_STICKERS = [
  {
    id: 'sticker-open247',
    name: 'Con Dấu OPEN 24/7 Neon',
    type: 'stamp',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="rgba(26,16,10,0.85)" stroke="#f59e0b" stroke-width="4" stroke-dasharray="8 6"/>
        <circle cx="100" cy="100" r="82" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <circle cx="100" cy="100" r="90" fill="url(#glow)"/>
        <text x="100" y="55" font-family="Montserrat, sans-serif" font-weight="900" font-size="14" fill="#fbbf24" text-anchor="middle" letter-spacing="3">COFFEE 24/24</text>
        <text x="100" y="105" font-family="Oswald, sans-serif" font-weight="900" font-size="42" fill="#ffffff" text-anchor="middle" letter-spacing="2">OPEN</text>
        <text x="100" y="148" font-family="Montserrat, sans-serif" font-weight="900" font-size="36" fill="#f59e0b" text-anchor="middle">24/7</text>
        <text x="100" y="172" font-family="Montserrat, sans-serif" font-weight="700" font-size="9" fill="#fef3c7" text-anchor="middle" letter-spacing="2">★ ENJOY YOUR LIFE ★</text>
      </svg>
    `)}`
  },
  {
    id: 'sticker-100mop',
    name: 'Tem 100% Cà Phê Mộc',
    type: 'seal',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="92" fill="#2b170e" stroke="#d97706" stroke-width="4"/>
        <circle cx="100" cy="100" r="80" fill="none" stroke="#fef3c7" stroke-width="1.5" stroke-dasharray="4 3"/>
        <path d="M 100 35 A 65 65 0 0 1 165 100" fill="none" id="curveTop"/>
        <text font-family="Montserrat, sans-serif" font-weight="900" font-size="11" fill="#fbbf24" letter-spacing="3" text-anchor="middle">
          <textPath href="#curveTop" startOffset="50%">RANG MỘC NGUYÊN CHẤT</textPath>
        </text>
        <text x="100" y="98" font-family="Oswald, sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle">100%</text>
        <text x="100" y="128" font-family="Montserrat, sans-serif" font-weight="900" font-size="14" fill="#f59e0b" text-anchor="middle" letter-spacing="3">ROBUSTA & ARABICA</text>
        <text x="100" y="152" font-family="Montserrat, sans-serif" font-weight="700" font-size="11" fill="#fef3c7" text-anchor="middle">CẦU ĐẤT & ĐẮK LẮK</text>
      </svg>
    `)}`
  },
  {
    id: 'sticker-specialty',
    name: 'Huy Hiệu Specialty Coffee',
    type: 'badge',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24"/>
            <stop offset="50%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="232" height="72" rx="36" fill="#180d08" stroke="url(#goldGrad)" stroke-width="3"/>
        <circle cx="40" cy="40" r="24" fill="url(#goldGrad)"/>
        <text x="40" y="46" font-family="Montserrat, sans-serif" font-weight="900" font-size="18" fill="#180d08" text-anchor="middle">★</text>
        <text x="135" y="36" font-family="Montserrat, sans-serif" font-weight="900" font-size="14" fill="#ffffff" letter-spacing="2">SPECIALTY</text>
        <text x="135" y="55" font-family="Montserrat, sans-serif" font-weight="700" font-size="11" fill="#fbbf24" letter-spacing="3">COFFEE BEANS</text>
      </svg>
    `)}`
  },
  {
    id: 'sticker-hot69k',
    name: 'Tem Hot Combo 69K',
    type: 'promo',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <polygon points="100,10 125,70 190,75 140,118 155,185 100,150 45,185 60,118 10,75 75,70" fill="#dc2626" stroke="#fbbf24" stroke-width="4"/>
        <text x="100" y="85" font-family="Montserrat, sans-serif" font-weight="900" font-size="14" fill="#fef08a" text-anchor="middle" letter-spacing="1">COMBO HOT</text>
        <text x="100" y="125" font-family="Oswald, sans-serif" font-weight="900" font-size="44" fill="#ffffff" text-anchor="middle">69K</text>
        <text x="100" y="148" font-family="Montserrat, sans-serif" font-weight="800" font-size="10" fill="#ffffff" text-anchor="middle">NGÀY & ĐÊM</text>
      </svg>
    `)}`
  },
  {
    id: 'sticker-freeship',
    name: 'Badge Giao Hàng 24/7',
    type: 'badge',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 70" width="220" height="70">
        <rect x="3" y="3" width="214" height="64" rx="32" fill="#047857" stroke="#34d399" stroke-width="2.5"/>
        <text x="35" y="44" font-size="28">⚡</text>
        <text x="125" y="33" font-family="Montserrat, sans-serif" font-weight="900" font-size="13" fill="#ffffff" letter-spacing="1.5">GIAO NHANH 24/7</text>
        <text x="125" y="52" font-family="Montserrat, sans-serif" font-weight="700" font-size="11" fill="#a7f3d0">FREESHIP DƯỚI 3KM</text>
      </svg>
    `)}`
  },
  {
    id: 'sticker-matchamk4',
    name: 'Tem Matcha MK4 Uji',
    type: 'badge',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="92" fill="#064e3b" stroke="#34d399" stroke-width="4"/>
        <circle cx="100" cy="100" r="80" fill="none" stroke="#6ee7b7" stroke-width="2" stroke-dasharray="6 4"/>
        <text x="100" y="60" font-family="Montserrat, sans-serif" font-weight="900" font-size="13" fill="#6ee7b7" text-anchor="middle" letter-spacing="2">SPECIALTY</text>
        <text x="100" y="105" font-family="Oswald, sans-serif" font-weight="900" font-size="40" fill="#ffffff" text-anchor="middle">MATCHA</text>
        <text x="100" y="142" font-family="Montserrat, sans-serif" font-weight="900" font-size="28" fill="#34d399" text-anchor="middle">MK4</text>
        <text x="100" y="168" font-family="Montserrat, sans-serif" font-weight="700" font-size="10" fill="#a7f3d0" text-anchor="middle" letter-spacing="1">UJI KYOTO JAPAN</text>
      </svg>
    `)}`
  }
];

// Helper Functions
export function getLayerTextShadow(layer) {
  if (!layer) return 'none';
  if (layer.shadowType === 'custom') {
    return `${layer.shadowX ?? 0}px ${layer.shadowY ?? 4}px ${layer.shadowBlur ?? 10}px ${layer.shadowColor || 'rgba(0,0,0,0.7)'}`;
  }
  const preset = SHADOW_PRESETS.find(p => p.id === layer.shadowType);
  return preset ? preset.shadow : 'none';
}

export function getLayerAnimationClass(anim) {
  const found = ANIMATION_PRESETS.find(a => a.id === anim);
  return found ? found.class : '';
}

export function getLayerBadgeClass(bgBadge) {
  switch (bgBadge) {
    case 'frosted':
      return 'bg-white/20 backdrop-blur-md border border-white/40 px-5 py-2.5 rounded-2xl shadow-lg';
    case 'espresso':
      return 'bg-[#2b170e]/85 backdrop-blur-md border border-amber-500/40 px-5 py-2.5 rounded-full shadow-xl';
    case 'gold':
      return 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 !text-stone-950 font-black px-5 py-2 rounded-full shadow-lg';
    case 'neon':
      return 'bg-black/75 backdrop-blur-md border-2 border-amber-400 px-5 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.5)]';
    case 'none':
    default:
      return '';
  }
}

// 5 Curated Aesthetic Templates for 1-Click Design
export const HERO_TEMPLATES = [
  {
    id: 'tpl-nightowl',
    title: 'Đêm Không Ngủ · Open 24/7',
    desc: 'Phong cách quán đêm ấm áp: Chữ Oswald to rõ, ánh Neon hổ phách, con dấu tròn OPEN 24/7 bồng bềnh.',
    filter: { brightness: 90, contrast: 105, saturation: 110, blur: 0, overlayDarkness: 25, vignette: true },
    layers: [
      {
        id: 'tpl-layer-1',
        type: 'text',
        text: 'KHÔNG GIAN LÀM VIỆC & THƯỞNG THỨC',
        x: 50,
        y: 48,
        fontFamily: 'Montserrat',
        fontSize: 18,
        fontWeight: '800',
        fontStyle: 'normal',
        textDecoration: 'none',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#fbbf24',
        letterSpacing: 4,
        lineHeight: 1.2,
        rotation: 0,
        shadowType: 'neon_amber',
        bgBadge: 'none',
        animation: 'pulse',
        link: '/gioithieu',
        zIndex: 10,
        visible: true
      },
      {
        id: 'tpl-layer-2',
        type: 'text',
        text: 'COFFEE 24/24',
        x: 50,
        y: 62,
        fontFamily: 'Oswald',
        fontSize: 64,
        fontWeight: '700',
        fontStyle: 'normal',
        textDecoration: 'none',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#ffffff',
        letterSpacing: 3,
        lineHeight: 1.1,
        rotation: 0,
        shadowType: 'deep',
        bgBadge: 'none',
        animation: 'none',
        link: '/dathang',
        zIndex: 11,
        visible: true
      },
      {
        id: 'tpl-layer-3',
        type: 'text',
        text: '⚡ Luôn Sáng Đèn · Bếp Nóng & Cà Phê Mộc Xuyên Đêm ⚡',
        x: 50,
        y: 75,
        fontFamily: 'Montserrat',
        fontSize: 16,
        fontWeight: '700',
        fontStyle: 'normal',
        textDecoration: 'none',
        textTransform: 'none',
        textAlign: 'center',
        color: '#fef3c7',
        letterSpacing: 1,
        lineHeight: 1.2,
        rotation: 0,
        shadowType: 'soft',
        bgBadge: 'espresso',
        animation: 'float',
        link: '/dathang',
        zIndex: 12,
        visible: true
      },
      {
        id: 'tpl-layer-4',
        type: 'image',
        imageUrl: BUILT_IN_STICKERS[0].dataUrl,
        title: 'OPEN 24/7 Stamp',
        x: 88,
        y: 70,
        width: 13,
        rotation: 12,
        opacity: 100,
        borderRadius: 9999,
        borderWidth: 0,
        borderColor: '#ffffff',
        shadow: 'glow',
        blendMode: 'normal',
        animation: 'spin_slow',
        link: '/dathang',
        zIndex: 15,
        visible: true
      }
    ]
  },
  {
    id: 'tpl-luxury',
    title: 'Modern Luxury · Sang Trọng & Tinh Tế',
    desc: 'Font Playfair Display danh giá, ruy-băng vàng gold, điểm xuyết tem Specialty Coffee.',
    filter: { brightness: 95, contrast: 110, saturation: 115, blur: 0, overlayDarkness: 20, vignette: true },
    layers: [
      {
        id: 'tpl-lux-1',
        type: 'text',
        text: 'The Art Of Specialty Coffee',
        x: 50,
        y: 50,
        fontFamily: 'Playfair Display',
        fontSize: 48,
        fontWeight: '900',
        fontStyle: 'italic',
        textDecoration: 'none',
        textTransform: 'none',
        textAlign: 'center',
        color: '#ffffff',
        letterSpacing: 2,
        lineHeight: 1.2,
        rotation: 0,
        shadowType: '3d',
        bgBadge: 'none',
        animation: 'float',
        link: '/dathang',
        zIndex: 10,
        visible: true
      },
      {
        id: 'tpl-lux-2',
        type: 'text',
        text: 'HƯƠNG VỊ NGUYÊN BẢN TỪ NÔNG TRẠI ĐẾN TÁCH CÀ PHÊ',
        x: 50,
        y: 65,
        fontFamily: 'Cinzel',
        fontSize: 16,
        fontWeight: '700',
        fontStyle: 'normal',
        textDecoration: 'none',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#fef3c7',
        letterSpacing: 4,
        lineHeight: 1.3,
        rotation: 0,
        shadowType: 'soft',
        bgBadge: 'frosted',
        animation: 'none',
        link: '/gioithieu',
        zIndex: 11,
        visible: true
      },
      {
        id: 'tpl-lux-3',
        type: 'image',
        imageUrl: BUILT_IN_STICKERS[2].dataUrl,
        title: 'Specialty Coffee Emblem',
        x: 14,
        y: 72,
        width: 16,
        rotation: -8,
        opacity: 95,
        borderRadius: 30,
        borderWidth: 0,
        borderColor: '#ffffff',
        shadow: 'glow',
        blendMode: 'normal',
        animation: 'pulse',
        link: '/dathang',
        zIndex: 15,
        visible: true
      }
    ]
  },
  {
    id: 'tpl-artisan',
    title: 'Artisan Craft · Cà Phê Mộc Mạc',
    desc: 'Chữ viết tay Dancing Script nghệ nhân bay bổng, kèm tem 100% Cà phê mộc nguyên chất.',
    filter: { brightness: 100, contrast: 100, saturation: 105, blur: 0, overlayDarkness: 15, vignette: true },
    layers: [
      {
        id: 'tpl-art-1',
        type: 'text',
        text: 'Đậm Đà Chuẩn Vị Việt',
        x: 48,
        y: 52,
        fontFamily: 'Dancing Script',
        fontSize: 54,
        fontWeight: '700',
        fontStyle: 'normal',
        textDecoration: 'none',
        textTransform: 'none',
        textAlign: 'center',
        color: '#fbbf24',
        letterSpacing: 2,
        lineHeight: 1.2,
        rotation: -3,
        shadowType: 'deep',
        bgBadge: 'none',
        animation: 'wiggle',
        link: '/dathang',
        zIndex: 10,
        visible: true
      },
      {
        id: 'tpl-art-2',
        type: 'text',
        text: '100% Hạt Robusta Đắk Lắk & Arabica Cầu Đất Rang Mộc',
        x: 48,
        y: 68,
        fontFamily: 'Montserrat',
        fontSize: 16,
        fontWeight: '700',
        fontStyle: 'normal',
        textDecoration: 'none',
        textTransform: 'none',
        textAlign: 'center',
        color: '#ffffff',
        letterSpacing: 1,
        lineHeight: 1.2,
        rotation: 0,
        shadowType: 'soft',
        bgBadge: 'espresso',
        animation: 'none',
        link: '/dathang',
        zIndex: 11,
        visible: true
      },
      {
        id: 'tpl-art-3',
        type: 'image',
        imageUrl: BUILT_IN_STICKERS[1].dataUrl,
        title: '100% Rang Mộc Seal',
        x: 88,
        y: 65,
        width: 14,
        rotation: 15,
        opacity: 100,
        borderRadius: 9999,
        borderWidth: 0,
        borderColor: '#ffffff',
        shadow: 'deep',
        blendMode: 'normal',
        animation: 'float',
        link: '/dathang',
        zIndex: 15,
        visible: true
      }
    ]
  },
  {
    id: 'tpl-promo',
    title: 'Hot Promo 69K · Khuyến Mãi Sôi Động',
    desc: 'Font Bebas Neue bùng nổ, tem Hot Combo 69K nhún nhảy, thẻ Freeship thu hút đặt món ngay.',
    filter: { brightness: 90, contrast: 115, saturation: 120, blur: 0, overlayDarkness: 25, vignette: true },
    layers: [
      {
        id: 'tpl-prm-1',
        type: 'text',
        text: 'COMBO ĐỒ UỐNG & BẾP NÓNG ĐÊM',
        x: 50,
        y: 46,
        fontFamily: 'Montserrat',
        fontSize: 18,
        fontWeight: '900',
        fontStyle: 'normal',
        textDecoration: 'none',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#fef08a',
        letterSpacing: 3,
        lineHeight: 1.2,
        rotation: 0,
        shadowType: 'stroke',
        bgBadge: 'none',
        animation: 'pulse',
        link: '/khuyenmai',
        zIndex: 10,
        visible: true
      },
      {
        id: 'tpl-prm-2',
        type: 'text',
        text: 'ĐỒNG GIÁ CHỈ 69.000Đ',
        x: 50,
        y: 60,
        fontFamily: 'Bebas Neue',
        fontSize: 66,
        fontWeight: '400',
        fontStyle: 'normal',
        textDecoration: 'none',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#ffffff',
        letterSpacing: 4,
        lineHeight: 1.1,
        rotation: 0,
        shadowType: '3d',
        bgBadge: 'none',
        animation: 'shimmer',
        link: '/dathang',
        zIndex: 11,
        visible: true
      },
      {
        id: 'tpl-prm-3',
        type: 'image',
        imageUrl: BUILT_IN_STICKERS[3].dataUrl,
        title: 'Hot 69K Stamp',
        x: 16,
        y: 66,
        width: 14,
        rotation: -12,
        opacity: 100,
        borderRadius: 0,
        borderWidth: 0,
        borderColor: '#ffffff',
        shadow: 'deep',
        blendMode: 'normal',
        animation: 'bounce',
        link: '/dathang',
        zIndex: 15,
        visible: true
      },
      {
        id: 'tpl-prm-4',
        type: 'image',
        imageUrl: BUILT_IN_STICKERS[4].dataUrl,
        title: 'Freeship Badge',
        x: 84,
        y: 68,
        width: 17,
        rotation: 8,
        opacity: 100,
        borderRadius: 30,
        borderWidth: 0,
        borderColor: '#ffffff',
        shadow: 'glow',
        blendMode: 'normal',
        animation: 'float',
        link: '/dathang',
        zIndex: 16,
        visible: true
      }
    ]
  },
  {
    id: 'tpl-minimal',
    title: 'Ảnh Bìa Thuần Túy · Không Chữ Phủ',
    desc: 'Chỉ hiển thị ảnh chụp hoặc video gốc thuần khiết, không chèn bất kỳ chữ hay tem nhãn nào.',
    filter: { brightness: 100, contrast: 100, saturation: 100, blur: 0, overlayDarkness: 0, vignette: false },
    layers: []
  }
];
