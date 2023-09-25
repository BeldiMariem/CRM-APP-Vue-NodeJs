const router = require('express').Router();

router.use('/v1',require('./api.public.router'));
router.use('/v1/secure',require('./api.secrue.router'));
router.use('/v1/file',require('./api.file.router'));

module.exports = router