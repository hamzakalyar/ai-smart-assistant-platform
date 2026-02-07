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
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center py-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                        Your AI-Powered
                        <span className="block mt-2 bg-gradient-primary bg-clip-text text-transparent">
                            Smart Assistant
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Leverage cutting-edge AI for symptom analysis, intelligent conversations,
                        and resume optimization—all in one platform. human
                    </p>
                    <div className="flex gap-4 justify-center">
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <Button variant="primary" size="lg">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/register">
                                    <Button variant="primary" size="lg">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link to="/symptom-checker">
                                    <Button variant="outline" size="lg">
                                        Try Symptom Checker
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Powerful AI Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Link to={feature.link} key={index}>
                            <Card hover className="h-full">
                                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-3xl mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
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
