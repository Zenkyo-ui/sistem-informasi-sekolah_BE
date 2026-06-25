const db = require('../src/config/db');

module.exports = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS jurnal_mengajar (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      guru_id INT UNSIGNED NOT NULL,
      kelas_id INT UNSIGNED NOT NULL,
      tanggal DATE NOT NULL,
      mata_pelajaran VARCHAR(100) NOT NULL,
      materi TEXT NOT NULL,
      ringkasan TEXT DEFAULT NULL,
      jam_mulai TIME DEFAULT NULL,
      jam_selesai TIME DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (guru_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ Tabel jurnal_mengajar dibuat');
};