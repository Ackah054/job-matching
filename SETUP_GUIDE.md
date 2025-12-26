# JobMatch - Complete Setup Guide

## Architecture Overview

JobMatch is a full-stack job matching platform built with:
- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Backend**: Next.js API Routes with Node.js
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Matching Engine**: Custom weighted scoring algorithm

## Database Schema

### Core Tables

**Users** - Authentication & role management
```sql
- id (UUID)
- email (unique)
- password_hash (bcrypt)
- role (job_seeker | employer | admin)
- full_name
```

**Job Seeker Profiles**
```sql
- id (UUID)
- user_id (FK to users)
- bio, location, desired_job_title
- years_of_experience, current_salary
- desired_salary_min, desired_salary_max
```

**Seeker Skills**
```sql
- skill_name
- proficiency_level (beginner | intermediate | advanced | expert)
- years_of_experience
```

**Companies** - Employer profiles
```sql
- id (UUID)
- user_id (FK to users)
- company_name, description, website
- industry, company_size, location
- is_verified (for admin approval)
```

**Jobs** - Job postings
```sql
- id (UUID)
- company_id (FK to companies)
- job_title, description, location
- job_type (full_time | part_time | contract | internship)
- salary_min, salary_max
- years_of_experience_required
- status (open | closed | archived)
```

**Job Skills** - Required skills per job
```sql
- job_id (FK to jobs)
- skill_name
- is_required (boolean)
- proficiency_level
```

**Job Applications** - Application tracking
```sql
- id (UUID)
- job_id (FK to jobs)
- seeker_id (FK to job_seeker_profiles)
- status (applied | viewed | shortlisted | rejected | withdrawn)
- match_score (0-100)
- match_explanation (text)
```

## Matching Algorithm

The matching engine calculates match scores on four weighted dimensions:

### 1. Skills Matching (50%)
- Compares required job skills with candidate skills
- Counts matched required vs total required
- Counts matched optional skills
- Formula: `(matched_required / total_required) * 100 + (matched_optional / total_optional) * 50`

### 2. Experience Matching (20%)
- Compares candidate's years of experience with job requirement
- 100%: candidate has >= required years
- 80%: candidate has >= 80% of required years
- Proportional below that

### 3. Location Matching (15%)
- 100%: same location or remote job
- 60%: different locations but both specified
- 50%: no location data

### 4. Salary Matching (15%)
- 100%: salary ranges overlap well
- 75%: candidate's minimum is close to job's range
- 50%: significant gap

**Final Score** = `(Skills × 0.5) + (Experience × 0.2) + (Location × 0.15) + (Salary × 0.15)`

## API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
POST   /api/auth/logout       - Logout user
```

### Matching Engine
```
POST   /api/matching/calculate         - Calculate match score
GET    /api/matching/recommendations   - Get job recommendations
GET    /api/matching/candidates        - Get top candidates for job
```

### Jobs
```
GET    /api/jobs              - List all jobs (with pagination)
POST   /api/jobs/create       - Create new job (employer only)
```

### Applications
```
POST   /api/applications/apply - Apply for a job
GET    /api/applications      - Get user's applications
```

### User
```
GET    /api/user/profile      - Get user profile
```

## Role-Based Access Control (RBAC)

Routes are protected by the `proxy.ts` middleware:

### Job Seeker Routes
- `/dashboard` - Main dashboard
- `/jobs` - Job listings
- `/applications` - Track applications
- `/profile` - Edit profile

### Employer Routes
- `/dashboard` - Main dashboard
- `/employer/jobs` - Manage postings
- `/employer/jobs/create` - Post new job
- `/employer/candidates` - View candidates

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/companies` - Company verification
- `/admin/analytics` - Platform analytics

## Security Features

✅ **Password Hashing**: bcrypt with salt rounds
✅ **JWT Authentication**: Signed tokens with 7-day expiry
✅ **HTTP-Only Cookies**: Token stored securely
✅ **RBAC**: Middleware checks user roles
✅ **Parameterized Queries**: Prevent SQL injection
✅ **Input Validation**: Form validation on frontend & backend
✅ **CORS**: Configured for same-origin requests

## Development Workflow

### Starting Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Database Migrations
To add new fields to tables:
1. Create new SQL migration file in `scripts/`
2. Run migration using psql or Neon console
3. Update TypeScript types accordingly

### Adding New Features

**Example: Add Email Notifications**

1. Create API route: `app/api/notifications/send/route.ts`
2. Add email template
3. Call from relevant endpoints (new application, message, etc.)
4. Store notification records in database

## Testing

### Manual Testing Scenarios

**Test 1: Job Seeker Journey**
1. Register as job seeker at `/register`
2. Add skills in profile
3. Browse jobs
4. View match score for each job
5. Apply to jobs
6. Track applications

**Test 2: Employer Journey**
1. Register as employer
2. Create job posting with required skills
3. View candidates ranked by match score
4. Export candidate data

**Test 3: Admin Functions**
1. Login as admin
2. View all users, filter by role
3. Verify company profiles
4. Check platform analytics

## Performance Optimization

### Database Indexes
- Email (fast user lookup)
- Role (filtering by user type)
- Job status (open jobs queries)
- Application status (tracking)

### Query Optimization
- Use batch inserts for bulk operations
- Limit pagination to 20-50 items
- Cache matching scores for recent applications

### Frontend
- Code splitting with dynamic imports
- Image optimization with next/image
- CSS minification with Tailwind
- Lazy loading for lists

## Monitoring & Debugging

### Check Database
```bash
# Connect to Neon
psql "your_connection_string"

# View user count
SELECT COUNT(*) FROM users;

# Check recent applications
SELECT * FROM job_applications ORDER BY applied_at DESC LIMIT 10;
```

### View Logs
```bash
# Development logs show in terminal
npm run dev

# Production logs in Vercel dashboard
```

### Debug Matching Algorithm
Add to `lib/matching-engine.ts`:
```typescript
console.log(`[MATCHING] Job: ${jobId}, Seeker: ${seekerId}`);
console.log(`[MATCHING] Skills: ${skillMatch.score}%`);
console.log(`[MATCHING] Total Score: ${totalScore}%`);
```

## Customization

### Change Matching Weights
Edit `DEFAULT_WEIGHTS` in `lib/matching-engine.ts`:
```typescript
const DEFAULT_WEIGHTS = {
  skills: 0.6,        // Increase skill importance
  experience: 0.15,   // Decrease experience importance
  location: 0.15,
  salary: 0.1,
}
```

### Update Demo Credentials
Edit `scripts/02-seed-data.sql` and re-run migrations

### Customize Salary Ranges
Modify salary range validation in job creation forms

### Add New Skills
Add skill suggestions in seeker profile component

## Production Deployment

### Pre-Deployment Checklist
- [ ] Update JWT_SECRET to random 32+ character string
- [ ] Set NODE_ENV=production
- [ ] Test all authentication flows
- [ ] Verify database backups enabled
- [ ] Set up email notifications
- [ ] Configure domain & SSL
- [ ] Enable analytics

### Vercel Deployment
```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard
# Automatic deployments on git push
```

### Environment Variables (Production)
```env
DATABASE_URL=your_production_db
JWT_SECRET=generate_random_secret_here
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Neon Docs**: https://neon.tech/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Last Updated**: December 2025
**Version**: 1.0.0
