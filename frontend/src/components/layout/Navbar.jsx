/**
 * Navigation Bar Component
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass-card sticky top-0 z-50 border-b-0">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo with gradient */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <span className="text-white text-2xl font-bold">AI</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                            MedBot
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/symptom-checker"
                            className="text-gray-700 font-medium hover:text-primary-600 transition-all duration-200 relative group"
                        >
                            Symptom Checker
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            to="/chatbot"
                            className="text-gray-700 font-medium hover:text-primary-600 transition-all duration-200 relative group"
                        >
                            Chatbot
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/resume-analyzer"
                                    className="text-gray-700 font-medium hover:text-primary-600 transition-all duration-200 relative group"
                                >
                                    Resume Analyzer
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-700 font-medium hover:text-primary-600 transition-all duration-200 relative group"
                                >
                                    Dashboard
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-3">
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile">
                                    <Button variant="ghost" size="sm" className="hover-lift">
                                        👤 {user?.name}
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={handleLogout} className="hover-lift">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className="hover-lift">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm" className="hover-lift shadow-lg">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
