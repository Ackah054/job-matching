// User registration endpoint
import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword, createToken, UserRole } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role } = await request.json()

    // Validate input
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const users = await sql`
      INSERT INTO users (email, password_hash, role, full_name)
      VALUES (${email}, ${passwordHash}, ${role}, ${fullName})
      RETURNING id, email, role
    `

    const user = users[0]

    // Create role-specific profile
    if (role === UserRole.JOB_SEEKER) {
      await sql`
        INSERT INTO job_seeker_profiles (user_id)
        VALUES (${user.id})
      `
    }

    if (role === UserRole.EMPLOYER) {
      await sql`
        INSERT INTO companies (user_id, company_name)
        VALUES (${user.id}, 'Company Name')
      `
    }

    // Create JWT
    const token = await createToken(user.id, user.role)

    // Send response + cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user,
      },
      { status: 201 }
    )

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
