// Admin dashboard main page
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">JobMatch Admin</div>
          <Button variant="ghost" onClick={() => (window.location.href = "/")}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage platform users, companies, and view analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">👥</p>
                <p className="text-sm text-gray-600 mt-2">View, edit, and deactivate user accounts</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/companies">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Company Verification</CardTitle>
                <CardDescription>Verify company profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">🏢</p>
                <p className="text-sm text-gray-600 mt-2">Review and approve company registrations</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>View platform metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">📊</p>
                <p className="text-sm text-gray-600 mt-2">Monitor platform statistics and trends</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">1,247</div>
              <p className="text-sm text-gray-600 mt-2">Total Users</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">523</div>
              <p className="text-sm text-gray-600 mt-2">Active Jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">2,891</div>
              <p className="text-sm text-gray-600 mt-2">Applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600">92%</div>
              <p className="text-sm text-gray-600 mt-2">System Health</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
