'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import MobileNavigation from './MobileNavigation';
import { BRAND_LOGO_MARK, SITE_NAME } from '@/lib/siteConfig';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/about-us', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand/85 py-2 px-3 backdrop-blur-md sm:py-3 sm:px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center gap-3">
        <Link href="/" className="flex items-center min-w-0">
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 mr-2 flex-shrink-0">
            <Image
              src={BRAND_LOGO_MARK}
              alt="TikTok Scheduler logo"
              width={40}
              height={40}
              className="object-contain"
              priority
              fetchPriority="high"
            />
          </div>
          <span className="truncate font-display text-sm sm:text-base md:text-lg font-bold leading-tight text-white">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden xl:flex space-x-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative font-medium transition-colors pb-1 group text-sm text-white/80 ${
                isActive(href) ? 'font-semibold text-white' : 'hover:text-violet-soft'
              }`}
            >
              {label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet to-pink rounded-full transition-all duration-300 ${
                  isActive(href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden xl:block">
          <Link
            href="/#start"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-violet to-pink px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_-12px_rgba(123,92,255,0.9)] transition hover:brightness-110"
          >
            Start scheduling
          </Link>
        </div>

        <MobileNavigation />
      </div>
    </header>
  );
}
