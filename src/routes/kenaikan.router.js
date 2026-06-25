const router = require('express').Router();
const kenaikanCtrl = require('../controllers/kenaikan.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect, restrictTo('admin'));
router.get('/', kenaikanCtrl.getAll);
router.get('/:id', kenaikanCtrl.getOne);
router.post('/', kenaikanCtrl.proses);
router.patch('/:id', kenaikanCtrl.update);
router.delete('/:id', kenaikanCtrl.remove);

module.exports = router;