# AI Smart Assistant Platform 🤖💊📄

A **portfolio-ready** full-stack web application featuring AI-powered health assistance, chatbot, and resume analysis. Built with **React**, **FastAPI**, and **100% free AI models** - fully containerized with Docker for one-command deployment.

[![Tech Stack](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![AI](https://img.shields.io/badge/AI-Free%20Tier-FF6F00)](https://ai.google.dev/)

## 🎯 Project Overview

This platform provides three core AI-powered features:

1. **🩺 AI Symptom Checker** - Analyze symptoms and get possible health conditions with severity levels
2. **💬 AI Chatbot** - Answer health-related FAQs with intelligent conversation
3. **📄 AI Resume Analyzer** - Upload resumes for AI-powered feedback, ATS compatibility, and skill gap analysis

**Perfect for:** Portfolio projects, learning full-stack development, demonstrating AI integration skills

## ✨ Key Features

- ✅ **JWT Authentication** with role-based access (Guest, User, Admin)
- ✅ **Premium UI/UX** with TailwindCSS and Framer Motion animations
- ✅ **Multiple Free AI APIs** (Gemini, Groq, Hugging Face) with automatic fallback
- ✅ **Docker Containerized** - Run entire app with one command
- ✅ **Educational Code** - Extensive comments explaining React & FastAPI concepts
- ✅ **Admin Dashboard** - User management, analytics, FAQ control
- ✅ **Production Ready** - Deployment guides for Vercel, Railway, Render

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **Chart.js** - Analytics visualizations

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - ORM for database management
- **SQLite** - Lightweight database (containerized)
- **Pydantic** - Data validation
- **Python-Jose** - JWT authentication
- **Passlib** - Password hashing

### AI Integration
- **Google Gemini API** - Primary AI (free: 1500 requests/day)
- **Groq** - Fast inference API (free tier)
- **Hugging Face** - Open-source models (free)
- Automatic failover between providers

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Frontend static file serving
- **Uvicorn** - ASGI server for FastAPI

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
- Docker & Docker Compose installed
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-medbot.git
cd ai-medbot
```

### 2. Set Up Environment Variables

Create `.env` file in the `backend` directory:
```env
# Get FREE API keys from:
# Gemini: https://ai.google.dev/
# Groq: https://console.groq.com/
# HuggingFace: https://huggingface.co/settings/tokens

GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=your_hf_token_here

# JWT Secret (generate random string)
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database
DATABASE_URL=sqlite:///./medbot.db

# CORS (adjust for production)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3. Run the Application
```bash
docker-compose up --build
```

That's it! The app is now running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 💻 Local Development (Without Docker)

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
AI-MEDBOT/
│
├── backend/                    # FastAPI Backend
│   ├── main.py                # App entry point
│   ├── config.py              # Environment configuration
│   ├── database.py            # Database setup
│   │
│   ├── models/                # SQLAlchemy Models
│   │   ├── user.py
│   │   ├── symptom_check.py
│   │   ├── chatbot_log.py
│   │   └── resume_analysis.py
│   │
│   ├── routes/                # API Endpoints
│   │   ├── auth.py            # Authentication
│   │   ├── symptoms.py        # Symptom checker
│   │   ├── chatbot.py         # AI chatbot
│   │   ├── resume.py          # Resume analyzer
│   │   └── admin.py           # Admin dashboard
│   │
│   ├── services/              # Business Logic
│   │   ├── ai_service.py      # Multi-provider AI integration
│   │   ├── symptom_checker.py
│   │   ├── chatbot.py
│   │   └── resume_analyzer.py
│   │
│   ├── auth/                  # Authentication
│   │   ├── jwt_handler.py
│   │   └── password.py
│   │
│   └── requirements.txt
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── main.jsx           # React entry point
│   │   │
│   │   ├── pages/             # Route Pages
│   │   │   ├── Home.jsx
│   │   │   ├── SymptomChecker.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── ResumeAnalyzer.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── Auth/
│   │   │       ├── Login.jsx
│   │   │       └── Register.jsx
│   │   │
│   │   ├── components/        # Reusable Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── services/          # API Integration
│   │   │   └── api.js
│   │   │
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   └── index.css          # Global Styles
│   │
│   └── package.json
│
├── Dockerfile.backend         # Backend container
├── Dockerfile.frontend        # Frontend container
├── docker-compose.yml         # Orchestration
├── .gitignore
└── README.md
```

## 🎓 Learning Resources

This project is designed to teach you:

- **React Fundamentals**: Components, Hooks (useState, useEffect, useContext), Routing
- **FastAPI Mastery**: Path operations, Pydantic validation, Dependency injection, Async/Await
- **AI Integration**: Working with multiple AI providers, prompt engineering, fallback strategies
- **Authentication**: JWT tokens, password hashing, protected routes
- **Database**: SQLAlchemy ORM, migrations, relationships
- **Docker**: Containerization, multi-stage builds, orchestration

📖 Check out the [Learning Guide](./LEARNING_GUIDE.md) for detailed explanations!

## 🔑 Getting Free AI API Keys

### Google Gemini (Recommended - Most Generous Free Tier)
1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Free tier: **1,500 requests/day**, 60 requests/minute

### Groq (Fastest Free Inference)
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up and create API key
3. Free tier: **30 requests/minute**

### Hugging Face (Open Source Models)
1. Go to [Hugging Face](https://huggingface.co/)
2. Settings → Access Tokens → Create new token
3. Free tier: Rate limits vary by model

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Symptom Checker
- `POST /api/symptoms/check` - Analyze symptoms
- `GET /api/symptoms/history` - Get user's symptom history (protected)

### Chatbot
- `POST /api/chatbot/query` - Send message to chatbot
- `POST /api/chatbot/feedback` - Submit feedback rating
- `GET /api/chatbot/history` - Get conversation history (protected)

### Resume Analyzer
- `POST /api/resume/analyze` - Upload and analyze resume
- `GET /api/resume/history` - Get analysis history (protected)
- `GET /api/resume/download/{id}` - Download analysis report

### Admin (Admin role required)
- `GET /api/admin/users` - List all users
- `GET /api/admin/analytics` - System statistics
- `PUT /api/admin/users/{id}/role` - Update user role
- CRUD endpoints for FAQ management

Full API documentation at http://localhost:8000/docs (Swagger UI)

## 🌐 Deployment

### Backend Deployment (Railway/Render)

**Railway** (Recommended - Free Tier):
1. Push code to GitHub
2. Connect Railway to your repo
3. Add environment variables
4. Deploy!

**Render** (Alternative):
1. Create new Web Service
2. Connect GitHub repo
3. Build command: `pip install -r backend/requirements.txt`
4. Start command: `cd backend && uvicorn main:app --host 0.0.0.0`

### Frontend Deployment (Vercel/Netlify)

**Vercel** (Recommended):
```bash
cd frontend
npm install -g vercel
vercel
```

**Netlify**:
1. Build command: `cd frontend && npm run build`
2. Publish directory: `frontend/dist`
3. Environment variable: `VITE_API_URL=your_backend_url`

## ⚠️ Important Notes

### Medical Disclaimer
This application provides **informational purposes only** and does NOT constitute medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.

### Privacy & Security
- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- No sensitive health data stored without consent
- Follow GDPR/privacy best practices in production

## 🎨 Screenshots

*Coming soon - Add screenshots of your running application here!*

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Star ⭐ the repository if you find it helpful

## 📝 License

MIT License - feel free to use this project for your own portfolio!

## 👤 Author

**Your Name**
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Google Gemini API for free AI access
- FastAPI framework
- React ecosystem
- TailwindCSS for beautiful styling

---

⭐ **Star this repo if it helped you build your portfolio!**

Built with ❤️ for learning and showcasing full-stack + AI skills
