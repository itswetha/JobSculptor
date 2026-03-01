import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Search, Sparkles, Upload, TrendingUp } from 'lucide-react'
import { searchJobs, matchJobs } from '../api/client'

export default function HomePage() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')
  const [experience, setExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const jobs = await searchJobs({
        skills,
        location,
        job_type: jobType,
        experience_level: experience,
      })
      // Try initial match with provided skills if any
      let matched = jobs
      if (skills.trim()) {
        matched = await matchJobs({ user_skills: skills.split(',').map(s => s.trim()).filter(Boolean), jobs })
      }
      navigate('/jobs', { state: { jobs: matched, raw: jobs, criteria: { skills, location, jobType, experience } } })
    } catch (err) {
      setError(err.message || 'Failed to search jobs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="text-center py-12 sm:py-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Briefcase className="text-blue-600" size={32} />
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">AI-Powered Job & Internship Finder</h1>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">Find your next role with intelligent search, AI-driven matching, and resume analysis. Optimize applications and land interviews faster.</p>
      </section>

      <section className="gradient-card p-6 sm:p-8 mb-10">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <input className="input" value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Python, Marketing..." />
          </div>
          <div className="lg:col-span-1">
            <input className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
          </div>
          <div className="lg:col-span-1">
            <select className="input" value={jobType} onChange={e => setJobType(e.target.value)}>
              <option value="">Job Type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
          </div>
          <div className="lg:col-span-1">
            <select className="input" value={experience} onChange={e => setExperience(e.target.value)}>
              <option value="">Experience Level</option>
              <option>Entry</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
          </div>
          <div className="lg:col-span-1 flex items-stretch">
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <Search size={18} /> {loading ? 'Searching...' : 'Search Jobs'}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 text-red-600 text-sm">{error}</div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="gradient-card p-6 hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="text-blue-600" />
            <h3 className="font-semibold text-lg">AI Matching</h3>
          </div>
          <p className="text-gray-600">Get relevance scores based on your skills to prioritize best-fit roles.</p>
        </div>
        <div className="gradient-card p-6 hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <Upload className="text-blue-600" />
            <h3 className="font-semibold text-lg">Resume Analysis</h3>
          </div>
          <p className="text-gray-600">Identify strengths and missing skills with actionable improvement tips.</p>
        </div>
        <div className="gradient-card p-6 hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="text-blue-600" />
            <h3 className="font-semibold text-lg">Smart Rankings</h3>
          </div>
          <p className="text-gray-600">See top opportunities first with color-coded match badges.</p>
        </div>
      </section>
    </div>
  )
}
