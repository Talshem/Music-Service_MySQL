const { Router } = require('express');

const router = Router();

router.use('/search', require('./search'));
router.use('/songs', require('./song'));
router.use('/albums', require('./album'));
router.use('/artists', require('./artist'));
router.use('/playlists', require('./playlist'));
router.use('/users', require('./user'));
router.use('/preferences', require('./preference'));
router.use('/songinplaylist', require('./songinplaylist'));

module.exports = router;