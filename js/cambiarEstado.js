const { connection } = require("./connection.js");
const { Notification } = require("electron");

//funcion para mostrar notificacion
const showNotificacion = (title, body) => {
  new Notification({ title, body }).show();
};

//funcion para cambiar el estado de pago de las cuotas mensuales por medio del periodo para saber cual periodo pago, libranza para verificar que usuario pago y accion para saber si va a confirmar el pago o revertirlo
const cambiarEstado = async (periodo, libranza, accion) => {
  //sql para cambiar estado con un ternario para validar si se desea confirmar o revertir el pago
  const sql =
    accion == 1
      ? "UPDATE `tabla_clientes` SET `estado` = 1 WHERE `periodo` = ? AND `codigo_libranza` = ? AND `estado` = 0"
      : "UPDATE `tabla_clientes` SET `estado` = 0 WHERE `periodo` = ? AND `codigo_libranza` = ? AND `estado` = 1";

  //valores para la consulta
  const values = [periodo, libranza];

  //ejecutamos la peticion
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
