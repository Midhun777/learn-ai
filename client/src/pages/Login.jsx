import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <div className="glass-panel w-full max-w-md p-10 animate-fade-in relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2 relative z-10">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8 relative z-10">Sign in to continue your learning journey</p>

                <form className="space-y-5 relative z-10" onSubmit={onSubmit}>
                    <div className="relative group">
                        <Mail className="absolute top-3.5 left-4 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            required
                            className="floating-input pl-12"
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute top-3.5 left-4 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            required
                            className="floating-input pl-12"
                        />
                    </div>

                    <button type="submit" className="btn-primary-glass w-full flex items-center justify-center gap-2 group">
                        Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-center text-gray-600 mt-6 text-sm">
                        Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
