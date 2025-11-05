'use client';

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setActiveMenu } from "@/redux/slices/uiSlice";
import { setLocale } from "@/redux/slices/localeSlice";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";
import menuEN from "@/data/menu.en.json";
import menuHI from "@/data/menu.hi.json";
import { logout } from "@/redux/slices/authSlice";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  type: 'link' | 'dropdown';
  submenu?: Array<{
    id: string;
    label: string;
    href: string;
  }>;
}

interface MenuRow {
  id: string;
  items: MenuItem[];
}

interface MenuData {
  rows: MenuRow[];
}

export function NavBar(){
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const active = useSelector((s: RootState)=> s.ui.activeMenu);
  const user = useSelector((s: RootState)=> (s as any).auth?.user);
  const [open, setOpen] = useState<string | null>(null);
  const [closeTimer, setCloseTimer] = useState<NodeJS.Timeout | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({});

  const menuData = useMemo(() => {
    return i18n.language === 'hi' ? menuHI : menuEN;
  }, [i18n.language]);

  // Track viewport for mobile behaviors
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
      setIsMobile(matches);
      if (!matches) {
        // Reset mobile-only states when returning to desktop
        setMobileOpen(false);
        setMobileDropdowns({});
      }
    };
    handler(mq);
    mq.addEventListener?.('change', handler as (e: MediaQueryListEvent) => void);
    return () => mq.removeEventListener?.('change', handler as (e: MediaQueryListEvent) => void);
  }, []);

  const handleMouseEnter = (menu: string) => {
    if (isMobile) return; // Disable hover logic on mobile
    if (closeTimer) {
      clearTimeout(closeTimer);
      setCloseTimer(null);
    }
    if (menu === 'none') {
      setOpen(null);
    } else {
      setOpen(menu);
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Disable hover close on mobile
    const timer = setTimeout(() => {
      setOpen(null);
    }, 300);
    setCloseTimer(timer);
  };

  const changeLang = (lng: 'en' | 'hi') => {
    dispatch(setLocale(lng));
    i18n.changeLanguage(lng).catch(()=>{});
  };

  const renderMenuItem = (item: any) => {
    // Hide Signin item when user is already logged in
    if (item.id === 'signin' && user) return null;
    if (item.type === 'link') {
      return (
        <Link key={item.id} href={item.href as any} onMouseEnter={() => handleMouseEnter('none')}>
          {item.label}
        </Link>
      );
    } else {
      return (
        <div
          key={item.id}
          className="menuItemWithDropdown"
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="menuDropdownTrigger"
            onClick={() => {
              if (isMobile) {
                setMobileDropdowns(prev => ({ ...prev, [item.id]: !prev[item.id] }));
              } else {
                dispatch(setActiveMenu(item.id));
              }
            }}
            aria-expanded={(isMobile ? !!mobileDropdowns[item.id] : open === item.id) ? true : false}
            aria-haspopup="true"
          >
            {item.label}
          </button>
          {(item.submenu && ((isMobile && mobileDropdowns[item.id]) || (!isMobile && open === item.id))) && (
            <div className="menuDropdown" role="menu" aria-label={`${item.label} submenu`}>
              {item.submenu.map((subItem: any) => (
                <a key={subItem.id} href={subItem.href} role="menuitem">
                  {subItem.label}
                </a>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="navInner">
        <span className="brand">🕉 {t('brand.name')}</span>
        <button className="hamburger" aria-label="Toggle menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}>
          <span/>
          <span/>
          <span/>
        </button>
        <div className={`menuContainer ${mobileOpen ? 'open' : ''}`}>
          {menuData.rows.map((row, index) => (
            <div key={row.id} className="menuRow" role="menubar" aria-label={`Main menu row ${index + 1}`}>
              {row.items.map(renderMenuItem)}
            </div>
          ))}
        </div>
        <div className="navRight">
          {i18n.language === 'hi' ? (
            <button className="langBtn" onClick={()=>changeLang('en')}>EN</button>
          ) : (
            <button className="langBtn" onClick={()=>changeLang('hi')}>HI</button>
          )}
          {!user ? null : (
            <>
              <span style={{ opacity: 0.8 }}>{user.username}</span>
              <button
                onClick={() => dispatch(logout())}
                style={{ border:'1px solid var(--color-primary)', background:'transparent', color:'var(--color-primary)', borderRadius:6, padding:'0.2rem 0.5rem' }}
              >
                {i18n.language === 'hi' ? 'लॉग आउट' : 'Sign out'}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
