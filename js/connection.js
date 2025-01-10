const mysql = require("mysql2");

// creamos la conexion a la base de datos 
const connection = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  database: "prestamosbd",
  port: 3306,
  timezone: 'Z' 
});

module.exports = {
  connection,
};
