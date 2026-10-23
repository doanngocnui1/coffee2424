// src/data/candidates.js
// Quản lý hồ sơ ứng viên & Đồng bộ Google Sheets / Google Drive

const STORAGE_KEY = 'coffee2424_candidates';

export const DEFAULT_CAREERS_CONFIG = {
  heroBadge: 'CƠ HỘI NGHỀ NGHIỆP 24/24',
  heroTitle: 'GIA NHẬP ĐỘI NGŨ',
  heroTitleHighlight: 'COFFEE 24/24',
  heroDescription: 'COFFEE 24/24 chào đón các nhân tài ở mọi vị trí từ Ban Điều Hành, Văn Phòng đến Khối Cửa Hàng Vận Hành 24/7. Môi trường trẻ trung, chế độ đãi ngộ cạnh tranh và lộ trình thăng tiến rõ ràng.',
  badges: [
    { text: 'Cà phê miễn phí mỗi ca', icon: 'coffee' },
    { text: 'Phụ cấp ca đêm & thưởng KPI', icon: 'award' },
    { text: 'BHXH đầy đủ & ESOP quản lý', icon: 'shield' }
  ],
  googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE/edit?gid=0#gid=0',
  googleSheetId: '1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE',
  googleDriveFolderUrl: 'https://drive.google.com/drive/folders/1s2L6e8FhQ5rgeYgfIkoHZHTwV8sOOhz-',
  googleDriveFolderId: '1s2L6e8FhQ5rgeYgfIkoHZHTwV8sOOhz-',
  googleScriptUrl: '', // Webhook URL từ Google Apps Script
  showFormInHero: true
};

export function getCandidates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Lỗi đọc danh sách ứng viên:', err);
  }
  return [];
}

export function saveCandidate(candidate) {
  try {
    const list = getCandidates();
    const newRecord = {
      id: 'cand-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      submittedAt: new Date().toISOString(),
      status: 'pending', // pending | contacted | interviewed | hired | rejected
      hrNote: '',
      ...candidate
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('candidates-updated'));
    return { success: true, candidate: newRecord };
  } catch (err) {
    console.error('Lỗi lưu ứng viên:', err);
    return { success: false, error: err.message };
  }
}

export function updateCandidateStatus(id, newStatus, hrNote = undefined) {
  try {
    const list = getCandidates();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx].status = newStatus;
      if (hrNote !== undefined) list[idx].hrNote = hrNote;
      list[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('candidates-updated'));
      return true;
    }
  } catch (err) {
    console.error('Lỗi cập nhật trạng thái ứng viên:', err);
  }
  return false;
}

export function deleteCandidate(id) {
  try {
    const list = getCandidates();
    const filtered = list.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('candidates-updated'));
    return true;
  } catch (err) {
    console.error('Lỗi xóa ứng viên:', err);
    return false;
  }
}

/**
 * Gửi dữ liệu ứng viên & file ảnh, CV lên Google Sheets & Google Drive qua Google Apps Script Webhook
 */
export async function sendApplicationToGoogle({
  scriptUrl,
  fullName,
  phone,
  email,
  jobTitle,
  branchName,
  note,
  photoFile,
  cvFile
}) {
  const result = {
    googleSuccess: false,
    photoDriveUrl: null,
    cvDriveUrl: null,
    message: ''
  };

  // 1. Chuyển file sang Base64
  let photoBase64 = '';
  let photoName = '';
  let photoType = '';
  if (photoFile) {
    try {
      photoName = photoFile.name;
      photoType = photoFile.type;
      photoBase64 = await fileToBase64(photoFile);
    } catch (e) {
      console.warn('Lỗi đọc ảnh chân dung:', e);
    }
  }

  let cvBase64 = '';
  let cvName = '';
  let cvType = '';
  if (cvFile) {
    try {
      cvName = cvFile.name;
      cvType = cvFile.type;
      cvBase64 = await fileToBase64(cvFile);
    } catch (e) {
      console.warn('Lỗi đọc file CV:', e);
    }
  }

  const payload = {
    spreadsheetId: '1dt8IW_QR7ap30BaEwPkKNa38QNt0k_i4zpomMlGiKYE',
    driveFolderId: '1s2L6e8FhQ5rgeYgfIkoHZHTwV8sOOhz-',
    fullName,
    phone,
    email: email || '',
    jobTitle,
    branchName: branchName || 'Toàn hệ thống',
    note: note || '',
    photoBase64,
    photoName,
    photoType,
    cvBase64,
    cvName,
    cvType,
    appliedAt: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
  };

  // 2. Nếu có scriptUrl, gửi POST lên Google Apps Script
  if (scriptUrl && scriptUrl.trim().startsWith('http')) {
    try {
      await fetch(scriptUrl.trim(), {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script Web App chuyển hướng 302, mode no-cors đảm bảo gửi thành công không bị chặn bởi trình duyệt
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      result.googleSuccess = true;
      result.message = 'Đã gửi thành công hồ sơ vào Google Sheet và Google Drive!';
    } catch (err) {
      console.warn('Lỗi khi gửi webhook Google Apps Script:', err);
      result.message = 'Chưa gửi được vào Google Apps Script: ' + err.message;
    }
  }

  return { ...result, photoName, cvName, photoBase64, cvBase64 };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Bỏ tiền tố data:...;base64, để lấy chuỗi Base64 sạch cho Apps Script
      const res = reader.result;
      const base64Clean = typeof res === 'string' && res.includes(',') ? res.split(',')[1] : res;
      resolve(base64Clean);
    };
    reader.onerror = (error) => reject(error);
  });
}
