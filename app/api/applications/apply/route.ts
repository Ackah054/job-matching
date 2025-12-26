// Apply for a job endpoint
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { calculateMatchScore } from "@/lib/matching-engine"

export async function POST(request: NextRequest) {
  try {
    const { jobId, seekerId } = await request.json()
    const userId = request.headers.get("x-user-id")

    if (!jobId || !seekerId) {
      return NextResponse.json({ error: "Missing jobId or seekerId" }, { status: 400 })
    }

    // Calculate match score
    const { score, explanation } = await calculateMatchScore(jobId, seekerId)

    // Create application
    const result = await query(
      `INSERT INTO job_applications (job_id, seeker_id, match_score, match_explanation, status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (job_id, seeker_id) DO UPDATE SET status = 'applied', updated_at = CURRENT_TIMESTAMP
       RETURNING id, status, match_score, match_explanation`,
      [jobId, seekerId, score, explanation, "applied"],
    )

    return NextResponse.json((result as any[])[0], { status: 201 })
  } catch (error) {
    console.error("Application error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
