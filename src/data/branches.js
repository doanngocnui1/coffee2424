import { saveCloudSiteConfig } from '../lib/supabase.js';
import { getSiteConfig } from './siteConfig.js';

export const DEFAULT_BRANCHES = [
  {
    id: 'cn-96d5',
    code: '96D5',
    name: 'Coffee 24/24 96D5',
    shortName: '96 Đường D5',
    address: '96 đường D5, Phường Thạnh Mỹ Tây - Thành phố Hồ Chí Minh',
    district: 'Bình Thạnh / Thạnh Mỹ Tây',
    hotline: '0347374858',
    hours: 'Mở cửa 24/7',
    status: 'Đang mở cửa',
    image: '/images/branch_96d5.webp',
    aspectRatio: '3/4',
    imagePosition: 'center',
    qrImage: '/images/qr_menu_96d5.png',
    cardImage: '/images/qr_menu_table_card_96d5.png',
    menuUrl: 'https://coffee2424.web-store.online/menu/363827',
    mapUrl: 'https://maps.google.com/?q=96+duong+D5+Binh+Thanh+Ho+Chi+Minh',
    features: ['Máy lạnh 16 độ mát rượi', 'Ổ điện đầy đủ từng bàn', 'Wifi 1000mbps', 'Giữ xe miễn phí'],
    description: 'Không gian ấm cúng, yên tĩnh'
  },
  {
    id: 'cn-413phi',
    code: '413PHI',
    name: 'Coffee 24/24 413PHI',
    shortName: '413 Phan Huy Ích',
    address: '413 Phan huy Ích, Phường An Hội Tây - Thành phố Hồ Chí Minh',
    district: 'Gò Vấp / An Hội Tây',
    hotline: '0986511897',
    hours: 'Mở cửa 24/7',
    status: 'Đang mở cửa',
    image: '/images/branch_413phi.webp',
    aspectRatio: '3/4',
    imagePosition: 'center',
    qrImage: '/images/qr_menu_table.png',
    cardImage: '/images/qr_menu_table_card.png',
    menuUrl: 'https://coffee2424.web-store.online/menu/363688',
    mapUrl: 'https://maps.google.com/?q=413+Phan+Huy+Ich+Ho+Chi+Minh',
    features: ['Máy lạnh 16 độ mát rượi', 'Ổ điện đầy đủ từng bàn', 'Wifi 1000mbps', 'Giữ xe miễn phí'],
    description: 'Thiết kế 3 tầng lô góc thoáng đãng'
  }
];

export const BRANCHES = DEFAULT_BRANCHES;

export function getBranches() {
  try {
    const saved = localStorage.getItem('coffee2424_branches');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Đồng bộ link KiotViet chuẩn & tự động nâng cấp ảnh mockup cũ sang ảnh thực tế
        return parsed.map(b => {
          if (b.id === 'cn-96d5') {
            if (!b.menuUrl || b.menuUrl.includes('web-store.online') === false) {
              b.menuUrl = 'https://coffee2424.web-store.online/menu/363827';
            }
            // Tự động thay thế nếu trình duyệt cũ còn lưu ảnh mockup
            if (!b.image || b.image === '/images/branch_rooftop.jpg') {
              b.image = '/images/branch_96d5.webp';
            }
          }
          if (b.id === 'cn-413phi') {
            if (!b.menuUrl || b.menuUrl.includes('web-store.online') === false) {
              b.menuUrl = 'https://coffee2424.web-store.online/menu/363688';
            }
            // Tự động thay thế nếu trình duyệt cũ còn lưu ảnh mockup
            if (!b.image || b.image === '/images/branch_downtown.jpg') {
              b.image = '/images/branch_413phi.webp';
            }
          }
          // Chuẩn hóa khung hình
          if (!b.aspectRatio) {
            b.aspectRatio = '3/4';
          }
          if (!b.imagePosition) {
            b.imagePosition = 'center';
          }
          return b;
        });
      }
    }
  } catch (e) {
    console.error('Error reading branches from storage:', e);
  }
  return DEFAULT_BRANCHES;
}

export function saveBranches(branches) {
  try {
    localStorage.setItem('coffee2424_branches', JSON.stringify(branches));
    window.dispatchEvent(new Event('branches-updated'));

    // Tự động đồng bộ lên Supabase Cloud để mọi thiết bị/trình duyệt khác nhận được ngay
    if (typeof window !== 'undefined') {
      try {
        const cfg = getSiteConfig();
        saveCloudSiteConfig({ ...cfg, branches }).catch(err => {
          console.warn('Auto-sync branches to cloud failed:', err);
        });
      } catch (_) {}
    }

    return true;
  } catch (e) {
    console.error('Error saving branches to storage:', e);
    return false;
  }
}

export function createBranch(newBranchData) {
  try {
    const list = getBranches();
    const id = newBranchData.id || ('cn-' + Date.now().toString(36));
    const newBranch = {
      id,
      code: newBranchData.code || ('CN' + (list.length + 1)),
      name: newBranchData.name || 'Chi Nhánh Mới',
      shortName: newBranchData.shortName || newBranchData.name || 'Chi Nhánh Mới',
      address: newBranchData.address || '',
      district: newBranchData.district || 'Hồ Chí Minh',
      hotline: newBranchData.hotline || '0906916816',
      hours: newBranchData.hours || 'Mở cửa 24/7',
      status: 'Đang mở cửa',
      image: newBranchData.image || '/images/branch_413phi.webp',
      aspectRatio: newBranchData.aspectRatio || '4/3',
      imagePosition: newBranchData.imagePosition || 'center',
      menuUrl: newBranchData.menuUrl || 'https://coffee2424.web-store.online',
      mapUrl: newBranchData.mapUrl || '',
      features: newBranchData.features || ['Phục vụ 24/7', 'Wifi tốc độ cao', 'Ổ cắm điện'],
      description: newBranchData.description || 'Không gian cà phê mở cửa 24/7 chào đón bạn.'
    };
    list.push(newBranch);
    saveBranches(list);
    return { success: true, branch: newBranch };
  } catch (e) {
    console.error('Error creating branch:', e);
    return { success: false, error: e.message };
  }
}

export function updateBranch(id, updatedFields) {
  try {
    const list = getBranches();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return { success: false, error: 'Không tìm thấy chi nhánh' };
    list[idx] = { ...list[idx], ...updatedFields };
    saveBranches(list);
    return { success: true, branch: list[idx] };
  } catch (e) {
    console.error('Error updating branch:', e);
    return { success: false, error: e.message };
  }
}

export function deleteBranch(id) {
  try {
    const list = getBranches();
    const filtered = list.filter(b => b.id !== id);
    saveBranches(filtered);
    return { success: true };
  } catch (e) {
    console.error('Error deleting branch:', e);
    return { success: false, error: e.message };
  }
}

export function resetDefaultBranches() {
  saveBranches(DEFAULT_BRANCHES);
  return DEFAULT_BRANCHES;
}
