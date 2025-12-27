// Advanced job matching algorithm with weighted scoring
import { sql } from "./db"

interface MatchingWeights {
  skills: number
  experience: number
  location: number
  salary: number
}

const DEFAULT_WEIGHTS: MatchingWeights = {
  skills: 0.5,
  experience: 0.2,
  location: 0.15,
  salary: 0.15,
}

// Calculate skill match
async function calculateSkillMatch(jobId: string, seekerId: string) {
  const explanations: string[] = []

  const jobSkills = await sql`
    SELECT skill_name, is_required
    FROM job_skills
    WHERE job_id = ${jobId}
  `

  const seekerSkills = await sql`
    SELECT skill_name, proficiency_level
    FROM seeker_skills
    WHERE seeker_id = ${seekerId}
  `

  if (jobSkills.length === 0) {
    return { score: 100, explanation: ["No specific skills required"] }
  }

  const seekerSkillNames = seekerSkills.map(s => s.skill_name.toLowerCase())
  const requiredSkills = jobSkills.filter(s => s.is_required)
  const optionalSkills = jobSkills.filter(s => !s.is_required)

  let matchedRequired = 0
  let matchedOptional = 0

  for (const skill of requiredSkills) {
    if (seekerSkillNames.includes(skill.skill_name.toLowerCase())) {
      matchedRequired++
    }
  }

  for (const skill of optionalSkills) {
    if (seekerSkillNames.includes(skill.skill_name.toLowerCase())) {
      matchedOptional++
    }
  }

  const requiredScore =
    requiredSkills.length > 0
      ? (matchedRequired / requiredSkills.length) * 100
      : 100

  const optionalScore =
    optionalSkills.length > 0
      ? (matchedOptional / optionalSkills.length) * 50
      : 0

  const score = Math.min(100, (requiredScore + optionalScore) / 1.5)

  explanations.push(
    `${matchedRequired}/${requiredSkills.length} required skills matched`
  )

  if (matchedOptional > 0) {
    explanations.push(
      `${matchedOptional}/${optionalSkills.length} optional skills matched`
    )
  }

  return { score, explanation: explanations }
}

// Experience match
async function calculateExperienceMatch(jobId: string, seekerId: string) {
  const job = (await sql`
    SELECT years_of_experience_required
    FROM jobs
    WHERE id = ${jobId}
  `)[0]

  const seeker = (await sql`
    SELECT years_of_experience
    FROM job_seeker_profiles
    WHERE id = ${seekerId}
  `)[0]

  const jobYears = job?.years_of_experience_required ?? 0
  const seekerYears = seeker?.years_of_experience ?? 0

  let score = 100
  const explanation: string[] = []

  if (seekerYears >= jobYears) {
    explanation.push("Experience meets requirement")
  } else {
    score = Math.max(0, (seekerYears / jobYears) * 100)
    explanation.push("Experience below requirement")
  }

  return { score, explanation }
}

// Location match
async function calculateLocationMatch(jobId: string, seekerId: string) {
  const job = (await sql`
    SELECT location FROM jobs WHERE id = ${jobId}
  `)[0]

  const seeker = (await sql`
    SELECT location FROM job_seeker_profiles WHERE id = ${seekerId}
  `)[0]

  if (!job?.location || !seeker?.location) {
    return { score: 50, explanation: ["Location flexible"] }
  }

  if (job.location.toLowerCase() === seeker.location.toLowerCase()) {
    return { score: 100, explanation: ["Same location"] }
  }

  return { score: 60, explanation: ["Different location"] }
}

// Salary match
async function calculateSalaryMatch(jobId: string, seekerId: string) {
  const job = (await sql`
    SELECT salary_min, salary_max FROM jobs WHERE id = ${jobId}
  `)[0]

  const seeker = (await sql`
    SELECT desired_salary_min, desired_salary_max
    FROM job_seeker_profiles
    WHERE id = ${seekerId}
  `)[0]

  if (!job || !seeker) {
    return { score: 50, explanation: ["Salary data missing"] }
  }

  if (job.salary_max >= seeker.desired_salary_min) {
    return { score: 100, explanation: ["Salary matches"] }
  }

  return { score: 50, explanation: ["Salary mismatch"] }
}

export async function calculateMatchScore(jobId: string, seekerId: string) {
  const skill = await calculateSkillMatch(jobId, seekerId)
  const exp = await calculateExperienceMatch(jobId, seekerId)
  const loc = await calculateLocationMatch(jobId, seekerId)
  const sal = await calculateSalaryMatch(jobId, seekerId)

  const score =
    skill.score * DEFAULT_WEIGHTS.skills +
    exp.score * DEFAULT_WEIGHTS.experience +
    loc.score * DEFAULT_WEIGHTS.location +
    sal.score * DEFAULT_WEIGHTS.salary

  return {
    score: Math.round(score),
    breakdown: {
      skills: skill.score,
      experience: exp.score,
      location: loc.score,
      salary: sal.score,
    },
    explanation: [
      ...skill.explanation,
      ...exp.explanation,
      ...loc.explanation,
      ...sal.explanation,
    ].join("; "),
  }
}
