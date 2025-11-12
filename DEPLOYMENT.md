# AWS Amplify Deployment Guide

This Next.js 16 application is **fully configured and ready** for AWS Amplify deployment.

## ✅ Pre-deployment Checklist

All configurations are complete and verified:
- ✅ `amplify.yml` - Configured with version logging and legacy-peer-deps
- ✅ `.npmrc` - Added for dependency resolution
- ✅ `next.config.mjs` - Optimized with standalone output and performance settings
- ✅ `tsconfig.json` - Fixed for Next.js 16 compatibility (jsx: preserve, allowJs: true)
- ✅ Image optimization - Disabled for Amplify compatibility with remote patterns
- ✅ Node.js engine - Requirement specified (>=18.0.0)
- ✅ TypeScript - All errors resolved, build working
- ✅ Client components - Properly marked with `'use client'`
- ✅ Responsive design - Validated across all devices (320px - 1920px+)
- ✅ Build optimization - SWC minification, compression enabled
- ✅ Production ready - Source maps disabled, headers optimized
- ✅ Lighthouse - Performance and accessibility optimized

## 🚀 Quick Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for AWS Amplify deployment"
git push origin main
```

### 2. AWS Amplify Console Setup
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository: `SwamiJiLatest` (or your repo name)
4. Select branch: `main`
5. Click "Next"

### 3. Build Settings (Auto-detected)
Amplify will automatically detect the `amplify.yml` file.

**Configuration includes:**
- Node.js version logging
- `npm ci --legacy-peer-deps` for clean installation
- Caching for `node_modules` and `.next/cache`
- Next.js standalone output optimization

### 4. Deploy
- Review settings and click "Save and deploy"
- Build typically takes **3-5 minutes**
- Your app will be live at: `https://main.xxxxxx.amplifyapp.com`

## 📋 Detailed Setup Information

### Build Configuration (amplify.yml)
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - node --version              # Logs Node.js version
        - npm --version               # Logs npm version
        - npm ci --legacy-peer-deps   # Clean install with peer deps
    build:
      commands:
        - npm run build               # Next.js build
  artifacts:
    baseDirectory: .next             # Build output directory
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*             # Cache dependencies
      - .next/cache/**/*              # Cache Next.js builds
```

### Next.js Configuration (next.config.mjs)
```javascript
{
  output: 'standalone',              // Required for Amplify
  images: { unoptimized: true },     // Amplify compatibility
  productionBrowserSourceMaps: false, // Performance
  compress: true,                     // Enable compression
  swcMinify: true,                   // Fast minification
  poweredByHeader: false,            // Security
}
```

## 🌐 Environment Variables (Optional)

If your app requires environment variables:

1. Go to Amplify Console → Your App
2. Navigate to "App settings" → "Environment variables"
3. Click "Add variable"
4. Add your variables (prefix with `NEXT_PUBLIC_` for client-side access)

**Example:**
```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## ✨ Features Included

- 🎨 **Dynamic theme switcher** (3 themes: default, ocean, sunset)
- 🌐 **Bilingual support** (English/Hindi) with i18next
- 📱 **Fully responsive** (320px mobile to 1920px+ desktop)
- 🎭 **Animated UI** with Swiper carousel and scroll effects
- 🧭 **Smart navigation** with hamburger menu on mobile
- � **Redux state management** for theme, locale, and auth
- 🔐 **Authentication** (demo with hardcoded users)
- 📄 **Multiple pages**: Home, Swamiji, Bajrang Baan, Dashboard, Login
- ⚡ **Performance optimized** with caching and compression

## 🔧 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16.0.1 |
| React | 19.0.0 |
| State Management | Redux Toolkit |
| i18n | i18next + react-i18next |
| Animations | GSAP, Framer Motion, Swiper |
| 3D Graphics | Three.js, React Three Fiber |
| Styling | CSS Modules |
| Language | TypeScript 5.4.5 |
| Node | >= 18.0.0 |

## 🧪 Pre-Deployment Testing

Run these commands locally before deploying:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start

