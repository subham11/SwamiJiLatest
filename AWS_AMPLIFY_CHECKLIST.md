# AWS Amplify Deployment Checklist

## ✅ Pre-Deployment Verification

### Configuration Files Status

- [x] **amplify.yml** - Configured and optimized
- [x] **next.config.mjs** - Standalone output enabled
- [x] **.npmrc** - Legacy peer deps enabled
- [x] **package.json** - Node engine specified (>=18.0.0)
- [x] **TypeScript** - Properly configured
- [x] **Environment** - All client components marked

---

## 📋 AWS Amplify Compatibility Checklist

### ✅ Build Configuration
- [x] Build command: `npm run build`
- [x] Output directory: `.next`
- [x] Node version requirement: >= 18.0.0
- [x] Package manager: npm with --legacy-peer-deps
- [x] Cache paths configured for node_modules and .next/cache
- [x] Version logging enabled (node/npm versions)

### ✅ Next.js Configuration
- [x] Output mode: `standalone` (required for Amplify)
- [x] Images: `unoptimized: true` (Amplify compatibility)
- [x] Remote patterns: Configured for external images
- [x] Source maps: Disabled in production
- [x] Compression: Enabled
- [x] SWC minification: Enabled
- [x] Powered-by header: Disabled

### ✅ Dependencies
- [x] All dependencies listed in package.json
- [x] No missing peer dependencies
- [x] Compatible versions verified
- [x] Legacy peer deps flag set

### ✅ Code Quality
- [x] All TypeScript errors resolved
- [x] ESLint configuration present
- [x] Client components properly marked with 'use client'
- [x] No console errors in production build

### ✅ Static Assets
- [x] Images in public/ directory
- [x] JSON data files accessible
- [x] Fonts properly configured
- [x] CSS modules working

### ✅ Responsive Design
- [x] Mobile-first approach
- [x] All breakpoints tested
- [x] No horizontal scroll
- [x] Touch-friendly UI

---

## 🚀 Deployment Steps

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git status
git add .
git commit -m "Prepare for AWS Amplify deployment"
git push origin main
```

### Step 2: AWS Amplify Console Setup

1. **Sign in to AWS Console**
   - Go to https://console.aws.amazon.com/amplify/

2. **Create New App**
   - Click "New app" → "Host web app"
   - Choose "GitHub" as your repository service
   - Authorize AWS Amplify to access your GitHub account

3. **Select Repository**
   - Repository: `SwamiJiLatest` (or your repo name)
   - Branch: `main`
   - Click "Next"

4. **Configure Build Settings**
   - App name: `swami-rupeshwaranand` (or your choice)
   - Environment: `production`
   - Build settings: **Automatically detected from amplify.yml**
   - Click "Next"

5. **Review and Deploy**
   - Review all settings
   - Click "Save and deploy"

### Step 3: Monitor Build

Watch the build process in AWS Amplify Console:
1. **Provision** - Setting up build environment
2. **Build** - Running npm install and build
3. **Deploy** - Deploying to CDN
4. **Verify** - Testing deployment

Build typically takes **3-5 minutes**.

---

## 🔧 Build Configuration Details

### Amplify.yml Breakdown

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - node --version        # Log Node.js version
        - npm --version         # Log npm version
        - npm ci --legacy-peer-deps  # Install dependencies
    build:
      commands:
        - npm run build         # Build Next.js app
  artifacts:
    baseDirectory: .next       # Output directory
    files:
      - '**/*'                 # Include all files
  cache:
    paths:
      - node_modules/**/*      # Cache dependencies
      - .next/cache/**/*       # Cache Next.js build
```

### What Each Command Does:

- **`node --version`** - Logs Node.js version for debugging
- **`npm --version`** - Logs npm version for debugging
- **`npm ci`** - Clean install (faster than npm install)
- **`--legacy-peer-deps`** - Handles peer dependency conflicts
- **`npm run build`** - Runs Next.js build process

---

## 🌐 Environment Variables (Optional)

If you need environment variables, add them in Amplify Console:

### Navigate to Environment Variables:
1. Go to your app in Amplify Console
2. Click "App settings" → "Environment variables"
3. Click "Add variable"

