// modèle de données pour les posts
module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("Post", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING
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

  return Post;
};