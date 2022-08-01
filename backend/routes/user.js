//Toutes les routes sont enregistrées sur un routeur express
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

//On définit le chemin des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;