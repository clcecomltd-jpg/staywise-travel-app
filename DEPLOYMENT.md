# ADHD Planner - Deployment Guide

This guide covers deploying the ADHD Planner MVP to various platforms.

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest and recommended way to deploy this Next.js app.

### Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase project set up

### Steps

1. **Push your code to GitHub** (already done!)

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**

   Add these in Vercel dashboard (Settings > Environment Variables):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes for build
   - Your app is live! 🎉

5. **Update Supabase Auth Settings**
   - Go to Supabase Dashboard > Authentication > URL Configuration
   - Add your Vercel URL to "Site URL"
   - Add `https://your-app.vercel.app/auth/callback` to "Redirect URLs"

### Continuous Deployment

Vercel automatically redeploys when you push to your GitHub branch!

## Alternative: Netlify

### Steps

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build your app**

   ```bash
   npm run build
   ```

3. **Deploy**

   ```bash
   netlify deploy --prod
   ```

4. **Configure Environment Variables**
   - Go to Netlify dashboard
   - Site settings > Environment variables
   - Add the same variables as Vercel

## Alternative: Self-Hosted (Node.js)

### Requirements

- Node.js 18+ installed on server
- PM2 or similar process manager
- Nginx for reverse proxy (recommended)

### Steps

1. **Clone and build on server**

   ```bash
   git clone <your-repo>
   cd adhd-planner-mvp
   npm install
   npm run build
   ```

2. **Create .env.local**

   ```bash
   cp .env.example .env.local
   # Edit with your values
   nano .env.local
   ```

3. **Start with PM2**

   ```bash
   npm install -g pm2
   pm2 start npm --name "adhd-planner" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx** (optional but recommended)

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Alternative: Docker

### Dockerfile

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    restart: unless-stopped
```

### Deploy

```bash
docker-compose up -d
```

## Post-Deployment Checklist

### 1. Verify Environment Variables

- [ ] NEXT_PUBLIC_SUPABASE_URL is set correctly
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY is set correctly
- [ ] NEXT_PUBLIC_APP_URL matches your deployed URL

### 2. Test Core Features

- [ ] User can sign up
- [ ] User can sign in
- [ ] Magic link works
- [ ] Tasks can be created via Quick Add
- [ ] Tasks can be moved between columns
- [ ] Focus timer works
- [ ] PWA installs correctly

### 3. Supabase Configuration

- [ ] Site URL is set to your deployed URL
- [ ] Redirect URLs include your auth callback
- [ ] Email templates are customized (optional)
- [ ] Rate limiting is configured (optional)

### 4. Performance Checks

- [ ] Run Lighthouse audit (target: 85+ performance)
- [ ] Check First Contentful Paint < 2s
- [ ] Check Time to Interactive < 4s
- [ ] Verify PWA installability

### 5. Security

- [ ] HTTPS is enabled
- [ ] Environment variables are not exposed in client
- [ ] RLS policies are active in Supabase
- [ ] CORS is configured if needed

## Monitoring & Analytics

### Vercel Analytics (Recommended)

Enable Vercel Analytics for free:

1. Go to your project in Vercel
2. Click "Analytics" tab
3. Enable Web Analytics
4. No code changes needed!

### Custom Error Tracking (Optional)

Consider adding Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

## Domain Setup

### Custom Domain on Vercel

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for DNS propagation (~24 hours max)

### SSL Certificate

Vercel automatically provisions SSL certificates for all domains!

## Performance Optimization

### Enable Caching

Already configured! But you can verify:

- Static assets are cached for 1 year
- API responses use appropriate cache headers
- PWA service worker caches assets

### Image Optimization

Next.js automatically optimizes images. To use:

```tsx
import Image from 'next/image'

;<Image src="/your-image.jpg" width={800} height={600} alt="Description" />
```

### Database Connection Pooling

For high traffic, enable Supabase connection pooling:

1. Go to Database settings in Supabase
2. Enable "Connection pooling"
3. Use the pooler connection string

## Scaling Considerations

### Database

- Start with Supabase free tier (50,000 rows)
- Upgrade to Pro ($25/mo) for 500,000 rows
- Monitor query performance with Supabase dashboard

### Hosting

- Vercel free tier handles ~100GB bandwidth/month
- Pro plan ($20/mo) for unlimited bandwidth
- Consider CDN for static assets at scale

### Costs Estimate

**Small (< 1000 users)**

- Vercel: Free
- Supabase: Free
- Total: $0/month

**Medium (1000-10,000 users)**

- Vercel: $20/month (Pro)
- Supabase: $25/month (Pro)
- Total: ~$45/month

**Large (10,000+ users)**

- Vercel: $20-100/month
- Supabase: $25-99/month
- Total: ~$45-200/month

## Troubleshooting

### Build fails on Vercel

**Issue**: Environment variables not set
**Fix**: Add all required env vars in Vercel dashboard

**Issue**: TypeScript errors
**Fix**: Run `npm run type-check` locally first

### Users can't sign in

**Issue**: Supabase redirect URLs not configured
**Fix**: Add your production URL to Supabase auth settings

### PWA doesn't install

**Issue**: HTTPS not enabled
**Fix**: Ensure site is served over HTTPS (Vercel does this automatically)

### Database connection errors

**Issue**: Wrong Supabase credentials
**Fix**: Verify NEXT_PUBLIC_SUPABASE_URL and KEY in env vars

## Backup & Recovery

### Database Backups

Supabase Pro includes daily backups. To manually backup:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Backup
supabase db dump > backup.sql
```

### Restore

```bash
psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup.sql
```

## Maintenance

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update safely
npm update

# Or update all (test thoroughly!)
npx npm-check-updates -u
npm install
```

### Monitor Issues

Set up alerts:

1. Vercel deployment notifications
2. Supabase dashboard alerts
3. Uptime monitoring (UptimeRobot, Pingdom)

## Next Steps

After deployment:

1. ✅ Share with test users
2. ✅ Gather feedback
3. ✅ Monitor analytics
4. ✅ Iterate on features
5. ✅ Build community!

---

**Need help?** Open an issue on GitHub or consult the main README.md
