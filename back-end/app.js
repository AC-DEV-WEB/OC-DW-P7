// package express
const express = require('express');

// package body-parser
const bodyParser = require('body-parser');

// package express-sanitizer
const expressSanitizer = require('express-sanitizer');

// accès aux répertoires
const path = require('path');

// déclaration de la route pour l'authentification
const userRoutes = require('./routes/user');

// déclaration de la route pour le profil utilisateur
const profileRoutes = require('./routes/profile');

// on créé l'appilcation express
const app = express();

// on initialise Sequelize
const db = require("./models");

// on synchronise les modèles
db.sequelize.sync();

// middleware qui permet l'accès à toutes les origines d'accéder à l'API (CORS) 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// middleware qui traîte les données du coprs de la requête en objet JavaScript utilisable
app.use(bodyParser.json());

// middleware qui filtre les chaînes de caractères pour empêcher l’exécution de code JavaScript (XSS)
app.use(expressSanitizer());

// middleware qui définit le chemin static du répertoire des images 
app.use('/images', express.static(path.join(__dirname, 'images')));

// middleware qui définit la route pour l'authentification
app.use('/api/auth', userRoutes);

// middleware qui définit la route pour le profil utilisateur
app.use('/api/profile', profileRoutes);

// on exporte express
module.exports = app;