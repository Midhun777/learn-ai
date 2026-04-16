import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { triggerLevelUpConfetti } from '../utils/confetti';

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
                    const res = await axios.get(`${API_URL}/auth/me`);
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete axios.defaults.headers.common['x-auth-token'];
                    setUser(null);
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

    const refreshUser = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/me`);
            const newData = res.data;
            
            // Check for level up celebration
            if (user && newData.level > user.level) {
                triggerLevelUpConfetti();
            }

            setUser(newData);
            localStorage.setItem('user', JSON.stringify(newData));
            return newData;
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const register = async (name, username, email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, { name, username, email, password });
            const { token, user: userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['x-auth-token'] = token;
            setUser(userData);
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            throw error;
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
        <AuthContext.Provider value={{ user, register, login, logout, updateUser, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
