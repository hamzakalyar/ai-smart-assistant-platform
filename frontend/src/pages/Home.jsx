/**
 * Home Page - Restaurant-style Hero Layout
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">

            {/* Hero Section - Two Column Layout */}
            <section className="py-20">
                <div className="container mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Column - Text Content */}
                        <div className="space-y-6">
                            <h1 className="text-6xl md:text-7xl font-black leading-tight">
                                <span className="text-gray-900">Experience Smart</span>
                                <br />
                                <span className="text-gray-900">Healthcare</span>
                                <br />
                                <span className="text-blue-600">At Its Best</span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                Leverage cutting-edge AI technology for instant health insights,
                                intelligent conversations, and personalized medical guidance.
                                Your journey to better health starts here.
                            </p>

                            <div className="flex gap-4 pt-4">
                                <Link to="/symptom-checker">
                                    <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2">
                                        <span>🏥</span>
                                        Check Symptoms
                                    </button>
                                </Link>
                                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                                    <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all">
                                        {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Column - Image/Visual */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-12 shadow-2xl">
                                {/* Decorative elements */}
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
                                    {/* Medical Icons Display */}
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-110 transition-transform">
                                            <div className="text-5xl text-center">🏥</div>
                                            <p className="text-xs text-center mt-2 font-semibold text-gray-700">Health Check</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-110 transition-transform">
                                            <div className="text-5xl text-center">💬</div>
                                            <p className="text-xs text-center mt-2 font-semibold text-gray-700">AI Chat</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-110 transition-transform">
                                            <div className="text-5xl text-center">📊</div>
                                            <p className="text-xs text-center mt-2 font-semibold text-gray-700">Analytics</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center">
                                            <div className="text-3xl font-black text-white">10K+</div>
                                            <div className="text-sm text-white/90">Checkups</div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center">
                                            <div className="text-3xl font-black text-white">50K+</div>
                                            <div className="text-sm text-white/90">Chats</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">✓</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-800">AI Powered</div>
                                        <div className="text-xs text-gray-600">100% Accurate</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">Our AI Features</h2>
                        <p className="text-xl text-gray-600">Comprehensive healthcare solutions powered by artificial intelligence</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🏥',
                                title: 'Symptom Checker',
                                description: 'Get instant AI-powered insights about your symptoms with severity classification and recommendations.',
                                link: '/symptom-checker',
                                color: 'blue'
                            },
                            {
                                icon: '💬',
                                title: 'Smart Chatbot',
                                description: 'Ask health-related questions and receive intelligent, context-aware responses from our AI.',
                                link: '/chatbot',
                                color: 'purple'
                            },
                            {
                                icon: '📄',
                                title: 'Resume Analyzer',
                                description: 'Upload your resume and get AI-powered feedback with ATS compatibility scoring.',
                                link: isAuthenticated ? '/resume-analyzer' : '/login',
                                color: 'green'
                            }
                        ].map((feature, index) => (
                            <Link to={feature.link} key={index}>
                                <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-blue-200">
                                    <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    <div className="mt-4 text-blue-600 font-semibold flex items-center gap-2">
                                        Try Now
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
                        <div>
                            <div className="text-6xl font-black mb-2">10K+</div>
                            <div className="text-xl opacity-90">Symptoms Analyzed</div>
                        </div>
                        <div>
                            <div className="text-6xl font-black mb-2">50K+</div>
                            <div className="text-xl opacity-90">AI Conversations</div>
                        </div>
                        <div>
                            <div className="text-6xl font-black mb-2">5K+</div>
                            <div className="text-xl opacity-90">Resumes Improved</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="py-12 bg-yellow-50">
                <div className="container mx-auto px-8">
                    <div className="max-w-4xl mx-auto bg-white border-l-4 border-yellow-500 rounded-lg p-6 shadow-md">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">⚠️</div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Important Medical Disclaimer</h3>
                                <p className="text-gray-700">
                                    This platform is an educational project and NOT a substitute for professional medical advice.
                                    Always consult qualified healthcare professionals for medical concerns.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
