// Create job endpoint for employers
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { jobTitle, description, location, jobType, salaryMin, salaryMax, yearsRequired, skills } =
      await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get employer's company
    const companyResult = await query("SELECT id FROM companies WHERE user_id = $1", [userId])

    if ((companyResult as any[]).length === 0) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 })
    }

    const company = (companyResult as any[])[0]

    // Create job
    const jobResult = await query(
      `INSERT INTO jobs (company_id, job_title, description, location, job_type, salary_min, salary_max, years_of_experience_required)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [company.id, jobTitle, description, location, jobType, salaryMin, salaryMax, yearsRequired],
    )

    const job = (jobResult as any[])[0]

    // Add skills
    if (skills && Array.isArray(skills)) {
      for (const skill of skills) {
        await query("INSERT INTO job_skills (job_id, skill_name, is_required) VALUES ($1, $2, $3)", [
          job.id,
          skill,
          true,
        ])
      }
    }

    return NextResponse.json({ message: "Job created successfully", jobId: job.id }, { status: 201 })
  } catch (error) {
    console.error("Job creation error:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
