const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const AppError = require('../errors/AppError');
const { sendSuccess } = require('../utils/response');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Email dan password wajib diisi', 400));

    const [rows] = await UserModel.findByEmail(email);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password)))
      return next(new AppError('Email atau password salah', 401));

    const user = rows[0];
    if (!user.is_active) return next(new AppError('Akun Anda dinonaktifkan', 403));

    const token = signToken(user.id, user.role);
    sendSuccess(res, 200, 'Login berhasil', {
      token,
      user: { id: user.id, nama: user.nama, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const [rows] = await UserModel.findById(req.user.id);
    sendSuccess(res, 200, 'Data user berhasil diambil', rows[0]);
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { password_lama, password_baru } = req.body;
    const [rows] = await UserModel.findByEmail(req.user.email);
    if (!await bcrypt.compare(password_lama, rows[0].password))
      return next(new AppError('Password lama salah', 400));

    const hashed = await bcrypt.hash(password_baru, 10);
    await UserModel.update(req.user.id, { password: hashed });
    sendSuccess(res, 200, 'Password berhasil diubah');
  } catch (err) { next(err); }
};