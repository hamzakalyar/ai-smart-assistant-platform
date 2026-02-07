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
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl font-bold">AI</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">MedBot</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/symptom-checker" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Symptom Checker
                        </Link>
                        <Link to="/chatbot" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Chatbot
                        </Link>
                        {isAuthenticated && (
                            <>
                                <Link to="/resume-analyzer" className="text-gray-600 hover:text-primary-600 transition-colors">
                                    Resume Analyzer
                                </Link>
                                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                                    Dashboard
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile">
                                    <Button variant="ghost" size="sm">
                                        {user?.name}
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">
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
