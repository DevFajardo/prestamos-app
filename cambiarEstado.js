const { connection } = require("./connection.js");
const { Notification } = require("electron");

const showNotificacion = (title, body) => {
  new Notification({ title, body }).show();
};

const cambiarEstado = (periodo, cedula) => {
  const sql =
    "UPDATE `tabla_clientes` SET `estado` = 1 WHERE `periodo` = ? AND `cedula_cliente` = ? AND `estado` = 0";

  const values = [periodo, cedula];

  connection.query(sql, values, (err, result) => {
    if (err instanceof Error) {
      showNotificacion("Error ❌", "ERROR");
      return;
    }
  });
};

module.exports = {
  cambiarEstado,
};
