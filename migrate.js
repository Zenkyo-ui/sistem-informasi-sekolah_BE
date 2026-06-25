require('dotenv').config();

const m1 = require('./migrations/20260220080610_create_users_table');
const m2 = require('./migrations/20260220084734_create_table_kelas');
const m3 = require('./migrations/20260220084740_create_table_siswa');
const m4 = require('./migrations/20260220090000_create_table_absensi');
const m5 = require('./migrations/20260220090100_create_table_jurnal');
const m6 = require('./migrations/20260220090200_create_table_kenaikan_kelas');

(async () => {
  try {
    console.log('🔄 Menjalankan migrasi...');
    await m1();
    await m2();
    await m3();
    await m4();
    await m5();
    await m6();
    console.log('✅ Semua migrasi selesai');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migrasi gagal:', err.message);
    process.exit(1);
  }
})();