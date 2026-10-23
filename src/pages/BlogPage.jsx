import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Eye, 
  ArrowRight, 
  Search, 
  Share2, 
  Check, 
  X,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { INITIAL_ARTICLES } from '../data/articles';

export default function BlogPage({ navigate }) {
  const [articles] = useState(() => {
    try {
      const saved = localStorage.getItem('coffee2424_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length <= 3 && !parsed.some(a => a.slug.includes('sinh-vien') || a.slug.includes('xuyen-dem'))) {
          localStorage.setItem('coffee2424_articles', JSON.stringify(INITIAL_ARTICLES));
          return INITIAL_ARTICLES;
        }
        return parsed;
      }
      return INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [readingArticle, setReadingArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Khóa cuộn body và lắng nghe phím ESC để đóng modal đọc bài viết
  useEffect(() => {
    if (!readingArticle) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setReadingArticle(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [readingArticle]);

  const categories = ['Tất cả', 'Không Gian 24/7', 'Góc Học Nhóm & Sinh Viên', 'Chạy Deadline & Freelancer', 'Xả Stress & Một Mình', 'Giao Lưu & Hợp Tác', 'Tiện Nghi 24/7'];

  const filteredArticles = articles.filter(art => {
    const matchCat = activeCategory === 'Tất cả' || art.category === activeCategory;
    const matchSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        art.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = articles[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="pb-20 space-y-12 font-sans">
      
      {/* HEADER BANNER (Frosted Glass Panel) */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto rounded-[36px] sm:rounded-[48px] ios-glass-panel p-8 sm:p-14 text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 text-[#8c5932] text-xs sm:text-sm font-bold uppercase tracking-wider border border-white shadow-xs">
            <BookOpen className="w-4 h-4 text-[#8c5932]" />
            Cẩm Nang & Xu Hướng Cà Phê
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2b170e] uppercase tracking-tight">
            Bài Viết & <span className="text-[#8c5932]">Góc Chia Sẻ</span>
          </h1>
          <p className="text-base sm:text-lg text-[#523d2f] max-w-xl mx-auto font-medium leading-relaxed">
            Khám phá nghệ thuật pha chế, nguồn gốc hạt cà phê nguyên bản và không gian thưởng thức đầy cảm hứng tại COFFEE 24/24.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* FEATURED POST (Kính mờ, chữ to rõ) */}
        {featured && (
          <div 
            onClick={() => setReadingArticle(featured)}
            className="group cursor-pointer ios-glass-card rounded-[36px] overflow-hidden grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 h-72 lg:h-96 relative overflow-hidden bg-stone-100">
              <img 
                src={featured.coverImage} 
                alt={featured.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-[#2b170e] text-white font-bold text-xs uppercase tracking-wider shadow-md">
                Nổi Bật
              </span>
            </div>

            <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#7d5d48] font-medium">
                  <span className="text-[#8c5932] font-bold">{featured.category}</span>
                  <span>•</span>
                  <span>{featured.date}</span>
                  <span>•</span>
                  <span>{featured.readTime}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#2b170e] group-hover:text-[#8c5932] transition-colors leading-snug">
                  {featured.title}
                </h2>

                <p className="text-base text-[#4a3528] line-clamp-3 leading-relaxed">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-[#2b170e] flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                  Đọc toàn bộ bài viết <ArrowRight className="w-4 h-4 text-[#8c5932]" />
                </span>
                <span className="text-xs sm:text-sm text-[#7d5d48] flex items-center gap-1">
                  <Eye className="w-4 h-4" /> {featured.views} lượt đọc
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH & CATEGORY FILTERS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-[#2b170e]/10">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs sm:text-sm px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#2b170e] text-white shadow-md'
                    : 'bg-white/60 text-[#4a3528] hover:bg-white border border-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#85634b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 border border-stone-200 rounded-full pl-9 pr-4 py-2 text-sm text-[#2b170e] placeholder-stone-400 focus:outline-none focus:border-[#2b170e]"
            />
          </div>
        </div>

        {/* ARTICLES GRID (Thẻ kính mờ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredArticles.map(art => (
            <div
              key={art.id}
              onClick={() => setReadingArticle(art)}
              className="ios-glass-card rounded-[28px] overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-stone-100">
                  <img 
                    src={art.coverImage} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <span className="absolute top-3.5 left-3.5 text-xs font-bold px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2b170e] shadow-2xs">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#85634b] font-medium">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="font-bold text-[#2b170e] text-lg group-hover:text-[#8c5932] transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-sm text-[#5c4434] line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#2b170e]/10 mt-2 flex items-center justify-between text-xs sm:text-sm text-[#7d5d48]">
                <span className="font-bold text-[#2b170e] flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                  Đọc ngay <ArrowRight className="w-4 h-4 text-[#8c5932]" />
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Eye className="w-4 h-4" /> {art.views}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* READING ARTICLE MODAL (Frosted Glass) */}
      {readingArticle && (
        <div 
          onClick={() => setReadingArticle(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-3xl border border-white rounded-[36px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200"
          >
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f3ece3] text-[#2b170e]">
                {readingArticle.category}
              </span>
              <button 
                onClick={() => setReadingArticle(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-[#2b170e] leading-snug">
                {readingArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-[#7d5d48] pb-2">
                <span>Tác giả: <strong className="text-[#2b170e]">{readingArticle.author}</strong></span>
                <span>•</span>
                <span>Ngày đăng: {readingArticle.date}</span>
                <span>•</span>
                <span>{readingArticle.readTime}</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden max-h-80 bg-white/40">
              <img 
                src={readingArticle.coverImage} 
                alt={readingArticle.title} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose text-[#2b170e] text-base leading-relaxed whitespace-pre-line space-y-4 font-sans">
              {readingArticle.content}
            </div>

            {/* Share & Actions */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleShare}
                className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#2b170e] text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-[#2b170e]" />}
                <span>{copiedLink ? 'Đã sao chép link!' : 'Chia sẻ bài viết'}</span>
              </button>

              <button
                onClick={() => {
                  setReadingArticle(null);
                  navigate('/dathang');
                }}
                className="px-7 py-3 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Đặt món tại Coffee 24/24</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
