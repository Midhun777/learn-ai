import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Award, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        // We can add a "Courses" page later if needed, for now Dashboard is the hub
        { icon: BookOpen, label: 'My Learning', path: '/dashboard' },
        { icon: Award, label: 'Certificates', path: '/dashboard' }, // Links to dashboard for now, easy to split later
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 sidebar-glass z-50 flex flex-col transition-all duration-300">
            {/* Logo Area */}
            <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-200/60">
                <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="relative p-2 bg-blue-50/50 rounded-xl text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors duration-300">
                        <BookOpen className="w-6 h-6" />
                    </div>
                </div>
                <span className="hidden lg:block ml-3 text-2xl font-bold text-slate-900 tracking-tight">
                    Learn<span className="text-blue-600">AI</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group font-medium ${isActive(item.path)
                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        title={item.label}
                    >
                        <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive(item.path) ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span className="hidden lg:block">{item.label}</span>
                        {isActive(item.path) && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 hidden lg:block"></div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* User Profile / Bottom Actions */}
            <div className="p-4 border-t border-white/20">
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden lg:block font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
