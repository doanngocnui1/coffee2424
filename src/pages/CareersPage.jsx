import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  Send, 
  Clock, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Coffee, 
  ChevronRight, 
  ShieldCheck, 
  Check, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Loader2, 
  X, 
  Search, 
  Flame, 
  Star, 
  Calendar, 
  PhoneCall, 
  Mail, 
  HelpCircle, 
  ExternalLink, 
  ChevronDown,
  Eye,
  LayoutGrid,
  List
} from 'lucide-react';
import { getJobs } from '../data/jobs';
import { getBranches } from '../data/branches';
import { getSiteConfig } from '../data/siteConfig';
import { sendApplicationToGoogle } from '../data/candidates';

// Helper an toàn: Chuyển đổi mọi định dạng (mảng hoặc chuỗi xuống dòng) thành mảng chuỗi
const ensureArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    return val.split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
  }
  return [];
};

export default function CareersPage({ navigate }) {
  const [siteConfig, setSiteConfig] = useState(getSiteConfig);
  const careersConfig = siteConfig.careersPage || {};
  const branches = getBranches();
  const [jobs, setJobs] = useState(getJobs);
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' (danh sách nằm ngang) | 'grid' (dạng lưới)

  // Selected job for detailed article modal
  const [viewingJob, setViewingJob] = useState(null);

  useEffect(() => {
    const handleJobsUpdate = () => setJobs(getJobs());
    const handleConfigUpdate = () => setSiteConfig(getSiteConfig());
    window.addEventListener('jobs-updated', handleJobsUpdate);
    window.addEventListener('site-config-updated', handleConfigUpdate);
    window.addEventListener('storage', handleJobsUpdate);
    return () => {
      window.removeEventListener('jobs-updated', handleJobsUpdate);
      window.removeEventListener('site-config-updated', handleConfigUpdate);
      window.removeEventListener('storage', handleJobsUpdate);
    };
  }, []);

  const activeJobs = useMemo(() => jobs.filter(job => job.active !== false), [jobs]);

  // Khóa cuộn trang và lắng nghe phím ESC để đóng modal chi tiết tuyển dụng
  useEffect(() => {
    if (!viewingJob) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setViewingJob(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewingJob]);

  // Quick Application Form State
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    jobId: activeJobs[0]?.id || '',
    branchId: branches[0]?.id || 'all',
    note: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    if (activeJobs.length > 0 && !activeJobs.some(j => j.id === formData.jobId)) {
      setFormData(prev => ({ ...prev, jobId: activeJobs[0].id }));
    }
  }, [activeJobs]);

  // Handle Photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Ảnh chân dung vượt quá 8MB. Vui lòng chọn ảnh dung lượng nhỏ hơn.');
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle CV File selection
  const handleCvChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('File CV vượt quá 15MB. Vui lòng chọn file dung lượng nhỏ hơn.');
      return;
    }
    setCvFile(file);
  };

  // Form Submit Handler: Gửi THẲNG dữ liệu & file lên Google Apps Script, không lưu trên web để không tốn bộ nhớ / database
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert('Vui lòng nhập Họ tên và Số điện thoại!');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const selectedJob = activeJobs.find(j => j.id === formData.jobId);
      const selectedBranch = branches.find(b => b.id === formData.branchId);
      const scriptUrl = careersConfig.googleScriptUrl?.trim();

      // Gửi THẲNG lên Google Sheets & Google Drive qua Google Apps Script Webhook
      await sendApplicationToGoogle({
        scriptUrl: scriptUrl || '',
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        jobTitle: selectedJob?.title || formData.jobId,
        branchName: selectedBranch ? `${selectedBranch.name} (${selectedBranch.district})` : 'Tất cả chi nhánh',
        note: formData.note.trim(),
        photoFile,
        cvFile
      });

      setSubmitted(true);
      if (scriptUrl && scriptUrl.startsWith('http')) {
        setSubmitMessage('Cảm ơn bạn đã nộp hồ sơ! Thông tin, ảnh thẻ và file CV của bạn đã được chuyển thẳng vào Google Sheet và lưu vào Google Drive của Ban Nhân Sự COFFEE 24/24. Phòng Nhân Sự sẽ liên hệ phỏng vấn sớm nhất.');
      } else {
        setSubmitMessage('Cảm ơn bạn đã nộp hồ sơ! (Lưu ý: Quản trị viên chưa cấu hình Webhook URL Google Apps Script trong trang Admin -> Tuyển Dụng để đồng bộ tự động vào Google Sheet).');
      }

      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        jobId: activeJobs[0]?.id || '',
        branchId: branches[0]?.id || 'all',
        note: ''
      });
      setPhotoFile(null);
      setPhotoPreview(null);
      setCvFile(null);

    } catch (err) {
      console.error('Lỗi nộp hồ sơ:', err);
      alert('Đã xảy ra lỗi khi nộp hồ sơ: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectJobToApply = (jobId) => {
    setFormData(prev => ({ ...prev, jobId }));
    if (viewingJob) setViewingJob(null);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const nameInput = formRef.current.querySelector('input[name="fullName"]');
      if (nameInput) nameInput.focus();
    }
  };

  const deptFilters = [
    { id: 'all', label: `Tất Cả (${activeJobs.length})` },
    { id: 'management', label: 'Ban Điều Hành & Quản Lý' },
    { id: 'store', label: 'Khối Cửa Hàng (Barista, Ca Trưởng, Phục Vụ)' },
    { id: 'office', label: 'Văn Phòng (Kế Toán, Marketing, HR, QC)' },
    { id: 'support', label: 'Bảo Vệ & Vệ Sinh' }
  ];

  const filteredJobs = useMemo(() => {
    return activeJobs.filter(job => {
      // Dept filter
      if (selectedDept === 'management' && !['tong-quan-ly', 'giam-doc-van-hanh', 'quan-ly-chi-nhanh'].includes(job.id) && !job.department?.includes('Điều Hành')) return false;
      if (selectedDept === 'store' && !['ca-truong', 'pha-che', 'phuc-vu'].includes(job.id) && !job.department?.includes('Cửa Hàng')) return false;
      if (selectedDept === 'office' && !['ke-toan', 'marketing', 'qc', 'hr'].includes(job.id) && !job.department?.includes('Văn Phòng') && !job.department?.includes('Kế Toán') && !job.department?.includes('Marketing') && !job.department?.includes('Nhân Sự')) return false;
      if (selectedDept === 'support' && !['bao-ve', 've-sinh'].includes(job.id) && !job.department?.includes('An Ninh') && !job.department?.includes('Vệ Sinh')) return false;
      
      // Keyword search
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        return (job.title || '').toLowerCase().includes(q) ||
               (job.department || '').toLowerCase().includes(q) ||
               (job.salary || '').toLowerCase().includes(q) ||
               (job.description || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [activeJobs, selectedDept, searchKeyword]);

  return (
    <div className="pb-20 space-y-14 font-sans">
      
      {/* =========================================================================
          HERO CAREERS BANNER: ĐƯA FORM ỨNG TUYỂN NHANH LÊN THAY HÌNH ẢNH BANNER
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto rounded-[36px] sm:rounded-[48px] bg-white/70 backdrop-blur-2xl border border-white/90 p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(60,35,15,0.07)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* CỘT TRÁI: THÔNG TIN THƯƠNG HIỆU & CHẾ ĐỘ ĐÃI NGỘ */}
            <div className="lg:col-span-6 space-y-5 text-left pt-2">
              {/* Badge Tiêu Đề Nhỏ */}
              {careersConfig.heroBadge !== '' && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#2b170e] text-xs sm:text-sm font-extrabold uppercase tracking-wider border border-white/90 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{careersConfig.heroBadge || 'CƠ HỘI NGHỀ NGHIỆP 24/24'}</span>
                </div>
              )}

              {/* Tiêu đề chính */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2b170e] uppercase leading-[1.25] tracking-tight">
                {careersConfig.heroTitle || 'Gia Nhập Đội Ngũ'} <br />
                {careersConfig.heroTitleHighlight !== '' && (
                  <span className="text-[#8c5932] inline-block mt-1">
                    {careersConfig.heroTitleHighlight || 'COFFEE 24/24'}
                  </span>
                )}
              </h1>

              {/* Mô tả giới thiệu */}
              {careersConfig.heroDescription !== '' && (
                <p className="text-sm sm:text-base text-[#523d2f] font-medium leading-relaxed whitespace-pre-line">
                  {careersConfig.heroDescription || 'COFFEE 24/24 chào đón các nhân tài ở mọi vị trí từ Ban Điều Hành, Văn Phòng đến Khối Cửa Hàng Vận Hành 24/7. Môi trường trẻ trung, chế độ đãi ngộ cạnh tranh và lộ trình thăng tiến rõ ràng.'}
                </p>
              )}

              {/* 3 Huy Hiệu Quyền Lợi & Đãi Ngộ */}
              {careersConfig.showBadges !== false && (
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {(careersConfig.badges && careersConfig.badges.length > 0 ? careersConfig.badges : [
                    { text: 'Cà phê miễn phí mỗi ca', icon: 'coffee' },
                    { text: 'Phụ cấp ca đêm & thưởng KPI', icon: 'award' },
                    { text: 'BHXH đầy đủ & ESOP quản lý', icon: 'shield' }
                  ]).map((b, idx) => {
                    const text = typeof b === 'string' ? b : b.text;
                    if (!text) return null;
                    const iconKey = typeof b === 'object' ? b.icon : 'award';
                    const IconComp = iconKey === 'coffee' ? Coffee : (iconKey === 'shield' ? ShieldCheck : Award);
                    return (
                      <span key={idx} className="text-xs sm:text-sm px-4 py-2 rounded-2xl bg-white/90 text-[#2b170e] font-bold shadow-xs flex items-center gap-2 border border-white">
                        <IconComp className="w-4 h-4 text-amber-700" />
                        <span>{text}</span>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Quick Trust Statistics (Thống kê số liệu tin cậy) */}
              {careersConfig.showStats !== false && (
                <div className="grid grid-cols-3 gap-3 pt-3">
                  {(careersConfig.stats && careersConfig.stats.length > 0 ? careersConfig.stats : [
                    { value: '12+', label: 'Vị Trí Mở Tuyển', highlight: false },
                    { value: '24/7', label: 'Môi Trường Năng Động', highlight: false },
                    { value: '24 Giờ', label: 'Phản Hồi Hồ Sơ', highlight: true }
                  ]).map((st, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/80 border border-white shadow-2xs text-center">
                      <span className={`text-lg sm:text-2xl font-black block ${st.highlight ? 'text-amber-800' : 'text-[#2b170e]'}`}>
                        {st.value}
                      </span>
                      <span className="text-[11px] font-bold text-stone-500 uppercase">
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Recruitment Hotline Box (Hotline Phòng Tuyển Dụng) */}
              {careersConfig.showHotline !== false && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-600/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-amber-800 flex items-center justify-center font-bold shadow-xs shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#7a5843] block">
                        {careersConfig.hotlineLabel || 'Hotline Phòng Tuyển Dụng:'}
                      </span>
                      <a 
                        href={`tel:${(careersConfig.hotlinePhone || '0906916816').replace(/\s+/g, '')}`} 
                        className="text-sm sm:text-base font-black text-[#2b170e] hover:text-amber-800 transition-colors"
                      >
                        {careersConfig.hotlineText || '0906 916 816 (Ms. Thư – HR Manager)'}
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* CỘT PHẢI: FORM ỨNG TUYỂN NHANH THAY THẾ ẢNH BANNER CŨ */}
            <div className="lg:col-span-6 w-full" ref={formRef} id="application-form-box">
              <div className="rounded-[32px] p-6 sm:p-7 bg-white/95 backdrop-blur-xl border border-white shadow-xl space-y-4 relative overflow-hidden">
                
                {/* Form Header */}
                <div className="flex items-start justify-between border-b border-stone-200/80 pb-3">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Hồ Sơ Trực Tuyến 24/7
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#2b170e] tracking-tight">
                      Ứng Tuyển Nhanh
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300">
                    ● Đang nhận hồ sơ
                  </span>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fade-in">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="font-black text-emerald-950 text-xl">ĐÃ NỘP HỒ SƠ THÀNH CÔNG!</h3>
                    <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                      {submitMessage}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-full bg-[#2b170e] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-black transition-colors"
                    >
                      Nộp thêm hồ sơ khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    
                    {/* Họ tên & Số điện thoại */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#3d2719] block mb-1">
                          Họ và tên ứng viên <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          name="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#2b170e] focus:outline-none focus:border-[#2b170e] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#3d2719] block mb-1">
                          Số điện thoại liên hệ <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="09xx xxx xxx"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#2b170e] focus:outline-none focus:border-[#2b170e] focus:bg-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Vị trí & Chi nhánh */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#3d2719] block mb-1">
                          Vị trí muốn ứng tuyển <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.jobId}
                          onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#2b170e] focus:outline-none focus:border-[#2b170e] cursor-pointer"
                        >
                          {activeJobs.map(job => (
                            <option key={job.id} value={job.id}>
                              {job.title} ({job.salary ? job.salary.split('(')[0].trim() : ''})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#3d2719] block mb-1">
                          Chi nhánh mong muốn
                        </label>
                        <select
                          value={formData.branchId}
                          onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#2b170e] focus:outline-none focus:border-[#2b170e] cursor-pointer"
                        >
                          <option value="all">Bất kỳ chi nhánh nào thuận tiện</option>
                          {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.name} ({b.district})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label className="text-xs font-bold text-[#3d2719] block mb-1">
                        Email liên hệ (nếu có)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                      />
                    </div>

                    {/* UPLOAD: ẢNH CHÂN DUNG & FILE CV TRỰC TUYẾN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      
                      {/* 1. Tải ảnh thẻ / ảnh chân dung */}
                      <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2">
                        <span className="text-xs font-bold text-[#3d2719] block">
                          Ảnh Chân Dung / Ảnh Thẻ
                        </span>
                        
                        {photoPreview ? (
                          <div className="flex items-center gap-3">
                            <img 
                              src={photoPreview} 
                              alt="Ảnh xem trước" 
                              className="w-12 h-12 rounded-xl object-cover border border-amber-600/30" 
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] font-bold text-emerald-700 block truncate">
                                ✓ Đã đính kèm ảnh
                              </span>
                              <button
                                type="button"
                                onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                                className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                              >
                                Đổi ảnh khác
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-dashed border-stone-300 text-stone-600 hover:border-amber-600 hover:text-amber-900 cursor-pointer text-xs font-bold transition-all">
                            <ImageIcon className="w-4 h-4 text-amber-600" />
                            <span>Tải Ảnh Thẻ (JPG/PNG)</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handlePhotoChange} 
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>

                      {/* 2. Tải File CV */}
                      <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2">
                        <span className="text-xs font-bold text-[#3d2719] block">
                          File CV / Hồ Sơ Xin Việc
                        </span>

                        {cvFile ? (
                          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                            <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] font-bold text-emerald-950 block truncate">
                                {cvFile.name}
                              </span>
                              <span className="text-[10px] text-emerald-700">
                                ({(cvFile.size / 1024 / 1024).toFixed(1)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCvFile(null)}
                              className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-dashed border-stone-300 text-stone-600 hover:border-amber-600 hover:text-amber-900 cursor-pointer text-xs font-bold transition-all">
                            <Upload className="w-4 h-4 text-amber-600" />
                            <span>Tải File CV (PDF/Word)</span>
                            <input 
                              type="file" 
                              accept=".pdf,.doc,.docx,image/*" 
                              onChange={handleCvChange} 
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>

                    </div>

                    {/* Ghi chú / Lời nhắn */}
                    <div>
                      <label className="text-xs font-bold text-[#3d2719] block mb-1">
                        Kinh nghiệm hoặc lời nhắn gửi thêm
                      </label>
                      <textarea
                        rows={2}
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="VD: Đã có 1 năm kinh nghiệm pha chế, có thể làm ca đêm..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-[#2b170e] focus:outline-none focus:border-[#2b170e] focus:bg-white resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || activeJobs.length === 0}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2b170e] via-[#4a2818] to-[#2b170e] hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          <span>Đang Gửi Hồ Sơ Lên Hệ Thống...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-400" />
                          <span>NỘP HỒ SƠ ỨNG TUYỂN NGAY</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-stone-500 font-medium pt-0.5">
                      🔒 Thông tin và hồ sơ của bạn được lưu bảo mật & gửi trực tiếp đến Ban Nhân Sự COFFEE 24/24.
                    </p>

                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          DANH SÁCH BÀI VIẾT & VỊ TRÍ TUYỂN DỤNG CHI TIẾT
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Heading & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-5">
          <div>
            <span className="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-700" />
              Cơ Hội Nghề Nghiệp ({activeJobs.length} vị trí đang nhận hồ sơ)
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2b170e] mt-1 tracking-tight">
              Các Vị Trí Đang Mở Tuyển Dụng
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo vị trí, phòng ban, mức lương..."
              className="w-full bg-white/90 border border-stone-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#2b170e] placeholder-stone-400 focus:outline-none focus:border-[#2b170e] shadow-xs"
            />
          </div>
        </div>

        {/* Department Filter Tabs & View Switcher (Danh sách nằm ngang vs Dạng lưới) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
            {deptFilters.map(dept => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === dept.id
                    ? 'bg-[#2b170e] text-white shadow-md'
                    : 'bg-white/80 text-[#4a3528] hover:bg-white border border-stone-200/70 shadow-2xs'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          {/* View Switcher: Danh Sách Nằm Ngang (Mặc định) vs Dạng Lưới */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/90 border border-stone-200/80 shadow-2xs shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#2b170e] text-white shadow-xs'
                  : 'text-stone-600 hover:text-black hover:bg-stone-100'
              }`}
              title="Hiển thị theo danh sách nằm ngang"
            >
              <List className="w-4 h-4 text-amber-400" />
              <span>Danh sách</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#2b170e] text-white shadow-xs'
                  : 'text-stone-600 hover:text-black hover:bg-stone-100'
              }`}
              title="Hiển thị dạng lưới thẻ"
            >
              <LayoutGrid className="w-4 h-4 text-amber-400" />
              <span>Dạng lưới</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            CHẾ ĐỘ 1: BÀI VIẾT HIỂN THỊ THEO DẠNG DANH SÁCH NẰM NGANG (MẶC ĐỊNH)
            ========================================================================= */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="rounded-[32px] p-5 sm:p-7 bg-white/85 backdrop-blur-xl border border-white shadow-[0_15px_35px_rgba(60,35,15,0.06)] hover:border-amber-600/40 transition-all duration-300 group hover:-translate-y-0.5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* CỘT TRÁI: THÔNG TIN VỊ TRÍ, BADGES, TIÊU ĐỀ & YÊU CẦU */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {job.urgent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                          <Flame className="w-3 h-3" />
                          Tuyển Gấp
                        </span>
                      )}

                      {job.featured && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#2b170e] text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                          <Star className="w-3 h-3 fill-[#2b170e]" />
                          Vị Trí Hot
                        </span>
                      )}

                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-[#5c3d2e] border border-stone-200">
                        {job.department}
                      </span>

                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-900">
                        {job.type}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 
                      onClick={() => setViewingJob(job)}
                      className="text-lg sm:text-xl lg:text-2xl font-black text-[#2b170e] group-hover:text-amber-800 transition-colors cursor-pointer leading-tight"
                    >
                      {job.title}
                    </h3>

                    {/* Shifts & Locations */}
                    <div className="flex flex-wrap gap-y-1.5 gap-x-4 text-xs font-semibold text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{job.shift}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{Array.isArray(job.locations) ? job.locations.join(' | ') : job.locations}</span>
                      </span>
                    </div>

                    {/* Description snippet */}
                    <p className="text-xs sm:text-sm text-[#5c4333] leading-relaxed line-clamp-2 max-w-3xl">
                      {job.description}
                    </p>

                    {/* Requirements highlights */}
                    {ensureArray(job.requirements).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {ensureArray(job.requirements).slice(0, 3).map((req, i) => (
                          <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 text-[#3d2719] font-medium truncate max-w-md">
                            ✓ {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CỘT PHẢI: MỨC THU NHẬP NỔI BẬT & NÚT HÀNH ĐỘNG */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-200/80">
                    
                    {/* Salary Box */}
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block mb-1">
                        Mức thu nhập:
                      </span>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-600/25 text-[#8c5932] font-black text-xs sm:text-sm shadow-2xs">
                        <DollarSign className="w-4 h-4 text-amber-800 shrink-0" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setViewingJob(job)}
                        className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200/90 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-700" />
                        <span>Xem Chi Tiết</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectJobToApply(job.id)}
                        className="px-5 py-2.5 rounded-2xl bg-[#2b170e] hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all whitespace-nowrap active:scale-95"
                      >
                        <span>Ứng tuyển ngay</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          /* =========================================================================
              CHẾ ĐỘ 2: DẠNG LƯỚI (GRID VIEW) - ĐÃ SỬA LỖI LƯƠNG & BADGES BỊ CO RÚM
              ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="rounded-[32px] p-6 sm:p-7 bg-white/85 backdrop-blur-xl border border-white shadow-[0_15px_35px_rgba(60,35,15,0.06)] flex flex-col justify-between hover:border-amber-600/40 transition-all duration-300 group hover:-translate-y-0.5 space-y-4"
              >
                <div className="space-y-3.5">
                  
                  {/* DÒNG 1: BADGES CHIẾM TRỌN BỀ NGANG, KHÔNG CHUNG DÒNG VỚI LƯƠNG -> KHÔNG BỊ CO RÚM */}
                  <div className="flex flex-wrap items-center gap-1.5 w-full">
                    {job.urgent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                        <Flame className="w-3 h-3" />
                        Tuyển Gấp
                      </span>
                    )}

                    {job.featured && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#2b170e] text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                        <Star className="w-3 h-3 fill-[#2b170e]" />
                        Vị Trí Hot
                      </span>
                    )}

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-[#5c3d2e] border border-stone-200">
                      {job.department}
                    </span>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-900">
                      {job.type}
                    </span>
                  </div>

                  {/* DÒNG 2: TIÊU ĐỀ CÔNG VIỆC */}
                  <div>
                    <h3 
                      onClick={() => setViewingJob(job)}
                      className="text-lg sm:text-xl font-black text-[#2b170e] group-hover:text-amber-800 transition-colors cursor-pointer leading-tight"
                    >
                      {job.title}
                    </h3>
                  </div>

                  {/* DÒNG 3: KHỐI MỨC THU NHẬP NẰM RIÊNG BIỆT - RỘNG RÃI & SANG TRỌNG */}
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-amber-500/10 border border-amber-600/20 text-[#8c5932] font-black text-xs sm:text-sm">
                    <DollarSign className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="leading-snug">{job.salary}</span>
                  </div>

                  {/* DÒNG 4: CA LÀM & ĐỊA ĐIỂM */}
                  <div className="flex flex-wrap gap-y-1.5 gap-x-4 text-xs font-semibold text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{job.shift}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{Array.isArray(job.locations) ? job.locations.join(' | ') : job.locations}</span>
                    </span>
                  </div>

                  {/* DÒNG 5: MÔ TẢ TÓM TẮT */}
                  <p className="text-xs sm:text-sm text-[#5c4333] leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {/* DÒNG 6: YÊU CẦU TIÊU BIỂU */}
                  {ensureArray(job.requirements).length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block">
                        Yêu cầu tiêu biểu:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {ensureArray(job.requirements).slice(0, 2).map((req, i) => (
                          <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 text-[#3d2719] font-medium truncate max-w-xs">
                            ✓ {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* DÒNG 7: NÚT HÀNH ĐỘNG DƯỚI CÙNG */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setViewingJob(job)}
                    className="text-xs font-bold text-stone-600 hover:text-black flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-700" />
                    <span>Xem Chi Tiết Bài Viết</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectJobToApply(job.id)}
                    className="px-4 py-2 rounded-full bg-[#2b170e] hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>Ứng tuyển ngay</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* =========================================================================
          MODAL CHI TIẾT BÀI VIẾT TUYỂN DỤNG (XEM TOÀN BỘ THÔNG TIN BÀI VIẾT)
          ========================================================================= */}
      {viewingJob && (
        <div 
          onClick={() => setViewingJob(null)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[32px] sm:rounded-[36px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 border border-stone-200"
          >
            
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setViewingJob(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Đóng"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                  {viewingJob.department}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-900">
                  {viewingJob.type}
                </span>
                {viewingJob.urgent && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Tuyển Gấp
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#2b170e] leading-tight">
                {viewingJob.title}
              </h3>
              <div className="text-base font-black text-amber-800">
                💰 Mức thu nhập: {viewingJob.salary}
              </div>
            </div>

            {/* Meta tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>Ca làm:</strong> {viewingJob.shift}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>Hạn nộp:</strong> {viewingJob.deadline || 'Tuyển liên tục'}</span>
              </div>
              <div className="sm:col-span-2 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span><strong>Địa điểm:</strong> {Array.isArray(viewingJob.locations) ? viewingJob.locations.join(' | ') : viewingJob.locations}</span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-[#2b170e] tracking-wider">
                Mô tả công việc:
              </h4>
              <p className="text-sm text-[#4a3528] leading-relaxed">
                {viewingJob.description}
              </p>
            </div>

            {/* Responsibilities */}
            {ensureArray(viewingJob.responsibilities).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#2b170e] tracking-wider">
                  Trách nhiệm chính:
                </h4>
                <ul className="space-y-1.5 text-sm text-[#4a3528]">
                  {ensureArray(viewingJob.responsibilities).map((res, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">•</span>
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {ensureArray(viewingJob.requirements).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#2b170e] tracking-wider">
                  Yêu cầu ứng viên:
                </h4>
                <ul className="space-y-1.5 text-sm text-[#4a3528]">
                  {ensureArray(viewingJob.requirements).map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {ensureArray(viewingJob.benefits).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#2b170e] tracking-wider">
                  Quyền lợi & Đãi ngộ:
                </h4>
                <ul className="space-y-1.5 text-sm text-[#4a3528]">
                  {ensureArray(viewingJob.benefits).map((ben, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Apply CTA */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-stone-500">
                Sẵn sàng tham gia đại gia đình COFFEE 24/24?
              </span>
              <button
                type="button"
                onClick={() => handleSelectJobToApply(viewingJob.id)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Send className="w-4 h-4 text-white" />
                <span>ỨNG TUYỂN VỊ TRÍ NÀY NGAY</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
