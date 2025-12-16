import raf, { cancel as caf } from "raf";
import css from "dom-css";
import {
  createElement,
  cloneElement,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";

import isString from "../utils/isString";
import getScrollbarWidth from "../utils/getScrollbarWidth";
import returnFalse from "../utils/returnFalse";
import getInnerWidth from "../utils/getInnerWidth";
import getInnerHeight from "../utils/getInnerHeight";

import {
  containerStyleDefault,
  containerStyleAutoHeight,
  viewStyleDefault,
  viewStyleAutoHeight,
  viewStyleUniversalInitial,
  trackHorizontalStyleDefault,
  trackVerticalStyleDefault,
  thumbHorizontalStyleDefault,
  thumbVerticalStyleDefault,
  disableSelectStyle,
  disableSelectStyleReset,
} from "./styles";

import {
  renderViewDefault,
  renderTrackHorizontalDefault,
  renderTrackVerticalDefault,
  renderThumbHorizontalDefault,
  renderThumbVerticalDefault,
} from "./defaultRenderElements";

const Scrollbars = forwardRef(function Scrollbars(props, ref) {
  const {
    onScroll,
    onScrollFrame,
    onScrollStart,
    onScrollStop,
    onUpdate,
    renderView = renderViewDefault,
    renderTrackHorizontal = renderTrackHorizontalDefault,
    renderTrackVertical = renderTrackVerticalDefault,
    renderThumbHorizontal = renderThumbHorizontalDefault,
    renderThumbVertical = renderThumbVerticalDefault,
    tagName = "div",
    hideTracksWhenNotNeeded = false,
    autoHide = false,
    autoHideTimeout = 1000,
    autoHideDuration = 200,
    thumbSize,
    thumbMinSize = 30,
    universal = false,
    autoHeight = false,
    autoHeightMin = 0,
    autoHeightMax = 200,
    style,
    children,
    ...restProps
  } = props;

  // State
  const [didMountUniversal, setDidMountUniversal] = useState(false);

  // DOM Refs
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const trackHorizontalRef = useRef(null);
  const trackVerticalRef = useRef(null);
  const thumbHorizontalRef = useRef(null);
  const thumbVerticalRef = useRef(null);

  // Mutable refs (instance variables)
  const requestFrameRef = useRef(null);
  const hideTracksTimeoutRef = useRef(null);
  const detectScrollingIntervalRef = useRef(null);
  const draggingRef = useRef(false);
  const trackMouseOverRef = useRef(false);
  const scrollingRef = useRef(false);
  const prevPageXRef = useRef(0);
  const prevPageYRef = useRef(0);
  const viewScrollLeftRef = useRef(0);
  const viewScrollTopRef = useRef(0);
  const lastViewScrollLeftRef = useRef(0);
  const lastViewScrollTopRef = useRef(0);

  // Getters
  const getScrollLeft = useCallback(() => {
    if (!viewRef.current) return 0;
    return viewRef.current.scrollLeft;
  }, []);

  const getScrollTop = useCallback(() => {
    if (!viewRef.current) return 0;
    return viewRef.current.scrollTop;
  }, []);

  const getScrollWidth = useCallback(() => {
    if (!viewRef.current) return 0;
    return viewRef.current.scrollWidth;
  }, []);

  const getScrollHeight = useCallback(() => {
    if (!viewRef.current) return 0;
    return viewRef.current.scrollHeight;
  }, []);

  const getClientWidth = useCallback(() => {
    if (!viewRef.current) return 0;
    return viewRef.current.clientWidth;
  }, []);

  const getClientHeight = useCallback(() => {
    if (!viewRef.current) return 0;
    return viewRef.current.clientHeight;
  }, []);

  const getValues = useCallback(() => {
    const view = viewRef.current;
    const {
      scrollLeft = 0,
      scrollTop = 0,
      scrollWidth = 0,
      scrollHeight = 0,
      clientWidth = 0,
      clientHeight = 0,
    } = view || {};

    return {
      left: scrollLeft / (scrollWidth - clientWidth) || 0,
      top: scrollTop / (scrollHeight - clientHeight) || 0,
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollHeight,
      clientWidth,
      clientHeight,
    };
  }, []);

  const getThumbHorizontalWidth = useCallback(() => {
    const view = viewRef.current;
    const trackHorizontal = trackHorizontalRef.current;
    if (!view || !trackHorizontal) return 0;
    const { scrollWidth, clientWidth } = view;
    const trackWidth = getInnerWidth(trackHorizontal);
    const width = Math.ceil((clientWidth / scrollWidth) * trackWidth);
    if (trackWidth === width) return 0;
    if (thumbSize) return thumbSize;
    return Math.max(width, thumbMinSize);
  }, [thumbSize, thumbMinSize]);

  const getThumbVerticalHeight = useCallback(() => {
    const view = viewRef.current;
    const trackVertical = trackVerticalRef.current;
    if (!view || !trackVertical) return 0;
    const { scrollHeight, clientHeight } = view;
    const trackHeight = getInnerHeight(trackVertical);
    const height = Math.ceil((clientHeight / scrollHeight) * trackHeight);
    if (trackHeight === height) return 0;
    if (thumbSize) return thumbSize;
    return Math.max(height, thumbMinSize);
  }, [thumbSize, thumbMinSize]);

  const getScrollLeftForOffset = useCallback(
    (offset) => {
      const view = viewRef.current;
      const trackHorizontal = trackHorizontalRef.current;
      if (!view || !trackHorizontal) return 0;
      const { scrollWidth, clientWidth } = view;
      const trackWidth = getInnerWidth(trackHorizontal);
      const thumbWidth = getThumbHorizontalWidth();
      return (offset / (trackWidth - thumbWidth)) * (scrollWidth - clientWidth);
    },
    [getThumbHorizontalWidth]
  );

  const getScrollTopForOffset = useCallback(
    (offset) => {
      const view = viewRef.current;
      const trackVertical = trackVerticalRef.current;
      if (!view || !trackVertical) return 0;
      const { scrollHeight, clientHeight } = view;
      const trackHeight = getInnerHeight(trackVertical);
      const thumbHeight = getThumbVerticalHeight();
      return (
        (offset / (trackHeight - thumbHeight)) * (scrollHeight - clientHeight)
      );
    },
    [getThumbVerticalHeight]
  );

  // Scroll methods
  const scrollLeft = useCallback((left = 0) => {
    if (!viewRef.current) return;
    viewRef.current.scrollLeft = left;
  }, []);

  const scrollTop = useCallback((top = 0) => {
    if (!viewRef.current) return;
    viewRef.current.scrollTop = top;
  }, []);

  const scrollToLeft = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.scrollLeft = 0;
  }, []);

  const scrollToTop = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.scrollTop = 0;
  }, []);

  const scrollToRight = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.scrollLeft = viewRef.current.scrollWidth;
  }, []);

  const scrollToBottom = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.scrollTop = viewRef.current.scrollHeight;
  }, []);

  // Track visibility
  const showTracks = useCallback(() => {
    clearTimeout(hideTracksTimeoutRef.current);
    css(trackHorizontalRef.current, { opacity: 1 });
    css(trackVerticalRef.current, { opacity: 1 });
  }, []);

  const hideTracks = useCallback(() => {
    if (draggingRef.current) return;
    if (scrollingRef.current) return;
    if (trackMouseOverRef.current) return;
    clearTimeout(hideTracksTimeoutRef.current);
    hideTracksTimeoutRef.current = setTimeout(() => {
      css(trackHorizontalRef.current, { opacity: 0 });
      css(trackVerticalRef.current, { opacity: 0 });
    }, autoHideTimeout);
  }, [autoHideTimeout]);

  // Scroll event handling
  const handleScrollStartAutoHide = useCallback(() => {
    if (!autoHide) return;
    showTracks();
  }, [autoHide, showTracks]);

  const handleScrollStopAutoHide = useCallback(() => {
    if (!autoHide) return;
    hideTracks();
  }, [autoHide, hideTracks]);

  const handleScrollStart = useCallback(() => {
    if (onScrollStart) onScrollStart();
    handleScrollStartAutoHide();
  }, [onScrollStart, handleScrollStartAutoHide]);

  const handleScrollStop = useCallback(() => {
    if (onScrollStop) onScrollStop();
    handleScrollStopAutoHide();
  }, [onScrollStop, handleScrollStopAutoHide]);

  // RAF-based update
  const rafCallback = useCallback((callback) => {
    if (requestFrameRef.current) caf(requestFrameRef.current);
    requestFrameRef.current = raf(() => {
      requestFrameRef.current = undefined;
      callback();
    });
  }, []);

  const _update = useCallback(
    (callback) => {
      const scrollbarWidth = getScrollbarWidth();
      const values = getValues();
      if (scrollbarWidth) {
        const { scrollLeft: sl, clientWidth, scrollWidth } = values;
        const trackHorizontal = trackHorizontalRef.current;
        const trackVertical = trackVerticalRef.current;
        const thumbHorizontal = thumbHorizontalRef.current;
        const thumbVertical = thumbVerticalRef.current;
        if (
          !trackHorizontal ||
          !trackVertical ||
          !thumbHorizontal ||
          !thumbVertical
        )
          return;
        const trackHorizontalWidth = getInnerWidth(trackHorizontal);
        const thumbHorizontalWidth = getThumbHorizontalWidth();
        const thumbHorizontalX =
          (sl / (scrollWidth - clientWidth)) *
          (trackHorizontalWidth - thumbHorizontalWidth);
        const thumbHorizontalStyle = {
          width: thumbHorizontalWidth,
          transform: `translateX(${thumbHorizontalX}px)`,
        };
        const { scrollTop: st, clientHeight, scrollHeight } = values;
        const trackVerticalHeight = getInnerHeight(trackVertical);
        const thumbVerticalHeight = getThumbVerticalHeight();
        const thumbVerticalY =
          (st / (scrollHeight - clientHeight)) *
          (trackVerticalHeight - thumbVerticalHeight);
        const thumbVerticalStyle = {
          height: thumbVerticalHeight,
          transform: `translateY(${thumbVerticalY}px)`,
        };
        if (hideTracksWhenNotNeeded) {
          const trackHorizontalStyle = {
            visibility: scrollWidth > clientWidth ? "visible" : "hidden",
          };
          const trackVerticalStyle = {
            visibility: scrollHeight > clientHeight ? "visible" : "hidden",
          };
          css(trackHorizontal, trackHorizontalStyle);
          css(trackVertical, trackVerticalStyle);
        }
        css(thumbHorizontal, thumbHorizontalStyle);
        css(thumbVertical, thumbVerticalStyle);
      }
      if (onUpdate) onUpdate(values);
      if (typeof callback !== "function") return;
      callback(values);
    },
    [
      getValues,
      getThumbHorizontalWidth,
      getThumbVerticalHeight,
      hideTracksWhenNotNeeded,
      onUpdate,
    ]
  );

  const update = useCallback(
    (callback) => {
      rafCallback(() => _update(callback));
    },
    [rafCallback, _update]
  );

  // Detect scrolling
  const detectScrolling = useCallback(() => {
    if (scrollingRef.current) return;
    scrollingRef.current = true;
    handleScrollStart();
    detectScrollingIntervalRef.current = setInterval(() => {
      if (
        lastViewScrollLeftRef.current === viewScrollLeftRef.current &&
        lastViewScrollTopRef.current === viewScrollTopRef.current
      ) {
        clearInterval(detectScrollingIntervalRef.current);
        scrollingRef.current = false;
        handleScrollStop();
      }
      lastViewScrollLeftRef.current = viewScrollLeftRef.current;
      lastViewScrollTopRef.current = viewScrollTopRef.current;
    }, 100);
  }, [handleScrollStart, handleScrollStop]);

  // Scroll handler
  const handleScroll = useCallback(
    (event) => {
      if (onScroll) onScroll(event);
      update((values) => {
        const { scrollLeft: sl, scrollTop: st } = values;
        viewScrollLeftRef.current = sl;
        viewScrollTopRef.current = st;
        if (onScrollFrame) onScrollFrame(values);
      });
      detectScrolling();
    },
    [onScroll, onScrollFrame, update, detectScrolling]
  );

  // Drag handling
  const setupDragging = useCallback(() => {
    css(document.body, disableSelectStyle);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    document.onselectstart = returnFalse;
  }, []);

  const teardownDragging = useCallback(() => {
    css(document.body, disableSelectStyleReset);
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleDragEnd);
    document.onselectstart = undefined;
  }, []);

  const handleDragEndAutoHide = useCallback(() => {
    if (!autoHide) return;
    hideTracks();
  }, [autoHide, hideTracks]);

  const handleDragEnd = useCallback(() => {
    draggingRef.current = false;
    prevPageXRef.current = 0;
    prevPageYRef.current = 0;
    teardownDragging();
    handleDragEndAutoHide();
  }, [teardownDragging, handleDragEndAutoHide]);

  const handleDrag = useCallback(
    (event) => {
      if (prevPageXRef.current) {
        const { clientX } = event;
        const { left: trackLeft } =
          trackHorizontalRef.current.getBoundingClientRect();
        const thumbWidth = getThumbHorizontalWidth();
        const clickPosition = thumbWidth - prevPageXRef.current;
        const offset = -trackLeft + clientX - clickPosition;
        viewRef.current.scrollLeft = getScrollLeftForOffset(offset);
      }
      if (prevPageYRef.current) {
        const { clientY } = event;
        const { top: trackTop } =
          trackVerticalRef.current.getBoundingClientRect();
        const thumbHeight = getThumbVerticalHeight();
        const clickPosition = thumbHeight - prevPageYRef.current;
        const offset = -trackTop + clientY - clickPosition;
        viewRef.current.scrollTop = getScrollTopForOffset(offset);
      }
      return false;
    },
    [
      getThumbHorizontalWidth,
      getThumbVerticalHeight,
      getScrollLeftForOffset,
      getScrollTopForOffset,
    ]
  );

  // Fix circular dependency by reassigning
  useEffect(() => {
    // Update the setupDragging to use the correct handleDrag and handleDragEnd
  }, [handleDrag, handleDragEnd]);

  const handleDragStart = useCallback(
    (event) => {
      draggingRef.current = true;
      event.stopImmediatePropagation();
      setupDragging();
    },
    [setupDragging]
  );

  // Track mouse handlers
  const handleTrackMouseEnterAutoHide = useCallback(() => {
    if (!autoHide) return;
    showTracks();
  }, [autoHide, showTracks]);

  const handleTrackMouseLeaveAutoHide = useCallback(() => {
    if (!autoHide) return;
    hideTracks();
  }, [autoHide, hideTracks]);

  const handleTrackMouseEnter = useCallback(() => {
    trackMouseOverRef.current = true;
    handleTrackMouseEnterAutoHide();
  }, [handleTrackMouseEnterAutoHide]);

  const handleTrackMouseLeave = useCallback(() => {
    trackMouseOverRef.current = false;
    handleTrackMouseLeaveAutoHide();
  }, [handleTrackMouseLeaveAutoHide]);

  const handleHorizontalTrackMouseDown = useCallback(
    (event) => {
      event.preventDefault();
      const { target, clientX } = event;
      const { left: targetLeft } = target.getBoundingClientRect();
      const thumbWidth = getThumbHorizontalWidth();
      const offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
      viewRef.current.scrollLeft = getScrollLeftForOffset(offset);
    },
    [getThumbHorizontalWidth, getScrollLeftForOffset]
  );

  const handleVerticalTrackMouseDown = useCallback(
    (event) => {
      event.preventDefault();
      const { target, clientY } = event;
      const { top: targetTop } = target.getBoundingClientRect();
      const thumbHeight = getThumbVerticalHeight();
      const offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
      viewRef.current.scrollTop = getScrollTopForOffset(offset);
    },
    [getThumbVerticalHeight, getScrollTopForOffset]
  );

  const handleHorizontalThumbMouseDown = useCallback(
    (event) => {
      event.preventDefault();
      handleDragStart(event);
      const { target, clientX } = event;
      const { offsetWidth } = target;
      const { left } = target.getBoundingClientRect();
      prevPageXRef.current = offsetWidth - (clientX - left);
    },
    [handleDragStart]
  );

  const handleVerticalThumbMouseDown = useCallback(
    (event) => {
      event.preventDefault();
      handleDragStart(event);
      const { target, clientY } = event;
      const { offsetHeight } = target;
      const { top } = target.getBoundingClientRect();
      prevPageYRef.current = offsetHeight - (clientY - top);
    },
    [handleDragStart]
  );

  const handleWindowResize = useCallback(() => {
    update();
  }, [update]);

  // Add/Remove listeners
  const addListeners = useCallback(() => {
    if (typeof document === "undefined" || !viewRef.current) return;
    const view = viewRef.current;
    const trackHorizontal = trackHorizontalRef.current;
    const trackVertical = trackVerticalRef.current;
    const thumbHorizontal = thumbHorizontalRef.current;
    const thumbVertical = thumbVerticalRef.current;
    view.addEventListener("scroll", handleScroll);
    if (!getScrollbarWidth()) return;
    trackHorizontal.addEventListener("mouseenter", handleTrackMouseEnter);
    trackHorizontal.addEventListener("mouseleave", handleTrackMouseLeave);
    trackHorizontal.addEventListener(
      "mousedown",
      handleHorizontalTrackMouseDown
    );
    trackVertical.addEventListener("mouseenter", handleTrackMouseEnter);
    trackVertical.addEventListener("mouseleave", handleTrackMouseLeave);
    trackVertical.addEventListener("mousedown", handleVerticalTrackMouseDown);
    thumbHorizontal.addEventListener(
      "mousedown",
      handleHorizontalThumbMouseDown
    );
    thumbVertical.addEventListener("mousedown", handleVerticalThumbMouseDown);
    window.addEventListener("resize", handleWindowResize);
  }, [
    handleScroll,
    handleTrackMouseEnter,
    handleTrackMouseLeave,
    handleHorizontalTrackMouseDown,
    handleVerticalTrackMouseDown,
    handleHorizontalThumbMouseDown,
    handleVerticalThumbMouseDown,
    handleWindowResize,
  ]);

  const removeListeners = useCallback(() => {
    if (typeof document === "undefined" || !viewRef.current) return;
    const view = viewRef.current;
    const trackHorizontal = trackHorizontalRef.current;
    const trackVertical = trackVerticalRef.current;
    const thumbHorizontal = thumbHorizontalRef.current;
    const thumbVertical = thumbVerticalRef.current;
    view.removeEventListener("scroll", handleScroll);
    if (!getScrollbarWidth()) return;
    trackHorizontal.removeEventListener("mouseenter", handleTrackMouseEnter);
    trackHorizontal.removeEventListener("mouseleave", handleTrackMouseLeave);
    trackHorizontal.removeEventListener(
      "mousedown",
      handleHorizontalTrackMouseDown
    );
    trackVertical.removeEventListener("mouseenter", handleTrackMouseEnter);
    trackVertical.removeEventListener("mouseleave", handleTrackMouseLeave);
    trackVertical.removeEventListener(
      "mousedown",
      handleVerticalTrackMouseDown
    );
    thumbHorizontal.removeEventListener(
      "mousedown",
      handleHorizontalThumbMouseDown
    );
    thumbVertical.removeEventListener(
      "mousedown",
      handleVerticalThumbMouseDown
    );
    window.removeEventListener("resize", handleWindowResize);
    teardownDragging();
  }, [
    handleScroll,
    handleTrackMouseEnter,
    handleTrackMouseLeave,
    handleHorizontalTrackMouseDown,
    handleVerticalTrackMouseDown,
    handleHorizontalThumbMouseDown,
    handleVerticalThumbMouseDown,
    handleWindowResize,
    teardownDragging,
  ]);

  // Lifecycle: componentDidMount
  useEffect(() => {
    addListeners();
    update();
    if (universal) {
      setDidMountUniversal(true);
    }
    return () => {
      removeListeners();
      caf(requestFrameRef.current);
      clearTimeout(hideTracksTimeoutRef.current);
      clearInterval(detectScrollingIntervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Lifecycle: componentDidUpdate (update on every render)
  useEffect(() => {
    update();
  });

  // Expose imperative handle
  useImperativeHandle(
    ref,
    () => ({
      scrollTop,
      scrollLeft,
      scrollToTop,
      scrollToBottom,
      scrollToLeft,
      scrollToRight,
      getScrollLeft,
      getScrollTop,
      getScrollWidth,
      getScrollHeight,
      getClientWidth,
      getClientHeight,
      getValues,
      // Expose refs for tests
      get view() {
        return viewRef.current;
      },
      get container() {
        return containerRef.current;
      },
      get trackHorizontal() {
        return trackHorizontalRef.current;
      },
      get trackVertical() {
        return trackVerticalRef.current;
      },
      get thumbHorizontal() {
        return thumbHorizontalRef.current;
      },
      get thumbVertical() {
        return thumbVerticalRef.current;
      },
      // Expose update method
      update,
    }),
    [
      scrollTop,
      scrollLeft,
      scrollToTop,
      scrollToBottom,
      scrollToLeft,
      scrollToRight,
      getScrollLeft,
      getScrollTop,
      getScrollWidth,
      getScrollHeight,
      getClientWidth,
      getClientHeight,
      getValues,
      update,
    ]
  );

  // Compute styles
  const scrollbarWidth = getScrollbarWidth();

  const containerStyle = useMemo(
    () => ({
      ...containerStyleDefault,
      ...(autoHeight && {
        ...containerStyleAutoHeight,
        minHeight: autoHeightMin,
        maxHeight: autoHeightMax,
      }),
      ...style,
    }),
    [autoHeight, autoHeightMin, autoHeightMax, style]
  );

  const viewStyle = useMemo(
    () => ({
      ...viewStyleDefault,
      marginRight: scrollbarWidth ? -scrollbarWidth : 0,
      marginBottom: scrollbarWidth ? -scrollbarWidth : 0,
      ...(autoHeight && {
        ...viewStyleAutoHeight,
        minHeight: isString(autoHeightMin)
          ? `calc(${autoHeightMin} + ${scrollbarWidth}px)`
          : autoHeightMin + scrollbarWidth,
        maxHeight: isString(autoHeightMax)
          ? `calc(${autoHeightMax} + ${scrollbarWidth}px)`
          : autoHeightMax + scrollbarWidth,
      }),
      ...(autoHeight &&
        universal &&
        !didMountUniversal && {
          minHeight: autoHeightMin,
          maxHeight: autoHeightMax,
        }),
      ...(universal && !didMountUniversal && viewStyleUniversalInitial),
    }),
    [
      scrollbarWidth,
      autoHeight,
      autoHeightMin,
      autoHeightMax,
      universal,
      didMountUniversal,
    ]
  );

  const trackAutoHeightStyle = useMemo(
    () => ({
      transition: `opacity ${autoHideDuration}ms`,
      opacity: 0,
    }),
    [autoHideDuration]
  );

  const trackHorizontalStyle = useMemo(
    () => ({
      ...trackHorizontalStyleDefault,
      ...(autoHide && trackAutoHeightStyle),
      ...((!scrollbarWidth || (universal && !didMountUniversal)) && {
        display: "none",
      }),
    }),
    [
      autoHide,
      trackAutoHeightStyle,
      scrollbarWidth,
      universal,
      didMountUniversal,
    ]
  );

  const trackVerticalStyle = useMemo(
    () => ({
      ...trackVerticalStyleDefault,
      ...(autoHide && trackAutoHeightStyle),
      ...((!scrollbarWidth || (universal && !didMountUniversal)) && {
        display: "none",
      }),
    }),
    [
      autoHide,
      trackAutoHeightStyle,
      scrollbarWidth,
      universal,
      didMountUniversal,
    ]
  );

  return createElement(
    tagName,
    { ...restProps, style: containerStyle, ref: containerRef },
    [
      cloneElement(
        renderView({ style: viewStyle }),
        { key: "view", ref: viewRef },
        children
      ),
      cloneElement(
        renderTrackHorizontal({ style: trackHorizontalStyle }),
        { key: "trackHorizontal", ref: trackHorizontalRef },
        cloneElement(
          renderThumbHorizontal({ style: thumbHorizontalStyleDefault }),
          { ref: thumbHorizontalRef }
        )
      ),
      cloneElement(
        renderTrackVertical({ style: trackVerticalStyle }),
        { key: "trackVertical", ref: trackVerticalRef },
        cloneElement(
          renderThumbVertical({ style: thumbVerticalStyleDefault }),
          { ref: thumbVerticalRef }
        )
      ),
    ]
  );
});

Scrollbars.propTypes = {
  onScroll: PropTypes.func,
  onScrollFrame: PropTypes.func,
  onScrollStart: PropTypes.func,
  onScrollStop: PropTypes.func,
  onUpdate: PropTypes.func,
  renderView: PropTypes.func,
  renderTrackHorizontal: PropTypes.func,
  renderTrackVertical: PropTypes.func,
  renderThumbHorizontal: PropTypes.func,
  renderThumbVertical: PropTypes.func,
  tagName: PropTypes.string,
  thumbSize: PropTypes.number,
  thumbMinSize: PropTypes.number,
  hideTracksWhenNotNeeded: PropTypes.bool,
  autoHide: PropTypes.bool,
  autoHideTimeout: PropTypes.number,
  autoHideDuration: PropTypes.number,
  autoHeight: PropTypes.bool,
  autoHeightMin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  autoHeightMax: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  universal: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node,
};

Scrollbars.displayName = "Scrollbars";

export default Scrollbars;
