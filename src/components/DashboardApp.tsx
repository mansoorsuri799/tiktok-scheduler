'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

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

type MeResponse = {
  configured: boolean;
  connected: boolean;
  plan: { name: string; maxAccounts: number; maxScheduledPosts: number };
  account?: Account | null;
  warning?: string;
};

const fieldClass =
  'w-full rounded-xl border border-white/25 bg-[#1a1433] px-4 py-3 text-white placeholder:text-white/40 shadow-inner shadow-black/20 focus:border-violet focus:outline-none focus:ring-2 focus:ring-violet/40 [color-scheme:dark]';

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

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5.93"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.07 0L5.5 12.41a5 5 0 0 0 7.07 7.07L14 18.07"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CaptionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M4 12h10M4 18h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DashboardApp() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState('PUBLIC_TO_EVERYONE');
  const [avatarBroken, setAvatarBroken] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/tiktok/me', { cache: 'no-store' });
      const meJson = (await meRes.json()) as MeResponse;
      setMe(meJson);
      setAvatarBroken(false);

      if (meJson.connected) {
        const postsRes = await fetch('/api/posts', { cache: 'no-store' });
        if (postsRes.ok) {
          const postsJson = (await postsRes.json()) as { posts: Post[] };
          setPosts(postsJson.posts || []);
        }
      } else {
        setPosts([]);
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

  async function schedulePost(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setBanner(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, videoUrl, scheduledAt, privacyLevel }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setBanner({ type: 'err', text: json.error || 'Could not schedule post' });
        return;
      }
      setTitle('');
      setVideoUrl('');
      setScheduledAt('');
      setBanner({ type: 'ok', text: 'Post queued. It will auto-publish at the scheduled time.' });
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
          text: `Publish runner finished — processed ${json.processed ?? 0} due post(s).`,
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

  const initial = (me?.account?.displayName || 'T').trim().charAt(0).toUpperCase();
  const canPublish =
    Boolean(me?.account?.scope) &&
    (me!.account!.scope.includes('video.publish') || me!.account!.scope.includes('video.upload'));

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
              Connect one TikTok account, queue posts with public video URLs, and auto-publish at your
              chosen times — no paid upgrade required.
            </p>
          </div>
          {me?.connected && me.account ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#1a1433] px-3 py-2.5">
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-violet/60 ring-offset-2 ring-offset-[#1a1433]">
                {me.account.avatarUrl && !avatarBroken ? (
                  <Image
                    src={me.account.avatarUrl}
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
                <p className="font-semibold text-white">{me.account.displayName}</p>
                <p className="flex items-center gap-1.5 text-xs text-teal">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal" />
                  Connected
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {!me?.configured ? (
          <p className="mt-6 text-sm text-pink-soft">
            Server is missing TikTok API credentials. Add{' '}
            <code className="text-violet-soft">TIKTOK_CLIENT_KEY</code> and{' '}
            <code className="text-violet-soft">TIKTOK_CLIENT_SECRET</code> from{' '}
            <a
              href="https://developers.tiktok.com/"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              TikTok for Developers
            </a>
            , set redirect URI to{' '}
            <code className="text-violet-soft">/api/tiktok/callback</code>, then restart the server.
          </p>
        ) : null}

        {me?.warning ? (
          <p className="mt-4 text-sm text-pink-soft">{me.warning}</p>
        ) : null}

        {me?.connected && !canPublish ? (
          <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Your connection only has login scopes right now. Auto-publish needs{' '}
            <code className="text-white">video.upload</code> /{' '}
            <code className="text-white">video.publish</code> after Content Posting API approval —
            then reconnect with those scopes enabled.
          </p>
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
            <h2 className="mb-2 font-display text-xl font-bold text-white">Schedule a TikTok</h2>
            <p className="mb-6 text-sm text-white/70">
              Paste a publicly reachable https video URL (MP4). At the scheduled time we call TikTok’s
              Content Posting API to publish for your connected account.
            </p>
            <form onSubmit={(e) => void schedulePost(e)} className="space-y-5">
              <div>
                <label htmlFor="title" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
                  <CaptionIcon className="h-4 w-4 text-violet-soft" />
                  Caption
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={fieldClass}
                  placeholder="Your TikTok caption / title"
                  required
                />
              </div>
              <div>
                <label htmlFor="videoUrl" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
                  <LinkIcon className="h-4 w-4 text-violet-soft" />
                  Public video URL (https)
                </label>
                <input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className={fieldClass}
                  placeholder="https://cdn.example.com/video.mp4"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="scheduledAt"
                    className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white"
                  >
                    <CalendarIcon className="h-4 w-4 text-violet-soft" />
                    Publish at
                  </label>
                  <div className="relative">
                    <input
                      id="scheduledAt"
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className={`${fieldClass} pr-11 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                      required
                    />
                    <CalendarIcon className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-soft" />
                  </div>
                </div>
                <div>
                  <label htmlFor="privacy" className="mb-1.5 block text-sm font-medium text-white">
                    Privacy
                  </label>
                  <select
                    id="privacy"
                    value={privacyLevel}
                    onChange={(e) => setPrivacyLevel(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="PUBLIC_TO_EVERYONE">Public</option>
                    <option value="MUTUAL_FOLLOW_FRIENDS">Friends</option>
                    <option value="FOLLOWER_OF_CREATOR">Followers</option>
                    <option value="SELF_ONLY">Only me</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-pink px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink/20 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Queue on free plan'}
              </button>
            </form>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-bold text-white">Your queue</h2>
            {posts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-8 text-center text-white/65">
                No scheduled posts yet. Queue your first video above.
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
                        className="mt-1.5 inline-flex max-w-full items-center gap-1.5 break-all text-xs text-violet-soft hover:underline"
                      >
                        <LinkIcon className="h-3.5 w-3.5 shrink-0" />
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
