"""
Resume Analyzer Routes

AI-powered resume analysis and feedback.

LEARNING CONCEPTS:
- File upload handling
- PDF/DOCX parsing
- Scoring systems
- JSON response formatting
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import os
import PyPDF2
from docx import Document
from datetime import datetime

from database import get_db
from models.user import User
from models.resume_analysis import ResumeAnalysis
from schemas import ResumeAnalysisResponse
from services.ai_service import generate_resume_feedback
from dependencies import get_current_user
from config import settings

router = APIRouter()


@router.post("/analyze", response_model=ResumeAnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze_resume(
    file: UploadFile = File(..., description="Resume file (PDF or DOCX)"),
    target_role: str = Form(..., description="Target job role"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Analyze a resume with AI.
    
    LEARNING: File Upload in FastAPI
    
    UploadFile handles multipart/form-data requests:
    - Frontend sends file via FormData
    - FastAPI receives as UploadFile object
    - We can read file.filename, file.content_type, etc.
    
    Args:
        file: Uploaded resume file
        target_role: Job role for targeted feedback
        db: Database session
        user: Current authenticated user (required)
        
    Returns:
        Analysis with score and feedback
        
    Example request (multipart/form-data):
    POST /api/resume/analyze
    Headers:
        Authorization: Bearer <token>
        Content-Type: multipart/form-data
    Body:
        file: [resume.pdf]
        target_role: "Software Engineer"
    """
    try:
        # Validate file type
        """
        LEARNING: File Validation
        
        Check file extension andcontent type to prevent:
        - Malicious files
        - Unsupported formats
        - Server crashes from unexpected file types
        """
        allowed_extensions = [".pdf", ".docx"]
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Read and parse file content
        file_content = await file.read()
        resume_text = extract_text_from_file(file_content, file_ext)
        
        if not resume_text or len(resume_text) < 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract meaningful text from resume"
            )
        
        # Save file to uploads directory
        """
        LEARNING: File Storage
        
        Best practices:
        1. Generate unique filename (user_id + timestamp)
        2. Store in organized directory structure
        3. Save path in database, not file content
        4. Clean up old files periodically
        """
        upload_dir = "uploads/resumes"
        os.makedirs(upload_dir, exist_ok=True)
        
        filename = f"{user.id}_{int(datetime.now().timestamp())}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        # Get AI analysis
        ai_result = await generate_resume_feedback(
            resume_text=resume_text,
            target_role=target_role
        )
        
        # Create resume analysis record
        analysis = ResumeAnalysis(
            user_id=user.id,
            filename=file.filename,
            file_path=file_path,
            file_size=len(file_content),
            target_role=target_role,
            overall_score=ai_result["overall_score"],
            ats_score=ai_result.get("ats_score"),
            feedback_json=ai_result.get("feedback"),
            summary=ai_result["summary"]
        )
        
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        return ResumeAnalysisResponse.from_orm(analysis)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze resume: {str(e)}"
        )


@router.get("/history", response_model=List[ResumeAnalysisResponse])
async def get_resume_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    limit: int = 20,
    offset: int = 0
):
    """
    Get user's resume analysis history.
    
    Args:
        db: Database session
        user: Current authenticated user
        limit: Max records to return
        offset: Records to skip
        
    Returns:
        List of past resume analyses
    """
    analyses = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.user_id == user.id)
        .order_by(ResumeAnalysis.timestamp.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )
    
    return [ResumeAnalysisResponse.from_orm(analysis) for analysis in analyses]


@router.get("/{analysis_id}", response_model=ResumeAnalysisResponse)
async def get_resume_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Get a specific resume analysis.
    
    LEARNING: Authorization Check
    
    Not only must user be authenticated,
    they can only view their OWN resume analyses.
    
    Args:
        analysis_id: ID of the analysis
        db: Database session
        user: Current authenticated user
        
    Returns:
        Resume analysis details
    """
    analysis = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.id == analysis_id,
        ResumeAnalysis.user_id == user.id  # Ensure ownership
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume analysis not found"
        )
    
    return ResumeAnalysisResponse.from_orm(analysis)


def extract_text_from_file(file_content: bytes, file_ext: str) -> str:
    """
    Extract text from PDF or DOCX file.
    
    LEARNING: File Parsing
    
    Different file formats require different parsing libraries:
    - PDF: PyPDF2
    - DOCX: python-docx
    - TXT: Just decode bytes
    
    Args:
        file_content: Raw file bytes
        file_ext: File extension (.pdf or .docx)
        
    Returns:
        Extracted text content
    """
    import io
    
    if file_ext == ".pdf":
        # Parse PDF
        """
        LEARNING: PDF Parsing with PyPDF2
        
        1. Create PDF reader from bytes
        2. Iterate through pages
        3. Extract text from each page
        4. Join all text together
        """
        try:
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            return text.strip()
        except Exception as e:
            raise ValueError(f"Failed to parse PDF: {str(e)}")
    
    elif file_ext == ".docx":
        # Parse DOCX
        """
        LEARNING: DOCX Parsing with python-docx
        
        1. Create Document from bytes
        2. Iterate through paragraphs
        3. Extract text from each paragraph
        4. Join with newlines
        """
        try:
            docx_file = io.BytesIO(file_content)
            doc = Document(docx_file)
            
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise ValueError(f"Failed to parse DOCX: {str(e)}")
    
    else:
        raise ValueError(f"Unsupported file extension: {file_ext}")
