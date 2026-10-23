import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Hook quản lý băng chuyền chuyển tiếp vô tận mượt mà:
 * - Mobile (visibleCount === 1): Kiến trúc CSS Grid Slide Stage 2-lớp độc lập.
 *   Lướt ngang phần cứng thuần túy (GPU translate3d), không bao giờ nhấp nháy.
 * - Desktop (visibleCount > 1): Băng chuyền nối vòng vô tận 2 chiều (Bidirectional Circular Conveyor).
 *   Hỗ trợ bấm Next/Prev liên tục mượt mà không bao giờ giật lùi.
 * - Tự động chạy mỗi interval (mặc định 2s theo yêu cầu).
 * - Khi có chuột di qua (hover) hay chạm vào từ màn hình cảm ứng: tạm dừng 5s rồi tự động chạy tiếp.
 * - Khi người dùng bấm nút chuyển (Next/Prev): chuyển ngay lập tức và giữ 5s trước khi tiếp tục tự chạy.
 * - Điều kiện kích hoạt:
 *   + Điện thoại: chỉ khi có > 1 mục mới hiển thị nút bấm và tự chạy (nếu chỉ có 1 mục: ẩn nút, không chạy).
 *   + Máy tính: chỉ khi có > 3 mục mới hiển thị nút bấm và tự chạy (nếu chỉ có <= 3 mục: ẩn nút, không chạy).
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

  // Điều kiện chuẩn xác:
  // - Điện thoại (1 món): chỉ khi > 1 món mới hiện nút và tự chạy.
  // - Máy tính (3 món): chỉ khi > 3 món mới hiện nút và tự chạy.
  const shouldAutoSlide = Boolean(
    enabled && (isMobileMode ? itemsCount > 1 : itemsCount > visibleCount)
  );

  // Mobile state (0 đến itemsCount - 1)
  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileSlideState, setMobileSlideState] = useState({
    phase: 'idle',
    from: 0,
    to: 0,
    direction: 'next'
  });

  // Desktop state: Vòng lặp vô tận 2 chiều (Prepend Clones + Items + Append Clones)
  // baseOffset = visibleCount (ví dụ 3). desktopIndex khởi đầu từ baseOffset.
  const baseOffset = visibleCount;
  const [desktopIndex, setDesktopIndex] = useState(baseOffset);
  const [desktopTransitioning, setDesktopTransitioning] = useState(false);

  // Refs theo dõi trạng thái
  const isSlidingRef = useRef(false);
  const autoTimerRef = useRef(null);
  const holdTimerRef = useRef(null);
  const animTimeoutRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const hasSwipedRef = useRef(false);

  const itemsCountRef = useRef(itemsCount);
  itemsCountRef.current = itemsCount;

  const visibleCountRef = useRef(visibleCount);
  visibleCountRef.current = visibleCount;

  const isMobileModeRef = useRef(isMobileMode);
  isMobileModeRef.current = isMobileMode;

  const shouldAutoSlideRef = useRef(shouldAutoSlide);
  shouldAutoSlideRef.current = shouldAutoSlide;

  const mobileIndexRef = useRef(mobileIndex);
  mobileIndexRef.current = mobileIndex;

  const desktopIndexRef = useRef(desktopIndex);
  desktopIndexRef.current = desktopIndex;

  // Xóa các bộ đếm thời gian
  const clearTimers = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  // Reset an toàn CHỈ KHI danh sách ID/tiêu đề của items thực sự thay đổi
  const itemsSignature = useMemo(() => {
    return items.map(it => (it ? (it.id ?? it.title ?? it.name ?? JSON.stringify(it)) : '')).join('|');
  }, [items]);
  const prevSignatureRef = useRef(itemsSignature);

  useEffect(() => {
    if (prevSignatureRef.current !== itemsSignature) {
      prevSignatureRef.current = itemsSignature;
      setMobileIndex(0);
      setDesktopIndex(baseOffset);
      setDesktopTransitioning(false);
      setMobileSlideState({
        phase: 'idle',
        from: 0,
        to: 0,
        direction: 'next'
      });
      isSlidingRef.current = false;
    }
  }, [itemsSignature, baseOffset]);

  // Trượt sang mục kế tiếp (Next)
  const slideNext = useCallback(() => {
    if (!shouldAutoSlideRef.current || itemsCountRef.current <= 1) return;
    if (isSlidingRef.current) return;
    isSlidingRef.current = true;

    if (isMobileModeRef.current) {
      const current = mobileIndexRef.current;
      const target = (current + 1) % itemsCountRef.current;

      setMobileSlideState({
        phase: 'sliding',
        from: current,
        to: target,
        direction: 'next'
      });

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setMobileIndex(target);
        setMobileSlideState({
          phase: 'idle',
          from: target,
          to: target,
          direction: 'next'
        });
        isSlidingRef.current = false;
      }, 500);
    } else {
      // Desktop track
      const total = itemsCountRef.current;
      const offset = visibleCountRef.current;
      const nextIndex = desktopIndexRef.current + 1;

      setDesktopTransitioning(true);
      setDesktopIndex(nextIndex);

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        // Nếu đã lướt hết vào cụm clones cuối, dịch tức thì về gốc tương ứng
        if (nextIndex >= total + offset) {
          setDesktopTransitioning(false);
          setDesktopIndex(offset);
        }
        isSlidingRef.current = false;
      }, 520);
    }
  }, []);

  // Trượt về mục trước đó (Prev)
  const slidePrev = useCallback(() => {
    if (!shouldAutoSlideRef.current || itemsCountRef.current <= 1) return;
    if (isSlidingRef.current) return;
    isSlidingRef.current = true;

    if (isMobileModeRef.current) {
      const current = mobileIndexRef.current;
      const target = (current - 1 + itemsCountRef.current) % itemsCountRef.current;

      setMobileSlideState({
        phase: 'sliding',
        from: current,
        to: target,
        direction: 'prev'
      });

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setMobileIndex(target);
        setMobileSlideState({
          phase: 'idle',
          from: target,
          to: target,
          direction: 'prev'
        });
        isSlidingRef.current = false;
      }, 500);
    } else {
      // Desktop track
      const total = itemsCountRef.current;
      const offset = visibleCountRef.current;
      const prevIndex = desktopIndexRef.current - 1;

      setDesktopTransitioning(true);
      setDesktopIndex(prevIndex);

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        // Nếu đã lùi quá cụm clones đầu, dịch tức thì về gốc tương ứng
        if (prevIndex < offset) {
          setDesktopTransitioning(false);
          setDesktopIndex(prevIndex + total);
        }
        isSlidingRef.current = false;
      }, 520);
    }
  }, []);

  // Nhảy tới slide cụ thể khi click chấm tròn (dots)
  const goToIndex = useCallback((targetIndex) => {
    if (!shouldAutoSlideRef.current || isSlidingRef.current) return;

    if (isMobileModeRef.current) {
      const current = mobileIndexRef.current;
      if (targetIndex === current) return;
      isSlidingRef.current = true;
      const direction = targetIndex > current ? 'next' : 'prev';

      setMobileSlideState({
        phase: 'sliding',
        from: current,
        to: targetIndex,
        direction
      });

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setMobileIndex(targetIndex);
        setMobileSlideState({
          phase: 'idle',
          from: targetIndex,
          to: targetIndex,
          direction
        });
        isSlidingRef.current = false;
      }, 500);
    } else {
      isSlidingRef.current = true;
      setDesktopTransitioning(true);
      setDesktopIndex(baseOffset + targetIndex);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        isSlidingRef.current = false;
      }, 520);
    }
  }, [baseOffset]);

  // Khởi động chu kỳ tự động chạy mỗi 2s
  const startAutoPlay = useCallback(() => {
    clearTimers();
    if (!shouldAutoSlideRef.current) return;
    autoTimerRef.current = setInterval(() => {
      slideNext();
    }, interval);
  }, [clearTimers, slideNext, interval]);

  // Tạm dừng 5 giây (khi hover, touch hoặc bấm chuyển) rồi mới tiếp tục chạy
  const pauseAndHold = useCallback(() => {
    clearTimers();
    if (!shouldAutoSlideRef.current) return;
    holdTimerRef.current = setTimeout(() => {
      slideNext();
      startAutoPlay();
    }, holdDelay);
  }, [clearTimers, slideNext, startAutoPlay, holdDelay]);

  // Xử lý khi người dùng tương tác bằng tay (click Prev / Next / Dot)
  const handleManualAction = useCallback((actionFn) => {
    if (actionFn) actionFn();
    pauseAndHold();
  }, [pauseAndHold]);

  // Touch gesture handling trên màn hình cảm ứng
  const handleTouchStart = useCallback((e) => {
    hasSwipedRef.current = false;
    if (e.targetTouches && e.targetTouches.length > 0) {
      touchStartXRef.current = e.targetTouches[0].clientX;
      touchStartYRef.current = e.targetTouches[0].clientY;
    }
    pauseAndHold();
  }, [pauseAndHold]);

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
    pauseAndHold();
  }, [pauseAndHold, slideNext, slidePrev]);

  const handleTouchCancel = useCallback(() => {
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    pauseAndHold();
  }, [pauseAndHold]);

  // Bắt đầu vòng lặp auto-play
  useEffect(() => {
    if (shouldAutoSlide) {
      startAutoPlay();
    } else {
      clearTimers();
    }
    return () => clearTimers();
  }, [shouldAutoSlide, startAutoPlay, clearTimers]);

  // Tạm dừng khi chuyển tab trình duyệt và tự tiếp tục khi quay lại
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimers();
      } else if (shouldAutoSlideRef.current) {
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
    if (mobileSlideState.phase === 'idle') {
      const isActive = idx === mobileIndex;
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
    const isFrom = idx === mobileSlideState.from;
    const isTo = idx === mobileSlideState.to;

    if (isFrom) {
      const animClass = mobileSlideState.direction === 'next' 
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
      const animClass = mobileSlideState.direction === 'next' 
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
  }, [mobileSlideState, mobileIndex]);

  // Desktop items: Thêm clones cả trước và sau để tạo băng chuyền nối vòng vô tận 2 chiều
  const desktopItems = useMemo(() => {
    if (!shouldAutoSlide || isMobileMode || itemsCount <= visibleCount) {
      return items;
    }
    const prependClones = items.slice(-visibleCount);
    const appendClones = items.slice(0, visibleCount);
    return [...prependClones, ...items, ...appendClones];
  }, [items, shouldAutoSlide, isMobileMode, itemsCount, visibleCount]);

  const effectiveDesktopIndex = (shouldAutoSlide && !isMobileMode && itemsCount > visibleCount)
    ? desktopIndex
    : 0;

  const desktopTranslatePct = -(effectiveDesktopIndex * (100 / (visibleCount || 3)));
  const trackStyle = {
    transform: `translate3d(${desktopTranslatePct}%, 0, 0)`,
    transition: desktopTransitioning
      ? 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)'
      : 'none'
  };

  const activeDot = isMobileMode 
    ? mobileIndex 
    : (itemsCount > 0 ? (((desktopIndex - baseOffset) % itemsCount + itemsCount) % itemsCount) : 0);

  return {
    items,
    desktopItems,
    currentIndex: isMobileMode ? mobileIndex : activeDot,
    activeDotIndex: activeDot,
    showNav: shouldAutoSlide,
    handlePrev: () => handleManualAction(slidePrev),
    handleNext: () => handleManualAction(slideNext),
    goToIndex: (idx) => handleManualAction(() => goToIndex(idx)),
    hasSwipedRef,
    getMobileSlideProps,
    trackStyle,
    containerProps: {
      onMouseEnter: pauseAndHold,
      onMouseMove: pauseAndHold,
      onMouseLeave: pauseAndHold,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel
    }
  };
}
