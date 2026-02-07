/**
 * User Dashboard
 * 
 * Shows user's activity history across all features
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Dashboard = () => {
    const { user, getAuthHeader } = useAuth();
    const [stats, setStats] = useState({
        symptomChecks: 0,
        chatMessages: 0,
        resumeAnalyses: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const headers = getAuthHeader();

            // Fetch recent symptom checks
            const symptomsRes = await axios.get(
                `${API_URL}/api/symptoms/history?limit=3`,
                { headers }
            );

            // Fetch recent chats
            const chatsRes = await axios.get(
                `${API_URL}/api/chatbot/history?limit=3`,
                { headers }
            );

            // Fetch recent resume analyses
            const resumesRes = await axios.get(
                `${API_URL}/api/resume/history?limit=3`,
                { headers }
            );

            setStats({
                symptomChecks: symptomsRes.data.length,
                chatMessages: chatsRes.data.length,
                resumeAnalyses: resumesRes.data.length
            });

            // Combine and sort recent activity
            const activity = [
                ...symptomsRes.data.map(item => ({ ...item, type: 'symptom' })),
                ...chatsRes.data.map(item => ({ ...item, type: 'chat' })),
                ...resumesRes.data.map(item => ({ ...item, type: 'resume' }))
            ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setRecentActivity(activity.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-gray-600">Here's your activity overview</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                            🏥
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Symptom Checks</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.symptomChecks}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                            💬
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Chat Messages</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.chatMessages}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                            📄
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Resume Analyses</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.resumeAnalyses}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/symptom-checker">
                        <Button variant="outline" className="w-full">
                            Check Symptoms
                        </Button>
                    </Link>
                    <Link to="/chatbot">
                        <Button variant="outline" className="w-full">
                            Ask Chatbot
                        </Button>
                    </Link>
                    <Link to="/resume-analyzer">
                        <Button variant="outline" className="w-full">
                            Analyze Resume
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                {loading ? (
                    <Card>
                        <p className="text-center text-gray-600">Loading...</p>
                    </Card>
                ) : recentActivity.length === 0 ? (
                    <Card>
                        <p className="text-center text-gray-600">No activity yet. Start using our AI features!</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <Card key={index}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                            {activity.type === 'symptom' && '🏥'}
                                            {activity.type === 'chat' && '💬'}
                                            {activity.type === 'resume' && '📄'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {activity.type === 'symptom' && 'Symptom Check'}
                                                {activity.type === 'chat' && 'Chatbot Conversation'}
                                                {activity.type === 'resume' && 'Resume Analysis'}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {activity.type === 'symptom' && activity.symptoms?.substring(0, 60) + '...'}
                                                {activity.type === 'chat' && activity.question?.substring(0, 60) + '...'}
                                                {activity.type === 'resume' && `"${activity.target_role}" - Score: ${activity.overall_score}/100`}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(activity.timestamp)}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
