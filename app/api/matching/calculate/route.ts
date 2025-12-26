// API endpoint to calculate match score
import { type NextRequest, NextResponse } from "next/server"
import { calculateMatchScore } from "@/lib/matching-engine"

export async function POST(request: NextRequest) {
  try {
    const { jobId, seekerId } = await request.json()

    if (!jobId || !seekerId) {
      return NextResponse.json({ error: "Missing jobId or seekerId" }, { status: 400 })
    }

    const result = await calculateMatchScore(jobId, seekerId)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Matching error:", error)
    return NextResponse.json({ error: "Failed to calculate match score" }, { status: 500 })
  }
}
