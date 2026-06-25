const KelasModel = require('../models/kelas.model');
const AppError = require('../errors/AppError');
const { sendSuccess } = require('../utils/response');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await KelasModel.findAll();
    sendSuccess(res, 200, 'Data kelas berhasil diambil', rows);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await KelasModel.findById(req.params.id);
    if (!rows.length) return next(new AppError('Kelas tidak ditemukan', 404));
    sendSuccess(res, 200, 'Data kelas berhasil diambil', rows[0]);
  } catch (err) { next(err); }
};

exports.getSiswaByKelas = async (req, res, next) => {
  try {
    const [kelas] = await KelasModel.findById(req.params.id);
    if (!kelas.length) return next(new AppError('Kelas tidak ditemukan', 404));
    const [siswa] = await KelasModel.findSiswaByKelas(req.params.id);
    sendSuccess(res, 200, 'Data siswa berhasil diambil', { kelas: kelas[0], siswa });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { nama_kelas, tingkat, jurusan, wali_kelas_id, tahun_ajaran, kapasitas } = req.body;
    if (!nama_kelas || !tingkat || !tahun_ajaran) return next(new AppError('nama_kelas, tingkat, tahun_ajaran wajib diisi', 400));

    const [result] = await KelasModel.create({ nama_kelas, tingkat, jurusan, wali_kelas_id, tahun_ajaran, kapasitas: kapasitas || 30 });
    sendSuccess(res, 201, 'Kelas berhasil dibuat', { id: result.insertId });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const [rows] = await KelasModel.findById(req.params.id);
    if (!rows.length) return next(new AppError('Kelas tidak ditemukan', 404));
    await KelasModel.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Kelas berhasil diperbarui');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const [rows] = await KelasModel.findById(req.params.id);
    if (!rows.length) return next(new AppError('Kelas tidak ditemukan', 404));
    await KelasModel.delete(req.params.id);
    sendSuccess(res, 200, 'Kelas berhasil dihapus');
  } catch (err) { next(err); }
};
