const { Sequelize } = require("sequelize");
const envConfig = require("../config/envconfig");

const sequelize = new Sequelize(
  envConfig.dbName,
  envConfig.dbUser,
  envConfig.dbPassword,
  {
    host: envConfig.dbHost,
    port: envConfig.dbPort,
    dialect: "mysql",

    charset: "utf8mb4",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL Connected via Sequelize...");
  })
  .catch((err) => {
    console.error("MySQL not Connected...");
    console.error(err);
  });

module.exports = sequelize;
