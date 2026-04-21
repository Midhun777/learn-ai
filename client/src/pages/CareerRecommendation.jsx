import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Briefcase, ChevronRight, Star, TrendingUp, AlertCircle, Clock, CheckCircle2, Navigation } from 'lucide-react';

const CareerRecommendation = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Form State
    const [skillsInput, setSkillsInput] = useState('');
    const [interestsInput, setInterestsInput] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('beginner');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/career/history');
                setHistory(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch career history', err);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setGenerating(true);

        const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
        const interestsArray = interestsInput.split(',').map(s => s.trim()).filter(Boolean);

        if (skillsArray.length === 0) {
            alert('Please enter at least one skill.');
            setGenerating(false);
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/career/recommend', {
                skills: skillsArray,
                interests: interestsArray,
                experienceLevel
            });

            // Prepend new recommendation to history
            setHistory([res.data, ...history]);
            // Clear form
            setSkillsInput('');
            setInterestsInput('');
            
        } catch (err) {
            console.error('Failed to generate recommendation', err);
            alert('Error generating recommendations. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <LoadingScreen />;

    // The most recent recommendation is shown prominently if it exists
    const latestRec = history.length > 0 ? history[0] : null;

    return (
        <div className="min-h-screen bg-ui-bg">
            <main className="max-w-6xl mx-auto p-6 lg:p-12 animate-fade-in pb-24">
                
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-medium text-sm mb-4">
                        <Navigation className="w-4 h-4" />
                        AI Career Navigator
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Discover Your Ideal <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-600">Career Path</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-2xl text-lg">
                        Tell us what you know and what you enjoy doing, and our AI will analyze the market to suggest the best-fitting roles for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Input Form Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="saas-card p-6 border-t-4 border-t-brand-primary bg-white shadow-xl shadow-brand-primary/5">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-brand-primary" />
                                Your Profile
                            </h2>
                            <form onSubmit={handleGenerate} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Core Skills <span className="text-red-500">*</span></label>
                                    <textarea
                                        required
                                        className="m-input min-h-[100px] resize-none border-gray-200 focus:bg-white transition-colors"
                                        placeholder="e.g. React, Node.js, Python, Data Analysis (Comma separated)"
                                        value={skillsInput}
                                        onChange={(e) => setSkillsInput(e.target.value)}
                                        disabled={generating}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Separate skills with commas.</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Interests & Passions</label>
                                    <textarea
                                        className="m-input min-h-[80px] resize-none border-gray-200 focus:bg-white transition-colors"
                                        placeholder="e.g. Game Development, Remote Work, Finance industry"
                                        value={interestsInput}
                                        onChange={(e) => setInterestsInput(e.target.value)}
                                        disabled={generating}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
                                    <select
                                        className="m-input h-12 border-gray-200 bg-white font-medium"
                                        value={experienceLevel}
                                        onChange={(e) => setExperienceLevel(e.target.value)}
                                        disabled={generating}
                                    >
                                        <option value="beginner">Beginner (0-2 years)</option>
                                        <option value="intermediate">Intermediate (3-5 years)</option>
                                        <option value="advanced">Advanced (5+ years)</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="btn-primary w-full h-12 text-base shadow-md hover:shadow-lg transition-all"
                                >
                                    {generating ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                            Analyzing Market...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            Discover Paths
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Results Column */}
                    <div className="lg:col-span-8">
                        {latestRec ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                        Top Recommendations
                                    </h3>
                                    <span className="text-sm font-medium text-gray-500">Based on your latest profile</span>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {latestRec.recommendations.map((rec, idx) => (
                                        <div key={idx} className="saas-card p-6 hover:border-brand-primary/30 transition-all duration-300 group bg-white">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{rec.role}</h4>
                                                    <div className="flex items-center gap-3 mt-1.5 text-sm font-medium text-gray-500">
                                                        <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                                            {rec.salaryRange}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 bg-brand-primary/5 text-brand-primary px-2.5 py-1 rounded-md border border-brand-primary/10">
                                                            Match: {rec.matchPercentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <button 
                                                    className="btn-primary shrink-0 text-sm px-5 py-2 shadow-sm flex items-center gap-2 transform active:scale-95 transition-all"
                                                    onClick={() => alert(`Application process initiated for ${rec.role}. Application portal coming soon!`)}
                                                >
                                                    <Briefcase className="w-4 h-4" />
                                                    Apply Now
                                                </button>
                                            </div>
                                            
                                            <p className="text-gray-600 text-sm leading-relaxed mb-5">
                                                {rec.description}
                                            </p>

                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Key Skills Needed</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {rec.keySkillsRequired.map((skill, sIdx) => {
                                                        const userHasSkill = latestRec.skills.some(userSkill => 
                                                            userSkill.toLowerCase().includes(skill.toLowerCase()) || 
                                                            skill.toLowerCase().includes(userSkill.toLowerCase())
                                                        );
                                                        
                                                        return (
                                                            <div 
                                                                key={sIdx} 
                                                                className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 border
                                                                    ${userHasSkill 
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                                                    }`}
                                                            >
                                                                {userHasSkill && <CheckCircle2 className="w-3 h-3" />}
                                                                {skill}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 saas-card bg-gray-50/50 border-dashed border-2">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm mb-6">
                                    <Briefcase className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Awaiting Your Profile</h3>
                                <p className="text-gray-500 max-w-md">
                                    Fill out the form with your skills and interests to see AI-powered career paths tailored specifically for you.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Section */}
                {history.length > 1 && (
                    <div className="mt-16 pt-10 border-t border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            Previous Assessments
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.slice(1).map((item, idx) => (
                                <div key={idx} className="saas-card p-5 bg-white border-gray-100 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-xs font-semibold text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                        <span className="text-xs font-bold px-2.5 py-1 rounded bg-gray-100 text-gray-500 uppercase tracking-wider">
                                            {item.experienceLevel}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                            Skills: <span className="text-gray-500 font-normal">{item.skills.join(', ')}</span>
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-50">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Top Result</p>
                                        <p className="text-sm font-bold text-brand-primary">
                                            {item.recommendations[0]?.role || 'No role found'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CareerRecommendation;
