// Get jobs endpoint
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status") || "open"
    const limit = request.nextUrl.searchParams.get("limit") || "20"
    const offset = request.nextUrl.searchParams.get("offset") || "0"

    const result = await query(
      `SELECT j.id, j.job_title, j.location, j.salary_min, j.salary_max, j.job_type, 
              j.posted_at, c.company_name, c.id as company_id
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.status = $1
       ORDER BY j.posted_at DESC
       LIMIT $2 OFFSET $3`,
      [status, Number.parseInt(limit), Number.parseInt(offset)],
    )

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Jobs error:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}
