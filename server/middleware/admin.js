module.exports = function (req, res, next) {
    // Check if user exists and has admin role
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Administrative privileges required.' });
    }
    next();
};
