// configuration de MySQL et de Sequelize
module.exports = {
  HOST: "localhost",
  USER: "dev",
  PASSWORD: "PR47yxKqpC",
  DB: "groupomania",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};