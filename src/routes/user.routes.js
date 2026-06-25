const router = require('express').Router();
const userCtrl = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect, restrictTo('admin'));
router.get('/', userCtrl.getAll);
router.get('/:id', userCtrl.getOne);
router.post('/', userCtrl.create);
router.patch('/:id', userCtrl.update);
router.delete('/:id', userCtrl.remove);

module.exports = router;