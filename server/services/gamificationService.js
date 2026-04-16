const User = require('../models/UserModel');

/**
 * Service to handle all gamification logic including XP, levels, streaks, and badges.
 */
class GamificationService {
    /**
     * Award XP to a user and check for level ups.
     * @param {string} userId 
     * @param {number} amount 
     * @param {string} reason 
     */
    static async awardXP(userId, amount, reason) {
        try {
            const user = await User.findById(userId);
            if (!user) return null;

            user.xp += amount;
            user.totalPoints += amount;

            // Check for level up
            // Formula: Next Level XP = Level * 500
            let leveledUp = false;
            while (user.xp >= user.level * 500) {
                user.xp -= user.level * 500;
                user.level += 1;
                leveledUp = true;
            }

            await user.save();
            return { xpGained: amount, newXP: user.xp, level: user.level, leveledUp, reason };
        } catch (err) {
            console.error('awardXP Error:', err);
            throw err;
        }
    }

    /**
     * Update user streak based on activity date.
     * @param {string} userId 
     */
    static async updateStreak(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) return null;

            const today = new Date().toISOString().split('T')[0];
            const lastActive = user.lastActiveDate;

            if (lastActive === today) {
                // Already active today, no change
                return { streak: user.streak, updated: false };
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastActive === yesterdayStr) {
                // Consecutive day
                user.streak += 1;
            } else {
                // Streak broken
                user.streak = 1;
            }

            user.lastActiveDate = today;
            await user.save();
            return { streak: user.streak, updated: true };
        } catch (err) {
            console.error('updateStreak Error:', err);
            throw err;
        }
    }

    /**
     * Award a badge to a user if they don't already have it.
     * @param {string} userId 
     * @param {string} badgeName 
     * @param {string} badgeIcon 
     */
    static async awardBadge(userId, badgeName, badgeIcon) {
        try {
            const user = await User.findById(userId);
            if (!user) return null;

            const alreadyHas = user.badges.find(b => b.name === badgeName);
            if (alreadyHas) return { awarded: false, badge: alreadyHas };

            const newBadge = { name: badgeName, icon: badgeIcon, unlockedAt: new Date() };
            user.badges.push(newBadge);
            await user.save();

            return { awarded: true, badge: newBadge };
        } catch (err) {
            console.error('awardBadge Error:', err);
            throw err;
        }
    }
}

module.exports = GamificationService;
