// View candidates for employer
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Candidate {
  id: string
  full_name: string
  desired_job_title: string
  location: string
  years_of_experience: number
  skills: string[]
  match_score: number
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      // Fetch matched candidates
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch candidates:", error)
      setIsLoading(false)
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
            <Link href="/employer/jobs">
              <Button variant="ghost">My Jobs</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Matched Candidates</h1>
          <p className="text-gray-600 mt-2">Top candidates matched to your job openings</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading candidates...</div>
        ) : candidates.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-600">
              <p>No candidates matched yet. Post a job to start receiving matches.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.full_name}</h3>
                      <p className="text-gray-600">{candidate.desired_job_title}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>📍 {candidate.location}</span>
                        <span>💼 {candidate.years_of_experience} years</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {candidate.skills.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 5 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                            +{candidate.skills.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-3">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(candidate.match_score)}`}>
                          {Math.round(candidate.match_score)}%
                        </div>
                        <p className="text-gray-600 text-sm">Match</p>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full">
                        View Profile
                      </Button>
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
