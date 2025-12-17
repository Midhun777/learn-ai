import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, Sparkles } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <div className="glass-panel w-full max-w-md p-10 animate-fade-in relative overflow-hidden">
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm text-indigo-600">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                    <p className="text-gray-500">Unlock your potential today</p>
                </div>

                <form className="space-y-5 relative z-10" onSubmit={onSubmit}>
                    <div className="relative group">
                        <User className="absolute top-3.5 left-4 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={onChange}
                            required
                            className="floating-input pl-12 focus:border-purple-400 focus:ring-purple-500/10"
                        />
                    </div>
                    <div className="relative group">
                        <Mail className="absolute top-3.5 left-4 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            required
                            className="floating-input pl-12 focus:border-purple-400 focus:ring-purple-500/10"
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute top-3.5 left-4 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            required
                            className="floating-input pl-12 focus:border-purple-400 focus:ring-purple-500/10"
                        />
                    </div>

                    <button type="submit" className="btn-primary-glass w-full bg-gradient-to-r from-indigo-600 to-purple-600 border-none hover:shadow-purple-500/30">
                        Join For Free
                    </button>

                    <p className="text-center text-gray-600 mt-6 text-sm">
                        Already have an account? <Link to="/login" className="text-purple-600 font-bold hover:underline">Log In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
