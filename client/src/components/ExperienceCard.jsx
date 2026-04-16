import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, ChevronRight, Star } from 'lucide-react';

const ExperienceCard = ({ user }) => {
  if (!user) return null;

  const { level = 1, xp = 0, streak = 0, totalPoints = 0 } = user;
  
  // Formula: Next Level XP = level * 500
  const xpNeeded = level * 500;
  const progress = Math.min(100, Math.round((xp / xpNeeded) * 100));

  return (
    <div className="relative overflow-hidden saas-card p-6 bg-gradient-to-br from-white to-indigo-50/30 border border-brand-primary/10 shadow-sm group">
      {/* Decorative background elements */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm border border-brand-primary/5">
              <Star className="w-6 h-6 fill-brand-primary/20" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level {level}</p>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">My Progress</h3>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100 shadow-sm">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span className="text-sm font-bold">{streak} Day Streak</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-gray-500">Total Points</p>
              <p className="text-2xl font-black text-brand-primary tracking-tight">
                {user.totalPoints.toLocaleString()} <span className="text-sm font-bold text-brand-primary/60 ml-0.5">Points</span>
              </p>
            </div>
            <p className="text-sm font-bold text-gray-900 border-b-2 border-brand-primary/20 pb-0.5">
              {xp} / {xpNeeded} <span className="text-gray-400">Points</span>
            </p>
          </div>

          <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-brand-primary via-indigo-500 to-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">
            <span>Beginner</span>
            <span className="text-brand-primary">Next: Level {level + 1}</span>
            <span>Master</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex -space-x-2">
            {(user.badges || []).slice(0, 3).map((badge, idx) => (
              <div key={idx} className="w-8 h-8 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center text-xs shadow-sm" title={badge.name}>
                {badge.icon || '🏆'}
              </div>
            ))}
            {user.badges && user.badges.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">
                +{user.badges.length - 3}
              </div>
            )}
            {(!user.badges || user.badges.length === 0) && (
              <p className="text-xs font-medium text-gray-400 italic">No badges earned yet</p>
            )}
          </div>
          <button className="text-xs font-bold text-brand-primary hover:text-indigo-700 flex items-center gap-0.5 transition-colors group/btn">
            View All Badges <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
