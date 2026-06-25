const db = require('../src/config/db');

module.exports = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS siswa (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      nis VARCHAR(20) NOT NULL UNIQUE,
      nisn VARCHAR(20) DEFAULT NULL UNIQUE,
      kelas_id INT UNSIGNED DEFAULT NULL,
      nama_lengkap VARCHAR(100) NOT NULL,
      jenis_kelamin ENUM('L','P') NOT NULL,
      tempat_lahir VARCHAR(50) DEFAULT NULL,
      tanggal_lahir DATE DEFAULT NULL,
      alamat TEXT DEFAULT NULL,
      no_telepon VARCHAR(15) DEFAULT NULL,
      nama_orang_tua VARCHAR(100) DEFAULT NULL,
      no_telepon_orang_tua VARCHAR(15) DEFAULT NULL,
      status ENUM('aktif','tidak_aktif','lulus','pindah') NOT NULL DEFAULT 'aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ Tabel siswa dibuat');
};