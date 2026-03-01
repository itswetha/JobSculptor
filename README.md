<<<<<<< HEAD
# JodSculptor
Refine your resume and match your skills with the best jobs and internships using AI
=======
# Job Finder AI

An AI-powered Job & Internship Finder with professional blue-white theme.

## Tech Stack
- Frontend: React + Vite + TailwindCSS + React Router + Axios
- Backend: FastAPI (Python)
- APIs: RapidAPI JSearch + OpenAI GPT-4

## Project Structure
```
job-finder-ai/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── env.example  (copy to .env)
│   └── README.md
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── HomePage.jsx
    │   │   ├── JobResults.jsx
    │   │   ├── ResumeAnalyzer.jsx
    │   │   └── Navbar.jsx
    │   ├── api/client.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── index.html
```

## Prerequisites
- Node.js 18+
- Python 3.10+

## Backend Setup (FastAPI)
1. Open a terminal:
```bash
cd backend
python -m venv .venv
# PowerShell
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
```
2. Environment variables:
```bash
copy env.example .env
```
Edit `.env` and set:
- `RAPIDAPI_KEY` (RapidAPI JSearch)
- `OPENAI_API_KEY` (OpenAI)

3. Run the API:
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Frontend Setup (React + Vite + Tailwind)
1. Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://127.0.0.1:5173`.

## Features
- AI Matching: Scores job relevance to your skills
- Resume Analysis: Strengths, missing skills, and suggestions
- Smart Rankings: Color-coded badges and sorted results

## Notes
- Backend CORS allows `http://localhost:5173` and `http://127.0.0.1:5173`.
- Ensure your resume PDF contains selectable text (not just scanned images).
- All network requests have error handling and user-friendly messages.
>>>>>>> 491a42a (Initial commit)
