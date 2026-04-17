# Platform Migration Screening Form

A deployable Vite + React project for the **Cross-Region FAE Support for Platform Migration** customer screening form.

## Features
- Customer basic info form
- Pain points and technical requirements checkboxes
- Customer readiness fields
- 6-factor scoring model
- Automatic total score and Tier classification
- Suggested actions and risk flags
- Browser print layout for PDF export

## Local development
```bash
npm install
npm run dev
```

## Production build
```bash
npm install
npm run build
```

The build output will be generated in the `dist/` folder.

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. Log in to Vercel.
3. Import the GitHub repository.
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy

## Deploy to Cloudflare Pages
1. Push this folder to a GitHub repository.
2. Log in to Cloudflare Pages.
3. Create a new project and connect the GitHub repository.
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Build output directory: `dist`
7. Deploy

## Notes
- This project is a static front-end app and works well on both Vercel and Cloudflare Pages.
- To export PDF, open the page in a browser and click **Export to PDF / Print**.


## Notes
- This project uses Vite 6 for compatibility with Cloudflare Pages auto-detection.
- Recommended Node.js version: 18+ (20 LTS preferred).
