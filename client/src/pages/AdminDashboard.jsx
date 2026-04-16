import { useState, useEffect, useContext } from 'react';
import {
    Users,
    Layers,
    Activity,
    Shield,
    Search,
    Trash2,
    UserX,
    CheckCircle,
    ArrowUpRight,
    SearchSlash,
    Server,
    Clock,
    Filter,
    Award,
    Cpu,
    Lock,
    Unlock,
    Settings2,
    RefreshCw,
    MoreHorizontal,
    MoreVertical,
    Check,
    FileText,
    Flame
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AdminDashboard = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [roadmaps, setRoadmaps] = useState([]);
    const [growthData, setGrowthData] = useState({ dailySignups: [], monthlyActivity: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, users, content, audit
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes, logsRes, growthRes, roadmapsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats'),
                axios.get('http://localhost:5000/api/admin/users'),
                axios.get('http://localhost:5000/api/admin/logs'),
                axios.get('http://localhost:5000/api/admin/analytics/growth').catch(() => ({ data: { dailySignups: [], monthlyActivity: [] } })),
                axios.get('http://localhost:5000/api/admin/roadmaps')
            ]);

            setStats(statsRes.data.stats);
            setUsers(usersRes.data);
            setLogs(logsRes.data);
            setGrowthData(growthRes.data);
            setRoadmaps(roadmapsRes.data.roadmaps || []);
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (id) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/admin/users/${id}/status`);
            setUsers(users.map(u => u._id === id ? { ...u, isActive: res.data.isActive } : u));
        } catch (err) {
            alert('Status update failed: ' + (err.response?.data?.msg || err.message));
        }
    };

    const changeUserRole = async (id, role) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role });
            setUsers(users.map(u => u._id === id ? { ...u, role: res.data.role } : u));
        } catch (err) {
            alert('Role update failed: ' + (err.response?.data?.msg || err.message));
        }
    };

    const resetPassword = async (id) => {
        if (!window.confirm('Reset this user\'s password to a temporary one?')) return;
        try {
            const res = await axios.post(`http://localhost:5000/api/admin/users/${id}/reset-password`);
            alert(`Temporary Password Generated: ${res.data.tempPassword}\n\nPlease share this with the user.`);
        } catch (err) {
            alert('Password reset failed: ' + (err.response?.data?.msg || err.message));
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('PERMANENT DELETION: Are you sure? This cannot be undone.')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            fetchAdminData();
        } catch (err) {
            alert('Deletion failed: ' + (err.response?.data?.msg || err.message));
        }
    };

    const deleteRoadmap = async (id) => {
        if (!window.confirm('PERMANENT DELETION: Are you sure you want to delete this roadmap? This action cannot be undone.')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/roadmaps/${id}`);
            setRoadmaps(roadmaps.filter(r => r._id !== id));
            fetchAdminData(); // Refresh logs and stats
        } catch (err) {
            alert('Roadmap deletion failed: ' + (err.response?.data?.msg || err.message));
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <div className="min-h-screen bg-ui-bg flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Synchronizing Neural Grid...</p>
            </div>
        </div>
    );

    return (
        <div className="p-8 lg:p-12 space-y-12 animate-fade-in max-w-[1600px] mx-auto">
            {/* Command Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-brand-primary flex items-center justify-center shadow-glow">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-1">System Core 01</span>
                            <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Verified Administrator</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase">Command <span className="gradient-text">Center.</span></h1>
                </div>

                <div className="flex bg-white p-1.5 rounded-[28px] shadow-premium border border-slate-100 backdrop-blur-md overflow-x-auto no-scrollbar">
                    {['overview', 'users', 'content', 'audit'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 lg:px-10 py-3.5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-glow translate-y-[-2px]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                        >
                            {tab === 'content' ? 'Content Moderation' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-12">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { label: 'Total Users', value: stats?.users, icon: Users, color: 'brand-primary' },
                            { label: 'Active Users', value: stats?.activeUsers, icon: Activity, color: 'emerald-500' },
                            { label: 'AI Roadmaps', value: stats?.roadmaps, icon: Layers, color: 'indigo-500' },
                            { label: 'Certificates', value: stats?.certificates, icon: Award, color: 'amber-500' },
                            { label: 'AI Needs Today', value: stats?.aiRequests, icon: Cpu, color: 'rose-500' }
                        ].map((s, idx) => (
                            <div key={idx} className="saas-card p-10 bg-white space-y-6 group hover:border-slate-900/5 transition-all relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute -right-8 -top-8 w-24 h-24 bg-slate-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className={`p-4 rounded-2xl bg-white border border-slate-100 shadow-soft group-hover:rotate-12 transition-transform`}>
                                        <s.icon className={`w-6 h-6 text-${s.color}`} />
                                    </div>
                                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">+4.2%</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 leading-none">{s.label}</p>
                                    <p className="text-4xl font-black text-slate-900 tracking-tight leading-none tabular-nums">{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Analytics Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Daily Signups Chart */}
                        <div className="saas-card p-10 bg-white space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-2">Daily Signups</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Network Growth Analytics</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={growthData.dailySignups}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 9, fontWeight: 900, fill: '#cbd5e1' }}
                                            tickFormatter={(val) => val.split('-').slice(2).join('')}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '10px' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Monthly Activity Chart */}
                        <div className="saas-card p-10 bg-white space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-2">Monthly Intelligence Activity</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cross-Dataset Usage Metrics</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Activity className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={growthData.monthlyActivity}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 9, fontWeight: 900, fill: '#cbd5e1' }}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '10px' }}
                                        />
                                        <Bar dataKey="count" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recent Snippet */}
                    <div className="saas-card overflow-hidden bg-white shadow-premium">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">Neural Audit Pipeline</h3>
                            </div>
                            <button onClick={() => setActiveTab('audit')} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Analyze Full Stack</button>
                        </div>
                        <div className="divide-y divide-slate-50/50">
                            {logs.slice(0, 5).map(log => (
                                <div key={log._id} className="p-6 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 font-mono text-[10px]">
                                            {log.action.substring(0, 1)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 uppercase leading-none mb-2">{log.action}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Operator: {log.userId?.username || 'System'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Users Management Tab */}
            {activeTab === 'users' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                    {/* Controls Bar */}
                    <div className="p-4 bg-white rounded-[32px] shadow-premium border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-[500px]">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input
                                type="text"
                                placeholder="Locate identity (Username or Email)..."
                                className="w-full bg-slate-50/50 border-none pl-16 pr-8 py-4 rounded-[22px] text-xs font-black text-slate-900 placeholder:text-slate-300 transition-all focus:ring-4 focus:ring-slate-100 uppercase tracking-widest"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex bg-slate-100/50 p-1 rounded-2xl w-full">
                                {['all', 'user', 'mentor', 'admin'].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setFilterRole(role)}
                                        className={`flex-1 px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${filterRole === role ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                            <button onClick={fetchAdminData} className="p-4 rounded-2xl bg-slate-900 text-white shadow-glow hover:rotate-180 transition-transform duration-700 active:scale-90">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="saas-card bg-white overflow-hidden shadow-premium border-none rounded-[48px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity Core</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Permission Level</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Tactical Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map(u => (
                                    <tr key={u._id} className={`group hover:bg-slate-50/50 transition-all duration-300 ${!u.isActive ? 'opacity-50 grayscale' : ''}`}>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center font-black text-lg shadow-soft border-2 transition-all group-hover:rotate-6 ${u.isActive ? 'bg-white border-brand-primary/20 text-brand-primary' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                                    {u.username.substring(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-1">{u.username}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">{u.email}</p>
                                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">ID: {u._id.substring(18)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <button
                                                onClick={() => toggleUserStatus(u._id)}
                                                disabled={u._id === currentUser?.id}
                                                className={`flex items-center gap-3 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${u.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}
                                            >
                                                {u.isActive ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                                {u.isActive ? 'Operational' : 'Deactivated'}
                                            </button>
                                        </td>
                                        <td className="px-10 py-8">
                                            <select
                                                value={u.role}
                                                onChange={(e) => changeUserRole(u._id, e.target.value)}
                                                disabled={u._id === currentUser?.id}
                                                className="bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer appearance-none text-slate-900"
                                            >
                                                <option value="user">Standard User</option>
                                                <option value="mentor">System Mentor</option>
                                                <option value="admin">Main Administrator</option>
                                            </select>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                <button
                                                    onClick={() => resetPassword(u._id)}
                                                    className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-brand-primary hover:border-brand-primary/20 hover:shadow-glow transition-all active:scale-90"
                                                    title="Reset Security Protocol (Password)"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(u._id)}
                                                    disabled={u._id === currentUser?.id}
                                                    className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-400 hover:text-rose-600 hover:bg-rose-100 hover:shadow-soft transition-all active:scale-90"
                                                    title="Purge Identity (Delete)"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="p-32 flex flex-col items-center justify-center gap-6 text-center">
                                <div className="p-10 bg-slate-50 rounded-full">
                                    <SearchSlash className="w-16 h-16 text-slate-200" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Zero Matches Found</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adjust filters or search parameters to re-scan</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Content Moderation Tab */}
            {activeTab === 'content' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="p-10 bg-white rounded-[48px] shadow-premium border border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Global Roadmaps Hub</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monitor and moderate AI-generated learning paths</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-full text-indigo-500">
                            <Layers className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="saas-card bg-white overflow-hidden shadow-premium border-none rounded-[48px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Target Skill / ID</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Creator Node</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Moderator Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {roadmaps.map(roadmap => (
                                    <tr key={roadmap._id} className={`group hover:bg-slate-50/50 transition-all duration-300`}>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center font-black text-lg shadow-soft border-2 transition-all group-hover:rotate-6 bg-indigo-50 border-indigo-100 text-indigo-500`}>
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{roadmap.skill}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">Created {new Date(roadmap.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">ID: {roadmap._id.substring(18)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                                                    {roadmap.userId?.username?.substring(0, 1).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-700 uppercase">{roadmap.userId?.username || 'Unknown User'}</p>
                                                    <p className="text-[9px] text-slate-400 truncate w-32">{roadmap.userId?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${roadmap.isCompleted ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                                                {roadmap.isCompleted ? <Award className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                                {roadmap.isCompleted ? 'Certified' : 'In Progress'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                <a
                                                    href={`/roadmap/${roadmap._id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/20 hover:shadow-glow transition-all active:scale-90"
                                                    title="Inspect Roadmap Content"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => deleteRoadmap(roadmap._id)}
                                                    className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-400 hover:text-white hover:bg-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all active:scale-90"
                                                    title="Incinerate Roadmap (Delete)"
                                                >
                                                    <Flame className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {roadmaps.length === 0 && (
                            <div className="p-32 flex flex-col items-center justify-center gap-6 text-center">
                                <div className="p-10 bg-slate-50 rounded-full">
                                    <SearchSlash className="w-16 h-16 text-slate-200" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Data Void</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No roadmaps currently exist within the system matrix.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'audit' && (
                <div className="saas-card bg-white overflow-hidden shadow-premium border-none rounded-[48px] animate-in slide-in-from-bottom-4 duration-700">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                        <div className="space-y-1">
                            <h3 className="font-black text-slate-900 uppercase tracking-[0.3em] text-xs">Security Protocol Stream</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Activity Persistence Matrix</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Node</span>
                            </div>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {logs.map(log => {
                            const isCritical = log.action.includes('DELETE') || log.action.includes('PURGE');
                            const isSuccess = log.action.includes('SUCCESS') || log.action.includes('LOGIN') || log.action.includes('ACTIVATE');
                            
                            return (
                                <div key={log._id} className="p-8 flex flex-col gap-6 hover:bg-slate-50/40 transition-all duration-300">
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                                                isSuccess ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                isCritical ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                'bg-indigo-50 text-indigo-600 border-indigo-100'
                                            }`}>
                                                <Server className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{log.action}</span>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                                                        <Clock className="w-3 h-3 text-slate-400" />
                                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                            {new Date(log.timestamp).toLocaleDateString()} @ {new Date(log.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-wide">
                                                    Operator <span className="text-slate-900 font-black">@{log.userId?.username || 'SYSTEM_ROOT'}</span> executed {log.action.toLowerCase().replace(/_/g, ' ')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="hidden lg:flex items-center gap-3">
                                            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verified Integrity</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                                        <div className="ml-18 p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 shadow-inner group">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FileText className="w-3 h-3 text-slate-300" />
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Resource Metadata</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {Object.entries(log.metadata).map(([key, value]) => (
                                                    <div key={key} className="space-y-1">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{key}</p>
                                                        <p className="text-[10px] font-black text-slate-700 truncate">{String(value)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
