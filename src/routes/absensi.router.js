const router = require('express').Router();
const absensiCtrl = require('../controllers/absensi.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect);
router.get('/', absensiCtrl.getByKelasAndTanggal);
router.get('/rekap', absensiCtrl.rekapSiswa);
router.get('/:id', absensiCtrl.getOne);
router.post('/bulk', restrictTo('admin', 'guru'), absensiCtrl.submitBulk);
router.patch('/:id', restrictTo('admin', 'guru'), absensiCtrl.update);
router.delete('/:id', restrictTo('admin'), absensiCtrl.remove);

module.exports = router;