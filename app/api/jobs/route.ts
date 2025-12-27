// Get jobs endpoint
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status") ?? "open"
    const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "20")
    const offset = Number.parseInt(request.nextUrl.searchParams.get("offset") ?? "0")

    const result = await sql`
      SELECT 
        j.id,
        j.job_title,
        j.location,
        j.salary_min,
        j.salary_max,
        j.job_type,
        j.posted_at,
        c.company_name,
        c.id AS company_id
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.status = ${status}
      ORDER BY j.posted_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Jobs error:", error)
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    )
  }
}
