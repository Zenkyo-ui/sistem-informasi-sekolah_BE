const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const AppError = require('../errors/AppError');
const { sendSuccess } = require('../utils/response');
const { paginateMeta } = require('../utils/pagination');

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const [rows] = await UserModel.findAll(parseInt(limit), parseInt(offset));
    const [[{ total }]] = await UserModel.count();
    sendSuccess(res, 200, 'Data user berhasil diambil', {
      users: rows,
      pagination: paginateMeta(total, page, limit),
    });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await UserModel.findById(req.params.id);
    if (!rows.length) return next(new AppError('User tidak ditemukan', 404));
    sendSuccess(res, 200, 'Data user berhasil diambil', rows[0]);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { nama, email, password, role } = req.body;
    if (!nama || !email || !password) return next(new AppError('nama, email, password wajib diisi', 400));

    const [existing] = await UserModel.findByEmail(email);
    if (existing.length) return next(new AppError('Email sudah terdaftar', 400));

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await UserModel.create({ nama, email, password: hashed, role: role || 'guru' });
    sendSuccess(res, 201, 'User berhasil dibuat', { id: result.insertId, nama, email, role });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { nama, email, role, is_active } = req.body;
    const [rows] = await UserModel.findById(req.params.id);
    if (!rows.length) return next(new AppError('User tidak ditemukan', 404));

    await UserModel.update(req.params.id, { nama, email, role, is_active });
    sendSuccess(res, 200, 'User berhasil diperbarui');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const [rows] = await UserModel.findById(req.params.id);
    if (!rows.length) return next(new AppError('User tidak ditemukan', 404));
    await UserModel.delete(req.params.id);
    sendSuccess(res, 200, 'User berhasil dihapus');
  } catch (err) { next(err); }
};