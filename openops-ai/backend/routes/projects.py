from fastapi import APIRouter, File, HTTPException, UploadFile, status

from models.project import ProjectResponse
from services.projects import create_project_from_zip

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/upload", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def upload_project(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".zip"):
        raise HTTPException(status_code=400, detail="Upload a .zip archive.")
    try:
        return create_project_from_zip(file.filename, await file.read())
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
