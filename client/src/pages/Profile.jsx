import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Mail, Shield, Check, Edit2, AlertCircle, Share2, Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import Avatar from '../components/Avatar';

const Profile = () => {
    const { user, updateUser, deleteAccount } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        isPublic: user?.isPublic || false
    });
    const [stats, setStats] = useState({ total: 0, completed: 0 });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                isPublic: user.isPublic || false
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/roadmap/user/all');
                const completed = res.data.filter(r => r.isCompleted).length;
                setStats({ total: res.data.length, completed });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUser(formData);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
            try {
                await deleteAccount();
            } catch (err) {
                console.error('Failed to delete account', err);
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-ui-bg">
            <main className="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in pb-24">

                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                        Profile Settings
                    </h1>
                    <p className="text-gray-500">Manage your account details and preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar / Quick Info */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="saas-card p-6 flex flex-col items-center text-center">
                            <Avatar user={user} size="24" className="mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name || user?.username}</h2>
                            <p className="text-sm font-medium text-gray-500 mb-4">@{user?.username}</p>
                            <span className="badge-primary px-3 py-1">Free Plan</span>
                        </div>

                        <div className="saas-card p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Metrics</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Roadmaps</span>
                                    <span className="font-semibold text-gray-900">{stats.total}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-2"><Check className="w-4 h-4" /> Completed</span>
                                    <span className="font-semibold text-gray-900">{stats.completed}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="md:col-span-8 space-y-6">
                        <div className="saas-card">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-sm font-medium text-brand-primary hover:text-black transition-colors flex items-center gap-1.5"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                )}
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                className="m-input h-10 border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">Username</label>
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                className="m-input h-10 border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            className="m-input h-10 border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Shield className="w-4 h-4 text-emerald-500" />
                                            Information securely stored
                                        </div>

                                        {isEditing && (
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData({ name: user?.name, username: user?.username, email: user?.email, isPublic: user?.isPublic });
                                                    }}
                                                    className="btn-secondary px-4 py-2 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn-primary px-4 py-2 text-sm"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Privacy & Danger Zone */}
                        <div className="saas-card">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Privacy & Data</h3>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-1">Public Profile</h4>
                                        <p className="text-sm text-gray-500">Allow others to view your completed roadmaps.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newPublicStatus = !formData.isPublic;
                                            setFormData(prev => ({ ...prev, isPublic: newPublicStatus }));
                                            if (!isEditing) {
                                                updateUser({ ...formData, isPublic: newPublicStatus });
                                            }
                                        }}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isPublic ? 'bg-brand-primary' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex items-start justify-between gap-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-red-600 mb-1 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Delete Account
                                        </h4>
                                        <p className="text-sm text-gray-500">Permanently remove your account and all associated data.</p>
                                    </div>
                                    <button 
                                        onClick={handleDeleteAccount}
                                        className="shrink-0 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                    >
                                        Delete Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
