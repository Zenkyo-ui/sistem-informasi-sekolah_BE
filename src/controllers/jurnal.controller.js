const db = require('../config/db');
const AppError = require('../errors/AppError');
const { sendSuccess } = require('../utils/response');
const { paginateMeta } = require('../utils/pagination');

// GET /api/jurnal?page=&limit=&kelas_id=&tanggal=
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, kelas_id, tanggal } = req.query;
    const offset = (page - 1) * limit;

    let where = req.user.role === 'guru' ? 'WHERE j.guru_id = ?' : 'WHERE 1=1';
    const params = req.user.role === 'guru' ? [req.user.id] : [];

    if (kelas_id) { where += ' AND j.kelas_id = ?'; params.push(kelas_id); }
    if (tanggal)  { where += ' AND j.tanggal = ?';  params.push(tanggal); }

    const [rows] = await db.query(`
      SELECT j.*, u.nama as nama_guru, k.nama_kelas
      FROM jurnal_mengajar j
      JOIN users u ON j.guru_id = u.id
      JOIN kelas k ON j.kelas_id = k.id
      ${where}
      ORDER BY j.tanggal DESC, j.jam_mulai DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM jurnal_mengajar j ${where}`,
      params
    );

    sendSuccess(res, 200, 'Data jurnal berhasil diambil', {
      jurnal: rows,
      pagination: paginateMeta(total, page, limit),
    });
  } catch (err) { next(err); }
};

// GET /api/jurnal/:id
exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT j.*, u.nama as nama_guru, k.nama_kelas
      FROM jurnal_mengajar j
      JOIN users u ON j.guru_id = u.id
      JOIN kelas k ON j.kelas_id = k.id
      WHERE j.id = ?
    `, [req.params.id]);
    if (!rows.length) return next(new AppError('Jurnal tidak ditemukan', 404));
    sendSuccess(res, 200, 'Data jurnal berhasil diambil', rows[0]);
  } catch (err) { next(err); }
};

// POST /api/jurnal
exports.create = async (req, res, next) => {
  try {
    const { kelas_id, tanggal, mata_pelajaran, materi, ringkasan, jam_mulai, jam_selesai } = req.body;
    if (!kelas_id || !tanggal || !mata_pelajaran || !materi)
      return next(new AppError('kelas_id, tanggal, mata_pelajaran, materi wajib diisi', 400));

    const [result] = await db.query(`
      INSERT INTO jurnal_mengajar
        (guru_id, kelas_id, tanggal, mata_pelajaran, materi, ringkasan, jam_mulai, jam_selesai)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, kelas_id, tanggal, mata_pelajaran, materi, ringkasan || null, jam_mulai || null, jam_selesai || null]);

    sendSuccess(res, 201, 'Jurnal berhasil dibuat', { id: result.insertId });
  } catch (err) { next(err); }
};

// PATCH /api/jurnal/:id
exports.update = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM jurnal_mengajar WHERE id = ?', [req.params.id]);
    if (!rows.length) return next(new AppError('Jurnal tidak ditemukan', 404));

    if (req.user.role !== 'admin' && rows[0].guru_id !== req.user.id)
      return next(new AppError('Tidak memiliki izin mengubah jurnal ini', 403));

    const { kelas_id, tanggal, mata_pelajaran, materi, ringkasan, jam_mulai, jam_selesai } = req.body;
    await db.query(`
      UPDATE jurnal_mengajar
      SET kelas_id = ?, tanggal = ?, mata_pelajaran = ?,
          materi = ?, ringkasan = ?, jam_mulai = ?, jam_selesai = ?
      WHERE id = ?
    `, [kelas_id, tanggal, mata_pelajaran, materi, ringkasan || null, jam_mulai || null, jam_selesai || null, req.params.id]);

    sendSuccess(res, 200, 'Jurnal berhasil diperbarui');
  } catch (err) { next(err); }
};

// DELETE /api/jurnal/:id
exports.remove = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM jurnal_mengajar WHERE id = ?', [req.params.id]);
    if (!rows.length) return next(new AppError('Jurnal tidak ditemukan', 404));

    if (req.user.role !== 'admin' && rows[0].guru_id !== req.user.id)
      return next(new AppError('Tidak memiliki izin menghapus jurnal ini', 403));

    await db.query('DELETE FROM jurnal_mengajar WHERE id = ?', [req.params.id]);
    sendSuccess(res, 200, 'Jurnal berhasil dihapus');
  } catch (err) { next(err); }
};