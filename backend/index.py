"""Vercel ASGI entrypoint for Khipu Legal.

The backend Vercel project uses `backend/` as its Root Directory.
Vercel recognizes `index.py` and imports the exported FastAPI `app`.
"""
from app.main import app  # noqa: F401