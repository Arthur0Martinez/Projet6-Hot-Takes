//Toutes les routes sont enregistrées sur un routeur express
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/sauces');

//On définit le chemin des routes
//CRUD complet
//Middleware authorize appliqué à toutes les routes à protéger
//Middleware multer qui autorise les fichiers entrants
router.post('/', auth, multer, stuffCtrl.createThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/:id/like', auth, stuffCtrl.statusOfLikesAndDislikes)

module.exports = router;