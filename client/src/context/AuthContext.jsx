import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

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

        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete axios.defaults.headers.common['x-auth-token'];
                    setUser(null);
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const register = async (name, username, email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, { name, username, email, password });
            const { token, user: userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData)); // Simple user persistence
            axios.defaults.headers.common['x-auth-token'] = token;
            setUser(userData);
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            throw error; // Re-throw to allow component to handle
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, user: userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['x-auth-token'] = token;
            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const updateUser = async (data) => {
        try {
            const res = await axios.put(`${API_URL}/auth/profile`, data);
            const { user: userData } = res.data;
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Update failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
