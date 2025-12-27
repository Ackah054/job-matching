// Apply for a job endpoint
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { calculateMatchScore } from "@/lib/matching-engine"

export async function POST(request: NextRequest) {
  try {
    const { jobId, seekerId } = await request.json()
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!jobId || !seekerId) {
      return NextResponse.json(
        { error: "Missing jobId or seekerId" },
        { status: 400 }
      )
    }

    // Calculate match score
    const { score, explanation } = await calculateMatchScore(jobId, seekerId)

    // Create or update application
    const result = await sql`
      INSERT INTO job_applications (
        job_id,
        seeker_id,
        match_score,
        match_explanation,
        status
      )
      VALUES (
        ${jobId},
        ${seekerId},
        ${score},
        ${explanation},
        'applied'
      )
      ON CONFLICT (job_id, seeker_id)
      DO UPDATE SET
        status = 'applied',
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, status, match_score, match_explanation
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Application error:", error)
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    )
  }
}
