const router = require('express').Router();
const jurnalCtrl = require('../controllers/jurnal.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect);
router.get('/', jurnalCtrl.getAll);
router.get('/:id', jurnalCtrl.getOne);
router.post('/', restrictTo('admin', 'guru'), jurnalCtrl.create);
router.patch('/:id', restrictTo('admin', 'guru'), jurnalCtrl.update);
router.delete('/:id', restrictTo('admin', 'guru'), jurnalCtrl.remove);

module.exports = router;