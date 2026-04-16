import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Award, Settings, LogOut, User, Box, ChevronRight, Shield, FileText, Briefcase, MessageSquare, Trophy } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const baseNavItems = [
        { icon: LayoutDashboard, label: 'My Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'Learning Paths', path: '/dashboard' },
        { icon: MessageSquare, label: 'Community', path: '/community' },
        { icon: FileText, label: 'Saved Profile', path: '/career/resume' },
        { icon: Briefcase, label: 'Suggestions', path: '/career-recommendation' },
        { icon: Trophy, label: 'Top Learners', path: '/leaderboard' },
        { icon: Award, label: 'Badges', path: '/dashboard' },
    ];

    const mentorNavItems = (user?.role === 'mentor' || user?.role === 'admin') ? [
        { icon: Shield, label: 'Mentor Console', path: '/mentor/dashboard' }
    ] : [];

    const adminNavItems = user?.role === 'admin' ? [
        { icon: Shield, label: 'Admin Console', path: '/admin/dashboard' }
    ] : [];

    const userMessagesItem = [
        { icon: MessageSquare, label: 'Messages', path: '/messages' }
    ];

    const navItems = [...baseNavItems, ...userMessagesItem, ...mentorNavItems, ...adminNavItems];

    if (!user) return null;

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-ui-border z-40 hidden lg:flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-ui-border">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <Box className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900 leading-none">
                        SkillRoute
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu</p>
                {navItems.map((item, idx) => (
                    <Link
                        key={idx}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors duration-150 ${isActive(item.path)
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <item.icon className={`w-4 h-4 ${isActive(item.path) ? 'text-gray-900' : 'text-gray-400'}`} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-ui-border">
                <div
                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => navigate('/profile')}
                >
                    <div className="w-10 h-10 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {user?.username}
                            </p>
                            <span className="text-[10px] font-bold bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded-full">
                                Level {user?.level || 1}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user?.xp || 0} Points earned</p>
                    </div>
                </div>
            </div>

            {/* Logout */}
            <div className="px-4 pb-4">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
