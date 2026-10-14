import Link from 'next/link';

export const PRIMARY_CTA_HREF = '/dashboard';

type IconKind = 'download' | 'arrow' | 'mail' | 'play';

type CtaButtonProps = {
  href?: string;
  children: React.ReactNode;
  icon?: IconKind;
  onClick?: () => void;
  type?: 'button' | 'submit';
  as?: 'link' | 'button';
  className?: string;
  ariaLabel?: string;
};

const ICONS: Record<IconKind, React.ReactNode> = {
  download: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  arrow: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  mail: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  play: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  ),
};

const baseClass =
  'download-btn inline-flex items-center justify-center px-8 py-4 text-white font-semibold text-lg rounded-2xl border border-violet/40 bg-gradient-to-r from-violet to-pink hover:from-violet-deep hover:to-pink-deep transition-all group shadow-[0_12px_28px_-14px_rgba(123,92,255,0.9)]';

function ButtonInner({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: IconKind;
}) {
  return (
    <>
      <span className="text-left leading-tight">{children}</span>
      <span className="download-icon ml-3 inline-flex rounded-full bg-white p-2 text-brand transition-transform group-hover:scale-110">
        {ICONS[icon]}
      </span>
    </>
  );
}

export default function CtaButton({
  href = PRIMARY_CTA_HREF,
  children,
  icon = 'arrow',
  onClick,
  type = 'button',
  as = 'link',
  className = '',
  ariaLabel,
}: CtaButtonProps) {
  const classes = `${baseClass} ${className}`.trim();
  const isExternal = href.startsWith('http') || href.startsWith('mailto:');

  if (as === 'button') {
    return (
      <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
        <ButtonInner icon={icon}>{children}</ButtonInner>
      </button>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        <ButtonInner icon={icon}>{children}</ButtonInner>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
      <ButtonInner icon={icon}>{children}</ButtonInner>
    </Link>
  );
}
