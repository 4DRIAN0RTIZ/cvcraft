import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express.json({ limit: '10mb' }));

// Reuse browser instance across requests
let browser = null;

async function getBrowser() {
  if (!browser || !browser.connected) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
}

// Remove @media blocks (print / max-width) that break the desktop layout
// when Puppeteer renders at PDF page width (~794px < 968px breakpoint).
// Regex can't handle nested braces, so we use a simple brace counter.
function stripMediaBlocks(css) {
  const patterns = [/@media\s+print\s*\{/, /@media\s*\(\s*max-width[^)]*\)\s*\{/];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(css)) !== null) {
      const start = match.index;
      let depth = 0;
      let i = start + match[0].length - 1; // position of opening {
      for (; i < css.length; i++) {
        if (css[i] === '{') depth++;
        else if (css[i] === '}') {
          depth--;
          if (depth === 0) break;
        }
      }
      css = css.slice(0, start) + css.slice(i + 1);
    }
  }
  return css;
}

app.post('/api/pdf', async (req, res) => {
  let { html } = req.body;
  if (!html) {
    return res.status(400).json({ error: 'Missing html field' });
  }

  // Strip media queries that collapse the sidebar in PDF context
  html = stripMediaBlocks(html);

  // Inject overrides for clean PDF output
  const pdfOverrides = `<style>
    html, body { background: white !important; padding: 0 !important; margin: 0 !important; }
    .container {
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      max-width: 100% !important;
      overflow: visible !important;
    }
    .main-content {
      grid-template-columns: 1fr 2fr !important;
    }
    .sidebar > .section:last-child,
    .content > .section:last-child {
      margin-bottom: 0 !important;
    }
  </style>`;
  html = html.replace('</head>', pdfOverrides + '</head>');

  try {
    const b = await getBrowser();
    const page = await b.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Measure only the container height, ignoring body padding
    const contentHeight = await page.evaluate(() => {
      const container = document.querySelector('.container');
      if (!container) return document.body.scrollHeight;
      const rect = container.getBoundingClientRect();
      return Math.ceil(rect.height);
    });

    const pdf = await page.pdf({
      width: '1200px',
      height: `${contentHeight}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: false,
    });

    await page.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="cv.pdf"',
    });
    res.send(pdf);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

// health api to check if the server is running
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`PDF server running on http://localhost:${PORT}`);
});

// Cleanup on exit
process.on('SIGINT', async () => {
  if (browser) await browser.close();
  process.exit();
});
