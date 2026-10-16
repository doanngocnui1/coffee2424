import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Quote, 
  Plus, 
  X, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import { getReviews, saveReviews } from '../data/reviews';

export default function CustomerReviewsSection({ className = '' }) {
  const [reviews, setReviews] = useState(getReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

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

  const featuredReviews = reviews
    .filter(r => r.active !== false)
    .slice(0, 3);

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
      <div className="rounded-[36px] sm:rounded-[44px] ios-glass-panel p-8 sm:p-12 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4 border-b border-[#2b170e]/10">
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#8c5932] block">
              CUSTOMER VOICES · 4.9 ★ ON GOOGLE MAPS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2b170e] uppercase tracking-tight">
              Trải Nghiệm Khách Hàng
            </h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="ios-btn-primary text-sm font-bold px-6 py-3 rounded-full cursor-pointer self-start sm:self-auto flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
            <span>Gửi Đánh Giá Của Bạn</span>
          </button>
        </div>

        {/* 3 Clean Quote Cards (Frosted Glass, Large Readable Text) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredReviews.map((rev) => (
            <div 
              key={rev.id}
              className="ios-glass-card rounded-[28px] p-7 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* 5 Stars Rating */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                  ))}
                </div>

                {/* Concise Review Text - To, Rõ, Đọc sướng mắt */}
                <p className="text-base sm:text-lg text-[#3d2719] font-medium leading-relaxed italic">
                  "{rev.content}"
                </p>
              </div>

              {/* Author & Favorite Drink */}
              <div className="pt-4 border-t border-[#2b170e]/10 flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-[#2b170e] block">{rev.author}</span>
                  <span className="text-xs text-[#7d5d48] font-medium">{rev.role}</span>
                </div>
                {rev.favoriteItem && (
                  <span className="text-xs text-[#8c5932] font-bold bg-white/90 px-3 py-1 rounded-full border border-white shadow-2xs">
                    {rev.favoriteItem}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

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
