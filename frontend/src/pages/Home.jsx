/**
 * Home Page with Premium 3D Effects
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './Home.css'; // Custom CSS for 3D effects

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            title: 'AI Symptom Checker',
            description: 'Get instant AI-powered insights about your symptoms with severity classification and personalized recommendations.',
            icon: '🏥',
            link: '/symptom-checker',
            color: 'from-blue-500 to-blue-600',
            gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
        },
        {
            title: 'Smart Chatbot',
            description: 'Ask health-related questions and get intelligent, context-aware responses powered by advanced AI.',
            icon: '💬',
            link: '/chatbot',
            color: 'from-purple-500 to-purple-600',
            gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
        },
        {
            title: 'Resume Analyzer',
            description: 'Upload your resume and get AI-powered feedback with ATS compatibility scoring and improvement suggestions.',
            icon: '📄',
            link: isAuthenticated ? '/resume-analyzer' : '/login',
            color: 'from-green-500 to-green-600',
            gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
        }
    ];

    return (
        <div className="relative overflow-hidden">
            {/* Animated background particles */}
            <div className="particles-container">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>

            <div className="space-y-24 relative z-10">
                {/* Hero Section with 3D elements */}
                <section className="text-center py-24 relative perspective-container">
                    <div className="max-w-5xl mx-auto">
                        {/* Floating 3D Logo */}
                        <div className="hero-logo-3d mb-8">
                            <div className="logo-cube">
                                <div className="cube-face cube-front">🤖</div>
                                <div className="cube-face cube-back">AI</div>
                                <div className="cube-face cube-right">💊</div>
                                <div className="cube-face cube-left">📊</div>
                                <div className="cube-face cube-top">🏥</div>
                                <div className="cube-face cube-bottom">✨</div>
                            </div>
                        </div>

                        <h1 className="text-7xl md:text-8xl font-black text-white mb-8 drop-shadow-2xl animate-fade-in">
                            <span className="block hero-text-3d">Your AI-Powered</span>
                            <span className="block mt-4 hero-gradient-text hero-text-3d">
                                Smart Assistant
                            </span>
                        </h1>

                        <p className="text-2xl md:text-3xl text-white/95 mb-12 drop-shadow-lg max-w-3xl mx-auto animate-slide-in leading-relaxed">
                            Leverage cutting-edge AI for <span className="font-bold text-yellow-300">symptom analysis</span>,
                            <span className="font-bold text-pink-300"> intelligent conversations</span>,
                            and <span className="font-bold text-cyan-300">resume optimization</span>
                        </p>

                        <div className="flex gap-6 justify-center flex-wrap animate-fade-in stagger-2">
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="transform hover:scale-105 transition-transform">
                                    <Button variant="primary" size="lg" className="text-xl px-10 py-5 btn-3d shadow-2xl">
                                        Go to Dashboard →
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="transform hover:scale-105 transition-transform">
                                        <Button variant="primary" size="lg" className="text-xl px-10 py-5 btn-3d shadow-2xl">
                                            ✨ Get Started Free
                                        </Button>
                                    </Link>
                                    <Link to="/symptom-checker" className="transform hover:scale-105 transition-transform">
                                        <Button variant="outline" size="lg" className="text-xl px-10 py-5 bg-white/95 backdrop-blur btn-3d shadow-2xl">
                                            🔬 Try It Now
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Floating decorative elements */}
                    <div className="floating-orb orb-1"></div>
                    <div className="floating-orb orb-2"></div>
                    <div className="floating-orb orb-3"></div>
                </section>

                {/* Features Section with 3D Cards */}
                <section className="relative">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg hero-text-3d">
                            Powerful AI Features
                        </h2>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Everything you need to leverage AI for health and career advancement
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
                        {features.map((feature, index) => (
                            <Link
                                to={feature.link}
                                key={index}
                                className={`card-3d animate-fade-in stagger-${index + 1}`}
                            >
                                <div className="card-3d-inner">
                                    <div className="card-3d-front glass-card p-8 rounded-2xl h-full">
                                        {/* 3D Icon */}
                                        <div
                                            className="icon-3d mb-6"
                                            style={{ background: feature.gradient }}
                                        >
                                            <span className="text-6xl">{feature.icon}</span>
                                        </div>

                                        <h3 className="text-3xl font-bold text-gray-800 mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                            {feature.description}
                                        </p>

                                        <div className="flex items-center text-primary-600 font-semibold text-lg">
                                            Explore Feature
                                            <svg className="w-6 h-6 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Stats Section with 3D counters */}
                <section className="py-16 relative">
                    <div className="glass-card p-12 rounded-3xl max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="stat-3d">
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
                                    10K+
                                </div>
                                <div className="text-xl text-gray-700 font-medium">Symptoms Analyzed</div>
                            </div>
                            <div className="stat-3d">
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                                    50K+
                                </div>
                                <div className="text-xl text-gray-700 font-medium">AI Conversations</div>
                            </div>
                            <div className="stat-3d">
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-600 mb-2">
                                    5K+
                                </div>
                                <div className="text-xl text-gray-700 font-medium">Resumes Improved</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Medical Disclaimer */}
                <section className="glass-card border-2 border-yellow-300 rounded-2xl p-8 max-w-4xl mx-auto">
                    <div className="flex items-start gap-6">
                        <div className="text-6xl animate-pulse">⚠️</div>
                        <div>
                            <h3 className="text-2xl font-bold text-yellow-800 mb-3">Important Medical Disclaimer</h3>
                            <p className="text-yellow-700 text-lg leading-relaxed">
                                This platform is an educational project and NOT a substitute for professional medical advice,
                                diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.
                                AI-generated content may contain errors or inaccuracies.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
