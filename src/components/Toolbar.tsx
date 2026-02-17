import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCvStore, extractCvData } from '../store/useCvStore';
import { downloadPdf } from '../utils/pdf';
import { generateCvHtml } from '../cv-template/generateCvHtml';
import type { CvData } from '../types/cv';

export default function Toolbar() {
  const { t, i18n } = useTranslation();
  const store = useCvStore();
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadPdf = async () => {
    const data = extractCvData(store);
    const html = generateCvHtml(data);
    try {
      await downloadPdf(html, `${data.fullName.replace(/\s+/g, '_')}_cv.pdf`);
    } catch {
      alert('Error generating PDF. Make sure the server is running (cd server && pnpm start)');
    }
  };

  const handleExportJson = () => {
    const data = extractCvData(store);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as CvData;
        store.setData(data);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = () => {
    if (confirm(t('toolbar.clearConfirm'))) {
      store.resetData();
    }
  };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-title">{t('appTitle')}</span>
      </div>
      <div className="toolbar-right">
        <button type="button" className="toolbar-btn" onClick={toggleLang}>
          {i18n.language === 'es' ? 'EN' : 'ES'}
        </button>
        <button type="button" className="toolbar-btn primary" onClick={handleDownloadPdf}>
          {t('toolbar.downloadPdf')}
        </button>
        <button type="button" className="toolbar-btn" onClick={handleExportJson}>
          {t('toolbar.exportJson')}
        </button>
        <button type="button" className="toolbar-btn" onClick={() => jsonInputRef.current?.click()}>
          {t('toolbar.importJson')}
        </button>
        <button type="button" className="toolbar-btn danger" onClick={handleClear}>
          {t('toolbar.clearData')}
        </button>
        <input ref={jsonInputRef} type="file" accept=".json" hidden onChange={handleImportJson} />
      </div>
    </div>
  );
}
