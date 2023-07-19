// Appel du plugin multer
const multer = require('multer');

// Définition des types de MIMES acceptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Destination du stockage des images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // création d'un nom de fochier image unique et remplacement par des "_"
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Export de l'élément multer entièrement configuré (destination de stockage + images acceptées).
module.exports = multer({storage: storage}).single('image');