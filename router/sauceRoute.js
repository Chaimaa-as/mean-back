// Importer package Express 
const express = require('express');

// Importer le module "router" de Express
const router = express.Router();

// Définir les chemins sauces / autorisation / et Multer qui serviront pour le/les router
const auth = require('../middleware/auth');
// multer permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('../middleware/multer-config');
const sauceController = require('../controllers/sauceController');

// Définir les router avec CRUD en indiquant les chemins et les droits associés (Create/post Read/get Update/put Delete/delete) 
router.get('/', auth, sauceController.getSauces);
router.post('/', auth, multer, sauceController.createSauces);
router.post('/:id/like', auth, sauceController.manageLike);
router.get('/:id', auth, sauceController.getOneSauce);
router.put('/:id', auth, multer, sauceController.updateSauce);
router.delete('/:id', auth, sauceController.deleteSauce);

// Exporter pour pouvoir l'utiliser (en l'appelant dans les fichiers souhaités)
module.exports = router;