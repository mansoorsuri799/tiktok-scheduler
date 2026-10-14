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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/tiktok/me', { cache: 'no-store' });
      const meJson = (await meRes.json()) as MeResponse;
      setMe(meJson);

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
    try {
      const res = await fetch('/api/cron/publish', { method: 'POST' });
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

  return (
    <div className="space-y-10">
      {banner ? (
        <div
          className={`border px-4 py-3 text-sm ${
            banner.type === 'ok'
              ? 'border-teal/40 bg-teal/10 text-white'
              : 'border-pink/40 bg-pink/10 text-white'
          }`}
        >
          {banner.text}
        </div>
      ) : null}

      <section className="border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Free plan</h2>
            <p className="mt-2 max-w-xl text-sm text-white/75">
              Connect one TikTok account, queue posts with public video URLs, and auto-publish at your
              chosen times — no paid upgrade required.
            </p>
          </div>
          {me?.connected && me.account ? (
            <div className="flex items-center gap-3">
              {me.account.avatarUrl ? (
                <Image
                  src={me.account.avatarUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-full"
                  unoptimized
                />
              ) : null}
              <div>
                <p className="font-semibold text-white">{me.account.displayName}</p>
                <p className="text-xs text-white/55">Connected</p>
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

        <div className="mt-6 flex flex-wrap gap-3">
          {me?.connected ? (
            <>
              <button
                type="button"
                onClick={() => void disconnect()}
                disabled={saving}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
              >
                Disconnect TikTok
              </button>
              <button
                type="button"
                onClick={() => void runPublishNow()}
                disabled={saving}
                className="rounded-xl border border-violet/40 px-4 py-2 text-sm font-semibold text-violet-soft hover:bg-violet/10 disabled:opacity-50"
              >
                Run due publishes now
              </button>
            </>
          ) : (
            <a
              href="/api/tiktok/connect"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-violet to-pink px-5 py-3 text-sm font-bold text-white"
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
          <section className="border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-white">Schedule a TikTok</h2>
            <p className="mb-6 text-sm text-white/70">
              Paste a publicly reachable https video URL (MP4). At the scheduled time we call TikTok’s
              Content Posting API to publish for your connected account.
            </p>
            <form onSubmit={(e) => void schedulePost(e)} className="space-y-4">
              <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium text-white/85">
                  Caption
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-white/15 bg-brand-soft px-4 py-2 text-white"
                  placeholder="Your TikTok caption / title"
                  required
                />
              </div>
              <div>
                <label htmlFor="videoUrl" className="mb-1 block text-sm font-medium text-white/85">
                  Public video URL (https)
                </label>
                <input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full rounded-md border border-white/15 bg-brand-soft px-4 py-2 text-white"
                  placeholder="https://cdn.example.com/video.mp4"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="scheduledAt" className="mb-1 block text-sm font-medium text-white/85">
                    Publish at
                  </label>
                  <input
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full rounded-md border border-white/15 bg-brand-soft px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="privacy" className="mb-1 block text-sm font-medium text-white/85">
                    Privacy
                  </label>
                  <select
                    id="privacy"
                    value={privacyLevel}
                    onChange={(e) => setPrivacyLevel(e.target.value)}
                    className="w-full rounded-md border border-white/15 bg-brand-soft px-4 py-2 text-white"
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
                className="rounded-xl bg-gradient-to-r from-violet to-pink px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Queue on free plan'}
              </button>
            </form>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-bold text-white">Your queue</h2>
            {posts.length === 0 ? (
              <p className="text-white/65">No scheduled posts yet.</p>
            ) : (
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="flex flex-wrap items-start justify-between gap-3 border border-white/10 bg-white/5 p-4"
                  >
                    <div>
                      <p className="font-semibold text-white">{post.title}</p>
                      <p className="mt-1 text-xs text-white/55">
                        {new Date(post.scheduledAt).toLocaleString()} · {post.status}
                        {post.error ? ` · ${post.error}` : ''}
                      </p>
                      <a
                        href={post.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block break-all text-xs text-violet-soft hover:underline"
                      >
                        {post.videoUrl}
                      </a>
                    </div>
                    {post.status === 'scheduled' ? (
                      <button
                        type="button"
                        onClick={() => void removePost(post.id)}
                        className="text-sm text-pink-soft hover:underline"
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
