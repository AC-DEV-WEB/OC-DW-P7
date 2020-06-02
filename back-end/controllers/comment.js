// on importe les modèles de données
const db = require("../models");

// on initialise la base de données des utilisateurs
const User = db.User;

// on initialise la base de données des commentaires
const Comment = db.Comment;

// création d'un commentaire
exports.createComment = (req, res, next) => {
  // on sauvegarde le commentaire
  Comment.create({ ...req.body.comment })
  .then(() => res.status(201).json({ message: 'Le nouveau commentaire a été enregistré !' }))
  .catch(error => res.status(500).json({ error: 'Erreur lors de l\'enregistrement du commentaire !' }));
}

// récupère tous les commentaires
exports.getAllComments = (req, res, next) => {
  Comment.findAll()
  .then(comments => {
    if(comments.length < 0) return res.status(404).json({ error: "Aucun commentaires trouvés !"});

    res.status(200).json(comments)
  })

  .catch(error => res.status(400).json({ error }));
}

// récupère les informations d'un commentaire
exports.getOneComment = (req, res, next) => {
  // on vérife que le commentaire exsite
  Comment.findOne({ where: { id: req.params.commentId } })
  .then(comment => {
    if(!comment) return res.status(404).json({ error: 'Commentaire non trouvé !' });

    res.status(200).json(comment);
  })
  .catch(error => res.status(400).json({ error }));
}

// modifie un commentaire
exports.editComment = (req, res, next) => {
  // on vérife que le commentaire exsite
  Comment.findOne({ where: { id: req.params.commentId } })
  .then(comment => {
    if(!comment) return res.status(404).json({ error: 'Commentaire non trouvé !' });

    // on met à jour le commentaire
    Comment.update({ id: req.params.commentId }, { ...req.body, id: req.params.commentId })
    .then(() => res.status(200).json({ message: 'Le commentaire a été modifié !' }))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
}

// supprime un commentaire
exports.deleteComment = (req, res, next) => {
  // on vérife que le commentaire exsite
  Comment.findOne({ where: { id: req.params.commentId } })
  .then(comment => {
    if (!comment) {
      return res.status(404).json({ error: 'Commentaire non trouvé !' });
    }

    // on vérife que l'utilisateur qui fait la requête exsite
    User.findOne({ where: { id: comment.userId } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé !' });
      }

      // on vérifie si la requête est envoyé par l'auteur du commentaire ou l'administrateur
      if(user.id !== comment.userId) {
        if(!user.isAdmin) return res.status(401).json({ error: 'Accès non autorisé !' });
      }
    })
    .catch(error => res.status(500).json({ error })); 

    // on efface le commentaire
    Comment.destroy({ where: { id: req.params.commentId } })
    .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error })); 
}

let updateUsersLiked = [];
let updateUsersDisliked = [];

// like/dislike d'un commentaire
exports.likeOneComment = (req, res, next) => {
  const userId = req.body.userId;
  const commentId = req.body.commentId;
  const like = req.body.like;

  Comment.findOne({ where: { id: commentId } })
  .then((comment) => {
    // on traîte les données de la valeur usersLiked en objet JavaScript utilisable    
    updateUsersLiked = JSON.parse(comment.usersLiked);

    // on traîte les données de la valeur usersDisliked en objet JavaScript utilisable    
    updateUsersDisliked = JSON.parse(comment.usersDisliked);

    // on vérifie si l'utilisateur a déjà noté le commentaire
    if (like === 0) {
      // on retire le like
      if (updateUsersLiked.find(user => user === userId)) {
        // on retire l'user ID de usersLiked
        const newArray = updateUsersLiked.filter(user => !userId);
        
        // on soustrait 1 au likes
        let updateLikes = comment.likes-1;

        Comment.update({ 
            likes: updateLikes,
            usersLiked: JSON.stringify(newArray)
          },
          { where: { id: commentId } 
        })

        .then(() => res.status(201).json({ message: 'L\'utilisateur à retiré son like !' }))
        .catch(error => res.status(400).json({ error }));
      }

      // on retire le dislike
      if (updateUsersDisliked.find(user => user === userId)) {
        // on retire l'user ID de usersDisliked
        const newArray = updateUsersDisliked.filter(user => !userId);

        // on soustrait 1 au dislikes
        let updateDislikes = comment.dislikes-1;

        Comment.update({ 
            dislikes: updateDislikes,
            usersDisliked: JSON.stringify(newArray)
          },
          { where: { id: commentId } 
        })

        .then(() => res.status(201).json({ message: 'L\'utilisateur à retirer son dislike !' }))
        .catch(error => res.status(400).json({ error }));
      }
    // on vérifie si l'utilisateur like le commentaire
    } else if (like === 1) {
      // on ajoute l'user ID à usersLiked
      updateUsersLiked.push(userId);

      // on ajoute 1 au likes
      let updateLikes = comment.likes+1;

      Comment.update({ 
          likes: updateLikes,
          usersLiked: JSON.stringify(updateUsersLiked)
        },
        { where: { id: commentId } 
      })

      .then(() => res.status(201).json({ message: 'L\'utilisateur à aimé le commentaire !' }))
      .catch(error => res.status(400).json({ error }));

    // on vérifie si l'utilisateur dislike le commentaire
    } else if (like === -1) {      
      // on ajoute l'user ID à usersDisliked
      updateUsersDisliked.push(userId);

      // on ajoute 1 au dislikes
      let updateDislikes = comment.dislikes+1;

      Comment.update({ 
          dislikes: updateDislikes,
          usersDisliked: JSON.stringify(updateUsersDisliked)
        },
        { where: { id: commentId } 
      })

      .then(() => res.status(201).json({ message: 'L\'utilisateur n\'a pas aimé le commentaire !' }))
      .catch(error => res.status(400).json({ error }));
    }
  })

  .catch(error => res.status(500).json({ error }));
};