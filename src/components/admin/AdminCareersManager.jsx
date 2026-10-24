import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink, 
  RotateCcw, 
  Users, 
  Clock, 
  MapPin, 
  DollarSign, 
  FileText, 
  Download, 
  FileSpreadsheet, 
  FolderGit2, 
  FolderArchive, 
  Check, 
  Copy, 
  Sparkles, 
  Send, 
  PhoneCall, 
  Mail, 
  Calendar, 
  AlertCircle, 
  Image as ImageIcon, 
  Upload, 
  Save, 
  Loader2, 
  ShieldCheck, 
  Award, 
  Coffee,
  Flame,
  Star,
  Settings
} from 'lucide-react';
import { getJobs, saveJobs, createJob, updateJob, deleteJob, resetDefaultJobs } from '../../data/jobs';
import { getBranches } from '../../data/branches';
import { getCandidates, updateCandidateStatus, deleteCandidate } from '../../data/candidates';
import { saveCloudSiteConfig, uploadImageToSupabase } from '../../lib/supabase';

export default function AdminCareersManager({ config, onSaveConfig, triggerAlert, initialSubTab = 'jobs' }) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'jobs' | 'candidates' | 'googleSync' | 'layout'
  
  useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  const [jobsList, setJobsList] = useState(getJobs);
  const [candidatesList, setCandidatesList] = useState(getCandidates);
  const branches = getBranches();

  // Filters for Jobs
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobFilterDept, setJobFilterDept] = useState('ALL');
  const [jobFilterStatus, setJobFilterStatus] = useState('ALL');

  // Filters for Candidates
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [candidateFilterStatus, setCandidateFilterStatus] = useState('ALL');

  // Modal State for Editing / Creating Job
  const [editingJob, setEditingJob] = useState(null);
  const [isNewJob, setIsNewJob] = useState(false);

  // Script test state
  const [isTestingScript, setIsTestingScript] = useState(false);
  const [scriptTestResult, setScriptTestResult] = useState(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Layout / Careers Config State
  const careersConfig = config.careersPage || {};
  const [localCareersConfig, setLocalCareersConfig] = useState({
    heroBadge: careersConfig.heroBadge !== undefined ? careersConfig.heroBadge : 'CƠ HỘI NGHỀ NGHIỆP 24/24',
    heroTitle: careersConfig.heroTitle !== undefined ? careersConfig.heroTitle : 'GIA NHẬP ĐỘI NGŨ',
    heroTitleHighlight: careersConfig.heroTitleHighlight !== undefined ? careersConfig.heroTitleHighlight : 'COFFEE 24/24',
    heroDescription: careersConfig.heroDescription !== undefined ? careersConfig.heroDescription : 'COFFEE 24/24 chào đón các nhân tài ở mọi vị trí từ Ban Điều Hành, Văn Phòng đến Khối Cửa Hàng Vận Hành 24/7. Môi trường trẻ trung, chế độ đãi ngộ cạnh tranh và lộ trình thăng tiến rõ ràng.',
    showBadges: careersConfig.showBadges !== false,
    badges: Array.isArray(careersConfig.badges) && careersConfig.badges.length > 0 ? careersConfig.badges : [
      { text: 'Cà phê miễn phí mỗi ca', icon: 'coffee' },
      { text: 'Phụ cấp ca đêm & thưởng KPI', icon: 'award' },
      { text: 'BHXH đầy đủ & ESOP quản lý', icon: 'shield' }
    ],
    showStats: careersConfig.showStats !== false,
    stats: Array.isArray(careersConfig.stats) && careersConfig.stats.length > 0 ? careersConfig.stats : [
      { value: '12+', label: 'Vị Trí Mở Tuyển', highlight: false },
      { value: '24/7', label: 'Môi Trường Năng Động', highlight: false },
      { value: '24 Giờ', label: 'Phản Hồi Hồ Sơ', highlight: true }
    ],
    showHotline: careersConfig.showHotline !== false,
    hotlineLabel: careersConfig.hotlineLabel || 'Hotline Phòng Tuyển Dụng:',
    hotlineText: careersConfig.hotlineText || '0906 916 816 (Ms. Thư – HR Manager)',
    hotlinePhone: careersConfig.hotlinePhone || '0906916816',
    googleSheetUrl: careersConfig.googleSheetUrl || 'https://docs.google.com/spreadsheets/d/1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE/edit?gid=0#gid=0',
    googleDriveFolderUrl: careersConfig.googleDriveFolderUrl || 'https://drive.google.com/drive/folders/1s2L6e8FhQ5rgeYgfIkoHZHTwV8sOOhz-',
    googleScriptUrl: careersConfig.googleScriptUrl || '',
    showFormInHero: careersConfig.showFormInHero !== false
  });

  useEffect(() => {
    if (config?.careersPage) {
      setLocalCareersConfig(prev => ({
        ...prev,
        ...config.careersPage,
        badges: Array.isArray(config.careersPage.badges) && config.careersPage.badges.length > 0 ? config.careersPage.badges : prev.badges,
        stats: Array.isArray(config.careersPage.stats) && config.careersPage.stats.length > 0 ? config.careersPage.stats : prev.stats
      }));
    }
  }, [config?.careersPage]);

  const handleUpdateBadge = (index, field, value) => {
    setLocalCareersConfig(prev => {
      const currentBadges = [...(prev.badges || [
        { text: 'Cà phê miễn phí mỗi ca', icon: 'coffee' },
        { text: 'Phụ cấp ca đêm & thưởng KPI', icon: 'award' },
        { text: 'BHXH đầy đủ & ESOP quản lý', icon: 'shield' }
      ])];
      currentBadges[index] = { ...currentBadges[index], [field]: value };
      return { ...prev, badges: currentBadges };
    });
  };

  const handleUpdateStat = (index, field, value) => {
    setLocalCareersConfig(prev => {
      const currentStats = [...(prev.stats || [
        { value: '12+', label: 'Vị Trí Mở Tuyển', highlight: false },
        { value: '24/7', label: 'Môi Trường Năng Động', highlight: false },
        { value: '24 Giờ', label: 'Phản Hồi Hồ Sơ', highlight: true }
      ])];
      currentStats[index] = { ...currentStats[index], [field]: value };
      return { ...prev, stats: currentStats };
    });
  };
  const [isSavingLayout, setIsSavingLayout] = useState(false);

  // Sync state
  useEffect(() => {
    const handleJobsUpdate = () => setJobsList(getJobs());
    const handleCandidatesUpdate = () => setCandidatesList(getCandidates());
    window.addEventListener('jobs-updated', handleJobsUpdate);
    window.addEventListener('candidates-updated', handleCandidatesUpdate);
    return () => {
      window.removeEventListener('jobs-updated', handleJobsUpdate);
      window.removeEventListener('candidates-updated', handleCandidatesUpdate);
    };
  }, []);

  // Escape key listener & body scroll lock for editingJob modal
  useEffect(() => {
    if (!editingJob) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setEditingJob(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingJob]);

  // Handlers for Jobs
  const handleToggleJob = (id) => {
    const job = jobsList.find(j => j.id === id);
    if (!job) return;
    const newActive = job.active === false ? true : false;
    updateJob(id, { active: newActive });
    triggerAlert(`Đã ${newActive ? 'bật mở tuyển' : 'tạm dừng tuyển'}: ${job.title}`);
  };

  const handleToggleAllJobs = (status) => {
    const updated = jobsList.map(j => ({ ...j, active: status }));
    saveJobs(updated);
    setJobsList(updated);
    triggerAlert(`Đã ${status ? 'bật mở tuyển' : 'tạm dừng tuyển'} tất cả ${updated.length} vị trí!`);
  };

  const handleDeleteJob = (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết vị trí: "${title}"?`)) {
      deleteJob(id);
      triggerAlert(`Đã xóa vị trí: ${title}`);
    }
  };

  const handleOpenAddJob = () => {
    setIsNewJob(true);
    setEditingJob({
      title: '',
      department: 'Khối Cửa Hàng Vận Hành',
      type: 'Toàn thời gian (Full-time)',
      salary: '7.500.000đ - 10.500.000đ/tháng (+ Tip, Phụ cấp ca đêm)',
      shift: 'Ca xoay 8 tiếng (Sáng 6h-14h | Chiều 14h-22h | Đêm 22h-6h)',
      locations: ['Chi nhánh 413 Phan Huy Ích (Gò Vấp)', 'Chi nhánh 96 D5 (Bình Thạnh)'],
      description: 'Chịu trách nhiệm phục vụ và mang lại trải nghiệm tuyệt vời cho khách hàng tại Coffee 24/24.',
      responsibilities: [
        'Chuẩn bị nguyên liệu, quầy pha chế và dụng cụ sạch sẽ',
        'Thực hiện pha chế thức uống theo quy chuẩn chất lượng của chuỗi',
        'Phục vụ khách chu đáo, hỗ trợ tư vấn món nước và thanh toán nhanh chóng'
      ],
      requirements: [
        'Từ 18 tuổi trở lên, ngoại hình ưa nhìn, nhanh nhẹn',
        'Yêu thích ngành cà phê, có tinh thần trách nhiệm và trung thực',
        'Có thể xoay ca linh hoạt (ưu tiên ứng viên làm được ca đêm)'
      ],
      benefits: [
        'Cà phê miễn phí mỗi ca làm việc',
        'Phụ cấp ca đêm 30% lương cơ bản + Thưởng doanh số chi nhánh',
        'BHXH, BHYT đầy đủ, cơ hội thăng tiến lên Ca Trưởng / Cửa Hàng Phó'
      ],
      deadline: 'Tuyển liên tục',
      urgent: false,
      featured: false,
      image: '',
      active: true
    });
  };

  const handleSaveJobModal = (e) => {
    e.preventDefault();
    if (!editingJob.title.trim()) {
      alert('Vui lòng nhập Chức danh / Tiêu đề vị trí tuyển dụng!');
      return;
    }

    if (isNewJob) {
      createJob(editingJob);
      triggerAlert(`✓ Đã thêm vị trí tuyển dụng mới: ${editingJob.title}`);
    } else {
      updateJob(editingJob.id, editingJob);
      triggerAlert(`✓ Đã cập nhật bài viết tuyển dụng: ${editingJob.title}`);
    }
    setEditingJob(null);
  };

  // Layout save handler
  const handleSaveCareersConfig = async () => {
    setIsSavingLayout(true);
    try {
      const updatedConfig = {
        ...config,
        careersPage: localCareersConfig
      };
      onSaveConfig(updatedConfig);
      await saveCloudSiteConfig(updatedConfig);
      triggerAlert('✓ Đã lưu cấu hình Trang Tuyển Dụng & Đồng Bộ Google Cloud thành công!');
    } catch (err) {
      console.error('Lỗi lưu:', err);
      triggerAlert('⚠️ Lỗi: ' + err.message);
    } finally {
      setIsSavingLayout(false);
    }
  };

  // Google Script Test
  const handleTestScript = async () => {
    if (!localCareersConfig.googleScriptUrl) {
      alert('Vui lòng nhập đường link Google Apps Script Webhook URL trước khi kiểm tra!');
      return;
    }
    setIsTestingScript(true);
    setScriptTestResult(null);
    try {
      const testPayload = {
        spreadsheetId: '1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE',
        driveFolderId: '1s2L6e8FhQ5rgeYgfIkoHZHTwV8sOOhz-',
        fullName: 'Kiểm Tra Kết Nối (Admin Test)',
        phone: '0906916816',
        email: 'test@coffee2424.com',
        jobTitle: 'Kiểm Tra Hệ Thống',
        branchName: 'Tất cả chi nhánh',
        note: 'Dòng test kiểm tra tự động kết nối từ Admin Coffee 24/24',
        appliedAt: new Date().toLocaleString('vi-VN')
      };

      await fetch(localCareersConfig.googleScriptUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });

      setScriptTestResult({
        success: true,
        message: '✓ Đã gửi lệnh kiểm tra thành công! Vui lòng mở Google Sheet kiểm tra xem đã xuất hiện dòng mới chưa.'
      });
      triggerAlert('✓ Đã gửi thành công hồ sơ mẫu vào Google Sheet!');
    } catch (err) {
      setScriptTestResult({
        success: false,
        message: 'Lỗi kết nối: ' + err.message
      });
    } finally {
      setIsTestingScript(false);
    }
  };

  const appsScriptCode = `/**
 * MÃ GOOGLE APPS SCRIPT CHO HỆ THỐNG TUYỂN DỤNG COFFEE 24/24
 * Tự động ghi thông tin vào Google Sheet & Lưu ảnh, file CV vào Google Drive
 */
const SPREADSHEET_ID = "1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE";
const DRIVE_FOLDER_ID = "1s2L6e8FhQ5rgeYgfIkoHZHTwV8sOOhz-";

function doPost(e) {
  try {
    let data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter || {};
    }

    let driveFolder;
    try {
      driveFolder = DriveApp.getFolderById(data.driveFolderId || DRIVE_FOLDER_ID);
    } catch (err) {
      driveFolder = DriveApp.getRootFolder();
    }

    let photoDriveUrl = "";
    if (data.photoBase64 && data.photoBase64.length > 20) {
      try {
        const cleanBase64 = data.photoBase64.replace(/^data:image\\/[a-z]+;base64,/, "");
        const photoBlob = Utilities.newBlob(
          Utilities.base64Decode(cleanBase64),
          data.photoType || "image/jpeg",
          "ANH_" + (data.fullName ? data.fullName.replace(/\\s+/g, "_") : "UngVien") + "_" + new Date().getTime() + "_" + (data.photoName || "photo.jpg")
        );
        const photoFile = driveFolder.createFile(photoBlob);
        photoFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        photoDriveUrl = photoFile.getUrl();
      } catch (photoErr) {
        photoDriveUrl = "Lỗi lưu ảnh: " + photoErr.message;
      }
    }

    let cvDriveUrl = "";
    if (data.cvBase64 && data.cvBase64.length > 20) {
      try {
        const cleanCvBase64 = data.cvBase64.replace(/^data:[^;]+;base64,/, "");
        const cvBlob = Utilities.newBlob(
          Utilities.base64Decode(cleanCvBase64),
          data.cvType || "application/pdf",
          "CV_" + (data.fullName ? data.fullName.replace(/\\s+/g, "_") : "UngVien") + "_" + new Date().getTime() + "_" + (data.cvName || "CV.pdf")
        );
        const cvFile = driveFolder.createFile(cvBlob);
        cvFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        cvDriveUrl = cvFile.getUrl();
      } catch (cvErr) {
        cvDriveUrl = "Lỗi lưu CV: " + cvErr.message;
      }
    }

    const spreadsheet = SpreadsheetApp.openById(data.spreadsheetId || SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Nộp",
        "Họ Và Tên Ứng Viên",
        "Số Điện Thoại",
        "Email",
        "Vị Trí Ứng Tuyển",
        "Chi Nhánh Mong Muốn",
        "Kinh Nghiệm / Lời Nhắn",
        "Link Ảnh Chân Dung (Drive)",
        "Link File CV (Drive)",
        "Trạng Thái Tuyển Dụng"
      ]);
      const headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setBackground("#2b170e");
      headerRange.setFontColor("#f59e0b");
      headerRange.setFontWeight("bold");
    }

    const appliedTime = data.appliedAt || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");

    sheet.appendRow([
      appliedTime,
      data.fullName || "",
      "'" + (data.phone || ""),
      data.email || "",
      data.jobTitle || "",
      data.branchName || "Toàn hệ thống",
      data.note || "",
      photoDriveUrl,
      cvDriveUrl,
      "Mới Ứng Tuyển"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã lưu ứng viên thành công!",
      photoUrl: photoDriveUrl,
      cvUrl: cvDriveUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Google Apps Script Tuyển Dụng Coffee 24/24 đang hoạt động tốt!"
  })).setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyAppsScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    triggerAlert('✓ Đã sao chép toàn bộ mã Google Apps Script vào bộ nhớ tạm!');
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleExportCandidatesCSV = () => {
    if (candidatesList.length === 0) {
      alert('Chưa có hồ sơ ứng viên nào để xuất file!');
      return;
    }
    const headers = ['Thời gian nộp', 'Họ tên', 'Số điện thoại', 'Email', 'Vị trí', 'Chi nhánh', 'Trạng thái', 'Lời nhắn / Kinh nghiệm'];
    const rows = candidatesList.map(c => [
      `"${c.submittedAt ? new Date(c.submittedAt).toLocaleString('vi-VN') : ''}"`,
      `"${c.fullName || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.email || ''}"`,
      `"${c.jobTitle || ''}"`,
      `"${c.branchName || ''}"`,
      `"${c.status || ''}"`,
      `"${(c.note || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DS_Ung_Vien_Coffee2424_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerAlert('✓ Đã tải file CSV danh sách ứng viên!');
  };

  const activeJobsCount = jobsList.filter(j => j.active !== false).length;
  const pendingCandidatesCount = candidatesList.filter(c => c.status === 'pending' || !c.status).length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 text-xs font-black tracking-wider uppercase mb-2">
            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
            <span>Quản Lý Nhân Sự & Tuyển Dụng 24/7</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2b170e] tracking-tight">
            Tin Tuyển Dụng, Bố Cục Bài Viết & Hồ Sơ Ứng Viên
          </h2>
          <p className="text-xs sm:text-sm text-[#7a5843] font-medium mt-1">
            Mở rộng thông tin bài viết tuyển dụng, nhận hồ sơ ứng viên gửi tự động về Google Sheets và lưu ảnh, CV vào Google Drive.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.open('/tuyendung', '_blank')}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200/80 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            <span>Xem Trang Tuyển Dụng Ngoài Web</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CẤU HÌNH LIÊN KẾT ỨNG DỤNG WEB GOOGLE (GOOGLE APPS SCRIPT WEBHOOK)
          HIỂN THỊ NỔI BẬT NGAY ĐẦU TRANG ĐỂ DỄ DÀNG DÁN LINK VÀ QUẢN LÝ
          ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#1e130c] to-stone-950 border-2 border-emerald-500/50 text-white shadow-xl space-y-5 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cấu Hình Tự Động Gửi Dữ Liệu Ứng Viên Về Google</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Dán Link Ứng Dụng Web Google (Apps Script Webhook URL)</span>
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Dán đường dẫn Web App đã triển khai (kết thúc bằng <code className="text-amber-300 font-mono bg-black/50 px-1.5 py-0.5 rounded border border-amber-500/30">/exec</code>) vào ô bên dưới rồi bấm <strong>LƯU CẤU HÌNH GOOGLE</strong>. Dữ liệu ứng viên kèm ảnh thẻ và file CV sẽ được <strong>chuyển thẳng về Google Sheet và Google Drive</strong>, không lưu trên web để không tốn bộ nhớ & database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://docs.google.com/spreadsheets/d/1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE/edit?gid=0#gid=0"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Mở Google Sheet</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>

            <a
              href="https://drive.google.com/drive/folders/1s2L6e8FhQ5rgeYgfIkoHZHTwV8sOOhz-"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Mở Google Drive</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          </div>
        </div>

        {/* Input Field & Save Button */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="url"
              value={localCareersConfig.googleScriptUrl}
              onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, googleScriptUrl: e.target.value }))}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-emerald-500/50 text-emerald-300 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 shadow-inner placeholder-stone-500"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveCareersConfig}
            disabled={isSavingLayout}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50"
          >
            {isSavingLayout ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang Lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>LƯU CẤU HÌNH GOOGLE</span>
              </>
            )}
          </button>
        </div>

        {/* Status bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            {localCareersConfig.googleScriptUrl && localCareersConfig.googleScriptUrl.trim().startsWith('http') ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ✓ Đã kết nối Webhook: Dữ liệu ứng viên gửi thẳng về Google Sheet & Drive!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold">
                <AlertCircle className="w-4 h-4" />
                Chưa có Webhook URL! Vui lòng dán link kết thúc bằng /exec vào ô trên và bấm "LƯU CẤU HÌNH GOOGLE".
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleTestScript}
              disabled={isTestingScript || !localCareersConfig.googleScriptUrl}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 cursor-pointer underline disabled:opacity-40"
            >
              {isTestingScript ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Gửi thử 1 hồ sơ mẫu vào Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('googleSync')}
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer underline"
            >
              <span>Xem hướng dẫn & Mã Script</span>
            </button>
          </div>
        </div>

        {/* Test Result Message */}
        {scriptTestResult && (
          <div className={`p-3 rounded-xl text-xs font-semibold ${
            scriptTestResult.success 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            {scriptTestResult.message}
          </div>
        )}

      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-200/60 backdrop-blur-md overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('jobs')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'jobs'
              ? 'bg-[#2b170e] text-white shadow-md'
              : 'text-stone-700 hover:text-black hover:bg-white/60'
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-400" />
          <span>Bài Viết & Vị Trí Tuyển Dụng</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black">
            {jobsList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('candidates')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'candidates'
              ? 'bg-[#2b170e] text-white shadow-md'
              : 'text-stone-700 hover:text-black hover:bg-white/60'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Hồ Sơ Ứng Viên Đã Nộp</span>
          {pendingCandidatesCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-black animate-pulse">
              {pendingCandidatesCount} mới
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('googleSync')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'googleSync'
              ? 'bg-[#2b170e] text-white shadow-md'
              : 'text-stone-700 hover:text-black hover:bg-white/60'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          <span>Đồng Bộ Google Sheets & Drive</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('layout')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'layout'
              ? 'bg-[#2b170e] text-white shadow-md'
              : 'text-stone-700 hover:text-black hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Giao Diện Hero & Bố Cục</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: BÀI VIẾT & VỊ TRÍ TUYỂN DỤNG
          ========================================================================= */}
      {activeSubTab === 'jobs' && (
        <div className="space-y-6">
          
          {/* Action Bar & Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/80 border border-white/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-black text-xl">
                {jobsList.length}
              </div>
              <div>
                <span className="text-xs text-stone-500 block font-medium">Tổng vị trí quy hoạch</span>
                <span className="text-base font-black text-[#2b170e]">{jobsList.length} Vị Trí & Bài Viết</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-800 flex items-center justify-center font-black text-xl">
                {activeJobsCount}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-emerald-700 font-bold block">Đang Mở Tuyển</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <span className="text-base font-black text-emerald-950">Hiển thị trên website</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 border border-white/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center font-black text-xl">
                {jobsList.length - activeJobsCount}
              </div>
              <div>
                <span className="text-xs text-stone-500 block font-medium">Tạm dừng tuyển dụng</span>
                <span className="text-base font-black text-stone-700">Đã tạm ẩn</span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-white/80 border border-white/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                placeholder="Tìm vị trí (VD: Tổng quản lý, Pha chế, Kế toán, HR...)..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2 text-xs font-semibold text-[#2b170e] placeholder-stone-400 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={jobFilterDept}
                onChange={(e) => setJobFilterDept(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-700 focus:outline-none"
              >
                <option value="ALL">Tất cả phòng ban</option>
                <option value="Ban Điều Hành">Ban Điều Hành</option>
                <option value="Phòng Kế Toán - Tài Chính">Kế Toán - Tài Chính</option>
                <option value="Phòng Marketing & Thương Hiệu">Marketing & Brand</option>
                <option value="Khối Vận Hành Cửa Hàng">Khối Cửa Hàng</option>
                <option value="Khối An Ninh & Trật Tự">Bảo Vệ & An Ninh</option>
                <option value="Khối Vệ Sinh & Tạp Vụ">Vệ Sinh</option>
                <option value="Phòng Hành Chính - Nhân Sự (HR)">HR - Nhân Sự</option>
              </select>

              <select
                value={jobFilterStatus}
                onChange={(e) => setJobFilterStatus(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-700 focus:outline-none"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Chỉ vị trí ĐANG MỞ</option>
                <option value="INACTIVE">Chỉ vị trí ĐÃ TẮT</option>
              </select>

              <button
                type="button"
                onClick={handleOpenAddJob}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ THÊM BÀI VIẾT TUYỂN DỤNG</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Khôi phục danh sách 12 vị trí tiêu chuẩn ban đầu?')) {
                    resetDefaultJobs();
                    setJobsList(getJobs());
                    triggerAlert('Đã khôi phục danh sách vị trí mặc định!');
                  }
                }}
                className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-500 border border-stone-200/80 cursor-pointer"
                title="Khôi phục gốc"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Job Postings Cards */}
          <div className="space-y-3.5">
            {jobsList
              .filter(job => {
                if (jobFilterDept !== 'ALL' && job.department !== jobFilterDept) return false;
                if (jobFilterStatus === 'ACTIVE' && job.active === false) return false;
                if (jobFilterStatus === 'INACTIVE' && job.active !== false) return false;
                if (jobSearchQuery.trim()) {
                  const q = jobSearchQuery.toLowerCase();
                  return job.title.toLowerCase().includes(q) || 
                         job.department.toLowerCase().includes(q) ||
                         job.salary.toLowerCase().includes(q);
                }
                return true;
              })
              .map((job, idx) => {
                const isActive = job.active !== false;
                return (
                  <div
                    key={job.id}
                    className={`p-5 rounded-3xl transition-all border ${
                      isActive
                        ? 'bg-white/90 border-white/90 hover:border-amber-500/40 shadow-sm'
                        : 'bg-stone-100/60 border-stone-200/60 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                          isActive
                            ? 'bg-[#2b170e] text-amber-300 shadow-xs'
                            : 'bg-stone-300 text-stone-600'
                        }`}>
                          {idx + 1}
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className={`text-base font-black ${isActive ? 'text-[#2b170e]' : 'text-stone-500 line-through'}`}>
                              {job.title}
                            </h3>

                            {job.urgent && (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                                <Flame className="w-3 h-3" />
                                Tuyển Gấp
                              </span>
                            )}

                            {job.featured && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#2b170e] text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                                <Star className="w-3 h-3 fill-[#2b170e]" />
                                Hot
                              </span>
                            )}

                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-100 text-[#5c3d2e] border border-stone-200 font-bold">
                              {job.department}
                            </span>

                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 font-black">
                              {job.salary}
                            </span>
                          </div>

                          <p className="text-xs text-[#5c3d2e] line-clamp-2 max-w-3xl leading-relaxed">
                            {job.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 font-medium">
                            <span>🕒 {job.shift}</span>
                            <span>•</span>
                            <span>📍 {Array.isArray(job.locations) ? job.locations.join(' | ') : job.locations}</span>
                            <span>•</span>
                            <span>📅 Hạn nộp: {job.deadline || 'Tuyển liên tục'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewJob(false);
                            setEditingJob({ ...job });
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-[#2b170e] border border-stone-200/90 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Chỉnh Sửa Bài Viết</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleJob(job.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                            isActive
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>ĐANG MỞ</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>TẠM ẨN</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          className="p-2 rounded-xl bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200 transition-colors cursor-pointer"
                          title="Xóa bài viết vị trí này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: HỒ SƠ ỨNG VIÊN ĐÃ NỘP (HỘP THƯ ỨNG VIÊN)
          ========================================================================= */}
      {activeSubTab === 'candidates' && (
        <div className="space-y-6">
          
          {/* Quick Header Bar */}
          <div className="p-5 rounded-3xl bg-white/80 border border-white/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#2b170e] flex items-center gap-2">
                <span>Hộp Thư Hồ Sơ Ứng Tuyển Trực Tuyến</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 font-bold">
                  {candidatesList.length} Ứng Viên
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Ứng viên nộp hồ sơ qua website sẽ lưu tại đây, đồng thời đẩy tự động về Google Sheets và thư mục Google Drive.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={localCareersConfig.googleSheetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Mở Google Sheet</span>
              </a>

              <a
                href={localCareersConfig.googleDriveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>Mở Google Drive</span>
              </a>

              <button
                type="button"
                onClick={handleExportCandidatesCSV}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-[#2b170e] border border-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Xuất CSV</span>
              </button>
            </div>
          </div>

          {/* Search & Status Filter */}
          <div className="p-4 rounded-2xl bg-white/80 border border-white/80 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={candidateSearchQuery}
                onChange={(e) => setCandidateSearchQuery(e.target.value)}
                placeholder="Tìm tên ứng viên, số điện thoại, vị trí..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2 text-xs font-semibold text-[#2b170e] placeholder-stone-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={candidateFilterStatus}
                onChange={(e) => setCandidateFilterStatus(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-700 focus:outline-none"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="pending">Chờ liên hệ ({pendingCandidatesCount})</option>
                <option value="contacted">Đã liên hệ</option>
                <option value="interviewed">Đã phỏng vấn</option>
                <option value="hired">Đã nhận việc</option>
                <option value="rejected">Không phù hợp</option>
              </select>
            </div>
          </div>

          {/* Candidate List */}
          {candidatesList.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/60 border border-dashed border-stone-300 space-y-3">
              <Users className="w-10 h-10 text-stone-400 mx-auto" />
              <h4 className="text-base font-bold text-[#2b170e]">Chưa có hồ sơ ứng viên nào</h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Khi có người nộp hồ sơ ở trang Tuyển Dụng, danh sách sẽ hiển thị ngay tại đây kèm ảnh chân dung và file CV đính kèm.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidatesList
                .filter(c => {
                  if (candidateFilterStatus !== 'ALL') {
                    if (candidateFilterStatus === 'pending' && (c.status !== 'pending' && c.status)) return false;
                    if (candidateFilterStatus !== 'pending' && c.status !== candidateFilterStatus) return false;
                  }
                  if (candidateSearchQuery.trim()) {
                    const q = candidateSearchQuery.toLowerCase();
                    return (c.fullName || '').toLowerCase().includes(q) ||
                           (c.phone || '').includes(q) ||
                           (c.jobTitle || '').toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((cand) => (
                  <div
                    key={cand.id}
                    className="p-5 rounded-3xl bg-white/90 border border-white/90 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Photo Thumbnail */}
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-600/20 overflow-hidden flex items-center justify-center shrink-0">
                        {cand.photoBase64 ? (
                          <img 
                            src={cand.photoBase64.startsWith('data:') ? cand.photoBase64 : `data:image/jpeg;base64,${cand.photoBase64}`} 
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Users className="w-6 h-6 text-amber-700" />
                        )}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-black text-[#2b170e]">
                            {cand.fullName || 'Ứng viên không tên'}
                          </h4>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2b170e] text-amber-300 font-bold">
                            {cand.jobTitle || 'Chưa chọn vị trí'}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
                            📍 {cand.branchName || 'Tất cả chi nhánh'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                          <a href={`tel:${cand.phone}`} className="font-bold text-amber-900 hover:underline flex items-center gap-1">
                            <PhoneCall className="w-3.5 h-3.5" />
                            {cand.phone}
                          </a>
                          {cand.email && (
                            <span className="flex items-center gap-1 text-stone-500">
                              <Mail className="w-3.5 h-3.5" />
                              {cand.email}
                            </span>
                          )}
                          <span className="text-stone-400 text-[11px]">
                            🕒 Nộp lúc: {cand.submittedAt ? new Date(cand.submittedAt).toLocaleString('vi-VN') : ''}
                          </span>
                        </div>

                        {cand.note && (
                          <p className="text-xs text-[#5c3d2e] bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 mt-1">
                            💬 <strong>Lời nhắn:</strong> {cand.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right side: CV File download & Status selector */}
                    <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                      {/* CV Download button */}
                      {cand.cvBase64 ? (
                        <button
                          type="button"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = cand.cvBase64.startsWith('data:') ? cand.cvBase64 : `data:application/pdf;base64,${cand.cvBase64}`;
                            link.download = cand.cvName || `CV_${cand.fullName || 'UngVien'}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-600/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          <span>Tải CV ({cand.cvName || 'File CV'})</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">Không đính kèm file CV</span>
                      )}

                      {/* Status selector */}
                      <select
                        value={cand.status || 'pending'}
                        onChange={(e) => {
                          updateCandidateStatus(cand.id, e.target.value);
                          setCandidatesList(getCandidates());
                          triggerAlert('Đã cập nhật trạng thái ứng viên!');
                        }}
                        className={`text-xs font-bold px-3 py-2 rounded-xl border cursor-pointer focus:outline-none ${
                          cand.status === 'hired'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : cand.status === 'rejected'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : cand.status === 'interviewed'
                                ? 'bg-sky-50 text-sky-800 border-sky-300'
                                : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}
                      >
                        <option value="pending">⏳ Chờ liên hệ</option>
                        <option value="contacted">📞 Đã liên hệ</option>
                        <option value="interviewed">🤝 Đã phỏng vấn</option>
                        <option value="hired">🎉 Đã nhận việc</option>
                        <option value="rejected">❌ Không phù hợp</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Xóa hồ sơ của ứng viên "${cand.fullName}"?`)) {
                            deleteCandidate(cand.id);
                            setCandidatesList(getCandidates());
                            triggerAlert('Đã xóa hồ sơ ứng viên!');
                          }
                        }}
                        className="p-2 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Xóa ứng viên"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 3: ĐỒNG BỘ GOOGLE SHEETS & GOOGLE DRIVE
          ========================================================================= */}
      {activeSubTab === 'googleSync' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-white/90 border border-white/90 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-700">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#2b170e]">
                  Kết Nối Google Sheets & Google Drive Theo Yêu Cầu
                </h3>
                <p className="text-xs text-stone-500">
                  Dữ liệu ứng viên, ảnh chân dung và file CV sẽ được lưu tự động vào Google Drive & Google Sheet của bạn.
                </p>
              </div>
            </div>

            {/* Google Links Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    Google Spreadsheet (Bảng Tính Tuyển Dụng)
                  </span>
                  <a
                    href={localCareersConfig.googleSheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Mở bảng tính</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <input
                  type="text"
                  value={localCareersConfig.googleSheetUrl}
                  onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, googleSheetUrl: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-mono text-emerald-950 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-sky-900 flex items-center gap-1.5">
                    <FolderArchive className="w-4 h-4 text-sky-700" />
                    Thư Mục Google Drive (Lưu Ảnh & CV)
                  </span>
                  <a
                    href={localCareersConfig.googleDriveFolderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
                  >
                    <span>Mở thư mục</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <input
                  type="text"
                  value={localCareersConfig.googleDriveFolderUrl}
                  onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, googleDriveFolderUrl: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-sky-300 text-xs font-mono text-sky-950 focus:outline-none"
                />
              </div>
            </div>

            {/* Google Apps Script Webhook URL */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-600/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs sm:text-sm font-black text-[#2b170e] block">
                    Đường Link Google Apps Script Webhook URL:
                  </label>
                  <span className="text-[11px] text-[#7a5843]">
                    Sau khi triển khai Apps Script theo hướng dẫn bên dưới, dán link kết thúc bằng <code>/exec</code> vào đây:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTestScript}
                  disabled={isTestingScript || !localCareersConfig.googleScriptUrl}
                  className="px-4 py-2 rounded-xl bg-[#2b170e] hover:bg-[#180d08] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isTestingScript ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>Kiểm Tra Gửi Thử 1 Hồ Sơ Mẫu</span>
                </button>
              </div>

              <input
                type="url"
                value={localCareersConfig.googleScriptUrl}
                onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, googleScriptUrl: e.target.value }))}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono text-[#2b170e] focus:outline-none"
              />

              {scriptTestResult && (
                <div className={`p-3 rounded-xl text-xs font-bold ${
                  scriptTestResult.success ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                }`}>
                  {scriptTestResult.message}
                </div>
              )}
            </div>

            {/* Instruction Guide to deploy Google Apps Script */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-[#2b170e] uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Mã Nguồn Google Apps Script Viết Sẵn (2 Phút Cài Đặt)</span>
                </h4>

                <button
                  type="button"
                  onClick={handleCopyAppsScript}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2b170e] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copiedScript ? 'ĐÃ SAO CHÉP MÃ!' : 'SAO CHÉP MÃ APPS SCRIPT'}</span>
                </button>
              </div>

              <div className="text-xs text-stone-600 leading-relaxed space-y-1.5">
                <p><strong>Bước 1:</strong> Mở link Google Sheet ở trên, chọn menu <strong>Tiện ích mở rộng (Extensions)</strong> &rarr; <strong>Apps Script</strong>.</p>
                <p><strong>Bước 2:</strong> Xóa hết nội dung cũ, nhấn nút <strong>"Sao Chép Mã Apps Script"</strong> ở góc trên và <strong>Dán vào</strong>.</p>
                <p><strong>Bước 3:</strong> Nhấn nút <strong>Triển khai (Deploy)</strong> ở góc trên bên phải &rarr; <strong>Tùy chọn triển khai mới (New deployment)</strong>.</p>
                <p><strong>Bước 4:</strong> Chọn loại: <strong>Ứng dụng web (Web app)</strong> &rarr; Mục <em>Ai có quyền truy cập (Who has access)</em> chọn <strong>Bất kỳ ai (Anyone)</strong> &rarr; Nhấn <strong>Triển khai</strong> và sao chép đường link dán vào ô Webhook URL ở trên.</p>
              </div>

              {/* Code preview block */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-300">
                <pre className="p-4 bg-stone-900 text-stone-200 text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
                  {appsScriptCode}
                </pre>
              </div>
            </div>

            {/* Save Button for Tab 3 */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveCareersConfig}
                disabled={isSavingLayout}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2b170e] to-[#4a2818] hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
              >
                {isSavingLayout ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Save className="w-4 h-4 text-amber-400" />}
                <span>LƯU CẤU HÌNH KẾT NỐI GOOGLE</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: BỐ CỤC & GIAO DIỆN HERO TUYỂN DỤNG
          ========================================================================= */}
      {activeSubTab === 'layout' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white/90 border border-white/90 shadow-sm space-y-7">
            
            {/* Header tab */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 text-xs font-black uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tùy Chỉnh Toàn Diện Giao Diện Hero Tuyển Dụng</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#2b170e]">
                  Tiêu Đề, Quyền Lợi, Số Liệu Thống Kê & Hotline Tuyển Dụng
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Chỉnh sửa trực quan toàn bộ khối giới thiệu bên trái và bật/tắt các thành phần theo nhu cầu.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveCareersConfig}
                disabled={isSavingLayout}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2b170e] to-[#4a2818] hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0 active:scale-95 transition-all"
              >
                {isSavingLayout ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Save className="w-4 h-4 text-amber-400" />}
                <span>LƯU CẤU HÌNH GIAO DIỆN</span>
              </button>
            </div>

            {/* LIVE PREVIEW BOX (MÔ PHỎNG TRỰC QUAN GIAO DIỆN) */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                Xem Trước Thực Tế (Live Preview):
              </span>
              <div className="p-6 sm:p-8 rounded-3xl bg-[#f7f3ed] border border-amber-900/15 shadow-inner space-y-4 max-w-2xl text-left">
                {localCareersConfig.heroBadge !== '' && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#2b170e] text-xs font-extrabold uppercase tracking-wider border border-white/90 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{localCareersConfig.heroBadge || 'CƠ HỘI NGHỀ NGHIỆP 24/24'}</span>
                  </div>
                )}

                <h4 className="text-2xl sm:text-3xl font-black text-[#2b170e] uppercase leading-tight tracking-tight">
                  {localCareersConfig.heroTitle || 'Gia Nhập Đội Ngũ'} <br />
                  {localCareersConfig.heroTitleHighlight !== '' && (
                    <span className="text-[#8c5932] inline-block mt-0.5">
                      {localCareersConfig.heroTitleHighlight || 'COFFEE 24/24'}
                    </span>
                  )}
                </h4>

                {localCareersConfig.heroDescription !== '' && (
                  <p className="text-xs sm:text-sm text-[#523d2f] font-medium leading-relaxed">
                    {localCareersConfig.heroDescription}
                  </p>
                )}

                {/* Badges preview */}
                {localCareersConfig.showBadges !== false && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(localCareersConfig.badges || []).map((b, i) => {
                      const IconC = b.icon === 'coffee' ? Coffee : (b.icon === 'shield' ? ShieldCheck : Award);
                      return (
                        <span key={i} className="text-xs px-3 py-1.5 rounded-xl bg-white text-[#2b170e] font-bold shadow-2xs flex items-center gap-1.5 border border-white">
                          <IconC className="w-3.5 h-3.5 text-amber-700" />
                          <span>{b.text}</span>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Stats preview */}
                {localCareersConfig.showStats !== false && (
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    {(localCareersConfig.stats || []).map((st, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white border border-white text-center shadow-2xs">
                        <span className={`text-base font-black block ${st.highlight ? 'text-amber-800' : 'text-[#2b170e]'}`}>
                          {st.value}
                        </span>
                        <span className="text-[10px] font-bold text-stone-500 uppercase block mt-0.5 truncate">
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hotline preview */}
                {localCareersConfig.showHotline !== false && (
                  <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-600/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white text-amber-800 flex items-center justify-center font-bold shadow-2xs shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#7a5843] block">
                        {localCareersConfig.hotlineLabel || 'Hotline Phòng Tuyển Dụng:'}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#2b170e]">
                        {localCareersConfig.hotlineText || '0906 916 816 (Ms. Thư – HR Manager)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* KHỐI 1: TIÊU ĐỀ & MÔ TẢ GIỚI THIỆU */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
              <h4 className="text-xs sm:text-sm font-black text-[#2b170e] uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>1. Tiêu Đề & Giới Thiệu Đầu Trang (Hero Banner)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Huy hiệu nhỏ trên đầu (Badge)
                  </label>
                  <input
                    type="text"
                    value={localCareersConfig.heroBadge}
                    onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, heroBadge: e.target.value }))}
                    placeholder="CƠ HỘI NGHỀ NGHIỆP 24/24"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-bold text-[#2b170e] focus:outline-none focus:border-amber-600"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">Xóa trống nếu không muốn hiển thị badge này</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Tiêu đề chính dòng 1 (Chữ đen)
                  </label>
                  <input
                    type="text"
                    value={localCareersConfig.heroTitle}
                    onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, heroTitle: e.target.value }))}
                    placeholder="GIA NHẬP ĐỘI NGŨ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-black text-[#2b170e] focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Tiêu đề dòng 2 (Màu nâu nổi bật)
                  </label>
                  <input
                    type="text"
                    value={localCareersConfig.heroTitleHighlight}
                    onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, heroTitleHighlight: e.target.value }))}
                    placeholder="COFFEE 24/24"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-black text-[#8c5932] focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Đoạn văn mô tả giới thiệu
                </label>
                <textarea
                  rows={3}
                  value={localCareersConfig.heroDescription}
                  onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, heroDescription: e.target.value }))}
                  placeholder="Mô tả môi trường làm việc, chế độ và lộ trình..."
                  className="w-full p-3 rounded-xl bg-white border border-stone-300 text-xs font-medium text-[#2b170e] leading-relaxed focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* KHỐI 2: 3 HUY HIỆU QUYỀN LỢI & ĐÃI NGỘ */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-[#2b170e] uppercase tracking-wide flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>2. Ba Huy Hiệu Quyền Lợi & Đãi Ngộ (Benefit Pills)</span>
                </h4>

                <button
                  type="button"
                  onClick={() => setLocalCareersConfig(prev => ({ ...prev, showBadges: !prev.showBadges }))}
                  className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                    localCareersConfig.showBadges !== false
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-300 text-stone-600'
                  }`}
                >
                  {localCareersConfig.showBadges !== false ? '✓ ĐANG BẬT' : '✕ ĐANG TẮT'}
                </button>
              </div>

              {localCareersConfig.showBadges !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(localCareersConfig.badges || []).map((badge, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-stone-200/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800">Quyền lợi #{idx + 1}</span>
                        <select
                          value={badge.icon || 'award'}
                          onChange={(e) => handleUpdateBadge(idx, 'icon', e.target.value)}
                          className="text-xs font-bold bg-stone-100 px-2 py-1 rounded-lg border border-stone-200 text-stone-700 cursor-pointer"
                        >
                          <option value="coffee">☕ Cà phê</option>
                          <option value="award">🎗️ Thưởng KPI</option>
                          <option value="shield">🛡️ Bảo hiểm</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={badge.text}
                        onChange={(e) => handleUpdateBadge(idx, 'text', e.target.value)}
                        placeholder={`Nội dung quyền lợi ${idx + 1}...`}
                        className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-[#2b170e]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* KHỐI 3: 3 HỘP THỐNG KÊ NHANH (TRUST STATISTICS) */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-[#2b170e] uppercase tracking-wide flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>3. Ba Hộp Số Liệu Thống Kê Nhanh (Trust Statistics)</span>
                </h4>

                <button
                  type="button"
                  onClick={() => setLocalCareersConfig(prev => ({ ...prev, showStats: !prev.showStats }))}
                  className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                    localCareersConfig.showStats !== false
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-300 text-stone-600'
                  }`}
                >
                  {localCareersConfig.showStats !== false ? '✓ ĐANG BẬT' : '✕ ĐANG TẮT'}
                </button>
              </div>

              {localCareersConfig.showStats !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(localCareersConfig.stats || []).map((stat, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-stone-200/90 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800">Hộp số liệu #{idx + 1}</span>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(stat.highlight)}
                            onChange={(e) => handleUpdateStat(idx, 'highlight', e.target.checked)}
                            className="rounded accent-amber-600"
                          />
                          <span>Màu cam nổi bật</span>
                        </label>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-stone-500 block mb-1">Số liệu chính (Value)</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)}
                          placeholder="12+"
                          className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-sm font-black text-[#2b170e]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-stone-500 block mb-1">Nhãn mô tả (Label)</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                          placeholder="VỊ TRÍ MỞ TUYỂN"
                          className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-700 uppercase"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* KHỐI 4: KHỐI HOTLINE PHÒNG TUYỂN DỤNG */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-[#2b170e] uppercase tracking-wide flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-600" />
                  <span>4. Khối Hotline Phòng Tuyển Dụng (Đáy Phần Giới Thiệu)</span>
                </h4>

                <button
                  type="button"
                  onClick={() => setLocalCareersConfig(prev => ({ ...prev, showHotline: !prev.showHotline }))}
                  className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                    localCareersConfig.showHotline !== false
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-300 text-stone-600'
                  }`}
                >
                  {localCareersConfig.showHotline !== false ? '✓ ĐANG BẬT' : '✕ ĐANG TẮT'}
                </button>
              </div>

              {localCareersConfig.showHotline !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Tiêu đề nhãn hotline
                    </label>
                    <input
                      type="text"
                      value={localCareersConfig.hotlineLabel}
                      onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, hotlineLabel: e.target.value }))}
                      placeholder="Hotline Phòng Tuyển Dụng:"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-bold text-[#2b170e]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Nội dung hiển thị (Tên & Số)
                    </label>
                    <input
                      type="text"
                      value={localCareersConfig.hotlineText}
                      onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, hotlineText: e.target.value }))}
                      placeholder="0906 916 816 (Ms. Thư – HR Manager)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-black text-[#2b170e]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Số điện thoại để bấm gọi ngay
                    </label>
                    <input
                      type="tel"
                      value={localCareersConfig.hotlinePhone}
                      onChange={(e) => setLocalCareersConfig(prev => ({ ...prev, hotlinePhone: e.target.value }))}
                      placeholder="0906916816"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold text-[#2b170e]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* KHỐI 5: FORM ỨNG TUYỂN NHANH ĐẦU TRANG */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-600/30 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm font-black text-[#2b170e] block">
                  5. Đưa Form Ứng Tuyển Nhanh Lên Thay Thế Ảnh Banner Cũ (Cột Phải):
                </span>
                <span className="text-xs text-[#7a5843]">
                  Khi bật, form ứng tuyển kèm nút tải Ảnh thẻ và File CV sẽ xuất hiện ngay tại cột bên phải của Hero đầu trang.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLocalCareersConfig(prev => ({ ...prev, showFormInHero: !prev.showFormInHero }))}
                className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  localCareersConfig.showFormInHero !== false
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {localCareersConfig.showFormInHero !== false ? 'ĐANG BẬT FORM' : 'DÙNG ẢNH CŨ'}
              </button>
            </div>

            {/* Nút lưu cuối trang */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveCareersConfig}
                disabled={isSavingLayout}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#2b170e] to-[#4a2818] hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
              >
                {isSavingLayout ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Save className="w-4 h-4 text-amber-400" />}
                <span>LƯU CẤU HÌNH GIAO DIỆN HERO</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL CHỈNH SỬA & THÊM BÀI VIẾT TUYỂN DỤNG CHI TIẾT
          ========================================================================= */}
      {/* MODAL CHỈNH SỬA / THÊM MỚI BÀI VIẾT VỊ TRÍ */}
      {editingJob && (
        <div 
          onClick={() => setEditingJob(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[32px] border border-stone-200 max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200"
          >
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-black text-[#2b170e] flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-700" />
                  <span>{isNewJob ? 'Thêm Vị Trí / Bài Viết Tuyển Dụng Mới' : 'Chỉnh Sửa Chi Tiết Bài Viết Tuyển Dụng'}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Mô tả công việc, yêu cầu, quyền lợi và ca làm việc chi tiết
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingJob(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 bg-stone-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJobModal} className="space-y-4">
              
              {/* Tiêu đề vị trí */}
              <div>
                <label className="text-xs font-bold text-[#2b170e] block mb-1">Chức Danh / Vị Trí Tuyển Dụng *</label>
                <input
                  type="text"
                  required
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  placeholder="VD: Barista Chuyên Nghiệp / Trưởng Ca 24/7"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-black text-[#2b170e] focus:outline-none focus:border-amber-600"
                />
              </div>

              {/* Phòng ban & Hình thức */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-[#2b170e] block mb-1">Phòng Ban / Khối Vận Hành</label>
                  <select
                    value={editingJob.department}
                    onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2b170e]"
                  >
                    <option value="Khối Vận Hành Cửa Hàng">Khối Vận Hành Cửa Hàng</option>
                    <option value="Ban Điều Hành">Ban Điều Hành</option>
                    <option value="Phòng Kế Toán - Tài Chính">Phòng Kế Toán - Tài Chính</option>
                    <option value="Phòng Marketing & Thương Hiệu">Phòng Marketing & Thương Hiệu</option>
                    <option value="Phòng Hành Chính - Nhân Sự (HR)">Phòng Hành Chính - Nhân Sự (HR)</option>
                    <option value="Khối Đảm Bảo Chất Lượng (QA/QC)">Khối Đảm Bảo Chất Lượng (QA/QC)</option>
                    <option value="Khối An Ninh & Trật Tự">Khối An Ninh & Trật Tự</option>
                    <option value="Khối Vệ Sinh & Tạp Vụ">Khối Vệ Sinh & Tạp Vụ</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2b170e] block mb-1">Hình Thức Làm Việc</label>
                  <select
                    value={editingJob.type}
                    onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2b170e]"
                  >
                    <option value="Toàn thời gian (Full-time)">Toàn thời gian (Full-time)</option>
                    <option value="Bán thời gian (Part-time)">Bán thời gian (Part-time)</option>
                    <option value="Toàn thời gian hoặc Bán thời gian">Cả Full-time & Part-time</option>
                  </select>
                </div>
              </div>

              {/* Lương & Ca làm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-[#2b170e] block mb-1">Mức Lương / Thu Nhập *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.salary}
                    onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                    placeholder="VD: 8.000.000đ - 12.000.000đ/tháng"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-black text-amber-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2b170e] block mb-1">Ca Làm Việc</label>
                  <input
                    type="text"
                    value={editingJob.shift}
                    onChange={(e) => setEditingJob({ ...editingJob, shift: e.target.value })}
                    placeholder="VD: Ca xoay 8 tiếng (Sáng / Chiều / Đêm)..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#2b170e]"
                  />
                </div>
              </div>

              {/* Hạn nộp & Địa điểm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-[#2b170e] block mb-1">Hạn Nộp Hồ Sơ</label>
                  <input
                    type="text"
                    value={editingJob.deadline || 'Tuyển liên tục'}
                    onChange={(e) => setEditingJob({ ...editingJob, deadline: e.target.value })}
                    placeholder="VD: Tuyển liên tục hoặc 30/11/2026"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#2b170e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2b170e] block mb-1">Địa Điểm Làm Việc</label>
                  <input
                    type="text"
                    value={Array.isArray(editingJob.locations) ? editingJob.locations.join(' | ') : editingJob.locations}
                    onChange={(e) => setEditingJob({ ...editingJob, locations: e.target.value.split('|').map(s => s.trim()) })}
                    placeholder="Chi nhánh 413 Phan Huy Ích | Chi nhánh 96 D5"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#2b170e]"
                  />
                </div>
              </div>

              {/* Mô tả tổng quan */}
              <div>
                <label className="text-xs font-bold text-[#2b170e] block mb-1">Mô Tả Tổng Quan Công Việc</label>
                <textarea
                  rows={2}
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn vị trí công việc..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-[#2b170e] leading-relaxed resize-none"
                />
              </div>

              {/* Yêu cầu ứng viên (mỗi dòng 1 yêu cầu) */}
              <div>
                <label className="text-xs font-bold text-[#2b170e] block mb-1">
                  Yêu Cầu Ứng Viên (Mỗi dòng là một gạch đầu dòng)
                </label>
                <textarea
                  rows={3}
                  value={Array.isArray(editingJob.requirements) ? editingJob.requirements.join('\n') : editingJob.requirements}
                  onChange={(e) => setEditingJob({ ...editingJob, requirements: e.target.value.split('\n').filter(s => s.trim()) })}
                  placeholder="Từ 18 tuổi trở lên, trung thực, nhanh nhẹn&#10;Có tinh thần trách nhiệm và sẵn sàng làm ca đêm..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-[#2b170e] leading-relaxed resize-none font-mono"
                />
              </div>

              {/* Quyền lợi đãi ngộ (mỗi dòng 1 quyền lợi) */}
              <div>
                <label className="text-xs font-bold text-[#2b170e] block mb-1">
                  Quyền Lợi & Đãi Ngộ (Mỗi dòng là một gạch đầu dòng)
                </label>
                <textarea
                  rows={3}
                  value={Array.isArray(editingJob.benefits) ? editingJob.benefits.join('\n') : editingJob.benefits}
                  onChange={(e) => setEditingJob({ ...editingJob, benefits: e.target.value.split('\n').filter(s => s.trim()) })}
                  placeholder="Cà phê miễn phí mỗi ca làm việc&#10;Phụ cấp ca đêm & thưởng KPI doanh số&#10;Đầy đủ chế độ BHXH..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-[#2b170e] leading-relaxed resize-none font-mono"
                />
              </div>

              {/* Toggles: Urgent & Featured & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingJob(prev => ({ ...prev, urgent: !prev.urgent }))}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    editingJob.urgent
                      ? 'bg-rose-50 border-rose-300 text-rose-700 font-black'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-600" />
                    Tuyển Gấp
                  </span>
                  <span>{editingJob.urgent ? 'BẬT' : 'TẮT'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingJob(prev => ({ ...prev, featured: !prev.featured }))}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    editingJob.featured
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-black'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-600" />
                    Vị Trí Hot
                  </span>
                  <span>{editingJob.featured ? 'BẬT' : 'TẮT'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingJob(prev => ({ ...prev, active: prev.active === false ? true : false }))}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    editingJob.active !== false
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-black'
                      : 'bg-stone-100 border-stone-200 text-stone-500'
                  }`}
                >
                  <span>Hiển Thị Mở Tuyển</span>
                  <span>{editingJob.active !== false ? 'BẬT MỞ' : 'TẠM ẨN'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white font-black text-xs shadow-md cursor-pointer transition-all"
                >
                  {isNewJob ? 'XUẤT BẢN VỊ TRÍ MỚI' : 'LƯU THAY ĐỔI'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
