import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['x-auth-token'] = token;
                try {
                    // Since we don't have a /me endpoint yet, we'll just decode or persist from handling
                    // For now, let's just assume valid if token exists, or decode if we had a library
                    // Better: Let's add a rudimentary check or just wait for the user object from login
                    // Real-world: Call /api/auth/me. For now, rely on stored user or login response.

                    // Actually, let's just create a dummy "me" endpoint or store user in localstorage too
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const register = async (formData) => {
        const res = await axios.post('http://localhost:5000/api/auth/register', formData);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user)); // Simple user persistence
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        setUser(res.data.user);
    };

    const login = async (formData) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', formData);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
