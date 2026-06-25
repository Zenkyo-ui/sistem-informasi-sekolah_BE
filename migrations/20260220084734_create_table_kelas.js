const db = require('../src/config/db');

module.exports = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS kelas (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nama_kelas VARCHAR(50) NOT NULL,
      tingkat ENUM('7','8','9','10','11','12') NOT NULL,
      jurusan VARCHAR(50) DEFAULT NULL,
      wali_kelas_id INT UNSIGNED DEFAULT NULL,
      tahun_ajaran VARCHAR(10) NOT NULL,
      kapasitas INT NOT NULL DEFAULT 30,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (wali_kelas_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ Tabel kelas dibuat');
};