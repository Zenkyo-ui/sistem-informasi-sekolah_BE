const db = require('../config/db');
const AppError = require('../errors/AppError');
const { sendSuccess } = require('../utils/response');

// GET /api/kenaikan-kelas?tahun_ajaran=
exports.getAll = async (req, res, next) => {
  try {
    const { tahun_ajaran } = req.query;
    const params = [];
    let where = 'WHERE 1=1';
    if (tahun_ajaran) { where += ' AND kk.tahun_ajaran = ?'; params.push(tahun_ajaran); }

    const [rows] = await db.query(`
      SELECT kk.*,
        s.nis, s.nisn, s.nama_lengkap,
        k1.nama_kelas as kelas_asal,
        k2.nama_kelas as kelas_tujuan,
        u.nama as diproses_oleh_nama
      FROM kenaikan_kelas kk
      JOIN siswa s ON kk.siswa_id = s.id
      JOIN kelas k1 ON kk.kelas_asal_id = k1.id
      LEFT JOIN kelas k2 ON kk.kelas_tujuan_id = k2.id
      JOIN users u ON kk.diproses_oleh = u.id
      ${where}
      ORDER BY kk.created_at DESC
    `, params);

    sendSuccess(res, 200, 'Data kenaikan kelas berhasil diambil', rows);
  } catch (err) { next(err); }
};

// GET /api/kenaikan-kelas/:id
exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT kk.*,
        s.nis, s.nisn, s.nama_lengkap,
        k1.nama_kelas as kelas_asal,
        k2.nama_kelas as kelas_tujuan,
        u.nama as diproses_oleh_nama
      FROM kenaikan_kelas kk
      JOIN siswa s ON kk.siswa_id = s.id
      JOIN kelas k1 ON kk.kelas_asal_id = k1.id
      LEFT JOIN kelas k2 ON kk.kelas_tujuan_id = k2.id
      JOIN users u ON kk.diproses_oleh = u.id
      WHERE kk.id = ?
    `, [req.params.id]);
    if (!rows.length) return next(new AppError('Data tidak ditemukan', 404));
    sendSuccess(res, 200, 'Data kenaikan kelas berhasil diambil', rows[0]);
  } catch (err) { next(err); }
};

// POST /api/kenaikan-kelas
exports.proses = async (req, res, next) => {
  try {
    const { siswa_id, kelas_asal_id, kelas_tujuan_id, tahun_ajaran, status, catatan } = req.body;
    if (!siswa_id || !kelas_asal_id || !tahun_ajaran || !status)
      return next(new AppError('siswa_id, kelas_asal_id, tahun_ajaran, status wajib diisi', 400));

    const validStatus = ['naik', 'tinggal', 'lulus'];
    if (!validStatus.includes(status))
      return next(new AppError('Status harus: naik, tinggal, atau lulus', 400));

    if (status === 'naik' && !kelas_tujuan_id)
      return next(new AppError('kelas_tujuan_id wajib diisi jika status naik', 400));

    const conn = await db.getConnection();
    await conn.beginTransaction();
    try {
      const [result] = await conn.query(`
        INSERT INTO kenaikan_kelas
          (siswa_id, kelas_asal_id, kelas_tujuan_id, tahun_ajaran, status, catatan, diproses_oleh)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [siswa_id, kelas_asal_id, kelas_tujuan_id || null, tahun_ajaran, status, catatan || null, req.user.id]);

      if (status === 'naik' && kelas_tujuan_id) {
        await conn.query(
          'UPDATE siswa SET kelas_id = ? WHERE id = ?',
          [kelas_tujuan_id, siswa_id]
        );
      } else if (status === 'lulus') {
        await conn.query(
          "UPDATE siswa SET status = 'lulus', kelas_id = NULL WHERE id = ?",
          [siswa_id]
        );
      } else if (status === 'tinggal') {
        // Siswa tetap di kelas yang sama, tidak ada perubahan kelas
        await conn.query(
          'UPDATE siswa SET kelas_id = ? WHERE id = ?',
          [kelas_asal_id, siswa_id]
        );
      }

      await conn.commit();
      sendSuccess(res, 201, 'Proses kenaikan kelas berhasil', { id: result.insertId });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (err) { next(err); }
};

// PATCH /api/kenaikan-kelas/:id
exports.update = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM kenaikan_kelas WHERE id = ?', [req.params.id]);
    if (!rows.length) return next(new AppError('Data tidak ditemukan', 404));

    const { kelas_tujuan_id, status, catatan } = req.body;
    await db.query(
      'UPDATE kenaikan_kelas SET kelas_tujuan_id = ?, status = ?, catatan = ? WHERE id = ?',
      [kelas_tujuan_id || null, status, catatan || null, req.params.id]
    );
    sendSuccess(res, 200, 'Data kenaikan kelas berhasil diperbarui');
  } catch (err) { next(err); }
};

// DELETE /api/kenaikan-kelas/:id
exports.remove = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM kenaikan_kelas WHERE id = ?', [req.params.id]);
    if (!rows.length) return next(new AppError('Data tidak ditemukan', 404));

    await db.query('DELETE FROM kenaikan_kelas WHERE id = ?', [req.params.id]);
    sendSuccess(res, 200, 'Data kenaikan kelas berhasil dihapus');
  } catch (err) { next(err); }
};