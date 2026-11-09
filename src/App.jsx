import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
const OrderPage = React.lazy(() => import('./pages/OrderPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const PromotionsPage = React.lazy(() => import('./pages/PromotionsPage'));
const CareersPage = React.lazy(() => import('./pages/CareersPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

import SideBanners from './components/SideBanners';
import BranchOrderModal from './components/BranchOrderModal';
import { getSiteConfig, syncSiteConfigWithCloud, updateDocumentFavicon, DEFAULT_SITE_CONFIG } from './data/siteConfig';
import { subscribeToCloudSiteConfig } from './lib/supabase';
import { initGlobalTracker, trackPageView } from './lib/tracker';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  // Sync favicon whenever siteConfig.logo changes
  useEffect(() => {
    updateDocumentFavicon(siteConfig.logo);
    if (siteConfig.brandName && siteConfig.slogan) {
      document.title = `${siteConfig.brandName} | ${siteConfig.slogan}`;
    }
  }, [siteConfig.logo, siteConfig.brandName, siteConfig.slogan]);

  // Sync with browser back/forward buttons, local events & Supabase Cloud
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    const handleConfigUpdate = () => {
      const fresh = getSiteConfig();
      setSiteConfig(fresh);
      updateDocumentFavicon(fresh.logo);
    };

    const handleOpenBranchModal = () => setIsBranchModalOpen(true);

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('site-config-updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);
    window.addEventListener('open-branch-order-modal', handleOpenBranchModal);

    // Khởi động hệ thống đo lường hành vi khách hàng toàn cục (Analytics Tracker)
    const cleanupTracker = initGlobalTracker();

    // Tự động kéo cấu hình mới nhất từ Supabase Cloud khi mở trang
    syncSiteConfigWithCloud();

    // Lắng nghe cập nhật Realtime từ Supabase (TÁCH BIỆT 100% THEO TỪNG MODULE)
    const unsubscribeCloud = subscribeToCloudSiteConfig((newCloudData, rowId) => {
      // 0. Nếu thay đổi riêng LOGO & THƯƠNG HIỆU (rowId: 'logo')
      if (rowId === 'logo' && newCloudData) {
        if (newCloudData.logo) {
          try {
            localStorage.setItem('coffee2424_brand_logo_img', newCloudData.logo);
            updateDocumentFavicon(newCloudData.logo);
          } catch (_) {}
        }
        setSiteConfig(prev => ({
          ...prev,
          logo: newCloudData.logo || prev.logo,
          favicon: newCloudData.favicon || newCloudData.logo || prev.favicon,
          brandName: newCloudData.brandName || prev.brandName,
          slogan: newCloudData.slogan || prev.slogan,
          heroHeadline: newCloudData.heroHeadline !== undefined ? newCloudData.heroHeadline : prev.heroHeadline,
          heroSubheadline: newCloudData.heroSubheadline !== undefined ? newCloudData.heroSubheadline : prev.heroSubheadline,
          announcementBar: newCloudData.announcementBar || prev.announcementBar
        }));
        return;
      }

      // 0.1. Nếu thay đổi riêng ẢNH BÌA HERO (rowId: 'heroBanner')
      if (rowId === 'heroBanner' && newCloudData) {
        if (newCloudData.mediaUrl) {
          try {
            localStorage.setItem('coffee2424_hero_banner_media', newCloudData.mediaUrl);
            localStorage.setItem('coffee2424_hero_banner', JSON.stringify(newCloudData));
          } catch (_) {}
        }
        setSiteConfig(prev => ({
          ...prev,
          heroBanner16x9: {
            ...prev.heroBanner16x9,
            ...newCloudData
          }
        }));
        return;
      }

      // 1. Nếu thay đổi riêng BÀI VIẾT (rowId: 'articles')
      if (rowId === 'articles' && newCloudData) {
        try {
          let incomingList = [];
          if (Array.isArray(newCloudData)) {
            incomingList = newCloudData;
          } else if (Array.isArray(newCloudData.list)) {
            incomingList = newCloudData.list;
            if (Array.isArray(newCloudData.deletedIds)) {
              const currentDeleted = new Set(JSON.parse(localStorage.getItem('coffee2424_deleted_articles') || '[]'));
              newCloudData.deletedIds.forEach(id => currentDeleted.add(String(id)));
              localStorage.setItem('coffee2424_deleted_articles', JSON.stringify(Array.from(currentDeleted)));
            }
          }
          const deletedIds = new Set(JSON.parse(localStorage.getItem('coffee2424_deleted_articles') || '[]'));
          const clean = incomingList.filter(a => a && !deletedIds.has(String(a.id)));
          localStorage.setItem('coffee2424_articles', JSON.stringify(clean));
          localStorage.setItem('coffee2424_articles_synced', 'true');
          window.dispatchEvent(new Event('articles-updated'));
        } catch (_) {}
        return;
      }

      // 2. Nếu thay đổi riêng KHUYẾN MÃI (rowId: 'promotions')
      if (rowId === 'promotions') {
        const promoList = Array.isArray(newCloudData?.promotionsList) ? newCloudData.promotionsList : (Array.isArray(newCloudData) ? newCloudData : null);
        if (promoList) {
          setSiteConfig(prev => ({
            ...prev,
            promotionsList: promoList,
            promotionsSection: newCloudData?.promotionsSection || prev?.promotionsSection,
            promotionsPageConfig: newCloudData?.promotionsPageConfig || prev?.promotionsPageConfig
          }));
          window.dispatchEvent(new Event('site-config-updated'));
        }
        return;
      }

      // 3. Nếu thay đổi riêng TUYỂN DỤNG (rowId: 'jobs')
      if (rowId === 'jobs' && newCloudData) {
        try {
          let incomingList = [];
          if (Array.isArray(newCloudData)) {
            incomingList = newCloudData;
          } else if (Array.isArray(newCloudData.list)) {
            incomingList = newCloudData.list;
            if (Array.isArray(newCloudData.deletedIds)) {
              const currentDeleted = new Set(JSON.parse(localStorage.getItem('coffee2424_deleted_jobs') || '[]'));
              newCloudData.deletedIds.forEach(id => currentDeleted.add(String(id)));
              localStorage.setItem('coffee2424_deleted_jobs', JSON.stringify(Array.from(currentDeleted)));
            }
          }
          const deletedIds = new Set(JSON.parse(localStorage.getItem('coffee2424_deleted_jobs') || '[]'));
          const clean = incomingList.filter(j => j && !deletedIds.has(String(j.id)));
          localStorage.setItem('coffee2424_jobs', JSON.stringify(clean));
          localStorage.setItem('coffee2424_jobs_synced', 'true');
          window.dispatchEvent(new Event('jobs-updated'));
        } catch (_) {}
        return;
      }

      // 4. Nếu thay đổi riêng CHI NHÁNH (rowId: 'branches')
      if (rowId === 'branches' && Array.isArray(newCloudData)) {
        try {
          localStorage.setItem('coffee2424_branches', JSON.stringify(newCloudData));
          window.dispatchEvent(new Event('branches-updated'));
        } catch (_) {}
        return;
      }

      // 5. Nếu thay đổi CẤU HÌNH GIAO DIỆN CHUNG (rowId: 'main')
      if (rowId === 'main' || !rowId) {
        if (Array.isArray(newCloudData?.branches) && newCloudData.branches.length > 0) {
          try {
            localStorage.setItem('coffee2424_branches', JSON.stringify(newCloudData.branches));
            window.dispatchEvent(new Event('branches-updated'));
          } catch (_) {}
        }

        if (Array.isArray(newCloudData?.jobs)) {
          try {
            localStorage.setItem('coffee2424_jobs', JSON.stringify(newCloudData.jobs));
            window.dispatchEvent(new Event('jobs-updated'));
          } catch (_) {}
        }

        if (Array.isArray(newCloudData?.articles)) {
          try {
            localStorage.setItem('coffee2424_articles', JSON.stringify(newCloudData.articles));
            window.dispatchEvent(new Event('articles-updated'));
          } catch (_) {}
        }

        setSiteConfig(prev => {
          const cloudPromos = Array.isArray(newCloudData?.promotionsList) && newCloudData.promotionsList.length > 0
            ? newCloudData.promotionsList
            : null;

          let safePromos = prev?.promotionsList || [];
          if (cloudPromos) {
            safePromos = cloudPromos.map(cloudP => {
              const localP = (prev?.promotionsList || []).find(l => l.id === cloudP.id) || {};
              return {
                ...localP,
                ...cloudP,
                showVoucherCode: cloudP.showVoucherCode !== undefined ? cloudP.showVoucherCode : (localP.showVoucherCode !== undefined ? localP.showVoucherCode : true),
                showCopyBtn: cloudP.showCopyBtn !== undefined ? cloudP.showCopyBtn : (localP.showCopyBtn !== undefined ? localP.showCopyBtn : true),
                showCtaBtn: cloudP.showCtaBtn !== undefined ? cloudP.showCtaBtn : (localP.showCtaBtn !== undefined ? localP.showCtaBtn : true)
              };
            });

            try {
              const stored = JSON.parse(localStorage.getItem('coffee2424_site_config') || '{}');
              stored.promotionsList = safePromos;
              localStorage.setItem('coffee2424_site_config', JSON.stringify(stored));
            } catch (_) {}
          }

          const localSpace = prev?.spaceAmenities;
          const cloudSpace = newCloudData?.spaceAmenities;
          let safeSpace = localSpace || cloudSpace;
          if (localSpace && cloudSpace) {
            const mergedPhotos = (localSpace.photos || []).map((p, idx) => {
              const dedicatedImg = localStorage.getItem(`coffee2424_space_photo_${idx}`);
              const dedicatedTitle = localStorage.getItem(`coffee2424_space_title_${idx}`);
              if (dedicatedImg) return { ...p, image: dedicatedImg, title: dedicatedTitle || p.title };
              const defaultPhoto = DEFAULT_SITE_CONFIG.spaceAmenities?.photos?.[idx];
              if (p.image && p.image !== defaultPhoto?.image) return p;
              return cloudSpace.photos?.[idx] || p;
            });
            safeSpace = {
              ...cloudSpace,
              ...localSpace,
              photos: mergedPhotos
            };
          }

          const merged = { 
            ...prev, 
            ...newCloudData,
            promotionsList: safePromos.length > 0 ? safePromos : (newCloudData?.promotionsList || prev?.promotionsList),
            spaceAmenities: safeSpace
          };
          if (merged.logo) updateDocumentFavicon(merged.logo);
          return merged;
        });
      }
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('site-config-updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
      window.removeEventListener('open-branch-order-modal', handleOpenBranchModal);
      if (typeof cleanupTracker === 'function') cleanupTracker();
      if (typeof unsubscribeCloud === 'function') unsubscribeCloud();
    };
  }, []);

  // Ghi nhận lượt xem trang (Pageview) và thời gian dừng lại (Dwell time) khi chuyển route
  useEffect(() => {
    const endTrack = trackPageView(currentPath);
    return () => {
      if (typeof endTrack === 'function') endTrack();
    };
  }, [currentPath]);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (path) => {
    // Khi nhấn đặt hàng, đặt món, thực đơn -> mở bảng lựa chọn chi nhánh (KiotViet 2 chi nhánh)
    if ((path === '/dathang' || path === '/order' || path === '/menu') && siteConfig.orderOnline?.enabled !== false) {
      setIsBranchModalOpen(true);
      return;
    }

    if (path === currentPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Phase 1: Smooth exit glide
    setIsTransitioning(true);

    setTimeout(() => {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      setSiteConfig(getSiteConfig());
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Phase 2: Enter new page
      setTimeout(() => {
        setIsTransitioning(false);
      }, 40);
    }, 180);
  };

  // Chốt lại: Trang admin chỉ dùng duy nhất 1 miền và đường dẫn là coffee2424.com/admin
  useEffect(() => {
    if (window.location.hostname.startsWith('admin.')) {
      const rootDomain = window.location.hostname.replace(/^admin\./, '');
      const targetUrl = `${window.location.protocol}//${rootDomain}${window.location.port ? ':' + window.location.port : ''}/admin`;
      window.location.replace(targetUrl);
    }
  }, []);

  // Chỉ kích hoạt Admin CMS khi đường dẫn là /admin
  const isAdmin = currentPath === '/admin';

  // If in admin mode, show full admin dashboard without regular customer header
  if (isAdmin) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-amber-400 gap-3">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">Đang khởi chạy Bảng Quản Trị...</span>
        </div>
      }>
        <AdminPage navigate={navigate} />
      </React.Suspense>
    );
  }

  // Regular Customer Routes (Tách riêng 3 trang Giới Thiệu, Tuyển Dụng, Bài Viết)
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/dathang':
        return (
          <OrderPage 
            selectedBranch={selectedBranch} 
            setSelectedBranch={setSelectedBranch} 
          />
        );
      case '/gioithieu':
        return <AboutPage navigate={navigate} />;
      case '/tuyendung':
        return <CareersPage navigate={navigate} />;
      case '/baiviet':
        return <BlogPage navigate={navigate} />;
      case '/khuyenmai':
        return <PromotionsPage navigate={navigate} />;
      case '/':
      default:
        return (
          <HomePage 
            navigate={navigate} 
            onSelectBranch={(branch) => {
              if (siteConfig.orderOnline?.enabled !== false) {
                const branchUrl = branch?.id === 'cn-413phi'
                  ? (siteConfig.orderOnline?.branch413PhiUrl || branch?.menuUrl)
                  : (siteConfig.orderOnline?.branch96D5Url || branch?.menuUrl);
                const targetUrl = branchUrl || siteConfig.orderOnline?.url || 'https://coffee2424.web-store.online';
                if (siteConfig.orderOnline?.openMode === 'same_tab') {
                  window.location.href = targetUrl;
                } else {
                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                }
              } else {
                setSelectedBranch(branch);
                navigate('/dathang');
              }
            }} 
          />
        );
    }
  };

  const glassBg = siteConfig.glassBackground || {};
  const glassStyleVars = {
    '--glass-panel-bg': `rgba(255, 255, 255, ${glassBg.glassBgOpacity ?? 0.28})`,
    '--glass-card-bg': `rgba(255, 255, 255, ${Math.min(0.7, (glassBg.glassBgOpacity ?? 0.28) + 0.04)})`,
    '--glass-panel-blur': `${glassBg.glassBlur ?? 24}px`,
    '--glass-panel-border': `rgba(255, 255, 255, ${glassBg.glassBorderOpacity ?? 0.65})`
  };

  return (
    <div 
      style={glassStyleVars}
      className="min-h-screen bg-[#ede6dc] text-[#2b170e] flex flex-col font-sans selection:bg-[#2b170e] selection:text-white relative overflow-x-hidden"
    >
      {/* Top Subtle Transition Progress Line */}
      {isTransitioning && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-[#8c5932] to-[#2b170e] z-50 animate-pulse" />
      )}

      {/* Dynamic Background Wallpaper (Visible through frosted glass) */}
      {(glassBg.enabled !== false) && glassBg.image && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
              glassBg.animation === 'ken_burns' ? 'animate-pulse-subtle scale-105' : ''
            }`}
            style={{
              backgroundImage: `url(${glassBg.image})`,
              opacity: glassBg.opacity ?? 0.38,
              filter: `blur(${glassBg.blur ?? 6}px) brightness(${glassBg.brightness ?? 95}%) contrast(${glassBg.contrast ?? 105}%) saturate(${glassBg.saturate ?? 110}%)`,
              WebkitFilter: `blur(${glassBg.blur ?? 6}px) brightness(${glassBg.brightness ?? 95}%) contrast(${glassBg.contrast ?? 105}%) saturate(${glassBg.saturate ?? 110}%)`,
              transform: glassBg.animation === 'ken_burns' ? 'scale(1.06) translate3d(0,0,0)' : 'scale(1.01) translate3d(0,0,0)',
              WebkitTransform: glassBg.animation === 'ken_burns' ? 'scale(1.06) translate3d(0,0,0)' : 'scale(1.01) translate3d(0,0,0)',
              WebkitBackfaceVisibility: 'hidden',
              willChange: 'filter, transform'
            }}
          />
          {/* Tint Overlay */}
          <div 
            className="absolute inset-0 transition-all duration-500"
            style={{
              backgroundColor: glassBg.overlayColor || '#ede6dc',
              opacity: glassBg.overlayOpacity ?? 0.30
            }}
          />
        </div>
      )}

      {/* Dynamic Animated Ambient Orbs for Authentic iOS Frosted Glass Translucency */}
      {glassBg.showAmbientOrbs !== false && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Warm Caramel Amber Orb (Top Left) */}
          <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#df934e]/70 via-[#f4bd80]/60 to-[#fedbb9]/45 blur-[100px] animate-orb-drift-1" />
          
          {/* Rich Espresso Mocha Orb (Mid Right) */}
          <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#b86d32]/65 via-[#d48c4e]/55 to-[#f3cfad]/45 blur-[110px] animate-orb-drift-2" />
          
          {/* Warm Golden Glow Orb (Mid Left) */}
          <div className="absolute top-2/3 -left-20 w-[480px] h-[480px] rounded-full bg-gradient-to-r from-[#f7ba72]/60 to-[#df8e43]/50 blur-[90px] animate-pulse-subtle" />

          {/* Roasted Hazelnut Glow Orb (Mid-Bottom Right) */}
          <div className="absolute bottom-1/4 -right-20 w-[520px] h-[520px] rounded-full bg-gradient-to-l from-[#d49457]/55 to-[#f5caa1]/45 blur-[100px] animate-orb-drift-2" />

          {/* Creamy Oat Foam Orb (Bottom Center) */}
          <div className="absolute -bottom-40 left-1/3 w-[720px] h-[720px] rounded-full bg-gradient-to-t from-[#dec5ab]/75 via-[#eed8c2]/65 to-[#fdf4ea]/55 blur-[125px] animate-orb-drift-3" />
        </div>
      )}

      {/* Floating Frosted Header (Overlays 16:9 Banner on Home, Floats Fixed on All Pages) */}
      <div className="fixed top-0 inset-x-0 z-40 pointer-events-none">
        <Header currentPath={currentPath} navigate={navigate} />
      </div>

      {/* 2 Floating Vertical Side Posters (Dismissible, Managed via Admin) */}
      <SideBanners config={siteConfig} navigate={navigate} />

      {/* Main Page Content with Smooth iOS 2-Phase Page Transitions */}
      <main className={`flex-1 relative z-10 ${currentPath !== '/' ? 'pt-20 sm:pt-24' : ''}`}>
        <div 
          key={currentPath} 
          className={`h-full ${isTransitioning ? 'animate-page-exit pointer-events-none' : 'animate-page-enter'}`}
        >
          <React.Suspense fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border-3 border-amber-600/30 border-t-amber-600 rounded-full animate-spin" />
              <span className="text-xs text-stone-500 font-medium">Đang tải trang...</span>
            </div>
          }>
            {renderCurrentPage()}
          </React.Suspense>
        </div>
      </main>

      {/* Footer - Hiển thị chân trang ở cuối dòng cuộn */}
      <div className="relative z-10">
        <Footer currentPath={currentPath} navigate={navigate} />
      </div>

      {/* Global Branch Order Modal (Chọn chi nhánh khi bấm Đặt món / Thực đơn) */}
      <BranchOrderModal 
        isOpen={isBranchModalOpen} 
        onClose={() => setIsBranchModalOpen(false)} 
        navigate={navigate} 
      />
    </div>
  );
}
