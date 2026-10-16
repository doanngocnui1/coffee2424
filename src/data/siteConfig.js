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

    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      navMenu: currentNavMenu,
      slogan: updatedSlogan,
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
        }
      };
      localStorage.setItem('coffee2424_site_config', JSON.stringify(safeConfig));
    }

    window.dispatchEvent(new Event('site-config-updated'));
    return true;
  } catch (e) {
    console.error('Error saving config:', e);
    return false;
  }
}
