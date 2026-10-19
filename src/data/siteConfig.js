import { saveCloudSiteConfig, fetchCloudSiteConfig } from '../lib/supabase';

export const DEFAULT_SITE_CONFIG = {
  brandName: 'COFFEE 24/24',
  slogan: 'Enjoy Your Life',
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
  // 1. Ảnh Bìa / GIF / Video Hero 16:9 & Thiết Kế Trực Quan (Canvas Studio)
  heroBanner16x9: {
    type: 'auto', // 'auto' | 'image' | 'gif' | 'video'
    mediaUrl: '/images/hero_banner.jpg',
    link: '/dathang',
    alt: 'COFFEE 24/24 - Không Gian Cà Phê 24/7',
    fixedBackground: false,
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
      title: 'Matcha MK4 Latte & Cold Brew Cam Vàng',
      price: '45.000đ',
      image: '/images/promo_banner.jpg',
      cta: 'Thử Món Mới',
      link: '/dathang'
    },
    {
      id: 'dish-2',
      tag: 'SIGNATURE',
      title: 'Cà Phê Muối Kem Béo & Bạc Xỉu 3 Tầng',
      price: '39.000đ',
      image: '/images/signature_drinks.jpg',
      cta: 'Đặt Món Ngay',
      link: '/dathang'
    },
    {
      id: 'dish-3',
      tag: 'BÁNH TƯƠI',
      title: 'Croissant Bơ Pháp Nướng & Bánh Mì Que',
      price: '29.000đ',
      image: '/images/journey_espresso.jpg',
      cta: 'Thưởng Thức',
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
      tag: 'COMBO HOT',
      title: 'Combo Sáng & Đêm Khuya 69K',
      discount: 'CHỈ 69.000đ',
      image: '/images/signature_drinks.jpg',
      cta: 'Đặt Combo 69K',
      link: '/dathang'
    },
    {
      id: 'promo-2',
      tag: 'GIỜ VÀNG',
      title: 'Happy Hour 16:00 - 19:00 Mỗi Ngày',
      discount: 'GIẢM 40%',
      image: '/images/journey_espresso.jpg',
      cta: 'Lấy Mã Giảm',
      link: '/khuyenmai'
    },
    {
      id: 'promo-3',
      tag: 'HỌC NHÓM',
      title: 'Đi 4 Tính Tiền 3 - Cày Deadline Thâu Đêm',
      discount: 'MUA 3 TẶNG 1',
      image: '/images/promo_banner.jpg',
      cta: 'Xem Chi Tiết',
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
      title: 'Matcha MK4 Latte & Cold Brew Cam Vàng',
      discount: 'GIẢM 20%',
      image: '/images/promo_banner.jpg',
      cta: 'Thử Món Mới',
      link: '/dathang'
    },
    {
      id: 'poster-2',
      tag: 'COMBO HOT',
      title: 'Combo Sáng & Đêm Khuya 69K',
      discount: 'CHỈ 69.000đ',
      image: '/images/signature_drinks.jpg',
      cta: 'Đặt Combo 69K',
      link: '/dathang'
    },
    {
      id: 'poster-3',
      tag: 'GIỜ VÀNG',
      title: 'Happy Hour 16:00 - 19:00 Mỗi Ngày',
      discount: 'GIẢM 40%',
      image: '/images/journey_espresso.jpg',
      cta: 'Lấy Mã Giảm',
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

export function getSiteConfig() {
  try {
    const saved = localStorage.getItem('coffee2424_site_config');
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

    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      navMenu: currentNavMenu,
      slogan: updatedSlogan,
      socialMedia: socialConfig,
      zaloOA: zaloConfig,
      heroSection: heroConfig,
      heroBanner16x9: heroBannerConfig,
      glassBackground: glassBgConfig,
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
      }
    };
  } catch (e) {
    console.error('Error loading config:', e);
  }
  return DEFAULT_SITE_CONFIG;
}

export function saveSiteConfig(newConfig) {
  try {
    const leftImg = newConfig.sideBanners?.left?.image;
    const rightImg = newConfig.sideBanners?.right?.image;
    const zaloQr = newConfig.zaloOA?.qrImage;
    const glassBgImg = newConfig.glassBackground?.image;

    // 1. Save data URLs into dedicated keys to ensure isolation and quota safety
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

    // 2. Try saving full configuration
    try {
      localStorage.setItem('coffee2424_site_config', JSON.stringify(newConfig));
    } catch (quotaErr) {
      console.warn('Storage quota exceeded with embedded images. Saving config with image references:', quotaErr);
      // Strip large data URLs so all toggles, text, and settings are 100% guaranteed to save
      const safeConfig = {
        ...newConfig,
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
      localStorage.setItem('coffee2424_site_config', JSON.stringify(safeConfig));
    }

    window.dispatchEvent(new Event('site-config-updated'));

    // Đồng bộ tức thời lên Supabase Cloud (chạy nền, không chặn giao diện)
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
 */
export async function syncSiteConfigWithCloud() {
  try {
    const cloudConfig = await fetchCloudSiteConfig();
    if (cloudConfig && typeof cloudConfig === 'object') {
      const currentConfig = getSiteConfig();
      const mergedConfig = { ...currentConfig, ...cloudConfig };
      localStorage.setItem('coffee2424_site_config', JSON.stringify(mergedConfig));
      window.dispatchEvent(new Event('site-config-updated'));
      console.info('✓ Đã đồng bộ cấu hình thành công từ Supabase Cloud!');
      return mergedConfig;
    }
  } catch (err) {
    console.warn('Lỗi khi tải cấu hình từ Supabase:', err);
  }
  return null;
}

