module.exports = function (req, res, next) {
    // Check if user exists and has mentor or admin role
    if (!req.user || (req.user.role !== 'mentor' && req.user.role !== 'admin')) {
        return res.status(403).json({ msg: 'Access denied: Mentor privileges required.' });
    }
    next();
};
