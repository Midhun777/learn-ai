import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Plus, ArrowRight, Loader, Sparkles, BookOpen, GraduationCap, Trophy, Flame, TrendingUp, Search, Trash2, Share2, User, ExternalLink } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [skill, setSkill] = useState('');
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [focusHours, setFocusHours] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/roadmap/user/all');
                setRoadmaps(res.data);

                // Calculate Stats
                let totalMinutes = 0;
                res.data.forEach(map => {
                    map.phases.forEach(phase => {
                        phase.topics.forEach(topic => {
                            if (topic.timeSpent) totalMinutes += topic.timeSpent;
                        });
                    });
                });
                setFocusHours(Math.round(totalMinutes / 60 * 10) / 10); // 1 decimal place

            } catch (err) {
                console.error('Error fetching user data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [user]);

    const handleGenerate = async (e, topic = null) => {
        if (e) e.preventDefault();
        const topicToUse = topic || skill;
        if (!topicToUse) return;

        setGenerating(true);
        try {
            const aiRes = await axios.post('http://localhost:5000/api/roadmap/generate', { skill: topicToUse });
            const roadmapData = aiRes.data;

            const saveRes = await axios.post('http://localhost:5000/api/roadmap/save', {
                skill: roadmapData.skill,
                phases: roadmapData.phases,
                capstoneProject: roadmapData.capstoneProject
            });

            setRoadmaps([saveRes.data, ...roadmaps]);
            setSkill('');
            setGenerating(false);
        } catch (err) {
            console.error('Error generating roadmap', err);
            alert('Failed to generate roadmap. Please try again.');
            setGenerating(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault(); // Prevent Link navigation
        if (window.confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5000/api/roadmap/${id}`);
                setRoadmaps(roadmaps.filter(map => map._id !== id));
            } catch (err) {
                console.error('Error deleting roadmap', err);
                alert('Failed to delete roadmap.');
            }
        }
    };

    // Stats Calculation
    const completedCount = roadmaps.filter(r => r.isCompleted).length;
    const activeCount = roadmaps.filter(r => !r.isCompleted).length;
    const totalCertificates = completedCount; // Assuming 1 completion = 1 certificate

    const popularTopics = ["Python Mastery", "React.js", "Data Science", "Digital Marketing", "UX Design"];

    return (
        <div className="space-y-10 animate-fade-in pb-20 max-w-7xl mx-auto px-4 md:px-8">
            {/* 1. Hero / Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Welcome Card */}
                <div className="lg:col-span-2 glass-panel p-8 relative overflow-hidden flex flex-col justify-center min-h-[220px]">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                                <GraduationCap size={24} />
                            </div>
                            <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">Student Dashboard</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Welcome back, {user?.username}!</h1>
                        <p className="text-lg text-slate-500 max-w-lg">
                            You're making great progress. Continue your journey or start a new adventure today.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
                        <div className="p-4 bg-orange-50 rounded-2xl">
                            <Flame className="text-orange-500" size={32} />
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900">{focusHours}h</div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Focus Time</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
                        <div className="p-4 bg-green-50 rounded-2xl">
                            <TrendingUp className="text-green-500" size={32} />
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900">{roadmaps.filter(r => r.isCompleted).length}</div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completed</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Quick Action / Generate */}
            <div className="glass-panel p-1">
                <div className="bg-white/50 backdrop-blur-sm rounded-[1.3rem] p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8">
                    <div className="flex-1 w-full">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Sparkles className="text-blue-600" size={20} />
                            Create New Learning Goal
                        </h3>
                        <p className="text-slate-500 mb-6">Enter a skill or choose a popular topic to generate a personalized  roadmap.</p>

                        <form onSubmit={(e) => handleGenerate(e)} className="relative flex items-center max-w-lg">
                            <Search className="absolute left-4 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => setSkill(e.target.value)}
                                placeholder="What do you want to learn next? (e.g. Pottery, Rust)"
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-slate-700 shadow-sm"
                                disabled={generating}
                            />
                            <button
                                type="submit"
                                disabled={generating || !skill}
                                className="absolute right-2 btn-primary-glass !py-2 !px-6 !text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generating ? <Loader className="animate-spin w-4 h-4" /> : 'Generate'}
                            </button>
                        </form>

                        {/* Popular Pills */}
                        <div className="mt-5 flex flex-wrap gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 pt-1.5">Popular:</span>
                            {popularTopics.map(topic => (
                                <button
                                    key={topic}
                                    onClick={() => handleGenerate(null, topic)}
                                    disabled={generating}
                                    className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md transition-all duration-200"
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Illustration or Decorative Element here if desired */}
                    <div className="hidden lg:block w-px h-32 bg-slate-200"></div>
                </div>
            </div>

            {/* Public Profile Banner */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 mb-12 text-white shadow-xl flex flex-col items-start gap-4 transition-all hover:scale-[1.01]">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Public Profile
                </h2>
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center w-full justify-between">
                    <p className="text-indigo-100 max-w-xl text-lg">
                        Showcase your verified certificates and roadmaps to the world. Share your unique link with recruiters or friends.
                    </p>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link to={`/u/${user._id}`} className="flex-1 sm:flex-none px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                            <ExternalLink className="w-4 h-4" /> View Profile
                        </Link>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/u/${user._id}`);
                                alert('Public profile link copied!');
                            }}
                            className="flex-1 sm:flex-none px-6 py-3 bg-indigo-700/50 backdrop-blur-sm border border-white/20 hover:bg-indigo-700/70 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-4 h-4" /> Copy Link
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. My Courses (Roadmaps) */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="text-slate-400" size={24} />
                        My Courses
                    </h2>
                    <div className="text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer transition">View All</div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader className="animate-spin w-8 h-8 text-blue-600" /></div>
                ) : roadmaps.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl">
                        <p className="text-slate-500 font-medium">No courses yet. Generate one to get started!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roadmaps.map((map) => {
                            const progress = calculateProgress(map);
                            return (
                                <Link to={`/roadmap/${map._id}`} key={map._id} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                                    <div className="h-24 p-6 relative overflow-hidden bg-slate-50 border-b border-slate-100/50">
                                        <div className="relative z-10 flex justify-between items-start">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 shadow-sm ${map.isCompleted ? 'text-emerald-600' : 'text-blue-600'}`}>
                                                {map.isCompleted ? 'Completed' : 'In Progress'}
                                            </span>
                                            {map.isCompleted ? (
                                                <div className="p-1.5 bg-emerald-500 rounded-full text-white shadow-sm"><CheckIcon /></div>
                                            ) : (
                                                <button
                                                    onClick={(e) => handleDelete(e, map._id)}
                                                    className="p-1.5 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-colors z-20 relative"
                                                    title="Delete Roadmap"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 pt-4 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{map.skill}</h3>
                                        <p className="text-sm text-slate-500 mb-6 line-clamp-2">Master {map.skill} with this personalized learning path.</p>

                                        <div className="mt-auto">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Progress</span>
                                                <span className={`text-sm font-black ${map.isCompleted ? 'text-emerald-600' : 'text-blue-600'}`}>{progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${map.isCompleted ? 'bg-emerald-500' : 'bg-blue-600'}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 border-t border-slate-50 flex justify-end">
                                        <div className="text-xs font-bold text-slate-400 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                                            {map.isCompleted ? 'View Certificate' : 'Continue Learning'} <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* 4. Certificate Shelf (Only shows if User has certificates) */}
            {totalCertificates > 0 && (
                <div className="border-t border-slate-200 pt-10">
                    <div className="flex items-center gap-2 mb-6">
                        <Trophy className="text-slate-900" size={24} />
                        <h2 className="text-2xl font-bold text-slate-900">Achievements</h2>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                        {roadmaps.filter(r => r.isCompleted).map(cert => (
                            <div key={cert._id} className="min-w-[280px] h-[180px] bg-slate-900 rounded-2xl relative overflow-hidden shadow-lg group cursor-pointer border border-slate-800">
                                {/* Decorative Certificate Elements */}
                                <div className="absolute inset-0 border-[8px] border-double border-white/10 rounded-2xl m-3"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                                    <AwardIcon size={120} />
                                </div>

                                <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center z-10">
                                    <AwardIcon className="text-white mb-2" size={32} />
                                    <h4 className="text-white font-bold text-lg leading-tight mb-1">{cert.skill}</h4>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Certified Master</p>
                                </div>

                                {/* Hover Overlay */}
                                <Link to={`/roadmap/${cert._id}`} className="absolute inset-0 bg-blue-600/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-blue-900 flex items-center gap-2">
                                        View <ArrowRight size={12} />
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

// Helper Icons
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
)
const AwardIcon = ({ size = 24, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
)


// ... calculateProgress matches previous implementation
const calculateProgress = (roadmap) => {
    let totalItems = 0;
    let completedItems = 0;

    if (!roadmap) return 0;

    roadmap.phases?.forEach(phase => {
        phase.topics?.forEach(topic => {
            totalItems++;
            if (topic.completed) completedItems++;
        });
        phase.resources?.forEach(res => {
            totalItems++;
            if (res.completed) completedItems++;
        });
        if (phase.handsOnProject) {
            totalItems++;
            if (phase.handsOnProject.completed) completedItems++;
        }
    });

    if (roadmap.capstoneProject) {
        totalItems++;
        if (roadmap.capstoneProject.completed) completedItems++;
    }

    if (totalItems === 0) return 0;
    return Math.round((completedItems / totalItems) * 100);
};

export default Dashboard;
