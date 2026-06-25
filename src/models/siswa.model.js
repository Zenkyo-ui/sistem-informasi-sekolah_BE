const db = require('../config/db');

const SiswaModel = {
  findAll: (limit, offset, search = '') => {
    const like = `%${search}%`;
    return db.query(`
      SELECT s.*, k.nama_kelas, k.tingkat, u.email
      FROM siswa s
      LEFT JOIN kelas k ON s.kelas_id = k.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.nama_lengkap LIKE ? OR s.nis LIKE ? OR s.nisn LIKE ?
      ORDER BY s.nama_lengkap
      LIMIT ? OFFSET ?
    `, [like, like, like, limit, offset]);
  },

  count: (search = '') => {
    const like = `%${search}%`;
    return db.query(
      'SELECT COUNT(*) as total FROM siswa WHERE nama_lengkap LIKE ? OR nis LIKE ? OR nisn LIKE ?',
      [like, like, like]
    );
  },

  findById: (id) =>
    db.query(`
      SELECT s.*, k.nama_kelas, k.tingkat, k.tahun_ajaran, u.email
      FROM siswa s
      LEFT JOIN kelas k ON s.kelas_id = k.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [id]),

  findByNis: (nis) =>
    db.query('SELECT * FROM siswa WHERE nis = ?', [nis]),

  create: (data) =>
    db.query(`
      INSERT INTO siswa (user_id, nis, nisn, kelas_id, nama_lengkap, jenis_kelamin,
        tempat_lahir, tanggal_lahir, alamat, no_telepon, nama_orang_tua, no_telepon_orang_tua)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [data.user_id, data.nis, data.nisn, data.kelas_id, data.nama_lengkap, data.jenis_kelamin,
        data.tempat_lahir, data.tanggal_lahir, data.alamat, data.no_telepon,
        data.nama_orang_tua, data.no_telepon_orang_tua]),

  update: (id, fields) => {
    const keys = Object.keys(fields);
    const sql = `UPDATE siswa SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
    return db.query(sql, [...Object.values(fields), id]);
  },

  delete: (id) =>
    db.query('DELETE FROM siswa WHERE id = ?', [id]),
};

module.exports = SiswaModel;