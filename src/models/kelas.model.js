const db = require('../config/db');

const KelasModel = {
  findAll: () =>
    db.query(`
      SELECT k.*, u.nama as nama_wali_kelas,
        (SELECT COUNT(*) FROM siswa s WHERE s.kelas_id = k.id AND s.status = 'aktif') as jumlah_siswa
      FROM kelas k
      LEFT JOIN users u ON k.wali_kelas_id = u.id
      ORDER BY k.tingkat, k.nama_kelas
    `),

  findById: (id) =>
    db.query(`
      SELECT k.*, u.nama as nama_wali_kelas
      FROM kelas k LEFT JOIN users u ON k.wali_kelas_id = u.id
      WHERE k.id = ?
    `, [id]),

  findSiswaByKelas: (id) =>
    db.query(`
      SELECT s.id, s.nis, s.nisn, s.nama_lengkap, s.jenis_kelamin, s.status
      FROM siswa s WHERE s.kelas_id = ? ORDER BY s.nama_lengkap
    `, [id]),

  create: ({ nama_kelas, tingkat, jurusan, wali_kelas_id, tahun_ajaran, kapasitas }) =>
    db.query(
      'INSERT INTO kelas (nama_kelas, tingkat, jurusan, wali_kelas_id, tahun_ajaran, kapasitas) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_kelas, tingkat, jurusan, wali_kelas_id, tahun_ajaran, kapasitas]
    ),

  update: (id, fields) => {
    const keys = Object.keys(fields);
    const sql = `UPDATE kelas SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
    return db.query(sql, [...Object.values(fields), id]);
  },

  delete: (id) =>
    db.query('DELETE FROM kelas WHERE id = ?', [id]),
};

module.exports = KelasModel;