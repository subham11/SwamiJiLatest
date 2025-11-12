# AWS Testimonial Carousel - Implementation Guide

## Overview
This is a recreation of the AWS testimonial carousel component based on your video. It features:
- Auto-rotating testimonial cards
- Smooth transitions and animations
- Responsive design
- Expandable FAQ section
- Accessibility features
- Touch/swipe support (can be added)

## Installation & Setup

### 1. Install Required Dependencies
```bash
npm install next react react-dom
# or
yarn add next react react-dom
```

### 2. Configure Tailwind CSS
Make sure Tailwind CSS is properly configured in your Next.js project:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
```

### 3. Add Required Images and Logos

Create the following directory structure in your `public` folder:

```
public/
├── logos/
│   ├── epic-games-logo.svg
│   ├── philips-logo.svg
│   ├── canva-logo.svg
│   └── bmw-logo.svg
└── images/
    ├── epic-games-bg.jpg
    ├── philips-bg.jpg
    ├── canva-bg.jpg
    └── bmw-bg.jpg
```

### 4. Usage Example

```jsx
// pages/index.js or app/page.js
import TestimonialCarousel from '../components/TestimonialCarousel';

export default function Home() {
  return (
    <div>
      <TestimonialCarousel />
      {/* Rest of your page content */}
    </div>
  );
}
```

### 5. Advanced Usage with Custom Data

```jsx
// Custom testimonial data
const customTestimonials = [
  {
    id: 1,
    company: "Your Company",
    logo: "/logos/your-logo.svg",
    headline: "Your custom headline here",
    backgroundImage: "/images/your-bg.jpg",
    bgAlt: "Description of your image"
  },
  // Add more testimonials...
];

// Pass as props (you'll need to modify the component to accept props)
<TestimonialCarousel testimonials={customTestimonials} />
```

## Customization Options

### 1. Timing and Animation
```javascript
// Change auto-rotation timing (in useEffect)
const timer = setInterval(() => {
  setCurrentSlide((prev) => (prev + 1) % testimonials.length);
}, 5000); // Change this value (5000ms = 5 seconds)
```

### 2. Color Scheme
Update the Tailwind classes to match your brand:
- Background: `bg-gray-50` → `bg-your-color`
- Text colors: `text-white`, `text-gray-900`, etc.
- Accent colors: `text-blue-600`, `border-gray-200`, etc.

### 3. Typography
- Headline font size: `text-4xl md:text-5xl lg:text-6xl`
- Font weight: `font-light`
- Add custom fonts via Google Fonts or local fonts

### 4. Layout and Spacing
- Container max-width: `max-w-3xl`, `max-w-6xl`
- Padding: `px-8 md:px-16 lg:px-24`
- Section spacing: `py-20`

## Features Included

### ✅ Core Features
- [x] Auto-rotating carousel
- [x] Manual navigation (arrows + dots)
- [x] Smooth transitions
- [x] Responsive design
- [x] Expandable FAQ section
- [x] Accessibility features

### 🔄 Optional Enhancements You Can Add

#### Touch/Swipe Support
```bash
npm install framer-motion
```

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Wrap carousel content with motion.div for swipe gestures
```

#### Lazy Loading Images
```jsx
import Image from 'next/image';

// Already implemented with Next.js Image component
<Image
  src={testimonial.backgroundImage}
  alt={testimonial.bgAlt}
  fill
  className="object-cover"
  priority={index === 0} // Only load first image immediately
/>
```

#### Auto-pause on Hover
```javascript
const [isPaused, setIsPaused] = useState(false);

// In useEffect, add pause condition
useEffect(() => {
  if (isPaused) return;
  
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  }, 5000);

  return () => clearInterval(timer);
}, [testimonials.length, isPaused]);
```

## Performance Optimization

### 1. Image Optimization
- Use WebP format for backgrounds
- Optimize image sizes (recommended: 1920x1080 for backgrounds)
- Consider using a CDN

### 2. Preload Critical Resources
```jsx
// In your _document.js or layout
<link rel="preload" as="image" href="/images/epic-games-bg.jpg" />
```

### 3. Code Splitting
```jsx
// Lazy load the component if not immediately visible
import dynamic from 'next/dynamic';

const TestimonialCarousel = dynamic(
  () => import('../components/TestimonialCarousel'),
  { 
    loading: () => <div>Loading...</div>,
    ssr: true 
  }
);
```

## Browser Support
- Chrome 80+
- Firefox 80+
- Safari 13+
- Edge 80+

## Accessibility Features
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Alt text for images
- ARIA labels for buttons

## Troubleshooting

### Common Issues
1. **Images not loading**: Check file paths and ensure images exist in public folder
2. **Styles not applying**: Verify Tailwind CSS is properly configured
3. **Carousel not auto-rotating**: Check console for JavaScript errors

### Performance Issues
- Large background images can cause slow loading
- Consider lazy loading non-visible slides
- Use appropriate image formats (WebP when possible)

## License
Feel free to use and modify this component for your projects.
