import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Trophy } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-8 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Learning Revolution</span>
                </div>

                <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 mb-8 tracking-tight leading-tight">
                    Master Any Skill with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Intelligent Roadmaps</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                    Stop guessing what to learn next. Get a personalized, structured learning path generated instantly by AI, curated with the best resources.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
                    <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-lg">
                        Start Learning Now <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/login" className="btn-secondary text-lg">
                        Continue Journey
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <FeatureCard
                        icon={<Sparkles className="w-6 h-6 text-indigo-600" />}
                        title="AI Generated"
                        desc="Custom roadmaps tailored to your goal, generated in seconds."
                    />
                    <FeatureCard
                        icon={<BookOpen className="w-6 h-6 text-purple-600" />}
                        title="Curated Resources"
                        desc="Best documentation, videos, and articles hand-picked for you."
                    />
                    <FeatureCard
                        icon={<Trophy className="w-6 h-6 text-yellow-600" />}
                        title="Certification"
                        desc="Track progress and earn a verified certificate upon completion."
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-4 border border-gray-100">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{desc}</p>
    </div>
);

export default Home;
