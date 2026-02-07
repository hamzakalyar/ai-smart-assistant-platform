/**
 * Home Page
 * 
 * Landing page with hero section and feature highlights
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            title: 'AI Symptom Checker',
            description: 'Get instant AI-powered insights about your symptoms with severity classification.',
            icon: '🏥',
            link: '/symptom-checker',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Smart Chatbot',
            description: 'Ask health-related questions and get intelligent, context-aware responses.',
            icon: '💬',
            link: '/chatbot',
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Resume Analyzer',
            description: 'Upload your resume and get AI-powered feedback with ATS compatibility scoring.',
            icon: '📄',
            link: isAuthenticated ? '/resume-analyzer' : '/login',
            color: 'from-green-500 to-green-600'
        }
    ];

    return (
        <div className="space-y-20">
            {/* Hero Section with animations */}
            <section className="text-center py-20 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                        Your AI-Powered
                        <span className="block mt-3 gradient-text animate-float" style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Smart Assistant
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-10 drop-shadow-md">
                        Leverage cutting-edge AI for symptom analysis, intelligent conversations,
                        and resume optimization—all in one platform.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="animate-slide-in stagger-1">
                                <Button variant="primary" size="lg" className="text-lg px-8 py-4 hover-lift">
                                    Go to Dashboard →
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="animate-slide-in stagger-1">
                                    <Button variant="primary" size="lg" className="text-lg px-8 py-4 hover-lift">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link to="/symptom-checker" className="animate-slide-in stagger-2">
                                    <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/90 backdrop-blur hover-lift">
                                        Try Symptom Checker
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Grid with stagger animations */}
            <section className="animate-fade-in">
                <h2 className="text-4xl font-bold text-center text-white mb-4 drop-shadow-lg">
                    Powerful AI Features
                </h2>
                <p className="text-center text-white/80 mb-12 text-lg">
                    Everything you need to leverage AI for health and career
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Link to={feature.link} key={index} className={`animate-fade-in stagger-${index + 1}`}>
                            <Card hover className="h-full group cursor-pointer hover-lift">
                                <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className="mt-4 text-primary-600 font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Medical Disclaimer */}
            <section className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                    <span className="text-3xl">⚠️</span>
                    <div>
                        <h3 className="text-lg font-bold text-yellow-800 mb-2">Important Medical Disclaimer</h3>
                        <p className="text-yellow-700 text-sm">
                            This platform is an educational project and NOT a substitute for professional medical advice,
                            diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.
                            AI-generated content may contain errors or inaccuracies.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
