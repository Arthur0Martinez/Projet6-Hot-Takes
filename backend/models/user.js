const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Création d'un schéma avec les champs de connexion
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Permet de s'assurer que le mail ne peux être enregistré qu'une seule fois
userSchema.plugin(uniqueValidator);

//On exporte le schéma en tant que modèle Mongoose
module.exports = mongoose.model('User', userSchema);