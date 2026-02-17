# CVCraft

CV builder with live preview and PDF export.

## Stack

- **Frontend:** React 19, Vite, Zustand, i18next
- **Backend:** Express, Puppeteer (headless Chrome PDF generation)

## Getting started

```bash
# Frontend
pnpm install
pnpm dev

# PDF server (separate terminal)
cd server
pnpm install
pnpm start
```

The frontend runs on `http://localhost:5173` and the PDF server on `http://localhost:3001`.

## Environment variables

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_PDF_API` | PDF server endpoint | `http://localhost:3001/api/pdf` |

### Backend (server/)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `CORS_ORIGIN` | Allowed origin for CORS | `*` |

## Deploy

### Render (backend)

1. Create a new Web Service, root directory: `server`
2. Build command: `pnpm install`
3. Start command: `node index.js`
4. Set `CORS_ORIGIN` to your Netlify domain

### Netlify (frontend)

1. Base directory: `cv-builder`
2. Build command: `pnpm run build`
3. Publish directory: `dist`
4. Set `VITE_PDF_API` to your Render URL + `/api/pdf`
