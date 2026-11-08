/**
 * COFFEE 24/24 - REAL ANALYTICS & VISITOR BEHAVIOR TRACKER
 * Đo lường thực tế 100% từ con số 0 (Zero-Fake, Privacy-Friendly, Ultra-Lightweight)
 * - Đo lường lượt xem trang (Pageviews) theo Ngày, Tuần, Tháng, Năm
 * - Phân tích nguồn traffic: Google, Facebook, TikTok, Zalo, Trực tiếp...
 * - Phân tích thiết bị (Mobile/Desktop), Trình duyệt, Hệ điều hành
 * - Phân tích hành vi chuyên sâu: Thời gian dừng lại (Dwell time), Độ cuộn trang (Scroll depth 25/50/75/100%)
 * - Đo lường tương tác click: Nút Đặt món, Mã Voucher, Vị trí tuyển dụng, Bài viết Blog, Hotline, Chi nhánh...
 */

import { supabase, isSupabaseConfigured } from './supabase';

const VISITOR_KEY = 'coffee2424_vid';
const SESSION_KEY = 'coffee2424_sid';
const LOCAL_ANALYTICS_QUEUE = 'coffee2424_analytics_queue';

// 1. Định danh Khách độc nhất (Visitor ID) và Phiên truy cập (Session ID)
export function getVisitorId() {
  if (typeof window === 'undefined') return 'server';
  try {
    let vid = localStorage.getItem(VISITOR_KEY);
    if (!vid) {
      vid = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
      localStorage.setItem(VISITOR_KEY, vid);
    }
    return vid;
  } catch (_) {
    return 'anon_' + Math.random().toString(36).substring(2, 8);
  }
}

export function getSessionId() {
  if (typeof window === 'undefined') return 'server_session';
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch (_) {
    return 'anon_session';
  }
}

