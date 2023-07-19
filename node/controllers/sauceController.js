const Sauce = require('../models/sauceModel'); 

// pour spprimer un fichier (fs unlink)
const fs = require('fs');

exports.getSauces = (req, res, next) => {
    Sauce.find() // demande à BDD
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json ({error}))
}

exports.createSauces = (req, res, next) => {
    const sauceObj=JSON.parse(req.body.sauce);
    delete req.body._id;
    const sauce = new Sauce({
        ...sauceObj,
        // Img et textes doivent être traités différemment, appelées via leur url
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes:0,
        dislikes:0
      });
      console.log(sauce);
    
      sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // demande à BDD
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json ({error}))
}

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
}

exports.manageLike = (req, res) => {
    //on recupere la sauce sur laquelle modifier les likes
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            console.log(sauce)
            //l'utilisateur like la sauce : si si la valeur de like est +1 on ajoute l'id du user connecté dans le tableau des likes
            if(req.body.like==1){
                // condition pour que la suppression soit associé à l'id
                sauce.usersLiked.push(req.auth.userId);
            }

            //l'utilisateur dislike la sauce : si la valeur de like est -1 on ajoute l'id du user connecté dans le tableau des dislikes
            else if(req.body.like==-1){
                sauce.usersDisliked.push(req.auth.userId);
            }

            

            //si la valeur de like est 0 on supprime l'id du user connecté des deux tableaux
            else if(req.body.like==0){
                //Annulation du like : supprimer le like de l'id du user connectéd du tableau des likes.
                if (sauce.usersLiked.includes(req.body.userId)) {
                    const userLikedIndex = sauce.usersLiked.indexOf(req.body.userId);
                    sauce.usersLiked.splice(userLikedIndex, 1)
                }

                if (sauce.usersDisliked.includes(req.body.userId)) {
                    const usersDislikedIndex = sauce.usersDisliked.indexOf(req.body.userId);
                    sauce.usersDisliked.splice(usersDislikedIndex, 1)
                }
            }

            //on met a jour les compteurs de like et dislikes en comptant le nb d'element dans chacun des tableau
            sauce.likes=sauce.usersLiked.length;
            sauce.dislikes=sauce.usersDisliked.length;
            
            //on met a jour l'objet dans la base avec les champs qu'on a modifié
            Sauce.updateOne({ _id: req.params.id}, sauce)
            .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
            .catch(error => res.status(401).json({ error }));
            
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error });
    });
}