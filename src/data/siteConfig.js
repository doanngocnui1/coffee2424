import { saveCloudSiteConfig, fetchCloudSiteConfig, isLocalhost } from '../lib/supabase.js';

export const STORAGE_KEY = isLocalhost ? 'coffee2424_local_site_config' : 'coffee2424_site_config';

export const DEFAULT_SITE_CONFIG = {
  brandName: 'COFFEE 24/24',
  slogan: 'Enjoy Your Life',
  logo: '/images/logo.jpg',
  favicon: '/images/logo.jpg',
  heroHeadline: 'COFFEE 24/24',
  heroSubheadline: 'Hương vị cà phê nguyên bản, đậm đà và tinh tế.',
  hotlineGeneral: '0906 916 816',
  hotlinePHI: '0986511897',
  hotlineD5: '0347374858',
  email: 'contact@coffee2424.com',
  announcementBar: {
    enabled: false,
    text: '⚡ Thưởng thức bộ sưu tập cà phê mộc & specialty mới nhất tại Coffee 24/24!',
    linkPath: '/dathang'
  },
  // 0. Quản lý Web Đặt Hàng Trực Tuyến & Liên Kết KiotViet (Mở web khi nhấn Đặt hàng, Đặt món, Thực đơn)
  orderOnline: {
    enabled: true, // Khi bật: mọi nút Đặt Hàng, Đặt Món, Thực Đơn sẽ tự động mở trang web bán hàng KiotViet
    url: 'https://coffee2424.web-store.online', // Ô nhập địa chỉ web đặt hàng chính bên KiotViet
    openMode: 'new_tab', // 'new_tab' | 'same_tab'
    buttonText: 'Mở Web Đặt Hàng KiotViet',
    disableLocalMenus: true, // Tắt hiển thị các món menu thủ công trên web
    branch413PhiUrl: 'https://coffee2424.web-store.online/menu/363688',
    branch96D5Url: 'https://coffee2424.web-store.online/menu/363827'
  },
  // 1. Ảnh Bìa / GIF / Video Hero 16:9 & Thiết Kế Trực Quan (Canvas Studio)
  heroBanner16x9: {
    type: 'auto', // 'auto' | 'image' | 'gif' | 'video'
    mediaUrl: '/images/custom_hero_banner.jpg',
    link: '/dathang',
    alt: 'COFFEE 24/24 - Không Gian Cà Phê 24/7',
    fixedBackground: false,
    mobileAspectRatio: 'full', // 'full' | '3/4' | '4/5' | '1/1' | '16/9'
    filter: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      overlayDarkness: 10,
      overlayColor: '#000000',
      vignette: true
    },
    layers: []
  },
  // Quản lý chi tiết Hero Slide (Dữ liệu cũ dự phòng)
  heroSection: {
    enabled: true,
    badge: {
      enabled: true,
      text: 'COFFEE 24/24 · ENJOY YOUR LIFE',
      textColor: '#704f38',
      bgColor: 'rgba(255, 255, 255, 0.75)',
      showDot: true,
      dotColor: '#10b981'
    },
    headline: {
      enabled: true,
      line1: 'Coffee',
      line2: 'The Best For You',
      size: 'large', // 'normal' | 'medium' | 'large' | 'huge'
      colorScheme: 'classic', // 'classic' | 'amber_gold' | 'pure_dark' | 'gradient_sunset' | 'custom'
      colorLine1: '#2b170e',
      colorLine2: '#3d2215',
      effect: 'none', // 'none' | 'glow' | 'shadow' | 'shine'
      animation: 'fade_in' // 'none' | 'fade_in' | 'slide_up'
    },
    description: {
      enabled: true,
      text: 'Robusta & Arabica rang mộc nguyên chất, hòa quyện lớp bọt sữa thanh trùng sánh mịn vẽ hình trái tim nghệ thuật.',
      size: 'normal', // 'small' | 'normal' | 'large'
      color: '#5a4233'
    },
    ctaButton: {
      enabled: true,
      text: 'Xem Menu',
      link: '/dathang',
      colorScheme: 'espresso', // 'espresso' | 'amber' | 'gradient_rich' | 'dark'
      shimmer: true
    },
    originBadge: {
      enabled: true,
      text: 'Cầu Đất Farm',
      showIcon: true
    },
    ratingBadge: {
      enabled: true,
      rating: '4.9 ★',
      subtext: '(1.2k+ đánh giá)',
      animation: 'float_reverse'
    },
    freshBadge: {
      enabled: true,
      text: 'Pha Tươi 24/7',
      animation: 'float_slow'
    },
    drinkPill: {
      enabled: true,
      drinkName: 'CAPPUCCINO LATTE ART',
      priceText: '45.000đ • Signature',
      animation: 'float_reverse'
    },
    imageStyle: {
      scale: 100, // 70 to 140
      opacity: 100, // 20 to 100
      brightness: 100, // 50 to 150
      contrast: 100, // 50 to 150
      saturation: 115, // 0 to 200
      blur: 0, // 0 to 10
      shape: 'cup_saucer', // 'cup_saucer' | 'squircle' | 'circle_plain' | 'rounded_card'
      animation: 'float_slow', // 'none' | 'float_slow' | 'pulse' | 'steam_drift' | 'tilt'
      showSteam: true,
      showSaucer: true,
      showGlowAura: true
    },
    items: [
      {
        id: 1,
        title: 'Coffee',
        subtitle: 'The Best For You',
        drinkName: 'Cappuccino Latte Art',
        desc: 'Robusta & Arabica rang mộc nguyên chất, hòa quyện lớp bọt sữa thanh trùng sánh mịn vẽ hình trái tim nghệ thuật.',
        image: '/images/signature_drinks.jpg',
        price: '45.000đ',
        badge: 'Signature',
        rating: '4.9 ★',
        origin: 'Cầu Đất Farm'
      },
      {
        id: 2,
        title: 'Cold Brew',
        subtitle: 'Pure & Refreshing',
        drinkName: 'Cold Brew Cam Vàng',
        desc: 'Ủ lạnh 24 giờ thơm hương hoa quả nhiệt đới, hòa cùng cam vàng mọng nước mang đến vị chua ngọt thanh khiết.',
        image: '/images/promo_banner.jpg',
        price: '49.000đ',
        badge: 'Món Mới',
        rating: '5.0 ★',
        origin: 'Đắk Lắk Blend'
      },
      {
        id: 3,
        title: 'Espresso',
        subtitle: 'Wake Up Your Passion',
        drinkName: 'Cà Phê Sữa Đá 24/24',
        desc: 'Hạt cà phê nguyên bản Đắk Lắk đậm đà, phối sữa đặc béo ngậy ngọt sâu, tiếp lửa làm việc và sáng tạo xuyên đêm.',
        image: '/images/journey_espresso.jpg',
        price: '35.000đ',
        badge: 'Bestseller',
        rating: '4.9 ★',
        origin: 'Rang Mộc 100%'
      }
    ]
  },
  // 2. Quản lý Hình Nền Phía Sau Lớp Kính Mờ & Độ Trong Suốt Nhìn Thấu
  glassBackground: {
    enabled: true,
    image: '/images/hero_banner.jpg',
    preset: 'warm_cafe',
    opacity: 0.38,
    blur: 6,
    brightness: 95,
    contrast: 105,
    saturate: 110,
    overlayColor: '#ede6dc',
    overlayOpacity: 0.30,
    glassBlur: 24,
    glassBgOpacity: 0.28,
    glassBorderOpacity: 0.65,
    showAmbientOrbs: true,
    animation: 'none'
  },
  // 2 Side Vertical Promotional Posters
  sideBanners: {
    enabled: true,
    left: {
      title: 'MÓN MỚI',
      showTitle: true,
      subtitle: 'Cold Brew Cam Vàng',
      showSubtitle: true,
      desc: 'Ủ lạnh 24 giờ thơm mát sảng khoái',
      showDesc: true,
      badge: 'NEW',
      showBadge: true,
      image: '/images/poster_vertical_left.jpg',
      link: '/dathang'
    },
    right: {
      title: 'COMBO HOT',
      showTitle: true,
      subtitle: 'Cà Phê & Croissant',
      showSubtitle: true,
      desc: 'Combo sáng năng lượng chỉ 69K',
      showDesc: true,
      badge: '69K',
      showBadge: true,
      image: '/images/poster_vertical_right.jpg',
      link: '/khuyenmai'
    }
  },
  // Cấu hình Trang Tuyển Dụng & Đồng bộ Google Sheets / Drive
  careersPage: {
    heroBadge: 'CƠ HỘI NGHỀ NGHIỆP 24/24',
    heroTitle: 'GIA NHẬP ĐỘI NGŨ',
    heroTitleHighlight: 'COFFEE 24/24',
    heroDescription: 'COFFEE 24/24 chào đón các nhân tài ở mọi vị trí từ Ban Điều Hành, Văn Phòng đến Khối Cửa Hàng Vận Hành 24/7. Môi trường trẻ trung, chế độ đãi ngộ cạnh tranh và lộ trình thăng tiến rõ ràng.',
    badges: [
      { text: 'Cà phê miễn phí mỗi ca', icon: 'coffee' },
      { text: 'Phụ cấp ca đêm & thưởng KPI', icon: 'award' },
      { text: 'BHXH đầy đủ & ESOP quản lý', icon: 'shield' }
    ],
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE/edit?gid=0#gid=0',
    googleSheetId: '1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE',
    googleDriveFolderUrl: 'https://drive.google.com/drive/folders/1s2L6e8FhQ5rgeYgfIkoHZHTwV8sOOhz-',
    googleDriveFolderId: '1s2L6e8FhQ5rgeYgfIkoHZHTwV8sOOhz-',
    googleScriptUrl: '',
    showFormInHero: true
  },
  // Khối 1: Món Mới Trình Làng (Trang Chủ)
  newDishesSection: {
    enabled: true,
    badge: 'MENU MỚI TRÌNH LÀNG',
    showBadge: true,
    title: 'Món Mới Nổi Bật',
    highlightTitle: 'Đánh Thức Vị Giác',
    subtitle: 'Khám phá các thức uống sáng tạo và bánh nướng tươi ngon vừa ra mắt tại COFFEE 24/24.'
  },
  newDishesList: [
    {
      id: 'dish-1',
      tag: 'MÓN MỚI',
      title: 'Trà Nho Mẫu Đơn',
      price: '59.000đ',
      image: '/images/dish_1.png',
      cta: 'Đặt Món Ngay',
      link: '/dathang'
    },
    {
      id: 'dish-2',
      tag: 'SIGNATURE',
      title: 'Matcha MK4',
      price: '62.000đ',
      image: '/images/dish_2.png',
      cta: 'Đặt Món Ngay',
      link: '/dathang'
    },
    {
      id: 'dish-3',
      tag: 'MÓN MỚI',
      title: 'Trà Mận Tây Bắc',
      price: '59.000đ',
      image: '/images/dish_3.png',
      cta: 'Đặt Món Ngay',
      link: '/dathang'
    },
    {
      id: 'dish-4',
      tag: 'ĐÁ XAY',
      title: 'Caramel Freeze',
      price: '62.000đ',
      image: '/images/dish_4.png',
      cta: 'Đặt Món Ngay',
      link: '/dathang'
    },
    {
      id: 'dish-5',
      tag: 'MÓN MỚI',
      title: 'Cacao Mint',
      price: '62.000đ',
      image: '/images/dish_5.png',
      cta: 'Đặt Món Ngay',
      link: '/dathang'
    }
  ],
  // Khối 2: Chương Trình Ưu Đãi & Combo (Trang Chủ)
  promotionsSection: {
    enabled: true,
    badge: 'ƯU ĐÃI ĐẶC QUYỀN',
    showBadge: true,
    title: 'Chương Trình Ưu Đãi',
    highlightTitle: 'Dành Riêng Cho Bạn',
    subtitle: 'Tổng hợp các voucher giảm giá, combo tiết kiệm và giờ vàng ưu đãi dành cho học sinh, sinh viên và cộng đồng chạy deadline.'
  },
  promotionsList: [
    {
      id: 'promo-1',
      tag: 'GIỜ VÀNG',
      title: 'Golden Hour - Cà Phê Đồng Giá 25K (16h - 19h)',
      discount: '25.000đ',
      image: '/images/promo_1.png',
      cta: 'Nhận Ưu Đãi',
      link: '/khuyenmai'
    },
    {
      id: 'promo-2',
      tag: 'COMBO ĐÊM',
      title: 'Combo Cú Đêm 22h - 6h (Mì Hảo Hảo + Nước)',
      discount: 'CHỈ TỪ 42K',
      image: '/images/promo_2.png',
      cta: 'Đặt Combo Cú Đêm',
      link: '/khuyenmai'
    },
    {
      id: 'promo-3',
      tag: 'COMBO SÁNG',
      title: 'Khởi Động Ngày Mới 4h - 10h (Bánh Mì / Croissant + Nước)',
      discount: 'CHỈ TỪ 43K',
      image: '/images/promo_3.png',
      cta: 'Đặt Combo Sáng',
      link: '/khuyenmai'
    }
  ],
  // Khối Món Mới Trình Làng & Ưu Đãi Đặc Quyền (Tương thích ngược)
  whatsNewSection: {
    enabled: true,
    badge: 'Món Mới & Ưu Đãi',
    title: 'Món Mới Trình Làng &',
    highlightTitle: 'Ưu Đãi Đặc Quyền',
    subtitle: 'Cập nhật món mới và ưu đãi nổi bật dành cho học tập & làm việc.'
  },
  // Khối Không Gian Lý Tưởng Cho Học Tập & Làm Việc (Trang Chủ)
  spaceAmenities: {
    enabled: true,
    title: 'Không Gian Lý Tưởng Cho',
    highlightTitle: 'Học Tập & Làm Việc',
    quote: 'Với không gian rộng rãi, ánh sáng dịu nhẹ, âm thanh yên tĩnh, nhiệt độ phòng mát mẻ, và hệ thống ổ điện được trang bị ở tất cả các vị trí có bàn ghế, đảm bảo không gian làm việc và học tập thuận tiện cho khách hàng.',
    chips: [
      { id: 'chip-1', title: 'Ổ Điện 100% Bàn Ghế', icon: 'zap', color: 'amber' },
      { id: 'chip-2', title: 'Không Gian Rộng Rãi', icon: 'compass', color: 'emerald' },
      { id: 'chip-3', title: 'Ánh Sáng Dịu Nhẹ', icon: 'sun', color: 'orange' },
      { id: 'chip-4', title: 'Âm Thanh Yên Tĩnh', icon: 'volume2', color: 'indigo' },
      { id: 'chip-5', title: 'Nhiệt Độ Mát Mẻ', icon: 'wind', color: 'teal' }
    ],
    photos: [
      { id: 'photo-1', title: 'Bàn Dài Học Nhóm 8-12 Bạn', image: '/images/branch_downtown.jpg' },
      { id: 'photo-2', title: 'Góc Chạy Deadline Yên Tĩnh', image: '/images/blog_workspace.jpg' },
      { id: 'photo-3', title: 'Ánh Sáng Chuẩn Công Thái Học', image: '/images/blog_student_study.jpg' },
      { id: 'photo-4', title: 'Sofa Thư Giãn & Xả Stress', image: '/images/blog_gaming_chill.jpg' }
    ]
  },
  // Khối: COFFEE 24/24 BÁN GÌ? (Trình diễn các nhóm thức uống & món ăn)
  offeringsSection: {
    enabled: true,
    title: 'COFFEE 24/24 BÁN GÌ?',
    quote: 'Chúng tôi có bán nhiều loại thức uống từ cà phê, matcha, matcha mk4, trà trái cây, trà trái cây tươi, trà sữa, thức uống chế biến từ cacao, các món đá xay, và phục vụ các loại thức ăn.',
  },
  offeringsList: [
    {
      id: 'coffee',
      tabLabel: 'Cà Phê Rang Mộc',
      category: 'TỪ CÀ PHÊ RANG MỘC NGUYÊN BẢN',
      icon: 'Coffee',
      badge: '100% Rang Mộc · Robusta & Arabica',
      title: 'Cà Phê Rang Mộc & Cold Brew 24H',
      subtitle: 'Khởi đầu sự tỉnh táo & tập trung cao độ',
      story: 'Chúng tôi tuyển chọn 100% hạt Robusta Đắk Lắk đậm đà và Arabica Cầu Đất thơm nồng nàn, rang mộc nguyên chất không tẩm ướp. Từ phin truyền thống nhỏ từng giọt lắng đọng, espresso chiết xuất chuẩn áp suất, đến Cold Brew ủ lạnh suốt 24 giờ thơm hương hoa quả — tiếp lửa tỉnh táo bền bỉ suốt ngày dài và đêm thâu.',
      highlights: ['Phin Nguyên Bản Đậm Đà', 'Espresso / Latte Pha Máy', 'Cold Brew Cam Vàng Ủ 24h', 'Bạc Xỉu 3 Tầng Kem Sữa'],
      image: '/images/journey_espresso.jpg',
      ctaText: 'Xem Chi Tiết Món & Đặt Ngay',
      ctaLink: '/dathang'
    },
    {
      id: 'matcha',
      tabLabel: 'Matcha & MK4',
      category: 'MATCHA & MATCHA MK4 THƯỢNG HẠNG',
      icon: 'Sparkles',
      badge: 'Specialty Grade · Nhập Khẩu Nhật Bản',
      title: 'Matcha Nghệ Nhân & Specialty MK4',
      subtitle: 'Tâm trí tĩnh tại, sáng tạo thông suốt',
      story: 'Dòng bột trà xanh Matcha cao cấp, đặc biệt là Specialty Matcha MK4 tuyển chọn chuẩn vùng Uji (Kyoto). Màu xanh ngọc bích tự nhiên, dồi dào chất chống oxy hóa và hoạt chất L-theanine giúp giải tỏa căng thẳng thần kinh, mang lại trạng thái tập trung sâu êm dịu, sảng khoái mà không cồn cào hay tim đập nhanh.',
      highlights: ['Matcha MK4 Latte Thượng Hạng', 'Macchiato Kem Muối Biển', 'Matcha Đá Xay Kem Tuyết', 'Matcha Sữa Dừa Thanh Mát'],
      image: '/images/blog_brewing.jpg',
      ctaText: 'Xem Chi Tiết Món & Đặt Ngay',
      ctaLink: '/dathang'
    },
    {
      id: 'fruit-tea',
      tabLabel: 'Trà Trái Cây Tươi',
      category: 'TRÀ TRÁI CÂY & TRÀ TRÁI CÂY TƯƠI',
      icon: 'Sun',
      badge: '100% Trái Cây Tươi Trong Ngày',
      title: 'Trà Trái Cây & Trái Cây Tươi Tự Nhiên',
      subtitle: 'Năng lượng thanh mát, bừng tỉnh giác quan',
      story: 'Nấu từ cốt trà Oolong và trà đen hảo hạng ủ lạnh, kết hợp cùng các loại trái cây nhiệt đới tươi rói cắt lát mới mỗi ngày: cam vàng, đào giòn, ổi hồng ruột đỏ, dâu tây và hạt chia hữu cơ. Vị chua ngọt thanh khiết, cung cấp vitamin tự nhiên giúp giải nhiệt tức thì sau nhiều giờ nhìn màn hình laptop.',
      highlights: ['Trà Đào Cam Sả Hoàng Gia', 'Trà Ổi Hồng Hạt Chia', 'Trà Vải Hoa Hồng Tươi Mát', 'Trà Táo Quế Mật Ong Ấm'],
      image: '/images/promo_banner.jpg',
      ctaText: 'Xem Chi Tiết Món & Đặt Ngay',
      ctaLink: '/dathang'
    },
    {
      id: 'milk-tea',
      tabLabel: 'Trà Sữa Đậm Vị',
      category: 'TRÀ SỮA ĐẬM VỊ CỐT TRÀ',
      icon: 'Heart',
      badge: 'Ủ Cốt Trà Thơm Nức · Chuẩn Gu',
      title: 'Trà Sữa Đậm Vị Cốt Trà Truyền Thống',
      subtitle: 'Ngọt ngào vỗ về những giờ học nhóm',
      story: 'Chắt lọc từ những búp trà đen và Oolong nướng than hoa thơm nức mũi, kết hợp tỷ lệ vàng cùng sữa tươi béo ngậy vừa vặn mà không ngấy. Topping trân châu hoàng kim dai giòn, thạch phô mai béo ngậy được chế biến thủ công trong ngày, tạo nên ly trà sữa đậm vị ngọt thanh, chuẩn gu các bạn trẻ.',
      highlights: ['Trà Sữa Oolong Nướng 24/24', 'Trà Sữa Thái Xanh Phô Mai', 'Trà Sữa Lài Kem Trứng Cháy', 'Topping Trân Châu Hoàng Kim'],
      image: '/images/blog_student_study.jpg',
      ctaText: 'Xem Chi Tiết Món & Đặt Ngay',
      ctaLink: '/dathang'
    },
    {
      id: 'cacao',
      tabLabel: 'Cacao Thơm Béo',
      category: 'THỨC UỐNG CHẾ BIẾN TỪ CACAO',
      icon: 'Flame',
      badge: 'Cacao Đắk Lắk Nguyên Chất',
      title: 'Thức Uống Chế Biến Từ Cacao Thơm Béo',
      subtitle: 'Vòng tay ấm áp giữa đêm muộn se lạnh',
      story: 'Bột cacao nguyên chất sánh đặc, giàu magiê và dưỡng chất giúp giải tỏa mệt mỏi thể chất và vỗ về tâm trạng. Dù là một tách cacao nóng hổi bồng bềnh kẹo marshmallow tan chảy lúc 2 giờ sáng hay ly cacao sữa dừa đá xay thơm ngậy, đều đem lại cảm giác bình yên và nguồn năng lượng dồi dào.',
      highlights: ['Cacao Nóng Marshmallow Đêm Muộn', 'Cacao Sữa Dừa Béo Ngậy', 'Cacao Kem Cheese Béo Mặn', 'Dark Chocolate Sánh Đậm'],
      image: '/images/journey_roast.jpg',
      ctaText: 'Xem Chi Tiết Món & Đặt Ngay',
      ctaLink: '/dathang'
    },
    {
      id: 'ice-blended',
      tabLabel: 'Món Đá Xay',
      category: 'CÁC MÓN ĐÁ XAY SẢNG KHOÁI',
      icon: 'Wind',
      badge: 'Đá Xay Tuyết Mịn · Bùng Nổ Vị Giác',
      title: 'Các Món Đá Xay Tuyết Sảng Khoái',
      subtitle: 'Đánh thức tinh thần tức thì',
      story: 'Dòng thức uống Ice-Blended xay tuyết nhuyễn mịn như nhung, kết hợp cà phê espresso đậm đặc, bánh Oreo giòn rụm hoặc caramel béo ngậy, phủ lớp kem tươi whipping cream bồng bềnh rưới sốt ngọt ngào. Món giải nhiệt sảng khoái lý tưởng giúp bạn nạp năng lượng nhanh và đánh bay cơn buồn ngủ.',
      highlights: ['Mocha Frappe Kem Tươi', 'Caramel Cookies & Cream', 'Matcha Tuyết Đá Xay', 'Chocolate Mint Blizzard'],
      image: '/images/blog_gaming_chill.jpg',
      ctaText: 'Xem Chi Tiết Món & Đặt Ngay',
      ctaLink: '/dathang'
    },
    {
      id: 'food-service',
      tabLabel: 'Thức Ăn Bếp Đêm',
      category: 'PHỤC VỤ CÁC LOẠI THỨC ĂN 24/7',
      icon: 'UtensilsCrossed',
      badge: 'Bếp Nóng 24/7 · Cứu Đói Xuyên Đêm',
      title: 'Bếp Nóng Phục Vụ Các Loại Thức Ăn 24/24',
      subtitle: 'Nạp đầy năng lượng ấm bụng để học tập & làm việc thâu đêm',
      story: 'Chúng tôi hiểu rằng những giờ chạy deadline hay học nhóm thâu đêm không chỉ cần cà phê, mà cần một chiếc bụng no ấm. Bếp nóng COFFEE 24/24 luôn đỏ lửa 24/7, sẵn sàng phục vụ các món ăn nóng hổi vừa thổi vừa ăn: từ tô mì xào bò rau cải đầy đặn kèm trứng ốp la lòng đào, mì gói xúc xích nước cay ấm lòng 2h sáng, đến bánh mì que Hải Phòng giòn rụm và croissant bơ Pháp nướng nóng giòn tại chỗ.',
      highlights: ['Mì Xào Bò Trứng Ốp La Lòng Đào', 'Mì Gói Xúc Xích Siêu Cấp Cay Ấm', 'Bánh Mì Que Hải Phòng Nóng Giòn', 'Croissant Bơ Pháp Nướng Tại Chỗ'],
      image: '/images/blog_late_night_food.jpg',
      ctaText: 'Xem Chi Tiết Món & Đặt Ngay',
      ctaLink: '/dathang'
    }
  ],
  // Bố Cục & Danh Sách Các Thành Phần Trên Trang Chủ (Dynamic Section Page Builder)
  homeSections: [
    { id: 'sec-hero', type: 'hero', title: 'Banner 16:9 Tràn Viền (Full-Bleed Studio)', enabled: true },
    { id: 'sec-newDishes', type: 'newDishes', title: 'Món Mới Trình Làng (Poster 3:4)', enabled: true },
    { id: 'sec-promotions', type: 'promotions', title: 'Chương Trình Ưu Đãi (Poster 3:4)', enabled: true },
    { id: 'sec-spaceAmenities', type: 'spaceAmenities', title: 'Không Gian & Tiện Nghi 24/7', enabled: true },
    { id: 'sec-offerings', type: 'offerings', title: 'Coffee 24/24 Bán Gì? (Sân Khấu 7 Nhóm Món)', enabled: false },
    { id: 'sec-reviews', type: 'reviews', title: 'Cảm Nhận & Đánh Giá Khách Hàng', enabled: true },
    { id: 'sec-social', type: 'social', title: 'Kết Nối Mạng Xã Hội & Fanpage', enabled: true },
  ],
  // Khối Tiêu Đề & Giới Thiệu Đánh Giá Khách Hàng (Trang Chủ)
  reviewsSection: {
    enabled: true,
    badge: 'CẢM NHẬN THỰC TẾ',
    showBadge: true,
    title: 'Khách Hàng Đánh Giá',
    highlightTitle: 'Như Thế Nào Về Chúng Tôi?',
    subtitle: 'Hơn 1.200 đánh giá 5 sao từ cộng đồng học sinh, sinh viên các trường đại học lân cận, lập trình viên và giới freelancer chạy deadline thâu đêm.',
    googleRatingText: '4.9 / 5.0 ⭐ trên Google Maps (1.200+ đánh giá)',
    showGoogleRating: true
  },
  // Danh Sách Poster Dọc 3x4 Trang Chủ (Món mới & Chương trình nổi bật)
  homePosters: [
    {
      id: 'poster-1',
      tag: 'MÓN MỚI',
      title: 'Trà Nho Mẫu Đơn',
      discount: '59.000đ',
      image: '/images/dish_1.png',
      cta: 'Đặt Món Ngay',
      link: '/dathang'
    },
    {
      id: 'poster-2',
      tag: 'COMBO ĐÊM',
      title: 'Combo Cú Đêm 22h - 6h',
      discount: 'CHỈ TỪ 42K',
      image: '/images/promo_2.png',
      cta: 'Đặt Combo',
      link: '/khuyenmai'
    },
    {
      id: 'poster-3',
      tag: 'GIỜ VÀNG',
      title: 'Golden Hour Cà Phê Đồng Giá 25K',
      discount: '25.000đ',
      image: '/images/promo_1.png',
      cta: 'Nhận Ưu Đãi',
      link: '/khuyenmai'
    }
  ],
  // Bonus Promotional Banner in Home Page (Khối Ưu Đãi Đêm & Học Nhóm)
  bonusPromoBanner: {
    enabled: true,
    showBadge: true,
    badgeText: 'Cộng Đồng Cày Deadline & Học Nhóm 24/24',
    showTitle: true,
    title: 'Bạn Cần Không Gian Xuyên Đêm & Ưu Đãi Nhóm?',
    showDesc: true,
    desc: 'Khám phá thêm mã Mua 3 Tặng 1 cho nhóm học, voucher 40K bạn mới và miễn phí ship đêm khuya tại Trang Khuyến Mãi.',
    showButton: true,
    buttonText: 'Xem Trọn Bộ Ưu Đãi',
    buttonLink: '/khuyenmai'
  },
  // Check-in Hashtag & Social Rewards Banner (Khối Ghé Quán & Check-in)
  checkinHashtagBanner: {
    enabled: true,
    showTitle: true,
    title: 'Ghé quán & Check-in cùng hashtag',
    highlightTag: '#Coffee2424',
    showDesc: true,
    desc: 'Gắn thẻ @coffee2424 trên Instagram hoặc TikTok để nhận ngay voucher giảm 20% cho lần ghé quán tiếp theo.',
    showHashtags: true,
    hashtag1: '#Coffee2424',
    hashtag2: '#ThucCungDamMe'
  },
  // Quản lý Kết Nối Mạng Xã Hội (Facebook, TikTok, Instagram, Threads, YouTube)
  socialMedia: {
    sectionTitle: 'FOLLOW OUR JOURNEY · #ENJOYYOURLIFE',
    sectionSubtitle: 'Kết nối cùng cộng đồng COFFEE 24/24',
    platforms: [
      {
        id: 'facebook',
        name: 'Facebook',
        handle: '@coffee2424',
        url: 'https://www.facebook.com/coffee2424',
        embedUrl: 'https://www.facebook.com/coffee2424',
        visible: true,
        isPlaceholder: false,
        badge: 'Chính thức',
        color: '#1877F2',
        desc: 'Cập nhật tin tức, sự kiện & hoạt động chi nhánh'
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        handle: '@hethongcoffee2424',
        url: 'https://www.tiktok.com/@hethongcoffee2424',
        embedUrl: 'https://www.tiktok.com/@hethongcoffee2424',
        visible: true,
        isPlaceholder: false,
        badge: 'Kênh TikTok',
        color: '#000000',
        desc: 'Video pha chế, review không gian & khoảnh khắc 24/24'
      },
      {
        id: 'instagram',
        name: 'Instagram',
        handle: '@coffee2424',
        url: 'https://www.instagram.com/coffee2424',
        embedUrl: '',
        visible: true,
        isPlaceholder: true,
        placeholderText: 'Chờ nhúng Instagram',
        badge: 'Sắp ra mắt',
        color: '#E1306C',
        desc: 'Hình ảnh không gian & feedback từ khách hàng'
      },
      {
        id: 'threads',
        name: 'Threads',
        handle: '@coffee2424',
        url: 'https://www.threads.net/@coffee2424',
        embedUrl: '',
        visible: true,
        isPlaceholder: true,
        placeholderText: 'Chờ nhúng Threads',
        badge: 'Sắp ra mắt',
        color: '#111111',
        desc: 'Chia sẻ tâm sự đêm muộn & giao lưu cộng đồng'
      },
      {
        id: 'youtube',
        name: 'YouTube',
        handle: '@coffee2424',
        url: 'https://www.youtube.com/@coffee2424',
        embedUrl: '',
        visible: true,
        isPlaceholder: true,
        placeholderText: 'Chờ nhúng YouTube',
        badge: 'Sắp ra mắt',
        color: '#FF0000',
        desc: 'Podcast, âm nhạc lofi & câu chuyện cà phê'
      },
      {
        id: 'zalo',
        name: 'Zalo OA',
        handle: 'COFFEE 24/24',
        url: 'https://zalo.me/197464281190102692',
        embedUrl: '',
        visible: true,
        isPlaceholder: false,
        badge: 'Chính thức',
        color: '#0068FF',
        desc: 'Quan tâm Zalo OA để nhận voucher thành viên & giải đáp 24/7'
      }
    ]
  },
  // Quản lý Zalo Official Account & Mã QR (Hiển thị ở chân trang thay chỗ QR menu 2 chi nhánh)
  zaloOA: {
    enabled: true,
    displayMode: 'zalo_only', // 'zalo_only' | 'both' | 'branch_menu_only'
    title: 'Zalo Official Account',
    badge: 'KẾT NỐI CHÍNH THỨC',
    oaName: 'COFFEE 24/24',
    oaId: '197464281190102692',
    url: 'https://zalo.me/197464281190102692',
    qrImage: '/images/qr_zalo_oa.png',
    desc: 'Quét mã QR bằng Zalo hoặc nhấn nút để quan tâm OA, nhận ngay ưu đãi thành viên & hỗ trợ 24/7.',
    buttonText: 'Mở Zalo OA Nhận Ưu Đãi'
  },
  // Cấu hình Trang Giới Thiệu (About Page CMS)
  aboutPage: {
    heroBadge: 'Câu Chuyện Thương Hiệu COFFEE 24/24',
    heroTitle: 'COFFEE 24/24 Sinh Ra Là Để Giải Quyết Vấn Đề Gì Cho Bạn?',
    heroSubtitle: 'Chúng tôi không chỉ phục vụ những tách cà phê thơm ngon, mà kiến tạo một trạm dừng chân tiện nghi 24/7 – nơi bạn tự do học tập, làm việc, kết nối và nạp lại năng lượng sống mà không bị bất kỳ rào cản nào bó buộc.',
    missionsSubtitle: 'SỨ MỆNH PHỤC VỤ',
    missionsTitle: 'Không Gian Dành Riêng Cho Bạn',
    missionsDesc: 'Dù bạn là ai và đến vào khung giờ nào, COFFEE 24/24 luôn có một góc hoàn hảo đón chào bạn.',
    missions: [
      {
        id: 'student',
        title: 'Sinh Viên Học Nhóm & Làm Đồ Án',
        desc: 'Bàn gỗ dài rộng rãi cho nhóm 8-12 bạn, ổ cắm từng ghế, wifi gigabit kéo file nặng cực nhanh. Không lo ký túc xá đóng cửa, không gian yên tĩnh học tập xuyên đêm.'
      },
      {
        id: 'freelancer',
        title: 'Dân Chạy Deadline & Freelancer',
        desc: 'Thoát khỏi 4 bức tường phòng trọ chật hẹp và văn phòng gò bó. Ghế đệm êm ái chống mỏi lưng, điều hòa mát lạnh 24/24 giúp bật tung cảm hứng sáng tạo.'
      },
      {
        id: 'business',
        title: 'Giao Lưu & Hợp Tác Kinh Doanh',
        desc: 'Không gian lịch sự, hiện đại, phân khu tách biệt lý tưởng cho các buổi đàm phán hợp đồng, gặp gỡ đối tác quốc tế hoặc bàn bạc dự án startup xuyên múi giờ.'
      },
      {
        id: 'chill',
        title: 'Góc Nhỏ Xả Stress 1 Mình',
        desc: 'Một góc sofa êm ái ngả lưng, cắm tai nghe leo vài ván game với wifi ping thấp, nhâm nhi ly nước ngon để tâm trí được xả hơi sau chuỗi ngày làm việc căng thẳng.'
      }
    ],
    amenitiesSubtitle: 'TIỆN NGHI 5 SAO',
    amenitiesTitle: 'Trang Bị Tận Răng Phục Vụ 24/24',
    amenitiesDesc: 'Được đầu tư bài bản để mang đến trải nghiệm thâu đêm thoải mái và hiệu quả tối đa.',
    amenities: [
      {
        id: 'power',
        title: 'Ổ Điện Từng Vị Trí Ngồi',
        desc: 'Ổ cắm 3 chấu đa năng tại 100% bàn ghế, thoải mái cắm laptop gaming, sạc nhanh điện thoại.'
      },
      {
        id: 'wifi',
        title: 'Wifi Gigabit Băng Thông Khủng',
        desc: 'Hệ thống Mesh chuyên dụng, ping game cực thấp, tải file thiết kế nặng hay họp Zoom mượt mà.'
      },
      {
        id: 'ac',
        title: 'Máy Lạnh 24/24 Mát Rượi',
        desc: 'Duy trì liên tục 22 - 24°C suốt ngày đêm kèm hệ thống lọc khí trong lành, sảng khoái.'
      },
      {
        id: 'chair',
        title: 'Bàn Ghế Êm Ái Chống Mỏi Lưng',
        desc: 'Thiết kế chuẩn độ cao công thái học, nệm ngồi êm ái nâng đỡ cột sống dù ngồi làm việc 8 tiếng.'
      },
      {
        id: 'coffee',
        title: 'Nước Ngon Rang Mộc Chuẩn Vị',
        desc: '100% hạt Robusta Đắk Lắk & Arabica Cầu Đất nguyên chất, không phụ gia, giữ tỉnh táo lành mạnh.'
      },
      {
        id: 'kitchen',
        title: 'Bếp Đêm Phục Vụ 24/7',
        desc: 'Mì xào trứng bò bốc khói, mì gói xúc xích ốp la, bánh mì que Hải Phòng giòn cay, bánh croissant nướng nóng.'
      }
    ]
  },
  // Dynamic Navigation Management (6 trang riêng biệt theo yêu cầu của người dùng)
  navMenu: [
    { id: 'home', label: 'Trang Chủ', path: '/', visible: true },
    { id: 'order', label: 'Thực Đơn', path: '/dathang', visible: true },
    { id: 'promo', label: 'Khuyến Mãi', path: '/khuyenmai', visible: true },
    { id: 'about', label: 'Giới Thiệu', path: '/gioithieu', visible: true },
    { id: 'career', label: 'Tuyển Dụng', path: '/tuyendung', visible: true },
    { id: 'blog', label: 'Bài Viết', path: '/baiviet', visible: true }
  ]
};

