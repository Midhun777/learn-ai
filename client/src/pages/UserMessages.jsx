import { useState, useEffect, useContext, useRef } from 'react';
import { 
    MessageSquare, 
    Send,
    Search,
    Inbox,
    Clock,
    MoreHorizontal,
    CheckCheck,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import Avatar from '../components/Avatar';
import axios from 'axios';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const socket = io('http://localhost:5000');

const UserMessages = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
        
        socket.on('receive_message', (data) => {
            // Only add if it's from someone else (to avoid duplication with optimistic UI)
            if (data.sender !== currentUser.id && selectedConv && (data.sender === selectedConv._id || data.recipient === selectedConv._id)) {
                setMessages(prev => [...prev, data]);
            }
            // Also refresh conversations list to show last message
            fetchConversations();
        });

        return () => socket.off('receive_message');
    }, [selectedConv]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            // Group messages by contact locally for simplicity in this version
            const res = await axios.get('http://localhost:5000/api/mentor/my-messages');
            const allMessages = res.data;
            
            // Deduplicate contacts
            const contactsMap = {};
            allMessages.forEach(m => {
                const contact = m.sender._id === currentUser.id ? m.recipient : m.sender;
                if (!contactsMap[contact._id]) {
                    contactsMap[contact._id] = {
                        ...contact,
                        lastMessage: m.content,
                        timestamp: m.createdAt,
                        unread: !m.read && m.recipient === currentUser.id
                    };
                }
            });
            
            setConversations(Object.values(contactsMap).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
            setLoading(false);
        } catch (err) {
            console.error('Error fetching conversations:', err);
            setLoading(false);
        }
    };

    const fetchMessages = async (contactId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/mentor/messages/${contactId}`);
            setMessages(res.data);
            
            // Join socket room
            const roomId = [currentUser.id, contactId].sort().join('-');
            socket.emit('join_room', roomId);
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    };

    const handleSelectConv = (conv) => {
        setSelectedConv(conv);
        fetchMessages(conv._id);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        const roomId = [currentUser.id, selectedConv._id].sort().join('-');
        const messageData = {
            roomId,
            sender: currentUser.id,
            recipient: selectedConv._id,
            content: newMessage,
            createdAt: new Date().toISOString()
        };

        try {
            // Save to DB
            await axios.post('http://localhost:5000/api/mentor/message', {
                recipientId: selectedConv._id,
                content: newMessage
            });

            // Emit via socket
            socket.emit('send_message', messageData);
            
            // Update UI optimistically
            setMessages(prev => [...prev, messageData]);
            setNewMessage('');
            fetchConversations();
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-ui-bg flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-64px)] lg:h-screen bg-ui-bg flex animate-fade-in overflow-hidden">
            
            {/* Conversations Sidebar */}
            <div className={`w-full lg:w-96 bg-white border-r border-ui-border flex flex-col ${selectedConv ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-6 border-b border-ui-border bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                             Mentors
                            <Sparkles className="w-5 h-5 text-brand-primary" />
                        </h1>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                            Live
                        </div>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search mentors..."
                            className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-50/50">
                    {conversations.length > 0 ? conversations.map((conv) => (
                        <div 
                            key={conv._id}
                            onClick={() => handleSelectConv(conv)}
                            className={`p-5 flex gap-4 cursor-pointer transition-all duration-300 border-b border-ui-border/50 relative group ${selectedConv?._id === conv._id ? 'bg-white shadow-premium z-10' : 'hover:bg-white/70'}`}
                        >
                            <Avatar user={conv} size="14" className="shadow-soft group-hover:scale-105" />

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-slate-900 truncate tracking-tight">{conv.name}</h3>
                                    <span className="text-[10px] font-medium text-slate-400">
                                        {formatDistanceToNow(new Date(conv.timestamp), { addSuffix: false })}
                                    </span>
                                </div>
                                <p className={`text-[13px] truncate ${conv.unread ? 'text-brand-primary font-bold' : 'text-slate-500 font-medium opacity-80'}`}>
                                    {conv.lastMessage}
                                </p>
                            </div>
                            
                            {conv.unread && (
                                <div className="w-2 h-2 rounded-full bg-brand-primary shadow-glow absolute right-5 top-1/2 -translate-y-1/2"></div>
                            )}
                        </div>
                    )) : (
                        <div className="p-12 text-center space-y-4 opacity-50">
                            <Clock className="w-12 h-12 mx-auto text-slate-300" />
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Loading messages...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-white ${!selectedConv ? 'hidden lg:flex items-center justify-center' : 'flex'}`}>
                {selectedConv ? (
                    <>
                        <div className="p-4 lg:p-6 border-b border-ui-border flex items-center justify-between bg-white/80 backdrop-blur sticky top-0 z-20 shadow-sm">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedConv(null)} className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                                </button>
                                <Avatar user={selectedConv} size="12" className="shadow-soft" />
                                <div>
                                    <h2 className="font-extrabold text-slate-900 tracking-tight leading-none mb-1">{selectedConv.name}</h2>
                                    <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest animate-pulse">Online</span>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                                <MoreHorizontal className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50/30">
                            {messages.map((m, i) => {
                                const isMe = (m.sender === currentUser.id || m.sender?._id === currentUser.id);
                                return (
                                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                                        <div className={`max-w-[85%] md:max-w-[70%] space-y-1.5`}>
                                            <div className={`p-4 md:p-5 rounded-[24px] shadow-premium text-[14px] leading-relaxed font-medium transition-all hover:scale-[1.01] ${isMe ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-ui-border rounded-tl-none'}`}>
                                                {m.content}
                                            </div>
                                            <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-300 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {isMe && <CheckCheck className="w-3.5 h-3.5 text-brand-primary/50" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-6 border-t border-ui-border bg-white shadow-2xl z-30">
                            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-50 border-transparent rounded-[20px] px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="w-14 h-14 bg-slate-900 text-white flex items-center justify-center rounded-[20px] transition-all hover:scale-105 hover:bg-brand-primary shadow-premium disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-slate-900"
                                >
                                    <Send className="w-6 h-6" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-8 text-center p-10 opacity-30 select-none">
                        <div className="w-24 h-24 bg-slate-100 rounded-[36px] flex items-center justify-center text-slate-300 border border-slate-200">
                            <MessageSquare className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-2">My Messages</h2>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Select a mentor to start a conversation.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMessages;
