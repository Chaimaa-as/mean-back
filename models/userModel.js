// La méthode Schema de Mongoose permet de créer un schéma de données pour MongoDB.
const mongoose = require("mongoose");

// Importation du package mongoose-unique-validator : améliore les messages d'erreur lors de l'enregistrement de données uniques.
const uniqueValidator = require("mongoose-unique-validator");

//Création schéma de données user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Utiliser l'élément mongoose-unique-validator passé comme plug-in pour s'assurer que deux utilisateurs ne puissent partager la même adresse e-mail
userSchema.plugin(uniqueValidator);

// Exporter pour que le modèle soit disponible pour notre application Express.
module.exports = mongoose.model("User", userSchema);
