# JobMatch Platform - Installation Guide

## Quick Start (5 minutes)

### Step 1: Prerequisites
Ensure you have:
- Node.js 18+ and npm/yarn installed
- PostgreSQL database (we recommend [Neon](https://neon.tech) for free serverless)
- Git

### Step 2: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd job-matching-platform

# Install dependencies
npm install
```

### Step 3: Set Up Database

1. **Create a Neon PostgreSQL database** at https://neon.tech (free tier available)
2. **Copy your connection string** from the Neon dashboard
3. **Run the database initialization scripts**:

```bash
# Using psql directly
psql -d "your_neon_connection_string" < scripts/01-init-database.sql
psql -d "your_neon_connection_string" < scripts/02-seed-data.sql

# Or paste the SQL scripts into the Neon SQL editor
```

### Step 4: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (from Neon dashboard)
DATABASE_URL=postgresql://user:password@host/database

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Node Environment
NODE_ENV=development

# Development URL
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Demo Credentials

Use these to test the platform:

| Role | Email | Password |
|------|-------|----------|
| Job Seeker | john@example.com | password |
| Employer | recruiter@techcorp.com | password |
| Admin | admin@platform.com | password |

## Project Structure

```
job-matching-platform/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── matching/       # Matching algorithm endpoints
│   │   ├── applications/   # Application management
│   │   ├── jobs/           # Job management
│   │   └── user/           # User profile endpoints
│   ├── admin/              # Admin dashboard pages
│   ├── employer/           # Employer pages
│   ├── jobs/               # Job listing pages
│   ├── applications/       # Application tracking
│   ├── profile/            # User profile pages
│   ├── login/              # Authentication pages
│   ├── register/           # Registration pages
│   ├── dashboard/          # Main dashboard
│   └── page.tsx            # Landing page
├── lib/
│   ├── db.ts              # Database connection
│   ├── auth.ts            # Authentication utilities
│   └── matching-engine.ts # Matching algorithm
├── proxy.ts               # RBAC middleware
├── scripts/
│   ├── 01-init-database.sql
│   └── 02-seed-data.sql
├── .env.local             # Environment variables (create this)
└── README.md              # Project documentation
```

## Troubleshooting

### Database Connection Issues

**Error: "Cannot connect to database"**

```bash
# Test your connection string
psql "your_connection_string" -c "SELECT 1"

# Check DATABASE_URL format
# Should be: postgresql://user:password@host/dbname
```

### Authentication Issues

**Error: "Invalid token"**

- Clear browser cookies
- Check JWT_SECRET is set in `.env.local`
- Ensure token is being sent with requests

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## What's Included

✅ Complete authentication system with JWT and bcrypt
✅ Advanced matching algorithm (50% skills, 20% experience, 15% location, 15% salary)
✅ Role-based access control (Job Seeker, Employer, Admin)
✅ Job seeker profile with skills and experience tracking
✅ Employer job posting and candidate management
✅ Admin dashboard with analytics
✅ Responsive UI with Tailwind CSS
✅ Sample data for testing
✅ Production-ready database schema

## Next Steps

1. Customize the matching algorithm weights in `lib/matching-engine.ts`
2. Add email notifications with SendGrid or Resend
3. Implement file uploads for CV/resume
4. Add real-time messaging with WebSockets
5. Deploy to Vercel for free

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - DATABASE_URL
# - JWT_SECRET
```

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the API endpoint comments in `app/api/`
3. Check database schema in `scripts/01-init-database.sql`

---

**Happy matching! 🚀**
