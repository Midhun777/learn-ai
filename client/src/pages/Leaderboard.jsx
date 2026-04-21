import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Trophy, Medal, Map, ArrowUp, Activity, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Avatar from '../components/Avatar';

const Leaderboard = () => {
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/gamification/leaderboard');
                setLeaderboard(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <LoadingScreen />;

    // Find current user's rank
    const myRank = leaderboard.findIndex(u => u._id === currentUser?.id) + 1;

    return (
        <div className="min-h-screen bg-ui-bg p-6 lg:p-12 animate-fade-in relative">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-brand-primary mb-2">
                            <Trophy className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">Global Ranking</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            Top Learners
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium max-w-md">
                            The most active learners on SkillRoute. Complete lessons and projects to climb the ranks.
                        </p>
                    </div>

                    {myRank > 0 && (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-primary/10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg">
                                #{myRank}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Current Rank</p>
                                <p className="text-sm font-bold text-gray-900">{currentUser?.name}</p>
                            </div>
                        </div>
                    )}
                </header>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rank</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Learner</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Level</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Streak</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {leaderboard.map((user, index) => {
                                    const rank = index + 1;
                                    const isMe = user._id === currentUser?.id;

                                    return (
                                        <motion.tr 
                                            key={user._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => navigate(`/profile/${user.username}`)}
                                            className={`${isMe ? 'bg-brand-primary/[0.03]' : 'hover:bg-gray-50/30'} transition-colors cursor-pointer group`}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center">
                                                    {rank === 1 && <Trophy className="w-6 h-6 text-yellow-500" />}
                                                    {rank === 2 && <Medal className="w-6 h-6 text-gray-400" />}
                                                    {rank === 3 && <Medal className="w-6 h-6 text-orange-400" />}
                                                    {rank > 3 && <span className="text-lg font-bold text-gray-300 group-hover:text-gray-400 transition-colors">#{rank}</span>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar user={user} size="10" />
                                                    <div>
                                                        <p className={`font-bold text-base leading-tight ${isMe ? 'text-brand-primary' : 'text-gray-900'}`}>
                                                            {user.name}
                                                            {isMe && <span className="ml-2 text-[10px] bg-brand-primary text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">You</span>}
                                                        </p>
                                                        <p className="text-xs text-gray-400 font-medium">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200">
                                                    Lvl {user.level}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="inline-flex items-center gap-1.5 text-orange-600 font-bold">
                                                    <Activity className="w-4 h-4" />
                                                    {user.streak}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-gray-900 font-black tracking-tight">{user.xp.toLocaleString()} Points</span>
                                                    <div className="w-24 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                                        <div 
                                                            className="h-full bg-brand-primary" 
                                                            style={{ width: `${Math.min(100, (user.xp / (user.level * 500)) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="bg-gray-100/50 rounded-full px-6 py-2 border border-gray-200 flex items-center gap-3 text-xs font-medium text-gray-500">
                        <Activity className="w-3 h-3" />
                        Showing top 20 learners in the global community
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
