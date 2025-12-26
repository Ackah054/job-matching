# JobMatch - Advanced Job Matching Platform

A production-grade job matching platform with intelligent candidate-job matching using weighted scoring algorithms. Built with Next.js, React, TypeScript, and PostgreSQL.

## 🎯 Features

### Job Seeker Features
- User authentication and profile management
- Skills and experience tracking
- Job search and recommendations with match scores
- One-click job applications
- Application tracking (submitted, viewed, shortlisted, rejected)
- Match score explanations
- CV/resume management

### Employer Features
- Company profile management
- Job posting (CRUD operations)
- Skill requirement specification
- Candidate ranking by match score
- Applicant pipeline management
- Messaging system for candidates

### Admin Features
- User management and verification
- Company verification
- Job moderation
- Platform analytics
- Admin action logging

### Matching Engine
- **Skill Matching (50%)**: Compares job requirements vs candidate skills
- **Experience Matching (20%)**: Evaluates years of experience
- **Location Matching (15%)**: Assesses location compatibility
- **Salary Matching (15%)**: Evaluates salary alignment
- Match explanations with detailed breakdowns

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: JWT tokens, bcrypt password hashing
- **Matching Engine**: Custom weighted scoring algorithm

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database (Neon recommended)
- Git

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd job-matching-platform

# Install dependencies
npm install
```

### Step 2: Database Setup

```bash
# Create a Neon PostgreSQL database at https://neon.tech

# Run the SQL scripts to create tables and seed data
# You can do this through the Neon console or with psql:

psql -d your_database_url < scripts/01-init-database.sql
psql -d your_database_url < scripts/02-seed-data.sql
```

### Step 3: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# JWT Secret (change this to a random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Node Environment
NODE_ENV=development

# URL for email redirects (development)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### Step 4: Run the Application

```bash
# Development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 🔐 Authentication & RBAC

The platform supports three user roles with role-based access control:

1. **Job Seeker** (`job_seeker`)
   - Access: `/dashboard`, `/jobs`, `/applications`, `/profile`

2. **Employer** (`employer`)
   - Access: `/dashboard`, `/employer/jobs`, `/employer/candidates`

3. **Admin** (`admin`)
   - Access: `/admin` (all admin panels)

## 📊 Matching Algorithm

The matching engine calculates a match score (0-100%) based on:

```
Total Score = 
  (Skills Match × 50%) + 
  (Experience Match × 20%) + 
  (Location Match × 15%) + 
  (Salary Match × 15%)
```

### Example Match Score Breakdown
- Skills: 90% (8/9 required skills matched)
- Experience: 100% (5 years vs 4 required)
- Location: 100% (same city)
- Salary: 85% (salary range overlaps well)

**Final Score: 92%** ✅

## 🔑 Demo Credentials

Use these credentials to test the platform:

### Job Seeker
- Email: `john@example.com`
- Password: `password`

### Employer
- Email: `recruiter@techcorp.com`
- Password: `password`

### Admin
- Email: `admin@platform.com`
- Password: `password`

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── matching/      # Matching engine endpoints
│   │   ├── applications/  # Application endpoints
│   │   └── jobs/          # Job endpoints
│   ├── dashboard/         # Main dashboard
│   ├── jobs/              # Job listings
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── page.tsx           # Landing page
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database connection
│   └── matching-engine.ts # Matching algorithm
├── middleware.ts          # RBAC middleware
├── scripts/
│   ├── 01-init-database.sql   # Database schema
│   └── 02-seed-data.sql       # Sample data
└── README.md
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Jobs
- `GET /api/jobs` - Get job listings
- `GET /api/jobs?status=open` - Filter by status
- `GET /api/jobs?limit=20&offset=0` - Pagination

### Matching Engine
- `POST /api/matching/calculate` - Calculate match score for job-candidate pair
- `GET /api/matching/recommendations?seekerId=xxx` - Get job recommendations for seeker
- `GET /api/matching/candidates?jobId=xxx` - Get top candidates for job

### Applications
- `POST /api/applications/apply` - Submit job application

## 🔒 Security Best Practices

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ RBAC middleware protection
- ✅ HTTP-only cookies for token storage
- ✅ Parameterized queries to prevent SQL injection
- ✅ Input validation on all endpoints

## 📈 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# DATABASE_URL, JWT_SECRET
```

### Deploy to Other Platforms

1. Build the project: `npm run build`
2. Set environment variables on your hosting platform
3. Run: `npm start`

## 🧪 Testing Demo Scenarios

### Scenario 1: Job Seeker Finding Jobs
1. Register as a job seeker
2. Add skills (React, Node.js, TypeScript)
3. Browse jobs page
4. View match scores for each position
5. Apply to jobs with high match scores

### Scenario 2: Employer Posting Job
1. Register as an employer
2. Post a job with required skills
3. View candidates matched to your job
4. See ranking by match score

### Scenario 3: Admin Management
1. Login as admin
2. View all users and companies
3. Approve/reject company profiles
4. View platform analytics

## 📝 Code Examples

### Calculate Match Score
```typescript
import { calculateMatchScore } from '@/lib/matching-engine';

const { score, breakdown, explanation } = await calculateMatchScore(
  jobId,
  seekerId
);
// Score: 85, breakdown: { skills: 90, experience: 100, location: 100, salary: 60 }
```

### Get Job Recommendations
```typescript
import { getRecommendedJobsForSeeker } from '@/lib/matching-engine';

const jobs = await getRecommendedJobsForSeeker(seekerId, 20);
// Returns top 20 recommended jobs sorted by match score
```

## 🐛 Troubleshooting

### Database Connection Issues
- Check DATABASE_URL in `.env.local`
- Ensure Neon database is accessible
- Run: `psql <DATABASE_URL> -c "SELECT 1"`

### Authentication Issues
- Clear cookies in browser dev tools
- Check JWT_SECRET in environment variables
- Verify token in requests

### Matching Engine Issues
- Ensure all tables are created (run SQL scripts)
- Check skill names match between jobs and candidates
- Verify seeker and job IDs exist in database

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon Database Docs](https://neon.tech/docs)

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for job seekers and employers worldwide**
