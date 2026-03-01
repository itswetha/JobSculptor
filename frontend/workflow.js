import React from 'react';
import { Database, Brain, Server, Globe, FileText, Briefcase, Users } from 'lucide-react';

export default function SystemArchitecture() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">JobSculptor Architecture</h1>
        <p className="text-purple-200 text-center mb-12">AI-Powered Resume & Job Matching Platform</p>
        
        {/* Frontend Layer */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center mb-4">
              <Globe className="w-8 h-8 text-white mr-3" />
              <h2 className="text-2xl font-bold text-white">Frontend Layer (React)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <Users className="w-6 h-6 text-white mb-2" />
                <h3 className="font-semibold text-white mb-1">User Dashboard</h3>
                <p className="text-sm text-blue-100">Profile, saved jobs, applications</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <Briefcase className="w-6 h-6 text-white mb-2" />
                <h3 className="font-semibold text-white mb-1">Job Search</h3>
                <p className="text-sm text-blue-100">Filter by skills, location, type</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <FileText className="w-6 h-6 text-white mb-2" />
                <h3 className="font-semibold text-white mb-1">Resume Analyzer</h3>
                <p className="text-sm text-blue-100">Upload & get AI feedback</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <Brain className="w-6 h-6 text-white mb-2" />
                <h3 className="font-semibold text-white mb-1">Match Score</h3>
                <p className="text-sm text-blue-100">Visual compatibility display</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Gateway */}
        <div className="flex justify-center mb-8">
          <div className="bg-purple-600 rounded-lg px-8 py-3 shadow-lg">
            <p className="text-white font-semibold text-center">REST API / WebSocket</p>
            <p className="text-purple-200 text-sm text-center">JSON Data Exchange</p>
          </div>
        </div>

        {/* Backend Layer */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center mb-4">
              <Server className="w-8 h-8 text-white mr-3" />
              <h2 className="text-2xl font-bold text-white">Backend Layer (FastAPI)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Authentication</h3>
                <ul className="text-sm text-green-100 space-y-1">
                  <li>• JWT tokens</li>
                  <li>• User sessions</li>
                  <li>• OAuth integration</li>
                </ul>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Job API Handler</h3>
                <ul className="text-sm text-green-100 space-y-1">
                  <li>• LinkedIn API</li>
                  <li>• Indeed API</li>
                  <li>• Rate limiting</li>
                </ul>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Application Tracker</h3>
                <ul className="text-sm text-green-100 space-y-1">
                  <li>• Save jobs</li>
                  <li>• Track status</li>
                  <li>• Notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AI Layer */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center mb-4">
              <Brain className="w-8 h-8 text-white mr-3" />
              <h2 className="text-2xl font-bold text-white">AI Processing Layer</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Resume Parser</h3>
                <ul className="text-sm text-pink-100 space-y-1">
                  <li>• PDF/DOCX extraction</li>
                  <li>• Skill identification</li>
                  <li>• Experience parsing</li>
                </ul>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">NLP Analysis</h3>
                <ul className="text-sm text-pink-100 space-y-1">
                  <li>• Keyword matching</li>
                  <li>• Semantic similarity</li>
                  <li>• Gap detection</li>
                </ul>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Match Scoring</h3>
                <ul className="text-sm text-pink-100 space-y-1">
                  <li>• Skill compatibility</li>
                  <li>• Experience level</li>
                  <li>• Location fit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Data Layer */}
        <div>
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center mb-4">
              <Database className="w-8 h-8 text-white mr-3" />
              <h2 className="text-2xl font-bold text-white">Data Layer</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">PostgreSQL Database</h3>
                <ul className="text-sm text-orange-100 space-y-1">
                  <li>• User profiles & auth</li>
                  <li>• Saved jobs & applications</li>
                  <li>• Resume versions</li>
                </ul>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Redis Cache</h3>
                <ul className="text-sm text-orange-100 space-y-1">
                  <li>• Job listings cache</li>
                  <li>• Session management</li>
                  <li>• API rate limiting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Data Flow */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Key Data Flows</h3>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm">1</span>
              <p>User uploads resume → FastAPI → AI Parser extracts skills → Stored in DB</p>
            </div>
            <div className="flex items-start">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm">2</span>
              <p>User searches jobs → FastAPI calls LinkedIn/Indeed → Results cached in Redis</p>
            </div>
            <div className="flex items-start">
              <span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm">3</span>
              <p>User views job → AI compares resume with job description → Match score calculated</p>
            </div>
            <div className="flex items-start">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm">4</span>
              <p>AI suggests improvements → Displayed in React UI → User updates resume</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
