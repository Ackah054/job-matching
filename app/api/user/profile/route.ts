// Get user profile endpoint
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user basic info
    const userResult = await sql`
      SELECT id, email, full_name, role
      FROM users
      WHERE id = ${userId}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userResult[0]
    let profile: any = {}

    // Role-specific profile
    if (userRole === "job_seeker") {
      const seekerResult = await sql`
        SELECT 
          p.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', s.id,
                'skill_name', s.skill_name,
                'proficiency_level', s.proficiency_level,
                'years_of_experience', s.years_of_experience
              )
            ) FILTER (WHERE s.id IS NOT NULL),
            '[]'::json
          ) AS skills
        FROM job_seeker_profiles p
        LEFT JOIN seeker_skills s ON p.id = s.seeker_id
        WHERE p.user_id = ${userId}
        GROUP BY p.id
      `

      if (seekerResult.length > 0) {
        profile = seekerResult[0]
      }
    }

    if (userRole === "employer") {
      const companyResult = await sql`
        SELECT *
        FROM companies
        WHERE user_id = ${userId}
      `

      if (companyResult.length > 0) {
        profile = companyResult[0]
      }
    }

    return NextResponse.json({ user, profile }, { status: 200 })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}