// 2. Nhận diện Thiết bị, Trình duyệt, Nguồn truy cập
export function getDeviceInfo() {
  if (typeof window === 'undefined') return { device: 'Desktop', browser: 'Unknown', os: 'Unknown' };
  const ua = navigator.userAgent || '';
  const width = window.innerWidth || window.screen?.width || 1024;
  
  // Device Type
  let device = 'Desktop';
  if (/iPad|Tablet/i.test(ua) || (width >= 640 && width <= 1024 && 'ontouchstart' in window)) {
    device = 'Tablet';
  } else if (/Mobi|Android|iPhone|iPod/i.test(ua) || width < 640) {
    device = 'Mobile';
  }

  // Browser
  let browser = 'Chrome';
  if (/Zalo/i.test(ua)) browser = 'Zalo App';
  else if (/FBAN|FBAV/i.test(ua)) browser = 'Facebook App';
  else if (/TikTok/i.test(ua)) browser = 'TikTok App';
  else if (/CocCoc/i.test(ua)) browser = 'Cốc Cốc';
  else if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

  // OS
  let os = 'Windows';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  return {
    device,
    browser,
    os,
    resolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`
  };
}

export function parseTrafficSource() {
  if (typeof window === 'undefined') return 'Direct';
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  if (utmSource) return utmSource.toUpperCase();

  const referrer = document.referrer || '';
  if (!referrer) return 'Direct (Trực tiếp)';
  
  try {
    const refHost = new URL(referrer).hostname.toLowerCase();
    const currentHost = window.location.hostname.toLowerCase();
    if (refHost === currentHost) return 'Internal (Nội bộ)';
    
    if (refHost.includes('google')) return 'Google Search';
    if (refHost.includes('facebook') || refHost.includes('fb.me')) return 'Facebook';
    if (refHost.includes('tiktok')) return 'TikTok';
    if (refHost.includes('zalo')) return 'Zalo';
    if (refHost.includes('instagram')) return 'Instagram';
    if (refHost.includes('youtube')) return 'YouTube';
    if (refHost.includes('shopee')) return 'Shopee / ShopeeFood';
    if (refHost.includes('grab')) return 'GrabFood';
    
    return refHost.replace('www.', '');
  } catch (_) {
    return 'Referrer khác';
  }
}

// 3. Hàng đợi sự kiện & Bộ gom nhóm phân tích
let eventQueue = [];
let isSyncing = false;

// Đọc dữ liệu phân tích hiện tại từ Supabase
export async function getCloudAnalytics() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('data')
      .eq('id', 'analytics')
      .maybeSingle();

    if (!error && data?.data) {
      return data.data;
    }
  } catch (err) {
    console.warn('Không thể đọc dữ liệu phân tích từ Cloud:', err);
  }
  return null;
}

// Gửi dữ liệu phân tích lên Supabase Cloud (Gộp vào id = 'analytics')
export async function flushAnalyticsToCloud() {
  if (eventQueue.length === 0 || isSyncing) return;
  isSyncing = true;

  const batch = [...eventQueue];
  eventQueue = [];

  try {
    // 1. Kéo dữ liệu analytics hiện tại từ Supabase
    let currentAnalytics = await getCloudAnalytics();
    if (!currentAnalytics || typeof currentAnalytics !== 'object') {
      currentAnalytics = {
        totalPageviews: 0,
        totalEvents: 0,
        visitors: {},
        days: {},         // "YYYY-MM-DD": { pageviews, uniqueVisitors, avgDwellTime, clicks: {} }
        months: {},       // "YYYY-MM": { pageviews, uniqueVisitors }
        hours: {},        // "0" -> "23": pageviews
        sources: {},      // "Google Search": count, "Facebook": count...
        devices: {},      // "Mobile": count, "Desktop": count...
        browsers: {},     // "Chrome": count...
        pages: {},        // "/": { views, avgDwell, bounces }, "/khuyenmai": { views, avgDwell }
        topClicks: {},    // "Đặt Món Ngay": count...
        scrollDepth: {    // Tỷ lệ khách cuộn tới các mốc
          depth25: 0,
          depth50: 0,
          depth75: 0,
          depth100: 0
        },
        recentActivities: [] // 50 sự kiện chi tiết gần nhất
      };
    }

    // 2. Tổng hợp batch mới vào currentAnalytics
    batch.forEach(evt => {
      const dateObj = new Date(evt.timestamp || Date.now());
      const dateKey = dateObj.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const monthKey = dateKey.substring(0, 7);            // "YYYY-MM"
      const hourKey = String(dateObj.getHours());

      currentAnalytics.totalEvents = (currentAnalytics.totalEvents || 0) + 1;

      // Khởi tạo ngày
      if (!currentAnalytics.days[dateKey]) {
        currentAnalytics.days[dateKey] = {
          pageviews: 0,
          visitors: {},
          dwellTotal: 0,
          dwellCount: 0,
          clicks: {}
        };
      }
      const dayData = currentAnalytics.days[dateKey];

      // Khởi tạo tháng
      if (!currentAnalytics.months[monthKey]) {
        currentAnalytics.months[monthKey] = { pageviews: 0, visitors: {} };
      }
      const monthData = currentAnalytics.months[monthKey];

      // Xử lý từng loại event
      if (evt.type === 'pageview') {
        currentAnalytics.totalPageviews = (currentAnalytics.totalPageviews || 0) + 1;
        dayData.pageviews = (dayData.pageviews || 0) + 1;
        monthData.pageviews = (monthData.pageviews || 0) + 1;

        // Giờ trong ngày
        currentAnalytics.hours[hourKey] = (currentAnalytics.hours[hourKey] || 0) + 1;

        // Visitor tracking
        if (evt.visitorId) {
          dayData.visitors[evt.visitorId] = true;
          monthData.visitors[evt.visitorId] = true;
          currentAnalytics.visitors[evt.visitorId] = true;
        }

        // Nguồn traffic
        const src = evt.source || 'Direct';
        currentAnalytics.sources[src] = (currentAnalytics.sources[src] || 0) + 1;

        // Thiết bị & Trình duyệt
        if (evt.device) {
          currentAnalytics.devices[evt.device] = (currentAnalytics.devices[evt.device] || 0) + 1;
        }
        if (evt.browser) {
          currentAnalytics.browsers[evt.browser] = (currentAnalytics.browsers[evt.browser] || 0) + 1;
        }

        // Trang
        const path = evt.path || '/';
        if (!currentAnalytics.pages[path]) {
          currentAnalytics.pages[path] = { views: 0, totalDwell: 0, dwellCount: 0, title: evt.title || path };
        }
        currentAnalytics.pages[path].views = (currentAnalytics.pages[path].views || 0) + 1;
        if (evt.title) currentAnalytics.pages[path].title = evt.title;
      }

      if (evt.type === 'dwell_time' && evt.seconds > 0) {
        dayData.dwellTotal = (dayData.dwellTotal || 0) + evt.seconds;
        dayData.dwellCount = (dayData.dwellCount || 0) + 1;

        const path = evt.path || '/';
        if (currentAnalytics.pages[path]) {
          currentAnalytics.pages[path].totalDwell = (currentAnalytics.pages[path].totalDwell || 0) + evt.seconds;
          currentAnalytics.pages[path].dwellCount = (currentAnalytics.pages[path].dwellCount || 0) + 1;
        }
      }

      if (evt.type === 'scroll_depth') {
        if (!currentAnalytics.scrollDepth) {
          currentAnalytics.scrollDepth = { depth25: 0, depth50: 0, depth75: 0, depth100: 0 };
        }
        if (evt.depth >= 100) currentAnalytics.scrollDepth.depth100 = (currentAnalytics.scrollDepth.depth100 || 0) + 1;
        else if (evt.depth >= 75) currentAnalytics.scrollDepth.depth75 = (currentAnalytics.scrollDepth.depth75 || 0) + 1;
        else if (evt.depth >= 50) currentAnalytics.scrollDepth.depth50 = (currentAnalytics.scrollDepth.depth50 || 0) + 1;
        else if (evt.depth >= 25) currentAnalytics.scrollDepth.depth25 = (currentAnalytics.scrollDepth.depth25 || 0) + 1;
      }

      if (evt.type === 'click' && evt.targetName) {
        const target = evt.targetName;
        currentAnalytics.topClicks[target] = (currentAnalytics.topClicks[target] || 0) + 1;
        dayData.clicks[target] = (dayData.clicks[target] || 0) + 1;
      }

      // 50 hành vi chi tiết gần nhất
      if (!currentAnalytics.recentActivities) currentAnalytics.recentActivities = [];
      currentAnalytics.recentActivities.unshift({
        type: evt.type,
        path: evt.path,
        targetName: evt.targetName || '',
        targetType: evt.targetType || '',
        source: evt.source || '',
        device: evt.device || '',
        seconds: evt.seconds || 0,
        depth: evt.depth || 0,
        timestamp: evt.timestamp || new Date().toISOString()
      });
    });

    // Giới hạn recentActivities tối đa 60 mục để tránh nặng JSON
    if (currentAnalytics.recentActivities.length > 60) {
      currentAnalytics.recentActivities = currentAnalytics.recentActivities.slice(0, 60);
    }

    currentAnalytics.updated_at = new Date().toISOString();

    // 3. Đẩy lên Supabase Cloud
    await supabase.from('site_config').upsert({
      id: 'analytics',
      data: currentAnalytics,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

  } catch (err) {
    console.warn('Lỗi đồng bộ analytics lên Supabase:', err);
    // Hoàn lại batch vào hàng đợi nếu lỗi
    eventQueue = [...batch, ...eventQueue];
  } finally {
    isSyncing = false;
  }
}

// 4. API Ghi nhận Sự kiện Phân Tích Thực Tế

/**
 * Ghi nhận Lượt xem trang (Pageview)
 */
export function trackPageView(path = window.location.pathname, title = document.title) {
  if (typeof window === 'undefined') return;
  // Bỏ qua trang admin để không làm nhiễu số liệu khách hàng
  if (path.startsWith('/admin')) return;

  const devInfo = getDeviceInfo();
  const source = parseTrafficSource();

  eventQueue.push({
    type: 'pageview',
    path,
    title,
    source,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    device: devInfo.device,
    browser: devInfo.browser,
    os: devInfo.os,
    resolution: devInfo.resolution,
    timestamp: new Date().toISOString()
  });

  // Tự động đẩy sau 3 giây hoặc gom nhóm
  setTimeout(flushAnalyticsToCloud, 3000);
}

/**
 * Ghi nhận Thời gian khách dừng lại trên trang (Dwell Time)
 */
export function trackDwellTime(path, seconds) {
  if (typeof window === 'undefined' || !seconds || seconds < 2) return;
  if (path.startsWith('/admin')) return;

  eventQueue.push({
    type: 'dwell_time',
    path,
    seconds: Math.round(seconds),
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    timestamp: new Date().toISOString()
  });

  flushAnalyticsToCloud();
}

/**
 * Ghi nhận Độ sâu cuộn trang (Scroll Depth)
 */
export function trackScrollDepth(path, depth) {
  if (typeof window === 'undefined') return;
  if (path.startsWith('/admin')) return;

  eventQueue.push({
    type: 'scroll_depth',
    path,
    depth,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    timestamp: new Date().toISOString()
  });
}

/**
 * Ghi nhận Hành vi bấm (Click Event Tracking)
 * @param {string} targetName - Tên nút/thành phần được bấm (VD: "Đặt Món ShopeeFood", "Voucher HAPPY40", "Đọc bài Cà Phê Mộc")
 * @param {string} targetType - Phân loại ('order', 'voucher', 'article', 'job', 'hotline', 'branch', 'button')
 * @param {string} path - Đường dẫn trang hiện tại
 */
export function trackClick(targetName, targetType = 'button', path = window.location.pathname) {
  if (typeof window === 'undefined' || !targetName) return;
  if (path.startsWith('/admin')) return;

  const devInfo = getDeviceInfo();

  eventQueue.push({
    type: 'click',
    targetName: String(targetName).trim(),
    targetType,
    path,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    device: devInfo.device,
    timestamp: new Date().toISOString()
  });

  // Gửi sớm các click quan trọng
  setTimeout(flushAnalyticsToCloud, 1000);
}

// 5. Global Listener khởi động tự động khi website chạy
let isTrackerInitialized = false;

export function initGlobalTracker() {
  if (typeof window === 'undefined' || isTrackerInitialized) return;
  isTrackerInitialized = true;

  // Lắng nghe Click toàn cục tự động với các phần tử có data-track hoặc button / link quan trọng
  document.addEventListener('click', (e) => {
    try {
      const target = e.target;
      if (!target) return;

      const trackEl = target.closest('[data-track], a, button');
      if (!trackEl) return;

      const trackName = trackEl.getAttribute('data-track') || 
                        trackEl.getAttribute('title') || 
                        trackEl.getAttribute('aria-label') || 
                        trackEl.innerText?.trim();

      if (!trackName || trackName.length > 60 || trackName.length < 2) return;

      // Xác định phân loại
      let targetType = 'button';
      const href = trackEl.getAttribute('href') || '';
      if (href.includes('tel:') || trackName.toLowerCase().includes('hotline')) targetType = 'hotline';
      else if (href.includes('shopee') || href.includes('grab') || trackName.toLowerCase().includes('đặt món') || trackName.toLowerCase().includes('order')) targetType = 'order';
      else if (trackName.toLowerCase().includes('voucher') || trackName.toLowerCase().includes('ưu đãi')) targetType = 'voucher';
      else if (href.includes('/blog') || href.includes('bai-viet')) targetType = 'article';
      else if (href.includes('/tuyendung')) targetType = 'job';
      else if (href.includes('zalo') || href.includes('facebook') || href.includes('tiktok')) targetType = 'social';

      trackClick(trackName, targetType, window.location.pathname);
    } catch (_) {}
  }, { passive: true });

  // Theo dõi độ sâu cuộn trang (Scroll Depth Tracker)
  const trackedDepths = { 25: false, 50: false, 75: false, 100: false };
  let scrollTimeout = null;

  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollPct = Math.round(((scrollTop + winHeight) / docHeight) * 100);

      [25, 50, 75, 100].forEach(d => {
        if (scrollPct >= d && !trackedDepths[d]) {
          trackedDepths[d] = true;
          trackScrollDepth(window.location.pathname, d);
        }
      });
    }, 400);
  }, { passive: true });

  // Tự động đẩy dữ liệu khi người dùng chuyển tab hoặc đóng trình duyệt
  window.addEventListener('visibilitychange', () => {
    if (document.hidden) flushAnalyticsToCloud();
  });
  window.addEventListener('beforeunload', () => {
    flushAnalyticsToCloud();
  });

  // Định kỳ đẩy dữ liệu mỗi 20 giây nếu có sự kiện mới
  setInterval(flushAnalyticsToCloud, 20000);
}

// Khởi tạo đối tượng Analytics trống (Bắt đầu từ số 0)
export function getEmptyAnalyticsData() {
  return {
    summary: {
      totalPageviews: 0,
      uniqueVisitors: 0,
      totalVisits: 0,
      totalDwellTime: 0
    },
    timeline: {
      hourly: {},
      daysOfWeek: { t2: 0, t3: 0, t4: 0, t5: 0, t6: 0, t7: 0, cn: 0 },
      daily: {},
      monthly: {}
    },
    sources: {},
    devices: {},
    browsers: {},
    clicks: {},
    behavior: {
      pageViews: {},
      dwellTimes: {},
      scrollDepths: { '25%': 0, '50%': 0, '75%': 0, '100%': 0 }
    },
    recentEvents: []
  };
}

// Chuyển đổi dữ liệu thô từ Cloud sang format hiển thị của Admin Dashboard
export function formatAnalyticsForDashboard(raw) {
  const formatted = getEmptyAnalyticsData();
  if (!raw || typeof raw !== 'object') return formatted;

  // 1. Summary
  const visitorCount = raw.visitors && typeof raw.visitors === 'object' ? Object.keys(raw.visitors).length : 0;
  let totalDwell = 0;
  let dwellCount = 0;

  if (raw.pages && typeof raw.pages === 'object') {
    Object.values(raw.pages).forEach(p => {
      totalDwell += p.totalDwell || 0;
      dwellCount += p.dwellCount || 0;
    });
  }

  formatted.summary = {
    totalPageviews: raw.totalPageviews || 0,
    uniqueVisitors: visitorCount,
    totalVisits: raw.totalEvents || raw.totalPageviews || 0,
    totalDwellTime: totalDwell
  };

  // 2. Timeline
  formatted.timeline.hourly = raw.hours || {};
  formatted.timeline.daily = {};
  formatted.timeline.monthly = {};

  if (raw.days && typeof raw.days === 'object') {
    Object.entries(raw.days).forEach(([dateStr, dayData]) => {
      const views = dayData.pageviews || 0;
      formatted.timeline.daily[dateStr] = views;

      // Tính theo thứ trong tuần
      try {
        const d = new Date(dateStr);
        const dayIdx = d.getDay(); // 0 is Sunday
        const dayKeys = ['cn', 't2', 't3', 't4', 't5', 't6', 't7'];
        const k = dayKeys[dayIdx];
        if (k) {
          formatted.timeline.daysOfWeek[k] = (formatted.timeline.daysOfWeek[k] || 0) + views;
        }
      } catch (_) {}
    });
  }

  if (raw.months && typeof raw.months === 'object') {
    Object.entries(raw.months).forEach(([monthStr, mData]) => {
      formatted.timeline.monthly[monthStr] = mData.pageviews || 0;
    });
  }

  // 3. Sources, Devices, Browsers, Clicks
  formatted.sources = raw.sources || {};
  formatted.devices = raw.devices || {};
  formatted.browsers = raw.browsers || {};
  formatted.clicks = raw.topClicks || {};

  // 4. Behavior (Pages & Scroll)
  if (raw.pages && typeof raw.pages === 'object') {
    Object.entries(raw.pages).forEach(([path, pData]) => {
      formatted.behavior.pageViews[path] = pData.views || 0;
      formatted.behavior.dwellTimes[path] = pData.totalDwell || 0;
    });
  }

  if (raw.scrollDepth && typeof raw.scrollDepth === 'object') {
    formatted.behavior.scrollDepths = {
      '25%': raw.scrollDepth.depth25 || 0,
      '50%': raw.scrollDepth.depth50 || 0,
      '75%': raw.scrollDepth.depth75 || 0,
      '100%': raw.scrollDepth.depth100 || 0
    };
  }

  // 5. Recent Events
  if (Array.isArray(raw.recentActivities)) {
    formatted.recentEvents = raw.recentActivities.map(act => ({
      type: act.type,
      path: act.path,
      target: act.targetName,
      device: act.device,
      source: act.source,
      seconds: act.seconds,
      depth: act.depth ? `${act.depth}%` : '',
      timestamp: act.timestamp
    }));
  }

  return formatted;
}

export function getStoredAnalytics() {
  try {
    const raw = localStorage.getItem('coffee2424_analytics_cache');
    if (raw) return formatAnalyticsForDashboard(JSON.parse(raw));
  } catch (_) {}
  return getEmptyAnalyticsData();
}

export async function resetAnalyticsData() {
  const empty = {
    totalPageviews: 0,
    totalEvents: 0,
    visitors: {},
    days: {},
    months: {},
    hours: {},
    sources: {},
    devices: {},
    browsers: {},
    pages: {},
    topClicks: {},
    scrollDepth: { depth25: 0, depth50: 0, depth75: 0, depth100: 0 },
    recentActivities: [],
    updated_at: new Date().toISOString()
  };

  try {
    localStorage.removeItem('coffee2424_analytics_cache');
    if (isSupabaseConfigured) {
      await supabase.from('site_config').upsert({
        id: 'analytics',
        data: empty,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }
  } catch (err) {
    console.warn('Lỗi reset analytics:', err);
  }

  return getEmptyAnalyticsData();
}
