import "./globals.css";
import { Providers } from "@/redux/Providers";
import { I18nProvider } from "@/lib/i18n-provider";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ThemeApplier } from "@/components/ThemeApplier";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { PageLoader } from "@/components/PageLoader";
import { LangSetter } from "../components/LangSetter";
import { HashRedirector } from "@/components/HashRedirector";

export const metadata = {
  title: "Swami Rupeshwaranand website",
  description: "Next.js + Redux + i18next + Swiper + ReactBits animations"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="preload" 
          href="/images/hero/hero-1.svg" 
          as="image" 
          type="image/svg+xml"
          fetchPriority="high"
        />
      </head>
      <body>
        <a href="#main-content" className="skipLink">Skip to main content</a>
        <Providers>
          <I18nProvider>
            <HashRedirector />
            <LangSetter />
            <PageLoader />
            <ThemeApplier />
            <AnnouncementBar />
            <ThemeSwitcher />
            {children}
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
