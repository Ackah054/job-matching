// Applications tracking page
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Application {
  id: string
  job_title: string
  company_name: string
  status: "applied" | "viewed" | "shortlisted" | "rejected" | "withdrawn"
  match_score: number
  applied_at: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      // Fetch applications from API
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch applications:", error)
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: Application["status"]) => {
    const colors: Record<Application["status"], string> = {
      applied: "bg-blue-100 text-blue-800",
      viewed: "bg-yellow-100 text-yellow-800",
      shortlisted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      withdrawn: "bg-gray-100 text-gray-800",
    }
    return colors[status]
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true
    return app.status === filter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            JobMatch
          </Link>
          <div className="flex gap-4">
            <Link href="/jobs">
              <Button variant="ghost">Jobs</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Applications</h1>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {["all", "applied", "viewed", "shortlisted", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading applications...</div>
        ) : filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-600">
              <p>No applications yet. {filter !== "all" && "Try a different filter."}</p>
              <Link href="/jobs" className="mt-4 inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700">Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{app.job_title}</h3>
                      <p className="text-gray-600">{app.company_name}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`text-2xl font-bold ${getMatchScoreColor(app.match_score)}`}>
                          {Math.round(app.match_score)}%
                        </span>
                        <span className="text-gray-600">Match</span>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
