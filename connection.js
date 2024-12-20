// Get the client
const mysql = require("mysql2");
// Create the connection to database
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
