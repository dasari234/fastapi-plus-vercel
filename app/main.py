from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.main import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# API routes
app.include_router(
    api_router,
    prefix=settings.API_V1_STR,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://react-vercel-g4vy.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def debug_exception_handler(
    request: Request,
    exc: Exception,
):
    import traceback

    tb = "".join(
        traceback.format_exception(
            type(exc),
            exc,
            exc.__traceback__,
        )
    )

    print(
        f"\n--- CRITICAL APPLICATION ERROR ---\n"
        f"{tb}"
        f"\n----------------------------------"
    )

    return JSONResponse(
        status_code=500,
        content={
            "error": str(exc),
            "type": type(exc).__name__,
        },
    )

@app.get("/")
def read_root():
    return {
        "service": "FastAPI",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
        "api": "/api/v1",
    }
    
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "FastAPI",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=5001,
        reload=True,
    )