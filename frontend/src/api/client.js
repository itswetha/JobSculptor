import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 30000,
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.detail || error.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export async function searchJobs({ skills, location, job_type, experience_level }) {
  try {
    const { data } = await api.post('/search_jobs/', { skills, location, job_type, experience_level })
    return data?.results || []
  } catch (e) {
    throw e
  }
}

export async function analyzeResume({ file, jobDescription }) {
  try {
    const form = new FormData()
    form.append('resume_file', file)
    form.append('job_description', jobDescription)
    const { data } = await api.post('/analyze_resume/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (e) {
    throw e
  }
}

export async function matchJobs({ user_skills, jobs }) {
  try {
    const { data } = await api.post('/match_jobs/', { user_skills, jobs })
    return data?.results || []
  } catch (e) {
    throw e
  }
}

export default api
