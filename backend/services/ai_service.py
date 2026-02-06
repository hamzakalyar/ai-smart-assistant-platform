"""
Multi-Provider AI Service

This service integrates multiple FREE AI providers with automatic failover:
1. Google Gemini (primary - most generous free tier)
2. Groq (secondary - fastest inference)
3. Hugging Face (tertiary - open source models)

LEARNING CONCEPTS:
- API integration with multiple providers
- Failover/redundancy patterns
- Prompt engineering
- Error handling and retries
"""

import logging
from typing import Optional, Dict, Any
from enum import Enum

# AI Provider SDKs
try:
    import google.generativeai as genai
except ImportError:
    genai = None

try:
    from groq import Groq
except ImportError:
    Groq = None

import requests

from config import settings

logger = logging.getLogger(__name__)


class AIProvider(Enum):
    """
    LEARNING: Enums
    
    Enums are a way to define a set of named constants.
    Better than using strings because:
    - Type checking catches typos
    - IDE autocomplete
    - Clear documentation of available options
    """
    GEMINI = "gemini"
    GROQ = "groq"
    HUGGINGFACE = "huggingface"


class AIService:
    """
    Multi-provider AI service with automatic failover.
    
    This class attempts to use AI providers in order of preference:
    1. Gemini (best free tier)
    2. Groq (fastest)
    3. Hugging Face (open source)
    
    If one fails, it automatically tries the next.
    """
    
    def __init__(self):
        """Initialize AI providers based on available API keys."""
        self.providers = []
        
        # Configure Gemini
        if settings.GEMINI_API_KEY and genai:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
                self.providers.append(AIProvider.GEMINI)
                logger.info("✅ Gemini AI configured")
            except Exception as e:
                logger.warning(f"⚠️  Gemini configuration failed: {e}")
        
        # Configure Groq
        if settings.GROQ_API_KEY and Groq:
            try:
                self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
                self.providers.append(AIProvider.GROQ)
                logger.info("✅ Groq AI configured")
            except Exception as e:
                logger.warning(f"⚠️  Groq configuration failed: {e}")
        
        # Hugging Face (requires API key)
        if settings.HUGGINGFACE_API_KEY:
            self.hf_headers = {"Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}"}
            self.providers.append(AIProvider.HUGGINGFACE)
            logger.info("✅ Hugging Face configured")
        
        if not self.providers:
            logger.error("❌ No AI providers configured! Add API keys to .env file")
    
    async def generate_response(
        self,
        prompt: str,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        system_message: Optional[str] = None
    ) -> str:
        """
        Generate AI response with automatic failover.
        
        Args:
            prompt: The user's prompt/question
            max_tokens: Maximum tokens in response
            temperature: Creativity (0=focused, 1=creative)
            system_message: System instruction for the AI
        
        Returns:
            Generated text response
        
        Raises:
            Exception: If all providers fail
        """
        if not self.providers:
            raise Exception("No AI providers configured. Please add API keys to .env file")
        
        # Try each provider in order
        for provider in self.providers:
            try:
                logger.info(f"🤖 Attempting {provider.value}...")
                
                if provider == AIProvider.GEMINI:
                    response = await self._generate_gemini(prompt, system_message)
                elif provider == AIProvider.GROQ:
                    response = await self._generate_groq(prompt, max_tokens, temperature, system_message)
                elif provider == AIProvider.HUGGINGFACE:
                    response = await self._generate_huggingface(prompt, max_tokens)
                
                logger.info(f"✅ Response generated using {provider.value}")
                return response
                
            except Exception as e:
                logger.warning(f"⚠️  {provider.value} failed: {e}")
                continue
        
        # All providers failed
        raise Exception("All AI providers failed. Please check your API keys and internet connection.")
    
    async def _generate_gemini(self, prompt: str, system_message: Optional[str] = None) -> str:
        """
        Generate response using Google Gemini.
        
        LEARNING: Gemini API
        - Free tier: 60 requests/min, 1500/day
        - Best for: General text generation
        - Models: gemini-pro (text), gemini-pro-vision (images)
        """
        full_prompt = f"{system_message}\n\n{prompt}" if system_message else prompt
        
        response = self.gemini_model.generate_content(full_prompt)
        return response.text
    
    async def _generate_groq(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float,
        system_message: Optional[str] = None
    ) -> str:
        """
        Generate response using Groq.
        
        LEARNING: Groq API
        - Free tier: 30 requests/minute
        - Best for: Fast inference (very quick responses)
        - Models: mixtral, llama, etc.
        """
        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})
        
        response = self.groq_client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return response.choices[0].message.content
    
    async def _generate_huggingface(self, prompt: str, max_tokens: int) -> str:
        """
        Generate response using Hugging Face Inference API.
        
        LEARNING: Hugging Face
        - Free tier: Rate limits vary by model
        - Best for: Open source models
        - Many models available
        """
        api_url = f"https://api-inference.huggingface.co/models/{settings.HUGGINGFACE_MODEL}"
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_tokens,
                "return_full_text": False
            }
        }
        
        response = requests.post(api_url, headers=self.hf_headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        
        # Handle different response formats
        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "")
        elif isinstance(result, dict):
            return result.get("generated_text", "")
        else:
            raise Exception(f"Unexpected response format: {result}")


