// Importer package mongoose
const mongoose = require('mongoose');

// Importer package Express 
const express = require('express');
// Créer Express app
const app = express();

// Appeler les routes créées précédemment : userRoute et sauceRoute
const userRoute = require('./router/userRoute');
const sauceRoute = require('./router/sauceRoute');

// dotenv pour cacher éléments sensibles
const dotEnv = require('dotEnv').config('./env');

// Importer package Body-parser
const bodyParser = require('body-parser');

// Importer path pour définir les chemins
const path = require('path');

// Helmet pour protéger les requêtes (entêtes): la solution préconisée pour le middleware Express.js pour protéger son application des vulnérabilités les plus courantes.. 
const helmet = require("helmet");
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Se connecter à la base de données avec id User et mot de passe
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.73rmxkv.mongodb.net/piiquante?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
// Utiliser l'intergiciel express.static pour servir des fichiers statiques, dans le cas présent : les images
app.use('/images', express.static(path.join(__dirname, 'images'))); 
  // Intercepte ttes les requetes qui ont un content type json (idem "bodyParser")
  app.use(express.json()); 
  // rend données exploitables
  app.use(bodyParser.json()); 
  
  
// CORS MIDDLEWARES : Ajouter "CORS Headers" pour définir qui peut accéder à l'API 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Cross-Origin-Resource-Policy','same-site')
  next();
});

// SECURITE
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(limiter);
app.use(xss());


// GESTION DES ROUTES PRINCIPALES DE L'API : AUTH / SAUCES / IMG----------------------------------------------------------
// Appeler les routes créées précédemment : userRoute et sauceRoute
app.use('/api/auth', userRoute);
app.use('/api/sauces', sauceRoute);

// -----------------------------------------------------------------------------------------------------------------------


// utiliser la méthode get() pour répondre uniquement aux demandes GET à cet endpoint ;
app.get('/api/sauces/:id', (req, res, next) => { 
  Sauce.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

// Exporter pour pouvoir utiliser
module.exports = app;