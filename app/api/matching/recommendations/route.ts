// API endpoint for job recommendations
import { type NextRequest, NextResponse } from "next/server"
import { getRecommendedJobsForSeeker } from "@/lib/matching-engine"

export async function GET(request: NextRequest) {
  try {
    const seekerId = request.headers.get("x-seeker-id")
    const limit = request.nextUrl.searchParams.get("limit") || "20"

    if (!seekerId) {
      return NextResponse.json({ error: "Missing seekerId" }, { status: 400 })
    }

    const recommendations = await getRecommendedJobsForSeeker(seekerId, Number.parseInt(limit))

    return NextResponse.json(recommendations, { status: 200 })
  } catch (error) {
    console.error("Recommendations error:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}
