/**
 * Home Page - Modern Interactive Design
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
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
            gradient: 'from-blue-400 via-blue-500 to-blue-600',
        },
        {
            title: 'Smart Chatbot',
            description: 'Ask health questions and get intelligent, context-aware AI responses.',
            icon: '💬',
            link: '/chatbot',
            gradient: 'from-purple-400 via-purple-500 to-purple-600',
        },
        {
            title: 'Resume Analyzer',
            description: 'Upload your resume and get AI feedback with ATS compatibility scoring.',
            icon: '📄',
            link: isAuthenticated ? '/resume-analyzer' : '/login',
            gradient: 'from-green-400 via-green-500 to-green-600',
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <motion.section
                className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Animated background shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -90, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="text-center max-w-5xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="mb-6">
                            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6">
                                ✨ AI-Powered Healthcare Platform
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
                        >
                            Your Smart
                            <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                                AI Assistant
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
                        >
                            Leverage cutting-edge AI for symptom analysis, intelligent conversations,
                            and resume optimization—all in one powerful platform
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex gap-4 justify-center flex-wrap"
                        >
                            {isAuthenticated ? (
                                <Link to="/dashboard">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="primary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl">
                                            Go to Dashboard →
                                        </Button>
                                    </motion.div>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button variant="primary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl">
                                                Get Started Free
                                            </Button>
                                        </motion.div>
                                    </Link>
                                    <Link to="/symptom-checker">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 px-8 py-4 text-lg font-semibold">
                                                Try Demo
                                            </Button>
                                        </motion.div>
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                            Powerful AI Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to leverage AI for health and career
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Link to={feature.link} className="block h-full">
                                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                                        <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg transform hover:rotate-6 transition-transform`}>
                                            {feature.icon}
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                            {feature.title}
                                        </h3>

                                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                            {feature.description}
                                        </p>

                                        <div className="flex items-center text-purple-600 font-semibold group">
                                            Learn More
                                            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {[
                            { number: '10K+', label: 'Symptoms Analyzed' },
                            { number: '50K+', label: 'AI Conversations' },
                            { number: '5K+', label: 'Resumes Improved' }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                            >
                                <div className="text-6xl font-black text-white mb-2">{stat.number}</div>
                                <div className="text-xl text-white/90">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="py-16 bg-yellow-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-4xl mx-auto bg-white border-2 border-yellow-400 rounded-2xl p-8 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-5xl">⚠️</div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Important Medical Disclaimer</h3>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    This platform is an educational project and NOT a substitute for professional medical advice.
                                    Always consult qualified healthcare professionals for medical concerns.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
