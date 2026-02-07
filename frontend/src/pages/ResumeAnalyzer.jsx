/**
 * Resume Analyzer Page
 * 
 * Upload and analyze resumes with AI feedback
 */

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ResumeAnalyzer = () => {
    const { getAuthHeader } = useAuth();
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(selectedFile.type)) {
                toast.error('Please upload a PDF or DOCX file');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !targetRole.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('target_role', targetRole);

            const response = await axios.post(
                `${API_URL}/api/resume/analyze`,
                formData,
                {
                    headers: {
                        ...getAuthHeader(),
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setResult(response.data);
            toast.success('Analysis complete!');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    📄 AI Resume Analyzer
                </h1>
                <p className="text-gray-600">
                    Get AI-powered feedback to improve your resume
                </p>
            </div>

            {/* Upload Form */}
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Resume (PDF or DOCX) *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.docx"
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                {file ? (
                                    <div>
                                        <p className="text-primary-600 font-medium">{file.name}</p>
                                        <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="text-gray-600 mt-2">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500 mt-1">PDF or DOCX up to 5MB</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <Input
                        label="Target Job Role *"
                        placeholder="e.g., Software Engineer, Data Scientist"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        loading={loading}
                        disabled={!file || !targetRole.trim()}
                    >
                        Analyze Resume
                    </Button>
                </form>
            </Card>

            {/* Results */}
            {result && (
                <Card>
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h2>
                            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                                    <p className={`text-5xl font-bold ${getScoreColor(result.overall_score)}`}>
                                        {result.overall_score}
                                    </p>
                                    <p className="text-sm text-gray-500">/ 100</p>
                                </div>
                                {result.ats_score && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">ATS Score</p>
                                        <p className={`text-5xl font-bold ${getScoreColor(result.ats_score)}`}>
                                            {result.ats_score}
                                        </p>
                                        <p className="text-sm text-gray-500">/ 100</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {result.summary && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                                <h3 className="font-bold text-blue-900 mb-2">Summary</h3>
                                <p className="text-blue-800">{result.summary}</p>
                            </div>
                        )}

                        {result.feedback_json && (
                            <div className="space-y-4">
                                {result.feedback_json.strengths && result.feedback_json.strengths.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                            <span>✅</span> Strengths
                                        </h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {result.feedback_json.strengths.map((item, idx) => (
                                                <li key={idx} className="text-gray-700">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {result.feedback_json.improvements && result.feedback_json.improvements.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                                            <span>💡</span> Areas for Improvement
                                        </h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {result.feedback_json.improvements.map((item, idx) => (
                                                <li key={idx} className="text-gray-700">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {result.feedback_json.missing_keywords && result.feedback_json.missing_keywords.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                                            <span>🔑</span> Missing Keywords
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.feedback_json.missing_keywords.map((keyword, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="text-sm text-gray-600 pt-4 border-t border-gray-200">
                            <p>Analyzed on: {new Date(result.timestamp).toLocaleString()}</p>
                            <p>Target Role: {result.target_role}</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ResumeAnalyzer;
