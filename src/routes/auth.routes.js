const router = require('express').Router();
const authCtrl = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/login', authCtrl.login);
router.get('/me', protect, authCtrl.getMe);
router.patch('/change-password', protect, authCtrl.changePassword);

module.exports = router;