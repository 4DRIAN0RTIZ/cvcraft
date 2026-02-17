const PDF_API = import.meta.env.VITE_PDF_API || 'http://localhost:3001/api/pdf';
const HEALTH_URL = PDF_API.replace(/\/api\/pdf$/, '/api/health');

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function downloadPdf(htmlString: string, filename = 'cv.pdf') {
  const res = await fetch(PDF_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html: htmlString }),
  });

  if (!res.ok) {
    throw new Error('PDF generation failed');
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
