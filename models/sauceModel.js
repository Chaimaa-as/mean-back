// Import du package mongoose pour la BDD
const mongoose = require('mongoose');

// mongoose-unique-validator améliore les messages d'erreur lors de l'enregistrement de données uniques.
const uniqueValidator = require('mongoose-unique-validator'); 
// absent chez exemple
//ATTENTION ommentee pour voir effet ATTENTION


//Création du schéma de données sauce
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name : { type: String, required: true }, 
  manufacturer : { type: String, required: true }, 
  description: { type: String, required: true },
  mainPepper : { type: String, required: true }, 
  imageUrl: { type: String, required: true },
  heat : { type: Number, required: true }, 
  likes : { type: Number, required: true }, 
  dislikes : { type: Number, required: true }, 
  usersLiked : [ String, "<userId>" ],
  usersDisliked : [ String, "<userId>" ]
});

// Exporter pour que le modèle soit disponible pour notre application Express. 
module.exports = mongoose.model('Sauce', sauceSchema);