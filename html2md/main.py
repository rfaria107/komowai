from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import httpx
from markitdown import MarkItDown
import tempfile
import os
import time
 
app = FastAPI(
    title="html2md",
    description="Convert any URL's HTML to Markdown via Microsoft's MarkItDown",
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
    url: str
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
 
    # Fetch HTML
    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=req.timeout,
            headers={"User-Agent": "html2md-microservice/1.0"},
        ) as client:
            response = await client.get(url_str)
            response.raise_for_status()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail=f"Upstream timed out after {req.timeout}s")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Upstream returned {e.response.status_code}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
 
    # Write to temp file and run MarkItDown
    try:
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="wb") as tmp:
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
