import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { analyzeResume } from '../api/client'
import { Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export default function ResumeAnalyzer() {
  const location = useLocation()
  const [file, setFile] = useState(null)
  const [jobDesc, setJobDesc] = useState(location?.state?.jobDescription || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const dropRef = useRef(null)

  const onDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f && f.type.includes('pdf')) setFile(f)
  }

  const onAnalyze = async () => {
    setError('')
    if (!file) { setError('Please upload a PDF resume.'); return }
    if (!jobDesc.trim()) { setError('Please paste a job description.'); return }
    setLoading(true)
    try {
      const res = await analyzeResume({ file, jobDescription: jobDesc })
      setResult(res)
    } catch (e) {
      setError(e.message || 'Failed to analyze resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="gradient-card p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Resume (PDF)</h2>
        <div
          ref={dropRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center hover:bg-blue-50/40 transition cursor-pointer"
          onClick={() => document.getElementById('resume-input').click()}
        >
          <input id="resume-input" type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="text-blue-600" />
            <p className="text-sm text-gray-600">Drag & drop your PDF or click to select</p>
            {file && <p className="text-sm text-gray-800">Selected: {file.name}</p>}
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">Job Description</h2>
        <textarea
          className="input min-h-[180px]"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste job description here..."
        />

        {error && <div className="text-red-600 text-sm mt-3">{error}</div>}

        <button onClick={onAnalyze} disabled={loading} className="btn-primary mt-4 w-full">
          {loading ? 'Analyzing...' : 'Analyze with AI'}
        </button>
      </section>

      <section className="gradient-card p-6">
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        {!result && !loading && (
          <div className="text-gray-600">No analysis yet. Upload your resume and paste a job description to begin.</div>
        )}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        )}
        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center border-4 border-blue-200">
                  <span className="text-3xl font-bold text-blue-700">{result.match_score}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Strengths</h3>
              <ul className="space-y-2">
                {result.strengths?.length ? result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-green-700"><CheckCircle size={18} /> <span>{s}</span></li>
                )) : <li className="text-gray-500">No strengths detected.</li>}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Missing Skills</h3>
              <ul className="space-y-2">
                {result.missing_skills?.length ? result.missing_skills.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-orange-700"><AlertCircle size={18} /> <span>{s}</span></li>
                )) : <li className="text-gray-500">No missing skills detected.</li>}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Suggestions</h3>
              <ol className="list-decimal ml-6 space-y-2 text-gray-800">
                {result.suggestions?.length ? result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                )) : <li className="text-gray-500">No suggestions provided.</li>}
              </ol>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
