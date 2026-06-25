const db = require('../config/db');
const AppError = require('../errors/AppError');
const { sendSuccess } = require('../utils/response');

// GET /api/absensi?kelas_id=&tanggal=
exports.getByKelasAndTanggal = async (req, res, next) => {
  try {
    const { kelas_id, tanggal } = req.query;
    if (!kelas_id || !tanggal)
      return next(new AppError('kelas_id dan tanggal wajib diisi', 400));

    const [rows] = await db.query(`
      SELECT s.id as siswa_id, s.nis, s.nisn, s.nama_lengkap, s.jenis_kelamin,
        a.id as absensi_id, a.status, a.keterangan
      FROM siswa s
      LEFT JOIN absensi a ON a.siswa_id = s.id AND a.tanggal = ?
      WHERE s.kelas_id = ? AND s.status = 'aktif'
      ORDER BY s.nama_lengkap
    `, [tanggal, kelas_id]);

    sendSuccess(res, 200, 'Data absensi berhasil diambil', rows);
  } catch (err) { next(err); }
};

// POST /api/absensi/bulk
exports.submitBulk = async (req, res, next) => {
  try {
    const { kelas_id, tanggal, absensi } = req.body;
    if (!kelas_id || !tanggal || !Array.isArray(absensi))
      return next(new AppError('kelas_id, tanggal, dan array absensi wajib diisi', 400));

    const conn = await db.getConnection();
    await conn.beginTransaction();
    try {
      for (const item of absensi) {
        await conn.query(`
          INSERT INTO absensi (siswa_id, kelas_id, guru_id, tanggal, status, keterangan)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            status = VALUES(status),
            keterangan = VALUES(keterangan),
            guru_id = VALUES(guru_id)
        `, [item.siswa_id, kelas_id, req.user.id, tanggal, item.status, item.keterangan || null]);
      }
      await conn.commit();
      sendSuccess(res, 200, `${absensi.length} data absensi berhasil disimpan`);
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (err) { next(err); }
};

// GET /api/absensi/rekap?siswa_id=&bulan=&tahun=
exports.rekapSiswa = async (req, res, next) => {
  try {
    const { siswa_id, bulan, tahun } = req.query;
    if (!siswa_id || !bulan || !tahun)
      return next(new AppError('siswa_id, bulan, dan tahun wajib diisi', 400));

    const [[rekap]] = await db.query(`
      SELECT
        COUNT(*) as total_hari,
        SUM(status = 'hadir') as hadir,
        SUM(status = 'sakit') as sakit,
        SUM(status = 'izin') as izin,
        SUM(status = 'alpha') as alpha
      FROM absensi
      WHERE siswa_id = ?
        AND MONTH(tanggal) = ?
        AND YEAR(tanggal) = ?
    `, [siswa_id, bulan, tahun]);

    sendSuccess(res, 200, 'Rekap absensi berhasil diambil', rekap);
  } catch (err) { next(err); }
};

// GET /api/absensi/:id
exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, s.nama_lengkap, s.nis, k.nama_kelas, u.nama as nama_guru
      FROM absensi a
      JOIN siswa s ON a.siswa_id = s.id
      JOIN kelas k ON a.kelas_id = k.id
      JOIN users u ON a.guru_id = u.id
      WHERE a.id = ?
    `, [req.params.id]);
    if (!rows.length) return next(new AppError('Data absensi tidak ditemukan', 404));
    sendSuccess(res, 200, 'Data absensi berhasil diambil', rows[0]);
  } catch (err) { next(err); }
};

// PATCH /api/absensi/:id
exports.update = async (req, res, next) => {
  try {
    const { status, keterangan } = req.body;
    if (!status) return next(new AppError('Status wajib diisi', 400));

    const [rows] = await db.query('SELECT * FROM absensi WHERE id = ?', [req.params.id]);
    if (!rows.length) return next(new AppError('Data absensi tidak ditemukan', 404));

    await db.query(
      'UPDATE absensi SET status = ?, keterangan = ? WHERE id = ?',
      [status, keterangan || null, req.params.id]
    );
    sendSuccess(res, 200, 'Absensi berhasil diperbarui');
  } catch (err) { next(err); }
};

// DELETE /api/absensi/:id
exports.remove = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM absensi WHERE id = ?', [req.params.id]);
    if (!rows.length) return next(new AppError('Data absensi tidak ditemukan', 404));

    await db.query('DELETE FROM absensi WHERE id = ?', [req.params.id]);
    sendSuccess(res, 200, 'Absensi berhasil dihapus');
  } catch (err) { next(err); }
};