export function updateDocumentFavicon(logoUrl) {
  if (typeof document === 'undefined') return;
  const targetUrl = logoUrl || '/images/logo.jpg';
  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = targetUrl;
}

export function getSiteConfig() {
  try {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved && isLocalhost) {
      saved = localStorage.getItem('coffee2424_site_config');
      if (saved) {
        try {
          localStorage.setItem(STORAGE_KEY, saved);
        } catch (_) {}
      }
    }
    let parsed = {};
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing site config:', e);
      }
    }

    const customLeftImg = localStorage.getItem('coffee2424_banner_left_img');
    const customRightImg = localStorage.getItem('coffee2424_banner_right_img');

    const leftConfig = {
      ...DEFAULT_SITE_CONFIG.sideBanners.left,
      ...(parsed.sideBanners?.left || {})
    };
    const rightConfig = {
      ...DEFAULT_SITE_CONFIG.sideBanners.right,
      ...(parsed.sideBanners?.right || {})
    };

    // Restore custom images if stored in dedicated keys
    if (customLeftImg && (leftConfig.image === '__STORED_LEFT__' || !leftConfig.image || leftConfig.image === '/images/poster_vertical_left.jpg')) {
      leftConfig.image = customLeftImg;
    }
    if (customRightImg && (rightConfig.image === '__STORED_RIGHT__' || !rightConfig.image || rightConfig.image === '/images/poster_vertical_right.jpg')) {
      rightConfig.image = customRightImg;
    }

    // Auto-upgrade to vertical poster images if still pointing to old small images
    if (leftConfig.image === '/images/signature_drinks.jpg' || !leftConfig.image) {
      leftConfig.image = customLeftImg || '/images/poster_vertical_left.jpg';
    }
    if (rightConfig.image === '/images/promo_banner.jpg' || !rightConfig.image) {
      rightConfig.image = customRightImg || '/images/poster_vertical_right.jpg';
    }

    const updatedSlogan = (!parsed.slogan || parsed.slogan === 'Thức Cùng Đam Mê' || parsed.slogan === 'En Joy Your Life') ? 'Enjoy Your Life' : parsed.slogan;

    // Chuẩn hóa sang 6 trang riêng biệt độc lập
    let currentNavMenu = parsed.navMenu || DEFAULT_SITE_CONFIG.navMenu;
    if (currentNavMenu.length !== 6 || currentNavMenu.some(item => item.path === '/ve-coffee-24-24')) {
      currentNavMenu = DEFAULT_SITE_CONFIG.navMenu;
      try {
        const toSave = { ...parsed, navMenu: currentNavMenu };
        localStorage.setItem('coffee2424_site_config', JSON.stringify(toSave));
      } catch (err) {
        console.warn('Could not auto-upgrade navMenu cache:', err);
      }
    }

    // Restore custom Zalo QR code if stored in dedicated key
    const customZaloQr = localStorage.getItem('coffee2424_zalo_qr_img');
    const zaloConfig = {
      ...DEFAULT_SITE_CONFIG.zaloOA,
      ...(parsed.zaloOA || {})
    };
    if (customZaloQr && (zaloConfig.qrImage === '__STORED_ZALO_QR__' || !zaloConfig.qrImage)) {
      zaloConfig.qrImage = customZaloQr;
    }

    // Merge Social Media platforms
    let socialConfig = {
      ...DEFAULT_SITE_CONFIG.socialMedia,
      ...(parsed.socialMedia || {})
    };
    if (!socialConfig.platforms || socialConfig.platforms.length === 0) {
      socialConfig.platforms = DEFAULT_SITE_CONFIG.socialMedia.platforms;
    } else {
      // Ensure all 5 platforms exist even if user loaded an older config
      const existingIds = new Set(socialConfig.platforms.map(p => p.id));
      DEFAULT_SITE_CONFIG.socialMedia.platforms.forEach(defPlatform => {
        if (!existingIds.has(defPlatform.id)) {
          socialConfig.platforms.push(defPlatform);
        }
      });
    }

    // Restore custom glass background image if stored
    const customGlassBgImg = localStorage.getItem('coffee2424_glass_bg_img');
    const glassBgConfig = {
      ...DEFAULT_SITE_CONFIG.glassBackground,
      ...(parsed.glassBackground || {})
    };
    if (customGlassBgImg && (glassBgConfig.image === '__STORED_GLASS_BG__' || !glassBgConfig.image)) {
      glassBgConfig.image = customGlassBgImg;
    } else if (glassBgConfig.image === '__STORED_GLASS_BG__') {
      glassBgConfig.image = DEFAULT_SITE_CONFIG.glassBackground.image;
    }

    const heroConfig = {
      ...DEFAULT_SITE_CONFIG.heroSection,
      ...(parsed.heroSection || {}),
      badge: {
        ...DEFAULT_SITE_CONFIG.heroSection.badge,
        ...(parsed.heroSection?.badge || {})
      },
      headline: {
        ...DEFAULT_SITE_CONFIG.heroSection.headline,
        ...(parsed.heroSection?.headline || {})
      },
      description: {
        ...DEFAULT_SITE_CONFIG.heroSection.description,
        ...(parsed.heroSection?.description || {})
      },
      ctaButton: {
        ...DEFAULT_SITE_CONFIG.heroSection.ctaButton,
        ...(parsed.heroSection?.ctaButton || {})
      },
      originBadge: {
        ...DEFAULT_SITE_CONFIG.heroSection.originBadge,
        ...(parsed.heroSection?.originBadge || {})
      },
      ratingBadge: {
        ...DEFAULT_SITE_CONFIG.heroSection.ratingBadge,
        ...(parsed.heroSection?.ratingBadge || {})
      },
      freshBadge: {
        ...DEFAULT_SITE_CONFIG.heroSection.freshBadge,
        ...(parsed.heroSection?.freshBadge || {})
      },
      drinkPill: {
        ...DEFAULT_SITE_CONFIG.heroSection.drinkPill,
        ...(parsed.heroSection?.drinkPill || {})
      },
      imageStyle: {
        ...DEFAULT_SITE_CONFIG.heroSection.imageStyle,
        ...(parsed.heroSection?.imageStyle || {})
      },
      items: (parsed.heroSection?.items && parsed.heroSection.items.length > 0)
        ? parsed.heroSection.items
        : DEFAULT_SITE_CONFIG.heroSection.items
    };

    const customHeroBannerMedia = localStorage.getItem('coffee2424_hero_banner_media');
    const heroBannerConfig = {
      ...DEFAULT_SITE_CONFIG.heroBanner16x9,
      ...(parsed.heroBanner16x9 || {})
    };
    if (customHeroBannerMedia && (heroBannerConfig.mediaUrl === '__STORED_HERO_MEDIA__' || !heroBannerConfig.mediaUrl)) {
      heroBannerConfig.mediaUrl = customHeroBannerMedia;
    }
    // Tự động nâng cấp sang ảnh mặt tiền quán thực tế nếu đang trỏ ảnh mẫu cũ
    if (!heroBannerConfig.mediaUrl || heroBannerConfig.mediaUrl === '/images/hero_banner.jpg') {
      heroBannerConfig.mediaUrl = '/images/custom_hero_banner.jpg';
    }

    // Restore custom logo if stored in dedicated key
    const customLogo = localStorage.getItem('coffee2424_brand_logo_img');
    let resolvedLogo = parsed.logo || DEFAULT_SITE_CONFIG.logo || '/images/logo.jpg';
    if (customLogo && (resolvedLogo === '__STORED_LOGO__' || !resolvedLogo || resolvedLogo === '/images/logo.jpg')) {
      resolvedLogo = customLogo;
    }
    updateDocumentFavicon(resolvedLogo);

    const orderOnlineConfig = {
      ...DEFAULT_SITE_CONFIG.orderOnline,
      ...(parsed.orderOnline || {})
    };

    // Đồng bộ trạng thái hiển thị của khối Món Mới (newDishes) theo cấu hình người dùng lưu
    const isNewDishesExplicitlyEnabled = parsed.newDishesSection?.enabled !== false;
    let resolvedHomeSections = (Array.isArray(parsed.homeSections) && parsed.homeSections.length > 0)
      ? parsed.homeSections
      : (DEFAULT_SITE_CONFIG.homeSections || []);

    resolvedHomeSections = resolvedHomeSections.map(sec => {
      if (sec.type === 'newDishes' || sec.id === 'sec-newDishes') {
        return { ...sec, enabled: isNewDishesExplicitlyEnabled };
      }
      if (orderOnlineConfig.disableLocalMenus !== false && (sec.type === 'offerings' || sec.id === 'sec-offerings')) {
        return { ...sec, enabled: false };
      }
      return sec;
    });

    // Tự động nâng cấp sang danh sách 5 món mới thực tế nếu rỗng hoặc chứa ảnh mockup
    let resolvedNewDishes = (Array.isArray(parsed.newDishesList) && parsed.newDishesList.length > 0)
      ? parsed.newDishesList
      : DEFAULT_SITE_CONFIG.newDishesList;
    if (resolvedNewDishes.some(d => d.image === '/images/promo_banner.jpg' || d.image === '/images/signature_drinks.jpg' || d.image === '/images/journey_espresso.jpg')) {
      resolvedNewDishes = DEFAULT_SITE_CONFIG.newDishesList;
    }

    // Tự động nâng cấp sang danh sách 3 khuyến mãi thực tế nếu rỗng hoặc chứa ảnh mockup
    let resolvedPromotions = (Array.isArray(parsed.promotionsList) && parsed.promotionsList.length > 0)
      ? parsed.promotionsList
      : DEFAULT_SITE_CONFIG.promotionsList;
    if (resolvedPromotions.some(p => p.image === '/images/promo_banner.jpg' || p.image === '/images/signature_drinks.jpg' || p.image === '/images/journey_espresso.jpg')) {
      resolvedPromotions = DEFAULT_SITE_CONFIG.promotionsList;
    }

    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      logo: resolvedLogo,
      favicon: resolvedLogo,
      orderOnline: orderOnlineConfig,
      navMenu: currentNavMenu,
      slogan: updatedSlogan,
      socialMedia: socialConfig,
      zaloOA: zaloConfig,
      heroSection: heroConfig,
      heroBanner16x9: heroBannerConfig,
      glassBackground: glassBgConfig,
      newDishesList: resolvedNewDishes,
      promotionsList: resolvedPromotions,
      aboutPage: {
        ...DEFAULT_SITE_CONFIG.aboutPage,
        ...(parsed.aboutPage || {})
      },
      bonusPromoBanner: {
        ...DEFAULT_SITE_CONFIG.bonusPromoBanner,
        ...(parsed.bonusPromoBanner || {})
      },
      checkinHashtagBanner: {
        ...DEFAULT_SITE_CONFIG.checkinHashtagBanner,
        ...(parsed.checkinHashtagBanner || {})
      },
      sideBanners: {
        enabled: parsed.sideBanners?.enabled !== undefined ? parsed.sideBanners.enabled : true,
        left: leftConfig,
        right: rightConfig
      },
      homeSections: resolvedHomeSections,
      careersPage: {
        ...DEFAULT_SITE_CONFIG.careersPage,
        ...(parsed.careersPage || {})
      },
      offeringsSection: {
        ...DEFAULT_SITE_CONFIG.offeringsSection,
        ...(parsed.offeringsSection || {})
      },
      offeringsList: (Array.isArray(parsed.offeringsList) && parsed.offeringsList.length > 0)
        ? parsed.offeringsList
        : DEFAULT_SITE_CONFIG.offeringsList
    };
  } catch (e) {
    console.error('Error loading config:', e);
  }
  return DEFAULT_SITE_CONFIG;
}

