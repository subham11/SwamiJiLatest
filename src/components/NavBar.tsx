'use client';

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setActiveMenu } from "@/redux/slices/uiSlice";
import { setLocale } from "@/redux/slices/localeSlice";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
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

  const menuData = useMemo(() => {
    return i18n.language === 'hi' ? menuHI : menuEN;
  }, [i18n.language]);

  const handleMouseEnter = (menu: string) => {
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
        <div key={item.id} className="menuItemWithDropdown" onMouseEnter={() => handleMouseEnter(item.id)} onMouseLeave={handleMouseLeave}>
          <a href={item.href} onClick={() => dispatch(setActiveMenu(item.id))}>
            {item.label}
          </a>
          {open === item.id && item.submenu && (
            <div className="menuDropdown" role="menu">
              {item.submenu.map((subItem: any) => (
                <a key={subItem.id} href={subItem.href}>
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
        <div className="menuContainer">
          {menuData.rows.map((row, index) => (
            <div key={row.id} className="menuRow" role="menubar" aria-label={`Main menu row ${index + 1}`}>
              {row.items.map(renderMenuItem)}
            </div>
          ))}
        </div>
        <div style={{display:'flex', gap:'.5rem', alignItems:'center'}}>
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
