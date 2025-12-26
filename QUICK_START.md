# Quick Start - Get Running in 5 Minutes

## One-Command Setup

If you just want to test the platform quickly:

### Step 1: Set Environment
```bash
export DATABASE_URL="postgresql://your_user:your_pass@your_host/your_db"
export JWT_SECRET="your-random-secret-key"
export NODE_ENV="development"
export NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL="http://localhost:3000"
```

### Step 2: Run Scripts
```bash
# Initialize database (run once)
psql "$DATABASE_URL" < scripts/01-init-database.sql
psql "$DATABASE_URL" < scripts/02-seed-data.sql

# Start development server
npm run dev
```

### Step 3: Open Browser
- Visit http://localhost:3000
- Login with demo credentials below

## Demo Credentials

```
Job Seeker:  john@example.com / password
Employer:    recruiter@techcorp.com / password
Admin:       admin@platform.com / password
```

## Features You Can Test

### As Job Seeker
1. View dashboard
2. Browse jobs and see match scores
3. View application history
4. Edit your profile and skills

### As Employer
1. Post a new job
2. View candidates ranked by match score
3. See detailed match explanations
4. Manage job postings

### As Admin
1. View all users with filters
2. Verify company profiles
3. Check platform analytics
4. Monitor system health

## Troubleshooting

**"Cannot connect to database"**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running (Neon is always available)
- Confirm database has been initialized with SQL scripts

**"Port 3000 already in use"**
```bash
# Use different port
PORT=3001 npm run dev
```

**"Invalid token" or "Unauthorized"**
- Clear browser cookies: DevTools > Application > Cookies > Delete all
- Make sure JWT_SECRET matches deployment

## Next: Production Deployment

Once satisfied with local testing:

1. Create Vercel account (free) at vercel.com
2. Connect your GitHub repo
3. Add environment variables in Vercel dashboard
4. Push to GitHub to auto-deploy

**That's it!** Your platform is live.

---

Need help? Check `INSTALLATION.md` or `SETUP_GUIDE.md`
