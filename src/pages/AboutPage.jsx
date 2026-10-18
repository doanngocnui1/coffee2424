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
  Briefcase 
} from 'lucide-react';
import { getSiteConfig } from '../data/siteConfig';

export default function AboutPage({ navigate }) {
  const [config, setConfig] = useState(getSiteConfig);

  useEffect(() => {
    const handleUpdate = () => setConfig(getSiteConfig());
    window.addEventListener('site-config-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('site-config-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const about = config.aboutPage || {};

  const defaultMissionIcons = [
    <Users className="w-6 h-6 text-[#2b170e]" />,
    <Laptop className="w-6 h-6 text-[#2b170e]" />,
    <Briefcase className="w-6 h-6 text-[#2b170e]" />,
    <Gamepad2 className="w-6 h-6 text-[#2b170e]" />
  ];

  const missions = (about.missions && about.missions.length > 0)
    ? about.missions.map((m, idx) => ({
        ...m,
        icon: defaultMissionIcons[idx % defaultMissionIcons.length]
      }))
    : [
        {
          icon: <Users className="w-6 h-6 text-[#2b170e]" />,
          title: 'Sinh Viên Học Nhóm & Làm Đồ Án',
          desc: 'Bàn gỗ dài rộng rãi cho nhóm 8-12 bạn, ổ cắm từng ghế, wifi gigabit kéo file nặng cực nhanh. Không lo ký túc xá đóng cửa, không gian yên tĩnh học tập xuyên đêm.'
        },
        {
          icon: <Laptop className="w-6 h-6 text-[#2b170e]" />,
          title: 'Dân Chạy Deadline & Freelancer',
          desc: 'Thoát khỏi 4 bức tường phòng trọ chật hẹp và văn phòng gò bó. Ghế đệm êm ái chống mỏi lưng, điều hòa mát lạnh 24/24 giúp bật tung cảm hứng sáng tạo.'
        },
        {
          icon: <Briefcase className="w-6 h-6 text-[#2b170e]" />,
          title: 'Giao Lưu & Hợp Tác Kinh Doanh',
          desc: 'Không gian lịch sự, hiện đại, phân khu tách biệt lý tưởng cho các buổi đàm phán hợp đồng, gặp gỡ đối tác quốc tế hoặc bàn bạc dự án startup xuyên múi giờ.'
        },
        {
          icon: <Gamepad2 className="w-6 h-6 text-[#2b170e]" />,
          title: 'Góc Nhỏ Xả Stress 1 Mình',
          desc: 'Một góc sofa êm ái ngả lưng, cắm tai nghe leo vài ván game với wifi ping thấp, nhâm nhi ly nước ngon để tâm trí được xả hơi sau chuỗi ngày làm việc căng thẳng.'
        }
      ];

  const defaultAmenityIcons = [
    <Zap className="w-5 h-5 text-amber-700" />,
    <Wifi className="w-5 h-5 text-sky-700" />,
    <Wind className="w-5 h-5 text-teal-700" />,
    <Armchair className="w-5 h-5 text-amber-800" />,
    <Coffee className="w-5 h-5 text-[#2b170e]" />,
    <UtensilsCrossed className="w-5 h-5 text-orange-700" />
  ];

  const amenities = (about.amenities && about.amenities.length > 0)
    ? about.amenities.map((item, idx) => ({
        ...item,
        icon: defaultAmenityIcons[idx % defaultAmenityIcons.length]
      }))
    : [
        {
          icon: <Zap className="w-5 h-5 text-amber-700" />,
          title: 'Ổ Điện Từng Vị Trí Ngồi',
          desc: 'Ổ cắm 3 chấu đa năng tại 100% bàn ghế, thoải mái cắm laptop gaming, sạc nhanh điện thoại.'
        },
        {
          icon: <Wifi className="w-5 h-5 text-sky-700" />,
          title: 'Wifi Gigabit Băng Thông Khủng',
          desc: 'Hệ thống Mesh chuyên dụng, ping game cực thấp, tải file thiết kế nặng hay họp Zoom mượt mà.'
        },
        {
          icon: <Wind className="w-5 h-5 text-teal-700" />,
          title: 'Máy Lạnh 24/24 Mát Rượi',
          desc: 'Duy trì liên tục 22 - 24°C suốt ngày đêm kèm hệ thống lọc khí trong lành, sảng khoái.'
        },
        {
          icon: <Armchair className="w-5 h-5 text-amber-800" />,
          title: 'Bàn Ghế Êm Ái Chống Mỏi Lưng',
          desc: 'Thiết kế chuẩn độ cao công thái học, nệm ngồi êm ái nâng đỡ cột sống dù ngồi làm việc 8 tiếng.'
        },
        {
          icon: <Coffee className="w-5 h-5 text-[#2b170e]" />,
          title: 'Nước Ngon Rang Mộc Chuẩn Vị',
          desc: '100% hạt Robusta Đắk Lắk & Arabica Cầu Đất nguyên chất, không phụ gia, giữ tỉnh táo lành mạnh.'
        },
        {
          icon: <UtensilsCrossed className="w-5 h-5 text-orange-700" />,
          title: 'Bếp Đêm Phục Vụ 24/7',
          desc: 'Mì xào trứng bò bốc khói, mì gói xúc xích ốp la, bánh mì que Hải Phòng giòn cay, bánh croissant nướng nóng.'
        }
      ];

  return (
    <div className="pb-20 space-y-16 font-sans">
      
      {/* HERO ABOUT (Frosted Glass Panel) */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto rounded-[36px] sm:rounded-[48px] bg-white/60 backdrop-blur-2xl border border-white/80 p-8 sm:p-14 lg:p-16 text-center shadow-[0_15px_40px_rgba(60,35,15,0.06)] space-y-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 text-[#2b170e] text-xs sm:text-sm font-bold uppercase tracking-wider border border-white shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-700" />
            {about.heroBadge || 'Câu Chuyện Thương Hiệu COFFEE 24/24'}
          </span>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2b170e] uppercase tracking-tight leading-[1.3] sm:leading-[1.35]">
            {about.heroTitle || 'COFFEE 24/24 Sinh Ra Là Để Giải Quyết Vấn Đề Gì Cho Bạn?'}
          </h1>
          
          <p className="text-base sm:text-lg text-[#523d2f] max-w-2xl mx-auto font-medium leading-relaxed">
            {about.heroSubtitle || 'Chúng tôi không chỉ phục vụ những tách cà phê thơm ngon, mà kiến tạo một trạm dừng chân tiện nghi 24/7 – nơi bạn tự do học tập, làm việc, kết nối và nạp lại năng lượng sống mà không bị bất kỳ rào cản nào bó buộc.'}
          </p>
        </div>
      </section>

      {/* 4 ĐỐI TƯỢNG TRỌNG TÂM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-widest">
            {about.missionsSubtitle || 'SỨ MỆNH PHỤC VỤ'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2b170e]">
            {about.missionsTitle || 'Không Gian Dành Riêng Cho Bạn'}
          </h2>
          <p className="text-base text-[#5c4434]">
            {about.missionsDesc || 'Dù bạn là ai và đến vào khung giờ nào, COFFEE 24/24 luôn có một góc hoàn hảo đón chào bạn.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {missions.map((m, idx) => (
            <div 
              key={idx}
              className="ios-glass-card p-8 rounded-[32px] flex gap-5 items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-stone-100 flex items-center justify-center shrink-0">
                {m.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#2b170e]">{m.title}</h3>
                <p className="text-base text-[#4a3528] leading-relaxed font-normal">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HỆ SINH THÁI TIỆN NGHI 24/7 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] sm:rounded-[44px] ios-glass-panel p-8 sm:p-14 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs sm:text-sm font-bold text-[#8c5932] uppercase tracking-widest">
              {about.amenitiesSubtitle || 'TIỆN NGHI 5 SAO'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2b170e]">
              {about.amenitiesTitle || 'Trang Bị Tận Răng Phục Vụ 24/24'}
            </h2>
            <p className="text-base text-[#5c4434]">
              {about.amenitiesDesc || 'Được đầu tư bài bản để mang đến trải nghiệm thâu đêm thoải mái và hiệu quả tối đa.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((item, idx) => (
              <div key={idx} className="ios-glass-card p-6 rounded-[24px] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center shadow-xs">
                  {item.icon}
                </div>
                <h4 className="font-black text-[#2b170e] text-lg">{item.title}</h4>
                <p className="text-sm sm:text-base text-[#4a3528] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CỬA HÀNG THỰC TẾ (2 Chi nhánh) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <span className="text-xs sm:text-sm font-bold text-[#8c5932] uppercase tracking-widest">
            HỆ THỐNG CHI NHÁNH
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2b170e] mt-1">
            Ghé Thăm COFFEE 24/24 Tại TP. Hồ Chí Minh
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="ios-glass-card rounded-[32px] overflow-hidden group">
            <div className="h-64 sm:h-72 overflow-hidden bg-stone-100">
              <img 
                src="/images/branch_downtown.jpg" 
                alt="Chi nhánh 413 Phan Huy Ích" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="p-8 space-y-3">
              <span className="text-xs sm:text-sm font-bold text-[#8c5932] uppercase tracking-wider block">
                CHI NHÁNH 413 PHAN HUY ÍCH
              </span>
              <h3 className="text-2xl font-black text-[#2b170e]">413 Phan Huy Ích, P. An Hội Tây</h3>
              <p className="text-base text-[#4a3528] leading-relaxed">
                Không gian 2 tầng rộng thoáng, máy lạnh mát rượi 24/24, ổ cắm 3 chấu từng bàn, phục vụ mì xào & bánh nướng thâu đêm.
              </p>
            </div>
          </div>

          <div className="ios-glass-card rounded-[32px] overflow-hidden group">
            <div className="h-64 sm:h-72 overflow-hidden bg-stone-100">
              <img 
                src="/images/branch_rooftop.jpg" 
                alt="Chi nhánh 96 Đường D5" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="p-8 space-y-3">
              <span className="text-xs sm:text-sm font-bold text-[#8c5932] uppercase tracking-wider block">
                CHI NHÁNH 96 ĐƯỜNG D5
              </span>
              <h3 className="text-2xl font-black text-[#2b170e]">96 Đường D5, P. Thạnh Mỹ Tây</h3>
              <p className="text-base text-[#4a3528] leading-relaxed">
                Bàn dài học nhóm chuyên biệt, wifi Gigabit cực mạnh, góc sofa êm ái xả stress và ngắm phố đêm Sài Gòn.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <button
            onClick={() => navigate('/dathang')}
            className="ios-btn-primary px-10 py-4 rounded-full font-bold text-base shadow-lg cursor-pointer inline-flex items-center gap-2"
          >
            <span>ĐẶT MÓN & TRẢI NGHIỆM NGAY</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

    </div>
  );
}
