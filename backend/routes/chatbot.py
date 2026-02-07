"""
Chatbot Routes

AI-powered FAQ chatbot endpoints.

LEARNING CONCEPTS:
- Conversational AI integration
- Session management
- User feedback/rating systems
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from database import get_db
from models.user import User
from models.chatbot_log import ChatbotLog
from models.faq import FAQ
from schemas import ChatbotQueryRequest, ChatbotQueryResponse, ChatbotFeedbackRequest, MessageResponse
from services.ai_service import generate_chatbot_response
from dependencies import get_optional_user

router = APIRouter()


@router.post("/query", response_model=ChatbotQueryResponse, status_code=status.HTTP_201_CREATED)
async def ask_chatbot(
    query: ChatbotQueryRequest,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    """
    Ask the AI chatbot a question.
    
    LEARNING: Chatbot Context
    
    session_id groups related questions together:
    - User asks: "What is diabetes?"
    - User asks: "What are its symptoms?" (same session)
    - AI knows "its" refers to diabetes
    
    If no session_id provided, create a new one.
    
    Args:
        query: ChatbotQueryRequest with question and optional session_id
        db: Database session
        user: Optional authenticated user
        
    Returns:
        AI response with answer
        
    Example request:
    POST /api/chatbot/query
    {
        "question": "What are the symptoms of diabetes?",
        "session_id": "uuid-here"  // optional
    }
    """
    try:
        # Generate or use existing session ID
        session_id = query.session_id or str(uuid.uuid4())
        
       # Get relevant FAQs to provide context
        """
        LEARNING: RAG (Retrieval Augmented Generation)
        
        Instead of just asking AI the question:
        1. Search our FAQ database for similar questions
        2. Include those FAQs as context for the AI
        3. AI gives more accurate, consistent answers
        
        This is a simplified version of RAG.
        """
        relevant_faqs = get_relevant_faqs(db, query.question)
        
        # Generate AI response
        ai_answer = await generate_chatbot_response(
            question=query.question,
            context_faqs=relevant_faqs,
            session_id=session_id
        )
        
        # Create chat log
        chat_log = ChatbotLog(
            user_id=user.id if user else None,
            question=query.question,
            answer=ai_answer,
            session_id=session_id
        )
        
        db.add(chat_log)
        db.commit()
        db.refresh(chat_log)
        
        return ChatbotQueryResponse.from_orm(chat_log)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chatbot error: {str(e)}"
        )


@router.post("/{chat_id}/feedback", response_model=MessageResponse)
async def rate_chatbot_response(
    chat_id: int,
    feedback: ChatbotFeedbackRequest,
    db: Session = Depends(get_db)
):
    """
    Rate a chatbot response (1-5 stars).
    
    LEARNING: User Feedback Loop
    
    Collecting ratings helps:
    - Identify which responses were helpful
    - Improve AI prompts over time
    - Show analytics to admins
    
    Args:
        chat_id: ID of the chat message to rate
        feedback: Rating (1-5)
        db: Database session
        
    Returns:
        Success message
        
    Example request:
    POST /api/chatbot/123/feedback
    {
        "rating": 5
    }
    """
    # Find chat log
    chat_log = db.query(ChatbotLog).filter(ChatbotLog.id == chat_id).first()
    if not chat_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat message not found"
        )
    
    # Update rating
    chat_log.rating = feedback.rating
    db.commit()
    
    return MessageResponse(
        message="Feedback submitted successfully",
        detail=f"Rated {feedback.rating} stars"
    )


@router.get("/history", response_model=List[ChatbotQueryResponse])
async def get_chat_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    limit: int = 50,
    offset: int = 0
):
    """
    Get user's chat history.
    
    Requires authentication.
    
    Args:
        db: Database session
        user: Current authenticated user
        limit: Max records to return
        offset: Records to skip
        
    Returns:
        List of past chat messages
    """
    from dependencies import get_current_user
    
    chats = (
        db.query(ChatbotLog)
        .filter(ChatbotLog.user_id == user.id)
        .order_by(ChatbotLog.timestamp.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )
    
    return [ChatbotQueryResponse.from_orm(chat) for chat in chats]


def get_relevant_faqs(db: Session, question: str, limit: int = 5) -> List[dict]:
    """
    Find FAQs similar to the question.
    
    LEARNING: Simple Keyword Matching
    
    A simple approach to find relevant FAQs:
    1. Extract keywords from question
    2. Search FAQ questions for those keywords
    3. Return top matches
    
    Better approaches (for v2):
    - Use vector embeddings and similarity search
    - Use full-text search (PostgreSQL's tsvector)
    - Use elasticsearch
    
    Args:
        db: Database session
        question: User's question
        limit: Max FAQs to return
        
    Returns:
        List of relevant FAQ dicts
    """
    # Simple keyword extraction (split and filter short words)
    keywords = [
        word.lower() 
        for word in question.split() 
        if len(word) > 3
    ]
    
    if not keywords:
        return []
    
    # Search for FAQs containing any keyword
    """
    LEARNING: SQL LIKE operator
    
    FAQ.question.ilike(f"%{keyword}%") finds questions containing the keyword.
    ilike = case-insensitive LIKE
    """
    faqs = []
    for keyword in keywords[:3]:  # Use first 3 keywords only
        results = (
            db.query(FAQ)
            .filter(
                FAQ.is_active == True,
                FAQ.question.ilike(f"%{keyword}%")
            )
            .limit(2)
            .all()
        )
        faqs.extend(results)
    
    # Remove duplicates and limit
    unique_faqs = list({faq.id: faq for faq in faqs}.values())[:limit]
    
    return [
        {"question": faq.question, "answer": faq.answer}
        for faq in unique_faqs
    ]
