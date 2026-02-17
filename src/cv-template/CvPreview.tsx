import { useMemo, useRef, useImperativeHandle, forwardRef, useCallback, useState, useEffect } from 'react';
import { useCvStore } from '../store/useCvStore';
import { generateCvHtml } from './generateCvHtml';
import type { CvData } from '../types/cv';

const selectCvData = (s: CvData) => s;
const CV_CONTENT_WIDTH = 1368;

export interface CvPreviewHandle {
  getHtml: () => string;
}

const CvPreview = forwardRef<CvPreviewHandle>((_props, ref) => {
  const data = useCvStore(selectCvData);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  const html = useMemo(() => generateCvHtml(data), [data]);

  useImperativeHandle(ref, () => ({
    getHtml: () => html,
  }));

  // Recalculate scale when wrapper resizes
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setScale(width / CV_CONTENT_WIDTH);
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // Measure content height after load and observe changes
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

  return (
    <div ref={wrapperRef} className="cv-preview-wrapper" style={{
      width: '100%',
      height: contentHeight > 0 ? `${Math.ceil(contentHeight * scale)}px` : '100%',
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
