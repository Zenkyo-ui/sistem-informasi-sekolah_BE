const router = require('express').Router();
const siswaCtrl = require('../controllers/siswa.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect);
router.get('/', siswaCtrl.getAll);
router.get('/:id', siswaCtrl.getOne);
router.post('/', restrictTo('admin'), siswaCtrl.create);
router.patch('/:id', restrictTo('admin'), siswaCtrl.update);
router.delete('/:id', restrictTo('admin'), siswaCtrl.remove);

module.exports = router;