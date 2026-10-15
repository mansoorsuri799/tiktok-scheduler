'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Account = {
  openId: string;
  displayName: string;
  avatarUrl: string;
  scope: string;
  connectedAt: string;
};

type Post = {
  id: string;
  title: string;
  videoUrl: string;
  privacyLevel: string;
  scheduledAt: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed';
  error?: string;
  publishId?: string;
};

type CreatorInfo = {
  creatorAvatarUrl: string;
  creatorUsername: string;
  creatorNickname: string;
  privacyLevelOptions: string[];
  commentDisabled: boolean;
  duetDisabled: boolean;
  stitchDisabled: boolean;
  maxVideoPostDurationSec: number;
};

type MeResponse = {
  configured: boolean;
  connected: boolean;
  plan: { name: string; maxAccounts: number; maxScheduledPosts: number };
  account?: Account | null;
  warning?: string;
};

const fieldClass =
  'w-full rounded-xl border border-white/25 bg-[#1a1433] px-4 py-3 text-white placeholder:text-white/40 shadow-inner shadow-black/20 focus:border-violet focus:outline-none focus:ring-2 focus:ring-violet/40 [color-scheme:dark]';

const PRIVACY_LABELS: Record<string, string> = {
  PUBLIC_TO_EVERYONE: 'Everyone (public)',
  MUTUAL_FOLLOW_FRIENDS: 'Friends',
  FOLLOWER_OF_CREATOR: 'Followers',
  SELF_ONLY: 'Only me',
};

