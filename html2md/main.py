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

    # If it's LinkedIn, we might want to try Jina Reader directly from Python 
    # to avoid the Java SSL issue and leverage Jina's proxying.
    target_url = url_str
    if "linkedin.com" in url_str.lower():
        target_url = f"https://r.jina.ai/{url_str}"
        print(f"SCRAPER: LinkedIn detected, proxying via Jina: {target_url}")

    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=req.timeout,
            headers=headers,
            verify=False # Disable SSL verification to bypass potential proxy/cert issues in the environment
        ) as client:
            response = await client.get(target_url)
            response.raise_for_status()
            
            # Check if we still hit a login wall (even via Jina)
            if "login" in response.url.path.lower() or "authwall" in response.text.lower():
                 print("SCRAPER WARNING: Hit a login wall or auth redirect.")
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
