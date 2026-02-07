/**
 * Navigation Bar - Restaurant-style layout
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Name - LEFT */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-white text-2xl">🤖</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-800">AI MedBot</span>
                    </Link>

                    {/* Navigation Menu - RIGHT */}
                    <div className="flex items-center space-x-1">
                        <Link to="/">
                            <button className={`px-6 py-2.5 rounded-full font-medium transition-all ${isActive('/')
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                Home
                            </button>
                        </Link>

                        <Link to="/symptom-checker">
                            <button className={`px-6 py-2.5 rounded-full font-medium transition-all ${isActive('/symptom-checker')
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                Features
                            </button>
                        </Link>

                        {isAuthenticated && (
                            <Link to="/dashboard">
                                <button className={`px-6 py-2.5 rounded-full font-medium transition-all ${isActive('/dashboard')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}>
                                    Dashboard
                                </button>
                            </Link>
                        )}

                        <Link to="/about">
                            <button className={`px-6 py-2.5 rounded-full font-medium transition-all ${isActive('/about')
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                About
                            </button>
                        </Link>

                        <div className="ml-4 flex items-center space-x-2">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile">
                                        <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full font-medium flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            {user?.name}
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-blue-600 hover:text-blue-600 transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <button className="px-5 py-2 text-gray-700 hover:bg-gray-100 rounded-full font-medium transition-all">
                                            Login
                                        </button>
                                    </Link>
                                    <Link to="/register">
                                        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 shadow-md transition-all">
                                            Sign Up
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
