import React, { useState, useEffect } from 'react';
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
  Check
} from 'lucide-react';
import { getJobs } from '../data/jobs';
import { getBranches } from '../data/branches';

export default function CareersPage({ navigate }) {
  const branches = getBranches();
  const [jobs, setJobs] = useState(getJobs);
  const [selectedDept, setSelectedDept] = useState('all');

  useEffect(() => {
    const handleJobsUpdate = () => {
      setJobs(getJobs());
    };
    window.addEventListener('jobs-updated', handleJobsUpdate);
    window.addEventListener('storage', handleJobsUpdate);
    return () => {
      window.removeEventListener('jobs-updated', handleJobsUpdate);
      window.removeEventListener('storage', handleJobsUpdate);
    };
  }, []);

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
    if (activeJobs.length > 0 && !activeJobs.some(j => j.id === formData.jobId)) {
      setFormData(prev => ({ ...prev, jobId: activeJobs[0].id }));
    }
  }, [activeJobs]);

  const handleSubmit = (e) => {
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

  const handleSelectJobToApply = (jobId) => {
    setFormData(prev => ({ ...prev, jobId }));
    const formElement = document.getElementById('application-form-box');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const deptFilters = [
    { id: 'all', label: `Tất Cả (${activeJobs.length})` },
    { id: 'management', label: 'Ban Điều Hành & Quản Lý' },
    { id: 'store', label: 'Barista, Ca Trưởng & Phục Vụ' },
    { id: 'office', label: 'Văn Phòng (Kế Toán, Marketing, HR, QC)' },
    { id: 'support', label: 'Bảo Vệ & Vệ Sinh' }
  ];

  const filteredJobs = activeJobs.filter(job => {
    if (selectedDept === 'all') return true;
    if (selectedDept === 'management') {
      return ['tong-quan-ly', 'giam-doc-van-hanh', 'quan-ly-chi-nhanh'].includes(job.id);
    }
    if (selectedDept === 'store') {
      return ['ca-truong', 'pha-che', 'phuc-vu'].includes(job.id);
    }
    if (selectedDept === 'office') {
      return ['ke-toan', 'marketing', 'qc', 'hr'].includes(job.id);
    }
    if (selectedDept === 'support') {
      return ['bao-ve', 've-sinh'].includes(job.id);
    }
    return true;
  });

  return (
    <div className="pb-20 space-y-16 font-sans">
      
      {/* HERO CAREERS (Frosted Glass Panel) */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto rounded-[36px] sm:rounded-[48px] bg-white/60 backdrop-blur-2xl border border-white/80 p-8 sm:p-14 shadow-[0_15px_40px_rgba(60,35,15,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#2b170e] text-xs sm:text-sm font-bold uppercase tracking-wider border border-white/80 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Cơ Hội Nghề Nghiệp 24/24</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2b170e] uppercase leading-tight tracking-tight">
                Gia Nhập Đội Ngũ <br />
                <span className="text-[#5a3825]">COFFEE 24/24</span>
              </h1>

              <p className="text-base sm:text-lg text-[#523d2f] font-medium max-w-xl leading-relaxed">
                COFFEE 24/24 chào đón các nhân tài ở mọi vị trí từ Ban Điều Hành, Văn Phòng đến Khối Cửa Hàng Vận Hành 24/7. Môi trường trẻ trung, chế độ đãi ngộ cạnh tranh và lộ trình thăng tiến rõ ràng.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <span className="text-xs sm:text-sm px-4 py-2 rounded-full bg-white text-[#2b170e] font-bold shadow-xs flex items-center gap-2 border border-stone-100">
                  <Coffee className="w-4 h-4 text-amber-800" />
                  Cà phê miễn phí mỗi ca
                </span>
                <span className="text-xs sm:text-sm px-4 py-2 rounded-full bg-white text-[#2b170e] font-bold shadow-xs flex items-center gap-2 border border-stone-100">
                  <Award className="w-4 h-4 text-amber-800" />
                  Phụ cấp ca đêm & thưởng KPI
                </span>
                <span className="text-xs sm:text-sm px-4 py-2 rounded-full bg-white text-[#2b170e] font-bold shadow-xs flex items-center gap-2 border border-stone-100">
                  <ShieldCheck className="w-4 h-4 text-amber-800" />
                  BHXH đầy đủ & ESOP quản lý
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[32px] overflow-hidden border border-white/80 shadow-xl h-72 sm:h-84 bg-white/40 group relative">
                <img 
                  src="/images/career_team.jpg" 
                  alt="Đội ngũ Coffee 24/24" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-xs font-mono text-amber-300 font-bold block uppercase tracking-wider">Hệ Thống Coffee 24/24</span>
                    <h3 className="text-lg sm:text-xl font-black">Nơi Bạn Tự Do Phát Triển Bản Thân</h3>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* JOBS LIST & APPLICATION FORM */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* JOBS LIST (Left column) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                Vị Trí Mở Tuyển ({activeJobs.length} vị trí đang nhận hồ sơ)
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#2b170e] mt-1">Các Vị Trí Đang Tuyển Dụng</h2>
            </div>
          </div>

          {/* Department Filter Tabs (Kính mờ) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {deptFilters.map(dept => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === dept.id
                    ? 'bg-[#2b170e] text-white shadow-md'
                    : 'bg-white/60 text-[#4a3528] hover:bg-white border border-white/80'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          {/* Job Openings List (Thẻ kính mờ, chữ to rõ) */}
          <div className="space-y-5">
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="ios-glass-card rounded-[28px] p-7 space-y-4"
              >
                {/* Job Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[#8c5932] border border-stone-200">
                        {job.department}
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f3ece3] text-[#5c4333]">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#2b170e] mt-1">
                      {job.title}
                    </h3>
                  </div>

                  <span className="text-sm sm:text-base font-black text-[#8c5932] bg-white/90 px-4 py-1.5 rounded-full border border-white shadow-2xs whitespace-nowrap self-start">
                    {job.salary}
                  </span>
                </div>

                {/* Shifts & Locations */}
                <div className="flex flex-wrap gap-y-1.5 gap-x-5 text-sm text-[#614b3d] font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#8c5932]" />
                    {job.shift}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#8c5932]" />
                    {job.locations.join(', ')}
                  </span>
                </div>

                {/* Description (To rõ, dễ đọc) */}
                <p className="text-base text-[#4a3528] leading-relaxed font-normal">
                  {job.description}
                </p>

                {/* Requirements */}
                <div className="space-y-2 pt-3 border-t border-[#2b170e]/10">
                  <span className="text-xs font-bold text-[#7d5d48] uppercase tracking-wider block">Yêu cầu tiêu biểu:</span>
                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                    {job.requirements.map((req, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-white/80 text-[#3d2719] border border-stone-200 font-medium">
                        ✓ {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Apply action button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Đang nhận hồ sơ
                  </span>

                  <button
                    type="button"
                    onClick={() => handleSelectJobToApply(job.id)}
                    className="ios-btn-primary px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Ứng tuyển ngay</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* APPLICATION FORM (Right column) */}
        <div className="lg:col-span-5">
          <div id="application-form-box" className="ios-glass-panel rounded-[32px] p-7 sm:p-8 sticky top-28 shadow-xl space-y-5">
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Hồ Sơ Trực Tuyến</span>
              <h3 className="text-2xl font-black text-[#2b170e] mt-0.5">Ứng Tuyển Nhanh</h3>
              <p className="text-sm text-[#5c4333] mt-1">
                Điền thông tin bên dưới, phòng Nhân sự COFFEE 24/24 sẽ liên hệ trao đổi trong vòng 24 giờ.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-black text-emerald-950 text-lg">Đã Gửi Hồ Sơ Thành Công!</h4>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  Cảm ơn bạn đã quan tâm gia nhập gia đình COFFEE 24/24. Phòng Nhân sự sẽ liên hệ qua điện thoại sớm nhất.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-[#3d2719] block mb-1">Họ và tên ứng viên *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-white/90 border border-stone-200 rounded-2xl px-4 py-3 text-sm text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#3d2719] block mb-1">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="09xx xxx xxx"
                    className="w-full bg-white/90 border border-stone-200 rounded-2xl px-4 py-3 text-sm text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#3d2719] block mb-1">Vị trí muốn ứng tuyển *</label>
                  <select
                    value={formData.jobId}
                    onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                    className="w-full bg-white/90 border border-stone-200 rounded-2xl px-4 py-3 text-sm text-[#2b170e] focus:outline-none focus:border-[#2b170e] cursor-pointer"
                  >
                    {activeJobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#3d2719] block mb-1">Chi nhánh làm việc mong muốn</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full bg-white/90 border border-stone-200 rounded-2xl px-4 py-3 text-sm text-[#2b170e] focus:outline-none focus:border-[#2b170e] cursor-pointer"
                  >
                    <option value="all">Bất kỳ chi nhánh nào thuận tiện</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.district})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#3d2719] block mb-1">Kinh nghiệm hoặc lời nhắn gửi thêm</label>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Đã có 1 năm kinh nghiệm Barista, có thể làm ca đêm..."
                    className="w-full bg-white/90 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2b170e] focus:outline-none focus:border-[#2b170e] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={activeJobs.length === 0}
                  className="ios-btn-primary w-full py-4 rounded-full disabled:bg-stone-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>NỘP HỒ SƠ ỨNG TUYỂN</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
