// Job seeker profile page
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SeekerProfile {
  id: string
  bio: string
  location: string
  desired_job_title: string
  years_of_experience: number
}

interface Skill {
  id: string
  skill_name: string
  proficiency_level: string
  years_of_experience: number
}

interface Experience {
  id: string
  company_name: string
  job_title: string
  description: string
  start_date: string
  end_date: string | null
  is_current: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<SeekerProfile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"profile" | "skills" | "experience">("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: "", level: "intermediate", years: 0 })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      // This would fetch from API in a real app
      // For now, we'll show a placeholder
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      setIsLoading(false)
    }
  }

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add skill logic here
    setNewSkill({ name: "", level: "intermediate", years: 0 })
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    // Update profile logic here
    setIsEditing(false)
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
              <Button variant="ghost">Jobs</Button>
            </Link>
            <Link href="/applications">
              <Button variant="ghost">Applications</Button>
            </Link>
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {profile?.id?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <CardTitle className="text-lg">Your Profile</CardTitle>
                    <CardDescription>View and edit your information</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === "profile"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === "skills"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveTab("experience")}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === "experience"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Experience
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Desired Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Senior Software Engineer"
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="e.g., San Francisco, CA"
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                        <input
                          type="number"
                          placeholder="5"
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Salary</label>
                        <input
                          type="number"
                          placeholder="100000"
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        placeholder="Tell us about yourself..."
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>

                    {isEditing && (
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Save Changes
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {skills.length === 0 ? (
                        <p className="text-gray-600">No skills added yet. Add your first skill below.</p>
                      ) : (
                        skills.map((skill) => (
                          <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div>
                              <p className="font-medium">{skill.skill_name}</p>
                              <p className="text-sm text-gray-600">
                                {skill.proficiency_level} • {skill.years_of_experience} years
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Remove
                            </Button>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={handleAddSkill} className="border-t pt-6">
                      <h4 className="font-medium mb-4">Add a Skill</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                          <input
                            type="text"
                            value={newSkill.name}
                            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                            placeholder="e.g., React"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                            <select
                              value={newSkill.level}
                              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                              <option value="expert">Expert</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
                            <input
                              type="number"
                              value={newSkill.years}
                              onChange={(e) => setNewSkill({ ...newSkill, years: Number.parseInt(e.target.value) })}
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                          Add Skill
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {experiences.length === 0 ? (
                      <p className="text-gray-600">No experience added yet.</p>
                    ) : (
                      experiences.map((exp) => (
                        <div key={exp.id} className="border-l-4 border-blue-600 pl-4 py-2">
                          <h4 className="font-semibold">{exp.job_title}</h4>
                          <p className="text-gray-600">{exp.company_name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(exp.start_date).toLocaleDateString()} -{" "}
                            {exp.is_current ? "Present" : new Date(exp.end_date!).toLocaleDateString()}
                          </p>
                          {exp.description && <p className="text-sm mt-2 text-gray-600">{exp.description}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
