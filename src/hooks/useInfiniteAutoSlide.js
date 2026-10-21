import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook quản lý băng chuyền chuyển tiếp mượt mà, triệt tiêu hoàn toàn nhấp nháy trên điện thoại:
 * - Mobile (visibleCount === 1): Sử dụng kiến trúc CSS Grid Slide Stage 2-lớp độc lập.
 *   Không bao giờ đảo thứ tự DOM (không array shuffle), không clone phần tử, không teleport transform.
 *   Mỗi bước chuyển slide từ A sang B (kể cả từ ảnh cuối về ảnh đầu) đều là một chuyển động lướt ngang
 *   (translate3d) phần cứng thuần túy, loại bỏ 100% hiện tượng flash/nhấp nháy trên mọi dòng điện thoại.
 * - Desktop (visibleCount > 1): Tự động dàn trang 3 cột. Nếu danh sách <= 3 món, giữ cố định;
 *   nếu > 3 món thì tự động cuộn mượt mà.
 * - Tự động chạy mỗi interval (mặc định 2s cho poster, 3.5s cho đánh giá).
 * - Tạm dừng ngay khi rê chuột (hover) hoặc chạm tay (touch) vào màn hình.
 * - Giữ lại đúng holdDelay (5s) kể từ lúc nhấc tay hoặc chuột rời khỏi rồi mới tiếp tục chạy.
 * - Hỗ trợ vuốt tay cảm ứng (touch swipe) trái/phải mượt mà.
 * - Đồng bộ hoàn hảo hệ thống chấm tròn (dots) và nút mũi tên (prev/next).
 */
