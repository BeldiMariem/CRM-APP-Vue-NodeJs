const router = require('express').Router();

router.use('/auth',require('./public/auth.router.js'));
router.use('/role',require('./public/role.router.js'));
router.use('/user',require('./public/user.router'));
router.use('/activity',require('./public/activity.router'));
router.use('/contact',require('./public/contact.router'));
router.use('/deal',require('./public/deal.router'));

// Telling the file api.public.router.js to export the function router
module.exports = router