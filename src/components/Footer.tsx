import Link from 'next/link';
import CtaButton from '@/components/CtaButton';
import { CONTACT_EMAIL, SITE_DOMAIN, SITE_NAME, SITE_TAGLINE } from '@/lib/siteConfig';

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-gradient-to-br from-brand via-brand-soft to-brand-deep pt-8 pb-2 px-4 text-white md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h2 className="mb-4 font-display text-xl font-bold text-white">{SITE_NAME}</h2>
            <p className="mb-4 text-sm text-white/75">{SITE_TAGLINE}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-violet-soft underline hover:no-underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Product</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-white/85 hover:text-white hover:underline">TikTok Scheduler</Link></li>
              <li><Link href="/features" className="text-white/85 hover:text-white hover:underline">Features</Link></li>
              <li><Link href="/how-it-works" className="text-white/85 hover:text-white hover:underline">How It Works</Link></li>
              <li><Link href="/pricing" className="text-white/85 hover:text-white hover:underline">Free plan</Link></li>
              <li><Link href="/dashboard" className="text-white/85 hover:text-white hover:underline">Dashboard</Link></li>
              <li><Link href="/blog" className="text-white/85 hover:text-white hover:underline">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Guides</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog/how-to-schedule-tiktok-posts" className="text-white/85 hover:text-white hover:underline">How to Schedule TikTok Posts</Link></li>
              <li><Link href="/blog/best-time-to-post-on-tiktok" className="text-white/85 hover:text-white hover:underline">Best Time to Post on TikTok</Link></li>
              <li><Link href="/blog/tiktok-content-calendar" className="text-white/85 hover:text-white hover:underline">TikTok Content Calendar</Link></li>
              <li><Link href="/blog/does-tiktok-have-a-scheduler" className="text-white/85 hover:text-white hover:underline">Does TikTok Have a Scheduler?</Link></li>
              <li><Link href="/about-us" className="text-white/85 hover:text-white hover:underline">About Us</Link></li>
              <li><Link href="/privacy" className="text-white/85 hover:text-white hover:underline">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="text-white/85 hover:text-white hover:underline">Disclaimer</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Get started</h2>
            <p className="mb-4 text-sm text-white/80">
              Queue TikTok videos once, publish at the times your audience is online.
            </p>
            <CtaButton href="/dashboard" ariaLabel="Connect TikTok and start scheduling" icon="arrow">
              CONNECT TIKTOK
            </CtaButton>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-4 pb-3 text-center text-sm text-white/70">
          <p className="mb-0">
            © 2026 {SITE_NAME}. All rights reserved. |{' '}
            <Link href="/" className="underline hover:no-underline text-white/90">{SITE_DOMAIN}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
