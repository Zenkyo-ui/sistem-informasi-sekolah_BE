const router = require('express').Router();
const kelasCtrl = require('../controllers/kelas.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect);
router.get('/', kelasCtrl.getAll);
router.get('/:id', kelasCtrl.getOne);
router.get('/:id/siswa', kelasCtrl.getSiswaByKelas);
router.post('/', restrictTo('admin'), kelasCtrl.create);
router.patch('/:id', restrictTo('admin'), kelasCtrl.update);
router.delete('/:id', restrictTo('admin'), kelasCtrl.remove);

module.exports = router;