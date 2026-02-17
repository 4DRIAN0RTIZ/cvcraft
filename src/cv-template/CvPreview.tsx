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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
  );

  const html = useMemo(() => generateCvHtml(data), [data]);

  useImperativeHandle(ref, () => ({
    getHtml: () => html,
  }));

  // Track mobile breakpoint changes
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Recalculate scale when wrapper resizes or mode/contentHeight changes
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const scaleX = width / CV_CONTENT_WIDTH;
      // On mobile, fit the CV within the panel (both axes); on desktop scale by width only
      if (isMobile && contentHeight > 0 && height > 0) {
        setScale(Math.min(scaleX, height / contentHeight));
      } else {
        setScale(scaleX);
      }
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [isMobile, contentHeight]);

  // Measure content height after iframe loads and observe DOM changes
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

  // On mobile: fill the full panel (100%) so ResizeObserver can read panel height.
  // On desktop: size to scaled content height (enables vertical scroll).
  const wrapperHeight = isMobile
    ? '100%'
    : (contentHeight > 0 ? `${Math.ceil(contentHeight * scale)}px` : '100%');

  return (
    <div ref={wrapperRef} className="cv-preview-wrapper" style={{
      width: '100%',
      height: wrapperHeight,
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
  );
});

CvPreview.displayName = 'CvPreview';
export default CvPreview;
