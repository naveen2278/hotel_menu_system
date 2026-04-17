function authMiddleware(req, res, next) {
  const adminHeader = req.headers['x-admin-auth'];

  if (adminHeader === 'true') {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized admin access' });
  }
}

module.exports = authMiddleware;