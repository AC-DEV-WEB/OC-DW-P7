// on importe les modèles de données
const db = require("../models");

// package Sequelize
const Sequelize = require("sequelize");

// système de fichiers
const fs = require('fs');

// on initialise la base de données des utilisateurs
const User = db.User;

// on initialise la base de données des posts
const Post = db.Post;

// on initialise la base de données des commentaires
const Comment = db.Comment;

// création d'un post
exports.createPost = (req, res, next) => {
  // on traîte les données du coprs de la requête en objet JavaScript utilisable 
  let postObject = JSON.parse(req.body.post)

  // on vérife que l'utilisateur qui fait la requête exsite
  User.findOne({ where: { id: postObject.userId } })
  .then(user => {
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé !' });
    }

    if (req.file) {
      postObject = {
        ...postObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    } else {
      postObject = {
        ...postObject,
        imageUrl: ''
      }
    }

    // on sauvegarde le post
    Post.create(postObject)
    .then(() => res.status(201).json({ message: 'Le nouveau post a été enregistré !' }))
    .catch(error => res.status(500).json({ error: 'Erreur lors de l\'enregistrement du post !' }));
  })
  .catch(error => res.status(500).json({ error }));  
}

// récupère tous les posts
exports.getAllPosts = (req, res, next) => {
  // on tri les posts par ordre décroissant et on recupère les commentaires pour insérer dans la réponse
  Post.findAll({ 
    order: Sequelize.literal('createdAt DESC'),
    include: [{
      model: Comment
    }]
  })

  .then(posts => {
    if(posts.length < 0) return res.status(404).json({ error: "Aucun posts trouvés !"});

    res.status(200).json(posts)    
  })
  .catch(error => res.status(400).json({ error }));
};

// récupère les informations d'un post
exports.getOnePost = (req, res, next) => {
  // on recupère les commentaires pour insérer dans la réponse
  Post.findOne({ 
    where: { id: req.params.postId },
    include: [{
      model: Comment
    }]
  })
  .then(post => {
    if(!post) return res.status(404).json({ error: 'Post non trouvé !' });

    res.status(200).json(post);
  })
  .catch(error => res.status(400).json({ error }));
}

// modifie un post
exports.editPost = (req, res, next) => {
  // on traîte les données du coprs de la requête en objet JavaScript utilisable 
  let postObject = JSON.parse(req.body.post);

  // on contrôle s'il y a une nouvelle image
  if (req.file) {
    // on vérife que le post exsite
    Post.findOne({ where: { id: postObject.id } })
    .then(post => {
        // on récupère le nom du fichier image
        const filename = post.imageUrl.split('/images/')[1];
        
        // on supprime l'ancienne image
        fs.unlink(`images/${filename}`, function (error) {
          if (error) throw error;
        });
    })
    .catch(error => res.status(500).json({ error }));

    // on construit l'objet qui sera mis à jour avec la nouvelle image
    postObject = {
      ...postObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
  } else {
    // on construit l'objet qui sera mis à jour
    postObject = {
      ...postObject,
      imageUrl: ''
    }
  }
 
  // on met à jour le post
  Post.update({ id: postObject.id }, { ...postObject, id: postObject.id })
  .then(() => res.status(200).json({ message: 'Le post a été modifié !' }))
  .catch(error => res.status(400).json({ error }));
}

// supprime un post
exports.deletePost = (req, res, next) => {
  // on vérife que le post exsite
  Post.findOne({ where: { id: req.params.postId } })
  .then(post => {
    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé !' });
    }

    // on vérife que l'utilisateur qui fait la requête exsite
    User.findOne({ where: { id: post.userId } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé !' });
      }

      // on vérifie si la requête est envoyé par l'auteur du post ou l'administrateur
      if(user.id !== post.userId) {
        if(!user.isAdmin) return res.status(401).json({ error: 'Accès non autorisé !' });
      }

      // on contrôle s'il y a une image dans le post
      if (post.imageUrl) {
        // on récupère le nom du fichier image depuis la base données
        const filename = post.imageUrl.split('/images/')[1];

        // on supprime l'image
        fs.unlink(`images/${filename}`, function (error) {
          if (error) throw error;
        });
      }

      // on recherche tous les commentaires
      Comment.findAll({ where: { postId: req.params.postId } })
      .then(comments => {
        
        // on vérifie si le post contient des commentaires
        if(comments.length === 0) {         
          // on efface le post s'il n'a pas de commentaires
          Post.destroy({ where: { id: req.params.postId} })
          .then(() => res.status(200).json({ message: 'Post supprimé !' }))
          .catch(error => res.status(400).json({ error }));
        } else {
          // on recherche les commentaires lié au post
          comments.map(comment => {
            // on efface les commentaires du post
            Comment.destroy({ where: { postId: comment.postId }})
            .then(() => { 
              // on efface le post
              Post.destroy({ where: { id: req.params.postId } })
              .then(() => res.status(200).json({ message: 'Post supprimé !' }))
              .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(400).json({ error }));
          })
        }
      })
      .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error })); 
  })
  .catch(error => res.status(500).json({ error }));
}