/**
 * Hàm tiện ích mở trực tiếp Web Đặt Hàng KiotViet khi nhấn Đặt Hàng / Đặt Món / Thực Đơn
 * @param {string} customUrl - URL tùy chỉnh (hoặc URL của từng chi nhánh)
 */
export function openOrderOnlineWeb(customUrl) {
  if (typeof window === 'undefined') return;
  const cfg = getSiteConfig();
  const targetUrl = customUrl || cfg.orderOnline?.url || 'https://coffee2424.web-store.online';
  const openMode = cfg.orderOnline?.openMode || 'new_tab';
  if (openMode === 'same_tab') {
    window.location.href = targetUrl;
  } else {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
}

export function saveSiteConfig(newConfig) {
  try {
    const brandLogo = newConfig.logo;
    const leftImg = newConfig.sideBanners?.left?.image;
    const rightImg = newConfig.sideBanners?.right?.image;
    const zaloQr = newConfig.zaloOA?.qrImage;
    const glassBgImg = newConfig.glassBackground?.image;

    // 1. Save data URLs into dedicated keys to ensure isolation and quota safety
    if (brandLogo && brandLogo.startsWith('data:image')) {
      try {
        localStorage.setItem('coffee2424_brand_logo_img', brandLogo);
      } catch (logoErr) {
        console.warn('Could not save logo image into dedicated key:', logoErr);
      }
    } else if (brandLogo && !brandLogo.startsWith('__STORED_LOGO__')) {
      try {
        localStorage.setItem('coffee2424_brand_logo_img', brandLogo);
      } catch (_) {}
    }

    if (leftImg && leftImg.startsWith('data:image')) {
      try {
        localStorage.setItem('coffee2424_banner_left_img', leftImg);
      } catch (imgErr) {
        console.warn('Could not save left banner image into dedicated key:', imgErr);
      }
    }
    if (rightImg && rightImg.startsWith('data:image')) {
      try {
        localStorage.setItem('coffee2424_banner_right_img', rightImg);
      } catch (imgErr) {
        console.warn('Could not save right banner image into dedicated key:', imgErr);
      }
    }
    if (zaloQr && zaloQr.startsWith('data:image')) {
      try {
        localStorage.setItem('coffee2424_zalo_qr_img', zaloQr);
      } catch (qrErr) {
        console.warn('Could not save Zalo QR image into dedicated key:', qrErr);
      }
    }
    if (glassBgImg && glassBgImg.startsWith('data:image')) {
      try {
        localStorage.setItem('coffee2424_glass_bg_img', glassBgImg);
      } catch (glassErr) {
        console.warn('Could not save glass background image into dedicated key:', glassErr);
      }
    }

    const heroMedia = newConfig.heroBanner16x9?.mediaUrl;
    if (heroMedia && (heroMedia.startsWith('data:image') || heroMedia.startsWith('data:video'))) {
      try {
        localStorage.setItem('coffee2424_hero_banner_media', heroMedia);
      } catch (heroMediaErr) {
        console.warn('Could not save hero banner media into dedicated key:', heroMediaErr);
      }
    } else {
      try {
        localStorage.removeItem('coffee2424_hero_banner_media');
      } catch (_) {}
    }

    // 2. Try saving full configuration into active STORAGE_KEY
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (quotaErr) {
      console.warn('Storage quota exceeded with embedded images. Saving config with image references:', quotaErr);
      // Strip large data URLs so all toggles, text, and settings are 100% guaranteed to save
      const safeConfig = {
        ...newConfig,
        logo: brandLogo && brandLogo.startsWith('data:image') ? '__STORED_LOGO__' : brandLogo,
        favicon: brandLogo && brandLogo.startsWith('data:image') ? '__STORED_LOGO__' : brandLogo,
        sideBanners: {
          ...newConfig.sideBanners,
          left: {
            ...newConfig.sideBanners?.left,
            image: leftImg && leftImg.startsWith('data:image') ? '__STORED_LEFT__' : leftImg
          },
          right: {
            ...newConfig.sideBanners?.right,
            image: rightImg && rightImg.startsWith('data:image') ? '__STORED_RIGHT__' : rightImg
          }
        },
        zaloOA: {
          ...newConfig.zaloOA,
          qrImage: zaloQr && zaloQr.startsWith('data:image') ? '__STORED_ZALO_QR__' : zaloQr
        },
        glassBackground: {
          ...newConfig.glassBackground,
          image: glassBgImg && glassBgImg.startsWith('data:image') ? '__STORED_GLASS_BG__' : glassBgImg
        },
        heroBanner16x9: {
          ...newConfig.heroBanner16x9,
          mediaUrl: heroMedia && (heroMedia.startsWith('data:image') || heroMedia.startsWith('data:video')) ? '__STORED_HERO_MEDIA__' : heroMedia
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeConfig));
    }

    updateDocumentFavicon(brandLogo || '/images/logo.jpg');
    window.dispatchEvent(new Event('site-config-updated'));

    // Tự động đồng bộ lên Supabase Cloud để dữ liệu không bị mất khi reload
    saveCloudSiteConfig(newConfig).catch(err => {
      console.warn('Không thể đồng bộ Supabase Cloud:', err);
    });

    return true;
  } catch (e) {
    console.error('Error saving config:', e);
    return false;
  }
}

/**
 * Đồng bộ cấu hình từ Supabase Cloud về máy client khi khởi động web
 * @param {boolean} force - Ép buộc kéo về ngay cả khi đang chạy trên localhost
 */
export async function syncSiteConfigWithCloud(force = false) {
  // Trên localhost: Tuyệt đối không tự động kéo từ Supabase Cloud về đè local
  if (isLocalhost && !force) {
    console.info('💻 Chế độ Localhost: Bỏ qua tự động tải từ Supabase Cloud để tối ưu tốc độ & không đè dữ liệu.');
    return null;
  }

  try {
    const cloudConfig = await fetchCloudSiteConfig();
    if (cloudConfig && typeof cloudConfig === 'object') {
      const currentConfig = getSiteConfig();
      const mergedConfig = { 
        ...currentConfig, 
        ...cloudConfig,
        homeSections: (() => {
          const rawSections = (Array.isArray(cloudConfig.homeSections) && cloudConfig.homeSections.length > 0)
            ? cloudConfig.homeSections
            : currentConfig.homeSections;
          const isNewDishesOn = (cloudConfig.newDishesSection?.enabled !== false);
          return rawSections.map(sec => {
            if (sec.id === 'sec-newDishes' || sec.type === 'newDishes') {
              return { ...sec, enabled: isNewDishesOn };
            }
            return sec;
          });
        })(),
        offeringsList: (Array.isArray(cloudConfig.offeringsList) && cloudConfig.offeringsList.length > 0)
          ? cloudConfig.offeringsList
          : currentConfig.offeringsList,
        offeringsSection: {
          ...currentConfig.offeringsSection,
          ...(cloudConfig.offeringsSection || {})
        },
        glassBackground: {
          ...DEFAULT_SITE_CONFIG.glassBackground,
          ...(currentConfig.glassBackground || {}),
          ...(cloudConfig.glassBackground || {})
        },
        newDishesSection: {
          ...DEFAULT_SITE_CONFIG.newDishesSection,
          ...(currentConfig.newDishesSection || {}),
          ...(cloudConfig.newDishesSection || {})
        },
        newDishesList: (() => {
          const list = (Array.isArray(cloudConfig.newDishesList) && cloudConfig.newDishesList.length > 0)
            ? cloudConfig.newDishesList
            : (currentConfig.newDishesList || DEFAULT_SITE_CONFIG.newDishesList);
          if (list.some(d => d.image === '/images/promo_banner.jpg' || d.image === '/images/signature_drinks.jpg' || d.image === '/images/journey_espresso.jpg')) {
            return DEFAULT_SITE_CONFIG.newDishesList;
          }
          return list;
        })(),
        promotionsList: (() => {
          const list = (Array.isArray(cloudConfig.promotionsList) && cloudConfig.promotionsList.length > 0)
            ? cloudConfig.promotionsList
            : (currentConfig.promotionsList || DEFAULT_SITE_CONFIG.promotionsList);
          if (list.some(p => p.image === '/images/promo_banner.jpg' || p.image === '/images/signature_drinks.jpg' || p.image === '/images/journey_espresso.jpg')) {
            return DEFAULT_SITE_CONFIG.promotionsList;
          }
          return list;
        })(),
        careersPage: {
          ...DEFAULT_SITE_CONFIG.careersPage,
          ...(currentConfig.careersPage || {}),
          ...(cloudConfig.careersPage || {})
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedConfig));
      window.dispatchEvent(new Event('site-config-updated'));
      console.info('✓ Đã đồng bộ cấu hình thành công từ Supabase Cloud!');
      return mergedConfig;
    }
  } catch (err) {
    console.warn('Lỗi khi tải cấu hình từ Supabase:', err);
  }
  return null;
}

/**
 * Đẩy toàn bộ cấu hình Local hiện tại lên Supabase Cloud (Thủ công theo lệnh Admin)
 */
export async function pushLocalConfigToCloud() {
  const currentConfig = getSiteConfig();
  return await saveCloudSiteConfig(currentConfig);
}

/**
 * Kéo toàn bộ cấu hình từ Supabase Cloud về ghi đè Local (Thủ công theo lệnh Admin)
 */
export async function pullCloudConfigToLocal() {
  return await syncSiteConfigWithCloud(true);
}

