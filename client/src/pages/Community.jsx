import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Heart, MessageCircle, Send, User, Sparkles, MessageSquare, Edit2, Trash2, X, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Community = () => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentInputs, setCommentInputs] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/community');
            setPosts(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch posts', err);
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await axios.post('http://localhost:5000/api/community', { content: newPostContent });
            setPosts([res.data, ...posts]);
            setNewPostContent('');
        } catch (err) {
            console.error('Failed to create post', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/community/${postId}/like`);
            setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data } : p));
        } catch (err) {
            console.error('Failed to like post', err);
        }
    };

    const handleComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text || !text.trim()) return;

        try {
            const res = await axios.post(`http://localhost:5000/api/community/${postId}/comment`, { text });
            setPosts(posts.map(p => p._id === postId ? { ...p, comments: res.data } : p));
            setCommentInputs({ ...commentInputs, [postId]: '' });
        } catch (err) {
            console.error('Failed to add comment', err);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this insight?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/community/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
        } catch (err) {
            console.error('Failed to delete post', err);
        }
    };

    const handleUpdate = async (postId) => {
        if (!editContent.trim()) return;

        try {
            const res = await axios.put(`http://localhost:5000/api/community/${postId}`, { content: editContent });
            setPosts(posts.map(p => p._id === postId ? { ...p, content: res.data.content } : p));
            setEditingId(null);
        } catch (err) {
            console.error('Failed to update post', err);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-ui-bg font-sans">
            <main className="max-w-3xl mx-auto p-6 lg:p-12 animate-fade-in pb-24">
                
                {/* Header */}
                <div className="mb-10 text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 flex items-center gap-3">
                        Community Insights
                        <Sparkles className="w-6 h-6 text-brand-primary" />
                    </h1>
                    <p className="text-gray-500 font-medium">Share what you're learning and high-five others.</p>
                </div>

                {/* Create Post Card */}
                <div className="saas-card p-6 mb-12 border-brand-primary/10 shadow-premium bg-gradient-to-br from-white to-indigo-50/20">
                    <form onSubmit={handleCreatePost}>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 border border-gray-200">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <textarea
                                    className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder:text-gray-400 resize-none min-h-[80px]"
                                    placeholder="What's your latest learning victory?"
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    disabled={isSubmitting}
                                />
                                <div className="flex justify-end pt-2 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !newPostContent.trim()}
                                        className="btn-primary py-2 px-6 rounded-full text-sm font-bold shadow-soft disabled:opacity-50"
                                    >
                                        Share Insight
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Feed */}
                <div className="space-y-8">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <article key={post._id} className="saas-card bg-white p-6 md:p-8 hover:border-gray-300 transition-all duration-300 relative group">
                                <div className="flex gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-[18px] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm shrink-0 overflow-hidden">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-base font-bold text-gray-900 leading-none mb-1">
                                                    {post.user?.name || 'Someone'}
                                                </h4>
                                                <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">
                                                    @{post.user?.username || 'learner'} • Level {post.user?.level || 1}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pl-0 md:pl-16 mb-8">
                                    {editingId === post._id ? (
                                        <div className="space-y-4">
                                            <textarea
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-800 text-lg focus:ring-1 focus:ring-brand-primary outline-none"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button 
                                                    onClick={() => setEditingId(null)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-full transition-all"
                                                >
                                                    <X className="w-4 h-4" /> Cancel
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdate(post._id)}
                                                    className="flex items-center gap-2 px-6 py-2 text-sm font-bold bg-brand-primary text-white rounded-full shadow-glow transition-all"
                                                >
                                                    <Check className="w-4 h-4" /> Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                                            {post.content}
                                        </p>
                                    )}
                                </div>

                                <div className="pl-0 md:pl-16 flex items-center gap-8 pt-6 border-t border-gray-50">
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className={`flex items-center gap-2 text-sm font-bold transition-colors ${post.likes.includes(user?._id) ? 'text-rose-500' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${post.likes.includes(user?._id) ? 'fill-rose-500' : ''}`} />
                                        {post.likes.length}
                                    </button>
                                    <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                                        <MessageCircle className="w-5 h-5" />
                                        {post.comments.length}
                                    </button>
                                    
                                    {/* Author Actions */}
                                    {post.user?._id === user?._id && (
                                        <div className="flex items-center gap-4 ml-auto lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => {
                                                    setEditingId(post._id);
                                                    setEditContent(post.content);
                                                }}
                                                className="text-gray-400 hover:text-brand-primary transition-colors"
                                                title="Edit Insight"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(post._id)}
                                                className="text-gray-400 hover:text-rose-500 transition-colors"
                                                title="Delete Insight"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Comments Section */}
                                <div className="pl-0 md:pl-16 mt-8 space-y-6">
                                    {post.comments.length > 0 && (
                                        <div className="space-y-4 pt-4">
                                            {post.comments.map((comment, cIndex) => (
                                                <div key={cIndex} className="flex gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900 mb-1">
                                                            @{comment.user?.username || 'anonymous'}
                                                        </p>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {comment.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Comment Input */}
                                    <div className="flex gap-3 pt-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-gray-200 rounded-full pl-4 pr-12 h-9 text-sm focus:bg-white focus:border-brand-primary transition-all outline-none"
                                                placeholder="Write a reply..."
                                                value={commentInputs[post._id] || ''}
                                                onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleComment(post._id);
                                                }}
                                            />
                                            <button
                                                onClick={() => handleComment(post._id)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary hover:text-indigo-700 p-1"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="text-center py-20 px-6 saas-card bg-gray-50/50 border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-white rounded-[32px] border border-gray-100 flex items-center justify-center mx-auto mb-8 shadow-soft">
                                    <MessageSquare className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight">The Feed is Quiet</h3>
                                <p className="text-gray-400 text-sm max-w-sm mx-auto uppercase tracking-widest font-bold leading-relaxed">Be the first to share an insight and spark the community discussion.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Community;