### Common Variables (if needed):
```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are accessible in browser.

---

## 🔍 Verification Steps

After deployment completes:

### 1. Basic Functionality
- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Images display properly
- [ ] Announcement bar scrolling
- [ ] Hero carousel functioning

### 2. Responsive Design
- [ ] Test on mobile (320px, 375px, 390px)
- [ ] Test on tablet (768px, 1024px)
- [ ] Test on desktop (1280px, 1920px)
- [ ] Hamburger menu works on mobile
- [ ] Touch interactions work

### 3. Language Switching
- [ ] Switch between English and Hindi
- [ ] Content updates correctly
- [ ] Menu items translate
- [ ] No missing translations

### 4. Page Navigation
- [ ] Home page (/)
- [ ] Swamiji page (/swamiji)
- [ ] Bajrang Baan page (/bajrang-baan)
- [ ] Test Component page (/test-component)
- [ ] Login page (/login)
- [ ] Dashboard page (/dashboard)

### 5. Features
- [ ] Theme switcher works
- [ ] Redux state persists
- [ ] ScrollSnapAnimation smooth
- [ ] Dot indicators functional
- [ ] Forms work (if any)

---

## 📊 Performance Optimization

### Already Implemented:

✅ **Build Optimization**
- Standalone output for smaller bundle
- SWC minification enabled
- Production source maps disabled
- Compression enabled

✅ **Image Optimization**
- Unoptimized for Amplify compatibility
- Remote patterns configured
- Images in public/ directory

✅ **Caching**
- Node modules cached
- Next.js build cache enabled
- Browser caching via Amplify CDN

✅ **Code Splitting**
- Automatic with Next.js App Router
- Dynamic imports where possible
- Component-level code splitting

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Peer dependency conflict"**
```
Solution: Already handled by --legacy-peer-deps flag
Check: Verify .npmrc file exists with legacy-peer-deps=true
```

**Error: "Module not found"**
```
Solution: Check all imports use correct paths
Check: Verify all files are committed to git
```

**Error: "Out of memory"**
```
Solution: Contact AWS Support to increase build memory
Temporary: Reduce bundle size or optimize images
```

### Build Succeeds but Site Not Working

**Blank page or loading forever**
```
Check: Browser console for JavaScript errors
Check: Verify all 'use client' directives present
Solution: Review build logs in Amplify Console
```

**Images not loading**
```
Check: Images are in public/ directory
Check: Image paths start with /images/...
Solution: Verify remotePatterns in next.config.mjs
```

**Navigation not working**
```
Check: Links use Next.js Link component
Check: No hardcoded domain in hrefs
Solution: Use relative paths for internal links
```

**Environment variables not working**
```
Check: Variables added in Amplify Console
Check: Variables prefixed with NEXT_PUBLIC_
Solution: Redeploy after adding variables
```

### Performance Issues

**Slow page load**
```
Check: Lighthouse performance score
Solution: Optimize images, reduce bundle size
Consider: Enable Next.js Image optimization
```

**Slow builds**
```
Check: Cache is working (should be green in logs)
Solution: Ensure cache paths are correct
Consider: Remove unused dependencies
```

---

## 🔐 Custom Domain Setup (Optional)

### Add Custom Domain:

1. **In Amplify Console**
   - Go to "App settings" → "Domain management"
   - Click "Add domain"

2. **Configure DNS**
   - Add domain name (e.g., swamiji.com)
   - Choose subdomain options
   - Click "Configure domain"

3. **Update DNS Records**
   - Copy DNS records from Amplify
   - Add to your domain registrar
   - Wait for DNS propagation (2-48 hours)

4. **SSL Certificate**
   - Amplify automatically provisions SSL
   - Certificate renews automatically
   - HTTPS enforced by default

---

## 📈 Monitoring & Analytics

### CloudWatch Logs
- Access build logs in Amplify Console
- Monitor errors and warnings
- Track build times

### Amplify Analytics (Optional)
- Enable in App settings
- Track page views
- Monitor user sessions
- Geographic distribution

### Performance Monitoring
- Use Lighthouse for audits
- Monitor Core Web Vitals
- Check mobile performance

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Already configured! Every push to `main` branch will:
1. Trigger new build automatically
2. Run tests (if configured)
3. Deploy to production
4. Invalidate CDN cache

### Branch Deployments (Optional)

Deploy multiple branches:
1. Go to App settings → General
2. Add new branch
3. Each branch gets unique URL
4. Useful for staging/development

---

## 💰 Cost Estimation

### AWS Amplify Pricing (US East):

**Build Minutes**
- First 1,000 minutes/month: FREE
- Additional: $0.01/minute

**Hosting (Data Transfer)**
- First 15 GB/month: FREE
- Additional: $0.15/GB

**Data Storage**
- First 5 GB: FREE
- Additional: $0.023/GB/month

**Typical Monthly Cost**: $0-10 for small to medium traffic

---

## 📞 Support Resources

### AWS Documentation
- [Amplify Hosting Docs](https://docs.aws.amazon.com/amplify/)
- [Next.js on Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html)
- [Amplify CLI Guide](https://docs.amplify.aws/)

### Community
- [AWS Amplify Discord](https://discord.gg/amplify)
- [Next.js Discord](https://nextjs.org/discord)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/aws-amplify)

### AWS Support
- Basic: Free (forums only)
- Developer: $29/month
- Business: $100/month

---

## ✅ Final Checklist Before Deployment

- [ ] All code committed and pushed to GitHub
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] All pages tested locally
- [ ] Environment variables documented (if any)
- [ ] Images optimized for web
- [ ] README.md updated
- [ ] DEPLOYMENT.md reviewed
- [ ] amplify.yml verified
- [ ] next.config.mjs optimized

---

## 🎉 Post-Deployment

### After Successful Deployment:

1. **Test Production Site**
   - Visit Amplify-provided URL
   - Test all features
   - Check mobile responsiveness
   - Verify language switching

2. **Share URL**
   - Note down the Amplify URL
   - Share with team/stakeholders
   - Update documentation

3. **Monitor Performance**
   - Check CloudWatch logs
   - Monitor error rates
   - Track build times

4. **Set Up Alerts (Optional)**
   - Build failure notifications
   - Error rate alerts
   - Performance degradation alerts

---

## 📝 Deployment Commands Summary

```bash
# Local testing before deployment
npm install --legacy-peer-deps
npm run build
npm run start

# Git commands for deployment
git status
git add .
git commit -m "Deploy to AWS Amplify"
git push origin main

# Check deployment status
# Visit: https://console.aws.amazon.com/amplify/
```

---

**Last Updated**: November 13, 2025  
**Status**: ✅ Ready for AWS Amplify Deployment  
**Compatibility**: Next.js 16, Node.js 18+, React 19
