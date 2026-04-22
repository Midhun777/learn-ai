import { useState, useEffect, useContext } from 'react';
import { 
    Users, 
    Search, 
    MessageSquare, 
    ChevronRight, 
    TrendingUp, 
    Clock, 
    CheckCircle2, 
    Send,
    User,
    BookOpen,
    Filter,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    ExternalLink,
    FileText
} from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const MentorDashboard = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userProgress, setUserProgress] = useState([]);
    const [messages, setMessages] = useState([]);
    const [pendingProjects, setPendingProjects] = useState([]);
    const [showApprovals, setShowApprovals] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchUserDetails(selectedUser._id);
        }
    }, [selectedUser]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const [usersRes, pendingRes] = await Promise.all([
                axios.get('http://localhost:5000/api/mentor/users'),
                axios.get('http://localhost:5000/api/mentor/pending-projects').catch(() => ({ data: [] }))
            ]);
            setUsers(usersRes.data);
            setPendingProjects(pendingRes.data || []);
            if (usersRes.data.length > 0 && !selectedUser) {
                setSelectedUser(usersRes.data[0]);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const [progressRes, messagesRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/mentor/user/${userId}/progress`),
                axios.get(`http://localhost:5000/api/mentor/messages/${userId}`)
            ]);
            setUserProgress(progressRes.data);
            setMessages(messagesRes.data);
            
            // Sync progress if empty or outdated (optional helper)
            if (progressRes.data.length === 0) {
                await syncUserProgress(userId);
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
        }
    };

    const syncUserProgress = async (userId) => {
        try {
            await axios.post(`http://localhost:5000/api/mentor/sync-progress/${userId}`);
            const progressRes = await axios.get(`http://localhost:5000/api/mentor/user/${userId}/progress`);
            setUserProgress(progressRes.data);
        } catch (err) {
            console.error('Sync failed:', err);
        }
    };

    const handleApproveProject = async (roadmapId, phaseIndex, isCapstone, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this project?`)) return;
        try {
            await axios.put(`http://localhost:5000/api/mentor/roadmaps/${roadmapId}/approve-project`, { phaseIndex, isCapstone, action });
            fetchUsers(); // Re-fetch users and pending projects
        } catch (err) {
            alert('Action failed: ' + (err.response?.data?.msg || err.message));
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            setSending(true);
            const res = await axios.post('http://localhost:5000/api/mentor/message', {
                recipientId: selectedUser._id,
                content: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setSending(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ProgressCircle = ({ percentage }) => {
        const radius = 20;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return (
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle 
                        cx="24" cy="24" r={radius} 
                        fill="transparent" 
                        stroke="#f1f5f9" 
                        strokeWidth="4" 
                    />
                    <circle 
                        cx="24" cy="24" r={radius} 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="text-brand-primary"
                    />
                </svg>
                <span className="absolute text-[9px] font-black">{percentage}%</span>
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen bg-ui-bg flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Mentor Grid...</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Mentor Overview</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
                        Mentor <span className="text-brand-accent">Dashboard.</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-xl shadow-soft border border-slate-100 flex items-center">
                        <button 
                            onClick={() => setShowApprovals(false)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${!showApprovals ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Students
                        </button>
                        <button 
                            onClick={() => setShowApprovals(true)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${showApprovals ? 'bg-amber-500 text-white shadow-glow' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Approvals {pendingProjects.length > 0 && `(${pendingProjects.reduce((acc, r) => acc + 
                                (r.phases ? r.phases.filter(p => p.handsOnProject?.status === 'Pending' && p.handsOnProject?.solutionUrl).length : 0) + 
                                (r.capstoneProject?.status === 'Pending' && r.capstoneProject?.solutionUrl ? 1 : 0), 0)})`}
                        </button>
                    </div>
                    <button onClick={fetchUsers} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl shadow-soft hover:bg-slate-50 transition-all">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
                {/* Users List Sidebar */}
                <div className="lg:col-span-4 bg-white rounded-[32px] shadow-premium border border-slate-100 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-50 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input 
                                type="text"
                                placeholder="Search students..."
                                className="w-full bg-slate-50 border-none pl-11 pr-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-brand-primary/10 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student List</span>
                            <Filter className="w-3 h-3 text-slate-300" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
                        {filteredUsers.map(u => (
                            <div 
                                key={u._id}
                                onClick={() => setSelectedUser(u)}
                                className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${selectedUser?._id === u._id ? 'bg-brand-accent text-white shadow-soft' : 'hover:bg-slate-50 text-slate-600'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${selectedUser?._id === u._id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {u.username.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-tight">{u.username}</p>
                                        <p className={`text-[9px] font-medium ${selectedUser?._id === u._id ? 'text-white/70' : 'text-slate-400'}`}>Progress: {u.overallProgress}%</p>
                                    </div>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedUser?._id === u._id ? 'translate-x-1' : 'text-slate-200'}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-8 flex flex-col gap-8 h-full">
                    {showApprovals ? (
                        <div className="bg-white rounded-[32px] shadow-premium border border-slate-100 flex flex-col overflow-hidden h-full">
                            <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-amber-50/30">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Project Approvals</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Review faculty assigned submissions</p>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                                {pendingProjects.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-40">
                                        <CheckCircle2 className="w-12 h-12 text-slate-300 mb-4" />
                                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">All caught up</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingProjects.map(roadmap => {
                                            const pendingItems = [];
                                            roadmap.phases && roadmap.phases.forEach((p, idx) => {
                                                if (p.handsOnProject && p.handsOnProject.status === 'Pending' && p.handsOnProject.solutionUrl) {
                                                    pendingItems.push({ ...p.handsOnProject, isCapstone: false, phaseIndex: idx, skill: roadmap.skill, roadmapId: roadmap._id, username: roadmap.userId?.username });
                                                }
                                            });
                                            if (roadmap.capstoneProject && roadmap.capstoneProject.status === 'Pending' && roadmap.capstoneProject.solutionUrl) {
                                                pendingItems.push({ ...roadmap.capstoneProject, isCapstone: true, skill: roadmap.skill, roadmapId: roadmap._id, username: roadmap.userId?.username });
                                            }
                                            return pendingItems.map((item, i) => (
                                                <div key={`${item.roadmapId}-${i}`} className="p-6 saas-card bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center shadow-sm">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.title || 'Project Submission'}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-1">Student: <span className="text-slate-600">{item.username}</span> • Topic: {item.skill}</p>
                                                            <a href={item.solutionUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">
                                                                <ExternalLink className="w-3 h-3" /> Inspect Asset Reference
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                                        <button onClick={() => handleApproveProject(item.roadmapId, item.phaseIndex, item.isCapstone, 'Reject')} className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-[10px] font-black uppercase tracking-widest transition-colors">Reject</button>
                                                        <button onClick={() => handleApproveProject(item.roadmapId, item.phaseIndex, item.isCapstone, 'Approve')} className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-[10px] font-black uppercase tracking-widest transition-colors shadow-glow">Approve</button>
                                                    </div>
                                                </div>
                                            ));
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : selectedUser ? (
                        <>
                            {/* User Overview Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="saas-card p-6 flex items-center gap-6">
                                    <ProgressCircle percentage={selectedUser.overallProgress} />
                                    <div>
                                        <p className="text-subtle uppercase tracking-widest leading-none mb-1">Average Progress</p>
                                        <p className="text-2xl font-bold text-slate-900 tabular-nums">{selectedUser.overallProgress}%</p>
                                    </div>
                                </div>
                                <div className="saas-card p-6 flex items-center gap-6">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-subtle uppercase tracking-widest leading-none mb-1">Total Roadmaps</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{userProgress.length}</p>
                                    </div>
                                </div>
                                <div className="saas-card p-6 flex items-center gap-6 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => syncUserProgress(selectedUser._id)}>
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-subtle uppercase tracking-widest leading-none mb-1">Last Sync</p>
                                        <p className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                            Synchronized <RefreshCw className="w-3 h-3 text-slate-300" />
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">
                                {/* Career Progress */}
                                <div className="bg-white rounded-[32px] shadow-premium border border-slate-100 flex flex-col overflow-hidden">
                                    <div className="p-6 border-b border-slate-50">
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Target Roadmaps</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                                        {userProgress.length > 0 ? userProgress.map(p => (
                                            <div key={p._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{p.roadmapTitle}</span>
                                                    <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${p.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-primary/10 text-brand-primary'}`}>
                                                        {p.status}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-brand-primary transition-all duration-1000" 
                                                            style={{ width: `${p.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                        <span>Sync Alpha</span>
                                                        <span>{p.percentage}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-40">
                                                <AlertCircle className="w-10 h-10 text-slate-300" />
                                                <p className="text-[10px] font-black uppercase tracking-widest">No active protocols detected</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Guidance Messenger */}
                                <div className="bg-white rounded-[32px] shadow-premium border border-slate-100 flex flex-col overflow-hidden">
                                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-xs">
                                                {selectedUser.username.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{selectedUser.username}</h3>
                                                <p className="text-[9px] text-slate-400 font-medium">Direct Message</p>
                                            </div>
                                        </div>
                                        <div className="flex -space-x-1">
                                            {[1, 2].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                                                    <User className="w-3 h-3 text-slate-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/20">
                                        {messages.map((m, idx) => {
                                            const isMe = m.sender === currentUser.id;
                                            return (
                                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                                    <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                                        <div className={`p-4 rounded-2xl text-[12px] leading-relaxed shadow-soft border ${isMe ? 'bg-slate-900 text-white rounded-br-none border-slate-900' : 'bg-white text-slate-700 rounded-bl-none border-slate-100'}`}>
                                                            {m.content}
                                                        </div>
                                                        <span className="text-[9px] font-medium text-slate-400 px-1">
                                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {messages.length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-30">
                                                <MessageSquare className="w-10 h-10 text-slate-300" />
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Secure Channel</p>
                                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">Encrypted transmissions between mentor <br /> and entity node</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-50 flex gap-3 items-center">
                                        <div className="flex-1 relative">
                                            <input 
                                                type="text"
                                                placeholder="Type your guidance..."
                                                className="m-input pr-10 focus:ring-0 focus:border-slate-200 bg-slate-50 border-transparent hover:bg-slate-100/50 transition-colors"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                            />
                                        </div>
                                        <button 
                                            disabled={sending || !newMessage.trim()}
                                            className="w-10 h-10 bg-slate-900 text-white rounded-full shadow-premium flex items-center justify-center active:scale-95 disabled:opacity-20 transition-all hover:bg-black"
                                        >
                                            <Send className={`w-4 h-4 ${sending ? 'animate-pulse' : ''}`} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-20 gap-6">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-soft flex items-center justify-center text-slate-200">
                                <User className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Initiate Mentorship</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-sm mx-auto">Select a student from the matrix roster to begin tracking their cognitive evolution and provide strategic guidance.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard;
