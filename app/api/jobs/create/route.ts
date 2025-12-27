// Create job endpoint for employers
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      jobTitle,
      description,
      location,
      jobType,
      salaryMin,
      salaryMax,
      yearsRequired,
      skills,
    } = await request.json()

    // Get employer's company
    const companyResult = await sql`
      SELECT id
      FROM companies
      WHERE user_id = ${userId}
    `

    if (companyResult.length === 0) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      )
    }

    const companyId = companyResult[0].id

    // Create job
    const jobResult = await sql`
      INSERT INTO jobs (
        company_id,
        job_title,
        description,
        location,
        job_type,
        salary_min,
        salary_max,
        years_of_experience_required
      )
      VALUES (
        ${companyId},
        ${jobTitle},
        ${description},
        ${location},
        ${jobType},
        ${salaryMin},
        ${salaryMax},
        ${yearsRequired}
      )
      RETURNING id
    `

    const jobId = jobResult[0].id

    // Add required skills
    if (Array.isArray(skills)) {
      for (const skill of skills) {
        await sql`
          INSERT INTO job_skills (job_id, skill_name, is_required)
          VALUES (${jobId}, ${skill}, true)
        `
      }
    }

    return NextResponse.json(
      { message: "Job created successfully", jobId },
      { status: 201 }
    )
  } catch (error) {
    console.error("Job creation error:", error)
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    )
  }
}
