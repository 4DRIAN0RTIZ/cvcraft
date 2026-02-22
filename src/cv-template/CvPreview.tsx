import { useMemo, useRef, useImperativeHandle, forwardRef, useCallback, useState, useEffect } from 'react';
import { useCvStore } from '../store/useCvStore';
import { generateCvHtml } from './generateCvHtml';
import type { CvData } from '../types/cv';

const selectCvData = (s: CvData) => s;
const CV_CONTENT_WIDTH = 1368;
const MOBILE_BREAKPOINT = 1024;

export interface CvPreviewHandle {
  getHtml: () => string;
}

const CvPreview = forwardRef<CvPreviewHandle>((_props, ref) => {
  const data = useCvStore(selectCvData);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [wrapperActualHeight, setWrapperActualHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
  );

  const html = useMemo(() => generateCvHtml(data), [data]);

  useImperativeHandle(ref, () => ({
    getHtml: () => html,
  }));

  // Track mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Observe outer container for panel width (used for scale calculation)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Observe wrapper rendered height (flex:1 resolves it correctly even from display:none)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(entries => {
      setWrapperActualHeight(entries[0].contentRect.height);
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // Recompute scale when container size or breakpoint changes
  useEffect(() => {
    const { width } = containerSize;
    if (!width) return;
    // Always width-based; iframe height handles panel fill on mobile
    setScale(width / CV_CONTENT_WIDTH);
  }, [containerSize]);

  // Measure iframe body height after load and on DOM mutations
  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument?.body) return;

    const measure = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      const h = Math.max(
        doc.body.scrollHeight,
        doc.body.offsetHeight,
        doc.documentElement.scrollHeight,
      );
      setContentHeight(h);
    };

    measure();

    const observer = new MutationObserver(measure);
    observer.observe(iframe.contentDocument.body, {
      childList: true, subtree: true, attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  const cvVisualWidth = Math.round(CV_CONTENT_WIDTH * scale);
  const cvVisualHeight = contentHeight > 0 ? Math.ceil(contentHeight * scale) : 0;

  // Mobile: fill wrapper height (measured after flex layout resolves); Desktop: match CV content
  const iframeHeight = isMobile && wrapperActualHeight > 0 && scale > 0
    ? Math.ceil(wrapperActualHeight / scale)
    : (contentHeight > 0 ? contentHeight : 0);

  // Mobile: flex column so wrapper can use flex:1 to fill panel height via CSS layout
  // Desktop: explicit pixel height so the panel can scroll vertically
  const containerStyle = isMobile
    ? { width: '100%', display: 'flex', flexDirection: 'column' as const }
    : { width: '100%', height: cvVisualHeight > 0 ? `${cvVisualHeight}px` : '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <div
      ref={containerRef}
      className="cv-preview-container"
      style={containerStyle}
    >
      <div
        ref={wrapperRef}
        style={isMobile
          ? {
              width: scale > 0 ? `${cvVisualWidth}px` : '100%',
              flex: '1',
              overflow: 'hidden',
              // hide until scale and wrapper height are both measured to avoid flash
              visibility: (scale > 0 && wrapperActualHeight > 0) ? 'visible' : 'hidden',
            }
          : {
              width: `${cvVisualWidth}px`,
              height: cvVisualHeight > 0 ? `${cvVisualHeight}px` : '100%',
              flexShrink: 0,
              overflow: 'hidden',
              visibility: scale > 0 && contentHeight > 0 ? 'visible' : 'hidden',
            }
        }
      >
        <iframe
          ref={iframeRef}
          srcDoc={html}
          title="CV Preview"
          onLoad={handleLoad}
          style={{
            width: `${CV_CONTENT_WIDTH}px`,
            height: iframeHeight > 0 ? `${iframeHeight}px` : '100%',
            border: 'none',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </div>
  );
});

CvPreview.displayName = 'CvPreview';
export default CvPreview;
