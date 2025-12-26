// Employer job listings
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmployerJob {
  id: string
  job_title: string
  location: string
  status: string
  salary_min: number
  salary_max: number
  applicant_count: number
  created_at: string
}

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // Fetch employer's jobs from API
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
      archived: "bg-red-100 text-red-800",
    }
    return colors[status] || colors.closed
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            JobMatch
          </Link>
          <div className="flex gap-4">
            <Link href="/employer/candidates">
              <Button variant="ghost">Candidates</Button>
            </Link>
            <Link href="/employer/jobs/create">
              <Button className="bg-blue-600 hover:bg-blue-700">Post Job</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
            <p className="text-gray-600 mt-2">Manage and track your job listings</p>
          </div>
          <Link href="/employer/jobs/create">
            <Button className="bg-blue-600 hover:bg-blue-700">Post New Job</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-gray-600 text-lg">You haven't posted any jobs yet.</p>
              <Link href="/employer/jobs/create">
                <Button className="bg-blue-600 hover:bg-blue-700">Post Your First Job</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/employer/jobs/${job.id}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{job.job_title}</h3>
                        <p className="text-gray-600 mt-1">📍 {job.location}</p>
                        <div className="flex gap-4 mt-3 text-sm text-gray-600">
                          <span>
                            💰 ${job.salary_min}K - ${job.salary_max}K
                          </span>
                          <span>👥 {job.applicant_count} applicants</span>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(job.status)}`}
                        >
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        <p className="text-xs text-gray-500">Posted {new Date(job.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
