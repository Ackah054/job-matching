// API endpoint to get top candidates for a job
import { type NextRequest, NextResponse } from "next/server"
import { getTopCandidatesForJob } from "@/lib/matching-engine"

export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get("jobId")
    const limit = request.nextUrl.searchParams.get("limit") || "20"

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
    }

    const candidates = await getTopCandidatesForJob(jobId, Number.parseInt(limit))

    return NextResponse.json(candidates, { status: 200 })
  } catch (error) {
    console.error("Candidates error:", error)
    return NextResponse.json({ error: "Failed to get candidates" }, { status: 500 })
  }
}
