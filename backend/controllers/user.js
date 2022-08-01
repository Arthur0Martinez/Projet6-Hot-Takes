const User = require('../models/user');
const jwt = require('jsonwebtoken');
//Va permettre d'appeler une fonction de hashage
const bcrypt = require('bcrypt');

//Fonction qui permet d'enregister un nouveau utilisateur
exports.signup = (req, res, next) => {
    bcrypt
      //Salage du mot de passe 10 fois pour la sécurité
      //On ne garde aucune trace du mdp initial, seul le transformé est enregisté
      .hash(req.body.password, 10)
      //On enregistre le nouvel utilisateur dans la base de données
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user
          .save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  };

  //Fonction qui va vérifier si l'utilisateur est présent dans la base de données et si c'est le cas de l'authentifier
  exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
          }
          //On compare le mdp et sa version hashé
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                  }
                  res.status(200).json({
                      userId: user._id,
                      //Création d'un token si l'authentification a réussi
                      //Attribution d'un token secret qui expire au bout de 24h
                      token: jwt.sign(
                          { userId: user._id },
                          'kANBoWabMRL6zKR$lKwB=n1dK6pt&wZYki&TqrZD3WONwlMnhE@@O^0zEETt%gqfk3ssHW',
                          { expiresIn: '24h' }
                      )
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};