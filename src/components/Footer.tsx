'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('footer.sections.main'),
      links: [
        { label: t('footer.links.home'), href: '/' },
        { label: t('footer.links.swamiji'), href: '/swamiji' },
        { label: t('footer.links.ashram'), href: '/ashram' },
        { label: t('footer.links.sadhana'), href: '#sadhana' },
        { label: t('footer.links.siddhaYantra'), href: '#yantra' },
        { label: t('footer.links.rakshaKavach'), href: '#yantra' }
      ]
    },
    {
      title: t('footer.sections.services'),
      links: [
        { label: t('footer.links.pitrDosha'), href: '/pitr-shanti' },
        { label: t('footer.links.tantraBadha'), href: '/shri-varahi-yagya' },
        { label: t('footer.links.narayanBali'), href: '/narayan-bali' },
        { label: t('footer.links.tripindiShradh'), href: '/tripindi-shradh' },
        { label: t('footer.links.siddhYagya'), href: '#mantrasiddha' }
      ]
    },
    {
      title: t('footer.sections.programs'),
      links: [
        { label: t('footer.links.amavasyaPitr'), href: '#amavasya' },
        { label: t('footer.links.bajrangBaan'), href: '/bajrang-baan' },
        { label: t('footer.links.purnimaHavan'), href: '#purnima' },
        { label: t('footer.links.mantraSadhana'), href: '#sadhana-shivir' },
        { label: t('footer.links.daiviyaMargdarshan'), href: '#margdarshan' }
      ]
    }
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footerInner">
        <nav className="footerGrid" aria-label={t('footer.ariaLabel')}>
          {sections.map(section => (
            <div key={section.title} className="footerColumn">
              <h2 className="footerTitle">{section.title}</h2>
              <ul className="footerLinks">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link className="footerLink" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="footerMeta">
          <span>© {new Date().getFullYear()} {t('brand.name')}</span>
        </div>
      </div>
    </footer>
  );
}
