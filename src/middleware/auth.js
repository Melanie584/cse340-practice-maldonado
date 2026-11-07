
/**
 * Check if a user is logged in.
 */
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        return next();
    }

    res.redirect('/login');
};

/**
 * Check if the logged-in user has the required role.
 */
const requireRole = (roleId) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }

        if (req.session.user.role_id !== roleId) {
            return res.status(403).send('Access denied');
        }

        next();
    };
};

export { requireLogin, requireRole };
