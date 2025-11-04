# AWS Amplify Deployment Guide

This Next.js 16 application is configured for AWS Amplify deployment.

## Pre-deployment Checklist

✅ All issues fixed for Amplify deployment:
- `amplify.yml` configured with `--legacy-peer-deps`
- `.npmrc` file added for dependency resolution
- `next.config.mjs` updated with `standalone` output
- Image optimization disabled for Amplify compatibility
- Node.js engine requirement specified (>=18.0.0)
- TypeScript deprecation warnings silenced
- All client-side code properly wrapped in `'use client'`

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. AWS Amplify Setup
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Select the repository and branch (main)

### 3. Build Settings
The `amplify.yml` file is already configured. Amplify will automatically detect it.

**Build settings include:**
- `npm ci --legacy-peer-deps` for dependency installation
- Caching for `node_modules` and `.next/cache`
- Next.js standalone output

### 4. Environment Variables (if needed)
Add any required environment variables in Amplify Console:
- Go to App Settings → Environment variables
- Add variables as needed

### 5. Deploy
- Click "Save and deploy"
- Wait for build to complete (~3-5 minutes)
- Your app will be live at the Amplify domain

## Features

- ✨ Full-bleed Hero carousel with 7 distinct backgrounds
- 🎨 Dynamic theme switcher (3 themes)
- 📢 Announcement marquee bar
- 🙏 Words of Wisdom quote rotator
- 📅 Upcoming Events section
- 🌐 Bilingual support (English/Hindi)
- 🎯 Responsive design for all devices

## Tech Stack

- **Framework:** Next.js 16.0.1
- **React:** 19.0.0
- **State Management:** Redux Toolkit
- **Internationalization:** i18next
- **Animations:** GSAP, Swiper
- **3D Graphics:** Three.js, React Three Fiber
- **Styling:** CSS Modules

## Build Command
```bash
npm run build
```

## Local Development
```bash
npm install --legacy-peer-deps
npm run dev
```

## Troubleshooting

**Build fails with peer dependency errors:**
- The `amplify.yml` and `.npmrc` files handle this automatically

**Images not loading:**
- Images are unoptimized for Amplify compatibility
- All images are in `public/images/` directory

**Theme not applying:**
- Ensure Redux store is properly initialized
- Check browser console for any errors

## Support
For issues, check the AWS Amplify build logs in the console.
