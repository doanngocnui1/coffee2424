import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook quản lý băng chuyền vô tận (Circular Conveyor Loop) cho Carousel:
 * - KHÔNG BAO GIỜ NHẢY NGƯỢC: Mỗi bước trượt chỉ tịnh tiến đúng 1 thẻ (0% -> -100% / -33.33%), 
 *   sau đó xoay vòng mảng ở mức 0ms. Phần tử đang hiển thị trên màn hình giữ nguyên 100% tọa độ,
 *   triệt tiêu hoàn toàn hiện tượng nhấp nháy (flicker/flash) của GPU trên điện thoại.
 * - Hỗ trợ auto-slide tùy chỉnh interval (2s, 3.5s...).
 * - Tạm dừng khi rê chuột (hover) hoặc chạm tay (touch).
 * - Giữ lại đúng holdDelay (mặc định 5s) sau khi thả chuột/tay rồi mới tiếp tục chạy.
 * - Hỗ trợ vuốt tay cảm ứng (touch swipe) trái/phải mượt mà.
 * - Đồng bộ chấm tròn (dots) và nút bấm mũi tên (prev/next).
 */
export function useInfiniteAutoSlide({
  items = [],
  visibleCount = 3,
  interval = 2500,
  holdDelay = 5000,
  enabled = true
}) {
  const itemsCount = items.length;
  const shouldAutoSlide = enabled && itemsCount > visibleCount;

  // Mảng các item đang được xoay vòng trong băng chuyền
  const [orderedItems, setOrderedItems] = useState(items);
  // Chỉ số item gốc đang hiển thị ở vị trí đầu tiên (để điều khiển chấm tròn dots)
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  
  // Trạng thái trượt: 0 là đứng yên, -1 là đang trượt sang thẻ tiếp theo (next)
  const [offsetStep, setOffsetStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const trackRef = useRef(null);
  const isInteractingRef = useRef(false);
  const isSlidingRef = useRef(false);
  const autoTimerRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const resetTimerRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const hasSwipedRef = useRef(false);

  const visibleCountRef = useRef(visibleCount);
  visibleCountRef.current = visibleCount;

  const shouldAutoSlideRef = useRef(shouldAutoSlide);
  shouldAutoSlideRef.current = shouldAutoSlide;

  const itemsCountRef = useRef(itemsCount);
  itemsCountRef.current = itemsCount;

  const activeDotIndexRef = useRef(activeDotIndex);
  activeDotIndexRef.current = activeDotIndex;

  // Khi danh sách items từ props thay đổi (ví dụ Admin chỉnh sửa), đồng bộ lại
  useEffect(() => {
    setOrderedItems(items);
    setActiveDotIndex(0);
    setOffsetStep(0);
    setIsTransitioning(false);
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = 'translateX(0%)';
    }
  }, [items]);

  const clearTimers = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  // Xử lý khi kết thúc chuyển động trượt sang thẻ kế tiếp
  const handleTransitionEnd = useCallback((e) => {
    if (e) {
      if (e.target !== e.currentTarget) return;
      if (e.propertyName && e.propertyName !== 'transform') return;
    }
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    if (!isSlidingRef.current) return;

    // 1. Ngắt transition ngay lập tức trên DOM và đưa transform về 0%
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = 'translateX(0%)';
      void trackRef.current.offsetHeight; // Bắt buộc browser reflow 0ms
    }

    // 2. Chuyển phần tử đầu tiên xuống cuối mảng (xoay vòng băng chuyền)
    setOrderedItems(prev => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });

    setOffsetStep(0);
    setIsTransitioning(false);
    isSlidingRef.current = false;
  }, []);

  // Trượt sang thẻ tiếp theo (Next)
  const slideNext = useCallback(() => {
    if (!shouldAutoSlideRef.current || isSlidingRef.current) return;
    isSlidingRef.current = true;

    const vCount = visibleCountRef.current || 1;
    const stepPct = -(100 / vCount);

    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)';
      trackRef.current.style.transform = `translateX(${stepPct}%)`;
    }

    setIsTransitioning(true);
    setOffsetStep(-1);
    setActiveDotIndex(prev => (prev + 1) % (itemsCountRef.current || 1));

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      handleTransitionEnd();
    }, 650);
  }, [handleTransitionEnd]);

  // Trượt về thẻ trước đó (Prev)
  const slidePrev = useCallback(() => {
    if (!shouldAutoSlideRef.current || isSlidingRef.current) return;
    isSlidingRef.current = true;

    const vCount = visibleCountRef.current || 1;
    const stepPct = -(100 / vCount);

    // Bước 1: Đưa phần tử cuối cùng lên đầu mảng và đặt ngay ở vị trí âm để sẵn sàng trượt vào
    setOrderedItems(prev => {
      if (prev.length <= 1) return prev;
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, -1);
      return [last, ...rest];
    });

    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translateX(${stepPct}%)`;
      void trackRef.current.offsetHeight; // Bắt buộc browser reflow 0ms
    }

    // Bước 2: Kích hoạt animation trượt về 0%
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)';
          trackRef.current.style.transform = 'translateX(0%)';
        }
        setIsTransitioning(true);
        setOffsetStep(0);
        setActiveDotIndex(prev => (prev - 1 + itemsCountRef.current) % (itemsCountRef.current || 1));

        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = 'none';
          }
          setIsTransitioning(false);
          isSlidingRef.current = false;
        }, 650);
      });
    });
  }, []);

  // Nhảy tới 1 chấm tròn cụ thể
  const goToIndex = useCallback((targetDotIdx) => {
    if (!shouldAutoSlideRef.current || isSlidingRef.current) return;
    const total = itemsCountRef.current;
    const currentDot = activeDotIndexRef.current;
    if (targetDotIdx === currentDot) return;

    const diff = (targetDotIdx - currentDot + total) % total;
    if (diff === 1) {
      slideNext();
    } else if (diff === total - 1) {
      slidePrev();
    } else {
      // Xoay vòng mảng tức thì để đưa item được chọn lên đầu
      setOrderedItems(prev => {
        const idxInOrdered = prev.findIndex((_, i) => (currentDot + i) % total === targetDotIdx);
        if (idxInOrdered <= 0) return prev;
        return [...prev.slice(idxInOrdered), ...prev.slice(0, idxInOrdered)];
      });
      setActiveDotIndex(targetDotIdx);
    }
  }, [slideNext, slidePrev]);

  // Khởi động vòng lặp tự động chạy
  const startAutoPlay = useCallback(() => {
    clearTimers();
    if (!shouldAutoSlideRef.current) return;
    autoTimerRef.current = setInterval(() => {
      slideNext();
    }, interval);
  }, [clearTimers, slideNext, interval]);

  // Tạm dừng khi tương tác và giữ lại 5s sau khi nhấc tay
  const scheduleResumeAfterHold = useCallback(() => {
    clearTimers();
    if (!shouldAutoSlideRef.current) return;
    resumeTimerRef.current = setTimeout(() => {
      if (!isInteractingRef.current) {
        slideNext();
        startAutoPlay();
      }
    }, holdDelay);
  }, [clearTimers, slideNext, startAutoPlay, holdDelay]);

  const onInteractionStart = useCallback(() => {
    isInteractingRef.current = true;
    clearTimers();
  }, [clearTimers]);

  const onInteractionEnd = useCallback(() => {
    isInteractingRef.current = false;
    scheduleResumeAfterHold();
  }, [scheduleResumeAfterHold]);

  const onManualAction = useCallback((actionFn) => {
    if (actionFn) actionFn();
    clearTimers();
    scheduleResumeAfterHold();
  }, [clearTimers, scheduleResumeAfterHold]);

  // Touch gesture handling
  const handleTouchStart = useCallback((e) => {
    hasSwipedRef.current = false;
    if (e.targetTouches && e.targetTouches.length > 0) {
      touchStartXRef.current = e.targetTouches[0].clientX;
      touchStartYRef.current = e.targetTouches[0].clientY;
    }
    onInteractionStart();
  }, [onInteractionStart]);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartXRef.current !== null && e.changedTouches && e.changedTouches.length > 0) {
      const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
      const diffY = touchStartYRef.current !== null ? Math.abs(touchStartYRef.current - e.changedTouches[0].clientY) : 0;
      if (Math.abs(diffX) > diffY && Math.abs(diffX) > 40) {
        hasSwipedRef.current = true;
        setTimeout(() => { hasSwipedRef.current = false; }, 120);
        if (diffX > 0) {
          slideNext();
        } else {
          slidePrev();
        }
      }
      touchStartXRef.current = null;
      touchStartYRef.current = null;
    }
    onInteractionEnd();
  }, [onInteractionEnd, slideNext, slidePrev]);

  const handleTouchCancel = useCallback(() => {
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    onInteractionEnd();
  }, [onInteractionEnd]);

  // Khởi động auto-play
  useEffect(() => {
    if (shouldAutoSlide && !isInteractingRef.current) {
      startAutoPlay();
    } else {
      clearTimers();
    }
    return () => clearTimers();
  }, [shouldAutoSlide, startAutoPlay, clearTimers]);

  // Tạm dừng khi chuyển tab trình duyệt
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimers();
      } else if (shouldAutoSlideRef.current && !isInteractingRef.current) {
        startAutoPlay();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [clearTimers, startAutoPlay]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Tính transform inline style
  const currentTranslateX = offsetStep === -1 ? -(100 / visibleCount) : 0;
  const trackStyle = {
    transform: `translateX(${currentTranslateX}%)`,
    transition: isTransitioning 
      ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)' 
      : 'none'
  };

  return {
    trackRef,
    items: orderedItems,
    activeDotIndex,
    showNav: shouldAutoSlide,
    handlePrev: () => onManualAction(slidePrev),
    handleNext: () => onManualAction(slideNext),
    goToIndex: (idx) => onManualAction(() => goToIndex(idx)),
    handleTransitionEnd,
    hasSwipedRef,
    trackStyle,
    containerProps: {
      onMouseEnter: onInteractionStart,
      onMouseLeave: onInteractionEnd,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel
    }
  };
}
