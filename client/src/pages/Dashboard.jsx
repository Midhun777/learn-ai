import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Plus, BookOpen, Target, Search, X, Layers, Activity, ShieldCheck, Trash2, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [skillLevel, setSkillLevel] = useState('beginner');
    const [deadlineDays, setDeadlineDays] = useState(30);
    const [hoursPerDay, setHoursPerDay] = useState(2);
    const [learningGoal, setLearningGoal] = useState('job preparation');
    const [generating, setGenerating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.querySelector('input[placeholder*="Search learning paths"]')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/roadmap/user/all');
                setRoadmaps(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchRoadmaps();
    }, []);

    const [filterState, setFilterState] = useState('total');

    const handleCreate = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const genRes = await axios.post('http://localhost:5000/api/roadmap/generate', { 
                skill: newSkill,
                skillLevel,
                deadlineDays,
                hoursPerDay,
                learningGoal
            });
            const saveRes = await axios.post('http://localhost:5000/api/roadmap/save', genRes.data);
            navigate(`/roadmap/${saveRes.data._id}`);
        } catch (err) {
            console.error(err);
            alert("Error generating roadmap: " + (err.response?.data?.msg || err.response?.data?.error || err.message));
            setGenerating(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Delete this roadmap?')) {
            try {
                await axios.delete(`http://localhost:5000/api/roadmap/${id}`);
                setRoadmaps(roadmaps.filter(r => r._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const filteredRoadmaps = roadmaps.filter(r => {
        const matchesSearch = r.skill.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        if (filterState === 'completed') return r.isCompleted;
        if (filterState === 'active') return !r.isCompleted;
        return true; // 'total'
    });

    const stats = {
        total: roadmaps.length,
        completed: roadmaps.filter(r => r.isCompleted).length,
        active: roadmaps.filter(r => !r.isCompleted).length
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-ui-bg">
            <main className="max-w-6xl mx-auto p-6 lg:p-12 animate-fade-in pb-24">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Overview
                        </h1>
                        <p className="text-gray-500 font-medium max-w-lg">
                            Track your learning progress and manage your personalized roadmaps.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary shadow-sm rounded-md"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Roadmap</span>
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Paths', value: stats.total, icon: Layers, type: 'total' },
                        { label: 'In Progress', value: stats.active, icon: Activity, type: 'active' },
                        { label: 'Completed', value: stats.completed, icon: ShieldCheck, type: 'completed' }
                    ].map((stat, i) => (
                        <div
                            key={i}
                            onClick={() => setFilterState(stat.type)}
                            className={`saas-card p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 border-2 ${filterState === stat.type ? 'border-brand-primary bg-indigo-50/30' : 'border-transparent hover:border-gray-200 bg-white'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className={`text-sm font-medium ${filterState === stat.type ? 'text-brand-primary' : 'text-gray-500'}`}>{stat.label}</p>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${filterState === stat.type ? 'bg-brand-primary text-white' : 'bg-gray-50 text-gray-400'}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Search & Filter */}
                <div className="mb-10 flex justify-center lg:justify-start">
                    <div className="relative w-full max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search learning paths..."
                            className="w-full pl-12 pr-14 h-14 bg-white text-gray-900 text-base border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery ? (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1 rounded-md transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        ) : (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-xs font-semibold text-gray-400 border border-gray-200 px-2 py-1 rounded bg-gray-50/50">
                                ⌘K
                            </div>
                        )}
                    </div>
                </div>

                {/* Roadmaps Grid */}
                {filteredRoadmaps.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRoadmaps.map((roadmap) => {
                            const roadmapPhases = roadmap.phases || [];
                            const completed = roadmapPhases.reduce((acc, p) => acc + (p.topics || []).filter(t => t.completed).length, 0);
                            const total = roadmapPhases.reduce((acc, p) => acc + (p.topics || []).length, 0);
                            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                            return (
                                <div
                                    key={roadmap._id}
                                    onClick={() => navigate(`/roadmap/${roadmap._id}`)}
                                    className="saas-card p-6 cursor-pointer group flex flex-col h-full hover:border-gray-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(roadmap._id, e)}
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{roadmap.skill}</h3>
                                    <p className="text-sm text-gray-500 mb-6 flex-1">{roadmap.phases.length} Phases • {total} Topics</p>

                                    <div className="space-y-2 mt-auto">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="text-gray-900">{progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${roadmap.isCompleted ? 'bg-emerald-500' : 'bg-brand-primary'}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="saas-card p-12 text-center flex flex-col items-center justify-center border-dashed border-gray-200 bg-gray-50/50">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm mb-6 border border-gray-100">
                            <Target className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No roadmaps found</h3>
                        <p className="text-gray-500 max-w-sm mb-6">You haven't generated any learning paths yet or none match your search criteria.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary shadow-sm rounded-md"
                        >
                            Create your first roadmap
                        </button>
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">

                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">New Roadmap</h2>
                                <p className="text-sm text-gray-500">Generate a custom learning path with AI.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-md transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to learn?</label>
                                <input
                                    type="text"
                                    autoFocus
                                    required
                                    className="m-input h-11 border-gray-200"
                                    placeholder="e.g., Quantum Computing, React.js"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    disabled={generating}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Skill Level</label>
                                    <select
                                        className="m-input h-11 border-gray-200 bg-white"
                                        value={skillLevel}
                                        onChange={(e) => setSkillLevel(e.target.value)}
                                        disabled={generating}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goal</label>
                                    <select
                                        className="m-input h-11 border-gray-200 bg-white"
                                        value={learningGoal}
                                        onChange={(e) => setLearningGoal(e.target.value)}
                                        disabled={generating}
                                    >
                                        <option value="job preparation">Job Preparation</option>
                                        <option value="projects">Build Projects</option>
                                        <option value="academic learning">Academic Learning</option>
                                        <option value="general knowledge">General Knowledge</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (Days)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="365"
                                        required
                                        className="m-input h-11 border-gray-200"
                                        value={deadlineDays}
                                        onChange={(e) => setDeadlineDays(Number(e.target.value))}
                                        disabled={generating}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Daily Study (Hours)</label>
                                    <input
                                        type="number"
                                        min="0.5"
                                        max="16"
                                        step="0.5"
                                        required
                                        className="m-input h-11 border-gray-200"
                                        value={hoursPerDay}
                                        onChange={(e) => setHoursPerDay(Number(e.target.value))}
                                        disabled={generating}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={generating}
                                    className="btn-secondary px-5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="btn-primary"
                                >
                                    {generating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            Generate Roadmap
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
