import traceback
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from app.api.main import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_NAME,
    version=settings.VERSION,
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# 1. Resolve an absolute path to the templates folder
BASE_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = BASE_DIR / "templates"

# Diagnostic check visible in terminal upon startup
print(f"\n[DEBUG] Searching for templates at: {TEMPLATES_DIR}")
print(f"[DEBUG] index.html exists here: {(TEMPLATES_DIR / 'index.html').exists()}\n")

templates = Jinja2Templates(directory=TEMPLATES_DIR)


@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse(
        request, 
        "index.html", 
        {"request": request}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "https://your-react-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Add an explicit error catcher to expose the full hidden traceback in the console
@app.exception_handler(Exception)
async def debug_exception_handler(request: Request, exc: Exception):
    tb = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
    print(f"\n--- CRITICAL APPLICATION ERROR ---\n{tb}\n----------------------------------")
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "type": type(exc).__name__}
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True)
