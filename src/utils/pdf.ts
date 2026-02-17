const PDF_API = import.meta.env.VITE_PDF_API || 'http://localhost:3001/api/pdf';

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
