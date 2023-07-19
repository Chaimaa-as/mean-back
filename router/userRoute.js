// Importer package Express 
const express = require('express');

// Importer le module "router" de Express
const router = express.Router();

// Créer chemin user et sauce dans dossier controllers
const userController = require('../controllers/userController');

// Définir les chemins qui serviront pour le/les router
const passwordValidator = require('../middleware/password-validator');

// Définir les router Sign-in et Login en méthode POST
router.post('/signup', passwordValidator, userController.signup);
router.post('/login', userController.login);

// Export pour pouvoir l'utiliser (en l'appelant dans les fichiers souhaités)
module.exports = router;