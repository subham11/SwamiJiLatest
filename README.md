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
```bash
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:3000
```

Replace images in `public/images/` and texts in `src/locales/*/common.json`.
