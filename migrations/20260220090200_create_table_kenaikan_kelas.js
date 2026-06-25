const db = require('../src/config/db');

module.exports = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS kenaikan_kelas (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      siswa_id INT UNSIGNED NOT NULL,
      kelas_asal_id INT UNSIGNED NOT NULL,
      kelas_tujuan_id INT UNSIGNED DEFAULT NULL,
      tahun_ajaran VARCHAR(10) NOT NULL,
      status ENUM('naik','tinggal','lulus') NOT NULL,
      catatan TEXT DEFAULT NULL,
      diproses_oleh INT UNSIGNED NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
      FOREIGN KEY (kelas_asal_id) REFERENCES kelas(id),
      FOREIGN KEY (kelas_tujuan_id) REFERENCES kelas(id) ON DELETE SET NULL,
      FOREIGN KEY (diproses_oleh) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ Tabel kenaikan_kelas dibuat');
};