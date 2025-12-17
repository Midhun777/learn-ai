import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { BookOpen, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled || user ? 'bg-white/40 backdrop-blur-xl border-b border-white/30 shadow-sm' : 'bg-transparent'} ${user ? 'lg:pl-64' : ''}`}>
            <div className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    {/* Public: Logo, Private: Breadcrumb/Title */}
                    {!user ? (
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="relative p-2 bg-blue-50 rounded-xl text-blue-600 shadow-sm border border-blue-100">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">Learn<span className="text-blue-600">AI</span></span>
                        </Link>
                    ) : (
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight capitalize border-l-2 border-slate-200 pl-4">
                            {location.pathname.split('/')[1] || 'Dashboard'}
                        </h2>
                    )}

                    <div className="flex items-center space-x-2 md:space-x-6">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-sm font-bold text-slate-900">{user.username}</span>
                                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2 rounded-full border border-blue-100">Pro Member</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-slate-200 shadow-sm">
                                    <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="px-5 py-2.5 text-slate-600 font-medium hover:text-blue-600 transition">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary-glass py-2.5 px-6 rounded-xl text-sm shadow-md shadow-blue-500/10">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
