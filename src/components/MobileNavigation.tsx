'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMobileMenu } from './MobileMenuProvider';
import { BRAND_LOGO_MARK, SITE_SHORT_NAME } from '@/lib/siteConfig';

type NavItem = {
  href: string;
  label: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: 'PRODUCT',
    items: [
      { href: '/', label: 'Home' },
      { href: '/features', label: 'Features' },
      { href: '/how-it-works', label: 'How It Works' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'MORE',
    items: [
      { href: '/blog', label: 'Blog' },
      { href: '/about-us', label: 'About Us' },
      { href: '/contact-us', label: 'Contact Us' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/disclaimer', label: 'Disclaimer' },
    ],
  },
];

function MenuButton({ onClick, isOpen }: { onClick: () => void; isOpen?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 xl:hidden"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={!!isOpen}
      aria-controls="mobile-nav-panel"
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
}

export default function MobileNavigation() {
  const { isOpen, setIsOpen } = useMobileMenu();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, setIsOpen]);

  const closeMenu = () => setIsOpen(false);

  const panel =
    mounted && isOpen
      ? createPortal(
          <div
            id="mobile-nav-panel"
            className="fixed inset-0 z-[100] flex flex-col bg-brand xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-brand-soft/80 px-4 py-3">
              <Link href="/" className="flex min-w-0 items-center gap-2.5" onClick={closeMenu}>
                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={BRAND_LOGO_MARK}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <span className="truncate text-base font-bold text-white">{SITE_SHORT_NAME}</span>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {navSections.map((section) => (
                <div key={section.title} className="mb-5">
                  <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-soft">
                    {section.title}
                  </p>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className={`flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium transition-colors ${
                              active
                                ? 'bg-violet/20 font-semibold text-white'
                                : 'text-white/85 hover:bg-white/5'
                            }`}
                          >
                            <span>{item.label}</span>
                            <span className="text-pink" aria-hidden="true">
                              ›
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="border-t border-white/10 bg-brand-soft/70 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                href="/#start"
                onClick={closeMenu}
                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-violet to-pink px-4 py-3 text-sm font-bold text-white"
              >
                Start scheduling
              </Link>
            </div>
          </div>,
          document.body
        )
      : null;

  if (!mounted) {
    return (
      <div className="xl:hidden">
        <MenuButton onClick={() => {}} />
      </div>
    );
  }

  return (
    <div className="xl:hidden">
      <MenuButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      {panel}
    </div>
  );
}
