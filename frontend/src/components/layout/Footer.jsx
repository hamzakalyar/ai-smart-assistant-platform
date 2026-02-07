/**
 * Footer Component
 */

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">AI Smart Assistant</h3>
                        <p className="text-gray-400 text-sm">
                            Empowering health decisions with AI-powered symptom checking,
                            intelligent chatbot assistance, and resume analysis.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/symptom-checker" className="hover:text-white transition-colors">Symptom Checker</a></li>
                            <li><a href="/chatbot" className="hover:text-white transition-colors">Chatbot</a></li>
                            <li><a href="/resume-analyzer" className="hover:text-white transition-colors">Resume Analyzer</a></li>
                        </ul>
                    </div>

                    {/* Disclaimer */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Important</h3>
                        <p className="text-gray-400 text-xs">
                            ⚠️ This is an educational project. Always consult healthcare
                            professionals for medical advice. AI suggestions are not a
                            substitute for professional diagnosis.
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                    <p>&copy; 2024 AI Smart Assistant Platform. Built with ❤️ for learning.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
