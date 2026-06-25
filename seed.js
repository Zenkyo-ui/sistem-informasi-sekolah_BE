require('dotenv').config();

const seedAdmin = require('./seeds/create_admin_user');
const seedKelas = require('./seeds/SeedKelas');
const seedSiswa = require('./seeds/SeedSiswa');

(async () => {
  try {
    console.log('🌱 Menjalankan seeder...');
    await seedAdmin();
    await seedKelas();
    await seedSiswa();
    console.log('✅ Semua seeder selesai');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder gagal:', err);
    process.exit(1);
  }
})();