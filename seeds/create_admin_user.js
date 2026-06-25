const bcrypt = require('bcryptjs');
const db = require('../src/config/db');

module.exports = async () => {
  const hash = await bcrypt.hash('admin123', 10);
  const [r] = await db.query(
    `INSERT IGNORE INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)`,
    ['Super Admin', 'admin@sekolah.ac.id', hash, 'admin']
  );
  if (r.affectedRows) console.log('✅ Admin: admin@sekolah.ac.id / admin123');
  else console.log('ℹ️  Admin sudah ada');
};