// Admin company verification
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AdminCompany {
  id: string
  company_name: string
  website: string
  industry: string
  is_verified: boolean
  created_at: string
  user_id: string
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<AdminCompany[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      // Fetch all companies
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch companies:", error)
      setIsLoading(false)
    }
  }

  const handleVerify = async (companyId: string) => {
    try {
      // Verify company
      console.log("Verifying company:", companyId)
    } catch (error) {
      console.error("Failed to verify company:", error)
    }
  }

  const filteredCompanies = companies.filter((company) => {
    if (filter === "all") return true
    if (filter === "verified") return company.is_verified
    if (filter === "unverified") return !company.is_verified
    return true
  })

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
            <Link href="/admin/analytics">
              <Button variant="ghost">Analytics</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Verification</h1>
          <p className="text-gray-600 mt-2">Review and verify company profiles</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["all", "verified", "unverified"].map((status) => (
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

        {isLoading ? (
          <div className="text-center py-12">Loading companies...</div>
        ) : filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-600">
              <p>No companies found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <Card key={company.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{company.company_name}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>Website: {company.website || "N/A"}</p>
                        <p>Industry: {company.industry || "N/A"}</p>
                        <p>Submitted: {new Date(company.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      {company.is_verified ? (
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}

                      {!company.is_verified && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleVerify(company.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 bg-transparent">
                            Reject
                          </Button>
                        </div>
                      )}
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
