import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, Zap, User } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ChatWidget = ({ skill }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: `Hello! I'm your AI mentor for **${skill}**. How can I help clarify your mission today?`, sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input.trim(), sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/roadmap/chat', {
                message: userMsg.text,
                skill: skill
            });

            const aiMsg = { id: Date.now() + 1, text: res.data.reply, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            const errorMsg = { id: Date.now() + 1, text: "Interface disruption. Please retry synchronization.", sender: 'ai' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end pointer-events-none">
            {/* Chat Window: Premium Glass Float */}
            {isOpen && (
                <div className="pointer-events-auto w-[400px] h-[650px] bg-white rounded-[32px] border border-slate-100 mb-8 flex flex-col overflow-hidden animate-fade-in origin-bottom-right shadow-premium group">
                    {/* Header: Indigo Gradient Overlay */}
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-8 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -translate-y-16 translate-x-16"></div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white leading-none mb-1">AI Assistant</h4>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all relative z-10 border border-white/10">
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/20 scrollbar-hide">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-4 max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                    </div>
                                    <div className={`p-5 rounded-2xl text-sm font-medium leading-relaxed shadow-soft transition-all ${msg.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-slate-50 rounded-tl-none'
                                        }`}>
                                        <ReactMarkdown
                                            components={{
                                                strong: ({ ...props }) => <span className="font-black text-indigo-400" {...props} />,
                                                ul: ({ ...props }) => <ul className="list-disc ml-4 space-y-3 mt-4" {...props} />,
                                                p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                                code: ({ ...props }) => <code className="bg-slate-900/5 text-brand-primary px-2 py-0.5 rounded-lg font-mono text-[11px]" {...props} />
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-5 py-3 rounded-2xl border border-slate-50 shadow-soft flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-4">
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything..."
                                className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-brand-primary/10 border border-transparent focus:border-brand-primary/20 transition-all placeholder:text-slate-400"
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="bg-brand-primary text-white w-14 h-14 flex items-center justify-center rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-glow"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto w-20 h-20 bg-indigo-600 text-white rounded-3xl shadow-glow hover:scale-110 active:scale-90 transition-all flex items-center justify-center relative group"
            >
                <div className="absolute inset-0 bg-brand-primary/20 rounded-3xl animate-ping opacity-20 pointer-events-none"></div>
                {isOpen ? <X className="w-10 h-10" /> : <MessageCircle className="w-10 h-10" />}
                {!isOpen && (
                    <div className="absolute right-full mr-8 bg-slate-900/90 backdrop-blur-md text-white py-3 px-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border border-white/10 shadow-premium flex items-center gap-3">
                        <Zap className="w-4 h-4 text-brand-primary fill-current" />
                        AI_INITIALIZE
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
