import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Crop, 
  RotateCw, 
  FlipHorizontal, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Check, 
  X, 
  Maximize2, 
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { uploadImageToSupabase } from '../../lib/supabase';

/**
 * Modal Cắt & Căn Chỉnh Hình Ảnh Tỉ Lệ 4:3 (3x4 Nằm Ngang)
 * Dành riêng cho sân khấu chuyên mục "Coffee 24/24 Bán Gì?"
 */
export default function OfferingImageCropperModal({ 
  isOpen, 
  onClose, 
  imageUrl, 
  onApplyCrop, 
  triggerAlert 
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageElement, setImageElement] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Khởi tạo và tải ảnh khi mở modal
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setFlipH(false);

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const loadImg = (src) => {
      img.onload = () => {
        if (isMounted) setImageElement(img);
      };
      img.onerror = () => {
        // Fallback: nếu CORS bị chặn, thử tải bằng fetch blob
        fetch(src)
          .then(res => res.blob())
          .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
              if (isMounted) setImageElement(fallbackImg);
            };
            fallbackImg.src = objectUrl;
          })
          .catch(err => {
            console.warn('Lỗi khi tải ảnh vào bộ cắt:', err);
          });
      };
      img.src = src;
    };

    loadImg(imageUrl);

    return () => {
      isMounted = false;
    };
  }, [isOpen, imageUrl]);

  // Vẽ hình ảnh lên Canvas theo tỉ lệ 4:3 (preview thời gian thực)
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageElement) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height; // width : height = 4 : 3

    ctx.clearRect(0, 0, width, height);

    // Nền tối phía sau
    ctx.fillStyle = '#0f0a07';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    // Di chuyển tâm vẽ vào giữa canvas kèm độ trượt Pan
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, 1);

    const isRotated90 = rotation % 180 !== 0;
    const naturalW = isRotated90 ? imageElement.naturalHeight : imageElement.naturalWidth;
    const naturalH = isRotated90 ? imageElement.naturalWidth : imageElement.naturalHeight;

    // Tính tỉ lệ phóng đại bao phủ hoàn toàn khung 4:3 (object-cover)
    const baseScale = Math.max(width / naturalW, height / naturalH);
    const finalScale = baseScale * zoom;

    const drawW = imageElement.naturalWidth * finalScale;
    const drawH = imageElement.naturalHeight * finalScale;

    ctx.drawImage(imageElement, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [imageElement, zoom, pan, rotation, flipH]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Xử lý kéo thả chuột (Mouse Pan)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Xử lý cảm ứng trên điện thoại / tablet
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  // Các nút căn chỉnh nhanh (Presets)
  const handlePresetAlign = (type) => {
    if (type === 'center') {
      setPan({ x: 0, y: 0 });
    } else if (type === 'top') {
      setPan(prev => ({ ...prev, y: 80 }));
    } else if (type === 'bottom') {
      setPan(prev => ({ ...prev, y: -80 }));
    } else if (type === 'left') {
      setPan(prev => ({ ...prev, x: 80 }));
    } else if (type === 'right') {
      setPan(prev => ({ ...prev, x: -80 }));
    }
  };

  // Xác nhận cắt ảnh và xuất file độ phân giải cao 1000 x 1000 (Chuẩn tỉ lệ vuông 1:1)
  const handleConfirmCrop = async () => {
    if (!imageElement) return;

    setIsProcessing(true);
    triggerAlert?.('⏳ Đang xử lý cắt ảnh tỉ lệ vuông 1:1 và tải lên Supabase Storage...');

    try {
      const outputCanvas = document.createElement('canvas');
      const targetW = 1000;
      const targetH = 1000; // 1 : 1 square
      outputCanvas.width = targetW;
      outputCanvas.height = targetH;
      const ctx = outputCanvas.getContext('2d');

      ctx.fillStyle = '#0f0a07';
      ctx.fillRect(0, 0, targetW, targetH);

      // Tỉ lệ scale giữa preview canvas (800x800) và output canvas (1000x1000)
      const previewW = canvasRef.current?.width || 800;
      const scaleMultiplier = targetW / previewW;

      ctx.save();
      ctx.translate(targetW / 2 + pan.x * scaleMultiplier, targetH / 2 + pan.y * scaleMultiplier);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, 1);

      const isRotated90 = rotation % 180 !== 0;
      const naturalW = isRotated90 ? imageElement.naturalHeight : imageElement.naturalWidth;
      const naturalH = isRotated90 ? imageElement.naturalWidth : imageElement.naturalHeight;

      const baseScale = Math.max(targetW / naturalW, targetH / naturalH);
      const finalScale = baseScale * zoom;

      const drawW = imageElement.naturalWidth * finalScale;
      const drawH = imageElement.naturalHeight * finalScale;

      ctx.drawImage(imageElement, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Xuất sang Blob để tải lên Supabase Storage
      outputCanvas.toBlob(async (blob) => {
        if (!blob) {
          const fallbackDataUrl = outputCanvas.toDataURL('image/jpeg', 0.88);
          onApplyCrop(fallbackDataUrl);
          setIsProcessing(false);
          onClose();
          triggerAlert?.('✓ Đã cắt ảnh chuẩn tỉ lệ vuông 1:1!');
          return;
        }

        // Đặt tên file ảnh cắt
        const cropFile = new File([blob], `offering_1x1_${Date.now()}.webp`, { type: 'image/webp' });

        try {
          const cloudUrl = await uploadImageToSupabase(cropFile, 'offerings');
          if (cloudUrl) {
            onApplyCrop(cloudUrl);
            triggerAlert?.('✓ Đã cắt ảnh chuẩn tỉ lệ vuông 1:1 và lưu lên Cloud Storage thành công!');
          } else {
            const fallbackDataUrl = outputCanvas.toDataURL('image/jpeg', 0.88);
            onApplyCrop(fallbackDataUrl);
            triggerAlert?.('✓ Đã cắt ảnh chuẩn tỉ lệ vuông 1:1 (dự phòng)!');
          }
        } catch (err) {
          console.warn('Lỗi lưu ảnh cắt lên Supabase:', err);
          const fallbackDataUrl = outputCanvas.toDataURL('image/jpeg', 0.88);
          onApplyCrop(fallbackDataUrl);
        } finally {
          setIsProcessing(false);
          onClose();
        }
      }, 'image/webp', 0.92);

    } catch (err) {
      console.error('Lỗi khi cắt ảnh:', err);
      setIsProcessing(false);
      alert('Không thể cắt ảnh. Vui lòng thử lại!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in select-none">
      <div 
        className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl overflow-hidden"
        onMouseUp={handleMouseUp}
      >
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-md">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Cắt & Căn Chỉnh Ảnh Sân Khấu
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider">
                  Tỉ Lệ Vuông Chuẩn 1:1
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Kéo di chuyển vị trí, thu phóng hoặc xoay ảnh để lấy góc chụp đẹp nhất cho menu Coffee 24/24.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Khu Vực Cắt Tỉ Lệ Vuông 1:1 */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-center overflow-y-auto bg-neutral-950/70">
          <div 
            ref={containerRef}
            className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/60 bg-neutral-900 cursor-grab active:cursor-grabbing group touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Canvas vẽ ảnh live */}
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={800} 
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Lưới bố cục 1/3 (Rule of Thirds) */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-40 group-hover:opacity-60 transition-opacity">
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-b border-dashed border-white/40" />
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-b border-dashed border-white/40" />
              <div className="border-r border-dashed border-white/40" />
              <div className="border-r border-dashed border-white/40" />
              <div />
            </div>

            {/* Badge Tỉ Lệ Góc Trên */}
            <div className="absolute top-3 left-3 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-300 text-[11px] font-black border border-white/20 shadow-md flex items-center gap-1.5">
                <Maximize2 className="w-3 h-3" />
                <span>Khung Cắt 1:1 (Vuông)</span>
              </span>
            </div>

            {/* Gợi ý kéo ảnh */}
            <div className="absolute bottom-3 right-3 pointer-events-none">
              <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-neutral-300 text-[10.5px] font-bold border border-white/20 flex items-center gap-1">
                <Move className="w-3 h-3 text-amber-400" />
                <span>Kéo chuột để di chuyển ảnh</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bảng Điều Khiển Cắt & Thu Phóng */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-900/90 space-y-3.5 shrink-0">
          
          {/* Hàng 1: Zoom Slider & Căn Chỉnh Vị Trí Nhanh */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Zoom Slider */}
            <div className="flex items-center gap-2.5 flex-1 max-w-sm">
              <button
                type="button"
                onClick={() => setZoom(prev => Math.max(1, +(prev - 0.1).toFixed(2)))}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input 
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-amber-500 cursor-pointer"
              />

              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(3, +(prev + 0.1).toFixed(2)))}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-amber-400 w-12 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Presets Căn Chỉnh Vị Trí */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-neutral-400 mr-1 hidden sm:inline">Căn vị trí:</span>
              <button
                type="button"
                onClick={() => handlePresetAlign('center')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-bold cursor-pointer"
                title="Đưa vào chính giữa"
              >
                🎯 Giữa
              </button>
              <button
                type="button"
                onClick={() => handlePresetAlign('top')}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                title="Lấy phần đỉnh"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handlePresetAlign('bottom')}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                title="Lấy phần đáy"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handlePresetAlign('left')}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                title="Căn trái"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handlePresetAlign('right')}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                title="Căn phải"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Xoay & Lật */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                title="Xoay ảnh 90 độ"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Xoay 90°</span>
              </button>

              <button
                type="button"
                onClick={() => setFlipH(f => !f)}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                title="Lật ảnh nằm ngang"
              >
                <FlipHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Lật</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                  setRotation(0);
                  setFlipH(false);
                }}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
                title="Đặt lại ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Hàng 2: Nút Hành Động */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
            <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ảnh sau khi cắt sẽ tự động đồng bộ tỉ lệ 4:3 sang Trang Chủ</span>
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmCrop}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>ĐANG XỬ LÝ & LƯU CLOUD...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>CẮT & ÁP DỤNG NGAY</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
