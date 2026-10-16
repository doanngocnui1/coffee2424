export const BRANCHES = [
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
    image: '/images/branch_downtown.jpg',
    qrImage: '/images/qr_menu_table.png',
    cardImage: '/images/qr_menu_table_card.png',
    menuUrl: 'https://coffee2424.web-store.online/menu/363688',
    mapUrl: 'https://maps.google.com/?q=413+Phan+Huy+Ich+Ho+Chi+Minh',
    features: ['Máy lạnh 2 tầng', 'Ổ sạc từng bàn', 'Wifi 1000Mbps', 'Giữ xe miễn phí'],
    description: 'Không gian 2 tầng rộng rãi, ánh đèn vàng ấm cúng, phục vụ cà phê mộc xuyên suốt 24/7.'
  },
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
    image: '/images/branch_rooftop.jpg',
    qrImage: '/images/qr_menu_96d5.png',
    cardImage: '/images/qr_menu_table_card_96d5.png',
    menuUrl: 'https://coffee2424.web-store.online/menu/363827',
    mapUrl: 'https://maps.google.com/?q=96+duong+D5+Binh+Thanh+Ho+Chi+Minh',
    features: ['Gió mát tự nhiên', 'Khu học tập yên tĩnh', 'Ổ điện mọi bàn', 'Phục vụ 24h'],
    description: 'Tọa lạc tuyến phố D5 sầm uất, không gian thoáng đãng và yên tĩnh lý tưởng cho cú đêm & học nhóm.'
  }
];

export function getBranches() {
  try {
    const saved = localStorage.getItem('coffee2424_branches');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading branches from storage:', e);
  }
  return BRANCHES;
}

export function saveBranches(branches) {
  try {
    localStorage.setItem('coffee2424_branches', JSON.stringify(branches));
    window.dispatchEvent(new Event('branches-updated'));
    return true;
  } catch (e) {
    console.error('Error saving branches to storage:', e);
    return false;
  }
}
