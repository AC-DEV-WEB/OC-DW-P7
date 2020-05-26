// package pour la gestion des tokens
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // on récupère le token dans le header authorization
    const token = req.headers.authorization.split(' ')[1];

    // on décode le token avec la clé secrète
    const decodedToken = jwt.verify(token, 'eyJ1c2VySWQiOjU2LCJpYXQiOjE1OTAxODUwMDYsImV4cCI6MTU5MDI3MTQwNn0');

    // on vérifie si le numéro d'identification de l'utilisateur est différent du coprs de la requête
    if (!decodedToken.userId) return res.status(401).send('Identifiant non valable !');
    req.params.id = decodedToken.userId;
    next();

  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !' });
  }
};