function statusStyles(status: Post['status']) {
  switch (status) {
    case 'published':
      return 'bg-teal/20 text-teal border-teal/40';
    case 'publishing':
      return 'bg-violet/20 text-violet-soft border-violet/40';
    case 'failed':
      return 'bg-pink/20 text-pink-soft border-pink/40';
    default:
      return 'bg-white/10 text-white/85 border-white/20';
  }
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

export default function DashboardApp() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [creator, setCreator] = useState<CreatorInfo | null>(null);
  const [creatorError, setCreatorError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState('');
  const [allowComment, setAllowComment] = useState(false);
  const [allowDuet, setAllowDuet] = useState(false);
  const [allowStitch, setAllowStitch] = useState(false);
  const [commercialOn, setCommercialOn] = useState(false);
  const [brandOrganic, setBrandOrganic] = useState(false);
  const [brandedContent, setBrandedContent] = useState(false);
  const [consented, setConsented] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [videoDurationSec, setVideoDurationSec] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/tiktok/me', { cache: 'no-store' });
      const meJson = (await meRes.json()) as MeResponse;
      setMe(meJson);
      setAvatarBroken(false);

      if (meJson.connected) {
        const [postsRes, creatorRes] = await Promise.all([
          fetch('/api/posts', { cache: 'no-store' }),
          fetch('/api/tiktok/creator-info', { cache: 'no-store' }),
        ]);
        if (postsRes.ok) {
          const postsJson = (await postsRes.json()) as { posts: Post[] };
          setPosts(postsJson.posts || []);
        }
        if (creatorRes.ok) {
          const cJson = (await creatorRes.json()) as { creator: CreatorInfo };
          setCreator(cJson.creator);
          setCreatorError(null);
          setPrivacyLevel('');
        } else {
          const cJson = (await creatorRes.json()) as { error?: string };
          setCreator(null);
          setCreatorError(cJson.error || 'Could not load creator info');
        }
      } else {
        setPosts([]);
        setCreator(null);
      }
    } catch {
      setBanner({ type: 'err', text: 'Could not load dashboard status.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === '1') {
      setBanner({ type: 'ok', text: 'TikTok account connected. You can schedule posts on the free plan.' });
      window.history.replaceState({}, '', '/dashboard');
    }
    const err = params.get('error');
    if (err) {
      setBanner({ type: 'err', text: err });
      window.history.replaceState({}, '', '/dashboard');
    }
    void load();
  }, [load]);

  const commercialLabel = useMemo(() => {
    if (!commercialOn) return null;
    if (brandedContent || (brandOrganic && brandedContent)) {
      return "Your photo/video will be labeled as 'Paid partnership'";
    }
    if (brandOrganic) {
      return "Your photo/video will be labeled as 'Promotional content'";
    }
    return null;
  }, [commercialOn, brandOrganic, brandedContent]);

  const consentText = useMemo(() => {
    if (commercialOn && brandedContent) {
      return (
        <>
          By posting, you agree to TikTok&apos;s{' '}
          <a
            href="https://www.tiktok.com/legal/page/global/bc-policy/en"
            target="_blank"
            rel="noreferrer"
            className="underline text-violet-soft"
          >
            Branded Content Policy
          </a>{' '}
          and{' '}
          <a
            href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en"
            target="_blank"
            rel="noreferrer"
            className="underline text-violet-soft"
          >
            Music Usage Confirmation
          </a>
          .
        </>
      );
    }
    return (
      <>
        By posting, you agree to TikTok&apos;s{' '}
        <a
          href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en"
          target="_blank"
          rel="noreferrer"
          className="underline text-violet-soft"
        >
          Music Usage Confirmation
        </a>
        .
      </>
    );
  }, [commercialOn, brandedContent]);

  const commercialBlocksPublish =
    commercialOn && !brandOrganic && !brandedContent;

  const durationInvalid =
    videoDurationSec != null &&
    creator != null &&
    videoDurationSec > creator.maxVideoPostDurationSec;

  async function disconnect() {
    if (!confirm('Disconnect your TikTok account from TikTok Scheduler?')) return;
    setSaving(true);
    try {
      await fetch('/api/tiktok/disconnect', { method: 'POST' });
      setBanner({ type: 'ok', text: 'TikTok account disconnected.' });
      await load();
    } finally {
      setSaving(false);
    }
  }

  function payload(extra: Record<string, unknown> = {}) {
    return {
      title,
      videoUrl,
      scheduledAt,
      privacyLevel,
      allowComment,
      allowDuet,
      allowStitch,
      brandOrganic: commercialOn && brandOrganic,
      brandedContent: commercialOn && brandedContent,
      consented,
      ...extra,
    };
  }

  async function schedulePost(e: React.FormEvent) {
    e.preventDefault();
    if (commercialBlocksPublish || durationInvalid || !consented || !privacyLevel) return;
    setSaving(true);
    setBanner(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload()),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setBanner({ type: 'err', text: json.error || 'Could not schedule post' });
        return;
      }
      setTitle('');
      setVideoUrl('');
      setScheduledAt('');
      setPrivacyLevel('');
      setAllowComment(false);
      setAllowDuet(false);
      setAllowStitch(false);
      setCommercialOn(false);
      setBrandOrganic(false);
      setBrandedContent(false);
      setConsented(false);
      setVideoDurationSec(null);
      setBanner({
        type: 'ok',
        text: 'Post queued. After publishing, it may take a few minutes to appear on TikTok.',
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function publishNow() {
    if (commercialBlocksPublish || durationInvalid || !consented || !privacyLevel) return;
    setSaving(true);
    setBanner(null);
    try {
      const res = await fetch('/api/posts/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload()),
      });
      const json = (await res.json()) as {
        error?: string;
        publishId?: string;
        status?: string;
        notice?: string;
      };
      if (!res.ok) {
        setBanner({ type: 'err', text: json.error || 'Publish failed' });
        return;
      }
      setBanner({
        type: 'ok',
        text: `${json.notice || 'Sent to TikTok.'} Status: ${json.status || 'submitted'} (id: ${json.publishId || 'n/a'})`,
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function removePost(id: string) {
    setSaving(true);
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function runPublishNow() {
    setSaving(true);
    setBanner(null);
    try {
      const res = await fetch('/api/cron/publish', {
        method: 'POST',
        credentials: 'same-origin',
      });
      const json = (await res.json()) as { processed?: number; error?: string };
      if (!res.ok) {
        setBanner({ type: 'err', text: json.error || 'Publish runner failed' });
      } else {
        setBanner({
          type: 'ok',
          text: `Publish runner finished — processed ${json.processed ?? 0} due post(s). It may take a few minutes for TikTok to show them.`,
        });
      }
      await load();
    } finally {
      setSaving(false);
    }
  }

  if (loading && !me) {
    return <p className="text-white/70">Loading dashboard…</p>;
  }

  const initial = (me?.account?.displayName || creator?.creatorNickname || 'T')
    .trim()
    .charAt(0)
    .toUpperCase();

  const privacyOptions =
    creator?.privacyLevelOptions?.length
      ? creator.privacyLevelOptions
      : ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'FOLLOWER_OF_CREATOR', 'SELF_ONLY'];

  return (
    <div className="space-y-10">
      {banner ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            banner.type === 'ok'
              ? 'border-teal/40 bg-teal/10 text-white'
              : 'border-pink/40 bg-pink/10 text-white'
          }`}
        >
          {banner.text}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 shadow-lg shadow-black/20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-soft">
              Free plan
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">Your TikTok account</h2>
            <p className="mt-2 max-w-xl text-sm text-white/75">
              Connect one TikTok account, preview your video, set privacy &amp; interactions, then
              publish or queue — no paid upgrade required.
            </p>
          </div>
          {me?.connected && me.account ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#1a1433] px-3 py-2.5">
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-violet/60 ring-offset-2 ring-offset-[#1a1433]">
                {(creator?.creatorAvatarUrl || me.account.avatarUrl) && !avatarBroken ? (
                  <Image
                    src={creator?.creatorAvatarUrl || me.account.avatarUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    unoptimized
                    onError={() => setAvatarBroken(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet to-pink text-lg font-bold text-white">
                    {initial}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {creator?.creatorNickname || me.account.displayName}
                </p>
                <p className="text-xs text-white/55">
                  {creator?.creatorUsername ? `@${creator.creatorUsername}` : 'Connected'}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {creatorError && me?.connected ? (
          <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            {creatorError} For public publishing, set{' '}
            <code className="text-white">TIKTOK_SCOPES=user.info.basic,video.upload,video.publish</code>{' '}
            in Vercel (Sandbox or Production after approval), redeploy, then Disconnect &amp; Connect
            again.
          </p>
        ) : null}

        {me?.warning ? (
          <p className="mt-4 text-sm text-pink-soft">{me.warning}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {me?.connected ? (
            <>
              <button
                type="button"
                onClick={() => void disconnect()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50"
              >
                Disconnect TikTok
              </button>
              <button
                type="button"
                onClick={() => void runPublishNow()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-pink px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet/25 hover:brightness-110 disabled:opacity-50"
              >
                <PlayIcon className="h-4 w-4" />
                Run due publishes now
              </button>
            </>
          ) : (
            <a
              href="/api/tiktok/connect"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-pink px-5 py-3 text-sm font-bold text-white shadow-md shadow-violet/25"
            >
              Connect TikTok account
            </a>
          )}
          <Link href="/how-it-works" className="self-center text-sm text-violet-soft hover:underline">
            How it works →
          </Link>
        </div>
      </section>

      {me?.connected ? (
        <>
          <section className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 shadow-lg shadow-black/20">
            <h2 className="mb-2 font-display text-xl font-bold text-white">Post to TikTok</h2>
            <p className="mb-6 text-sm text-white/70">
              Posting as{' '}
              <strong className="text-white">
                {creator?.creatorNickname || me.account?.displayName || 'your account'}
              </strong>
              {creator ? (
                <>
                  {' '}
                  · max video length {creator.maxVideoPostDurationSec}s. Use a public https MP4 URL on
                  a domain you verified in TikTok URL Properties.
                </>
              ) : null}
            </p>

            <form onSubmit={(e) => void schedulePost(e)} className="space-y-5">
              <div>
                <label htmlFor="videoUrl" className="mb-1.5 block text-sm font-medium text-white">
                  Public video URL (https)
                </label>
                <input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setVideoDurationSec(null);
                  }}
                  className={fieldClass}
                  placeholder="https://your-verified-domain.com/video.mp4"
                  required
                />
              </div>

              {videoUrl.startsWith('https://') ? (
                <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/40">
                  <p className="border-b border-white/10 px-3 py-2 text-xs text-white/65">
                    Preview — play to confirm this is the video that will post (no watermark added)
                  </p>
                  <div className="relative mx-auto aspect-[9/16] max-h-[420px] max-w-[240px]">
                    <video
                      key={videoUrl}
                      src={videoUrl}
                      controls
                      playsInline
                      className="h-full w-full object-contain"
                      onLoadedMetadata={(e) => {
                        setVideoDurationSec(e.currentTarget.duration || null);
                      }}
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="line-clamp-2 text-xs text-white">
                        {title || 'Your caption will appear here'}
                      </p>
                      <p className="mt-1 text-[10px] text-white/70">
                        @{creator?.creatorUsername || 'you'}
                      </p>
                    </div>
                  </div>
                  {videoDurationSec != null ? (
                    <p
                      className={`border-t border-white/10 px-3 py-2 text-xs ${
                        durationInvalid ? 'text-pink-soft' : 'text-white/65'
                      }`}
                    >
                      Duration: {Math.round(videoDurationSec)}s
                      {creator
                        ? ` / max ${creator.maxVideoPostDurationSec}s`
                        : ''}
                      {durationInvalid ? ' — too long for this account.' : ''}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div>
                <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-white">
                  Caption / title
                </label>
                <textarea
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`${fieldClass} min-h-[96px] resize-y`}
                  placeholder="Write your own caption (fully editable)"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="privacy" className="mb-1.5 block text-sm font-medium text-white">
                    Who can view this post
                  </label>
                  <select
                    id="privacy"
                    value={privacyLevel}
                    onChange={(e) => setPrivacyLevel(e.target.value)}
                    className={fieldClass}
                    required
                  >
                    <option value="">Select privacy…</option>
                    {privacyOptions.map((opt) => {
                      const brandedBlocksPrivate =
                        commercialOn && brandedContent && opt === 'SELF_ONLY';
                      return (
                        <option key={opt} value={opt} disabled={brandedBlocksPrivate}>
                          {PRIVACY_LABELS[opt] || opt}
                          {brandedBlocksPrivate ? ' (not for branded content)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  {commercialOn && brandedContent && privacyLevel === 'SELF_ONLY' ? (
                    <p className="mt-1 text-xs text-pink-soft">
                      Branded content visibility cannot be set to private.
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="scheduledAt"
                    className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white"
                  >
                    <CalendarIcon className="h-4 w-4 text-violet-soft" />
                    Schedule for (queue)
                  </label>
                  <div className="relative">
                    <input
                      id="scheduledAt"
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className={`${fieldClass} pr-11 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                    />
                    <CalendarIcon className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-soft" />
                  </div>
                </div>
              </div>

              <fieldset className="rounded-xl border border-white/15 p-4">
                <legend className="px-1 text-sm font-semibold text-white">Interactions</legend>
                <p className="mb-3 text-xs text-white/55">Off by default — turn on what you allow.</p>
                <div className="flex flex-col gap-2">
                  <label
                    className={`flex items-center gap-2 text-sm ${
                      creator?.commentDisabled ? 'cursor-not-allowed text-white/35' : 'text-white/90'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={allowComment}
                      disabled={Boolean(creator?.commentDisabled)}
                      onChange={(e) => setAllowComment(e.target.checked)}
                      className="h-4 w-4 accent-violet"
                    />
                    Allow comment
                    {creator?.commentDisabled ? ' (disabled in TikTok settings)' : ''}
                  </label>
                  <label
                    className={`flex items-center gap-2 text-sm ${
                      creator?.duetDisabled ? 'cursor-not-allowed text-white/35' : 'text-white/90'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={allowDuet}
                      disabled={Boolean(creator?.duetDisabled)}
                      onChange={(e) => setAllowDuet(e.target.checked)}
                      className="h-4 w-4 accent-violet"
                    />
                    Allow duet
                    {creator?.duetDisabled ? ' (disabled in TikTok settings)' : ''}
                  </label>
                  <label
                    className={`flex items-center gap-2 text-sm ${
                      creator?.stitchDisabled ? 'cursor-not-allowed text-white/35' : 'text-white/90'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={allowStitch}
                      disabled={Boolean(creator?.stitchDisabled)}
                      onChange={(e) => setAllowStitch(e.target.checked)}
                      className="h-4 w-4 accent-violet"
                    />
                    Allow stitch
                    {creator?.stitchDisabled ? ' (disabled in TikTok settings)' : ''}
                  </label>
                </div>
              </fieldset>

              <fieldset className="rounded-xl border border-white/15 p-4">
                <legend className="px-1 text-sm font-semibold text-white">
                  Commercial content disclosure
                </legend>
                <label className="mt-1 flex items-center gap-2 text-sm text-white/90">
                  <input
                    type="checkbox"
                    checked={commercialOn}
                    onChange={(e) => {
                      setCommercialOn(e.target.checked);
                      if (!e.target.checked) {
                        setBrandOrganic(false);
                        setBrandedContent(false);
                      }
                    }}
                    className="h-4 w-4 accent-violet"
                  />
                  This content promotes yourself, a brand, product, or service
                </label>
                {commercialOn ? (
                  <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                    <label className="flex items-center gap-2 text-sm text-white/90">
                      <input
                        type="checkbox"
                        checked={brandOrganic}
                        onChange={(e) => setBrandOrganic(e.target.checked)}
                        className="h-4 w-4 accent-violet"
                      />
                      Your brand (promotional content)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-white/90">
                      <input
                        type="checkbox"
                        checked={brandedContent}
                        onChange={(e) => {
                          setBrandedContent(e.target.checked);
                          if (e.target.checked && privacyLevel === 'SELF_ONLY') {
                            setPrivacyLevel('');
                          }
                        }}
                        className="h-4 w-4 accent-violet"
                      />
                      Branded content (paid partnership)
                    </label>
                    {commercialLabel ? (
                      <p className="text-xs text-amber-100">{commercialLabel}</p>
                    ) : null}
                    {commercialBlocksPublish ? (
                      <p className="text-xs text-pink-soft" title="You need to indicate if your content promotes yourself, a third party, or both.">
                        You need to indicate if your content promotes yourself, a third party, or
                        both.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </fieldset>

              <label className="flex items-start gap-2 rounded-xl border border-white/15 bg-white/[0.03] p-4 text-sm text-white/90">
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-violet"
                  required
                />
                <span>{consentText}</span>
              </label>

              <p className="text-xs text-white/55">
                After you publish, it may take a few minutes for the content to process and become
                visible on your TikTok profile.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={
                    saving ||
                    !consented ||
                    !privacyLevel ||
                    !title ||
                    !videoUrl ||
                    commercialBlocksPublish ||
                    durationInvalid
                  }
                  onClick={() => void publishNow()}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-pink px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink/20 disabled:cursor-not-allowed disabled:opacity-40"
                  title={
                    commercialBlocksPublish
                      ? 'You need to indicate if your content promotes yourself, a third party, or both.'
                      : undefined
                  }
                >
                  <PlayIcon className="h-4 w-4" />
                  {saving ? 'Working…' : 'Publish to TikTok now'}
                </button>
                <button
                  type="submit"
                  disabled={
                    saving ||
                    !consented ||
                    !privacyLevel ||
                    !scheduledAt ||
                    commercialBlocksPublish ||
                    durationInvalid
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Queue for later
                </button>
              </div>
            </form>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-bold text-white">Your queue</h2>
            {posts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-8 text-center text-white/65">
                No scheduled posts yet. Queue or publish your first video above.
              </p>
            ) : (
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-white/15 bg-white/[0.05] p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white">{post.title}</p>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${statusStyles(post.status)}`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-white/65">
                        <CalendarIcon className="h-3.5 w-3.5 text-violet-soft" />
                        {new Date(post.scheduledAt).toLocaleString()}
                        {post.error ? ` · ${post.error}` : ''}
                      </p>
                      <a
                        href={post.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 inline-block max-w-full break-all text-xs text-violet-soft hover:underline"
                      >
                        {post.videoUrl}
                      </a>
                    </div>
                    {post.status === 'scheduled' ? (
                      <button
                        type="button"
                        onClick={() => void removePost(post.id)}
                        className="rounded-lg border border-pink/30 bg-pink/10 px-3 py-1.5 text-sm font-medium text-pink-soft hover:bg-pink/20"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
