# Quick Start Guide - ADHD Planner

Get up and running in 5 minutes! ⚡

## Step 1: Prerequisites (2 minutes)

You need:

- ✅ Node.js 18+ ([download](https://nodejs.org))
- ✅ A Supabase account (free tier works perfectly)

## Step 2: Create Supabase Project (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Enter:
   - Name: "ADHD Planner"
   - Database Password: (save this!)
   - Region: (pick closest to you)
4. Wait ~2 minutes for setup

## Step 3: Set Up Database (1 minute)

1. In Supabase, go to SQL Editor
2. Copy all content from `supabase/schema.sql` in this repo
3. Paste and click "Run"
4. ✅ Done! Your database is ready

## Step 4: Get API Keys (30 seconds)

1. In Supabase, go to Settings > API
2. Copy these values:
   - Project URL
   - `anon` `public` key

## Step 5: Run the App (1 minute)

```bash
# Clone and install
git clone <your-repo-url>
cd adhd-planner-mvp
npm install

# Configure environment
cp .env.example .env.local
nano .env.local  # Or use your editor

# Paste your Supabase URL and Key, then save

# Run!
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Step 6: Try It Out!

1. **Sign up** with your email
2. Press **`q`** to Quick Add a task
3. Try: `"Buy groceries tomorrow 3pm #shopping !high"`
4. Move task to **Now** column
5. Go to **Focus** (press `f`)
6. Start a 25-minute focus session!

## What's Next?

### Add Demo Data (Optional)

```bash
npm run seed
```

This creates sample tasks and routines to explore features.

### Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for one-click deploy to Vercel.

### Customize

- **Colors**: Edit `app/globals.css` CSS variables
- **Features**: Check `CONTRIBUTING.md` for development guide
- **Help**: Open an issue on GitHub

## Keyboard Shortcuts

Master these for maximum productivity:

- `q` - Quick Add (works anywhere!)
- `t` - Go to Today view
- `f` - Go to Focus timer
- `r` - Go to Routines
- `p` - Go to Progress stats
- `Esc` - Close dialogs

## Common Issues

### "Failed to fetch"

**Problem**: Wrong Supabase credentials
**Fix**: Double-check `.env.local` has correct URL and key

### "Can't sign in"

**Problem**: Redirect URL not configured
**Fix**: In Supabase Auth settings, add:

- Site URL: `http://localhost:3000`
- Redirect: `http://localhost:3000/auth/callback`

### Build fails

**Problem**: Missing dependencies
**Fix**:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Tips for ADHD Users

🎯 **Start Small**: Add just 1-3 tasks for today

⏱️ **Use the Timer**: 25 minutes is perfect for one focused task

✅ **Celebrate Wins**: Watch for confetti when you complete tasks!

🔁 **Build Routines**: Set up a morning routine to start your day right

📊 **Check Progress**: See your focused minutes grow each day

🔕 **Go Offline**: The app works without internet - focus without distractions!

## Need Help?

- 📖 Full documentation: [README.md](./README.md)
- 🚀 Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🤝 Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**You're all set!** Start planning, focusing, and tracking your progress. 🚀

_Remember: The best productivity system is the one you actually use. Start simple!_
