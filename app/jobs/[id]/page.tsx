// Job detail page with match score
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface JobDetail {
  id: string
  job_title: string
  company_name: string
  description: string
  location: string
  job_type: string
  salary_min: number
  salary_max: number
  years_of_experience_required: number
  required_skills: Array<{ skill_name: string; is_required: boolean }>
}

interface MatchScore {
  score: number
  breakdown: Record<string, number>
  explanation: string
}

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [job, setJob] = useState<JobDetail | null>(null)
  const [matchScore, setMatchScore] = useState<MatchScore | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    fetchJobDetails()
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      // Fetch job details and match score
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch job:", error)
      setIsLoading(false)
    }
  }

  const handleApply = async () => {
    setIsApplying(true)
    try {
      const response = await fetch("/api/applications/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })

      if (response.ok) {
        setHasApplied(true)
      }
    } catch (error) {
      console.error("Failed to apply:", error)
    } finally {
      setIsApplying(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            JobMatch
          </Link>
          <div className="flex gap-4">
            <Link href="/jobs">
              <Button variant="ghost">Browse Jobs</Button>
            </Link>
            <Link href="/applications">
              <Button variant="ghost">My Applications</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">Loading job details...</div>
        ) : job ? (
          <div className="space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl">{job.job_title}</CardTitle>
                    <CardDescription className="text-lg mt-2">{job.company_name}</CardDescription>
                  </div>
                  {matchScore && (
                    <div className="text-right">
                      <div className={`text-4xl font-bold ${getScoreColor(matchScore.score)} mb-2`}>
                        {Math.round(matchScore.score)}%
                      </div>
                      <p className="text-gray-600 font-medium">Match Score</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium capitalize">{job.job_type.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Salary Range</p>
                    <p className="font-medium">
                      ${job.salary_min?.toLocaleString() || "N/A"}K - ${job.salary_max?.toLocaleString() || "N/A"}K
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{job.years_of_experience_required}+ years</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Score Breakdown */}
            {matchScore && (
              <Card>
                <CardHeader>
                  <CardTitle>Match Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(matchScore.breakdown).map(([category, score]) => (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{category}</span>
                          <span className="text-lg font-bold text-blue-600">{score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${score}%` }} />
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-900">{matchScore.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Position</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-2 rounded-full text-sm font-medium ${
                        skill.is_required
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : "bg-gray-100 text-gray-800 border border-gray-300"
                      }`}
                    >
                      {skill.skill_name}
                      {skill.is_required && <span className="ml-1">*</span>}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Apply Button */}
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={handleApply}
                disabled={hasApplied || isApplying}
                className={`flex-1 ${hasApplied ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isApplying ? "Applying..." : hasApplied ? "Applied" : "Apply Now"}
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">Job not found</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