export function useInfiniteAutoSlide({
  items = [],
  visibleCount = 1,
  interval = 2000,
  holdDelay = 5000,
  enabled = true
}) {
  const itemsCount = items.length;
  const isMobileMode = visibleCount === 1;
  const shouldAutoSlide = enabled && (isMobileMode ? itemsCount > 1 : itemsCount > visibleCount);

  // Chỉ số slide đang hiển thị trên màn hình
  const [currentIndex, setCurrentIndex] = useState(0);

  // Trạng thái chuyển động của Mobile Slide Stage
  // phase: 'idle' | 'sliding'
  // direction: 'next' | 'prev'
  const [slideState, setSlideState] = useState({
    phase: 'idle',
    from: 0,
    to: 0,
    direction: 'next'
  });

  // Trạng thái trượt dành cho Desktop multi-item track
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [desktopTransitioning, setDesktopTransitioning] = useState(false);

  const isInteractingRef = useRef(false);
  const isSlidingRef = useRef(false);
  const autoTimerRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const animTimeoutRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const hasSwipedRef = useRef(false);

  const itemsCountRef = useRef(itemsCount);
  itemsCountRef.current = itemsCount;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const shouldAutoSlideRef = useRef(shouldAutoSlide);
  shouldAutoSlideRef.current = shouldAutoSlide;

  const isMobileModeRef = useRef(isMobileMode);
  isMobileModeRef.current = isMobileMode;

  const visibleCountRef = useRef(visibleCount);
  visibleCountRef.current = visibleCount;

  // Xóa các bộ đếm thời gian
  const clearTimers = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  // Khi danh sách items thay đổi (ví dụ Admin chỉnh sửa), reset về trạng thái ban đầu an toàn
  useEffect(() => {
    setCurrentIndex(0);
    setDesktopIndex(0);
    setDesktopTransitioning(false);
    setSlideState({
      phase: 'idle',
      from: 0,
      to: 0,
      direction: 'next'
    });
    isSlidingRef.current = false;
  }, [items]);

  // Trượt sang slide tiếp theo (Next)
  const slideNext = useCallback(() => {
    if (!shouldAutoSlideRef.current || isSlidingRef.current || itemsCountRef.current <= 1) return;
    isSlidingRef.current = true;

    if (isMobileModeRef.current) {
      const current = currentIndexRef.current;
      const target = (current + 1) % itemsCountRef.current;

      setSlideState({
        phase: 'sliding',
        from: current,
        to: target,
        direction: 'next'
      });

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(target);
        setSlideState({
          phase: 'idle',
          from: target,
          to: target,
          direction: 'next'
        });
        isSlidingRef.current = false;
      }, 560);
    } else {
      // Desktop multi-item track
      const vCount = visibleCountRef.current || 3;
      const maxIndex = itemsCountRef.current;
      setDesktopTransitioning(true);
      setDesktopIndex(prev => {
        const next = prev + 1;
        return next;
      });

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setDesktopIndex(prev => {
          if (prev >= maxIndex) {
            setDesktopTransitioning(false);
            return 0;
          }
          return prev;
        });
        isSlidingRef.current = false;
      }, 620);
    }
  }, []);

  // Trượt về slide trước đó (Prev)
  const slidePrev = useCallback(() => {
    if (!shouldAutoSlideRef.current || isSlidingRef.current || itemsCountRef.current <= 1) return;
    isSlidingRef.current = true;

    if (isMobileModeRef.current) {
      const current = currentIndexRef.current;
      const target = (current - 1 + itemsCountRef.current) % itemsCountRef.current;

      setSlideState({
        phase: 'sliding',
        from: current,
        to: target,
        direction: 'prev'
      });

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(target);
        setSlideState({
          phase: 'idle',
          from: target,
          to: target,
          direction: 'prev'
        });
        isSlidingRef.current = false;
      }, 560);
    } else {
      // Desktop multi-item track
      const maxIndex = itemsCountRef.current;
      setDesktopTransitioning(true);
      setDesktopIndex(prev => {
        if (prev <= 0) {
          return maxIndex - 1;
        }
        return prev - 1;
      });

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        isSlidingRef.current = false;
      }, 620);
    }
  }, []);

  // Nhảy tới slide cụ thể khi click chấm tròn (dots)
  const goToIndex = useCallback((targetIndex) => {
    if (!shouldAutoSlideRef.current || isSlidingRef.current || targetIndex === currentIndexRef.current) return;
    isSlidingRef.current = true;

    const current = currentIndexRef.current;
    const direction = targetIndex > current ? 'next' : 'prev';

    if (isMobileModeRef.current) {
      setSlideState({
        phase: 'sliding',
        from: current,
        to: targetIndex,
        direction
      });

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(targetIndex);
        setSlideState({
          phase: 'idle',
          from: targetIndex,
          to: targetIndex,
          direction
        });
        isSlidingRef.current = false;
      }, 560);
    } else {
      setDesktopTransitioning(true);
      setDesktopIndex(targetIndex);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        isSlidingRef.current = false;
      }, 620);
    }
  }, []);

  // Khởi động vòng lặp tự động chạy
  const startAutoPlay = useCallback(() => {
    clearTimers();
    if (!shouldAutoSlideRef.current) return;
    autoTimerRef.current = setInterval(() => {
      slideNext();
    }, interval);
  }, [clearTimers, slideNext, interval]);

  // Giữ lại đúng 5 giây sau khi nhấc tay / rời chuột rồi mới tiếp tục chạy
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

  // Touch gesture handling cho màn hình cảm ứng
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
      if (Math.abs(diffX) > diffY && Math.abs(diffX) > 35) {
        hasSwipedRef.current = true;
        setTimeout(() => { hasSwipedRef.current = false; }, 160);
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
    return () => {
      clearTimers();
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, [clearTimers]);

  // Helper trả về style & class cho từng thẻ trên Mobile Slide Stage
  const getMobileSlideProps = useCallback((idx) => {
    if (slideState.phase === 'idle') {
      const isActive = idx === currentIndex;
      return {
        style: {
          gridArea: '1 / 1',
          zIndex: isActive ? 10 : 1,
          visibility: isActive ? 'visible' : 'hidden',
          pointerEvents: isActive ? 'auto' : 'none',
          transform: 'translate3d(0, 0, 0)'
        },
        className: 'w-full'
      };
    }

    // Phase: sliding
    const isFrom = idx === slideState.from;
    const isTo = idx === slideState.to;

    if (isFrom) {
      const animClass = slideState.direction === 'next' 
        ? 'animate-carousel-out-left' 
        : 'animate-carousel-out-right';
      return {
        style: {
          gridArea: '1 / 1',
          zIndex: 10,
          visibility: 'visible',
          pointerEvents: 'none'
        },
        className: `w-full ${animClass}`
      };
    }

    if (isTo) {
      const animClass = slideState.direction === 'next' 
        ? 'animate-carousel-in-right' 
        : 'animate-carousel-in-left';
      return {
        style: {
          gridArea: '1 / 1',
          zIndex: 20,
          visibility: 'visible',
          pointerEvents: 'auto'
        },
        className: `w-full ${animClass}`
      };
    }

    return {
      style: {
        gridArea: '1 / 1',
        zIndex: 1,
        visibility: 'hidden',
        pointerEvents: 'none'
      },
      className: 'w-full'
    };
  }, [slideState, currentIndex]);

  // Desktop track items (kèm clones để chuyển tiếp vòng lặp vô tận trên máy tính)
  const desktopClonesCount = Math.min(visibleCount, itemsCount);
  const desktopItems = shouldAutoSlide && !isMobileMode && itemsCount > visibleCount
    ? [...items, ...items.slice(0, desktopClonesCount)]
    : items;

  const desktopTranslatePct = -(desktopIndex * (100 / (visibleCount || 3)));
  const trackStyle = {
    transform: `translate3d(${desktopTranslatePct}%, 0, 0)`,
    transition: desktopTransitioning
      ? 'transform 550ms cubic-bezier(0.25, 1, 0.5, 1)'
      : 'none'
  };

  const activeDot = isMobileMode ? currentIndex : (desktopIndex % itemsCount);

  return {
    items,
    desktopItems,
    currentIndex,
    activeDotIndex: activeDot,
    showNav: shouldAutoSlide,
    handlePrev: () => onManualAction(slidePrev),
    handleNext: () => onManualAction(slideNext),
    goToIndex: (idx) => onManualAction(() => goToIndex(idx)),
    hasSwipedRef,
    getMobileSlideProps,
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
