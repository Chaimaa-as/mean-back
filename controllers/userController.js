// Permet de "hasher" les mots de passe (bcrypt est un package de cryptage installé avec npm).
const bcrypt = require('bcrypt');

// Nous utilisons notre modèle Mongoose pour vérifier l'e-mail
const User = require('../models/userModel');

// Permet de générer des tokens d'authentification chiffrés qui peuvent être utilisés pour l'autorisation.
const jwt = require('jsonwebtoken');

// Authentification_Pour créer un nouvel utilisateur dans la base de données USER.
exports.signup = (req, res, next) => {
    console.log (req.body);
    // nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. 
    bcrypt.hash(req.body.password, 10)
    // La méthode  hash()  de bcrypt crée un hash crypté des mots de passe de vos utilisateurs pour les enregistrer de manière sécurisée dans la base de données.
    .then((hashPassword) => {
        // nous créons un utilisateur et l'enregistrons dans la base de données
        const newUser = new User({
            email:req.body.email,
            password: hashPassword
        });
    newUser.save() 
    .then(() => res.status(201).json({message: " utilisateur créé !"}))
    .catch((error) => res.status(500).json ({error}))
    })
    .catch((error) => res.status(500).json ({error}))
}


// Authentification_Pour connecter un utilisateur 
exports.login = (req, res, next) => {
    // Rechercher si l'utilisateur est enregistré dans la base de données USER en utilisant la méthode findOne() dans notre modèle
    // find a User by email: findOne({ where: { email: ... } })
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Paire identifiant et mot de passe incorrecte' });
        }
        // Utiliser la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la BDD. 
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // S'ils ne correspondent pas, nous renvoyons une erreur401 Unauthorized avec le même message que lorsque l’utilisateur n’a pas été trouvé, 
            if (!valid) {
                return res.status(401).json({ error: 'Paire identifiant et mot de passe incorrecte !' });
            } 
            // S'ils correspondent, nous renvoyons l'ID de l'utilisateur et un token.
            res.status(200).json({
                userId: user._id,
                // Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
                token: jwt.sign( 
                // Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).
                { userId: user._id },
                // Nous renvoyons le token au front-end avec notre réponse.
                process.env.TOKEN, 
                //Nous définissons la durée de validité du token à 24 heures. 
                { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};