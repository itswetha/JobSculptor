# Job Finder AI - Backend (FastAPI)

## Prerequisites
- Python 3.10+

## Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment (recommended):
```bash
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
# or CMD
.venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Environment variables:
- Copy `env.example` to `.env` and fill in your keys.
```bash
copy env.example .env
```
- Required keys:
  - `RAPIDAPI_KEY` = your RapidAPI key for JSearch
  - `OPENAI_API_KEY` = your OpenAI API key

## Run
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

API base: `http://127.0.0.1:8000`

CORS allows `http://localhost:5173` and `http://127.0.0.1:5173`.

## Endpoints
- `POST /search_jobs/`
  - Body (JSON): `{ "skills": str, "location": str, "job_type": str, "experience_level": str }`
  - Calls RapidAPI JSearch and returns normalized job results

- `POST /analyze_resume/`
  - Multipart form:
    - `resume_file`: PDF file
    - `job_description`: string
  - Extracts text via PyPDF2 and requests an AI analysis from OpenAI

- `POST /match_jobs/`
  - Body (JSON): `{ "user_skills": string[], "jobs": Job[] }`
  - Uses OpenAI to score relevance and returns jobs sorted by `match_score`

## Notes
- Ensure your PDF is readable text (scanned images without OCR will not extract).
- Timeouts and errors are handled with descriptive messages and HTTP codes.
