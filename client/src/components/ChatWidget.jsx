import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ChatWidget = ({ skill }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: `Hi! I'm your AI tutor for ${skill}. Ask me anything!`, sender: 'ai' }
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

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
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
            console.error('Chat error', err);
            const errorMsg = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting right now.", sender: 'ai' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none"> {/* Container */}

            {/* Chat Window */}
            {isOpen && (
                <div className="pointer-events-auto bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-slate-200 mb-4 flex flex-col overflow-hidden origin-bottom-right">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2 font-bold">
                            <Bot className="w-5 h-5" />
                            AI Tutor ({skill})
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                                    }`}>
                                    <ReactMarkdown
                                        components={{
                                            strong: ({ node, ...props }) => <span className="font-bold" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc ml-4 space-y-1 mt-1" {...props} />,
                                            li: ({ node, ...props }) => <li className="" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                                            code: ({ node, ...props }) => <code className="bg-slate-200/50 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                {!isOpen && (
                    <span className="absolute right-full mr-4 bg-white text-slate-900 px-3 py-1 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100 pointer-events-none">
                        Ask AI Tutor
                    </span>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
