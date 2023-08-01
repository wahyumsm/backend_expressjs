// Corrected Database.js
import Sequelize from "sequelize";

const db = new Sequelize("pegawai_auth", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
