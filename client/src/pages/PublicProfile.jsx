import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Award, BookOpen, User, Trophy, Target, Sparkles, Shield, ArrowLeft, ChevronRight, Share2, ExternalLink } from 'lucide-react';

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/public/profile/${id}`);
                setProfile(res.data);
            } catch (err) {
                setError("SCHEMATIC_LOCKED_OR_INVALID.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-ui-bg flex items-center justify-center">
            <div className="w-16 h-16 border-[4px] border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-ui-bg flex items-center justify-center p-6 text-center">
            <div className="saas-card p-10 bg-white max-w-md relative overflow-hidden text-center border-t-4 border-t-rose-500">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 border border-rose-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-soft">
                    <Shield className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">LOCKED_RECORD</h2>
                <p className="text-sm font-medium text-slate-500 mb-8 lowercase tracking-wide italic">{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="btn-primary w-full py-4 text-sm uppercase font-bold tracking-widest"
                >
                    Return to Entry
                </button>
            </div>
        </div>
    );

    const { user, stats, roadmaps } = profile;

    return (
        <div className="min-h-screen bg-ui-bg lg:pl-64 pb-20 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <main className="p-6 md:p-12 animate-fade-in max-w-6xl mx-auto">
                {/* Header Control */}
                <div className="mb-10 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-ui-muted font-bold text-[10px] tracking-widest uppercase hover:text-brand-primary transition-all bg-white px-4 py-2 rounded-pill shadow-soft border border-ui-border"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Exit View
                    </button>
                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur px-4 py-2 rounded-pill border border-white/20 shadow-soft">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public Matrix</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-glow"></div>
                    </div>
                </div>

                {/* Hero Profile Block */}
                <div className="glass-panel p-10 md:p-16 text-center relative overflow-hidden mb-12 rounded-[32px]">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-8">
                            <div className="w-28 h-28 bg-white border border-ui-border text-brand-primary rounded-[32px] flex items-center justify-center shadow-premium group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                <User className="w-14 h-14" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center rounded-2xl shadow-glow rotate-12">
                                <Sparkles className="w-5 h-5" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 uppercase tracking-tight leading-none">
                            {user.username}<span className="text-brand-primary">.</span>
                        </h1>

                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                            <span className="badge-primary">ELITE_SCHOLAR</span>
                            <span className="badge-success">SYSTEM_ARCHITECT</span>
                        </div>

                        <div className="max-w-2xl mx-auto px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                            <p className="text-lg font-medium text-slate-500 uppercase leading-relaxed tracking-tight italic">
                                "Dedicated to systematic mastery through architected AI roadmaps and collaborative engineering."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { label: 'MASTERY_UNITS', value: stats.completedCount, icon: Trophy, color: 'text-brand-primary', bg: 'bg-brand-primary/5' },
                        { label: 'ACTIVE_SCHEMATICS', value: stats.totalCount, icon: Target, color: 'text-brand-secondary', bg: 'bg-brand-secondary/5' },
                        { label: 'VALIDATIONS', value: stats.completedCount, icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50/5' }
                    ].map((s, i) => (
                        <div key={i} className="saas-card p-8 flex flex-col items-center justify-center text-center">
                            <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6 border border-white/50 shadow-soft`}>
                                <s.icon className="w-7 h-7" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-ui-muted italic">{s.label}</p>
                            <p className="text-5xl font-black tracking-tighter text-slate-900">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Roadmap Records Header */}
                <div className="mb-8 flex items-center gap-6">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight shrink-0">Public Records</h2>
                    <div className="h-[2px] w-full bg-gradient-to-r from-slate-200 to-transparent rounded-full"></div>
                </div>

                {roadmaps.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {roadmaps.map((roadmap) => (
                            <div key={roadmap._id} className="saas-card p-8 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BookOpen className="w-20 h-20 -rotate-12" />
                                </div>

                                <div className="flex items-start justify-between mb-8 relative z-10">
                                    <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center shadow-soft border border-slate-100 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={roadmap.isCompleted ? 'badge-success' : 'badge-primary'}>
                                            {roadmap.isCompleted ? 'VALIDATED' : 'IN_PROGRESS'}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-10 group-hover:text-brand-primary transition-colors leading-tight truncate">
                                    {roadmap.skill}
                                </h3>

                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-bold text-ui-muted uppercase tracking-[0.2em]">Matrix Completion</span>
                                        <span className="text-sm font-black text-brand-primary tracking-tighter">{roadmap.isCompleted ? '100' : '35'}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/40">
                                        <div
                                            className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full transition-all duration-1000 shadow-glow"
                                            style={{ width: roadmap.isCompleted ? '100%' : '35%' }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                    <ChevronRight className="w-6 h-6 text-brand-primary" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="saas-card p-20 text-center bg-slate-50/50 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-white rounded-[24px] border border-slate-100 flex items-center justify-center mx-auto mb-8 shadow-soft group">
                            <Sparkles className="w-10 h-10 text-slate-200 group-hover:text-brand-primary transition-colors duration-500" />
                        </div>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">Zero public records localized in this schematic.</p>
                    </div>
                )}
            </main>

            <footer className="max-w-6xl mx-auto px-6 pb-12 mt-12 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-4">Architected by Learn AI Platform</p>
                <div className="flex justify-center gap-6">
                    <Share2 className="w-4 h-4 text-slate-300 hover:text-brand-primary cursor-pointer transition-colors" />
                    <ExternalLink className="w-4 h-4 text-slate-300 hover:text-brand-primary cursor-pointer transition-colors" />
                </div>
            </footer>
        </div>
    );
};

export default PublicProfile;
