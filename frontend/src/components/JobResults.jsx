import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Building2, MapPin, ExternalLink, Loader2 } from 'lucide-react'
import { matchJobs } from '../api/client'

function ScoreBadge({ score }) {
  let color = 'bg-orange-100 text-orange-700'
  if (score >= 80) color = 'bg-green-100 text-green-700'
  else if (score >= 60) color = 'bg-blue-100 text-blue-700'
  return <span className={`badge ${color}`}>{score ?? 0}</span>
}

export default function JobResults() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState(state?.jobs || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!state?.raw && !state?.jobs) return
    // If no precomputed matches but we have raw and possibly criteria.skills, recompute
    if (!state?.jobs && state?.raw && state?.criteria?.skills) {
      const skills = state.criteria.skills.split(',').map(s => s.trim()).filter(Boolean)
      if (skills.length) {
        setLoading(true)
        matchJobs({ user_skills: skills, jobs: state.raw })
          .then(setJobs)
          .catch(() => setJobs(state.raw))
          .finally(() => setLoading(false))
      }
    }
  }, [state])

  if (!state) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-4">No search context found.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Back to Search</button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    )
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-4">No jobs found. Try different search criteria.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>New Search</button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job, idx) => (
        <article key={idx} className="gradient-card p-6 hover:shadow-2xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="text-blue-600" size={18} />
                <span>{job.company || 'Company'}</span>
              </div>
              <h3 className="text-lg font-semibold mt-1">{job.title || 'Job Title'}</h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPin size={16} />
                <span>{job.location || '—'}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <ScoreBadge score={job.match_score ?? 0} />
              {job.salary && <span className="text-xs text-gray-500">{job.salary}</span>}
            </div>
          </div>

          <p className="text-gray-700 mt-3">{job.description?.slice(0, 220) || ''}{job.description && job.description.length > 220 ? '…' : ''}</p>

          <div className="mt-4 flex items-center gap-3">
            {job.url && (
              <a href={job.url} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2">
                <ExternalLink size={16} /> View Details
              </a>
            )}
            <button
              onClick={() => navigate('/analyze', { state: { jobDescription: job.description || '' } })}
              className="px-5 py-3 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 transition"
            >
              Analyze Resume
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
