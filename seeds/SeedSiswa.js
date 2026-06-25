const bcrypt = require('bcryptjs');
const db = require('../src/config/db');

module.exports = async () => {
  const [kelas] = await db.query('SELECT id FROM kelas WHERE nama_kelas = "7A" LIMIT 1');
  if (!kelas.length) return console.log('⚠️  Jalankan SeedKelas dulu');

  const kelasId = kelas[0].id;
  const siswaData = [
    { nama: 'Budi Santoso', nis: '2526001', nisn: '0012345001', jk: 'L' },
    { nama: 'Siti Aminah', nis: '2526002', nisn: '0012345002', jk: 'P' },
    { nama: 'Ahmad Fauzi', nis: '2526003', nisn: '0012345003', jk: 'L' },
  ];

  const hash = await bcrypt.hash('siswa123', 10);
  for (const s of siswaData) {
    const email = `${s.nis}@siswa.sekolah.ac.id`;
    const [u] = await db.query(
      `INSERT IGNORE INTO users (nama, email, password, role) VALUES (?, ?, ?, 'siswa')`,
      [s.nama, email, hash]
    );
    if (u.insertId) {
      await db.query(
        `INSERT IGNORE INTO siswa (user_id, nis, nisn, kelas_id, nama_lengkap, jenis_kelamin) VALUES (?, ?, ?, ?, ?, ?)`,
        [u.insertId, s.nis, s.nisn, kelasId, s.nama, s.jk]
      );
    }
  }
  console.log(`✅ ${siswaData.length} siswa di-seed`);
};