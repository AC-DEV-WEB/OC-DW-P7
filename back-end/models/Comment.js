// modèle de données pour les commentaires
module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("Comment", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    // postId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false
    // },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    comments: {
      type: Sequelize.STRING,
      allowNull: false
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: '0',
      allowNull: false
    },
    dislikes: {
      type: Sequelize.INTEGER,
      defaultValue: '0',
      allowNull: false
    },
    usersLiked: {
      type: Sequelize.STRING,
      defaultValue: '[]',
      allowNull: false
    },
    usersDisliked: {
      type: Sequelize.STRING,
      defaultValue: '[]',
      allowNull: false
    }
  });

  return Comment;
};