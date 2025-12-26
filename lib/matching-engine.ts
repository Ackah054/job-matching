// Advanced job matching algorithm with weighted scoring
import { query } from "./db"

interface MatchingWeights {
  skills: number
  experience: number
  location: number
  salary: number
}

const DEFAULT_WEIGHTS: MatchingWeights = {
  skills: 0.5, // 50%
  experience: 0.2, // 20%
  location: 0.15, // 15%
  salary: 0.15, // 15%
}

// Calculate skill match between job and candidate
async function calculateSkillMatch(jobId: string, seekerId: string): Promise<{ score: number; explanation: string[] }> {
  const explanations: string[] = []

  // Get required job skills
  const jobSkillsResult = await query("SELECT skill_name, is_required FROM job_skills WHERE job_id = $1", [jobId])

  // Get candidate skills
  const seekerSkillsResult = await query(
    "SELECT skill_name, proficiency_level FROM seeker_skills WHERE seeker_id = $1",
    [seekerId],
  )

  const jobSkills = jobSkillsResult as Array<{ skill_name: string; is_required: boolean }>
  const seekerSkills = seekerSkillsResult as Array<{ skill_name: string; proficiency_level: string }>
  const seekerSkillNames = seekerSkills.map((s) => s.skill_name.toLowerCase())

  if (jobSkills.length === 0) return { score: 100, explanation: ["No specific skills required"] }

  const requiredSkills = jobSkills.filter((s) => s.is_required)
  const optionalSkills = jobSkills.filter((s) => !s.is_required)

  let matchedRequired = 0
  let matchedOptional = 0

  // Check required skills
  for (const skill of requiredSkills) {
    if (seekerSkillNames.includes(skill.skill_name.toLowerCase())) {
      matchedRequired++
    }
  }

  // Check optional skills
  for (const skill of optionalSkills) {
    if (seekerSkillNames.includes(skill.skill_name.toLowerCase())) {
      matchedOptional++
    }
  }

  const requiredScore = requiredSkills.length > 0 ? (matchedRequired / requiredSkills.length) * 100 : 100

  const optionalScore = optionalSkills.length > 0 ? (matchedOptional / optionalSkills.length) * 50 : 0

  const score = Math.min(100, (requiredScore + optionalScore) / 1.5)

  if (matchedRequired === requiredSkills.length) {
    explanations.push(`All ${requiredSkills.length} required skills matched`)
  } else {
    explanations.push(`${matchedRequired}/${requiredSkills.length} required skills matched`)
  }

  if (matchedOptional > 0) {
    explanations.push(`${matchedOptional}/${optionalSkills.length} optional skills matched`)
  }

  return { score, explanation: explanations }
}

// Calculate experience match
async function calculateExperienceMatch(
  jobId: string,
  seekerId: string,
): Promise<{ score: number; explanation: string[] }> {
  const explanations: string[] = []

  // Get job experience requirement
  const jobResult = await query("SELECT years_of_experience_required FROM jobs WHERE id = $1", [jobId])

  // Get candidate years of experience
  const seekerResult = await query("SELECT years_of_experience FROM job_seeker_profiles WHERE id = $1", [seekerId])

  const job = (jobResult as any[])[0]
  const seeker = (seekerResult as any[])[0]

  const jobRequiredYears = job?.years_of_experience_required || 0
  const seekerYears = seeker?.years_of_experience || 0

  let score = 100

  if (seekerYears >= jobRequiredYears) {
    score = 100
    explanations.push(`${seekerYears} years experience exceeds requirement of ${jobRequiredYears}`)
  } else if (seekerYears >= jobRequiredYears * 0.8) {
    score = 80
    explanations.push(`${seekerYears} years experience slightly below requirement of ${jobRequiredYears}`)
  } else {
    score = Math.max(0, (seekerYears / jobRequiredYears) * 100)
    explanations.push(`${seekerYears} years experience below requirement of ${jobRequiredYears}`)
  }

  return { score, explanation: explanations }
}

// Calculate location match
async function calculateLocationMatch(
  jobId: string,
  seekerId: string,
): Promise<{ score: number; explanation: string[] }> {
  const explanations: string[] = []

  // Get job location
  const jobResult = await query("SELECT location FROM jobs WHERE id = $1", [jobId])

  // Get candidate location
  const seekerResult = await query("SELECT location FROM job_seeker_profiles WHERE id = $1", [seekerId])

  const jobLocation = (jobResult as any[])[0]?.location || ""
  const seekerLocation = (seekerResult as any[])[0]?.location || ""

  let score = 50 // Assume remote or willing to relocate
  let explanation = "Candidate may need to relocate"

  if (jobLocation && seekerLocation) {
    const normalizedJob = jobLocation.toLowerCase().trim()
    const normalizedSeeker = seekerLocation.toLowerCase().trim()

    if (normalizedJob === normalizedSeeker) {
      score = 100
      explanation = `Candidate is in ${seekerLocation}`
    } else if (normalizedJob.includes("remote") || normalizedSeeker.includes("any")) {
      score = 100
      explanation = "Job is remote or candidate flexible"
    } else {
      score = 60
      explanation = `Different location but manageable`
    }
  }

  explanations.push(explanation)
  return { score, explanation: explanations }
}

