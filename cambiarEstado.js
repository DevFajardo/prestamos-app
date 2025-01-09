const { connection } = require("./connection.js");
const { Notification } = require("electron");

const showNotificacion = (title, body) => {
  new Notification({ title, body }).show();
};

const cambiarEstado = (periodo, libranza, accion) => {
  const sql =
    accion == 1
      ? "UPDATE `tabla_clientes` SET `estado` = 1 WHERE `periodo` = ? AND `codigo_libranza` = ? AND `estado` = 0"
      : "UPDATE `tabla_clientes` SET `estado` = 0 WHERE `periodo` = ? AND `codigo_libranza` = ? AND `estado` = 1";

  const values = [periodo, libranza];

  connection.query(sql, values, (err, result) => {
    if (err instanceof Error) {
      console.log("error: " + err);
      showNotificacion("Error ❌", "ERROR");
      return;
    }
  });
};

module.exports = {
  cambiarEstado,
};
