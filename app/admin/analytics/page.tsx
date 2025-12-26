// Admin analytics dashboard
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Analytics {
  totalUsers: number
  totalJobSeekers: number
  totalEmployers: number
  totalCompanies: number
  totalJobs: number
  totalApplications: number
  verifiedCompanies: number
  successfulMatches: number
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalJobSeekers: 0,
    totalEmployers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    verifiedCompanies: 0,
    successfulMatches: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch analytics data
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      setIsLoading(false)
    }
  }

  const stats = [
    { label: "Total Users", value: analytics.totalUsers, color: "bg-blue-100 text-blue-800" },
    { label: "Job Seekers", value: analytics.totalJobSeekers, color: "bg-green-100 text-green-800" },
    { label: "Employers", value: analytics.totalEmployers, color: "bg-purple-100 text-purple-800" },
    { label: "Companies", value: analytics.totalCompanies, color: "bg-yellow-100 text-yellow-800" },
    { label: "Active Jobs", value: analytics.totalJobs, color: "bg-pink-100 text-pink-800" },
    { label: "Applications", value: analytics.totalApplications, color: "bg-indigo-100 text-indigo-800" },
    { label: "Verified Companies", value: analytics.verifiedCompanies, color: "bg-emerald-100 text-emerald-800" },
    { label: "Successful Matches", value: analytics.successfulMatches, color: "bg-cyan-100 text-cyan-800" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            JobMatch Admin
          </Link>
          <div className="flex gap-4">
            <Link href="/admin/users">
              <Button variant="ghost">Users</Button>
            </Link>
            <Link href="/admin/companies">
              <Button variant="ghost">Companies</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600 mt-2">Overview of platform metrics and statistics</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading analytics...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className={`rounded-lg p-4 mb-4 ${stat.color}`}>
                      <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
                    </div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">User Growth</span>
                      <span className="text-lg font-bold text-green-600">+12.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Applications/Day</span>
                      <span className="text-lg font-bold text-blue-600">145</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Match Score</span>
                      <span className="text-lg font-bold text-purple-600">72%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="text-lg font-bold text-orange-600">8.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">👤</span>
                      <span className="text-gray-600">New job seeker registered</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🏢</span>
                      <span className="text-gray-600">Company profile verified</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">📋</span>
                      <span className="text-gray-600">New job posting created</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <span className="text-gray-600">Application submitted</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