# Lint code
npm run lint
```

**Verify:**
- ✅ Build completes without errors
- ✅ No TypeScript compilation errors
- ✅ All pages load correctly
- ✅ Language switching works
- ✅ Theme switcher works
- ✅ Mobile responsive (test at 320px, 768px, 1024px)

## 📊 Performance Metrics

Expected Lighthouse scores (production build):

| Metric | Target Score |
|--------|-------------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 90+ |
| SEO | 90+ |

## 🐛 Troubleshooting

### Build Fails in Amplify

**Issue:** Peer dependency errors
```
Solution: Already handled by --legacy-peer-deps in amplify.yml
Check: Verify .npmrc file contains legacy-peer-deps=true
```

**Issue:** Out of memory during build
```
Solution: Contact AWS Support to increase build instance memory
Alternative: Optimize bundle size or reduce dependencies
```

**Issue:** Module not found
```
Check: All files are committed to git repository
Check: Import paths use correct casing
Solution: Verify all imports and file names
```

### Site Deployed but Not Working

**Issue:** Blank page
```
Check: Browser console for JavaScript errors
Check: All 'use client' directives present on client components
Solution: Review Amplify build logs for warnings
```

**Issue:** Images not loading
```
Check: Images are in /public/images/ directory
Check: Image paths don't include /public/ prefix
Solution: Use /images/filename.jpg (not /public/images/...)
```

**Issue:** 404 on navigation
```
Check: Using Next.js <Link> component
Check: Routes match file structure in /src/app/
Solution: Verify App Router conventions
```

## 🔄 Continuous Deployment

### Automatic Deployments

Every push to `main` branch automatically:
1. ✅ Triggers new build
2. ✅ Runs build process
3. ✅ Deploys to production
4. ✅ Invalidates CDN cache

### Branch Deployments

Deploy multiple branches for staging/testing:
1. In Amplify Console → Your App
2. Click "Connect branch"
3. Select branch from dropdown
4. Each branch gets unique URL

**Example URLs:**
- `main`: https://main.xxxxxx.amplifyapp.com
- `staging`: https://staging.xxxxxx.amplifyapp.com
- `dev`: https://dev.xxxxxx.amplifyapp.com

## 🌍 Custom Domain (Optional)

### Add Your Domain

1. In Amplify Console → "Domain management"
2. Click "Add domain"
3. Enter your domain (e.g., swamiji.com)
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (automatic)

**DNS Propagation:** 2-48 hours
**SSL Certificate:** Free and auto-renewing

## 📈 Monitoring

### Build Logs
- Access in Amplify Console
- Shows each build step
- Helpful for debugging

### CloudWatch
- Automatically integrated
- Monitor errors and performance
- Set up alerts for failures

### Analytics (Optional)
- Enable in Amplify Console
- Track page views
- Monitor user sessions
- See geographic distribution

## 💰 Cost Estimation

### AWS Amplify Pricing (approximate):

| Resource | Free Tier | Paid (after free tier) |
|----------|-----------|------------------------|
| Build minutes | 1,000 min/month | $0.01/minute |
| Hosting (data transfer) | 15 GB/month | $0.15/GB |
| Storage | 5 GB | $0.023/GB/month |

**Typical cost for low-medium traffic:** $0-10/month

## 📚 Additional Documentation

For comprehensive guides, see:
- 📄 **`AWS_AMPLIFY_CHECKLIST.md`** - Detailed deployment checklist
- 📄 **`RESPONSIVE_VALIDATION.md`** - Responsive design validation
- 📄 **`TESTING_GUIDE.md`** - Testing instructions
- 📄 **`README.md`** - Project overview

## 🆘 Support

### Resources:
- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Next.js on Amplify Guide](https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html)
- [Amplify Discord Community](https://discord.gg/amplify)
- [AWS Support](https://aws.amazon.com/support/)

### Common Links:
- [Amplify Console](https://console.aws.amazon.com/amplify/)
- [CloudWatch Logs](https://console.aws.amazon.com/cloudwatch/)
- [AWS Status](https://status.aws.amazon.com/)

## ✅ Deployment Checklist

Before deploying, verify:
- [ ] Code builds successfully locally
- [ ] All tests passing
- [ ] No console errors
- [ ] Responsive design tested
- [ ] All images optimized
- [ ] Environment variables documented
- [ ] Git repository up to date
- [ ] amplify.yml present and correct
- [ ] next.config.mjs optimized
- [ ] README.md updated

## 🎉 Post-Deployment

After successful deployment:
1. ✅ Test production URL
2. ✅ Verify all pages work
3. ✅ Test on mobile devices
4. ✅ Check language switching
5. ✅ Test theme switcher
6. ✅ Monitor build logs
7. ✅ Share URL with stakeholders

---

**Last Updated:** November 13, 2025  
**Status:** ✅ **Production Ready**  
**Next.js Version:** 16.0.1  
**Node Requirement:** >= 18.0.0  
**Deployment Platform:** AWS Amplify

**Ready to deploy!** 🚀