// Calculate salary match
async function calculateSalaryMatch(
  jobId: string,
  seekerId: string,
): Promise<{ score: number; explanation: string[] }> {
  const explanations: string[] = []

  // Get job salary range
  const jobResult = await query("SELECT salary_min, salary_max FROM jobs WHERE id = $1", [jobId])

  // Get candidate salary expectations
  const seekerResult = await query(
    "SELECT desired_salary_min, desired_salary_max FROM job_seeker_profiles WHERE id = $1",
    [seekerId],
  )

  const job = (jobResult as any[])[0]
  const seeker = (seekerResult as any[])[0]

  const jobMin = job?.salary_min || 0
  const jobMax = job?.salary_max || 999999
  const seekerMin = seeker?.desired_salary_min || 0
  const seekerMax = seeker?.desired_salary_max || 999999

  let score = 50

  // Check if ranges overlap
  if (jobMax >= seekerMin && seekerMax >= jobMin) {
    score = 100
    explanations.push("Salary expectations align")
  } else if (jobMax >= seekerMin * 0.9) {
    score = 75
    explanations.push("Salary slightly below expectations")
  } else {
    score = 50
    explanations.push("Significant salary gap")
  }

  return { score, explanation: explanations }
}

export async function calculateMatchScore(
  jobId: string,
  seekerId: string,
  weights = DEFAULT_WEIGHTS,
): Promise<{
  score: number
  breakdown: Record<string, number>
  explanation: string
}> {
  // Calculate individual component scores
  const skillMatch = await calculateSkillMatch(jobId, seekerId)
  const experienceMatch = await calculateExperienceMatch(jobId, seekerId)
  const locationMatch = await calculateLocationMatch(jobId, seekerId)
  const salaryMatch = await calculateSalaryMatch(jobId, seekerId)

  // Calculate weighted score
  const totalScore =
    skillMatch.score * weights.skills +
    experienceMatch.score * weights.experience +
    locationMatch.score * weights.location +
    salaryMatch.score * weights.salary

  const breakdown = {
    skills: Math.round(skillMatch.score),
    experience: Math.round(experienceMatch.score),
    location: Math.round(locationMatch.score),
    salary: Math.round(salaryMatch.score),
  }

  const explanations = [
    ...skillMatch.explanation,
    ...experienceMatch.explanation,
    ...locationMatch.explanation,
    ...salaryMatch.explanation,
  ]

  return {
    score: Math.round(totalScore),
    breakdown,
    explanation: explanations.join("; "),
  }
}

// Get top matches for a job
export async function getTopCandidatesForJob(jobId: string, limit = 20) {
  const seekersResult = await query(
    "SELECT j.id, j.user_id, u.full_name, p.location FROM job_seeker_profiles p JOIN users u ON p.user_id = u.id WHERE u.role = $1",
    ["job_seeker"],
  )

  const seekers = seekersResult as Array<{ id: string; user_id: string; full_name: string; location: string }>

  const matches = await Promise.all(
    seekers.map(async (seeker) => {
      const matchResult = await calculateMatchScore(jobId, seeker.id)
      return {
        ...seeker,
        ...matchResult,
      }
    }),
  )

  return matches.sort((a, b) => b.score - a.score).slice(0, limit)
}

// Get recommended jobs for a candidate
export async function getRecommendedJobsForSeeker(seekerId: string, limit = 20) {
  const jobsResult = await query("SELECT id FROM jobs WHERE status = $1", ["open"])

  const jobs = jobsResult as Array<{ id: string }>

  const matches = await Promise.all(
    jobs.map(async (job) => {
      const matchResult = await calculateMatchScore(job.id, seekerId)
      // Get job details
      const jobDetail = await query(
        "SELECT j.id, j.job_title, j.location, j.salary_min, j.salary_max, c.company_name FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.id = $1",
        [job.id],
      )
      const jobData = (jobDetail as any[])[0]

      return {
        ...jobData,
        ...matchResult,
      }
    }),
  )

  return matches
    .filter((m) => m.score >= 50) // Only return matches above 50%
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
