/**
 * Main Application Component
 * 
 * LEARNING: React Router Setup
 * 
 * React Router enables client-side routing (SPA - Single Page Application).
 * Instead of server requests for each page, React Router changes the URL
 * and renders different components without page reloads.
 * 
 * Benefits:
 * - Fast navigation (no page reloads)
 * - Better UX with transitions
 * - Maintains application state
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import Chatbot from './pages/Chatbot';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Profile from './pages/Profile';

// Protected Route Component
/**
 * LEARNING: Protected Routes
 * 
 * Some pages should only be accessible to logged-in users.
 * ProtectedRoute checks authentication and redirects if needed.
 */
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    return (
        /**
         * LEARNING: React Context Provider Pattern
         * 
         * AuthProvider wraps entire app to provide authentication state
         * to all child components. Any component can access user data
         * without prop drilling.
         */
        <AuthProvider>
            <Router>
                <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
                    {/* Toast Notifications */}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                        }}
                    />

                    {/* Navigation Bar */}
                    <Navbar />

                    {/* Main Content */}
                    <main className="flex-grow container mx-auto px-4 py-8">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* AI Feature Routes (work for both guests and users) */}
                            <Route path="/symptom-checker" element={<SymptomChecker />} />
                            <Route path="/chatbot" element={<Chatbot />} />

                            {/* Protected Routes (require authentication) */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/resume-analyzer"
                                element={
                                    <ProtectedRoute>
                                        <ResumeAnalyzer />
                                    </ProtectedRoute>
                                }
                            />

                            {/* 404 Redirect */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
