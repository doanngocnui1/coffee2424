import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Sparkles, 
  ArrowRight, 
  Wifi, 
  Zap, 
  Wind, 
  Armchair, 
  UtensilsCrossed, 
  Users, 
  Laptop, 
  Gamepad2, 
  Briefcase,
  BookOpen,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  X,
  Share2,
  Check,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { INITIAL_ARTICLES } from '../data/articles';
import { getBranches } from '../data/branches';
import { getJobs } from '../data/jobs';

export default function AboutUnifiedPage({ navigate, initialSection = 'story' }) {
  const [activeTab, setActiveTab] = useState(initialSection);
  const branches = getBranches();
  const [jobs, setJobs] = useState(getJobs);

  // Articles state & Reading modal
  const [articles] = useState(() => {
    try {
      const saved = localStorage.getItem('coffee2424_articles');
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });
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

  // Jobs state & Application Form
  const activeJobs = jobs.filter(job => job.active !== false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    jobId: activeJobs[0]?.id || '',
    branchId: branches[0]?.id || '',
    note: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleJobsUpdate = () => setJobs(getJobs());
    window.addEventListener('jobs-updated', handleJobsUpdate);
    window.addEventListener('storage', handleJobsUpdate);
    return () => {
      window.removeEventListener('jobs-updated', handleJobsUpdate);
      window.removeEventListener('storage', handleJobsUpdate);
    };
  }, []);

  // Smooth scroll to initial section on mount or prop change
  useEffect(() => {
    if (initialSection) {
      setActiveTab(initialSection);
      const timer = setTimeout(() => {
        const el = document.getElementById(initialSection);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [initialSection]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        phone: '',
        jobId: activeJobs[0]?.id || '',
        branchId: branches[0]?.id || '',
        note: ''
      });
    }, 4000);
  };

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const missions = [
    {
      icon: <Users className="w-6 h-6 text-amber-400" />,
      title: 'Sinh Viên Học Nhóm',
      desc: 'Bàn họp rộng 8-12 chỗ, ổ điện từng ghế, wifi tốc độ cao. Không gian thoải mái ôn thi và chạy đồ án xuyên đêm.'
    },
    {
      icon: <Laptop className="w-6 h-6 text-amber-400" />,
      title: 'Chạy Deadline & Freelancer',
      desc: 'Ghế đệm công thái học chống mỏi lưng, điều hòa mát lạnh 24/24, kích thích nguồn năng lượng sáng tạo.'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-amber-400" />,
      title: 'Gặp Gỡ & Hợp Tác',
      desc: 'Không gian lịch sự, phân khu tách biệt phù hợp trao đổi công việc, gặp gỡ đối tác và họp dự án.'
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-amber-400" />,
      title: 'Xả Stress & Một Mình',
      desc: 'Góc sofa êm ái, nhâm nhi ly nước ngon, cắm tai nghe thư giãn và nạp lại năng lượng sau chuỗi ngày làm việc.'
    }
  ];

  return (
    <div className="bg-[#0d0b09] text-stone-100 pb-24 font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* 1. HERO BANNER - VỀ COFFEE 24/24 */}
      <section className="relative py-16 sm:py-24 bg-[#14110e] border-b border-[#1f1914] text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-amber-400 font-bold block">
            ABOUT COFFEE 24/24 · ENJOY YOUR LIFE
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-black text-stone-100 uppercase tracking-tight leading-tight">
            Về COFFEE 24/24
          </h1>
          
          <p className="text-base sm:text-lg text-stone-200 max-w-2xl mx-auto leading-relaxed font-normal">
            Không chỉ là những ly cà phê rang mộc nguyên bản, chúng tôi kiến tạo trạm dừng chân 24/7 tiện nghi — nơi bạn tự do học tập, làm việc và tận hưởng trọn vẹn từng khoảnh khắc cuộc sống.
          </p>

          {/* Quick Section Navigation Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => scrollToSection('sec-story')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'sec-story'
                  ? 'bg-stone-100 text-stone-950 font-black shadow-md'
                  : 'bg-[#1e1814] text-stone-200 hover:text-white border border-[#2b221b]'
              }`}
            >
              Không Gian & Chi Nhánh
            </button>
            <button
              onClick={() => scrollToSection('sec-journal')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'sec-journal'
                  ? 'bg-stone-100 text-stone-950 font-black shadow-md'
                  : 'bg-[#1e1814] text-stone-200 hover:text-white border border-[#2b221b]'
              }`}
            >
              Cẩm Nang & Bài Viết
            </button>
            <button
              onClick={() => scrollToSection('sec-careers')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'sec-careers'
                  ? 'bg-stone-100 text-stone-950 font-black shadow-md'
                  : 'bg-[#1e1814] text-stone-200 hover:text-white border border-[#2b221b]'
              }`}
            >
              Gia Nhập Đội Ngũ ({activeJobs.length})
            </button>
          </div>
        </div>
      </section>

      {/* 2. KHỐI 1: KHÔNG GIAN & CHI NHÁNH */}
      <div id="sec-story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 space-y-16">
        
        {/* Sứ mệnh 4 đối tượng */}
        <div className="space-y-8">
          <div className="space-y-1 pb-4 border-b border-[#1f1914]">
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-amber-400 font-bold block">
              OUR SPACES & PURPOSE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-100 uppercase tracking-tight">
              Không Gian Dành Riêng Cho Bạn
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {missions.map((m, idx) => (
              <div 
                key={idx}
                className="bg-[#14110e] p-7 rounded-3xl border border-[#221c17] hover:border-amber-500/40 transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1e1814] border border-[#2b221b] flex items-center justify-center">
                  {m.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">{m.title}</h3>
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Chi nhánh thực tế */}
        <div className="space-y-8">
          <div className="space-y-1 pb-4 border-b border-[#1f1914]">
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-amber-400 font-bold block">
              STORE LOCATIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-100 uppercase tracking-tight">
              Hệ Thống 2 Chi Nhánh TP.HCM
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#14110e] rounded-3xl overflow-hidden border border-[#221c17] hover:border-amber-500/40 transition-all group">
              <div className="h-64 sm:h-72 overflow-hidden bg-[#1a1410]">
                <img 
                  src="/images/branch_downtown.jpg" 
                  alt="Chi nhánh 413 Phan Huy Ích" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-7 space-y-3">
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  CHI NHÁNH 413 PHAN HUY ÍCH
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">413 Phan Huy Ích, P. An Hội Tây</h3>
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
                  Không gian 2 tầng rộng thoáng, máy lạnh mát rượi 24/24, ổ cắm từng bàn, phục vụ mì xào & bánh nướng thâu đêm.
                </p>
              </div>
            </div>

            <div className="bg-[#14110e] rounded-3xl overflow-hidden border border-[#221c17] hover:border-amber-500/40 transition-all group">
              <div className="h-64 sm:h-72 overflow-hidden bg-[#1a1410]">
                <img 
                  src="/images/branch_rooftop.jpg" 
                  alt="Chi nhánh 96 Đường D5" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-7 space-y-3">
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  CHI NHÁNH 96 ĐƯỜNG D5
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">96 Đường D5, P. Thạnh Mỹ Tây</h3>
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
                  Bàn dài học nhóm chuyên biệt, wifi Gigabit cực mạnh, góc sofa êm ái xả stress và ngắm phố đêm Sài Gòn.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. KHỐI 2: CẨM NANG & BÀI VIẾT CÀ PHÊ */}
      <div id="sec-journal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 space-y-8">
        <div className="space-y-1 pb-4 border-b border-[#1f1914]">
          <span className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-amber-400 font-bold block">
            COFFEE JOURNAL & CULTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-100 uppercase tracking-tight">
            Cẩm Nang & Bài Viết Cà Phê
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div 
              key={art.id}
              onClick={() => setReadingArticle(art)}
              className="group cursor-pointer bg-[#14110e] rounded-3xl overflow-hidden border border-[#221c17] hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div className="h-52 overflow-hidden bg-[#1a1410] relative">
                <img 
                  src={art.coverImage} 
                  alt={art.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full bg-[#0d0b09]/80 text-amber-400 border border-[#261f1a]">
                  {art.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="text-xs sm:text-sm text-stone-300 font-mono">
                  {art.date} • {art.readTime}
                </div>
                <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h3>
              </div>

              <div className="px-6 pb-6 pt-2 text-sm font-bold text-amber-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Đọc bài viết</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. KHỐI 3: GIA NHẬP ĐỘI NGŨ & TUYỂN DỤNG */}
      <div id="sec-careers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 space-y-8">
        
        <div className="space-y-1 pb-4 border-b border-[#1f1914]">
          <span className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-amber-400 font-bold block">
            CAREER OPPORTUNITIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-100 uppercase tracking-tight">
            Gia Nhập Đội Ngũ COFFEE 24/24
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Danh sách vị trí (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {activeJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-[#14110e] p-6 rounded-3xl border border-[#221c17] hover:border-amber-500/40 transition-all space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                      {job.department} • {job.type}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">{job.title}</h3>
                  </div>
                  <span className="text-sm font-black text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 whitespace-nowrap self-start sm:self-auto">
                    {job.salary}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
                  {job.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#1f1914] text-xs sm:text-sm">
                  <span className="text-stone-300 font-medium">{job.shift}</span>
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, jobId: job.id }));
                      const form = document.getElementById('apply-box');
                      if (form) form.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Ứng tuyển vị trí này</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form ứng tuyển nhanh (Right 5 cols) */}
          <div className="lg:col-span-5" id="apply-box">
            <div className="bg-[#14110e] rounded-3xl p-6 sm:p-8 border border-[#221c17] sticky top-28 space-y-5 shadow-xl">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  FAST APPLICATION
                </span>
                <h3 className="text-xl font-black text-white mt-1">Ứng Tuyển Nhanh</h3>
                <p className="text-sm text-stone-300 mt-1">
                  Phòng Nhân sự sẽ liên hệ trao đổi cùng bạn trong vòng 24 giờ.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                  <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto" />
                  <h4 className="font-black text-emerald-300 text-base">Đã Gửi Hồ Sơ Thành Công!</h4>
                  <p className="text-sm text-stone-200">
                    Cảm ơn bạn. Phòng Nhân sự sẽ liên hệ qua điện thoại sớm nhất.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-stone-200 block mb-1.5">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-[#1e1814] border border-[#2b221b] rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-stone-200 block mb-1.5">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="09xx xxx xxx"
                      className="w-full bg-[#1e1814] border border-[#2b221b] rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-stone-200 block mb-1.5">Vị trí ứng tuyển</label>
                    <select
                      value={formData.jobId}
                      onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                      className="w-full bg-[#1e1814] border border-[#2b221b] rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {activeJobs.map(job => (
                        <option key={job.id} value={job.id} className="bg-[#14110e]">
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-stone-200 block mb-1.5">Chi nhánh mong muốn</label>
                    <select
                      value={formData.branchId}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      className="w-full bg-[#1e1814] border border-[#2b221b] rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="all" className="bg-[#14110e]">Bất kỳ chi nhánh nào</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id} className="bg-[#14110e]">{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-stone-200 block mb-1.5">Ghi chú thêm</label>
                    <textarea
                      rows={2}
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Kinh nghiệm hoặc thời gian có thể làm..."
                      className="w-full bg-[#1e1814] border border-[#2b221b] rounded-xl p-3 text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm cursor-pointer transition-all shadow-md"
                  >
                    NỘP HỒ SƠ ỨNG TUYỂN
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* READING ARTICLE MODAL */}
      {readingArticle && (
        <div 
          onClick={() => setReadingArticle(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#16120e] border border-[#261f1a] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl text-stone-100 relative my-auto animate-in zoom-in-95 duration-200"
          >
            
            <div className="flex items-center justify-between pb-3 border-b border-[#261f1a]">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1f1813] text-amber-400 border border-[#2d221b]">
                {readingArticle.category}
              </span>
              <button 
                onClick={() => setReadingArticle(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                {readingArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-stone-300 pb-2">
                <span>Tác giả: <strong className="text-amber-400">{readingArticle.author}</strong></span>
                <span>•</span>
                <span>Ngày đăng: {readingArticle.date}</span>
                <span>•</span>
                <span>{readingArticle.readTime}</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden max-h-80 bg-[#1a1410] border border-[#261f1a]">
              <img 
                src={readingArticle.coverImage} 
                alt={readingArticle.title} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-invert text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-sans">
              {readingArticle.content}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#261f1a] flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleShare}
                className="px-5 py-2.5 rounded-full bg-[#1e1814] hover:bg-[#28201a] text-stone-200 text-xs sm:text-sm font-bold border border-[#2d221b] flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
                <span>{copiedLink ? 'Đã sao chép link!' : 'Chia sẻ bài viết'}</span>
              </button>

              <button
                onClick={() => {
                  setReadingArticle(null);
                  navigate('/dathang');
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Coffee className="w-4 h-4" />
                <span>Đặt món tại Coffee 24/24</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