let updateUsersLiked = [];
let updateUsersDisliked = [];

// like/dislike d'un post
exports.likeOnePost = (req, res, next) => {
  const userId = req.body.userId;
  const postId = req.body.postId;
  const like = req.body.like;

  Post.findOne({ where: { id: postId } })
  .then((post) => {
    // on traîte les données de la valeur usersLiked en objet JavaScript utilisable    
    updateUsersLiked = JSON.parse(post.usersLiked);

    // on traîte les données de la valeur usersDisliked en objet JavaScript utilisable    
    updateUsersDisliked = JSON.parse(post.usersDisliked);

    // on vérifie si l'utilisateur a déjà noté le post
    if (like === 0) {
      // on retire le like
      if (updateUsersLiked.find(user => user === userId)) {
        // on retire l'user ID de usersLiked
        const newArray = updateUsersLiked.filter(user => !userId);
        
        // on soustrait 1 au likes
        let updateLikes = post.likes-1;

        Post.update({ 
            likes: updateLikes,
            usersLiked: JSON.stringify(newArray)
          },
          { where: { id: postId } 
        })

        .then(() => res.status(201).json({ message: 'L\'utilisateur à retiré son like !' }))
        .catch(error => res.status(400).json({ error }));
      }

      // on retire le dislike
      if (updateUsersDisliked.find(user => user === userId)) {
        // on retire l'user ID de usersDisliked
        const newArray = updateUsersDisliked.filter(user => !userId);

        // on soustrait 1 au dislikes
        let updateDislikes = post.dislikes-1;

        Post.update({ 
            dislikes: updateDislikes,
            usersDisliked: JSON.stringify(newArray)
          },
          { where: { id: postId } 
        })

        .then(() => res.status(201).json({ message: 'L\'utilisateur à retirer son dislike !' }))
        .catch(error => res.status(400).json({ error }));
      }
    // on vérifie si l'utilisateur like le post
    } else if (like === 1) {
      // on ajoute l'user ID à usersLiked
      updateUsersLiked.push(userId);

      // on ajoute 1 au likes
      let updateLikes = post.likes+1;

      Post.update({ 
          likes: updateLikes,
          usersLiked: JSON.stringify(updateUsersLiked)
        },
        { where: { id: postId } 
      })

      .then(() => res.status(201).json({ message: 'L\'utilisateur à aimé le post !' }))
      .catch(error => res.status(400).json({ error }));

    // on vérifie si l'utilisateur dislike le post
    } else if (like === -1) {      
      // on ajoute l'user ID à usersDisliked
      updateUsersDisliked.push(userId);

      // on ajoute 1 au dislikes
      let updateDislikes = post.dislikes+1;

      Post.update({ 
          dislikes: updateDislikes,
          usersDisliked: JSON.stringify(updateUsersDisliked)
        },
        { where: { id: postId } 
      })

      .then(() => res.status(201).json({ message: 'L\'utilisateur n\'a pas aimé le post !' }))
      .catch(error => res.status(400).json({ error }));
    }
  })

  .catch(error => res.status(500).json({ error }));
};