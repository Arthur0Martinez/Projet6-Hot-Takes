const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/sauces');

router.get('/', auth, stuffCtrl.getAllStuff);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.post('/', auth, multer, stuffCtrl.createThing);
router.post('/:id/like', auth, stuffCtrl.statusOfLikesAndDislikes)
router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;