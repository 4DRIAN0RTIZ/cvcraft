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
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
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

  // Observe outer container for panel dimensions
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

  // Recompute scale when container size, breakpoint or content changes
  useEffect(() => {
    const { width, height } = containerSize;
    if (!width) return;
    const scaleX = width / CV_CONTENT_WIDTH;
    // Mobile: fit CV within panel (both axes); desktop: scale by width only
    if (isMobile && contentHeight > 0 && height > 0) {
      setScale(Math.min(scaleX, height / contentHeight));
    } else {
      setScale(scaleX);
    }
  }, [containerSize, isMobile, contentHeight]);

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

  // Mobile: .cv-preview-container CSS class gives flex:1 to fill the panel
  // Desktop: explicit pixel height so the panel can scroll vertically
  const containerStyle = isMobile
    ? { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }
    : { width: '100%', height: cvVisualHeight > 0 ? `${cvVisualHeight}px` : '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <div
      ref={containerRef}
      className="cv-preview-container"
      style={containerStyle}
    >
      <div style={{
        width: `${cvVisualWidth}px`,
        height: cvVisualHeight > 0 ? `${cvVisualHeight}px` : '100%',
        flexShrink: 0,
        overflow: 'hidden', // clip pre-transform iframe layout to prevent ghost scroll area
      }}>
        <iframe
          ref={iframeRef}
          srcDoc={html}
          title="CV Preview"
          onLoad={handleLoad}
          style={{
            width: `${CV_CONTENT_WIDTH}px`,
            height: contentHeight > 0 ? `${contentHeight}px` : '100%',
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
