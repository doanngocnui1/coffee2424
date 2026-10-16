import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Coffee,
  ShoppingBag 
} from 'lucide-react';
import { getSiteConfig } from '../data/siteConfig';

export default function Header({ currentPath, navigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    const handleConfigUpdate = () => {
      setSiteConfig(getSiteConfig());
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('site-config-updated', handleConfigUpdate);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('site-config-updated', handleConfigUpdate);
    };
  }, []);

  const navLinks = (siteConfig.navMenu || []).filter(item => item.visible !== false);

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2">
      {/* iOS Frosted Glass Capsule Bar with Specular Highlights */}
      <div className={`max-w-7xl mx-auto rounded-full transition-all duration-300 border border-white/75 bg-white/45 backdrop-blur-3xl shadow-[0_16px_45px_rgba(60,35,15,0.06)] px-4 sm:px-7 ${
        scrolled ? 'py-2 sm:py-2.5 bg-white/70 shadow-lg' : 'py-3 sm:py-3.5'
      }`}>
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div 
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2b170e] to-[#180d08] text-amber-200 flex items-center justify-center shadow-md group-hover:scale-110 group-active:scale-95 transition-all duration-300 shrink-0">
              <Coffee className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight uppercase text-[#2b170e] group-hover:text-[#8c5932] transition-colors leading-tight">
                {siteConfig.brandName || 'COFFEE 24/24'}
              </span>
              <span className="text-[11px] sm:text-xs text-[#704f38] font-semibold tracking-wide">
                {siteConfig.slogan || 'Enjoy Your Life'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.id || link.path}
                  onClick={() => handleNav(link.path)}
                  className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex flex-col items-center group ${
                    isActive 
                      ? 'text-[#2b170e] font-black bg-white/70 shadow-xs' 
                      : 'text-[#614b3d] hover:text-[#2b170e] hover:bg-white/50'
                  }`}
                >
                  <span className="group-hover:scale-105 transition-transform duration-200">{link.label}</span>
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="w-4 h-0.5 rounded-full bg-[#2b170e] mt-0.5 animate-in fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Button: Nút viên thuốc espresso có shimmer sweep */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNav('/dathang')}
              className="ios-btn-primary flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide cursor-pointer whitespace-nowrap shadow-md"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>ĐẶT MÓN</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleNav('/dathang')}
              className="sm:hidden flex items-center gap-1 bg-[#2b170e] text-white font-bold px-3.5 py-1.5 rounded-full text-xs shadow-sm whitespace-nowrap cursor-pointer"
            >
              <span>Đặt món</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white/60 text-[#2b170e] hover:bg-white border border-white/80 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu (Frosted Glass Panel) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-3xl border border-white/80 bg-white/80 backdrop-blur-2xl shadow-xl p-4 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.id || link.path}
                onClick={() => handleNav(link.path)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${
                  isActive 
                    ? 'bg-[#2b170e] text-white font-black' 
                    : 'text-[#4a3427] hover:bg-white/60'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
