import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Box } from 'lucide-react';

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Hide Navbar if user is logged in (Sidebar is used instead)
    if (user && location.pathname !== '/') return null;

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-ui-border z-[100] flex items-center justify-between px-6 lg:px-12 transition-all duration-300">
            <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Box className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">
                    SkillRoute
                </span>
            </Link>

            <div className="flex items-center gap-6">
                {user ? (
                    <Link
                        to="/dashboard"
                        className="btn-primary py-2 px-5 text-sm rounded-full"
                    >
                        Go to My Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="btn-primary py-2 px-5 text-sm rounded-full"
                        >
                            Start for Free
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
