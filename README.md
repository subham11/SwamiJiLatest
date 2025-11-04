# Swami Rupeshwaranand website

This codebase powers the Swami Rupeshwaranand website, built on Next.js with Redux and i18next. It includes animated UI components and a Swiper-based hero.

## Features
- Next.js 15 (App Router), TypeScript, strict mode
- Redux Toolkit + React Redux
- i18next (EN/HI) with client-side language switcher
- Responsive, accessible nav with dummy submenu
- Parallax section + full-bleed Swiper hero
- Animated cards using `@appletosolutions/reactbits` `AnimatedContent`
- Custom hooks (e.g., `useParallaxFactor`) for scroll logic
- ESLint config, sensible `.gitignore`
- Theme colors: `#ff4d00`, `#ffc100`, `#ff7400`, white

## Quickstart
````markdown
# Swami Rupeshwaranand website

A bilingual (EN/HI) Next.js 16 website with animated UI, dynamic navigation, and a small demo dashboard (auth + documents). The UI features a Swiper hero on Home, an interactive Swamiji page with staged animations, and a two-row, JSON-driven top navigation with dropdowns.

## Tech stack
- Next.js 16 (App Router), React 19, TypeScript 5
- Redux Toolkit + React Redux
- i18next + react-i18next + browser language detection
- Swiper (Home hero)
- @appletosolutions/reactbits (lightweight animation helpers)
- GSAP (available), Three.js utilities (available)
- ESLint / strict TS

## Top navigation (data-driven)
- Two-row layout, non-wrapping items, stable dropdown hover
- Language switcher EN/HI
- “Signin” routes to the sign-in form; hidden once logged in (shows username + Sign out)
- Menu items are driven by JSON:
	- `src/data/menu.en.json`
	- `src/data/menu.hi.json`

English menu highlights:
- Home (/)
- Swamiji (/swamiji)
- Shri Bajrang Baan Abhiyan
- Swami Rupeshwaranand Ashram
- Aashram Poojan Services (dropdown)
- Siddha Yantra & Raksha Kavach (dropdown)
- Stotra, Registration, Donation, Signin, Contact

Hindi menu mirrors the above with localized labels, including “लॉग इन”.

## Pages and key features

### Home (/)
- Swiper-based hero
- Parallax content section and animated cards

### Swamiji (/swamiji)
- Overlapping images section: images animate in first, then the text fades/slides in
- Hovering an image updates title/description on the right (localized)
- Content is loaded from JSON at runtime:
	- `public/content/swamiji.en.json`
	- `public/content/swamiji.hi.json`
- About Swamiji section below: image loads/animates first, then title/subtitle/description appear; border color follows theme
- Global page loader shows during async content fetch

### Auth + Dashboard (demo)
- Hardcoded users (front-end demo only):
	- Admin: `admin` / `admin123`
	- User: `user` / `user123`
- Signin from the top navigator goes to `/login`
- `/dashboard` (guarded):
	- Right pane: animated Year/Month accordion
	- Main: list of documents for selected month (download + view)
	- Viewer overlay supports images/PDF
	- Admin-only upload panel to add files (kept in-session via object URLs)

## Content sources
- Navigation: `src/data/menu.{en,hi}.json`
- Swamiji page content: `public/content/swamiji.{en,hi}.json`
- Translations (UI strings): `src/locales/{en,hi}/common.json`
- Images: `public/images/` (Swamiji images under `public/images/SwamiJi/`)

## Development
Requirements: Node >= 18

```bash
# install deps
pnpm i   # or: npm i / yarn

# run dev server
pnpm dev # http://localhost:3000
```

Project entry points:
- App layout: `src/app/layout.tsx`
- Home: `src/app/page.tsx`
- Swamiji: `src/app/swamiji/page.tsx`
- Login: `src/app/login/page.tsx`
- Dashboard: `src/app/dashboard/page.tsx`

Redux store and slices:
- Store: `src/redux/store.ts`
- UI slice: `src/redux/slices/uiSlice.ts`
- Locale slice: `src/redux/slices/localeSlice.ts`
- Theme slice: `src/redux/slices/themeSlice.ts`
- Auth slice (hardcoded users): `src/redux/slices/authSlice.ts`

## Build
```bash
pnpm build
pnpm start
```

## Deploy
You can deploy to Vercel or AWS Amplify.

Vercel (recommended):
- Push this repo to GitHub
- Import the project in Vercel
- Framework: Next.js; default build output (Next 16)
- Node version: >= 18

AWS Amplify:
- Connect your GitHub repo
- Select framework: Next.js
- Ensure Node runtime >= 18
- Use default build settings unless you have custom env vars

## Notes
- The dashboard’s upload feature is a prototype and stores uploaded files in-session using object URLs—refresh clears them. For persistence, integrate a backend (e.g., S3 + API).
- Menu hover and dropdowns are tuned to avoid flicker (hover bridge + small delay).
- Themed colors are applied via CSS variables set by `ThemeApplier`.

## Mobile responsiveness
- Navbar collapses to a hamburger with stacked, tap-friendly dropdowns on ≤768px.
- Swamiji images reduce their overlap step and support tap-to-switch text; About section stacks image above text.
- Parallax background uses scroll on mobile to avoid iOS jank; sections compact padding.
- Card grids, teachings, quotes, and events all adapt with existing breakpoints.

````
