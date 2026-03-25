import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Box, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ui-bg flex items-center justify-center p-6 selection:bg-brand-primary selection:text-white">
            <div className="w-full max-w-md animate-fade-in relative z-10">
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-xl shadow-sm hover:scale-105 transition-transform duration-300 mb-6 group">
                        <Box className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Welcome back</h1>
                    <p className="text-gray-500 text-sm">Log in to your account to continue</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-premium border border-ui-border p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="m-input pl-10 h-11"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <button type="button" className="text-xs font-medium text-brand-primary hover:text-black transition-colors">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="m-input pl-10 h-11"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-fade-in shadow-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full h-11 mt-2 text-sm font-medium justify-center flex items-center gap-2 shadow-sm"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-gray-900 hover:text-black hover:underline underline-offset-4 transition-all">
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Subtle mesh background effect - pure CSS */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 z-0 pointer-events-none"></div>
        </div>
    );
};

export default Login;
