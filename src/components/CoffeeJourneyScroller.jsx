import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  ArrowDown, 
  Coffee,
  CheckCircle2,
  Droplets,
  Flame,
  Sun,
  Mountain
} from 'lucide-react';

const STAGES = [
  {
    id: 1,
    step: '01 / 06',
    title: 'Cánh Đồng Cà Phê',
    subtitle: 'Bình minh đại ngàn Tây Nguyên',
    desc: 'Những nương cà phê bạt ngàn đón nắng mai trong sương sớm ở độ cao 1.500m, nơi đất đỏ bazan nuôi dưỡng hạt cà phê trứ danh.',
    image: '/images/journey_farm.jpg',
    tag: 'Nguồn Gốc Cầu Đất & Buôn Ma Thuột',
    icon: Mountain
  },
  {
    id: 2,
    step: '02 / 06',
    title: 'Hạt Cà Phê Chín Mọng',
    subtitle: 'Thu hái thủ công từng quả chín',
    desc: 'Chỉ những quả cà phê đỏ mọng đạt độ đường tối đa mới được hái tay tỉ mỉ, đảm bảo vị ngọt hậu và hương thơm tinh khiết.',
    image: '/images/journey_cherries.jpg',
    tag: '100% Hái Chọn Tay',
    icon: Droplets
  },
  {
    id: 3,
    step: '03 / 06',
    title: 'Phơi Sấy Tự Nhiên',
    subtitle: 'Tắm nắng nhiệt đới trên giàn tre',
    desc: 'Hạt cà phê được phơi sấy thoáng khí dưới ánh nắng tự nhiên, đảo đều tay mỗi giờ để lưu giữ trọn vẹn tầng hương hoa quả mộc mạc.',
    image: '/images/journey_drying.jpg',
    tag: 'Sơ Chế Giàn Tre Thoáng Khí',
    icon: Sun
  },
  {
    id: 4,
    step: '04 / 06',
    title: 'Rang Lửa Nghệ Thuật',
    subtitle: 'Đánh thức hương thơm mộc nguyên bản',
    desc: 'Bí quyết rang mộc chuẩn profile: Hạt nổ giòn tan, chuyển màu nâu cánh gián bóng bẩy, tuyệt đối không bơ mỡ hay tạp chất.',
    image: '/images/journey_roast.jpg',
    tag: 'Rang Mộc Chuẩn Vị',
    icon: Flame
  },
  {
    id: 5,
    step: '05 / 06',
    title: 'Xay Hạt Siêu Mịn',
    subtitle: 'Giải phóng tinh dầu thơm tươi mới',
    desc: 'Hạt cà phê chỉ được xay ngay trước lúc pha chế bằng cối xay chuyên nghiệp, giải phóng lớp tinh dầu thơm nồng nàn quyến rũ.',
    image: '/images/journey_grind.jpg',
    tag: 'Xay Tươi Từng Mẻ',
    icon: Sparkles
  },
  {
    id: 6,
    step: '06 / 06',
    title: 'Ép Ra Ly Espresso',
    subtitle: 'Dòng chảy vàng óng & lớp Crema dày',
    desc: 'Áp suất 9 bar chuẩn mực chiết xuất dòng espresso vàng óng ả, thơm đậm đà, sẵn sàng tiếp sức cho bạn suốt đêm dài 24/7.',
    image: '/images/journey_espresso.jpg',
    tag: 'Chiết Xuất Hoàn Hảo',
    icon: Coffee
  }
];

