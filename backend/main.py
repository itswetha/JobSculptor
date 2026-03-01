from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
import os
import io
import json
import re
import requests
from PyPDF2 import PdfReader
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not RAPIDAPI_KEY:
    raise RuntimeError("RAPIDAPI_KEY is not set in environment variables")
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY is not set in environment variables")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI(title="Job Finder AI API", version="1.0.0")


# CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchJobsRequest(BaseModel):
    skills: str
    location: str
    job_type: str
    experience_level: str


class MatchJobsRequest(BaseModel):
    user_skills: List[str]
    jobs: List[Dict[str, Any]]


def _extract_text_from_pdf(upload: UploadFile) -> str:
    try:
        contents = upload.file.read()
        reader = PdfReader(io.BytesIO(contents))
        texts: List[str] = []
        for page in reader.pages:
            try:
                page_text = page.extract_text() or ""
            except Exception:
                page_text = ""
            texts.append(page_text)
        return "\n".join(texts).strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {e}")


def _format_salary(item: Dict[str, Any]) -> Optional[str]:
    min_sal = item.get("job_min_salary")
    max_sal = item.get("job_max_salary")
    currency = item.get("job_salary_currency")
    if min_sal is None and max_sal is None:
        return None
    parts = []
    if min_sal is not None and max_sal is not None:
        parts.append(f"{min_sal}-{max_sal}")
    elif min_sal is not None:
        parts.append(f"{min_sal}+")
    elif max_sal is not None:
        parts.append(f"up to {max_sal}")
    if currency:
        parts.append(currency)
    return " ".join(parts)


def _clean_json_response(content: str) -> str:
    """Clean up Gemini response to extract valid JSON"""
    content = content.strip()
    
    # Remove markdown code blocks
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    
    content = content.strip()
    
    # Try to extract JSON object using regex
    json_match = re.search(r'\{.*\}', content, re.DOTALL)
    if json_match:
        content = json_match.group(0)
    
    return content


@app.post("/search_jobs/")
def search_jobs(payload: SearchJobsRequest):
    try:
        query_parts = [payload.skills]
        if payload.location:
            query_parts.append(payload.location)
        if payload.job_type:
            query_parts.append(payload.job_type)
        if payload.experience_level:
            query_parts.append(payload.experience_level)
        query = " ".join([p for p in query_parts if p]).strip()

        url = "https://jsearch.p.rapidapi.com/search"
        headers = {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        }
        params = {
            "query": query,
            "page": "1",
            "num_pages": "1",
        }
        resp = requests.get(url, headers=headers, params=params, timeout=30)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=f"JSearch error: {resp.text}")
        data = resp.json()
        jobs_raw = data.get("data", [])
        jobs = []
        for item in jobs_raw:
            jobs.append({
                "title": item.get("job_title"),
                "company": item.get("employer_name"),
                "location": ", ".join(filter(None, [item.get("job_city"), item.get("job_state"), item.get("job_country")])),
                "description": item.get("job_description"),
                "url": item.get("job_apply_link") or item.get("job_google_link"),
                "salary": _format_salary(item),
            })
        return {"results": jobs}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze_resume/")
async def analyze_resume(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
):
    try:
        if resume_file.content_type not in ["application/pdf", "application/octet-stream"]:
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        resume_text = _extract_text_from_pdf(resume_file)
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        prompt = f"""You are an expert career coach and resume analyst. Analyze the resume against the job description.
Return ONLY a valid JSON object (no other text, no markdown) with these exact keys:
- match_score: integer from 0 to 100
- strengths: array of strings (max 5 items)
- missing_skills: array of strings (max 5 items)
- suggestions: array of strings (max 5 items)

Resume:
{resume_text[:12000]}

Job Description:
{job_description[:8000]}

Remember: Return ONLY valid JSON, no explanations or markdown."""

        model = genai.GenerativeModel(
            'models/gemini-2.5-flash',
            generation_config={"response_mime_type": "application/json"}
        )
        response = model.generate_content(prompt)
        content = _clean_json_response(response.text)
        
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}. Response: {content[:200]}")

        # Validate expected keys
        result = {
            "match_score": max(0, min(100, int(parsed.get("match_score", 0)))),
            "strengths": (parsed.get("strengths", []) or [])[:5],
            "missing_skills": (parsed.get("missing_skills", []) or [])[:5],
            "suggestions": (parsed.get("suggestions", []) or [])[:5],
        }
        return JSONResponse(content=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {e}")


@app.post("/match_jobs/")
def match_jobs(payload: MatchJobsRequest):
    try:
        # Constrain payload size
        jobs_sample = payload.jobs[:20]
        user_skills = payload.user_skills[:50]

        # Simplify job data for AI processing
        simplified_jobs = []
        for i, job in enumerate(jobs_sample):
            simplified_jobs.append({
                "index": i,
                "title": job.get("title", ""),
                "company": job.get("company", ""),
                "description": (job.get("description", "") or "")[:500]  # Limit description length
            })

        prompt = f"""You are an AI that rates job relevance to a candidate's skills.
Analyze each job and return a match score from 0 to 100 based on how well the user's skills match the job requirements.

User Skills: {json.dumps(user_skills)}

Jobs to analyze: {json.dumps(simplified_jobs)}

Return ONLY a valid JSON object (no other text, no markdown) with this structure:
{{"results": [{{"index": 0, "match_score": 85}}, {{"index": 1, "match_score": 72}}, ...]}}

Remember: Return ONLY valid JSON."""

        model = genai.GenerativeModel(
            'models/gemini-2.5-flash',
            generation_config={"response_mime_type": "application/json"}
        )
        response = model.generate_content(prompt)
        content = _clean_json_response(response.text)
        
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}. Response: {content[:200]}")
        
        results = parsed.get("results", [])
        if not results:
            raise HTTPException(status_code=500, detail="AI returned no results")

        # Map scores back to jobs
        index_to_score = {}
        for item in results:
            try:
                idx = int(item.get("index", -1))
                score = int(item.get("match_score", 0))
                index_to_score[idx] = max(0, min(100, score))
            except (ValueError, TypeError):
                continue
        
        scored_jobs = []
        for i, job in enumerate(jobs_sample):
            score = index_to_score.get(i, 50)  # Default to 50 if no score
            new_job = dict(job)
            new_job["match_score"] = score
            scored_jobs.append(new_job)

        scored_jobs.sort(key=lambda j: j.get("match_score", 0), reverse=True)
        return {"results": scored_jobs}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job matching failed: {e}")


@app.get("/")
def root():
    return {"status": "ok", "service": "Job Finder AI API"}