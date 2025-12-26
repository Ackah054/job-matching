// Get user profile endpoint
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user basic info
    const userResult = await query("SELECT id, email, full_name, role FROM users WHERE id = $1", [userId])

    if ((userResult as any[]).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = (userResult as any[])[0]

    // Get role-specific profile
    let profile = {}

    if (userRole === "job_seeker") {
      const seekerResult = await query(
        `SELECT p.*, 
                COALESCE(json_agg(json_build_object('id', s.id, 'skill_name', s.skill_name, 'proficiency_level', s.proficiency_level, 'years_of_experience', s.years_of_experience)) FILTER (WHERE s.id IS NOT NULL), '[]'::json) as skills
         FROM job_seeker_profiles p
         LEFT JOIN seeker_skills s ON p.id = s.seeker_id
         WHERE p.user_id = $1
         GROUP BY p.id`,
        [userId],
      )

      if ((seekerResult as any[]).length > 0) {
        profile = (seekerResult as any[])[0]
      }
    } else if (userRole === "employer") {
      const companyResult = await query("SELECT * FROM companies WHERE user_id = $1", [userId])

      if ((companyResult as any[]).length > 0) {
        profile = (companyResult as any[])[0]
      }
    }

    return NextResponse.json({ user, profile }, { status: 200 })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
