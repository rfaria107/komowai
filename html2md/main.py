from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import httpx
from markitdown import MarkItDown
import tempfile
import os
import time

app = FastAPI(
    title="html2md",
    description="Convert any URL's HTML or binary file (PDF, DOCX) to Markdown via Microsoft's MarkItDown",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

md_converter = MarkItDown()


class ConvertRequest(BaseModel):
    url: HttpUrl
    timeout: int = 30


class ConvertResponse(BaseModel):
    url: str = None
    filename: str = None
    markdown: str
    char_count: int
    elapsed_ms: int


class DiscoveryRequest(BaseModel):
    keywords: str = "Software Engineer"
    limit: int = 10


class JobBrief(BaseModel):
    id: str
    title: str
    company: str
    url: str


class DiscoveryResponse(BaseModel):
    jobs: list[JobBrief]
    count: int


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/convert", response_model=ConvertResponse)
async def convert(req: ConvertRequest):
    start = time.monotonic()
    url_str = str(req.url)

    # Use a realistic browser User-Agent to avoid immediate bot detection
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    # --- LinkedIn Bypass Logic ---
    if "linkedin.com" in url_str.lower():
        import re
        # Try to extract the Job ID from various LinkedIn URL formats
        job_id_match = re.search(r"view/(\d+)", url_str) or re.search(r"currentJobId=(\d+)", url_str)

        if job_id_match:
            job_id = job_id_match.group(1)
            # Use the "Guest" API endpoint which usually bypasses the login wall
            target_url = f"https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"
            print(f"SCRAPER: LinkedIn detected. Using Guest API bypass for Job ID: {job_id}")
        else:
            # Fallback to Jina if we can't find an ID
            target_url = f"https://r.jina.ai/{url_str}"
            print(f"SCRAPER: LinkedIn detected but no ID found, proxying via Jina: {target_url}")
    else:
        target_url = url_str

    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=req.timeout,
            headers=headers,
            verify=False
        ) as client:
            response = await client.get(target_url)
            response.raise_for_status()

            # Simple check for the "authwall" or login redirect
            if "login" in str(response.url).lower() or "authwall" in response.text.lower():
                 print("SCRAPER WARNING: Still hitting a login wall. Try copying the text manually.")
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail=f"Upstream timed out after {req.timeout}s")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Upstream returned {e.response.status_code}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Write to temp file and run MarkItDown
    try:
        suffix = ".html"
        if "jina.ai" in target_url:
            suffix = ".md" # Jina returns markdown directly
            
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False, mode="wb") as tmp:
            tmp.write(response.content)
            tmp_path = tmp.name

        result = md_converter.convert(tmp_path)
        markdown = result.text_content or ""
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {e}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

    elapsed_ms = int((time.monotonic() - start) * 1000)

    return ConvertResponse(
        url=url_str,
        markdown=markdown,
        char_count=len(markdown),
        elapsed_ms=elapsed_ms,
    )


@app.post("/convert/file", response_model=ConvertResponse)
async def convert_file(file: UploadFile = File(...)):
    start = time.monotonic()
    
    # Save uploaded file to temp
    try:
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        result = md_converter.convert(tmp_path)
        markdown = result.text_content or ""
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File conversion failed: {e}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

    elapsed_ms = int((time.monotonic() - start) * 1000)

    return ConvertResponse(
        filename=file.filename,
        markdown=markdown,
        char_count=len(markdown),
        elapsed_ms=elapsed_ms,
    )


@app.post("/discover", response_model=DiscoveryResponse)
async def discover(req: DiscoveryRequest):
    start = time.monotonic()
    
    # LinkedIn Guest Search API
    # https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Software%20Engineer
    import urllib.parse
    keywords_encoded = urllib.parse.quote(req.keywords)
    search_url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={keywords_encoded}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }
    
    jobs = []
    try:
        async with httpx.AsyncClient(headers=headers, follow_redirects=True, verify=False) as client:
            response = await client.get(search_url)
            response.raise_for_status()
            
            # Use basic regex to find job cards in the HTML fragment LinkedIn returns
            import re
            job_ids = re.findall(r'urn:li:jobPosting:(\d+)', response.text)
            titles = re.findall(r'<h3 class="base-search-card__title">\s*(.*?)\s*</h3>', response.text, re.DOTALL)
            companies = re.findall(r'<h4 class="base-search-card__subtitle">\s*(.*?)\s*</h4>', response.text, re.DOTALL)
            
            # Zip them together and limit
            for jid, title, company in zip(job_ids, titles, companies):
                if len(jobs) >= req.limit:
                    break
                
                # Basic HTML tag stripping for title and company
                clean_title = re.sub('<[^<]+?>', '', title).strip()
                clean_company = re.sub('<[^<]+?>', '', company).strip()
                
                jobs.append(JobBrief(
                    id=jid,
                    title=clean_title,
                    company=clean_company,
                    url=f"https://www.linkedin.com/jobs/view/{jid}"
                ))
                
    except Exception as e:
        print(f"DISCOVERY ERROR: {e}")
        
    return DiscoveryResponse(jobs=jobs, count=len(jobs))
