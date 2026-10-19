import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Quote, 
  Plus, 
  X, 
  Send, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getReviews, saveReviews } from '../data/reviews';
import { getSiteConfig } from '../data/siteConfig';

export default function CustomerReviewsSection({ className = '', reviewsConfig }) {
  const [reviews, setReviews] = useState(getReviews);
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Sync siteConfig updates
  useEffect(() => {
    const handleConfigSync = () => setSiteConfig(getSiteConfig());
    window.addEventListener('site-config-updated', handleConfigSync);
    window.addEventListener('storage', handleConfigSync);
    return () => {
      window.removeEventListener('site-config-updated', handleConfigSync);
      window.removeEventListener('storage', handleConfigSync);
    };
  }, []);

  const currentReviewsConfig = reviewsConfig || siteConfig?.reviewsSection;

  // Carousel slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [formData, setFormData] = useState({
    author: '',
    role: '',
    rating: 5,
    branch: 'Chi nhánh 96 D5, Bình Thạnh',
    favoriteItem: '',
    content: ''
  });

  useEffect(() => {
    const handleSync = () => setReviews(getReviews());
    window.addEventListener('reviews-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('reviews-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const activeReviews = reviews.filter(r => r.active !== false);
  const visibleCount = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, activeReviews.length - visibleCount);
  const safeIndex = Math.min(currentIndex, maxIndex);
  const showNavButtons = activeReviews.length > visibleCount;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.content.trim()) return;

    const newReview = {
      id: 'rev-' + Date.now(),
      author: formData.author.trim(),
      role: formData.role.trim() || 'Khách Hàng',
      avatar: null,
      initial: formData.author.trim().charAt(0).toUpperCase(),
      rating: Number(formData.rating) || 5,
      branch: formData.branch,
      favoriteItem: formData.favoriteItem.trim() || 'Cà Phê Rang Mộc',
      content: formData.content.trim(),
      date: 'Hôm nay',
      verified: true,
      active: true
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveReviews(updated);

    setFormData({
      author: '',
      role: '',
      rating: 5,
      branch: 'Chi nhánh 96 D5, Bình Thạnh',
      favoriteItem: '',
      content: ''
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsModalOpen(false);
    }, 1800);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans ${className}`}>
      {/* Horizontal Carousel (3 trên máy tính, 1 trên điện thoại) */}
      <div className="relative group/reviewcarousel">
        {/* Navigation Arrow Left */}
        {showNavButtons && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-stone-200/90 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md group"
            aria-label="Xem đánh giá trước đó"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {showNavButtons && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#2b170e] text-[#2b170e] hover:text-white border border-stone-200/90 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md group"
            aria-label="Xem đánh giá tiếp theo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}

        {/* Carousel Overflow Track */}
        <div 
          className="overflow-hidden w-full py-2"
          onTouchStart={(e) => setTouchStartX(e.targetTouches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (diff > 45) handleNext();
            else if (diff < -45) handlePrev();
            setTouchStartX(null);
          }}
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${safeIndex * (100 / visibleCount)}%)`
            }}
          >
            {activeReviews.map((rev) => (
              <div 
                key={rev.id}
                className="w-full md:w-1/3 shrink-0 p-2.5 sm:p-3"
              >
                <div className="ios-glass-card rounded-[32px] p-6 sm:p-7 flex flex-col justify-between space-y-5 border border-white/85 shadow-lg hover:shadow-2xl transition-all duration-300 h-full relative group bg-white/70 backdrop-blur-xl">
                  <div className="space-y-4">
                    {/* 5 Stars Rating & Quote Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                        ))}
                      </div>
                      <Quote className="w-6 h-6 text-[#8c5932]/25 group-hover:text-[#8c5932]/45 transition-colors" />
                    </div>

                    {/* Review Text */}
                    <p className="text-sm sm:text-base text-[#3d2719] font-medium leading-relaxed italic">
                      "{rev.content}"
                    </p>
                  </div>

                  {/* Customer Info (Tên khách nguyên vẹn trên 1 dòng, không bị bóp nghẹt xuống dòng) */}
                  <div className="pt-4 border-t border-[#2b170e]/10 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8c5932] to-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {rev.initial || (rev.author ? rev.author.charAt(0).toUpperCase() : 'K')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-[#2b170e] text-sm sm:text-base whitespace-nowrap">
                            {rev.author}
                          </span>
                          {rev.verified !== false && (
                            <span className="inline-flex items-center text-blue-600 shrink-0" title="Đã ghé quán & xác thực">
                              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7d5d48] font-medium truncate">
                          {rev.role || 'Khách Hàng'}
                        </p>
                      </div>
                    </div>

                    {rev.favoriteItem && (
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8c5932] bg-white/90 px-3 py-1.5 rounded-full border border-stone-200/80 shadow-2xs max-w-full">
                          <span className="shrink-0 text-xs">☕</span>
                          <span className="shrink-0 font-medium text-[#7d5d48]">Món ruột:</span>
                          <span className="font-bold truncate text-[#3d2417]">{rev.favoriteItem}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {showNavButtons && maxIndex > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  safeIndex === dotIdx 
                    ? 'w-8 bg-[#8c5932] shadow-xs' 
                    : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Chuyển đến trang đánh giá ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Elegant Action & Trust Bar */}
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        {currentReviewsConfig?.showGoogleRating !== false && (
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-xs text-[#5c3d2e] text-xs sm:text-sm font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentReviewsConfig?.googleRatingText || '4.9 / 5.0 ⭐ trên Google Maps (1.200+ đánh giá)'}</span>
          </div>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="ios-btn-primary text-sm font-bold px-7 py-3 rounded-full cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4 text-white stroke-[2.5]" />
          <span>Gửi Đánh Giá Của Bạn</span>
        </button>
      </div>

      {/* Writing Modal (Frosted Glass) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-2xl border border-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-5 text-[#2b170e] shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#2b170e]/10 pb-3">
              <h3 className="font-black text-lg uppercase text-[#2b170e]">Chia Sẻ Trải Nghiệm</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-black text-[#2b170e] text-lg">Cảm Ơn Bạn!</h4>
                <p className="text-sm text-[#5c4333]">Đánh giá của bạn đã được ghi nhận.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-sm text-[#4a3427] font-bold block mb-1">Tên của bạn *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="VD: Hoàng Nam"
                    className="w-full bg-white/80 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#4a3427] font-bold block mb-1">Món yêu thích nhất</label>
                  <input
                    type="text"
                    value={formData.favoriteItem}
                    onChange={(e) => setFormData({ ...formData, favoriteItem: e.target.value })}
                    placeholder="VD: Cold Brew Cam Vàng"
                    className="w-full bg-white/80 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#4a3427] font-bold block mb-1">Nhận xét của bạn *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Chia sẻ cảm nhận của bạn về đồ uống hoặc không gian quán..."
                    className="w-full bg-white/80 border border-stone-200 rounded-xl p-3 text-sm text-[#2b170e] focus:outline-none focus:border-[#2b170e] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-bold text-sm transition-all cursor-pointer shadow-md"
                >
                  GỬI ĐÁNH GIÁ
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
