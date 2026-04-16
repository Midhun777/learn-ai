import { useState, useEffect, useContext } from 'react';
import { 
    MessageSquare, 
    User, 
    Calendar,
    Search,
    Inbox,
    Mail,
    ChevronRight,
    Bell,
    CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const UserMessages = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/mentor/my-messages');
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (messageId) => {
        // Implementation for marking as read can be added here
        setMessages(messages.map(m => m._id === messageId ? { ...m, read: true } : m));
    };

    const filteredMessages = messages.filter(m => 
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sender?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const unreadCount = messages.filter(m => !m.read).length;

    if (loading) return (
        <div className="min-h-screen bg-ui-bg flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checking Communications...</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 lg:p-10 max-w-4xl mx-auto space-y-10 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex -space-x-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                                    <User className="w-2.5 h-2.5 text-gray-400" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Guidance Stream</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Messages<span className="text-brand-accent">.</span>
                    </h1>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Filter messages..."
                        className="m-input pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Sub-header with Stats */}
            <div className="flex items-center gap-6 py-2 border-b border-ui-border">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Recent</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-black">{messages.length}</span>
                </div>
                {unreadCount > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">Unread</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black">{unreadCount}</span>
                    </div>
                )}
            </div>

            {/* Messages List */}
            <div className="space-y-4">
                {filteredMessages.length > 0 ? filteredMessages.map((m) => (
                    <div 
                        key={m._id}
                        onClick={() => markAsRead(m._id)}
                        className={`saas-card group relative p-6 cursor-pointer flex gap-6 transition-all duration-300 ${!m.read ? 'border-brand-accent/20 bg-brand-accent/[0.02]' : ''}`}
                    >
                        {!m.read && (
                            <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                        )}
                        
                        <div className="hidden sm:flex shrink-0 flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105 ${m.sender?.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-brand-accent text-white'}`}>
                                {m.sender?.name?.substring(0, 1).toUpperCase()}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-900">{m.sender?.name}</span>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${m.sender?.role === 'admin' ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                        {m.sender?.role}
                                    </span>
                                </div>
                                <span className="text-[10px] font-medium text-slate-400">
                                    {new Date(m.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="relative">
                                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                                    {m.content}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                                <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                                    <MessageSquare className="w-3 h-3" />
                                    Reply
                                </button>
                                <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Mark as Helpful
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="saas-card p-20 text-center space-y-6 bg-slate-50/50 border-dashed">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-soft mx-auto flex items-center justify-center text-slate-200">
                            <Inbox className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Empty Inbox</h2>
                            <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto">No strategic transmissions detected. Your mentors will reach out when advice is ready.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMessages;