# Create singleton instance
ai_service = AIService()


# ==================== HELPER FUNCTIONS ====================

async def generate_symptom_analysis(symptoms: str, age: int, gender: str, duration: str) -> Dict[str, Any]:
    """
    Analyze symptoms using AI.
    
    Returns dict with:
    - conditions: List of possible conditions
    - severity: Low/Medium/High
    - precautions: List of recommendations
    - disclaimer: Medical disclaimer
    """
    system_message = """You are a medical information assistant. Provide general health information only.
    Always include a disclaimer that this is NOT medical advice and users should consult healthcare professionals."""
    
    prompt = f"""Analyze these symptoms and provide health information:

Symptoms: {symptoms}
Age: {age}
Gender: {gender}
Duration: {duration}

Provide a JSON response with:
1. possible_conditions: List of 3-5 possible conditions (not diagnoses)
2. severity: "Low", "Medium", or "High"
3. precautions: List of 3-5 general precautions
4. when_to_see_doctor: Specific warning signs

Remember: This is information only, NOT medical advice."""
    
    response = await ai_service.generate_response(prompt, system_message=system_message, temperature=0.3)
    
    # Parse response and add disclaimer
    return {
        "ai_response": response,
        "disclaimer": "⚠️ This is general health information only, NOT medical advice. Always consult qualified healthcare professionals for medical concerns."
    }


async def generate_chatbot_response(question: str, conversation_history: Optional[list] = None) -> str:
    """
    Generate chatbot response for health-related questions.
    """
    system_message = """You are a helpful health information chatbot. Provide accurate, friendly responses
    to general health questions. Always be empathetic and include disclaimers when appropriate."""
    
    # Include conversation history for context
    if conversation_history:
        context = "\n".join([f"User: {msg['user']}\nBot: {msg['bot']}" for msg in conversation_history[-3:]])
        prompt = f"Previous conversation:\n{context}\n\nUser: {question}"
    else:
        prompt = question
    
    return await ai_service.generate_response(prompt, system_message=system_message, temperature=0.7)


async def analyze_resume(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Analyze resume and provide feedback.
    
    Returns dict with:
    - score: 0-100
    - strengths: List of strengths
    - improvements: List of improvements
    - ats_score: ATS compatibility score
    - keyword_analysis: Relevant keywords found/missing
    """
    system_message = """You are a professional resume reviewer and career coach.
    Provide constructive, actionable feedback."""
    
    prompt = f"""Analyze this resume for a {target_role} position:

{resume_text}

Provide detailed feedback in JSON format with:
1. overall_score: 0-100
2. strengths: List of 3-5 strong points
3. improvements: List of 3-5 specific improvements
4. ats_compatibility: Score 0-100 (keyword matching, formatting)
5. missing_keywords: Important keywords for {target_role} that are missing
6. formatting_feedback: Comments on structure and readability"""
    
    response = await ai_service.generate_response(prompt, system_message=system_message, temperature=0.4)
    
    return {"analysis": response}
