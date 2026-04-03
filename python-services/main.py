"""
BRAIN HEALTH Python Microservice
FastAPI server for advanced medical analysis including causal inference
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from typing import Optional, Dict, Any
import os

from causal_engine import analyze_causal_relationships

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="BRAIN HEALTH Microservice",
    description="Medical analysis and causal inference service",
    version="1.0.0"
)

# Add CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"},
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint for service monitoring
    """
    return {
        "status": "healthy",
        "service": "BRAIN HEALTH Microservice",
        "version": "1.0.0"
    }


# Causal analysis endpoint
@app.post("/analyze")
async def analyze_medical_data(request: Request):
    """
    Analyze medical data for causal relationships

    Expected JSON body:
    {
        "patientData": {...},
        "variables": ["var1", "var2", ...],
        "outcome": "target_variable",
        "confounders": ["conf1", "conf2", ...]
    }
    """
    try:
        body = await request.json()

        # Validate request
        if not body.get("patientData"):
            raise HTTPException(status_code=400, detail="patientData is required")

        if not body.get("variables"):
            raise HTTPException(status_code=400, detail="variables array is required")

        if not body.get("outcome"):
            raise HTTPException(status_code=400, detail="outcome variable is required")

        # Extract parameters
        patient_data = body.get("patientData", {})
        variables = body.get("variables", [])
        outcome = body.get("outcome")
        confounders = body.get("confounders", [])

        logger.info(f"Processing causal analysis for outcome: {outcome}")

        # Perform causal analysis
        result = analyze_causal_relationships(
            data=patient_data,
            variables=variables,
            outcome=outcome,
            confounders=confounders
        )

        return {
            "success": True,
            "analysis": result,
            "timestamp": __import__('datetime').datetime.now().isoformat()
        }

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to perform analysis")


# Root endpoint
@app.get("/")
async def root():
    """
    API documentation and service information
    """
    return {
        "service": "BRAIN HEALTH Medical Analysis Microservice",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "analyze": "/analyze (POST)",
            "docs": "/docs",
            "openapi": "/openapi.json"
        }
    }


# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("BRAIN HEALTH Microservice starting up...")
    logger.info("Service configuration:")
    logger.info(f"  - CORS enabled for all origins")
    logger.info(f"  - Causal inference engine ready")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("BRAIN HEALTH Microservice shutting down...")


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")

    logger.info(f"Starting server on {host}:{port}")

    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info"
    )
