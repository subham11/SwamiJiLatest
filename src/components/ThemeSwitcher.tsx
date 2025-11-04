'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setTheme, themes, ThemeName } from '@/redux/slices/themeSlice';

export function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (themeName: ThemeName) => {
    dispatch(setTheme(themeName));
    setIsOpen(false);
  };

  return (
    <div className="themeSwitcher" ref={dropdownRef}>
      <button
        className="themeToggleBtn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <span className="themeIcon">🎨</span>
        <span className="themeName">{currentTheme}</span>
        <span className={`themeArrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="themeDropdown">
          {(Object.keys(themes) as ThemeName[]).map((themeName) => (
            <button
              key={themeName}
              className={`themeOption ${currentTheme === themeName ? 'active' : ''}`}
              onClick={() => handleThemeChange(themeName)}
            >
              <span className="themeOptionName">{themeName}</span>
              <div className="colorSwatches">
                {Object.values(themes[themeName]).map((color, idx) => (
                  <span
                    key={idx}
                    className="colorSwatch"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
