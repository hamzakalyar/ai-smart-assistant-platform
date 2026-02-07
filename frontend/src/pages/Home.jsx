/**
 * Home Page - Following User's Specifications
 * 1. Top bar with logo left, auth buttons right ✓ (in Navbar)
 * 2. Main section with 3D cube and Assistant name
 * 3. Feature boxes that are clickable
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            title: 'Symptom Checker',
            description: 'Analyze your symptoms with AI and get instant health insights',
            icon: '🏥',
            link: '/symptom-checker',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            title: 'AI Chatbot',
            description: 'Chat with our intelligent AI assistant for health guidance',
            icon: '💬',
            link: '/chatbot',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            title: 'Resume Analyzer',
            description: 'Get AI-powered feedback on your resume and improve it',
            icon: '📄',
            link: isAuthenticated ? '/resume-analyzer' : '/login',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">

            {/* Hero Section with Cube and Name */}
            <section className="py-20">
                <div className="container mx-auto px-6 text-center">
                    {/* 3D Rotating Cube */}
                    <div className="cube-container mb-8">
                        <div className="cube">
                            <div className="cube-face front">🤖</div>
                            <div className="cube-face back">💊</div>
                            <div className="cube-face right">🏥</div>
                            <div className="cube-face left">📊</div>
                            <div className="cube-face top">✨</div>
                            <div className="cube-face bottom">💬</div>
                        </div>
                    </div>

                    {/* Assistant Name and Tagline */}
                    <h1 className="text-6xl md:text-7xl font-black text-gray-800 mb-4">
                        AI Smart Assistant
                    </h1>
                    <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Your intelligent companion for health insights and career growth
                    </p>

                    {/* Call to Action */}
                    {!isAuthenticated && (
                        <div className="flex gap-4 justify-center">
                            <Link to="/register">
                                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                                    Get Started Free
                                </button>
                            </Link>
                            <Link to="/symptom-checker">
                                <button className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-purple-500 hover:shadow-xl transform hover:scale-105 transition-all">
                                    Try Demo
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Feature Boxes Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
                        Choose Your Feature
                    </h2>

                    {/* Feature Boxes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <Link
                                to={feature.link}
                                key={index}
                                className="block group"
                            >
                                <div className={`${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer`}>
                                    {/* Icon with Gradient Background */}
                                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg group-hover:rotate-12 transition-transform`}>
                                        {feature.icon}
                                    </div>

                                    {/* Feature Title */}
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                                        {feature.title}
                                    </h3>

                                    {/* Feature Description */}
                                    <p className="text-gray-600 text-center text-lg leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Click Indicator */}
                                    <div className="mt-6 text-center">
                                        <span className={`inline-flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r ${feature.color} font-semibold group-hover:gap-3 transition-all`}>
                                            Get Started
                                            <svg className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                        <div>
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 mb-2">
                                10K+
                            </div>
                            <div className="text-xl text-gray-600">Symptoms Analyzed</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
                                50K+
                            </div>
                            <div className="text-xl text-gray-600">AI Conversations</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500 mb-2">
                                5K+
                            </div>
                            <div className="text-xl text-gray-600">Resumes Improved</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="py-12 bg-yellow-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-white border-2 border-yellow-400 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">⚠️</div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Medical Disclaimer</h3>
                                <p className="text-gray-700">
                                    This is an educational project. Always consult qualified healthcare professionals for medical advice.
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
