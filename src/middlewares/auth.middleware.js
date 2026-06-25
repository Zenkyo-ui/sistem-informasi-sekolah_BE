const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');
const db = require('../config/db');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(new AppError('Anda belum login. Silakan login terlebih dahulu.', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query('SELECT id, nama, email, role, is_active FROM users WHERE id = ?', [decoded.id]);
    if (!rows.length) return next(new AppError('User tidak ditemukan.', 401));
    if (!rows[0].is_active) return next(new AppError('Akun Anda dinonaktifkan.', 403));

    req.user = rows[0];
    next();
  } catch (err) {
    return next(new AppError('Token tidak valid atau sudah kadaluarsa.', 401));
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('Anda tidak memiliki izin untuk akses ini.', 403));
  }
  next();
};

module.exports = { protect, restrictTo };