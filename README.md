Site Generator — React + Vite (MVP)

This repository contains a frontend generator that creates premium-looking static sites from templates. The current MVP (in web/) includes:

- React + Vite app
- Template gallery with thumbnails
- Questionnaire flow with required fields per niche
- Live preview using iframe (srcDoc)
- Client-side ZIP export (jszip + file-saver)
- Sample templates: Lending (loan calculator), Travel (itineraries), Cosmetics (products)

How to run locally

1. cd web
2. npm install
3. npm run dev

Build for production

1. cd web
2. npm run build
3. Serve the contents of web/dist (Cloudflare Pages publish directory)

Cloudflare Pages

- Build command: npm run build
- Publish directory: web/dist

To deploy: push this repository to a Git provider and connect the repository in Cloudflare Pages. See cloudflare-pages.md for more details.
