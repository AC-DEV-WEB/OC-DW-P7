// package express
const express = require('express');

// création d'un routeur
const router = express.Router();

// contrôleur pour associer la route user
const userCtrl = require('../controllers/user');

// routes de l'API pour les utilisateurs
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

// on exporte le router d'authentification des utilisateurs
module.exports = router;