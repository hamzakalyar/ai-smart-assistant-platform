/**
 * Chatbot Page
 * 
 * Interactive AI chatbot with session management
 */

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Chatbot = () => {
    const { getAuthHeader, isAuthenticated } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/chatbot/query`,
                { question: input, session_id: sessionId },
                { headers: getAuthHeader() }
            );

            const aiMessage = {
                role: 'assistant',
                content: response.data.answer,
                id: response.data.id
            };

            setMessages(prev => [...prev, aiMessage]);
            setSessionId(response.data.session_id);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to get response');
            setMessages(prev => prev.slice(0, -1)); // Remove user message on error
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (messageId, rating) => {
        try {
            await axios.post(
                `${API_URL}/api/chatbot/${messageId}/feedback`,
                { rating }
            );
            toast.success('Thanks for your feedback!');
        } catch (error) {
            toast.error('Failed to submit rating');
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    💬 AI Health Assistant
                </h1>
                <p className="text-gray-600">
                    Ask me anything about health, symptoms, or medical information
                </p>
            </div>

            {/* Chat Container */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-8">
                            <p className="text-lg mb-4">👋 Hello! How can I help you today?</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                                <button
                                    onClick={() => setInput("What are the symptoms of diabetes?")}
                                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                >
                                    What are the symptoms of diabetes?
                                </button>
                                <button
                                    onClick={() => setInput("How can I prevent the flu?")}
                                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                >
                                    How can I prevent the flu?
                                </button>
                            </div>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>

                                {message.role === 'assistant' && message.id && (
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                        <span className="text-xs text-gray-600">Rate:</span>
                                        {[1, 2, 3, 4, 5].map(rating => (
                                            <button
                                                key={rating}
                                                onClick={() => handleRating(message.id, rating)}
                                                className="text-yellow-400 hover:text-yellow-500 transition-colors"
                                            >
                                                ⭐
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-4">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                            placeholder="Type your question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" variant="primary" disabled={loading || !input.trim()}>
                            Send
                        </Button>
                    </form>

                    {!isAuthenticated && messages.length > 0 && (
                        <p className="text-xs text-gray-600 text-center mt-2">
                            💡 <a href="/register" className="text-primary-600 hover:underline">Create an account</a> to save your chat history
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Chatbot;
