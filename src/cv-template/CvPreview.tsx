import { useMemo, useRef, useImperativeHandle, forwardRef, useCallback, useState, useEffect } from 'react';
import { useCvStore } from '../store/useCvStore';
import { generateCvHtml } from './generateCvHtml';
import type { CvData } from '../types/cv';

const selectCvData = (s: CvData) => s;
const CV_CONTENT_WIDTH = 1368;
const MOBILE_BREAKPOINT = 1024;
// Target visual width on mobile — larger than phone width for readability, scrollable horizontally
const MOBILE_TARGET_WIDTH = 600;

export interface CvPreviewHandle {
  getHtml: () => string;
}

const CvPreview = forwardRef<CvPreviewHandle>((_props, ref) => {
  const data = useCvStore(selectCvData);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
  );

  const html = useMemo(() => generateCvHtml(data), [data]);

  useImperativeHandle(ref, () => ({
    getHtml: () => html,
  }));

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Scale based on container width.
  // Mobile: target MOBILE_TARGET_WIDTH for readability (wider than phone, scrollable horizontally).
  // Desktop: fit panel width exactly.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const scaleByWidth = width / CV_CONTENT_WIDTH;
      setScale(
        isMobile
          ? Math.max(scaleByWidth, MOBILE_TARGET_WIDTH / CV_CONTENT_WIDTH)
          : scaleByWidth
      );
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [isMobile]);

  // Measure iframe body height after load and on mutations
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

  return (
    <div
      ref={containerRef}
      className="cv-preview-container"
      style={isMobile
        // Mobile: auto height (sized to CV content), horizontal scroll for wider-than-screen CV
        ? { width: '100%', overflowX: 'auto' }
        // Desktop: explicit pixel height enables panel vertical scroll
        : {
            width: '100%',
            height: cvVisualHeight > 0 ? `${cvVisualHeight}px` : '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
      }
    >
      <div style={{
        width: `${cvVisualWidth}px`,
        height: cvVisualHeight > 0 ? `${cvVisualHeight}px` : '100%',
        flexShrink: 0,
        overflow: 'hidden', // clip pre-transform iframe layout box
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
