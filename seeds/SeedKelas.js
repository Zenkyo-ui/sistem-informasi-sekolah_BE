
const db = require('../src/config/db');

module.exports = async () => {
  const data = [
    ['7A', '7', null, '2025/2026', 32],
    ['7B', '7', null, '2025/2026', 32],
    ['8A', '8', null, '2025/2026', 32],
    ['8B', '8', null, '2025/2026', 32],
    ['9A', '9', null, '2025/2026', 32],
    ['10 IPA 1', '10', 'IPA', '2025/2026', 36],
    ['10 IPS 1', '10', 'IPS', '2025/2026', 36],
    ['11 IPA 1', '11', 'IPA', '2025/2026', 36],
    ['11 IPS 1', '11', 'IPS', '2025/2026', 36],
    ['12 IPA 1', '12', 'IPA', '2025/2026', 36],
    ['12 IPS 1', '12', 'IPS', '2025/2026', 36],
  ];
  for (const [nama_kelas, tingkat, jurusan, tahun_ajaran, kapasitas] of data) {
    await db.query(
      `INSERT IGNORE INTO kelas (nama_kelas, tingkat, jurusan, tahun_ajaran, kapasitas) VALUES (?, ?, ?, ?, ?)`,
      [nama_kelas, tingkat, jurusan, tahun_ajaran, kapasitas]
    );
  }
  console.log(`✅ ${data.length} kelas di-seed`);
};