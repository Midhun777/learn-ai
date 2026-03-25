import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, ArrowRight, Sparkles, ChevronLeft, Terminal, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                setError('ACCESS DENIED: Administrative credentials required.');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            // Redirection logic is handled by useEffect
        } catch (err) {
            setError(err.response?.data?.msg || 'Authentication failed. Please verify credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            {/* Dark Mode Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0a] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[32px] overflow-hidden animate-fade-in relative">

                {/* Visual Panel */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0d0d0d] text-white relative h-full border-r border-white/5">
                    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,#1e1e1e_0%,transparent_50%)]"></div>
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-20">
                            <div className="w-10 h-10 bg-indigo-600/20 backdrop-blur-md rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/30 shadow-glow">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tight tracking-tight leading-none uppercase italic">Admin.Node</span>
                        </div>

                        <div className="space-y-6">
                            <div className="inline-block px-4 py-1.5 bg-indigo-500/10 rounded-pill border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                                Restricted Access Layer
                            </div>
                            <h2 className="text-5xl font-black leading-tight tracking-tight">
                                High Security <br />
                                <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Command.</span>
                            </h2>
                            <p className="text-lg text-slate-500 font-medium max-w-sm leading-relaxed">
                                Authorized personnel only. Please enter your secure credentials to bypass the system firewall.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Terminal className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">System Status</p>
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                                Core Encrypted
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="p-10 md:p-20 flex flex-col justify-center bg-[#0a0a0a]">
                    <div className="mb-12">
                        <Link to="/" className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest mb-10 hover:text-indigo-400 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                            Return
                        </Link>
                        <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-4 uppercase">Admin_Auth</h1>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Initialize Secure Connection</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Secure Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="admin@access.node"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-5 text-white font-bold placeholder:text-slate-800 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Secret Code</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-5 text-white font-bold placeholder:text-slate-800 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl text-[10px] font-black tracking-widest animate-fade-in uppercase">
                                <ShieldAlert className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-base shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] uppercase font-black tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                        >
                            {isLoading ? 'Decrypting...' : (
                                <>
                                    <span>Bypass Firewall</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-12 border-t border-white/5 text-center">
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                            <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
                            Federal Security Protocol Active
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
