const bcrypt = require('bcryptjs');
const db = require('../config/db');
const SiswaModel = require('../models/siswa.model');
const AppError = require('../errors/AppError');
const { sendSuccess } = require('../utils/response');
const { paginateMeta } = require('../utils/pagination');

// GET /api/siswa?page=&limit=&search=
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    const [rows] = await SiswaModel.findAll(parseInt(limit), parseInt(offset), search);
    const [[{ total }]] = await SiswaModel.count(search);
    sendSuccess(res, 200, 'Data siswa berhasil diambil', {
      siswa: rows,
      pagination: paginateMeta(total, page, limit),
    });
  } catch (err) { next(err); }
};

// GET /api/siswa/:id
exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await SiswaModel.findById(req.params.id);
    if (!rows.length) return next(new AppError('Siswa tidak ditemukan', 404));
    sendSuccess(res, 200, 'Data siswa berhasil diambil', rows[0]);
  } catch (err) { next(err); }
};

// POST /api/siswa
exports.create = async (req, res, next) => {
  try {
    const {
      nis, nisn, kelas_id, nama_lengkap, jenis_kelamin,
      tempat_lahir, tanggal_lahir, alamat, no_telepon,
      nama_orang_tua, no_telepon_orang_tua, password
    } = req.body;

    if (!nis || !nama_lengkap || !jenis_kelamin)
      return next(new AppError('nis, nama_lengkap, jenis_kelamin wajib diisi', 400));

    // Cek NIS sudah ada
    const [existing] = await SiswaModel.findByNis(nis);
    if (existing.length) return next(new AppError('NIS sudah terdaftar', 400));

    // Buat user dulu
    const email = `${nis}@siswa.sekolah.ac.id`;
    const hash = await bcrypt.hash(password || 'siswa123', 10);
    const [userResult] = await db.query(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      [nama_lengkap, email, hash, 'siswa']
    );

    // Buat data siswa
    const [siswaResult] = await SiswaModel.create({
      user_id: userResult.insertId,
      nis, nisn, kelas_id, nama_lengkap, jenis_kelamin,
      tempat_lahir, tanggal_lahir, alamat, no_telepon,
      nama_orang_tua, no_telepon_orang_tua
    });

    sendSuccess(res, 201, 'Siswa berhasil ditambahkan', {
      id: siswaResult.insertId,
      nis,
      nama_lengkap,
      email,
    });
  } catch (err) { next(err); }
};

// PATCH /api/siswa/:id
exports.update = async (req, res, next) => {
  try {
    const [rows] = await SiswaModel.findById(req.params.id);
    if (!rows.length) return next(new AppError('Siswa tidak ditemukan', 404));

    const {
      kelas_id, nama_lengkap, jenis_kelamin,
      tempat_lahir, tanggal_lahir, alamat, no_telepon,
      nama_orang_tua, no_telepon_orang_tua, status
    } = req.body;

    await SiswaModel.update(req.params.id, {
      kelas_id, nama_lengkap, jenis_kelamin,
      tempat_lahir, tanggal_lahir, alamat, no_telepon,
      nama_orang_tua, no_telepon_orang_tua, status
    });

    sendSuccess(res, 200, 'Data siswa berhasil diperbarui');
  } catch (err) { next(err); }
};

// DELETE /api/siswa/:id
exports.remove = async (req, res, next) => {
  try {
    const [rows] = await SiswaModel.findById(req.params.id);
    if (!rows.length) return next(new AppError('Siswa tidak ditemukan', 404));

    await SiswaModel.delete(req.params.id);
    sendSuccess(res, 200, 'Siswa berhasil dihapus');
  } catch (err) { next(err); }
};