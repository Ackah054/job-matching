// Main dashboard (role-based)
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user role from localStorage (set during login)
    const role = localStorage.getItem("userRole")
    if (!role) {
      router.push("/login")
      return
    }
    setUserRole(role)
    setIsLoading(false)
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    localStorage.removeItem("userRole")
    router.push("/")
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">JobMatch</div>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {userRole === "job_seeker" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Seeker Dashboard</h1>
              <p className="text-gray-600 mb-8">Find job opportunities matched to your skills and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/jobs">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Browse Jobs</CardTitle>
                    <CardDescription>Find opportunities matched to your profile</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/profile">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>Update your skills and experience</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/applications">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Applications</CardTitle>
                    <CardDescription>Track your job applications</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        )}

        {userRole === "employer" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Employer Dashboard</h1>
              <p className="text-gray-600 mb-8">Post jobs and find candidates matched to your requirements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/employer/jobs">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>My Jobs</CardTitle>
                    <CardDescription>Manage your job postings</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/employer/jobs/create">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Post Job</CardTitle>
                    <CardDescription>Create a new job posting</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/employer/candidates">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Candidates</CardTitle>
                    <CardDescription>View matched candidates</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        )}

        {userRole === "admin" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
              <p className="text-gray-600 mb-8">Manage users and platform moderation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/admin/users">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Manage platform users</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/admin/companies">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Companies</CardTitle>
                    <CardDescription>Verify company profiles</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/admin/analytics">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>View platform statistics</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
