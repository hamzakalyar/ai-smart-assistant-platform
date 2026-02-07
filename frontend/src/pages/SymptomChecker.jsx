/**
 * Symptom Checker Page
 * 
 * AI-powered symptom analysis with optional authentication
 */

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SymptomChecker = () => {
    const { getAuthHeader, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        symptoms: '',
        age: '',
        gender: '',
        duration: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/symptoms/check`,
                formData,
                { headers: getAuthHeader() }
            );

            setResult(response.data);
            toast.success('Analysis complete!');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800'
        };
        return colors[severity] || colors.medium;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    🏥 AI Symptom Checker
                </h1>
                <p className="text-gray-600">
                    Describe your symptoms and get AI-powered insights
                </p>
            </div>

            {/* Medical Disclaimer */}
            <Card className="bg-yellow-50 border-2 border-yellow-200">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <h3 className="font-bold text-yellow-800 mb-1">Medical Disclaimer</h3>
                        <p className="text-sm text-yellow-700">
                            This is NOT medical advice. Always consult healthcare professionals for
                            medical concerns. This tool is for educational purposes only.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Input Form */}
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Describe your symptoms *
                        </label>
                        <textarea
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                            rows="4"
                            placeholder="E.g., I have a headache, fever, and sore throat for the past 3 days..."
                            value={formData.symptoms}
                            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Age *"
                            type="number"
                            placeholder="25"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender *
                            </label>
                            <select
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                required
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Input
                            label="Duration *"
                            placeholder="e.g., 3 days"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            required
                        />
                    </div>

                    <Button type="submit" variant="primary" className="w-full" loading={loading}>
                        Analyze Symptoms
                    </Button>

                    {!isAuthenticated && (
                        <p className="text-sm text-gray-600 text-center">
                            💡 <a href="/register" className="text-primary-600 hover:underline">Create an account</a> to save your symptom history
                        </p>
                    )}
                </form>
            </Card>

            {/* Results */}
            {result && (
                <Card>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                            <span className={`px-4 py-2 rounded-full font-medium ${getSeverityColor(result.severity)}`}>
                                {result.severity.toUpperCase()} Severity
                            </span>
                        </div>

                        <div className="prose max-w-none">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{result.ai_response}</p>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600">
                            <p>Analyzed on: {new Date(result.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SymptomChecker;
