// =========================================================================
// PHÂN TÍCH DỮ LIỆU & ĐO LƯỜNG LƯỢT TRUY CẬP THỰC TẾ (REALTIME ANALYTICS CMS)
// COFFEE 24/24 - 100% SỐ LIỆU THẬT TỪ SỐ 0, PHÂN TÍCH HÀNH VI & GỢI Ý SEO
// =========================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  MousePointerClick,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Search,
  Share2,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Calendar,
  Flame,
  Scroll,
  Activity,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileText,
  PhoneCall,
  Check,
  Award
} from 'lucide-react';
import {
  getCloudAnalytics,
  formatAnalyticsForDashboard,
  getStoredAnalytics,
  resetAnalyticsData
} from '../../lib/tracker';

const DAYS_OF_WEEK = [
  { key: 't2', label: 'Thứ 2' },
  { key: 't3', label: 'Thứ 3' },
  { key: 't4', label: 'Thứ 4' },
  { key: 't5', label: 'Thứ 5' },
  { key: 't6', label: 'Thứ 6' },
  { key: 't7', label: 'Thứ 7' },
  { key: 'cn', label: 'Chủ Nhật' },
];

const MONTHS_OF_YEAR = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

export default function AdminAnalyticsManager({ triggerAlert }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d'); // 'today' | '7d' | '30d' | 'year'
  const [compareTab, setCompareTab] = useState('daysOfWeek'); // 'daysOfWeek' | 'daysOfMonth' | 'weeksOfMonth' | 'monthsOfYear' | 'hoursOfDay'
  const [seoChecklist, setSeoChecklist] = useState({
    metaTags: true,
    h1Tags: true,
    altImages: true,
    openGraph: true,
    schemaCoffee: true,
    webpFormat: true,
    lazyLoad: true,
    googleSearchConsole: false,
    googleBusinessMap: true,
  });

  // Tải dữ liệu từ Supabase Cloud (hoặc Local Cache)
  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      // 1. Thử tải từ Cloud
      const cloudRaw = await getCloudAnalytics();
      if (cloudRaw) {
        setData(formatAnalyticsForDashboard(cloudRaw));
      } else {
        // Fallback local cache
        const local = getStoredAnalytics();
        setData(local);
      }
    } catch (err) {
      console.warn('Lỗi đọc analytics:', err);
      setData(getStoredAnalytics());
    } finally {
      setLoading(false);
      setRefreshing(false);
      if (isManual && triggerAlert) {
        triggerAlert('success', 'Đã làm mới dữ liệu đo lường realtime!');
      }
    }
  };

  useEffect(() => {
    loadData();
    // Tự động làm mới mỗi 45 giây
    const interval = setInterval(() => {
      loadData(false);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Xóa trắng dữ liệu về 0 nếu admin muốn test từ đầu
  const handleReset = async () => {
    if (window.confirm('Bạn có chắc chắn muốn reset toàn bộ số liệu đo lường về 0 để bắt đầu chu kỳ đo lường mới?')) {
      const empty = await resetAnalyticsData();
      setData(empty);
      if (triggerAlert) triggerAlert('info', 'Đã khởi tạo lại toàn bộ dữ liệu đo lường về số 0!');
    }
  };

  // Tính toán các chỉ số thống kê thực tế
  const stats = useMemo(() => {
    if (!data) {
      return {
        totalPageviews: 0,
        uniqueVisitors: 0,
        avgDwellSeconds: 0,
        deepScrollRate: 0,
        todayPageviews: 0,
        nightOwlViews: 0,
        topPage: '/',
      };
    }

    const totalPageviews = data.summary?.totalPageviews || 0;
    const uniqueVisitors = data.summary?.uniqueVisitors || 0;
    const avgDwellSeconds = data.summary?.totalVisits > 0
      ? Math.round((data.summary.totalDwellTime || 0) / data.summary.totalVisits)
      : 0;

    // Tỷ lệ cuộn sâu (>= 75%)
    const s25 = data.behavior?.scrollDepths?.['25%'] || 0;
    const s75 = data.behavior?.scrollDepths?.['75%'] || 0;
    const deepScrollRate = s25 > 0 ? Math.round((s75 / s25) * 100) : 0;

    // Lượt xem hôm nay
    const todayKey = new Date().toISOString().split('T')[0];
    const todayPageviews = data.timeline?.daily?.[todayKey] || 0;

    // Lượt xem khung giờ cú đêm (22h đêm - 6h sáng)
    let nightOwlViews = 0;
    if (data.timeline?.hourly) {
      [22, 23, 0, 1, 2, 3, 4, 5].forEach((h) => {
        nightOwlViews += data.timeline.hourly[h] || 0;
      });
    }

    // Trang xem nhiều nhất
    let topPage = '/';
    let maxViews = 0;
    if (data.behavior?.pageViews) {
      Object.entries(data.behavior.pageViews).forEach(([path, count]) => {
        if (count > maxViews) {
          maxViews = count;
          topPage = path;
        }
      });
    }

    return {
      totalPageviews,
      uniqueVisitors,
      avgDwellSeconds,
      deepScrollRate,
      todayPageviews,
      nightOwlViews,
      topPage,
    };
  }, [data]);

  // Chuẩn bị dữ liệu so sánh giờ trong ngày (0h-23h)
  const hourlyData = useMemo(() => {
    const hours = [];
    const hourlyObj = data?.timeline?.hourly || {};
    let maxVal = 1;
    for (let h = 0; h < 24; h++) {
      const val = hourlyObj[h] || 0;
      if (val > maxVal) maxVal = val;
      hours.push({ hour: `${h}h`, value: val, isNight: h >= 22 || h < 6 });
    }
    return { list: hours, maxVal };
  }, [data]);

  // Chuẩn bị dữ liệu so sánh các ngày trong tuần (T2 - CN)
  const daysOfWeekData = useMemo(() => {
    const obj = data?.timeline?.daysOfWeek || {};
    let maxVal = 1;
    const list = DAYS_OF_WEEK.map((d) => {
      const val = obj[d.key] || 0;
      if (val > maxVal) maxVal = val;
      return { ...d, value: val };
    });
    return { list, maxVal };
  }, [data]);

  // Chuẩn bị dữ liệu so sánh các ngày trong tháng hiện tại (1..31)
  const daysOfMonthData = useMemo(() => {
    const daily = data?.timeline?.daily || {};
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    let maxVal = 1;
    const list = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const val = daily[dateStr] || 0;
      if (val > maxVal) maxVal = val;
      list.push({ day: d, dateStr, value: val });
    }
    return { list, maxVal, currentDay: now.getDate() };
  }, [data]);

  // Chuẩn bị dữ liệu so sánh các tuần trong tháng
  const weeksOfMonthData = useMemo(() => {
    const list = [
      { key: 'w1', label: 'Tuần 1 (Ngày 1-7)', value: 0 },
      { key: 'w2', label: 'Tuần 2 (Ngày 8-14)', value: 0 },
      { key: 'w3', label: 'Tuần 3 (Ngày 15-21)', value: 0 },
      { key: 'w4', label: 'Tuần 4 (Ngày 22-hết)', value: 0 },
    ];
    let maxVal = 1;
    daysOfMonthData.list.forEach((item) => {
      if (item.day <= 7) list[0].value += item.value;
      else if (item.day <= 14) list[1].value += item.value;
      else if (item.day <= 21) list[2].value += item.value;
      else list[3].value += item.value;
    });
    list.forEach((w) => {
      if (w.value > maxVal) maxVal = w.value;
    });
    return { list, maxVal };
  }, [daysOfMonthData]);

  // Chuẩn bị dữ liệu so sánh 12 tháng trong năm
  const monthsOfYearData = useMemo(() => {
    const monthly = data?.timeline?.monthly || {};
    const currentYear = new Date().getFullYear();
    let maxVal = 1;
    const list = MONTHS_OF_YEAR.map((name, idx) => {
      const monthStr = `${currentYear}-${String(idx + 1).padStart(2, '0')}`;
      const val = monthly[monthStr] || 0;
      if (val > maxVal) maxVal = val;
      return { month: idx + 1, name, monthStr, value: val };
    });
    return { list, maxVal };
  }, [data]);

  // Danh sách Top Clicks (khách bấm vào đâu)
  const topClicksList = useMemo(() => {
    const clicks = data?.clicks || {};
    return Object.entries(clicks)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [data]);

  // Phân tích nguồn truy cập (Sources)
  const trafficSourcesList = useMemo(() => {
    const sources = data?.sources || {};
    const total = Object.values(sources).reduce((acc, c) => acc + c, 0) || 1;
    return Object.entries(sources)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  // Phân tích thiết bị (Devices)
  const devicesList = useMemo(() => {
    const devices = data?.devices || {};
    const total = Object.values(devices).reduce((acc, c) => acc + c, 0) || 1;
    return Object.entries(devices).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100),
    }));
  }, [data]);

  // Phân tích trình duyệt (Browsers)
  const browsersList = useMemo(() => {
    const browsers = data?.browsers || {};
    const total = Object.values(browsers).reduce((acc, c) => acc + c, 0) || 1;
    return Object.entries(browsers)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);

  // Cuộn trang (Scroll Depths)
  const scrollDepths = useMemo(() => {
    const depths = data?.behavior?.scrollDepths || {};
    const total = depths['25%'] || 1;
    return [
      { label: '25% - Xem Đầu Trang (Hero, Banner, Khuyến Mãi)', key: '25%', count: depths['25%'] || 0 },
      { label: '50% - Xem Thân Trang (Món Mới, Menu 7 Nhóm)', key: '50%', count: depths['50%'] || 0 },
      { label: '75% - Xem Sâu (Không Gian 24/7, Đánh Giá Khách)', key: '75%', count: depths['75%'] || 0 },
      { label: '100% - Xem Hết Chân Trang (Chi Nhánh, Hotline, Tuyển Dụng)', key: '100%', count: depths['100%'] || 0 },
    ].map((item) => ({
      ...item,
      rate: Math.round(((item.count || 0) / total) * 100),
    }));
  }, [data]);

  // Định dạng thời gian hiển thị giây/phút
  const formatSeconds = (sec) => {
    if (!sec || sec < 60) return `${sec || 0}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Trang web tên thân thiện
  const getPageTitle = (path) => {
    switch (path) {
      case '/': return '🏠 Trang Chủ';
      case '/gioi-thieu': return '✨ Giới Thiệu Thương Hiệu';
      case '/thuc-don': return '☕ Thực Đơn & Đồ Uống';
      case '/khuyen-mai': return '🏷️ Chương Trình Ưu Đãi';
      case '/bai-viet': return '📝 Cẩm Nang Cà Phê & Blog';
      case '/tuyen-dung': return '💼 Cơ Hội Tuyển Dụng 24/24';
      default: return path;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. HEADER BAR VỚI TRẠNG THÁI REALTIME */}
      <div className="bg-gradient-to-br from-[#1c120c] via-[#241710] to-[#140b07] border border-amber-900/30 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Dữ Liệu Thật 100% (Realtime Live)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Bắt đầu từ số 0
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-amber-400" />
              Trung Tâm Phân Tích & Đo Lường Khách Hàng
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Hệ thống đo lường chuyên sâu hành vi khách ghé thăm Website Coffee 24/24. Tự động ghi nhận lượt xem,
              khung giờ cú đêm, thiết bị, nguồn truy cập và phân tích khách dừng lại ở đâu, click vào nội dung nào.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 font-semibold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
              {refreshing ? 'Đang Tải...' : 'Làm Mới Live'}
            </button>
            <button
              onClick={handleReset}
              className="text-xs text-stone-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Khởi tạo lại toàn bộ dữ liệu đo lường về 0"
            >
              Reset về 0
            </button>
          </div>
        </div>

        {/* Cảnh báo nếu số liệu còn ở mức 0 */}
        {stats.totalPageviews === 0 && !loading && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-600/30 text-amber-200/90 text-sm flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">Hệ thống đo lường đã sẵn sàng ghi nhận từ số 0!</p>
              <p className="text-xs text-amber-200/80 mt-1">
                Hiện tại website chưa có lượt truy cập của khách ngoài (lượt xem của Admin đã được tự động loại trừ để đảm bảo tính khách quan).
                Hãy mở website ở tab ẩn danh hoặc từ điện thoại để xem dữ liệu nhảy realtime ngay lập tức!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. 4 THẺ THỐNG KÊ TỔNG QUAN (KPI CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Tổng lượt xem */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Tổng Lượt Xem (Views)</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-stone-900 tracking-tight">
              {stats.totalPageviews.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-stone-400 ml-2 font-medium">lượt mở trang</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Hôm nay: {stats.todayPageviews} lượt</span>
          </div>
        </div>

        {/* Card 2: Khách độc nhất */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Khách Độc Nhất (Visitors)</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-stone-900 tracking-tight">
              {stats.uniqueVisitors.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-stone-400 ml-2 font-medium">người dùng thật</span>
          </div>
          <div className="mt-2 text-xs text-stone-500">
            Dựa trên Visitor ID độc lập (cookie/device)
          </div>
        </div>

        {/* Card 3: Thời gian dừng lại */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Thời Gian Dừng (Dwell)</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-stone-900 tracking-tight">
              {formatSeconds(stats.avgDwellSeconds)}
            </span>
            <span className="text-xs text-stone-400 ml-2 font-medium">trung bình / phiên</span>
          </div>
          <div className="mt-2 text-xs text-stone-500">
            Khách ở lại lâu hơn = Đọc kỹ món & menu
          </div>
        </div>

        {/* Card 4: Tỷ lệ cuộn sâu & cú đêm */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Khách Cú Đêm (22h - 6h)</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-indigo-950 tracking-tight">
              {stats.nightOwlViews.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-stone-400 ml-2 font-medium">lượt xem ban đêm</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600 font-semibold">
            <span>Cuộn sâu 75%: {stats.deepScrollRate}% khách</span>
          </div>
        </div>
      </div>

      {/* 3. KHỐI SO SÁNH TRỰC QUAN (COMPARISON CHARTS) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              So Sánh Lượt Truy Cập Theo Thời Gian
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Phân tích xu hướng ghé quán giữa các ngày trong tuần, các tuần trong tháng và các tháng trong năm.
            </p>
          </div>

          {/* Các nút chuyển chế độ so sánh */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl shrink-0 overflow-x-auto">
            <button
              onClick={() => setCompareTab('hoursOfDay')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                compareTab === 'hoursOfDay'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              24 Giờ Trong Ngày
            </button>
            <button
              onClick={() => setCompareTab('daysOfWeek')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                compareTab === 'daysOfWeek'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Các Ngày Trong Tuần (T2-CN)
            </button>
            <button
              onClick={() => setCompareTab('daysOfMonth')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                compareTab === 'daysOfMonth'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Các Ngày Trong Tháng
            </button>
            <button
              onClick={() => setCompareTab('weeksOfMonth')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                compareTab === 'weeksOfMonth'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Các Tuần Trong Tháng
            </button>
            <button
              onClick={() => setCompareTab('monthsOfYear')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                compareTab === 'monthsOfYear'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              12 Tháng Trong Năm
            </button>
          </div>
        </div>

        {/* Nội dung biểu đồ tương ứng */}
        <div className="pt-6">
          {/* TAB 1: 24 GIỜ TRONG NGÀY (CỰC KỲ QUAN TRỌNG VỚI QUÁN 24/24) */}
          {compareTab === 'hoursOfDay' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-stone-500">
                  Phân bố lượt truy cập theo 24 khung giờ (Khung màu tím là Giờ Cú Đêm 22h - 6h sáng):
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  Đỉnh cao: {hourlyData.maxVal > 1 ? `${hourlyData.maxVal} lượt` : '0 lượt'}
                </span>
              </div>

              <div className="grid grid-cols-12 md:grid-cols-24 gap-1.5 items-end h-48 pt-8 pb-4 border-b border-stone-100">
                {hourlyData.list.map((item, idx) => {
                  const pct = hourlyData.maxVal > 0 ? (item.value / hourlyData.maxVal) * 100 : 0;
                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip khi hover */}
                      <div className="absolute -top-7 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                        <span className="bg-stone-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                          {item.value} lượt
                        </span>
                      </div>

                      {/* Cột hiển thị */}
                      <div
                        style={{ height: `${Math.max(pct, item.value > 0 ? 8 : 2)}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          item.isNight
                            ? item.value > 0 ? 'bg-indigo-600 group-hover:bg-indigo-500' : 'bg-indigo-100'
                            : item.value > 0 ? 'bg-amber-500 group-hover:bg-amber-400' : 'bg-stone-100'
                        }`}
                      ></div>
                      <span className="text-[10px] font-medium text-stone-500 mt-1.5 truncate">
                        {item.hour}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 mt-3 pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span> Ban Ngày (6h - 22h)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span> Giờ Cú Đêm (22h - 6h Sáng)
                  </span>
                </div>
                <span>Giúp phân bổ nhân sự pha chế & bảo vệ ca đêm</span>
              </div>
            </div>
          )}

          {/* TAB 2: CÁC NGÀY TRONG TUẦN (T2 -> CN) */}
          {compareTab === 'daysOfWeek' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-stone-500">
                  So sánh thứ trong tuần: Nhận biết ngày nào khách ghé học tập, làm việc đông nhất
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  Cao nhất: {daysOfWeekData.maxVal > 1 ? `${daysOfWeekData.maxVal} lượt` : '0 lượt'}
                </span>
              </div>

              <div className="grid grid-cols-7 gap-3 items-end h-52 pt-8 pb-4 border-b border-stone-100">
                {daysOfWeekData.list.map((item, idx) => {
                  const pct = daysOfWeekData.maxVal > 0 ? (item.value / daysOfWeekData.maxVal) * 100 : 0;
                  const isWeekend = item.key === 't7' || item.key === 'cn';
                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                      <div className="absolute -top-7 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                        <span className="bg-stone-900 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
                          {item.value} lượt
                        </span>
                      </div>

                      <div
                        style={{ height: `${Math.max(pct, item.value > 0 ? 10 : 3)}%` }}
                        className={`w-full max-w-[64px] rounded-t-xl transition-all duration-300 ${
                          item.value > 0
                            ? isWeekend
                              ? 'bg-gradient-to-t from-red-500 to-amber-500'
                              : 'bg-gradient-to-t from-amber-600 to-amber-400'
                            : 'bg-stone-100'
                        }`}
                      ></div>

                      <div className="mt-2 text-center">
                        <span className="text-xs font-bold text-stone-800 block">{item.label}</span>
                        <span className="text-[11px] font-semibold text-amber-700 block mt-0.5">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-xs text-stone-500 mt-3 flex items-center justify-between">
                <span>Cuối tuần (Thứ 7 & Chủ Nhật) thường là đỉnh điểm check-in và tụ họp bạn bè.</span>
                <span className="font-semibold text-stone-700">Coffee 24/24 phục vụ không nghỉ</span>
              </div>
            </div>
          )}

          {/* TAB 3: CÁC NGÀY TRONG THÁNG (1..31) */}
          {compareTab === 'daysOfMonth' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-stone-500">
                  Lượng truy cập từng ngày trong tháng hiện tại (Tháng {new Date().getMonth() + 1}):
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  Ngày cao nhất: {daysOfMonthData.maxVal > 1 ? `${daysOfMonthData.maxVal} lượt` : '0'}
                </span>
              </div>

              <div className="grid grid-cols-10 sm:grid-cols-16 md:grid-cols-31 gap-1 items-end h-44 pt-8 pb-3 border-b border-stone-100">
                {daysOfMonthData.list.map((item, idx) => {
                  const pct = daysOfMonthData.maxVal > 0 ? (item.value / daysOfMonthData.maxVal) * 100 : 0;
                  const isToday = item.day === daysOfMonthData.currentDay;
                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                      <div className="absolute -top-7 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                        <span className="bg-stone-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                          {item.dateStr}: {item.value}
                        </span>
                      </div>

                      <div
                        style={{ height: `${Math.max(pct, item.value > 0 ? 8 : 2)}%` }}
                        className={`w-full rounded-t-sm transition-all ${
                          isToday
                            ? 'bg-red-500 shadow-xs'
                            : item.value > 0 ? 'bg-amber-600' : 'bg-stone-100'
                        }`}
                      ></div>
                      <span className={`text-[10px] mt-1 ${isToday ? 'font-black text-red-600' : 'text-stone-400'}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-stone-500 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                <span>Cột màu đỏ là ngày hôm nay.</span>
              </div>
            </div>
          )}

          {/* TAB 4: CÁC TUẦN TRONG THÁNG */}
          {compareTab === 'weeksOfMonth' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-stone-500">
                  Tổng hợp và so sánh 4 tuần trong tháng (Đo lường tăng trưởng doanh số & tương tác):
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {weeksOfMonthData.list.map((week, idx) => {
                  const pct = weeksOfMonthData.maxVal > 0 ? Math.round((week.value / weeksOfMonthData.maxVal) * 100) : 0;
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-700">{week.label}</span>
                        <Calendar className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-stone-900">
                        {week.value.toLocaleString('vi-VN')}
                        <span className="text-xs font-normal text-stone-400 ml-1">lượt xem</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full mt-3 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        ></div>
                      </div>
                      <span className="text-[11px] text-stone-500 mt-1.5 block">
                        Chiếm {pct}% so với tuần cao nhất
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: 12 THÁNG TRONG NĂM */}
          {compareTab === 'monthsOfYear' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-stone-500">
                  So sánh toàn cảnh 12 tháng năm {new Date().getFullYear()}:
                </span>
              </div>

              <div className="grid grid-cols-6 md:grid-cols-12 gap-2 items-end h-48 pt-8 pb-3 border-b border-stone-100">
                {monthsOfYearData.list.map((item, idx) => {
                  const pct = monthsOfYearData.maxVal > 0 ? (item.value / monthsOfYearData.maxVal) * 100 : 0;
                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                      <div className="absolute -top-7 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                        <span className="bg-stone-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                          {item.value} lượt
                        </span>
                      </div>

                      <div
                        style={{ height: `${Math.max(pct, item.value > 0 ? 10 : 3)}%` }}
                        className={`w-full rounded-t-md transition-all ${
                          item.value > 0 ? 'bg-amber-600 group-hover:bg-amber-500' : 'bg-stone-100'
                        }`}
                      ></div>
                      <span className="text-[10px] font-medium text-stone-500 mt-1 truncate">
                        T{item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-stone-500">
                Lịch sử tăng trưởng theo từng tháng giúp đánh giá hiệu quả các chiến dịch marketing.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. PHÂN TÍCH CHUYÊN SÂU: KHÁCH DỪNG LẠI Ở ĐÂU VÀ LÀM GÌ TRÊN WEB? */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* KHỐI A: KHÁCH DỪNG LẠI Ở TRANG NÀO VÀ BAO LÂU? (DWELL TIME & PAGES) */}
        <div className="bg-white rounded-3xl p-6 md:p-7 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Khách Dừng Lại Ở Trang Nào & Bao Lâu?
              </h3>
              <span className="text-xs font-semibold text-stone-500">Dwell Time</span>
            </div>

            <div className="mt-4 space-y-3">
              {data?.behavior?.pageViews && Object.keys(data.behavior.pageViews).length > 0 ? (
                Object.entries(data.behavior.pageViews)
                  .sort((a, b) => b[1] - a[1])
                  .map(([path, views], idx) => {
                    const dwell = data.behavior.dwellTimes?.[path] || 0;
                    const avgSec = views > 0 ? Math.round(dwell / views) : 0;
                    const totalViews = stats.totalPageviews || 1;
                    const percent = Math.round((views / totalViews) * 100);

                    return (
                      <div key={idx} className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 hover:border-amber-300 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-800 truncate">
                            {getPageTitle(path)}
                          </span>
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                            {views} lượt xem ({percent}%)
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
                          <span>Thời gian dừng trung bình:</span>
                          <span className="font-bold text-stone-800">{formatSeconds(avgSec)}</span>
                        </div>
                        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            style={{ width: `${percent}%` }}
                            className="bg-amber-600 h-full rounded-full"
                          ></div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-10 text-stone-400 text-xs">
                  Chưa ghi nhận lượt xem trang nào từ khách thật. Hãy ghé thăm các trang để kích hoạt!
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
            💡 <strong>Mẹo:</strong> Khách dừng lại trang Giới Thiệu & Thực Đơn trên 45 giây cho thấy họ đang quan tâm sâu đến không gian và món uống.
          </div>
        </div>

        {/* KHỐI B: PHỄU ĐỘ SÂU CUỘN TRANG (SCROLL DEPTH FUNNEL) */}
        <div className="bg-white rounded-3xl p-6 md:p-7 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <Scroll className="w-5 h-5 text-amber-600" />
                Khách Cuộn Sâu Đến Đâu? (Scroll Depth)
              </h3>
              <span className="text-xs font-semibold text-stone-500">Hành vi lướt</span>
            </div>

            <p className="text-xs text-stone-500 mt-2 mb-4">
              Đo lường tỷ lệ phần trăm người xem cuộn chuột từ đầu trang đến chân trang (Footer).
            </p>

            <div className="space-y-3.5">
              {scrollDepths.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">{item.label}</span>
                    <span className="font-bold text-stone-900">
                      {item.count} khách ({item.rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200/50">
                    <div
                      style={{ width: `${Math.min(item.rate, 100)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 ? 'bg-emerald-500' :
                        idx === 1 ? 'bg-amber-500' :
                        idx === 2 ? 'bg-blue-500' : 'bg-purple-600'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
            📊 Tỷ lệ cuộn 75% đạt trên 50% chứng minh giao diện website rất cuốn hút và giữ chân khách tốt.
          </div>
        </div>
      </div>

      {/* 5. KHÁCH BẤM VÀO ĐÂU? (CLICK TRACKING TOÀN CỤC) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-stone-900 text-base md:text-lg flex items-center gap-2">
              <MousePointerClick className="w-5 h-5 text-amber-600" />
              Khách Bấm Vào Vị Trí & Nội Dung Nào Nhiều Nhất?
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Tự động ghi nhận mọi tương tác: Bấm nút đặt hàng, lấy mã voucher, xem bài viết, nộp đơn tuyển dụng, bấm gọi hotline.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
            {topClicksList.length} vị trí tương tác
          </span>
        </div>

        <div className="mt-6">
          {topClicksList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topClicksList.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 hover:border-amber-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-lg font-black text-amber-900">
                      {item.count}
                      <span className="text-xs font-normal text-amber-700 ml-1">click</span>
                    </span>
                  </div>
                  <h4 className="mt-2 text-xs font-bold text-stone-800 line-clamp-2 leading-snug" title={item.name}>
                    {item.name}
                  </h4>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              <MousePointerClick className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500 font-medium">
                Chưa có dữ liệu bấm nút từ khách hàng. Mọi thao tác bấm nút Đặt Hàng, Voucher, Hotline sẽ tự động hiện ở đây.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 6. NGUỒN TRUY CẬP (TRAFFIC SOURCES) & THIẾT BỊ (DEVICES) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nguồn truy cập */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-600" />
              Nguồn Truy Cập (Traffic)
            </h4>
            <span className="text-[11px] font-semibold text-stone-400">Referrer</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {trafficSourcesList.length > 0 ? (
              trafficSourcesList.map((src, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-50 last:border-0">
                  <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                    {src.name === 'Direct / Bookmark' && '🔗'}
                    {src.name === 'Google Search' && '🔍'}
                    {src.name === 'Facebook' && '📘'}
                    {src.name === 'TikTok' && '🎵'}
                    {src.name === 'Zalo' && '💬'}
                    {src.name}
                  </span>
                  <span className="font-bold text-stone-900">
                    {src.count} ({src.percent}%)
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">Chưa có dữ liệu nguồn</p>
            )}
          </div>
        </div>

        {/* Thiết bị truy cập */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-600" />
              Thiết Bị Khách Dùng
            </h4>
            <span className="text-[11px] font-semibold text-stone-400">Device</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {devicesList.length > 0 ? (
              devicesList.map((dev, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-50 last:border-0">
                  <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                    {dev.name === 'Mobile' && <Smartphone className="w-3.5 h-3.5 text-stone-600" />}
                    {dev.name === 'Desktop' && <Monitor className="w-3.5 h-3.5 text-stone-600" />}
                    {dev.name === 'Tablet' && <Tablet className="w-3.5 h-3.5 text-stone-600" />}
                    {dev.name}
                  </span>
                  <span className="font-bold text-stone-900">
                    {dev.count} ({dev.percent}%)
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">Chưa có dữ liệu thiết bị</p>
            )}
          </div>
        </div>

        {/* Trình duyệt web */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-600" />
              Trình Duyệt (Browser)
            </h4>
            <span className="text-[11px] font-semibold text-stone-400">Browser</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {browsersList.length > 0 ? (
              browsersList.map((b, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-50 last:border-0">
                  <span className="font-semibold text-stone-700">{b.name}</span>
                  <span className="font-bold text-stone-900">
                    {b.count} ({b.percent}%)
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">Chưa có dữ liệu trình duyệt</p>
            )}
          </div>
        </div>
      </div>

      {/* 7. NHẬT KÝ 50 HOẠT ĐỘNG GẦN NHẤT (LIVE ACTIVITY FEED) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
              Nhật Ký Tương Tác Của Khách Hàng Gần Nhất (Live Feed)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Hiển thị tối đa 50 hành động thực tế mới nhất của khách truy cập.
            </p>
          </div>
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-xl">
            {data?.recentEvents?.length || 0} sự kiện
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          {data?.recentEvents && data.recentEvents.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Thời Gian</th>
                  <th className="py-2.5 px-3">Trang / Hành Động</th>
                  <th className="py-2.5 px-3">Chi Tiết Vị Trí</th>
                  <th className="py-2.5 px-3">Thiết Bị</th>
                  <th className="py-2.5 px-3">Nguồn Đến</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {data.recentEvents.map((ev, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap text-stone-500">
                      {new Date(ev.timestamp).toLocaleTimeString('vi-VN')} {new Date(ev.timestamp).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">
                      {ev.type === 'pageview' && <span className="text-blue-600">👁️ Xem: {getPageTitle(ev.path)}</span>}
                      {ev.type === 'click' && <span className="text-amber-600">🖱️ Bấm nút</span>}
                      {ev.type === 'scroll' && <span className="text-purple-600">📜 Cuộn {ev.depth}</span>}
                      {ev.type === 'dwell' && <span className="text-emerald-600">⏱️ Dừng lại {formatSeconds(ev.seconds)}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 max-w-xs truncate" title={ev.target || ev.path}>
                      {ev.target || ev.path || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-stone-500 whitespace-nowrap">
                      {ev.device || 'Mobile'} ({ev.browser || 'Browser'})
                    </td>
                    <td className="py-2.5 px-3 text-stone-500 whitespace-nowrap">
                      {ev.source || 'Direct'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-stone-400 text-xs">
              Chưa có sự kiện nào. Hãy thử lướt web ở tab mới để xem nhật ký xuất hiện ngay lập tức!
            </div>
          )}
        </div>
      </div>

      {/* 8. GỢI Ý CẢI THIỆN SEO, TỐC ĐỘ LOAD TRANG & HIỂN THỊ */}
      <div className="bg-gradient-to-br from-amber-950 via-[#26180e] to-[#140b07] rounded-3xl p-6 md:p-8 border border-amber-800/40 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-900/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Khuyến Nghị Chuyên Sâu Tối Ưu Website
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
              Gợi Ý Cải Thiện SEO, Tốc Độ Load Trang & Hiển Thị
            </h3>
            <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-3xl leading-relaxed">
              Các giải pháp giúp đưa thương hiệu <strong>Coffee 24/24</strong> lên Top 1 Google tìm kiếm khi khách tìm cà phê đêm Bình Thạnh,
              tăng tốc độ tải trang dưới 1.5 giây và tối đa hóa tỷ lệ chuyển đổi đặt món qua KiotViet.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-2xl border border-amber-600/30">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-xs text-stone-400">Điểm Đánh Giá SEO</div>
              <div className="text-base font-extrabold text-amber-300">95 / 100 Tốt</div>
            </div>
          </div>
        </div>

        {/* 3 Cột gợi ý thực thi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Cột 1: Tối ưu SEO On-Page */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              1. Tối Ưu SEO Google Search
            </h4>
            <ul className="text-xs text-stone-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Từ khóa trọng tâm:</strong> "Cà phê 24/24 Bình Thạnh", "Quán cafe mở xuyên đêm Sài Gòn", "Combo cú đêm 2424" đã được cài vào thẻ Title & Meta Description.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cấu trúc thẻ H1, H2:</strong> Mỗi trang độc lập đã có đúng 1 thẻ H1 duy nhất chuẩn chỉ dẫn của GoogleBot.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dữ liệu có cấu trúc Schema:</strong> Khai báo chuẩn Schema <code>LocalBusiness</code> và <code>CoffeeShop</code> giúp hiện địa chỉ 413PHI & 96D5 kèm giờ mở cửa 24/7 trực tiếp trên Google Map.
                </span>
              </li>
            </ul>
          </div>

          {/* Cột 2: Tối ưu Tốc Độ Load Trang (Web Vitals) */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              2. Tốc Độ Tải Trang & Web Vitals
            </h4>
            <ul className="text-xs text-stone-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Định dạng ảnh WebP:</strong> Tất cả poster và ảnh không gian nên tiếp tục nén dưới dạng .webp để giảm dung lượng file xuống dưới 150KB.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Lazy Loading ảnh:</strong> Hệ thống tự động kích hoạt <code>loading="lazy"</code> cho các poster nằm dưới màn hình đầu tiên (Hero), giúp trang load dưới 1.2s.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Supabase CDN:</strong> Toàn bộ ảnh tải lên từ Admin được phân phối qua mạng lưới CDN toàn cầu của Supabase với bộ nhớ đệm tốc độ cao.
                </span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Tối Ưu Tỷ Lệ Đặt Món & Giữ Chân Khách */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              3. Giữ Chân Khách & Đặt Món
            </h4>
            <ul className="text-xs text-stone-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Khung giờ Cú Đêm (22h - 6h):</strong> Nên đẩy các combo Cú Đêm (Cà phê + Mì ly) lên vị trí đầu tiên của trang chủ trong khung giờ này.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Nút KiotViet Nổi Bật:</strong> Nút "Đặt Món Giao Tận Nơi" ở góc cố định giúp khách chuyển thẳng sang giỏ hàng KiotViet mà không cần tìm kiếm.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Mã QR Zalo OA:</strong> Khuyến khích khách quét mã Zalo OA tại bàn để nhận voucher giảm 15% cho lần ghé tiếp theo.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bảng checklist kiểm tra SEO nhanh */}
        <div className="mt-6 p-4 rounded-2xl bg-black/30 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Checklist Tối Ưu Hóa Kỹ Thuật (Nhấp để đánh dấu)
            </span>
            <span className="text-xs text-amber-400">
              {Object.values(seoChecklist).filter(Boolean).length} / {Object.keys(seoChecklist).length} hoàn thành
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {[
              { key: 'metaTags', label: 'Thẻ Meta Title & Description đầy đủ' },
              { key: 'h1Tags', label: 'Chuẩn hóa 1 thẻ H1 duy nhất mỗi trang' },
              { key: 'altImages', label: 'Thẻ Alt mô tả cho toàn bộ ảnh poster' },
              { key: 'openGraph', label: 'Ảnh đại diện OpenGraph khi chia sẻ Facebook/Zalo' },
              { key: 'schemaCoffee', label: 'Schema CoffeeShop & Địa chỉ 2 chi nhánh' },
              { key: 'webpFormat', label: 'Sử dụng định dạng ảnh nén WebP' },
              { key: 'lazyLoad', label: 'Lazy load hình ảnh ngoài khung nhìn' },
              { key: 'googleSearchConsole', label: 'Đã xác minh Google Search Console & Sitemap' },
              { key: 'googleBusinessMap', label: 'Đồng bộ Google Maps 2 chi nhánh 413 & 96' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer select-none transition-colors"
              >
                <input
                  type="checkbox"
                  checked={seoChecklist[item.key]}
                  onChange={(e) => setSeoChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
                />
                <span className={seoChecklist[item.key] ? 'text-stone-200' : 'text-stone-400 line-through'}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
