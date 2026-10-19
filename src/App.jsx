import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import AboutPage from './pages/AboutPage';
import PromotionsPage from './pages/PromotionsPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import AdminPage from './pages/AdminPage';

import SideBanners from './components/SideBanners';
import { getSiteConfig, syncSiteConfigWithCloud } from './data/siteConfig';
import { subscribeToCloudSiteConfig } from './lib/supabase';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);

  // Sync with browser back/forward buttons, local events & Supabase Cloud
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    const handleConfigUpdate = () => {
      setSiteConfig(getSiteConfig());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('site-config-updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);

    // Tự động kéo cấu hình mới nhất từ Supabase Cloud khi mở trang
    syncSiteConfigWithCloud();

    // Lắng nghe cập nhật Realtime từ Supabase (khi có ai sửa từ máy khác)
    const unsubscribeCloud = subscribeToCloudSiteConfig((newCloudData) => {
      setSiteConfig(prev => ({ ...prev, ...newCloudData }));
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('site-config-updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
      if (typeof unsubscribeCloud === 'function') unsubscribeCloud();
    };
  }, []);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (path) => {
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
    return <AdminPage navigate={navigate} />;
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
              setSelectedBranch(branch);
              navigate('/dathang');
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
      {glassBg.enabled && glassBg.image && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
              glassBg.animation === 'ken_burns' ? 'animate-pulse-subtle scale-105' : ''
            }`}
            style={{
              backgroundImage: `url(${glassBg.image})`,
              opacity: glassBg.opacity ?? 0.38,
              filter: `blur(${glassBg.blur ?? 6}px) brightness(${glassBg.brightness ?? 95}%) contrast(${glassBg.contrast ?? 105}%) saturate(${glassBg.saturate ?? 110}%)`,
              transform: glassBg.animation === 'ken_burns' ? 'scale(1.06)' : 'scale(1.01)'
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
          {renderCurrentPage()}
        </div>
      </main>

      {/* Footer - Hiển thị chân trang ở cuối dòng cuộn */}
      <div className="relative z-10">
        <Footer currentPath={currentPath} navigate={navigate} />
      </div>
    </div>
  );
}
