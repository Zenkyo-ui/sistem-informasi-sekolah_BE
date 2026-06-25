const db = require('../src/config/db');

module.exports = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS absensi (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      siswa_id INT UNSIGNED NOT NULL,
      kelas_id INT UNSIGNED NOT NULL,
      guru_id INT UNSIGNED NOT NULL,
      tanggal DATE NOT NULL,
      status ENUM('hadir','sakit','izin','alpha') NOT NULL DEFAULT 'hadir',
      keterangan TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
      FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE,
      FOREIGN KEY (guru_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_absensi (siswa_id, tanggal)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ Tabel absensi dibuat');
};