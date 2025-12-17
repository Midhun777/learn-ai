import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Award, Calendar, BookOpen, CheckCircle, Share2, Shield, User } from 'lucide-react';

const PublicProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/public/profile/${id}`);
                setProfile(res.data);
            } catch (err) {
                setError("User not found or profile is private.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-500 font-medium animate-pulse">Loading Profile...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center p-8">
                <div className="bg-red-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Profile Not Found</h2>
                <p className="text-zinc-500">{error}</p>
            </div>
        </div>
    );

    const { user, stats, roadmaps } = profile;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-zinc-200">
                <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-full border-4 border-white shadow-lg" title="Premium Member">
                                <Award className="w-6 h-6 text-white fill-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-2">
                                    {user.username}
                                </h1>
                                <p className="text-lg text-zinc-500 flex items-center justify-center md:justify-start gap-2">
                                    <Shield className="w-4 h-4 text-blue-500" />
                                    AI Learner since {new Date(stats.joined).getFullYear()}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Profile link copied!');
                                }}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-full font-medium transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                Share Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-5xl mx-auto px-4 -mt-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Completed</p>
                            <p className="text-2xl font-bold text-zinc-900">{stats.completedCount} Roadmaps</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Learning</p>
                            <p className="text-2xl font-bold text-zinc-900">{stats.totalCount} Skills</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Joined</p>
                            <p className="text-2xl font-bold text-zinc-900">
                                {new Date(stats.joined).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Showcase Section */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                        <Award className="w-6 h-6 text-yellow-500" />
                        Verified Certificates & Roadmaps
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {roadmaps.map((map) => (
                            <div key={map._id} className={`group relative bg-white rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${map.isCompleted
                                    ? 'border-yellow-200 shadow-md hover:shadow-xl'
                                    : 'border-zinc-200 hover:border-blue-300 hover:shadow-lg'
                                }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors">
                                        <BookOpen className={`w-8 h-8 ${map.isCompleted ? 'text-yellow-600' : 'text-blue-600'}`} />
                                    </div>
                                    {map.isCompleted && (
                                        <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Verified
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-zinc-900 mb-2">{map.skill}</h3>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        <span>Progress</span>
                                        <span>{map.isCompleted ? '100' : 'In Progress'}%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${map.isCompleted ? 'bg-yellow-500' : 'bg-blue-600'
                                                }`}
                                            style={{ width: map.isCompleted ? '100%' : '40%' }} // Simple visualization
                                        ></div>
                                    </div>
                                    {!map.isCompleted && (
                                        <p className="text-xs text-zinc-400 mt-2">Started {new Date(map.createdAt).toLocaleDateString()}</p>
                                    )}
                                </div>

                                {map.isCompleted && (
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
