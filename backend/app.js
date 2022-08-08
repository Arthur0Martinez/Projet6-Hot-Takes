//Définit les différentes extensions et chemins requis pour l'API
const express = require('express');
const helmet = require('helmet')
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const app = express();
const path = require('path');
require("dotenv").config();


app.use(express.json());

//Définit les authorisations d'utilisation de l'API
//On peu accèder à l'API depuis n'importe quel origine
//On ajoute les Headers et les méthodes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Récupère les différentes routes et données images stockées liées à l'API
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

//Utilise l'extension helmet pour une protection supplémentaire
//Enlève la possibilité de savoir quel logiciel a été utilisé pour le serveur
app.use(helmet());

//Application API exportée
module.exports = app;

//Connection à MongoDB, base de données non SQL
mongoose.connect('mongodb+srv://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@cluster0.fe79e.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));