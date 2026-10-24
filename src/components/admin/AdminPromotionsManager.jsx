import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  Flame, 
  Plus, 
  Trash2, 
  Upload, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Save, 
  RotateCcw, 
  Eye, 
  Smartphone, 
  Monitor, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sliders,
  Layout,
  Globe,
  Tag,
  Navigation,
  Ticket,
  Check,
  Sparkles,
  CheckCircle2,
  ListOrdered,
  PhoneCall,
  Coffee,
  Utensils,
  Zap,
  Truck,
  ShieldCheck,
  HelpCircle,
  Layers,
  Edit3,
  ExternalLink,
  Search,
  Clock,
  Info,
  Loader2
} from 'lucide-react';
import { DEFAULT_SITE_CONFIG, saveSiteConfig } from '../../data/siteConfig';
import { uploadImageToSupabase, saveCloudSiteConfig } from '../../lib/supabase';

export default function AdminPromotionsManager({ config, onSaveConfig, triggerAlert }) {
  const defaultPromotions = DEFAULT_SITE_CONFIG.promotionsList || [];
  const defaultSectionConfig = DEFAULT_SITE_CONFIG.promotionsSection || {
    enabled: true,
    badge: 'ƯU ĐÃI ĐẶC QUYỀN',
    showBadge: true,
    title: 'Chương Trình Ưu Đãi',
    highlightTitle: 'Dành Riêng Cho Bạn',
    subtitle: 'Tổng hợp các voucher giảm giá, combo tiết kiệm và giờ vàng ưu đãi dành cho học sinh, sinh viên và cộng đồng chạy deadline.'
  };

  const defaultPageConfig = DEFAULT_SITE_CONFIG.promotionsPageConfig || {
    hero: {
      enabled: true,
      featuredPromoId: '',
      customImage: '',
      badge: 'Đặc Quyền Tiếp Sức 24/24',
      title: 'Kho Voucher & Ưu Đãi',
      highlightTitle: 'Dành Riêng Cho Bạn',
      description: 'Giảm tới 40% Giờ Vàng, combo Cú Đêm 69K, món nóng cứu đói và mã freeship xuyên đêm. Thưởng thức trọn vẹn menu cà phê rang mộc nguyên chất 24/7 không lo về giá!',
      ctaText: 'ĐẶT MÓN & ÁP MÃ NGAY',
      ctaLink: '/dathang',
      secondaryText: 'Xem Danh Sách Voucher',
      stats: [
        { id: 'stat-1', number: '6+ Deals', label: 'Cập nhật mỗi ngày' },
        { id: 'stat-2', number: 'Tới 40%', label: 'Chiết khấu trực tiếp' },
        { id: 'stat-3', number: '24/24 H', label: 'Phục vụ xuyên đêm' },
        { id: 'stat-4', number: '25 Phút', label: 'Giao hỏa tốc đêm' }
      ]
    },
    guideSteps: {
      enabled: true,
      badge: 'CÁCH THỨC ÁP DỤNG',
      title: '3 Bước Sử Dụng Voucher Cực Dễ Dàng',
      description: 'Chỉ với vài thao tác đơn giản, bạn sẽ nhận ngay ưu đãi giảm giá tốt nhất khi đặt món trực tuyến hoặc thưởng thức tại quán.',
      steps: [
        {
          id: 'step-1',
          step: '01',
          title: 'Lưu Mã Ưu Đãi',
          desc: 'Chọn voucher phù hợp với nhu cầu và nhấn nút "Chép mã" hoặc "Dùng ngay" để hệ thống tự động lưu mã vào bộ nhớ.',
          color: '#2b170e'
        },
        {
          id: 'step-2',
          step: '02',
          title: 'Chọn Thức Uống & Món Ăn',
          desc: 'Khám phá thực đơn Cà Phê Rang Mộc, Cold Brew Cam Vàng, Bánh Nướng Giòn hoặc Mì Xào Bếp Đêm rồi thêm vào giỏ hàng.',
          color: '#8c5932'
        },
        {
          id: 'step-3',
          step: '03',
          title: 'Áp Mã & Thưởng Thức',
          desc: 'Tại bước xác nhận đơn, dán mã đã sao chép để được giảm giá trực tiếp vào hóa đơn và nhận đồ uống trong 15-25 phút!',
          color: '#047857'
        }
      ]
    },
    commitments: {
      enabled: true,
      badge: 'Chuẩn Mực Phục Vụ 24/7',
      title: 'Không Chỉ Là Cà Phê,',
      highlightTitle: 'Đó Là Trạm Năng Lượng 24/24',
      description: 'Cho dù bạn cần một không gian yên tĩnh cày deadline lúc 2 giờ sáng, tụ họp học nhóm hay một ly cà phê mộc đậm đà khởi đầu ngày mới — COFFEE 24/24 luôn sẵn sàng chào đón bạn.',
      primaryBtnText: 'Đặt Món Ngay Bây Giờ',
      primaryBtnLink: '/dathang',
      secondaryBtnText: 'Xem Không Gian Quán',
      secondaryBtnLink: '/gioithieu',
      items: [
        { id: 'com-1', title: 'Rang Mộc Nguyên Chất', desc: '100% hạt Robusta & Arabica chọn lọc từ nông trại Đắk Lắk & Cầu Đất, rang mộc chuẩn vị không phụ gia.' },
        { id: 'com-2', title: 'Bếp Nóng 24/24', desc: 'Mì xào bò bốc khói, trứng ốp la, bánh nướng giòn rụm phục vụ cả ngày lẫn đêm không tính phụ thu giờ khuya.' },
        { id: 'com-3', title: 'Wifi 500Mbps & Ổ Sạc', desc: 'Đường truyền internet cáp quang tốc độ cao, ổ cắm điện cắm sạc laptop và điện thoại tại từng vị trí ngồi.' },
        { id: 'com-4', title: 'Giao Hỏa Tốc 25 Phút', desc: 'Đội ngũ giao nhận hỏa tốc chuyên nghiệp khắp khu vực Phú Nhuận, Gò Vấp và Bình Thạnh trong đêm.' }
      ]
    },
    hotline: {
      enabled: true,
      title: 'Bạn Có Câu Hỏi Về Mã Ưu Đãi Hoặc Cần Đặt Bàn Nhóm?',
      desc: 'Liên hệ hotline chăm sóc khách hàng 24/7: 0906 916 816 hoặc ghé trực tiếp chi nhánh gần nhất.',
      phone: '0906 916 816',
      phoneLink: 'tel:0906916816',
      ctaText: 'TỚI QUÁN TRẢI NGHIỆM NGAY >',
      ctaLink: '/cuahang'
    }
  };

  // State đồng bộ Cloud
  const [isSaving, setIsSaving] = useState(false);

  // Sub-tabs điều hướng trong trang Quản Lý Khuyến Mãi
  const [activeSubTab, setActiveSubTab] = useState('vouchers'); // 'vouchers' | 'guideSteps' | 'heroBanner' | 'commitments' | 'homeSection'

  // State Quản lý Danh sách Voucher
  const [promotions, setPromotions] = useState(() => {
    if (config?.promotionsList && Array.isArray(config.promotionsList) && config.promotionsList.length > 0) {
      return config.promotionsList;
    }
    return defaultPromotions;
  });

  // State Cấu hình Khối Trang Chủ
  const [sectionConfig, setSectionConfig] = useState(() => {
    return {
      enabled: config?.promotionsSection?.enabled !== false,
      badge: config?.promotionsSection?.badge || defaultSectionConfig.badge,
      showBadge: config?.promotionsSection?.showBadge !== false,
      title: config?.promotionsSection?.title || defaultSectionConfig.title,
      highlightTitle: config?.promotionsSection?.highlightTitle || defaultSectionConfig.highlightTitle,
      subtitle: config?.promotionsSection?.subtitle || defaultSectionConfig.subtitle
    };
  });

  // State Cấu hình Toàn Trang Khuyến Mãi (/khuyenmai)
  const [pageConfig, setPageConfig] = useState(() => {
    const userConf = config?.promotionsPageConfig || {};
    return {
      hero: {
        ...defaultPageConfig.hero,
        ...(userConf.hero || {})
      },
      guideSteps: {
        ...defaultPageConfig.guideSteps,
        ...(userConf.guideSteps || {}),
        steps: (Array.isArray(userConf.guideSteps?.steps) && userConf.guideSteps.steps.length > 0)
          ? userConf.guideSteps.steps
          : defaultPageConfig.guideSteps.steps
      },
      commitments: {
        ...defaultPageConfig.commitments,
        ...(userConf.commitments || {}),
        items: (Array.isArray(userConf.commitments?.items) && userConf.commitments.items.length > 0)
          ? userConf.commitments.items
          : defaultPageConfig.commitments.items
      },
      hotline: {
        ...defaultPageConfig.hotline,
        ...(userConf.hotline || {})
      }
    };
  });

  // State Menu Header Điều Hướng
  const [headerMenuVisible, setHeaderMenuVisible] = useState(() => {
    const promoItem = (config?.navMenu || DEFAULT_SITE_CONFIG.navMenu || []).find(item => item.id === 'promo');
    return promoItem ? promoItem.visible !== false : true;
  });
  const [headerMenuLabel, setHeaderMenuLabel] = useState(() => {
    const promoItem = (config?.navMenu || DEFAULT_SITE_CONFIG.navMenu || []).find(item => item.id === 'promo');
    return promoItem?.label || 'Khuyến Mãi';
  });

  // Filter & Search trong tab Vouchers
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedPromoId, setExpandedPromoId] = useState(null);

  // Sync khi config từ cha thay đổi
  useEffect(() => {
    if (config?.promotionsList && Array.isArray(config.promotionsList) && config.promotionsList.length > 0) {
      setPromotions(config.promotionsList);
    }
    if (config?.promotionsSection) {
      setSectionConfig({
        enabled: config.promotionsSection.enabled !== false,
        badge: config.promotionsSection.badge || defaultSectionConfig.badge,
        showBadge: config.promotionsSection.showBadge !== false,
        title: config.promotionsSection.title || defaultSectionConfig.title,
        highlightTitle: config.promotionsSection.highlightTitle || defaultSectionConfig.highlightTitle,
        subtitle: config.promotionsSection.subtitle || defaultSectionConfig.subtitle
      });
    }
    if (config?.promotionsPageConfig) {
      const userConf = config.promotionsPageConfig;
      setPageConfig({
        hero: {
          ...defaultPageConfig.hero,
          ...(userConf.hero || {})
        },
        guideSteps: {
          ...defaultPageConfig.guideSteps,
          ...(userConf.guideSteps || {}),
          steps: (Array.isArray(userConf.guideSteps?.steps) && userConf.guideSteps.steps.length > 0)
            ? userConf.guideSteps.steps
            : defaultPageConfig.guideSteps.steps
        },
        commitments: {
          ...defaultPageConfig.commitments,
          ...(userConf.commitments || {}),
          items: (Array.isArray(userConf.commitments?.items) && userConf.commitments.items.length > 0)
            ? userConf.commitments.items
            : defaultPageConfig.commitments.items
        },
        hotline: {
          ...defaultPageConfig.hotline,
          ...(userConf.hotline || {})
        }
      });
    }
    if (config?.navMenu) {
      const promoItem = config.navMenu.find(item => item.id === 'promo');
      if (promoItem) {
        setHeaderMenuVisible(promoItem.visible !== false);
        setHeaderMenuLabel(promoItem.label || 'Khuyến Mãi');
      }
    }
  }, [config]);

  // ==================== CÁC HÀM XỬ LÝ VOUCHER ====================
  const handleAddPromotion = () => {
    const newId = `promo-${Date.now()}`;
    const newPromo = {
      id: newId,
      tag: 'ƯU ĐÃI MỚI',
      badge: 'HOT DEAL 🔥',
      title: 'Chương Trình Ưu Đãi Mới COFFEE 24/24',
      subtitle: 'Khung giờ vàng & combo tiết kiệm',
      discount: 'GIẢM 25%',
      discountValue: 'Tiết kiệm 25%',
      code: 'PROMO24',
      validUntil: 'Cả ngày & đêm 24/24',
      category: 'drinks',
      usedPercent: 80,
      remainingCount: 30,
      showVoucherCode: true,
      showCopyBtn: true,
      showCtaBtn: true,
      image: DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image || 'https://ilyxybkcndjcnzrtjjiq.supabase.co/storage/v1/object/public/coffee2424-media/promos/1792406318618_erer5hh.png',
      description: 'Nạp năng lượng và thưởng thức trọn vẹn menu cà phê rang mộc nguyên chất, thức uống pha tươi và món nóng cứu đói 24/7.',
      condition: 'Áp dụng trên toàn hệ thống 2 chi nhánh 413PHI & 96D5 hoặc đặt món online.',
      cta: 'Nhận Ưu Đãi',
      link: '/khuyenmai'
    };
    setPromotions(prev => [newPromo, ...prev]);
    setExpandedPromoId(newId);
    triggerAlert?.('✓ Đã thêm 1 thẻ ưu đãi mới vào đầu danh sách! Hãy chỉnh sửa và nhấn Lưu.');
  };

  const handleDeletePromotion = (index) => {
    if (promotions.length <= 1) {
      alert('Cần giữ lại ít nhất 1 chương trình ưu đãi để hiển thị trên website!');
      return;
    }
    const itemTitle = promotions[index]?.title || `Ưu đãi #${index + 1}`;
    if (window.confirm(`Bạn có chắc muốn xóa "${itemTitle}" khỏi danh sách ưu đãi?`)) {
      const updated = promotions.filter((_, i) => i !== index);
      setPromotions(updated);
      triggerAlert?.(`Đã xóa ưu đãi "${itemTitle}". Nhớ nhấn nút Lưu để áp dụng.`);
    }
  };

  const handleDuplicatePromotion = (index) => {
    const target = promotions[index];
    if (!target) return;
    const duplicated = {
      ...target,
      id: `promo-${Date.now()}`,
      title: `${target.title} (Bản sao)`
    };
    const updated = [...promotions];
    updated.splice(index + 1, 0, duplicated);
    setPromotions(updated);
    setExpandedPromoId(duplicated.id);
    triggerAlert?.('✓ Đã nhân bản thẻ ưu đãi!');
  };

  const handleMovePromotion = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= promotions.length) return;
    const updated = [...promotions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPromotions(updated);
  };

  const handleUpdatePromotionField = (index, field, value) => {
    setPromotions(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  // Bật / tắt tức thì 3 nút trên thẻ ưu đãi và TỰ ĐỘNG LƯU NGAY LẬP TỨC (không để mất khi reload trang)
  const handleTogglePromotionField = (index, field) => {
    const target = promotions[index];
    if (!target) return;
    const currentVal = target[field];
    const newVal = currentVal === false; // Nếu đang false thì chuyển true; nếu true/undefined thì chuyển false

    const updatedPromotions = promotions.map((p, i) => {
      if (i === index) {
        return {
          ...p,
          [field]: newVal
        };
      }
      return p;
    });

    setPromotions(updatedPromotions);

    const currentNavMenu = Array.isArray(config?.navMenu) && config.navMenu.length > 0 
      ? config.navMenu 
      : DEFAULT_SITE_CONFIG.navMenu;
    const updatedNavMenu = currentNavMenu.map(item => {
      if (item.id === 'promo') {
        return {
          ...item,
          visible: headerMenuVisible,
          label: headerMenuLabel.trim() || 'Khuyến Mãi'
        };
      }
      return item;
    });

    const updatedConfig = {
      ...config,
      navMenu: updatedNavMenu,
      promotionsSection: sectionConfig,
      promotionsList: updatedPromotions,
      promotionsPageConfig: pageConfig
    };

    // Tự động lưu tức thì vào LocalStorage & phát sự kiện để toàn trang áp dụng ngay và không bị mất khi reload
    onSaveConfig?.(updatedConfig);
    saveSiteConfig(updatedConfig);
    window.dispatchEvent(new Event('site-config-updated'));

    const fieldLabel = field === 'showVoucherCode' 
      ? 'Mã Voucher' 
      : (field === 'showCopyBtn' ? 'Nút Chép mã' : 'Nút Dùng ngay');
    triggerAlert?.(`✓ Đã ${newVal ? 'BẬT' : 'ẨN'} "${fieldLabel}" và tự động lưu áp dụng ngay!`);
  };

  const handleUploadPromotionImage = async (index, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP, GIF...).');
      return;
    }

    triggerAlert?.('⏳ Đang tải ảnh ưu đãi lên Supabase Storage...');

    try {
      const cloudUrl = await uploadImageToSupabase(file, 'promos');
      if (cloudUrl) {
        handleUpdatePromotionField(index, 'image', cloudUrl);
        triggerAlert?.(`✓ Đã tải ảnh ưu đãi lên Supabase Storage thành công! Bấm "LƯU CẤU HÌNH" để áp dụng.`);
        return;
      }
    } catch (err) {
      console.warn('Lỗi tải ảnh lên Supabase:', err);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const maxW = 600;
        const maxH = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.86);
        handleUpdatePromotionField(index, 'image', compressed);
        triggerAlert?.(`✓ Đã nén và lưu ảnh dự phòng cho ưu đãi!`);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // ==================== XỬ LÝ KHỐI 3 BƯỚC SỬ DỤNG VOUCHER ====================
  const handleUpdateGuideField = (field, value) => {
    setPageConfig(prev => ({
      ...prev,
      guideSteps: {
        ...prev.guideSteps,
        [field]: value
      }
    }));
  };

  const handleUpdateStepItem = (stepIndex, field, value) => {
    setPageConfig(prev => {
      const updatedSteps = [...(prev.guideSteps.steps || [])];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        [field]: value
      };
      return {
        ...prev,
        guideSteps: {
          ...prev.guideSteps,
          steps: updatedSteps
        }
      };
    });
  };

  const handleAddStepItem = () => {
    const currentSteps = pageConfig.guideSteps?.steps || [];
    const nextNum = currentSteps.length + 1;
    const padNum = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    const newStep = {
      id: `step-${Date.now()}`,
      step: padNum,
      title: `Bước ${nextNum} Hướng Dẫn`,
      desc: 'Nhập nội dung hướng dẫn chi tiết cho bước này để khách hàng dễ dàng làm theo.',
      color: '#8c5932'
    };
    setPageConfig(prev => ({
      ...prev,
      guideSteps: {
        ...prev.guideSteps,
        steps: [...(prev.guideSteps.steps || []), newStep]
      }
    }));
    triggerAlert?.('✓ Đã thêm 1 bước hướng dẫn mới!');
  };

  const handleDeleteStepItem = (stepIndex) => {
    const currentSteps = pageConfig.guideSteps?.steps || [];
    if (currentSteps.length <= 1) {
      alert('Cần giữ lại ít nhất 1 bước hướng dẫn!');
      return;
    }
    const updated = currentSteps.filter((_, i) => i !== stepIndex);
    setPageConfig(prev => ({
      ...prev,
      guideSteps: {
        ...prev.guideSteps,
        steps: updated
      }
    }));
  };

  // ==================== XỬ LÝ KHỐI HERO BANNER ====================
  const [isUploadingHeroPoster, setIsUploadingHeroPoster] = useState(false);

  const handleUpdateHeroField = (field, value) => {
    setPageConfig(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
  };

  const handleUpdateHeroStat = (index, field, value) => {
    setPageConfig(prev => {
      const stats = [...(prev.hero?.stats || defaultPageConfig.hero.stats)];
      stats[index] = {
        ...stats[index],
        [field]: value
      };
      return {
        ...prev,
        hero: {
          ...prev.hero,
          stats
        }
      };
    });
  };

  const handleUploadHeroCustomImage = async (file) => {
    if (!file) return;
    setIsUploadingHeroPoster(true);
    try {
      const uploadedUrl = await uploadImageToSupabase(file, 'promos');
      if (uploadedUrl) {
        handleUpdateHeroField('customImage', uploadedUrl);
        setIsUploadingHeroPoster(false);
        triggerAlert?.('✓ Đã tải áp phích Hero lên Supabase Storage thành công!');
        return;
      }
    } catch (err) {
      console.warn('Lỗi upload hero poster:', err);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 600, 800);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        handleUpdateHeroField('customImage', dataUrl);
        setIsUploadingHeroPoster(false);
        triggerAlert?.('✓ Đã lưu áp phích Hero dự phòng!');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ==================== XỬ LÝ KHỐI CAM KẾT & HOTLINE ====================
  const handleUpdateCommitmentField = (field, value) => {
    setPageConfig(prev => ({
      ...prev,
      commitments: {
        ...prev.commitments,
        [field]: value
      }
    }));
  };

  const handleUpdateCommitmentItem = (index, field, value) => {
    setPageConfig(prev => {
      const items = [...(prev.commitments?.items || defaultPageConfig.commitments.items)];
      items[index] = {
        ...items[index],
        [field]: value
      };
      return {
        ...prev,
        commitments: {
          ...prev.commitments,
          items
        }
      };
    });
  };

  const handleUpdateHotlineField = (field, value) => {
    setPageConfig(prev => ({
      ...prev,
      hotline: {
        ...prev.hotline,
        [field]: value
      }
    }));
  };

  // ==================== LƯU TOÀN BỘ CẤU HÌNH ====================
  const handleSaveAll = async () => {
    setIsSaving(true);
    const currentNavMenu = Array.isArray(config?.navMenu) && config.navMenu.length > 0 
      ? config.navMenu 
      : DEFAULT_SITE_CONFIG.navMenu;
    const updatedNavMenu = currentNavMenu.map(item => {
      if (item.id === 'promo') {
        return {
          ...item,
          visible: headerMenuVisible,
          label: headerMenuLabel.trim() || 'Khuyến Mãi'
        };
      }
      return item;
    });

    const currentHomeSections = Array.isArray(config?.homeSections) && config.homeSections.length > 0 
      ? config.homeSections 
      : (DEFAULT_SITE_CONFIG.homeSections || []);
    const updatedHomeSections = currentHomeSections.map(sec => {
      if (sec.type === 'promotions' || sec.id === 'sec-promotions') {
        return {
          ...sec,
          enabled: sectionConfig.enabled
        };
      }
      return sec;
    });

    const updatedConfig = {
      ...config,
      navMenu: updatedNavMenu,
      homeSections: updatedHomeSections,
      promotionsSection: sectionConfig,
      promotionsList: promotions,
      promotionsPageConfig: pageConfig
    };
    onSaveConfig?.(updatedConfig);
    saveSiteConfig(updatedConfig);
    window.dispatchEvent(new Event('site-config-updated'));

    // Đồng bộ Supabase Cloud
    try {
      const cloudRes = await saveCloudSiteConfig(updatedConfig);
      setIsSaving(false);
      if (cloudRes && cloudRes.success) {
        triggerAlert?.('✓ ĐÃ ĐỒNG BỘ SUPABASE CLOUD THÀNH CÔNG! Điện thoại và máy tính khác đã cập nhật ngay.');
      } else {
        triggerAlert?.('✓ Đã lưu cấu hình Khuyến Mãi thành công (Đã cập nhật trên máy này)!');
      }
    } catch (_) {
      setIsSaving(false);
      triggerAlert?.('✓ Đã lưu toàn bộ cấu hình Khuyến Mãi thành công!');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục toàn bộ Khuyến Mãi về mặc định ban đầu? Các thay đổi tùy chỉnh sẽ bị đặt lại.')) {
      setPromotions(defaultPromotions);
      setSectionConfig(defaultSectionConfig);
      setPageConfig(defaultPageConfig);
      const updatedConfig = {
        ...config,
        promotionsSection: defaultSectionConfig,
        promotionsList: defaultPromotions,
        promotionsPageConfig: defaultPageConfig
      };
      onSaveConfig?.(updatedConfig);
      triggerAlert?.('Đã đặt lại cấu hình Khuyến Mãi về mặc định!');
    }
  };

  // Lọc voucher tìm kiếm
  const filteredPromotions = promotions.filter(p => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchQuery = !query || 
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.code && p.code.toLowerCase().includes(query)) ||
      (p.discount && p.discount.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6 text-[#2b170e]">
      
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="p-6 sm:p-7 rounded-3xl bg-neutral-900 border border-neutral-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Ticket className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Quản Lý Trang Khuyến Mãi & Voucher
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
              {promotions.length} Voucher
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Thiết kế lại toàn diện: Quản lý danh sách voucher, thẻ ưu đãi, khối hướng dẫn 3 bước, hero banner và đồng bộ ra trang chủ.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="/khuyenmai"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>Xem Trang /khuyenmai</span>
          </a>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold border border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Khôi phục mặc định"
          >
            <RotateCcw className="w-4 h-4 text-neutral-400" />
            <span>Mặc Định</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ĐANG ĐỒNG BỘ CLOUD...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[3]" />
                <span>LƯU CẤU HÌNH</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. SUB-TABS NAVIGATION (CỰC KỲ KHOA HỌC & ĐẦY ĐỦ) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('vouchers')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'vouchers'
              ? 'bg-[#2b170e] text-white border-[#2b170e] shadow-md'
              : 'bg-white/80 hover:bg-white text-[#5c3d2e] border-white/90 shadow-2xs'
          }`}
        >
          <Ticket className="w-4 h-4 text-amber-400" />
          <span>Danh Sách Voucher</span>
          <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-black ${
            activeSubTab === 'vouchers' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-[#2b170e]'
          }`}>
            {promotions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('guideSteps')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'guideSteps'
              ? 'bg-[#2b170e] text-white border-[#2b170e] shadow-md'
              : 'bg-white/80 hover:bg-white text-[#5c3d2e] border-white/90 shadow-2xs'
          }`}
        >
          <ListOrdered className="w-4 h-4 text-emerald-500" />
          <span>3 Bước Dùng Voucher</span>
          <span className={`w-2 h-2 rounded-full ${pageConfig.guideSteps?.enabled !== false ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-400'}`} />
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('heroBanner')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'heroBanner'
              ? 'bg-[#2b170e] text-white border-[#2b170e] shadow-md'
              : 'bg-white/80 hover:bg-white text-[#5c3d2e] border-white/90 shadow-2xs'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Hero Banner Đầu Trang</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('commitments')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'commitments'
              ? 'bg-[#2b170e] text-white border-[#2b170e] shadow-md'
              : 'bg-white/80 hover:bg-white text-[#5c3d2e] border-white/90 shadow-2xs'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Cam Kết 24/24 & Hotline (2 Khối Cuối)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('homeSection')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'homeSection'
              ? 'bg-[#2b170e] text-white border-[#2b170e] shadow-md'
              : 'bg-white/80 hover:bg-white text-[#5c3d2e] border-white/90 shadow-2xs'
          }`}
        >
          <Globe className="w-4 h-4 text-purple-500" />
          <span>Trang Chủ & Menu Header</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: DANH SÁCH VOUCHER & ƯU ĐÃI                              */}
      {/* ============================================================== */}
      {activeSubTab === 'vouchers' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8c5932] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm voucher theo tên, mã..."
                  className="pl-9 pr-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs text-[#2b170e] font-medium placeholder:text-[#a0826f] focus:outline-none focus:border-[#8c5932] w-56 sm:w-64"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
              >
                <option value="all">Tất Cả Danh Mục ({promotions.length})</option>
                <option value="drinks">Đồ Uống (Giờ Vàng)</option>
                <option value="night">Cú Đêm 24/24</option>
                <option value="combo">Combo Ăn Uống</option>
                <option value="student">Học Nhóm & Sinh Viên</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddPromotion}
              className="px-5 py-2.5 rounded-2xl bg-[#2b170e] hover:bg-[#3d2215] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Thêm Thẻ Ưu Đãi Mới</span>
            </button>
          </div>

          {/* Promotion Cards List */}
          <div className="space-y-5">
            {filteredPromotions.map((promo, idx) => {
              const realIndex = promotions.findIndex(p => p.id === promo.id);
              const isExpanded = expandedPromoId === promo.id;

              return (
                <div 
                  key={promo.id || realIndex}
                  className="rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(60,35,15,0.05)] overflow-hidden transition-all hover:border-[#dfd4c7]"
                >
                  {/* Card Header Summary */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f0e8df]">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Thumbnail Preview 3:4 */}
                      <div className="w-14 h-18 rounded-xl overflow-hidden bg-stone-900 border border-[#dfd4c7] shrink-0 relative shadow-2xs">
                        <img
                          src={promo.image || DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image}
                          alt={promo.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image; }}
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase text-[#8c5932] bg-[#fbf8f5] px-2 py-0.5 rounded-md border border-[#dfd4c7]">
                            {promo.tag || 'ƯU ĐÃI'}
                          </span>
                          <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-md">
                            {promo.discount || 'GIẢM GIÁ'}
                          </span>
                          <span className="text-xs font-mono font-black text-[#2b170e] bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
                            Mã: {promo.code || 'PROMO24'}
                          </span>
                        </div>
                        <h4 className="font-black text-sm sm:text-base text-[#2b170e] truncate">
                          {promo.title}
                        </h4>
                        <p className="text-xs text-[#7a5843] truncate">
                          {promo.subtitle || 'Khung giờ vàng & ưu đãi'} • {promo.validUntil || '24/24'}
                        </p>
                      </div>
                    </div>

                    {/* Quick Toggles & Move Actions */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-auto shrink-0">
                      {/* 3 Quick Toggles Required by User */}
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#5c3d2e]">
                        <button
                          type="button"
                          onClick={() => handleTogglePromotionField(realIndex, 'showVoucherCode')}
                          className={`px-2.5 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
                            promo.showVoucherCode !== false 
                              ? 'bg-amber-500 text-neutral-950 font-black shadow-2xs' 
                              : 'bg-neutral-100 text-neutral-400 hover:text-neutral-600 line-through'
                          }`}
                          title="Bật/Tắt hiển thị Mã Voucher (Tự động lưu ngay)"
                        >
                          Mã {promo.showVoucherCode !== false ? '✓' : '✕'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePromotionField(realIndex, 'showCopyBtn')}
                          className={`px-2.5 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
                            promo.showCopyBtn !== false 
                              ? 'bg-amber-500 text-neutral-950 font-black shadow-2xs' 
                              : 'bg-neutral-100 text-neutral-400 hover:text-neutral-600 line-through'
                          }`}
                          title="Bật/Tắt Nút Chép Mã (Tự động lưu ngay)"
                        >
                          Chép {promo.showCopyBtn !== false ? '✓' : '✕'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePromotionField(realIndex, 'showCtaBtn')}
                          className={`px-2.5 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
                            promo.showCtaBtn !== false 
                              ? 'bg-amber-500 text-neutral-950 font-black shadow-2xs' 
                              : 'bg-neutral-100 text-neutral-400 hover:text-neutral-600 line-through'
                          }`}
                          title="Bật/Tắt Nút Dùng Ngay (Tự động lưu ngay)"
                        >
                          Dùng Ngay {promo.showCtaBtn !== false ? '✓' : '✕'}
                        </button>
                      </div>

                      {/* Move Up/Down */}
                      <button
                        type="button"
                        onClick={() => handleMovePromotion(realIndex, 'up')}
                        disabled={realIndex === 0}
                        className="p-2 rounded-xl bg-white hover:bg-neutral-100 disabled:opacity-30 border border-[#dfd4c7] transition-all cursor-pointer shadow-2xs"
                        title="Đẩy lên trên"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-[#2b170e]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMovePromotion(realIndex, 'down')}
                        disabled={realIndex === promotions.length - 1}
                        className="p-2 rounded-xl bg-white hover:bg-neutral-100 disabled:opacity-30 border border-[#dfd4c7] transition-all cursor-pointer shadow-2xs"
                        title="Đẩy xuống dưới"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-[#2b170e]" />
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={() => handleDuplicatePromotion(realIndex)}
                        className="p-2 rounded-xl bg-white hover:bg-neutral-100 border border-[#dfd4c7] text-[#2b170e] transition-all cursor-pointer shadow-2xs"
                        title="Nhân bản thẻ này"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#8c5932]" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeletePromotion(realIndex)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-all cursor-pointer shadow-2xs"
                        title="Xóa ưu đãi này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Expand/Collapse Edit */}
                      <button
                        type="button"
                        onClick={() => setExpandedPromoId(isExpanded ? null : promo.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          isExpanded 
                            ? 'bg-[#2b170e] text-white border-[#2b170e]' 
                            : 'bg-white hover:bg-neutral-100 text-[#2b170e] border-[#dfd4c7]'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Thu Gọn' : 'Chỉnh Sửa'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Edit Form */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 bg-[#fbf8f5] space-y-5 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        
                        {/* Left: Poster 3:4 & Upload */}
                        <div className="md:col-span-4 space-y-3">
                          <label className="text-xs font-black uppercase text-[#7a5843] block">
                            Ảnh Áp Phích Khuyến Mãi (Tỷ Lệ 3:4 Chuẩn)
                          </label>
                          <div className="relative w-full aspect-[3/4] max-h-72 rounded-2xl overflow-hidden bg-neutral-900 border-2 border-dashed border-[#dfd4c7] group shadow-inner">
                            <img
                              src={promo.image || DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image}
                              alt={promo.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                              <label className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs cursor-pointer shadow-lg flex items-center gap-1.5 transition-all">
                                <Upload className="w-4 h-4" />
                                <span>Tải Lên Supabase</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadPromotionImage(realIndex, e.target.files?.[0])}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-[#7a5843]">Hoặc dán URL hình ảnh:</span>
                            <input
                              type="text"
                              value={promo.image || ''}
                              onChange={(e) => handleUpdatePromotionField(realIndex, 'image', e.target.value)}
                              placeholder="https://... ảnh Supabase"
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-mono focus:outline-none focus:border-[#8c5932]"
                            />
                          </div>
                        </div>

                        {/* Right: Detailed Fields */}
                        <div className="md:col-span-8 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#5c3d2e]">Tiêu Đề Ưu Đãi (Title)</label>
                              <input
                                type="text"
                                value={promo.title || ''}
                                onChange={(e) => handleUpdatePromotionField(realIndex, 'title', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-black text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#5c3d2e]">Phụ Đề Nhỏ (Subtitle)</label>
                              <input
                                type="text"
                                value={promo.subtitle || ''}
                                onChange={(e) => handleUpdatePromotionField(realIndex, 'subtitle', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#5c3d2e]">Mã Voucher</label>
                              <input
                                type="text"
                                value={promo.code || ''}
                                onChange={(e) => handleUpdatePromotionField(realIndex, 'code', e.target.value.toUpperCase().trim())}
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-mono font-black text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#5c3d2e]">Mức Giảm (Badge)</label>
                              <input
                                type="text"
                                value={promo.discount || ''}
                                onChange={(e) => handleUpdatePromotionField(realIndex, 'discount', e.target.value)}
                                placeholder="GIẢM 40%"
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-black text-rose-600 focus:outline-none focus:border-[#8c5932]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#5c3d2e]">Giá Trị Phụ</label>
                              <input
                                type="text"
                                value={promo.discountValue || ''}
                                onChange={(e) => handleUpdatePromotionField(realIndex, 'discountValue', e.target.value)}
                                placeholder="Đồng giá 25K"
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs text-[#8c5932] font-bold focus:outline-none focus:border-[#8c5932]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#5c3d2e]">Huy Hiệu Tag</label>
                              <input
                                type="text"
                                value={promo.badge || promo.tag || ''}
                                onChange={(e) => {
                                  handleUpdatePromotionField(realIndex, 'badge', e.target.value);
                                  handleUpdatePromotionField(realIndex, 'tag', e.target.value);
                                }}
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#5c3d2e]">Thời Gian Hiệu Lực</label>
                              <input
                                type="text"
                                value={promo.validUntil || ''}
                                onChange={(e) => handleUpdatePromotionField(realIndex, 'validUntil', e.target.value)}
                                placeholder="16:00 - 19:00 Mỗi Ngày"
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#5c3d2e]">Nhóm Danh Mục</label>
                              <select
                                value={promo.category || 'drinks'}
                                onChange={(e) => handleUpdatePromotionField(realIndex, 'category', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                              >
                                <option value="drinks">Cà Phê & Đồ Uống</option>
                                <option value="night">Cú Đêm 24/24</option>
                                <option value="combo">Combo Ăn Uống</option>
                                <option value="student">Học Nhóm & Sinh Viên</option>
                                <option value="all">Tất Cả Khách Hàng</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#5c3d2e]">Tên Nút Kêu Gọi</label>
                              <input
                                type="text"
                                value={promo.cta || 'Dùng ngay'}
                                onChange={(e) => handleUpdatePromotionField(realIndex, 'cta', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                              />
                            </div>
                          </div>

                          {/* 3 Nút Bật/Tắt Chi Tiết (Tự động lưu tức thì) */}
                          <div className="p-4 rounded-2xl bg-white border border-[#dfd4c7] space-y-2.5">
                            <span className="text-xs font-black uppercase text-[#7a5843] block">
                              Ẩn / Hiện các thành phần nút bấm ở góc thẻ ưu đãi:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <label className="flex items-center gap-2 text-xs font-bold text-[#2b170e] cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={promo.showVoucherCode !== false}
                                  onChange={() => handleTogglePromotionField(realIndex, 'showVoucherCode')}
                                  className="w-4 h-4 accent-amber-600 rounded"
                                />
                                <span>Hiển thị Mã ({promo.code || 'PROMO24'})</span>
                              </label>

                              <label className="flex items-center gap-2 text-xs font-bold text-[#2b170e] cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={promo.showCopyBtn !== false}
                                  onChange={() => handleTogglePromotionField(realIndex, 'showCopyBtn')}
                                  className="w-4 h-4 accent-amber-600 rounded"
                                />
                                <span>Hiển thị Nút Chép Mã</span>
                              </label>

                              <label className="flex items-center gap-2 text-xs font-bold text-[#2b170e] cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={promo.showCtaBtn !== false}
                                  onChange={() => handleTogglePromotionField(realIndex, 'showCtaBtn')}
                                  className="w-4 h-4 accent-amber-600 rounded"
                                />
                                <span>Hiển thị Nút Dùng Ngay</span>
                              </label>
                            </div>
                          </div>

                          {/* Detail & Conditions (Shown in Click-to-Modal) */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-[#5c3d2e] flex items-center justify-between">
                              <span>Nội Dung Chi Tiết Chương Trình (Hiện Trong Popup Khi Nhấn Vào Khung)</span>
                              <span className="text-[11px] text-[#a0826f] font-normal">Đã lược bỏ khỏi mặt thẻ để thẻ gọn gàng</span>
                            </label>
                            <textarea
                              rows={3}
                              value={promo.description || ''}
                              onChange={(e) => handleUpdatePromotionField(realIndex, 'description', e.target.value)}
                              placeholder="Mô tả chi tiết các loại đồ uống, thể lệ giảm giá..."
                              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs text-[#2b170e] focus:outline-none focus:border-[#8c5932] leading-relaxed"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-[#5c3d2e]">
                              Điều Kiện & Thể Lệ Áp Dụng (Trong Popup)
                            </label>
                            <input
                              type="text"
                              value={promo.condition || ''}
                              onChange={(e) => handleUpdatePromotionField(realIndex, 'condition', e.target.value)}
                              placeholder="Áp dụng tại 2 chi nhánh và đặt món online..."
                              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CẤU HÌNH KHỐI 3 BƯỚC DÙNG VOUCHER (ẢNH USER GỬI)        */}
      {/* ============================================================== */}
      {activeSubTab === 'guideSteps' && (
        <div className="space-y-8">
          
          {/* Section Main Switch Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dfd4c7]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-700">
                    <ListOrdered className="w-5 h-5 stroke-[2.5]" />
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#2b170e]">
                    Khối Hướng Dẫn: "3 Bước Sử Dụng Voucher Cực Dễ Dàng"
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#7a5843]">
                  Tùy chọn bật/tắt toàn bộ khối này, chỉnh sửa tiêu đề giới thiệu và nội dung từng bước như trong ảnh bạn đã gửi.
                </p>
              </div>

              {/* Master Toggle */}
              <label className="inline-flex items-center gap-3 cursor-pointer select-none bg-[#fbf8f5] px-4 py-2.5 rounded-2xl border border-[#dfd4c7] shadow-2xs">
                <span className="text-xs font-black text-[#2b170e]">
                  {pageConfig.guideSteps?.enabled !== false ? 'Đang Hiển Thị Trên Web' : 'Đang Ẩn Khối Này'}
                </span>
                <input
                  type="checkbox"
                  checked={pageConfig.guideSteps?.enabled !== false}
                  onChange={(e) => handleUpdateGuideField('enabled', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors relative ${
                  pageConfig.guideSteps?.enabled !== false ? 'bg-emerald-600' : 'bg-neutral-300'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    pageConfig.guideSteps?.enabled !== false ? 'left-6' : 'left-1'
                  }`} />
                </div>
              </label>
            </div>

            {/* Title & Description Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Huy Hiệu Nhỏ (Badge)</label>
                <input
                  type="text"
                  value={pageConfig.guideSteps?.badge || ''}
                  onChange={(e) => handleUpdateGuideField('badge', e.target.value)}
                  placeholder="CÁCH THỨC ÁP DỤNG"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-black text-[#8c5932] focus:outline-none focus:border-[#8c5932]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Tiêu Đề Lớn (Title)</label>
                <input
                  type="text"
                  value={pageConfig.guideSteps?.title || ''}
                  onChange={(e) => handleUpdateGuideField('title', e.target.value)}
                  placeholder="3 Bước Sử Dụng Voucher Cực Dễ Dàng"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-sm font-black text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Đoạn Văn Bản Giới Thiệu (Description)</label>
                <textarea
                  rows={2}
                  value={pageConfig.guideSteps?.description || ''}
                  onChange={(e) => handleUpdateGuideField('description', e.target.value)}
                  placeholder="Chỉ với vài thao tác đơn giản, bạn sẽ nhận ngay ưu đãi giảm giá tốt nhất..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs sm:text-sm text-[#4a2e1b] focus:outline-none focus:border-[#8c5932] leading-relaxed"
                />
              </div>
            </div>

            {/* List of Steps */}
            <div className="space-y-4 pt-4 border-t border-[#dfd4c7]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#7a5843]">
                  Danh Sách Các Bước Hướng Dẫn ({pageConfig.guideSteps?.steps?.length || 0} Bước)
                </span>
                <button
                  type="button"
                  onClick={handleAddStepItem}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-[#2b170e] text-xs font-bold border border-[#dfd4c7] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Bước Mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(pageConfig.guideSteps?.steps || []).map((stepItem, sIdx) => (
                  <div 
                    key={stepItem.id || sIdx}
                    className="p-5 rounded-2xl bg-white border border-[#dfd4c7] space-y-3 relative shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={stepItem.step || `0${sIdx + 1}`}
                          onChange={(e) => handleUpdateStepItem(sIdx, 'step', e.target.value)}
                          className="w-12 h-10 rounded-xl text-center font-black text-sm text-white focus:outline-none shadow-xs"
                          style={{ backgroundColor: stepItem.color || '#2b170e' }}
                          title="Số thứ tự bước"
                        />
                        <input
                          type="color"
                          value={stepItem.color || '#2b170e'}
                          onChange={(e) => handleUpdateStepItem(sIdx, 'color', e.target.value)}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0"
                          title="Chọn màu nền số thứ tự"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteStepItem(sIdx)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa bước này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#7a5843]">Tiêu Đề Bước</label>
                      <input
                        type="text"
                        value={stepItem.title || ''}
                        onChange={(e) => handleUpdateStepItem(sIdx, 'title', e.target.value)}
                        placeholder="Lưu Mã Ưu Đãi"
                        className="w-full px-3 py-1.5 rounded-xl bg-[#fbf8f5] border border-[#dfd4c7] text-xs font-black text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#7a5843]">Chi Tiết Hướng Dẫn</label>
                      <textarea
                        rows={3}
                        value={stepItem.desc || ''}
                        onChange={(e) => handleUpdateStepItem(sIdx, 'desc', e.target.value)}
                        placeholder="Nhập nội dung diễn giải cho bước này..."
                        className="w-full px-3 py-1.5 rounded-xl bg-[#fbf8f5] border border-[#dfd4c7] text-xs text-[#4a2e1b] focus:outline-none focus:border-[#8c5932] leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Live Preview of Guide Steps (Exactly like user's screenshot) */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-[#e8ded3]/40 border border-[#dfd4c7] space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#8c5932] tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Xem Trước Trực Quan Khối Này Ngoài Web (Live Preview)</span>
            </div>

            {pageConfig.guideSteps?.enabled === false ? (
              <div className="p-8 rounded-3xl bg-white/60 border border-dashed border-neutral-300 text-center text-sm font-bold text-neutral-500">
                Khối này đang được TẮT và sẽ không xuất hiện trên trang /khuyenmai.
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-6 sm:p-10 border border-white/80 space-y-8 shadow-sm">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-xs font-black text-[#8c5932] uppercase tracking-wider bg-white/90 px-4 py-1.5 rounded-full border border-white inline-block shadow-2xs">
                    {pageConfig.guideSteps?.badge || 'CÁCH THỨC ÁP DỤNG'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#2b170e]">
                    {pageConfig.guideSteps?.title || '3 Bước Sử Dụng Voucher Cực Dễ Dàng'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
                    {pageConfig.guideSteps?.description || 'Chỉ với vài thao tác đơn giản, bạn sẽ nhận ngay ưu đãi giảm giá tốt nhất khi đặt món trực tuyến hoặc thưởng thức tại quán.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {(pageConfig.guideSteps?.steps || []).map((step, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-[#dfd4c7]/80 space-y-3 shadow-xs">
                      <div 
                        className="w-12 h-12 rounded-2xl text-white font-black text-lg flex items-center justify-center shadow-md"
                        style={{ backgroundColor: step.color || '#2b170e' }}
                      >
                        {step.step || `0${idx + 1}`}
                      </div>
                      <h4 className="text-base font-black text-[#2b170e]">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CẤU HÌNH HERO BANNER ĐẦU TRANG                          */}
      {/* ============================================================== */}
      {activeSubTab === 'heroBanner' && (() => {
        const selectedHeroPromo = (pageConfig.hero?.featuredPromoId 
          ? promotions.find(p => p.id === pageConfig.hero.featuredPromoId)
          : null) || promotions[0] || null;
        const currentHeroPoster = pageConfig.hero?.customImage || selectedHeroPromo?.image || DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image;

        return (
          <div className="space-y-6">
            {/* Informational Guidance Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/25 text-[#2b170e] flex items-start gap-3.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <strong className="text-[#8c5932] font-bold block mb-0.5">Vị trí chỉnh sửa khối đầu trang Khuyến Mãi (/khuyenmai):</strong>
                Tại đây bạn có thể <strong>chọn chương trình ưu đãi hiển thị trên tấm áp phích (poster 3:4 bên phải)</strong>, chỉnh sửa tiêu đề giới thiệu, 2 nút bấm điều hướng và <strong>4 con số thống kê</strong> nổi bật bên dưới.
              </div>
            </div>

            {/* PHẦN 1: CHỌN CHƯƠNG TRÌNH / VOUCHER CHO TẤM ÁP PHÍCH HERO (POSTER BÊN PHẢI) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dfd4c7]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-800">
                      <Ticket className="w-4 h-4" />
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#2b170e]">
                      1. Chọn Chương Trình / Voucher Cho Tấm Áp Phích Hero (Bên Phải)
                    </h3>
                  </div>
                  <p className="text-xs text-[#7a5843] mt-0.5">
                    Chọn ưu đãi nào từ danh sách bên dưới để đưa lên làm ảnh đại diện chính của trang khuyến mãi.
                  </p>
                </div>

                {/* Toggle Hero */}
                <label className="inline-flex items-center gap-3 cursor-pointer select-none bg-[#fbf8f5] px-4 py-2 rounded-xl border border-[#dfd4c7]">
                  <span className="text-xs font-bold text-[#2b170e]">
                    {pageConfig.hero?.enabled !== false ? 'Đang Bật Hero' : 'Đang Ẩn Hero'}
                  </span>
                  <input
                    type="checkbox"
                    checked={pageConfig.hero?.enabled !== false}
                    onChange={(e) => handleUpdateHeroField('enabled', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${
                    pageConfig.hero?.enabled !== false ? 'bg-amber-600' : 'bg-neutral-300'
                  }`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      pageConfig.hero?.enabled !== false ? 'left-5.5' : 'left-1'
                    }`} />
                  </div>
                </label>
              </div>

              {/* Selector & Preview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Controls */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-[#7a5843] block">
                      Chọn Chương Trình Khuyến Mãi Muốn Đưa Lên Hero Card:
                    </label>
                    <select
                      value={pageConfig.hero?.featuredPromoId || ''}
                      onChange={(e) => handleUpdateHeroField('featuredPromoId', e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#dfd4c7] text-xs sm:text-sm font-bold text-[#2b170e] focus:outline-none focus:border-[#8c5932] shadow-xs cursor-pointer"
                    >
                      <option value="">-- [Mặc định] Ưu đãi #1 trong danh sách ({promotions[0]?.title || 'Ưu đãi đầu tiên'}) --</option>
                      {promotions.map((p, pIdx) => (
                        <option key={p.id || pIdx} value={p.id}>
                          Ưu đãi #{pIdx + 1}: {p.title} - [{p.discount || 'ƯU ĐÃI'}] {p.code ? `(Mã: ${p.code})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#fbf8f5] border border-[#dfd4c7] text-xs space-y-2 text-[#5c3d2e]">
                    <div className="font-bold text-[#2b170e] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Đang chọn hiển thị: <strong>{selectedHeroPromo?.title || 'Chưa chọn'}</strong></span>
                    </div>
                    <p className="leading-relaxed">
                      Khi chọn chương trình ở đây, hệ thống sẽ tự động dùng hình ảnh, mức giảm, mã code và thời hạn áp dụng của chương trình đó trên tấm poster Hero.
                    </p>
                  </div>

                  {/* Custom Poster Upload (Optional) */}
                  <div className="pt-2 border-t border-[#dfd4c7]/70 space-y-2.5">
                    <label className="text-xs font-black uppercase text-[#7a5843] block">
                      Hoặc Tải Lên Ảnh Áp Phích Tùy Chỉnh (Tỉ Lệ 3:4):
                    </label>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <input
                        type="file"
                        id="hero-custom-poster-input"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadHeroCustomImage(file);
                        }}
                      />
                      <button
                        type="button"
                        disabled={isUploadingHeroPoster}
                        onClick={() => document.getElementById('hero-custom-poster-input')?.click()}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs disabled:opacity-60"
                      >
                        {isUploadingHeroPoster ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Đang Tải Lên Supabase...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Tải Ảnh Mới Từ Máy</span>
                          </>
                        )}
                      </button>

                      {pageConfig.hero?.customImage && (
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateHeroField('customImage', '');
                            triggerAlert?.('✓ Đã khôi phục dùng ảnh tự động theo chương trình!');
                          }}
                          className="px-4 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Dùng Lại Ảnh Gốc Của Voucher</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Mini Live Preview Card */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-64 aspect-[3/4] rounded-3xl overflow-hidden relative shadow-xl border-2 border-amber-500/30 bg-stone-900 group">
                    <img
                      src={currentHeroPoster}
                      alt={selectedHeroPromo?.title || 'Hero Poster'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_SITE_CONFIG.promotionsList?.[0]?.image || '/images/promo_banner.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                    {/* Floating Ticket Feature Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-white text-[#2b170e] space-y-1 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#8c5932] flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-600 fill-orange-600" />
                          {selectedHeroPromo?.tag || selectedHeroPromo?.badge || 'HOT DEAL'}
                        </span>
                        <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.2 rounded-full">
                          {selectedHeroPromo?.discount || 'GIẢM'}
                        </span>
                      </div>
                      <div className="text-xs font-black text-[#2b170e] truncate">{selectedHeroPromo?.title || 'Tiêu đề ưu đãi'}</div>
                      <div className="flex items-center justify-between text-[10px] text-[#5c3d2e] pt-1 border-t border-[#dfd4c7]">
                        <span>Mã: <strong className="font-mono text-[#8c5932] font-black">{selectedHeroPromo?.code || 'COFFEE24'}</strong></span>
                        <span className="text-[#8c5932] font-bold">{selectedHeroPromo?.validUntil || '24/24'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PHẦN 2: NỘI DUNG GIỚI THIỆU & 2 NÚT BẤM (BÊN TRÁI) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-sm space-y-5">
              <div className="pb-4 border-b border-[#dfd4c7]">
                <h3 className="text-base sm:text-lg font-black text-[#2b170e]">
                  2. Tiêu Đề, Đoạn Giới Thiệu & 2 Nút Bấm (Bên Trái)
                </h3>
                <p className="text-xs text-[#7a5843] mt-0.5">
                  Chỉnh sửa các dòng chữ hiển thị ở cột bên trái của Hero Banner.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-[#7a5843]">Huy Hiệu Nhỏ (Badge)</label>
                  <input
                    type="text"
                    value={pageConfig.hero?.badge || ''}
                    onChange={(e) => handleUpdateHeroField('badge', e.target.value)}
                    placeholder="🔥 ĐẶC QUYỀN CỦA BẠN KHI ĐẾN 24/24"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#8c5932] focus:outline-none focus:border-[#8c5932]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-[#7a5843]">Tiêu Đề Dòng 1</label>
                  <input
                    type="text"
                    value={pageConfig.hero?.title || ''}
                    onChange={(e) => handleUpdateHeroField('title', e.target.value)}
                    placeholder="ƯU ĐÃI ĐỘC QUYỀN"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-[#7a5843]">Tiêu Đề Nổi Bật Dòng 2</label>
                  <input
                    type="text"
                    value={pageConfig.hero?.highlightTitle || ''}
                    onChange={(e) => handleUpdateHeroField('highlightTitle', e.target.value)}
                    placeholder="Dành Riêng Cho Bạn"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#8c5932] focus:outline-none focus:border-[#8c5932]"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-black uppercase text-[#7a5843]">Đoạn Văn Giới Thiệu Hero</label>
                  <textarea
                    rows={2}
                    value={pageConfig.hero?.description || ''}
                    onChange={(e) => handleUpdateHeroField('description', e.target.value)}
                    placeholder="Tích điểm giảm giá tới 15%. Giờ Vàng giảm giá tới 33%, combo Cú Đêm 42K..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs sm:text-sm text-[#4a2e1b] focus:outline-none focus:border-[#8c5932]"
                  />
                </div>
              </div>

              {/* 2 Buttons */}
              <div className="pt-2 border-t border-[#dfd4c7]/70">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#7a5843] mb-3">Cấu Hình 2 Nút Bấm Điều Hướng</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-[#fbf8f5] border border-[#dfd4c7] space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#2b170e] block">Nút 1: Đặt Món (Nền Đen)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={pageConfig.hero?.ctaText || 'ĐẶT MÓN & ÁP MÃ NGAY'}
                        onChange={(e) => handleUpdateHeroField('ctaText', e.target.value)}
                        placeholder="Tên nút (ĐẶT MÓN)"
                        className="px-3 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e]"
                      />
                      <input
                        type="text"
                        value={pageConfig.hero?.ctaLink || '/dathang'}
                        onChange={(e) => handleUpdateHeroField('ctaLink', e.target.value)}
                        placeholder="Link (/dathang)"
                        className="px-3 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-mono font-bold text-[#8c5932]"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#fbf8f5] border border-[#dfd4c7] space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#2b170e] block">Nút 2: Xem Voucher (Nền Sáng)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={pageConfig.hero?.secondaryText || 'Xem Danh Sách Voucher'}
                        onChange={(e) => handleUpdateHeroField('secondaryText', e.target.value)}
                        placeholder="Tên nút (Xem Danh Sách Voucher)"
                        className="px-3 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e]"
                      />
                      <input
                        type="text"
                        value={pageConfig.hero?.secondaryLink || '#voucher-grid'}
                        onChange={(e) => handleUpdateHeroField('secondaryLink', e.target.value)}
                        placeholder="Link (#voucher-grid)"
                        className="px-3 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-mono font-bold text-[#8c5932]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PHẦN 3: 4 CON SỐ THỐNG KÊ (ẢNH 2: 6+ Deals, Tới 40%, 24/24 H, 25 Phút) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-sm space-y-4">
              <div className="pb-3 border-b border-[#dfd4c7]">
                <h3 className="text-base sm:text-lg font-black text-[#2b170e]">
                  3. Bốn Con Số Thống Kê Nổi Bật (Dưới 2 Nút Bấm)
                </h3>
                <p className="text-xs text-[#7a5843] mt-0.5">
                  Chỉnh sửa trực tiếp 4 con số và chú thích bên dưới (6+ Deals, Tới 40%, 24/24 H, 25 Phút).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {(pageConfig.hero?.stats || defaultPageConfig.hero.stats).map((stat, sIdx) => (
                  <div key={stat.id || sIdx} className="p-3.5 rounded-2xl bg-white border border-[#dfd4c7] shadow-2xs space-y-2">
                    <span className="text-[10px] font-black uppercase text-[#8c5932] block">
                      Thống Kê #{sIdx + 1}
                    </span>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#5c3d2e]">Con Số / Chữ Lớn</label>
                      <input
                        type="text"
                        value={stat.number || ''}
                        onChange={(e) => handleUpdateHeroStat(sIdx, 'number', e.target.value)}
                        placeholder={sIdx === 0 ? '6+ Deals' : sIdx === 1 ? 'Tới 40%' : sIdx === 2 ? '24/24 H' : '25 Phút'}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#fcfaf7] border border-[#dfd4c7] text-xs font-black text-[#2b170e]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#5c3d2e]">Dòng Chú Thích Dưới</label>
                      <input
                        type="text"
                        value={stat.label || ''}
                        onChange={(e) => handleUpdateHeroStat(sIdx, 'label', e.target.value)}
                        placeholder={sIdx === 0 ? 'Cập nhật mỗi ngày' : sIdx === 1 ? 'Chiết khấu trực tiếp' : sIdx === 2 ? 'Phục vụ xuyên đêm' : 'Giao hỏa tốc đêm'}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#fcfaf7] border border-[#dfd4c7] text-xs font-medium text-[#7a5843]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ============================================================== */}
      {/* TAB 4: CAM KẾT 24/24 & HOTLINE (2 KHỐI CUỐI TRANG KHUYẾN MÃI)  */}
      {/* ============================================================== */}
      {activeSubTab === 'commitments' && (
        <div className="space-y-6">
          {/* Informational Banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-[#2b170e] flex items-start gap-3.5">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="text-blue-900 font-bold block mb-0.5">Vị trí chỉnh sửa 2 khối cuối trang Khuyến Mãi (/khuyenmai):</strong>
              Tab này quản lý trực tiếp <strong>Khối Cam Kết Phục Vụ 24/24</strong> (tiêu đề, 2 nút bấm và 4 ô dịch vụ: rang mộc, bếp nóng, wifi, giao hỏa tốc) và <strong>Khối Hotline / Hỗ Trợ Đặt Bàn Nhóm</strong> (chân trang khuyến mãi).
            </div>
          </div>

          {/* ========================================================================= */}
          {/* KHỐI 1: CAM KẾT PHỤC VỤ 24/24 (HÌNH ẢNH 2: RANG MỘC, BẾP NÓNG, WIFI, GIAO HỎA TỐC) */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#dfd4c7]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-800">
                    <Coffee className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-black text-[#2b170e]">1. Khối Cam Kết Phục Vụ 24/24</h3>
                </div>
                <p className="text-xs text-[#7a5843] mt-0.5">
                  Gồm tiêu đề, đoạn giới thiệu, 2 nút bấm đặt món / xem quán và 4 ô tiêu chuẩn chất lượng.
                </p>
              </div>

              <label className="inline-flex items-center gap-3 cursor-pointer select-none bg-[#fbf8f5] px-4 py-2 rounded-xl border border-[#dfd4c7]">
                <span className="text-xs font-bold text-[#2b170e]">
                  {pageConfig.commitments?.enabled !== false ? 'Đang Hiển Thị' : 'Đang Ẩn'}
                </span>
                <input
                  type="checkbox"
                  checked={pageConfig.commitments?.enabled !== false}
                  onChange={(e) => handleUpdateCommitmentField('enabled', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-colors relative ${
                  pageConfig.commitments?.enabled !== false ? 'bg-blue-600' : 'bg-neutral-300'
                }`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    pageConfig.commitments?.enabled !== false ? 'left-5.5' : 'left-1'
                  }`} />
                </div>
              </label>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Huy Hiệu (Badge)</label>
                <input
                  type="text"
                  value={pageConfig.commitments?.badge || 'Chuẩn Mực Phục Vụ 24/7'}
                  onChange={(e) => handleUpdateCommitmentField('badge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#8c5932] focus:outline-none focus:border-[#8c5932]"
                  placeholder="Chuẩn Mực Phục Vụ 24/7"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Tiêu Đề Dòng 1</label>
                <input
                  type="text"
                  value={pageConfig.commitments?.title || 'Không Chỉ Là Cà Phê,'}
                  onChange={(e) => handleUpdateCommitmentField('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e] focus:outline-none focus:border-[#8c5932]"
                  placeholder="Không Chỉ Là Cà Phê,"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Tiêu Đề Nổi Bật Dòng 2</label>
                <input
                  type="text"
                  value={pageConfig.commitments?.highlightTitle || 'Đó Là Trạm Năng Lượng 24/24'}
                  onChange={(e) => handleUpdateCommitmentField('highlightTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#8c5932] focus:outline-none focus:border-[#8c5932]"
                  placeholder="Đó Là Trạm Năng Lượng 24/24"
                />
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Đoạn Giới Thiệu Khối Cam Kết</label>
                <textarea
                  rows={2}
                  value={pageConfig.commitments?.description || ''}
                  onChange={(e) => handleUpdateCommitmentField('description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs sm:text-sm text-[#4a2e1b] focus:outline-none focus:border-[#8c5932]"
                  placeholder="Cho dù bạn cần một không gian yên tĩnh cày deadline lúc 2 giờ sáng..."
                />
              </div>
            </div>

            {/* 2 Buttons Configuration */}
            <div className="pt-2 border-t border-[#dfd4c7]/60">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#7a5843] mb-3">Cấu Hình 2 Nút Bấm Điều Hướng</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-[#fbf8f5] border border-[#dfd4c7] space-y-2">
                  <span className="text-[11px] font-black uppercase text-[#2b170e] block">Nút 1: Đặt Món (Nền Đen)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={pageConfig.commitments?.primaryBtnText || 'Đặt Món Ngay Bây Giờ'}
                      onChange={(e) => handleUpdateCommitmentField('primaryBtnText', e.target.value)}
                      placeholder="Tên nút (Đặt Món Ngay Bây Giờ)"
                      className="px-3 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e]"
                    />
                    <input
                      type="text"
                      value={pageConfig.commitments?.primaryBtnLink || '/dathang'}
                      onChange={(e) => handleUpdateCommitmentField('primaryBtnLink', e.target.value)}
                      placeholder="Link (/dathang)"
                      className="px-3 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-mono font-bold text-[#8c5932]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#fbf8f5] border border-[#dfd4c7] space-y-2">
                  <span className="text-[11px] font-black uppercase text-[#2b170e] block">Nút 2: Xem Không Gian (Nền Sáng)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={pageConfig.commitments?.secondaryBtnText || 'Xem Không Gian Quán'}
                      onChange={(e) => handleUpdateCommitmentField('secondaryBtnText', e.target.value)}
                      placeholder="Tên nút (Xem Không Gian Quán)"
                      className="px-3 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e]"
                    />
                    <input
                      type="text"
                      value={pageConfig.commitments?.secondaryBtnLink || '/gioithieu'}
                      onChange={(e) => handleUpdateCommitmentField('secondaryBtnLink', e.target.value)}
                      placeholder="Link (/gioithieu)"
                      className="px-3 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-mono font-bold text-[#8c5932]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Feature Items Grid */}
            <div className="pt-2 border-t border-[#dfd4c7]/60">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#7a5843] mb-3">
                Chỉnh Sửa 4 Ô Tiêu Chuẩn Dịch Vụ (Rang Mộc, Bếp Nóng, Wifi, Giao Hỏa Tốc)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(pageConfig.commitments?.items || defaultPageConfig.commitments.items).map((com, cIdx) => (
                  <div key={com.id || cIdx} className="p-4 rounded-2xl bg-white border border-[#dfd4c7] shadow-2xs space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold text-xs">
                        #{cIdx + 1}
                      </span>
                      <span className="text-xs font-black uppercase text-[#8c5932]">
                        {cIdx === 0 && 'Cà Phê Rang Mộc'}
                        {cIdx === 1 && 'Bếp Nóng 24/24'}
                        {cIdx === 2 && 'Wifi & Ổ Cắm Điện'}
                        {cIdx >= 3 && 'Giao Hàng Hỏa Tốc'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#5c3d2e]">Tiêu Đề Ô</label>
                      <input
                        type="text"
                        value={com.title || ''}
                        onChange={(e) => handleUpdateCommitmentItem(cIdx, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fcfaf7] border border-[#dfd4c7] text-xs font-bold text-[#2b170e]"
                        placeholder="Tiêu đề tiêu chuẩn..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#5c3d2e]">Nội Dung Mô Tả Chi Tiết</label>
                      <textarea
                        rows={2}
                        value={com.desc || ''}
                        onChange={(e) => handleUpdateCommitmentItem(cIdx, 'desc', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fcfaf7] border border-[#dfd4c7] text-xs text-[#4a2e1b]"
                        placeholder="Nội dung mô tả ngắn gọn..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* KHỐI 2: HOTLINE & HỖ TRỢ ĐẶT BÀN NHÓM CHÂN TRANG (HÌNH ẢNH 1: THANH BO TRÒN) */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#dfd4c7]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-800">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-black text-[#2b170e]">2. Khối Hotline & Đặt Bàn Nhóm Chân Trang</h3>
                </div>
                <p className="text-xs text-[#7a5843] mt-0.5">
                  Thanh màu sáng bo tròn ở cuối trang khuyến mãi gồm icon điện thoại, câu hỏi, hotline và nút trải nghiệm.
                </p>
              </div>

              <label className="inline-flex items-center gap-3 cursor-pointer select-none bg-[#fbf8f5] px-4 py-2 rounded-xl border border-[#dfd4c7]">
                <span className="text-xs font-bold text-[#2b170e]">
                  {pageConfig.hotline?.enabled !== false ? 'Đang Hiển Thị' : 'Đang Ẩn'}
                </span>
                <input
                  type="checkbox"
                  checked={pageConfig.hotline?.enabled !== false}
                  onChange={(e) => handleUpdateHotlineField('enabled', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-colors relative ${
                  pageConfig.hotline?.enabled !== false ? 'bg-emerald-600' : 'bg-neutral-300'
                }`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    pageConfig.hotline?.enabled !== false ? 'left-5.5' : 'left-1'
                  }`} />
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Tiêu Đề Khối Hotline</label>
                <input
                  type="text"
                  value={pageConfig.hotline?.title || 'Bạn Có Câu Hỏi Về Mã Ưu Đãi Hoặc Cần Đặt Bàn Nhóm?'}
                  onChange={(e) => handleUpdateHotlineField('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs sm:text-sm font-bold text-[#2b170e]"
                  placeholder="Bạn Có Câu Hỏi Về Mã Ưu Đãi Hoặc Cần Đặt Bàn Nhóm?"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Nội Dung Hướng Dẫn / Liên Hệ</label>
                <input
                  type="text"
                  value={pageConfig.hotline?.desc || 'Liên hệ hotline chăm sóc khách hàng 24/7: 0906 916 816 hoặc ghé trực tiếp chi nhánh gần nhất.'}
                  onChange={(e) => handleUpdateHotlineField('desc', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs sm:text-sm text-[#4a2e1b]"
                  placeholder="Liên hệ hotline chăm sóc khách hàng 24/7: 0906 916 816 hoặc ghé trực tiếp chi nhánh gần nhất."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Số Điện Thoại Hotline</label>
                <input
                  type="text"
                  value={pageConfig.hotline?.phone || '0906 916 816'}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPageConfig(prev => ({
                      ...prev,
                      hotline: { 
                        ...prev.hotline, 
                        phone: val,
                        phoneLink: `tel:${val.replace(/\s+/g, '')}`
                      }
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-mono font-black text-[#8c5932]"
                  placeholder="0906 916 816"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Tên Nút Kêu Gọi</label>
                <input
                  type="text"
                  value={pageConfig.hotline?.ctaText || 'TỚI QUÁN TRẢI NGHIỆM NGAY >'}
                  onChange={(e) => handleUpdateHotlineField('ctaText', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e]"
                  placeholder="TỚI QUÁN TRẢI NGHIỆM NGAY >"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-black uppercase text-[#7a5843]">Đường Dẫn Khi Bấm Nút</label>
                <input
                  type="text"
                  value={pageConfig.hotline?.ctaLink || '/cuahang'}
                  onChange={(e) => handleUpdateHotlineField('ctaLink', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-mono font-bold text-[#8c5932]"
                  placeholder="/cuahang hoặc /dathang"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: TRANG CHỦ & MENU HEADER                                */}
      {/* ============================================================== */}
      {activeSubTab === 'homeSection' && (
        <div className="space-y-6">
          {/* Header Nav Menu Toggle */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dfd4c7]">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#2b170e] flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-purple-600" />
                  <span>Tab "Khuyến Mãi" Trên Thanh Menu Header</span>
                </h3>
                <p className="text-xs text-[#7a5843]">
                  Bật/tắt hoặc đổi tên nhãn của nút Khuyến Mãi trên thanh menu đầu website.
                </p>
              </div>

              <label className="inline-flex items-center gap-3 cursor-pointer select-none bg-[#fbf8f5] px-4 py-2.5 rounded-2xl border border-[#dfd4c7] shadow-2xs">
                <span className="text-xs font-black text-[#2b170e]">
                  {headerMenuVisible ? 'Đang Hiển Thị' : 'Đang Ẩn'}
                </span>
                <input
                  type="checkbox"
                  checked={headerMenuVisible}
                  onChange={(e) => setHeaderMenuVisible(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors relative ${
                  headerMenuVisible ? 'bg-purple-600' : 'bg-neutral-300'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    headerMenuVisible ? 'left-6' : 'left-1'
                  }`} />
                </div>
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5c3d2e]">Tên Nhãn Tab Header</label>
              <input
                type="text"
                value={headerMenuLabel}
                onChange={(e) => setHeaderMenuLabel(e.target.value)}
                placeholder="Khuyến Mãi"
                className="w-full sm:w-72 px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e]"
              />
            </div>
          </div>

          {/* Home Section Toggle */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dfd4c7]">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#2b170e] flex items-center gap-2">
                  <Layout className="w-5 h-5 text-amber-600" />
                  <span>Khối Ưu Đãi Hiển Thị Ngoài Trang Chủ (Home Page)</span>
                </h3>
                <p className="text-xs text-[#7a5843]">
                  Tự động lấy danh sách voucher ở trên để chạy hiển thị trên Trang Chủ. Bạn có thể bật/tắt toàn bộ khối này.
                </p>
              </div>

              <label className="inline-flex items-center gap-3 cursor-pointer select-none bg-[#fbf8f5] px-4 py-2.5 rounded-2xl border border-[#dfd4c7] shadow-2xs">
                <span className="text-xs font-black text-[#2b170e]">
                  {sectionConfig.enabled ? 'Đang Bật Khối' : 'Đang Tắt Khối'}
                </span>
                <input
                  type="checkbox"
                  checked={sectionConfig.enabled}
                  onChange={(e) => setSectionConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors relative ${
                  sectionConfig.enabled ? 'bg-amber-600' : 'bg-neutral-300'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    sectionConfig.enabled ? 'left-6' : 'left-1'
                  }`} />
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5c3d2e]">Huy Hiệu Nhỏ (Badge)</label>
                <input
                  type="text"
                  value={sectionConfig.badge}
                  onChange={(e) => setSectionConfig(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-bold text-[#8c5932]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5c3d2e]">Tiêu Đề Dòng 1</label>
                <input
                  type="text"
                  value={sectionConfig.title}
                  onChange={(e) => setSectionConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-black text-[#2b170e]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5c3d2e]">Tiêu Đề Nổi Bật Dòng 2</label>
                <input
                  type="text"
                  value={sectionConfig.highlightTitle}
                  onChange={(e) => setSectionConfig(prev => ({ ...prev, highlightTitle: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs font-black text-[#8c5932]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5c3d2e]">Đoạn Mô Tả Giới Thiệu</label>
                <textarea
                  rows={2}
                  value={sectionConfig.subtitle}
                  onChange={(e) => setSectionConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dfd4c7] text-xs text-[#4a2e1b]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
