import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import JobResults from './components/JobResults'
import ResumeAnalyzer from './components/ResumeAnalyzer'

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen text-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobResults />} />
          <Route path="/analyze" element={<ResumeAnalyzer />} />
        </Routes>
      </main>
    </div>
  )
}
