# TikTok Scheduler

Brand site for [tiktokscheduler.net](https://tiktokscheduler.net) — plan, schedule, and auto-publish TikTok videos with a creator-ready content calendar.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Static SEO routes (`sitemap-index.xml`, `index.xml`, `image-sitemap.xml`, `robots.txt`)

## Develop

```bash
npm install
cp .env.example .env.local
# Fill TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, SESSION_SECRET
npm run dev
```

## TikTok connect (free plan)

1. Create an app at [TikTok for Developers](https://developers.tiktok.com/)
2. Enable **Login Kit (Web)** + **Content Posting API** (Direct Post)
3. Request scopes: `user.info.basic`, `video.upload`, `video.publish`
4. Register redirect URI: `https://tiktokscheduler.net/api/tiktok/callback` (and localhost for local)
5. Set env vars from `.env.example`
6. Open `/dashboard` → **Connect TikTok account**
7. Cron every minute: `GET /api/cron/publish` with `Authorization: Bearer $CRON_SECRET`

Tokens and the post queue are stored under `./data/` (gitignored).

## Build

```bash
npm run build
npm start
```
