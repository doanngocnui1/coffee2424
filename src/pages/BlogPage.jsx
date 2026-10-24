import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  ShoppingBag,
  LayoutGrid,
  List,
  ArrowUpDown,
  Tag,
  Flame,
  ChevronRight,
  Filter
} from 'lucide-react';
import { INITIAL_ARTICLES } from '../data/articles';

export default function BlogPage({ navigate }) {
  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('coffee2424_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length <= 3 && !parsed.some(a => a.slug && (a.slug.includes('sinh-vien') || a.slug.includes('xuyen-dem')))) {
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
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'views' | 'oldest'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [readingArticle, setReadingArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lắng nghe sự kiện cập nhật bài viết từ Admin CMS
  useEffect(() => {
    const handleArticlesUpdate = () => {
      try {
        const saved = localStorage.getItem('coffee2424_articles');
        if (saved) {
          setArticles(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Lỗi nạp bài viết:', err);
      }
    };
    window.addEventListener('articles-updated', handleArticlesUpdate);
    window.addEventListener('storage', handleArticlesUpdate);
    return () => {
      window.removeEventListener('articles-updated', handleArticlesUpdate);
      window.removeEventListener('storage', handleArticlesUpdate);
    };
  }, []);

  // Khóa cuộn body và lắng nghe phím ESC để đóng modal đọc bài viết
  useEffect(() => {
    if (!readingArticle) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setReadingArticle(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [readingArticle]);

  // Danh mục động từ danh sách bài viết
  const allCategories = ['Tất cả', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))];

  // Chỉ lấy bài viết đang xuất bản (active !== false)
  const activeArticles = articles.filter(art => art.active !== false);

  const filteredArticles = activeArticles
    .filter(art => {
      const matchCat = activeCategory === 'Tất cả' || art.category === activeCategory;
      const q = searchTerm.trim().toLowerCase();
      const matchSearch = !q || 
        (art.title || '').toLowerCase().includes(q) ||
        (art.excerpt || '').toLowerCase().includes(q) ||
        (art.content || '').toLowerCase().includes(q) ||
        (Array.isArray(art.keywords) && art.keywords.some(k => k.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'views') {
        return (Number(b.views) || 0) - (Number(a.views) || 0);
      }
      if (sortBy === 'oldest') {
        return (a.id || 0) - (b.id || 0);
      }
      // newest
      return (b.id || 0) - (a.id || 0);
    });

  const featured = activeArticles.find(a => a.featured) || activeArticles[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="pb-24 space-y-10 sm:space-y-12 font-sans">
      
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
            Khám phá không gian làm việc xuyên đêm, nghệ thuật pha chế và câu chuyện truyền cảm hứng tại COFFEE 24/24.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* FEATURED POST (Kính mờ, chữ to rõ) */}
        {featured && !searchTerm && activeCategory === 'Tất cả' && (
          <div 
            onClick={() => setReadingArticle(featured)}
            className="group cursor-pointer ios-glass-card rounded-[36px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="lg:col-span-7 h-72 lg:h-96 relative overflow-hidden bg-stone-900">
              <img 
                src={featured.coverImage} 
                alt={featured.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-[#2b170e] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-white/20">
                <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                Bài Viết Nổi Bật
              </span>
            </div>

            <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#7d5d48] font-medium flex-wrap">
                  <span className="text-[#8c5932] font-black uppercase tracking-wider bg-amber-500/15 px-2.5 py-0.5 rounded-md">
                    {featured.category}
                  </span>
                  <span>•</span>
                  <span>{featured.date}</span>
                  <span>•</span>
                  <span>{featured.readTime}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#2b170e] group-hover:text-[#8c5932] transition-colors leading-snug">
                  {featured.title}
                </h2>

                <p className="text-sm sm:text-base text-[#4a3528] line-clamp-3 leading-relaxed font-medium">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#2b170e]/10">
                <span className="text-sm font-bold text-[#2b170e] flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                  Đọc toàn bộ bài viết <ArrowRight className="w-4 h-4 text-[#8c5932]" />
                </span>
                <span className="text-xs sm:text-sm text-[#7d5d48] flex items-center gap-1 font-bold">
                  <Eye className="w-4 h-4 text-amber-700" /> {featured.views} lượt đọc
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            BỘ LỌC, TÌM KIẾM, SẮP XẾP & ĐIỀU CHỈNH CHẾ ĐỘ XEM
            ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-sm space-y-4">
          
          {/* Top row: Categories filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {allCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-xs sm:text-sm px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#2b170e] text-white shadow-md'
                    : 'bg-white/90 text-[#4a3528] hover:bg-white hover:text-black border border-stone-200/80 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Bottom row: Search + Sort + View mode switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-stone-200/60">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#85634b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết, cẩm nang, từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-stone-200/90 rounded-full pl-9 pr-8 py-2 text-xs sm:text-sm text-[#2b170e] placeholder-stone-400 focus:outline-none focus:border-[#2b170e] shadow-2xs font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 justify-between sm:justify-end">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-white border border-stone-200/90 rounded-full px-3 py-1.5 shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#2b170e] focus:outline-none cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="views">Lượt xem nhiều</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>

              {/* View Mode Switcher: Grid vs List */}
              <div className="flex items-center p-1 rounded-full bg-stone-100 border border-stone-200 shadow-inner">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#2b170e] shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="Chế độ xem dạng lưới (Grid View)"
                  aria-label="Dạng lưới"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-[#2b170e] shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="Chế độ xem dạng danh sách (List View)"
                  aria-label="Dạng danh sách"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            DANH SÁCH BÀI VIẾT (HIỂN THỊ DẠNG LƯỚI HOẶC DANH SÁCH)
            ========================================================================= */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center rounded-[32px] bg-white/70 border border-white/80 space-y-3">
            <BookOpen className="w-12 h-12 text-stone-400 mx-auto stroke-[1.5]" />
            <h3 className="text-lg font-black text-[#2b170e]">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              Không có bài viết nào khớp với từ khóa "{searchTerm}" hoặc danh mục bạn đã chọn.
            </p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setActiveCategory('Tất cả'); }}
              className="px-5 py-2 rounded-full bg-[#2b170e] text-white text-xs font-bold shadow-sm cursor-pointer hover:bg-black transition-colors"
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* CHẾ ĐỘ XEM 1: DẠNG LƯỚI (GRID VIEW) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredArticles.map(art => (
              <div
                key={art.id}
                onClick={() => setReadingArticle(art)}
                className="ios-glass-card rounded-[28px] overflow-hidden cursor-pointer group flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-white/80 bg-white/75"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-stone-900">
                    <img 
                      src={art.coverImage} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-3.5 left-3.5 text-xs font-black px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2b170e] shadow-2xs uppercase tracking-wider">
                      {art.category}
                    </span>
                    {art.featured && (
                      <span className="absolute top-3.5 right-3.5 text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-2xs flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-white" />
                        Hot
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#85634b] font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {art.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {art.readTime}
                      </span>
                    </div>

                    <h3 className="font-black text-[#2b170e] text-lg group-hover:text-[#8c5932] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5c4434] line-clamp-2 leading-relaxed font-medium">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#2b170e]/10 mt-2 flex items-center justify-between text-xs sm:text-sm text-[#7d5d48]">
                  <span className="font-black text-xs text-[#2b170e] flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                    Đọc ngay <ArrowRight className="w-3.5 h-3.5 text-[#8c5932] stroke-[2.5]" />
                  </span>
                  <span className="flex items-center gap-1 font-bold text-xs">
                    <Eye className="w-3.5 h-3.5 text-amber-700" /> {art.views || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* CHẾ ĐỘ XEM 2: DẠNG DANH SÁCH (LIST VIEW) */
          <div className="space-y-4">
            {filteredArticles.map(art => (
              <div
                key={art.id}
                onClick={() => setReadingArticle(art)}
                className="ios-glass-card rounded-[28px] overflow-hidden cursor-pointer group p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 hover:shadow-xl transition-all duration-300 border border-white/80 bg-white/80"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
                  <div className="relative w-full sm:w-44 h-40 sm:h-28 rounded-2xl overflow-hidden bg-stone-900 shrink-0">
                    <img 
                      src={art.coverImage} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#2b170e] uppercase shadow-2xs">
                      {art.category}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 text-xs text-stone-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {art.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {art.readTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-800 font-bold">
                        <Eye className="w-3.5 h-3.5" />
                        {art.views || 0} lượt đọc
                      </span>
                    </div>

                    <h3 className="font-black text-[#2b170e] text-base sm:text-lg group-hover:text-[#8c5932] transition-colors leading-snug line-clamp-1">
                      {art.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5c4434] line-clamp-2 leading-relaxed font-medium">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-200/60">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2b170e] text-white text-xs font-black shadow-xs group-hover:bg-[#3d2215] transition-colors">
                    <span>Đọc toàn bộ</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* READING ARTICLE MODAL (Render qua Portal để tương thích hoàn toàn 100% Mobile & PC) */}
      {mounted && typeof document !== 'undefined' && readingArticle && createPortal(
        <div 
          onClick={() => setReadingArticle(null)}
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fcfaf7] border border-white rounded-[32px] sm:rounded-[36px] max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 text-[#2b170e]"
          >
            {/* Header modal */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/15 text-[#8c5932] border border-amber-500/30">
                {readingArticle.category}
              </span>
              <button 
                type="button"
                onClick={() => setReadingArticle(null)}
                className="w-10 h-10 rounded-full text-stone-500 hover:text-black hover:bg-stone-200/60 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Title & Meta */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2b170e] leading-snug">
                {readingArticle.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#7d5d48] pb-1 font-medium">
                <span>Tác giả: <strong className="text-[#2b170e] font-black">{readingArticle.author || 'Admin Coffee 24/24'}</strong></span>
                <span>•</span>
                <span>Ngày đăng: {readingArticle.date}</span>
                <span>•</span>
                <span>{readingArticle.readTime}</span>
                <span>•</span>
                <span className="text-amber-800 font-bold">{readingArticle.views || 0} lượt đọc</span>
              </div>
            </div>

            {/* Cover image */}
            <div className="rounded-2xl overflow-hidden max-h-96 bg-stone-900 shadow-md">
              <img 
                src={readingArticle.coverImage} 
                alt={readingArticle.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content formatted */}
            <div className="prose text-[#2b170e] text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-sans font-medium">
              {readingArticle.content}
            </div>

            {/* Keywords tags if present */}
            {Array.isArray(readingArticle.keywords) && readingArticle.keywords.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Từ khóa:
                </span>
                {readingArticle.keywords.map((kw, i) => (
                  <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
                    #{kw}
                  </span>
                ))}
              </div>
            )}

            {/* Share & Actions */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#2b170e] text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Share2 className="w-4 h-4 text-[#2b170e]" />}
                <span>{copiedLink ? 'Đã sao chép link!' : 'Chia sẻ bài viết'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setReadingArticle(null);
                  navigate('/dathang');
                }}
                className="px-6 sm:px-7 py-3 rounded-full bg-[#2b170e] hover:bg-[#3d2215] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Đặt món tại Coffee 24/24</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