export default function CoffeeJourneyScroller({ onOrderClick }) {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef(null);

  // Auto-slide effect
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStage(prev => (prev + 1) % STAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Handle scroll-based progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far container has been scrolled through
      if (rect.top <= 100 && rect.bottom >= windowHeight * 0.3) {
        const totalDist = rect.height - windowHeight;
        const currentDist = -rect.top;
        const progress = Math.max(0, Math.min(1, currentDist / totalDist));
        const stage = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));
        setActiveStage(stage);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const current = STAGES[activeStage];
  const IconComponent = current.icon;

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[350vh] bg-black text-white"
    >
      {/* STICKY FULLSCREEN STAGE */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* BACKGROUND IMAGES STACK WITH SMOOTH CROSS-FADE */}
        <div className="absolute inset-0 z-0 bg-black">
          {STAGES.map((stage, idx) => (
            <div
              key={stage.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                activeStage === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={stage.image}
                alt={stage.title}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                  activeStage === idx ? 'scale-105 brightness-75' : 'scale-100 brightness-50'
                }`}
              />
              {/* Vignette gradients for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* TOP BAR OF JOURNEY */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-amber-300">
              HÀNH TRÌNH TỪ NÔNG TRƯỜNG ĐẾN TÁCH CÀ PHÊ 24/24
            </span>
          </div>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-xs font-bold text-neutral-300 hover:text-white hover:border-amber-500 transition-all cursor-pointer"
            title={isPlaying ? 'Tạm dừng tự động chạy' : 'Tiếp tục tự động chạy'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Tạm Dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Tự Động Chạy</span>
              </>
            )}
          </button>
        </div>

        {/* MAIN STAGE STORY CONTENT */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center flex-1">
          <div className="max-w-2xl space-y-5 animate-in fade-in slide-in-from-left-6 duration-500 key={activeStage}">
            
            {/* Step badge */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-black px-3 py-1 rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/30">
                BƯỚC {current.step}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                <IconComponent className="w-3.5 h-3.5 text-amber-400" />
                {current.tag}
              </span>
            </div>

            {/* Stage Title */}
            <div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.25] sm:leading-[1.3] drop-shadow-2xl">
                {current.title}
              </h2>
              <p className="text-base sm:text-xl font-bold text-amber-400 mt-2">
                {current.subtitle}
              </p>
            </div>

            {/* Description Card */}
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-normal bg-black/60 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 max-w-xl">
              {current.desc}
            </p>

            {/* CTA on Step 6 */}
            {activeStage === 5 ? (
              <div className="pt-2 animate-in zoom-in-95 duration-300">
                <button
                  onClick={onOrderClick}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-black text-sm sm:text-base shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Coffee className="w-5 h-5 text-black stroke-[2.5]" />
                  <span>THƯỞNG THỨC NGAY TẠI 2 CHI NHÁNH →</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                <ArrowDown className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Cuộn xuống hoặc bấm các bước bên dưới để tiếp tục hành trình</span>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM TIMELINE CONTROLLER */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          
          {/* Timeline Step Buttons */}
          <div className="bg-black/75 backdrop-blur-2xl rounded-2xl p-2 sm:p-3 border border-white/10 shadow-2xl">
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {STAGES.map((s, idx) => {
                const isActive = activeStage === idx;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveStage(idx);
                      setIsPlaying(false);
                    }}
                    className={`group py-2 sm:py-3 px-1 sm:px-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden ${
                      isActive 
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-black' 
                        : 'bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-tighter sm:tracking-normal block">
                      0{s.id}
                    </span>
                    <span className="text-[9px] sm:text-xs font-bold truncate w-full hidden sm:block mt-0.5">
                      {s.title}
                    </span>

                    {/* Active Indicator Bar */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-black"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next / Prev Controls */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 px-2">
              <button
                onClick={() => {
                  setActiveStage(prev => (prev - 1 + STAGES.length) % STAGES.length);
                  setIsPlaying(false);
                }}
                className="hover:text-amber-400 flex items-center gap-1 font-bold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Giai đoạn trước</span>
              </button>

              <div className="flex items-center gap-1 font-mono text-[11px] text-amber-400 font-black">
                <span>GIAI ĐOẠN {activeStage + 1}</span>
                <span className="text-neutral-500">/</span>
                <span className="text-neutral-400">6</span>
              </div>

              <button
                onClick={() => {
                  setActiveStage(prev => (prev + 1) % STAGES.length);
                  setIsPlaying(false);
                }}
                className="hover:text-amber-400 flex items-center gap-1 font-bold cursor-pointer"
              >
                <span className="hidden sm:inline">Giai đoạn tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
